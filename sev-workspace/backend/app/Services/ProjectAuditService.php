<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProjectAuditService
{
    public function auditProject(Project $project): Project
    {
        $domain = trim($project->domain['current'] ?? '');

        if (empty($domain)) {
            return $project;
        }

        // Garante que a URL tenha protocolo e sem barra extra no final
        $baseUrl = str_starts_with($domain, 'http') ? rtrim($domain, '/') : "https://" . rtrim($domain, '/');

        $health = $project->health ?? [
            'lighthouse' => ['perf' => 0, 'seo' => 0, 'best' => 0, 'a11y' => 0],
            'tools' => ['ga4' => false, 'gsc' => false, 'sitemap' => false, 'robots' => false],
        ];

        // 1. Checar HTML principal para detectar Google Analytics (GA4 / GTM)
        try {
            $homeResponse = Http::timeout(10)->withHeaders([
                'User-Agent' => 'SevWorkspaceAuditor/1.0'
            ])->get($baseUrl);

            if ($homeResponse->successful()) {
                $html = $homeResponse->body();
                $hasGa4 = str_contains($html, 'googletagmanager.com/gtag/js')
                       || str_contains($html, 'gtag(')
                       || preg_match('/G-[A-Z0-9]{6,12}/', $html)
                       || preg_match('/GTM-[A-Z0-9]{4,10}/', $html);

                $health['tools']['ga4'] = (bool) $hasGa4;
            }
        } catch (\Throwable $e) {
            Log::warning("Falha ao inspecionar HTML de {$baseUrl}: " . $e->getMessage());
        }

        // 2. Checar existência real de robots.txt
        try {
            $robotsRes = Http::timeout(8)->get("{$baseUrl}/robots.txt");
            $contentType = $robotsRes->header('Content-Type');
            $health['tools']['robots'] = $robotsRes->successful() && str_contains(strtolower($contentType), 'text/plain');
        } catch (\Throwable $e) {
            $health['tools']['robots'] = false;
        }

        // 3. Checar existência real de sitemap.xml
        try {
            $sitemapRes = Http::timeout(8)->get("{$baseUrl}/sitemap.xml");
            $body = $sitemapRes->body();
            $health['tools']['sitemap'] = $sitemapRes->successful() && (
                str_contains($body, '<urlset') || str_contains($body, '<sitemapindex')
            );
        } catch (\Throwable $e) {
            $health['tools']['sitemap'] = false;
        }

        // 4. Consultar Google PageSpeed Insights API (Lighthouse Real)
        try {
            $queryParams = [
                'url' => $baseUrl,
                'strategy' => 'desktop', // Pode mudar para 'mobile' se preferir auditar mobile
            ];

            $apiKey = config('services.pagespeed.key') ?: env('PAGESPEED_API_KEY');
            if (!empty($apiKey)) {
                $queryParams['key'] = $apiKey;
            }

            // Monta a query string com múltiplas categorias exigidas pelo Google
            $queryUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?'
                . http_build_query($queryParams)
                . '&category=PERFORMANCE&category=SEO&category=BEST_PRACTICES&category=ACCESSIBILITY';

            $psiRes = Http::timeout(45)->get($queryUrl);

            if ($psiRes->successful()) {
                $categories = $psiRes->json('lighthouseResult.categories');
                if ($categories) {
                    $health['lighthouse'] = [
                        'perf' => (int) round(($categories['performance']['score'] ?? 0) * 100),
                        'seo'  => (int) round(($categories['seo']['score'] ?? 0) * 100),
                        'best' => (int) round(($categories['best-practices']['score'] ?? 0) * 100),
                        'a11y' => (int) round(($categories['accessibility']['score'] ?? 0) * 100),
                    ];
                }
            } else {
                Log::warning("PageSpeed retornou status " . $psiRes->status() . ": " . $psiRes->body());
            }
        } catch (\Throwable $e) {
            Log::warning("Timeout ou falha na API PageSpeed para {$baseUrl}: " . $e->getMessage());
        }

        // Atualiza status visual do card caso falte GA4 ou Sitemap
        $status = $project->status;
        if ($status !== 'dev') {
            $status = ($health['tools']['ga4'] && $health['tools']['sitemap']) ? 'active' : 'warning';
        }

        $project->update([
            'health' => $health,
            'status' => $status,
        ]);

        return $project->fresh();
    }
}
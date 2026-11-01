<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Support\Facades\Http;

class ProjectAuditService
{
    /**
     * Inspeciona automaticamente a página do cliente (robots.txt, sitemap.xml, tag GA4 e Lighthouse)
     */
    public function auditProject(Project $project): Project
    {
        $domain = $project->domain['current'] ?? null;
        if (!$domain) {
            return $project;
        }

        $baseUrl = "https://{$domain}";
        $health = $project->health;

        // 1. Checa existência real do robots.txt e sitemap.xml
        $robotsOk = Http::timeout(8)->get("{$baseUrl}/robots.txt")->successful();
        $sitemapOk = Http::timeout(8)->get("{$baseUrl}/sitemap.xml")->successful();

        // 2. Inspeciona o HTML da Home para detectar se o script do GA4 (gtag.js / G-XXXX) está instalado
        $homeResponse = Http::timeout(10)->get($baseUrl);
        $html = $homeResponse->successful() ? $homeResponse->body() : '';
        $hasGa4Tag = str_contains($html, 'googletagmanager.com/gtag/js') || preg_match('/G-[A-Z0-9]{6,}/', $html) === 1;

        $health['tools'] = [
            'ga4' => $hasGa4Tag,
            'gsc' => $health['tools']['gsc'] ?? false, // Atualizado via API Search Console ou Switch
            'sitemap' => $sitemapOk,
            'robots' => $robotsOk,
        ];

        // 3. Consulta automática da API gratuita do Google PageSpeed Insights (Lighthouse)
        $apiKey = config('services.google.pagespeed_key');
        $psUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={$baseUrl}&category=PERFORMANCE&category=SEO&category=BEST_PRACTICES&category=ACCESSIBILITY" . ($apiKey ? "&key={$apiKey}" : "");

        $psResponse = Http::timeout(25)->get($psUrl);
        if ($psResponse->successful()) {
            $categories = $psResponse->json('lighthouseResult.categories');
            if ($categories) {
                $health['lighthouse'] = [
                    'perf' => (int) round(($categories['performance']['score'] ?? 0) * 100),
                    'seo'  => (int) round(($categories['seo']['score'] ?? 0) * 100),
                    'best' => (int) round(($categories['best-practices']['score'] ?? 0) * 100),
                    'a11y' => (int) round(($categories['accessibility']['score'] ?? 0) * 100),
                ];
            }
        }

        $project->update([
            'health' => $health,
            'status' => (!$hasGa4Tag || !$sitemapOk) ? 'warning' : 'active',
            'last_audited_at' => now(),
        ]);

        return $project;
    }
}
<?php

namespace App\Services;

use App\Models\Project;
use Google\Analytics\Data\V1beta\Client\BetaAnalyticsDataClient;
use Google\Analytics\Data\V1beta\DateRange;
use Google\Analytics\Data\V1beta\Metric;
use Google\Analytics\Data\V1beta\Dimension;
use Google\Analytics\Data\V1beta\RunReportRequest;

class Ga4Service
{
    public function syncProject(Project $project)
    {
        // 1. Procura o ID Numérico da Propriedade na Ficha Técnica do Projeto
        $propertyId = null;
        foreach ($project->dossier as $item) {
            $cat = strtolower($item['category']);
            $label = strtolower($item['label']);
            
            if (str_contains($cat, 'analytics') || str_contains($label, 'ga4')) {
                // Filtra apenas números (Ex: extrai "459182736" de "ID: 459182736")
                preg_match('/[0-9]{8,12}/', $item['value'], $matches);
                if (!empty($matches)) {
                    $propertyId = $matches[0];
                    break;
                }
            }
        }

        if (!$propertyId) {
            throw new \Exception("ID numérico do GA4 não encontrado na ficha técnica. Crie um campo com a categoria 'Analytics'.");
        }

        // 2. Conecta no Google usando o arquivo JSON da Service Account
        $credentialsPath = storage_path('app/google-service-account.json');
        
        $client = new BetaAnalyticsDataClient([
            'credentials' => $credentialsPath
        ]);

        // 3. Pede ao Google os dados dos últimos 30 dias
        $request = (new RunReportRequest())
            ->setProperty('properties/' . $propertyId)
            ->setDateRanges([new DateRange(['start_date' => '30daysAgo', 'end_date' => 'today'])])
            ->setMetrics([
                new Metric(['name' => 'screenPageViews']), // Acessos totais da página
            ])
            ->setDimensions([
                new Dimension(['name' => 'pagePath']) // Qual rota foi acessada
            ]);

        $response = $client->runReport($request);

        // 4. Calcula os acessos e descobre a página mais visitada
        $totalViews = 0;
        $topPage = '/';
        $highestViews = 0;

        foreach ($response->getRows() as $row) {
            $views = (int) $row->getMetricValues()[0]->getValue();
            $path = $row->getDimensionValues()[0]->getValue();
            
            $totalViews += $views;

            if ($views > $highestViews) {
                $highestViews = $views;
                $topPage = $path;
            }
        }

        // 5. Salva no banco de dados
        $summary = $project->analytics_summary;
        $summary['totalClicks'] = $totalViews;
        $summary['topPage'] = $topPage;
        $summary['period'] = 'Últimos 30 dias';
        
        $project->update(['analytics_summary' => $summary]);

        return $project->fresh();
    }
}
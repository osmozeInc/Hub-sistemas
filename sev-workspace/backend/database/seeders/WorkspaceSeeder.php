<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Reminder;

class WorkspaceSeeder extends Seeder
{
    public function run(): void
    {
        Project::create([
            'id' => 'sev-market',
            'title' => 'Sev Market',
            'subtitle' => 'Site Institucional & Ecossistema',
            'category' => 'Institucional',
            'status' => 'active',
            'status_text' => 'Produção · GSC Verificado',
            'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
            'tags' => ['Lighthouse 98%', 'GSC OK', 'GA4 Ativo', 'Domínio Futuro'],
            'domain' => ['current' => 'sevmarket.vercel.app', 'future' => 'sevmarket.com.br', 'dnsProvider' => 'Cloudflare'],
            'palette' => [['name' => 'Void Black', 'hex' => '#06080D'], ['name' => 'Cyber Cyan', 'hex' => '#06B6D4']],
            'dossier' => [
                ['label' => 'Repositório Oficial', 'value' => 'github.com/osmozeInc/site-sev', 'category' => 'Code'],
                ['label' => 'Propriedade GA4 ID', 'value' => 'G-SEV992810', 'category' => 'Analytics']
            ],
            'routes' => [
                ['name' => 'Home Principal', 'path' => '/index.html', 'folder' => 'root', 'status' => 'online', 'note' => 'Otimizada']
            ],
            'health' => [
                'lighthouse' => ['perf' => 98, 'seo' => 100, 'best' => 100, 'a11y' => 95],
                'tools' => ['ga4' => true, 'gsc' => true, 'sitemap' => true, 'robots' => true]
            ],
            'analytics_summary' => ['period' => 'Outubro', 'totalClicks' => 1420, 'whatsappClicks' => 318, 'topPage' => '/orcamento']
        ]);

        Project::create([
            'id' => 'personal-amanda',
            'title' => 'Personal Amanda',
            'subtitle' => 'Site Vitrine + Subpágina de Roupas',
            'category' => 'Vitrine',
            'status' => 'warning',
            'status_text' => 'Online · Implementar GA4',
            'image' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
            'tags' => ['GA4 Pendente', 'Subpágina Roupas', 'CREF Ativo'],
            'domain' => ['current' => 'amandapersonal.com.br', 'future' => 'loja.amandapersonal.com.br', 'dnsProvider' => 'Registro.br'],
            'palette' => [['name' => 'Obsidian', 'hex' => '#09090B'], ['name' => 'Neon Coral', 'hex' => '#F43F5E']],
            'dossier' => [
                ['label' => 'Registro Profissional', 'value' => 'CREF 014829-G/CE', 'category' => 'Documento'],
                ['label' => 'WhatsApp', 'value' => '+55 88 99912-3456', 'category' => 'Contato']
            ],
            'routes' => [
                ['name' => 'Vitrine Principal', 'path' => '/index.html', 'folder' => 'root', 'status' => 'online', 'note' => 'LP Principal']
            ],
            'health' => [
                'lighthouse' => ['perf' => 94, 'seo' => 90, 'best' => 96, 'a11y' => 92],
                'tools' => ['ga4' => false, 'gsc' => true, 'sitemap' => true, 'robots' => true]
            ],
            'analytics_summary' => ['period' => 'Outubro', 'totalClicks' => 890, 'whatsappClicks' => 214, 'topPage' => '/roupas']
        ]);

        Reminder::create([
            'project_id' => 'personal-amanda',
            'project_title' => 'Personal Amanda',
            'title' => 'Implementar tag do Google Analytics (GA4) na LP principal',
            'frequency' => 'Urgente · Único',
            'category' => 'Analytics',
            'completed' => false
        ]);
    }
}
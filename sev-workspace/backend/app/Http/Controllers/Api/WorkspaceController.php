<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Reminder;
use App\Models\Resource;
use App\Services\ProjectAuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WorkspaceController extends Controller
{
    public function bootstrap()
    {
        return response()->json([
            'projects' => Project::orderBy('created_at', 'desc')->get(),
            'reminders' => Reminder::latest()->get(),
            'resources' => Resource::orderBy('id', 'asc')->get(),
        ]);
    }

    public function storeProject(Request $request)
    {
        $title = $request->input('title', 'Novo Projeto');
        $id = $request->input('id') ?: Str::slug($title) . '-' . Str::lower(Str::random(4));

        $project = Project::create([
            'id' => $id,
            'title' => $title,
            'subtitle' => $request->input('subtitle', ''),
            'category' => $request->input('category', 'Vitrine'),
            'status' => $request->input('status', 'Em Produção'),
            'status_text' => $request->input('status_text', $request->input('statusText', 'Em Configuração')),
            'image' => $request->input('image', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80'),
            'tags' => $request->input('tags', []),
            'domain' => $request->input('domain', ['current' => '', 'future' => '', 'dnsProvider' => '']),
            'palette' => $request->input('palette', []),
            'dossier' => $request->input('dossier', []),
            'routes' => $request->input('routes', []),
            'health' => $request->input('health', [
                'lighthouse' => ['perf' => 100, 'seo' => 100, 'best' => 100, 'a11y' => 100],
                'tools' => ['ga4' => false, 'gsc' => false, 'sitemap' => false, 'robots' => false]
            ]),
            'analytics_summary' => $request->input('analytics_summary', $request->input('analyticsSummary', [
                'period' => 'Mês Atual',
                'totalClicks' => 0,
                'whatsappClicks' => 0,
                'topPage' => '/index.html'
            ])),
        ]);

        return response()->json($project, 201);
    }

    public function upsertProject(Request $request, string $id)
    {
        $project = Project::findOrFail($id);
        $data = $request->all();

        if (isset($data['statusText'])) {
            $data['status_text'] = $data['statusText'];
        }
        if (isset($data['analyticsSummary'])) {
            $data['analytics_summary'] = $data['analyticsSummary'];
        }

        $project->update($data);

        return response()->json($project);
    }

    public function destroyProject(string $id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json(['deleted' => true]);
    }

    public function runAudit(string $id, ProjectAuditService $auditService)
    {
        $project = Project::findOrFail($id);
        $updated = $auditService->auditProject($project);

        return response()->json($updated);
    }

    public function storeReminder(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|string',
            'project_title' => 'required|string',
            'title' => 'required|string',
            'frequency' => 'required|string',
            'category' => 'nullable|string',
        ]);

        $reminder = Reminder::create($validated);
        return response()->json($reminder, 201);
    }

    public function toggleReminder(Reminder $reminder)
    {
        $reminder->update(['completed' => !$reminder->completed]);
        return response()->json($reminder);
    }

    public function destroyReminder(Reminder $reminder)
    {
        $reminder->delete();
        return response()->json(['deleted' => true]);
    }

    // CRUD completo de Snippets (Guia Dev) e Referências
    public function storeResource(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:snippet,reference',
            'title' => 'required|string',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'content' => 'required|string',
        ]);

        $resource = Resource::create($validated);
        return response()->json($resource, 201);
    }

    public function updateResource(Request $request, Resource $resource)
    {
        $validated = $request->validate([
            'type' => 'sometimes|string|in:snippet,reference',
            'title' => 'required|string',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'content' => 'required|string',
        ]);

        $resource->update($validated);
        return response()->json($resource);
    }

    public function destroyResource(Resource $resource)
    {
        $resource->delete();
        return response()->json(['deleted' => true]);
    }

    // Gera ou regenera um token público único para enviar ao cliente
    public function generateShareToken(string $id)
    {
        $project = Project::findOrFail($id);
        $domain = is_array($project->domain) ? $project->domain : [];
        
        if (empty($domain['share_token'])) {
            $domain['share_token'] = Str::random(24);
            $project->domain = $domain;
            $project->save();
        }

        return response()->json($project->fresh());
    }

    public function publicClientView(string $token)
    {
        $project = Project::get()->first(function ($p) use ($token) {
            return isset($p->domain['share_token']) && $p->domain['share_token'] === $token;
        });

        if (!$project) {
            return response()->json(['message' => 'Relatório não encontrado'], 404);
        }

        $safeDossier = collect($project->dossier ?? [])->reject(function ($item) {
            $cat = strtolower($item['category'] ?? '');
            $label = strtolower($item['label'] ?? '');
            return str_contains($cat, 'infra')
                || str_contains($cat, 'senha')
                || str_contains($label, 'senha')
                || str_contains($label, 'ssh');
        })->values()->all();

        return response()->json([
            'title' => $project->title,
            'subtitle' => $project->subtitle,
            'category' => $project->category,
            'status' => $project->status,
            'statusText' => $project->status_text,
            'domain' => [
                'current' => $project->domain['current'] ?? '',
                'future' => $project->domain['future'] ?? '',
                'sslActive' => true,
            ],
            'palette' => $project->palette ?? [],
            'dossier' => $safeDossier,
            'routes' => $project->routes ?? [],
            'health' => $project->health ?? [],
            'analyticsSummary' => $project->analytics_summary ?? [],
            'updatedAt' => $project->updated_at?->format('d/m/Y H:i'),
        ]);
    }

    public function syncGa4(string $id, \App\Services\Ga4Service $ga4Service)
    {
        try {
            $project = Project::findOrFail($id);
            $updated = $ga4Service->syncProject($project);
            return response()->json($updated);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
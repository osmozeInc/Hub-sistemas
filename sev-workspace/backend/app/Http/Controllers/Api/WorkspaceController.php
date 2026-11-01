<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Reminder;
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
            'status' => $request->input('status', 'dev'),
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

        // Converte chaves camelCase do React para snake_case do Postgres quando enviadas
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
            'project_id' => 'required|string|exists:projects,id',
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
}
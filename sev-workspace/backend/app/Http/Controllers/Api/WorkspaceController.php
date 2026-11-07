<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Reminder;
use App\Models\Resource;
use App\Models\User;
use App\Services\ProjectAuditService;
use App\Services\Ga4Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class WorkspaceController extends Controller
{
    // Trava de segurança: bloqueia qualquer tentativa de escrita por quem não é 'admin'
    private function ensureAdmin(Request $request)
    {
        if ($request->user()?->role !== 'admin') {
            abort(403, 'Acesso somente leitura. Apenas o administrador pode alterar dados.');
        }
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'E-mail ou senha incorretos.'], 401);
        }

        $token = $user->createToken('sev-workspace-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();
        return response()->json(['logged_out' => true]);
    }

    public function bootstrap(Request $request)
    {
        $isAdmin = $request->user()?->role === 'admin';
        $projects = Project::orderBy('created_at', 'desc')->get();

        // Se for Leitor/Visitante, mascara os valores secretos ANTES de sair do servidor
        if (!$isAdmin) {
            $projects->transform(function ($project) {
                $dossier = collect($project->dossier ?? [])->map(function ($item) {
                    if (!empty($item['is_secret'])) {
                        $item['value'] = '••••••••';
                        $item['masked'] = true;
                    }
                    return $item;
                })->all();

                $infra = collect($project->infrastructure ?? [])->map(function ($srv) {
                    if (!empty($srv['is_secret'])) {
                        $srv['url_or_ip'] = !empty($srv['url_or_ip']) ? '••••••••' : '';
                        $srv['notes'] = '•••••••• [Credencial Oculta]';
                        $srv['masked'] = true;
                    }
                    return $srv;
                })->all();

                $project->dossier = $dossier;
                $project->infrastructure = $infra;
                return $project;
            });
        }

        return response()->json([
            'projects' => $projects,
            'reminders' => Reminder::latest()->get(),
            'resources' => Resource::orderBy('id', 'asc')->get(),
            'users' => $isAdmin ? User::orderBy('id', 'asc')->get(['id', 'name', 'email', 'role', 'created_at']) : [],
        ]);
    }

    public function storeProject(Request $request)
    {
        $this->ensureAdmin($request);

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
            'infrastructure' => $request->input('infrastructure', []),
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
        $this->ensureAdmin($request);

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

    public function destroyProject(Request $request, string $id)
    {
        $this->ensureAdmin($request);

        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json(['deleted' => true]);
    }

    public function runAudit(Request $request, string $id, ProjectAuditService $auditService)
    {
        $this->ensureAdmin($request);

        $project = Project::findOrFail($id);
        $updated = $auditService->auditProject($project);

        return response()->json($updated);
    }

    public function syncGa4(Request $request, string $id, Ga4Service $ga4Service)
    {
        $this->ensureAdmin($request);

        try {
            $project = Project::findOrFail($id);
            $updated = $ga4Service->syncProject($project);
            return response()->json($updated);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function generateShareToken(Request $request, string $id)
    {
        $this->ensureAdmin($request);

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

        // Sintaxe correta: filtra campos marcados como is_secret ou internos
        $safeDossier = collect($project->dossier ?? [])->reject(function ($item) {
            $cat = strtolower($item['category'] ?? '');
            $label = strtolower($item['label'] ?? '');
            return !empty($item['is_secret'])
                || str_contains($cat, 'infra')
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

    public function storeReminder(Request $request)
    {
        $this->ensureAdmin($request);

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

    public function toggleReminder(Request $request, Reminder $reminder)
    {
        $this->ensureAdmin($request);

        $reminder->update(['completed' => !$reminder->completed]);
        return response()->json($reminder);
    }

    public function destroyReminder(Request $request, Reminder $reminder)
    {
        $this->ensureAdmin($request);

        $reminder->delete();
        return response()->json(['deleted' => true]);
    }

    public function storeResource(Request $request)
    {
        $this->ensureAdmin($request);

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
        $this->ensureAdmin($request);

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

    public function destroyResource(Request $request, Resource $resource)
    {
        $this->ensureAdmin($request);

        $resource->delete();
        return response()->json(['deleted' => true]);
    }

    public function storeUser(Request $request)
    {
        $this->ensureAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|string|in:admin,viewer',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json($user->only(['id', 'name', 'email', 'role', 'created_at']), 201);
    }

    public function updateUser(Request $request, User $user)
    {
        $this->ensureAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|string|in:admin,viewer',
            'password' => 'nullable|string|min:6',
        ]);

        // Trava de segurança: impede que o Admin logado tire o próprio cargo de admin
        if ($request->user()->id === $user->id && $validated['role'] !== 'admin') {
            return response()->json(['message' => 'Você não pode remover seu próprio acesso de Administrador.'], 422);
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json($user->only(['id', 'name', 'email', 'role', 'created_at']));
    }

    public function destroyUser(Request $request, User $user)
    {
        $this->ensureAdmin($request);

        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'Você não pode excluir sua própria conta ativa.'], 422);
        }

        $user->tokens()->delete(); // Desconecta imediatamente qualquer sessão ativa desse usuário
        $user->delete();

        return response()->json(['deleted' => true]);
    }
}
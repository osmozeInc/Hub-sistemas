import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles, Bell, BookOpen, Bookmark, FolderGit2, ExternalLink,
  Copy, Check, Globe, ShieldCheck, AlertCircle, Layers,
  ArrowUpRight, Filter, Gauge, FileCode, CalendarClock,
  Terminal, Palette, Search, Plus, CheckCircle2,
  Circle, Send, RotateCcw, Trash2, RefreshCw, Edit3, X, Save, Eye, EyeOff, Menu, Lock, Unlock
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL + 'api/workspace';

// Wrapper que injeta automaticamente o Token de Login em todas as chamadas
const apiFetch = (url, options = {}) => {
  const token = localStorage.getItem('sev_auth_token');
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };
  return fetch(url, { ...options, headers });
};

function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    apiFetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Credenciais inválidas');
        return data;
      })
      .then((data) => {
        localStorage.setItem('sev_auth_token', data.token);
        localStorage.setItem('sev_auth_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950 text-slate-100 p-4 font-sans">
      <TechnoBackground />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md p-6 rounded-2xl backdrop-blur-xl bg-white/[0.04] border border-white/15 shadow-2xl space-y-5"
      >
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs tracking-wider uppercase">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Sev Workspace · Acesso Restrito</span>
        </div>

        <div>
          <h1 className="text-xl font-bold text-white">Entrar no Hub</h1>
          <p className="text-xs text-slate-400 mt-1">
            Use sua credencial de Administrador ou conta de Leitor/Visitante.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sevmarket.com"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
        >
          {loading ? 'Autenticando...' : 'Acessar Workspace'}
        </button>
      </form>
    </div>
  );
}

const INITIAL_PROJECTS = [
  {
    id: 'sev-market',
    title: 'Sev Market',
    subtitle: 'Site Institucional & Ecossistema',
    category: 'Institucional',
    status: 'active',
    statusText: 'Produção · GSC Verificado',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    tags: ['Lighthouse 98%', 'GSC OK', 'GA4 Ativo', 'Domínio Futuro', 'Preloader'],
    domain: {
      current: 'sevmarket.vercel.app',
      future: 'sevmarket.com.br',
      dnsProvider: 'Cloudflare / Vercel DNS',
      sslActive: true
    },
    palette: [
      { name: 'Void Black', hex: '#06080D' },
      { name: 'Cyber Cyan', hex: '#06B6D4' },
      { name: 'Electric Indigo', hex: '#6366F1' }
    ],
    dossier: [
      { label: 'Repositório Oficial', value: 'github.com/osmozeInc/site-sev', category: 'Code' },
      { label: 'Propriedade GA4 ID', value: 'G-SEV992810', category: 'Analytics' }
    ],
    routes: [
      { name: 'Home Principal', path: '/index.html', folder: 'root', status: 'online', note: 'Melhorias de desempenho' },
      { name: 'Fluxo de Orçamento', path: '/orcamento', folder: '/orcamento', status: 'online', note: 'Ícone configurado' }
    ],
    infrastructure: [],
    health: {
      lighthouse: { perf: 98, seo: 100, best: 100, a11y: 95 },
      tools: { ga4: true, gsc: true, sitemap: true, robots: true }
    },
    analyticsSummary: {
      period: 'Outubro',
      totalClicks: 1420,
      whatsappClicks: 318,
      topPage: '/orcamento'
    }
  }
];

const DEFAULT_SNIPPETS = [
  {
    type: 'snippet',
    title: 'Snippet Padrão Google Analytics 4 (GA4 + Evento de Clique)',
    category: 'Analytics',
    description: 'Inserir dentro da tag <head> em todas as páginas e subpáginas do cliente.',
    content: `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`
  },
  {
    type: 'snippet',
    title: 'Template robots.txt Otimizado para GSC',
    category: 'SEO / Indexação',
    description: 'Padrão utilizado no repositório para liberar rastreamento e apontar o sitemap.',
    content: `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://seudominio.com.br/sitemap.xml`
  },
  {
    type: 'snippet',
    title: 'Estrutura Base sitemap.xml (Múltiplas Rotas)',
    category: 'SEO / Indexação',
    description: 'Mapeamento da vitrine principal e subpáginas (/links, /orcamento, /roupas).',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://seudominio.com.br/</loc>
    <lastmod>2026-10-31</lastmod>
    <priority>1.00</priority>
  </url>
</urlset>`
  }
];

const DEFAULT_REFERENCES = [
  {
    type: 'reference',
    title: 'Linear App Design System',
    category: 'UI / Dark Mode',
    description: 'Referência de bordas translúcidas (border-white/10), contraste tipográfico e fundos escuros.',
    content: 'https://linear.app'
  },
  {
    type: 'reference',
    title: 'Vercel Geist Design & Grids',
    category: 'Arquitetura Visual',
    description: 'Uso de malhas técnicas (Dot Matrix / Grid lines) e medidores de performance.',
    content: 'https://vercel.com/geist/introduction'
  },
  {
    type: 'reference',
    title: 'PageSpeed Insights / Lighthouse',
    category: 'Auditoria Técnica',
    description: 'Validador oficial para testar Core Web Vitals antes de entregar a página ao cliente.',
    content: 'https://pagespeed.web.dev/'
  },
  {
    type: 'reference',
    title: 'Google Search Console (GSC)',
    category: 'Indexação & SEO',
    description: 'Painel para submissão de sitemap.xml e inspeção de URLs dos clientes.',
    content: 'https://search.google.com/search-console'
  }
];

const EMPTY_PROJECT_TEMPLATE = {
  id: '',
  title: '',
  subtitle: '',
  category: 'Vitrine',
  status: 'dev',
  statusText: 'Em Produção',
  image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
  tags: ['Novo Projeto'],
  domain: { current: '', future: '', dnsProvider: 'Cloudflare', sslActive: true },
  palette: [{ name: 'Cor Primária', hex: '#06B6D4' }],
  dossier: [{ category: 'Contato', label: 'WhatsApp / E-mail', value: '' }],
  routes: [{ name: 'Página Principal', path: '/index.html', folder: 'root', status: 'online', note: 'Landing Page' }],
  infrastructure: [
    {
      name: 'Hospedagem Principal',
      provider: 'Vercel / Render',
      type: 'Frontend',
      url_or_ip: '',
      cost_status: 'Gratuito',
      notes: ''
    }
  ],
  health: {
    lighthouse: { perf: 100, seo: 100, best: 100, a11y: 100 },
    tools: { ga4: false, gsc: false, sitemap: false, robots: false }
  },
  analyticsSummary: { period: 'Mês Atual', totalClicks: 0, whatsappClicks: 0, topPage: '/index.html' }
};

const getStageMeta = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'active' || s.includes('saud') || s.includes('online') || s.includes('prod')) {
    return { label: status === 'active' ? '100% Saudável' : status, dot: 'bg-emerald-400', badge: 'Online' };
  }
  if (s === 'warning' || s.includes('pend') || s.includes('alerta') || s.includes('revis')) {
    return { label: status === 'warning' ? 'Com Pendência' : status, dot: 'bg-amber-400 animate-pulse', badge: 'Pendência' };
  }
  if (s === 'dev' || s.includes('dev') || s.includes('desenv') || s.includes('homolog')) {
    return { label: status === 'dev' ? 'Em Desenvolvimento' : status, dot: 'bg-indigo-400', badge: 'Em Dev' };
  }
  return { label: status || 'Customizado', dot: 'bg-cyan-400', badge: status || 'Ativo' };
};

const normalizeProject = (p) => ({
  ...p,
  statusText: p.statusText ?? p.status_text ?? 'Ativo',
  analyticsSummary: p.analyticsSummary || p.analytics_summary || {
    period: 'Mês Atual',
    totalClicks: 0,
    whatsappClicks: 0,
    topPage: '/index.html'
  },
  tags: Array.isArray(p.tags) ? p.tags : [],
  palette: Array.isArray(p.palette) ? p.palette : [],
  dossier: Array.isArray(p.dossier) ? p.dossier : [],
  routes: Array.isArray(p.routes) ? p.routes : [],
  infrastructure: Array.isArray(p.infrastructure) ? p.infrastructure : [],
  domain: p.domain || { current: '', future: '', dnsProvider: '' },
  health: p.health || {
    lighthouse: { perf: 0, seo: 0, best: 0, a11y: 0 },
    tools: { ga4: false, gsc: false, sitemap: false, robots: false }
  }
});

const normalizeReminder = (r) => ({
  ...r,
  projectId: r.projectId || r.project_id,
  projectTitle: r.projectTitle || r.project_title
});

function CircularLighthouseGauge({ score, label }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorConfig =
    score >= 90
      ? { stroke: '#10B981', text: 'text-emerald-400', border: 'border-emerald-500/20' }
      : score >= 75
      ? { stroke: '#F59E0B', text: 'text-amber-400', border: 'border-amber-500/20' }
      : { stroke: '#F43F5E', text: 'text-rose-400', border: 'border-rose-500/20' };

  return (
    <div className={`flex flex-col items-center justify-center p-3.5 rounded-2xl bg-black/35 border ${colorConfig.border} transition hover:bg-white/[0.04]`}>
      <div className="relative flex items-center justify-center w-16 h-16">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 68 68">
          <circle cx="34" cy="34" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="transparent" />
          <circle
            cx="34"
            cy="34"
            r={radius}
            stroke={colorConfig.stroke}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className={`absolute text-sm font-bold font-mono ${colorConfig.text}`}>{score}</span>
      </div>
      <span className="mt-2 text-[11px] font-medium text-slate-300 tracking-wide text-center">{label}</span>
    </div>
  );
}

function TechnoBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070b]">
      {/* Malha de Bolinhas (Dot Matrix) */}
      <div 
        className="absolute inset-0 opacity-[0.25]" 
        style={{
          backgroundImage: 'radial-gradient(circle at center, #06B6D4 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      {/* Grid de Linhas Topográficas */}
      <div 
        className="absolute inset-0 opacity-[0.04]" 
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '96px 96px'
        }}
      />
      {/* Globos de Luz Pulsantes (Animação Nativa) */}
      <div className="absolute -top-36 left-[15%] h-[450px] w-[700px] rounded-full bg-cyan-500/15 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute top-1/3 right-[15%] h-[400px] w-[500px] rounded-full bg-indigo-500/15 blur-[130px] mix-blend-screen animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
    </div>
  );
}

// ============================================================================
// COMPONENTE: PAINEL PÚBLICO DE VISÃO DO CLIENTE (MODO APRESENTAÇÃO)
// ============================================================================
function PublicClientPortal({ token }) {
  const [project, setProject] = useState(null);
  const [error, setError] = useState(false);
  const [copiedHex, setCopiedHex] = useState(null);

  useEffect(() => {
    apiFetch(`${API_BASE}/public/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('Link inválido');
        return res.json();
      })
      .then((data) => setProject(data))
      .catch(() => setError(true));
  }, [token]);

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950 text-rose-400 font-mono text-sm p-4 text-center">
        [ LINK DE RELATÓRIO INVÁLIDO OU EXPIRADO ]
      </div>
    );
  }

  if (!project) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950 text-cyan-400 font-mono text-sm p-4 text-center">
        [ CARREGANDO RELATÓRIO TÉCNICO DO CLIENTE... ]
      </div>
    );
  }

  const copyColor = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-y-auto bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <TechnoBackground />

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        <header className="px-5 py-3.5 rounded-2xl backdrop-blur-xl bg-white/[0.04] border border-white/15 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SEV MARKET · RELATÓRIO DO CLIENTE</span>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Ambiente de Transparência & Auditoria Técnica
            </span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Atualizado em: <span className="text-slate-200">{project.updatedAt || 'Tempo real'}</span>
          </div>
        </header>

        <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 text-[11px] font-semibold uppercase rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {project.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2">{project.title}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{project.subtitle}</p>
          </div>
          {project.domain?.current && (
            <a
              href={`https://${project.domain.current}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/35 text-cyan-200 text-xs font-semibold flex items-center gap-2 transition self-start sm:self-center"
            >
              <Globe className="w-4 h-4" />
              <span>Acessar {project.domain.current}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border border-cyan-500/25">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-3">
                Desempenho & Tráfego ({project.analyticsSummary?.period || 'Mês Atual'})
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] uppercase text-slate-400">Acessos Totais</span>
                  <p className="text-2xl font-bold font-mono text-white mt-1">
                    {project.analyticsSummary?.totalClicks || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] uppercase text-slate-400">Cliques WhatsApp</span>
                  <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    {project.analyticsSummary?.whatsappClicks || 0}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-3">
                Página mais visitada: <code className="text-cyan-300 font-mono">{project.analyticsSummary?.topPage || '/'}</code>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
                Páginas & Rotas Ativas
              </h2>
              <div className="space-y-2.5">
                {(project.routes || []).map((rt, i) => (
                  <div key={i} className="p-3 rounded-xl bg-black/35 border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">{rt.name}</p>
                      <span className="text-[11px] font-mono text-indigo-300">{rt.path}</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Online
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Auditoria Google Lighthouse
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <CircularLighthouseGauge score={project.health?.lighthouse?.perf || 0} label="Performance" />
              <CircularLighthouseGauge score={project.health?.lighthouse?.seo || 0} label="SEO Técnico" />
              <CircularLighthouseGauge score={project.health?.lighthouse?.best || 0} label="Boas Práticas" />
              <CircularLighthouseGauge score={project.health?.lighthouse?.a11y || 0} label="Acessibilidade" />
            </div>
            <div className="space-y-2 pt-2 border-t border-white/10">
              {[
                { key: 'ga4', label: 'Rastreamento Google Analytics 4' },
                { key: 'gsc', label: 'Indexação Google Search Console' },
                { key: 'sitemap', label: 'Mapa de Rotas (sitemap.xml)' },
                { key: 'robots', label: 'Permissões de Busca (robots.txt)' }
              ].map((t) => {
                const ok = project.health?.tools?.[t.key];
                return (
                  <div key={t.key} className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs">
                    <span className="text-slate-300">{t.label}</span>
                    <span className={ok ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                      {ok ? 'Verificado' : 'Em ajuste'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-5">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
                Paleta Oficial do Projeto
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {(project.palette || []).map((c, i) => (
                  <button
                    key={i}
                    onClick={() => copyColor(c.hex)}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-black/35 border border-white/5 hover:border-white/20 text-left"
                  >
                    <span className="w-6 h-6 rounded-lg border border-white/20 shrink-0" style={{ backgroundColor: c.hex }} />
                    <div className="min-w-0">
                      <p className="text-[11px] text-white truncate">{c.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">{copiedHex === c.hex ? 'Copiado!' : c.hex}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
                Ficha & Registros
              </h2>
              <div className="space-y-2">
                {(project.dossier || []).map((d, i) => (
                  <div key={i} className="p-3 rounded-xl bg-black/35 border border-white/5">
                    <span className="text-[10px] uppercase text-cyan-400 font-semibold">{d.category}</span>
                    <span className="text-[11px] text-slate-400"> · {d.label}</span>
                    <p className="text-xs font-mono text-slate-100 mt-1 break-all">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectWorkspaceHub() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sev_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const isAdmin = currentUser?.role === 'admin';

  const handleLogout = () => {
    apiFetch(`${API_BASE}/logout`, { method: 'POST' }).finally(() => {
      localStorage.removeItem('sev_auth_token');
      localStorage.removeItem('sev_auth_user');
      setCurrentUser(null);
    });
  };

  const [projects, setProjects] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [resources, setResources] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [userForm, setUserForm] = useState({ id: null, name: '', email: '', role: 'viewer', password: '' });
  const [userFormFeedback, setUserFormFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuditing, setIsAuditing] = useState(false);

  const [customCategories, setCustomCategories] = useState(() => {
    const saved = localStorage.getItem('sev_custom_categories');
    return saved ? JSON.parse(saved) : ['Vitrine', 'Institucional', 'Landing Page', 'Sistema Web'];
  });
  const [customStages, setCustomStages] = useState(() => {
    const saved = localStorage.getItem('sev_custom_stages');
    return saved ? JSON.parse(saved) : ['active', 'warning', 'dev'];
  });

  const [selectedProjectId, setSelectedProjectId] = useState('sev-market');
  const [globalModule, setGlobalModule] = useState('project');
  const [projectSubTab, setProjectSubTab] = useState('overview');

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryChip, setCategoryChip] = useState('Todos');
  const [stageFilter, setStageFilter] = useState('all');
  const [auditFilter, setAuditFilter] = useState('all');

  const [copiedKey, setCopiedKey] = useState(null);

  const [newReminderProjectId, setNewReminderProjectId] = useState('');
  const [newReminderText, setNewReminderText] = useState('');
  const [newReminderFreq, setNewReminderFreq] = useState('Mensal · Todo dia 05');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState('edit');
  const [editorTab, setEditorTab] = useState('geral');
  const [draftProject, setDraftProject] = useState(EMPTY_PROJECT_TEMPLATE);
  const [tagsInput, setTagsInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageInput, setNewStageInput] = useState('');

  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [resourceMode, setResourceMode] = useState('create');
  const [draftResource, setDraftResource] = useState({
    id: null,
    type: 'snippet',
    title: '',
    category: '',
    description: '',
    content: ''
  });

  const [isSyncingGa4, setIsSyncingGa4] = useState(false);

  // Sensor de tela Mobile (< 1024px), Gaveta Mobile e Trava de Segurança Mobile
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [allowMobileEdit, setAllowMobileEdit] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const listener = (e) => {
      setIsMobile(e.matches);
      if (!e.matches) setIsMobileDrawerOpen(false);
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  // Por padrão no celular fica em Modo Visualização Limpa (evita toques acidentais), mas Admin pode destravar se quiser
  const canEdit = isAdmin && (!isMobile || allowMobileEdit);

  const allCategories = useMemo(() => {
    const fromProjects = projects.map((p) => p.category).filter(Boolean);
    return Array.from(new Set([...customCategories, ...fromProjects]));
  }, [customCategories, projects]);

  const allStages = useMemo(() => {
    const fromProjects = projects.map((p) => p.status).filter(Boolean);
    return Array.from(new Set([...customStages, ...fromProjects]));
  }, [customStages, projects]);

  const fetchWorkspaceData = () => {
    setIsLoading(true);
    apiFetch(`${API_BASE}/bootstrap`)
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem('sev_auth_token');
          localStorage.removeItem('sev_auth_user');
          setCurrentUser(null);
          throw new Error('Sessão expirada');
        }
        if (!res.ok) throw new Error('Falha na API');
        return res.json();
      })
      .then((data) => {
        const normProjects = (data.projects || []).map(normalizeProject);
        const normReminders = (data.reminders || []).map(normalizeReminder);
        const fetchedResources = data.resources || [];

        setProjects(normProjects.length ? normProjects : INITIAL_PROJECTS);
        setReminders(normReminders);
        setResources(fetchedResources);
        setResources(fetchedResources);
        setUsersList(data.users || []);

        if (normProjects.length > 0) {
          if (!normProjects.some((p) => p.id === selectedProjectId)) {
            setSelectedProjectId(normProjects[0].id);
          }
          if (!newReminderProjectId) {
            setNewReminderProjectId(normProjects[0].id);
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao conectar com a API Laravel:', error);
        setProjects(INITIAL_PROJECTS);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const hasClientToken = new URLSearchParams(window.location.search).has('client_token');
    if (currentUser && !hasClientToken) {
      fetchWorkspaceData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || projects[0] || INITIAL_PROJECTS[0],
    [projects, selectedProjectId]
  );

  const snippetsList = useMemo(
    () => resources.filter((r) => r.type === 'snippet'),
    [resources]
  );
  const referencesList = useMemo(
    () => resources.filter((r) => r.type === 'reference'),
    [resources]
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesChip =
        categoryChip === 'Todos' ||
        (p.category || '').toLowerCase() === categoryChip.toLowerCase();

      const matchesStage =
        stageFilter === 'all' || p.status === stageFilter;

      const matchesAudit =
        auditFilter === 'all' ||
        (auditFilter === 'missing_ga4' && !p.health?.tools?.ga4) ||
        (auditFilter === 'gsc_verified' && p.health?.tools?.gsc) ||
        (auditFilter === 'missing_sitemap' && !p.health?.tools?.sitemap);

      return matchesSearch && matchesChip && matchesStage && matchesAudit;
    });
  }, [projects, searchQuery, categoryChip, stageFilter, auditFilter]);

  const clientToken = new URLSearchParams(window.location.search).get('client_token');
  if (clientToken) {
    return <PublicClientPortal token={clientToken} />;
  }

  if (!currentUser) {
    return (
      <LoginScreen
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          fetchWorkspaceData();
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-slate-950 text-cyan-400 font-mono text-sm">
        [ CONECTANDO AO SERVIDOR VPS... ]
      </div>
    );
  }

  const pendingRemindersCount = reminders.filter((r) => !r.completed).length;

  const handleAddCustomCategory = () => {
    const val = newCategoryInput.trim();
    if (!val) return;
    const updated = Array.from(new Set([...customCategories, val]));
    setCustomCategories(updated);
    localStorage.setItem('sev_custom_categories', JSON.stringify(updated));
    setDraftProject({ ...draftProject, category: val });
    setNewCategoryInput('');
    setIsAddingCategory(false);
  };

  const handleAddCustomStage = () => {
    const val = newStageInput.trim();
    if (!val) return;
    const updated = Array.from(new Set([...customStages, val]));
    setCustomStages(updated);
    localStorage.setItem('sev_custom_stages', JSON.stringify(updated));
    setDraftProject({ ...draftProject, status: val, statusText: val });
    setNewStageInput('');
    setIsAddingStage(false);
  };

  const openCreateModal = () => {
    const fresh = JSON.parse(JSON.stringify(EMPTY_PROJECT_TEMPLATE));
    setDraftProject(fresh);
    setTagsInput('Landing Page, VPS');
    setEditorMode('create');
    setEditorTab('geral');
    setIsEditorOpen(true);
  };

  const openEditModal = (proj = selectedProject) => {
    const clone = JSON.parse(JSON.stringify(proj));
    setDraftProject(clone);
    setTagsInput((clone.tags || []).join(', '));
    setEditorMode('edit');
    setEditorTab('geral');
    setIsEditorOpen(true);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!draftProject.title.trim()) return;
    setIsSaving(true);

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...draftProject,
      tags: parsedTags,
      status_text: draftProject.statusText,
      analytics_summary: draftProject.analyticsSummary
    };

    const url = editorMode === 'create' ? `${API_BASE}/projects` : `${API_BASE}/projects/${draftProject.id}`;
    const method = editorMode === 'create' ? 'POST' : 'PATCH';

    apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((saved) => {
        const norm = normalizeProject(saved);
        if (editorMode === 'create') {
          setProjects((prev) => [norm, ...prev]);
          setSelectedProjectId(norm.id);
        } else {
          setProjects((prev) => prev.map((p) => (p.id === norm.id ? norm : p)));
        }
        setIsSaving(false);
        setIsEditorOpen(false);
        setGlobalModule('project');
      })
      .catch((err) => {
        console.error('Erro ao salvar projeto:', err);
        setIsSaving(false);
      });
  };

  const handleDeleteProject = () => {
    if (!window.confirm(`Tem certeza que deseja excluir o projeto "${draftProject.title}"?`)) return;

    apiFetch(`${API_BASE}/projects/${draftProject.id}`, { method: 'DELETE' })
      .then(() => {
        const remaining = projects.filter((p) => p.id !== draftProject.id);
        setProjects(remaining);
        if (remaining.length > 0) setSelectedProjectId(remaining[0].id);
        setIsEditorOpen(false);
      })
      .catch((err) => console.error('Erro ao excluir:', err));
  };

  const openCreateResourceModal = (type) => {
    setResourceMode('create');
    setDraftResource({
      id: null,
      type,
      title: '',
      category: type === 'snippet' ? 'Analytics / SEO' : 'UI / Design',
      description: '',
      content: ''
    });
    setIsResourceModalOpen(true);
  };

  const openEditResourceModal = (item) => {
    setResourceMode('edit');
    setDraftResource({ ...item });
    setIsResourceModalOpen(true);
  };

  const handleSaveResource = (e) => {
    e.preventDefault();
    if (!draftResource.title.trim() || !draftResource.content.trim()) return;

    const isCreate = resourceMode === 'create';
    const url = isCreate ? `${API_BASE}/resources` : `${API_BASE}/resources/${draftResource.id}`;
    const method = isCreate ? 'POST' : 'PATCH';

    apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draftResource)
    })
      .then((res) => res.json())
      .then((saved) => {
        if (isCreate) {
          setResources((prev) => [...prev, saved]);
        } else {
          setResources((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
        }
        setIsResourceModalOpen(false);
      })
      .catch((err) => console.error('Erro ao salvar recurso:', err));
  };

  const handleDeleteResource = (id) => {
    if (!window.confirm('Deseja excluir este bloco permanentemente?')) return;
    apiFetch(`${API_BASE}/resources/${id}`, { method: 'DELETE' })
      .then(() => {
        setResources((prev) => prev.filter((r) => r.id !== id));
      })
      .catch((err) => console.error('Erro ao excluir recurso:', err));
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    setUserFormFeedback('');
    const isEdit = Boolean(userForm.id);
    const url = isEdit ? `${API_BASE}/users/${userForm.id}` : `${API_BASE}/users`;
    const method = isEdit ? 'PATCH' : 'POST';

    apiFetch(url, {
      method,
      body: JSON.stringify(userForm)
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Erro ao salvar usuário');
        return data;
      })
      .then((savedUser) => {
        if (isEdit) {
          setUsersList((prev) => prev.map((u) => (u.id === savedUser.id ? savedUser : u)));
          // Se você editou a sua própria conta, atualiza o estado local imediatamente
          if (currentUser?.email === savedUser.email || currentUser?.id === savedUser.id) {
            const updatedMe = { ...currentUser, ...savedUser };
            setCurrentUser(updatedMe);
            localStorage.setItem('sev_auth_user', JSON.stringify(updatedMe));
          }
        } else {
          setUsersList((prev) => [...prev, savedUser]);
        }
        setUserForm({ id: null, name: '', email: '', role: 'viewer', password: '' });
        setUserFormFeedback('Usuário salvo com sucesso!');
        setTimeout(() => setUserFormFeedback(''), 3000);
      })
      .catch((err) => setUserFormFeedback(err.message));
  };

  const handleDeleteUser = (u) => {
    if (!window.confirm(`Tem certeza que deseja revogar o acesso de "${u.name}" (${u.email})?`)) return;
    apiFetch(`${API_BASE}/users/${u.id}`, { method: 'DELETE' })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Não foi possível excluir');
        }
        setUsersList((prev) => prev.filter((item) => item.id !== u.id));
      })
      .catch((err) => alert(err.message));
  };

  const seedDefaultResources = async (type) => {
    const defaults = type === 'snippet' ? DEFAULT_SNIPPETS : DEFAULT_REFERENCES;
    for (const item of defaults) {
      const res = await apiFetch(`${API_BASE}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        const created = await res.json();
        setResources((prev) => [...prev, created]);
      }
    }
  };

  const handleCopy = (text, idKey) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(idKey);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const toggleHealthTool = (toolKey) => {
    if (!canEdit) return; // Evita clique acidental no celular ou por visitante

    const updatedHealth = {
      ...selectedProject.health,
      tools: {
        ...selectedProject.health.tools,
        [toolKey]: !selectedProject.health.tools[toolKey]
      }
    };

    setProjects((prev) =>
      prev.map((proj) => (proj.id === selectedProject.id ? { ...proj, health: updatedHealth } : proj))
    );

    apiFetch(`${API_BASE}/projects/${selectedProject.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ health: updatedHealth })
    }).catch((err) => console.error('Erro ao salvar switch:', err));
  };

  const toggleDossierSecret = (e, index) => {
    e.stopPropagation();
    if (!isAdmin) return;

    const updatedDossier = selectedProject.dossier.map((item, idx) =>
      idx === index ? { ...item, is_secret: !item.is_secret } : item
    );

    setProjects((prev) =>
      prev.map((proj) => (proj.id === selectedProject.id ? { ...proj, dossier: updatedDossier } : proj))
    );

    apiFetch(`${API_BASE}/projects/${selectedProject.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ dossier: updatedDossier })
    }).catch((err) => console.error('Erro ao ocultar campo:', err));
  };

  const toggleInfraSecret = (e, index) => {
    e.stopPropagation();
    if (!isAdmin) return;

    const updatedInfra = (selectedProject.infrastructure || []).map((srv, idx) =>
      idx === index ? { ...srv, is_secret: !srv.is_secret } : srv
    );

    setProjects((prev) =>
      prev.map((proj) => (proj.id === selectedProject.id ? { ...proj, infrastructure: updatedInfra } : proj))
    );

    apiFetch(`${API_BASE}/projects/${selectedProject.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ infrastructure: updatedInfra })
    }).catch((err) => console.error('Erro ao ocultar infra:', err));
  };

  const triggerLiveAudit = () => {
    if (!canEdit) return;
    setIsAuditing(true);
    apiFetch(`${API_BASE}/projects/${selectedProject.id}/audit`, { method: 'POST' })
      .then((res) => res.json())
      .then((updatedProj) => {
        const normalized = normalizeProject(updatedProj);
        setProjects((prev) => prev.map((p) => (p.id === normalized.id ? normalized : p)));
        setIsAuditing(false);
      })
      .catch(() => setIsAuditing(false));
  };

  const handleSyncGa4 = () => {
    if (!canEdit) return;
    setIsSyncingGa4(true);
    apiFetch(`${API_BASE}/projects/${selectedProject.id}/ga4`, { method: 'POST' })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Erro ao sincronizar GA4');
        }
        return res.json();
      })
      .then((updatedProj) => {
        const normalized = normalizeProject(updatedProj);
        setProjects((prev) => prev.map((p) => (p.id === normalized.id ? normalized : p)));
        setIsSyncingGa4(false);
        alert('Métricas atualizadas com sucesso direto do Google!');
      })
      .catch((err) => {
        alert(err.message);
        setIsSyncingGa4(false);
      });
  };

  const handleShareClientPortal = () => {
    const existingToken = selectedProject.domain?.share_token;
    if (existingToken) {
      const url = `${window.location.origin}/?client_token=${existingToken}`;
      handleCopy(url, `share-${selectedProject.id}`);
      return;
    }

    if (!isAdmin) return;

    apiFetch(`${API_BASE}/projects/${selectedProject.id}/share-token`, { method: 'POST' })
      .then((res) => res.json())
      .then((updated) => {
        const norm = normalizeProject(updated);
        setProjects((prev) => prev.map((p) => (p.id === norm.id ? norm : p)));
        const url = `${window.location.origin}/?client_token=${norm.domain.share_token}`;
        handleCopy(url, `share-${selectedProject.id}`);
      });
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!canEdit || !newReminderText.trim()) return;

    const targetId = newReminderProjectId || selectedProject.id;
    const targetObj = projects.find((p) => p.id === targetId);
    const targetTitle = targetId === 'geral-agencia' ? 'Geral / Sev Market' : (targetObj?.title || selectedProject.title);

    const payload = {
      project_id: targetId === 'geral-agencia' ? selectedProject.id : targetId,
      project_title: targetTitle,
      title: newReminderText.trim(),
      frequency: newReminderFreq,
      category: 'Operação'
    };

    apiFetch(`${API_BASE}/reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((created) => {
        setReminders((prev) => [normalizeReminder(created), ...prev]);
        setNewReminderText('');
      });
  };

  const toggleReminderDone = (id) => {
    if (!canEdit) return;
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)));
    apiFetch(`${API_BASE}/reminders/${id}/toggle`, { method: 'PATCH' }).catch(() => {});
  };

  const deleteReminder = (id) => {
    if (!canEdit) return;
    setReminders((prev) => prev.filter((r) => r.id !== id));
    apiFetch(`${API_BASE}/reminders/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const generateWhatsAppReport = (project) => {
    const { period, totalClicks, whatsappClicks, topPage } = project.analyticsSummary;
    return `Olá! Segue o resumo de desempenho da página *${project.title}* referente a *${period}*:\n\n📊 *Acessos e Cliques Totais:* ${totalClicks}\n💬 *Cliques para Contato (WhatsApp):* ${whatsappClicks}\n🔥 *Rota mais acessada:* ${topPage}\n✅ *Status Técnico (SSL/SEO):* 100% Operacional`;
  };

  const activeStageMeta = getStageMeta(selectedProject.status);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-slate-950 text-slate-100 text-left font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* BACKGROUND TECNOLÓGICO */}
      <TechnoBackground />

      {/* CONTAINER PRINCIPAL (1 Coluna Fluida no Mobile | 65% 23% 12% no Desktop) */}
      <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-12 xl:grid-cols-[65fr_23fr_12fr] gap-5 w-full h-full p-3 sm:p-4 xl:p-6 overflow-hidden">
        
        {/* ===================================================================
            PAINEL ESQUERDO (100% no Mobile | 65% no Desktop)
        =================================================================== */}
        <main className="lg:col-span-7 xl:col-span-1 flex flex-col h-full min-w-0 overflow-hidden">
          
          {/* HEADER LIQUID GLASS RESPONSIVO */}
          <header className="sticky top-0 z-30 flex flex-col items-center w-full mb-3 lg:mb-5 shrink-0">
            <div className="w-full px-3 py-2.5 rounded-2xl backdrop-blur-xl bg-white/[0.04] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              
              {/* Linha Superior Mobile: Logo + Gaveta de Projetos + Destrava Mobile */}
              <div className="flex items-center justify-between w-full sm:w-auto">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 border border-cyan-400/25 text-cyan-300 font-semibold text-xs tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SEV WORKSPACE</span>
                </div>

                <div className="flex sm:hidden items-center gap-1.5">
                  {isAdmin && (
                    <button
                      onClick={() => setAllowMobileEdit(!allowMobileEdit)}
                      title="Liberar ou bloquear edições no celular"
                      className={`p-1.5 rounded-xl border text-xs flex items-center gap-1 transition ${
                        allowMobileEdit
                          ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      {allowMobileEdit ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    </button>
                  )}
                  <button
                    onClick={() => setIsMobileDrawerOpen(true)}
                    className="px-2.5 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/35 text-cyan-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Menu className="w-3.5 h-3.5" />
                    <span>Projetos ({projects.length})</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs"
                  >
                    Sair
                  </button>
                </div>
              </div>

              {/* Abas Globais (Deslizáveis no Mobile) */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-0.5 sm:pb-0">
                <button
                  onClick={() => setGlobalModule('project')}
                  className={`shrink-0 flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    globalModule === 'project'
                      ? 'bg-white/[0.12] text-white border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <FolderGit2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-[180px]">{selectedProject.title}</span>
                </button>

                <button
                  onClick={() => setGlobalModule('reminders')}
                  className={`shrink-0 flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    globalModule === 'reminders'
                      ? 'bg-white/[0.12] text-white border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Bell className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Lembretes</span>
                  {pendingRemindersCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      {pendingRemindersCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setGlobalModule('devguide')}
                  className={`shrink-0 flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    globalModule === 'devguide'
                      ? 'bg-white/[0.12] text-white border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Guia de Dev</span>
                </button>

                <button
                  onClick={() => setGlobalModule('refs')}
                  className={`shrink-0 flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    globalModule === 'refs'
                      ? 'bg-white/[0.12] text-white border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Bookmark className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Referências</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => setGlobalModule('users')}
                    className={`shrink-0 flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                      globalModule === 'users'
                        ? 'bg-white/[0.12] text-white border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Acessos</span>
                  </button>
                )}
              </div>

              {/* Ações Direitas (Tablet / Desktop) */}
              <div className="hidden sm:flex items-center gap-2 pr-1 shrink-0">
                <button
                  onClick={() => setIsMobileDrawerOpen(true)}
                  className="lg:hidden px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/35 text-cyan-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Menu className="w-3.5 h-3.5" />
                  <span>Projetos ({projects.length})</span>
                </button>
                {isMobile && isAdmin && (
                  <button
                    onClick={() => setAllowMobileEdit(!allowMobileEdit)}
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono flex items-center gap-1 ${
                      allowMobileEdit
                        ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    {allowMobileEdit ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    <span>{allowMobileEdit ? 'EDIÇÃO LIBERADA' : 'MODO LEITURA'}</span>
                  </button>
                )}
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                  {isAdmin ? 'ADMIN' : 'MODO LEITOR'}
                </span>
                {canEdit && (
                  <button
                    onClick={openCreateModal}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/35 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Projeto</span>
                  </button>
                )}
                <button
                  onClick={fetchWorkspaceData}
                  title="Sincronizar com o PostgreSQL"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs transition"
                >
                  Sair
                </button>
              </div>
            </div>

            {/* DOCK HORIZONTAL RÁPIDA DE PROJETOS (APENAS MOBILE/TABLET) */}
            <div className="lg:hidden w-full mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {projects.map((proj) => {
                const active = proj.id === selectedProject.id;
                const meta = getStageMeta(proj.status);
                return (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setGlobalModule('project');
                    }}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 border transition ${
                      active
                        ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-white/[0.03] text-slate-400 border-white/10'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                    <span className="truncate max-w-[130px]">{proj.title}</span>
                  </button>
                );
              })}
            </div>

            {globalModule === 'project' && (
              <div className="relative flex flex-col items-center w-full mt-1 lg:mt-0">
                <div className="hidden lg:flex relative items-center justify-center">
                  <div className="h-2.5 w-72 backdrop-blur-xl bg-white/[0.05] border-x border-white/15" />
                </div>

                <div className="w-full lg:w-auto overflow-x-auto no-scrollbar flex items-center justify-start lg:justify-center gap-1.5 px-2.5 py-1.5 rounded-2xl backdrop-blur-xl bg-white/[0.04] border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                  {[
                    { id: 'overview', label: 'Visão 360°' },
                    { id: 'ficha', label: 'Ficha & Paleta' },
                    { id: 'architecture', label: 'Rotas & Infra' },
                    { id: 'seo', label: 'Saúde & SEO' }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setProjectSubTab(sub.id)}
                      className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                        projectSubTab === sub.id
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/35 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* CORPO ROLÁVEL DO WORKSPACE */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-5 pb-8">
            {globalModule === 'project' && (
              <>
                <div className="p-4 sm:p-5 rounded-2xl backdrop-blur-xl bg-white/[0.03] border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        {selectedProject.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${activeStageMeta.dot}`} />
                        {selectedProject.statusText || activeStageMeta.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                        {selectedProject.title}
                      </h1>
                      {canEdit && (
                        <button
                          onClick={() => openEditModal(selectedProject)}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 text-xs text-slate-200 hover:text-cyan-200 flex items-center gap-1.5 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Editar Projeto</span>
                        </button>
                      )}
                      {(isAdmin || selectedProject.domain?.share_token) && (
                        <button
                          onClick={handleShareClientPortal}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-1.5 transition"
                        >
                          {copiedKey === `share-${selectedProject.id}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Link Copiado!</span>
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Link do Cliente</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{selectedProject.subtitle}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 bg-black/35 p-3 rounded-xl border border-white/10">
                    <div className="text-left sm:text-right min-w-0">
                      <div className="flex items-center sm:justify-end gap-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">Domínio:</span>
                        <span className="text-xs font-mono font-semibold text-cyan-300 truncate">
                          {selectedProject.domain.current || 'Não definido'}
                        </span>
                      </div>

                      {selectedProject.domain.future && selectedProject.domain.future.trim() !== '' ? (
                        <div className="flex items-center sm:justify-end gap-1.5 mt-1">
                          <span className="text-[10px] uppercase tracking-wider text-slate-500">Futuro:</span>
                          <span className="text-xs font-mono text-indigo-300 truncate">
                            {selectedProject.domain.future}
                          </span>
                        </div>
                      ) : (
                        <div className="mt-1">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300">
                            Domínio Definitivo Ativo
                          </span>
                        </div>
                      )}

                      {selectedProject.domain.dnsProvider && (
                        <p className="text-[10px] text-slate-500 mt-1">
                          DNS: {selectedProject.domain.dnsProvider}
                        </p>
                      )}
                    </div>
                    {selectedProject.domain.current && (
                      <a
                        href={`https://${selectedProject.domain.current}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 text-slate-200 hover:text-cyan-200 transition shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                  {/* COLUNA 1: FICHA DINÂMICA */}
                  {(projectSubTab === 'overview' || projectSubTab === 'ficha') && (
                    <section
                      className={`${
                        projectSubTab === 'ficha' ? 'xl:col-span-3' : 'xl:col-span-1'
                      } p-4 sm:p-5 rounded-2xl backdrop-blur-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between space-y-5`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                            <FileCode className="w-4 h-4 text-cyan-400" />
                            <span>Ficha & Campos Customizados</span>
                          </h2>
                          {canEdit && (
                            <button
                              onClick={() => {
                                openEditModal(selectedProject);
                                setEditorTab('ficha');
                              }}
                              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> Campo
                            </button>
                          )}
                        </div>

                        {selectedProject.dossier.length === 0 ? (
                          <div className="p-4 rounded-xl bg-black/25 border border-white/5 text-xs text-slate-500">
                            Nenhum campo cadastrado.
                          </div>
                        ) : (
                          <div className={`grid gap-2.5 ${projectSubTab === 'ficha' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                            {selectedProject.dossier.map((item, idx) => {
                              const copyId = `dossier-${selectedProject.id}-${idx}`;
                              const isCopied = copiedKey === copyId;
                              const isMaskedForViewer = Boolean(item.masked);

                              return (
                                <div
                                  key={idx}
                                  onClick={() => !isMaskedForViewer && handleCopy(item.value, copyId)}
                                  className={`group p-3 rounded-xl bg-black/35 border transition flex items-center justify-between gap-2 ${
                                    isMaskedForViewer
                                      ? 'border-white/5 opacity-75 cursor-not-allowed'
                                      : 'border-white/5 hover:bg-white/[0.06] hover:border-cyan-500/30 cursor-pointer'
                                  }`}
                                >
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      {item.category && (
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400/80">
                                          {item.category}
                                        </span>
                                      )}
                                      <span className="text-[11px] text-slate-400 truncate">
                                        {item.category ? `· ${item.label}` : item.label}
                                      </span>
                                      {isAdmin && item.is_secret && (
                                        <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                          Oculto p/ Leitor
                                        </span>
                                      )}
                                    </div>
                                    <p
                                      className={`text-xs font-medium truncate mt-1 font-mono ${
                                        isMaskedForViewer ? 'text-amber-400/80 tracking-widest' : 'text-slate-100'
                                      }`}
                                    >
                                      {item.value}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {isAdmin && (
                                      <button
                                        type="button"
                                        onClick={(e) => toggleDossierSecret(e, idx)}
                                        title={
                                          item.is_secret
                                            ? 'Oculto para Leitor no Backend (Clique para liberar)'
                                            : 'Visível para Leitor (Clique para ocultar no Backend)'
                                        }
                                        className={`p-1.5 rounded-lg border transition ${
                                          item.is_secret
                                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                                            : 'bg-white/[0.04] border-transparent text-slate-500 hover:text-slate-200 hover:bg-white/10'
                                        }`}
                                      >
                                        {item.is_secret ? (
                                          <EyeOff className="w-3.5 h-3.5" />
                                        ) : (
                                          <Eye className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    )}

                                    {!isMaskedForViewer && (
                                      <div className="p-1.5 rounded-lg bg-white/[0.04] group-hover:bg-cyan-500/20 transition">
                                        {isCopied ? (
                                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300" />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <Palette className="w-3.5 h-3.5 text-indigo-400" />
                            Paleta Hex do Projeto
                          </span>
                          {canEdit && (
                            <button
                              onClick={() => {
                                openEditModal(selectedProject);
                                setEditorTab('ficha');
                              }}
                              className="text-[11px] text-indigo-400 hover:text-indigo-300"
                            >
                              Editar Cores
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedProject.palette.map((color, idx) => {
                            const colorKey = `color-${selectedProject.id}-${idx}`;
                            return (
                              <button
                                key={idx}
                                onClick={() => handleCopy(color.hex, colorKey)}
                                className="flex items-center gap-2.5 p-2 rounded-xl bg-black/35 hover:bg-white/[0.06] border border-white/5 hover:border-white/20 transition text-left"
                              >
                                <span
                                  className="w-6 h-6 rounded-lg border border-white/20 shrink-0 shadow-inner"
                                  style={{ backgroundColor: color.hex }}
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-[11px] font-medium text-slate-200 truncate">{color.name}</p>
                                  <p className="text-[10px] font-mono text-slate-400">
                                    {copiedKey === colorKey ? 'Copiado!' : color.hex}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* COLUNA 2: ARQUITETURA, ROTAS & INFRA */}
                  {(projectSubTab === 'overview' || projectSubTab === 'architecture') && (
                    <section
                      className={`${
                        projectSubTab === 'architecture' ? 'xl:col-span-3' : 'xl:col-span-1'
                      } p-4 sm:p-5 rounded-2xl backdrop-blur-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between space-y-5`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-indigo-400" />
                            <span>Árvore de Rotas & Subpáginas</span>
                          </h2>
                          {canEdit && (
                            <button
                              onClick={() => {
                                openEditModal(selectedProject);
                                setEditorTab('rotas');
                              }}
                              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> Rota
                            </button>
                          )}
                        </div>

                        <div className="relative pl-3 border-l-2 border-indigo-500/30 space-y-3">
                          {selectedProject.routes.map((route, idx) => (
                            <div
                              key={idx}
                              className="relative p-3 rounded-xl bg-black/35 border border-white/5 hover:border-indigo-400/30 transition group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`h-2 w-2 rounded-full ${
                                        route.status === 'online' ? 'bg-emerald-400' : 'bg-amber-400'
                                      }`}
                                    />
                                    <p className="text-xs font-semibold text-white">{route.name}</p>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 font-mono text-[10px] border border-indigo-500/25">
                                      {route.path}
                                    </span>
                                    {route.folder && (
                                      <span className="text-[10px] font-mono text-slate-500">dir: {route.folder}</span>
                                    )}
                                  </div>
                                  {route.note && <p className="text-[11px] text-slate-400 mt-1.5">{route.note}</p>}
                                </div>

                                <a
                                  href={`https://${selectedProject.domain.current}${route.path === '/index.html' ? '' : route.path}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-200 transition shrink-0"
                                >
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* MAPA DE INFRAESTRUTURA E SERVIÇOS (COM BOTÃO DE OLHO PARA OCULTAR DO LEITOR) */}
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-cyan-400" />
                            <span>Mapa de Infraestrutura & Custos</span>
                          </h2>
                          {canEdit && (
                            <button
                              onClick={() => {
                                openEditModal(selectedProject);
                                setEditorTab('rotas');
                              }}
                              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> Serviço
                            </button>
                          )}
                        </div>

                        {selectedProject.infrastructure?.length === 0 ? (
                          <div className="p-3.5 rounded-xl bg-black/25 border border-white/5 text-xs text-slate-500">
                            Nenhuma infraestrutura mapeada (Ex: VPS, Banco Azure, Render, Vercel).
                          </div>
                        ) : (
                          <div className={`grid gap-2.5 ${projectSubTab === 'architecture' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                            {(selectedProject.infrastructure || []).map((srv, idx) => {
                              const copyId = `infra-${selectedProject?.id}-${idx}`;
                              const isMaskedInfra = Boolean(srv.masked);
                              const isPaidOrCredit =
                                (srv.cost_status || '').toLowerCase().includes('crédito') ||
                                (srv.cost_status || '').toLowerCase().includes('pago') ||
                                (srv.cost_status || '').includes('$');

                              return (
                                <div
                                  key={idx}
                                  className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-cyan-500/30 transition space-y-2"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                                          {srv.type || 'Serviço'}
                                        </span>
                                        <span className="text-[11px] font-semibold text-indigo-300">
                                          {srv.provider}
                                        </span>
                                        {isAdmin && srv.is_secret && (
                                          <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                            Oculto p/ Leitor
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs font-bold text-white mt-1">{srv.name}</p>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {srv.cost_status && (
                                        <span
                                          className={`px-2 py-0.5 text-[10px] font-mono rounded border ${
                                            isPaidOrCredit
                                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                          }`}
                                        >
                                          {srv.cost_status}
                                        </span>
                                      )}
                                      {isAdmin && (
                                        <button
                                          type="button"
                                          onClick={(e) => toggleInfraSecret(e, idx)}
                                          title={
                                            srv.is_secret
                                              ? 'IP/Notas ocultos para Leitor (Clique para liberar)'
                                              : 'Visível para Leitor (Clique para ocultar IP/Notas)'
                                          }
                                          className={`p-1 rounded-lg border transition ${
                                            srv.is_secret
                                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                              : 'bg-white/[0.04] border-transparent text-slate-500 hover:text-slate-200'
                                          }`}
                                        >
                                          {srv.is_secret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {srv.url_or_ip && (
                                    <div
                                      onClick={() => !isMaskedInfra && handleCopy(srv.url_or_ip, copyId)}
                                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 group ${
                                        isMaskedInfra ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/[0.07] cursor-pointer'
                                      }`}
                                    >
                                      <span className="text-[11px] font-mono text-slate-300 truncate">
                                        {srv.url_or_ip}
                                      </span>
                                      {!isMaskedInfra && (
                                        copiedKey === copyId ? (
                                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                                        ) : (
                                          <Copy className="w-3 h-3 text-slate-500 group-hover:text-cyan-300 shrink-0" />
                                        )
                                      )}
                                    </div>
                                  )}

                                  {srv.notes && (
                                    <p className="text-[11px] text-slate-400 leading-relaxed border-t border-white/5 pt-1.5">
                                      {srv.notes}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border border-cyan-500/25">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                            <Send className="w-3.5 h-3.5" />
                            Resumo GA4 p/ WhatsApp
                          </span>
                          {canEdit && (
                            <div className="flex items-center gap-3">
                              <button
                                onClick={handleSyncGa4}
                                disabled={isSyncingGa4}
                                className="text-[10px] font-mono text-emerald-300 flex items-center gap-1 hover:text-emerald-200 transition"
                              >
                                <RefreshCw className={`w-3 h-3 ${isSyncingGa4 ? 'animate-spin' : ''}`} />
                                {isSyncingGa4 ? 'Sincronizando...' : 'Auto Sync GA4'}
                              </button>
                              <button
                                onClick={() => {
                                  openEditModal(selectedProject);
                                  setEditorTab('seo');
                                }}
                                className="text-[10px] font-mono text-cyan-300 underline"
                              >
                                Editar Manualmente
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                          Cliques totais: <strong>{selectedProject.analyticsSummary.totalClicks}</strong> · WhatsApp: <strong>{selectedProject.analyticsSummary.whatsappClicks}</strong> · Destaque: <code className="text-cyan-300">{selectedProject.analyticsSummary.topPage}</code>
                        </p>
                        <button
                          onClick={() =>
                            handleCopy(generateWhatsAppReport(selectedProject), `report-${selectedProject.id}`)
                          }
                          className="w-full py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-xs font-medium text-cyan-200 flex items-center justify-center gap-2 transition"
                        >
                          {copiedKey === `report-${selectedProject.id}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Relatório Copiado p/ WhatsApp!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar Relatório Mensal do Cliente</span>
                            </>
                          )}
                        </button>
                      </div>
                    </section>
                  )}

                  {/* COLUNA 3: SAÚDE & SEO */}
                  {(projectSubTab === 'overview' || projectSubTab === 'seo') && (
                    <section
                      className={`${
                        projectSubTab === 'seo' ? 'xl:col-span-3' : 'xl:col-span-1'
                      } p-4 sm:p-5 rounded-2xl backdrop-blur-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between space-y-5`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-emerald-400" />
                            <span>Lighthouse Scores</span>
                          </h2>
                          {canEdit && (
                            <button
                              onClick={triggerLiveAudit}
                              disabled={isAuditing}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 flex items-center gap-1 transition"
                            >
                              <RefreshCw className={`w-3 h-3 ${isAuditing ? 'animate-spin' : ''}`} />
                              <span>{isAuditing ? 'Auditando...' : 'Auditar URL'}</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-2.5 mb-5">
                          <CircularLighthouseGauge score={selectedProject.health.lighthouse.perf} label="Performance" />
                          <CircularLighthouseGauge score={selectedProject.health.lighthouse.seo} label="SEO" />
                          <CircularLighthouseGauge score={selectedProject.health.lighthouse.best} label="Best Practices" />
                          <CircularLighthouseGauge score={selectedProject.health.lighthouse.a11y} label="Acessibilidade" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Switches de Indexação & Tags
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {canEdit ? 'Salvo no Postgres' : 'Somente Leitura'}
                            </span>
                          </div>

                          {[
                            { key: 'ga4', label: 'Google Analytics 4 (GA4)', desc: 'Rastreamento de tráfego e cliques' },
                            { key: 'gsc', label: 'Google Search Console', desc: 'Propriedade verificada no Google' },
                            { key: 'sitemap', label: 'Arquivo sitemap.xml', desc: 'Índice de rotas enviado ao GSC' },
                            { key: 'robots', label: 'Arquivo robots.txt', desc: 'Permissões de crawling ativas' }
                          ].map((tool) => {
                            const isActive = selectedProject.health.tools[tool.key];
                            return (
                              <button
                                key={tool.key}
                                type="button"
                                onClick={() => toggleHealthTool(tool.key)}
                                className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                                  !canEdit ? 'cursor-default' : ''
                                } ${
                                  isActive
                                    ? 'bg-emerald-950/20 border-emerald-500/25 hover:border-emerald-400/50'
                                    : 'bg-rose-950/20 border-rose-500/25 hover:border-rose-400/50'
                                }`}
                              >
                                <div>
                                  <p className="text-xs font-medium text-slate-200">{tool.label}</p>
                                  <p className="text-[10px] text-slate-400">{tool.desc}</p>
                                </div>

                                <div
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 ${
                                    isActive
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  }`}
                                >
                                  {isActive ? (
                                    <>
                                      <ShieldCheck className="w-3.5 h-3.5" />
                                      <span>Ativo</span>
                                    </>
                                  ) : (
                                    <>
                                      <AlertCircle className="w-3.5 h-3.5" />
                                      <span>Pendente</span>
                                    </>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </>
            )}

            {/* ===============================================================
                MODO 2: LEMBRETES
            =============================================================== */}
            {globalModule === 'reminders' && (
              <div className="p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/[0.03] border border-white/10">
                <div className="mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
                    <CalendarClock className="w-6 h-6 text-amber-400" />
                    <span>Central de Lembretes & Entregas Recorrentes</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Acompanhe as entregas periódicas e pendências operacionais dos projetos.
                  </p>
                </div>

                {canEdit && (
                  <form onSubmit={handleAddReminder} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-8 p-4 rounded-xl bg-black/40 border border-white/10">
                    <div className="md:col-span-3">
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                        Projeto / Cliente
                      </label>
                      <select
                        value={newReminderProjectId || selectedProject.id}
                        onChange={(e) => setNewReminderProjectId(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-200 font-medium focus:outline-none focus:border-cyan-400"
                      >
                        {projects.map((proj) => (
                          <option key={proj.id} value={proj.id}>
                            {proj.title}
                          </option>
                        ))}
                        <option value="geral-agencia">Geral / Agência</option>
                      </select>
                    </div>

                    <div className="md:col-span-5">
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                        Tarefa ou Entrega
                      </label>
                      <input
                        type="text"
                        value={newReminderText}
                        onChange={(e) => setNewReminderText(e.target.value)}
                        placeholder="Ex: Enviar relatório mensal de cliques GA4..."
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                        Frequência
                      </label>
                      <select
                        value={newReminderFreq}
                        onChange={(e) => setNewReminderFreq(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Mensal · Todo dia 05">Mensal · Dia 05</option>
                        <option value="Quinzenal">Quinzenal</option>
                        <option value="Semanal">Semanal</option>
                        <option value="Urgente · Único">Urgente · Único</option>
                        <option value="Pré-Deploy">Pré-Deploy</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agendar</span>
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {reminders.map((rem) => (
                    <div
                      key={rem.id}
                      className={`p-4 rounded-xl border transition flex items-center justify-between gap-4 ${
                        rem.completed
                          ? 'bg-black/20 border-white/5 opacity-55'
                          : 'bg-black/45 border-white/10 hover:border-amber-400/30'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          type="button"
                          onClick={() => toggleReminderDone(rem.id)}
                          className={`mt-0.5 text-slate-400 transition ${canEdit ? 'hover:text-emerald-400' : 'cursor-default'}`}
                        >
                          {rem.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                              {rem.projectTitle}
                            </span>
                            <span className="text-[11px] font-mono text-amber-300">{rem.frequency}</span>
                          </div>
                          <p className={`text-sm mt-1.5 ${rem.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                            {rem.title}
                          </p>
                        </div>
                      </div>

                      {canEdit && (
                        <button
                          onClick={() => deleteReminder(rem.id)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===============================================================
                MODO 3: GUIA DEV
            =============================================================== */}
            {globalModule === 'devguide' && (
              <div className="p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/[0.03] border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
                      <Terminal className="w-6 h-6 text-indigo-400" />
                      <span>Guia de Desenvolvimento & Snippets</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1.5">
                      Blocos de código padronizados para colar nos projetos ou sistemas na VPS.
                    </p>
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-2 shrink-0">
                      {snippetsList.length === 0 && (
                        <button
                          onClick={() => seedDefaultResources('snippet')}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition"
                        >
                          Carregar Padrões
                        </button>
                      )}
                      <button
                        onClick={() => openCreateResourceModal('snippet')}
                        className="px-3.5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/35 text-xs font-semibold text-indigo-200 flex items-center gap-1.5 transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Novo Snippet</span>
                      </button>
                    </div>
                  )}
                </div>

                {snippetsList.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-black/35 border border-white/5 text-center">
                    <p className="text-xs text-slate-400">Nenhum snippet salvo no banco ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {snippetsList.map((snip) => (
                      <div key={snip.id} className="p-4 sm:p-5 rounded-xl bg-black/45 border border-white/10 text-left">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {snip.category}
                            </span>
                            <h3 className="text-sm font-semibold text-white mt-2">{snip.title}</h3>
                            {snip.description && (
                              <p className="text-xs text-slate-400 mt-1">{snip.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopy(snip.content, `snip-${snip.id}`)}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-indigo-500/20 border border-white/10 text-xs text-slate-200 flex items-center gap-1.5 transition"
                            >
                              {copiedKey === `snip-${snip.id}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Copiado</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copiar Código</span>
                                </>
                              )}
                            </button>
                            {canEdit && (
                              <>
                                <button
                                  onClick={() => openEditResourceModal(snip)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-cyan-300 border border-white/10 transition"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteResource(snip.id)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 border border-white/10 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <pre className="mt-3 p-3.5 rounded-xl bg-[#030508] border border-white/5 text-[11px] font-mono text-cyan-200 overflow-x-auto text-left">
                          <code>{snip.content}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===============================================================
                MODO 4: REFERÊNCIAS
            =============================================================== */}
            {globalModule === 'refs' && (
              <div className="p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/[0.03] border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
                      <Bookmark className="w-6 h-6 text-emerald-400" />
                      <span>Banco de Referências & Ferramentas</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1.5">
                      Links rápidos para inspiração visual e validação de páginas.
                    </p>
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-2 shrink-0">
                      {referencesList.length === 0 && (
                        <button
                          onClick={() => seedDefaultResources('reference')}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition"
                        >
                          Carregar Padrões
                        </button>
                      )}
                      <button
                        onClick={() => openCreateResourceModal('reference')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/35 text-xs font-semibold text-emerald-200 flex items-center gap-1.5 transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Nova Referência</span>
                      </button>
                    </div>
                  )}
                </div>

                {referencesList.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-black/35 border border-white/5 text-center">
                    <p className="text-xs text-slate-400">Nenhuma referência cadastrada ainda.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {referencesList.map((ref) => (
                      <div
                        key={ref.id}
                        className="group p-4 sm:p-5 rounded-xl bg-black/40 hover:bg-white/[0.04] border border-white/10 hover:border-emerald-400/40 transition flex flex-col justify-between text-left"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                              {ref.category}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {canEdit && (
                                <>
                                  <button
                                    onClick={() => openEditResourceModal(ref)}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteResource(ref.id)}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 transition"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              <a
                                href={ref.content}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 transition"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                          <h3 className="text-sm font-bold text-white mt-3">{ref.title}</h3>
                          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{ref.description}</p>
                        </div>
                        <a
                          href={ref.content}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-emerald-400/90 hover:text-emerald-300 truncate block"
                        >
                          {ref.content}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===============================================================
                MODO 5: GERENCIAMENTO DE USUÁRIOS & CREDENCIAIS (APENAS ADMIN)
            =============================================================== */}
            {globalModule === 'users' && isAdmin && (
              <div className="p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/[0.03] border border-white/10 space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
                    <ShieldCheck className="w-6 h-6 text-cyan-400" />
                    <span>Controle de Usuários & Credenciais de Produção</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Gerencie seu acesso de Administrador, a conta do seu sócio e os logins de visitantes guiados.
                  </p>
                </div>

                <form onSubmit={handleSaveUser} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      {userForm.id ? `Editando Usuário: ${userForm.name}` : 'Cadastrar Novo Usuário'}
                    </span>
                    {userForm.id && (
                      <button
                        type="button"
                        onClick={() => setUserForm({ id: null, name: '', email: '', role: 'viewer', password: '' })}
                        className="text-xs text-slate-400 hover:text-white underline"
                      >
                        Cancelar Edição
                      </button>
                    )}
                  </div>

                  {userFormFeedback && (
                    <div className="p-2.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-xs text-cyan-200">
                      {userFormFeedback}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-3">
                      <label className="block text-[10px] uppercase text-slate-400 mb-1">Nome Completo</label>
                      <input
                        type="text"
                        required
                        value={userForm.name}
                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                        placeholder="Ex: Caio Monte"
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[10px] uppercase text-slate-400 mb-1">E-mail de Login</label>
                      <input
                        type="email"
                        required
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        placeholder="email@dominio.com"
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase text-slate-400 mb-1">Permissão</label>
                      <select
                        value={userForm.role}
                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-200"
                      >
                        <option value="viewer">Leitor (Viewer)</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase text-slate-400 mb-1">
                        {userForm.id ? 'Nova Senha (Opcional)' : 'Senha Inicial *'}
                      </label>
                      <input
                        type="password"
                        required={!userForm.id}
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        placeholder={userForm.id ? 'Manter atual' : 'Mín. 6 dígitos'}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{userForm.id ? 'Atualizar' : 'Criar Conta'}</span>
                      </button>
                    </div>
                  </div>
                </form>

                <div className="space-y-2.5">
                  {usersList.map((u) => (
                    <div
                      key={u.id}
                      className="p-4 rounded-xl bg-black/45 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded border ${
                              u.role === 'admin'
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                            }`}
                          >
                            {u.role === 'admin' ? 'Administrador' : 'Leitor'}
                          </span>
                          <h3 className="text-sm font-bold text-white">{u.name}</h3>
                        </div>
                        <p className="text-xs font-mono text-slate-400 mt-1">{u.email}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setUserForm({ id: u.id, name: u.name, email: u.email, role: u.role, password: '' })
                          }
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 text-xs text-slate-200 flex items-center gap-1.5 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Editar / Trocar Senha</span>
                        </button>
                        {currentUser?.email !== u.email && (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/15 border border-white/10 text-slate-400 hover:text-rose-400 transition"
                            title="Revogar Acesso"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ===================================================================
            COLUNA DIREITA: PORTFÓLIO (VISÍVEL NO DESKTOP, NO MOBILE FICA NO DRAWER)
        =================================================================== */}
        <section className="hidden lg:flex lg:col-span-3 xl:col-span-1 flex-col h-full min-w-0 overflow-hidden lg:border-l border-white/10 lg:pl-5">
          <div className="space-y-3 mb-4 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Portfólio & Sistemas
              </h2>
              {canEdit && (
                <button
                  onClick={openCreateModal}
                  className="text-[11px] font-mono text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 px-2.5 py-1 rounded-lg border border-cyan-500/30 flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" /> Adicionar
                </button>
              )}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cliente, rota ou tag..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 transition"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {['Todos', ...allCategories].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setCategoryChip(chip)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition ${
                    categoryChip === chip
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/35'
                      : 'bg-white/[0.03] text-slate-400 border border-white/5 hover:text-slate-200'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1.5 space-y-3.5">
            {filteredProjects.map((project) => {
              const isSelected = project.id === selectedProject.id && globalModule === 'project';
              const stMeta = getStageMeta(project.status);
              return (
                <article
                  key={project.id}
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setGlobalModule('project');
                  }}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                    isSelected
                      ? 'bg-white/[0.08] border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.18)]'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-[#05070b]/25 to-transparent" />

                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full backdrop-blur-md bg-black/65 border border-white/15 flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${stMeta.dot}`} />
                      <span className="text-[10px] font-medium text-slate-200">
                        {stMeta.badge}
                      </span>
                    </div>

                    <div className="absolute inset-0 p-3 backdrop-blur-md bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-center items-center text-center">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 mb-2">
                        Inspeção Rápida
                      </span>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {project.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-white/10 border border-white/15 text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{project.subtitle}</p>
                    </div>
                    <Globe
                      className={`w-4 h-4 shrink-0 transition ${
                        isSelected ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'
                      }`}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ASIDE DE FILTROS (DESKTOP) */}
        <aside className="hidden lg:flex lg:col-span-2 xl:col-span-1 flex-col justify-between h-full rounded-2xl backdrop-blur-xl bg-white/[0.02] border border-white/10 p-4 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                <span>Filtros</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Aside</span>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Estágio</p>
              <button
                onClick={() => setStageFilter('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between ${
                  stageFilter === 'all'
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 font-medium'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                }`}
              >
                <span className="truncate">Todos os Projetos</span>
              </button>
              {allStages.map((stKey) => {
                const meta = getStageMeta(stKey);
                return (
                  <button
                    key={stKey}
                    onClick={() => setStageFilter(stKey)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between ${
                      stageFilter === stKey
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 font-medium'
                        : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{meta.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Auditoria Técnica
              </p>
              {[
                { id: 'all', label: 'Sem Filtro Técnico' },
                { id: 'missing_ga4', label: 'GA4 Pendente' },
                { id: 'gsc_verified', label: 'GSC Verificado' },
                { id: 'missing_sitemap', label: 'Sem Sitemap.xml' }
              ].map((audit) => (
                <button
                  key={audit.id}
                  onClick={() => setAuditFilter(audit.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition ${
                    auditFilter === audit.id
                      ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-medium'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                  }`}
                >
                  {audit.label}
                </button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Resumo da Agência
              </p>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Páginas</span>
                <span className="font-mono text-white">{projects.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">GA4 Pendentes</span>
                <span className="font-mono text-rose-400">
                  {projects.filter((p) => !p.health?.tools?.ga4).length}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Alertas Ativos</span>
                <span className="font-mono text-amber-300">{pendingRemindersCount}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryChip('Todos');
              setStageFilter('all');
              setAuditFilter('all');
            }}
            className="w-full mt-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-300 hover:text-white border border-white/10 transition"
          >
            Limpar Filtros
          </button>
        </aside>
      </div>

      {/* =====================================================================
          GAVETA MOBILE (CATÁLOGO DE PROJETOS + FILTROS DE ESTÁGIO/AUDITORIA)
      ===================================================================== */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-slate-950/95 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Catálogo de Projetos & Filtros
              </h2>
            </div>
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="p-2 rounded-xl bg-white/10 text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 mb-5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cliente, rota ou tag..."
                className="w-full bg-white/[0.06] border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Chips de Categoria */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {['Todos', ...allCategories].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setCategoryChip(chip)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition ${
                    categoryChip === chip
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40'
                      : 'bg-white/[0.04] text-slate-400 border border-white/10'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Seletores Rápidos de Estágio e Auditoria no Mobile */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200"
              >
                <option value="all">Estágio: Todos</option>
                {allStages.map((stKey) => (
                  <option key={stKey} value={stKey}>
                    {getStageMeta(stKey).label}
                  </option>
                ))}
              </select>

              <select
                value={auditFilter}
                onChange={(e) => setAuditFilter(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200"
              >
                <option value="all">Filtro Técnico: Todos</option>
                <option value="missing_ga4">GA4 Pendente</option>
                <option value="gsc_verified">GSC Verificado</option>
                <option value="missing_sitemap">Sem Sitemap.xml</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-6">
            {filteredProjects.map((project) => {
              const isSelected = project.id === selectedProject.id;
              const stMeta = getStageMeta(project.status);
              return (
                <article
                  key={project.id}
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setGlobalModule('project');
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`rounded-2xl overflow-hidden border transition flex items-center gap-3 p-2.5 ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400/60'
                      : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-20 h-16 rounded-xl object-cover shrink-0 bg-slate-900"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${stMeta.dot}`} />
                      <span className="text-[10px] font-mono text-cyan-300 uppercase">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white truncate mt-0.5">{project.title}</h3>
                    <p className="text-xs text-slate-400 truncate">{project.subtitle}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 1: CRIAÇÃO E EDIÇÃO DE PROJETOS
      ===================================================================== */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-4">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-950/95 border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden">
            
            <div className="px-4 sm:px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {editorMode === 'create' ? 'Cadastrar Novo Projeto / Cliente' : `Editando: ${draftProject.title}`}
                </h2>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Controle total sobre categorias, estágios, campos da ficha, cores, rotas e infraestrutura.
                </p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-2.5 bg-black/40 border-b border-white/10 flex overflow-x-auto no-scrollbar gap-2">
              {[
                { id: 'geral', label: '1. Geral & Domínios' },
                { id: 'ficha', label: '2. Ficha & Paleta' },
                { id: 'rotas', label: '3. Rotas & Infra' },
                { id: 'seo', label: '4. Lighthouse & GA4' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setEditorTab(t.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                    editorTab === t.id
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/35'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveProject} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* ABA 1: GERAL */}
              {editorTab === 'geral' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nome do Projeto / Cliente *</label>
                    <input
                      type="text"
                      required
                      value={draftProject.title}
                      onChange={(e) => setDraftProject({ ...draftProject, title: e.target.value })}
                      placeholder="Ex: Personal Amanda"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Subtítulo Descritivo</label>
                    <input
                      type="text"
                      value={draftProject.subtitle}
                      onChange={(e) => setDraftProject({ ...draftProject, subtitle: e.target.value })}
                      placeholder="Ex: Site Vitrine + Subpágina de Roupas"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-slate-400">Categoria do Projeto</label>
                      <button
                        type="button"
                        onClick={() => setIsAddingCategory(!isAddingCategory)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{isAddingCategory ? 'Cancelar' : 'Nova Categoria'}</span>
                      </button>
                    </div>
                    {isAddingCategory ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategoryInput}
                          onChange={(e) => setNewCategoryInput(e.target.value)}
                          placeholder="Digite a nova categoria..."
                          className="flex-1 bg-white/[0.06] border border-cyan-400/50 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomCategory}
                          className="px-3 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <select
                        value={draftProject.category}
                        onChange={(e) => setDraftProject({ ...draftProject, category: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      >
                        {allCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-slate-400">Estágio Operacional</label>
                      <button
                        type="button"
                        onClick={() => setIsAddingStage(!isAddingStage)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{isAddingStage ? 'Cancelar' : 'Novo Estágio'}</span>
                      </button>
                    </div>
                    {isAddingStage ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newStageInput}
                          onChange={(e) => setNewStageInput(e.target.value)}
                          placeholder="Ex: Em Homologação, Pausado..."
                          className="flex-1 bg-white/[0.06] border border-indigo-400/50 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomStage}
                          className="px-3 py-2 rounded-xl bg-indigo-400 text-slate-950 font-bold text-xs"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <select
                        value={draftProject.status}
                        onChange={(e) => setDraftProject({ ...draftProject, status: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      >
                        {allStages.map((stKey) => (
                          <option key={stKey} value={stKey}>
                            {getStageMeta(stKey).label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Texto de Status Detalhado</label>
                    <input
                      type="text"
                      value={draftProject.statusText}
                      onChange={(e) => setDraftProject({ ...draftProject, statusText: e.target.value })}
                      placeholder="Ex: Produção · GSC Verificado"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">URL da Imagem de Capa</label>
                    <input
                      type="text"
                      value={draftProject.image}
                      onChange={(e) => setDraftProject({ ...draftProject, image: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Tags do Hover (Separadas por vírgula)</label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="GA4 Pendente, Subpágina Roupas, CREF Ativo"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="md:col-span-2 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-cyan-300 mb-1">Domínio Atual (Sem https://)</label>
                      <input
                        type="text"
                        value={draftProject.domain.current}
                        onChange={(e) =>
                          setDraftProject({
                            ...draftProject,
                            domain: { ...draftProject.domain, current: e.target.value }
                          })
                        }
                        placeholder="amandapersonal.com.br"
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-indigo-300 mb-1">Domínio Futuro</label>
                      <input
                        type="text"
                        value={draftProject.domain.future}
                        onChange={(e) =>
                          setDraftProject({
                            ...draftProject,
                            domain: { ...draftProject.domain, future: e.target.value }
                          })
                        }
                        placeholder="Opcional"
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Provedor DNS</label>
                      <input
                        type="text"
                        value={draftProject.domain.dnsProvider}
                        onChange={(e) =>
                          setDraftProject({
                            ...draftProject,
                            domain: { ...draftProject.domain, dnsProvider: e.target.value }
                          })
                        }
                        placeholder="Cloudflare / Registro.br"
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 2: FICHA DINÂMICA & PALETA */}
              {editorTab === 'ficha' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-white">Campos da Ficha Técnica</h3>
                        <p className="text-xs text-slate-400">
                          Marque o ícone de olho para ocultar senhas ou chaves sensíveis do perfil Leitor.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setDraftProject({
                            ...draftProject,
                            dossier: [...draftProject.dossier, { category: 'Geral', label: '', value: '', is_secret: false }]
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-xs text-cyan-200 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adicionar Campo
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {draftProject.dossier.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-black/40 p-2.5 rounded-xl border border-white/10">
                          <input
                            type="text"
                            placeholder="Tag (Ex: Doc, Analytics)"
                            value={item.category}
                            onChange={(e) => {
                              const next = [...draftProject.dossier];
                              next[idx].category = e.target.value;
                              setDraftProject({ ...draftProject, dossier: next });
                            }}
                            className="sm:col-span-3 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300"
                          />
                          <input
                            type="text"
                            placeholder="Nome do Campo"
                            value={item.label}
                            onChange={(e) => {
                              const next = [...draftProject.dossier];
                              next[idx].label = e.target.value;
                              setDraftProject({ ...draftProject, dossier: next });
                            }}
                            className="sm:col-span-4 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            placeholder="Valor copiável"
                            value={item.value}
                            onChange={(e) => {
                              const next = [...draftProject.dossier];
                              next[idx].value = e.target.value;
                              setDraftProject({ ...draftProject, dossier: next });
                            }}
                            className="sm:col-span-3 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          />
                          <div className="sm:col-span-2 flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              title={item.is_secret ? 'Oculto p/ Leitor' : 'Visível p/ Leitor'}
                              onClick={() => {
                                const next = [...draftProject.dossier];
                                next[idx].is_secret = !next[idx].is_secret;
                                setDraftProject({ ...draftProject, dossier: next });
                              }}
                              className={`p-1.5 rounded-lg border transition ${
                                item.is_secret
                                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                  : 'bg-white/[0.04] border-white/10 text-slate-500 hover:text-white'
                              }`}
                            >
                              {item.is_secret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const next = draftProject.dossier.filter((_, i) => i !== idx);
                                setDraftProject({ ...draftProject, dossier: next });
                              }}
                              className="p-1.5 text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-white">Paleta de Cores (Hex)</h3>
                      <button
                        type="button"
                        onClick={() =>
                          setDraftProject({
                            ...draftProject,
                            palette: [...draftProject.palette, { name: 'Nova Cor', hex: '#6366F1' }]
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-xs text-indigo-200 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adicionar Cor
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {draftProject.palette.map((color, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                          <input
                            type="color"
                            value={color.hex}
                            onChange={(e) => {
                              const next = [...draftProject.palette];
                              next[idx].hex = e.target.value.toUpperCase();
                              setDraftProject({ ...draftProject, palette: next });
                            }}
                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                          />
                          <input
                            type="text"
                            value={color.name}
                            placeholder="Nome da Cor"
                            onChange={(e) => {
                              const next = [...draftProject.palette];
                              next[idx].name = e.target.value;
                              setDraftProject({ ...draftProject, palette: next });
                            }}
                            className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={color.hex}
                            onChange={(e) => {
                              const next = [...draftProject.palette];
                              next[idx].hex = e.target.value;
                              setDraftProject({ ...draftProject, palette: next });
                            }}
                            className="w-24 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = draftProject.palette.filter((_, i) => i !== idx);
                              setDraftProject({ ...draftProject, palette: next });
                            }}
                            className="text-slate-500 hover:text-rose-400 px-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 3: ROTAS & INFRAESTRUTURA */}
              {editorTab === 'rotas' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Mapeamento de Rotas e Pastas</h3>
                      <p className="text-xs text-slate-400">
                        Adicione a página principal e subpáginas (ex: /roupas, /orcamento, /links).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDraftProject({
                          ...draftProject,
                          routes: [
                            ...draftProject.routes,
                            { name: 'Nova Subpágina', path: '/nova-rota', folder: '/paginas', status: 'online', note: '' }
                          ]
                        })
                      }
                      className="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-xs text-indigo-200 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar Rota
                    </button>
                  </div>

                  <div className="space-y-3">
                    {draftProject.routes.map((rt, idx) => (
                      <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-black/40 p-3 rounded-xl border border-white/10">
                        <input
                          type="text"
                          placeholder="Título (Ex: Loja de Roupas)"
                          value={rt.name}
                          onChange={(e) => {
                            const next = [...draftProject.routes];
                            next[idx].name = e.target.value;
                            setDraftProject({ ...draftProject, routes: next });
                          }}
                          className="sm:col-span-3 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                        <input
                          type="text"
                          placeholder="Path (Ex: /roupas)"
                          value={rt.path}
                          onChange={(e) => {
                            const next = [...draftProject.routes];
                            next[idx].path = e.target.value;
                            setDraftProject({ ...draftProject, routes: next });
                          }}
                          className="sm:col-span-2 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-indigo-300"
                        />
                        <input
                          type="text"
                          placeholder="Pasta (Ex: /paginas)"
                          value={rt.folder}
                          onChange={(e) => {
                            const next = [...draftProject.routes];
                            next[idx].folder = e.target.value;
                            setDraftProject({ ...draftProject, routes: next });
                          }}
                          className="sm:col-span-2 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-400"
                        />
                        <input
                          type="text"
                          placeholder="Observação rápida"
                          value={rt.note}
                          onChange={(e) => {
                            const next = [...draftProject.routes];
                            next[idx].note = e.target.value;
                            setDraftProject({ ...draftProject, routes: next });
                          }}
                          className="sm:col-span-4 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = draftProject.routes.filter((_, i) => i !== idx);
                            setDraftProject({ ...draftProject, routes: next });
                          }}
                          className="sm:col-span-1 flex justify-end sm:justify-center text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* SEÇÃO DE INFRAESTRUTURA DENTRO DA ABA 3 DO MODAL */}
                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">Mapa de Infraestrutura & Custos</h3>
                        <p className="text-xs text-slate-400">
                          Registre onde está o banco, backend, frontend, qual e-mail foi usado e marque o olho se quiser ocultar IP/notas do Leitor.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setDraftProject({
                            ...draftProject,
                            infrastructure: [
                              ...(draftProject.infrastructure || []),
                              {
                                name: '',
                                provider: '',
                                type: 'Database',
                                url_or_ip: '',
                                cost_status: 'Gratuito (Student)',
                                notes: '',
                                is_secret: false
                              }
                            ]
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-xs text-cyan-200 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adicionar Serviço
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(draftProject.infrastructure || []).map((srv, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                            <select
                              value={srv.type}
                              onChange={(e) => {
                                const next = [...draftProject.infrastructure];
                                next[idx].type = e.target.value;
                                setDraftProject({ ...draftProject, infrastructure: next });
                              }}
                              className="sm:col-span-3 bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300"
                            >
                              <option value="Database">Database (SQL/NoSQL)</option>
                              <option value="Backend">Backend / API</option>
                              <option value="Frontend">Frontend / Estático</option>
                              <option value="VPS / Cloud">VPS / Máquina Virtual</option>
                              <option value="Storage / CDN">Storage / DNS / CDN</option>
                            </select>

                            <input
                              type="text"
                              placeholder="Nome (Ex: Banco Pro Gestão)"
                              value={srv.name}
                              onChange={(e) => {
                                const next = [...draftProject.infrastructure];
                                next[idx].name = e.target.value;
                                setDraftProject({ ...draftProject, infrastructure: next });
                              }}
                              className="sm:col-span-3 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />

                            <input
                              type="text"
                              placeholder="Provedor (Ex: Azure, Render, GCP)"
                              value={srv.provider}
                              onChange={(e) => {
                                const next = [...draftProject.infrastructure];
                                next[idx].provider = e.target.value;
                                setDraftProject({ ...draftProject, infrastructure: next });
                              }}
                              className="sm:col-span-2 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-indigo-300"
                            />

                            <input
                              type="text"
                              placeholder="Custo (Ex: Crédito $100)"
                              value={srv.cost_status}
                              onChange={(e) => {
                                const next = [...draftProject.infrastructure];
                                next[idx].cost_status = e.target.value;
                                setDraftProject({ ...draftProject, infrastructure: next });
                              }}
                              className="sm:col-span-2 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-amber-300"
                            />

                            <div className="sm:col-span-2 flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                title={srv.is_secret ? 'IP/Notas ocultos p/ Leitor' : 'Visível p/ Leitor'}
                                onClick={() => {
                                  const next = [...draftProject.infrastructure];
                                  next[idx].is_secret = !next[idx].is_secret;
                                  setDraftProject({ ...draftProject, infrastructure: next });
                                }}
                                className={`p-1.5 rounded-lg border transition ${
                                  srv.is_secret
                                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                    : 'bg-white/[0.04] border-white/10 text-slate-500 hover:text-white'
                                }`}
                              >
                                {srv.is_secret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = draftProject.infrastructure.filter((_, i) => i !== idx);
                                  setDraftProject({ ...draftProject, infrastructure: next });
                                }}
                                className="p-1.5 text-slate-500 hover:text-rose-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Endpoint / Host / IP (Copiável em 1 clique)"
                              value={srv.url_or_ip}
                              onChange={(e) => {
                                const next = [...draftProject.infrastructure];
                                next[idx].url_or_ip = e.target.value;
                                setDraftProject({ ...draftProject, infrastructure: next });
                              }}
                              className="bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200"
                            />
                            <input
                              type="text"
                              placeholder="Notas (Ex: Conta institucional @uvanet.br / Link do painel)"
                              value={srv.notes}
                              onChange={(e) => {
                                const next = [...draftProject.infrastructure];
                                next[idx].notes = e.target.value;
                                setDraftProject({ ...draftProject, infrastructure: next });
                              }}
                              className="bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 4: LIGHTHOUSE & RELATÓRIO GA4 */}
              {editorTab === 'seo' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-3">Notas do Google Lighthouse (0 a 100)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { key: 'perf', label: 'Performance' },
                        { key: 'seo', label: 'SEO' },
                        { key: 'best', label: 'Best Practices' },
                        { key: 'a11y', label: 'Acessibilidade' }
                      ].map((metric) => (
                        <div key={metric.key}>
                          <label className="block text-xs text-slate-400 mb-1">{metric.label}</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={draftProject.health.lighthouse[metric.key]}
                            onChange={(e) =>
                              setDraftProject({
                                ...draftProject,
                                health: {
                                  ...draftProject.health,
                                  lighthouse: {
                                    ...draftProject.health.lighthouse,
                                    [metric.key]: Number(e.target.value)
                                  }
                                }
                              })
                            }
                            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-sm font-bold text-white mb-3">Dados do Resumo Mensal GA4 (Para WhatsApp)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Período / Mês</label>
                        <input
                          type="text"
                          value={draftProject.analyticsSummary.period}
                          onChange={(e) =>
                            setDraftProject({
                              ...draftProject,
                              analyticsSummary: { ...draftProject.analyticsSummary, period: e.target.value }
                            })
                          }
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Total de Cliques</label>
                        <input
                          type="number"
                          value={draftProject.analyticsSummary.totalClicks}
                          onChange={(e) =>
                            setDraftProject({
                              ...draftProject,
                              analyticsSummary: {
                                ...draftProject.analyticsSummary,
                                totalClicks: Number(e.target.value)
                              }
                            })
                          }
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Cliques no WhatsApp</label>
                        <input
                          type="number"
                          value={draftProject.analyticsSummary.whatsappClicks}
                          onChange={(e) =>
                            setDraftProject({
                              ...draftProject,
                              analyticsSummary: {
                                ...draftProject.analyticsSummary,
                                whatsappClicks: Number(e.target.value)
                              }
                            })
                          }
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Rota Mais Acessada</label>
                        <input
                          type="text"
                          value={draftProject.analyticsSummary.topPage}
                          onChange={(e) =>
                            setDraftProject({
                              ...draftProject,
                              analyticsSummary: { ...draftProject.analyticsSummary, topPage: e.target.value }
                            })
                          }
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                {editorMode === 'edit' ? (
                  <button
                    type="button"
                    onClick={handleDeleteProject}
                    className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold text-rose-300 flex items-center gap-1.5 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir Projeto</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Salvando...' : 'Salvar no PostgreSQL'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: CRIAR E EDITAR SNIPPETS E REFERÊNCIAS
      ===================================================================== */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-950 border border-white/15 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-base font-bold text-white">
                {resourceMode === 'create'
                  ? draftResource.type === 'snippet'
                    ? 'Novo Snippet de Código'
                    : 'Nova Referência / Link'
                  : 'Editar Bloco'}
              </h3>
              <button
                onClick={() => setIsResourceModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Título *</label>
                  <input
                    type="text"
                    required
                    value={draftResource.title}
                    onChange={(e) => setDraftResource({ ...draftResource, title: e.target.value })}
                    placeholder={draftResource.type === 'snippet' ? 'Ex: Script Pixel Meta Ads' : 'Ex: Awwwards Portfolios'}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tag / Categoria *</label>
                  <input
                    type="text"
                    required
                    value={draftResource.category}
                    onChange={(e) => setDraftResource({ ...draftResource, category: e.target.value })}
                    placeholder={draftResource.type === 'snippet' ? 'Ex: Analytics, SEO, Docker' : 'Ex: UI / Dark Mode, Ferramenta'}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Descrição / Observação</label>
                <input
                  type="text"
                  value={draftResource.description || ''}
                  onChange={(e) => setDraftResource({ ...draftResource, description: e.target.value })}
                  placeholder="Explicação rápida sobre onde ou como usar..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  {draftResource.type === 'snippet' ? 'Código do Snippet *' : 'URL Completa (https://...) *'}
                </label>
                {draftResource.type === 'snippet' ? (
                  <textarea
                    rows={8}
                    required
                    value={draftResource.content}
                    onChange={(e) => setDraftResource({ ...draftResource, content: e.target.value })}
                    placeholder="Cole o código HTML, JS, PHP ou configuração aqui..."
                    className="w-full bg-[#030508] border border-white/10 rounded-xl p-3.5 text-xs font-mono text-cyan-200"
                  />
                ) : (
                  <input
                    type="url"
                    required
                    value={draftResource.content}
                    onChange={(e) => setDraftResource({ ...draftResource, content: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-300"
                  />
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsResourceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
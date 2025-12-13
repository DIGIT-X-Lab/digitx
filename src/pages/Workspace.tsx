import { useMemo, useState } from 'react';
import { format, parseISO, isAfter } from 'date-fns';
import { Search, Lock, ExternalLink, Filter, Sparkles } from 'lucide-react';

type WorkspaceItemType = 'Grant' | 'Project' | 'Paper' | 'Task';
type WorkspaceStatus = 'Active' | 'Planning' | 'In review' | 'Submitted' | 'Pending' | 'Done';

type WorkspaceItem = {
  id: string;
  type: WorkspaceItemType;
  title: string;
  status: WorkspaceStatus;
  owner: string;
  deadline?: string;
  tags: string[];
  priority: 'High' | 'Medium' | 'Low';
  summary: string;
  links?: { label: string; href: string }[];
  timeline?: { date: string; note: string }[];
};

const sampleItems: WorkspaceItem[] = [
  {
    id: 'grant-1',
    type: 'Grant',
    title: 'EU Horizon: Trustworthy Health Intelligence',
    status: 'In review',
    owner: 'Lalith',
    deadline: '2025-02-10',
    tags: ['Funding', 'LLM', 'Clinical data'],
    priority: 'High',
    summary: 'Full proposal focused on structure-first pipelines and auditable KG QA.',
    links: [
      { label: 'Proposal', href: '#' },
      { label: 'Scope', href: '#' },
    ],
    timeline: [
      { date: '2025-01-15', note: 'Full draft circulated internally' },
      { date: '2025-01-25', note: 'Clinical PI sign-off' },
    ],
  },
  {
    id: 'proj-1',
    type: 'Project',
    title: 'MosaicX pilot with Radiology',
    status: 'Active',
    owner: 'Mira',
    deadline: '2025-03-01',
    tags: ['Pilot', 'FHIR', 'PDF ingestion'],
    priority: 'Medium',
    summary: 'Deploying MosaicX PDF → FHIR stack on 500 radiology reports with provenance kept.',
    links: [{ label: 'Runbook', href: '#' }],
    timeline: [
      { date: '2025-01-05', note: 'Environment provisioned' },
      { date: '2025-01-22', note: 'First 100 reports parsed' },
    ],
  },
  {
    id: 'paper-1',
    type: 'Paper',
    title: 'FALCON motion correction (journal submission)',
    status: 'Submitted',
    owner: 'Noah',
    deadline: '2025-01-30',
    tags: ['PET/CT', 'Motion', 'Paper'],
    priority: 'Medium',
    summary: 'Journal submission on total-body PET motion correction (greedy diffeomorphic engine).',
    links: [
      { label: 'Manuscript', href: '#' },
      { label: 'Reviews', href: '#' },
    ],
    timeline: [
      { date: '2025-01-12', note: 'Submitted to journal' },
      { date: '2025-01-28', note: 'Minor revision hints' },
    ],
  },
  {
    id: 'task-1',
    type: 'Task',
    title: 'AnnotateX gold-set expansion',
    status: 'Active',
    owner: 'Sara',
    deadline: '2025-02-18',
    tags: ['Annotation', 'Quality'],
    priority: 'High',
    summary: 'Expand cardiology gold set with 250 additional notes, double-annotated.',
    links: [{ label: 'Checklist', href: '#' }],
    timeline: [{ date: '2025-01-20', note: 'Schema locked' }],
  },
  {
    id: 'grant-2',
    type: 'Grant',
    title: 'LMU Innovation Fund: Imaging Stack',
    status: 'Planning',
    owner: 'Lalith',
    deadline: '2025-03-15',
    tags: ['Imaging', 'Grant'],
    priority: 'Low',
    summary: 'Internal proposal to extend imaging stack with harmonized PET/CT baselines.',
    links: [{ label: 'Outline', href: '#' }],
    timeline: [{ date: '2025-02-05', note: 'Outline review' }],
  },
];

const statusColors: Record<WorkspaceStatus, string> = {
  Active: 'bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))]',
  Planning: 'bg-[hsl(var(--sage)/0.14)] text-[hsl(var(--sage))]',
  'In review': 'bg-[hsl(var(--text-muted)/0.15)] text-[hsl(var(--text-primary))]',
  Submitted: 'bg-[hsl(var(--text-muted)/0.15)] text-[hsl(var(--text-primary))]',
  Pending: 'bg-[hsl(var(--text-muted)/0.15)] text-[hsl(var(--text-primary))]',
  Done: 'bg-[hsl(var(--bg-primary))] text-[hsl(var(--text-secondary))]',
};

const Workspace = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<WorkspaceItemType | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<WorkspaceStatus | 'All'>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sampleItems.filter((item) => {
      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesTerm =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.tags.some((t) => t.toLowerCase().includes(term)) ||
        item.owner.toLowerCase().includes(term);
      return matchesType && matchesStatus && matchesTerm;
    });
  }, [search, typeFilter, statusFilter]);

  const selected = filtered.find((i) => i.id === selectedId) ?? filtered[0] ?? null;

  const upcoming = filtered
    .filter((i) => i.deadline)
    .sort((a, b) => (a.deadline && b.deadline ? (a.deadline > b.deadline ? 1 : -1) : 0))
    .slice(0, 3);

  const stats = useMemo(() => {
    const active = sampleItems.filter((i) => i.status === 'Active').length;
    const grants = sampleItems.filter((i) => i.type === 'Grant').length;
    const deadlines = sampleItems.filter(
      (i) => i.deadline && isAfter(parseISO(i.deadline), new Date())
    ).length;
    return { active, grants, deadlines };
  }, []);

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[hsl(var(--bg-primary))] text-[hsl(var(--text-primary))] flex items-center justify-center px-6">
        <div className="max-w-xl w-full glass-panel p-8 md:p-10 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))] mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold">Workspace (Private)</h1>
          <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
            This area is for internal grants, projects, and tasks. Wire real auth (Supabase/Clerk/Auth0)
            before going live. For now, enter to view the demo workspace.
          </p>
          <button
            onClick={() => setUnlocked(true)}
            className="btn-primary inline-flex items-center gap-2 justify-center w-full md:w-auto"
          >
            <Sparkles className="w-4 h-4" />
            Enter demo workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bg-primary))] text-[hsl(var(--text-primary))] pb-16">
      <div className="fixed inset-0 gradient-warmth pointer-events-none" aria-hidden />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 space-y-10">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="pill-soft pill-accent inline-flex items-center gap-2 text-sm mb-3">
              <Lock className="w-4 h-4" /> Private workspace
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-2">
              DIGITX Lab Workspace
            </h1>
            <p className="text-[hsl(var(--text-secondary))] max-w-3xl">
              Curated view of grants, pilots, papers, and tasks. Filters, deadlines, and timelines in one place.
              Replace demo data and auth with your live stack when ready.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-panel p-3 rounded-xl">
              <div className="text-sm text-[hsl(var(--text-secondary))]">Active</div>
              <div className="text-2xl font-semibold">{stats.active}</div>
            </div>
            <div className="glass-panel p-3 rounded-xl">
              <div className="text-sm text-[hsl(var(--text-secondary))]">Grants</div>
              <div className="text-2xl font-semibold">{stats.grants}</div>
            </div>
            <div className="glass-panel p-3 rounded-xl">
              <div className="text-sm text-[hsl(var(--text-secondary))]">Upcoming</div>
              <div className="text-2xl font-semibold">{stats.deadlines}</div>
            </div>
          </div>
        </header>

        <section className="glass-panel rounded-3xl border border-[hsl(var(--border))] shadow-[0_20px_80px_hsl(var(--card-shadow)/0.16)] p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              {(['All', 'Grant', 'Project', 'Paper', 'Task'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`pill-soft ${typeFilter === t ? 'pill-accent' : ''}`}
                >
                  {t}
                </button>
              ))}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[hsl(var(--text-secondary))]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as WorkspaceStatus | 'All')}
                  className="bg-transparent border border-[hsl(var(--border))] rounded-full px-3 py-1 text-sm text-[hsl(var(--text-primary))] focus:outline-none focus:border-[hsl(var(--accent))]"
                >
                  {['All', 'Active', 'Planning', 'In review', 'Submitted', 'Pending', 'Done'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-[hsl(var(--text-muted))] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title, tags, owner"
                  className="w-full rounded-full bg-[hsl(var(--bg-secondary))] border border-[hsl(var(--border))] pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[hsl(var(--accent))]"
                />
              </div>
              <button className="btn-primary hidden md:inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                New entry
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left rounded-2xl border border-[hsl(var(--border))] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--accent))] ${
                    selected?.id === item.id ? 'bg-[hsl(var(--accent)/0.06)]' : 'bg-[hsl(var(--bg-primary))]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="pill-soft text-xs">{item.type}</span>
                      <span className={`pill-soft text-xs ${statusColors[item.status]}`}>{item.status}</span>
                      <span className="pill-soft text-xs">{item.priority}</span>
                    </div>
                    {item.deadline && (
                      <div className="text-sm text-[hsl(var(--text-secondary))]">
                        Due {format(parseISO(item.deadline), 'MMM d')}
                      </div>
                    )}
                  </div>
                  <div className="text-lg font-semibold mb-1">{item.title}</div>
                  <p className="text-[hsl(var(--text-secondary))] mb-2">{item.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="pill-soft text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
              {!filtered.length && (
                <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] p-8 text-center text-[hsl(var(--text-secondary))]">
                  No items match that filter yet.
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-primary))] p-4 shadow-[0_14px_40px_hsl(var(--card-shadow)/0.12)] min-h-[360px]">
                {selected ? (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="pill-soft text-xs">{selected.type}</span>
                      <span className={`pill-soft text-xs ${statusColors[selected.status]}`}>{selected.status}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{selected.title}</h3>
                    <p className="text-[hsl(var(--text-secondary))] mb-3">{selected.summary}</p>
                    <div className="text-sm mb-2">
                      <span className="text-[hsl(var(--text-secondary))]">Owner:</span> {selected.owner}
                    </div>
                    {selected.deadline && (
                      <div className="text-sm mb-4">
                        <span className="text-[hsl(var(--text-secondary))]">Deadline:</span>{' '}
                        {format(parseISO(selected.deadline), 'PPP')}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selected.tags.map((tag) => (
                        <span key={tag} className="pill-soft text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {selected.links?.length ? (
                      <div className="space-y-2 mb-4">
                        {selected.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            className="inline-flex items-center gap-2 text-[hsl(var(--accent))] text-sm hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {link.label}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ))}
                      </div>
                    ) : null}
                    {selected.timeline?.length ? (
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-[hsl(var(--text-primary))]">Timeline</div>
                        <ul className="space-y-2 text-sm">
                          {selected.timeline.map((t) => (
                            <li key={`${selected.id}-${t.date}`} className="flex gap-3 items-start">
                              <span className="w-16 text-[hsl(var(--text-secondary))]">{format(parseISO(t.date), 'MMM d')}</span>
                              <span>{t.note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="text-[hsl(var(--text-secondary))]">Select an item to see details.</div>
                )}
              </div>

              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-primary))] p-4 shadow-[0_14px_40px_hsl(var(--card-shadow)/0.12)]">
                <div className="text-sm font-semibold mb-3">Upcoming</div>
                <div className="space-y-2">
                  {upcoming.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-[hsl(var(--text-primary))]">{item.title}</span>
                      <span className="text-[hsl(var(--text-secondary))]">{format(parseISO(item.deadline!), 'MMM d')}</span>
                    </div>
                  ))}
                  {!upcoming.length && (
                    <div className="text-[hsl(var(--text-secondary))] text-sm">No upcoming deadlines.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Workspace;

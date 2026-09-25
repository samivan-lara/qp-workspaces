import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type WorkspaceItem = {
  id: string;
  name: string;
  description: string;
};

export type WorkspaceTab = 'mine' | 'shared';

export type SessionStatus = 'live' | 'scheduled' | 'draft';

export type LivePollSession = {
  id: string;
  title: string;
  type: string;
  status: SessionStatus;
  questions: number;
  participants: number;
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

export type LivePollRow = {
  id: string;
  name: string;
  createdAt: string;
  sessions: number;
  questions: number;
};

export type Respondent = {
  id: string;
  name: string;
  score: number;
};

export type WeeklyPoint = {
  label: string;
  value: number;
};

export type DashboardData = {
  sessions: LivePollSession[];
  activity: ActivityItem[];
  livePollRows: LivePollRow[];
  weekly: WeeklyPoint[];
  respondents: Respondent[];
  analytics: {
    sessionsCreated: number;
    totalParticipants: number;
    totalAnswers: number;
    avgScore: string;
  };
};

interface WorkspaceState {
  selectedName: string | null;
  selectedId: string | null;
  recentWorkspaceNames: string[];
  myWorkspaces: WorkspaceItem[];
  sharedWorkspaces: WorkspaceItem[];
  dashboardByWorkspace: Record<string, DashboardData>;
}

const initialMyWorkspaces: WorkspaceItem[] = [
  {
    id: 'w-1',
    name: 'Design Team',
    description:
      'Shared workspace for UI/UX design files, brand assets and design review sessions.',
  },
  {
    id: 'w-2',
    name: 'Marketing',
    description: 'Campaign planning, content calendars and marketing analytics in one place.',
  },
  {
    id: 'w-3',
    name: 'Research Lab',
    description: 'User research studies, interview transcripts and insight synthesis.',
  },
  {
    id: 'w-4',
    name: 'Product Analytics',
    description:
      'Product usage dashboards, funnels and quarterly KPI tracking with a longer description to test wrapping.',
  },
  {
    id: 'w-5',
    name: 'Customer Insights',
    description: 'Surveys, NPS and VOC feedback collected across the customer journey.',
  },
];

const initialSharedWorkspaces: WorkspaceItem[] = [
  {
    id: 's-1',
    name: 'Executive Board',
    description: 'Board reporting, executive summaries and strategic planning sessions.',
  },
  {
    id: 's-2',
    name: 'Growth Team',
    description:
      'Experimentation backlog, growth metrics and activation initiatives shared with the team.',
  },
];

type SessionSeed = {
  type: string;
  titles: string[];
  statuses: SessionStatus[];
  questions: number[];
  participants: number[];
};

const SEED_SESSIONS: SessionSeed[] = [
  {
    type: 'Trivia',
    titles: ['Hero Section ABC Test', 'Palette Face-Off', 'Onboarding Flow Quiz'],
    statuses: ['live', 'scheduled', 'draft'],
    questions: [8, 6, 10],
    participants: [124, 0, 0],
  },
  {
    type: 'This or That',
    titles: ['Launch Timeline Vote', 'Campaign Message Split', 'Channel Mix Quiz'],
    statuses: ['scheduled', 'live', 'draft'],
    questions: [5, 9, 7],
    participants: [0, 87, 0],
  },
  {
    type: 'Quiz',
    titles: ['Study Debrief Trivia', 'Insight Recall Check', 'Persona Match Quiz'],
    statuses: ['draft', 'live', 'scheduled'],
    questions: [12, 8, 6],
    participants: [0, 43, 0],
  },
  {
    type: 'Poll',
    titles: ['Funnel Health Check', 'Weekly KPI Pulse', 'Metric Definitions Vote'],
    statuses: ['live', 'scheduled', 'draft'],
    questions: [4, 7, 5],
    participants: [210, 0, 0],
  },
  {
    type: 'This or That',
    titles: ['NPS Deep Dive', 'Feedback Themes Quiz', 'Journey Pain Points Vote'],
    statuses: ['scheduled', 'draft', 'live'],
    questions: [6, 9, 4],
    participants: [0, 0, 158],
  },
  {
    type: 'Trivia',
    titles: ['Quarterly Strategy Quiz', 'OKR Review Check', 'Board Deck Vote'],
    statuses: ['draft', 'live', 'scheduled'],
    questions: [10, 7, 6],
    participants: [0, 32, 0],
  },
  {
    type: 'Quiz',
    titles: ['Experiment Sign-off Quiz', 'Activation Test', 'Retention Wrap Vote'],
    statuses: ['live', 'draft', 'scheduled'],
    questions: [8, 6, 5],
    participants: [96, 0, 0],
  },
];

const hashFor = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % 100000;
  return h;
};

const POLL_TOPICS = [
  'Coffee', 'Design', 'Brand', 'Team', 'Retro', 'Onboarding', 'Marketing',
  'Product', 'Culture', 'Meetings', 'Lunch', 'Focus', 'Growth', 'Sprint',
  'Roadmap', 'Knowledge', 'Values', 'Feedback', 'Wellbeing', 'Tools', 'Docs',
  'Bugs', 'Q&A', 'Trivia', 'Icebreaker', 'Efficiency', 'Strategy', 'Talent',
  'Diversity', 'Recognition',
];

const POLL_MODES = [
  'ABC Test', 'Check-in', 'Vote', 'Quiz', 'Taste-off', 'Pulse', 'Debate',
  'Picks', 'Favorites', 'Basics', '101', 'Deep Dive', 'Blitz', 'Showdown',
  'Wrap-up',
];

const buildLivePollRows = (workspaceId: string, seedIndex: number): LivePollRow[] => {
  const base = hashFor(workspaceId);
  const count = 10 + ((base * 9301 + 49297) % 26);
  const offset = seedIndex * 3;
  return Array.from({ length: count }, (_, i) => {
    const cursor = i + offset;
    const topic = POLL_TOPICS[cursor % POLL_TOPICS.length];
    const mode = POLL_MODES[Math.floor(cursor / POLL_TOPICS.length) % POLL_MODES.length];
    const roll = hashFor(`${workspaceId}-${i}`);
    return {
      id: `${workspaceId}-lp-${i + 1}`,
      name: `${topic} ${mode}`,
      createdAt: new Date(Date.UTC(2026, 6, 1 + i + seedIndex)).toISOString(),
      sessions: 3 + (roll % 24),
      questions: 2 + (roll % 14),
    };
  });
};

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const RESPONDENT_NAMES = [
  'Amelia', 'Noah', 'Sofia', 'Liam', 'Zoe', 'Ethan', 'Mia', 'Lucas', 'Ella', 'Mateo',
  'Ava', 'Oliver', 'Isla', 'Leo', 'Emma', 'Hugo', 'Nora', 'Felix', 'Ruby', 'Oscar',
  'Freya', 'Max', 'Lily', 'Theo', 'Chloe', 'Jasper', 'Ivy', 'Arlo', 'Grace', 'Finn',
];

const buildAnalytics = (workspaceId: string, seedIndex: number, nowIndex: number) => {
  const weekly: WeeklyPoint[] = WEEK_LABELS.map((label, k) => ({
    label,
    value: 14 + ((hashFor(`${workspaceId}-w${k}`) + k * 11) % 78) + (k === nowIndex % 7 ? 15 : 0),
  }));

  const respondents: Respondent[] = Array.from({ length: 10 }, (_, k) => {
    const start = (seedIndex * 7) % RESPONDENT_NAMES.length;
    return {
      id: `${workspaceId}-resp-${k + 1}`,
      name: RESPONDENT_NAMES[(start + k * 3) % RESPONDENT_NAMES.length],
      score: 44 + (hashFor(`${workspaceId}-r${k}`) % 55),
    };
  }).sort((a, b) => b.score - a.score);

  return { weekly, respondents };
};

const buildDashboard = (workspaceId: string, seedIndex: number, nowIndex: number): DashboardData => {
  const seed = SEED_SESSIONS[seedIndex % SEED_SESSIONS.length];
  const sessions: LivePollSession[] = seed.titles.map((title, k) => ({
    id: `${workspaceId}-session-${k + 1}`,
    title,
    type: seed.type,
    status: seed.statuses[k],
    questions: seed.questions[k],
    participants: seed.participants[k],
  }));

  const live = sessions.find(s => s.status === 'live');

  const activity: ActivityItem[] = [
    {
      id: `${workspaceId}-act-1`,
      title: live
        ? `Ran live: “${live.title}”`
        : `Scheduled “${sessions[0].title}”`,
      detail: live
        ? `${live.participants} players · ${live.questions} questions`
        : `${sessions[0].questions} questions`,
      time: '2h ago',
    },
    {
      id: `${workspaceId}-act-2`,
      title: `Created “${sessions[1].title}”`,
      detail: `${sessions[1].questions} questions ready to play`,
      time: 'Yesterday',
    },
    {
      id: `${workspaceId}-act-3`,
      title: live
        ? `Shared analytics for “${live.title}”`
        : `Reviewed feedback on “${sessions[0].title}”`,
      detail: '85% completion',
      time: '3 days ago',
    },
    {
      id: `${workspaceId}-act-4`,
      title: `Duplicated “${sessions[2].title}”`,
      detail: 'New draft created from template',
      time: 'Last week',
    },
  ];

const analytics: DashboardData['analytics'] = {
    sessionsCreated: 14 + nowIndex * 7,
    totalParticipants: 132 + nowIndex * 96,
    totalAnswers: 480 + nowIndex * 402,
    avgScore: `${64 + ((nowIndex * 7) % 21)}%`,
  };

  const { weekly, respondents } = buildAnalytics(workspaceId, seedIndex, nowIndex);

  return {
    sessions,
    activity,
    livePollRows: buildLivePollRows(workspaceId, seedIndex),
    weekly,
    respondents,
    analytics,
  };
};

const allSeedIds = [...initialMyWorkspaces, ...initialSharedWorkspaces].map(w => w.id);

const initialState: WorkspaceState = {
  selectedName: initialMyWorkspaces[0]?.name ?? null,
  selectedId: initialMyWorkspaces[0]?.id ?? null,
  recentWorkspaceNames: initialMyWorkspaces[0] ? [initialMyWorkspaces[0].name] : [],
  myWorkspaces: initialMyWorkspaces,
  sharedWorkspaces: initialSharedWorkspaces,
  dashboardByWorkspace: Object.fromEntries(
    allSeedIds.map((id, i) => [id, buildDashboard(id, i, i)]),
  ),
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    selectWorkspace: (state, action: PayloadAction<string>) => {
      const name = action.payload;
      state.selectedName = name;
      state.recentWorkspaceNames = [
        name,
        ...state.recentWorkspaceNames.filter(n => n !== name),
      ].slice(0, 3);
      const item = [...state.myWorkspaces, ...state.sharedWorkspaces].find(w => w.name === name);
      state.selectedId = item?.id ?? null;
    },
    clearWorkspace: state => {
      state.selectedName = null;
      state.selectedId = null;
    },
    renameWorkspace: (state, action: PayloadAction<{ tab: WorkspaceTab; id: string; name: string }>) => {
      const list = action.payload.tab === 'mine' ? state.myWorkspaces : state.sharedWorkspaces;
      const item = list.find(i => i.id === action.payload.id);
      if (item) {
        item.name = action.payload.name;
        if (state.selectedId === action.payload.id) state.selectedName = action.payload.name;
      }
    },
    reorderWorkspace: (
      state,
      action: PayloadAction<{ tab: WorkspaceTab; fromId: string; toId: string }>,
    ) => {
      const { tab, fromId, toId } = action.payload;
      const list = tab === 'mine' ? state.myWorkspaces : state.sharedWorkspaces;
      const from = list.findIndex(i => i.id === fromId);
      const to = list.findIndex(i => i.id === toId);
      if (from === -1 || to === -1 || from === to) return;
      const [moved] = list.splice(from, 1);
      list.splice(to, 0, moved);
    },
    addWorkspace: (state, action: PayloadAction<{ name: string; description: string }>) => {
      const id = `w-${Date.now()}`;
      state.myWorkspaces.push({
        id,
        name: action.payload.name,
        description: action.payload.description,
      });
      const seedIndex = state.myWorkspaces.length + state.sharedWorkspaces.length;
      state.dashboardByWorkspace[id] = buildDashboard(id, seedIndex, seedIndex);
    },
    deleteWorkspace: (state, action: PayloadAction<{ tab: WorkspaceTab; id: string }>) => {
      const { tab, id } = action.payload;
      const removed = [...state.myWorkspaces, ...state.sharedWorkspaces].find(i => i.id === id);
      if (tab === 'mine') {
        state.myWorkspaces = state.myWorkspaces.filter(i => i.id !== id);
      } else {
        state.sharedWorkspaces = state.sharedWorkspaces.filter(i => i.id !== id);
      }
      delete state.dashboardByWorkspace[id];
      if (removed) {
        state.recentWorkspaceNames = state.recentWorkspaceNames.filter(n => n !== removed.name);
      }
      if (state.selectedId === id) {
        state.selectedId = null;
        state.selectedName = null;
      }
    },
  },
});

export const {
  selectWorkspace,
  clearWorkspace,
  renameWorkspace,
  addWorkspace,
  deleteWorkspace,
  reorderWorkspace,
} = workspaceSlice.actions;
export default workspaceSlice.reducer;
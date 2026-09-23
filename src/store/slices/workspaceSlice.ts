import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type WorkspaceItem = {
  id: string;
  name: string;
  description: string;
};

export type WorkspaceTab = 'mine' | 'shared';

interface WorkspaceState {
  selectedName: string | null;
  myWorkspaces: WorkspaceItem[];
  sharedWorkspaces: WorkspaceItem[];
  pinnedIds: Record<WorkspaceTab, string | null>;
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

const initialState: WorkspaceState = {
  selectedName: null,
  myWorkspaces: initialMyWorkspaces,
  sharedWorkspaces: initialSharedWorkspaces,
  pinnedIds: { mine: null, shared: null },
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    selectWorkspace: (state, action: PayloadAction<string>) => {
      state.selectedName = action.payload;
    },
    clearWorkspace: state => {
      state.selectedName = null;
    },
    renameWorkspace: (state, action: PayloadAction<{ tab: WorkspaceTab; id: string; name: string }>) => {
      const list = action.payload.tab === 'mine' ? state.myWorkspaces : state.sharedWorkspaces;
      const item = list.find(i => i.id === action.payload.id);
      if (item) item.name = action.payload.name;
    },
    togglePinWorkspace: (state, action: PayloadAction<{ tab: WorkspaceTab; id: string }>) => {
      const { tab, id } = action.payload;
      state.pinnedIds[tab] = state.pinnedIds[tab] === id ? null : id;
    },
    addWorkspace: (state, action: PayloadAction<{ name: string; description: string }>) => {
      state.myWorkspaces.push({
        id: `w-${Date.now()}`,
        name: action.payload.name,
        description: action.payload.description,
      });
    },
    deleteWorkspace: (state, action: PayloadAction<{ tab: WorkspaceTab; id: string }>) => {
      const { tab, id } = action.payload;
      if (tab === 'mine') {
        state.myWorkspaces = state.myWorkspaces.filter(i => i.id !== id);
      } else {
        state.sharedWorkspaces = state.sharedWorkspaces.filter(i => i.id !== id);
      }
      if (state.pinnedIds[tab] === id) state.pinnedIds[tab] = null;
    },
  },
});

export const {
  selectWorkspace,
  clearWorkspace,
  renameWorkspace,
  togglePinWorkspace,
  addWorkspace,
  deleteWorkspace,
} = workspaceSlice.actions;
export default workspaceSlice.reducer;
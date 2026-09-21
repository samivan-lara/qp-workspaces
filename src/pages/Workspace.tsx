import { useState } from 'react';
import { WuButton, WuCard, WuInput, WuTab } from '@npm-questionpro/wick-ui-lib';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Chip } from '@/components/common/Chip';

type WorkspaceItem = {
  id: string;
  name: string;
  description: string;
};

const myWorkspaces: WorkspaceItem[] = [
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

const sharedWorkspaces: WorkspaceItem[] = [
  {
    id: 's-1',
    name: 'Executive Board',
    description: 'Board reporting, executive summaries and strategic planning sessions.',
  },
  {
    id: 's-2',
    name: 'Growth Team',
    description: 'Experimentation backlog, growth metrics and activation initiatives shared with the team.',
  },
];

const tabs = [
  { value: 'mine', label: 'My Workspaces' },
  { value: 'shared', label: 'Shared Workspaces' },
] as const;

type TabValue = (typeof tabs)[number]['value'];

const randFor = (seed: string, max = 99) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  return (hash % max) + 1;
};

function WorkspaceCard({ item }: { item: WorkspaceItem }) {
  return (
    <WuCard
      rounded
      className="group flex border border-[#B8C9EF] p-5 hover:border-[#3E67D0] hover:shadow-[inset_0_0_0_1px_#3E67D0,-2px_3px_3px_-1px_rgba(0,15,64,0.17)]">
      <div className="flex flex-col gap-4">
        <div className="flex h-[102px] flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <span className="truncate text-[18px] font-medium leading-[32px] text-[#3A424C]">
              {item.name}
            </span>
            <button
              type="button"
              aria-label={`Menu for ${item.name}`}
              title="Workspace menu"
              className="flex h-8 w-8 shrink-0 flex-col items-center justify-center gap-0.5 rounded bg-white opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 hover:bg-[rgba(0,0,0,0.04)]"
            >
              <span className="h-1 w-1 rounded-full bg-[#3A424C]" aria-hidden="true" />
              <span className="h-1 w-1 rounded-full bg-[#3A424C]" aria-hidden="true" />
              <span className="h-1 w-1 rounded-full bg-[#3A424C]" aria-hidden="true" />
            </button>
          </div>
          <p className="line-clamp-3 text-[12px] font-normal leading-[150%] text-[#3A424C]">
            {item.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip icon="wc-quiz" value={randFor(`${item.id}-polls`)} label="LivePolls" />
          <Chip icon="wm-group" value={randFor(`${item.id}-members`)} label="Members" />
        </div>
      </div>
    </WuCard>
  );
}

export default function Workspace() {
  const [activeTab, setActiveTab] = useState<TabValue>('mine');
  const [query, setQuery] = useState('');

  const sourceFor = (tab: TabValue) => (tab === 'mine' ? myWorkspaces : sharedWorkspaces);
  const filteredFor = (tab: TabValue) =>
    sourceFor(tab).filter(item => item.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="flex flex-col">
      <SectionHeader
        title="My workspaces"
        actions={<WuButton variant="primary">+ New workspace</WuButton>}
      />

      <div className="p-8">
        <div className="relative">
          <div className="pointer-events-none sticky top-16 z-20 flex justify-end">
            <div className="pointer-events-auto w-[408px]">
              <WuInput
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search workspaces"
                aria-label="Search workspaces"
                Icon={<span className="wm-search" aria-hidden="true" />}
                iconPosition="left"
                variant="outlined"
                className="h-10"
              />
            </div>
          </div>
          <WuTab
            className="-mt-10"
            orientation="horizontal"
            onValueChange={value => {
              if (value) setActiveTab(value as TabValue);
            }}
            items={tabs.map(tab => {
              const count = sourceFor(tab.value).length;
              const active = activeTab === tab.value;
              const filtered = filteredFor(tab.value);
              return {
                value: tab.value,
                Trigger: (
                  <span className="flex items-center gap-2">
                    {tab.label}
                    <span className="flex h-6 w-6 items-center justify-center rounded-[2px] bg-[#eeeeee]">
                      <span
                        className={[
                          'text-[12px] font-normal leading-none',
                          active ? 'text-[#1B87E6]' : 'text-[#545E6B]',
                        ].join(' ')}
                      >
                        {count}
                      </span>
                    </span>
                  </span>
                ),
                Content: (
                  <div className="pt-6">
                    <div className="grid grid-cols-3 gap-4">
                      {filtered.map(item => (
                        <WorkspaceCard key={item.id} item={item} />
                      ))}
                    </div>

                    {filtered.length === 0 ? (
                      <p className="mt-8 text-center text-sm text-[var(--wu-color-gray-subtle)]">
                        No workspaces match “{query}”.
                      </p>
                    ) : null}
                  </div>
                ),
              };
            })}
          />
        </div>
      </div>
    </div>
  );
}
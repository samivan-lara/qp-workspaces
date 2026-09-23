import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  WuButton,
  WuCard,
  WuFormGroup,
  WuInput,
  WuModal,
  WuModalContent,
  WuModalFooter,
  WuModalHeader,
  WuTab,
  WuTextarea,
  useWuShowToast,
} from '@npm-questionpro/wick-ui-lib';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Chip } from '@/components/common/Chip';
import { DropdownMenu } from '@/components/common/DropdownMenu';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addWorkspace,
  deleteWorkspace,
  renameWorkspace,
  selectWorkspace,
  togglePinWorkspace,
  type WorkspaceItem,
  type WorkspaceTab,
} from '@/store/slices/workspaceSlice';
import { DashboardIllustration } from './components/DashboardIllustration';

const tabs = [
  { value: 'mine', label: 'My Workspaces' },
  { value: 'shared', label: 'Shared Workspaces' },
] as const;

type TabValue = WorkspaceTab;

const randFor = (seed: string, max = 99) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  return (hash % max) + 1;
};

function WorkspaceCard({
  item,
  pinned,
  onRename,
  onPin,
  onDelete,
  onOpen,
}: {
  item: WorkspaceItem;
  pinned: boolean;
  onRename: (name: string) => void;
  onPin: () => void;
  onDelete: () => void;
  onOpen: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [draft, setDraft] = useState(item.name);
  const cancelledRef = useRef(false);
  const { showToast } = useWuShowToast();

  const startRename = () => {
    setDraft(item.name);
    setEditing(true);
  };

  const commit = () => {
    if (cancelledRef.current) {
      cancelledRef.current = false;
      return;
    }
    const name = draft.trim() || item.name;
    if (name !== item.name) {
      onRename(name);
      showToast({ message: 'The Workspace name change successfully', variant: 'success' });
    }
    setEditing(false);
  };

  const cancel = () => {
    cancelledRef.current = true;
    setEditing(false);
  };

  return (
    <WuCard
      rounded
      onClick={e => {
        if (editing) return;
        const target = e.target as HTMLElement;
        const inMenu = target.closest?.('[id^="wu-menu-portal-"]');
        const inTrigger = target.closest?.('button[title="Workspace menu"]');
        const inModal = target.closest?.('[role="dialog"], [data-wu-overlay]');
        if (inMenu || inTrigger || inModal) return;
        onOpen();
      }}
      className={[
        'group flex border p-5',
        menuOpen
          ? 'border-[#3E67D0] shadow-[inset_0_0_0_1px_#3E67D0,-2px_3px_3px_-1px_rgba(0,15,64,0.17)]'
          : 'border-[#B8C9EF] hover:border-[#3E67D0] hover:shadow-[inset_0_0_0_1px_#3E67D0,-2px_3px_3px_-1px_rgba(0,15,64,0.17)]',
      ].join(' ')}>
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex h-[102px] min-w-0 flex-col gap-2">
          <div className="flex min-w-0 items-start justify-between gap-2">
            {editing ? (
              <input
                autoFocus
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onFocus={e => e.target.select()}
                onBlur={commit}
                onKeyDown={e => {
                  if (e.key === 'Enter') commit();
                  if (e.key === 'Escape') cancel();
                }}
                aria-label="Workspace name"
                className="h-8 w-full shrink-0 border-0 border-b-2 border-b-[#1B87E6] bg-transparent px-2 pb-0.5 text-[18px] font-medium text-[#3A424C] outline-none"
              />
            ) : (
              <>
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  {pinned ? (
                    <span
                      className="material-symbols-outlined flex h-5 w-5 shrink-0 items-center justify-center text-[20px] leading-none"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      aria-hidden="true"
                    >
                      keep
                    </span>
                  ) : null}
                  <span className="min-w-0 truncate text-[18px] font-medium leading-[32px] text-[#3A424C]">
                    {item.name}
                  </span>
                </span>
                <DropdownMenu
                  open={menuOpen}
                  onOpenChange={setMenuOpen}
                  Trigger={
                    <button
                      type="button"
                      aria-label={`Menu for ${item.name}`}
                      title="Workspace menu"
                      onClick={e => e.stopPropagation()}
                      className={[
                        'flex h-8 w-8 shrink-0 flex-col items-center justify-center gap-0.5 rounded transition-opacity',
                        menuOpen
                          ? 'bg-[rgba(27,135,230,0.15)] opacity-100'
                          : 'bg-white opacity-0 group-hover:opacity-100 focus-within:opacity-100 hover:bg-[rgba(0,0,0,0.04)]',
                      ].join(' ')}
                    >
                      <span className="h-1 w-1 rounded-full bg-[#3A424C]" aria-hidden="true" />
                      <span className="h-1 w-1 rounded-full bg-[#3A424C]" aria-hidden="true" />
                      <span className="h-1 w-1 rounded-full bg-[#3A424C]" aria-hidden="true" />
                    </button>
                  }
                  options={[
                    { label: 'Rename', icon: 'wm-edit', onClick: startRename },
                    { label: 'Add member', icon: 'wm-person-add' },
                    {
                      label: pinned ? 'Unpin top view' : 'Pin top view',
                      materialIcon: pinned ? 'keep_off' : 'keep',
                      filled: true,
                      onClick: onPin,
                    },
                    {
                      label: 'Delete',
                      icon: 'wm-delete',
                      color: '#cc0000',
                      separatorBefore: true,
                      onClick: () => setDeleteOpen(true),
                    },
                  ]}
                />
              </>
            )}
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

      <WuModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        variant="critical"
        maxWidth="494px"
      >
        <WuModalHeader>Delete workspace</WuModalHeader>
        <WuModalContent>
          <p className="text-[14px] leading-[150%] text-[#3A424C]">
            Deleting <strong className="font-semibold">{item.name}</strong> workspace will erase
            everything it contains in it, including LivePolls sessions.
          </p>
          <p className="text-[14px] leading-[150%] text-[#3A424C]">This action cannot be undone.</p>
        </WuModalContent>
        <WuModalFooter>
          <WuButton
            variant="primary"
            color="error"
            onClick={() => {
              onDelete();
              setDeleteOpen(false);
              showToast({ message: 'The Workspace deleted successfully', variant: 'info' });
            }}
          >
            Delete
          </WuButton>
        </WuModalFooter>
      </WuModal>
    </WuCard>
  );
}

export default function Workspace() {
  const [activeTab, setActiveTab] = useState<TabValue>('mine');
  const [query, setQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [descDraft, setDescDraft] = useState('');
  const [nameError, setNameError] = useState<string | undefined>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useWuShowToast();
  const myWorkspaces = useAppSelector(s => s.workspace.myWorkspaces);
  const sharedWorkspaces = useAppSelector(s => s.workspace.sharedWorkspaces);
  const pinnedIds = useAppSelector(s => s.workspace.pinnedIds);

  const openCreate = () => {
    setNameDraft('');
    setDescDraft('');
    setNameError(undefined);
    setCreateOpen(true);
  };

  const createWorkspace = () => {
    const name = nameDraft.trim();
    if (!name) {
      setNameError('Workspace name is required.');
      return;
    }
    dispatch(addWorkspace({ name, description: descDraft.trim() }));
    setCreateOpen(false);
    setNameDraft('');
    setDescDraft('');
    setNameError(undefined);
    openWorkspace(name);
    showToast({ message: 'The Workspace created successfully', variant: 'success' });
  };

  const openWorkspace = (name: string) => {
    dispatch(selectWorkspace(name));
    navigate('/');
  };

  const sourceFor = (tab: TabValue) => (tab === 'mine' ? myWorkspaces : sharedWorkspaces);
  const filteredFor = (tab: TabValue) => {
    const q = query.trim().toLowerCase();
    const list = sourceFor(tab).filter(item => item.name.toLowerCase().includes(q));
    const pinned = list.filter(item => item.id === pinnedIds[tab]);
    const rest = list.filter(item => item.id !== pinnedIds[tab]);
    return [...pinned, ...rest];
  };

  const renameItem = (tab: TabValue, id: string, name: string) => {
    dispatch(renameWorkspace({ tab, id, name }));
  };

  const removeItem = (tab: TabValue, id: string) => {
    dispatch(deleteWorkspace({ tab, id }));
  };

  const pinItem = (tab: TabValue, id: string) => {
    dispatch(togglePinWorkspace({ tab, id }));
  };

  return (
    <div className="flex flex-col">
      <SectionHeader
        title="My workspaces"
        actions={
          <WuButton variant="primary" onClick={openCreate}>
            + New workspace
          </WuButton>
        }
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
                        <WorkspaceCard
                          key={item.id}
                          item={item}
                          pinned={item.id === pinnedIds[activeTab]}
                          onOpen={() => openWorkspace(item.name)}
                          onRename={name => renameItem(activeTab, item.id, name)}
                          onPin={() => pinItem(activeTab, item.id)}
                          onDelete={() => removeItem(activeTab, item.id)}
                        />
                      ))}
                    </div>

                    {filtered.length === 0 ? (
                      <div className="flex min-h-[calc(100vh-230px)] flex-col items-center justify-center">
                        <DashboardIllustration />
                        <div className="mt-5 flex flex-col items-center text-center">
                          <p className="text-[14px] font-medium leading-4 text-[#545E6B]">
                            No workspace was found
                          </p>
                          <p className="mt-1 text-[12px] font-normal leading-4 text-[#9B9B9B]">
                            Try searching whit different keyboards or choose all available options.
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ),
              };
            })}
          />
        </div>
      </div>

      <WuModal open={createOpen} onOpenChange={setCreateOpen} variant="action" maxWidth="494px">
        <WuModalHeader>New workspace</WuModalHeader>
        <WuModalContent>
          <WuFormGroup
            Label={
              <>
                Workspace name <span className="text-[var(--wu-color-red-deep)]">*</span>
              </>
            }
            Error={nameError}
            Input={
              <WuInput
                value={nameDraft}
                invalid={!!nameError}
                onChange={e => {
                  setNameDraft(e.target.value);
                  if (nameError) setNameError(undefined);
                }}
                placeholder="e.g. Design Team"
                aria-label="Workspace name"
              />
            }
          />
          <div>
            <span className="mb-1 block text-sm font-medium text-[#3A424C]">
              Description <span className="font-normal text-[var(--wu-color-gray-subtle)]">(Optional)</span>
            </span>
            <WuTextarea
              value={descDraft}
              onChange={e => setDescDraft(e.target.value)}
              placeholder="What is this workspace for?"
              aria-label="Workspace description"
            />
          </div>
        </WuModalContent>
        <WuModalFooter>
          <WuButton variant="secondary" onClick={() => setCreateOpen(false)}>
            Cancel
          </WuButton>
          <WuButton variant="primary" onClick={createWorkspace}>
            Create
          </WuButton>
        </WuModalFooter>
      </WuModal>
    </div>
  );
}
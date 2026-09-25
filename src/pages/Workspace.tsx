import { useEffect, useRef, useState, type CSSProperties } from 'react';
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
  reorderWorkspace,
  selectWorkspace,
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
  livePollCount,
  isDragSource,
  shift,
  onRename,
  onDelete,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  item: WorkspaceItem;
  livePollCount: number;
  isDragSource: boolean;
  shift: string | undefined;
  onRename: (name: string) => void;
  onDelete: () => void;
  onOpen: () => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [draft, setDraft] = useState(item.name);
  const cancelledRef = useRef(false);
  const dblRef = useRef<number | null>(null);
  const { showToast } = useWuShowToast();

  useEffect(
    () => () => {
      if (dblRef.current !== null) window.clearTimeout(dblRef.current);
    },
    [],
  );

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
      data-workspace-card
      onClick={e => {
        if (editing || isDragSource) return;
        const target = e.target as HTMLElement;
        const inMenu = target.closest?.('[id^="wu-menu-portal-"]');
        const inTrigger = target.closest?.('button[title="Workspace menu"]');
        const inModal = target.closest?.('[role="dialog"], [data-wu-overlay]');
        if (inMenu || inTrigger || inModal) return;
        const onName = !!target.closest?.('[data-rename]');
        if (onName) {
          if (dblRef.current !== null) {
            window.clearTimeout(dblRef.current);
            dblRef.current = null;
            return;
          }
          dblRef.current = window.setTimeout(() => {
            dblRef.current = null;
            onOpen();
          }, 250);
          return;
        }
        onOpen();
      }}
      draggable={!editing}
      onDragStart={e => {
        const t = e.target as HTMLElement;
        if (t.closest?.('input, button[title="Workspace menu"]')) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.effectAllowed = 'move';
        const img = new Image();
        img.src =
          'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
        e.dataTransfer.setDragImage(img, 0, 0);
        onDragStart(item.id);
      }}
      onDragEnd={e => {
        e.stopPropagation();
        onDragEnd();
      }}
      style={{
        transform: shift ?? 'none',
        opacity: isDragSource ? 0 : 1,
        transition: 'transform 260ms cubic-bezier(0.2, 0.6, 0.2, 1)',
      }}
      className={[
        'group flex w-full border p-4 transition-all duration-150',
        isDragSource
          ? '!bg-white !border-[#3E67D0] !shadow-[inset_0_0_0_1px_#3E67D0,-2px_3px_3px_-1px_rgba(0,15,64,0.17)]'
          : menuOpen
            ? '!border-[#3E67D0] !shadow-[inset_0_0_0_1px_#3E67D0,-2px_3px_3px_-1px_rgba(0,15,64,0.17)]'
            : 'bg-white border-[#B8C9EF] hover:border-[#3E67D0] hover:shadow-[inset_0_0_0_1px_#3E67D0,-2px_3px_3px_-1px_rgba(0,15,64,0.17)]',
      ].join(' ')}>
      <div className="flex min-w-0 w-full flex-col gap-4">
        <div className="flex h-[102px] min-w-0 w-full flex-col gap-2">
          <div className="flex min-w-0 w-full items-start justify-between gap-2">
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
                  <span
                    className={[
                      'h-7 w-0 shrink-0 overflow-hidden transition-[width] duration-[220ms] ease-in-out',
                      isDragSource ? 'w-7' : 'group-hover:w-7',
                    ].join(' ')}
                  >
                    <span
                      title="Drag to reorder"
                      aria-hidden="true"
                      className={[
                        'material-symbols-outlined flex h-7 w-7 cursor-grab select-none items-center justify-center rounded text-[20px] text-[#3A424C] hover:bg-black/5 active:cursor-grabbing',
                        isDragSource
                          ? 'opacity-100 transition-opacity duration-[220ms] ease-in-out'
                          : 'opacity-0 transition-opacity duration-[220ms] ease-in-out group-hover:opacity-100',
                      ].join(' ')}
                    >
                      drag_indicator
                    </span>
                  </span>
                  <span
                    data-rename
                    title="Double-click to rename"
                    className="min-w-0 cursor-text truncate text-[18px] font-medium leading-[32px] text-[#3A424C]"
                    onDoubleClick={e => {
                      e.stopPropagation();
                      startRename();
                    }}
                  >
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
          <Chip icon="wc-quiz" value={livePollCount} label="LivePolls" />
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
  const dashboards = useAppSelector(s => s.workspace.dashboardByWorkspace);

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
    return sourceFor(tab).filter(item => item.name.toLowerCase().includes(q));
  };

  const renameItem = (tab: TabValue, id: string, name: string) => {
    dispatch(renameWorkspace({ tab, id, name }));
  };

  const removeItem = (tab: TabValue, id: string) => {
    dispatch(deleteWorkspace({ tab, id }));
  };

  const moveItem = (tab: TabValue, fromId: string, toId: string) => {
    dispatch(reorderWorkspace({ tab, fromId, toId }));
  };

  const [dragState, setDragState] = useState<{ id: string; overIndex: number | null } | null>(null);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);
  const geoRef = useRef({ w: 0, h: 0, cardW: 0, cardH: 0, radius: 0 });
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!dragState) return;
    const onDrag = (e: globalThis.DragEvent) => {
      if (e.clientX || e.clientY) setGhostPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('dragover', onDrag);
    return () => window.removeEventListener('dragover', onDrag);
  }, [dragState]);

  const beginDrag = (id: string) => {
    const els = gridRef.current ? Array.from(gridRef.current.children).filter(el => el.hasAttribute('data-workspace-card')) : [];
    const rects = els.map(el => el.getBoundingClientRect());
    let w = 0;
    let h = 0;
    for (let i = 1; i < rects.length; i += 1) {
      if (Math.abs(rects[i].top - rects[0].top) < 2) {
        w = rects[i].left - rects[0].left;
        break;
      }
    }
    for (let i = 1; i < rects.length; i += 1) {
      if (rects[i].top - rects[0].top > 2) {
        h = rects[i].top - rects[0].top;
        break;
      }
    }
    const cardH = rects[0]?.height ?? 176;
    if (!h) h = cardH + 16;
    const radius = els[0] ? parseFloat(getComputedStyle(els[0]).borderTopLeftRadius) || 8 : 8;
    geoRef.current = { w, h, cardW: rects[0]?.width ?? 0, cardH, radius };
    setDragState({ id, overIndex: null });
  };

  const endDrag = () => {
    setDragState(null);
    setGhostPos(null);
  };

  const setOverIndex = (boundary: number) =>
    setDragState(s => (s && s.overIndex !== boundary ? { ...s, overIndex: boundary } : s));

  const boundaryAt = (clientX: number, clientY: number) => {
    const rect = gridRef.current?.getBoundingClientRect();
    const { w, h } = geoRef.current;
    if (!rect || !w || !h) return null;
    const fx = (clientX - rect.left) / w;
    const fy = (clientY - rect.top) / h;
    const n = gridList.length;
    return Math.max(0, Math.min(n, Math.round(fy * rowCount + fx)));
  };

  const dropAt = (boundary: number) => {
    if (!dragState) return;
    const s = gridList.findIndex(x => x.id === dragState.id);
    if (s === -1) return;
    let final = s;
    if (boundary < s) final = boundary;
    else if (boundary > s + 1) final = boundary - 1;
    if (final !== s) moveItem(activeTab, dragState.id, gridList[final].id);
    setDragState(null);
  };

  const rowCount = 3;
  const gridList = filteredFor(activeTab);
  const transforms: Record<string, string> = {};
  if (dragState) {
    const s = gridList.findIndex(x => x.id === dragState.id);
    const p = dragState.overIndex;
    if (s !== -1 && p != null) {
      const { w, h } = geoRef.current;
      const gs = (i: number) => ({ r: Math.floor(i / rowCount), c: i % rowCount });
      if (p < s) {
        for (let i = p; i < s; i += 1) {
          const cur = gs(i);
          const next = gs(i + 1);
          transforms[gridList[i].id] = `translate(${(next.c - cur.c) * w}px, ${(next.r - cur.r) * h}px)`;
        }
      } else if (p > s + 1) {
        for (let i = s + 1; i <= p - 1; i += 1) {
          const cur = gs(i);
          const prev = gs(i - 1);
          transforms[gridList[i].id] = `translate(${(prev.c - cur.c) * w}px, ${(prev.r - cur.r) * h}px)`;
        }
      }
    }
  }

  const slotStyle: CSSProperties | undefined = (() => {
    const s = dragState ? gridList.findIndex(x => x.id === dragState.id) : -1;
    const p = dragState?.overIndex;
    if (s === -1 || p == null) return undefined;
    let final = s;
    if (p < s) final = p;
    else if (p > s + 1) final = p - 1;
    if (final === s) return undefined;
    const { w, h, cardW, cardH, radius } = geoRef.current;
    if (!w || !h || !cardW || !cardH) return undefined;
    const c = final % rowCount;
    const r = Math.floor(final / rowCount);
    return {
      left: c * w,
      top: r * h,
      width: cardW,
      height: cardH,
      borderRadius: radius,
      transition:
        'left 260ms cubic-bezier(0.2, 0.6, 0.2, 1), top 260ms cubic-bezier(0.2, 0.6, 0.2, 1)',
    };
  })();

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
                    <div
                      ref={gridRef}
                      className="relative grid grid-cols-3 gap-4"
                      onDragOver={e => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        const p = boundaryAt(e.clientX, e.clientY);
                        if (p != null) setOverIndex(p);
                      }}
                      onDrop={e => {
                        e.preventDefault();
                        const p = boundaryAt(e.clientX, e.clientY);
                        if (p != null) dropAt(p);
                      }}
                      onDragLeave={e => {
                        const next = e.relatedTarget as Node | null;
                        if (gridRef.current && !gridRef.current.contains(next)) {
                          setDragState(s => (s ? { ...s, overIndex: null } : s));
                        }
                      }}
                    >
                      {slotStyle ? (
                        <div
                          className="pointer-events-none absolute bg-[#DDEBF7]/50"
                          style={slotStyle}
                        />
                      ) : null}
                      {dragState && ghostPos
                        ? (() => {
                            const gi = gridList.find(x => x.id === dragState.id);
                            if (!gi) return null;
                            const { cardW, cardH, radius } = geoRef.current;
                            return (
                              <div
                                className="pointer-events-none fixed flex flex-col justify-between border border-[#3E67D0] bg-white shadow-[inset_0_0_0_1px_#3E67D0,-2px_3px_3px_-1px_rgba(0,15,64,0.17)]"
                                style={{
                                  left: ghostPos.x - cardW / 2,
                                  top: ghostPos.y - cardH / 2,
                                  width: cardW,
                                  height: cardH,
                                  borderRadius: radius,
                                  zIndex: 50,
                                }}
                              >
                                <div className="flex flex-col gap-2 p-4">
                                  <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[rgba(27,135,230,0.15)] text-[20px] text-[#3A424C]">
                                      drag_indicator
                                    </span>
                                    <span className="truncate text-[18px] font-medium leading-[32px] text-[#3A424C]">
                                      {gi.name}
                                    </span>
                                  </span>
                                  <p className="line-clamp-3 text-[12px] font-normal leading-[150%] text-[#3A424C]">
                                    {gi.description}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2 px-4 pb-4">
                                  <Chip icon="wc-quiz" value={1} label="LivePolls" />
                                  <Chip icon="wm-group" value={1} label="Members" />
                                </div>
                              </div>
                            );
                          })()
                        : null}
                      {filtered.map(item => {
                        const isDragSource = dragState?.id === item.id;
                        return (
                          <WorkspaceCard
                            key={item.id}
                            item={item}
                            livePollCount={dashboards[item.id]?.livePollRows.length ?? 0}
                            isDragSource={isDragSource}
                            shift={transforms[item.id]}
                            onOpen={() => openWorkspace(item.name)}
                            onRename={name => renameItem(activeTab, item.id, name)}
                            onDelete={() => removeItem(activeTab, item.id)}
                            onDragStart={beginDrag}
                            onDragEnd={endDrag}
                          />
                        );
                      })}
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

      <WuModal
          open={createOpen}
          onOpenChange={setCreateOpen}
          variant="action"
          maxWidth="494px"
          preventClickOutside
        >
        <WuModalHeader>New workspace</WuModalHeader>
        <WuModalContent style={{ gap: 20 }}>
          <WuFormGroup
            Label={
              <span>
                Workspace name{' '}
                <span className="text-[var(--wu-color-red-deep)]">*</span>
              </span>
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
            <span className="mb-1 block text-sm font-normal leading-[21px] text-[#545E6B]">
              Description
            </span>
            <WuTextarea
              value={descDraft}
              onChange={e => setDescDraft(e.target.value)}
              placeholder="What is this workspace for?"
              aria-label="Workspace description"
              style={{
                height: 64,
                maxHeight: 64,
                resize: 'none',
                fontSize: 12,
                lineHeight: '16px',
                borderRadius: '4px 4px 0 0',
              }}
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  WuMenu,
  WuMenuItem,
  WuMenuItemGroup,
  WuMenuSeparatorItem,
  useWuSidebar,
} from '@npm-questionpro/wick-ui-lib';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectWorkspace } from '@/store/slices/workspaceSlice';
import type { WorkspaceItem } from '@/store/slices/workspaceSlice';

const initialsOf = (name: string) => name.replace(/\s+/g, '').slice(0, 2).toUpperCase();

interface WorkspaceSwitcherProps {
  active: boolean;
  variant?: 1 | 2;
}

export function WorkspaceSwitcher({ active, variant = 1 }: WorkspaceSwitcherProps) {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { state: sidebarState } = useWuSidebar();
  const collapsed = sidebarState === 'collapsed';
  const myWorkspaces = useAppSelector(s => s.workspace.myWorkspaces);
  const sharedWorkspaces = useAppSelector(s => s.workspace.sharedWorkspaces);
  const selectedName = useAppSelector(s => s.workspace.selectedName);

  const latestShared =
    sharedWorkspaces.find(w => w.name === selectedName) ?? sharedWorkspaces[0] ?? null;

  const v2Options: WorkspaceItem[] = [...myWorkspaces.slice(0, 3), ...(latestShared ? [latestShared] : [])];

  const openWorkspace = (name: string) => {
    dispatch(selectWorkspace(name));
    navigate('/');
  };

  return (
    <li
      data-sidebar="menu-item"
      className="wu-group/menu-item wu-relative wu-flex wu-items-center wu-gap-2 wu-px-2"
    >
      <WuMenu
        open={open}
        onOpenChange={setOpen}
        position={{ align: 'start', side: 'bottom', sideOffset: 4 }}
        slots={{ popup: { width: '248px' } }}
        Trigger={
          <button
            type="button"
            data-sidebar="menu-button"
            data-size="default"
            data-active={active}
            className={`ws-swt-trigger wu-peer/menu-button wu-flex wu-w-full wu-items-center wu-gap-2 wu-overflow-hidden wu-rounded-md wu-p-2 wu-text-left wu-text-sm wu-outline-none wu-transition-[width,height,padding] focus-visible:wu-ring-2 wu-h-8 wu-cursor-pointer wu-text-blue-q hover:wu-bg-blue-sidebarHover group-data-[collapsible=icon]:!wu-size-8 group-data-[collapsible=icon]:!wu-p-2${open ? ' ws-swt-trigger-open' : ''}`}
          >
            <div className="wu-flex wu-w-full wu-items-center wu-overflow-hidden wu-text-base wu-truncate wu-text-ellipsis">
              <div className="wu-relative wu-right-1">
                <span className="material-symbols-outlined">workspaces</span>
              </div>
              <span
                className={`wu-text-sm wu-leading-4 wu-transition-opacity wu-duration-150${collapsed ? ' wu-opacity-0' : ''}`}
              >
                Workspace
              </span>
            </div>
          </button>
        }
      >
        {variant === 1 ? (
          <>
            {myWorkspaces.length > 0 ? (
              <WuMenuItemGroup
                className="ws-swt-group"
                Label={<span className="ws-swt-group-label">My Workspaces</span>}
              >
                {myWorkspaces.slice(0, 3).map(item => (
                  <WuMenuItem key={item.id} className="ws-swt-item" onClick={() => openWorkspace(item.name)}>
                    <span className="ws-swt-initials" aria-hidden="true">
                      {initialsOf(item.name)}
                    </span>
                    <span className="min-w-0 truncate">{item.name}</span>
                  </WuMenuItem>
                ))}
              </WuMenuItemGroup>
            ) : null}
            {latestShared ? (
              <WuMenuItemGroup
                className="ws-swt-group"
                Label={<span className="ws-swt-group-label">Shared workspaces</span>}
              >
                <WuMenuItem className="ws-swt-item" onClick={() => openWorkspace(latestShared.name)}>
                  <span className="ws-swt-initials" aria-hidden="true">
                    {initialsOf(latestShared.name)}
                  </span>
                  <span className="min-w-0 truncate">{latestShared.name}</span>
                </WuMenuItem>
              </WuMenuItemGroup>
            ) : null}
          </>
        ) : (
          <>
            <div className="ws-swt-v2-header">Workspaces</div>
            <WuMenuSeparatorItem />
            {v2Options.map(item => (
              <WuMenuItem key={item.id} className="ws-swt-item" onClick={() => openWorkspace(item.name)}>
                <span className="min-w-0 truncate">{item.name}</span>
              </WuMenuItem>
            ))}
          </>
        )}
        <WuMenuSeparatorItem />
        <WuMenuItem className="ws-swt-see-all" onClick={() => navigate('/workspace')}>
          See all workspaces
        </WuMenuItem>
      </WuMenu>
    </li>
  );
}
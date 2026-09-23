import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  WuAppHeader,
  WuButton,
  WuFooter,
  WuSidebar,
  WuSidebarContent,
  WuSidebarFooter,
  WuSidebarGroup,
  WuSidebarItem,
  WuSidebarMenu,
  WuToast,
} from '@npm-questionpro/wick-ui-lib';
import { LabSettingsPanel } from '../lab/LabSettingsPanel';
import { useAppSelector } from '@/store/hooks';

const pageLabel = (path: string) => {
  if (path === '/workspace') return 'Workspaces';
  if (path === '/livepolls') return 'LivePolls';
  if (path === '/archive') return 'Archive';
  if (path === '/settings') return 'Settings';
  if (path === '/about') return 'About';
  return 'Home';
};

const categories = [
  {
    name: 'UX Architecture',
    logo: 'wm-home',
    products: [
      { name: 'Home', link: '/', icon: 'wm-home' },
      { name: 'About', link: '/about', icon: 'wc-analytics' },
    ],
  },
  {
    name: 'Resources',
    logo: 'wc-document',
    products: [{ name: 'Docs', link: 'https://wick-ui.questionpro.com', icon: 'wc-document' }],
  },
];

const navItems = [
  { to: '/', label: 'Home', icon: 'wm-home' },
] as const;

export function Layout() {
  const location = useLocation();
  const selectedName = useAppSelector(s => s.workspace.selectedName);
  const [labOpen, setLabOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('lab-settings-open') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lab-settings-open', labOpen ? '1' : '0');
    } catch {
      // ignore
    }
    document.body.classList.toggle('lab-settings-panel-open', labOpen);
    return () => document.body.classList.remove('lab-settings-panel-open');
  }, [labOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && labOpen) setLabOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [labOpen]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <WuToast />
      <WuAppHeader
        productName="LivePolls"
        categories={categories}
        user={{
          profile: {
            title: 'Design Team',
            subtitle: 'design@questionpro.com',
            initials: 'DT',
          },
        }}
        onLogout={() => console.log('logout')}
      >
        {selectedName && location.pathname !== '/workspace' ? (
          <div className="wu-flex wu-items-center wu-justify-between wu-w-full">
            <nav className="wu-breadcrumb-nav" aria-label="Breadcrumb">
              <Link to="/workspace" className="wu-breadcrumb-link">
                <span className="block max-w-[150px] truncate">Workspaces</span>
              </Link>
              <span className="wm-arrow-forward-ios wu-breadcrumb-separator" aria-hidden="true" />
              <span className="wu-breadcrumb-page">
                <span className="block max-w-[250px] truncate">{pageLabel(location.pathname)}</span>
              </span>
            </nav>
          </div>
        ) : null}
      </WuAppHeader>

      {/* Sidebar + content row: sidebar and footer live at the same visual level (footer is inside the inset beside the sidebar, not full-width below it) */}
      <div className="flex flex-1 min-h-0">
        <WuSidebar
          defaultOpen
          Sidebar={
            <>
              <WuSidebarContent>
                <div className="wu-flex wu-flex-col wu-gap-1">
                  <WuSidebarMenu className="workspace-item">
                    <WuSidebarItem
                      Icon={<span className="material-symbols-outlined">workspaces</span>}
                      isActive={location.pathname === '/workspace'}
                    >
                      <Link to="/workspace">Workspace</Link>
                    </WuSidebarItem>
                  </WuSidebarMenu>

                  <WuSidebarMenu>
                    {navItems.map(item => (
                      <WuSidebarItem
                        key={item.to}
                        Icon={<span className={item.icon} aria-hidden="true" />}
                        isActive={location.pathname === item.to}
                      >
                        <Link to={item.to}>{item.label}</Link>
                      </WuSidebarItem>
                    ))}
                    <WuSidebarItem
                      Icon={<span className="wc-quiz" aria-hidden="true" />}
                      isActive={location.pathname === '/livepolls'}
                    >
                      <Link to="/livepolls">LivePolls</Link>
                    </WuSidebarItem>
                  </WuSidebarMenu>
                </div>


                <WuSidebarGroup label="Resources">
                  <WuSidebarMenu>
                    <WuSidebarItem Icon={<span className="wc-document" aria-hidden="true" />}>
                      <a href="https://wick-ui.questionpro.com" target="_blank" rel="noreferrer">
                        WickUI Docs
                      </a>
                    </WuSidebarItem>
                    <WuSidebarItem Icon={<span className="wc-analytics" aria-hidden="true" />}>
                      <a href="https://questionpro.com" target="_blank" rel="noreferrer">
                        QuestionPro
                      </a>
                    </WuSidebarItem>
                  </WuSidebarMenu>
                </WuSidebarGroup>
              </WuSidebarContent>

              <WuSidebarFooter>
                <WuSidebarMenu>
                  <WuSidebarItem
                    Icon={<span className="wm-archive" aria-hidden="true" />}
                    isActive={location.pathname === '/archive'}
                  >
                    <Link to="/archive">Archive</Link>
                  </WuSidebarItem>
                  <WuSidebarItem
                    Icon={<span className="wm-settings" aria-hidden="true" />}
                    isActive={location.pathname === '/settings'}
                  >
                    <Link to="/settings">Settings</Link>
                  </WuSidebarItem>
                </WuSidebarMenu>
              </WuSidebarFooter>
            </>
          }
        >
          {/* Inset: single header per page (SectionHeader h-16 px-4 border rgba) + content + footer — no duplicate toolbar */}
          <div className="flex min-h-0 flex-1 flex-col bg-[var(--wu-bg)]">
            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>

            <WuFooter>
              <div className="flex w-full items-center justify-between gap-2">
                <span>LivePolls · Information architecture © {new Date().getFullYear()}</span>
                <WuButton
                  iconOnly
                  size="sm"
                  variant="secondary"
                  aria-label="Lab settings"
                  title="Lab settings"
                  aria-expanded={labOpen}
                  aria-controls="labSettingsPanel"
                  className="lab-settings-trigger"
                  onClick={() => setLabOpen(v => !v)}
                  Icon={
                    <span className="wm-experiment" aria-hidden="true" style={{ color: '#545E6B' }} />
                  }
                />
              </div>
            </WuFooter>
          </div>
        </WuSidebar>
        <LabSettingsPanel open={labOpen} onClose={() => setLabOpen(false)} />
      </div>
    </div>
  );
}

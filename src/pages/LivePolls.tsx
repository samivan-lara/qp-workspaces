import { WuButton, WuTable, WuMenu, WuMenuItem } from '@npm-questionpro/wick-ui-lib';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useAppSelector } from '@/store/hooks';
import type { LivePollRow } from '@/store/slices/workspaceSlice';
import { formatDate } from '@/utils/format';

const ActionsCell = () => (
  <div className="row-actions flex w-[168px] items-center justify-end gap-1">
    <WuButton
      iconOnly
      size="sm"
      variant="outlined"
      aria-label="Start a session"
      title="Start a session"
      onClick={() => console.log('start session')}
    >
      <span className="wm-play-circle" aria-hidden="true" />
    </WuButton>
    <WuButton
      iconOnly
      size="sm"
      variant="outlined"
      aria-label="Analytics"
      title="Analytics"
      onClick={() => console.log('analytics')}
    >
      <span className="wc-analytics" aria-hidden="true" />
    </WuButton>
    <WuButton
      iconOnly
      size="sm"
      variant="outlined"
      aria-label="Duplicate"
      title="Duplicate"
      onClick={() => console.log('duplicate')}
    >
      <span className="wm-content-copy" aria-hidden="true" />
    </WuButton>
    <WuMenu
      Trigger={
        <WuButton iconOnly size="sm" variant="outlined" aria-label="More options" title="More options">
          <span className="wm-more-vert" aria-hidden="true" />
        </WuButton>
      }
    >
      <WuMenuItem onClick={() => console.log('rename')}>Rename</WuMenuItem>
      <WuMenuItem
        style={{ color: 'var(--wu-error-fg,var(--wu-color-red-600,#d92d20))' }}
        onClick={() => console.log('delete')}
      >
        Delete
      </WuMenuItem>
    </WuMenu>
  </div>
);

export default function LivePolls() {
  const dashboard = useAppSelector(s => {
    const id = s.workspace.selectedId ?? s.workspace.myWorkspaces[0]?.id ?? null;
    return id ? s.workspace.dashboardByWorkspace[id] : undefined;
  });
  const rows: LivePollRow[] = dashboard?.livePollRows ?? [];

  return (
    <div className="flex flex-col">
      <SectionHeader title="LivePolls" actions={<WuButton variant="primary">New poll</WuButton>} />
      <div className="mx-auto w-full max-w-6xl space-y-6 p-8">
        <div className="overflow-hidden rounded-lg bg-white p-2">
          <WuTable
            className="livepolls-table"
            size="default"
            variant="unstyled"
            columns={[
              {
                accessorKey: 'name',
                enableSorting: true,
                header: 'Name',
                cell: info => (
                  <span className="font-medium text-[#1b3380]">{info.getValue<string>()}</span>
                ),
              },
              { accessorKey: 'createdAt', header: 'Date created', cell: info => formatDate(info.getValue<string>()) },
              { accessorKey: 'sessions', header: 'Sessions' },
              { accessorKey: 'questions', header: 'Questions' },
              { accessorKey: 'id', header: '', enableSorting: false, cell: () => <ActionsCell /> },
            ]}
            data={rows}
          />
        </div>
      </div>
    </div>
  );
}
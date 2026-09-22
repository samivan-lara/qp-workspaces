import { WuButton, WuTable, WuMenu, WuMenuItem } from '@npm-questionpro/wick-ui-lib';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatDate } from '@/utils/format';

type LivePoll = {
  id: string;
  name: string;
  createdAt: string;
  sessions: number;
  questions: number;
};

const livePolls: LivePoll[] = [
  { id: 'lp-1', name: 'Coffee Break Preferences', createdAt: '2026-08-02T10:00:00Z', sessions: 12, questions: 8 },
  { id: 'lp-2', name: 'Team Spirit Check-in', createdAt: '2026-08-11T14:30:00Z', sessions: 7, questions: 5 },
  { id: 'lp-3', name: 'Product Feedback Pulse', createdAt: '2026-08-19T09:15:00Z', sessions: 21, questions: 12 },
  { id: 'lp-4', name: 'Slack Etiquette 101', createdAt: '2026-08-27T16:45:00Z', sessions: 4, questions: 6 },
  { id: 'lp-5', name: 'Lunch Menu Vote', createdAt: '2026-09-03T12:00:00Z', sessions: 18, questions: 3 },
  { id: 'lp-6', name: 'Friday Retro Questions', createdAt: '2026-09-12T10:20:00Z', sessions: 9, questions: 10 },
];

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
            data={livePolls}
          />
        </div>
      </div>
    </div>
  );
}
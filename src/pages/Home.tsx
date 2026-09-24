import { useEffect, useState, type CSSProperties } from 'react';
import { WuButton } from '@npm-questionpro/wick-ui-lib';
import { useAppSelector } from '@/store/hooks';
import { SectionHeader } from '@/components/common/SectionHeader';
import type {
  ActivityItem,
  DashboardData,
  LivePollSession,
  Respondent,
  SessionStatus,
  WeeklyPoint,
} from '@/store/slices/workspaceSlice';

const statusStyles: Record<SessionStatus, { label: string; className: string }> = {
  live: { label: 'Live', className: 'bg-[#DEF8EA] text-[#0E8A4E]' },
  scheduled: { label: 'Scheduled', className: 'bg-[#FFF4E5] text-[#9A6206]' },
  draft: { label: 'Draft', className: 'bg-[#F0F2F5] text-[#6B7280]' },
};

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

function useCountUp(target: number, delayMs = 220) {
  const [value, setValue] = useState(target);
  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const delayStart = performance.now() + delayMs;
    const duration = 750;
    const tick = (now: number) => {
      if (now < delayStart) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (start === null) start = now;
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, delayMs]);
  return value;
}

function StatFigure({
  label,
  target,
  suffix,
  note,
  delayMs,
}: {
  label: string;
  target: number;
  suffix?: string;
  note: string;
  delayMs: number;
}) {
  const value = useCountUp(target, 220 + delayMs);
  return (
    <div className="home-rise rounded-lg bg-[#F5F8FF] p-4" style={delay(delayMs)}>
      <p className="text-[12px] font-normal text-[#545E6B]">{label}</p>
      <p className="mt-1.5 text-[28px] font-semibold leading-none text-[#1B327E]">
        {value.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-1.5 text-[11px] text-[#9B9B9B]">{note}</p>
    </div>
  );
}

function SessionRow({ session }: { session: LivePollSession }) {
  const status = statusStyles[session.status];
  return (
    <li className="flex items-center gap-3 py-3.5 first:pt-2 last:pb-0">
      <button
        type="button"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1B327E] text-white transition-opacity hover:opacity-90"
        aria-label={`Start ${session.title}`}
        title="Start session"
        onClick={() => console.log('start', session.title)}
      >
        <span className="wm-play-circle" aria-hidden="true" style={{ fontSize: 18 }} />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium leading-5 text-[#3A424C]">{session.title}</p>
        <p className="mt-0.5 truncate text-[12px] leading-4 text-[#9B9B9B]">
          {session.type} · {session.questions} questions · {session.participants} players
        </p>
      </div>
      <span className={`shrink-0 rounded px-2 py-1 text-[11px] leading-[14px] ${status.className}`}>
        {status.label}
      </span>
    </li>
  );
}

function SessionsPanel({ sessions }: { sessions: LivePollSession[] }) {
  return (
    <section
      aria-label="LivePolls sessions"
      className="home-rise lg:col-span-5 lg:col-start-1 lg:row-start-1"
    >
      <div className="flex h-full flex-col rounded-lg bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-medium text-[#545E6B]">LivePolls sessions</h3>
        </div>
        <ul className="mt-1 divide-y divide-[rgba(27,51,128,0.08)]">
          {sessions.map(session => (
            <SessionRow key={session.id} session={session} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2F7FF] text-[#1B87E6]">
        <span className="wm-play-circle" aria-hidden="true" style={{ fontSize: 14 }} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-[#3A424C]">{item.title}</p>
        {item.detail ? <p className="truncate text-[12px] text-[#9B9B9B]">{item.detail}</p> : null}
      </div>
      <span className="shrink-0 text-[12px] text-[#9B9B9B]">{item.time}</span>
    </li>
  );
}

function ActivityPanel({ items }: { items: ActivityItem[] }) {
  return (
    <section
      aria-label="Recent activity"
      className="home-rise lg:col-span-5 lg:col-start-1 lg:row-start-2"
      style={delay(60)}
    >
      <div className="flex h-full flex-col rounded-lg bg-white p-5">
        <h3 className="text-[15px] font-medium text-[#545E6B]">Recent activity</h3>
        <ul className="mt-3 divide-y divide-[rgba(27,51,128,0.08)]">
          {items.map(item => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function Chart({ weekly }: { weekly: WeeklyPoint[] }) {
  const max = Math.max(...weekly.map(p => p.value));
  return (
    <div className="mt-5">
      <p className="text-[12px] font-normal text-[#9B9B9B]">Polls created this week</p>
      <div className="mt-3 flex h-[96px] items-end justify-between gap-2">
        {weekly.map((point, i) => {
          const height = Math.max(10, Math.round((point.value / max) * 100));
          return (
            <div key={point.label} className="flex w-full flex-col items-center gap-1">
              <span className="text-[10px] leading-none text-[#545E6B]">{point.value}</span>
              <div
                className="home-chart-bar w-full rounded-t bg-gradient-to-t from-[#1B327E] to-[#1B87E6]"
                style={{ ...delay(140 + i * 45), height: `${height}%` }}
              />
              <span className="text-[10px] leading-none text-[#9B9B9B]">{point.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RespondentRow({ person, index }: { person: Respondent; index: number }) {
  return (
    <li className="flex items-center gap-3 py-[5px]">
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium uppercase text-white"
        style={{ backgroundColor: index % 2 === 0 ? '#1B327E' : '#1B87E6' }}
      >
        {person.name.slice(0, 2)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-medium leading-4 text-[#3A424C]">{person.name}</p>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#EEF2FA]">
          <div
            className="home-rank-bar h-full rounded-full bg-gradient-to-r from-[#1B327E] to-[#1B87E6]"
            style={{ ...delay(200 + index * 45), width: `${person.score}%` }}
          />
        </div>
      </div>
      <span className="shrink-0 text-[12px] font-medium text-[#545E6B]">{person.score}%</span>
    </li>
  );
}

function AnalyticsPanel({ dashboard }: { dashboard: DashboardData }) {
  return (
    <section
      aria-label="Analytics"
      className="home-rise lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1"
      style={delay(30)}
    >
      <div className="flex h-full flex-col rounded-lg bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-medium text-[#545E6B]">Analytics</h3>
          <span className="rounded bg-[#F5F8FF] px-2 py-1 text-[11px] leading-[14px] text-[#1B327E]">
            Last 30 days
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatFigure
            label="Sessions created"
            target={dashboard.analytics.sessionsCreated}
            note="Total in this workspace"
            delayMs={0}
          />
          <StatFigure
            label="Participants"
            target={dashboard.analytics.totalParticipants}
            note="Across all sessions"
            delayMs={60}
          />
          <StatFigure
            label="Answers collected"
            target={dashboard.analytics.totalAnswers}
            note="Questions answered"
            delayMs={120}
          />
          <StatFigure
            label="Average score"
            target={parseInt(dashboard.analytics.avgScore, 10)}
            suffix="%"
            note="Last 30 days"
            delayMs={180}
          />
        </div>

        <Chart weekly={dashboard.weekly} />

        <div className="mt-5 border-t border-[rgba(27,51,128,0.08)] pt-4">
          <p className="text-[13px] font-medium text-[#3A424C]">Top 10 respondents</p>
          <ul className="mt-2">
            {dashboard.respondents.map((person, i) => (
              <RespondentRow key={person.id} person={person} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const selectedName = useAppSelector(s => s.workspace.selectedName);
  const myWorkspaces = useAppSelector(s => s.workspace.myWorkspaces);
  const dashboard = useAppSelector(s => {
    const id = s.workspace.selectedId ?? s.workspace.myWorkspaces[0]?.id ?? null;
    return id ? s.workspace.dashboardByWorkspace[id] : undefined;
  });

  const title = selectedName ?? myWorkspaces[0]?.name ?? 'Workspaces';

  return (
    <div className="flex flex-col">
      <SectionHeader title={title} actions={<WuButton variant="primary">New session</WuButton>} />
      {dashboard ? (
        <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-12">
          <SessionsPanel sessions={dashboard.sessions} />
          <ActivityPanel items={dashboard.activity} />
          <AnalyticsPanel dashboard={dashboard} />
        </div>
      ) : (
        <div className="p-8">
          <p className="text-sm text-[#9B9B9B]">No workspace selected.</p>
        </div>
      )}
    </div>
  );
}
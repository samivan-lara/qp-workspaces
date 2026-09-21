import type { ReactNode } from 'react';

type SectionHeaderProps = {
  title: string;
  actions?: ReactNode;
  className?: string;
};

export function SectionHeader({ title, actions, className }: SectionHeaderProps) {
  return (
    <header
      className={[
        'sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b bg-white px-8',
        'border-[rgba(27,51,128,0.08)]',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <h2 className="truncate text-2xl font-normal leading-8 text-[#545E6B]">{title}</h2>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}

type ChipProps = {
  label: string;
  icon?: string;
  value?: string | number;
};

export function Chip({ label, icon = 'wm-tag', value }: ChipProps) {
  return (
    <span className="flex items-center gap-1 rounded bg-[#F5F8FF] px-1.5 py-1">
      {icon ? (
        <span
          className={`${icon} flex h-4 w-4 items-center justify-center text-[16px] leading-none text-[#1B327E]`}
          aria-hidden="true"
        />
      ) : null}
      {value !== undefined ? (
        <span className="text-[12px] font-normal leading-[16px] text-[#1B327E]">{value}</span>
      ) : null}
      <span className="text-[12px] font-normal leading-[16px] text-[#1B327E]">{label}</span>
    </span>
  );
}
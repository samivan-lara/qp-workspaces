import { WuHeading, WuText, WuCard, WuButton } from '@npm-questionpro/wick-ui-lib';
import { SectionHeader } from '@/components/common/SectionHeader';

export default function Settings() {
  return (
    <div className="flex flex-col">
      <SectionHeader title="Settings" actions={<WuButton variant="primary">Save</WuButton>} />
      <div className="mx-auto w-full max-w-5xl space-y-6 p-8">
        <WuText size="md">Manage application preferences and configuration.</WuText>

        <WuCard>
          <div className="p-6">
            <WuHeading size="sm">General</WuHeading>
            <WuText size="sm" className="mt-1 text-[var(--wu-color-gray-subtle)]">
              Settings options will be available here.
            </WuText>
          </div>
        </WuCard>
      </div>
    </div>
  );
}

import { WuHeading, WuText, WuCard, WuButton } from '@npm-questionpro/wick-ui-lib';
import { SectionHeader } from '@/components/common/SectionHeader';

export default function Archive() {
  return (
    <div className="flex flex-col">
      <SectionHeader title="Archive" actions={<WuButton variant="secondary">Restore</WuButton>} />
      <div className="mx-auto w-full max-w-5xl space-y-6 p-8">
        <WuText size="md">
          Browse archived items. This is a placeholder for the archive view.
        </WuText>

        <WuCard>
          <div className="p-6">
            <WuHeading size="sm">No archived items</WuHeading>
            <WuText size="sm" className="mt-1 text-[var(--wu-color-gray-subtle)]">
              Archived projects and surveys will appear here.
            </WuText>
          </div>
        </WuCard>
      </div>
    </div>
  );
}

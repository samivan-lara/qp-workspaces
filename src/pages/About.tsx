import { WuHeading, WuText, WuCard, WuButton } from '@npm-questionpro/wick-ui-lib';
import { Link } from 'react-router-dom';
import { SectionHeader } from '@/components/common/SectionHeader';

export default function About() {
  return (
    <div className="flex flex-col">
      <SectionHeader
        title="About"
        actions={
          <Link to="/">
            <WuButton variant="secondary">Back home</WuButton>
          </Link>
        }
      />
      <div className="mx-auto w-full max-w-5xl space-y-6 p-8">
        <WuText size="md">
          This project is a Vite + React + TypeScript scaffold with WickUI, Tailwind CSS, React
          Router and Redux Toolkit – tuned for QuestionPro’s design system.
        </WuText>

        <WuCard>
          <div className="p-6 space-y-4">
            <WuHeading size="md">Project structure</WuHeading>
            <pre className="rounded-lg bg-gray-900 p-4 text-xs leading-5 text-gray-100">
              {`src/
  components/  → reusable UI (layout, common)
  pages/       → route components (Home, About)
  hooks/       → custom hooks
  utils/       → helpers
  assets/      → static files
  api/         → fetch client
  store/       → Redux Toolkit`}
            </pre>
            <Link to="/">
              <WuButton variant="secondary">Back home</WuButton>
            </Link>
          </div>
        </WuCard>
      </div>
    </div>
  );
}

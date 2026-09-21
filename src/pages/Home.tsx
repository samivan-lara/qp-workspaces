import { WuCard, WuButton, WuHeading, WuText } from '@npm-questionpro/wick-ui-lib';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { increment, decrement, reset } from '@/store/slices/counterSlice';
import { SectionHeader } from '@/components/common/SectionHeader';

export default function Home() {
  const count = useAppSelector(s => s.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col">
      <SectionHeader
        title="QP UX Architecture"
        actions={<WuButton variant="primary">Get started</WuButton>}
      />
      <div className="mx-auto w-full max-w-5xl space-y-6 p-8">
        <WuText size="md" className="text-[var(--wu-color-gray-subtle)]">
          Reusable UX foundation powered by WickUI + Tailwind CSS · React 19 + Vite + Redux Toolkit
        </WuText>

        <div className="grid gap-6 md:grid-cols-2">
          <WuCard>
            <div className="p-6 space-y-4">
              <WuHeading size="md">Redux Counter</WuHeading>
              <WuText>Demonstrates Redux Toolkit slice integration.</WuText>
              <div className="flex items-center gap-3">
                <WuButton variant="secondary" onClick={() => dispatch(decrement())}>
                  −
                </WuButton>
                <span className="min-w-12 text-center text-2xl font-semibold tabular-nums">
                  {count}
                </span>
                <WuButton variant="primary" onClick={() => dispatch(increment())}>
                  +
                </WuButton>
                <WuButton variant="outlined" onClick={() => dispatch(reset())} className="ml-auto">
                  Reset
                </WuButton>
              </div>
            </div>
          </WuCard>

          <WuCard>
            <div className="p-6 space-y-3">
              <WuHeading size="md">Styling stack</WuHeading>
              <ul className="list-disc pl-5 text-sm leading-6 text-[var(--wu-color-gray-lead)]">
                <li>
                  <span className="font-medium">WickUI</span> – design tokens via{' '}
                  <code className="rounded bg-gray-100 px-1">--wu-*</code> + components
                </li>
                <li>
                  <span className="font-medium">Tailwind CSS 3.4</span> – utility layer on top of
                  WickUI variables
                </li>
                <li>CSS Modules / custom overrides scoped where needed</li>
              </ul>
              <div className="flex gap-2">
                <WuButton variant="outlined" size="sm">
                  Docs
                </WuButton>
                <WuButton variant="primary" size="sm">
                  Get started <span className="wc-analytics ml-1" aria-hidden />
                </WuButton>
              </div>
            </div>
          </WuCard>
        </div>

        <WuCard>
          <div className="p-6">
            <WuHeading size="sm">Environment</WuHeading>
            <WuText size="sm" className="mt-1 font-mono text-xs">
              VITE_API_URL = {import.meta.env.VITE_API_URL}
            </WuText>
          </div>
        </WuCard>
      </div>
    </div>
  );
}

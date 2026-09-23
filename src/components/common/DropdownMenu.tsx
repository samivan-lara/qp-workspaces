import { Fragment } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { WuMenu, WuMenuItem, WuMenuSeparatorItem } from '@npm-questionpro/wick-ui-lib';

export type DropdownMenuOption = {
  label: ReactNode;
  /** Wick icon class, e.g. 'wm-edit', 'wm-content-copy', 'wm-delete'. Rendered at 16x16px. */
  icon?: string;
  /** Material Symbols icon name (e.g. 'keep'), rendered at 16px. Alternative to `icon`. */
  materialIcon?: string;
  /** Renders the Material Symbols icon with a filled style (FILL axis = 1). @default false */
  filled?: boolean;
  /** Icon + label color override (e.g. '#cc0000' for destructive options). */
  color?: string;
  /** Render the 1px spacer above this option. */
  separatorBefore?: boolean;
  onClick?: () => void;
};

type DropdownMenuProps = {
  Trigger: ReactElement<HTMLButtonElement>;
  options: DropdownMenuOption[];
  /** Popup width. @default '160px' */
  width?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * Standard dropdown menu — format is enforced by the CSS in src/index.css.
 * Popup: 160px wide, 8px radius, 1px #F0F8FF stroke, 4px padding all around.
 * Options: 32px tall, 4px radius, #EEEEEE hover fill, 16px icon + 12px/16px #3A424C label, 8px gap.
 * Spacer: 1px line with 4px top/bottom + 8px left/right padding.
 */
export function DropdownMenu({ Trigger, options, width = '160px', open, onOpenChange }: DropdownMenuProps) {
  return (
    <WuMenu
      open={open}
      onOpenChange={onOpenChange}
      position={{ align: 'end', side: 'bottom', sideOffset: 4 }}
      slots={{ popup: { width } }}
      Trigger={Trigger}
    >
      {options.map((option, index) => (
        <Fragment key={index}>
          {option.separatorBefore ? <WuMenuSeparatorItem /> : null}
          <WuMenuItem
            Icon={
              option.icon || option.materialIcon ? (
                option.materialIcon ? (
                  <span
                    className="material-symbols-outlined flex h-4 w-4 items-center justify-center text-[16px] leading-none"
                    style={option.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    aria-hidden="true"
                  >
                    {option.materialIcon}
                  </span>
                ) : (
                  <span
                    className={`${option.icon} flex h-4 w-4 items-center justify-center text-[16px] leading-none`}
                    aria-hidden="true"
                  />
                )
              ) : undefined
            }
            style={option.color ? { color: option.color } : undefined}
            onClick={option.onClick}
          >
            {option.label}
          </WuMenuItem>
        </Fragment>
      ))}
    </WuMenu>
  );
}
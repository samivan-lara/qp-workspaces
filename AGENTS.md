# Project conventions

## Dropdown menus (WuMenu-based)

Whenever a dropdown menu is requested, ALWAYS use the `DropdownMenu` component
(`src/components/common/DropdownMenu.tsx`) — options are config-driven
(`{ label, icon?, materialIcon?, color?, separatorBefore?, onClick? }`).
Use `icon` for wick icons (e.g. 'wm-edit') and `materialIcon` for Material
Symbols names (e.g. 'keep'). The styling lives in
`src/index.css`, scoped to `[id^='wu-menu-portal-']`, so every WuMenu in the app
gets the same format.

Mandatory format (do not deviate unless explicitly asked):

- Popup: **160px** wide, **8px** corner radius, **1px** inside stroke `#F0F8FF`,
  **4px** padding all around.
- Options: **32px** tall container, **4px** corner radius, hover fill `#EEEEEE`.
- Option content: **16x16px** icon + label, **8px** gap; Fira Sans Regular
  **12px** (line-height 16px), color `#3A424C`.
- Spacer (before destructive/separated action): **1px** line inside a container
  with **4px** top/bottom and **8px** left/right padding.
- Destructive option (e.g. Delete): text + icon `#CC0000` (via `color` prop).
- Trigger open state: fill `#1B87E6` at 15% opacity (`rgba(27, 135, 230, 0.15)`),
  and the trigger stays visible the whole time the menu is open.
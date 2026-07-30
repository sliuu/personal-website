// Pixel-art icon paths (24×24 grid), originally from https://pixelarticons.com/
// Keyed by semantic name; rendered by <Callout> and <Challenge>.
// Multi-path icons are merged into a single `d` string (same fill, same rule).
export const icons = {
  // speech bubble — the "Challenge" callout
  chat: 'M22 22h-2v-2h2v2Zm-2-2h-2v-2h2v2Zm-6-2H6v-2h8v2Zm4 0h-2v-2h2v2ZM6 16H4v-2h2v2Zm10 0h-2v-2h2v2ZM4 14H2V6h2v8Zm14 0h-2V6h2v8ZM6 6H4V4h2v2Zm10 0h-2V4h2v2Zm-2-2H6V2h8v2Z',
  // sparkly window — aesthetic / visual overhaul
  shine: 'M4 3h16v2H4zm0 16h6v2H4zM2 5h2v14H2zm18 0h2v8h-2zM6 7h2v2H6zm4 0h2v2h-2zm4 0h2v2h-2zm2 6h2v2h-2zm0 8h2v2h-2zm-4-4h2v2h-2zm8 0h2v2h-2zm-6-2h2v2h-2zm4 0h2v2h-2zm0 4h2v2h-2zm-4 0h2v2h-2z',
  // indented list — grouping / heuristics
  listNested: 'M10 5h12v2H10zm0 4h8v2h-8zm0 4h12v2H10zm0 4h8v2h-8zm-4-6H4V9h2v2ZM4 9H2V7h2v2Zm4 0H6V7h2v2ZM6 7H4V5h2v2Zm-2 6h2v2H4zm0 4h2v2H4zm-2 0v-2h2v2zm4 0v-2h2v2z',
  // browser frame — interactive elements
  browser: 'M20 20H4v-2h16v2ZM4 18H2V6h2v12Zm18 0h-2V6h2v12ZM18 8v6h-8V8h8Zm2-2H4V4h16v2Zm-4 4h-4v2h4v-2Z',
  // group of people — users / interviews
  users: 'M2 22H0v-4h2v4Zm14 0h-2v-4h2v4Zm8 0h-2v-4h2v4ZM4 18H2v-2h2v2Zm10 0h-2v-2h2v2Zm8 0h-2v-2h2v2Zm-10-2H4v-2h8v2Zm8 0h-4v-2h4v2Zm-9-4H5v-2h6v2Zm8 0h-4v-2h4v2ZM5 10H3V4h2v6Zm8 0h-2V4h2v6Zm8 0h-2V4h2v6ZM11 4H5V2h6v2Zm8 0h-4V2h4v2Z',
  // single person — one user
  user: 'M6 22H4v-4h2v4Zm14 0h-2v-4h2v4ZM8 18H6v-2h2v2Zm10 0h-2v-2h2v2Zm-2-2H8v-2h8v2Zm-1-4H9v-2h6v2Zm-6-2H7V4h2v6Zm8 0h-2V4h2v6Zm-2-6H9V2h6v2Z',
  // puzzle pieces — setup complexity
  puzzle: 'M4 20h3v-2h4v4h2v-4h4v2h-2v4H9v-4H7v2H2v-5h2v3Zm18 2h-5v-2h3v-3h2v5ZM6 11H2v2h4v4H4v-2H0V9h4V7h2v4Zm14-2h4v6h-4v2h-2v-4h4v-2h-4V7h2v2Zm-6 7h-4v-2h4v2Zm-4-2H8v-4h2v4Zm6 0h-2v-4h2v4Zm-2-4h-4V8h4v2ZM7 4H4v3H2V2h5v2Zm8 0h2V2h5v5h-2V4h-3v2h-4V2h-2v4H7V4h2V0h6v4Z',
  // turning arrow — transitions between tools
  arrowTurn: 'M14 16H6v-2h8v-4h2v2h2v2h2v2h-2v2h-2v2h-2v-4Zm-8-2H4V4h2v10Z',
  // bar chart — tracking / analysis
  chart: 'M20 22H4v-2h16v2ZM4 20H2V4h2v16Zm18 0h-2V4h2v16ZM9 17H7v-6h2v6Zm4 0h-2V7h2v10Zm4 0h-2v-4h2v4Zm3-13H4V2h16v2Z',
  // spark burst — enable / experiment
  spark: 'M9 11h2v2H9zm4 0h2v2h-2zM7 7h10v2H7zM5 9h2v6H5zm2 6h10v2H7zm10-6h2v6h-2zm-6-4h2v2h-2zM4 2h4v2H4zm0 18h4v2H4zM16 2h4v2h-4zm0 18h4v2h-4zM2 4h2v4H2zm0 12h2v4H2zM20 4h2v4h-2zm0 12h2v4h-2z',
  // indented flow — ground truth pipeline
  indent: 'M6 21h2V3H6z M4 7h6V5H4zM2 9h10V7H2zm8 2h6v2h-6zm0 4h9v2h-9zm0 4h12v2H10z',
  // rising bars — streamline
  barsRising: 'M8 20H2v-4h2v-2h4v6Zm7 0H9v-8h2v-2h4v10Zm7 0h-6V6h2V4h4v16Z',
  // screen with steps — cognitive walkthrough
  walkthrough: 'M20 22H4v-2h16v2ZM4 20H2V4h2v16Zm18 0h-2V4h2v16Zm-11-3H9v-2h2v2Zm2-2h-2v-2h2v2Zm2-2h-2v-2h2v2Zm-2-2h-2V9h2v2Zm-2-2H9V7h2v2Zm9-5H4V2h16v2Z',
  // checklist screen — central hub
  checklist: 'M20 22H4v-2h16v2ZM4 20H2V4h2v16ZM22 20h-2V4h2v16ZM8 17H6v-2h2v2Zm10 0h-8v-2h8v2ZM8 13H6v-2h2v2Zm10 0h-8v-2h8v2ZM8 9H6V7h2v2Zm10 0h-8V7h8v2Zm2-5H4V2h16v2Z',
  // side-by-side panels — wizard flow
  panels: 'M2 3h9v2H2zM0 19h11v2H0zM13 3h9v2h-9zm0 16h11v2H13zM11 5h2v18h-2zM0 5h2v14H0zm22 0h2v14h-2zm-7 2h5v2h-5zm0 4h5v2h-5zm0 4h2v2h-2z',
  // download arrow — data importing
  download: 'M19 21H5v-2h14v2ZM5 19H3v-4h2v4Zm16 0h-2v-4h2v4Zm-8-8h4v2h-2v2h-2v2h-2v-2H9v-2H7v-2h4V3h2v8Z',
  // downward trend — time / friction reduced
  trendDown: 'M18 22H6v-2h12v2ZM6 20H4v-2h2v2Zm14 0h-2v-2h2v2ZM4 18H2V6h2v12Zm18 0h-2V6h2v12Zm-5-1h-2v-2h2v2Zm-2-2h-2v-2h2v2Zm-2-2h-2V6h2v7ZM6 6H4V4h2v2Zm14 0h-2V4h2v2Zm-2-2H6V2h12v2Z',
  // outgoing arrows — hand off / empower
  send: 'M10 22H6v-2h4v2Zm-4-2H4v-2H2v-2h2v-2h2v6Zm6-4h10v2H12v2h-2v-6h2v2Zm-2-2H6v-2h4v2Zm8-2h-4v-2h4v2Zm-6-4H2V6h10V4h2v6h-2V8Zm8-2h2v2h-2v2h-2V4h2v2Zm-2-2h-4V2h4v2Z',
  // presentation easel — reporting
  easel: 'M9 22H7v-2h2v2Zm8 0h-2v-2h2v2Zm3-4h-5v2h-2v-2h-2v2H9v-2H4v-2h16v2Zm3-13h-1v11h-2V5H4v11H2V5H1V3h22v2Z',
  // car — rides
  car: 'M10 15h4v-2h6v2h2v2h-2v2h-6v-2h-4v2H4v-2H2v-2h2v-2h6v2Zm-4 2h2v-2H6v2Zm10 0h2v-2h-2v2ZM2 15H0v-4h2v4Zm22 0h-2v-4h2v4ZM4 11H2V7h2v4Zm14-2h4v2H12V9h4V7h2v2Zm-6 0h-2V7H4V5h12v2h-4v2Z',
  // diverging arrows — last-minute changes
  arrowsSplit: 'M7 17H5v-2H3v-2H1v-2h2V9h2V7h2v4h4v2H7v4Zm12-8h2v2h2v2h-2v2h-2v2h-2v-4h-4v-2h4V7h2v2Z',
} as const;

export type IconName = keyof typeof icons;

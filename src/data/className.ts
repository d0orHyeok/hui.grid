const classMap = {
  header: 'hui-grid-header',
  body: 'hui-grid-body',
  nodata: 'hui-grid-nodata',
  table: 'hui-grid-table',
  scrollWrapper: 'hui-grid-scroll-wrapper',
  scrollContainer: 'hui-grid-scroll-container',
  scrollContent: 'hui-grid-scroll-content',
  scrollbar: 'hui-scrollbar',
};

const cn = (target: keyof typeof classMap, selector?: boolean) => (selector ? '.' : '') + classMap[target];

export { cn };

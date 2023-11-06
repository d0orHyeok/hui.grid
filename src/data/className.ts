const classMap = {
  header: 'hui-grid-header',
  body: 'hui-grid-body',
  nodata: 'hui-grid-nodata',
  table: 'hui-grid-table',
};

const cn = (target: keyof typeof classMap, selector?: boolean) => (selector ? '.' : '') + classMap[target];

export { cn };

const classMap = {
  header: 'hui-grid-header',
  body: 'hui-grid-body',
  nodata: 'hui-grid-nodata',
  table: 'hui-grid-table',
  border: 'hui-grid-borders',
  tableFixed: 'hui-grid-table-fixed',
  scrollWrapper: 'hui-grid-scroll-wrapper',
  scrollContainer: 'hui-grid-scroll-container',
  scrollContent: 'hui-grid-scroll-content',
  scrollable: 'hui-grid-scrollable-container',
  scrollbar: 'hui-scrollbar',
  vscrollbar: 'hui-vertical-scrollbar',
  hscrollbar: 'hui-horizontal-scrollbar',
  row: 'hui-grid-row',
  headerRow: 'hui-grid-header-row',
  dataRow: 'hui-grid-data-row',
  groupRow: 'hui-grid-group-row',
  virtualRow: 'hui-grid-virtual-row',
  expander: 'hui-grid-expander',
  groupExpander: 'hui-grid-group-toggle',
  resizer: 'hui-grid-column-resizer',
  resizerWrapper: 'htui-grid-resizer-wrapper',
};

export type ClassMapKey = keyof typeof classMap;

type CNParam = [ClassMapKey] | [string, ClassMapKey] | [string, ClassMapKey, string];

const cn = (...args: CNParam) => {
  switch (args.length) {
    case 1:
      return classMap[args[0]];
    case 2:
    case 3:
      const [prefix, target, sufix = ''] = args;
      return prefix + classMap[target] + sufix;
  }
};
const cns = (...targets: ClassMapKey[]) => targets.map((item) => classMap[item]);

export { cn, cns };

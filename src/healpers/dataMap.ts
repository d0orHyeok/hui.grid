import { DataType, HorizontalAlign } from '@t/options';

export const alignMap: { [key in DataType]: HorizontalAlign } = {
  string: 'left',
  number: 'right',
  boolean: 'center',
  date: 'center',
  progress: 'center',
};

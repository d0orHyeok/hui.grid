import observable from '@/observable';
import { create$ } from '@/utils/dom';
import { Observable } from '@t/observable';
import { DataType, EditOption, OptGrid } from '@t/options';

const DEFAULT_EDIT: EditOption = {
  allowAdding: false,
  allowUpdating: false,
  allowDeleting: false,
  action: 'click',
  mode: 'row',
};

export function create(opts: Observable<OptGrid>) {
  const options = observable<EditOption>(() => {
    return { ...DEFAULT_EDIT, ...(opts().edit ?? {}) };
  });

  function createInput(value: any, dataType: DataType) {
    const $input = create$('input', { type: dataType });
    if (dataType === 'boolean') $input.type = 'checkbox';
    else if (dataType === 'progress') {
      ($input.type = 'range'), ($input.step = '0.01');
      ($input.max = '100'), ($input.min = '0');
    }
    $input.value = `${value}`;

    return $input;
  }

  function createSelect(value: any, lookup: (string | number)[]) {
    const $select = create$('select');
    $select.innerHTML = lookup.map((item) => /*html*/ `<option value="${item}">${item}</option>`).join('');
    $select.value = value;
    return $select;
  }

  return {
    options,
    createInput,
    createSelect,
  };
}

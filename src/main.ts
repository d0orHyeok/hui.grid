import HuiGrid from '@/index';
import '@/style/index.css';

const $app = document.getElementById('app') as HTMLElement;
$app.style.height = '320px';

const grid = new HuiGrid('#app', {
  columns: [
    { dataField: 'group', visible: false, groupIndex: 0 },
    { dataField: 'key', minWidth: 300 },
    { dataField: 'name', width: '120px', groupIndex: 1 },
    { caption: 'group', columns: [{ dataField: 'score' }, { dataField: 'progress', dataType: 'progress' }] },
  ],
});

const names = ['Alice', 'John', 'Simth', 'Jane', 'Brus', 'Saya', 'Minjun'];
const nameSize = names.length;

const datas = Array.from({ length: 300 }, (_, i) => {
  return {
    key: `rowkey${i}`,
    name: names[Math.floor(Math.random() * 100) % nameSize],
    score: (i * 581236) % 900,
    progress: Math.floor(Math.random() * 100 * 100) / 100,
    group: `group ${(i % 10) + 1}`,
  };
});

grid.setData(datas);

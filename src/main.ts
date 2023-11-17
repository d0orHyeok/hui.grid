import HuiGrid from '@/index';
import '@/style/index.css';

const $app = document.getElementById('app') as HTMLElement;
$app.style.height = '320px';

const names = ['Alice', 'John', 'Simth', 'Jane', 'Brus', 'Saya', 'Minjun'];
const nameSize = names.length;

const datas = Array.from({ length: 80 }, (_, i) => {
  return {
    key: `rowkey${i}`,
    name: names[Math.floor(Math.random() * 100) % nameSize],
    scroe: (i * 581236) % 900,
    progress: Math.floor(Math.random() * 100 * 100) / 100,
  };
});

const grid = new HuiGrid('#app', {
  columns: [
    { dataField: 'key' },
    { dataField: 'name' },
    { caption: 'group', columns: [{ dataField: 'scroe' }, { dataField: 'progress' }] },
  ],
});

grid.setData(datas);

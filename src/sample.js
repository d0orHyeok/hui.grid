import './sample.css';

const $app = document.getElementById('app');
$app.innerHTML = `
<!-- Sample -->
<div class="wrapper">
    <div class="container">
    <div class="scroll-content">
        <div class="content">
        <table role="presentation">
            <thead role="presentation"></thead>
            <tbody role="presentation"></tbody>
            <tfoot role="presentation"></tfoot>
        </table>
        </div>
    </div>
    <div class="sb">
        <div class="sb-thumb">
        <div class="sb-thumb-content"></div>
        </div>
    </div>
    </div>
</div>
`;

// Sample
const viewportHeight = 320; // rowHeight * 8
const rowHeight = 32;
const nodePadding = 5;

const datas = Array.from({ length: 100 }, (_, i) => i);
const dataSize = datas.length; // 100
const totalRowHeight = rowHeight * dataSize; // 3200
const scrollHeight = totalRowHeight;

// 최대 scrollTop
const maxScrollTop = Math.max(scrollHeight - viewportHeight, 0);

// 화면에 보이는 개수
const nodeCount = Math.ceil(viewportHeight / rowHeight); // 10
// 실제 보여지는 개수
const visibleNodeCount = nodeCount + nodePadding * 2; // 20

// 스크롤 막대 높이 계산
const scrollThumbRatio = viewportHeight / scrollHeight;
const scrollThumbHeight = viewportHeight * scrollThumbRatio;

/**
 * @param {number} scrollTop
 */
function calculateVariables(scrollTop) {
  const passNodeCount = Math.floor(scrollTop / rowHeight); // 지나온 노드의 개수
  const maxStartIndex = dataSize - visibleNodeCount; // startIndex의 최대값

  // 인덱스 계산
  let startIndex = Math.min(Math.max(passNodeCount - nodePadding, 0), maxStartIndex);
  const endIndex = startIndex + visibleNodeCount;
  const offsets = [startIndex, endIndex];

  // 스크롤 막대 이동거리 계산
  const maxTranslateY = viewportHeight - scrollThumbHeight;
  const translateRatio = scrollTop / scrollHeight;
  const translateY = Math.min(viewportHeight * translateRatio, maxTranslateY);

  return { offsets, translateY };
}

const $tbody = document.querySelector('table tbody');
const $thead = $tbody.previousElementSibling;
const $tfoot = $tbody.nextElementSibling;

const rowMap = {};
/**
 * @param {number[]} offsets
 */
function render(offsets) {
  const [startIndex, endIndex] = offsets;

  // 상단 하단 여백 설정
  const virtualTopHeight = Math.max(startIndex * rowHeight, 0);
  const virtualBottomHeight = Math.max((dataSize - endIndex) * rowHeight, 0);

  if (virtualTopHeight === 0) $thead.innerHTML = '';
  else $thead.innerHTML = `<tr role="row" style="height:${virtualTopHeight}px"><td></td></tr>`;
  if (virtualBottomHeight === 0) $tfoot.innerHTML = '';
  else $tfoot.innerHTML = `<tr role="row" style="height:${virtualBottomHeight}px"><td></td></tr>`;

  // 데이터 로우 렌더링
  datas.forEach((data, index) => {
    const rowindex = index + 1;
    const mapItem = rowMap[rowindex];
    if (startIndex < rowindex && index < endIndex) {
      // 보여질 데이터인 경우
      if (!mapItem) {
        // DOM에 추가되지 않았다면 추가해준다.
        const $tr = document.createElement('tr');
        $tr.role = 'row';
        $tr.ariaRowIndex = `${rowindex}`;
        $tr.style.height = `${rowHeight}px`;
        $tr.innerHTML = `<td role="gridcell">Row ${rowindex}</td>`;

        const $after = document.querySelectorAll < HTMLElement > `tr[aria-rowindex="${rowindex}"]`; // 그려질 로우의 다음에 올 노드
        if ($after) $tbody.insertBefore($tr, $after);
        else {
          // 가장 가까운 인덱스가 큰 요소를 찾아 해당 요소 전에 삽입
          const $next = Array.from($tbody.childNodes).find(($row) => rowindex < Number($row.ariaRowIndex));
          $tbody.insertBefore($tr, $next ?? null);
        }
        rowMap[rowindex] = $tr; // 맵에 요소 저장
      }
    } else if (mapItem) {
      // 보이지 않는 데이터인 경우
      mapItem.remove(); // DOM에 그려진 요소가 있다면 삭제
      delete rowMap[rowindex]; // 맵에서 삭제
    }
  });
}

const $container = document.querySelector('.container');
const $scrollbar = document.querySelector('.sb');
const $thumb = $scrollbar.firstElementChild;
$thumb.style.height = scrollThumbHeight + 'px';

function onScrollChange(newScrollTop) {
  const { offsets, translateY } = calculateVariables(newScrollTop);
  render(offsets);
  $container.scrollTop = newScrollTop;
  $thumb.style.transform = `translateY(${translateY}px)`;
}

let scrollTop = 0;

onScrollChange(0);

$container.addEventListener('wheel', (event) => {
  const step = event.deltaY;
  const moveScrollTop = Math.max(Math.min(scrollTop + step, maxScrollTop), 0);
  scrollTop = moveScrollTop;
  onScrollChange(moveScrollTop);
});

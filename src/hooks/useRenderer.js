import { computed, reactive, toRefs, watchEffect } from "vue";

export const useRenderer = (props) => {
  const renderInfo = reactive({
    cacheStart: 0, // 上缓冲边界
    start: 0, // 可见元素起始位置
    end: 0, // 可见元素结束位置 
    cacheEnd: 0 // 下缓冲边界
  })
  // 缓存已经加载过的 item
  const itemsCache = {
    positions: [],
    maxItemIndex: Number.MIN_SAFE_INTEGER // 当前已经加载过 item 最大的索引
  }
  let prevLen = 0;
  const initPositions = () => {
    const { positions } = itemsCache;
    const len = props.data.length;
    for (let index = prevLen; index < len; index++) {
      positions[index] = {
        top: index * props.itemSize,
        height: props.itemSize,
        index
      }
    }
    prevLen = len;
  }
  watchEffect(() => {
    initPositions();
  })
  // 渲染数据
  const renderData = computed(() => {
    let { positions } = itemsCache;
    return props.data
    .slice(renderInfo.cacheStart, renderInfo.cacheEnd + 1)
    .map((itemData, i) => ({...positions[renderInfo.cacheStart + i], itemData}))
  });
  return {
    ...toRefs(renderInfo),
    itemsCache,
    renderData,
    initPositions
  }
}
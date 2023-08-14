import { computed, reactive, toRefs } from "vue";

export const useRenderer = (props) => {
  const renderInfo = reactive({
    cacheStart: 0, // 上缓冲边界
    start: 0, // 可见元素起始位置
    end: 0, // 可见元素结束位置 
    cacheEnd: 0 // 下缓冲边界
  })
  // 缓存已经加载过的 item
  const itemsCache = {
    items: {},
    maxItemIndex: Number.MIN_SAFE_INTEGER // 当前已经加载过 item 最大的索引
  }
  // 渲染数据
  const renderData = computed(() => {
    let { items } = itemsCache;
    return props.data
    .slice(renderInfo.cacheStart, renderInfo.cacheEnd + 1)
    .map((itemData, i) => items[renderInfo.cacheStart + i])
  });
  return {
    ...toRefs(renderInfo),
    itemsCache,
    renderData
  }
}
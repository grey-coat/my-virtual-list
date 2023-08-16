import { computed, reactive, ref, toRefs, watchEffect } from "vue";

export const useRenderer = (props) => {
  const renderInfo = reactive({
    cacheStart: 0, // 上缓冲边界
    start: 0, // 可见元素起始位置
    end: 0, // 可见元素结束位置 
    cacheEnd: 0 // 下缓冲边界
  })
  // 缓存已经加载过的 item
  const positions = reactive([]);
  // 当前已经缓存过的 item 的最大 index
  const maxItemIndex = ref(0);
  const initPositions = () => {
    const len = props.data.length;
    for (let index = maxItemIndex.value; index < len; index++) {
      positions[index] = {
        top: index * props.itemSize,
        height: props.itemSize,
        index
      }
    }
    maxItemIndex.value = len;
  }
  watchEffect(() => {
    initPositions();
  })
  // 渲染数据
  const renderData = computed(() => {
    return props.data
    .slice(renderInfo.cacheStart, renderInfo.cacheEnd + 1)
    .map((itemData, i) => ({...positions[renderInfo.cacheStart + i], itemData}))
  });
  return {
    ...toRefs(renderInfo),
    positions,
    renderData,
    initPositions
  }
}
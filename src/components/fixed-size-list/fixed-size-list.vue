<script setup>
import { fixedSizeListProps, fixedSizeListEmits } from './fixed-size-list.js';
import { computed, reactive, ref, toRefs, watch, watchEffect } from 'vue';
import { useScroller } from './useScroller.js';
import ListItem from './list-item.vue';

const props = defineProps(fixedSizeListProps);
const emits = defineEmits(fixedSizeListEmits);

// item 总数
const itemsCount = computed(() => props.data.length);
// 可视区域样式
const containerStyle = computed(() => ({
  width: props.width + 'px',
  height: props.height + 'px'
}))
// 占位元素样式
const listStyle = computed(() => ({
  width: '100%',
  height: props.itemSize * itemsCount.value + 'px'
}))
const renderInfo = reactive({
  cacheStart: 0, // 上缓冲边界
  start: 0, // 可见元素起始位置
  end: 0, // 可见元素结束位置 
  cacheEnd: 0 // 下缓冲边界
})
const {
  cacheStart,
  start,
  end,
  cacheEnd
} = toRefs(renderInfo);
// 缓存已经加载过的 item
const itemsCache = {
  items: {},
  maxItemIndex: Number.MIN_SAFE_INTEGER // 当前已经加载过 item 最大的索引
}
// 滚动相关
const { scrollTop, scrollHandler } = useScroller(props, emits);
watchEffect(() => {
  // 当前可视区域内可以显示的 item 数量
  const viewPortItemCount = computed(() => Math.ceil(props.height / props.itemSize));
  // 可见元素起始位置
  start.value = Math.floor(scrollTop.value / props.itemSize);
  // 处理上缓冲边界
  cacheStart.value = Math.max(0, start.value - props.cache);
  // 可见元素结束位置 = 可视区域内可以显示的 item 数量 + 可见元素起始位置
  end.value = Math.min(itemsCount.value - 1, start.value + viewPortItemCount.value - 1);
  // 处理下缓冲边界
  cacheEnd.value = Math.min(end.value + props.cache, itemsCount.value - 1);
});
// 渲染数据
const renderData = computed(() => {
  let { items, maxItemIndex } = itemsCache;
  return props.data.slice(cacheStart.value, cacheEnd.value + 1).map((itemData, i) => {
    let index = cacheStart.value + i;
    if (maxItemIndex >= index) return items[index];
    itemsCache.maxItemIndex = Math.max(maxItemIndex, index);
    return items[index] = {
      itemData,
      top: index * props.itemSize,
      height: props.itemSize,
      index
    }
  })
});
</script>

<template>
  <div 
    class="virtual-list-container" 
    :style="containerStyle" 
    @scroll="scrollHandler"
  >
    <div class="virtual-list" :style="listStyle">
      <ListItem 
        v-for="{ itemData, top, height, index } in renderData"
        :key="itemData[itemKey] || index"
        :item-class="itemClass"
        :item-data="itemData"
        :item-index="index"
        :style="{
          top: top + 'px',
          height: height + 'px'
        }"
      >
        <template #default="props">
          <slot v-bind="props"></slot>
        </template>
      </ListItem>
    </div>
  </div>
</template>

<style scoped>
 .virtual-list-container {
   overflow-y: auto;
 }
 .virtual-list {
   position: relative;
 }
 .virtual-list .list-item {
   position: absolute;
 }
</style>
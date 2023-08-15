<script setup>
import { dynamicListProps, dynamicListEmits } from './dynamic-list.js';
import { computed, reactive, ref, watchEffect } from 'vue';
import { useScroller } from '@/hooks/useScroller.js';
import { useRenderer } from '@/hooks/useRenderer.js';
import ListItem from './list-item.vue';

const props = defineProps(dynamicListProps);
const emits = defineEmits(dynamicListEmits);

// item 总数
const itemsCount = computed(() => props.data.length);
// 可视区域样式
const containerStyle = computed(() => ({
  width: props.width + 'px',
  height: props.height + 'px'
}))
const listHeight = ref(0);
// 占位元素样式
const listStyle = computed(() => ({
  width: '100%',
  height: listHeight.value + 'px'
}))
// 渲染相关
const {
  cacheStart, // 上缓冲边界
  start, // 可见元素起始位置
  end, // 可见元素结束位置 
  cacheEnd, // 下缓冲边界
  itemsCache,
  itemsCache: { positions, maxItemIndex }, // 已经加载项缓存
  renderData, // 视图渲染数据
} = useRenderer(props);
// 滚动相关
const { scrollTop, scrollHandler } = useScroller(props, emits);
// 当滚动时
watchEffect(() => {
  const BSStartIndex = ({ positions }, scrollTop) => {
    const tops = positions.map(p => p.top);
    let left = 0,
      right = tops.length;

    while (left != right) {
      const mid = left + ((right - left) >> 1);
      console.log(left, mid, right)
      if (tops[mid] > scrollTop) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    return Math.max(0, left - 1);
  }
  // 可见元素起始位置
  start.value = BSStartIndex(itemsCache, scrollTop.value);
  // 处理上缓冲边界
  cacheStart.value = Math.max(0, start.value - props.cache);
  // 可见元素结束位置 = 可视区域内可以显示的 item 数量 + 可见元素起始位置
  let endIndex = start.value;
  while (positions[endIndex].top <= scrollTop.value + props.height) {
    endIndex++;
  }
  end.value = Math.min(itemsCount.value - 1, endIndex);
  // 处理下缓冲边界
  cacheEnd.value = Math.min(end.value + props.cache, itemsCount.value - 1);
  // 缓存配置
  // for (let index = cacheStart.value; index < cacheEnd.value + 1; index++) {
  //   const { positions, maxItemIndex } = itemsCache;
  //   if (maxItemIndex >= index) continue;
  //   itemsCache.maxItemIndex = Math.max(maxItemIndex, index);
  //   positions[index] = {
  //     top: index * props.itemSize,
  //     height: props.itemSize,
  //     index
  //   }
  // }
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
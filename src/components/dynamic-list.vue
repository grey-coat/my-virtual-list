<script setup>
import { dynamicListProps, dynamicListEmits } from './dynamic-list.js';
import { computed, watchEffect } from 'vue';
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
// 占位元素样式
const listStyle = computed(() => ({
  width: '100%',
  height: props.itemSize * itemsCount.value + 'px'
}))
// 渲染相关
const {
  cacheStart, // 上缓冲边界
  start, // 可见元素起始位置
  end, // 可见元素结束位置 
  cacheEnd, // 下缓冲边界
  itemsCache,
  itemsCache: { positions, maxItemIndex }, // 已经加载项缓存
  renderData // 视图渲染数据
} = useRenderer(props);
// 滚动相关
const { scrollTop, scrollHandler } = useScroller(props, emits);
// 当滚动时
watchEffect(() => {
  if (props.dynamic) {
    // 缓存配置
  } else {
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
    // 缓存配置
    for (let index = cacheStart.value; index < cacheEnd.value + 1; index++) {
      if (maxItemIndex >= index) continue;
      itemsCache.maxItemIndex = Math.max(maxItemIndex, index);
      positions[index] = {
        top: index * props.itemSize,
        height: props.itemSize,
        index
      }
    }
  }
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
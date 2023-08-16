<script setup>
import { dynamicListProps, dynamicListEmits } from './dynamic-list.js';
import { computed, provide, reactive, ref, watchEffect } from 'vue';
import { useScroller } from '@/hooks/useScroller.js';
import { useRenderer } from '@/hooks/useRenderer.js';
import ListItem from './list-item.vue';

const props = defineProps(dynamicListProps);
const emits = defineEmits(dynamicListEmits);

// 可视区域样式
const containerStyle = computed(() => ({
  width: props.width + 'px',
  height: props.height + 'px'
}))
// 渲染相关
const {
  cacheStart, // 上缓冲边界
  start, // 可见元素起始位置
  end, // 可见元素结束位置 
  cacheEnd, // 下缓冲边界
  positions, // 已经加载项缓存
  renderData, // 视图渲染数据
} = useRenderer(props);
// 滚动相关
const { scrollTop, scrollHandler } = useScroller(props, emits);

// 占位元素样式
const listStyle = computed(() => {
  const endPos = positions[props.data.length - 1];
  return {
    width: '100%',
    height: endPos.top + endPos.height + 'px'
  }
})
// 当滚动时
watchEffect(() => {
  console.log(1);
  const BSStartIndex = (arr, num) => {
    let left = 0,
      right = arr.length - 1;

    // console.log(num, arr);

    while (left != right) {
      const mid = left + ((right - left) >> 1);
      // console.log(left, mid, right)
      if (arr[mid] > num) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    // console.log(left);
    return Math.max(0, left - 1);
  }
  const len = props.data.length;
  // 可见元素起始位置
  start.value = BSStartIndex(positions.map(pos => pos.top), scrollTop.value);
  // 处理上缓冲边界
  cacheStart.value = Math.max(0, start.value - props.cache);
  // 可见元素结束位置 = 可视区域内可以显示的 item 数量 + 可见元素起始位置
  let endIndex = start.value;
  while (positions[endIndex].top <= scrollTop.value + props.height) {
    endIndex++;
  }
  end.value = Math.min(len - 1, endIndex);
  // 处理下缓冲边界
  cacheEnd.value = Math.min(end.value + props.cache, len - 1);
});
let resizeOb = new ResizeObserver((entries) => {
  // console.log(entries.length);
  for (const { borderBoxSize, target } of entries) {
    const boxSize = borderBoxSize[0]; // 变化的 item 的 size
    const index = target.dataset.index;
    console.log(index, positions[index].height, boxSize.blockSize);
    if (positions[index].height != boxSize.blockSize) {
      updateItemsHeight(index, boxSize.blockSize); // 更新当前 item 的 pos
    }
  }
})
provide('resizeOb', resizeOb);
const updateItemsHeight = (index, newHeight) => {
  console.log(index, newHeight);
  const pos = positions[index];
  const diff = pos.height - newHeight; // 新的高度差异
  pos.height = newHeight;
  for (let i = index, len = props.data.length; i < len; i++) {
    positions[i].top += diff; // 更新当前 item 后所有item 的高度
  }
}
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
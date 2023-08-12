<script setup>
import { throttle, RAFThrottle } from '@/utils/common.js'
import { computed, reactive, ref, toRefs } from 'vue';
import ListItem from './list-item.vue';

const props = defineProps({
  itemSize: Number, 
  itemClass: String,
  itemKey: [String, Number],
  data: Array,
  width: Number,
  height: Number,
  cache: {
    type: Number,
    default: 2
  }
})
const containerStyle = reactive({
  width: props.width + 'px',
  height: props.height + 'px'
})
const listStyle = reactive({
  width: '100%',
  height: props.itemSize * props.data.length + 'px'
})
const renderInfo = reactive({
  cacheStart: 0, // 上缓存边界
  start: 0, // 可见元素起始位置
  end: 0, // 可见元素结束位置 
  cacheEnd: 0 // 下缓存边界
})
const {
  cacheStart,
  start,
  end,
  cacheEnd
} = toRefs(renderInfo);
// 当前可视区域内可以显示的 item 数量
const viewPortItemCount = Math.ceil(props.height / props.itemSize);
// item 总数
const itemCount = props.data.length;
const setRenderPos = (scrollTop) => {
  // 可见元素起始位置
  start.value = Math.floor(scrollTop / props.itemSize);
  // 处理上缓存边界
  cacheStart.value = Math.max(0, start.value - props.cache);
  // 可见元素结束位置 = 可视区域内可以显示的 item 数量 + 可见元素起始位置
  end.value = Math.min(itemCount - 1, start.value + viewPortItemCount - 1);
  // 处理下缓存边界
  cacheEnd.value = Math.min(end.value + props.cache, itemCount - 1);
}
// 缓存已经加载过的 item
const itemsCache = {
  items: {},
  maxItemIndex: Number.MIN_SAFE_INTEGER // 当前已经加载过 item 最大的索引
}
// 动画帧节流
const scrollHandler = RAFThrottle((e) => {
  setRenderPos(e.target.scrollTop);
})
const renderData = computed(() => {
  let { items, maxItemIndex } = itemsCache;
  return props.data.slice(cacheStart.value, cacheEnd.value + 1).map((itemData, i) => {
    let index = cacheStart.value + i;
    if (maxItemIndex >= index) return items[index];
    maxItemIndex = Math.max(maxItemIndex, index);
    return items[index] = {
      itemData,
      top: index * props.itemSize,
      height: props.itemSize,
      index
    }
  })
});
console.log(renderData)
// 初始渲染
setRenderPos(0);
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
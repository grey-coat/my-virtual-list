<script setup>
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
    cacheStart: 0,
    start: 0,
    end: 0,
    cacheEnd: 0
  })
  const {
    cacheStart,
    start,
    end,
    cacheEnd
  } = toRefs(renderInfo);
  const viewPortItemCount = Math.ceil(props.height / props.itemSize);
  const itemCount = props.data.length;
  const setRenderPos = (scrollTop) => {
    start.value = Math.floor(scrollTop / props.itemSize);
    cacheStart.value = Math.max(0, start.value - props.cache);
    end.value = Math.min(itemCount - 1, start.value + viewPortItemCount - 1);
    cacheEnd.value = Math.min(end.value + props.cache, itemCount - 1);
  }
  const scrollHandler = (e) => {
    setRenderPos(e.target.scrollTop);
  }
  const renderData = computed(() => props.data.slice(cacheStart.value, cacheEnd.value + 1));
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
        v-for="(itemData, i) in renderData"
        :key="itemData[itemKey] || i"
        :item-class="itemClass"
        :item-data="itemData"
        :item-index="cacheStart + i"
        :style="{
          top: (cacheStart + i) * itemSize + 'px',
          height: itemSize + 'px'
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
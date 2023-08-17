<script setup>
import { ref } from 'vue';
import { useResizeObserve } from '../hooks/common/useResizeObserver';

const props = defineProps({
  itemClass: String,
  itemData: {},
  itemIndex: Number
})

const itemRef = ref();
useResizeObserve('resizeOb', itemRef);

</script>

<template>
  <div 
    :class="['virtual-list-item', itemClass]" 
    ref="itemRef"
    :data-index="itemIndex"
  >
    <slot :item="itemData" :index="itemIndex"></slot>
  </div>
</template>

<style scoped>
  .virtual-list-item {
    color: #213547;
    position: absolute;
    left: 0;
    right: 0;
  }
</style>
<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  itemClass: String,
  itemData: {},
  itemIndex: Number
})
// const {
//   itemClass,
//   itemData,
//   itemIndex
// } = toRefs(props);

</script>

<template>
  <div 
    :class="['virtual-list-item', itemClass]" 
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
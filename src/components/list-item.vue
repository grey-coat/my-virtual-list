<script setup>
import { inject, nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, toRefs } from 'vue';

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

const resizeOb = inject('resizeOb');
const itemRef = ref();
if (resizeOb) {
  onMounted(() => {
    resizeOb.observe(itemRef.value);
  })
  onBeforeUnmount(() => {
    resizeOb.unobserve(itemRef.value);
  })
}

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
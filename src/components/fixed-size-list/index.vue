<script setup>
import { reactive, toRefs } from 'vue';

  const props = defineProps({
    itemSize: Number,
    data: Array | Number,
    width: Number,
    height: Number
  })
  const { itemSize, data, width, height } = toRefs(props);
  const containerStyle = reactive({
    width: width.value + 'px',
    height: height.value + 'px'
  })
  const listStyle = reactive({
    width: '100%',
    height: itemSize.value * data.value.length + 'px'
  })
</script>

<template>
  <div class="virtual-list-container" :style="containerStyle">
    <div class="virtual-list" :style="listStyle">
      <slot :data="data"></slot>
    </div>
  </div>
</template>

<style scoped>

</style>
<script setup>
import { h } from 'vue';
import DynamicListDemo from './examples/dynamic-list-demo.vue';
import FixedSizeListDemo from './examples/fixed-size-list-demo.vue';
const List = () => new Array(10000).fill(0).map((item, i) => h('p', i))
</script>

<template>
  <!-- <List></List> -->
  动态高度-懒加载-点击改变大小
  <DynamicListDemo></DynamicListDemo>
  固定高度-懒加载
  <FixedSizeListDemo></FixedSizeListDemo>
</template>

<style scoped>

</style>

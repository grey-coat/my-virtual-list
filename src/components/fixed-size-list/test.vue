<script setup>
import Index from './index.vue';
const data = new Array(10000).fill(0);
</script>

<template>
  <Index
    :item-size="40"
    item-class="item"
    :width="300"
    :height="500"
    :data="data"
  >
    <template #default="{ item, index }">
      <div
        :class="['list-item', index % 2 ? 'list-item-odd' : 'list-item-even']" 
        style="height: 100%;">
        {{ index }}
      </div>
    </template>
  </Index>
</template>

<style scoped>
  .list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #000;
  }
  .list-item-odd {
    background-color: rgb(229, 178, 38);
  }
  .list-item-even {
    background-color: cadetblue;
  }
</style>
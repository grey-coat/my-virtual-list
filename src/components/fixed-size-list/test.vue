<script setup>
import FixedSizeList from './fixed-size-list.vue';

const data = new Array(10000).fill(0);
</script>

<template>
  <FixedSizeList
    :item-size="40"
    item-class="item"
    :width="300"
    :height="300"
    :data="data"
  >
    <template #default="{ item, index }">
      <div
        :class="['list-item', index % 2 ? 'list-item-odd' : 'list-item-even']" 
        style="height: 100%;">
        {{ index }}
      </div>
    </template>
  </FixedSizeList>
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
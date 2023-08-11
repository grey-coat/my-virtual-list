<script setup>
import Index from './index.vue';

</script>

<template>
  <Index
    :item-size="50"
    :width="300"
    :height="500"
    :data="100"
    #default="{ data }"
  >
    <div class="list-item" v-for="i of data" :key="i">
      {{ i }}
    </div>
  </Index>
</template>

<style scoped>
  .list-item {
    display: flex;
  }
</style>
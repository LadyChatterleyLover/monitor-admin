<template>
  <div class="w-full h-full flex justify-center items-center bg-[#f2f3f5]">
    <a-card
      v-for="(item, index) in list"
      :key="index"
      class="mr-8 cursor-pointer"
      hoverable
    >
      <div
        class="w-[200px] flex justify-center items-center h-[60px]"
        @click="clickItem(item)"
      >
        {{ item.name }}
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface ListItem {
  name: string
  value: string
}

const router = useRouter()

const list: ListItem[] = [
  {
    name: '仓配管理',
    value: 'warehouse',
  },
  {
    name: '采购管理',
    value: 'procurement',
  },
  {
    name: '仓储管理',
    value: 'warehouseManagement',
  },
  {
    name: '财务管理',
    value: 'financial',
  },
  {
    name: '系统管理',
    value: 'system',
  },
]

const clickItem = (item: ListItem) => {
  localStorage.setItem('monitor-key', item.value)
  router.push('/')
}
</script>

<style scoped lang="scss"></style>

<template>
  <div>jsError</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ReportData } from '@/types/report'
import api from '@/api'
const appKey = localStorage.getItem('monitor-key') as string

const current = ref(1)
const pageSize = ref(10)
const tableData = ref<ReportData[]>([])

const getData = () => {
  api.report
    .getData({
      appKey,
      current: current.value,
      pageSize: pageSize.value,
    })
    .then((res) => {
      tableData.value = res.data!.filter((item) => item.type === 'error')
      console.log(tableData.value)
    })
}

onMounted(() => {
  getData()
})
</script>

<style scoped></style>

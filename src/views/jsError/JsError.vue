<template>
  <div>
    <a-card>
      <TextBoard :total="total" />
    </a-card>
    <a-card class="mt-8">
      <Charts :table-data="tableData" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import type { ReportData } from '@/types/report'
import api from '@/api'
import TextBoard from '@/components/jsError/TextBoard.vue'
import Charts from '@/components/jsError/Charts.vue'
const appKey = localStorage.getItem('monitor-key') as string

const total = ref(0)
const tableData = ref<ReportData[]>([])

const getTableData = () => {
  api.report
    .getData({
      appKey,
      type: 'error',
      startTime: dayjs().startOf('day'),
      endTime: dayjs().endOf('day'),
    })
    .then((res) => {
      tableData.value = res.data!
      total.value = res.total!
    })
}

onMounted(() => {
  getTableData()
})
</script>

<style scoped></style>

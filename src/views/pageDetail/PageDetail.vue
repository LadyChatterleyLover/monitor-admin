<template>
  <div>
    <a-card>
      <Charts :table-data="tableData" />
    </a-card>
    <a-card class="mt-5">
      <PageTable :table-data="tableData" :total="total" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import type { ReportData } from '@/types/report'
import api from '@/api'
import Charts from '@/components/pageDetail/Charts.vue'
import PageTable from '@/components/pageDetail/PageTable.vue'
const appKey = localStorage.getItem('monitor-key') as string

const total = ref(0)
const tableData = ref<ReportData[]>([])
const getTableData = () => {
  api.report
    .getData({
      appKey,
      type: 'history',
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

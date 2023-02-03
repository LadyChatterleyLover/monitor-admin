<template>
  <div>
    <a-card>
      <TextBoard
        :total="total"
        :success-point="successPoint"
        :total-time="totalTime"
        :max-time="maxTime"
        :max-time-request="maxTimeRequest"
      />
    </a-card>
    <a-card class="mt-5">
      <Charts :table-data="tableData" />
    </a-card>
    <a-card class="mt-5">
      <ApiErrorTable :table-data="tableData" :total="total" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from 'vue'
import dayjs from 'dayjs'
import type { ReportData } from '@/types/report'
import api from '@/api'
import TextBoard from '@/components/apiError/TextBoard.vue'
import Charts from '@/components/apiError/Charts.vue'
import ApiErrorTable from '@/components/apiError/ApiErrorTable.vue'

const appKey = localStorage.getItem('monitor-key') as string

const total = ref(0)
const tableData = ref<ReportData[]>([])
const successList = ref<ReportData[]>([])
const failList = ref<ReportData[]>([])
const successPoint = ref(0)
const totalTime = ref(0)
const maxTime = ref(0)
const maxTimeRequest = ref('')

const getTableData = () => {
  api.report
    .getData({
      appKey,
      type: 'xhr',
      startTime: dayjs().startOf('day'),
      endTime: dayjs().endOf('day'),
    })
    .then((res) => {
      tableData.value = res.data!
      total.value = res.total!
      successList.value = tableData.value.filter((item) => !item.isError)
      failList.value = tableData.value.filter((item) => item.isError)
      successPoint.value = successList.value.length
        ? (successList.value.length / total.value) * 100
        : 0
      tableData.value.forEach((item) => {
        totalTime.value += item.elapsedTime!
      })
      const timeArr = tableData.value.map(
        (item) => item.elapsedTime
      ) as number[]
      maxTime.value = timeArr.length ? Math.max(...timeArr) : 0
      maxTimeRequest.value =
        (tableData.value.find((item) => item.elapsedTime === maxTime.value)
          ?.url as string) ?? ''
    })
}

provide('getTableData', getTableData)

onMounted(() => {
  getTableData()
})
</script>

<style scoped></style>

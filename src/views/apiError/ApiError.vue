<template>
  <div>
    <a-card>
      <TextBoard
        :total="total"
        :success-point="successPoint"
        :total-time="totalTime"
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import type { ReportData } from '@/types/report'
import api from '@/api'
import TextBoard from '@/components/apiError/TextBoard.vue'

const appKey = localStorage.getItem('monitor-key') as string

const total = ref(0)
const tableData = ref<ReportData[]>([])
const successList = ref<ReportData[]>([])
const failList = ref<ReportData[]>([])
const successPoint = ref(0)
const totalTime = ref(0)

const getTableData = () => {
  api.report
    .getData({
      appKey,
      type: 'xhr',
      startTime: dayjs().startOf('day'),
      endTime: dayjs().endOf('day'),
    })
    .then((res) => {
      console.log('res', res.data)
      tableData.value = res.data!
      total.value = res.total!
      successList.value = tableData.value.filter((item) => !item.isError)
      failList.value = tableData.value.filter((item) => item.isError)
      successPoint.value = (successList.value.length / total.value) * 100
      tableData.value.forEach((item) => {
        totalTime.value += item.elapsedTime!
      })
    })
}

onMounted(() => {
  getTableData()
})
</script>

<style scoped></style>

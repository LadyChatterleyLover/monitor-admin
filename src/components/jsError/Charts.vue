<template>
  <div>
    <a-form :model="model" layout="inline">
      <a-form-item
        field="time"
        :label-col-props="{
          span: 0,
        }"
      >
        <a-range-picker v-model="model.time" style="width: 260px" />
      </a-form-item>
      <a-form-item field="timeType" label="时间粒度">
        <a-radio-group v-model="model.timeType" :options="radioOptions" />
      </a-form-item>
    </a-form>
    <div class="mt-5">
      <div ref="chartRef" style="height: 360px" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import * as Echarts from 'echarts'
import cloneDeep from 'lodash/cloneDeep'
import groupBy from 'lodash/groupBy'
import dayjs from 'dayjs'
import type { ReportData } from '@/types/report'
import api from '@/api'

const props = defineProps<{
  tableData: ReportData[]
}>()

const appKey = localStorage.getItem('monitor-key') as string
const chartRef = ref<HTMLDivElement>()
const chartInstance = ref<Echarts.ECharts>()
const data = ref<ReportData[]>([])
const group = ref<any>({})
const model = ref({
  time: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
  timeType: '1',
})

const radioOptions = [
  { label: '分钟', value: '1' },
  { label: '小时', value: '2' },
  { label: '天', value: '3' },
]

const chartsOptions = ref<any>({
  tooltip: {
    show: true,
    trigger: 'item',
    axisPointer: {
      type: 'shadow',
    },
    backgroundColor: '#6f6f6f',
    textStyle: {
      color: '#fff',
    },
    formatter(params: any) {
      const item = group.value && group.value[params.name]
      return `${item?.[0].day} ${
        model.value.timeType !== '3' ? params.name : ''
      }
        <br />
        <div style="display: flex;align-items: center">
         <div style="background: #3f90f7;width: 10px;height: 10px;border-radius: 100%"></div>
         <div style="margin-left: 6px">异常数量: ${params.value}</div>
        </div>`
    },
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'bar',
      data: [],
    },
  ],
})

const setData = () => {
  data.value.forEach((item) => {
    item.minute = dayjs(item.time).format('HH:mm')
    item.hour = dayjs(item.time).format('HH:00')
    item.day = dayjs(item.time).format('MM-DD')
  })
  group.value = groupBy(data.value, 'minute')
  initChart(group.value)
}

const initChart = (group: any) => {
  nextTick(() => {
    chartInstance.value = chartInstance.value ?? Echarts.init(chartRef.value!)
    chartsOptions.value.xAxis!.data = Object.keys(group)
    chartsOptions.value.series[0].data = Object.keys(group).map(
      (item) => group[item]?.length
    )
    chartInstance.value.setOption(chartsOptions.value)
  })
}

watch(
  () => props.tableData,
  (val) => {
    if (val.length) {
      data.value = cloneDeep(val)
      setData()
    }
  },
  { deep: true, immediate: true }
)

watch(
  () => model.value.time,
  (val) => {
    const diff = dayjs(val[1]).diff(dayjs(val[0]), 'day')
    if (diff < 1) {
      model.value.timeType = '1'
    } else if (diff === 1) {
      model.value.timeType = '2'
    } else {
      model.value.timeType = '3'
    }
    api.report
      .getData({
        appKey,
        type: 'error',
        startTime: dayjs(val[0]).startOf('day'),
        endTime: dayjs(val[1]).endOf('day'),
      })
      .then((res) => {
        data.value = res.data!
        setData()
      })
  },
  { deep: true }
)

watch(
  () => [model.value.timeType, data.value],
  (val) => {
    if (val[0] === '1') {
      group.value = groupBy(val[1] as ReportData[], 'minute')
    } else if (val[0] === '2') {
      group.value = groupBy(val[1] as ReportData[], 'hour')
    } else if (val[0] === '3') {
      group.value = groupBy(val[1] as ReportData[], 'day')
    }
    initChart(group.value)
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss" scoped></style>

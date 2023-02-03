<template>
  <a-form :model="model" layout="inline">
    <a-form-item
      field="time"
      :label-col-props="{
        span: 0,
      }"
    >
      <a-range-picker
        v-model="model.time"
        style="width: 260px"
        :allow-clear="false"
      />
    </a-form-item>
    <a-form-item field="timeType" label="时间粒度">
      <a-radio-group v-model="model.timeType" :options="radioOptions" />
    </a-form-item>
  </a-form>
  <div class="mt-5">
    <div ref="chartRef1" style="height: 360px" />
  </div>
</template>

<script lang="ts" setup>
import { computed, markRaw, nextTick, ref, watch } from 'vue'
import * as Echarts from 'echarts'
import cloneDeep from 'lodash/cloneDeep'
import groupBy from 'lodash/groupBy'
import dayjs from 'dayjs'
import type { Breadcrumb, DeviceInfo, ReportData } from '@/types/report'
import api from '@/api'

export interface TableData {
  url?: string
  count?: number
  successRate?: number
  failRate?: number
  elapsedTime?: number
  isError?: boolean
  breadcrumb?: Breadcrumb[]
  deviceInfo?: DeviceInfo
  username?: string
  roleName?: string
  minute?: string
  hour?: string
  day?: string
}

const props = defineProps<{
  tableData: ReportData[]
}>()

const appKey = localStorage.getItem('monitor-key') as string
const chartRef1 = ref<HTMLDivElement>()
const chartInstance = ref<Echarts.ECharts>()
const tableList = ref<TableData[]>([])
const successList = ref<TableData[]>([])
const data = ref<ReportData[]>([])
const group = ref<any>()
const disableMinute = ref(false)
const disableHour = ref(false)
const model = ref({
  time: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
  timeType: '1',
})

const radioOptions = computed(() => [
  { label: '分钟', value: '1', disabled: disableMinute.value },
  { label: '小时', value: '2', disabled: disableHour.value },
  { label: '天', value: '3' },
])

const chartsOptions = ref<any>({
  legend: {
    data: ['成功次数', '成功耗时'],
  },
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
      let time = 0
      item.forEach((i: TableData) => {
        time += i.elapsedTime!
      })
      return `${item?.[0].day} ${
        model.value.timeType !== '3' ? params.name : ''
      }
        <br />
        <div style="display: flex;align-items: center">
         <div style="background: #3f90f7;width: 10px;height: 10px;border-radius: 100%"></div>
         <div style="margin-left: 6px">成功次数:${item.length}</div>
        </div>
        <div style="display: flex;align-items: center">
          <div style="background: #2fc25b;width: 10px;height: 10px;border-radius: 100%"></div>
          <div style="margin-left: 6px">请求耗时: ${time / 1000}s</div>
        </div
        `
    },
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: [
    {
      type: 'value',
      min: 0,
      interval: 5,
    },
    {
      type: 'value',
      min: 0,
      interval: 3,
      axisLabel: {
        formatter: '{value} s',
      },
    },
  ],
  series: [
    {
      name: '成功次数',
      type: 'bar',
      data: [],
      yAxisIndex: 0,
    },
    {
      name: '成功耗时',
      type: 'line',
      data: [],
      yAxisIndex: 1,
    },
  ],
})

const setData = (type: string) => {
  const urlGroup = groupBy(data.value, 'url')
  for (const i in urlGroup) {
    const arr: ReportData[] = urlGroup[i]
    const success = arr.filter((item) => !item.isError)
    const fail = arr.filter((item) => item.isError)
    const obj: TableData = {
      elapsedTime: 0,
    }

    obj.url = i
    obj.count = urlGroup[i].length
    obj.successRate = Number(((success.length / arr.length) * 100).toFixed(2))
    obj.failRate = Number(((fail.length / arr.length) * 100).toFixed(2))
    arr.forEach((item) => {
      obj.elapsedTime! = item.elapsedTime!
      obj.isError = item.isError
      obj.minute = dayjs(item.time).format('HH:mm')
      obj.hour = dayjs(item.time).format('HH:00')
      obj.day = dayjs(item.time).format('MM-DD')
    })
    tableList.value.push(obj)
  }
  successList.value = tableList.value.filter((item) => !item.isError)
  group.value = groupBy(successList.value, type) as any
  initChart(group.value)
}

const initChart = (group: any) => {
  nextTick(() => {
    chartInstance.value =
      chartInstance.value ?? markRaw(Echarts.init(chartRef1.value!))
    chartsOptions.value.xAxis!.data = Object.keys(group).sort((a, b) => {
      const m1: any = a.split(':')[0]
      const s1: any = a.split(':')[1]
      const m2: any = b.split(':')[0]
      const s2: any = b.split(':')[1]
      const r1 = m1 * 60 + s1 * 60
      const r2 = m2 * 60 + s2 * 60
      return r1 - r2
    })
    chartsOptions.value.series[0].data = Object.keys(group).map(
      (item) => group[item]?.length
    )
    chartsOptions.value.series[1].data = Object.keys(group).map((item) => {
      let time = 0
      group[item].map((i: any) => {
        return (time += i.elapsedTime / 1000)
      })
      return time
    })
    chartInstance.value.setOption(chartsOptions.value)
  })
}

watch(
  () => props.tableData,
  (val) => {
    if (val.length) {
      data.value = cloneDeep(val)
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
      disableMinute.value = false
      disableHour.value = false
    } else if (diff === 1) {
      model.value.timeType = '2'
      disableMinute.value = true
    } else {
      model.value.timeType = '3'
      disableMinute.value = true
      disableHour.value = true
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
        setData('minute')
      })
  },
  { deep: true }
)

watch(
  () => [model.value.timeType, data.value],
  (val) => {
    let type = ''
    if (val[0] === '1') {
      group.value = groupBy(val[1] as ReportData[], 'minute')
      type = 'minute'
    } else if (val[0] === '2') {
      group.value = groupBy(val[1] as ReportData[], 'hour')
      type = 'hour'
    } else if (val[0] === '3') {
      group.value = groupBy(val[1] as ReportData[], 'day')
      type = 'day'
    }
    setData(type)
  },
  { deep: true }
)
</script>

<style lang="scss" scoped></style>

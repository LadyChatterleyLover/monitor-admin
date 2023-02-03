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
import { computed, markRaw, nextTick, ref, watch } from 'vue'
import * as Echarts from 'echarts'
import cloneDeep from 'lodash/cloneDeep'
import groupBy from 'lodash/groupBy'
import dayjs from 'dayjs'
import type { DeviceInfo, ReportData } from '@/types/report'
import api from '@/api'

export interface TableData {
  url?: string
  appKey?: string
  time?: number
  deviceInfo?: DeviceInfo
  username?: string
  roleName?: string
  count?: number
  userCount?: number
  minute?: string
  hour?: string
  day?: string
}

type TimeType = 'minute' | 'hour' | 'day'

const props = defineProps<{
  tableData: ReportData[]
}>()

const appKey = localStorage.getItem('monitor-key') as string
const chartRef = ref<HTMLDivElement>()
const chartInstance = ref<Echarts.ECharts>()
const data = ref<ReportData[]>([])
const tableList = ref<TableData[]>([])
const group = ref<any>({})
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
    data: ['访问次数', '用户数'],
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
      let arr: string[] = []
      item.forEach((i: TableData) => {
        arr.push(i.username as string)
      })
      arr = arr.filter((item, index, list) => list.indexOf(item) === index)
      return `${item?.[0].day} ${
        model.value.timeType !== '3' ? params.name : ''
      }
        <br />
        <div style="display: flex;align-items: center">
         <div style="background: #3f90f7;width: 10px;height: 10px;border-radius: 100%"></div>
         <div style="margin-left: 6px">访问次数: ${item.length}</div>
        </div>
        <div style="display: flex;align-items: center">
         <div style="background: #2fc25b;width: 10px;height: 10px;border-radius: 100%"></div>
         <div style="margin-left: 6px">用户数: ${arr.length}</div>
        </div>
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
      interval: 20,
    },
    {
      type: 'value',
      min: 0,
      interval: 5,
    },
  ],
  series: [
    {
      type: 'line',
      name: '访问次数',
      data: [],
      yAxisIndex: 0,
    },
    {
      type: 'line',
      name: '用户数',
      data: [],
      yAxisIndex: 1,
    },
  ],
})

const setData = (type: TimeType) => {
  const urlGroup = groupBy(data.value, 'page_url')
  for (const i in urlGroup) {
    const users = urlGroup[i]
      .map((item) => item.username)
      .filter((item, index, arr) => arr.indexOf(item) === index)
    const obj: TableData = {}
    obj.url = i
    obj.count = urlGroup[i].length
    urlGroup[i].forEach((item) => {
      obj.appKey = item.appKey
      obj.deviceInfo = item.deviceInfo
      obj.url = item.page_url
      obj.time = item.time
      obj.username = item.username
      obj.roleName = item.roleName
      obj.userCount = users.length
      obj.minute = dayjs(item.time).format('HH:mm')
      obj.hour = dayjs(item.time).format('HH:00')
      obj.day = dayjs(item.time).format('MM-DD')
    })
    tableList.value.push(obj)
  }
  group.value = groupBy(
    tableList.value.sort((a, b) => a.time! - b.time!),
    type
  )
  initChart(group.value)
}

const initChart = (group: any) => {
  nextTick(() => {
    chartInstance.value =
      chartInstance.value ?? markRaw(Echarts.init(chartRef.value!))
    chartsOptions.value.xAxis!.data = Object.keys(group).sort((a, b) =>
      a.localeCompare(b)
    )
    chartsOptions.value.series[0].data = Object.keys(group).map((item) => {
      return group[item].length
    })
    chartsOptions.value.series[1].data = Object.keys(group).map((item) => {
      let arr: string[] = []
      group[item].forEach((i: any) => {
        arr.push(i.username)
      })
      arr = arr.filter((item, index, list) => list.indexOf(item) === index)
      return arr.length
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
        type: 'history',
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
    let type: TimeType = 'minute'
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

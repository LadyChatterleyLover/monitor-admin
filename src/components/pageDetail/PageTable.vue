<template>
  <div>
    <div class="flex items-center">
      <div class="mr-4">时间:</div>
      <a-date-picker v-model="time" style="width: 260px" @change="changeTime" />
    </div>
    <div class="mt-4">
      <vxe-table :data="tableList">
        <vxe-column type="seq" align="center" width="60" />
        <vxe-column field="appKey" title="项目名称" align="center" />
        <vxe-column field="url" title="页面URL" align="center" />
        <vxe-column field="time" title="访问时间" align="center">
          <template #default="{ row }">
            <span>{{ dayjs(row.time).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </vxe-column>
        <vxe-column field="count" title="访问次数" align="center" />
        <vxe-column field="userCount" title="用户数" align="center" />
        <vxe-column field="browser" title="浏览器信息" align="center">
          <template #default="scope">
            <span>{{ scope.row?.deviceInfo?.browser }}</span>
          </template>
        </vxe-column>
        <vxe-column field="os" title="操作系统" align="center">
          <template #default="scope">
            <span>{{ scope.row?.deviceInfo?.os }}</span>
          </template>
        </vxe-column>
      </vxe-table>
      <div class="flex justify-end mt-4">
        <a-pagination
          :total="cloneTableList.length"
          size="medium"
          show-total
          show-jumper
          show-page-size
          @change="changeCurrent"
          @page-size-change="changeSize"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import groupBy from 'lodash/groupBy'
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
}

const appKey = localStorage.getItem('monitor-key') as string
const props = defineProps<{
  tableData: ReportData[]
  total: number
}>()

const time = ref(dayjs().format('YYYY-MM-DD'))
const data = ref<ReportData[]>([])
const tableList = ref<TableData[]>([])
const cloneTableList = ref<TableData[]>([])
const current = ref(1)
const pageSize = ref(10)

const getTableData = () => {
  api.report
    .getData({
      appKey,
      type: 'history',
      startTime: dayjs(time.value).startOf('day'),
      endTime: dayjs(time.value).endOf('day'),
      current: current.value,
      pageSize: pageSize.value,
    })
    .then((res) => {
      data.value = res.data!
      setData()
    })
}

const changeTime = (val: string) => {
  time.value = val
  getTableData()
}

const changeCurrent = (val: number) => {
  current.value = val
  tableList.value = cloneTableList.value.slice(
    (current.value - 1) * pageSize.value,
    current.value * pageSize.value
  )
}

const changeSize = (val: number) => {
  pageSize.value = val
  tableList.value = cloneTableList.value.slice(
    (current.value - 1) * pageSize.value,
    current.value * pageSize.value
  )
}

const setData = () => {
  const group = groupBy(data.value, 'page_url')
  for (const i in group) {
    const users = group[i]
      .map((item) => item.username)
      .filter((item, index, arr) => arr.indexOf(item) === index)
    const obj: TableData = {}
    obj.url = i
    obj.count = group[i].length
    data.value.forEach((item) => {
      obj.appKey = item.appKey
      obj.deviceInfo = item.deviceInfo
      obj.url = item.page_url
      obj.time = item.time
      obj.username = item.username
      obj.roleName = item.roleName
      obj.userCount = users.length
    })
    tableList.value.push(obj)
  }
  cloneTableList.value = cloneDeep(tableList.value)
  tableList.value = cloneTableList.value.slice(
    current.value - 1,
    pageSize.value
  )
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
</script>

<style scoped></style>

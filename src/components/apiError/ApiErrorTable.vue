<template>
  <div>
    <div class="flex items-center">
      <div class="mr-4">时间:</div>
      <a-date-picker v-model="time" style="width: 260px" @change="changeTime" />
    </div>
    <div class="mt-3">
      <a-tabs :default-active-key="activeKey" @tab-click="tabClick">
        <a-tab-pane key="1" title="全部URL">
          <div v-if="tableList.length">
            <vxe-table :data="tableList">
              <vxe-column type="seq" title="#" align="center" width="60" />
              <vxe-column field="url" title="请求次数" align="center" />
              <vxe-column
                field="count"
                title="请求次数"
                align="center"
                sortable
              />
              <vxe-column
                field="successRate"
                title="成功率"
                align="center"
                sortable
              />
              <vxe-column field="elapsedTime" title="请求耗时" align="center">
                <template #default="{ row }">
                  {{ row.elapsedTime / 1000 }}s
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
          <div v-else>暂无数据</div>
        </a-tab-pane>
        <a-tab-pane key="2" title="失败URL">
          <div v-if="failList.length">
            <vxe-table :data="failList">
              <vxe-column type="seq" title="#" align="center" width="60" />
              <vxe-column field="url" title="API URL" align="center" />
              <vxe-column field="page_url" title="报错页面" align="center" />
              <vxe-column
                field="username"
                title="用户名"
                align="center"
                width="120"
              />
              <vxe-column
                field="roleName"
                title="职位"
                align="center"
                width="120"
              />
              <vxe-column
                field="browser"
                title="浏览器信息"
                align="center"
                width="120"
              >
                <template #default="scope">
                  <span>{{ scope.row?.deviceInfo?.browser }}</span>
                </template>
              </vxe-column>
              <vxe-column
                field="os"
                title="操作系统"
                align="center"
                width="120"
              >
                <template #default="scope">
                  <span>{{ scope.row?.deviceInfo?.os }}</span>
                </template>
              </vxe-column>
              <vxe-column
                field="elapsedTime"
                title="失败耗时"
                align="center"
                width="120"
              >
                <template #default="{ row }">
                  {{ row.elapsedTime / 1000 }}s
                </template>
              </vxe-column>
              <vxe-column title="操作" align="center" width="200">
                <template #default="{ row }">
                  <a-button type="primary" @click="revertBehavior(row)"
                    >查看日志</a-button
                  >
                </template>
              </vxe-column>
            </vxe-table>
            <div class="flex justify-end mt-4">
              <a-pagination
                :total="cloneFailList.length"
                size="medium"
                show-total
                show-jumper
                show-page-size
                @change="changeCurrent"
                @page-size-change="changeSize"
              />
            </div>
          </div>
          <div v-else>暂无数据</div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <BreadcrumbView ref="BreadcrumbViewRef" :activities="activities" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import groupBy from 'lodash/groupBy'
import BreadcrumbView from '../breadcrumb/Breadcrumb.vue'
import type { Breadcrumb, DeviceInfo, ReportData } from '@/types/report'
import api from '@/api'

export interface TableData {
  url?: string
  count?: number
  successRate?: string
  failRate?: string
  elapsedTime?: number
  isError?: boolean
  breadcrumb?: Breadcrumb[]
  deviceInfo?: DeviceInfo
  username?: string
  roleName?: string
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
const failList = ref<TableData[]>([])
const cloneFailList = ref<TableData[]>([])
const current = ref(1)
const pageSize = ref(10)
const activeKey = ref('1')
const BreadcrumbViewRef = ref()
const activities = ref<Breadcrumb[]>([])

const tabClick = (key: any) => {
  activeKey.value = key
}

const getTableData = () => {
  api.report
    .getData({
      appKey,
      type: 'xhr',
      startTime: dayjs(time.value).startOf('day'),
      endTime: dayjs(time.value).endOf('day'),
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
  if (activeKey.value === '1') {
    tableList.value = cloneTableList.value.slice(
      (current.value - 1) * pageSize.value,
      current.value * pageSize.value
    )
  } else {
    failList.value = cloneFailList.value.slice(
      (current.value - 1) * pageSize.value,
      current.value * pageSize.value
    )
  }
}

const changeSize = (val: number) => {
  pageSize.value = val
  if (activeKey.value === '1') {
    tableList.value = cloneTableList.value.slice(
      (current.value - 1) * pageSize.value,
      current.value * pageSize.value
    )
  } else {
    failList.value = cloneFailList.value.slice(
      (current.value - 1) * pageSize.value,
      current.value * pageSize.value
    )
  }
}

const setData = () => {
  const group = groupBy(data.value, 'url')
  for (const i in group) {
    const arr: ReportData[] = group[i]
    const success = arr.filter((item) => !item.isError)
    const fail = arr.filter((item) => item.isError)
    const obj: TableData = {
      elapsedTime: 0,
    }
    obj.url = i
    obj.count = group[i].length
    obj.successRate = `${((success.length / arr.length) * 100).toFixed(2)}%`
    obj.failRate = `${((fail.length / arr.length) * 100).toFixed(2)}%`
    arr.forEach((item) => {
      obj.elapsedTime! += item.elapsedTime!
      obj.isError = item.isError
    })
    tableList.value.push(obj)
  }
  cloneTableList.value = cloneDeep(tableList.value)
  cloneFailList.value = data.value.filter((item) => item.isError)
  tableList.value = cloneTableList.value.slice(
    current.value - 1,
    pageSize.value
  )
  failList.value = cloneFailList.value.slice(current.value - 1, pageSize.value)
}

const revertBehavior = (row: ReportData) => {
  activities.value = cloneDeep(row.breadcrumb)
  BreadcrumbViewRef.value?.open()
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

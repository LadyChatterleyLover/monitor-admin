<template>
  <vxe-table :data="tableList">
    <vxe-column type="seq" title="#" align="center" width="60" />
    <vxe-column field="url" title="API URL" align="center" />
    <vxe-column field="page_url" title="对应页面" align="center" />
    <vxe-column field="status" title="请求状态" align="center" width="120" />
    <vxe-column field="username" title="用户名" align="center" width="120" />
    <vxe-column field="roleName" title="职位" align="center" width="120" />
    <vxe-column field="browser" title="浏览器信息" align="center" width="120">
      <template #default="scope">
        <span>{{ scope.row?.deviceInfo?.browser }}</span>
      </template>
    </vxe-column>
    <vxe-column field="os" title="操作系统" align="center" width="120">
      <template #default="scope">
        <span>{{ scope.row?.deviceInfo?.os }}</span>
      </template>
    </vxe-column>
    <vxe-column field="elapsedTime" title="请求耗时" align="center" width="120">
      <template #default="{ row }"> {{ row.elapsedTime / 1000 }}s </template>
    </vxe-column>
    <vxe-column title="操作" align="center" width="200">
      <template #default="{ row }">
        <a-button v-if="row.isError" type="primary" @click="revertBehavior(row)"
          >查看日志</a-button
        >
      </template>
    </vxe-column>
  </vxe-table>
  <div class="flex justify-end mt-4">
    <a-pagination
      :total="tableData.length"
      size="medium"
      show-total
      show-jumper
      show-page-size
      @change="changeCurrent"
      @page-size-change="changeSize"
    />
  </div>
  <BreadcrumbView ref="BreadcrumbViewRef" :activities="activities" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import BreadcrumbView from '../breadcrumb/Breadcrumb.vue'
import type { Breadcrumb, ReportData } from '@/types/report'

const props = defineProps<{
  tableData: ReportData[]
}>()

const tableList = ref<ReportData[]>([])
const current = ref(1)
const pageSize = ref(10)
const activities = ref<Breadcrumb[]>([])
const BreadcrumbViewRef = ref()

const changeCurrent = (val: number) => {
  current.value = val
  tableList.value = props.tableData.slice(
    (current.value - 1) * pageSize.value,
    current.value * pageSize.value
  )
}

const changeSize = (val: number) => {
  pageSize.value = val
  tableList.value = props.tableData.slice(
    (current.value - 1) * pageSize.value,
    current.value * pageSize.value
  )
}

const revertBehavior = (row: ReportData) => {
  activities.value = cloneDeep(row.breadcrumb)
  BreadcrumbViewRef.value?.open()
}

watch(
  () => props.tableData,
  (val) => {
    if (val.length) {
      tableList.value = val.slice(
        (current.value - 1) * pageSize.value,
        current.value * pageSize.value
      )
    }
  },
  { deep: true, immediate: true }
)
</script>

<style scoped></style>

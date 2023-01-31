<template>
  <div>
    <div class="flex items-center">
      <div class="mr-4">时间:</div>
      <a-date-picker v-model="time" style="width: 260px" @change="changeTime" />
    </div>
    <div class="mt-4">
      <vxe-table :data="data">
        <vxe-column type="seq" align="center" width="60" />
        <vxe-column field="appKey" title="项目名称" align="center" />
        <vxe-column field="message" title="异常内容" align="center" />
        <vxe-column field="page_url" title="报错页面" align="center" />
        <vxe-column field="time" title="报错时间 " align="center">
          <template #default="{ row }">
            <span>{{ dayjs(row.time).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </vxe-column>
        <vxe-column field="fileName" title="报错文件" align="center" />
        <vxe-column field="username" title="用户名" align="center" />
        <vxe-column field="roleName" title="职位" align="center" />
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
        <vxe-column title="操作" align="center">
          <template #default="{ row }">
            <a-button
              v-if="row.breadcrumb"
              class="mr-5"
              type="text"
              @click="revertBehavior(row)"
              >查看日志</a-button
            >
            <a-button
              v-if="row.type == 'error' || row.type == 'unhandledrejection'"
              type="text"
              @click="revertCode(row)"
              >查看源码</a-button
            >
          </template>
        </vxe-column>
      </vxe-table>
      <div class="flex justify-end mt-4">
        <a-pagination
          :total="total"
          size="medium"
          show-total
          show-jumper
          show-page-size
          @change="changeCurrent"
          @page-size-change="changeSize"
        />
      </div>
    </div>
    <a-modal v-model:visible="visible" title="查看用户行为" :footer="false">
      <a-timeline>
        <a-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :label="activity.content"
          :timestamp="dayjs(activity.time).format('YYYY-MM-DD HH:mm:ss')"
        >
          <template #dot>
            <icon-check-circle
              v-if="activity.status === 'ok'"
              :style="{ fontSize: '14px', color: '#5FF713' }"
            />
            <icon-close-circle
              v-else
              :style="{ fontSize: '14px', color: '#F70B0B' }"
            />
          </template>
        </a-timeline-item>
      </a-timeline>
    </a-modal>
    <a-modal
      v-model:visible="sourceVisible"
      title="映射SourceMap"
      @close="cancel"
    >
      <a-upload
        draggable
        :custom-request="customRequest"
        accept=".map"
        :show-file-list="false"
      />
      <div ref="revertRef" />
      <template #footer>
        <a-button @click="cancel">取消</a-button>
        <a-button type="primary" :disabled="!fileList.length" @click="confirm"
          >映射还原</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import { Message, type RequestOption } from '@arco-design/web-vue'
import type { Breadcrumb, ReportData } from '@/types/report'
import api from '@/api'
import { findCodeBySourceMap } from '@/utils/sourceMap'

const appKey = localStorage.getItem('monitor-key') as string
const props = defineProps<{
  tableData: ReportData[]
  total: number
}>()

const time = ref(dayjs().format('YYYY-MM-DD'))
const data = ref<ReportData[]>([])
const visible = ref(false)
const sourceVisible = ref(false)
const currentRow = ref<ReportData>()
const activities = ref<Breadcrumb[]>([])
const current = ref(1)
const pageSize = ref(10)
const fileList = ref<any[]>([])
const revertRef = ref<HTMLDivElement>()

const getTableData = () => {
  api.report
    .getData({
      appKey,
      type: 'error',
      startTime: dayjs(time.value).startOf('day'),
      endTime: dayjs(time.value).endOf('day'),
      current: current.value,
      pageSize: pageSize.value,
    })
    .then((res) => {
      data.value = res.data!
    })
}

const changeTime = (val: string) => {
  time.value = val
  getTableData()
}

const revertBehavior = (row: ReportData) => {
  visible.value = true
  activities.value = cloneDeep(row.breadcrumb)
  activities.value.forEach((item) => {
    if (item.category == 'Click') {
      item.content = `用户点击dom: ${item.data}`
    } else if (item.category == 'Http') {
      item.content = `调用接口: ${item.data.url}: ${
        item.status == 'ok'
          ? `请求成功,耗时${item.data.elapsedTime / 1000}秒`
          : `请求失败,耗时${item.data.elapsedTime / 1000}秒`
      }`
    } else if (item.category == 'CodeError') {
      item.content = `代码报错：${item.data.message}`
    } else if (item.category == 'ResourceError') {
      item.content = `加载资源报错：${item.message}`
    } else if (item.category == 'Route') {
      item.content = `路由变化：从 ${item.data.from}页面 切换到 ${item.data.to}页面`
    }
  })
}

const customRequest = (option: RequestOption): any => {
  const { fileItem } = option
  const formData = new FormData()
  formData.append('file', fileItem.file!)
  return api.report.upload(formData).then((res) => {
    if (res.code == 200) {
      fileList.value.push(res.data!)
      Message.success(res.msg)
    } else {
      Message.error(res.msg)
    }
  })
}

const revertCode = (row: ReportData) => {
  currentRow.value = row
  sourceVisible.value = true
}

const changeCurrent = (val: number) => {
  current.value = val
  getTableData()
}

const changeSize = (val: number) => {
  pageSize.value = val
  getTableData()
}

const confirm = () => {
  const file = fileList.value[0]
  const url = file.url
  api.report
    .readContent({
      url,
    })
    .then((res) => {
      findCodeBySourceMap(
        {
          sourceData: res.data as any,
          column: currentRow.value!.column,
          line: currentRow.value!.line!,
        },
        (res) => {
          console.log('res', res)
          nextTick(() => {
            revertRef.value!.innerHTML = res
          })
        }
      )
    })
}

const cancel = () => {
  sourceVisible.value = false
  fileList.value = []
}

watch(
  () => props.tableData,
  (val) => {
    if (val.length) {
      data.value = cloneDeep(val).slice(current.value - 1, pageSize.value)
    }
  },
  { deep: true, immediate: true }
)
</script>

<style scoped></style>

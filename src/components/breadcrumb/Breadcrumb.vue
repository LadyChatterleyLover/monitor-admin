<template>
  <a-modal v-model:visible="visible" title="查看用户行为" :footer="false">
    <a-timeline>
      <a-timeline-item
        v-for="(activity, index) in cloneActivities"
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
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import type { Breadcrumb } from '@/types/report'

const props = defineProps<{
  activities: Breadcrumb[]
}>()

const visible = ref(false)
const cloneActivities = ref<Breadcrumb[]>([])

const open = () => {
  visible.value = true
}

watch(
  () => props.activities,
  (val) => {
    cloneActivities.value = cloneDeep(val)
    cloneActivities.value.forEach((item) => {
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
  },
  { deep: true, immediate: true }
)

defineExpose({
  open,
})
</script>

<style scoped></style>

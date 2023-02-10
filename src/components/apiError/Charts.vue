<template>
  <div>
    <a-tabs :default-active-key="activeKey" @tab-click="tabClick">
      <a-tab-pane key="1" title="成功率">
        <SuccessRate :table-data="tableData" />
      </a-tab-pane>
      <a-tab-pane key="2" title="成功耗时">
        <SuccessTime :table-data="tableData" />
      </a-tab-pane>
      <a-tab-pane key="3" title="失败耗时">
        <FailTime :table-data="tableData" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SuccessRate from './SuccessRate.vue'
import SuccessTime from './SuccessTime.vue'
import FailTime from './FailTime.vue'
import type { ReportData } from '@/types/report'

defineProps<{
  tableData: ReportData[]
}>()

const activeKey = ref('1')

const tabClick = (key: any) => {
  activeKey.value = key
}
</script>

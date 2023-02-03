<template>
  <div class="p-4 flex flex-wrap bg-white">
    <div class="flex-1 flex flex-col justify-center items-center p-2 item">
      <div class="text-[#9ea7b4] text-xs">请求次数</div>
      <div class="font-bold text-2xl text-[#666] mt-1">{{ total }}</div>
    </div>
    <div class="flex-1 flex flex-col justify-center items-center p-2 item">
      <div class="text-[#9ea7b4] text-xs">成功率</div>
      <div class="font-bold text-2xl text-[#666] mt-1">
        {{ successPoint.toFixed(2) }}%
      </div>
    </div>
    <div class="flex-1 flex flex-col justify-center items-center p-2 item">
      <div class="text-[#9ea7b4] text-xs">请求耗时</div>
      <div class="font-bold text-2xl text-[#666] mt-1">
        {{ totalTime / 1000 }}s
      </div>
    </div>
    <div class="flex-1 flex flex-col justify-center items-center p-2 item">
      <div class="text-[#9ea7b4] text-xs">最长耗时</div>
      <a-tooltip :content="maxTimeRequest">
        <div class="font-bold text-2xl text-[#666] mt-1 cursor-pointer">
          {{ maxTime ? maxTime / 1000 : 0 }}s
        </div>
      </a-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  total: number
  successPoint: number
  totalTime: number
  maxTime: number
  maxTimeRequest: string
}>()
</script>

<style lang="scss" scoped>
.item {
  border-right: 1px solid #eee;
  &:last-child {
    border-right: none;
  }
}
</style>

<template>
  <div class="p-4 flex flex-wrap bg-white">
    <div
      class="flex-1 flex flex-col justify-center items-center p-2"
      style="border-right: 1px solid #eee"
    >
      <div class="text-[#9ea7b4] text-xs">异常次数</div>
      <div class="font-bold text-2xl text-[#666] mt-1">{{ total }}</div>
    </div>
    <div
      class="flex-1 flex flex-col justify-center items-center p-2"
      style="border-right: 1px solid #eee"
    >
      <div class="text-[#9ea7b4] text-xs">异常次数</div>
      <div class="font-bold text-2xl text-[#666] mt-1">{{ total }}</div>
    </div>
    <div
      class="flex-1 flex flex-col justify-center items-center p-2"
      style="border-right: 1px solid #eee"
    >
      <div class="text-[#9ea7b4] text-xs">异常次数</div>
      <div class="font-bold text-2xl text-[#666] mt-1">{{ total }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  total: number
}>()
</script>

<style lang="scss" scoped></style>

<template>
  <div class="flex items-center px-5 h-full">
    <div class="cursor-pointer" @click="toggle">
      <icon-menu-fold v-if="!collapsed" size="20" />
      <icon-menu-unfold v-else size="20" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  collapsed: boolean
}>()

const emits = defineEmits<{
  (e: 'update:collapsed', val: boolean): void
}>()

const toggle = () => {
  emits('update:collapsed', !props.collapsed)
}
</script>

<style scoped></style>

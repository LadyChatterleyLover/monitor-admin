<template>
  <div class="mt-[300px]">
    <a-result status="404" subtitle="对不起,您访问的页面不存在">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="$router.push('/dashboard')"
            >返回首页</a-button
          >
        </a-space>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>

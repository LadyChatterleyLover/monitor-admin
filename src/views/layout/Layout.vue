<template>
  <a-layout class="layout-demo">
    <a-layout-sider hide-trigger collapsible :collapsed="collapsed">
      <NavSide />
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="height: 60px; border-bottom: 1px solid #eee">
        <NavHeader v-model:collapsed="collapsed" />
      </a-layout-header>
      <a-layout style="padding: 0 24px">
        <a-layout-content>
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavSide from '@/components/navSide/NavSide.vue'
import NavHeader from '@/components/navHeader/NavHeader.vue'

const collapsed = ref(false)
</script>

<style scoped></style>

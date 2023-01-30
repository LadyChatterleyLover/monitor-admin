<template>
  <a-menu
    :default-open-keys="['1']"
    :default-selected-keys="[$route.path]"
    :style="{ width: '100%' }"
    theme="dark"
    @menuItemClick="onClickMenuItem"
  >
    <template v-for="item in menus" :key="item.key">
      <a-sub-menu v-if="item.children" key="1">
        <template #title>
          <span>
            <component :is="item.icon" />
            {{ item.title }}
          </span>
        </template>
        <a-menu-item v-for="child in item.children" :key="child.key">{{
          child.title
        }}</a-menu-item>
      </a-sub-menu>
      <a-menu-item v-else :key="item.key">
        <component :is="item.icon" />
        {{ item.title }}
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

export interface MenuItem {
  title: string
  key: string
  icon?: string
  children?: MenuItem[]
}

const router = useRouter()

const menus: MenuItem[] = [
  {
    title: '实时大盘',
    key: '/dashboard',
    icon: 'icon-history',
  },
  {
    title: '监控指标',
    key: '1',
    icon: 'icon-man',
    children: [
      {
        title: 'JS异常',
        key: '/jsError',
      },
      {
        title: 'API请求',
        key: '/apiError',
      },
      {
        title: '资源异常',
        key: '/resourcesError',
      },
      {
        title: '页面访问',
        key: '/pageDetail',
      },
    ],
  },
]

const onClickMenuItem = (key: string) => {
  router.push(key)
}
</script>

<style>
.arco-menu-inner {
  padding: 0 !important;
}
</style>

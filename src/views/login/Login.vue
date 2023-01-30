<template>
  <div class="flex w-full h-full">
    <div class="w-[550px] logo flex flex-col justify-center items-center">
      <div class="fixed top-6 left-6 flex items-center">
        <div>
          <img
            src="https://p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image"
            alt=""
          />
        </div>
        <div class="text-white text-[20px] ml-1">Monitor Admin</div>
      </div>
      <div class="text-white text-lg mb-5">全方位覆盖的监控系统</div>
      <img
        width="320"
        height="200"
        src="https://vue-pro.arco.design/assets/login-banner.426fb77f.png"
        alt=""
      />
    </div>
    <div class="flex-1 flex items-center justify-center">
      <a-form
        ref="formRef"
        :model="model"
        :rules="rules"
        :style="{ width: '420px' }"
        @submit="login"
      >
        <a-form-item class="text-2xl font-bold"> 登录监控系统 </a-form-item>
        <a-form-item
          field="username"
          label="用户名"
          :validate-trigger="['change']"
        >
          <a-input
            v-model="model.username"
            allow-clear
            placeholder="请输入用户名"
          />
        </a-form-item>
        <a-form-item
          field="password"
          label="密码"
          :validate-trigger="['change']"
        >
          <a-input-password
            v-model="model.password"
            allow-clear
            placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item
          field="answer"
          label="验证码"
          :validate-trigger="['change']"
        >
          <a-row :gutter="8">
            <a-col :span="16">
              <a-input
                v-model="model.answer"
                allow-clear
                placeholder="请输入验证码"
              />
            </a-col>
            <a-col :span="8">
              <img
                class="cursor-pointer"
                :src="captcha"
                alt="captcha"
                @click="getCaptcha"
              />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" long @click="login">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type FormInstance, Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'
import api from '@/api'

const router = useRouter()

const formRef = ref<FormInstance>()
const captcha = ref('')
const model = ref({
  username: 'lp',
  password: '111223',
  id: '',
  answer: '',
})

const rules = ref({
  username: [
    {
      required: true,
      message: '用户名不能为空',
    },
    {
      min: 2,
      max: 10,
      message: '用户名在2-6位之',
    },
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
    },
    {
      min: 6,
      max: 15,
      message: '密码在6-15位之间',
    },
  ],
  answer: [
    {
      required: true,
      message: '验证码不能为空',
    },
    {
      length: 4,
      message: '验证码为4位',
    },
  ],
})

const getCaptcha = () => {
  api.user.getCaptcha().then((res) => {
    model.value.id = res.data!.id
    captcha.value = res.data!.imageBase64
  })
}

const login = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      api.user.login(model.value).then((res) => {
        if (res.code === 200) {
          localStorage.setItem('monitor-token', res.data!.token)
          localStorage.setItem('monitor-user', JSON.stringify(res.data!.user))
          Message.success(res.msg)
          router.push('/project')
        } else {
          Message.error(res.msg)
        }
      })
    } else {
      Message.error('表单填写有误,请检查')
    }
  })
}

onMounted(() => {
  getCaptcha()
})
</script>

<style scoped lang="scss">
.logo {
  background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
}
</style>

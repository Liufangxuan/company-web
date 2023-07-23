<template>
  <el-card>
    <template #header>
      <div>
        <span>个人信息</span>
      </div>
    </template>
    <el-row>
      <el-col :span="3">
        <div>
          <el-avatar :size="100">
            <el-icon size="80"><Avatar /></el-icon>
          </el-avatar>
        </div>
      </el-col>
      <el-col :span="18">
        <div>
<span style="line-height: 2em">账号:&nbsp;{{state.userInfo.loginId}}
</span><br>
          <span style="line-height: 2em">姓名:&nbsp;{{state.userInfo.userName}}
</span><br>
          <span style="line-height: 2em">电话:&nbsp;{{state.userInfo.mobile}}
</span><br>
          <span style="line-height: 2em">邮箱:&nbsp;{{state.userInfo.email}}
</span><br>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import {onMounted, reactive} from "vue";
const state = reactive({
  userInfo:{}
})
onMounted(()=>{
  state.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
})
</script>

<style scoped>

</style>
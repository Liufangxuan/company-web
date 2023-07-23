<template>
  <el-container class="index">
    <el-header class="header">
      <el-row>
        <!--左侧logo区域-->
        <el-col :span="12" class="logo-container">
          <img src="../../assets/vue.svg" class="logo"/>
          <span class="title">公司员工公寓管理系统</span>
        </el-col>
        <!--右侧用户信息区域-->
        <el-col :span="12" class="user">
          <span>{{userInfo.userName}}</span>&nbsp;&nbsp;
          <el-link :underline="false" type="primary" @click="logout">
            <el-icon><switch-button /></el-icon>
          </el-link>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="container">
      <el-aside class="lefter">
        <el-scrollbar >
          <el-menu
              class="el-menu-vertical"
              background-color="#324057"
              text-color="#fff"
              active-text-color="#409eff">
            <el-sub-menu index="1">
              <template #title>
                <el-icon><Menu /></el-icon>住户管理
              </template>
              <router-link to="/app/gyuserlist">
                <el-menu-item index="1-1">
                  <el-icon><List /></el-icon>住户列表
                </el-menu-item>
              </router-link>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><Menu /></el-icon>个人信息
              </template>
              <router-link to="/app/userlist">
                <el-menu-item index="2-1">
                  <el-icon><List /></el-icon>宿管信息
                </el-menu-item>
              </router-link>
              <router-link to="/app/userinfo">
                <el-menu-item index="2-2">
                  <el-icon><Avatar /></el-icon>基本信息
                </el-menu-item>
              </router-link>

            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon><Menu /></el-icon>公寓楼管理
              </template>
              <router-link to="apartmentlist">
              <el-menu-item index="3-1">
                <el-icon><List /></el-icon>公寓楼列表
              </el-menu-item>
              </router-link>
              <router-link to="roomlist">
              <el-menu-item index="3-2">
                <el-icon><List /></el-icon>房间列表
              </el-menu-item>
              </router-link>
            </el-sub-menu>
            <el-sub-menu index="4">
              <template #title>
                <el-icon><Menu /></el-icon>物品管理
              </template>
              <router-link to="goodslist">
              <el-menu-item index="4-1">
                <el-icon><List /></el-icon>物品信息
              </el-menu-item>
              </router-link>
              <!--              <el-menu-item index="4-2">Option 2</el-menu-item>-->
              <!--              <el-menu-item index="4-3">Option 3</el-menu-item>-->
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main class="content">
        <el-scrollbar>
          <!--通过router-view加载其他组价-->
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>


<script setup>
//注意：vue3.x组合式api，需要在<script>里面使用setup

import {reactive,onMounted} from "vue";
//引入路由函数
import {useRouter} from "vue-router";

//使用路由
const router = useRouter();

//定义响应数据
let userInfo = reactive({
  userId:'',
  loginId:'',
  userName:''
})

//使用生命周期函数
onMounted (()=>{
  //获得登录用户信息
  userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  console.log(userInfo.userName)
  //默认显示页面
  router.push("/app/home")
})

//定义自用方法(箭头函数形式)
const logout = () =>{
  sessionStorage.removeItem('userInfo')
  router.replace('/')
}
</script>

<style scoped>
/*定义index页面的布局及样式*/
.index {
  width: 100%;
  height: 100%;
}
/*头部样式*/
.header {
  box-sizing: border-box;
  width: 100%;
  height: 72px;
  min-width: 600px;
  padding: 5px;
  background: #324057;
  color: #fff;
  border-bottom: 1px solid #324057;
}
.logo-container {
  line-height: 60px;
  min-width: 400px;
}
.logo {
  height: 50px;
  width: 50px;
  margin-right: 5px;
  vertical-align: middle;
  display: inline-block;
}
.title {
  vertical-align: middle;
  font-size: 22px;
  letter-spacing: 3px;
}
.user {
  line-height: 60px;
  text-align: right;
  float: right;
  padding-right: 20px;
}

.container{
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 72px);
}

/*左侧菜单样式*/
.lefter {
  box-sizing: border-box;
  width: 220px;
  min-height: 100%;
  margin: 0;
  padding: 0;
  background-color: #324057;
}
.el-menu {
  border: none;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px;
  min-height: 400px;
  margin: 0;
  padding: 0;

}
.el-menu-vertical {
  margin: 0;
  width: 220px;
  margin: 0;
  padding: 0;

}
.el-submenu .el-menu-item {
  min-width: 220px;
}
.el-menu-item{
  width: 220px;
}
a {
  text-decoration: none;
}

.el-menu-item.is-active{
  background-color: #296a4d;
}

.content {
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
</style>
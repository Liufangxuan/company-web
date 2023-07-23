//定义全局路由: 页面组件之间的跳转逻辑关系
import {createWebHistory,createRouter} from 'vue-router'
//需要路由的页面组件,都需要导入,再定义路由关系
import AppIndex from '../components/app/AppIndex.vue'

import Login from "../components/login/Login.vue"
import UserInfo from "../components/common/UserInfo.vue"

import AppHome from "../components/app/AppHome.vue"

import UserList from "../components/app/UserList.vue"
import GoodsList from "../components/app/GoodsList.vue"
import GyUserList from "../components/app/GyUserList.vue"
import ApartmentList from "../components/app/ApartmentList.vue"
import RoomList from "../components/app/RoomList.vue"
//创建路由模式
const history = createWebHistory()
//定义路由组件
const myRouter = createRouter({
    history,// 路由模式
    routes: [
        {
            path: '/', //浏览器访问 / 时,重定向到/login
            redirect: 'login'
        },
        {//所有的组件要跳转，必须先命名路由
            path: '/login', //访问的url
            name: 'login',
            component: Login //页面组件名称
        },
        {//所有的组件要跳转，必须先命名路由
            path: '/app/index',
            name: 'appindex',
            component: AppIndex,
            children:[//appindex组件包含的子组件
                { path: '/app/login', redirect: to => '/login'},
                { path: '/app/home', name: 'apphome', component: AppHome },
                { path: '/app/userinfo', name: 'app/userinfo', component: UserInfo },
                { path: '/app/userlist', name: 'userlist', component: UserList },
                { path: '/app/goodslist', name: 'goodslist',component: GoodsList},
                { path: '/app/gyuserlist', name: 'gyuserlist', component: GyUserList},
                { path: '/app/apartmentlist', name: 'apartmentlist', component: ApartmentList},
                { path: '/app/roomlist' ,name:'roomlist', component: RoomList},



            ]
        },

    ]
})
//全局路由守护，必须登录后，才能访问vue中的页面组件
myRouter.beforeEach(async (to, from) => {
    let userInfo = sessionStorage.getItem('userInfo');
// 检查用户是否已登录 ，并且要访问的url不等于/login 避免无限重定向
    if (!userInfo && to.path !== '/login') {
// 重定向到登录页面
        return { path: '/login' }
    }
})
export default myRouter;


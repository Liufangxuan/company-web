import { createApp } from 'vue'
//第1步 引用element-plus axios vue-router
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElIcons from '@element-plus/icons-vue'
// 将自动设置 Day.js 的国际化设置为 'zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'
//在src/util/http.js里对axios进行简单封装,这里引入使用
import http from './util/http';
//在src/router/myRouter.js定义路由，这里引入使用
import myRouter from './router/myRouter';
//引入App.vue, App.vue为整个应用的入口组件
import App from './App.vue'
//引入全局样式表
import './style.css'
//第2步 创建vue实例(通过App.vue组件创建vue实例)
const app = createApp(App);
//2.1 ElementPlus按需引入的全局size设置
app.config.globalProperties.$ELEMENT = { size: 'small', zIndex: 3000 }
//2.2 在vue实例中使用ElementPlus
app.use(ElementPlus, {locale});
//2.3 注册ElIcons为全局组件
Object.keys(ElIcons).forEach(key => {
    app.component(key, ElIcons[key])
})
//2.4 在vue实例中使用路由Router
app.use(myRouter);
//2.5 把axios挂载成vue全局属性，然后通过this.$http引用axios
app.config.globalProperties.$http = http
//第3步 挂载vue实例到html div容器上
app.mount('#app')


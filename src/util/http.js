//对axios进行简单封装
import axios from 'axios'
// 创建 axios 实例
const http = axios.create({
//访问8090的后端服务接口
    baseURL: 'http://localhost:8090',
    headers: {
        get: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        post: {
            'Content-Type': 'application/json;charset=utf-8',
        },
    },
// 是否跨站点访问控制请求
    withCredentials: false,
    timeout: 30000,
})
// 请求拦截器
http.interceptors.request.use(
// 可以在把请求发送给后端服务器前,进行拦截处理
    (config) => {
// 比如:
// 每个请求都必须先验证是否已经经过登录验证, 是否有权限等等
// 从localSession获得当前用户的认证信息
// 也可以对每个请求 加上一个已经认证令牌(token),让后端去验证该请求是否合法
//config.headers['Authorization'] = 'token信息'
        return config
    })
// 响应拦截器
http.interceptors.response.use(
    (response) => {
// 可以自己封装响应处理
        return response
    })
export default http;

<template>
  <el-card>
    <template #header>
      <div>
        <span>用户列表</span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button class="button"
                   size="mini"
                   @click="onAdd()"
                   type="primary">
          注册用户
        </el-button>
      </div>
    </template>
    <div class="table-container">
      <el-table
          :data="state.list.slice((pagination.currentPage-1)*pagination.pageSize,pagination.currentPage*pagination.pageSize)"
          stripe
          style="width: 100%">
        <el-table-column
            type="index"
            prop=""
            label=""
            :index="(index)=>{ return (pagination.currentPage-1)*pagination.pageSize + index + 1 }"
            width="50">
        </el-table-column>
        <el-table-column
            prop="loginId"
            label="账号"
            width="150">
        </el-table-column>
        <el-table-column
            prop="userName"
            label="姓名"
            width="120">
        </el-table-column>
        <el-table-column
            prop="userType"
            label="性别"
            width="150">
          <template #default="scope">
            <span v-if="scope.row.userType == '0'">男</span>
            <span v-if="scope.row.userType == '1'">女</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱">
        </el-table-column>
        <el-table-column
            prop="mobile"
            label="电话号码">
        </el-table-column>
        <el-table-column
            prop="currentStatus"
            label="状态"
            width="60">
          <template #default="scope">
            <span v-if="scope.row.currentStatus == '0'">正常</span>
            <span v-if="scope.row.currentStatus == '1'">禁用</span>
          </template>
        </el-table-column>
        <el-table-column
            prop=""
            label="操作"
            align="center"
            width="150">
          <template #default="scope">
            <el-button size="small" plain
                       type="primary"
                       @click="onEdit(scope.$index)">&nbsp;修改</el-button>
            <el-popconfirm
                title="确定删除该数据吗？"
                @confirm="onDelete(scope.$index)"
            >
              <template #reference>
                <el-button size="small" plain
                           type="danger">&nbsp;删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @current-change="handleCurrentChange"
          v-model:current-page = "pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total,prev, pager, next">
      </el-pagination>
    </div>

    <!--注册用户对话框-->
    <el-dialog
        width="50%"
        v-model="state.dialogAdd.show"
        :title="state.dialogAdd.title"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :modal-append-to-body='false'>
      <!--使用el-form组件进行数据添加和修改-->
      <el-form
          ref="myformAdd"
          :model="state.mymodel"
          label-width="150px"
          style="margin:10px;width:auto;">
        <el-form-item label="登录账号" required>
          <el-col :span="15">
            <el-form-item prop='loginId'>
              <el-input type="string" v-model="state.mymodel.loginId"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="登录密码" required>
          <el-col :span="15">
            <el-form-item prop='currentPassword'>
              <el-input type="password" v-model="state.mymodel.currentPassword"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item prop='currentPassword2' label="重复密码">
          <el-col :span="15">
            <el-input type="password" v-model="state.mymodel.currentPassword2"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop='userType' label="账号类型:">
          <!--使用label表示值-->
          <el-radio-group v-model="state.mymodel.userType">
            <el-radio-button label="0">男</el-radio-button>
            <el-radio-button label="1">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-col :span="15">
            <el-form-item prop='userName'>
              <el-input type="string" v-model="state.mymodel.userName"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item prop='mobile' label="手机号码:">
          <el-col :span="15">
            <el-input type="string" v-model="state.mymodel.mobile"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop='email' label="电子邮箱:">
          <el-col :span="15">
            <el-input type="string" v-model="state.mymodel.email"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item class="text_right">
          <el-button type="primary" @click='onAddSave(myformAdd)'>保 存</el-button>
            <el-button @click="state.dialogAdd.show = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改用户信息对话框-->
    <el-dialog
        width="50%"
        v-model="state.dialogEdit.show"
        :title="state.dialogEdit.title"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :modal-append-to-body='false'>

      <!--使用el-form组件进行数据添加和修改-->
      <!--:rules="myrulesEdit"设置表单检验规则-->
      <el-form
          ref="myformEdit"
          :model="state.mymodel"
          label-width="150px"
          style="margin:10px;width:auto;">
        <!--如果是修改,则账号为只读-->
        <el-form-item label="登录账号">
          <el-col :span="15">
            <el-form-item prop='userLoginId'>
              <el-input type="string" readonly v-model="state.mymodel.loginId"></el-input>账号不能修改
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item prop='userType' label="账号类型:">
          <!--使用label表示值-->
          <el-radio-group v-model="state.mymodel.userType">
            <el-radio-button label="0">男</el-radio-button>
            <el-radio-button label="1">女</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="姓名" required>
          <el-col :span="15">
            <el-form-item prop='userName'>
              <el-input type="string" v-model="state.mymodel.userName"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item prop='mobile' label="手机号码:">
          <el-col :span="15">
            <el-input type="string" v-model="state.mymodel.mobile"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop='email' label="电子邮箱:">
          <el-col :span="15">
            <el-input type="string" v-model="state.mymodel.email"></el-input>
          </el-col>
        </el-form-item>
        
        <el-form-item class="text_right">
          <el-button type="primary" @click='onEditSave(myformEdit)'>保 存</el-button>
            <el-button @click="state.dialogEdit.show = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </el-card>
</template>

<script setup>
//Vue3.x 组合式API写法

import {ref,reactive,onMounted} from "vue";
import { ElMessage } from 'element-plus';

import http from "../../util/http.js";

//使用一个reactive方法让状态作为响应式对象
const state = reactive({
  list:[
    {
      userId:'111111',
      loginId:'admin',
      currentPassword:'1111',
      userName:'系统管理员admin',
      email:'admin@hbxy.cn',
      mobile:'18888888888',
      userType:'0',
      currentStatus:'0'
    },
    {
      userId:'22222',
      loginId:'hahaha',
      currentPassword:'123',
      userName:'哈哈哈',
      email:'hahaha@hbxy.cn',
      mobile:'18888888888',
      userType:'1',
      currentStatus:'0'
    },
  ],
  mymodel:{
    userId:'',
    userName:'',
    currentPassword:'',
    currentPassword2:'',
    email: '',
    mobile:'',
    userType:'1',
    currentStatus:'0'
  },
  dialogAdd:{
    title:'',
    show:false,
    option:''
  },
  dialogEdit:{
    title:'',
    show:false,
    option:''
  },
  item:{},
  selectedIndex:-1,
})

//翻页参数对象
const pagination=reactive({
  currentPage:1, //当前页(默认第一页)
  pageSize:3, //每页显示条目个数
  total:state.list.length, //总条目数
})

//生命周期钩子
onMounted(() =>{
  http.get("/user").then(res=>{
    if(res.status === 200){
//更新表格
      state.list = res.data;
//更新翻页数据
      pagination.total = state.list.length;
    }else{
      ElMessage.error('获取数据失败');
    }
  }).catch(err=>{
    console.log(err)
    ElMessage.error('获取数据失败');
  })
})

//响应注册按钮,打开注册对话框
const onAdd = () =>{
//清空表单
  state.mymodel = {
    userId:'',
    userName:'',
    currentPassword:'',
    currentPassword2:'',
    email: '',
    mobile:'',
    userType:'1',
    currentStatus:'0'
  }
//弹出注册对话框
  state.dialogAdd = {
    title: '用户注册',
    show: true,
    option: 'add'
  }

}

//响应注册对话框保存按钮
const myformAdd = ref();
const onAddSave = async (form)=>{
  await form.validate(valid=>{
    if(valid){
      http.post("/user",state.mymodel).then(res=>{
// 操作成功
        ElMessage({
          message: "保存成功！",
          type: "success"
        });

//跟新表格
        state.list.push(res.data);

        pagination.total = state.list.length;

//清空表单
        state.mymodel = {
          userId:'',
          userName:'',
          currentPassword:'',
          currentPassword2:'',
          email: '',
          mobile:'',
          userType:'1',
          currentStatus:'0'
        }

//关闭对话框
        state.dialogAdd = {
          title: '',
          show: false,
          option: ''
        }

      })
    }

  })
}

//响应修改按钮,打开修改对话框
const onEdit = (index) =>{
//获得要修改用户的信息
//由于进行了翻页,传进来的index为当前页的行索引,需要转换为数组索引
  let listIndex = (pagination.currentPage-1) * pagination.pageSize + index

  let user = state.list[listIndex];
//临时保存选中的索引
  state.selectedIndex = listIndex;
//回填数据
  state.mymodel = {
    userId:user.userId,
    loginId:user.loginId,
    userName:user.userName,
    currentPassword:'',
    currentPassword2:'',
    email: user.email,
    mobile:user.mobile,
    userType:user.userType,
    currentStatus:user.currentStatus
  },

//弹出注册对话框
      state.dialogEdit = {
        title: '修改用户信息',
        show: true,
        option: 'add'
      }
}

//响应修改对话框保存按钮
const myformEdit = ref()
const onEditSave = async (form)=>{
  await form.validate(valid=>{
    if(valid){
      http.put("/user",state.mymodel).then(res=>{
//操作成功
        ElMessage({
          message: "保存成功！",
          type: "success"
        });

        //更新表格
        state.list.splice(state.selectedIndex,1,res.data)
//清空表单
        state.mymodel = {
          userId:'',
          userName:'',
          currentPassword:'',
          currentPassword2:'',
          email: '',
          mobile:'',
          userType:'1',
          currentStatus:'0'
        }
//重置selectedIndex
        state.selectedIndex = -1;
//关闭对话框
        state.dialogEdit = {
          title: '',
          show: false,
          option: ''
        }
      })
    }
  })
}
//响应删除按钮
const onDelete = (index) =>{
//删除被选中的数据
//由于进行了翻页,传进来的index为当前页的行索引,需要转换为数组索引
  let listIndex = (pagination.currentPage-1) * pagination.pageSize + index

//删除
  let userId = state.list[listIndex].userId;
  http.delete("/user/" + userId).then(res => {
    if (res.data == 200){
      ElMessage("删除成功");
// 删除table起始下标为1，长度为1的一个值
      state.list.splice(index, 1);
    }
  });
}

//表格翻页控制方法
const handleCurrentChange = (val) => {
  pagination.currentPage = val;
}

</script>

<style scoped>
.table-container{
  text-align: right;
}
</style>
<template>
  <el-card>
    <template #header>
      <div>
        <span>住户列表</span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button class="button"
                   size="mini"
                   @click="onAdd()"
                   type="primary">
          添加住户
        </el-button>
      </div>
    </template>
    <el-table
        :data="gyuserlist"
        :stripe="true"
        style="width:100%">
      <el-table-column
          type="index"
          label=""
          align="center"
          width="60">
      </el-table-column>
      <el-table-column
          prop="userName"
          label="姓名"
          width="80">
      </el-table-column>
      <el-table-column
          prop="userSex"
          label="性别"
          width="80">
        <template #default="scope">
          <span v-if="scope.row.userSex == '0'">男</span>
          <span v-if="scope.row.userSex == '1'">女</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="mobile"
          label="电话号码">

      </el-table-column>

      <el-table-column
          prop="section"
          label="部门"
          width="120px">
      </el-table-column>
      <el-table-column
          prop="inDate"
          label="入住时间"
          width="150">
        <template #default="scope">
          <span v-text="formatDate(scope.row.inDate)"></span>
        </template>
      </el-table-column>
      <el-table-column
          prop="outDate"
          label="退房时间"
          width="150">
        <template #default="scope">
          <span v-text="formatDate(scope.row.outDate)"></span>
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
    <!--对话框-->
    <el-dialog
        width="40%"
        v-model="dialog.show"
        :title="dialog.title"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :modal-append-to-body='false'>
      <el-form
          :model="mymodel"
          :rules="myrule"
          ref="myform">
        <el-form-item label="姓名" required prop="userName">
          <el-col :span="15">
            <el-input
                type="text"
                v-model="mymodel.userName">
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop='userSex' label="性别:">
          <!--使用label表示值-->
          <el-radio-group v-model="mymodel.userSex">
            <el-radio-button label="0">男</el-radio-button>
            <el-radio-button label="1">女</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop='mobile' label="手机号码:">
          <el-col :span="15">
            <el-input type="string" v-model="mymodel.mobile"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="mymodel.section">
            <!--如果mymodel.clazz值等于:key = "item.id",则该选项被选中-->
            <el-option
                v-for="item in section"
                :key = "item.userId"
                :label="item.userName"
                :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入住日期" required prop="inDate">
          <el-col :span="15">
            <el-date-picker
                v-model="mymodel.inDate"
                type="date"
                placeholder="选择日期">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="退房日期" required prop="outDate">
          <el-col :span="15">
            <el-date-picker
                v-model="mymodel.outDate"
                type="date"
                placeholder="选择日期">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
        </el-form-item>
        <el-form-item class="text_right">
          <el-button type="primary" @click='onSave("myform")'>保 存</el-button>
          <el-button @click="dialog.show = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>

</template>

<script>
//Vue2.x 选项式API写法 (V3.x完全兼容选项式API)
import http from "../../util/http.js";
import {ElMessage} from "element-plus";
export default {
  name: "GyUserList",
// 定义响应式数据
  data: function () {
    return {
      gyuserlist: [],
      mymodel:{
        userId: "",
        userName: "",
        userSex: "1",
        mobile:"111111111111",
        section:"总经理办公室",
        inDate: "",
        outDate:""
      },
      section:[
        {
          userId: '总经理办公室',
          userName: '总经理办公室'
        },
        {
          userId: '行政部',
          userName: '行政部'
        },
        {
          userId: '人力资源部',
          userName: '人力资源部'
        },
        {
          userId: '生产技术部',
          userName: '生产技术部'
        },
        {
          userId: '财务部',
          userName: '财务部'
        },
      ],
      myrule:{
        userName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
        ],
        inDate: [
          { required: true, message: '入住日期不能为空', trigger: 'blur' },
        ],
        outDate: [
          { required: true, message: '退房日期不能为空', trigger: 'blur' },
        ]
      },
      dialog:{
        title:'',
        show: false,
        option: ''
      },

      selectedIndex:-1,
      userInfo:{}
    }
  },
//生命周期函数
  mounted() {
    this.initTable();
  },
//定义各种函数
  methods: {
    //初始化表格
    initTable(){
      this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      const params = {
        userId: this.userInfo.userId,
        currentStatus: ""
      };
      http.get("/gyUser", {params: params}).then(res => {
//console.log(res.data)
        this.gyuserlist = res.data
      })
    },
//打开添加任务对话框
    onAdd: function () {
//清空表单旧数据
      this.mymodel = {
        userId: "",
        userName: "",
        userSex:"0",
        mobile:"",
        section:"总经理办公室",
        inDate: "",
        outDate:""
      }
//打开对话框
      this.dialog={
        title:'添加任务',
        show: true,
        option: 'add'
      }
    },
//打开修改任务对话框
    onEdit:function (index) {
//回填表单
      let gyUser = this.gyuserlist[index];
      this.mymodel = {
        userId: gyUser.userId,
        userName: gyUser.userName,
        userSex: gyUser.userSex,
        mobile: gyUser.mobile,
        section: gyUser.section,
        inDate: gyUser.inDate,
        outDate: gyUser.outDate
      }
//临时保存选中的索引
      this.selectedIndex = index
//打开对话框
      this.dialog={
        title:'修改任务',
        show: true,
        option: 'edit'
      }
    },
//保存
    onSave(formName){
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      if(this.dialog.option == 'add'){
//添加保存
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.mymodel.userId = this.userInfo.userId;
            http.post("/gyUser",this.mymodel).then(res=>{
//console.log(res.data)
              ElMessage({
                message: '添加成功！',
                type: 'success'
              })
//更新表格
//this.todolist.push(res.data)
              this.initTable();
//清空表单旧数据
              this.mymodel = {
                userId: "",
                userName: "",
                userSex:"0",
                mobile:"",
                section:"总经理办公室",
                inDate: "",
                outDate:""
              }
//关闭对话框
              this.dialog={
                title:'',
                show: false,
                option: ''
              }
            })
          }
        })
      }else if(this.dialog.option == 'edit'){
//修改保存
        this.$refs[formName].validate((valid) => {
          if (valid) {
            http.put("/gyUser",this.mymodel).then(res=>{
//console.log(res.data)
              ElMessage({
                message: '修改成功！',
                type: 'success'
              })
//更新表格
              this.initTable();
//清空表单旧数据
              this.mymodel = {
                userId: "",
                userName: "",
                userSex:"0",
                mobile:"",
                section:"总经理办公室",
                inDate: "",
                outDate:""
              }
//关闭对话框
              this.dialog={
                title:'',
                show: false,
                option: ''
              }
            })
          }
        })
      }
    },
//删除任务
    onDelete: function (index) {
      http.delete("/gyUser/" + this.gyuserlist[index].userId).then(res => {
        if (res.data == '200') {
          ElMessage('删除成功！')
          this.gyuserlist.splice(index, 1)
        }
      })
    },
//时间格式化成中国时间
    formatDate:function (itemDate) {
      let date = new Date(itemDate);
      let seperator1 = "-";
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    }
  }
}

</script>

<style scoped>

</style>
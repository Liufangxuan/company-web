<template>
  <el-card>
    <template #header>
      <div>
        <span>房间信息列表</span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button class="button"
                   size="mini"
                   @click="onAdd()"
                   type="primary">
          添加房间信息
        </el-button>
      </div>
    </template>
    <el-table
        :data="roomlist"
        :stripe="true"
        style="width:100%">
      <el-table-column
          type="index"
          label=""
          align="center"
          width="80">
      </el-table-column>
      <el-table-column
          prop="apartmentId"
          label="公寓楼名称"
          width="150">
      </el-table-column>
      <el-table-column
          prop="apartmentNum"
          label="楼号"
          width="150">
      </el-table-column>
      <el-table-column
          prop="roomNum"
          label="房间号"
          width="260">
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

        <el-form-item label="公寓楼名称" >
          <el-col :span="15">
            <el-input
                type="string"
                v-model="mymodel.apartmentId">
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="楼号" required prop="apartmentNum">
          <el-col :span="15">
            <el-input
                type="string"
                v-model="mymodel.apartmentNum">
            </el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="房间号" required prop="roomNum">
          <el-col :span="15">
            <el-input
                type="string"
                v-model="mymodel.roomNum">
            </el-input>
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
  name: "RoomList",
// 定义响应式数据
  data: function () {
    return {
      roomlist: [],
      mymodel:{
        roomId:"",
        apartmentId: "",
        apartmentNum: "",
        roomNum:""
      },
      myrule:{},
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
      http.get("/room", {params: params}).then(res => {
//console.log(res.data)
        this.roomlist = res.data
      })
    },
//打开添加任务对话框
    onAdd: function () {
//清空表单旧数据
      this.mymodel = {
        roomId:"",
        apartmentId: "",
        apartmentNum: "",
        roomNum:""

      }
//打开对话框
      this.dialog={
        title:'添加信息',
        show: true,
        option: 'add'
      }
    },
//打开修改任务对话框
    onEdit:function (index) {
//回填表单
      let room = this.roomlist[index];
      this.mymodel = {
        roomId: room.roomId,
        apartmentId: room.apartmentId,
        apartmentNum: room.apartmentNum,
        roomNum:room.roomNum
      }
//临时保存选中的索引
      this.selectedIndex = index
//打开对话框
      this.dialog={
        title:'修改信息',
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
            http.post("/room",this.mymodel).then(res=>{
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
                roomId:"",
                apartmentId: "",
                apartmentNum: "",
                roomNum:""
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
      }else
      if(this.dialog.option == 'edit'){
//修改保存
        this.$refs[formName].validate((valid) => {
          if (valid) {
            http.put("/room",this.mymodel).then(res=>{
//console.log(res.data)
              ElMessage({
                message: '修改成功！',
                type: 'success'
              })
//更新表格
//this.todolist.splice(this.selectedIndex,1,res.data)
              this.initTable();
//清空表单旧数据
              this.mymodel = {
                roomId:"",
                apartmentId: "",
                apartmentNum: "",
                roomNum:""
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
//完成任务


//删除任务
    onDelete: function (index) {
      http.delete("/room/" + this.roomlist[index].roomId).then(res => {
        if (res.data == '200') {
          ElMessage('删除成功！')
          this.roomlist.splice(index, 1)
        }
      })
    },

  }
}
</script>

<style scoped>

</style>
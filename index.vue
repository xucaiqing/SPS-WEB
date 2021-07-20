<template>
<div class="cont">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="ruleForm">
          <el-divider content-position="left">条件查询</el-divider>
          <el-row :gutter="24">
            <el-col :span="5">
              <el-form-item label="门店编码" >
                <el-input v-model="ruleForm.storeId" autocomplete="off" placeholder="支持模糊匹配" @keyup.enter.native="orgQueryFunc()" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="开始时间" prop="startDate">
                <el-date-picker v-model="ruleForm.startDate" type="date" placeholder="开始时间" format="yyyy-MM-dd"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="截止时间" prop="finishDate">
                <el-date-picker v-model="ruleForm.finishDate" type="date" placeholder="截止时间" format="yyyy-MM-dd"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="状态" >
             <el-select v-model="ruleForm.taskState" filterable placeholder="请选择">
              <el-option
                v-for="item in taskStateList"
                :key="item.taskState"
                :label="item.taskStateName"
                :value="item.taskState"
              />
            </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button type="primary" plain @click="findTaskListFunc()">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>


    <el-button type="primary" icon="el-icon-plus" @click="addTask()">新增任务</el-button>
    <el-button type="info" icon="el-icon-document" plain @click="addTemplate()">管理模板</el-button>
    <el-button type="primary" icon="el-icon-document-add" plain @click="addStep()">管理步骤</el-button>
    <!--任务状态:N-未开始;I-ing进行中;F-failure失败;Y-成功;C-cancel取消;P-partly部分成功-->
    <div class="table-cont">
      <el-table
        :data="taskList"
        style="width: 100%"
      >
        <el-table-column prop="taskName" label="任务名称" />
        <el-table-column prop="templateName" label="模板名称" />
        <el-table-column prop="bigAreaName" label="大区" />
        <el-table-column prop="storeName" label="门店" />
        <el-table-column prop="storeId" label="门店编码" />
        <el-table-column prop="startDate" label="开始时间" />
        <el-table-column prop="finishDate" label="结束时间" />
        <el-table-column prop="taskStateName" label="任务状态">
          <template slot-scope="{row}">
            <el-tag v-if="row.taskState=='Y'" type="success" plain>成功</el-tag>
            <el-tag v-if="row.taskState=='F'" type="danger">失败</el-tag>
            <el-tag v-if="row.taskState=='N'" type="info">未开始</el-tag>
            <el-tag v-if="row.taskState=='I'" type="primary">进行中</el-tag>
            <el-tag v-if="row.taskState=='C'" type="warning">取消</el-tag>
            <el-tag v-if="row.taskState=='P'" type="warning">部分成功</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="taskStateName" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="checkFunc(scope.row)">查看</el-button>
            <el-button type="danger" @click="executeFunc(scope.row)">再次执行</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="footer">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[50, 100, 150,200, 250,300]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

      </el-card>
</div>
</template>

<script>
import {
  findTaskList,
} from '@/api/sct'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      value1: true,
      value2: false,
      taskList: [],
      currentPage: 1,
      pageSize: 50,
      totalCount: 0,
      taskId: '',
      ruleForm:{
         storeId: '',
         startDate:'',
         finishDate:'',
         taskState:'',
      },
      taskStateList:[
        {taskState:'C',taskStateName:'取消'},
        {taskState:'F',taskStateName:'失败'},
        {taskState:'I',taskStateName:'进行中'},
        {taskState:'N',taskStateName:'未开始'},
        {taskState:'P',taskStateName:'部分成功'},
        {taskState:'Y',taskStateName:'成功'},
        ]

    }
  },

  created() {
    var u = this.$store.getters.users
    var roleCode = u.roleCode
    this.roleCode = roleCode
    this.loginUserId = u.userId
    this.loginUserName = u.userName
  },
  activated() {
    console.log('activated')
    this.findTaskListFunc()
  },
  methods: {
    findTaskListFunc() {
      if(this.ruleForm.startDate){
        let _sd = dayjs(this.ruleForm.startDate);
        this.ruleForm.startDate = _sd.format('YYYY-MM-DD');
      }
      if(this.ruleForm.finishDate){
        let _fd = dayjs(this.ruleForm.finishDate);
        this.ruleForm.finishDate = _fd.format('YYYY-MM-DD');
      }
      var that = this
      findTaskList({ ...this.ruleForm, loginUserId: this.loginUserId, pageNum: this.currentPage, pageSize: this.pageSize }).then((rsp) => {
      // if (!this.ruleForm.storeId ) {
      //   this.$message({
      //     showClose: true,
      //     message: '请输入门店编码',
      //     type: 'danger'
      //   })
      //   return
      // }
        var t = rsp.data.taskList ? rsp.data.taskList : null
        that.taskList = t
        that.totalCount = rsp.data.totalCount
        that.$forceUpdate()
      })
    },

    checkFunc(row) {
      if (row && !row.taskId) {
        row = row.row
      }
      this.$router.push(
        {
          path: '/sct/execute',
          query: {
            taskId: row.taskId,
            viewFlg: true
          }
        })
    },

    executeFunc(row) {
      this.$router.push(
        {
          path: '/sct/execute'
        })
    },

    addTask() {
      this.$router.push({
        path: '/sct/execute'
      })
    },

    addTemplate() {
      this.$router.push({
        path: '/sct/template'
      })
    },
    addStep() {
      this.$router.push({
        path: '/sct/step'
      })
    },

    handleSizeChange(val) { // 分页大小
      this.pageSize = val
      this.$forceUpdate()
      console.log(`handleSizeChange 每页 ${val} 条 ,每页 ${this.currentPage} 条 `)
      this.findTaskListFunc()
    },

    handleCurrentChange(val) { // 切换页面
      console.log(`handleCurrentChange 每页 ${this.pageSize} 条 ,每页 ${val} 条 `)
      this.currentPage = val
      this.$forceUpdate()
      this.findTaskListFunc()
    },



  }
}
</script>

<style>
.el-tag--medium {
    height: 22px;
    line-height: 20px;
}
.switchStyle .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
.switchStyle .el-switch__label--left {
  z-index: 9;
  left: 22px;
}
.switchStyle .el-switch__label--right {
  z-index: 9;
  left: -5px;
}
.switchStyle .el-switch__label.is-active {
  display: block;
}
.switchStyle.el-switch .el-switch__core,.el-switch .el-switch__label {
  width: 52px !important;
}

.el-tag.el-tag--info {
    background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
}

.el-tag.el-tag--primary {
    background-color: #ecf5ff;
    border-color: #d9ecff;
    color: #409eff;
}
.footer{
  margin-top:20px;
}

.el-table .el-button--medium{
  padding: 5px 10px;
  font-size: 12px;
}
.table-cont{
  padding-top:20px;
}
.cont{padding:20px;}
</style>

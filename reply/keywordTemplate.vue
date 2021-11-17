<template>
  <div class="el-card__body">
    <el-button type="primary" icon="el-icon-plus" @click="addTemplate()">新增模板</el-button>
    <el-button type="primary" plain @click="findTemplateListFunc">查询</el-button>
    <el-button type="danger" plain @click="cancel">返回</el-button>

    <el-card class="box-card">

      <div class="table-cont">
        <el-table
          :data="templateList"
          style="width: 100%"
        >
          <el-table-column prop="templateName" label="模板名称" />
          <el-table-column prop="opportunityName" label="是否为调用时机" />
          <el-table-column prop="redirectFlgName" label="是否转发其他地址" />
          <el-table-column prop="redirectUri" label="转发路径" />
          <el-table-column prop="redirectMethod" label="转发方法" />
          <el-table-column prop="serviceCode" label="不转发时服务码" />
          <el-table-column prop="rspTypeName" label="转发结果类型" />
          <el-table-column prop="frontBtnName" label="前端按钮名称" />
          <el-table-column prop="successKey" label="调用成功判断字段" />
          <el-table-column prop="successValue" label="调用成功时判断字段应有值" />
          <el-table-column prop="failureMsgKey" label="失败提示语字段" />

          <el-table-column label="操作" width="180">
            <template slot-scope="{row}">
              <el-button type="info" plain @click="modifyFunc(row)">修改</el-button>
              <el-button type="danger" plain @click="deleteFunc(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <div class="footer">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10,20,50,100,150,200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

  </div>
</template>

<script>
import {
  findTemplateList,
  updateTemplateRecordState
} from '@/api/reply'
export default {
  data() {
    return {
      pageSize: 20,
      totalCount: 0,
      templateList: [],
      templateId: '',
      templateName: null,
      currentPage: 1,
      pageSize: 20,
      totalCount: 0

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
    this.findTemplateListFunc()
  },
  methods: {
    findTemplateListFunc() {
      var that = this
      findTemplateList({ ...this.ruleForm, pageNum: this.currentPage, pageSize: this.pageSize, loginUserId: this.loginUserId }).then((rsp) => {
        var t = rsp.data.templateList ? rsp.data.templateList : null
        that.templateList = t
        that.totalCount = rsp.data.totalCount
        that.$forceUpdate()
      })
    },
    handleSizeChange(val) { // 分页大小
      this.pageSize = val
      this.$forceUpdate()
      console.log(`handleSizeChange 每页 ${val} 条 ,每页 ${this.currentPage} 条 `)
      this.findTemplateListFunc()
    },

    handleCurrentChange(val) { // 切换页面
      console.log(`handleCurrentChange 每页 ${this.pageSize} 条 ,每页 ${val} 条 `)
      this.currentPage = val
      this.$forceUpdate()
      this.findTemplateListFunc()
    },

    deleteFunc(row) {
      var p = { templateId: row.templateId, updateUserId: this.loginUserId, updateUserName: this.loginUserName }; var that = this
      p.recordState = 'N'
      updateTemplateRecordState(p).then((rsp) => {
        this.$message({
          type: 'info',
          message: rsp.rspMsg
        })
        that.findTemplateListFunc()
      })
    },
    cancel() {
      this.$forceUpdate()
      this.$router.go(-1)
    },

    addTemplate() {
      this.$router.push({
        path: '/reply/addTemplate'
      })
    },
    modifyFunc(row) {
      this.$router.push({
        path: '/reply/addTemplate',
        query: {
          templateId: row.templateId

        }
      })
    }

  }
}
</script>

<style>
.el-table th,.el-table td{padding-left:10px;}
.el-button--success.is-plain {
    color: #18d6a0;
    background: #e8fbf6;
    border-color: #a3efd9;
}

.footer{
  margin-top:20px;
}

.box-card{
  margin-top:10px;
}
.el-card__body{
  padding-top:10px;
}

.box-card .el-button--medium{
  padding: 6px 15px;
  font-size: 13px;
}
.temp-title .el-form-item__label{
  font-size:16px;
  font-weight: bold;
  }
.temp-cont{
  border-bottom:1px dotted #eee;
  margin-bottom:20px;
  }

</style>

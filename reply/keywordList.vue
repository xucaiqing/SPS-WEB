<template>
  <div class="cont">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="ruleForm" label-width="110px" class="ruleForm" :model="ruleForm">
          <el-divider content-position="left">条件查询</el-divider>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="关键字">
                <el-input v-model="ruleForm.keyword" autocomplete="off" placeholder="支持模糊匹配" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="记录状态">
                <el-select v-model="ruleForm.recordState" placeholder="请选择" filterable>
                  <el-option value="Y" label="有效" />
                  <el-option value="N" label="无效" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button type="primary" @click="findReplyListFunc()">查询</el-button>
                <el-button type="info" @click="showInfoPanelFunc()">新增</el-button>
                <el-button type="primary" plain @click="addTemplate()">管理模板</el-button>
                <el-button type="info" plain @click="refreshRedisReplyFunc()">刷新缓存</el-button>
                <el-button type="info" plain @click="turnPreviewFunc()">预览</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="table-cont">
        <el-table
          :data="replyList"
          style="width: 100%"
        >
          <el-table-column prop="keyword" label="关键字" />
          <el-table-column prop="title" label="关键字标题" />
          <el-table-column prop="replyMsgTypeName" label="回复消息类型" />
          <el-table-column prop="replyMsg" label="回复内容" />
          <el-table-column prop="replyMsgMini" label="小程序回复内容" />
          <el-table-column prop="placeholder" label="占位符" />
          <el-table-column prop="queryTypeName" label="匹配方式" />
          <el-table-column prop="useCount" label="使用次数" width="80" />
          <el-table-column prop="recordState" label="记录状态" width="90" />
          <el-table-column prop="createDate" label="创建时间" width="90" />
          <el-table-column prop="updateDate" label="更新时间" width="90" />
          <el-table-column label="操作" width="140">
            <template slot-scope="{row}">
              <el-button type="info" plain @click="showInfoPanelFunc(row)">修改</el-button>
              <el-button type="danger" plain @click="deleteFunc(row)">{{row.recordState=='Y'?'删除':'启用'}}</el-button>
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

    <el-dialog :visible.sync="infoVisible" append-to-body width="45%" height="10%" :title="infoTitle">
      <addKeyword v-if="infoVisible" ref="addKeyword" />
    </el-dialog>

  </div>
</template>

<script>
import {
  findReplyList,
  loadReplyInfo,
  updateReplyRecordState,
  refreshRedisReply
} from '@/api/reply'
import addKeyword from './addKeyword'
export default {
  components: {
    addKeyword
  },
  data() {
    return {
      replyList: [],
      templateIdList: [],
      replyId: '',
      currentPage: 1,
      pageSize: 50,
      totalCount: 0,
      ruleForm: {
        keyword: '',
        recordState:''
      },
      infoTitle: '新增关键字',
      infoVisible: false,
      templateDialogVisible: false
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
    this.findReplyListFunc()
    console.log('activated')
  },
  methods: {
    findReplyListFunc() {
      var that = this
      findReplyList({ ...this.ruleForm, loginUserId: this.loginUserId, pageNum: this.currentPage, pageSize: this.pageSize }).then((rsp) => {
        var t = rsp.data.replyList ? rsp.data.replyList : null
        that.replyList = t
        that.totalCount = rsp.data.totalCount
        that.$forceUpdate()
      })
    },
    deleteFunc(row) {
      var p = { replyId: row.replyId, updateUserId: this.loginUserId, updateUserName: this.loginUserName }; var that = this
      var r=row.recordState=='Y'?'N':'Y'
      p.recordState=r
      updateReplyRecordState(p).then((rsp) => {
        this.$message({
          type: 'info',
          message: rsp.rspMsg
        })
        that.findReplyListFunc()
      })
    },
    // 新增、修改
    showInfoPanelFunc(row) {
      var id = null
      if (row && row.replyId) {
        this.infoTitle = '修改关键字'
        id = row.replyId
      } else {
        this.infoTitle = '新增关键字'
      }
      this.infoVisible = true
      this.$nextTick(() => {
        this.$refs.addKeyword.initData(id, this.showInfoCallbackFunc)
      })
    },
    showInfoCallbackFunc() {
      this.infoVisible = false
      this.findReplyListFunc()
    },

    handleSizeChange(val) { // 分页大小
      this.pageSize = val
      this.$forceUpdate()
      console.log(`handleSizeChange 每页 ${val} 条 ,每页 ${this.currentPage} 条 `)
      this.findReplyListFunc()
    },

    handleCurrentChange(val) { // 切换页面
      console.log(`handleCurrentChange 每页 ${this.pageSize} 条 ,每页 ${val} 条 `)
      this.currentPage = val
      this.$forceUpdate()
      this.findReplyListFunc()
    },
    // 刷新
    refreshRedisReplyFunc() {
      refreshRedisReply().then((rsp) => {
        this.$message({
          type: 'info',
          message: rsp.rspMsg
        })
        this.findReplyListFunc()
      })
    },
    addTemplate() {
      this.$router.push({
        path: '/reply/keywordTemplate'
      })
    },
    turnPreviewFunc() {
      this.$router.push({
        path: '/reply/preview'
      })
    }
  }
}
</script>

<style>

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

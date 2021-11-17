<template>
  <div class="cont">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="ruleForm" :model="ruleForm" label-width="110px" class="ruleForm" :rules="rules">
              <el-form-item label="选择模板">
                <el-select v-model="ruleForm.templateIdList" placeholder="可多选" filterable multiple @change="findTemplateListFunc">
                  <el-option
                    v-for="item in templateList"
                    :key="item.templateId"
                    :label=" item.templateId +' - '+item.templateName"
                    :value="item.templateId"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="关键字">
                <el-input v-model="ruleForm.keyword" />
              </el-form-item>

              <el-form-item label="关键字标题">
                <el-input v-model="ruleForm.title" />
              </el-form-item>

              <el-form-item label="回复消息类型">
                <el-select v-model="ruleForm.replyMsgType" placeholder="请选择" filterable>
                  <el-option value="1" label="固定的文本内容" />
                  <el-option value="2" label="固定的链接" />
                  <el-option value="3" label="默认主页" />
                </el-select>
              </el-form-item>

             <el-form-item label="回复内容">
                <el-input v-model="ruleForm.replyMsg" type="textarea" />
              </el-form-item>

             <el-form-item label="小程序回复内容">
                <el-input v-model="ruleForm.replyMsgMini" type="textarea" />
              </el-form-item>

              <el-form-item label="占位符">
                <el-input v-model="ruleForm.placeholder" />
              </el-form-item>

              <el-form-item label="匹配方式">
                <el-select v-model="ruleForm.queryType" placeholder="请选择" filterable>
                  <el-option value="1" label="精确" />
                  <el-option value="2" label="模糊" />
                  <el-option value="3" label="单字符顺序全模糊" />
                  <el-option value="4" label="单字符无顺序全模糊" />
                  <el-option value="5" label="部分字符匹配" />
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" plain @click="saveFunc">保存</el-button>
                <el-button type="button" @click="closeCurrentPop()">返回</el-button>
              </el-form-item>

        </el-form>
      </div>
    </el-card>
  </div>

</template>

<script>
import {
  findReplyList,
  updateReply,
  saveReply,
  loadReplyInfo,
  findTemplateList
} from '@/api/reply'
export default {
  data() {
    return {
      userId: null,
      roleCode: '',
      loginUserId: '',
      loginUserName: '',
      ruleForm: { keyword: '',  title:'', replyMsgType: '', replyMsg: '', replyMsgMini: '', placeholder: '', queryType: ''},
      replyList: [],
      replyId:'',
      oldReplyId: '',
      templateList:[],
      templateIdList:[],
      callbackFunc: null,
      rules: {
        keyword: [{ required: true, message: '关键字必输！', trigger: 'blur' }],
        replyMsgType: [{ required: true, message: '回复消息类型必选！', trigger: 'blur' }],
        queryType: [{ required: true, message: '匹配方式必选！', trigger: 'blur' }]
      }
    }
  },
  created() {
    var u = this.$store.getters.users
    var roleCode = u.roleCode
    this.roleCode = roleCode
    this.loginUserId = u.userId
    this.loginUserName = u.userName
    this.findTemplateListFunc()
  },
  activated() {

    console.log('activated')

  },
  methods: {

    findTemplateListFunc() {
      var that = this
      findTemplateList({ loginUserId: this.loginUserId, pageNum: 1, pageSize: 100 }).then((rsp) => {
        var t = rsp.data.templateList ? rsp.data.templateList : null
        that.templateList = t
        that.templateIdList = that.templateList
        that.$forceUpdate()
      })
    },
    saveFunc() {
      this.$refs.ruleForm.validate((valid, _n) => {
        var p = { ...this.ruleForm, replyId:this.replyId,creatUserId: this.loginUserId, updateUserId: this.loginUserId, creatUserName: this.loginUserName, updateUserName: this.loginUserName }; var that = this
        if (!p.keyword || !p.queryType) {
          this.$message({ type: 'info', message: '关键字必输' })
          return
        }

       if (this.replyId) {
          // p.id = this.replyId
          updateReply(p).then(rsp => {
            this.$message({ showClose: true, message: rsp.rspMsg, type: 'success' })
            if (rsp && rsp.rspCode == 0) {
              that.closeCurrentPop()

            }
          })
        } else {
          saveReply(p).then(rsp => {
            this.$message({ showClose: true, message: rsp.rspMsg, type: 'success' })
            if (rsp && rsp.rspCode == 0) {
              that.closeCurrentPop()
            }
          })
        }
      })
    },
    initSingleDataSourceList() { // 初始化
      var that = this
      findReplyList({ loginUserId: this.loginUserId }).then((rsp) => {
        var l = rsp.data.replyList ? rsp.data.replyList : null
        that.replyList = l
      })
    },

    closeCurrentPop() {
      if (this.callbackFunc) {
        this.callbackFunc()
      }
    },
    initData(id, callback) {
      var u = this.$store.getters.users
      var roleCode = u.roleCode
      this.roleCode = roleCode
      this.loginUserId = u.userId
      this.loginUserName = u.userName
      this.initSingleDataSourceList()
      if (id) {
        this.loadReplyInfoFunc(id)
        this.replyId = id
      }
      if (callback) {
        this.callbackFunc = callback
      }
    },
    loadReplyInfoFunc(replyId) {
      if (!replyId) {
        return
      }
      var that = this
      loadReplyInfo({ replyId }).then(rsp => {
        if (rsp && rsp.data) {
      //     var keywordInfo = rsp.data;
      //     var u = {}
      //     for (var k in that.ruleForm) {
      //       u[k] = '' + keywordInfo[k]
      //     }
      //     that.ruleForm = u
      //     that.ruleForm.templateIdList = that.ruleForm.templateIdList.toString();
      //     that.ruleForm.templateIdList = that.ruleForm.templateIdList.split(',');
      // that.templateList.forEach(item => {
      //   if (item.templateId == p.templateId) {
      //     p.templateName = item.templateName
      //   }
      // })
         that.ruleForm = rsp.data;
        }
      })
    }
  }
}
</script>
<style scoped>
.cont{padding:20px;}
</style>

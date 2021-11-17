<template>
  <div class="el-card__body">
    <el-card class="box-card">
      <el-form ref="ruleForm" :model="ruleForm" label-width="190px" class="demo-dynamic" :rules="rules">
        <div class="header">
          <el-row :gutter="24">
            <el-form-item label="模板名称" required>
              <el-input v-model="ruleForm.templateName" />
            </el-form-item>
            <el-col :span="12">
              <el-form-item label="是否为调用时机">
                <el-select v-model="ruleForm.opportunity" placeholder="请选择" filterable>
                  <el-option value="Y" label="是" />
                  <el-option value="N" label="否" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否转发其他地址">
                <el-select v-model="ruleForm.redirectFlg" placeholder="请选择" filterable>
                  <el-option value="Y" label="是" />
                  <el-option value="N" label="否" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="转发路径"><el-input v-model="ruleForm.redirectUri" /></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="转发方法"><el-input v-model="ruleForm.redirectMethod" /></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="不转发时服务码"><el-input v-model="ruleForm.serviceCode" /></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="转发结果类型">
                <el-select v-model="ruleForm.rspType" placeholder="请选择" filterable>
                  <el-option value="1" label="字符串" />
                  <el-option value="2" label="实体对象" />
                  <el-option value="3" label="链接" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="前端按钮名称"><el-input v-model="ruleForm.frontBtnName" /></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调用成功判断字段"><el-input v-model="ruleForm.successKey" /></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调用成功时判断字段应有值"><el-input v-model="ruleForm.successValue" /></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="失败提示语字段"><el-input v-model="ruleForm.failureMsgKey" /></el-form-item>
            </el-col>
          </el-row>
        </div>

        <div
          v-for="(domain, index) in ruleForm.templateColList"
          :key="domain.key"
          class="temp-cont"
        >
          <el-form-item :label="'字段 ' + (index + 1)" class="temp-title">
            <el-button type="danger" icon="el-icon-delete" plain @click.prevent="removeDomain(domain)">删除</el-button>
          </el-form-item>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="前端字段" required><el-input v-model="domain.frontColumn" /></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="前端显示名称"><el-input v-model="domain.frontLabel" /></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="前端输入预期提示"><el-input v-model="domain.frontPlaceholder" /></el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="是否默认值">
                <el-select v-model="domain.valueDefault" placeholder="请选择" filterable>
                  <el-option value="1" label="默认本参数值" />
                  <el-option value="2" label="通过登录信息获取" />
                  <el-option value="3" label="当前key获取" />
                  <el-option value="4" label="关联其他字段" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="前端类型">
                <el-select v-model="domain.frontType" placeholder="请选择" filterable>
                  <el-option value="1" label="字符串" />
                  <el-option value="2" label="文本域" />
                  <el-option value="3" label="下拉框" />
                  <el-option value="4" label="多选下拉框" />
                  <el-option value="5" label="日期" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="前台格式"><el-input v-model="domain.frontFormat" placeholder="前端类型是下拉框和日期时需要格式"/></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="前端只读">
                <el-select v-model="domain.frontReadOnly" placeholder="请选择" filterable>
                  <el-option value="Y" label="只读" />
                  <el-option value="N" label="可改" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否必输">
                <el-select v-model="domain.requiredFlg" placeholder="请选择" filterable>
                  <el-option value="Y" label="必输" />
                  <el-option value="N" label="可空" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否显示">
                <el-select v-model="domain.showFlg" placeholder="请选择" filterable>
                  <el-option value="Y" label="显示" />
                  <el-option value="N" label="隐藏" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="后台接口参数" required><el-input v-model="domain.serviceKey" /></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="后台接口参数值" required><el-input v-model="domain.serviceValue" /></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="隐藏时关联字段"><el-input v-model="domain.unionServiceKey" /></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="关联类型">
                <el-select v-model="domain.unionType" placeholder="请选择" filterable>
                  <el-option value="1" label="复制" />
                  <el-option value="2" label="下一天" />
                  <el-option value="3" label="月末" />
                  <el-option value="4" label="下月初" />
                  <el-option value="5" label="七天" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="校验规则"><el-input v-model="domain.validatePattern" placeholder="正则表达式,以^开头和$结束"/></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字段顺序" required><el-input v-model="domain.colIdx" /></el-form-item>
            </el-col>

          </el-row>
        </div>
        <el-form-item>
          <el-button type="primary" @click="saveFunc()">保 存</el-button>
          <el-button icon="el-icon-plus" type="success" plain @click="addDomain">添加字段</el-button>
          <el-button @click="cancel()">返回</el-button>
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  updateTemplate,
  saveTemplate,
  loadTemplate
} from '@/api/reply'
export default {
  data() {
    return {
      ruleForm: {
        templateId: '',
        templateName: null,
        opportunity: '',
        redirectFlg: '',
        redirectUri: '',
        redirectMethod: '',
        serviceCode: '',
        rspType: '',
        frontBtnName: '',
        successKey: '',
        successValue: '',
        failureMsgKey: '',
      templateColList: [{
        frontColumn: '',
        frontLabel: '',
        frontType: '',
        serviceKey: '',
        serviceValue: '',
        valueDefault: '',
        colIdx: '',
        frontFormat: '',
        frontReadOnly: '',
        requiredFlg: '',
        showFlg: '',
        unionServiceKey: '',
        unionType: '',
        frontPlaceholder:'',
        validatePattern:''
      }]

      },
      rules: {
        templateName: [{
          required: true,
          message: '模板名必输！',
          trigger: 'blur'
        }]
      },
    }
  },
  created() {
    var u = this.$store.getters.users
    var roleCode = u.roleCode
    this.roleCode = roleCode
    this.loginUserId = u.userId
    this.loginUserName = u.userName
    this.templateId = this.$route.query.templateId
    this.loadTemplateFunc(this.templateId)
  },
  activated() {
    console.log('activated')
    this.loadTemplateFunc(this.templateId)
  },
  destroyed() {
    // 在页面销毁后，清除计时器
    this.clear()
  },
  methods: {

    saveFunc() {
      this.$refs.ruleForm.validate((valid, _n) => {
        var p = { ...this.ruleForm, templateColList:this.ruleForm.templateColList, templateId: this.templateId, creatUserId: this.loginUserId, updateUserId: this.loginUserId, creatUserName: this.loginUserName, updateUserName: this.loginUserName, pageNum: this.currentPage, pageSize: this.pageSize }
        var that = this
        if (p.templateName == '') {
          this.$message({ type: 'info', message: '模板名称必输' })
          return
        }

        if (this.templateId) {
          // p.id = this.templateId
          updateTemplate(p).then(rsp => {
            this.$message({ showClose: true, message: rsp.rspMsg, type: 'success' })
            if (rsp && rsp.rspCode == 0) {
              that.cancel()
            }
          })
        } else {
          saveTemplate(p).then(rsp => {
            this.$message({ showClose: true, message: rsp.rspMsg, type: 'success' })
            if (rsp && rsp.rspCode == 0) {
              that.cancel()
            }
          })
          return false
        }
      })
    },

    removeDomain(item) {
      var index = this.templateColList.indexOf(item)
      if (index !== -1) {
        this.templateColList.splice(index, 1)
      }
    },

    addDomain(item) {
      this.templateColList.push({
      // stepName:null,
      // stepId:null,
      // stepDesc:null
      })
    },

    loadTemplateFunc(templateId) {
      if (!templateId) {
        return
      }
      var that = this
      loadTemplate({ templateId }).then(rsp => {
        if (rsp && rsp.data) {
          that.ruleForm = rsp.data

          that.templateColList.forEach((item) => {
            if (item.templateId == rsp.data.templateId) {
              item.templateColList = rsp.data.templateColList
            }
          })
        }
      })
    },

    cancel() {
      this.$forceUpdate()
      this.$router.go(-1)
    }

  }
}
</script>

<style>
.header{
  border-bottom:1px solid #eee;
  margin-bottom:15px;
  padding-top:10px;}
.el-table th,.el-table td{
  padding-left:10px;
  }
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

.temp-title .el-form-item__label{
  font-size:16px;
  font-weight: bold;
  }
.temp-cont{
  border-bottom:1px dotted #eee;
  margin-bottom:20px;
  }

</style>

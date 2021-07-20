<template>
  <div class="cont">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="ruleForm" :model="ruleForm" label-width="110px" class="ruleForm" :rules="rules">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="步骤名称">
                <el-input v-model="ruleForm.stepName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="可执行端">
                <el-select v-model="ruleForm.actutingStation" placeholder="请选择" filterable>
                  <el-option v-for="item in actutingStationList" :key="item.actutingStation" :label="item.actutingStationName" :value="item.actutingStation" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="描述">
                <el-input v-model="ruleForm.stepDesc" type="textarea" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="系统分类">
                <el-select v-model="ruleForm.sysType" placeholder="请选择" filterable>
                  <el-option value="1" label="POS" />
                  <el-option value="2" label="SWMS" />
                  <el-option value="3" label="HAU" />
                  <el-option value="4" label="参数配置" />
                  <el-option value="5" label="其他" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="执行分类">
                <el-select v-model="ruleForm.execType" placeholder="请选择" filterable>
                  <el-option value="1" label="获取文件" />
                  <el-option value="2" label="执行可执行文件" />
                  <el-option value="3" label="执行sql文件" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参数类型">
                <el-select v-model="ruleForm.paramType" placeholder="请选择" filterable>
                  <el-option value="1" label="无参数" />
                  <el-option value="2" label="简单字符串" />
                  <el-option value="3" label="json对象" />
                  <el-option value="4" label="文件" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参数值">
                <el-input v-model="ruleForm.paramValue"  placeholder="页面暂时没有上传,文件先通过其他方式获取参数值"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文件后缀">
                <el-input v-model="ruleForm.ext1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否需要回调">
                <el-select v-model="ruleForm.needCallback" placeholder="请选择" filterable>
                  <el-option value="Y" label="需要" />
                  <el-option value="N" label="不需要" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="回调">
                <el-select v-model="ruleForm.callbackStepId" placeholder="所有步骤统一回调,这个字段保持空" filterable>
                  <el-option v-for="item in stepList" :key="item.stepId" :label="item.stepName" :value="item.stepId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="外部路径">
                <el-input v-model="ruleForm.stepUri" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调用方法">
                <el-input v-model="ruleForm.stepMethod" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否支持异步">
                <el-select v-model="ruleForm.asyncFlg" placeholder="请选择" filterable>
                  <el-option value="Y" label="支持异步" />
                  <el-option value="N" label="不支持异步" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col>
              <el-form-item>
                <el-button type="primary" plain @click="saveFunc">保存</el-button>
                <el-button type="button" @click="closeCurrentPop()">返回</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>

</template>

<script>
import {
  findStepList
  , loadStepInfo
  , updateStep
  , saveStep
} from '@/api/sct'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      userId: null,
      roleCode: '',
      loginUserId: '',
      loginUserName: '',
      oldStepId: '',
      ruleForm: { stepId: '', stepName: '', actutingStation: '', stepDesc: '', sysType: '', execType: '', paramType: '', paramValue: '',
        needCallback: '', callbackStepId: '', stepUri: '', stepMethod: '', asyncFlg: '' },
      stepList: [],
      userTypeList: [],
      actutingStationList: [{ actutingStation: '1', actutingStationName: '都允许' }, { actutingStation: '2', actutingStationName: '门店POS机' }, { actutingStation: '3', actutingStationName: '门店服务器' },
        { actutingStation: '4', actutingStationName: '总部服务器' }, { actutingStation: '5', actutingStationName: 'sps服务器' }, { actutingStation: '6', actutingStationName: '手持' }, { actutingStation: '7', actutingStationName: '其他' }],
      callbackFunc: null,
      roleList: [],
      groupList: [],
      rules: {
        stepName: [{ required: true, message: '步骤名必输！', trigger: 'blur' }],
        actutingStation: [{ required: true, message: '可执行端必输！', trigger: 'blur' }],
        execType: [{ required: true, message: '执行分类必输！', trigger: 'blur' }],
        paramType: [{ required: true, message: '参数类型必输！', trigger: 'blur' }],
        needCallback: [{ required: true, message: '是否需要回调必输！', trigger: 'blur' }],
        stepUri: [{ required: true, message: '对外地址必输！', trigger: 'blur' }],
        async: [{ required: true, message: '是否支持异步必输！', trigger: 'blur' }]
      }
    }
  },
  created() {
  },
  methods: {
    saveFunc() {
      this.$refs.ruleForm.validate((valid, _n) => {
        var p = { ...this.ruleForm, creatUserId: this.loginUserId, updateUserId: this.loginUserId, creatUserName: this.loginUserName, updateUserName: this.loginUserName }; var that = this
        if (!p.actutingStation || !p.stepName) {
          return
        }
        if (p.callbackStepId) {
          this.stepList.forEach(item => {
            if (item.stepId == p.callbackStepId) {
              p.callbackStepName = item.stepName
            }
          })
        }
        if (this.oldStepId) {
          p.id = this.oldStepId
          updateStep(this.oldStepId + '', p).then(rsp => {
            this.$message({ showClose: true, message: rsp.rspMsg, type: 'success' })
            if (rsp && rsp.rspCode == 0) {
              that.closeCurrentPop()
            }
          })
        } else {
          saveStep(p).then(rsp => {
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
      findStepList({ loginUserId: this.loginUserId }).then((rsp) => {
        var l = rsp.data.stepList ? rsp.data.stepList : null
        that.stepList = l
      })
    },
    formatDate(value, format) {
      return dayjs(value).format(format)
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
        this.loadStepFunc(id)
        this.oldStepId = id
      }
      if (callback) {
        this.callbackFunc = callback
      }
    },
    loadStepFunc(id) {
      if (!id) {
        return
      }
      var that = this
      loadStepInfo({ id }).then(rsp => {
        if (rsp && rsp.data) {
          var stepInfo = rsp.data; var u = {}
          for (var k in that.ruleForm) {
            u[k] = '' + stepInfo[k]
          }
          that.ruleForm = u
        }
      })
    }
  }
}
</script>
<style scoped>
.cont{padding:20px;}
</style>

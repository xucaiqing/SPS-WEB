<template>
  <div class="cont">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="ruleForm" :model="ruleForm" label-width="80px">
          <el-divider content-position="left">条件查询</el-divider>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="选择模板" prop="templateId">
                <el-select v-model="ruleForm.templateId" placeholder="可以选择模板" clearable :disabled="viewFlg" @change="findTemplateListFunc">
                  <el-option v-for="item in templateList" :key="item.templateId" :value="item.templateId" :label="item.templateName">
                    {{ item.id+' - '+item.templateName }}
                  </el-option>
                </el-select>
                <el-button v-if="!viewFlg" type="primary" icon="el-icon-map-location" plain class="chooseOrgBtnTxt" style="float:left;" @click="chooseOrgBtnFunc()" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="选择大区" prop="bigAreaName">

                <el-select v-model="ruleForm.bigAreaId" placeholder="请选择" :disabled="viewFlg" @change="bigAreaChangeFunc">
                  <el-option
                    v-for="item in bigAreaList"
                    :key="item.bigAreaId"
                    :label="item.bigAreaId +' - '+item.bigAreaName"
                    :value="item.bigAreaId"
                  />
                </el-select>

              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="选择门店" prop="orgTitle">
                <el-select v-model="ruleForm.orgTitle" placeholder="请选择" :disabled="viewFlg" @change="orgTitleChangeFunc">
                  <el-option v-for="item in storeList" :key="item.orgTitle" :label="item.orgTitle" :value="item.orgTitle" />
                </el-select>

              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="门店编码" prop="orgCode">
                <el-select v-model="ruleForm.orgCode" placeholder="请选择" :disabled="viewFlg" @change="orgCodeChangeFunc">
                  <el-option v-for="item in storeList" :key="item.orgCode" :label="item.orgCode" :value="item.orgCode" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col>
              <el-form-item>
                <el-button v-if="!viewFlg" type="primary" plain :disabled="viewFlg" @click="updateTaskStateFunc()">执行</el-button>
                <el-button type="danger" plain @click="cancel">返回</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </div>

      <!--任务状态:N-未开始;I-ing进行中;F-failure失败;Y-成功;C-cancel取消;P-partly部分成功-->
      <el-table
        :data="taskStepList"
        style="width: 100%"
      >
        <el-table-column prop="stepName" label="步骤名" />
        <el-table-column prop="stepStateName" label="执行状态">
          <template slot-scope="{row}">
            <el-tag v-if="row.stepState=='Y'" type="success">成功</el-tag>
            <el-tag v-if="row.stepState=='F'" type="danger">失败</el-tag>
            <el-tag v-if="row.stepState=='N'" type="warning">进行中</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="startDate" label="开始时间" ></el-table-column> -->
        <el-table-column prop="stepResult" label="执行结果" />
        <el-table-column prop="targetFile" label="附件下载">
          <template slot-scope="{row}">
            <!-- {{row.targetFile?row.targetFile:row.sourceFile}} -->
            <a v-if="row.targetFile" :href="row.targetFile">{{ row.targetFile }}</a>
            <a v-if="row.sourceFile" :href="row.sourceFile">{{ row.sourceFile }}</a>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

    <el-dialog :title="chooseOrgBtnTxt" :visible.sync="chooseOrgDialogFormVisible">
      <el-form :model="chooseOrgForm">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="编码" :label-width="formLabelWidth">
              <el-input v-model="chooseOrgForm.storeIdC" autocomplete="off" placeholder="支持模糊匹配" @keyup.enter.native="orgQueryFunc()" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名称" :label-width="formLabelWidth">
              <el-input v-model="chooseOrgForm.storeNameC" autocomplete="off" placeholder="支持模糊匹配" @keyup.enter.native="orgQueryFunc()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="orgQueryFunc()">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="table-cont">
        <el-table :data="orgList" @row-dblclick="selectOne" @row-click="rowClickFunc">
          <el-table-column v-if="false" property="companyType" label="公司" />
          <el-table-column v-if="false" property="bigAreaId" label="大区Id" />
          <el-table-column property="bigAreaName" label="大区" />
          <el-table-column v-if="false" property="cityId" label="城市Id" />
          <el-table-column property="cityName" label="城市" />
          <el-table-column v-if="officeVisible" property="storeId" label="门店编码" />
          <el-table-column v-if="officeVisible" property="storeName" label="门店名称" />
          <el-table-column v-if="orgVisible" property="officeId" label="办公室编码" />
          <el-table-column v-if="orgVisible" property="officeName" label="办公室名称" />
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chooseOrgDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectOkFunc()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  findBigAreaList
  , findStoreListSimplify
  , findOrgListByNameFuzzy

} from '@/api/eventapi'
import dayjs from 'dayjs'

import {
  findTemplateList,
  findStepList,
  updateTaskState,
  loadTaskInfo,
  updateTemplateRecordState
} from '@/api/sct'

export default {
  name: 'Eventdetails',
  data() {
    return {
      orgVisible: '',
      viewFlg: false,
      officeVisible: 'none',
      orgChangeFlg: false,
      officeChangeFlg: false,
      storeList: [],
      officeList: [],
      oldCityId: '',
      chooseOrgBtnTxt: '选择门店',
      chooseOrgDialogFormVisible: false,
      orgList: [],
      formLabelWidth: '50px',
      typeFormLabelWidth: '110px',
      selectedRow: {},
      selectedRowType: {},
      templateList: [],
      templateListCopy: [],
      selectedRowCu: {},
      ruleForm: {
        companyType: '',
        orgTitle: '',
        orgCode: '',
        userId: '',
        cityName: '',
        bigAreaId: '',
        bigAreaName: '',
        storeList: '',
        storeId: '',
        storeName: '',
        officeName: '',
        officeId: ''
      },
      templateList: '',
      taskId: '',
      taskState: '',
      cycleNum: 60000,
      intervalId: null,
      stepList: '',
      templateId: '',
      templateName: '',
      taskStepList: [],
      template: {
        templateId: '',
        templateName: ''
      },
      bigAreaList: [],
      userMap: {},
      companyType: '0',
      userId: '',
      userName: '',
      pageSize: 1000,
      totalCount: 0,
      chooseOrgForm: {
        storeIdC: '',
        storeNameC: ''
      }

    }
  },
  created() {

  },
  destroyed() {
    // 在页面销毁后，清除计时器
    this.clear()
  },
  activated() {
    console.log('activated')
    this.ruleForm={}
    this.initData()
    this.findTemplateListFunc()
    this.viewFlg = (this.$route.query.viewFlg==true||this.$route.query.viewFlg=='true')?true:false
    this.taskId = this.$route.query.taskId
    this.autoRefreshData('Y')
    this.loadTaskInfoFunc(this.taskId);
  },

  methods: {

    async initData() {
      const userId = this.$store.getters.users.userId
      const userName = this.$store.getters.users.userName
      const roleCode = this.$store.getters.users.roleCode
      const groupId = this.$store.getters.users.groupId
      this.userId = userId
      this.userName = userName
      this.loginUserId = userId
      this.loginUserName = userName
      this.ruleForm.userId = userId
      this.ruleForm.userName = userName
      this.findBigAreaListFunc()
      this.groupId = groupId
      this.roleCode = roleCode
      // 初始化页面数据

      // console.log('intiData()')
    },
    async findBigAreaListFunc() {
      const params = { companyType: this.companyType }
      await findBigAreaList(params).then(response => {
        const data = response.data
        this.bigAreaList = data.bigAreaList
      })
    },
    chooseOrgBtnFunc() {
      this.chooseOrgDialogFormVisible = true
      this.selectedRow = null
      this.orgList = []
      this.$forceUpdate()
    },
    orgTitleChangeFunc(_item) {
      if (this.orgChangeFlg) {
        return
      }
      console.log('orgTitleChangeFunc' + _item)
      this.orgChangeFlg = true
      const org = this.storeList.find(function(item) {
        return item.orgTitle === _item
      })
      this.ruleForm.orgCode = org.orgCode
      this.orgChangeFlg = false
      this.$forceUpdate()
    },
    orgCodeChangeFunc(_item) {
      if (this.orgChangeFlg) {
        return
      }
      console.log('orgCodeChangeFunc')
      this.orgChangeFlg = true
      const org = this.storeList.find(function(item) {
        return item.orgCode === _item
      })
      this.ruleForm.orgTitle = org.orgTitle
      this.orgChangeFlg = false
      this.$forceUpdate()
    },
    findStoreListSimplify() {
      const params = { bigAreaId: this.ruleForm.bigAreaId, companyType: this.ruleForm.companyType }
      findStoreListSimplify(params).then((response) => {
        this.storeList = response.data
      })
    },
    bigAreaChangeFunc() {
      this.findStoreListSimplify()
    },
    orgQueryFunc(_dataList = 'orgList') {
      if (!this.chooseOrgDialogFormVisible) {
        return
      }
      if (!this.chooseOrgForm.storeIdC && !this.chooseOrgForm.storeNameC) {
        this.$message({
          showClose: true,
          message: '编号和名称最少输一个',
          type: 'danger'
        })
        return
      }
      const params = { lineType:'1', storeId: this.chooseOrgForm.storeIdC, storeName: this.chooseOrgForm.storeNameC, groupId: this.groupId }
      findOrgListByNameFuzzy(params).then((response) => {
        this[_dataList] = response.data
        if (this.ruleForm.lineType === '1') {
          this.storeList = response.data
        } else {
          this.officeList = response.data
        }
      })
    },
    rowClickFunc(_row = {}) {
      this.selectedRow = _row
    },
    selectOne(_row) {
      //  debugger
      if (_row.companyType || _row.companyType >= 0) {
        this.ruleForm.companyType = '' + _row.companyType
      }
      this.ruleForm.bigAreaId = _row.bigAreaId
      this.ruleForm.bigAreaName = _row.bigAreaName
      this.bigAreaChangeFunc()
      this.ruleForm.cityId = _row.cityId
      this.ruleForm.cityName = _row.cityName
      if (_row.storeId) {
        this.ruleForm.orgCode = _row.storeId
      }
      this.ruleForm.buinourName = _row.buinourName
      this.ruleForm.buinourPhone = _row.dianZhangPhone
      this.ruleForm.mainStatus = _row.mainStatus
      this.ruleForm.operationManager = _row.operationManager
      this.ruleForm.storeAddress = _row.storeAddress
      this.ruleForm.storePhone = _row.storeContact
      this.ruleForm.storeEmail = _row.storeMail
      if (_row.storeName) {
        this.ruleForm.orgTitle = _row.storeName
      }
      if (_row.officeId) {
        this.ruleForm.officeId = _row.officeId
      }
      if (_row.officeName) {
        this.ruleForm.officeName = _row.officeName
      }
      this.chooseOrgForm.storeIdC = ''
      this.chooseOrgForm.storeNameC = ''
      this.chooseOrgDialogFormVisible = false
      this.$forceUpdate()
    },
    selectOkFunc() {
      if (!this.selectedRow) {
        this.$message({
          showClose: true,
          message: '最少选择一条且只能选中一条',
          type: 'danger'
        })
        return
      }
      this.selectOne(this.selectedRow)
    },

    updateTaskStateFunc() {
      var p = { loginUserId: this.loginUserId, loginUserName: this.loginUserName, templateId: this.ruleForm.templateId, templateName: this.template.templateName, taskState: 'I',
        bigAreaId: this.ruleForm.bigAreaId, bigAreaName: this.ruleForm.bigAreaName, storeId: this.ruleForm.orgCode, storeName: this.ruleForm.orgTitle, taskId: this.taskId }
      var that = this
      if (!this.ruleForm.orgCode) {
        this.$message({
          type: 'info',
          message: '请选择需要检查的门店'
        })
        return
      }
      that.templateList.forEach(item => {
        if (item.templateId == p.templateId) {
          p.templateName = item.templateName
        }
      })
      updateTaskState(p).then((rsp) => {
        that.loadTaskInfoFunc(rsp.data.taskId)
        that.taskId = rsp.data.taskId
      })
    },
    loadTaskInfoFunc(id) {
      if (!id) {
        return
      }
      var that = this
      loadTaskInfo({ taskId: id }).then(rsp => {
        if (rsp && rsp.data) {
          that.taskStepList = rsp.data.stepList ? rsp.data.stepList : null

          that.ruleForm.templateId = rsp.data.templateId
          that.ruleForm.bigAreaId = rsp.data.bigAreaId
          that.ruleForm.bigAreaName = rsp.data.bigAreaName
          that.ruleForm.orgTitle = rsp.data.storeName
          that.ruleForm.orgCode = rsp.data.storeId
          that.taskState = rsp.data.taskState
        }
      })
    },

    findTemplateListFunc() {
      var that = this
      findTemplateList({ loginUserId: this.loginUserId, pageNum: this.currentPage, pageSize: this.pageSize }).then((rsp) => {
        var t = rsp.data.templateList ? rsp.data.templateList : null
        that.templateList = t
        that.totalCount = rsp.data.totalCount
        that.$forceUpdate()
      })
    },
    cancel() {
      this.clear()
      this.$router.go(-1)
    },
    autoRefreshData() {
      if (this.intervalId) {
        return
      }
      if (['Y', 'F','P'].includes(this.taskState)) {
        this.clear()
        return
      }
      this.intervalId = setInterval(() => {
        console.log('intervalId刷新' + new Date())
        this.loadTaskInfoFunc(this.taskId)
      }, this.cycleNum)
    },
    clear() { // 清除计时器
      clearInterval(this.intervalId) // 清除计时器
      this.intervalId = null // 设置为null
    }
  }
}
</script>

<style lang="scss" scoped>
.cont{padding:20px;}
.btn-cont{ padding:20px;text-align:center;}
.table-cont{padding:0 15px;text-align:center;}
.dialog-footer{text-align:center;padding-bottom:20px;}
.chooseOrgBtnTxt{padding:6px 8px;position:absolute;right:-50px;top:3px;}
.el-form .el-form-item{padding-right:8%;}
</style>

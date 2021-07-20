<template>
  <div class="el-card__body">
    <el-button type="primary" icon="el-icon-plus" @click="showInfoPanelFunc()">新增模板</el-button>
    <el-button type="primary" plain @click="findStepListFunc">查询</el-button>
    <el-button type="danger" plain @click="cancel" >返回</el-button>

    <el-card class="box-card">
      <el-collapse v-model="activeName" ref="ruleForm"  accordion>
        <el-collapse-item v-for="(om) in templateList" @change="findTemplateListFunc">
          <template slot="title">
            <div style="width:100%;clear:both;">
            <el-row :gutter="24">
            <el-col :span="12">
               <i class="icon-point"></i>{{ om.templateName }}
            </el-col>
            <el-col :span="8">
              <span class="createDate">创建时间：<b>{{ om.createDate }}</b></span>
              <span class="updateDate">修改时间：<b>{{ om.updateDate }}</b></span>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" plain @click="showInfoPanelFunc(om)">修改</el-button>
              <el-button type="danger" plain @click="deleteFunc(om)">删除</el-button>
            </el-col>
            </el-row>
            </div>
          </template>
          <el-table :data="om.stepList" style="width: 100%">
            <el-table-column prop="stepName" label="步骤名" />
            <el-table-column prop="stepDesc" label="说明" />
          </el-table>
        </el-collapse-item>

      </el-collapse>
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

    <el-dialog :visible.sync="addTemplateDialogVisible" :title="infoTitle" width="50%">
      <div style="padding:10px 20px;">
        <el-form ref="dynamicValidateForm" :model="queryCondition" label-width="90px" class="demo-dynamic" :rules="rules">
          <el-form-item label="模板名称" required>
            <el-input v-model="dynamicValidateForm.templateName" />
          </el-form-item>
          <el-form-item
            v-for="(domain, index) in selectedList"
            :key="domain.key"
            :label="'步骤 ' + (index + 1)"
          >
            <el-select v-model="domain.stepId" placeholder="请选择" style="width:92%;margin-right:15px;" clearable filterable>
              <el-option v-for="item in stepList" :key="item.stepId" :label="item.stepName" :value="item.stepId" />
            </el-select>
            <el-button type="danger" icon="el-icon-delete" circle @click.prevent="removeDomain(domain)" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveFunc()">保 存</el-button>
            <el-button icon="el-icon-plus" type="success" plain @click="addDomain">添加步骤</el-button>
            <el-button @click="cancelFunc()">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  findTemplateList,
  updateTemplate,
  saveTemplate,
  updateTemplateRecordState,
  findStepList,
  findTaskList,
  loadTemplateInfo,
} from '@/api/sct'
export default {
  data() {
    return {
      infoTitle:'新增模板',
      addTemplateDialogVisible: false,
      value1: true,
      value2: false,
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      queryCondition: { 
        stepName: '' 
        },

      dynamicValidateForm: {
        domains: [{
          value: ''
        }],
        templateName: '',
        taskList: null,
        stepName: '',
        templateId:'',
      },
      rules: {
        templateName: [{ 
          required: true, 
          message: '模板名必输！', 
          trigger: 'blur' 
          }]
      },
      stepList: [{
      }],
      selectedList: [{ 
        stepName: '',
        stepDesc: '',
        stepId: ''
        }],
      // om: { templateName: '', stepName: ''},
      templateList: '',
      taskList:'',
      taskId:'',
      id:null,
      activeName: '1',
      templateId:'',
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
    this.findStepListFunc()
    this.findTemplateListFunc()

    
  },
  methods: {
    saveFunc() {
      var that = this
      that.$refs.dynamicValidateForm.validate((valid, _n) => {
        var p = {templateId:that.templateId, templateName: that.dynamicValidateForm.templateName, 
          selectedList:that.selectedList, stepId :that.dynamicValidateForm.stepId, stepName:that.dynamicValidateForm.stepName,
          updateUserId: that.loginUserId, updateUserName: that.loginUserName }
        
        // that.selectedList.forEach((item) => {
        //   that.stepList.forEach(step=>{
        //     if(item.stepId === step.stepId){
        //       item.stepDesc = step.stepDesc;
        //       item.stepName = step.stepName;
        //       return;
        //     }
        //   });          
        // })

        if (p.templateName == '') {
          this.$message({ type: 'info', message: '模板名称必输' })
        }

        if (this.templateId) {
          // this.$message({ type: 'info', message: '步骤必选' })
          updateTemplate(p).then(rsp => {
            this.$message({ showClose: true, message: rsp.rspMsg, type: 'success' })
            if (rsp && rsp.rspCode == 0) {
              that.addTemplateDialogVisible = false
              that.findTemplateListFunc()
            }
          })
        } else {
          saveTemplate(p).then(rsp => {
            
            this.$message({ showClose: true, message: rsp.rspMsg, type: 'success' })
            if (rsp && rsp.rspCode == 0) {
              that.addTemplateDialogVisible = false
              that.findTemplateListFunc()
            }
          })
        }
        
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
    findTemplateListFunc() {
      var that = this
      findTemplateList({ ...this.queryCondition, pageNum: this.currentPage, pageSize: this.pageSize, loginUserId: this.loginUserId }).then((rsp) => {
        var t = rsp.data.templateList ? rsp.data.templateList : null
        that.templateList = t
        that.totalCount = rsp.data.totalCount
        that.$forceUpdate()
      })
    },
    findStepListFunc() {
      var that = this
      findStepList({ ...this.queryCondition, ...this.ruleForm, loginUserId: this.loginUserId }).then((rsp) => {
        var l = rsp.data.stepList ? rsp.data.stepList : null
        that.stepList = l
      })
    },

    findTaskListFunc() {
      var that = this
      findTaskList({ loginUserId: this.loginUserId }).then((rsp) => {
        var t = rsp.data.taskList ? rsp.data.taskList : null
        that.taskList = t
      })
    },

    removeDomain(item) {
      var index = this.selectedList.indexOf(item)
      if (index !== -1) {
        this.selectedList.splice(index, 1)
      }
    },

    addDomain(item) {
      this.selectedList.push({
      // stepName:null,
      // stepId:null,
      // stepDesc:null
      })
    },

    showInfoPanelFunc(om) {
      // var id=null
      if(om&&om.templateId){
        this.infoTitle='修改模板'
        // id=om.templateId
        this.templateId = om.templateId
        this.dynamicValidateForm.templateName = om.templateName
        this.dynamicValidateForm.stepList = om.stepList

      }else {
        this.templateId = null
        this.selectedList= [{ 
          stepName: '',
          stepDesc: '',
          stepId: ''
        }]
        this.infoTitle = '新增模板'
      }
      this.addTemplateDialogVisible = true

    },

    cancelFunc() {
      this.addTemplateDialogVisible = false
    },

    deleteFunc(om){
      var p={...this.templateList,templateId:om.templateId,templateName:om.templateName, updateUserId:this.loginUserId,updateUserName:this.loginUserName},that=this
      p.recordState='N' 
      updateTemplateRecordState(p).then((rsp)=>{
        this.$message({
            type: 'info',
            message: rsp.rspMsg
        });
        that.findTemplateListFunc();
      })
    },
    cancel() {
      this.$forceUpdate();
      this.$router.go(-1);
    },


  }
}
</script>

<style>
.el-tag--medium {
    height: 22px;
    line-height: 20px;
}
.el-collapse{
  border:0;
}
.el-table th,.el-table td{padding-left:10px;}

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
.el-button--success.is-plain {
    color: #18d6a0;
    background: #e8fbf6;
    border-color: #a3efd9;
}
.el-collapse-item__wrap{
  border:0;
}

.footer{
  margin-top:20px;
}

.icon-point{
  border-radius: 5px;
  width:8px;
  height:8px;
  background:#18d6a0;
  display: block;
  float: left;
  margin:20px 10px 0 5px;
  }
.el-collapse-item__header{
  font-size:16px;
}
.box-card{
  margin-top:10px;
}
.el-card__body{
  padding-top:10px;
}

.createDate {
  font-size: 13px;
  color:#888b9c;
  padding-right:20px;
}
.createDate b{
  color: #02b686;
}
.updateDate {
  font-size: 13px;
  color:#888b9c;
  padding-right:20px;
  }
.updateDate b{
  color: #f67c7c;
}
.box-card .el-button--medium{
  padding: 6px 15px;
  font-size: 13px;
}
</style>

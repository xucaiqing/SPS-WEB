<template>
  <div class="cont">
    <p>
      <i class="icon-point" />{{ replyForm.title }}{{ storeId?('(当前门店：'+storeId+'-'+storeName+')'):'' }}
      <el-button @click="turnToPanel()">回到功能菜单</el-button>
    </p>
    <span v-for="replyTemplate in replyForm.templateList">
      <div class="clearfix">
        <el-form label-width="110px" class="ruleForm">
          <el-row v-for="(templateCol) in replyTemplate.templateColList" :gutter="24">
            <el-col v-show="templateCol.showFlg!='N'" :span="24">
              <!--frontType前端类型:1-输入框;2-文本域;3-下拉框;4-多选下拉框;5-日期;-->
              <!--frontFormat前端格式,下拉框和日期需要格式-->
              <!--frontReadonly前端只读:Y-只读;N-可输-->
              <el-form-item :label="templateCol.frontLabel" >
                <i style="color:#f00;float:left;margin-right:10px;" v-if="templateCol.requiredFlg == 'Y' " required>*</i>
                <div style="float:left;width: 91%">
                  <el-tooltip placement="top">
                    <div slot="content">{{(!!templateCol.frontPlaceholder)?templateCol.frontPlaceholder:templateCol.frontLabel}}</div>
                    <el-input v-if="templateCol.frontType=='1'" v-model="templateCol.finalValue" :readonly="templateCol.frontReadOnly=='Y'?'readonly':false"/>
                    <el-input v-else-if="templateCol.frontType=='2'" v-model="templateCol.finalValue" type="textarea" autosize :readonly="templateCol.frontReadOnly=='Y'?'readonly':false"/>
                    <el-select v-else-if="templateCol.frontType=='3'" v-model="templateCol.finalValue" placeholder="请选择" filterable>
                      <el-option v-for="item in getColDataSource(templateCol.frontFormat)"
                        :key="item.key" :label=" item.label" :value="item.key"
                      />
                    </el-select>
                    <el-select v-else-if="templateCol.frontType=='4'" v-model="templateCol.finalValue" placeholder="可多选" filterable multiple>
                      <el-option v-for="item in getColDataSource(templateCol.frontFormat)"
                        :key="item.key" :label=" item.label" :value="item.key"
                      />
                    </el-select>
                    <el-date-picker
                      v-else-if="templateCol.frontType=='5'"
                      v-model="templateCol.finalValue"
                      type="date"
                      :value-format="templateCol.frontFormat"
                      :format="templateCol.frontFormat"
                      :readonly="templateCol.frontReadOnly=='Y'?'readonly':false"
                      />
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-show="!!replyForm.replyDesc">
        <template>
          <span v-html="replyForm.replyDesc"></span>
        </template>
      </div>
      <div style="text-align: center">
        <el-button v-if="cancelVisible" :disabled="executeBtnDisabled" @click="cancelFunc(replyTemplate)">不通过</el-button>
        <el-button type="primary" v-if="replyTemplate.frontBtnName" :disabled="executeBtnDisabled" @click="executeTemplateFunc(replyTemplate)">{{ cancelVisible?'确认':replyTemplate.frontBtnName}}{{ restSeconds }}</el-button>
        <span v-if="!!warnMsg"><p>{{ warnMsg}}</p></span>
      </div>
      <div class="cont">
        <!--rspType转发结果类型:1-字符串;2-实体对象;3-html;4-超链接-->
        <el-input v-if="replyTemplate.rspType=='1'" type="textarea" rows="10" readonly :value="replyTemplate.rspData" class="read-only" />
        <span v-if="replyTemplate.rspType=='3'" v-html="replyTemplate.rspData" />
        <span v-else><p>{{ replyTemplate.rspData }}</p></span>
      </div>
    </span>
    <el-tooltip placement="top" class="footer">
      <div slot="content">
        *代表必输字段,如果没有必输字段则最少需要输一个条件才能查<br>
        部分功能需审核时请耐心等待审核人忙完手中的事情<br>
        如果有需求或者使用过程中有不方便和待改进的地方请反馈给IT服务中心或者运营销售部,也可以在本应用中留言
      </div>
      <el-button plain circle icon="el-icon-question"></el-button>
    </el-tooltip>
  </div>
</template>

<script>

import { loadReplyClick, executeTemplate,
    loadApplyParamByApplyCode,
    cancelApplyCode
} from '../../api/reply'

export default {
  data() {
    return {
      loginUserId: null,
      loginUserName: null,
      roleCode: null,
      storeId: null,
      storeName: null,
      replyId: null,
      intervalId: null,
      cycleSeconds: 3,
      cycleUnit: 1000,
      restSeconds: '',
      executeBtnDisabled: false,
      applyCode: null,
      cancelVisible: false,
      warnMsg:'',
      replyForm: {
      }
    }
  },

  created() {
    if (!this.initUserRole()) {
      this.$message({ showClose: true, message: '链接失效请从企业微信点最新链接进入!', type: 'warn' })
      return
    }
    console.log(this.replyId)
  },
  activated() {
    this.replyId = this.$route.query.replyId
    this.applyCode = this.$route.query.applyCode
    this.afterFlg = this.$route.query.afterFlg
    this.previewFlg = this.$route.query.previewFlg
    if (this.replyId) {
      this.loadReplyClickFunc(this.replyId)
    }
    this.cancelVisible=!!this.applyCode
  },
  methods: {
    initUserRole() {
      var user = this.$store.getters.users
      this.roleCode = user.roleCode
      this.storeId = user.storeId
      this.storeName = user.storeName
      this.loginUserId = user.userId
      this.loginUserName = user.userName
      console.log(user.storeId)
      return !!user.userId
    },
    loadReplyClickFunc(replyId) {
      var that = this
      loadReplyClick({
        replyId:replyId,
        updateUser:this.loginUserId,
        updateUserName:this.loginUserName,
        storeId:this.storeId,
        storeName:this.storeName,
        userId:this.loginUserId,
        userName:this.loginUserName
      }).then(rsp => {
        that.replyForm = rsp.data
        if(that.applyCode){
          that.replyForm.templateList.forEach((item) => {
            that.loadApplyParamFunc(item.templateId)
          })

        }
      })
    },
    executeTemplateFunc(template) {
      this.executeBtnDisabled=true
      this.warnMsg=''
      this.$forceUpdate()
      this.setTimer()
      if (!this.loginUserId) {  //判断登录账号
        this.warnMsg='无法识别当前员工号,刷新无效,请重新进入页面!'
        return
      }
      var paramIsBlank = false
      template.templateColList.forEach(item => {
        if (item.requiredFlg == 'Y'&&!item.finalValue&&item.showFlg=='Y') { //前台只校验显示字段,隐藏字段由后台计算后校验
          paramIsBlank = true
          return
        }
      })
      if (paramIsBlank) {
        this.warnMsg='参数不能为空!'
        return
      }

      var that = this
      var param = {
        ...template,
        replyId: this.replyId,
        updateUserId: this.loginUserId,
        updateUserName: this.loginUserName,
        storeId: this.storeId,
        storeName: this.storeName,
        userId: this.loginUserId,
        userName: this.loginUserName,
        keyword: this.replyForm.keyword
      }
      param.applyCode=this.applyCode
      param.afterFlg=this.afterFlg
      param.opportunity='Y'

      executeTemplate(param).then(rsp => {
        if (!rsp || rsp.rspCode != 0) {
          this.warnMsg='系统异常请联系IT服务中心!'
          return
        }
        that.replyForm.templateList.forEach((item) => {
          if (item.templateId == rsp.data.templateId) {
            item.rspData = rsp.data.rspData
          }
        })
      })
    },
    setTimer() { // 计时器:按钮3秒内只能点一次
      var rest = this.cycleSeconds
      // 增加计时器防止连续提交
      if (rest <= 0 || this.intervalId) {
        this.clear()
        this.restSeconds = ''
        this.executeBtnDisabled = false
        return
      }
      this.intervalId = setInterval(() => {
        console.log('rest:' + rest)
        if (rest <= 0) {
          this.restSeconds = ''
          this.executeBtnDisabled = false
          this.clear()
        } else {
          this.restSeconds = '(' + rest + ')'
          this.executeBtnDisabled = true
        }
        rest--
      }, this.cycleUnit)
    },
    clear() { // 清除计时器
      clearInterval(this.intervalId) // 清除计时器
      this.intervalId = null // 设置为null
    },
    turnToPanel() { // 返回关键字列表
      if(this.previewFlg&&this.previewFlg=='Y'){
        this.$router.push({path: '/reply/preview'})
      }else{
        this.$router.push({path: '/reply/panel'})
      }
    },
    /**
     * 获取申请时参数
     */
    loadApplyParamFunc(templateId) {
      var that=this
      loadApplyParamByApplyCode({applyCode:that.applyCode,templateId:templateId}).then(rsp => {
        var applyParam=rsp.data
        if(!applyParam){
          return
        }
        that.replyForm.templateList.forEach((template) => {
          if(template.templateId == applyParam.replyTemplateId){
            template.applyCode=that.applyCode
            template.templateColList.forEach((col) => {
              if (applyParam[col.serviceKey]) {
                col.finalValue = applyParam[col.serviceKey]
              }
            })
          }
        })
      })
    },
    /**
     * 获取申请时参数
     */
    cancelFunc(template) {
      var that=this
      var param = {
        ...template,
        replyId: this.replyId,
        updateUserId: this.loginUserId,
        updateUserName: this.loginUserName,
        storeId: this.storeName,
        userId: this.loginUserId,
        userName: this.loginUserName,
        keyword: this.replyForm.keyword,
        applyCode: this.replyForm.applyCode
      }
      cancelApplyCode({applyCode:that.applyCode,templateId:template.templateId}).then(rsp => {
        var applyParam=rsp.data
        if(!applyParam){
          return
        }
        that.replyForm.templateList.forEach((item) => {
          if (item.templateId == item.templateId) {
              item.rspData = rsp.rspData
          }
        })
      })
    },

    /**
     * 下拉框数据源由后台控制,前台需要格式化
     * @param frontFormat 变形的数据源:格式{'key_a':'value_a','key1':'value1'}
     * @returns {[]} 数组:转换后格式[{key:'key_a',label:'value_a'},{key:'key1',label:'value1'}]
     */
    getColDataSource(frontFormat){
      var colDataSourceObject=JSON.parse(frontFormat),colDataSourceArr=[]
      for(var key in colDataSourceObject){
          colDataSourceArr.push({key:key,label:colDataSourceObject[key]})
      }
      return colDataSourceArr
    }
  }
}
</script>

<style>
  .cont{padding:10px;}
  .hwtable{background:#eafaf6;color:#1ab388;line-height:32px;border-bottom:1px solid #ddd;font-size:14px;}
  .note{color:#f00;padding:10px;}
  .footer {
    border-top:1px soild #e4e4e4;
    position:fixed;
    z-index :100;
    left :0;
    right :0;
    bottom:1px;
    background-color:#fff;
    height:35px;
    padding-left:20px;
    display:flex;
  }
</style>

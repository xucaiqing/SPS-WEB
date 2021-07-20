<template>
  <div class="cont">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :model="queryCondition" ref="ruleForm" label-width="110px" class="ruleForm">
          <el-divider content-position="left">条件查询</el-divider>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="步骤名" >
                <el-input v-model="queryCondition.stepName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="可执行端" >
                <el-select v-model="queryCondition.actutingStation" placeholder="请选择" clearable filterable>
                  <el-option value="" label="全部"/>
                  <el-option v-for="item in actutingStationList" :key="item.actutingStation" :label="item.actutingStationName" :value="item.actutingStation"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" plain @click="findStepListFunc">查询</el-button>
                <el-button type="info" plain @click="showInfoPanelFunc">添加</el-button>
                <el-button type="button" @click="backFunc()">返回</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="text item">
        <el-table :data="stepList" style="overflow-x:scroll;">
          <el-table-column fixed="left" type="selection" width="55" label="选择"  align="center"/>
          <el-table-column v-for="col in showCols" :label="col.n"  align="center">
            <template slot-scope="{row}">
              <span v-html="contentFunc(col,row)"></span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="{row}">
              <span style="display:flex">
                <el-button type="danger" @click="deleteFunc(row)" plain>{{row.recordState=='Y'?'删除':'启用'}}</el-button>
                <el-button type="success" @click="showInfoPanelFunc(row)" plain>修改</el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[50, 100, 150,200, 250,300]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog  :visible.sync="infoVisible" append-to-body width="45%" height="10%" :title="infoTitle">
      <addStep v-if="infoVisible" ref="addStep"></addStep>
    </el-dialog>
  </div>
</template>
<script>
  import {
    findStepList
    ,loadStepInfo
    ,updateStep
    ,saveStep
    ,updateStepRecordState
  } from '@/api/sct';
  import dayjs from 'dayjs';
  import addStep from './addstep' ;
export default {
  components:{
    addStep
  },
  data() {
    return {
      queryCondition:{stepName:'',actutingStation:''}
      ,createUserList:null
      ,roleCode:''
      ,stepList:[]
      ,actutingStationList:[{actutingStation:'1',actutingStationName:'都允许'},{actutingStation:'2',actutingStationName:'门店POS机'},{actutingStation:'3',actutingStationName:'门店服务器'}
      ,{actutingStation:'4',actutingStationName:'总部服务器'},{actutingStation:'5',actutingStationName:'sps服务器'},{actutingStation:'6',actutingStationName:'手持'},{actutingStation:'7',actutingStationName:'其他'}]
      ,roleListSearch:null
      ,loginUserId:''
      ,loginUserName:''
      ,currentPage:1
      ,pageSize:50
      ,totalCount:0
      ,infoVisible:false
      ,infoTitle:'添加步骤'
      ,showCols:[{k:'stepName',n:'步骤名'},{k:'actutingStationName',n:'可执行端'},{k:'needCallbackName',n:'是否需要回调'},{k:'stepDesc',n:'说明'}
        ,{k:'createDate',n: '创建时间',t:'D'},{k:'updateDate',n: '修改时间',t:'D'},{k:'recordStateName',n: '是否有效'}
      ]
    };
  },
  created(){
    var u=this.$store.getters.users
    var roleCode=u.roleCode
    this.roleCode=roleCode
    this.loginUserId=u.userId
    this.loginUserName=u.userName
    this.findStepListFunc()
  }
  ,methods:{
    findStepListFunc(){
      var p={...this.queryCondition,pageNum:this.currentPage,pageSize:this.pageSize},that=this
      findStepList(p).then((rsp)=>{
        var l=rsp.data.stepList?rsp.data.stepList:null;
        that.stepList=l
        that.totalCount=rsp.data.totalCount
        that.$forceUpdate();
      });
    }
    ,backFunc(){
      this.$router.go(-1)
    }
    ,formatDate(value ,format){
      return dayjs(value).format(format);
    }
    ,contentFunc(col,row){
      var key=col.k;
      if(row[key] == null || row[key] == '' || row[key] == undefined){
        return '-';
      }else{
        if(col.t=='D'){
          return this.formatDate(row[key],'YYYY-MM-DD')+'<br/>'+this.formatDate(row[key],'HH:mm:ss');
        }else{
          return row[key];
        }
      }
    }
    ,deleteFunc(row){
      var p={stepId:row.stepId,updateUserId:this.loginUserId,updateUserName:this.loginUserName},that=this
      var r=row.recordState=='Y'?'N':'Y'
      p.recordState=r
      updateStepRecordState(p).then((rsp)=>{
        this.$message({
            type: 'info',
            message: rsp.rspMsg
        });
        that.findStepListFunc();
      });
    }
    ,showInfoPanelFunc(row){
      var id=null
      if(row&&row.stepId){
        this.infoTitle='修改步骤信息'
          id=row.id
      }else {
        this.infoTitle='添加步骤'
      }
      this.infoVisible=true
      this.$nextTick(()=>{
        this.$refs.addStep.initData(id,this.showInfoCallbackFunc);
      });
    }
    ,showInfoCallbackFunc(){
      this.infoVisible = false;
      this.findStepListFunc()
    }
    ,handleSizeChange(val) {       // 分页大小
      this.pageSize = val ;
      this.$forceUpdate();
      console.log(`handleSizeChange 每页 ${val} 条 ,每页 ${this.currentPage } 条 `);
      this.findStepListFunc();
    }
    ,handleCurrentChange(val) {         // 切换页面
      console.log(`handleCurrentChange 每页 ${this.pageSize} 条 ,每页 ${ val } 条 `);
      this.currentPage=val
      this.$forceUpdate()
      this.findStepListFunc()
    }
    ,roleContentFunc(row) {
      if(!row){
        return '-'
      }
      var roles=row.roles,r='';
      if(!roles){
        return '-';
      }else{
        roles.forEach(item=>{
          if(r){
            r+='<br/>'
          }
          r+=item.roleName
        })
        return r
      }
    }
  }
}
</script>

<style scoped>
.cont{padding:20px;}
.el-dialog__footer{text-align: center;}
.footer {
  border-top:1px soild #e4e4e4;
  position:fixed;
  z-index :100;
  left :0;
  right :0;
  bottom:1px;
  background-color:#fff;
  width:100%;
  height:35px;
  padding-left:20px;
  display:flex;
}
</style>

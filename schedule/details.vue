  <template>
  <div class="cont">
  <el-card class="box-card">
  <div slot="header" class="clearfix">
    <el-divider content-position="left">新建事件</el-divider>
  <el-form :model="ruleForm" ref="ruleForm" label-width="80px">
   <el-row :gutter="24">

   <el-col :span="6">
            <el-form-item label="区域" prop="bigAreaName">
                <el-select v-model="ruleForm.bigAreaId" placeholder="请选择" filterable clearable >
                  <el-option value="" label="全部">全部</el-option>
                  <el-option
                      v-for="item in bigAreaListSearch"
                      :key="item.bigAreaId"
                      :label=" item.bigAreaId +' -'+item.bigAreaName"
                      :value="item.bigAreaId">
                   </el-option>
                </el-select>
             </el-form-item>     
   </el-col>

   <el-col :span="6" v-show="false">
    <el-form-item label="日期" prop="scheduleDateBegin">
       <el-date-picker v-model="ruleForm.scheduleDateBegin" type="date" placeholder="" format="yyyy-MM-dd" @change="getdateValue"></el-date-picker>        
   </el-form-item>
   </el-col>

   <el-col :span="6" v-show="false">
    <el-form-item label="到" prop="scheduleDateEnd">
   <el-date-picker v-model="ruleForm.scheduleDateEnd" type="date" placeholder="" format="yyyy-MM-dd" @change="getdateVal"></el-date-picker>        
   </el-form-item>
   </el-col>
  <el-col :span="6">
    <el-date-picker v-model="selectedDateValue" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="daterange" :picker-options="pickerOptions0" range-separator="至" ></el-date-picker>
  </el-col>

  <el-col :span="6" >
    <el-button type="info" plain @click="checkFunc" v-if="canCheck">审核</el-button>
    <el-button type="primary" plain @click="exportToExcel">导出</el-button>
  </el-col>
</el-row>
</el-form>
 

<div class="table-cont" id="exportToExcel">
<el-table :data="scheduleList" style="width:100%;">
      <el-table-column prop="userId" label="员工编号" fixed></el-table-column>   
      <el-table-column prop="scheduleMonth" label="日期" fixed> </el-table-column>
      <el-table-column prop="userName" label="姓名" fixed> </el-table-column>    
      <el-table-column v-for="info in headerSelected" :key="info.prop" :prop="info.prop" :label="info.label" width="120px">
          <template slot-scope="{row}">
            <!-- <span v-html="getColContent(info.prop,row)"></span> -->
            <el-select value="" label="" v-model="row[info['prop']]">
              <el-option label="常日班" value="1" selected="1==row[info['prop']]"></el-option>
              <el-option label="一休一" value="2" selected="2==row[info['prop']]"></el-option>
              <el-option label="区域IT半班" value="3" selected="3==row[info['prop']]"></el-option>
              <el-option label="休息" value="4" selected="4==row[info['prop']]"></el-option>
            </el-select>
          </template>
      </el-table-column>
    </el-table>
</div>
<div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
</div>
 </div>

<el-divider content-position="left">工作安排</el-divider>

<div class="table-cont" id="printer" ref="printer">
<el-table :data="planList" style="width: 100%">
    <el-table-column label="本月工作重点">
      <el-table-column label="项目" prop="planName">
         <template slot-scope="scope">
            <el-input v-model="scope.row.planName"></el-input>
          </template>
      </el-table-column>
      <el-table-column label="内容" prop="planDesc">
         <template slot-scope="scope">
            <el-input v-model="scope.row.planDesc"></el-input>
          </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="备注">
      <el-table-column label="事项" prop="planItemName">
         <template slot-scope="scope">
            <el-input v-model="scope.row.planItemName"></el-input>
          </template>
      </el-table-column>
      <el-table-column label="内容" prop="planItemDesc">
         <template slot-scope="scope">
            <el-input v-model="scope.row.planItemDesc"></el-input>
          </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</div>

</el-card>

<div class="btn-cont">
    <el-button type="primary" @click="saveFunc">保存</el-button>
    <el-button type="info" v-print="'#printer'">打印</el-button> 
    <el-button type="danger" @click="cancel">返回</el-button> 
</div>

      <el-dialog title="审核" :visible.sync="checkVisible">
        <el-form :model="checkForm" ref="checkForm" label-width="120px">
        <el-form-item label="审核">
          <el-input v-model="checkForm.operatorUser" autocomplete="off" placeholder="无"></el-input>
        </el-form-item>
          <!-- <el-form-item label="状态变更原因">
            <el-input type="textarea" v-model="checkForm.turnReason"></el-input>
          </el-form-item> -->
        <div class="btn-cont">
          <el-button type="primary" plain @click="checkBtnFunc('Y')">通过</el-button>
          <el-button type="danger" plain @click="checkBtnFunc('N')">不通过</el-button>
          <el-button type="info" plain @click="checkVisible = false">返回</el-button>      
        </div>
        </el-form>
      </el-dialog>
  </div>
</template>


<script>
import {
findBigAreaListByRole,
} from '@/api/eventapi'
import dayjs from 'dayjs' ;
import {
findScheduleList ,
findPlanList,
saveScheduleBatch,
checkScheduleBatch
} from '@/api/hss'

import FileSaver from 'file-saver'
import XLSX from 'xlsx'


// import moment from 'moment'
  export default {

    data() {
        return {
　　　　    selectDate: null, 
　　　　　　selectedDateValue: null, //时间区间
　　　　　　pickerOptions0: {
　　　　　　　　disabledDate: time => {
　　　　　　　　　　if (this.selectDate == null) {
　　　　　　　　　　　　return false
　　　　　　　　　　} else {
　　　　　　　　　　　　return (this.selectDate.getMonth() != time.getMonth())
　　　　　　　　　　}
　　　　　　　　},
　　　　　　　　onPick: date => {
　　　　　　　　　　// 如果只选择一个则保存至selectDate 否则selectDate 为空
　　　　　　　　　　if (date.minDate && !date.maxDate) {
　　　　　　　　　　　　this.selectDate = date.minDate
　　　　　　　　　　} else {
　　　　　　　　　　　　this.selectDate = null
　　　　　　　　　　}
              //  console.log(this.selectedDateValue)
　　　　　　　　}   
　　　　　　},

        currentPage:1,
        pageSize:10,
        totalCount:0,
        scheduleList: [],
        planList:[],
        bigAreaListSearch:[],   
        bigAreaList: [],
        scheduleTotal:'',
        userId:'',
        ruleForm: {
          // scheduleId:'',
          bigAreaId: '',
          bigAreaName: '',
          scheduleDateBegin:'',
          scheduleDateEnd:'',
       },
        header:[
            { label: "1日", prop: "day01", },
            { label: "2日", prop: "day02", },
            { label: "3日", prop: "day03", },
            { label: "4日", prop: "day04", },
            { label: "5日", prop: "day05", },
            { label: "6日", prop: "day06", },
            { label: "7日", prop: "day07", },
            { label: "8日", prop: "day08", },
            { label: "9日", prop: "day09", },
            { label: "10日", prop: "day10", },
            { label: "11日", prop: "day11", },
            { label: "12日", prop: "day12", },
            { label: "13日", prop: "day13", },
            { label: "14日", prop: "day14", },
            { label: "15日", prop: "day15", },
            { label: "16日", prop: "day16", },
            { label: "17日", prop: "day17", },
            { label: "18日", prop: "day18", },
            { label: "19日", prop: "day19", },
            { label: "20日", prop: "day20", },
            { label: "21日", prop: "day21", },
            { label: "22日", prop: "day22", },
            { label: "23日", prop: "day23", },
            { label: "24日", prop: "day24", },
            { label: "25日", prop: "day25", },
            { label: "26日", prop: "day26", },
            { label: "27日", prop: "day27", },
            { label: "28日", prop: "day28", },
            { label: "29日", prop: "day29", },
            { label: "30日", prop: "day30", },
            { label: "31日", prop: "day31", },
          ],
        scheduleMonth:'',
        headerSelected:[],
        checkState:null,
        checkVisible:false,
        checkForm: {
          turnReason: '',
          operatorUser: ''
        },
        operatorUserName: '',
       }
      },
      watch:{
        selectedDateValue(val, oldVal){
         this.headerSelected = []
        if(!val){
                return
            }
            var scheduleDateBegin=val[0],scheduleDateEnd=val[1]
           
            if(!scheduleDateBegin || !scheduleDateEnd){
                return
            }
            this.ruleForm.scheduleDateBegin = scheduleDateBegin
            this.ruleForm.scheduleDateEnd = scheduleDateEnd
            var begin=Number(scheduleDateBegin.substring(8)),end=Number(scheduleDateEnd.substring(8))
            this.header.forEach((item,idx)=>{
                if(idx>=begin-1 && idx <= end-1){
                   this.headerSelected.push(item)
                }
              }
            )
         console.log("selectedDateValue: "+val, oldVal);
         this.findScheduleListFunc();
       },
       
    },
  created() {
    this.fetchData();
    var u = this.$store.getters.users
    var roleCode = u.roleCode
    this.roleCode = roleCode
    this.loginUserId = u.userId
    this.loginUserName = u.userName
    // this.scheduleId = this.$router.query.scheduleId;
    this.ruleForm.scheduleDateBegin = this.$route.query.startDate;
    this.ruleForm.scheduleDateEnd = this.$route.query.finishDate;
   

    this.getCurrentMonthFirst()
    this.getCurrentMonthLast()

  },
  activated(){
    this.findScheduleListFunc();
    this.findPlanListFunc();
    let userId = this.$store.getters.users.userId ;  
    this.ruleForm.bigAreaId = this.$route.query.bigAreaId;
    this.ruleForm.bigAreaName = this.$route.query.bigAreaName;
    this.scheduleMonth = this.$route.query.scheduleMonth;
    this.selectedDateValue = [this.$route.query.startDate,this.$route.query.finishDate]
  },

 methods:{
    saveFunc() {
      var that = this
      var p={updateUserId:this.userId, updateUserName:this.userName, scheduleList:this.scheduleList, bigAreaId:this.ruleForm.bigAreaId, bigAreaName:this.ruleForm.bigAreaName,}
      that.bigAreaListSearch.forEach(item=>{
             if(item.bigAreaId==p.bigAreaId){
               p.bigAreaName=item.bigAreaName
             }
           })
      saveScheduleBatch(p).then((rsp) => {
           this.$message({ showClose: true, message: rsp.rspMsg, type: 'success' })
            if (rsp && rsp.rspCode == 0) {
              // that.findScheduleListFunc()
            }
                 
        })
    },

    fetchData() {
        this.initBigAreaListSearch();  
 
      },

    initBigAreaListSearch(){
      let params = {groupId:this.$store.getters.users.groupId,roleCode:this.$store.getters.users.roleCode} ;
      findBigAreaListByRole(params).then(response => {
        this.bigAreaListSearch = response.data ;
        
      });
    },

    handleSizeChange(val) { // 分页大小
      this.pageSize = val
      this.$forceUpdate()
      console.log(`handleSizeChange 每页 ${val} 条 ,每页 ${this.currentPage} 条 `)
      this.findScheduleListFunc()
    },

    handleCurrentChange(val) { // 切换页面
      console.log(`handleCurrentChange 每页 ${this.pageSize} 条 ,每页 ${val} 条 `)
      this.currentPage = val
      this.$forceUpdate()
      this.findScheduleListFunc()
    },

    findScheduleListFunc() {
         var that = this
      findScheduleList({ ...this.ruleForm, loginUserId: this.loginUserId,pageNum:this.currentPage,pageSize:this.pageSize}).then((rsp) => {
         var t = rsp.data.scheduleList ? rsp.data.scheduleList : null
         that.scheduleList = t
         that.totalCount=rsp.data.totalCount
         that.$forceUpdate();
      })
    },
    findPlanListFunc() {
         var that = this
      findPlanList({loginUserId: this.loginUserId, loginUserName:this.loginUserName,}).then((rsp) => {
         var t = rsp.data.planList ? rsp.data.planList : null
         that.planList = t
         that.$forceUpdate();
      })
    },


   // 默认当前时间
   getdateValue (val) {
      this.ruleForm.scheduleDateBegin = val
      // this.getbalanceIndexData()
    },
    getdateVal (val) {
      this.ruleForm.scheduleDateEnd = val
      // this.getbalanceIndexData()
    },
 
   getCurrentMonthFirst() {
      var date = new Date()
      date.setDate(1)
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10)  month = '0' + month
      if (day < 10)  day = '0' + day
      this.ruleForm.scheduleDateBegin = date.getFullYear() + '-' + month + '-' + day
    },
   getCurrentMonthLast() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = new Date(year, month, 0)
      this.ruleForm.scheduleDateEnd = year + '-' + month + '-' + day.getDate()
    },

// // 生成表格列
//     getColContent(key,row){
//       var value = row[key]
//       var html=`<el-select value="" label="" v-model="row.${key}">`+
//             `<el-option label="" value="" selected="${!value}"></el-option>`+
//             `<el-option label="常日班" value="1" selected="${value==1}"></el-option>`+
//             `<el-option label="一休一" value="2" selected="${value==2}"></el-option>`+
//             `<el-option label="区域IT半班" value="3" selected="${value==3}"></el-option>`+
//             `<el-option label="休息" value="4" selected="${value==4}"></el-option>`+
//             `</el-select>`
//       return html
//       console.log(html)
//     },
    

// showColumn(key,row){
//       var scheduleMonth = row.scheduleMonth
//       var beginDay=scheduleMonth.substr(0,4)+'-'+scheduleMonth.substr(4,2)+'-01'
//       let d = dayjs(beginDay)
//       var endDay=d.daysInMonth()
//       if(Number(key.substr(3,2))>endDay){
//         return false
//       }  
//       return true
//     }

// 导出
exportToExcel () {
    let et = XLSX.utils.table_to_book(document.getElementById('exportToExcel')); //此处传入table的DOM节点
    let etout = XLSX.write(et, { 
        bookType: 'xlsx', 
        bookSST: true, 
        type: 'array' 
    });
    try {
        FileSaver.saveAs(new Blob([etout], { 
            type: 'application/octet-stream' 
        }), '排班表.xlsx');   //trade-publish.xlsx 为导出的文件名
    } catch (e) {
        console.log(e, etout) ;
    }
    return etout;
},
cancel() {
    this.$forceUpdate();
    this.$router.go(-1);
  },

checkFunc(row){
   this.checkVisible = true;
   this.checkForm.operatorUser=this.loginUserId+'-'+this.loginUserName+" "+this.ruleForm.scheduleDateBegin
},

checkBtnFunc(_checkState){
  //  if(!this.checkForm.turnReason&&_checkState=='N'){
  //      this.$message({
  //           type: 'info',
  //           message: '不通过请说明理由'
  //         });
  //         return ;
  //       }
        let _p = {loginUserId: this.userId, loginUserName: this.userName, scheduleList:this.scheduleList, checkState:_checkState,};
        checkScheduleBatch(_p).then((rsp)=>{
            this.cancel();
        });
      },

canCheck(){
          if (this.roleCode === 'R00013'||(this.roleCode === 'R00014'&& this.checkState=='Y')){
            return true;
          }
          return false
        }

   }
}
  </script>

<style>
.footer{margin-bottom:20px;}
.el-divider__text.is-left{font-size:16px;}
.table-cont{padding-bottom: 20px;}                
.el-table thead.is-group th{text-align:center;width:100%;}
.cont{padding:20px;}
.el-table td .el-input__inner{padding:0 5px;}
</style>

<template>
  <div class="cont">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="ruleForm" :model="ruleForm" label-width="80px">
          <el-divider content-position="left">条件查询</el-divider>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="区域">
                <el-select
                  v-model="ruleForm.bigAreaId"
                  placeholder="请选择"
                  filterable
                  clearable
                >
                  <el-option value="" label="全部">全部</el-option>
                  <el-option
                    v-for="item in bigAreaListSearch"
                    :key="item.bigAreaId"
                    :label="item.bigAreaId + ' -' + item.bigAreaName"
                    :value="item.bigAreaId"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="日期" prop="scheduleDateBegin">
                <el-date-picker
                  v-model="ruleForm.scheduleDateBegin"
                  type="date"
                  placeholder="开始日期"
                  format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="到" prop="scheduleDateEnd">
                <el-date-picker
                  v-model="ruleForm.scheduleDateEnd"
                  type="date"
                  placeholder="结束日期"
                  format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-button
                type="info"
                plain
                @click="submitForm('ruleForm')"
              >查询</el-button>
              <el-button
                type="primary"
                plain
                @click="addSchedule()"
              >添加</el-button>
              <el-dialog
                title="新增排班"
                :visible.sync="addScheduleDialog"
                width="35%"
              >
                <div style="padding: 10px 40px 10px 15px">
                  <el-form
                    ref="addScheduleForm"
                    :model="addScheduleForm"
                    label-width="90px"
                  >
                    <el-form-item label="区域" prop="bigAreaName">
                      <el-select
                        v-model="addScheduleForm.bigAreaId"
                        placeholder="请选择"
                        filterable
                        clearable
                      >
                        <el-option value="" label="全部">全部</el-option>
                        <el-option
                          v-for="item in bigAreaList"
                          :key="item.bigAreaId"
                          :label="item.bigAreaId + ' -' + item.bigAreaName"
                          :value="item.bigAreaId"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="班次日期" prop="scheduleDate">
                      <el-date-picker
                        v-model="addScheduleForm.scheduleDate"
                        type="date"
                        placeholder=""
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                      />
                    </el-form-item>
                    <el-form-item label="班次时间">
                      <el-col :span="11" style="padding-left: 0">
                        <el-date-picker
                          v-model="addScheduleForm.scheduleDateBegin"
                          type="date"
                          placeholder=""
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                        />
                      </el-col>
                      <el-col class="line" :span="2">至</el-col>
                      <el-col :span="11" style="padding-right: 0">
                        <el-date-picker
                          v-model="addScheduleForm.scheduleDateEnd"
                          type="date"
                          placeholder=""
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                        />
                      </el-col>
                    </el-form-item>

                    <el-form-item>
                      <el-button
                        type="primary"
                        @click="saveFunc()"
                      >保 存</el-button>
                      <el-button @click="cancelFunc()">取消</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </el-dialog>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-table :data="scheduleList" style="width: 100%">
        <el-table-column prop="id" label="编号" type="index" width="100">
      <template slot-scope="scope">
        <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
      </template>
    </el-table-column>
        <el-table-column label="区域">
             <template slot-scope="{row}">
                 <span>{{row.bigAreaName}}</span>
             </template>
        </el-table-column>
        <el-table-column label="开始时间">
             <template slot-scope="{row}">
                 <span>{{row.startDate}}</span>
             </template>
        </el-table-column>
        <el-table-column  label="结束时间">
          <template slot-scope="{row}">
                 <span>{{row.finishDate}}</span>
             </template>
        </el-table-column>
        <el-table-column  label="最后更新时间">
          <template slot-scope="{row}">
            <span>{{row.updateDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="checkFunc(scope.row)">查看</el-button>
            <el-button type="info" plain @click="modifyFunc(scope.row)">修改</el-button>
            <el-button type="danger" plain @click="deleteFunc(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

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

  </div>
</template>

<script>
import {
  findBigAreaListByRole
} from '@/api/eventapi'
import dayjs from 'dayjs'
import {
  findScheduleBigAreaList,
  deleteSchedule
} from '@/api/hss'

export default {
  data() {
    return {
      recordState: '',
      addScheduleDialog: false,
      currentPage: 1,
      pageSize: 50,
      totalCount: 0,
      scheduleList: [],
      bigAreaListSearch: [],
      bigAreaList: [],
      bigAreaId: '',
      bigAreaName: '',
      scheduleDateBegin:'',
      scheduleDateEnd:'',
      startDate:'',
      finishDate:'',
      scheduleMonth:'',
      ruleForm: {
        userId: '',
        userName: '',
        bigAreaId: '',
        bigAreaName: '',
        scheduleId: '',
        scheduleDate: '',
        scheduleDateBegin: '',
        scheduleDateEnd: ''
      },
      loginUserId:'',
      loginUserName:'',
      addScheduleForm: {
        userId: '',
        userName: '',
        bigAreaId: '',
        bigAreaName: '',
        scheduleId: '',
        scheduleDate: '',
        scheduleDateBegin: '',
        scheduleDateEnd: ''
      },
      scheduleId:''
    }
  },
  created() {
    this.fetchData()
    // this.initData()
    var u = this.$store.getters.users
    var roleCode = u.roleCode
    this.roleCode = roleCode
    this.loginUserId = u.userId
    this.loginUserName = u.userName

  },
  activated() {
    console.log('activated');
    this.findScheduleBigAreaListFunc();
    // this.loadScheduleInfoFunc();
    // this.submitForm();
  },
  methods: {
    formatDate(value ,format ){
       return dayjs(value).format(format);

    },
    handleClick(row) {
        console.log(row);
      },
    fetchData() {
      this.initBigAreaListSearch()
    },

   initBigAreaListSearch(){
      let params = {groupId:this.$store.getters.users.groupId,roleCode:this.$store.getters.users.roleCode} ;
      findBigAreaListByRole(params).then(response => {
        this.bigAreaListSearch = response.data ;
      });
    },

    /* ---- 新增排班----*/

    // saveFunc() {
    //   this.$refs.addScheduleForm.validate((valid, _n) => {
    //     var p = {
    //       userId: this.addScheduleForm.userId,
    //       userName: this.addScheduleForm.userName,
    //       scheduleDate: this.addScheduleForm.scheduleDate,
    //       startDate: this.addScheduleForm.startDate,
    //       finishDate: this.addScheduleForm.finishDate,
    //       bigAreaId: this.addScheduleForm.bigAreaId,
    //       bigAreaName: this.addScheduleForm.bigAreaName,
    //       updateUserId: this.loginUserId,
    //       updateUserName: this.loginUserName
    //     }
    //     var that = this
    //     that.bigAreaList.forEach((item) => {
    //       if (item.bigAreaId == p.bigAreaId) {
    //         p.bigAreaName = item.bigAreaName
    //       }
    //     })

    //     // if (p.userId == '') {
    //     //   this.$message({ type: 'info', message: '工号必输' })
    //     // }
    //     // if (p.userName == '') {
    //     //   this.$message({ type: 'info', message: '姓名必输' })
    //     // }

    //     if (this.scheduleId) {
    //       p.id = this.scheduleId
    //       updateSchedule(this.scheduleId + '', p).then((rsp) => {
    //         this.$message({
    //           showClose: true,
    //           message: rsp.rspMsg,
    //           type: 'success'
    //         })
    //         if (rsp && rsp.rspCode == 0) {
    //           that.addScheduleDialog = false
    //           that.findScheduleListFunc()
    //         }
    //       })
    //     } else {
    //       saveSchedule(p).then((rsp) => {
    //         this.$message({
    //           showClose: true,
    //           message: rsp.rspMsg,
    //           type: 'success'
    //         })
    //         if (rsp && rsp.rspCode == 0) {
    //           that.addScheduleDialog = false
    //           that.findScheduleListFunc()
    //         }
    //       })
    //     }
    //   })
    // },

    /* ---- 新增排班大区 ----*/

    // async initData() {
    //   const companyType = this.$store.getters.users.companyType
    //   // const userId = this.$store.getters.users.userId
    //   // const userName = this.$store.getters.users.userName
    //   // const roleCode = this.$store.getters.users.roleCode
    //   // const groupId = this.$store.getters.users.groupId
    //   this.companyType = companyType
    //   // this.userId = userId
    //   // this.userName = userName
    //   // this.ruleForm.userId = userId
    //   // this.ruleForm.userName = userName
    //   this.ruleForm.lineType = '1'
    //   this.lineTypeChangeFunc()
    //   this.findBigAreaList('Y')
    // },
    // async findBigAreaList(needInitContinue = 'N') {
    //   const params = { companyType: this.companyType }
    //   await findBigAreaList(params).then((response) => {
    //     const data = response.data
    //     this.bigAreaList = data.bigAreaList
    //   })
    // },
    // lineTypeChangeFunc() {
    //   this.$forceUpdate()
    //   if (this.ruleForm.bigAreaId) {
    //     this.bigAreaChangeFunc()
    //   }
    // },

    findScheduleBigAreaListFunc() {
      var that = this
      findScheduleBigAreaList({loginUserId: this.loginUserId, pageNum: this.currentPage, pageSize: this.pageSize }).then((rsp) => {
        var t = rsp.data.scheduleList ? rsp.data.scheduleList : null
        that.scheduleList = t
        that.totalCount = rsp.data.totalCount
        that.$forceUpdate()
      })
    },

   addSchedule() {
      this.$router.push({
        path: '/schedule/details'
      })
    },


    checkFunc(row) {
      // if (row && !row.scheduleId) {
      //   row = row.row
      // }
      this.$router.push(
        {
          path: '/schedule/details',
          query: {
            // scheduleId: row.scheduleId,
            userId: row.userId,
            bigAreaId: row.bigAreaId,
            bigAreaName: row.bigAreaName,
            startDate: row.startDate,
            finishDate: row.finishDate,
            scheduleMonth: row.scheduleMonth,
            showFlg:'Y'
          }
        })
    },

    modifyFunc(row) {
      this.$router.push({
        path: '/schedule/details',
          query: {
            // scheduleId: row.scheduleId,
            userId: row.userId,
            bigAreaId: row.bigAreaId,
            bigAreaName: row.bigAreaName,
            startDate: row.startDate,
            finishDate: row.finishDate,
            scheduleMonth: row.scheduleMonth,
          }
      })
    },

    deleteFunc(row) {
      var p = { bigAreaId:row.bigAreaId, bigAreaName:row.bigAreaName,
      startDate:row.startDate, finishDate:row.finishDate, scheduleMonth:row.scheduleMonth,
      updateUserId:this.loginUserId, updateUserName:this.loginUserName}
      var that = this
      p.recordState='N'
      deleteSchedule(p).then((rsp) => {
        this.$message({
          type: 'info',
          message: rsp.rspMsg
        })
      })
      that.findScheduleBigAreaListFunc()
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
    submitForm(formName='ruleForm'){
      let userId = this.$store.getters.users.userId ;
      if(this.ruleForm.scheduleDateBegin){
        let _bd = dayjs(this.ruleForm.scheduleDateBegin);
        this.ruleForm.scheduleDateBegin = _bd.format('YYYY-MM-DD');
      }
      if(this.ruleForm.scheduleDateEnd){
        let _ed = dayjs(this.ruleForm.scheduleDateEnd);
        this.ruleForm.scheduleDateEnd = _ed.format('YYYY-MM-DD');
      }
      var that = this
      findScheduleBigAreaList({ ...this.ruleForm, bigAreaId:this.bigAreaId, bigAreaName:this.bigAreaName, loginUserId: this.loginUserId,pageNum : this.currentPage ,pageSize : this.pageSize}).then((rsp) => {
        var l = rsp.data.scheduleList ? rsp.data.scheduleList : null
        that.scheduleList = l
        that.totalCount = rsp.data.totalCount
        that.$forceUpdate()
      })
    },
  }
}
</script>

<style>
.cont {
  padding: 20px;
}
.footer {
  margin-top: 20px;
}
.el-table .el-button--medium {
  padding: 5px 10px;
  font-size: 12px;
}
</style>

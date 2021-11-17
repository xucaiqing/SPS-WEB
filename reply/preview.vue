<template>
  <div class="cont">
    <el-card class="box-card">
      <div>
        <p style="padding-left:10px;">请尝试轻触以下关键词显示功能菜单：</p>
      </div>
      <div>
        <template v-for="(item,idx) in keywordList">
            <span class="u-line" @click="msgFunc(item.keyword)" style="min-width:30%; display:block;float: left;">
              <el-button type="success" plain>
              {{item.keyword}}
              </el-button>
            </span>
          <p v-show="(idx+1)%3==0"/>
        </template>
      </div>
    </el-card>
    <p style="padding:20px 0 0 10px">{{tips}}</p>
    <div v-for="(reply) in replyList" @click="clickKeywordFunc(reply.replyId)">
      <div style="padding:10px;">
        <icon class="el-icon-search"></icon>
        <span>{{reply.id}}、</span>
        <span class="u-line">{{reply.title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {msg,findKeywordListPreview} from '@/api/reply'
  export default {
    data() {
      return {
        replyList: [],
        templateIdList: [],
        replyId: '',
        tips:'',
        tipsDefault:'为您匹配到以下功能,请从列表中选择一个进入',
        ruleForm: {
          inputWords: ''
        },
        intervalId: null,
        cycleSeconds: 3,
        cycleUnit: 1000,
        restSeconds: '',
        groupId: '',
        keywordList:[]
      }
    },

    created() {
      var u = this.$store.getters.users
      if(!u||!u.userId){
          return
      }
      this.userId = u.userId
      this.userName = u.userName
      this.groupId = u.groupId
      this.ruleForm.inputWords = this.$route.query.inputWords
      this.ruleForm.channel = this.$route.query.channel
    },
    activated() {
      if(!this.userId||!this.groupId.indexOf('0901')){  //只能IT服务中心人员可以预览
          return
      }
      this.findKeywordListFunc()
      this.msgFunc()
    },
    methods: {
      msgFunc(keyword) {
        if(!this.ruleForm.inputWords&&!keyword){
          return
        }else if(keyword){
          this.ruleForm.inputWords=keyword
        }
        var that = this
        msg({...this.ruleForm, createUserId: this.userId, createUserName: this.userName,previewFlg:'Y'}).then((rsp) => {
          that.replyList = rsp.data
          if(!rsp.data||rsp.data.length==0){
            that.tips=''
          }else{
            that.tips=that.tipsDefault
          }
          that.$forceUpdate()
        })
      },
      clickKeywordFunc(replyId) {
        this.$router.push({path: '/reply/index',query:{replyId:replyId,previewFlg:'Y'}})
      },
      findKeywordListFunc() {
        var that=this
        findKeywordListPreview().then(rsp=>{
          that.keywordList=rsp.data
        })
      },
    }
  }
</script>
<style>
  .el-table .el-button--medium{
    padding: 5px 10px;
    font-size: 12px;
  }
  .cont{padding:10px;}
  .u-line{color: #19d6a0;text-decoration:underline;padding:5px 10px;cursor: pointer;}
  .el-card__body{padding:5px 0 0 5px;}
  .el-card{padding-bottom:20px;}
  .el-button--medium{padding:8px 12px;font-size:13px;}
</style>

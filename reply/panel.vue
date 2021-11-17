<template>
  <div class="cont">
    <el-card class="box-card">

        <div>
          <p v-if="(!!keywordList)" style="padding-left:10px;">请尝试轻触以下关键词显示功能菜单：</p>
          <p v-else style="padding-left:10px;">禁止刷新,请重新进入本页面</p>
        </div>
        <div>
          <template v-for="(item,idx) in keywordList">
            <span class="u-line" @click="msgFunc(item.keyword)" style="min-width:30%; display:block;float: left;">
              <el-tooltip placement="right-start">
                <div slot="content">{{(!!item.useCount)?'点击次数'+item.useCount:''}}</div>
                <el-button type="success" plain>
                {{item.keyword}}
                </el-button>
              </el-tooltip>
            </span>
            <p v-show="(idx+1)%3==0"/>
          </template>
        </div>

    </el-card>
    <p style="padding:20px 0 0 10px">{{tips}}</p>
    <div v-for="(reply) in replyList" @click="clickKeywordFunc(reply.replyId)">
      <div style="padding:10px;">
        <el-button icon="el-icon-search" circle></el-button>
        <span>{{reply.id}}、</span>
        <span class="u-line">{{reply.title}}</span>
      </div>
    </div>
    <el-tooltip placement="top" class="footer">
      <div slot="content">
        关键词是指常见问题的分类,以点击问次数排序<br>
        本页面只涵盖部分自助功能,如果有需求或者使用过程中有不方便和待改进的地方请反馈给IT服务中心或者运营销售部,也可以在本应用中留言
      </div>
      <el-button plain circle icon="el-icon-question"></el-button>
    </el-tooltip>
  </div>
</template>

<script>
  import {msg,findKeywordList} from '@/api/reply'
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
      this.ruleForm.inputWords = this.$route.query.inputWords
      this.ruleForm.channel = this.$route.query.channel
    },
    activated() {
      if(!this.userId){
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
        msg({...this.ruleForm, createUserId: this.userId, createUserName: this.userName}).then((rsp) => {
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
        this.$router.push({path: '/reply/index',query:{replyId:replyId}})
      },
      findKeywordListFunc() {
        var that=this
        findKeywordList().then(rsp=>{
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

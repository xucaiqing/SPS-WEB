  <template>
  <div class="el-card__body">

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="area"
        label="大区">
      </el-table-column>
      <el-table-column
        prop="store"
        label="门店">
      </el-table-column>
       <el-table-column
        prop="executor"
        label="模板执行人">
      </el-table-column>
      <el-table-column
        prop="result"
        label="执行结果">
        <el-tag type="success">成功</el-tag>
        <el-tag type="danger">失败</el-tag>
      </el-table-column>
      <el-table-column
        prop="details"
        label="详情">
      </el-table-column>
     
    </el-table>
  </div>
  </template>

<script>
    export default {
      data() {
        return {
          tableData: [{
            area: '上海区',
            store: '南方商城店',
            executor:'张三',
            result:'成功',
            details: '详情详情详情'
          }]
        }
      }
    }
  </script>

<style>
.el-tag--medium {
    height: 22px;
    line-height: 20px;
}
.el-table th,.el-table td{padding-left:10px;}

</style>

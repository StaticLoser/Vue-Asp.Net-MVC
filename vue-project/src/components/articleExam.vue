<template>
  <div id="tab">
    <el-table
      :data="
        tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      style="width: 100%"
    >
      <el-table-column label="#" prop="aid"></el-table-column>
      <el-table-column label="Name" prop="name"> </el-table-column>
      <el-table-column prop="title" label="标题"> </el-table-column>
      <el-table-column prop="created_at" label="更新日期"></el-table-column>
      <el-table-column align="center">
        <template slot="header"> 操作 </template>
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="index"
            @click="handleDetail(scope.$index, tableData, scope.row)"
            >详情</el-button
          > -->
          <el-button type="text" @click="handleDetail(scope.$index, scope.row)"
            >详情</el-button
          >
         
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      width="70%"
      title="文章详情"
      :visible.sync="dialogFormVisible"
      @open="show()"
    >
      <el-dialog
        width="50%"
        title="驳回理由"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-form :model="msgNo">
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input v-model="msgNo.msg" autocomplete="off"></el-input>
            <div class="dialog-footer" id="innerdia">
              <el-button @click="innerVisible = false">取 消</el-button>
              <el-button type="primary" @click="shenheNoPass()">驳回</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-form :model="form">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input
            v-model="form.title"
            ref="title"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            v-html="form.content"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="shenhePass()">通 过</el-button>
        <el-button type="danger" @click="shenheNoPass()"
          >不 通 过</el-button
        >
      </div>
    </el-dialog>

    <div class="block">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="tableData.length"
        :page-size="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      innerVisible: false,
      tableData: [],
      //每页几条
      pageSize: 9,
      //几页
      total: 0,
      //当前页面
      currentPage: 1,
      form: [],
      msgNo: {
        msg: "111",
      },
      formLabelWidth: "120",
      dialogFormVisible: false,
    };
  },
  methods: {
    //取消
    allCancle() {
      this.dialogFormVisible = false;
      
    },
    //审核通过方法
    shenhePass() {
      this.axios
        .post("/Article/UpdateArticleState", {
          aid: this.form.aid,
          state: 0,
        })
        .then((res) => {
          console.log(res);
          //this.tableData = res.data.list;
          //this.splice(index, 1);
          console.log(this);
          this.dialogFormVisible = false;
          this.$message({
            type: "success",
            message: "成功!",
          });
          this.getlist();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //审核不通过
    shenheNoPass() {
      this.axios
        .post("/Article/UpdateArticleState", {
          aid: this.form.aid,
          state: 2,
        })
        .then((res) => {
          console.log(res);
          //this.tableData = res.data.list;
          //this.splice(index, 1);
          console.log(this);
          this.dialogFormVisible = false;
          this.innerVisible = false;
          this.$message({
            type: "success",
            message: "成功!",
          });
          this.getlist();
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(this.form.aid)
    },
    //取消编辑
    CanEdi() {
      this.dialogFormVisible = false;
      this.$message("取消编辑");
    },
    //确认修改
    ConMod() {
      this.axios
        .post("/Article/EditUserDetail", {
          id: this.form.id,
          name: this.form.name,
          email: this.form.email,
          sign: this.form.sign,
        })
        .then((res) => {
          console.log(res);
          this.$message({
            type: "success",
            message: "修改成功!",
          });
        })
        .catch((err) => {
          console.log(err);
           this.$message.error('失败');
        });

      this.dialogFormVisible = false;
    },
    show() {
      console.log(this);
    },
    changeSwitch(r) {
      console.log(r);
    },
    handleDetail(index, sr) {
      console.log(index, sr.aid);
      this.form = sr;
      this.dialogFormVisible = true;
    },
    handleEdit(s, r) {
      console.log(s, r);
    },
    handleDelete(s, r) {
      console.log(s, r);
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    //初始化列表
    getlist() {
      this.axios
        .post("/Article/GetDaiShenlList", {})
        .then((res) => {
          console.log(res);
          this.tableData = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  mounted() {
    this.getlist();
  },
};
</script>
<style>
#innerdia {
  margin-top: 10px;

  text-align: right;
}
</style>
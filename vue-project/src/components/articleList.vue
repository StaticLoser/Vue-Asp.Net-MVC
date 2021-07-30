<template>
  <div id="tab">
    <el-table
      :data="
        tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column label="#" prop="aid"></el-table-column>
      <el-table-column label="Name" prop="name"> </el-table-column>
      <el-table-column prop="title" label="标题"> </el-table-column>
      <el-table-column prop="created_at" label="更新日期"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="info">{{ state[scope.row.state] }}</el-tag>
        </template>
      </el-table-column>
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
          <el-button
            size="mini"
            type="danger"
            @click="open(scope.$index, tableData, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="文章详情"
      :visible.sync="dialogFormVisible"
      @open="show()"
    >
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
        <el-button type="primary" @click="dialogFormVisible = fasle"
          >确 定</el-button
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
      isClear: false,
      //每页几条
      pageSize: 9,
      state: ["通过", "待审核", "封禁"],
      //几页
      total: 0,
      //当前页面
      currentPage: 1,
      flag: false,
      tableData: [],
      search: "",
      dialogFormVisible: false,
      title: "",
      form: {
        title: "你好",
      },
      formLabelWidth: "120px",
      loading: true,
    };
  },
  methods: {
    //加载方法
    load() {
      setTimeout(function () {
        this.loading = false;
      }, 3000);
    },

    //改变文章状态
    changeSwitch(row) {
      this.axios
        .post("/Article/UpdateArticleState", {
          aid: row.aid,
          state: row.state,
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
          this.$message.error("修改失败");
        });

      console.log(row);
    },
    change(val) {
      console.log(val);
    },
    //执行删除方法
    open(index, row, sr) {
      this.$confirm("您确定删除这条数据吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((suc) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          console.log("确认");
          console.log(suc);
          console.log(row);
          this.del(sr.aid);
          row.splice(index, 1);
        })
        .catch((err) => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
          console.log("取消");
          console.log(err);
        });
    },
    //获取全部列表方法
    getList() {
      this.flag = true;
      this.axios
        .post("/Article/GetList")
        .then((res) => {
          console.log(res);
          this.tableData = res.data.list;
          this.total = res.data.count;
          this.flag = false;
        })
        .catch((err) => {
          console.log(err);
          this.flag = false;
        });
    },
    //删除方法
    del(id) {
      this.axios
        .post("/Article/Delete", {
          id: id,
          collection: "Article",
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });

      console.log(this);
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val;
    },

    show() {
      console.log(this);
    },
    //对话框赋值
    handleDetail(index, sr) {
      console.log(index, sr.aid);
      this.form = sr;
      this.dialogFormVisible = true;
    },
    //删除
    handleDelete(index, row) {
      console.log(index, row);
      this.del(row.aid);
      this.getList();
    },
    //加载动画
    openFullScreen1() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1500);
    },
  },
  mounted() {
    console.log(this);
    this.getList();
    this.openFullScreen1();
  },
};
</script>

<style>
#tab {
  width: 100%;
}
.block {
  margin-top: 10px;
}
</style>
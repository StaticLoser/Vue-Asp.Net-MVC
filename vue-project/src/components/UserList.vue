<template>
  <div id="tab">
    <el-table
      :data="
        tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column label="#" prop="id"> </el-table-column>
      <el-table-column label="Name" prop="name"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="create_at" label="加入日期"> </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            :active-value="0"
            :inactive-value="1"
            active-text="启用"
            inactive-text="禁用"
            active-color="#54A0FF"
            inactive-color="#B9B9B9"
            @change="changeSwitch(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header"> 操作 </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, tableData, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
    <el-dialog
      title="用户详情"
      :visible.sync="dialogFormVisible"
      @open="show()"
    >
      <el-form :model="form">
        <el-form-item label="name:" :label-width="formLabelWidth">
          <el-input
            v-model="form.name"
            ref="title"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" :label-width="formLabelWidth">
          <el-input
            type="email"
            v-model="form.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="个性签名:" :label-width="formLabelWidth">
          <el-input
            type="text"
            v-model="form.sign"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CanEdi()">取 消</el-button>
        <el-button type="primary" @click="ConMod()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //每页几条
      pageSize: 9,
      //几页
      total: 0,
      //当前页面
      currentPage: 1,
      tableData: [],
      search: "",
      form: [],
      formLabelWidth: "120",
      dialogFormVisible: false,
      loading:true
    };
  },
  methods: {
    //加载动画
    openFullScreen1() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },

    //取消编辑
    CanEdi() {
      this.dialogFormVisible = false;
      this.$message("取消编辑");
    },

    //删除
    del(id) {
      this.axios
        .post("/Article/DeleteUser", {
          id: id,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
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
        });

      this.dialogFormVisible = false;
    },
    //展示对话框方法
    show() {
      console.log(this);
    },
    //改变文章状态
    changeSwitch(row) {
      this.axios
        .post("/Article/UpdateUserState", {
          uid: row.id,
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
    getList() {
      this.flag = true;
      this.axios
        .post("/Article/List")
        .then((res) => {
          console.log(res);
          this.tableData = res.data;
        })
        .catch((err) => {
          console.log(err);
          this.flag = false;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleEdit(index, row) {
      console.log(index, row);
      //this.show()
      this.form = row;

      this.dialogFormVisible = true;
    },
    handleDelete(index, row, sr) {
      console.log(index, row, sr);
      //Article/DeleteUser

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
          console.log(sr.id);
          this.del(sr.id);
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
  },

  mounted() {
    this.getList();
    this.openFullScreen1();
  },
};
</script>

<style>
</style>
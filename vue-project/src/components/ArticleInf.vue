<template>
  <div>
    <el-table
      :data="
        tableData
          .filter(
            (data) =>
              !search ||
              data.articletitle.toLowerCase().includes(search.toLowerCase())
          )
          .slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      style="width: 100%"
    >
      <el-table-column label="#" prop="id"> </el-table-column>
      <el-table-column label="标题" prop="articletitle"> </el-table-column>
      <el-table-column label="举报人" prop="username"> </el-table-column>
      <el-table-column label="作者" prop="username2"> </el-table-column>
      <el-table-column label="举报内容" prop="infoContent">
        <template slot-scope="scope">
          <el-tag class="texthide" type="danger">{{
            scope.row.infoContent
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            @input="chaninput(scope.$index, scope.row, tableData)"
            placeholder="输入关键字搜索"
          />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >详 情</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >封 禁</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="tableData.length"
      style="float: right; margin-top: 15px"
    ></el-pagination>
    <el-dialog title="文章详情" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="举报内容" :label-width="formLabelWidth">
          <el-input v-model="form.infoContent" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.articletitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input v-html="form.article" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rul: "http://localhost:2021/Content/Image/user_cover.jpg",
      pageSize: 5, //每页多少条
      currentPage: 1, // 当前页
      tableData: [],
      search: "",
      form: {},
      formLabelWidth: "120",
      dialogFormVisible: false,
    };
  },
  methods: {
    chaninput(index, r, d) {
      console.log(index, r, d);
    },
    change(aid) {
      this.axios
        .post("/Article/UpdateArticleState", {
          aid: aid,
          state: 2,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    delInfo(id) {
      this.axios
        .post("/Article/DelInfo", {
          id: id,
        })
        .then((res) => {
          console.log(res);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getinfo() {
      this.axios
        .post("/Article/InfoList", {})
        .then((res) => {
          console.log(res);
          this.tableData = res.data.res;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.form = row;
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("您是否要封禁该文章?", "封禁", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((suc) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          console.log(suc);
          this.change(row.aid);
          this.delInfo(row.aid);
          this.getinfo();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      
    },
    // 每页多少条
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
  mounted() {
    this.getinfo();
  },
};
</script>

<style>
.texthide {
  overflow: hidden;
  width: 100px;
  text-overflow: ellipsis;

  white-space: nowrap;
}
</style>
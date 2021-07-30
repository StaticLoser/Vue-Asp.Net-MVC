<template>
  <div>
    <el-row v-if="show" id="addAdminRow">
      <el-button type="primary" icon="el-icon-plus" @click="AddAdmin()"
        >添加管理员</el-button
      >
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column align="center" label="Date" prop="create_at">
      </el-table-column>
      <el-table-column align="center" label="Name" prop="name">
      </el-table-column>
      <el-table-column align="center" label="管理员类型" prop="types">
      </el-table-column>
      <el-table-column align="center" v-if="show">
        <template slot="header"> 操作 </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编 辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加管理员" :visible.sync="dialogFormVisible1">
      <el-form :model="form">
        <el-form-item label="管理员名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.Password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="AddCheck(form.name, form.Password)"
          >添 加</el-button
        >
      </div>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible2">
      <el-form :model="inform">
        <el-form-item label="Name" :label-width="formLabelWidth">
          <el-input v-model="inform.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Password" :label-width="formLabelWidth">
          <el-input v-model="inform.Password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="false" label="info" :label-width="formLabelWidth">
          <el-input v-model="inform.id" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleChange(inform.name, inform.Password, inform.id)"
          >修 改</el-button
        >
        <el-button v-if="hideDel" type="danger" @click="handleDelete(inform.id)"
          >删 除</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      show: true,
      hideDel: true,
      form: {
        name: "",
        Password: "",
      },
      inform: [],
      formLabelWidth: "120",
      dialogFormVisible1: false,
      dialogFormVisible2: false,
    };
  },
  methods: {
    AddCheck(f1, f2) {
      if (f1.trim().length <= 0 && f2.trim().length <= 0) {
        console.log();
        return false;
      }

      this.axios
        .post("/Article/AddAdmin", {
          name: f1,
          Password: f2,
        })
        .then((response) => {
          console.log(response);
          console.log(f1, f2);
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.getlist();
        })
        .catch((error) => {
          console.log(error);
          this.$message.error("添加失败");
        });
      this.dialogFormVisible1 = false;

      console.log(this.form.name);
      console.log(this.form.Password);
    },

    AddAdmin() {
      this.dialogFormVisible1 = true;
      this.form = {};
    },

    getlist() {
      if (this.$cookie.get("Type") != 0) {
        this.show = false;
      } else {
        this.show = true;
      }
      this.axios
        .post("/Article/AdminList", {})
        .then((response) => {
          console.log(response);
          this.tableData = response.data;
          this.type = this.$route.params.obj.Type;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    handleChange(f1, f2, f3) {
      console.log(f1, f2, f3);
      //Article/UpdateAdmin
      this.axios
        .post("/Article/UpdateAdmin", {
          id: f3,
          adminName: f1,
          pass: f2,
        })
        .then((response) => {
          console.log(response);
          this.$message({
            message: "修改成功！",
            type: "success",
          });
          this.dialogFormVisible2 = false;
          this.inform = "";
        })
        .catch(function (error) {
          console.log(error);
          this.dialogFormVisible2 = false;
          this.inform = "";
        });
    },
    handleEdit(index, row) {
      if (row.typeid == 1) {
        this.hideDel = true;
        console.log(row.typeid);
      } else {
        this.hideDel = false;
        console.log("超级管理员");
      }

      console.log(index, row);
      this.dialogFormVisible2 = true;
      this.inform = row;
    },
    handleDelete(f1) {
      console.log(f1);
      this.axios
        .post("/Article/DelAdmin", {
          id: f1,
        })
        .then((response) => {
          console.log(response);
          this.$message({
            message: "成功！",
            type: "success",
          });
          this.dialogFormVisible2 = false;
          this.getlist();
        })
        .catch(function (error) {
          console.log(error);
          this.dialogFormVisible2 = false;
        });
    },
  },
  mounted() {
    this.getlist();
  },
  computed: {},
};
</script>

<style scoped>
#addAdminRow {
  margin-bottom: 15px;
}
</style>>
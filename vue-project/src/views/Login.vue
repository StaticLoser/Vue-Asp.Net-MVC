<template>
  <div id="loginBox">
    <h1 class="title">管理员登录</h1>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="zh">
        <el-input
          type="text"
          v-model="ruleForm.zh"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input
          type="password"
          v-model="ruleForm.pass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 0">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } 
      callback();
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      }
      callback();
    };
    return {
      ruleForm: {
        zh: "",
        pass: "",
      },
      rules: {
        zh: [{ validator: validatePass, trigger: "blur" }],
        pass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    goHome() {
      this.axios
        .post("/Article/AdminLogin", {
          adminName: this.ruleForm.zh,
          pass: this.ruleForm.pass,
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.$cookie.set("adminName", this.ruleForm.zh);
            this.$cookie.set("pass", this.ruleForm.pass);
            this.$cookie.set("Type", res.data.info.Type);
            this.$router.push("/");
          }
        })
        .catch(function (error) {
          console.log(error);
        });

      console.log(this.$route.path);
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
          //this.$router.push("/");
          this.goHome();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // goSearch: function () {
    //   let search_nick = this.search_value;
    //   if (search_nick !== 0) {
    //     this.$emit("submitForm", search_nick);
    //   }
    // },
    // enterSearchMember() {
    //   this.goSearch();
    // },
  },
  // created() {
  //   var lett = this;
  //   document.onkeydown = function (e) {
  //     console.log(e)
  //     var key = window.event.keyCode;
  //     if (key == 13) {
  //       lett.enterSearchMember();
  //     }
  //   };
  // },
};
</script>

<style>
.title {
  margin: 50px 0;
  margin-left: 0 !important ;
}

#loginBox {
  width: 50%;
  border: 1px solid #ccc;
  text-align: center;
  margin: 200px auto;
  padding: 0 20px;
}
</style>
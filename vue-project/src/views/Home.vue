<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        :router="true"
        background-color="#fff"
        text-color="#000"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="ic el-icon-reading"></i>
            <span slot="title">文章管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/ArticleStati">文章统计</el-menu-item>
            <el-menu-item index="/articleList">全部文章</el-menu-item>
            <el-menu-item index="/articleExam">待审文章</el-menu-item>
            <el-menu-item index="/articlePass">通过文章</el-menu-item>
            <el-menu-item index="/articleFailed">封禁文章</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="ic el-icon-user-solid"></i>
            <span slot="title">用户管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/UserStatistics">用户统计</el-menu-item>
            <el-menu-item index="/userList">用户管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="ic el-icon-warning"></i>
            <span slot="title">举报管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/ArticleInf">文章举报</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="ic el-icon-s-check"></i>
            <span slot="title">管理员管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/adminStati">管理员统计</el-menu-item>
            <el-menu-item index="/adminList">管理员管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header id="top">
        <el-dropdown
          trigger="click"
          style="margin-right: 10px"
          @command="removeCookie"
        >
          <span class="el-dropdown-link">
            {{ adminName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="removeCookie">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      flag: false,
      isCollapse: false,
      tableData: [],
      adminName: this.$cookie.get("adminName"),
    };
  },
  methods: {
    //删除cookie
    removeCookie() {
      console.log("niude ");
      this.$cookie.remove("adminName");
      this.$cookie.remove("pass");
      this.$cookie.remove("Type");
      this.$router.replace("/Login");
    },

    getList() {
      this.flag = true;
      this.axios
        .post("/Article/GetList")
        .then((res) => {
          this.tableData = res.data.list;
          this.flag = false;
        })
        .catch((err) => {
          console.log(err);
          this.flag = false;
        });
    },

    getcookie() {},
  },
  mounted() {},
};
</script>

<style>
#top {
  text-align: right;
}

.el-container {
  height: auto;
  flex: 1;
}

.ic,
.el-icon-arrow-down:before {
  color: #000 !important;
}

.el-menu {
  background: #000;
  /* color: #fff; */
}
.el-header,
.el-footer {
  background-color: #6495ed;
  color: #fff;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #fff;
  color: #fff;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  width: 100%;
  /* min-height: 900px; */
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
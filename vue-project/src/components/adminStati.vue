<template>
   <div
    id="myChart"
    theme="dark"
    :style="{ width: '1500px', height: '500px' }"
  ></div>
</template>

<script>
export default {
  name: "hello",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",     
    };
  },
  mounted() {
    this.drawLine();
    this.getNum();
  },
  methods: {
    drawLine() {
      this.axios
        .post("/Article/AdminEchars", {})
        .then((response) => {
          console.log(response);
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById("myChart"));
          this.getNum();
          // 绘制图表
          myChart.setOption({
            tooltip: {
              trigger: "item",
            },
            title: {
              text: "全站统计",
              subtext: response.data.Count+"名管理员",
              left: "left",
            },
            legend: {
              top: "5%",
              left: "center",
            },
            series: [
              {
                name: "管理员类型",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: "center",
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: "40",
                    fontWeight: "bold",
                  },
                },
                labelLine: {
                  show: false,
                },
                data: response.data.list,
              },
            ],
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    getNum() {
      //Article/GetArticleStaticle
    },
  },
};
</script>

<style>

</style>
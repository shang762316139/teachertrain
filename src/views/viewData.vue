<!--
* @description 
* @fileName viewData.vue
* @author shang
* @date 2022/11/26 12:30:29
!-->
<template>
  <div class="viewData">
    <div class="viewData-top">
      <div class="viewData-top-l">查看数据</div>
      <div class="viewData-top-m">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-input
              v-model="formTop[0].content"
              placeholder="请输入活动名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="formTop[1].content"
              type="date"
              placeholder="请选择参加时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="formTop[2].option.value"
              placeholder="请选择是否获得证书"
            >
              <el-option
                :label="item.label"
                :value="item.label"
                v-for="(item, index) in formTop[2].option.activeList"
                :key="index"
                >{{ item.label }}</el-option
              >
            </el-select>
          </el-form-item>
          <el-button type="primary" class="chaxun">查询</el-button>
          <el-button class="chuangjian">重置</el-button>
        </el-form>
      </div>
      <div class="viewData-top-r">
        <el-button type="primary">导出学习记录</el-button>
        <el-button type="primary">下载证书</el-button>
      </div>
    </div>
    <div class="viewData-bottom">
      <div class="viewData-bottom-one">营参人数100，实参人数30</div>
      <div class="viewData-bottom-two">
        <div class="pie-one pie-joint"></div>
        <div class="pie-two pie-joint"></div>
        <div class="pie-three pie-joint"></div>
        <div class="pie-four pie-joint"></div>
      </div>
    </div>
    <div class="viewData-three">
      <el-table
        class="elTable"
        :data="tableData"
        :header-cell-style="{
          color: '#000000',
          border: '1px solid #333',
          fontWeight: '400',
          borderRight: 'none',
          borderTop: 'none',
          textAlign: 'center',
          lineHeight: '0',
        }"
        :cell-style="finalCellStyle"
        border
        style="width: 100%"
        :default-sort="{}"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" label="序号" width="100px">
        </el-table-column>

        <el-table-column
          v-for="(item, i) in tableColumn"
          :key="i"
          class-name="tablecolumn"
          width="180px"
          :prop="item.dataIndex"
          :label="item.title"
          :sortable="
            item.title == '已完成课程节数' ||
            item.title == '累计学习时长' ||
            item.title == '试题得分'
              ? true
              : false
          "
        >
          <!-- <template slot-scope="scope">
            <span v-if="true">{{
              finishedCourse(scope.row[item.dataIndex])
            }}</span>
            <span v-else>{{ scope.row[item.dataIndex] }}</span>
            <div>{{finishedCourse()}}</div> 
             <div v-if="scope.row.finishedCourse == 'null'">-</div>
            <div v-else>{{ scope.row.finishedCourse }}</div>
          </template> -->
        </el-table-column>

        <!-- 是否获得证书 -->
        <el-table-column class-name="cell2" label="是否获得证书 " width="180px">
          <template slot-scope="scope">
            <!-- 已获得证书 -->
            <div v-if="scope.row.type == '002'">
              {{ scope.row.certificate }}
            </div>
            <!-- 未获得证书 -->
            <div v-if="scope.row.type == '001'">
              {{ scope.row.certificate }}
            </div>
            <!-- 不需要证书的 -->
            <div v-if="scope.row.type == '003'">-</div>
          </template>
        </el-table-column>
        <!-- 证书类型 -->
        <el-table-column class-name="cell2" label="证书类型 " width="180px">
          <template slot-scope="scope">
            <!-- 有证书编号 -->
            <div v-if="scope.row.versionType == '02'">纸质证书</div>
            <div v-if="scope.row.versionType == '01'">电子证书</div>
            <!-- 没有证书编号 -->
            <div v-if="scope.row.type == '003' || scope.row.type == '001'">
              -
            </div>
          </template>
        </el-table-column>
        <!-- 证书编码 -->
        <el-table-column class-name="cell2" label="证书编码 " width="180px">
          <template slot-scope="scope">
            <!-- 有证书编码 -->
            <div>
              {{ scope.row.certificateNumber }}
            </div>
            <!-- 没证书编码 -->
            <div v-if="scope.row.type == '003' || scope.row.type == '001'">
              -
            </div>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column class-name="cell2" label="操作 " width="180px">
          <template>
            <el-button type="text"> 下载证书 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      formTop: [
        {
          label: "查询",
          content: "",
        },
        {
          label: "查询",
          content: "",
        },
        {
          option: {
            label: "活动状态",
            content: "",
            value: "",
            activeList: [
              { id: "1", label: "全部" },
              { id: "2", label: "已上线" },
              { id: "3", label: "已下线" },
            ],
          },
        },
      ],
      // 饼状图数据

      // table表格数据
      tableData: [],
      tableDataCopy: [],
      tableColumn: [],
      // 点击查看数据得到某一行数据
      everyData: {},
    };
  },
  components: {},

  computed: {},

  //mounted: {},
  mounted() {
    this.initData1();
    this.initData2();
    this.initTableData();
  },

  methods: {
    initData1() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.querySelector(".pie-one"));
      console.log(document.querySelector(".pie-one"), "myChart");
      // 绘制图表
      myChart.setOption({
        stillShowZeroSum: false,
        // backgroundColor: "#fff",
        color: ["#fff", "#fff"],
        series: [
          {
            type: "pie",
            stillShowZeroSum: false,
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontWeight: 400,
                  fontSize: 12, // 文字的字体大小
                  color: "rgb(69, 69, 69)",
                },

                position: "inner", // 数值显示在内部
                formatter: "{b}: {c} ", // 格式化数值百分比输出
              },
            },
            //圆圈边框
            itemStyle: { borderColor: "rgb(69, 69, 69)" },
            // 鼠标移上去的item不会凸出了
            hoverAnimation: false,
            data: [
              {
                value: 45,
                name: "未参与人数",
              },
              {
                value: 420,
                name: "实际参与人数",
              },
            ],
            // radius: "40%",
          },
        ],
      });
    },
    initData2() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.querySelector(".pie-two"));
      console.log(document.querySelector(".pie-two"), "myChart");
      // 绘制图表
      myChart.setOption({
        stillShowZeroSum: false,
        // backgroundColor: "#fff",
        color: ["#fff", "#fff"],
        series: [
          {
            type: "pie",
            stillShowZeroSum: false,
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontWeight: 400,
                  fontSize: 12, // 文字的字体大小
                  color: "rgb(69, 69, 69)",
                },
                // label不显示省略号
                overflow: "none",
                position: "inner", // 数值显示在内部
                // formatter: "{b}\n  占比{d}%", // 设置标签格式, // 格式化数值百分比输出
                formatter: function (data) {
                  console.log(data, "data");
                  return data.name + "\n占比" + data.percent.toFixed(1) + "%)";
                },
              },
            },
            labelLine: {
              lineStyle: {
                color: "rgb(69, 69, 69)",
              },
            },
            //圆圈边框
            itemStyle: { borderColor: "rgb(69, 69, 69)" },
            // 鼠标移上去的item不会凸出了
            hoverAnimation: false,
            data: [
              {
                value: 80,
                name: "80人正在学习中",
              },
              {
                value: 410,
                name: "410人完成所有课程学习",
              },
              {
                value: 10,
                name: "10人未参与学习",
              },
            ],
            // radius: "40%",
          },
        ],
      });
    },
    // 表格
    // 初始化请求数据
    initTableData() {
      // table表格数据
      const tableData = [
        {
          num: 1,
          type: "002", //获得证书类型
          versionType: "02", //纸质版类型
          teacherName: "亚亚",
          account: "1990123",
          phone: "1234567",
          area: "荥阳",
          school: "荥阳一中",
          joinTime: "2022-22-27 9:30",
          finishedCourse: [{ score: "null", dataIndex: "" }],
          totalTime: "12时34分钟30秒",
          testScores: "12",
          examTimes: "40分50秒",
          certificate: "已获得证书",
          certificateType: "纸质证书",
          certificateNumber: "35033",
        },
        {
          num: 2,
          type: "001", //未获得证书类型
          teacherName: "盼盼",
          account: "1990123",
          phone: "1234567",
          area: "荥阳",
          school: "荥阳一中",
          joinTime: "2022-22-27 9:30",
          finishedCourse: [{ score: "4/5", dataIndex: "" }],
          totalTime: "11时34分钟30秒",
          testScores: "15",
          examTimes: "40分20秒",
          certificate: "未获得证书",
          // certificateType: "纸质证书",
          // certificateNumber: "99033",
        },
        {
          num: 3,
          type: "002", //已获得证书类型
          versionType: "01", //电子版类型
          teacherName: "壮壮",
          account: "1990123",
          phone: "1234567",
          area: "荥阳",
          school: "荥阳一中",
          joinTime: "2022-22-27 9:30",
          finishedCourse: [{ score: "6/77", dataIndex: "" }],
          totalTime: "9时34分钟30秒",
          testScores: "3",
          examTimes: "40分20秒",
          certificate: "已获得证书",
          certificateType: "电子证书",
          certificateNumber: "22033",
        },
        {
          num: 4,
          type: "003", //不需要证书类型
          teacherName: "跳跳",
          account: "1990123",
          phone: "1234567",
          area: "荥阳",
          school: "荥阳一中",
          joinTime: "2022-22-27 9:30",
          finishedCourse: [{ score: "4/55", dataIndex: "" }],
          totalTime: "5时34分钟30秒",
          testScores: "6",
          examTimes: "40分20秒",
          // certificate: "已获得证书",
          // certificateType: "纸质证书",
          // certificateNumber: "22088",
        },
      ];
      this.tableData = tableData;
      this.tableDataCopy = this.tableData;
      const tableColumn = [
        { title: "教师名称", dataIndex: "teacherName" },
        { title: "账号", dataIndex: "account" },
        { title: "手机号", dataIndex: "phone" },
        { title: "所属区域", dataIndex: "area" },
        { title: "所属学校", dataIndex: "school" },
        { title: "参加时间", dataIndex: "joinTime" },
        {
          title: "已完成课程节数",
          dataIndex: "finishedCourse",
          // key: "finishedCourse",
          // finishedCourse: [{ score: 7 / 35 }],
        },
        { title: "累计学习时长", dataIndex: "totalTime" },
        { title: "试题得分", dataIndex: "testScores" },
        { title: "考试用时", dataIndex: "examTimes" },
        // { title: "是否获得证书", dataIndex: "certificate", key: "certificate" },
        // {
        //   title: "证书类型",
        //   dataIndex: "certificateType",
        //   key: "certificateType",
        // },
        // {
        //   title: "证书编号",
        //   dataIndex: "certificateNumber",
        //   key: "certificateNumber",
        // },
        // { title: "活动数据", dataIndex: "activeData", key: "activeData" },
      ];
      this.tableColumn = tableColumn;
    },

    finalCellStyle({ row, columnIndex }) {
      console.log(row, "row");
      // console.log(column, "column");
      let style = {
        border: "1px solid #333",
        borderRight: "none",
        borderTop: "none",
        textAlign: "center",
        background: "#fff",
      };
      console.log(columnIndex, "columnIndex");
      if (
        (row.certificate == "已获得证书" && columnIndex === 12) ||
        (columnIndex === 14 && row.certificateNumber)
      ) {
        return {
          color: "green",
          textAlign: "center",
          borderLeft: "1px solid #333",
          borderBottom: "1px solid #333",
        };
      } else if (row.certificate == "未获得证书" && columnIndex === 12) {
        return {
          color: "red",
          textAlign: "center",
          borderLeft: "1px solid #333",
          borderBottom: "1px solid #333",
        };
      }
      if (columnIndex === 8 || columnIndex === 10 || columnIndex === 15) {
        return {
          color: "blue",
          textAlign: "center",
          borderLeft: "1px solid #333",
          borderBottom: "1px solid #333",
        };
      }

      return style;
    },
    finishedCourse(c) {
      console.log(c, "cccc");
    },
  },
};
</script>
<style lang='scss' scoped>
.viewData {
  .viewData-top {
    border: 1px solid rgb(69, 69, 69);
    display: flex;
    position: relative;
    background: #fff;
    .viewData-top-l {
      width: 91px;
      height: 55px;
      border: 1px solid red;
      padding-top: 29px;
      box-sizing: border-box;
      font-size: 20px;
      font-weight: 600;
    }
    .viewData-top-m {
      margin: 0 30px;
      .el-form {
        display: flex;
        width: 100%;
        border: 1px solid red;
        height: 43px;
        margin-bottom: 40px;

        .chaxun {
          height: 38px;
        }
        .chuangjian {
          height: 38px;
        }
        .el-form-item {
          display: flex;
          border: 1px solid blue;
          min-width: 180px;
          height: 43px;
          // ::v-deep .el-input__inner {
          //   height: 30px;
          // }
          ::v-deep .el-range__icon {
            display: none;
          }
          ::v-deep .el-range-separator {
            display: none;
          }
          ::v-deep .el-form-item__content {
            // min-width: 10%;
            border: 1px solid red;
          }
          ::v-deep .el-range-editor.el-input__inner {
            min-width: 180px;
          }
        }
        .end-form-item {
          margin-right: 0;
        }
      }
    }
    .viewData-top-r {
      position: absolute;
      top: 0;
      right: 0;
      border: 1px solid forestgreen;
      ::v-deep .el-button--primary {
        background-color: rgb(21, 162, 237);
      }
    }
  }
  .viewData-bottom {
    background-color: #eee;
    min-height: 50px;
    padding: 20px;
    .viewData-bottom-one {
      text-align: left;
    }
    .viewData-bottom-two {
      min-height: 250px;
      border: 1px solid sienna;
      display: flex;
      justify-content: space-around;
      .pie-joint {
        width: 260px;
        height: 260px;
        border: 1px solid red;
      }
    }
  }
  .viewData-three {
    background-color: #eee;

    padding: 20px;
    .elTable {
      border: 1px solid #333;
      border-left: 0;
      .el-table__cell {
        .cell {
          button {
            margin-right: 8px;
            color: blue;
          }
        }
      }
    }
  }
}
</style>
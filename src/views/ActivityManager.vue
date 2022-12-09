<!--
* @description 
* @fileName ActivityManager.vue
* @author shang
* @date 2022/11/25 14:02:39
!-->
<template>
  <div class="manager">
    <div class="manager-top">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="活动:">
          <el-input
            v-model="formTop[0].content"
            placeholder="请输入活动名称"
            @change="inpChange"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动时间:">
          <el-date-picker
            v-model="formTop[1].content"
            style="width: 250px"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="pickerChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select
            v-model="formTop[2].option.value"
            placeholder="活动区域"
            @change="selectChange"
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

        <el-button
          type="primary"
          class="chaxun"
          @click="inquireHandle(filterData)"
          >查询</el-button
        >

        <el-button type="primary" class="chuangjian" @click="creatActivities"
          >创建活动</el-button
        >
      </el-form>
    </div>
    <!-- table表格 -->
    <div class="manager-table">
      <el-table
        class="elTable"
        :data="tableData"
        :header-cell-style="{
          color: '#000000',

          fontWeight: '400',

          background: '#eee',
          textAlign: 'center',
          lineHeight: '0',
        }"
        :cell-style="finalCellStyle"
        border
        style="width: 100%"
      >
        <el-table-column
          class-name="tablecolumn"
          width="180px"
          v-for="(item, index) in tableColumn"
          :prop="item.key"
          :label="item.title"
          :key="index"
        >
        </el-table-column>
        <!-- 活动数据 -->
        <el-table-column label="活动数据 " width="180px">
          <template slot-scope="scope">
            <div @click="lookHandle(scope.$index, scope.row)">查看数据</div>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column class-name="cell2" label="操作 ">
          <template slot-scope="scope">
            <el-button type="text" @click="revampActivities(scope.row)">
              修改活动
            </el-button>
            <el-button type="text" @click="addTest(scope.row)">
              添加试题
            </el-button>
            <el-button type="text"> 添加课程 </el-button>
            <el-button type="text"> 设置证书 </el-button>
            <el-button
              type="text"
              :style="{
                color: scope.row.operation.type == '2' ? 'red' : 'green',
              }"
              @click="statesBtn(scope.row)"
            >
              {{ scope.row.operation.state }}
              <!-- {{ scope.row.states == "已上线" ? "下线" : "上线" }} -->
            </el-button>

            <el-button type="text"> 复制链接 </el-button>
            <el-button type="text"> 预览 </el-button>
            <el-button
              type="text"
              style="color: #333"
              @click="delRowBtn(scope.row.key)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Bus from "../assets/js/eventBus.js";
export default {
  data() {
    return {
      formTop: [
        {
          label: "查询",
          content: "",
        },
        {
          label: "活动时间",
          content: "",
        },
        {
          option: {
            label: "活动状态",
            content: "",
            value: "全部",
            activeList: [
              { id: "1", label: "全部" },
              { id: "2", label: "已上线" },
              { id: "3", label: "已下线" },
            ],
          },
        },
      ],
      filterData: {},
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
  created() {
    this.initTableData();
    console.log(this.tableData);
    this.selectChange(this.formTop[2].option.value);
  },
  //mounted: {},

  methods: {
    // 初始化请求数据
    initTableData() {
      // table表格数据
      const tableData = JSON.parse(localStorage.getItem("totalData"));

      // const tableData = [
      //   {
      //     key: "001",
      //     type: "01",
      //     activeTitle: "金水区教师培训活动",
      //     roles: "班主任",
      //     states: "已上线",
      //     times: "2022-10-12--2022-10-22",
      //     activeData: "查看数据",
      //     operation: {
      //       type: 2,
      //       state: "下线",
      //     }, //操作
      //   },
      //   {
      //     key: "002",
      //     type: "02",
      //     activeTitle: "中原区教师培训活动",
      //     roles: "数学老师",
      //     states: "已下线",
      //     times: "2022-8-12--2022-9-22",
      //     activeData: "查看数据",
      //     operation: {
      //       type: 1,
      //       state: "上线",
      //     },

      //     //操作
      //   },
      // ];
      this.tableData = tableData;
      console.log(this.tableData, "this.tableData-vvv");
      this.tableDataCopy = this.tableData;
      const tableColumn = [
        { title: "活动名称", dataIndex: "activeTitle", key: "activeTitle" },
        { title: "角色", dataIndex: "roles", key: "roles" },
        { title: "活动状态", dataIndex: "states", key: "states" },
        { title: "起止时间", dataIndex: "times", key: "times" },
        // { title: "活动数据", dataIndex: "activeData", key: "activeData" },
      ];
      this.tableColumn = tableColumn;
    },
    inpChange(val) {
      console.log(val, "n");
      this.filterData.activeTitle = val;
    },
    pickerChange(val) {
      console.log(val, "b");
      this.filterData.times = val;
    },
    selectChange(val) {
      console.log(val, "m");
      this.filterData.states = val;
    },
    // 复制tableData数据
    // copyData() {
    //   const tableDataCopy = this.tableData;
    //   return tableDataCopy;
    // },
    // 查询按钮
    inquireHandle(val) {
      // this.initTableData();
      console.log(val, "v");
      // 调接口取数据
      this.tableData = [
        {
          key: "003",
          activeTitle: "高新区教师培训活动",
          roles: "数学",
          states: "已上线",
          times: "2022-10-12--2022-10-22",
          activeData: "查看数据",
          //operation: ["上线", "下线"], //操作
        },
      ];
      // const newtableData = [];
      // this.tableDataCopy.forEach((item) => {
      //   if (item.states.indexOf(val.states) > -1) {
      //     newtableData.push({ ...item });
      //     this.tableData = newtableData;
      //   }
      // });
    },
    finalCellStyle({ row, columnIndex }) {
      console.log(row, "row");
      let style = {
        textAlign: "center",
        background: "#fff",
      };
      console.log(columnIndex, "columnIndex");
      if (columnIndex === 4 || columnIndex === 5) {
        return {
          color: "blue",
          textAlign: "center",
        };
      }

      return style;
    },
    lookHandle(i, row) {
      console.log(i, row, "i/row");
      // 拿到改行的数据,并把这条数据传给viewData.vue
      this.everyData = row;
      this.$router.push({ name: "viewData", query: { id: i + 1 } });
    },
    // creatActivities(v) {
    //   console.log(v, "mmmm----vvvv");
    //   this.$router.push({ name: "creatActivities" });
    // },
    addTest(v) {
      console.log(v.getAddTest, "v----vvv1111");
      console.log(v, "v----vvv2222222");
      if (v.getAddTest) {
        setTimeout(() => {
          Bus.$emit("addTest", v.getAddTest);
          console.log(v.getAddTest, "11");
        }, 100);
      }
      this.$router.push({ name: "addTest", query: { id: v.key } });
    },
    revampActivities(v) {
      setTimeout(() => {
        Bus.$emit("Activities", v);
        console.log(v, "11");
      }, 100);
      this.$router.push({ name: "creatActivities" });
    },
    creatActivities() {
      this.$router.push({ name: "creatActivities" });
    },
    statesBtn(v) {
      if (v.operation.type == "2") {
        console.log(v, "kkkkkkkkkkkkkk");
        v.states = "已下线";
        v.operation.type = "1";
        v.operation.state = "上线";
      } else {
        console.log(v, "hhhhhhhhhhhhhh");
        v.states = "已上线";
        v.operation.type = "2";
        v.operation.state = "下线";
      }
    },
    delRowBtn(v) {
      this.tableData = this.tableData.filter((item) => item.key != v);
      localStorage.setItem("totalData", JSON.stringify(this.tableData));
    },
  },
};
</script>
<style lang='scss' scoped>
.manager {
  margin-left: 30px;
  border: 1px solid red;
  background: #fff;
  .manager-top {
    display: flex;
    margin-top: 20px;
    .el-form {
      display: flex;
      width: 100%;
      border: 1px solid red;
      height: 43px;
      margin-bottom: 40px;
      position: relative;
      .chaxun {
        height: 38px;
      }
      .chuangjian {
        height: 38px;
        margin-left: 70px;
        position: absolute;
        right: 0;
        top: 0;
      }
      .el-form-item {
        display: flex;
        border: 1px solid blue;
        min-width: 250px;
        height: 43px;
        ::v-deep .el-form-item__label {
          min-width: 32px;
          border: 1px solid red;
          white-space: nowrap;
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
  // 表格样式
  .manager-table {
    // border: 1px solid #333;
    // border-left: 0;
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
</style>
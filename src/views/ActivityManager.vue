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
            <el-button type="text" @click="setCredential(scope.row)">
              设置证书
            </el-button>

            <!-- 设置证书弹框 -->
            <el-dialog
              title="设置证书"
              :visible.sync="credentialShow"
              @close="dialogClose"
            >
              <el-form :model="dialogForm">
                <el-form-item label="是否发放证书:" required>
                  <el-radio-group v-model="dialogForm.radio" @change="provide">
                    <el-radio
                      :label="item.type"
                      v-for="item in dialogForm.radioList"
                      :key="item.type"
                      >{{ item.title }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
                <div v-show="dialogForm.radio == '1'">
                  <el-form-item label="选择证书类型:" required>
                    <el-radio-group
                      v-model="dialogForm.typeRadio"
                      @change="selectionType"
                    >
                      <el-radio
                        :label="item.type"
                        v-for="item in dialogForm.typeRadioList"
                        :key="item.type"
                        >{{ item.title }}</el-radio
                      >
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="证书发放时间:"
                    :required="dialogForm.typeRadio == '1'"
                  >
                    <el-date-picker
                      v-model="dialogForm.provideStartTime"
                      type="date"
                      placeholder="开始时间"
                      value-format="yyyy-MM-dd"
                      prefix-icon=""
                      @change="startTime"
                    >
                    </el-date-picker>
                    <el-date-picker
                      v-model="dialogForm.provideEndTime"
                      type="date"
                      placeholder="结束时间"
                      value-format="yyyy-MM-dd"
                      @change="EndTime"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <div v-show="dialogForm.typeRadio == '1'">
                    <el-form-item
                      label="证书编号:"
                      required
                      class="serialNumber"
                    >
                      <el-input
                        v-model="dialogForm.serialNumber"
                        @change="serialChange"
                      ></el-input>
                      <div>
                        说明:统一默认证书编号前缀 , 后边由用户账号后六位组成;
                      </div>
                    </el-form-item>
                    <el-form-item
                      label="设置证书内容:"
                      class="content"
                      required
                    >
                      <!-- <el-input v-model="dialogForm.desc" type="textarea"></el-input> -->
                      <div class="contentBox">
                        <div class="contentBoxTop">
                          <input v-model="dialogForm.credentialContent.title" />
                          <span>老师:</span>
                        </div>
                        <div class="contentBoxBottom">
                          和酷酷酷酷酷酷酷酷酷酷酷酷酷酷酷酷酷酷
                          <!-- <textarea
                      type="text"
                      v-model="dialogForm.credentialContent.content"
                    ></textarea> -->
                          <el-input
                            type="textarea"
                            v-model="dialogForm.credentialContent.content"
                          ></el-input>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="cancelClick(scope.row)">取 消</el-button>
                <el-button type="primary" @click="finishClick(scope.row)"
                  >完成</el-button
                >
              </div>
            </el-dialog>

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
      // 设置证书弹框是否显示
      credentialShow: false,
      dialogForm: {
        radio: "2",
        radioList: [
          {
            type: "1",
            title: "是",
          },
          {
            type: "2",
            title: "否",
          },
        ],
        typeRadio: "",
        typeRadioList: [
          {
            type: "1",
            title: "电子证书",
          },
          {
            type: "2",
            title: "纸质证书",
          },
        ],
        provideStartTime: "",
        provideEndTime: "",
        serialNumber: "",
        desc: "",
        credentialContent: {
          title: "",
          content: "",
        },
      },
      //要存起来的
      existDialogForm: {},
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
      // console.log(v.getAddTest, "v----vvv1111");
      console.log(v, "v----vvv2222222");
      if (v.getAddTest) {
        setTimeout(() => {
          Bus.$emit("addTest", v.getAddTest.addStestData);
          console.log(v.getAddTest.addStestData, "11");
        }, 100);
        this.$router.push({ name: "addTest", query: { id: v.key } });
      } else {
        this.$router.push({ name: "addTest", query: { id: v.key } });
      }
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
        const gettotalData = JSON.parse(localStorage.getItem("totalData"));
        const filterArr = gettotalData.filter((item) => item.key == v.key);
        filterArr[0].states = v.states;
        filterArr[0].operation.type = v.operation.type;
        filterArr[0].operation.state = v.operation.state;
        localStorage.setItem("totalData", JSON.stringify(gettotalData));
      } else {
        console.log(v, "hhhhhhhhhhhhhh");
        v.states = "已上线";
        v.operation.type = "2";
        v.operation.state = "下线";
      }
      const gettotalData = JSON.parse(localStorage.getItem("totalData"));
      const filterArr = gettotalData.filter((item) => item.key == v.key);
      filterArr[0].states = v.states;
      filterArr[0].operation.type = v.operation.type;
      filterArr[0].operation.state = v.operation.state;
      localStorage.setItem("totalData", JSON.stringify(gettotalData));
    },
    delRowBtn(v) {
      this.tableData = this.tableData.filter((item) => item.key != v);
      localStorage.setItem("totalData", JSON.stringify(this.tableData));
    },
    dialogClose() {
      console.log("dialogClose");
    },
    setCredential(v) {
      console.log(v, "ccc1");
      this.credentialShow = true;
      console.log(this.dialogForm.radio, "v//v");
      this.existDialogForm.radio = this.dialogForm.radio;
      console.log(this.existDialogForm.radio, "mm-pp11");
      this.existDialogForm.type = v.key;
    },
    provide(v) {
      this.existDialogForm.radio = v;
      console.log(this.existDialogForm.radio, "mm-pp");
    },
    selectionType(v) {
      this.existDialogForm.typeRadio = v;
    },
    startTime(v) {
      console.log(v, "v---v");
      this.existDialogForm.provideStartTime = v;
    },
    EndTime(v) {
      this.existDialogForm.provideEndTime = v;
    },
    serialChange(v) {
      this.existDialogForm.serialNumber = v;
    },
    finishClick() {
      // console.log(v, "ccc");
      const gettotalData = JSON.parse(localStorage.getItem("totalData"));
      const filterArr = gettotalData.filter(
        (item) => item.key == this.existDialogForm.type
      );
      filterArr[0].DialogForm = this.existDialogForm;
      localStorage.setItem("totalData", JSON.stringify(gettotalData));
      this.credentialShow = false;
    },
    cancelClick(v) {
      console.log(v, "ccc3");
      this.credentialShow = false;
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
      // border: 1px solid red;
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
        // border: 1px solid blue;
        min-width: 250px;
        height: 43px;
        ::v-deep .el-form-item__label {
          min-width: 32px;
          // border: 1px solid red;
          white-space: nowrap;
        }
        ::v-deep .el-form-item__content {
          // min-width: 10%;
          // border: 1px solid red;
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
    ::v-deep .el-table_1_column_5 {
      cursor: pointer;
    }
    ::v-deep .el-dialog {
      width: 70%;
      .el-dialog__header {
        background: #eee;

        .el-dialog__title {
          font-weight: 700;
        }
        .el-dialog__headerbtn {
          font-size: 30px;
          font-weight: 700;
          .el-dialog__close {
            color: #000;
          }
        }
      }
      .el-dialog__body {
        background: #eee;

        .el-form {
          display: flex;
          flex-direction: column;
          align-items: start;
          .el-form-item {
            display: flex;
            .el-date-editor {
              width: 170px;
              .el-input__inner {
                width: 140px;
                height: 30px;
                // border: 1px solid #333;
                color: #333;
              }
            }
          }
          .serialNumber {
            .el-form-item__content {
              display: flex;
              .el-input {
                width: 250px;
                margin-right: 16px;
              }
            }
          }

          .content {
            // .el-form-item__content {
            //   .el-textarea {
            //     width: 700px;
            //     .el-textarea__inner {
            //       padding: 10px 40px;
            //     }
            //   }
            // }
            .contentBox {
              border: 1px solid red;
              height: 400px;
              width: 800px;
              display: flex;
              flex-direction: column;
              align-items: start;
              padding: 10px 30px;
              overflow-y: scroll;
              .contentBoxTop {
                font-weight: 700;
                margin-bottom: 20px;
                input {
                  border: 0;
                  border-bottom: 1px solid red;
                  background: #eee;
                  text-align: center;
                  width: 50px;
                  height: 16px;
                  outline: none;
                }
              }
              .contentBoxBottom {
                border: 1px solid forestgreen;
                width: 100%;
                min-height: 30px;
                input {
                  display: block;
                  border: 0;
                  width: 700px;
                  min-height: 30px;
                  // height: 100%;
                  background: #eee;
                  // text-align: center;
                  outline: none;
                  // word-wrap: normal;
                  white-space: pre-wrap;
                }
              }
            }
          }
        }
      }
      .el-dialog__footer {
        display: flex;
        justify-content: center;
        background: #eee;

        //   .el-button {
        //     width: 130px;
        //     margin-right: 20px;
        //   }
      }
    }
  }
}
</style>
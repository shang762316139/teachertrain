<!--
* @description 
* @fileName addTest .vue
* @author shang
* @date 2022/11/27 21:55:13
!-->
<template>
  <div class="addTest">
    <div class="addTest-top">
      <el-form :rules="rules">
        <el-form-item label="选择内容" prop="topRules">
          <el-button type="primary" @click="addDialog">添加试题</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="addTest-middle">
      <div class="addTest-middle-one">
        共选择{{ this.addtableData.length ? this.addtableData.length : 0 }}题
        &nbsp;&nbsp;&nbsp;总计{{ this.totalScore }}分
      </div>
      <!-- table列表 -->
      <div class="addTest-table" v-show="isAddshow">
        <el-table
          class="elTable"
          :data="addtableData"
          row-key="key"
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
          :expand-row-keys="expands"
          @row-click="clickRowHandle"
        >
          <el-table-column width="55" type="expand">
            <!-- 展开项 -->
            <!-- <template slot-scope="scope">
              <div style="padding-left: 60px">
                <div>
                  <h2 style="font-size: 14px">备注</h2>
                  <div>{{ scope.row.description || "暂无备注" }}</div>
                </div>
              </div>
            
            </template> -->
            <template>
              <el-form label-position="left" class="demo-table-expand">
                <el-form-item label="商品名称">
                  <span> 商品名称</span>
                </el-form-item>
                <el-form-item label="所属店铺">
                  <span>所属店铺商品描述是地方还是收到弗兰克</span>
                </el-form-item>
                <el-form-item label="商品 ID">
                  <span>商品 ID</span>
                </el-form-item>
                <el-form-item label="店铺 ID">
                  <span>店铺 ID</span>
                </el-form-item>
                <el-form-item label="商品分类">
                  <span>商品分类</span>
                </el-form-item>
                <el-form-item label="店铺地址">
                  <span>店铺地址</span>
                </el-form-item>
                <el-form-item label="商品描述">
                  <span>商品描述</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            class-name="tablecolumn"
            v-for="item in addtableColumn"
            :prop="item.key"
            :label="item.title"
            :key="item.key"
            :min-width="item.title == '题干' ? '280px' : '100px'"
          >
          </el-table-column>

          <!-- 操作 -->
          <el-table-column class-name="cell2" label="操作 ">
            <template slot-scope="scope">
              <el-button type="text"> 编辑 </el-button>
              <el-button type="text" @click="delTableData(scope.row.testId)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 列表提示 -->
      <div class="addTest-hint" v-show="!isAddshow">
        请点击【添加试题】挑选试题
      </div>
      <!-- 添加试题弹框 -->
      <el-dialog
        title="选择试题"
        :visible.sync="dialogTableVisible"
        :before-close="cancelDialog"
      >
        <!-- form表单 -->
        <div class="addTest-form">
          <el-form :inline="true" :model="addTestForm" class="demo-form-inline">
            <el-form-item label="查询条件:">
              <el-input
                type="number"
                placeholder="请输入分值范围"
                v-model="addTestForm.score"
                controls-position="right"
                :min="1"
                :max="10"
              ></el-input>
              <el-select
                v-model="addTestForm.pattern.patternItem"
                placeholder="题型"
              >
                <el-option
                  :value="item.patternItem"
                  v-for="(item, i) in addTestForm.pattern"
                  :key="i"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button>重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- table表格 -->
        <div>
          <div class="addTest-middle-one">
            共选择{{
              this.addtableData.length ? this.addtableData.length : 0
            }}题 &nbsp;&nbsp;&nbsp;总计{{ this.totalScore }}分
          </div>
          <!-- table列表 -->
          <div class="addTest-table">
            <el-table
              class="elTable"
              :data="tableData"
              row-key="key"
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
              :expand-row-keys="expands"
              @row-click="clickRowHandle"
              @selection-change="changeSelectTest"
              ref="multipleTable"
            >
              <el-table-column width="55" type="expand">
                <!-- 展开项 -->
                <!-- <template slot-scope="scope">
              <div style="padding-left: 60px">
                <div>
                  <h2 style="font-size: 14px">备注</h2>
                  <div>{{ scope.row.description || "暂无备注" }}</div>
                </div>
              </div>
            
            </template> -->
              </el-table-column>
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column
                class-name="tablecolumn"
                v-for="item in tableColumn"
                :prop="item.key"
                :label="item.title"
                :key="item.key"
                :min-width="item.title == '题干' ? '280px' : '100px'"
              >
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">取 消</el-button>
          <el-button type="primary" @click="finishDialog">完成</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="addTest-bottom">
      <div class="addTest-bottom-title">设置答题方式：</div>
      <div class="addTest-bottom-form">
        <el-form
          :model="setAnswerForm"
          :rules="setAnswerRules"
          ref="setAnswerForm"
          class="demo-ruleForm"
        >
          <el-form-item label="设置答题时长 :" required>
            <el-input
              v-model="setAnswerForm.times"
              placeholder="请输入答题时长"
              @change="timesChange"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="设置通过成绩 :"
            required
            class="setAnswerFormTitle"
          >
            <el-input
              v-model="setAnswerForm.score"
              placeholder="请输入成绩"
              @change="scoreChange"
            ></el-input>
            <span>提示: 用户答题成绩大于等于设置的成绩则视为通过</span>
          </el-form-item>
          <el-form-item label="是否允许重复作答 :" required>
            <el-radio v-model="setAnswerForm.radio" label="1">否</el-radio>
            <el-radio v-model="setAnswerForm.radio" label="2">是</el-radio>
            <span>提示: 重复作答将取最优成绩作为最终成绩</span>
          </el-form-item>
          <el-form-item class="last-el-form-item">
            <el-button>取消</el-button>
            <el-button type="primary" :plain="true" @click="fulfillHand"
              >完成</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import Bus from "../assets/js/eventBus.js";
export default {
  data() {
    return {
      rules: {
        topRules: [{ required: true }],
      },
      // 弹框table数据
      tableData: [],
      // 要展开的行，数值的元素是row的key值
      // 添加试题之后的table数据
      addtableData: [],
      addtableColumn: [],
      selectionData: [],
      // 选中后的总分
      totalScore: 0,
      expands: [],
      isAddshow: false,
      dialogTableVisible: false, //添加试题弹框
      // 弹框form表单数据
      addTestForm: {
        pattern: [
          {
            patternItem: "容易",
          },
          {
            patternItem: "较易",
          },
          {
            patternItem: "一般",
          },
          {
            patternItem: "较难",
          },
          {
            patternItem: "困难",
          },
        ],
        score: "1",
      },
      //设置答题方式form表单
      setAnswerForm: { times: "", radio: "2", score: "" },
      setAnswerRules: {
        times: [{ required: true }],
      },
      setItemData: {},
    };
  },

  components: {},

  computed: {},
  created() {
    // 初始化请求数据
    this.initTableData();
    Bus.$on("addTest", (val) => {
      //一些操作，message就是从组件传过来的值
      // console.log("导航栏传的值",message);
      console.log(val, "message");
      this.addtableData = val;
      if (this.addtableData.length > 0) {
        console.log(this.addtableData, "this.addtableData.length");
        this.addtableColumn = this.tableColumn;
        this.isAddshow = true;
        // 累加分值;
        this.totalScore = this.addtableData.reduce((pre, cur) => {
          return Number(pre) + Number(cur.score);
        }, 0);
      }
    });
  },
  //mounted: {},
  mounted() {
    // 行拖拽排序
    this.rowDrop();
  },

  // beforeDestroy() {
  //   this.bus.$off("addTest");
  // },
  methods: {
    initTableData() {
      // table表格数据
      // const tableData = [
      //   {
      //     key: "1",
      //     testId: "001",
      //     questionTypes: "多选",
      //     questionStem: "近听水无声，春去花还在，人来鸟不惊",
      //     score: "5",
      //     difficulty: "容易",
      //     creationTime: "2022-2-3 8:30",
      //     description: "唐诗", //备注
      //     //operation: ["上线", "下线"], //操作
      //   },
      //   {
      //     key: "2",
      //     testId: "002",
      //     questionTypes: "多选",
      //     questionStem: "床前明月光，疑是地上霜，举头望明月，低头思故乡。",
      //     score: "4",
      //     difficulty: "困难",
      //     creationTime: "2022-7-3 8:30",
      //     description: "宋词", //备注
      //     //operation: ["上线", "下线"], //操作
      //   },
      //   {
      //     key: "3",
      //     testId: "003",
      //     questionTypes: "多选",
      //     questionStem: "鹅鹅鹅,曲向向天歌",
      //     score: "6",
      //     difficulty: "困难",
      //     creationTime: "2022-7-3 8:30",
      //     description: "宋词", //备注
      //     //operation: ["上线", "下线"], //操作
      //   },
      //   {
      //     key: "4",
      //     testId: "004",
      //     questionTypes: "多选",
      //     questionStem: "床前明月光，疑是地上霜，举头望明月，低头思故乡。",
      //     score: "12",
      //     difficulty: "容易",
      //     creationTime: "2022-7-3 8:30",
      //     description: "宋词", //备注
      //     //operation: ["上线", "下线"], //操作
      //   },
      // ];
      const tableData = JSON.parse(localStorage.getItem("setQuestions"));
      this.tableData = tableData;
      this.tableDataCopy = this.tableData;
      const tableColumn = [
        { title: "ID", dataIndex: "testId", key: "testId" },
        { title: "题型", dataIndex: "questionTypes", key: "questionTypes" },
        { title: "题干", dataIndex: "questionStem", key: "questionStem" },
        { title: "分数", dataIndex: "score", key: "score" },
        { title: "难度", dataIndex: "difficulty", key: "difficulty" },
        { title: "创建时间", dataIndex: "creationTime", key: "creationTime" },
      ];
      this.tableColumn = tableColumn;
    },
    finalCellStyle({ columnIndex }) {
      // console.log(row, "row");
      let style = {
        textAlign: "center",
        background: "#fff",
      };
      // console.log(columnIndex, "columnIndex");
      if (columnIndex === 2) {
        return {
          color: "blue",
          textAlign: "center",
        };
      }

      return style;
    },

    //行-拖拽
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
          //   拖动后获取newIdex
          let arr = Array.from(_this.tableData);
          _this.apiObjDrag = arr.map((item, index) => {
            return {
              id: item.id,
              dictSort: index,
            };
          });
        },
      });
    },
    delTableData(v) {
      console.log(v, "vv");
      this.addtableData = this.addtableData.filter((item) => item.testId != v);
      console.log(this.$route.query.id, "this.$router.query.id");

      // 更改localStorage存的值
      const gettableData = JSON.parse(localStorage.getItem("totalData"));
      console.log(gettableData, "bbb----bbbb");
      // 拿到和点击的该活动
      const filterArr = gettableData.filter(
        (item) => item.key == this.$route.query.id
      );

      console.log(filterArr, "aa-aa");
      // 重新给该活动的getAddTest赋值，则是替换掉原来localStorage里的值
      // filterArr[0].getAddTest = this.addtableData;
      this.setItemData.addStestData = this.addtableData;
      filterArr[0].getAddTest = this.setItemData;
      localStorage.setItem("totalData", JSON.stringify(gettableData));

      // 累加分值;
      this.totalScore = this.addtableData.reduce((pre, cur) => {
        return Number(pre) + Number(cur.score);
      }, 0);
      if (this.addtableData.length <= 0) {
        this.isAddshow = false;
      }
    },
    // 展开项
    clickRowHandle(row) {
      console.log(row);
      // if (this.expands.includes(row.id)) {
      //   this.expands = this.expands.filter((val) => val !== row.id);
      // } else {
      //   this.expands.push(row.id);
      // }
    },
    addDialog() {
      // 初始化请求数据
      this.initTableData();
      this.isAddshow = false;
      this.dialogTableVisible = true;
    },
    cancelDialog() {
      this.dialogTableVisible = false;

      if (this.addtableData.length > 0) {
        this.isAddshow = true;
      } else {
        this.isAddshow = false;
      }
    },

    // 处理数组里重复的对象
    removeDuplicates(arr) {
      const result = [];
      const duplicatesIndices = [];

      // 循环遍历原始数组中的每个项
      arr.forEach((current, index) => {
        if (duplicatesIndices.includes(index)) return;

        result.push(current);

        // 循环遍历数组中当前项之后的其他项
        for (
          let comparisonIndex = index + 1;
          comparisonIndex < arr.length;
          comparisonIndex++
        ) {
          const comparison = arr[comparisonIndex];
          const currentKeys = Object.keys(current);
          const comparisonKeys = Object.keys(comparison);

          // 检查对象中的键数
          if (currentKeys.length !== comparisonKeys.length) continue;

          // 检查关键字名称
          const currentKeysString = currentKeys.sort().join("").toLowerCase();
          const comparisonKeysString = comparisonKeys
            .sort()
            .join("")
            .toLowerCase();
          if (currentKeysString !== comparisonKeysString) continue;

          // 检查值
          let valuesEqual = true;
          for (let i = 0; i < currentKeys.length; i++) {
            const key = currentKeys[i];
            if (current[key] !== comparison[key]) {
              valuesEqual = false;
              break;
            }
          }
          if (valuesEqual) duplicatesIndices.push(comparisonIndex);
        }
      });

      return result;
    },

    changeSelectTest(selection) {
      // return selection;
      console.log(selection, "selection22");

      if (this.selectionData.length != 0) {
        this.selectionData = [];
        console.log(this.selectionData.length, "length");
        this.selectionData = selection;
        console.log(this.selectionData.length, "this.selectionData.length");
      } else {
        this.selectionData = selection;
      }

      // 累加分值
      this.totalScore = selection.reduce((pre, cur) => {
        return Number(pre) + Number(cur.score);
      }, 0);
    },

    finishDialog() {
      this.addtableData = this.addtableData.concat(this.selectionData);
      this.addtableData = this.removeDuplicates(this.addtableData);
      console.log(this.addtableData, " this.addtableData2222");
      if (this.addtableData.length != 0) {
        this.dialogTableVisible = false;
        this.isAddshow = true;
        this.addtableColumn = this.tableColumn;
        // 按照数组中每一项的key进行排序
        this.addtableData = this.addtableData.sort((a, b) => {
          return Number(a.key) - Number(b.key);
        });
      }
      // 累加分值;
      this.totalScore = this.addtableData.reduce((pre, cur) => {
        return Number(pre) + Number(cur.score);
      }, 0);
      // this.addtableData.forEach((item, i) => {
      //   if (i < 9) {
      //     item.testId = "00" + (i + 1);
      //   } else if (i < 99) {
      //     item.testId = "0" + (i + 1);
      //   } else {
      //     item.testId = i + 1;
      //   }
      // });
    },
    timesChange(v) {
      this.setItemData.times = v;
    },
    scoreChange(v) {
      this.setItemData.score = v;
    },
    fulfillHand() {
      if (this.isAddshow) {
        this.$message({
          message: "添加成功",
          type: "success",
        });
        console.log(this.$route.query.id, "idid");
        // 更改localStorage存的值
        const gettableData = JSON.parse(localStorage.getItem("totalData"));
        const filterArr = gettableData.filter(
          (item) => item.key == this.$route.query.id
        );
        // 给该活动添加一个getAddTest属性
        this.setItemData.addStestData = this.addtableData;
        //添加一个总分属性
        this.setItemData.totalScore = this.totalScore;
        filterArr[0].getAddTest = this.setItemData;
        console.log(filterArr, "aa-aa");
        localStorage.setItem("totalData", JSON.stringify(gettableData));

        // eventBus.$emit("add", this.addtableData);
        setTimeout(() => {
          this.$router.push({ name: "ActivityManager" });
        }, 2000);
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.addTest {
  background: #fff;
  .addTest-top {
    padding-top: 30px;
    padding-left: 40px;
    .el-form {
      .el-form-item {
        ::v-deep .el-form-item__content {
          width: 190px;
        }
      }
    }
  }
  .addTest-middle {
    padding-left: 55px;
    padding-top: 10px;
    border: 1px solid red;
    min-height: 200px;
    ::v-deep .el-dialog {
      width: 85%;
      background: #eee;
      .el-dialog__footer {
        text-align: center;
        .el-button {
          width: 135px;
        }
        .el-button + .el-button,
        .el-checkbox.is-bordered + .el-checkbox.is-bordered {
          margin-left: 55px;
        }
      }
    }
    .addTest-middle-one {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    //表单样式
    .addTest-form {
      min-height: 50px;
      border: 1px solid sienna;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      justify-content: left;
      .el-form {
        .el-form-item {
          margin-bottom: 0;
          .el-input {
            width: 168px;
            margin-right: 15px;
          }
        }
      }
    }
    // 表格样式
    .addTest-table {
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

    .addTest-hint {
      height: 200px;
      padding-right: 160px;
      border: 1px solid fuchsia;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      font-weight: bolder;
    }
  }
  .addTest-bottom {
    border: 1px solid darkblue;
    min-height: 100px;
    display: flex;

    flex-direction: column;
    .addTest-bottom-title {
      padding: 35px 0 10px 30px;
      font-size: 16px;
      text-align: left;
    }
    .addTest-bottom-form {
      padding-left: 20px;
      border: 1px solid rgb(0, 139, 123);
      .el-form {
        .el-form-item {
          display: flex;
          min-width: 300px;
          ::v-deep .el-form-item__content {
            // width: 150px;
            .el-input {
              width: 150px;
              .el-input__inner {
                text-align: center;
              }
            }
          }
        }
        .setAnswerFormTitle {
          ::v-deep .el-form-item__content {
            min-width: 476px;
            .el-input {
              width: 150px;
              margin-right: 10px;
              .el-input__inner {
                text-align: center;
              }
            }
          }
        }
        .last-el-form-item {
          padding-right: 150px;
          display: flex;
          justify-content: center;
          .el-button {
            padding-left: 50px;
            padding-right: 50px;
          }
          .el-button--default {
            margin-right: 30px;
          }
        }
      }
    }
  }
}
</style>
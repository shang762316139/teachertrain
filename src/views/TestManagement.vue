<!--
* @description 
* @fileName TestManagement.vue
* @author shang
* @date 2022/11/25 14:02:39
!-->
<template>
  <div class="TestManagement">
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
        <el-form-item class="enteringBtn">
          <el-button type="primary" @click="enteringBtn">录入单题</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- table列表 -->
    <div class="addTest-table">
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
      >
        <el-table-column width="55" type="expand">
          <!-- 展开项 -->

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
            <el-button type="text" @click="delTestList(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @prev-click="prevHandle"
        @next-click="nextHandle"
        :current-page="pagesData.currentPage"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="pagesData.limit"
        layout="total, prev, pager, next, jumper,sizes"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 分页器传的参数
      pagesData: {
        //代表的分页器第几页
        currentPage: 1,
        //当前页数展示数据条数
        limit: 2,
      },
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
      addtableData: [
        // {
        //   key: "1",
        //   testId: "001",
        //   questionTypes: "多选",
        //   questionStem: "近听水无声，春去花还在，人来鸟不惊",
        //   score: "5",
        //   difficulty: "容易",
        //   creationTime: "2022-2-3 8:30",
        //   description: "唐诗", //备注
        //   choice: [], //选项
        //   //operation: ["上线", "下线"], //操作
        // },
      ],
      expands: [],
      addtableColumn: [
        { title: "ID", dataIndex: "testId", key: "testId" },
        { title: "题型", dataIndex: "questionTypes", key: "questionTypes" },
        { title: "题干", dataIndex: "questionStem", key: "questionStem" },
        { title: "分数", dataIndex: "score", key: "score" },
        { title: "难度", dataIndex: "difficulty", key: "difficulty" },
        { title: "创建时间", dataIndex: "creationTime", key: "creationTime" },
      ],
    };
  },

  components: {},

  computed: {},
  created() {
    this.initData();
  },
  //mounted: {},

  methods: {
    initData() {
      const setQuestions = JSON.parse(localStorage.getItem("setQuestions"));
      this.addtableData = setQuestions;
    },
    // 展开项
    clickRowHandle(row) {
      if (this.expands.includes(row.id)) {
        this.expands = this.expands.filter((val) => val !== row.id);
      } else {
        this.expands.push(row.id);
      }
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
    enteringBtn() {
      this.$router.push({ name: "singleQuestion" });
    },
    delTestList(v) {
      console.log(v.testId, "v.testId");
      this.addtableData = this.addtableData.filter(
        (item) => item.testId != v.testId
      );

      console.log(this.addtableData, "vv---xx");
      if (this.addtableData.length != 0) {
        localStorage.setItem("setQuestions", JSON.stringify(this.addtableData));
      } else {
        localStorage.removeItem("setQuestions");
      }
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    prevHandle(v) {
      console.log(v, "prev---v");
    },
    nextHandle(v) {
      console.log(v, "nextHandle---v");
    },
  },
};
</script>
<style lang='scss' scoped>
//表单样式
.TestManagement {
  .addTest-form {
    min-height: 50px;
    border: 1px solid sienna;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    justify-content: left;
    position: relative;
    .el-form {
      .el-form-item {
        margin-bottom: 0;
        .el-input {
          width: 168px;
          margin-right: 15px;
        }
      }
      .enteringBtn {
        position: absolute;
        top: 5px;
        right: 0;
      }
    }
  }
  .addTest-table {
    display: flex;
    flex-direction: column;
    align-items: end;
    margin-bottom: 300px;
    //   .pagination{
    //   text-align: ;
    // }
  }
}
</style>
<!--
* @description 
* @fileName singleQuestion.vue
* @author shang
* @date 2022/12/04 21:45:09
!-->
<template>
  <div class="singleQuestion">
    <div class="questionForm">
      <el-form
        :model="questionForm"
        :rules="questionRules"
        ref="questionForm"
        class="elForm"
      >
        <el-form-item label="题型:" prop="questionTypes">
          <el-select
            v-model="questionForm.currentItem"
            value-key="type"
            placeholder="请选择"
            @change="typesChange"
          >
            <el-option
              :label="item.patternItem"
              :value="item"
              v-for="item in questionForm.questionTypes"
              :key="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题干:" prop="questionsStems">
          <el-input
            placeholder="请输入题干"
            suffix-icon="el-icon-edit-outline"
            v-model="questionForm.questionsStems"
            @change="stemsChange"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="选项:" prop="choice" class="choice">
          <div
            class="choiceItem"
            v-for="(item, index) in questionForm.choice"
            :key="item.code"
          >
            <div class="choiceItem-one">
              {{ String.fromCharCode(65 + index) }}
            </div>
            <div class="choiceItem-two">
              {{ String.fromCharCode(65 + index) }}
            </div>
            <!-- <el-input
              class="choiceItem-two"
              @change="choiceChange2"
              v-model="item.type"
            >
              {{ String.fromCharCode(65 + index) }}
            </el-input> -->
            <el-input
              class="choiceItem-three"
              v-model="item.content"
              clearable
              @change="contentChange(index, item.content)"
            >
            </el-input>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="delChoice(item.code)"
            ></el-button>
            <el-button
              type="primary"
              class="primaryBtn"
              v-if="index + 1 == questionForm.choice.length"
              @click="addChoice(index + 1)"
              >添加选项</el-button
            >
          </div>
          <!-- 加号 -->
          <el-button
            type="primary"
            @click="addChoice(0)"
            v-if="questionForm.choice.length == 0"
            >添加选项</el-button
          >
        </el-form-item>
        <!-- 单选 -->
        <el-form-item
          label="标答:"
          prop="modelAnswer"
          class="answerRadio"
          v-show="questionForm.isRadioShow"
        >
          <el-radio-group
            v-model="questionForm.radioModelAnswer"
            @change="radioChange"
          >
            <el-radio
              :label="String.fromCharCode(65 + index)"
              v-for="(item, index) in questionForm.choice"
              :key="item.code"
            ></el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 多选 -->
        <el-form-item
          label="标答:"
          prop="modelAnswer"
          class="answerRadio"
          v-show="questionForm.isCheckboxShow"
        >
          <el-checkbox-group
            v-model="questionForm.checkedModelAnswer"
            @change="checkboxChange"
          >
            <el-checkbox
              :label="String.fromCharCode(65 + index)"
              v-for="(item, index) in questionForm.choice"
              :key="item.code"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="分数:" prop="score">
          <el-input-number
            v-model="questionForm.score"
            :precision="1"
            :min="0"
            :step="1"
            @change="scoreChange"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="难度:" prop="difficulty" class="answerRadio">
          <el-radio-group
            v-model="questionForm.checkedDifficulty"
            @change="difficultyChange"
          >
            <el-radio
              :label="item.level"
              v-for="(item, index) in questionForm.difficulty"
              :key="index"
            ></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="totalBtn">提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questionForm: {
        currentItem: {},
        questionTypes: [
          {
            type: "1",
            patternItem: "单选",
          },
          {
            type: "2",
            patternItem: "多选",
          },
          {
            type: "3",
            patternItem: "判断题",
          },
          {
            type: "4",
            patternItem: "填空题",
          },
        ],
        questionsStems: "",
        choice: [
          // {
          //   code: "001",
          //   type: "A",
          //   content: "春江水暖鸭先知，蒌蒿满地芦芽短1",
          // },
          // {
          //   code: "002",
          //   type: "B",
          //   content: "春江水暖鸭先知，蒌蒿满地芦芽短2",
          // },
          // {
          //   code: "003",
          //   type: "C",
          //   content: "春江水暖鸭先知，蒌蒿满地芦芽短3",
          // },
          // {
          //   code: "004",
          //   type: "D",
          //   content: "春江水暖鸭先知，蒌蒿满地芦芽短4",
          // },
        ],
        isRadioShow: true,
        isCheckboxShow: false,
        radioModelAnswer: "",
        checkedModelAnswer: [],
        score: "",
        checkedDifficulty: "",
        difficulty: [
          {
            type: "01",
            level: "容易",
          },
          {
            type: "02",
            level: "较易",
          },
          {
            type: "03",
            level: "一般",
          },
          {
            type: "04",
            level: "较难",
          },
          {
            type: "05",
            level: "困难",
          },
        ],
      },
      //存起来的数据
      saveQuestionForm: {},

      questionRules: {
        questionTypes: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
        questionsStems: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        modelAnswer: [{ required: true }],
        choice: [{ required: true }],
        score: [{ required: true }],
        difficulty: [{ required: true }],
      },
    };
  },

  components: {},

  computed: {},

  //mounted: {},

  methods: {
    // 题型
    typesChange(v) {
      //{__ob__: Observer} 'vv////vv'
      this.saveQuestionForm.questionTypes = v.patternItem;
      if (v.type == "2") {
        this.questionForm.isRadioShow = false;
        this.questionForm.isCheckboxShow = true;
      }
    },
    // 题干
    stemsChange(v) {
      this.saveQuestionForm.questionStem = v;
    },
    //选项
    contentChange(i, v) {
      this.saveQuestionForm.choice[i].content = v;
      // console.log(
      //   this.saveQuestionForm.choice,
      //   "this.saveQuestionForm.choice111"
      // );
    },
    choiceChange2() {},
    delChoice(i) {
      this.$confirm("确认是否删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.questionForm.choice = this.questionForm.choice.filter(
            (item) => item.code != i
          );
          this.saveQuestionForm.choice = this.questionForm.choice;
          // console.log(
          //   this.saveQuestionForm.choice,
          //   "this.saveQuestionForm.choice333"
          // );

          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // aa(index) {
    //   return String.fromCharCode(65 + index);
    // },
    addChoice(i) {
      let num = i + 1;
      let numCode = "";
      if (num < 10) {
        numCode = "00" + num;
      } else if (num > 9 && num < 100) {
        numCode = "0" + num;
      } else {
        numCode = num;
      }
      console.log(numCode, "numCode");
      const addObj = {
        code: numCode,
        type: String.fromCharCode(65 + Number(i)),
        content: "",
      };
      console.log(addObj, "addObj");
      this.questionForm.choice.push(addObj);

      this.saveQuestionForm.choice = this.questionForm.choice;
      // console.log(
      //   this.saveQuestionForm.choice,
      //   "this.saveQuestionForm.choice222"
      // );
    },
    radioChange(v) {
      // console.log(v, "vv////vv");
      this.saveQuestionForm.result = v;
    },
    checkboxChange(v) {
      // console.log(v, "vv////vv222");
      this.saveQuestionForm.result = v;
    },
    scoreChange(newVal) {
      // console.log(newVal, "newVal");
      this.saveQuestionForm.score = newVal;
    },
    difficultyChange(v) {
      this.saveQuestionForm.difficulty = v;
    },
    //时间格式转换
    getDate() {
      //也可以不传,获取的就是当前时间
      var time = new Date();
      var year = time.getFullYear(); //年
      var month = ("0" + (time.getMonth() + 1)).slice(-2); //月
      var day = ("0" + time.getDate()).slice(-2); //日
      var mydate = year + "-" + month + "-" + day;
      return mydate;
    },

    totalBtn() {
      console.log(this.saveQuestionForm, "this.saveQuestionForm");

      const setQuestions = JSON.parse(localStorage.getItem("setQuestions"));

      if (setQuestions) {
        console.log(setQuestions.length, "setQuestions.length111");
        console.log(setQuestions, "setQuestions111");

        if (setQuestions.length + 1 < 10) {
          // setQuestions.forEach((item) => {
          //   console.log(item.testId, "item.testId");
          //   if (item.testId == "00" + (setQuestions.length + 1)) {
          //     this.saveQuestionForm.testId = "00" + (setQuestions.length + 2);
          //   } else {
          //     this.saveQuestionForm.testId = "00" + (setQuestions.length + 1);
          //   }
          // });
          this.saveQuestionForm.testId = "00" + (setQuestions.length + 1);
        } else if (
          setQuestions.length + 1 > 9 &&
          setQuestions.length + 1 < 100
        ) {
          this.saveQuestionForm.testId = "0" + (setQuestions.length + 1);
        } else {
          this.saveQuestionForm.testId = setQuestions.length;
        }
        this.saveQuestionForm.creationTime = this.getDate();
        setQuestions.push(this.saveQuestionForm);
        localStorage.setItem("setQuestions", JSON.stringify(setQuestions));
      } else {
        const setQuestions = [];
        this.saveQuestionForm.testId = "001";
        this.saveQuestionForm.creationTime = this.getDate();
        setQuestions.push(this.saveQuestionForm);
        localStorage.setItem("setQuestions", JSON.stringify(setQuestions));
        // console.log(setQuestions.length, "setQuestions.length111");
      }
      this.$router.push({ name: "TestManagement" });
    },
  },
};
</script>
<style lang='scss' scoped>
.singleQuestion {
  background: #fff;
  .questionForm {
    // border: 1px solid red;
    padding-top: 10px;
    .elForm {
      // border: 1px solid rgb(0, 255, 170);
      ::v-deep .el-form-item__label {
        min-width: 45px;
        // border: 1px solid firebrick;
        text-align: left;
        font-weight: bolder;
        padding-right: 18px;
      }
      ::v-deep .el-form-item__content {
        // border: 1px solid darkblue;
        max-width: 85%;
        display: flex;
        justify-content: left;
        flex-direction: column;
        .el-select {
          .el-input {
            width: 190px;
          }
        }
        .el-input {
          // border: 1px solid rgb(11, 206, 105);
          .el-input__suffix {
            font-size: 20px;
          }
        }
      }

      .choice {
        display: flex;
        .choiceItem {
          // border: 1px solid rgb(161, 161, 215);
          padding: 5px 0 0 95px;
          margin-top: 10px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          // align-items: center;
          margin-top: 17px;
          font-size: 16px;
          position: relative;
          .choiceItem-one {
            font-weight: bolder;
          }
          .choiceItem-two {
            // width: 46px;
            // height: 40px;
            width: 42px;
            height: 38px;
            line-height: 38px;
            border-radius: 5px;
            border: 1px solid #ddd;
            background: #fff;
            margin: 0 15px 0 20px;
            ::v-deep .el-input__inner {
              padding: 0;
              text-align: center;
            }
          }
          .choiceItem-three {
            width: 900px;
            height: 46px;
            margin-right: 44px;
            // border-radius: 5px;
            // border: 1px solid #ddd;
          }
          .primaryBtn {
            position: absolute;
            top: 7px;
            right: -110px;
            width: 100px;
          }
        }
      }
      .answerRadio {
        // border: 1px solid rgb(0, 255, 208);
        align-items: center;
        display: flex;
        // justify-content: center;
        ::v-deep .el-form-item__content {
          display: flex;

          .el-radio-group {
            display: flex;
            .el-radio {
              width: 64px;
              // border: 1px solid red;
              // display: inline;
            }
          }
          .el-checkbox-group {
            display: flex;
            .el-checkbox {
              width: 64px;
              // border: 1px solid red;
              // display: inline;
            }
          }
        }
      }
    }
  }
}
</style>
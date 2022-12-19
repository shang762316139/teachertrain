<!--
* @description 
* @fileName creatActivities.vue
* @author shang
* @date 2022/12/02 10:54:03
!-->
<template>
  <div class="creatActivities">
    <el-form
      :model="ActivitiesForm"
      ref="ActivitiesForm"
      :rules="ActivitiesRules"
      class="demo-ruleForm"
      label-position="right"
    >
      <el-form-item label="活动名称:" prop="name" required>
        <el-input
          v-model="ActivitiesForm.activeTitle"
          placeholder="请输入活动名称"
          @change="changeName"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动时间:" required>
        <div class="Activities-time">
          <el-form-item label="开始时间:">
            <el-date-picker
              v-model="ActivitiesForm.startTime"
              type="date"
              placeholder="开始时间:"
              @change="changeStartTime"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间:">
            <el-date-picker
              v-model="ActivitiesForm.endTime"
              type="date"
              placeholder="结束时间:"
              @change="changeEndTime"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="使用角色:" prop="userRole" required>
        <el-checkbox-group
          v-model="ActivitiesForm.checkedRole"
          @change="changeRole"
        >
          <el-checkbox
            v-for="item in ActivitiesForm.userRole"
            :label="item.role"
            :key="item.type"
            >{{ item.role }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="主办单位:" prop="hostUnit">
        <el-input
          v-model="ActivitiesForm.hostUnit"
          placeholder="请输入主办单位"
        ></el-input>
      </el-form-item>
      <el-form-item label="协办单位:" prop="assistanceUnit">
        <el-input
          v-model="ActivitiesForm.assistanceUnit"
          placeholder="请输入协办单位"
        ></el-input>
      </el-form-item>
      <el-form-item label="设置模板:" required>
        <button
          class="butTemplate"
          v-for="item in ActivitiesForm.set.setTemplate"
          :key="item.type"
          @click="
            ActivitiesForm.set.currentIndex = item.type;
            ActivitiesForm.set.view = item.componentId;
          "
          :class="{ highLight: ActivitiesForm.set.currentIndex == item.type }"
        >
          {{ item.setBoard }}
        </button>
      </el-form-item>
      <div class="viewTemplate">
        <keep-alive>
          <!-- 动态组件过渡 -->
          <component :is="ActivitiesForm.set.view"></component>
        </keep-alive>
      </div>
      <el-form-item>
        <el-button
          type="primary"
          :plain="true"
          @click="submitForm('ActivitiesForm')"
          >发布</el-button
        >
        <!-- <el-button>按钮</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import posterTemplate from "../components/posterTemplate";
import textTemplate from "../components/textTemplate";
import Bus from "../assets/js/eventBus.js";
export default {
  data() {
    return {
      ActivitiesForm: {
        activeTitle: "",
        startTime: "",
        endTime: "",
        hostUnit: "",
        assistanceUnit: "",
        checkedRole: [],
        inputError: { name: "sdsaf" },
        userRole: [
          { type: "1", role: "教师" },
          { type: "2", role: "学生" },
          { type: "3", role: "家长" },
        ],

        set: {
          view: "textTemplate",
          currentIndex: 1,
          setTemplate: [
            { type: 1, setBoard: "编辑文字", componentId: "textTemplate" },
            { type: 2, setBoard: "上传海报", componentId: "posterTemplate" },
          ],
        },
      },
      ActivitiesData: {
        activeData: "查看数据",
        states: "已下线",
        operation: {
          type: "1",
          state: "上线",
        }, //操作
      },
      // 传递过来需要回显的
      pingData: {},
      ActivitiesRules: {
        name: [
          { message: "请输入活动名称", trigger: "blur" },
          { min: 0, max: 30, message: "格式不正确", trigger: "blur" },
        ],
        hostUnit: [
          { message: "请输入活动名称", trigger: "blur" },
          { min: 0, max: 30, message: "格式不正确", trigger: "blur" },
        ],
        assistanceUnit: [
          { message: "请输入活动名称", trigger: "blur" },
          { min: 0, max: 30, message: "格式不正确", trigger: "blur" },
        ],
      },
    };
  },

  components: {
    posterTemplate,
    textTemplate,
  },

  computed: {},
  created() {
    Bus.$on("Activities", (val) => {
      console.log(val, "val--0000");
      // this.pingData = val;
      // 回显
      this.ActivitiesForm.activeTitle = val.activeTitle;
      this.ActivitiesForm.startTime = val.startTime;
      this.ActivitiesForm.endTime = val.endTime;
      this.ActivitiesForm.hostUnit = val.hostUnit;
      this.ActivitiesForm.assistanceUnit = val.assistanceUnit;
      this.ActivitiesForm.checkedRole = val.roles.split(",");
      console.log(this.ActivitiesForm.checkedRole, "//////"); //['教师、学生', __ob__: Observer] '//////'
      this.ActivitiesData = val;
    });
  },

  //mounted: {},

  methods: {
    changeName(v) {
      // console.log(v, "vname");
      // this.ActivitiesForm.name = "";
      this.ActivitiesData.activeTitle = v;
      this.ActivitiesData.userExamScore = ""; //用户答题得分
      this.ActivitiesData.userExamTime = ""; //用户答题时长
      console.log(this.ActivitiesData.activeTitle, "this.ActivitiesData.name");
    },
    changeStartTime(v) {
      this.ActivitiesData.startTime = v;
      console.log(v, "changeStartTime");
    },
    changeEndTime(v) {
      this.ActivitiesData.endTime = v;
      console.log(v, "changeEndTime");
      this.ActivitiesData.times =
        this.ActivitiesData.startTime + "--" + this.ActivitiesData.endTime;
    },
    changeRole(val) {
      console.log(val, "val-val"); //[1, 2, __ob__: Observer] 'val-val'

      // for (let i in valCopy) {
      // if (valCopy[i] == "1") {
      //   // item = "教师";
      //   valCopy.splice(i, 1, "教师");
      //   // console.log(item, "item");
      // } else if (valCopy[i] == "2") {
      //   // item = "学生";
      //   valCopy.splice(i, 1, "学生");
      // } else {
      //   // item = "家长";
      //   valCopy.splice(i, 1, "家长");
      // }

      // }

      // console.log(val, "val-val222");
      this.ActivitiesData.roles = "";
      this.ActivitiesData.roles = val.join(",");
      // console.log(this.ActivitiesData.roles, "val");
      // this.ActivitiesData.userRole = val ? cityOptions : [];
    },
    submitForm(v) {
      this.$refs[v].validate((valid) => {
        if (valid) {
          console.log(valid, "valid");
          //   alert("submit!");
        } else {
          console.log(valid, "valid");
          //   console.log("error submit!!");
          return false;
        }
      });

      const totaldata = [];
      const getData = JSON.parse(localStorage.getItem("totalData"));

      if (getData) {
        if (this.ActivitiesData.type) {
          // console.log(this.ActivitiesData.type, "this.ActivitiesData.type");
          const currentId = parseInt(this.ActivitiesData.type).toString();
          console.log(currentId, "currentId.......");
          getData[currentId - 1] = this.ActivitiesData;
          localStorage.setItem("totalData", JSON.stringify(getData));
        } else {
          const num = getData.length + 1;
          if (num < 10) {
            this.ActivitiesData.userExamScore = ""; //用户答题得分
            this.ActivitiesData.userExamTime = ""; //用户答题时长
            this.ActivitiesData.key = "00" + num;
          } else if (num > 9 && num < 100) {
            this.ActivitiesData.key = "0" + num;
          } else {
            this.ActivitiesData.key = num;
          }
          const num2 = getData.length + 1;
          if (num2 < 10) {
            this.ActivitiesData.type = "0" + num;
          } else {
            this.ActivitiesData.type = num;
          }
          getData.push(this.ActivitiesData);
          localStorage.setItem("totalData", JSON.stringify(getData));
        }
      } else {
        this.ActivitiesData.key = "001";
        this.ActivitiesData.type = "01";

        totaldata.push(this.ActivitiesData);
        localStorage.setItem("totalData", JSON.stringify(totaldata));
      }
      this.$message({
        message: "创建成功",
        type: "success",
      });
      setTimeout(() => {
        this.$router.push({ name: "ActivityManager" });
      }, 1500);
    },
  },
};
</script>
<style lang='scss' scoped>
.creatActivities {
  background: #fff;
  .el-form {
    padding-top: 20px;
    .el-form-item {
      display: flex;
      .butTemplate {
        width: 85px;
        height: 34px;
        border: 1px solid #eee;
        margin-right: 16px;
        border-radius: 5px;
        line-height: 34px;
      }
      .highLight {
        background-color: rgb(9, 130, 190);
        color: #fff !important;
      }
      ::v-deep .el-form-item__label {
        padding-right: 16px;
        min-width: 90px;
      }
      ::v-deep .el-form-item__content {
        min-width: 400px;
        display: flex;
        justify-content: left;
      }
      .Activities-time {
        display: flex;

        .el-form-item {
          display: flex;
          margin-right: 10px;

          ::v-deep .el-form-item__label {
            font-size: 12px;
            min-width: 50px;
          }
          ::v-deep .el-form-item__content {
            font-size: 12px;
            min-width: 100px;
          }
          ::v-deep .el-date-editor.el-input {
            width: 130px;
            .el-input__inner {
              font-size: 12px;
              height: 30px;
            }
          }

          .viewTemplate {
            display: flex;
            justify-content: left;
            //   border: 1px solid red;
            margin-left: 90px; // 设置动态组件切换高亮
          }
        }
      }
    }
  }
}
</style>
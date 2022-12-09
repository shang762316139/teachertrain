<template>
  <div class="activity">
    <el-container>
      <el-header>Header</el-header>
      <!-- 左边 -->

      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="this.$route.path"
            :default-openeds="openeds"
            :unique-opened="true"
            :router="true"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-submenu
              :index="items.path"
              v-for="(items, index) in menuList"
              :key="index"
            >
              <template slot="title">
                <span>{{ items.authName }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="(item, i) in items.children"
                  :key="i"
                  :index="item.path"
                  >{{ item.authName }}</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main> <router-view></router-view> </el-main>
          <!-- <el-footer>Footer</el-footer> -->
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "Home",
  components: {
    // HelloWorld
  },
  data() {
    return {
      openeds: ["/ActivityManager"],
      menuList: [
        {
          id: 0,
          authName: "培训活动",
          path: "/Activity",
          children: [
            {
              authName: "活动管理",
              id: 1,
              path: "/ActivityManager",
              parentid: 0,
            },
            {
              authName: "试题管理",
              id: 2,
              path: "/TestManagement",
              parentid: 0,
            },
            {
              authName: "课程管理",
              id: 3,
              path: "/courseManagement",
              parentid: 0,
            },
          ],
        },
      ],
    };
  },
  methods: {
    handleOpen(key) {
      console.log(key);
    },
    handleClose(key, keyPath) {
      console.log(key, "guan", keyPath);
    },
  },
};
</script>
<style lang="scss" scoped>
.activity {
  background: #eee;
  width: 100%;
  .el-header {
    background: linear-gradient(
      to right,
      rgb(117, 161, 250),
      rgb(81, 136, 245),
      rgb(37, 72, 247)
    );
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside::-webkit-scrollbar {
    display: none;
  }
  .el-aside {
    background-color: #fff;
    color: #333;
    text-align: center;
    // line-height: 200px;
    ::v-deep .el-menu {
      overflow: hidden;
    }
  }
  .el-main {
    background: #eee;
    color: #333;
    text-align: center;
    // line-height: 160px;
    margin-bottom: 30px;
    padding: 0px;
  }
}
</style>

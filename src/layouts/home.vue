<script setup lang="ts">
defineOptions({
  name: 'HomeLayout',
})

const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const selectItem = (index: any, indexPath: any, item: any, routeResult: any) => {
  console.log(routeResult);

}
</script>

<template>
  <main h-screen text="center gray-700 dark:gray-200">
    <div flex h-screen>
      <el-menu default-active="/editor/xmlEditor" class="el-menu-vertical-demo" :collapse="false" @open="handleOpen" @close="handleClose"
        :router="true" @select="selectItem">
        <el-menu-item index="/editor/xmlEditor">
          <el-icon><i-ep-home-filled /></el-icon>
          <template #title>
            编辑器
          </template>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><i-ep-location /></el-icon>
            <span>Lab</span>
          </template>
          <el-menu-item-group>
            <template #title>
              <span>Webgl</span>
            </template>
            <el-menu-item index="/example/frustum">
              frustum
            </el-menu-item>
            <el-menu-item index="/example/shapeTexture">
              shapeTexture
            </el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="TS">
            <el-menu-item index="/example/decorator">
              decorator
            </el-menu-item>
            <el-menu-item index="/example/webfont">
              webfont
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
      <RouterView />
    </div>
    <TheFooter />
    <div mx-auto mt-5 text-center text-sm opacity-50>
      [Home Layout]
    </div>
  </main>
</template>

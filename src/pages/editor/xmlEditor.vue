<script setup lang="ts">
import { T } from '@unhead/vue/dist/createHead-197548ae';
import { xmlToJson, convertToTreeFormat } from '~/utils/configParser.js'

interface Tree {
  id: string
  label: string,
  name?: string,
  children?: Tree[]
}


const props = {
  value: 'id',
  label: 'label',
  name: 'name',
  children: 'children',
}

let myTreeData = ref<Tree[]>([]) //传入tree组件的数据
let myTree = ref() //获取tree组件实例
const uploadXml = async () => {
  try {
    const fileHandle = await window.showOpenFilePicker();
    const file = await fileHandle[0].getFile();
    let fileContents = await file.text();
    // 假设fileContents是你的XML字符串或文档对象
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(fileContents, 'text/xml');
    const json = xmlToJson(xmlDoc.documentElement);

    console.log(json); // 输出转换后的 JSON 对象
    myTreeData.value = convertToTreeFormat(json)
    console.log(myTreeData);


  } catch (error) {
    console.error('Error accessing file:', error);
  }
}

const saveXml = async () => {
  // json转xml
}

watch(() => myTreeData.value, (newValue, oldValue) => {
  console.log("修改成功", newValue);
}, { deep: true })
const changeTreeNode = (key, name, input,event) => {
  event.stopPropagation();
  console.log(myTree.value.getNode(key));
  let node = myTree.value.getNode(key)
  console.log(input);
  node.data.name = input
  console.log(myTreeData);
}
const preventClick = (event)=>{
  event.stopPropagation();
}
</script>

<template>
  <!-- <div wfull hfull>
    <button w40 btn @click="uploadXml">上传文件</button>
  </div> -->
  <div container>
    <button w40 btn m4 @click="uploadXml">上传文件</button>
    <el-tree-v2 :data="myTreeData" :props="props" :width="500" :height="700" ref="myTree">
      <template #default="{ node, data }">
        <div v-if="node.isLeaf">
          <span class="prefix" :class="{ 'is-leaf': node.isLeaf }">[{{ node.label }}]</span>
        </div>
        <div flex v-else>
          <div class="prefix">[{{ node.label }}]</div>
          <el-input size="small" v-model="data.input" @click="preventClick" placeholder="请输入参数名称" clearable style="width: 300px">
            <template #prepend>{{ data.name }}</template>
          </el-input>
          <el-button size="small" type="primary" @click="changeTreeNode(node.key, data.name, data.input,$event)">修改</el-button>
        </div>
      </template>
    </el-tree-v2>
    <button w40 btn m4 @click="uploadXml">保存模板文件</button>
  </div>
  <!-- <div container>
    1231231111111111111111111111111111111111111111111
  </div> -->
</template>
<style scoped lang="scss">
::v-deep .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
  width: 200px;
  padding: none;
}
.prefix {
  color: var(--el-color-primary);
  margin-right: 10px;
  width: 200px;
}

.prefix.is-leaf {
  color: var(--el-color-success);
}
</style>
<route lang="yaml">
  meta:
    layout: home
</route>
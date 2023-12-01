<script setup lang="ts">
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
let xmlDoc:any = null;
const uploadXml = async () => {
  try {
    const fileHandle = await window.showOpenFilePicker();
    const file = await fileHandle[0].getFile();
    let fileContents = await file.text();
    // 假设fileContents是你的XML字符串或文档对象
    const parser = new DOMParser();
    xmlDoc = parser.parseFromString(fileContents, 'text/xml');
    const json = xmlToJson(xmlDoc);
    myTreeData.value = convertToTreeFormat(json.children[0])
    
  } catch (error) {
    console.error('Error accessing file:', error);
  }
}

const saveXml = async (jsonData:any) => {
  // 根据 domId 查找相应的 DOM 节点
  const updateDom = (data:any) => {
    const element = xmlDoc.getElementById(data.domId);

    if (element) {
      // 根据 JSON 数据更新 DOM 内容
      if (data.hasOwnProperty("name")) {
        element.setAttribute("name", data.name);
      }

      // 更新其他属性
      // 例如：
      // if (data.hasOwnProperty("attributes")) {
      //   for (const attribute in data.attributes) {
      //     element.setAttribute(attribute, data.attributes[attribute]);
      //   }
      // }

      // 递归处理子节点
      if (data.hasOwnProperty("children")) {
        for (const child of data.children) {
          updateDom(child);
        }
      }
    }
  };

  // 调用更新函数，传入 domId 和 JSON 数据
  updateDom(jsonData[0]);
  console.log('保存的xml',xmlDoc);
  saveUpdatedXml(xmlDoc);
};

// 使用 showSaveFilePicker() 请求用户选择文件并保存
const saveUpdatedXml = async (xmlDoc:any) => {
  const updatedXmlString = new XMLSerializer().serializeToString(xmlDoc);

  try {
    const handle = await window.showSaveFilePicker({
      types: [{
        description: 'XML Files',
        accept: {
          'text/xml': ['.xml'],
        },
      }],
    });

    const writable = await handle.createWritable();
    await writable.write(updatedXmlString);
    await writable.close();

    console.log('File saved successfully.');
  } catch (err) {
    console.error('Unable to save the file:', err);
  }
}

watch(() => myTreeData.value, (newValue, oldValue) => {
  console.log("修改成功", newValue);
}, { deep: true })
const changeTreeNode = (key:string, name:string, input:string,event:any) => {
  event.stopPropagation();
  console.log(myTree.value.getNode(key));
  let node = myTree.value.getNode(key)
  console.log(input);
  node.data.name = input
  console.log(myTreeData);
}
const preventClick = (event:any)=>{
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
    <button w40 btn m4 @click="saveXml(myTreeData)">保存模板文件</button>
  </div>
  <!-- <div container>
    1231231111111111111111111111111111111111111111111
  </div> -->
</template>
<style scoped lang="scss">
:deep .el-input-group__prepend {
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
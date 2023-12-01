let idCounter = 0;
let leafIdCounter = 0;
const assignIds = (node:any) => {
  const assignIdToNode = (el:any) => {
    idCounter++;
    el.setAttribute('id', `node_${idCounter}`);
  };

  if (node.nodeType === Node.ELEMENT_NODE) {
    assignIdToNode(node);
    if (node.hasChildNodes()) {
      for (let i = 0; i < node.childNodes.length; i++) {
        assignIds(node.childNodes[i]);
      }
    }
  }
};

const xmlToJson = (xml:any) => {
  assignIds(xml.documentElement); // 为xmlDoc的根节点设置ID
  const traverse = (node:any) => {
    const obj:any = {};
    if (node.nodeType === Node.ELEMENT_NODE) {
      obj['nodeName'] = node.nodeName;

      // if (node.attributes.length > 0) {
      //   obj['attributes'] = {};
      //   for (const attribute of node.attributes) {
      //     obj['attributes'][attribute.nodeName] = attribute.nodeValue;
      //   }
      // }
    } else if (node.nodeType === Node.TEXT_NODE) {
      if (node.nodeValue.trim() === '') {
        return null;
      }
      obj['value'] = node.nodeValue.trim();
    }

    const children = [];
    for (const child of node.childNodes) {
      const childObj = traverse(child);
      if (childObj) {
        children.push(childObj);
      }
    }

    if (children.length > 0) {
      obj['children'] = children;
    }

    if (node.nodeType != Node.TEXT_NODE && node.nodeType === Node.ELEMENT_NODE) {
      const nodeId = node.getAttribute('id');
      const name = node.getAttribute('name');
    
      if (nodeId) {
        obj['id'] = nodeId;
        if (name!=null) {
          obj['name'] = name;
        }
      }
    }

    return obj;
  };

  return traverse(xml);
};

interface Tree {
  id: string
  label: string,
  name?: string,
  domId?: string,
  children?: Tree[]
}
const convertToTreeFormat = (data: any): Tree[] => {
  console.log("Processing node:", data.nodeName);

  // 若为叶子节点，返回value和label
  if (!data.hasOwnProperty("id")) {
    // console.log("Leaf node found:", data.nodeName);
    leafIdCounter++;
    return [{ id: `node_${leafIdCounter}`, label: data.value }];
  }

  const children: Tree[] = [];

  console.log("Processing children of node:", data.nodeName);

  // 处理不同类型的子节点结构
  if (Array.isArray(data.children)) {
    for (const childNode of data.children) {
      console.log("Child node:", childNode.nodeName);
      const childTree = convertToTreeFormat(childNode);
      children.push(...childTree); // 扁平化子节点数组并添加到当前节点的 children 中
    }
  } else if (data.children) {
    const childTree = convertToTreeFormat(data.children);
    children.push(...childTree); // 扁平化子节点数组并添加到当前节点的 children 中
  }

  const currentNode: Tree = {
    id: data.id,
    label: data.nodeName,
    name:  data.name? data.name:data.nodeName,
    domId: data.id,
    children: children // 直接设置子节点数组
  };

  console.log("Processed children of node:", data.nodeName);
  return [currentNode];
};


export {xmlToJson,convertToTreeFormat}
const xmlToJson = (xml: any) => {
  // 创建空对象以存储转换后的 JSON 数据
  const obj:any = {};

  if (xml.nodeType === 1) { // 节点类型为元素节点
    // 如果元素节点有属性，将其添加到 JSON 对象中
    if (xml.attributes.length > 0) {
      obj['attributes'] = {};
      for (let i = 0; i < xml.attributes.length; i++) {
        const attribute:any = xml.attributes.item(i);
        obj['attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) { // 节点类型为文本节点
    obj['value'] = xml.nodeValue.trim();
  }

  // 处理子节点
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;
      if(nodeName==='#text' && xmlToJson(item).value===''){
        continue
      }else{
        // 如果节点已存在于 JSON 对象中，则创建数组存储其值
        if (typeof obj[nodeName] === 'undefined') {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof obj[nodeName].push === 'undefined') {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
  }
  return obj;
}

interface Tree {
  id: string
  label: string,
  name?: string,
  children?: Tree[]
}
const convertToTreeFormat = (data:any):Tree[] => {
  // 若为叶子节点，返回value和label
  if (data.hasOwnProperty("#text") && Object.keys(data).length === 1) {
    return [{ id: data["#text"].value, label: data["#text"].value}];
  }

  const children:Tree[] | Tree = [];
  for (const key in data) {
    if (key !== "#text") {
      const child:Tree = { id: key, label: key ,name: key};

      if (Array.isArray(data[key])) {
        child.children = data[key].map((item: any) => convertToTreeFormat(item));
      } else {
        child.children = convertToTreeFormat(data[key]);
      }

      children.push(child);
    }
  }

  return children;
}
export {xmlToJson,convertToTreeFormat}
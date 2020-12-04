---
date: 2020-12-04
title: 「CKEditor5」富文本编辑器定制
tags:
  - 前端
describe: CKEditor5可以与 Angular，React 和 Vue.js 集成,也可以和 Electron 和移动设备（Android，iOS）兼容。自定义自己所需的编辑功能,如自动格式化,上传适配器,导出 PDF 等功能
---

## 为什么使用[CKEditor5](https://ckeditor.com/ckeditor-5/)

- **方便集成**:可以与 Angular，React 和 Vue.js 集成,也可以和 Electron 和移动设备（Android，iOS）兼容。
- **可定制化**:可以自定义自己所需的编辑功能,如自动格式化,上传适配器,导出 PDF 等功能

## 安装使用

### 1.创建自己的 CKEditor

有关更多详细信息，请查看此[官方教程](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installing-plugins.html)。也可以使用[官方在线定制](https://ckeditor.com/ckeditor-5/online-builder/)选择自己需要的功能组件。

```bash
git clone -b stable https://github.com/ckeditor/ckeditor5-build-classic.git
cd ckeditor5-build-classic
# 下载依赖
yarn
# 构建
yarn build
```

构建完成后，您将在`build`文件夹中获得一个自定义 CKEditor 。

打开`sample/index.html`查看效果

## 功能插件

1.  找到自己所需的功能插件,可以在[npm](https://www.npmjs.com/search?q=ckeditor)上搜索.
2.  例如文本对齐插件
    `yarn add @ckeditor/ckeditor5-alignment`
3.  编辑`src/ckeditor.js`文件以将插件添加到将包含在构建中的插件列表中

```js
// The editor creator to use.
import ClassicEditorBase from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";

import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import UploadAdapter from "@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import EasyImage from "@ckeditor/ckeditor5-easy-image/src/easyimage";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import Link from "@ckeditor/ckeditor5-link/src/link";
import List from "@ckeditor/ckeditor5-list/src/list";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";

import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment"; // <--- 添加在此处

export default class ClassicEditor extends ClassicEditorBase {}

// 引入所需插件.
ClassicEditor.builtinPlugins = [
  Essentials,
  UploadAdapter,
  Autoformat,
  Bold,
  Italic,
  BlockQuote,
  EasyImage,
  Heading,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Link,
  List,
  Paragraph,
  Alignment, // <--- 添加在此处
];

// 编辑器配置.
ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      "heading",
      "|",
      "alignment", // <--- 添加在此处
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "imageUpload",
      "blockQuote",
      "undo",
      "redo",
    ],
  },
  image: {
    toolbar: [
      "imageStyle:full",
      "imageStyle:side",
      "|",
      "imageTextAlternative",
    ],
  },
  // 如果要改成中文,将 language 改为 zh
  // 注:这里要和webpack.config.js文件里的语言保持一致
  language: "en",
};
```

## 上传适配器

经常要在富文本编辑器中上传图片到自己的服务器上.所以要进行定制化.这里已**阿里 OSS**为例

### 自定义上传适配器

新建`src/ali-ckeditor-upload.js`文件

```js
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import FileRepository from "@ckeditor/ckeditor5-upload/src/filerepository";
import OSS from "ali-oss";

const config = {
  region: "<你的 region>",
  accessKeyId: "<你的 AccessKeyId>",
  accessKeySecret: "<你的 AccessKeySecret>",
  bucket: "你的 bucket name",
  savePath: "images/",
};

const client = new OSS({
  region: config.region,
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret,
  bucket: config.bucket,
});

const random_string = function (len) {
  len = len || 32;
  let chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  let maxPos = chars.length;
  let pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

const today = function () {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();

  return year + "-" + month + "-" + date;
};

const imgPath = function (img) {
  img = img || ".png";
  let path = config.savePath + today() + "/";
  let name = random_string() + img;
  return path + name;
};
// 自定义插件需要从Plugin继承
export default class AliUploadAdapter extends Plugin {
  static get requires() {
    return [FileRepository];
  }

  static get pluginName() {
    return "ali-ckeditor-upload";
  }

  init() {
    this.editor.plugins.get(FileRepository).createUploadAdapter = (loader) => {
      return new Adapter(loader);
    };
  }
}

class Adapter {
  constructor(loader) {
    this.loader = loader;
  }

  // 开始上传过程。
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }

  async _initListeners(resolve, reject, file) {
    // 使用其他存储服务器时,在此处修改下面代码,将 file 上传即可
    try {
      let name = imgPath(file.name);
      // 生成随机图片链接
      let url = `http://${config.bucket}.${config.region}.aliyuncs.com/` + name;
      let result = await client.multipartUpload(name, file, {
        progress: function (p) {
          // 进度监听
          // console.log(Math.round(p * 100));
        },
      });
      resolve({
        default: url,
      });
    } catch (e) {
      console.log(e);
    }
  }

  _sendRequest(file) {
    const data = new FormData();
    data.append("upload", file);
  }
}
```

### 添加自定义插件

转到`src/ckeditor.js`，进行以下更改以加载此插件。

```diff
+import AliUploadAdapter from "./ali-ckeditor-upload";

export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	...,
+	AliUploadAdapter
];

// Editor configuration.
ClassicEditor.defaultConfig = {...};
```

重新`yarn build`打开`sample/index.html`查看效果

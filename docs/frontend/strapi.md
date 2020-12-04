---
date: 2020-12-04
title: 「Strapi」无头CMS，快速构建API
tags:
  - 前端
describe: Strapi是一个免费的开源无头 CMS，可以快速构建自己所需的 API。
---

## Strapi 介绍

[Strapi](https://github.com/strapi/strapi)是一个免费的开源无头 CMS，可以快速构建自己所需的 API。

- **保持对数据的控制**。使用 Strapi，可以知道数据的存储位置，并且始终可以完全控制。
- **自托管**。可以按照自己的方式托管和扩展 Strapi 项目。可以选择所需的任何托管平台：AWS，Netlify，Heroku，VPS 或专用服务器。您可以随增长而扩展，100％独立。
- **可以选择自己喜欢的数据库**。Strapi 适用于 SQL 和 NoSQL 数据库：MongoDB，PostgreSQL，MySQL，MariaDB 和 SQLite。
- **可定制的**。通过完全自定义 API，路由或插件来完全满足需求，从而快速构建逻辑。

## 安装

```bash
# 使用 yarn 安装
yarn create strapi-app my-project --quickstart
# 使用  npm/npx 或者 安装
npx create-strapi-app my-project --quickstart
# 启动开发模式
yarn dev
# 生产模式
yarn start
# 重新构建
yarn build
```

可以打开`config/server.js`文件,修改启动端口号

初次安装完会弹出一个页面,让你注册管理员账号
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcb7dc1acf5b433f82705e0215d303ce~tplv-k3u1fbpfcp-watermark.image)

## 使用

在登录成功后

1. 点击左侧菜单栏的**内容类型生成器**

2. 点击创建一个新的**Content Type**

3. 输入名称,在高级设置里,将**Draft/publish system**选择**OFF**(取消每次发布文章为草稿)点击继续(这里的名称就是后面 api 路径名,即 api/name )

4. 选择自己所需的字段并创建,最后点击完成,应用重启.

5. 在左侧菜单栏**COLLECTION TYPES**分类下,就会出现刚刚创建的内容
   ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1608bdda3cd46038681bdf60051e797~tplv-k3u1fbpfcp-watermark.image)
6. 点击新建,输入内容后保存.(倘若第三步没有选择**OFF**,还要点击保存旁边的**Publish**).此时访问`http://localhost:1337/tests`显示**statusCode: 403**.
7. 点击左侧菜单栏的**设置/角色与权限/Public**,勾选**find**和**find one**,保存.
8. 此时访问`http://localhost:1337/tests`便可显示数据内容

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59cc3ae342a147bf85ad0a61c4c858bf~tplv-k3u1fbpfcp-watermark.image)

## 定制富文本编辑器

这里以**CKEditor5**为例,其定制教程查看[「CKEditor5」富文本编辑器定制](https://juejin.cn/post/6902279323818917902),定制完成后复制`build`文件夹下的`ckeditor.js`和`translations`文件夹.

### 1. 生成插件并安装依赖

```bash
yarn strapi generate:plugin wysiwyg
cd plugins/wysiwyg
yarn add @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic
```

### 2.创建 MediaLib

**Path** — `./plugins/wysiwyg/admin/src/components/MediaLib/index.js`

```js
import React, { useEffect, useState } from "react";
import { useStrapi, prefixFileUrlWithBackendUrl } from "strapi-helper-plugin";
import PropTypes from "prop-types";

const MediaLib = ({ isOpen, onChange, onToggle }) => {
  const {
    strapi: {
      componentApi: { getComponent },
    },
  } = useStrapi();
  const [data, setData] = useState(null);
  const [isDisplayed, setIsDisplayed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDisplayed(true);
    }
  }, [isOpen]);

  const Component = getComponent("media-library").Component;

  const handleInputChange = (data) => {
    if (data) {
      const { url } = data;

      setData({ ...data, url: prefixFileUrlWithBackendUrl(url) });
    }
  };

  const handleClosed = () => {
    if (data) {
      onChange(data);
    }

    setData(null);
    setIsDisplayed(false);
  };

  if (Component && isDisplayed) {
    return (
      <Component
        allowedTypes={["images", "videos", "files"]}
        isOpen={isOpen}
        multiple={false}
        noNavigation
        onClosed={handleClosed}
        onInputMediaChange={handleInputChange}
        onToggle={onToggle}
      />
    );
  }

  return null;
};

MediaLib.defaultProps = {
  isOpen: false,
  onChange: () => {},
  onToggle: () => {},
};

MediaLib.propTypes = {
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
};

export default MediaLib;
```

### 3.创建 WYSIWYG

**Path** — `./plugins/wysiwyg/admin/src/components/Wysiwyg/index.js`

```js
import React, { useState } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { Button } from "@buffetjs/core";
import { Label, InputDescription, InputErrors } from "strapi-helper-plugin";
import Editor from "../CKEditor";
import MediaLib from "../MediaLib";

const Wysiwyg = ({
  inputDescription,
  errors,
  label,
  name,
  noErrorsDescription,
  onChange,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  let spacer = !isEmpty(inputDescription) ? (
    <div style={{ height: ".4rem" }} />
  ) : (
    <div />
  );

  if (!noErrorsDescription && !isEmpty(errors)) {
    spacer = <div />;
  }

  const handleChange = (data) => {
    if (data.mime.includes("image")) {
      const imgTag = `<p><img src="${data.url}" caption="${data.caption}" alt="${data.alternativeText}"></img></p>`;
      const newValue = value ? `${value}${imgTag}` : imgTag;

      onChange({ target: { name, value: newValue } });
    }

    // Handle videos and other type of files by adding some code
  };

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div
      style={{
        marginBottom: "1.6rem",
        fontSize: "1.3rem",
        fontFamily: "Lato",
      }}
    >
      <Label htmlFor={name} message={label} style={{ marginBottom: 10 }} />
      <div>
        <Button color="primary" onClick={handleToggle}>
          MediaLib
        </Button>
      </div>
      <Editor name={name} onChange={onChange} value={value} />
      <InputDescription
        message={inputDescription}
        style={!isEmpty(inputDescription) ? { marginTop: "1.4rem" } : {}}
      />
      <InputErrors
        errors={(!noErrorsDescription && errors) || []}
        name={name}
      />
      {spacer}
      <MediaLib
        onToggle={handleToggle}
        isOpen={isOpen}
        onChange={handleChange}
      />
    </div>
  );
};

Wysiwyg.defaultProps = {
  errors: [],
  inputDescription: null,
  label: "",
  noErrorsDescription: false,
  value: "",
};

Wysiwyg.propTypes = {
  errors: PropTypes.array,
  inputDescription: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.shape({
      id: PropTypes.string,
      params: PropTypes.object,
    }),
  ]),
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.shape({
      id: PropTypes.string,
      params: PropTypes.object,
    }),
  ]),
  name: PropTypes.string.isRequired,
  noErrorsDescription: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default Wysiwyg;
```

### 4.创建 CKEditor

**Path** — `./plugins/wysiwyg/admin/src/components/CKEditor/index.js`

```js
import React from "react";
import PropTypes from "prop-types";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import styled from "styled-components";

const Wrapper = styled.div`
  .ck-editor__main {
    min-height: 200px;
    > div {
      min-height: 200px;
    }
  }
`;

const configuration = {
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "link",
    "bulletedList",
    "numberedList",
    "|",
    "indent",
    "outdent",
    "|",
    "blockQuote",
    "insertTable",
    "mediaEmbed",
    "undo",
    "redo",
  ],
};

const Editor = ({ onChange, name, value }) => {
  return (
    <Wrapper>
      <CKEditor
        editor={ClassicEditor}
        config={configuration}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange({ target: { name, value: data } });
        }}
      />
    </Wrapper>
  );
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default Editor;
```

### 5.覆盖 WYSIWYG,修改插件前端入口

替换下面文件的内容

**Path** — `./plugins/wysiwyg/admin/src/index.js`

```js
import pluginPkg from "../../package.json";
import Wysiwyg from "./components/Wysiwyg";
import pluginId from "./pluginId";

export default (strapi) => {
  const pluginDescription =
    pluginPkg.strapi.description || pluginPkg.description;

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon: pluginPkg.strapi.icon,
    id: pluginId,
    initializer: () => null,
    injectedComponents: [],
    isReady: true,
    isRequired: pluginPkg.strapi.required || false,
    mainComponent: null,
    name: pluginPkg.strapi.name,
    preventComponentRendering: false,
    settings: null,
    trads: {},
  };

  strapi.registerField({ type: "wysiwyg", Component: Wysiwyg });

  return strapi.registerPlugin(plugin);
};
```

### 6. 替换自己定制的 CKEditor5

1. 将开始复制的`ckeditor.js`和`translations`文件夹拷贝到`plugins/wysiwyg/admin/src/components/CKEditor`文件夹下
2. 修改`plugins/wysiwyg/admin/src/components/CKEditor/index.js`
   ```diff
   - import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
   + import ClassicEditor from "./ckeditor";
   ```
3. 重新构建文件,查看效果

```bash
yarn build
yarn dev
```

## 参考

- [创建一个新插件来在 CKEditor 中更改所见即所得](https://strapi.io/documentation/v3.x/guides/registering-a-field-in-admin.html#introduction)
- [ckeditor5-strapi-upload-plugin](https://github.com/gtomato/ckeditor5-strapi-upload-plugin)

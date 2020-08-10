const navConf = require('./config/nav');
const sidebarConf = require('./config/sidebar');

module.exports = {
  "title": "Moking的个人网站",
  "description": "认真生活",
  "dest": "public",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    "nav": navConf,
    "sidebar": sidebarConf,
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "分类"
      },
      "tag": {
        "location": 3,
        "text": "标签"
      }
    },
    "friendLink": [
      {
        "title": "午后南杂",
        "desc": "Enjoy when you can, and endure when you must.",
        "email": "1156743527@qq.com",
        "link": "https://www.recoluan.com"
      },
      {
        "title": "vuepress-theme-reco",
        "desc": "A simple and beautiful vuepress Blog & Doc theme.",
        "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        "link": "https://vuepress-theme-reco.recoluan.com"
      }
    ],
    "logo": "/avatar.jpg",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "Moking1997",
    "authorAvatar": "/avatar.jpg",
    "record": "浙ICP备19042845号-2",
    'recordLink': 'http://www.beian.miit.gov.cn/',
    "startYear": "2019",
    valineConfig: {
      appId: 'w0gnBUsPC2FiGPLXraNyXMaG-gzGzoHsz',
      appKey: '9GRIruOGQo7fbShlvGowR3p3', // your appKey
    }
  },
  'locales': {
    '/': {
      lang: 'zh-CN'
    }
  },
  "markdown": {
    "lineNumbers": false
  }
}
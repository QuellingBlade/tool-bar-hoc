# 简介

>   这是一个供 [vue-data-table](https://github.com/njleonzhang/vue-data-tables) 使用的高阶工具栏组件
    [English Doc](https://github.com/QuellingBlade/tool-bar-hoc)


## 基础用法例子
``` javascript
<template>
    <tool-bar
      v-model="filters"
      layout="action, radio, select, search" // 配置所需的 layout 选项
      :actionOptions="actionOptions" // 绑定 actionOptions
      :filterOptions="filterOptions" // 绑定 filterOptions
    >
    </tool-bar>
    <data-tables-server
      ...
      :filters="filters"
      >
    </data-tables-server>
<template>
<script>
  ...
  import { ToolBar } from 'tool-bar-hoc'  // 引入ToolBar组建
  data(){
    return {
      filters: [
        {
          type: 'radio',
          prop: 'rent_type', // 需要通过 radio 筛选的表格中的prop
          value: ''
        },
        {
          type: 'select',
          prop: 'building', // 需要通过 select 筛选的表格中的prop
          value: ''
        },
        {
          type: 'search', // 需要通过 search 筛选的表格中的prop
          prop: 'q',
          value: ''
        },
      ],
      filterOptions: {
        radioOptions: {
          items: [
            { label: 'radio1', value: '0' },
            { label: 'radio2', value: '2' },
            { label: 'radio3', value: '1' }
          ] // radio 选项配置
        },
        selectOptions: {
          props: {
            placeholder: 'please select'
          },
          items: [
            ...
          ]
        },
        searchOptions: {
          colProps: {
            span: 8,
            offset: 2
          }, // 其他符合 elementUI 的 Attributes
          props: {
            placeholder: '...'
          }
        }
      },
      actionOptions: {
        items: [
          {
            name: '', // 按钮文本
            handler: () => {
              //做点什么...
            }
          }
          ....
        ]
      },
    }
  }
  components: {
    ToolBar  // 注册ToolBar组建
  }
<script>
```

## 自定义 tool-bar
  除了ToolBar组建，tool-bar-hoc还提供了一个createToolBar函数，接受一个ComponentsAndProps数组作为参数，可以实现自定义组件插入。
  举个例子
```javascript
  import { createToolBar } from 'tool-bar-hoc'
  let toolbar = createToolBar([{
    component: component1,
    props: {
      layout: 'province, city, district, custom', // 定义在 component1 组建里面的 layout 选项，custom 代表下面 slot 的组件
    },
    slot: component2 // component1 内不包含但是又需要用到的组件用 slot 插槽插入 component1 来实现
  }])

  下面是参数ComponentsAndProps详解

  @param {Array} ComponentsAndProps
    [
       {
         component: { VueComponent } // 自定义VueComponent组件
         props: { object } // 传递给组件的props,
         slot: { VueComponent } | Array<VueComponent>   // 以slot插槽的形式插入额外的VueComponent组件
       }
    ]
  对于v-model的参数详解
  @returns a hoc component，props of value and layout needs special introduction：
    value(v-model) { Array }
     [
       {
          type: { 'radio' | 'select' | 'checkbox' | 'search' } // 如果没有type的项，则认为是其对应传入的组件(component)
          prop: { string | array } // 用于表格过滤的 prop
          filterFn: { Function } // 自定过滤函数
       }
     ]
    layout: {string} 'action, radio, select, checkbox, search, confirm' // 默认值
    // 如果layout里没有confirm的时，则内部的value变化（radio, select, checkbox, search）都会直接emit input事件，
    // 而如果layout里有confirm的时，则内部的value变化会推迟到confirm button被点击的时候
 ```
## Others
  通过阅读源代码来尝试更多用法。

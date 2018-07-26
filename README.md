# tool-bar-hoc

> A tool-bar-hoc component for vue-data-tables

## Install

``` bash
# npm install
npm install tool-bar-hoc

# or yarn
yarn add tool-bar-hoc
```

## Basic Usage Demo
``` javascript
<template>
    <tool-bar
      v-model="filters"
      layout="action, radio, select, search" //Configuring layout options you need 配置需要的layout选项
      :actionOptions="actionOptions" //绑定 actionOptions
      :filterOptions="filterOptions" //绑定 filterOptions
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
  import { ToolBar } from 'tool-bar-hoc'
  data(){
    return {
      filters: [
        {
          type: 'radio',
          prop: 'rent_type', // prop you want to filter by radio 需要通过radio筛选的表格中的prop
          value: ''
        },
        {
          type: 'select',
          prop: 'building', // prop you want to filter by select 需要通过select筛选的表格中的prop
          value: ''
        },
        {
          type: 'search', // prop you want to filter by search 需要通过search筛选的表格中的prop
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
          ]
        }, //radio items
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
          }, // other props that in accordance with the ElementUI rules
          props: {
            placeholder: '...'
          }
        }
      },
      actionOptions: {
        items: [
          {
            name: '', // button name
            handler: () => {
              //do something
            }
          }
          ....
        ]
      },
    }
  }
  components: {
    ToolBar
  }
<script>
```

## Other Explanation
```javascript
  This is a tool-bar component for [vue-data-table](https://github.com/njleonzhang/vue-data-tables)

  @export
  @param {Array} ComponentsAndProps
    [
       {
         component: { VueComponent }
         props: { object } props that pass to the component,
         slot: { VueComponent } | Array<VueComponent> the default slot of the Component
       }
    ]
  @returns a hoc component，props of value and layout needs special introduction：
    value(v-model) { Array }
     [
       {
          type: { 'radio' | 'select' | 'checkbox' | 'search' } // If there is no type item, it is considered to be the corresponding incoming component.  没有type的项，则认为是其对应传入的组件(component)
          prop: { string | array } // For data-tables, prop is used to filter
          filterFn: { Function } // Custom filter function 自定过滤函数
       }
     ]
    layout: {string} 'action, radio, select, checkbox, search, confirm' //default value
      // If there is no `confirm` value, when (radio, select, checkbox, search) value changes,it will emit input directly
      // If there is 'confirm' value, the inner value change will be delayed until the confirm button is clicked.
      // 如果layout里没有confirm的时，则内部的value变化（radio, select, checkbox, search）都会直接emit input事件，
      // 而如果layout里有confirm的时，则内部的value变化会推迟到confirm button被点击的时候
 ```
## Others
  you could try more usage by reading the source code.
  通过阅读源代码来尝试更多用法。

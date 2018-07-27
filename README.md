# Introduction

> A tool-bar-hoc component for vue-data-tables
  [中文文档](https://github.com/QuellingBlade/tool-bar-hoc/blob/master/README.md)

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
          prop: 'rent_type', // prop you want to filter by radio
          value: ''
        },
        {
          type: 'select',
          prop: 'building', // prop you want to filter by select
          value: ''
        },
        {
          type: 'search', // prop you want to filter by search
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

## Custom tool-bar
  In addition to the ToolBar component, tool-bar-hoc also provides a createToolBar function that accepts a ComponentsAndProps array as a parameter.It can implement custom component insertion。
  For example
```javascript
  import { createToolBar } from 'tool-bar-hoc'
  let toolbar = createToolBar([{
    component: component1, // custom component
    props: {
      layout: 'province, city, district, custom', // Defines the layout option in the component1 , custom represents the component of the slot below
    },
    slot: component2 // Components not included in component1 but need to be used will be inserted into component1 as slots.
  }])


  The following is a detailed description of the parameters ComponentsAndProps

  @param {Array} ComponentsAndProps
    [
       {
         component: { VueComponent }
         props: { object } props that pass to the component,
         slot: { VueComponent } | Array<VueComponent> the default slot of the Component
       }
    ]

  The following is a detailed parameters for v-model

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

      // If there is no `confirm` type, when (radio, select, checkbox, search) value changes, it will emit input directly

      // If there is 'confirm' type, the inner value change will be delayed until the confirm button is clicked.
 ```
## Others
  you could try more usage by reading the source code.

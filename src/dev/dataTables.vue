<style>
td{
  text-align: left;
}
</style>

<template>
<div>
  <tool-bar layout='action, search, confirm' :action-options='actionOptions'  :filter-options='filterOptions' v-model='filters'>
  </tool-bar>
  <data-tables-server :data="data" :filters="filters">
    <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.prop">
    </el-table-column>
  </data-tables-server>
</div>
</template>

<script>
import { ToolBar } from '@/components/TableToolBarHoc'
export default {
  data() {
    return {
      data: [{
        "content": "Water flood",
        "flow_no": "FW201601010001",
        "flow_type": "Repair",
        "flow_type_code": "repair",
        }, {
        "content": "Lock broken",
        "flow_no": "FW201601010002",
        "flow_type": "Repair",
        "flow_type_code": "repair",
        }, {
        "content": "Help to buy some drinks",
        "flow_no": "FW201601010003",
        "flow_type": "Help",
        "flow_type_code": "help"
      }],
      titles: [{
        prop: "flow_no",
        label: "NO."
        }, {
        prop: "content",
        label: "Content"
        }, {
        prop: "flow_type",
        label: "Type"
      }],
      filters: [{
        value: '',
        type: 'search',
        prop: 'flow_no',
      }],
      actionOptions: {
        colProps: {
          span: 17
        },
        items: [
          {
            name: 'Do Something',
            handler: () => {
              console.log('Done')
            }
          },
        ]
      },
      filterOptions: {
        searchOptions: {
          colProps: {
            span: 4
          },
          props: {
            placeholder: 'Search',
          }
        }
      },
    }
  },
  components: {
    ToolBar
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

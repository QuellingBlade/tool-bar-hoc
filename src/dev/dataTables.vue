<template>
<div>
  <tool-bar layout='action, select, search, confirm' :action-options='actionOptions' :filter-options='filterOptions' v-model='filters'>
  </tool-bar>
  <data-tables :data="data" :filters="filters">
    <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.prop">
    </el-table-column>
  </data-tables>
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
      },
      {
        type: 'select',
        prop: 'flow_no',
        value: ''
      }],
      actionOptions: {
        colProps: {
          span: 4,
        },
        items: [
          {
            name: 'Warning',
            handler: () => {
              this.$message.error('Warning')
            },
            colProps: {
            }
          },
          {
            name: 'Success',
            handler: () => {
              this.$message.success('Success')
            }
          },
        ]
      },
      filterOptions: {
        searchOptions: {
          colProps: {
            span: 4,
            offset: 8
          },
          props: {
            placeholder: 'Search',
          }
        },
        selectOptions: {
          props: {
            placeholder: 'Select'
          },
          items: [
            {
              label: 'opt1',
              value: 'FW201601010001'
            },
            {
              label: 'opt2',
              value: 'FW201601010002'
            },
          ]
        },
      },
    }
  },
  components: {
    ToolBar
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

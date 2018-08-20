import { merge, cloneDeep, isArray } from 'lodash'
import './tableToolBar.scss'

/**
 * vue-data-table的一个tool bar组件
 * @export
 * @param {Array} ComponentsAndProps 子组件及其配置的列表和slot
 *   [
 *      {
 *        component: { VueComponent }
 *        props: { object } props that pass to the component,
 *        slot: { VueComponent } | Array<VueComponent> the default slot of the Component
 *      }
 *   ]
 * @returns a hoc component，value和layout的props需要特别说明：
 *   value(v-model) { Array }
 *    [
 *      {
 *         type: { 'radio' | 'select' | 'checkbox' | 'search' } // 没有type的项，则认为是其对应传入的组件(component)
 *         prop: { string | array } for data-tables, prop is used to filter
 *         filterFn: { Function } 自定过滤函数
 *      }
 *    ]
 *   layout: {string} 默认值'action, radio, select, checkbox, search, confirm'
 *      如果layout里没有confirm的时，则内部的value变化（radio, select, checkbox, search）都会直接emit input事件，
 *      而如果layout里有confirm的时，则内部的value变化会推迟到confirm button被点击的时候
 */

export function createToolBar(ComponentsAndProps) {
  return {
    props: {
      value: {
        type: Array
      },
      actionOptions: {
        type: Object
      },
      confirmOptions: {
        type: Object
      },
      filterOptions: {
        type: Object
      },
      layout: {
        type: String,
        default: 'action, radio, select, checkbox, search, confirm'
      },
    },
    created() {
      if (this.confirmMode) {
        this.__originalValue = cloneDeep(this.value) // 深度clone防止__originalValue被子组件的v-model修改
        this._getOriginalValue = () => {
          return this.__originalValue.slice() // 浅clone保证清空条件时, 每次value prop都收到一个新值，从而保证清空可以触发。
        }
      }
    },
    watch: {
      value: {
        handler(val) {
          if (!isArray(val)) return
          this.customIndexs = [] // 清空customIndexs
          this.innerValue = this.confirmMode ? cloneDeep(val) : val // confirmMode 时，深度 clone 防止子组件修改val，导致父组件的数据受到影响
          this.customVals = this.innerValue
            .filter((item, index) => {
              if (!item.type) {
                this.customIndexs.push(index)
                return true
              }
            })
            .map(item => item.value)
        },
        immediate: true
      },
      customVals: {
        // 使用 deep watch，有2个原因：
        // 1. 因为我们允许传入的 component 内部自己修改自己的值，但是不通知我们.
        // 2. customVals 有是一个数组, 我们需要用 deep watch.
        handler(val) {
          this.customIndexs.forEach((indexInValue, index) => {
            this.innerValue[indexInValue].value = val[index]
          })
        },
        deep: true
      },
    },
    data() {
      return {
        innerValue: [],
        customVals: [], // 传入组件s对应值的列表，this.value里type未定义的项是自定义项
        customIndexs: [] // 传入组件s对应值在this.value里的位置。
      }
    },
    provide() {
      return {
        rootToolBar: this
      }
    },
    computed: {
      curRadioVal: {
        get() {
          return this.getVal('radio', this.innerFilterOptions.radioOptions.all)
        },
        set(val) {
          this.setVal('radio', val)
        }
      },
      curSelectVal: {
        get() {
          return this.getVal('select')
        },
        set(val) {
          this.setVal('select', val)
        }
      },
      curSearchVal: {
        get() {
          return this.getVal('search')
        },
        set(val) {
          this.setVal('search', val)
        }
      },
      curCheckboxVal: {
        get() {
          let options = this.innerFilterOptions.checkboxOptions
          let defaultVals = options.items
            .filter(item => item.value)
            .map(item => item.prop)
          return this.getVal('checkbox', defaultVals)
        },
        set(val) {
          this.setVal('checkbox', val)
        }
      },
      innerActionOptions() {
        return merge({
          colProps: {
            span: 24
          },
          items: []
        }, this.actionOptions)
      },
      innerConfirmOptions() {
        return merge({
          colProps: {
            span: 4,
            offset: 0
          },
          items: []
        }, this.confirmOptions)
      },
      innerFilterOptions() {
        return merge(
          {
            radioOptions: {
              colProps: {
                span: 10
              },
              all: null,
              items: []
            },
            selectOptions: {
              colProps: {
                span: 4
              },
              items: [],
              props: {
                clearable: true
              }
            },
            checkboxOptions: {
              colProps: {
                span: 3,
                offset: 1
              },
              items: []
            },
            searchOptions: {
              colProps: {
                span: 6
              },
              items: []
            },
            customOptions: {
              colProps: {
                span: 20,
              }
            }
          },
          this.filterOptions,
        )
      },
      layouts() {
        return this.layout
          .split(',')
          .map((item) => item.trim())
      },
      confirmMode() {
        return this.layouts.indexOf('confirm') > -1
      },
    },
    render(h) {
      let toolBarRow = []

      if (this.layouts.length === 0) {
        toolBarRow = null
      } else {
        const TEMPLATE_MAP = {
          action: <btn-action></btn-action>,
          radio: <radio-filter></radio-filter>,
          select: <select-filter></select-filter>,
          checkbox: <checkbox-filter></checkbox-filter>,
          search: <search-filter></search-filter>,
          confirm: <confirm></confirm>
        }

        if (ComponentsAndProps) {
          TEMPLATE_MAP['custom'] = (
            <el-col {...{ props: this.innerFilterOptions.customOptions.colProps }}>
              {
                ComponentsAndProps.map(({ component: Component, props, slot }, index) => {
                  return <Component v-model={ this.customVals[index] }
                    {...{
                      props
                    }}
                  >
                    {
                      [].concat(slot).map(Slot => <Slot></Slot>)
                    }
                  </Component>
                })
              }
            </el-col>
          )
        }

        this.layouts
          .forEach(compo => {
            toolBarRow.push(TEMPLATE_MAP[compo])
          })
      }

      return (
        <el-row class="table-tool-bar" gutter={20}>
          {toolBarRow}
        </el-row>
      )
    },
    components: {
      BtnAction: {
        inject: ['rootToolBar'],
        render(h) {
          let { colProps, items } = this.rootToolBar.innerActionOptions
          return (
            <el-col
              class="table-action-wrapper"
              {...{ props: colProps }}
            >
              {
                items.map((action, index) => {
                  return (
                    <el-button type="primary"
                      key={index}
                      onClick={() => action.handler()}>
                      {action.name}
                    </el-button>
                  )
                })
              }
            </el-col>
          )
        }
      },
      RadioFilter: {
        inject: ['rootToolBar'],
        render(h) {
          let { props, colProps, items, all } = this.rootToolBar.innerFilterOptions.radioOptions
          return (
            <el-col class="radio-filter-wrapper" {...{ props: colProps }}>
              <el-radio-group
                v-model={this.rootToolBar.curRadioVal}
                class="radio-filter"
                {...{ attrs: props }}
              >
                <el-radio-button key="all" label={all}>
                  {'全部'}
                </el-radio-button>
                {
                  items.map((item, index) => {
                    return (
                      <el-radio-button
                        key={item.value}
                        label={item.value}
                      >
                        {item.label}
                      </el-radio-button>
                    )
                  })
                }
              </el-radio-group>
            </el-col>
          )
        }
      },
      SelectFilter: {
        inject: ['rootToolBar'],
        render(h) {
          let { props, colProps, items } = this.rootToolBar.innerFilterOptions.selectOptions
          return (
            <el-col class="select-filter-wrapper" {...{ props: colProps }}>
              <el-select
                v-model={this.rootToolBar.curSelectVal}
                class="select-filter"
                {...{ attrs: props }}
              >
                {
                  items.map((item, index) => {
                    return (
                      <el-option
                        key={item.value}
                        label={item.label}
                        value={item.value}
                      >
                      </el-option>
                    )
                  })
                }
              </el-select>
            </el-col>
          )
        }
      },
      CheckboxFilter: {
        inject: ['rootToolBar'],
        render(h) {
          let { props, colProps, items } = this.rootToolBar.innerFilterOptions.checkboxOptions
          return (
            items.length > 0
              ? (
                <el-col class="checkbox-filter-wrapper" {...{props: colProps}}>
                  <el-checkbox-group
                    v-model={this.rootToolBar.curCheckboxVal}
                  >
                    {
                      items.map((item, index) => {
                        return (
                          <el-checkbox
                            class="checkbox-filter"
                            key={index}
                            label={item.prop}
                            {...{ attrs: props }}
                          >
                            {item.label}
                          </el-checkbox>
                        )
                      })
                    }
                  </el-checkbox-group>
                </el-col>
              )
              : null
          )
        }
      },
      SearchFilter: {
        inject: ['rootToolBar'],
        render(h) {
          let { props, colProps } = this.rootToolBar.innerFilterOptions.searchOptions
          return (
            <el-col class="search-filter-wrapper" {...{ props: colProps }}>
              <el-input
                class="search-filter"
                v-model={this.rootToolBar.curSearchVal}
                suffix-icon="el-icon-search"
                {...{
                  attrs: props,
                  nativeOn: {
                    keydown: (event) => {
                      if (event.keyCode === 13) {
                        this.rootToolBar.$emit('input', this.rootToolBar.innerValue)
                      }
                    }
                  }
                }}
              >
              </el-input>
            </el-col>
          )
        }
      },
      Confirm: {
        inject: ['rootToolBar'],
        render() {
          let { colProps, items } = this.rootToolBar.innerConfirmOptions
          return (
            <el-col
              class="table-confirm-wrapper"
              {...{ props: colProps }}
            >
              {
                items.length > 0
                  ? items.map((action, index) => {
                    return (
                      <el-button type="primary"
                        key={index}
                        onClick={() => action.handler()}>
                        {action.name}
                      </el-button>
                    )
                  })
                  : (
                    <div class='buttons'>
                      <el-button type="text"
                        onClick={() => {
                          this.rootToolBar.$emit('input', this.rootToolBar._getOriginalValue())
                        }}>
                        清空条件
                      </el-button>
                      <el-button type="primary"
                        onClick={() => {
                          this.rootToolBar.$emit('input', this.rootToolBar.innerValue)
                        }}>
                        查询
                      </el-button>
                    </div>
                  )
              }
            </el-col>
          )
        }
      }
    },
    methods: {
      getVal(type, defaultVal = '') {
        let data = this.innerValue.find(v => v.type === type)
        return data
          ? data.value
          : defaultVal
      },
      setVal(type, val) {
        this.innerValue = this.innerValue.map(item => {
          if (item.type === type) {
            return {
              ...item,
              value: val
            }
          } else {
            return item
          }
        })

        if (!this.confirmMode) {
          this.$emit('input', this.innerValue)
        }
      }
    }
  }
}

export let ToolBar = createToolBar()

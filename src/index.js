import { ToolBar, createToolBar } from './components/TableToolBarHoc'

ToolBar.install = function (Vue) {
  Vue.component('ToolBar', ToolBar)
}

createToolBar.install = function (Vue) {
  Vue.component('createToolBar', createToolBar)
}

let install = function (Vue) {
  ToolBar.install(Vue)
  createToolBar.install(Vue)
}

export {
  install,
  ToolBar,
  createToolBar,
}

export default {
  install
}

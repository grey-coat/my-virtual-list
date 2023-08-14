export const dynamicListProps = {
  itemSize: {
    type: Number,
    require: true
  }, // 每一项的高度
  itemClass: String, // 每一项的自定义 class
  itemKey: [String, Number], // 每一项的 key
  data: Array, // 数据
  width: Number, // 可视区域宽度
  height: Number, // 可视区域高度
  cache: { // 上下缓冲数量
    type: Number,
    default: 2
  },
  distance: { // 触底加载阈值
    type: Number,
    default: 0
  },
  dynamic: {
    type: Boolean,
    default: false
  }
}
export const dynamicListEmits = {
  load: null, // 触底加载事件
}
/*
 * @Descripttion: 实有单位模板脚本
 * @version: 
 * @Author: 王鹏
 * @Date: 2021-02-02 19:16:26
 * @LastEditors: 王鹏
 * @LastEditTime: 2021-02-02 19:21:22
 */
Object.assign(JTemplate, {
  //加载事件
  onLoad: function (template) {
    // code值
    let codes = {
      // 房屋位置
      position: 'Q^position^SL',
    }
      // 搜索栏中的数据模型
      let forms = template.listConfig.searchForm.forms
      forms.forEach((item, index) => {
        if (item.modelValue) {
          let code = item.modelValue
          if (code === codes.grid) { // 所属网格 跟随标准地址 联动
            template.$watch(() => { return template.$refs.searchForm.params[codes.address] }, () => {
              let ids = template.$refs.searchForm.params[codes.address]
              if (ids) {
                let id = ids.split('.').pop()
                $fn.getGrid(id, item)
              } else {
                item.options = []
                template.$refs.searchForm.params[codes.grid] = ''
                template.$refs.searchForm.params[codes.complex] = ''
              }
              item.valueKey = 'id'
              item.labelKey = 'gridName'
            }, { immediate: true })
          }
        }
      });
  },
  //按钮提交前置事件
  beforeSubmit: function (template, action, position, selection, data, callback) {
    if (action === 'lmt') {

    }
    callback(true)
  },
});
/*
 * @Descripttion: 实有单位模板脚本
 * @version: 
 * @Author: 王鹏
 * @Date: 2021-02-02 19:16:26
 * @LastEditors: 王鹏
 * @LastEditTime: 2021-02-19 19:27:39
 */
Object.assign(JTemplate, {
  //加载事件
  onLoad: function (template) {
    // code值
    let codes = {
      // 房屋位置
      address: 'Q^region_tree^SL',
      // 网格
      grid: 'Q^grid_code^S',
    }
    let $fn = {
      /**
     * @description: 获取网格options
     * @param {String} code 区域编码
     * @param {Object} target 数据对象
     * @return void
     */
      getGrid: (code, target) => {
        this.$request({
          url: '/ybss/v3/standard/grid/queryGridByAreaCode',
          method: 'get',
          params: {
            // "parameters": [{ "key": "Q^area_code^S", "value": code }],
            // "sorts": [{ "field": "sorts", "order": "asc" }]
            areaCode: code
          }
        }).then(res => {
          if (res.state === 200) {
            template.$refs.searchForm.params[codes.grid] = ''
            template.$refs.searchForm.params[codes.complex] = ''
            target.options = res.data.dataResult
          }
        })
      }
    }
      // 搜索栏中的数据模型
      let forms = template.listConfig.searchForm.forms
      forms.forEach((item, index) => {
        if (item.modelValue) {
          let code = item.modelValue
          if (code === codes.grid) { // 所属网格 跟随标准地址 联动
            setTimeout(()=>{
              template.$watch(() => { return template.$refs.searchForm.params[codes.address] }, () => {
                let ids = template.$refs.searchForm.params[codes.address]
                if (ids) {
                  let id = ids.split('.').pop()
                  $fn.getGrid(id, item)
                } else {
                  item.options = []
                  template.$refs.searchForm.params[codes.grid] = ''
                }
                item.valueKey = 'id'
                item.labelKey = 'gridName'
              }, { immediate: true })
            },1000)
          }
        }
      });
  }
});
/*
 * @Descripttion: 人房走访模板脚本
 * @version: 
 * @Author: 王鹏
 * @Date: 2021-01-19 11:02:06
 * @LastEditors: 王鹏
 * @LastEditTime: 2021-03-24 16:00:32
 */
Object.assign(JTemplate, {
  //加载事件
  onLoad: function (template) {
    // code值
    let codes = {
      // 标准地址
      address: 'Q^PATH_^SL',
      // 网格
      grid: 'Q^grid_code^S'
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
            areaCode: code
          }
        }).then(res => {
          if (res.state === 200) {
            template.$refs.searchForm.params[codes.grid] = ''
            target.options = res.data.dataResult
          }
        })
      },
      /**
     * @description: 获取建筑群options
     * @param {String} areaCode 区域编码
     * @param {String} gridCode 网格编码
     * @param {Object} target 数据对象
     * @return void
     */
      getBuilding: (areaCode, gridCode, target) => {
        this.$request({
          url: '/ybss/v3/standard/building/queryByAreaCodeAndGrid',
          method: 'post',
          data: {
            areaCode,
            gridCode
          }
        }).then(res => {
          if (res.state === 200) {
            template.$refs.searchForm.params[codes.complex] = ''
            target.options = res.data.dataResult
          }
        })
      },
      /**
     * @description: 校验是否有网格
     * @return void
     */
      checkisHasGrid: () => {
        this.$request({
          url: '/ybss/v3/esintConfig/queryByType?type=hasGrid',
        }).then(res => {
          if (res.state === 200) {
            let list = res.data.dataResult
            if (list && list.length > 0) {
              let hasGrid = list[0].code
              start(hasGrid)
            }
          }
        })
      },
    }

    $fn.checkisHasGrid()

    function start(hasGrid) {
      // 搜索栏中的数据模型
      let forms = template.listConfig.searchForm.forms
      forms.forEach((item, index) => {
        if (item.modelValue) {
          let code = item.modelValue
          if (hasGrid) {
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
        }
      });
    }
  }
});
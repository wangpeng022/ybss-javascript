/*
 * @Descripttion: 标准地址拦截 按钮事件
 * @version: 
 * @Author: 王鹏
 * @Date: 2021-01-21 10:31:09
 * @LastEditors: 王鹏
 * @LastEditTime: 2021-01-27 17:02:10
 */
Object.assign(JTemplate,{
  //加载事件
  onLoad: function (template) {
    // code值
    let codes = {
      // 标准地址
      address: 'Q^region_tree^SL',
      // 网格
      grid: 'Q^grid_code^S',
      // 建筑群
      complex: "Q^parent_id^S",
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
      // console.log(hasGrid,'hasGrid');
      
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
            } else if (code === codes.complex) { // 建筑群 跟随 所属网格 联动
              template.$watch(() => { return template.$refs.searchForm.params[codes.grid] }, () => {
                let ids = template.$refs.searchForm.params[codes.address]
                let gridCode = template.$refs.searchForm.params[codes.grid]
                if (ids) {
                  let id = ids.split('.').pop()
                  $fn.getBuilding(id, gridCode, item)
                } else {
                  item.options = []
                  template.$refs.searchForm.params[codes.grid] = ''
                  template.$refs.searchForm.params[codes.complex] = ''
                }
                item.valueKey = 'id'
                item.labelKey = 'buildName'
              }, { immediate: true })
            }
          } else {
            if (code === codes.complex) { // 建筑群 直接跟随 标准地址 联动
              template.$watch(() => { return template.$refs.searchForm.params[codes.address] }, () => {
                let ids = template.$refs.searchForm.params[codes.address]
                let gridCode = ''
                if (ids) {
                  let id = ids.split('.').pop()
                  $fn.getBuilding(id, gridCode, item)
                } else {
                  item.options = []
                  template.$refs.searchForm.params[codes.complex] = ''
                }
                item.valueKey = 'id'
                item.labelKey = 'buildName'
              }, { immediate: true })
            }
          }
        }
      });
    }
  },
  
 //按钮提交前置事件
  beforeSubmit:function(template, action, position, selection, data, callback){
    console.log(action,'action');
    
    if (action == 'customAdd') { // 自定义添加
      template.customDialogShow = true
      template.$refs.customAddressDialog.type = 'add'
    }else if(action == 'xq'){ // 明细
      template.customDialogShow = true
      template.$refs.customAddressDialog.type = 'detail'
      template.$refs.customAddressDialog.buildingId = data.id_
    }else if (action == 'edit') { // 自定义添加
      template.editDialogShow = true
      template.$refs.editAddressDialog.type = 'edit'
      template.$refs.editAddressDialog.buildingId = data.id_
    }else if (action == 'cancel') { // 自定义添加
      template.cancelDialogShow = true
      template.$refs.cancelAddressDialog.id = data.id_
    }
    else if(action == 'mapView'){ // 地图模式

    }else if(action == 'allView'){ // 立面图图
      template.$router.push('/ybsswptest/lmtPage?id=' + data.id_)
    }else{
      callback(true) 
    }
  }

});
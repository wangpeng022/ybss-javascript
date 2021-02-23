/*
 * @Descripttion: 实有单位表单脚本
 * @version: 
 * @Author: 王鹏
 * @Date: 2021-02-02 14:49:24
 * @LastEditors: 王鹏
 * @LastEditTime: 2021-02-23 13:26:45
 */
Object.assign(JForm, {
  //加载事件
  onLoad: function (form) {
    let $fn = {
      /**
       * @description: 显示隐藏dom
       * @param {String} selector 类名
       * @param {String} type none | block
       * @return void
       */
      toggle: (selector, type)=> {
        let dom = document.querySelector(selector)
        if (Array.isArray(dom)) {
          dom = dom[0]
        }
        if (dom) {
          dom.style.display = type
        }
      },
      /**
       * @description: 生成uuid
       * @param none
       * @return void
       */
      createUuid: ()=> {
        var s = []
        var hexDigits = '0123456789abcdef'
        for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
        }
        s[14] = '4'
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
        s[8] = s[13] = s[18] = s[23] = '-'
        return s.join('')
      }
    }
    let list = form.$parent.$parent.$parent.$parent
    let type = list.action
    if (type === 'add') {
      form.$refs.dynamicForm.models.id = $fn.createUuid()
      // 隐藏 所在位置详情
      $fn.toggle('.rel-enterprise-block-position-edit', 'none')
      $fn.toggle('.rel-enterprise-block-position-detail', 'none')
      $fn.toggle('.rel-enterprise-block-other', 'none')
    } else if (type === 'edit') {
      // 隐藏 查询按钮 房屋位置下拉
      $fn.toggle('.rel-enterprise-block-btns', 'none')
      $fn.toggle('.rel-enterprise-block-position', 'none')
      // 信用代码 disable
      form.$set(form.$parent.formDef.fields[4].field_options.columns[0].fields[0], 'disabled', true)
      // form.setFormRights('unitCreditCode','r')
    } else if (type === 'detail') {
      // 暂不处理
    }
  },
  //表单按钮前置事件
  beforeSubmit:function(form,action,postValue,callback){
    /**
    * @description: 获取网格options
    * @param {String} code 区域编码
    * @param {Object} target 数据对象
    * @return void
    */
    let customerSave = (data) => {
     this.$request({
       url: '/ybss/v3/relHouseHoldEnterPrise/customerSave',
       method: 'post',
       data: data
     }).then(res => {
       if (res.state === 200) {
         callback(true)
       }else{
        form.$message({
          message: res.message,
          type: 'warning'
        })
       }
     })
   }
   let list = form.$parent.$parent.$parent.$parent
   let type = list.action
    if(action==='save'){
      // console.log(form.$refs.dynamicForm);
      form.$refs.dynamicForm.validate((valid) => { 
        if (valid) {
          if (type === 'add') {
            let model = form.$refs.dynamicForm.models
            let ids = model.houseAddress
            let data = {
              dataSources: 'pc',
              enterpriseId: model.id,
              householdId: ids.split('.').pop()
            }
            customerSave(data)
          }else if(type === 'edit') {
            callback(true) 
          }
        }
      })
    }else{
      callback(true) 
    }
  }
});
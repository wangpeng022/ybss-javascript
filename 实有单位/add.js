/*
 * @Descripttion: 实有单位表单脚本
 * @version: 
 * @Author: 王鹏
 * @Date: 2021-02-02 14:49:24
 * @LastEditors: 王鹏
 * @LastEditTime: 2021-02-03 10:40:13
 */
Object.assign(JForm,{
  //加载事件
  onLoad:function(form){
    // console.log(form.$parent,11111111);
    
    let realEnterPriseFields = form.$parent.formDef.fields
    
    // realEnterPriseFields[2].field_options.columns[0].fields[0].field_options.disabled = true

    // form.$set(form.$parent.formDef.fields[2].field_options.columns[0].fields[0].field_options,'disabled',true)
    form.$set(form.$parent.formDef.fields[4].field_options.columns[0].fields[0].field_options,'readonly',true)

    function toggle (selector, type) {
      let dom = document.querySelector(selector)
      if (Array.isArray(dom)) {
        dom = dom[0]
      }
      if (dom) {
        dom.style.display = type
      }
    }

    // console.log(form,'form');
    let list = form.$parent.$parent.$parent.$parent

    let type = list.action
    // form.$nextTick(function() {
      if(type === 'add'){
        // todo 隐藏 所在位置详情
        toggle('.rel-enterprise-block-position-detail', 'none')
        toggle('.rel-enterprise-block-other', 'none')
      }else if(type === 'edit'){
        // 隐藏 查询按钮 房屋位置下拉
        toggle('.rel-enterprise-block-btns', 'none')
        toggle('.rel-enterprise-block-position', 'none')
        // 信用代码 disable
        let codeInput = document.querySelector('.rel-enterprise-block-code input')
        if (codeInput) {
          codeInput.disabled = true
        }
        
      }else if(type === 'detail'){
        // 暂不处理
      }
    // })
    
  }
});
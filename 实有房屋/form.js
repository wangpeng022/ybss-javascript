/*
 * @Descripttion: 实有房屋表单编辑脚本
 * @version: 
 * @Author: 王鹏
 * @Date: 2021-03-11 14:58:41
 * @LastEditors: 王鹏
 * @LastEditTime: 2021-03-11 15:45:53
 */
Object.assign(JForm,{
  //表单按钮前置事件
   beforeSubmit:function(form,action,postValue,callback){
     if (action === 'save') {
      let formArr = form.getData('t_houseowner')
      console.log(formArr);
      if (formArr && formArr.length>0) {
        for (let i = 0; i < formArr.length; i++) {
          let item = formArr[i];
          if (item.houseownerName===''&&item.houseownerIdcardType===''&&item.houseownerIdcard===''&&item.houseownerTel==='') {
            return form.$message.error('房主信息每行至少填写一条数据!');
          }
          if (i !== 0 && formArr[0].houseownerIdcard && formArr[0].houseownerIdcard === item.houseownerIdcard) {
            return form.$message.error('房主信息不能输入相同证件号码！');
          }
        }
      }
      console.log('通过了');
      
      callback(true)
     }else{
      callback(true) 
     }
   }
 });
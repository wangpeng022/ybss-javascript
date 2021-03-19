/*
 * @Descripttion: 
 * @version: 
 * @Author: 王鹏
 * @Date: 2021-03-10 16:16:40
 * @LastEditors: 王鹏
 * @LastEditTime: 2021-03-10 16:17:01
 */
Object.assign(JForm,{
  //加载事件
  onLoad:function(form){
  let mapData = form.$refs.dynamicForm.$children[0].$children[0].$children[0].$children[0].$children[0].$children[0].$children[1].$children[0]
    mapData.gisLng=form.getData("gisLng")
    mapData.gisLat=form.getData("gisLat")
    mapData.amapLng=form.getData("amapLng")
    mapData.amapLat=form.getData("amapLat")
  }
})
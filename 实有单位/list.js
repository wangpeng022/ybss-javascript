/*
 * @Descripttion: 实有单位模板脚本
 * @version: 
 * @Author: 王鹏
 * @Date: 2021-02-02 19:16:26
 * @LastEditors: 王鹏
 * @LastEditTime: 2021-03-09 10:01:55
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
  },
    //按钮提交前置事件
    beforeSubmit: function (template, action, position, selection, data, callback) {
      if (action === 'import') {
        this.$dialog({
          data() {
            return {
              action: __YBSS_CONFIG__.IMPORT_BASE_URL + "/enterprise_import",
              accept: ".xls,.xlsx"
            }
          },
          methods: {
            beforeUpload(file) {
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 2MB!');
              }
              return isLt2M
            },
            handleSuccess(res, file) {
              if (res.state === 200 ) {
                this.$alert(res.message || '上传成功',{
                  type: 'success',
                  callback: ()=>{
                    template.dialogTemplate = null
                  }
                })
              }
            },
          },
          template: `
          <div>
            <el-upload
              drag
              :action="action"
              :accept="accept"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">仅支持xls或xlsx格式的文件，且不超过2Mb</div>
            </el-upload>
          </div>`
        }, {
          dialog: {
            appendToBody: true,
            width: '410px',
            center: true,
            title: '导入'
          }
        }, (tpl) => {
          template.dialogTemplate = tpl
        }).catch((_this) => {
          _this.visible = false
          template.dialogTemplate = null
        })
      } else if (action === 'mbxz') {
        window.location.href = __YBSS_CONFIG__.DOWNLOAD_BASE_URL + "/实有单位.xlsx"
      } else {
        callback(true)
      }
    }
  });
/*
 * @Descripttion: 实有人口模板脚本
 * @version: 
 * @Author: 王鹏
 * @Date: 2021-01-19 11:02:06
 * @LastEditors: 王鹏
 * @LastEditTime: 2021-03-09 15:04:49
 */
Object.assign(JTemplate, {
  //加载事件
  onLoad: function (template) {
    // code值
    let codes = {
      // 标准地址
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
            //"parameters": [{ "key": "Q^area_code^S", "value": code }],
            //"sorts": [{ "field": "sorts", "order": "asc" }]
            "areaCode": code
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
            }
          }
        }
      });
    }
  },
  //按钮提交前置事件
  beforeSubmit: function (template, action, position, selection, data, callback) {
    if (action === 'add') {
      template.realPersonDialogAddShow = true
    } else if (action === 'edit') {
      template.realPersonDialogEditShow = true
      template.$refs.realPersonDialogEdit.id = data.card_no
    } else if (action === 'detail') {
      template.keyPersonnelDialogDetailShow = true
      // type: 1  关注人员  ； 2 实有人口
      template.$refs.keyPersonnelDialogDetail.type = '2'
      template.$refs.keyPersonnelDialogDetail.rowData = data
      template.keyPersonnelDialogDetailShow = true
    } else if (action === 'import') {
      this.$dialog({
        data() {
          return {
            nation: '1',
            show: false,
            action: __YBSS_CONFIG__.IMPORT_BASE_URL,
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
          <el-row style="margin-bottom:15px;">
            <el-radio v-model="nation" label="1">中国籍</el-radio>
            <el-radio v-model="nation" label="2">外国籍</el-radio>
          </el-row>
          <el-upload
            drag
            :action="action + (nation==='1' ? '/native_population_import' : '/foreign_population_import')"
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
      window.location.href = __YBSS_CONFIG__.DOWNLOAD_BASE_URL + "/实有人口(中国籍).xlsx"
    } else if (action === 'mbxz_w') {
      window.location.href = __YBSS_CONFIG__.DOWNLOAD_BASE_URL + "/实有人口(外国籍).xlsx"
    } else {
      callback(true)
    }
  },
});
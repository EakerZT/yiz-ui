<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Table 表格</h2>
    <p class="demo-section-desc">用于展示多行结构化的数据，支持排序、边框、条纹等。</p>

    <y-card title="基本" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data">
          <y-table-column label="姓名" field="name" width="120px" sortable />
          <y-table-column label="年龄" field="age" width="80px" sortable align="center" />
          <y-table-column label="城市" field="city" width="120px" sortable />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
      </div>
    </y-card>

    <y-card title="边框 + 条纹" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data" bordered stripe>
          <y-table-column label="姓名" field="name" sortable />
          <y-table-column label="年龄" field="age" sortable align="center" />
          <y-table-column label="城市" field="city" sortable />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
      </div>
    </y-card>

    <y-card title="小尺寸" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data" bordered size="small">
          <y-table-column label="姓名" field="name" />
          <y-table-column label="年龄" field="age" align="center" />
          <y-table-column label="城市" field="city" />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
      </div>
    </y-card>

    <y-card title="自定义列渲染 + 插槽" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data" bordered>
          <y-table-column label="姓名" field="name" />
          <y-table-column label="年龄" field="age" align="center">
            <template #default="{ value }">{{ value }} 岁</template>
          </y-table-column>
          <y-table-column label="城市" field="city" />
          <y-table-column label="状态" field="status" align="center">
            <template #default="{ value }">
              <span :style="{ color: value === '启用' ? '#67c23a' : '#f56c6c' }">{{ value }}</span>
            </template>
          </y-table-column>
        </y-table>
      </div>
    </y-card>

    <y-card title="列宽拖动" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data" bordered resize>
          <y-table-column label="姓名" field="name" width="120px" />
          <y-table-column label="年龄" field="age" width="80px" align="center" />
          <y-table-column label="城市" field="city" width="120px" />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
      </div>
    </y-card>

    <y-card title="空数据" style="margin-top: 8px">
      <div style="height: 300px">
        <y-table :data="[]" bordered>
          <y-table-column label="姓名" field="name" />
          <y-table-column label="年龄" field="age" />
          <y-table-column label="城市" field="city" />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
      </div>
    </y-card>

    <y-card title="显示序号" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data" bordered no>
          <y-table-column label="姓名" field="name" />
          <y-table-column label="年龄" field="age" align="center" />
          <y-table-column label="城市" field="city" />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
      </div>
    </y-card>

    <y-card title="拖动约束（minWidth: 100 / maxWidth: 300）" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data" bordered resize>
          <y-table-column label="姓名" field="name" width="150px" :min-width="100" :max-width="300" />
          <y-table-column label="年龄" field="age" width="80px" :min-width="60" :max-width="150" align="center" />
          <y-table-column label="城市" field="city" width="120px" :min-width="80" :max-width="250" />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
      </div>
    </y-card>

    <y-card title="单选" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data" bordered select-mode="single" v-model:selected="singleSelected" @select="onSingleSelect">
          <y-table-column label="姓名" field="name" />
          <y-table-column label="年龄" field="age" align="center" />
          <y-table-column label="城市" field="city" />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
        <p class="demo-table-info">选中值: {{ singleSelected }}</p>
        <p class="demo-table-info">选中行: {{ singleSelectRow ? JSON.stringify(singleSelectRow) : '无' }}</p>
      </div>
    </y-card>

    <y-card title="多选" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data" bordered select-mode="multi" v-model:selected="multiSelected" @select="onMultiSelect">
          <y-table-column label="姓名" field="name" />
          <y-table-column label="年龄" field="age" align="center" />
          <y-table-column label="城市" field="city" />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
        <p class="demo-table-info">选中值: {{ multiSelected }}</p>
        <p class="demo-table-info">选中行: {{ multiSelectRows.length }} 行</p>
      </div>
    </y-card>

    <y-card title="固定列" style="margin-top: 8px">
      <div style="height: 200px">
        <y-table :data="fixedData" bordered resize no select-mode="single">
          <y-table-column label="姓名" field="name" width="120px" fixed="left" />
          <y-table-column label="年龄" field="age" width="80px" align="center" fixed="left" />
          <y-table-column label="部门" field="dept" width="150px" />
          <y-table-column label="职位" field="title" width="150px" />
          <y-table-column label="城市" field="city" width="120px" />
          <y-table-column label="电话" field="phone" width="150px" />
          <y-table-column label="邮箱" field="email" width="200px" />
          <y-table-column label="入职日期" field="date" width="120px" />
          <y-table-column label="操作" field="action" width="100px" align="center" fixed="right" />
        </y-table>
      </div>
    </y-card>

    <y-card title="固定表头" style="margin-top: 8px">
      <div style="height: 300px">
        <y-table :data="tallData" bordered>
          <y-table-column label="姓名" field="name" width="120px" sortable />
          <y-table-column label="年龄" field="age" width="80px" sortable align="center" />
          <y-table-column label="城市" field="city" width="120px" sortable />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
      </div>
    </y-card>

    <y-card title="禁止某些行选择" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table
          :data="data"
          bordered
          select-mode="multi"
          v-model:selected="disabledSelected"
          :select-disabled="isSelectDisabled"
        >
          <y-table-column label="姓名" field="name" />
          <y-table-column label="年龄" field="age" align="center" />
          <y-table-column label="城市" field="city" />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
        <p class="demo-table-info">选中值: {{ disabledSelected }}</p>
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Row {
  name: string
  age: number
  city: string
  status: string
}

const data: Row[] = [
  { name: '张三', age: 28, city: '北京', status: '启用' },
  { name: '李四', age: 35, city: '上海', status: '禁用' },
  { name: '王五', age: 22, city: '广州', status: '启用' },
  { name: '赵六', age: 30, city: '深圳', status: '启用' },
  { name: '孙七', age: 41, city: '杭州', status: '禁用' }
]

interface FixedRow {
  name: string
  age: number
  dept: string
  title: string
  city: string
  phone: string
  email: string
  date: string
  action: string
}

const fixedData: FixedRow[] = [
  {
    name: '张三',
    age: 28,
    dept: '技术部',
    title: '前端开发',
    city: '北京',
    phone: '13800138001',
    email: 'zhangsan@test.com',
    date: '2022-03-15',
    action: '编辑'
  },
  {
    name: '李四',
    age: 35,
    dept: '产品部',
    title: '产品经理',
    city: '上海',
    phone: '13800138002',
    email: 'lisi@test.com',
    date: '2020-07-01',
    action: '编辑'
  },
  {
    name: '王五',
    age: 22,
    dept: '技术部',
    title: '后端开发',
    city: '广州',
    phone: '13800138003',
    email: 'wangwu@test.com',
    date: '2024-01-10',
    action: '编辑'
  },
  {
    name: '赵六',
    age: 30,
    dept: '设计部',
    title: 'UI设计',
    city: '深圳',
    phone: '13800138004',
    email: 'zhaoliu@test.com',
    date: '2021-06-20',
    action: '编辑'
  },
  {
    name: '孙七',
    age: 41,
    dept: '技术部',
    title: '架构师',
    city: '杭州',
    phone: '13800138005',
    email: 'sunqi@test.com',
    date: '2019-09-01',
    action: '编辑'
  }
]

const tallData: Row[] = [
  { name: '张三', age: 28, city: '北京', status: '启用' },
  { name: '李四', age: 35, city: '上海', status: '禁用' },
  { name: '王五', age: 22, city: '广州', status: '启用' },
  { name: '赵六', age: 30, city: '深圳', status: '启用' },
  { name: '孙七', age: 41, city: '杭州', status: '禁用' },
  { name: '周八', age: 27, city: '成都', status: '启用' },
  { name: '吴九', age: 33, city: '武汉', status: '禁用' },
  { name: '郑十', age: 29, city: '南京', status: '启用' },
  { name: '冯一', age: 36, city: '天津', status: '启用' },
  { name: '陈二', age: 24, city: '重庆', status: '禁用' },
  { name: '褚三', age: 31, city: '西安', status: '启用' },
  { name: '卫四', age: 39, city: '长沙', status: '启用' },
  { name: '蒋五', age: 26, city: '苏州', status: '禁用' },
  { name: '沈六', age: 42, city: '东莞', status: '启用' },
  { name: '韩七', age: 23, city: '青岛', status: '禁用' }
]

const singleSelected = ref(null)
const multiSelected = ref([])
const disabledSelected = ref([])

const singleSelectRow = ref<Row | null>(null)
function onSingleSelect(selected: any) {
  singleSelectRow.value = selected
}

const multiSelectRows = ref<Row[]>([])
function onMultiSelect(selected: any) {
  multiSelectRows.value = selected ?? []
}

function isSelectDisabled(row: Row, _index: number) {
  return row.status === '禁用'
}
</script>

<style scoped>
.demo-table-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}
.demo-table-info + .demo-table-info {
  margin-top: 4px;
}
</style>

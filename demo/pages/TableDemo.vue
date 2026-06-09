<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Table 表格</h2>
    <p class="demo-section-desc">用于展示多行结构化的数据，支持排序、边框、条纹等。</p>

    <div class="demo-row" style="flex-direction: column; align-items: stretch; gap: 20px">
      <div style="width: 100%">
        <y-table :data="data">
          <y-table-column label="姓名" field="name" width="120px" sortable />
          <y-table-column label="年龄" field="age" width="80px" sortable align="center" />
          <y-table-column label="城市" field="city" width="120px" sortable />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
      </div>
    </div>

    <div class="demo-row" style="flex-direction: column; align-items: stretch; gap: 20px; margin-top: 24px">
      <span class="demo-label" style="text-align: left; width: auto">边框 + 条纹</span>
      <div style="width: 100%">
        <y-table :data="data" bordered stripe>
          <y-table-column label="姓名" field="name" sortable />
          <y-table-column label="年龄" field="age" sortable align="center" />
          <y-table-column label="城市" field="city" sortable />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
      </div>
    </div>

    <div class="demo-row" style="flex-direction: column; align-items: stretch; gap: 20px; margin-top: 24px">
      <span class="demo-label" style="text-align: left; width: auto">小尺寸</span>
      <div style="width: 100%">
        <y-table :data="data" bordered size="small">
          <y-table-column label="姓名" field="name" />
          <y-table-column label="年龄" field="age" align="center" />
          <y-table-column label="城市" field="city" />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
      </div>
    </div>

    <div class="demo-row" style="flex-direction: column; align-items: stretch; gap: 20px; margin-top: 24px">
      <span class="demo-label" style="text-align: left; width: auto">自定义列渲染 + 插槽</span>
      <div style="width: 100%">
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
    </div>

    <div class="demo-row" style="flex-direction: column; align-items: stretch; gap: 20px; margin-top: 24px">
      <span class="demo-label" style="text-align: left; width: auto">列宽拖动</span>
      <div style="width: 100%">
        <y-table :data="data" bordered resize>
          <y-table-column label="姓名" field="name" width="120px" />
          <y-table-column label="年龄" field="age" width="80px" align="center" />
          <y-table-column label="城市" field="city" width="120px" />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
      </div>
    </div>

    <div class="demo-row" style="flex-direction: column; align-items: stretch; gap: 20px; margin-top: 24px">
      <span class="demo-label" style="text-align: left; width: auto">空数据</span>
      <div style="width: 100%">
        <y-table :data="[]" bordered>
          <y-table-column label="姓名" field="name" />
          <y-table-column label="年龄" field="age" />
          <y-table-column label="城市" field="city" />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
      </div>
    </div>

    <div class="demo-row" style="flex-direction: column; align-items: stretch; gap: 20px; margin-top: 24px">
      <span class="demo-label" style="text-align: left; width: auto">显示序号</span>
      <div style="width: 100%">
        <y-table :data="data" bordered no>
          <y-table-column label="姓名" field="name" />
          <y-table-column label="年龄" field="age" align="center" />
          <y-table-column label="城市" field="city" />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
      </div>
    </div>

    <div class="demo-row" style="flex-direction: column; align-items: stretch; gap: 20px; margin-top: 24px">
      <span class="demo-label" style="text-align: left; width: auto">拖动约束（minWidth: 100 / maxWidth: 300）</span>
      <div style="width: 100%">
        <y-table :data="data" bordered resize>
          <y-table-column label="姓名" field="name" width="150px" :min-width="100" :max-width="300" />
          <y-table-column label="年龄" field="age" width="80px" :min-width="60" :max-width="150" align="center" />
          <y-table-column label="城市" field="city" width="120px" :min-width="80" :max-width="250" />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
      </div>
    </div>

    <div class="demo-row" style="flex-direction: column; align-items: stretch; gap: 20px; margin-top: 24px">
      <span class="demo-label" style="text-align: left; width: auto">单选</span>
      <div style="width: 100%">
        <y-table :data="data" bordered select-mode="single" v-model:selected="singleSelected" resize>
          <y-table-column label="姓名" field="name" />
          <y-table-column label="年龄" field="age" align="center" />
          <y-table-column label="城市" field="city" />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
        <p style="margin-top: 8px; color: #666">选中值: {{ singleSelected }}</p>
      </div>
    </div>

    <div class="demo-row" style="flex-direction: column; align-items: stretch; gap: 20px; margin-top: 24px">
      <span class="demo-label" style="text-align: left; width: auto">多选</span>
      <div style="width: 100%">
        <y-table :data="data" bordered select-mode="multi" v-model:selected="multiSelected" resize>
          <y-table-column label="姓名" field="name" />
          <y-table-column label="年龄" field="age" align="center" />
          <y-table-column label="城市" field="city" />
          <y-table-column label="状态" field="status" align="center" />
        </y-table>
        <p style="margin-top: 8px; color: #666">选中值: {{ multiSelected }}</p>
      </div>
    </div>
    <div class="demo-row" style="flex-direction: column; align-items: stretch; gap: 20px; margin-top: 24px">
      <span class="demo-label" style="text-align: left; width: auto">固定列</span>
      <div style="width: 100%">
        <y-table :data="fixedData" bordered resize no selectMode="single">
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
    </div>
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

const singleSelected = ref(null)
const multiSelected = ref([])
</script>

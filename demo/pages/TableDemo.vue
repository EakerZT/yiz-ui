<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.table') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.table.desc') }}</p>

    <y-card :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data">
          <y-table-column :label="$t('demo.common.name')" field="name" width="120px" sortable />
          <y-table-column :label="$t('demo.common.age')" field="age" width="80px" sortable align="center" />
          <y-table-column :label="$t('demo.common.city')" field="city" width="120px" sortable />
          <y-table-column :label="$t('demo.common.status')" field="status" align="center" />
        </y-table>
      </div>
    </y-card>

    <y-card :title="$t('demo.table.borderedStripe')" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data" bordered stripe>
          <y-table-column :label="$t('demo.common.name')" field="name" sortable />
          <y-table-column :label="$t('demo.common.age')" field="age" sortable align="center" />
          <y-table-column :label="$t('demo.common.city')" field="city" sortable />
          <y-table-column :label="$t('demo.common.status')" field="status" align="center" />
        </y-table>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.smallSize')" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data" bordered size="small">
          <y-table-column :label="$t('demo.common.name')" field="name" />
          <y-table-column :label="$t('demo.common.age')" field="age" align="center" />
          <y-table-column :label="$t('demo.common.city')" field="city" />
          <y-table-column :label="$t('demo.common.status')" field="status" align="center" />
        </y-table>
      </div>
    </y-card>

    <y-card :title="$t('demo.table.customColumn')" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data" bordered>
          <y-table-column :label="$t('demo.common.name')" field="name" />
          <y-table-column :label="$t('demo.common.age')" field="age" align="center">
            <template #default="{ value }">{{ $t('demo.table.ageTemplate', { value }) }}</template>
          </y-table-column>
          <y-table-column :label="$t('demo.common.city')" field="city" />
          <y-table-column :label="$t('demo.common.status')" field="status" align="center">
            <template #default="{ value }">
              <LinkButton v-if="value === $t('demo.common.disabled')">{{ $t('demo.common.enabled') }}</LinkButton>
              <LinkButton v-else color="error">{{ $t('demo.common.disabled') }}</LinkButton>
            </template>
          </y-table-column>
        </y-table>
      </div>
    </y-card>

    <y-card :title="$t('demo.table.formatter')" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data" bordered>
          <y-table-column :label="$t('demo.common.name')" field="name" />
          <y-table-column :label="$t('demo.common.age')" field="age" align="center" :formater="formatAge" />
          <y-table-column :label="$t('demo.common.city')" field="city" />
          <y-table-column :label="$t('demo.common.status')" field="status" align="center" :formater="formatStatus" />
        </y-table>
      </div>
    </y-card>

    <y-card :title="$t('demo.table.columnResize')" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data" bordered resize>
          <y-table-column :label="$t('demo.common.name')" field="name" width="120px" />
          <y-table-column :label="$t('demo.common.age')" field="age" width="80px" align="center" />
          <y-table-column :label="$t('demo.common.city')" field="city" width="120px" />
          <y-table-column :label="$t('demo.common.status')" field="status" align="center" />
        </y-table>
      </div>
    </y-card>

    <y-card :title="$t('demo.table.emptyData')" style="margin-top: 8px">
      <div style="height: 300px">
        <y-table :data="[]" bordered>
          <y-table-column :label="$t('demo.common.name')" field="name" />
          <y-table-column :label="$t('demo.common.age')" field="age" />
          <y-table-column :label="$t('demo.common.city')" field="city" />
          <y-table-column :label="$t('demo.common.status')" field="status" align="center" />
        </y-table>
      </div>
    </y-card>

    <y-card :title="$t('demo.table.showRowNumber')" style="margin-top: 8px">
      <div style="height: 250px">
        <table-box :value="data">
          <y-table-column :label="$t('demo.common.name')" field="name" />
          <y-table-column :label="$t('demo.common.age')" field="age" align="center" />
          <y-table-column :label="$t('demo.common.city')" field="city" />
          <y-table-column :label="$t('demo.common.status')" field="status" align="center" />
        </table-box>
      </div>
    </y-card>

    <y-card :title="$t('demo.table.resizeConstraint')" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data" bordered resize>
          <y-table-column
            :label="$t('demo.common.name')"
            field="name"
            width="150px"
            :min-width="100"
            :max-width="300"
          />
          <y-table-column
            :label="$t('demo.common.age')"
            field="age"
            width="80px"
            :min-width="60"
            :max-width="150"
            align="center"
          />
          <y-table-column :label="$t('demo.common.city')" field="city" width="120px" :min-width="80" :max-width="250" />
          <y-table-column :label="$t('demo.common.status')" field="status" align="center" />
        </y-table>
      </div>
    </y-card>

    <y-card :title="$t('demo.table.singleSelect')" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data" bordered select-mode="single" v-model:selected="singleSelected" @select="onSingleSelect">
          <y-table-column :label="$t('demo.common.name')" field="name" />
          <y-table-column :label="$t('demo.common.age')" field="age" align="center" />
          <y-table-column :label="$t('demo.common.city')" field="city" />
          <y-table-column :label="$t('demo.common.status')" field="status" align="center" />
        </y-table>
        <p class="demo-table-info">{{ $t('demo.table.selectedValue', { value: singleSelected ?? '' }) }}</p>
        <p class="demo-table-info">
          {{
            $t('demo.table.selectedValue', {
              value: singleSelectRow ? JSON.stringify(singleSelectRow) : $t('demo.common.none')
            })
          }}
        </p>
      </div>
    </y-card>

    <y-card :title="$t('demo.table.multiSelect')" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table :data="data" bordered select-mode="multi" v-model:selected="multiSelected" @select="onMultiSelect">
          <y-table-column :label="$t('demo.common.name')" field="name" />
          <y-table-column :label="$t('demo.common.age')" field="age" align="center" />
          <y-table-column :label="$t('demo.common.city')" field="city" />
          <y-table-column :label="$t('demo.common.status')" field="status" align="center" />
        </y-table>
        <p class="demo-table-info">{{ $t('demo.table.selectedValue', { value: multiSelected.join(', ') }) }}</p>
        <p class="demo-table-info">{{ $t('demo.table.selectedCount', { count: multiSelectRows.length }) }}</p>
      </div>
    </y-card>

    <y-card :title="$t('demo.table.fixedColumns')" style="margin-top: 8px">
      <div style="height: 200px">
        <y-table :data="fixedData" bordered resize no select-mode="single">
          <y-table-column :label="$t('demo.common.name')" field="name" width="120px" fixed="left" />
          <y-table-column :label="$t('demo.common.age')" field="age" width="80px" align="center" fixed="left" />
          <y-table-column :label="$t('demo.common.department')" field="dept" width="150px" />
          <y-table-column :label="$t('demo.common.position')" field="title" width="150px" />
          <y-table-column :label="$t('demo.common.city')" field="city" width="120px" />
          <y-table-column :label="$t('demo.common.phone')" field="phone" width="150px" />
          <y-table-column :label="$t('demo.common.email')" field="email" width="200px" />
          <y-table-column :label="$t('demo.common.hireDate')" field="date" width="120px" />
          <y-table-column :label="$t('demo.common.action')" field="action" width="100px" align="center" fixed="right" />
        </y-table>
      </div>
    </y-card>

    <y-card :title="$t('demo.table.fixedHeader')" style="margin-top: 8px">
      <div style="height: 300px">
        <y-table :data="tallData" bordered>
          <y-table-column :label="$t('demo.common.name')" field="name" width="120px" sortable />
          <y-table-column :label="$t('demo.common.age')" field="age" width="80px" sortable align="center" />
          <y-table-column :label="$t('demo.common.city')" field="city" width="120px" sortable />
          <y-table-column :label="$t('demo.common.status')" field="status" align="center" />
        </y-table>
      </div>
    </y-card>

    <y-card :title="$t('demo.table.disableRows')" style="margin-top: 8px">
      <div style="height: 250px">
        <y-table
          :data="data"
          bordered
          select-mode="multi"
          v-model:selected="disabledSelected"
          :select-disabled="isSelectDisabled"
        >
          <y-table-column :label="$t('demo.common.name')" field="name" />
          <y-table-column :label="$t('demo.common.age')" field="age" align="center" />
          <y-table-column :label="$t('demo.common.city')" field="city" />
          <y-table-column :label="$t('demo.common.status')" field="status" align="center" />
        </y-table>
        <p class="demo-table-info">{{ $t('demo.table.selectedValue', { value: disabledSelected.join(', ') }) }}</p>
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { computed, ref } from 'vue'
import { LinkButton } from 'yiz-ui'
import TableBox from '../components/TableBox.vue'

interface Row {
  name: string
  age: number
  city: string
  status: string
}

const data = computed<Row[]>(() => [
  {
    name: $t('demo.common.personZhangsan'),
    age: 28,
    city: $t('demo.common.beijing'),
    status: $t('demo.common.enabled')
  },
  { name: $t('demo.common.personLisi'), age: 35, city: $t('demo.common.shanghai'), status: $t('demo.common.disabled') },
  {
    name: $t('demo.common.personWangwu'),
    age: 22,
    city: $t('demo.common.guangzhou'),
    status: $t('demo.common.enabled')
  },
  {
    name: $t('demo.common.personZhaoliu'),
    age: 30,
    city: $t('demo.common.shenzhen'),
    status: $t('demo.common.enabled')
  },
  { name: $t('demo.common.personSunqi'), age: 41, city: $t('demo.common.hangzhou'), status: $t('demo.common.disabled') }
])

function formatAge(value: number) {
  return $t('demo.table.ageTemplate', { value })
}

function formatStatus(value: string, _row: Row, index: number) {
  return `${index + 1}. ${value}`
}

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

const fixedData = computed<FixedRow[]>(() => [
  {
    name: $t('demo.common.personZhangsan'),
    age: 28,
    dept: $t('demo.common.deptEngineering'),
    title: $t('demo.common.roleFrontend'),
    city: $t('demo.common.beijing'),
    phone: '13800138001',
    email: 'zhangsan@test.com',
    date: '2022-03-15',
    action: $t('demo.common.edit')
  },
  {
    name: $t('demo.common.personLisi'),
    age: 35,
    dept: $t('demo.common.deptProduct'),
    title: $t('demo.common.rolePm'),
    city: $t('demo.common.shanghai'),
    phone: '13800138002',
    email: 'lisi@test.com',
    date: '2020-07-01',
    action: $t('demo.common.edit')
  },
  {
    name: $t('demo.common.personWangwu'),
    age: 22,
    dept: $t('demo.common.deptEngineering'),
    title: $t('demo.common.roleBackend'),
    city: $t('demo.common.guangzhou'),
    phone: '13800138003',
    email: 'wangwu@test.com',
    date: '2024-01-10',
    action: $t('demo.common.edit')
  },
  {
    name: $t('demo.common.personZhaoliu'),
    age: 30,
    dept: $t('demo.common.deptDesign'),
    title: $t('demo.common.roleDesigner'),
    city: $t('demo.common.shenzhen'),
    phone: '13800138004',
    email: 'zhaoliu@test.com',
    date: '2021-06-20',
    action: $t('demo.common.edit')
  },
  {
    name: $t('demo.common.personSunqi'),
    age: 41,
    dept: $t('demo.common.deptEngineering'),
    title: $t('demo.common.roleArchitect'),
    city: $t('demo.common.hangzhou'),
    phone: '13800138005',
    email: 'sunqi@test.com',
    date: '2019-09-01',
    action: $t('demo.common.edit')
  }
])

const tallData = computed<Row[]>(() =>[
  {
    name: $t('demo.common.personZhangsan'),
    age: 28,
    city: $t('demo.common.beijing'),
    status: $t('demo.common.enabled')
  },
  { name: $t('demo.common.personLisi'), age: 35, city: $t('demo.common.shanghai'), status: $t('demo.common.disabled') },
  {
    name: $t('demo.common.personWangwu'),
    age: 22,
    city: $t('demo.common.guangzhou'),
    status: $t('demo.common.enabled')
  },
  {
    name: $t('demo.common.personZhaoliu'),
    age: 30,
    city: $t('demo.common.shenzhen'),
    status: $t('demo.common.enabled')
  },
  {
    name: $t('demo.common.personSunqi'),
    age: 41,
    city: $t('demo.common.hangzhou'),
    status: $t('demo.common.disabled')
  },
  { name: $t('demo.common.personZhouba'), age: 27, city: $t('demo.common.chengdu'), status: $t('demo.common.enabled') },
  { name: $t('demo.common.personWujiu'), age: 33, city: $t('demo.common.wuhan'), status: $t('demo.common.disabled') },
  {
    name: $t('demo.common.personZhengshi'),
    age: 29,
    city: $t('demo.common.nanjing'),
    status: $t('demo.common.enabled')
  },
  { name: $t('demo.common.personFengyi'), age: 36, city: $t('demo.common.tianjin'), status: $t('demo.common.enabled') },
  {
    name: $t('demo.common.personChener'),
    age: 24,
    city: $t('demo.common.chongqing'),
    status: $t('demo.common.disabled')
  },
  { name: $t('demo.common.personChusan'), age: 31, city: $t('demo.common.xian'), status: $t('demo.common.enabled') },
  { name: $t('demo.common.personWeisi'), age: 39, city: $t('demo.common.changsha'), status: $t('demo.common.enabled') },
  {
    name: $t('demo.common.personJiangwu'),
    age: 26,
    city: $t('demo.common.suzhou'),
    status: $t('demo.common.disabled')
  },
  {
    name: $t('demo.common.personShenliu'),
    age: 42,
    city: $t('demo.common.dongguan'),
    status: $t('demo.common.enabled')
  },
  { name: $t('demo.common.personHanqi'), age: 23, city: $t('demo.common.qingdao'), status: $t('demo.common.disabled') }
])

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
  return row.status === $t('demo.common.disabled')
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

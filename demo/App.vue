<template>
  <div>
    <div style="width:100%">
      <div>
        <y-button @click="c++">点击</y-button>
      </div>
      <div style="display: flex;flex-direction: row;gap: 8px;margin-top: 8px">
        <div>
          <y-button>点击</y-button>
        </div>
        <div>
          <y-button color="success">次数:{{ c }}</y-button>
        </div>
        <div>
          <y-button color="error">点击次数:{{ c }}</y-button>
        </div>
        <div>
          <y-button color="warning">点击次数:{{ c }}</y-button>
        </div>
        <div>
          <y-button color="#8a2be2">点击次数:{{ c }}</y-button>
        </div>
        <div>
          <y-button disabled>点击次数:{{ c }}</y-button>
        </div>
        <div>
          <y-button color="#8a2be2" shape="round">点击次数:{{ c }}</y-button>
        </div>
        <div>
          <y-button shape="circle">{{ c }}</y-button>
        </div>
      </div>
      <div style="display: flex;flex-direction: row;gap: 8px;margin-top: 8px">
        <div>
          <y-button type="primary">点击</y-button>
        </div>
        <div>
          <y-button type="primary" color="success">次数:{{ c }}</y-button>
        </div>
        <div>
          <y-button type="primary" color="error">点击次数:{{ c }}</y-button>
        </div>
        <div>
          <y-button type="primary" color="warning">点击次数:{{ c }}</y-button>
        </div>
        <div>
          <y-button type="primary" color="#8a2be2">
            <y-icon :icon="Flash20Regular"/>
            点击次数:{{ c }}
          </y-button>
        </div>
        <div>
          <y-button type="primary" disabled>点击次数:{{ c }}</y-button>
        </div>
        <div>
          <y-button type="primary" color="#8a2be2" shape="round">点击次数:{{ c }}</y-button>
        </div>
        <div>
          <y-button type="primary" shape="circle">
            <y-icon :icon="Flash20Regular"/>
          </y-button>
        </div>
      </div>
      <div style="display: flex;flex-direction: row;gap: 8px;margin-top: 8px">
        <div>
          <y-button type="plain">点击</y-button>
        </div>
        <div>
          <y-button type="plain" color="success">次数:{{ c }}</y-button>
        </div>
        <div>
          <y-button type="plain" color="error">点击次数:{{ c }}</y-button>
        </div>
        <div>
          <y-button type="plain" color="warning">点击次数:{{ c }}</y-button>
        </div>
        <div>
          <y-button type="plain" color="#8a2be2">
            <y-icon :icon="Flash20Regular"/>
            点击次数:{{ c }}
            <y-icon :icon="Flash20Regular"/>
            点击次数:{{ c }}
          </y-button>
        </div>
        <div>
          <y-button type="plain" disabled>点击次数:{{ c }}</y-button>
        </div>
        <div>
          <y-button type="plain" shape="round">点击次数:{{ c }}</y-button>
        </div>
        <div>
          <y-button type="plain" shape="circle">
            {{ c }}
          </y-button>
        </div>
      </div>
    </div>
    <div style="margin-top:8px;">
      <y-button type="plain" color="error">点击次数:{{ c }}</y-button>
      <y-button type="plain" color="warning">点击次数:{{ c }}</y-button>
    </div>
    <div style="margin-top:8px;">
      <y-input clearable v-model:value="testText" :suffix="c.toString()" placeholder="123" style="width:180px">
        <template #prefix>
          <y-icon :icon="Flash20Regular"/>
        </template>
      </y-input>
    </div>
    {{testText}}
    <div style="margin-top:8px;">
      <y-icon :icon="Flash20Regular"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {Flash20Regular} from '@vicons/fluent'

const c = ref(0)
const testText = ref('')
</script>
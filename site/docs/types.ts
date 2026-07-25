import type { Component } from 'vue'

export interface DemoDefinition {
  titleKey: string
  descriptionKey?: string
  component: Component
  source: string
}

export interface ApiItem {
  name: string
  type: string
  description: string
  descriptionEn: string
  default?: string
  required?: boolean
}

export interface ComponentApi {
  name: string
  source: string
  props: ApiItem[]
  models: ApiItem[]
  events: ApiItem[]
  slots: ApiItem[]
  methods: ApiItem[]
}

<template>
  <component :is="renderTrigger()" />
  <input
    ref="inputRef"
    class="yiz-upload-input"
    type="file"
    :accept="accept"
    :multiple="multiple"
    @change="onFileChange"
  />
</template>

<script lang="ts" setup>
import { cloneVNode, h, ref, useSlots, type VNode } from 'vue'
import { findFirstTriggerVNode } from '../triggerVNode'

const props = withDefaults(
  defineProps<{
    accept?: string
    multiple?: boolean
    allowDrag?: boolean
    disabled?: boolean
  }>(),
  {
    accept: '',
    multiple: false,
    allowDrag: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  upload: [files: File[], event: Event]
}>()

defineSlots<{
  default?: any
}>()

const slots = useSlots()
const inputRef = ref<HTMLInputElement>()
const triggerRef = ref<HTMLElement>()

function updateTriggerElement(vnode: VNode) {
  triggerRef.value = vnode.el instanceof HTMLElement ? vnode.el : undefined
}

function clearTriggerElement(vnode: VNode) {
  if (triggerRef.value === vnode.el) triggerRef.value = undefined
}

function renderTrigger(): VNode {
  const child = findFirstTriggerVNode(slots.default?.() ?? [])
  const listeners = {
    onClick: onClick,
    onDragenter: onDragEnter,
    onDragover: onDragOver,
    onDrop: onDrop,
    tabindex: props.disabled ? -1 : 0,
    onVnodeMounted: updateTriggerElement,
    onVnodeUpdated: updateTriggerElement,
    onVnodeBeforeUnmount: clearTriggerElement,
  }
  if (child) return cloneVNode(child, listeners)
  return h('span', listeners)
}

function onClick() {
  if (props.disabled) return
  inputRef.value?.click()
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  emitFiles(input.files, event)
  input.value = ''
}

function onDragEnter(event: DragEvent) {
  if (!props.allowDrag || props.disabled) return
  event.preventDefault()
}

function onDragOver(event: DragEvent) {
  if (!props.allowDrag || props.disabled) return
  event.preventDefault()
}

function onDrop(event: DragEvent) {
  if (!props.allowDrag || props.disabled) return
  event.preventDefault()
  emitFiles(event.dataTransfer?.files, event)
}

function emitFiles(fileList: FileList | null | undefined, event: Event) {
  const files = normalizeFiles(fileList)
  if (files.length === 0) return
  emit('upload', files, event)
}

function normalizeFiles(fileList: FileList | null | undefined) {
  if (!fileList) return []
  const files = Array.from(fileList).filter(matchAccept)
  return props.multiple ? files : files.slice(0, 1)
}

function matchAccept(file: File) {
  const acceptList = props.accept
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  if (acceptList.length === 0) return true

  const fileName = file.name.toLowerCase()
  const fileType = file.type.toLowerCase()
  return acceptList.some((accept) => {
    const value = accept.toLowerCase()
    if (value.startsWith('.')) return fileName.endsWith(value)
    if (value.endsWith('/*')) return fileType.startsWith(value.slice(0, -1))
    return fileType === value
  })
}

defineExpose({
  focus: () => {
    if (!props.disabled) triggerRef.value?.focus()
  },
  blur: () => triggerRef.value?.blur(),
})
</script>

<style lang="less">
.yiz-upload-input {
  display: none;
}
</style>

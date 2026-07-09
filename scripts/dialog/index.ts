import Dialog from './Dialog.vue'
import { confirm, useDialog } from './confirm'

const DialogWithConfirm = Object.assign(Dialog, {
  confirm,
})

export { DialogWithConfirm as Dialog }
export { confirm as dialogConfirm, useDialog }
export type { DialogApi, DialogConfirmHandle, DialogConfirmOptions, DialogConfirmType } from './confirm'

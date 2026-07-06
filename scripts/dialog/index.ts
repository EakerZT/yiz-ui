import Dialog from './Dialog.vue'
import { confirm } from './confirm'

const DialogWithConfirm = Object.assign(Dialog, {
  confirm,
})

export { DialogWithConfirm as Dialog }
export { confirm as dialogConfirm }
export type { DialogConfirmHandle, DialogConfirmOptions, DialogConfirmType } from './confirm'

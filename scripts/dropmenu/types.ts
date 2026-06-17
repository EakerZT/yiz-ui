export interface DropmenuOption {
  label: string
  key: any
  type?: 'item' | 'divider'
  children?: DropmenuOption[]
  icon?: string | (() => any) | any
  disabled?: boolean
}

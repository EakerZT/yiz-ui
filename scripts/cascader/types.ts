export type CascaderValue = string | number

export interface CascaderOption {
  label: string
  value: CascaderValue
  disabled?: boolean
  children?: CascaderOption[]
}

export interface MenuItemOption {
  type?: 'item'
  label: string
  key: any
  children?: MenuEntry[]
  icon?: string | (() => any) | any
}

export interface MenuDividerOption {
  type: 'divider'
  name?: string
  key?: any
  label?: never
  children?: never
  icon?: never
}

export type MenuEntry = MenuItemOption | MenuDividerOption

export function isMenuDivider(item: MenuEntry): item is MenuDividerOption {
  return item.type === 'divider'
}

import type {
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  CheckboxGroup,
  ColorPicker,
  ContextMenu,
  ContextMenuOption,
  DatePicker,
  DateRangePicker,
  Dialog,
  Drawer,
  Empty,
  Form,
  FormItem,
  Icon,
  Input,
  InputPassword,
  InputNumber,
  LinkButton,
  Loading,
  Menu,
  MenuOption,
  Pagination,
  Radio,
  RadioButton,
  RadioButtonGroup,
  RadioGroup,
  ScrollBox,
  Select,
  SelectOption,
  Switch,
  Tab,
  TabPane,
  Table,
  TableColumn,
  Tag,
  TimePicker,
  TimeRangePicker,
  Tooltip,
  Tree
} from './components'

declare module 'vue' {
  export interface GlobalComponents {
    YButton: typeof Button
    'y-button': typeof Button
    YButtonGroup: typeof ButtonGroup
    'y-button-group': typeof ButtonGroup
    YCard: typeof Card
    'y-card': typeof Card
    YCheckbox: typeof Checkbox
    'y-checkbox': typeof Checkbox
    YCheckboxGroup: typeof CheckboxGroup
    'y-checkbox-group': typeof CheckboxGroup
    YColorPicker: typeof ColorPicker
    'y-color-picker': typeof ColorPicker
    YContextMenu: typeof ContextMenu
    'y-context-menu': typeof ContextMenu
    YContextMenuOption: typeof ContextMenuOption
    'y-context-menu-option': typeof ContextMenuOption
    YDatePicker: typeof DatePicker
    'y-date-picker': typeof DatePicker
    YDateRangePicker: typeof DateRangePicker
    'y-date-range-picker': typeof DateRangePicker
    YDialog: typeof Dialog
    'y-dialog': typeof Dialog
    YDrawer: typeof Drawer
    'y-drawer': typeof Drawer
    YEmpty: typeof Empty
    'y-empty': typeof Empty
    YForm: typeof Form
    'y-form': typeof Form
    YFormItem: typeof FormItem
    'y-form-item': typeof FormItem
    YIcon: typeof Icon
    'y-icon': typeof Icon
    YInput: typeof Input
    'y-input': typeof Input
    YInputPassword: typeof InputPassword
    'y-input-password': typeof InputPassword
    YInputNumber: typeof InputNumber
    'y-input-number': typeof InputNumber
    YLinkButton: typeof LinkButton
    'y-link-button': typeof LinkButton
    YLoading: typeof Loading
    'y-loading': typeof Loading
    YMenu: typeof Menu
    'y-menu': typeof Menu
    YMenuOption: typeof MenuOption
    'y-menu-option': typeof MenuOption
    YPagination: typeof Pagination
    'y-pagination': typeof Pagination
    YRadio: typeof Radio
    'y-radio': typeof Radio
    YRadioButton: typeof RadioButton
    'y-radio-button': typeof RadioButton
    YRadioButtonGroup: typeof RadioButtonGroup
    'y-radio-button-group': typeof RadioButtonGroup
    YRadioGroup: typeof RadioGroup
    'y-radio-group': typeof RadioGroup
    YScrollBox: typeof ScrollBox
    'y-scroll-box': typeof ScrollBox
    YSelect: typeof Select
    'y-select': typeof Select
    YSelectOption: typeof SelectOption
    'y-select-option': typeof SelectOption
    YSwitch: typeof Switch
    'y-switch': typeof Switch
    YTab: typeof Tab
    'y-tab': typeof Tab
    YTabPane: typeof TabPane
    'y-tab-pane': typeof TabPane
    YTable: typeof Table
    'y-table': typeof Table
    YTableColumn: typeof TableColumn
    'y-table-column': typeof TableColumn
    YTag: typeof Tag
    'y-tag': typeof Tag
    YTimePicker: typeof TimePicker
    'y-time-picker': typeof TimePicker
    YTimeRangePicker: typeof TimeRangePicker
    'y-time-range-picker': typeof TimeRangePicker
    YTooltip: typeof Tooltip
    'y-tooltip': typeof Tooltip
    YTree: typeof Tree
    'y-tree': typeof Tree
  }
}

export {}

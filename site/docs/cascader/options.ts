import { computed } from 'vue'
import { useLocale, type CascaderOption } from 'yiz-ui'

export function useOptions() {
  const t = useLocale()
  return computed<CascaderOption[]>(() => [
    {
      label: t('demo.cascader.devices'),
      value: 'devices',
      children: [
        {
          label: t('demo.cascader.computers'),
          value: 'computers',
          children: [
            { label: t('demo.cascader.laptop'), value: 'laptop' },
            { label: t('demo.cascader.desktop'), value: 'desktop', disabled: true }
          ]
        },
        { label: t('demo.cascader.phone'), value: 'phone' }
      ]
    },
    {
      label: t('demo.cascader.services'),
      value: 'services',
      children: [{ label: t('demo.cascader.support'), value: 'support' }]
    },
    {
      label: t('demo.cascader.disabled'),
      value: 'disabled',
      disabled: true,
      children: [{ label: t('demo.cascader.support'), value: 'support' }]
    }
  ])
}

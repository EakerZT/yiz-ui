import { Comment, Fragment, Text, h, isVNode, type VNode } from 'vue'

export function findFirstTriggerVNode(nodes: readonly unknown[]): VNode | undefined {
  for (const node of nodes) {
    if (Array.isArray(node)) {
      const child = findFirstTriggerVNode(node)
      if (child) return child
      continue
    }
    if (!isVNode(node) || node.type === Comment) continue
    if (node.type === Fragment) {
      const child = findFirstTriggerVNode(Array.isArray(node.children) ? node.children : [])
      if (child) return child
      continue
    }
    if (node.type === Text) {
      const text = String(node.children ?? '')
      if (text.trim()) return h('span', text)
      continue
    }
    return node
  }
}

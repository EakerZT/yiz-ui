import fs from 'node:fs'
import path from 'node:path'
import { NodeTypes, parse as parseTemplate } from '@vue/compiler-dom'
import { parse } from '@vue/compiler-sfc'

const projectRoot = path.resolve(import.meta.dirname, '../..')
const pagesDirectory = path.join(projectRoot, 'site/pages')
const shouldWrite = process.argv.includes('--write')

function findOuterCards(root) {
  const cards = []

  function visit(node, insideCard = false) {
    if (node.type !== NodeTypes.ROOT && node.type !== NodeTypes.ELEMENT) return
    const isCard = node.type === NodeTypes.ELEMENT && node.tag.toLowerCase() === 'y-card'
    if (isCard && !insideCard) cards.push(node)
    for (const child of node.children ?? []) visit(child, insideCard || isCard)
  }

  visit(root)
  return cards
}

function migrateFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8')
  const { descriptor, errors } = parse(source, { filename: filePath })
  if (errors.length) throw errors[0]
  if (!descriptor.template) return 0

  const root = parseTemplate(descriptor.template.content, { comments: true })
  const cards = findOuterCards(root)
  if (!cards.length) return 0

  const templateOffset = descriptor.template.loc.start.offset
  let nextSource = source
  const replacements = cards.flatMap((card, index) => {
    const cardSource = card.loc.source
    const openEnd = cardSource.indexOf('>') + 1
    const closeStart = cardSource.lastIndexOf('</y-card>')
    if (openEnd <= 0 || closeStart < 0) throw new Error(`无法解析 ${filePath} 中的第 ${index + 1} 个 y-card`)
    const start = templateOffset + card.loc.start.offset
    return [
      {
        start: start + closeStart,
        end: start + closeStart + '</y-card>'.length,
        text: '</demo-card>',
      },
      {
        start,
        end: start + openEnd,
        text: cardSource.slice(0, openEnd).replace('<y-card', `<demo-card :source-index="${index}"`),
      },
    ]
  })

  for (const replacement of replacements.sort((left, right) => right.start - left.start)) {
    nextSource = `${nextSource.slice(0, replacement.start)}${replacement.text}${nextSource.slice(replacement.end)}`
  }

  if (shouldWrite) fs.writeFileSync(filePath, nextSource, 'utf8')
  return cards.length
}

let pageCount = 0
let demoCount = 0
for (const file of fs.readdirSync(pagesDirectory).filter((name) => name.endsWith('Demo.vue'))) {
  const count = migrateFile(path.join(pagesDirectory, file))
  if (!count) continue
  pageCount++
  demoCount += count
}

console.log(`${shouldWrite ? 'Migrated' : 'Found'} ${demoCount} demos in ${pageCount} pages`)

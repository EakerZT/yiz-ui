import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { parse as parseTemplate, NodeTypes } from '@vue/compiler-dom'
import { parse } from '@vue/compiler-sfc'

const projectRoot = path.resolve(import.meta.dirname, '../..')
const pagesDirectory = path.join(projectRoot, 'site/pages')
const outputFile = path.join(projectRoot, 'site/generated/demo-sources.json')

function dedent(source) {
  const lines = source.replace(/^\s*\r?\n|\r?\n\s*$/g, '').split(/\r?\n/)
  const indentation = lines.filter((line) => line.trim()).map((line) => line.match(/^\s*/)?.[0].length ?? 0)
  const minIndentation = indentation.length ? Math.min(...indentation) : 0
  return lines.map((line) => line.slice(minIndentation)).join('\n')
}

function findDemoCards(root) {
  const cards = []

  function visit(node, insideDemoCard = false) {
    if (node.type !== NodeTypes.ROOT && node.type !== NodeTypes.ELEMENT) return
    const isDemoCard = node.type === NodeTypes.ELEMENT && node.tag.toLowerCase() === 'demo-card'
    if (isDemoCard && !insideDemoCard) cards.push(node)
    for (const child of node.children ?? []) visit(child, insideDemoCard || isDemoCard)
  }

  visit(root)
  return cards
}

function readBlock(block) {
  if (!block) return ''
  const attributes = [block.lang ? `lang="${block.lang}"` : '', block.scoped ? 'scoped' : ''].filter(Boolean).join(' ')
  return `<${block.type}${attributes ? ` ${attributes}` : ''}>\n${block.content.trim()}\n</${block.type}>`
}

function extractPage(filePath) {
  const source = fs.readFileSync(filePath, 'utf8')
  const { descriptor, errors } = parse(source, { filename: filePath })
  if (errors.length) throw errors[0]
  if (!descriptor.template) return undefined

  const templateRoot = parseTemplate(descriptor.template.content, { comments: true })
  const cards = findDemoCards(templateRoot)
  if (!cards.length) return undefined

  return {
    script: readBlock(descriptor.scriptSetup ?? descriptor.script),
    styles: descriptor.styles.map(readBlock),
    demos: cards.map((card) => dedent(card.children.map((child) => child.loc.source).join(''))),
  }
}

export function generateDemoSources() {
  const result = {}
  const pageFiles = fs
    .readdirSync(pagesDirectory)
    .filter((file) => file.endsWith('Demo.vue'))
    .sort()

  for (const file of pageFiles) {
    const page = extractPage(path.join(pagesDirectory, file))
    if (page) result[path.basename(file, '.vue')] = page
  }

  fs.mkdirSync(path.dirname(outputFile), { recursive: true })
  fs.writeFileSync(outputFile, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
  console.log(`Generated demo sources: ${path.relative(projectRoot, outputFile)}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateDemoSources()
}

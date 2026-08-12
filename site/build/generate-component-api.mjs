import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'
import { parse } from '@vue/compiler-sfc'

const projectRoot = path.resolve(import.meta.dirname, '../..')
const outputFile = path.join(projectRoot, 'site/generated/component-api.json')

function getPublicComponentFiles() {
  const componentsFile = fs.readFileSync(path.join(projectRoot, 'scripts/components.ts'), 'utf8')
  const publicDirectories = [...componentsFile.matchAll(/from '\.\/([^']+)'/g)].map((match) => match[1])
  const components = new Map()

  for (const directory of publicDirectories) {
    const indexFile = path.join(projectRoot, 'scripts', directory, 'index.ts')
    if (!fs.existsSync(indexFile)) continue
    const indexSource = fs.readFileSync(indexFile, 'utf8')

    for (const match of indexSource.matchAll(/import\s+([A-Za-z]\w*)\s+from\s+'\.\/([^']+\.vue)'/g)) {
      components.set(match[1], `scripts/${directory}/${match[2]}`)
    }
    for (const match of indexSource.matchAll(
      /export\s*{\s*default\s+as\s+([A-Za-z]\w*)\s*}\s*from\s+'\.\/([^']+\.vue)'/g,
    )) {
      components.set(match[1], `scripts/${directory}/${match[2]}`)
    }
  }

  return [...components.entries()].sort(([left], [right]) => left.localeCompare(right))
}

function getName(node, sourceFile) {
  if (!node) return ''
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text
  return node.getText(sourceFile)
}

function getMacroName(call) {
  return ts.isIdentifier(call.expression) ? call.expression.text : ''
}

function readDocumentation(node, sourceFile) {
  const text = node.getFullText(sourceFile)
  const matches = [...text.matchAll(/\/\*\*([\s\S]*?)\*\//g)]
  const raw = matches.at(-1)?.[1] ?? ''
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*\*?\s?/, '').trim())
    .filter(Boolean)

  return {
    description: lines.filter((line) => !line.startsWith('@')).join(' '),
    descriptionEn:
      lines
        .find((line) => line.startsWith('@en '))
        ?.slice(4)
        .trim() ?? '',
  }
}

function getDocumentationOwner(node) {
  let current = node
  while (current.parent && !ts.isVariableStatement(current) && !ts.isSourceFile(current.parent)) {
    current = current.parent
  }
  return current
}

function readTypeMembers(call, sourceFile) {
  const typeNode = call.typeArguments?.[0]
  if (!typeNode || !ts.isTypeLiteralNode(typeNode)) return []
  return typeNode.members
    .filter((member) => ts.isPropertySignature(member) && member.name)
    .map((member) => ({
      name: getName(member.name, sourceFile),
      type: member.type?.getText(sourceFile) ?? 'unknown',
      required: !member.questionToken,
      ...readDocumentation(member, sourceFile),
    }))
}

function readDefaults(sourceFile) {
  const defaults = new Map()

  function visit(node) {
    if (ts.isCallExpression(node) && getMacroName(node) === 'withDefaults') {
      const defaultsNode = node.arguments[1]
      if (defaultsNode && ts.isObjectLiteralExpression(defaultsNode)) {
        for (const property of defaultsNode.properties) {
          if (!ts.isPropertyAssignment(property)) continue
          let value = property.initializer.getText(sourceFile)
          if (/^\(\)\s*=>\s*/.test(value)) value = value.replace(/^\(\)\s*=>\s*/, '')
          defaults.set(getName(property.name, sourceFile), value)
        }
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return defaults
}

function readRuntimeType(node, sourceFile) {
  if (!node) return 'unknown'
  const text = node.getText(sourceFile)
  const propType = text.match(/PropType<([\s\S]+)>$/)
  if (propType) return propType[1]
  if (ts.isIdentifier(node)) {
    const typeNames = {
      String: 'string',
      Number: 'number',
      Boolean: 'boolean',
      Function: 'Function',
      Array: 'unknown[]',
      Object: 'object',
    }
    return typeNames[node.text] ?? node.text
  }
  if (ts.isArrayLiteralExpression(node))
    return node.elements.map((element) => readRuntimeType(element, sourceFile)).join(' | ')
  if (ts.isAsExpression(node)) return readRuntimeType(node.expression, sourceFile)
  return text
}

function extractOptionsComponentMeta(name, relativeFile, sourceFile) {
  const meta = { name, source: relativeFile, props: [], models: [], events: [], slots: [], methods: [] }

  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      getMacroName(node) === 'defineComponent' &&
      node.arguments[0] &&
      ts.isObjectLiteralExpression(node.arguments[0])
    ) {
      const options = node.arguments[0]
      const propsOption = options.properties.find(
        (property) => ts.isPropertyAssignment(property) && getName(property.name, sourceFile) === 'props',
      )
      if (
        propsOption &&
        ts.isPropertyAssignment(propsOption) &&
        ts.isObjectLiteralExpression(propsOption.initializer)
      ) {
        meta.props = propsOption.initializer.properties
          .filter((property) => ts.isPropertyAssignment(property))
          .map((property) => {
            const definition = property.initializer
            const fields = ts.isObjectLiteralExpression(definition) ? definition.properties : []
            const getField = (fieldName) =>
              fields.find((field) => ts.isPropertyAssignment(field) && getName(field.name, sourceFile) === fieldName)
            const typeField = getField('type')
            const defaultField = getField('default')
            const requiredField = getField('required')
            return {
              name: getName(property.name, sourceFile),
              type:
                typeField && ts.isPropertyAssignment(typeField)
                  ? readRuntimeType(typeField.initializer, sourceFile)
                  : readRuntimeType(definition, sourceFile),
              required:
                Boolean(requiredField && ts.isPropertyAssignment(requiredField)) &&
                requiredField.initializer.kind === ts.SyntaxKind.TrueKeyword,
              default:
                defaultField && ts.isPropertyAssignment(defaultField)
                  ? defaultField.initializer.getText(sourceFile).replace(/^\(\)\s*=>\s*/, '')
                  : undefined,
              ...readDocumentation(property, sourceFile),
            }
          })
      }

      const emitsOption = options.properties.find(
        (property) => ts.isPropertyAssignment(property) && getName(property.name, sourceFile) === 'emits',
      )
      if (emitsOption && ts.isPropertyAssignment(emitsOption) && ts.isArrayLiteralExpression(emitsOption.initializer)) {
        meta.events = emitsOption.initializer.elements.filter(ts.isStringLiteral).map((event) => ({
          name: event.text,
          type: '(...args: unknown[]) => void',
          description: '',
          descriptionEn: '',
        }))
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return meta
}

function extractComponentMeta(name, relativeFile) {
  const filePath = path.join(projectRoot, relativeFile)
  const source = fs.readFileSync(filePath, 'utf8')
  const { descriptor, errors } = parse(source, { filename: filePath })
  if (errors.length) throw errors[0]
  const scriptBlock = descriptor.scriptSetup ?? descriptor.script
  if (!scriptBlock) throw new Error(`${relativeFile} 缺少脚本块`)

  const sourceFile = ts.createSourceFile(
    relativeFile,
    scriptBlock.content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  if (!descriptor.scriptSetup) return extractOptionsComponentMeta(name, relativeFile, sourceFile)
  const defaults = readDefaults(sourceFile)
  const meta = { name, source: relativeFile, props: [], models: [], events: [], slots: [], methods: [] }

  function visit(node) {
    if (!ts.isCallExpression(node)) {
      ts.forEachChild(node, visit)
      return
    }

    const macroName = getMacroName(node)
    if (macroName === 'defineProps') {
      meta.props = readTypeMembers(node, sourceFile).map((item) => ({ ...item, default: defaults.get(item.name) }))
    } else if (macroName === 'defineModel') {
      const modelName = ts.isStringLiteral(node.arguments[0]) ? node.arguments[0].text : 'modelValue'
      const type = node.typeArguments?.[0]?.getText(sourceFile) ?? 'unknown'
      const options = node.arguments.find((argument) => ts.isObjectLiteralExpression(argument))
      const defaultProperty = options?.properties.find(
        (property) => ts.isPropertyAssignment(property) && getName(property.name, sourceFile) === 'default',
      )
      meta.models.push({
        name: `v-model:${modelName}`,
        type,
        required: false,
        default:
          defaultProperty && ts.isPropertyAssignment(defaultProperty)
            ? defaultProperty.initializer.getText(sourceFile)
            : undefined,
        ...readDocumentation(getDocumentationOwner(node), sourceFile),
      })
    } else if (macroName === 'defineEmits') {
      const typedEvents = readTypeMembers(node, sourceFile)
      if (typedEvents.length) {
        meta.events = typedEvents.map((item) => ({ ...item, required: undefined }))
      } else if (node.arguments[0] && ts.isArrayLiteralExpression(node.arguments[0])) {
        meta.events = node.arguments[0].elements.filter(ts.isStringLiteral).map((event) => ({
          name: event.text,
          type: '(...args: unknown[]) => void',
          description: '',
          descriptionEn: '',
        }))
      }
    } else if (macroName === 'defineSlots') {
      meta.slots = readTypeMembers(node, sourceFile).map((item) => ({ ...item, required: undefined }))
    } else if (macroName === 'defineExpose') {
      const exposed = node.arguments[0]
      if (exposed && ts.isObjectLiteralExpression(exposed)) {
        meta.methods = exposed.properties.map((property) => ({
          name: getName(property.name, sourceFile),
          type:
            ts.isPropertyAssignment(property) && ts.isArrowFunction(property.initializer)
              ? `(${property.initializer.parameters.map((parameter) => parameter.getText(sourceFile)).join(', ')}) => void`
              : property.getText(sourceFile),
          ...readDocumentation(property, sourceFile),
        }))
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return meta
}

export function generateComponentApi() {
  const result = getPublicComponentFiles().map(([name, file]) => extractComponentMeta(name, file))
  const manualApis = [
    [
      'Dialog.confirm',
      'scripts/dialog/confirm.ts',
      [['Dialog.confirm', '(options: DialogConfirmOptions) => DialogConfirmHandle']],
    ],
    [
      'message',
      'scripts/message/message.ts',
      [
        ['message[type]', '(content: MessageContent, options?: MessageOptions) => MessageHandle'],
        ['useMessage', '() => MessageFn'],
      ],
    ],
    [
      'notification',
      'scripts/notification/notification.ts',
      [
        ['notification[type]', '(options: NotificationOptions) => NotificationHandle'],
        ['useNotification', '() => NotificationFn'],
      ],
    ],
    [
      'loadingBar',
      'scripts/loading-bar/loadingBar.ts',
      [
        ['start', '() => void'],
        ['done', '() => void'],
        ['fail', '() => void'],
        ['set', '(progress: number) => void'],
        ['inc', '(amount?: number) => void'],
        ['pause', '() => void'],
        ['resume', '() => void'],
        ['configure', '(options: LoadingBarOptions) => void'],
      ],
    ],
    [
      'useContextMenu',
      'scripts/context-menu/useContextMenu.ts',
      [
        ['useContextMenu', '() => ContextMenuApi'],
        ['open', '(options: ContextMenuOptions) => ContextMenuHandle'],
        ['handle.close', '() => void'],
      ],
    ],
    [
      'Emitter',
      'scripts/emitter/index.ts',
      [
        ['emitter', 'Emitter<EmitterEvents>'],
        ['createEmitter', '<Events>(name?: EmitterName) => Emitter<Events>'],
        ['useEmitter', '<Events>(name?: EmitterName) => EmitterApi<Events>'],
      ],
    ],
    [
      'LayerManager',
      'scripts/overlay/modalLayer.ts',
      [
        ['useModalLayer', '() => ModalLayerContext'],
        ['useModalLayerManager', '() => ModalLayerManager'],
        ['useDialog', '() => DialogApi'],
      ],
    ],
  ]

  for (const [name, source, methods] of manualApis) {
    result.push({
      name,
      source,
      props: [],
      models: [],
      events: [],
      slots: [],
      methods: methods.map(([methodName, type]) => ({
        name: methodName,
        type,
        description: '',
        descriptionEn: '',
      })),
    })
  }
  fs.mkdirSync(path.dirname(outputFile), { recursive: true })
  fs.writeFileSync(outputFile, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
  console.log(`Generated component API metadata: ${path.relative(projectRoot, outputFile)}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateComponentApi()
}

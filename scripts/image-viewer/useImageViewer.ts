import { createVNode, getCurrentInstance, onScopeDispose, render } from 'vue'
import {
  applyServiceTheme,
  resolveServiceTarget,
  useServiceContext,
  withServiceContext,
  type ServiceContext,
} from '../app/serviceContext'
import { getModalLayer, injectModalLayer, type ModalLayerContext } from '../overlay/modalLayer'
import ImageViewer from './ImageViewer.vue'
import type {
  ImageViewerApi,
  ImageViewerHandle,
  ImageViewerItem,
  ImageViewerOptions,
  ResolvedImageViewerOptions,
} from './types'

interface InternalImageViewerHandle extends ImageViewerHandle {
  context: ServiceContext
}

const activeViewers = new WeakMap<ServiceContext['runtime'], InternalImageViewerHandle>()
const noopHandle: ImageViewerHandle = {
  close: () => undefined,
  destroy: () => undefined,
}

export function useImageViewer(): ImageViewerApi {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('useImageViewer() must be called in setup().')
  }

  const modalLayerParent = getModalLayer(instance) ?? injectModalLayer()
  const context = useServiceContext()
  let ownedHandle: ImageViewerHandle | undefined

  onScopeDispose(() => ownedHandle?.close())

  return {
    show(items, options = {}) {
      activeViewers.get(context.runtime)?.destroy()

      if (items.length === 0) {
        ownedHandle = undefined
        return noopHandle
      }

      ownedHandle = openImageViewer(items, options, modalLayerParent, context)
      return ownedHandle
    },
    close() {
      ownedHandle?.close()
    },
  }
}

function openImageViewer(
  sourceItems: ImageViewerItem[],
  sourceOptions: ImageViewerOptions,
  modalLayerParent: ModalLayerContext | null,
  context: ServiceContext,
): ImageViewerHandle {
  const items = sourceItems.map((item) => ({ ...item }))
  const options = resolveOptions(sourceOptions, items.length)
  const container = document.createElement('div')
  let show = true
  let closing = false
  let destroyed = false
  let closeEmitted = false

  applyServiceTheme(container, context)
  resolveServiceTarget(context).appendChild(container)

  const handle: InternalImageViewerHandle = {
    context,
    close,
    destroy,
  }

  function emitClose() {
    if (closeEmitted) return
    closeEmitted = true
    options.onClose?.()
  }

  function close() {
    if (destroyed || closing) return
    closing = true
    show = false
    emitClose()
    renderViewer()
  }

  function destroy() {
    if (destroyed) return
    destroyed = true
    emitClose()
    render(null, container)
    container.remove()
    if (activeViewers.get(context.runtime) === handle) activeViewers.delete(context.runtime)
  }

  function renderViewer() {
    if (destroyed) return
    const vnode = createVNode(ImageViewer, {
      show,
      items,
      options,
      modalLayerParent,
      onClose: close,
      onAfterLeave: destroy,
    })
    render(withServiceContext(vnode, context), container)
  }

  activeViewers.set(context.runtime, handle)
  renderViewer()
  return handle
}

function resolveOptions(options: ImageViewerOptions, itemCount: number): ResolvedImageViewerOptions {
  const minZoomRatio = toPositiveNumber(options.minZoomRatio, 0.1)
  const maxZoomRatio = Math.max(minZoomRatio, toPositiveNumber(options.maxZoomRatio, 10))
  const initialIndex = Math.min(itemCount - 1, Math.max(0, Math.trunc(toFiniteNumber(options.initialIndex, 0))))

  return {
    download: options.download ?? false,
    initialIndex,
    maskClosable: options.maskClosable ?? false,
    keyboard: options.keyboard ?? true,
    loop: options.loop ?? true,
    movable: options.movable ?? true,
    rotatable: options.rotatable ?? true,
    zoomable: options.zoomable ?? true,
    zoomOnWheel: options.zoomOnWheel ?? true,
    toggleOnDblclick: options.toggleOnDblclick ?? true,
    toolbar: options.toolbar ?? true,
    navbar: options.navbar ?? true,
    zoomRatio: toPositiveNumber(options.zoomRatio, 0.1),
    minZoomRatio,
    maxZoomRatio,
    onIndexChange: options.onIndexChange,
    onClose: options.onClose,
  }
}

function toFiniteNumber(value: number | undefined, fallback: number) {
  return value != null && Number.isFinite(value) ? value : fallback
}

function toPositiveNumber(value: number | undefined, fallback: number) {
  return value != null && Number.isFinite(value) && value > 0 ? value : fallback
}

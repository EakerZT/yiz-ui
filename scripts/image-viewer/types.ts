export interface ImageViewerItem {
  /**
   * 图片文件名，用于标题、替代文本和下载文件名。
   * @en Image filename used by the title, alternative text, and download filename.
   */
  filename: string
  /**
   * 图片地址。
   * @en Image URL.
   */
  url: string
}

export interface ImageViewerOptions {
  /**
   * 是否显示下载按钮。
   * @en Whether to show the download button.
   */
  download?: boolean
  /**
   * 首次显示的图片索引，超出范围时会被限制到有效范围。
   * @en Initial image index. Out-of-range values are clamped to the valid range.
   */
  initialIndex?: number
  /**
   * 是否允许点击遮罩关闭查看器。
   * @en Whether clicking the backdrop closes the viewer.
   */
  maskClosable?: boolean
  /**
   * 是否启用键盘操作。
   * @en Whether to enable keyboard controls.
   */
  keyboard?: boolean
  /**
   * 是否循环切换图片。
   * @en Whether image navigation loops.
   */
  loop?: boolean
  /**
   * 是否允许拖动图片。
   * @en Whether the image can be moved by dragging.
   */
  movable?: boolean
  /**
   * 是否允许旋转图片。
   * @en Whether the image can be rotated.
   */
  rotatable?: boolean
  /**
   * 是否允许缩放图片。
   * @en Whether the image can be zoomed.
   */
  zoomable?: boolean
  /**
   * 是否允许使用鼠标滚轮缩放图片。
   * @en Whether the mouse wheel can zoom the image.
   */
  zoomOnWheel?: boolean
  /**
   * 是否允许双击在初始比例和放大比例之间切换。
   * @en Whether double-click toggles between the initial and enlarged ratios.
   */
  toggleOnDblclick?: boolean
  /**
   * 是否显示底部工具栏。
   * @en Whether to show the bottom toolbar.
   */
  toolbar?: boolean
  /**
   * 是否显示底部图片列表。
   * @en Whether to show the bottom image list.
   */
  navbar?: boolean
  /**
   * 每次缩放的比例，必须大于 0。
   * @en Zoom ratio for each step. Must be greater than 0.
   */
  zoomRatio?: number
  /**
   * 最小缩放比例，必须大于 0。
   * @en Minimum zoom ratio. Must be greater than 0.
   */
  minZoomRatio?: number
  /**
   * 最大缩放比例，必须大于或等于最小缩放比例。
   * @en Maximum zoom ratio. Must be greater than or equal to the minimum zoom ratio.
   */
  maxZoomRatio?: number
  /**
   * 当前图片发生切换时触发。
   * @en Called when the current image changes.
   */
  onIndexChange?: (index: number, item: ImageViewerItem) => void
  /**
   * 查看器关闭时触发。
   * @en Called when the viewer closes.
   */
  onClose?: () => void
}

export interface ImageViewerHandle {
  /** 关闭查看器。 */
  close: () => void
  /** 立即销毁查看器。 */
  destroy: () => void
}

export interface ImageViewerApi {
  /**
   * 显示图片查看器。传入空数组时不会创建查看器。
   * @en Show the image viewer. An empty array does not create a viewer.
   */
  show: (items: ImageViewerItem[], options?: ImageViewerOptions) => ImageViewerHandle
  /** 关闭当前由该 API 实例打开的查看器。 */
  close: () => void
}

export interface ResolvedImageViewerOptions {
  download: boolean
  initialIndex: number
  maskClosable: boolean
  keyboard: boolean
  loop: boolean
  movable: boolean
  rotatable: boolean
  zoomable: boolean
  zoomOnWheel: boolean
  toggleOnDblclick: boolean
  toolbar: boolean
  navbar: boolean
  zoomRatio: number
  minZoomRatio: number
  maxZoomRatio: number
  onIndexChange?: (index: number, item: ImageViewerItem) => void
  onClose?: () => void
}

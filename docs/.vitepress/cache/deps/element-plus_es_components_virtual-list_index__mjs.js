import {
  _export_sfc
} from "./chunk-PZZQNJK2.js";
import {
  useNamespace
} from "./chunk-DAIZNEGJ.js";
import "./chunk-EVK4T774.js";
import "./chunk-XQ7DDAUO.js";
import {
  addUnit,
  buildProp,
  buildProps,
  cAF,
  debugWarn,
  definePropType,
  getScrollBarWidth,
  isClient,
  isFirefox,
  isNumber,
  isUndefined,
  mutable,
  rAF,
  throwError,
  useEventListener,
  useResizeObserver,
  withInstall
} from "./chunk-OAGETBMJ.js";
import {
  hasOwn,
  isFunction,
  isObject,
  isString
} from "./chunk-JLIWXIXI.js";
import "./chunk-O4DIKI77.js";
import {
  memoize_default
} from "./chunk-VEVDWRFB.js";
import {
  Fragment,
  Transition,
  computed2 as computed,
  createBaseVNode,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createVNode,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  nextTick,
  normalizeClass,
  normalizeStyle,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  openBlock,
  provide,
  reactive,
  ref,
  renderSlot,
  resolveDynamicComponent,
  toRef,
  unref,
  vShow,
  watch,
  withCtx,
  withDirectives,
  withModifiers
} from "./chunk-7Q3ERDHA.js";
import "./chunk-ZS7NZCD4.js";

// ../node_modules/memoize-one/dist/memoize-one.esm.js
var safeIsNaN = Number.isNaN || function ponyfill(value) {
  return typeof value === "number" && value !== value;
};
function isEqual(first, second) {
  if (first === second) {
    return true;
  }
  if (safeIsNaN(first) && safeIsNaN(second)) {
    return true;
  }
  return false;
}
function areInputsEqual(newInputs, lastInputs) {
  if (newInputs.length !== lastInputs.length) {
    return false;
  }
  for (var i = 0; i < newInputs.length; i++) {
    if (!isEqual(newInputs[i], lastInputs[i])) {
      return false;
    }
  }
  return true;
}
function memoizeOne(resultFn, isEqual2) {
  if (isEqual2 === void 0) {
    isEqual2 = areInputsEqual;
  }
  var cache2 = null;
  function memoized() {
    var newArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      newArgs[_i] = arguments[_i];
    }
    if (cache2 && cache2.lastThis === this && isEqual2(newArgs, cache2.lastArgs)) {
      return cache2.lastResult;
    }
    var lastResult = resultFn.apply(this, newArgs);
    cache2 = {
      lastResult,
      lastArgs: newArgs,
      lastThis: this
    };
    return lastResult;
  }
  memoized.clear = function clear() {
    cache2 = null;
  };
  return memoized;
}

// ../node_modules/element-plus/es/components/virtual-list/src/hooks/use-cache.mjs
var useCache = () => {
  const vm = getCurrentInstance();
  const props = vm.proxy.$props;
  return computed(() => {
    const _getItemStyleCache = (_, __, ___) => ({});
    return props.perfMode ? memoize_default(_getItemStyleCache) : memoizeOne(_getItemStyleCache);
  });
};

// ../node_modules/element-plus/es/components/virtual-list/src/defaults.mjs
var DEFAULT_DYNAMIC_LIST_ITEM_SIZE = 50;
var ITEM_RENDER_EVT = "itemRendered";
var SCROLL_EVT = "scroll";
var FORWARD = "forward";
var BACKWARD = "backward";
var AUTO_ALIGNMENT = "auto";
var SMART_ALIGNMENT = "smart";
var START_ALIGNMENT = "start";
var CENTERED_ALIGNMENT = "center";
var END_ALIGNMENT = "end";
var HORIZONTAL = "horizontal";
var VERTICAL = "vertical";
var LTR = "ltr";
var RTL = "rtl";
var RTL_OFFSET_NAG = "negative";
var RTL_OFFSET_POS_ASC = "positive-ascending";
var RTL_OFFSET_POS_DESC = "positive-descending";
var PageKey = {
  [HORIZONTAL]: "pageX",
  [VERTICAL]: "pageY"
};
var ScrollbarSizeKey = {
  [HORIZONTAL]: "height",
  [VERTICAL]: "width"
};
var ScrollbarDirKey = {
  [HORIZONTAL]: "left",
  [VERTICAL]: "top"
};
var SCROLLBAR_MIN_SIZE = 20;

// ../node_modules/element-plus/es/components/virtual-list/src/hooks/use-wheel.mjs
var LayoutKeys = {
  [HORIZONTAL]: "deltaX",
  [VERTICAL]: "deltaY"
};
var useWheel = ({ atEndEdge, atStartEdge, layout: layout2 }, onWheelDelta) => {
  let frameHandle;
  let offset = 0;
  const hasReachedEdge = (offset2) => {
    const edgeReached = offset2 < 0 && atStartEdge.value || offset2 > 0 && atEndEdge.value;
    return edgeReached;
  };
  const onWheel = (e) => {
    cAF(frameHandle);
    const newOffset = e[LayoutKeys[layout2.value]];
    if (hasReachedEdge(offset) && hasReachedEdge(offset + newOffset))
      return;
    offset += newOffset;
    if (!isFirefox()) {
      e.preventDefault();
    }
    frameHandle = rAF(() => {
      onWheelDelta(offset);
      offset = 0;
    });
  };
  return {
    hasReachedEdge,
    onWheel
  };
};

// ../node_modules/element-plus/es/components/scrollbar/src/util.mjs
var GAP = 4;
var BAR_MAP = {
  vertical: {
    offset: "offsetHeight",
    scroll: "scrollTop",
    scrollSize: "scrollHeight",
    size: "height",
    key: "vertical",
    axis: "Y",
    client: "clientY",
    direction: "top"
  },
  horizontal: {
    offset: "offsetWidth",
    scroll: "scrollLeft",
    scrollSize: "scrollWidth",
    size: "width",
    key: "horizontal",
    axis: "X",
    client: "clientX",
    direction: "left"
  }
};
var renderThumbStyle = ({
  move,
  size,
  bar
}) => ({
  [bar.size]: size,
  transform: `translate${bar.axis}(${move}%)`
});

// ../node_modules/element-plus/es/components/scrollbar/src/constants.mjs
var scrollbarContextKey = Symbol("scrollbarContextKey");

// ../node_modules/element-plus/es/components/scrollbar/src/thumb.mjs
var thumbProps = buildProps({
  vertical: Boolean,
  size: String,
  move: Number,
  ratio: {
    type: Number,
    required: true
  },
  always: Boolean
});

// ../node_modules/element-plus/es/components/scrollbar/src/thumb2.mjs
var COMPONENT_NAME = "Thumb";
var _sfc_main = defineComponent({
  __name: "thumb",
  props: thumbProps,
  setup(__props) {
    const props = __props;
    const scrollbar = inject(scrollbarContextKey);
    const ns = useNamespace("scrollbar");
    if (!scrollbar)
      throwError(COMPONENT_NAME, "can not inject scrollbar context");
    const instance = ref();
    const thumb = ref();
    const thumbState = ref({});
    const visible = ref(false);
    let cursorDown = false;
    let cursorLeave = false;
    let originalOnSelectStart = isClient ? document.onselectstart : null;
    const bar = computed(() => BAR_MAP[props.vertical ? "vertical" : "horizontal"]);
    const thumbStyle = computed(() => renderThumbStyle({
      size: props.size,
      move: props.move,
      bar: bar.value
    }));
    const offsetRatio = computed(() => instance.value[bar.value.offset] ** 2 / scrollbar.wrapElement[bar.value.scrollSize] / props.ratio / thumb.value[bar.value.offset]);
    const clickThumbHandler = (e) => {
      var _a;
      e.stopPropagation();
      if (e.ctrlKey || [1, 2].includes(e.button))
        return;
      (_a = window.getSelection()) == null ? void 0 : _a.removeAllRanges();
      startDrag(e);
      const el = e.currentTarget;
      if (!el)
        return;
      thumbState.value[bar.value.axis] = el[bar.value.offset] - (e[bar.value.client] - el.getBoundingClientRect()[bar.value.direction]);
    };
    const clickTrackHandler = (e) => {
      if (!thumb.value || !instance.value || !scrollbar.wrapElement)
        return;
      const offset = Math.abs(e.target.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]);
      const thumbHalf = thumb.value[bar.value.offset] / 2;
      const thumbPositionPercentage = (offset - thumbHalf) * 100 * offsetRatio.value / instance.value[bar.value.offset];
      scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize] / 100;
    };
    const startDrag = (e) => {
      e.stopImmediatePropagation();
      cursorDown = true;
      document.addEventListener("mousemove", mouseMoveDocumentHandler);
      document.addEventListener("mouseup", mouseUpDocumentHandler);
      originalOnSelectStart = document.onselectstart;
      document.onselectstart = () => false;
    };
    const mouseMoveDocumentHandler = (e) => {
      if (!instance.value || !thumb.value)
        return;
      if (cursorDown === false)
        return;
      const prevPage = thumbState.value[bar.value.axis];
      if (!prevPage)
        return;
      const offset = (instance.value.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]) * -1;
      const thumbClickPosition = thumb.value[bar.value.offset] - prevPage;
      const thumbPositionPercentage = (offset - thumbClickPosition) * 100 * offsetRatio.value / instance.value[bar.value.offset];
      scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize] / 100;
    };
    const mouseUpDocumentHandler = () => {
      cursorDown = false;
      thumbState.value[bar.value.axis] = 0;
      document.removeEventListener("mousemove", mouseMoveDocumentHandler);
      document.removeEventListener("mouseup", mouseUpDocumentHandler);
      restoreOnselectstart();
      if (cursorLeave)
        visible.value = false;
    };
    const mouseMoveScrollbarHandler = () => {
      cursorLeave = false;
      visible.value = !!props.size;
    };
    const mouseLeaveScrollbarHandler = () => {
      cursorLeave = true;
      visible.value = cursorDown;
    };
    onBeforeUnmount(() => {
      restoreOnselectstart();
      document.removeEventListener("mouseup", mouseUpDocumentHandler);
    });
    const restoreOnselectstart = () => {
      if (document.onselectstart !== originalOnSelectStart)
        document.onselectstart = originalOnSelectStart;
    };
    useEventListener(toRef(scrollbar, "scrollbarElement"), "mousemove", mouseMoveScrollbarHandler);
    useEventListener(toRef(scrollbar, "scrollbarElement"), "mouseleave", mouseLeaveScrollbarHandler);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Transition, {
        name: unref(ns).b("fade"),
        persisted: ""
      }, {
        default: withCtx(() => [
          withDirectives(createBaseVNode("div", {
            ref_key: "instance",
            ref: instance,
            class: normalizeClass([unref(ns).e("bar"), unref(ns).is(unref(bar).key)]),
            onMousedown: clickTrackHandler
          }, [
            createBaseVNode("div", {
              ref_key: "thumb",
              ref: thumb,
              class: normalizeClass(unref(ns).e("thumb")),
              style: normalizeStyle(unref(thumbStyle)),
              onMousedown: clickThumbHandler
            }, null, 38)
          ], 34), [
            [vShow, _ctx.always || visible.value]
          ])
        ]),
        _: 1
      }, 8, ["name"]);
    };
  }
});
var Thumb = _export_sfc(_sfc_main, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/scrollbar/src/thumb.vue"]]);

// ../node_modules/element-plus/es/components/scrollbar/src/bar.mjs
var barProps = buildProps({
  always: {
    type: Boolean,
    default: true
  },
  width: String,
  height: String,
  ratioX: {
    type: Number,
    default: 1
  },
  ratioY: {
    type: Number,
    default: 1
  }
});

// ../node_modules/element-plus/es/components/scrollbar/src/bar2.mjs
var _sfc_main2 = defineComponent({
  __name: "bar",
  props: barProps,
  setup(__props, { expose }) {
    const props = __props;
    const moveX = ref(0);
    const moveY = ref(0);
    const handleScroll = (wrap) => {
      if (wrap) {
        const offsetHeight = wrap.offsetHeight - GAP;
        const offsetWidth = wrap.offsetWidth - GAP;
        moveY.value = wrap.scrollTop * 100 / offsetHeight * props.ratioY;
        moveX.value = wrap.scrollLeft * 100 / offsetWidth * props.ratioX;
      }
    };
    expose({
      handleScroll
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(Thumb, {
          move: moveX.value,
          ratio: _ctx.ratioX,
          size: _ctx.width,
          always: _ctx.always
        }, null, 8, ["move", "ratio", "size", "always"]),
        createVNode(Thumb, {
          move: moveY.value,
          ratio: _ctx.ratioY,
          size: _ctx.height,
          vertical: "",
          always: _ctx.always
        }, null, 8, ["move", "ratio", "size", "always"])
      ], 64);
    };
  }
});
var Bar = _export_sfc(_sfc_main2, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/scrollbar/src/bar.vue"]]);

// ../node_modules/element-plus/es/components/scrollbar/src/scrollbar.mjs
var scrollbarProps = buildProps({
  height: {
    type: [String, Number],
    default: ""
  },
  maxHeight: {
    type: [String, Number],
    default: ""
  },
  native: {
    type: Boolean,
    default: false
  },
  wrapStyle: {
    type: definePropType([String, Object, Array]),
    default: ""
  },
  wrapClass: {
    type: [String, Array],
    default: ""
  },
  viewClass: {
    type: [String, Array],
    default: ""
  },
  viewStyle: {
    type: [String, Array, Object],
    default: ""
  },
  noresize: Boolean,
  tag: {
    type: String,
    default: "div"
  },
  always: Boolean,
  minSize: {
    type: Number,
    default: 20
  }
});
var scrollbarEmits = {
  scroll: ({
    scrollTop,
    scrollLeft
  }) => [scrollTop, scrollLeft].every(isNumber)
};

// ../node_modules/element-plus/es/components/scrollbar/src/scrollbar2.mjs
var COMPONENT_NAME2 = "ElScrollbar";
var __default__ = defineComponent({
  name: COMPONENT_NAME2
});
var _sfc_main3 = defineComponent({
  ...__default__,
  props: scrollbarProps,
  emits: scrollbarEmits,
  setup(__props, { expose, emit }) {
    const props = __props;
    const ns = useNamespace("scrollbar");
    let stopResizeObserver = void 0;
    let stopResizeListener = void 0;
    const scrollbarRef = ref();
    const wrapRef = ref();
    const resizeRef = ref();
    const sizeWidth = ref("0");
    const sizeHeight = ref("0");
    const barRef = ref();
    const ratioY = ref(1);
    const ratioX = ref(1);
    const style = computed(() => {
      const style2 = {};
      if (props.height)
        style2.height = addUnit(props.height);
      if (props.maxHeight)
        style2.maxHeight = addUnit(props.maxHeight);
      return [props.wrapStyle, style2];
    });
    const wrapKls = computed(() => {
      return [
        props.wrapClass,
        ns.e("wrap"),
        { [ns.em("wrap", "hidden-default")]: !props.native }
      ];
    });
    const resizeKls = computed(() => {
      return [ns.e("view"), props.viewClass];
    });
    const handleScroll = () => {
      var _a;
      if (wrapRef.value) {
        (_a = barRef.value) == null ? void 0 : _a.handleScroll(wrapRef.value);
        emit("scroll", {
          scrollTop: wrapRef.value.scrollTop,
          scrollLeft: wrapRef.value.scrollLeft
        });
      }
    };
    function scrollTo(arg1, arg2) {
      if (isObject(arg1)) {
        wrapRef.value.scrollTo(arg1);
      } else if (isNumber(arg1) && isNumber(arg2)) {
        wrapRef.value.scrollTo(arg1, arg2);
      }
    }
    const setScrollTop = (value) => {
      if (!isNumber(value)) {
        debugWarn(COMPONENT_NAME2, "value must be a number");
        return;
      }
      wrapRef.value.scrollTop = value;
    };
    const setScrollLeft = (value) => {
      if (!isNumber(value)) {
        debugWarn(COMPONENT_NAME2, "value must be a number");
        return;
      }
      wrapRef.value.scrollLeft = value;
    };
    const update = () => {
      if (!wrapRef.value)
        return;
      const offsetHeight = wrapRef.value.offsetHeight - GAP;
      const offsetWidth = wrapRef.value.offsetWidth - GAP;
      const originalHeight = offsetHeight ** 2 / wrapRef.value.scrollHeight;
      const originalWidth = offsetWidth ** 2 / wrapRef.value.scrollWidth;
      const height = Math.max(originalHeight, props.minSize);
      const width = Math.max(originalWidth, props.minSize);
      ratioY.value = originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height));
      ratioX.value = originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width));
      sizeHeight.value = height + GAP < offsetHeight ? `${height}px` : "";
      sizeWidth.value = width + GAP < offsetWidth ? `${width}px` : "";
    };
    watch(() => props.noresize, (noresize) => {
      if (noresize) {
        stopResizeObserver == null ? void 0 : stopResizeObserver();
        stopResizeListener == null ? void 0 : stopResizeListener();
      } else {
        ;
        ({ stop: stopResizeObserver } = useResizeObserver(resizeRef, update));
        stopResizeListener = useEventListener("resize", update);
      }
    }, { immediate: true });
    watch(() => [props.maxHeight, props.height], () => {
      if (!props.native)
        nextTick(() => {
          var _a;
          update();
          if (wrapRef.value) {
            (_a = barRef.value) == null ? void 0 : _a.handleScroll(wrapRef.value);
          }
        });
    });
    provide(scrollbarContextKey, reactive({
      scrollbarElement: scrollbarRef,
      wrapElement: wrapRef
    }));
    onMounted(() => {
      if (!props.native)
        nextTick(() => {
          update();
        });
    });
    onUpdated(() => update());
    expose({
      wrapRef,
      update,
      scrollTo,
      setScrollTop,
      setScrollLeft,
      handleScroll
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "scrollbarRef",
        ref: scrollbarRef,
        class: normalizeClass(unref(ns).b())
      }, [
        createBaseVNode("div", {
          ref_key: "wrapRef",
          ref: wrapRef,
          class: normalizeClass(unref(wrapKls)),
          style: normalizeStyle(unref(style)),
          onScroll: handleScroll
        }, [
          (openBlock(), createBlock(resolveDynamicComponent(_ctx.tag), {
            ref_key: "resizeRef",
            ref: resizeRef,
            class: normalizeClass(unref(resizeKls)),
            style: normalizeStyle(_ctx.viewStyle)
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 8, ["class", "style"]))
        ], 38),
        !_ctx.native ? (openBlock(), createBlock(Bar, {
          key: 0,
          ref_key: "barRef",
          ref: barRef,
          height: sizeHeight.value,
          width: sizeWidth.value,
          always: _ctx.always,
          "ratio-x": ratioX.value,
          "ratio-y": ratioY.value
        }, null, 8, ["height", "width", "always", "ratio-x", "ratio-y"])) : createCommentVNode("v-if", true)
      ], 2);
    };
  }
});
var Scrollbar = _export_sfc(_sfc_main3, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/scrollbar/src/scrollbar.vue"]]);

// ../node_modules/element-plus/es/components/scrollbar/index.mjs
var ElScrollbar = withInstall(Scrollbar);

// ../node_modules/element-plus/es/components/virtual-list/src/props.mjs
var itemSize = buildProp({
  type: definePropType([Number, Function]),
  required: true
});
var estimatedItemSize = buildProp({
  type: Number
});
var cache = buildProp({
  type: Number,
  default: 2
});
var direction = buildProp({
  type: String,
  values: ["ltr", "rtl"],
  default: "ltr"
});
var initScrollOffset = buildProp({
  type: Number,
  default: 0
});
var total = buildProp({
  type: Number,
  required: true
});
var layout = buildProp({
  type: String,
  values: ["horizontal", "vertical"],
  default: VERTICAL
});
var virtualizedProps = buildProps({
  className: {
    type: String,
    default: ""
  },
  containerElement: {
    type: definePropType([String, Object]),
    default: "div"
  },
  data: {
    type: definePropType(Array),
    default: () => mutable([])
  },
  direction,
  height: {
    type: [String, Number],
    required: true
  },
  innerElement: {
    type: [String, Object],
    default: "div"
  },
  style: {
    type: definePropType([Object, String, Array])
  },
  useIsScrolling: {
    type: Boolean,
    default: false
  },
  width: {
    type: [Number, String],
    required: false
  },
  perfMode: {
    type: Boolean,
    default: true
  },
  scrollbarAlwaysOn: {
    type: Boolean,
    default: false
  }
});
var virtualizedListProps = buildProps({
  cache,
  estimatedItemSize,
  layout,
  initScrollOffset,
  total,
  itemSize,
  ...virtualizedProps
});
var scrollbarSize = {
  type: Number,
  default: 6
};
var startGap = { type: Number, default: 0 };
var endGap = { type: Number, default: 2 };
var virtualizedGridProps = buildProps({
  columnCache: cache,
  columnWidth: itemSize,
  estimatedColumnWidth: estimatedItemSize,
  estimatedRowHeight: estimatedItemSize,
  initScrollLeft: initScrollOffset,
  initScrollTop: initScrollOffset,
  itemKey: {
    type: definePropType(Function),
    default: ({
      columnIndex,
      rowIndex
    }) => `${rowIndex}:${columnIndex}`
  },
  rowCache: cache,
  rowHeight: itemSize,
  totalColumn: total,
  totalRow: total,
  hScrollbarSize: scrollbarSize,
  vScrollbarSize: scrollbarSize,
  scrollbarStartGap: startGap,
  scrollbarEndGap: endGap,
  role: String,
  ...virtualizedProps
});
var virtualizedScrollbarProps = buildProps({
  alwaysOn: Boolean,
  class: String,
  layout,
  total,
  ratio: {
    type: Number,
    required: true
  },
  clientSize: {
    type: Number,
    required: true
  },
  scrollFrom: {
    type: Number,
    required: true
  },
  scrollbarSize,
  startGap,
  endGap,
  visible: Boolean
});

// ../node_modules/element-plus/es/components/virtual-list/src/utils.mjs
var getScrollDir = (prev, cur) => prev < cur ? FORWARD : BACKWARD;
var isHorizontal = (dir) => dir === LTR || dir === RTL || dir === HORIZONTAL;
var isRTL = (dir) => dir === RTL;
var cachedRTLResult = null;
function getRTLOffsetType(recalculate = false) {
  if (cachedRTLResult === null || recalculate) {
    const outerDiv = document.createElement("div");
    const outerStyle = outerDiv.style;
    outerStyle.width = "50px";
    outerStyle.height = "50px";
    outerStyle.overflow = "scroll";
    outerStyle.direction = "rtl";
    const innerDiv = document.createElement("div");
    const innerStyle = innerDiv.style;
    innerStyle.width = "100px";
    innerStyle.height = "100px";
    outerDiv.appendChild(innerDiv);
    document.body.appendChild(outerDiv);
    if (outerDiv.scrollLeft > 0) {
      cachedRTLResult = RTL_OFFSET_POS_DESC;
    } else {
      outerDiv.scrollLeft = 1;
      if (outerDiv.scrollLeft === 0) {
        cachedRTLResult = RTL_OFFSET_NAG;
      } else {
        cachedRTLResult = RTL_OFFSET_POS_ASC;
      }
    }
    document.body.removeChild(outerDiv);
    return cachedRTLResult;
  }
  return cachedRTLResult;
}
function renderThumbStyle2({ move, size, bar }, layout2) {
  const style = {};
  const translate = `translate${bar.axis}(${move}px)`;
  style[bar.size] = size;
  style.transform = translate;
  style.msTransform = translate;
  style.webkitTransform = translate;
  if (layout2 === "horizontal") {
    style.height = "100%";
  } else {
    style.width = "100%";
  }
  return style;
}

// ../node_modules/element-plus/es/components/virtual-list/src/components/scrollbar.mjs
var ScrollBar = defineComponent({
  name: "ElVirtualScrollBar",
  props: virtualizedScrollbarProps,
  emits: ["scroll", "start-move", "stop-move"],
  setup(props, { emit }) {
    const GAP2 = computed(() => props.startGap + props.endGap);
    const nsVirtualScrollbar = useNamespace("virtual-scrollbar");
    const nsScrollbar = useNamespace("scrollbar");
    const trackRef = ref();
    const thumbRef = ref();
    let frameHandle = null;
    let onselectstartStore = null;
    const state = reactive({
      isDragging: false,
      traveled: 0
    });
    const bar = computed(() => BAR_MAP[props.layout]);
    const trackSize = computed(() => props.clientSize - unref(GAP2));
    const trackStyle = computed(() => ({
      position: "absolute",
      width: `${HORIZONTAL === props.layout ? trackSize.value : props.scrollbarSize}px`,
      height: `${HORIZONTAL === props.layout ? props.scrollbarSize : trackSize.value}px`,
      [ScrollbarDirKey[props.layout]]: "2px",
      right: "2px",
      bottom: "2px",
      borderRadius: "4px"
    }));
    const thumbSize = computed(() => {
      const ratio = props.ratio;
      const clientSize = props.clientSize;
      if (ratio >= 100) {
        return Number.POSITIVE_INFINITY;
      }
      if (ratio >= 50) {
        return ratio * clientSize / 100;
      }
      const SCROLLBAR_MAX_SIZE = clientSize / 3;
      return Math.floor(Math.min(Math.max(ratio * clientSize, SCROLLBAR_MIN_SIZE), SCROLLBAR_MAX_SIZE));
    });
    const thumbStyle = computed(() => {
      if (!Number.isFinite(thumbSize.value)) {
        return {
          display: "none"
        };
      }
      const thumb = `${thumbSize.value}px`;
      const style = renderThumbStyle2({
        bar: bar.value,
        size: thumb,
        move: state.traveled
      }, props.layout);
      return style;
    });
    const totalSteps = computed(() => Math.floor(props.clientSize - thumbSize.value - unref(GAP2)));
    const attachEvents = () => {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      const thumbEl = unref(thumbRef);
      if (!thumbEl)
        return;
      onselectstartStore = document.onselectstart;
      document.onselectstart = () => false;
      thumbEl.addEventListener("touchmove", onMouseMove);
      thumbEl.addEventListener("touchend", onMouseUp);
    };
    const detachEvents = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      document.onselectstart = onselectstartStore;
      onselectstartStore = null;
      const thumbEl = unref(thumbRef);
      if (!thumbEl)
        return;
      thumbEl.removeEventListener("touchmove", onMouseMove);
      thumbEl.removeEventListener("touchend", onMouseUp);
    };
    const onThumbMouseDown = (e) => {
      e.stopImmediatePropagation();
      if (e.ctrlKey || [1, 2].includes(e.button)) {
        return;
      }
      state.isDragging = true;
      state[bar.value.axis] = e.currentTarget[bar.value.offset] - (e[bar.value.client] - e.currentTarget.getBoundingClientRect()[bar.value.direction]);
      emit("start-move");
      attachEvents();
    };
    const onMouseUp = () => {
      state.isDragging = false;
      state[bar.value.axis] = 0;
      emit("stop-move");
      detachEvents();
    };
    const onMouseMove = (e) => {
      const { isDragging } = state;
      if (!isDragging)
        return;
      if (!thumbRef.value || !trackRef.value)
        return;
      const prevPage = state[bar.value.axis];
      if (!prevPage)
        return;
      cAF(frameHandle);
      const offset = (trackRef.value.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]) * -1;
      const thumbClickPosition = thumbRef.value[bar.value.offset] - prevPage;
      const distance = offset - thumbClickPosition;
      frameHandle = rAF(() => {
        state.traveled = Math.max(props.startGap, Math.min(distance, totalSteps.value));
        emit("scroll", distance, totalSteps.value);
      });
    };
    const clickTrackHandler = (e) => {
      const offset = Math.abs(e.target.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]);
      const thumbHalf = thumbRef.value[bar.value.offset] / 2;
      const distance = offset - thumbHalf;
      state.traveled = Math.max(0, Math.min(distance, totalSteps.value));
      emit("scroll", distance, totalSteps.value);
    };
    watch(() => props.scrollFrom, (v) => {
      if (state.isDragging)
        return;
      state.traveled = Math.ceil(v * totalSteps.value);
    });
    onBeforeUnmount(() => {
      detachEvents();
    });
    return () => {
      return h("div", {
        role: "presentation",
        ref: trackRef,
        class: [
          nsVirtualScrollbar.b(),
          props.class,
          (props.alwaysOn || state.isDragging) && "always-on"
        ],
        style: trackStyle.value,
        onMousedown: withModifiers(clickTrackHandler, ["stop", "prevent"]),
        onTouchstartPrevent: onThumbMouseDown
      }, h("div", {
        ref: thumbRef,
        class: nsScrollbar.e("thumb"),
        style: thumbStyle.value,
        onMousedown: onThumbMouseDown
      }, []));
    };
  }
});

// ../node_modules/element-plus/es/components/virtual-list/src/builders/build-list.mjs
var createList = ({
  name,
  getOffset: getOffset2,
  getItemSize,
  getItemOffset,
  getEstimatedTotalSize: getEstimatedTotalSize2,
  getStartIndexForOffset,
  getStopIndexForStartIndex,
  initCache,
  clearCache,
  validateProps
}) => {
  return defineComponent({
    name: name != null ? name : "ElVirtualList",
    props: virtualizedListProps,
    emits: [ITEM_RENDER_EVT, SCROLL_EVT],
    setup(props, { emit, expose }) {
      validateProps(props);
      const instance = getCurrentInstance();
      const ns = useNamespace("vl");
      const dynamicSizeCache = ref(initCache(props, instance));
      const getItemStyleCache = useCache();
      const windowRef = ref();
      const innerRef = ref();
      const scrollbarRef = ref();
      const states = ref({
        isScrolling: false,
        scrollDir: "forward",
        scrollOffset: isNumber(props.initScrollOffset) ? props.initScrollOffset : 0,
        updateRequested: false,
        isScrollbarDragging: false,
        scrollbarAlwaysOn: props.scrollbarAlwaysOn
      });
      const itemsToRender = computed(() => {
        const { total: total2, cache: cache2 } = props;
        const { isScrolling, scrollDir, scrollOffset } = unref(states);
        if (total2 === 0) {
          return [0, 0, 0, 0];
        }
        const startIndex = getStartIndexForOffset(props, scrollOffset, unref(dynamicSizeCache));
        const stopIndex = getStopIndexForStartIndex(props, startIndex, scrollOffset, unref(dynamicSizeCache));
        const cacheBackward = !isScrolling || scrollDir === BACKWARD ? Math.max(1, cache2) : 1;
        const cacheForward = !isScrolling || scrollDir === FORWARD ? Math.max(1, cache2) : 1;
        return [
          Math.max(0, startIndex - cacheBackward),
          Math.max(0, Math.min(total2 - 1, stopIndex + cacheForward)),
          startIndex,
          stopIndex
        ];
      });
      const estimatedTotalSize = computed(() => getEstimatedTotalSize2(props, unref(dynamicSizeCache)));
      const _isHorizontal = computed(() => isHorizontal(props.layout));
      const windowStyle = computed(() => [
        {
          position: "relative",
          [`overflow-${_isHorizontal.value ? "x" : "y"}`]: "scroll",
          WebkitOverflowScrolling: "touch",
          willChange: "transform"
        },
        {
          direction: props.direction,
          height: isNumber(props.height) ? `${props.height}px` : props.height,
          width: isNumber(props.width) ? `${props.width}px` : props.width
        },
        props.style
      ]);
      const innerStyle = computed(() => {
        const size = unref(estimatedTotalSize);
        const horizontal = unref(_isHorizontal);
        return {
          height: horizontal ? "100%" : `${size}px`,
          pointerEvents: unref(states).isScrolling ? "none" : void 0,
          width: horizontal ? `${size}px` : "100%"
        };
      });
      const clientSize = computed(() => _isHorizontal.value ? props.width : props.height);
      const { onWheel } = useWheel({
        atStartEdge: computed(() => states.value.scrollOffset <= 0),
        atEndEdge: computed(() => states.value.scrollOffset >= estimatedTotalSize.value),
        layout: computed(() => props.layout)
      }, (offset) => {
        var _a, _b;
        ;
        (_b = (_a = scrollbarRef.value).onMouseUp) == null ? void 0 : _b.call(_a);
        scrollTo(Math.min(states.value.scrollOffset + offset, estimatedTotalSize.value - clientSize.value));
      });
      const emitEvents = () => {
        const { total: total2 } = props;
        if (total2 > 0) {
          const [cacheStart, cacheEnd, visibleStart, visibleEnd] = unref(itemsToRender);
          emit(ITEM_RENDER_EVT, cacheStart, cacheEnd, visibleStart, visibleEnd);
        }
        const { scrollDir, scrollOffset, updateRequested } = unref(states);
        emit(SCROLL_EVT, scrollDir, scrollOffset, updateRequested);
      };
      const scrollVertically = (e) => {
        const { clientHeight, scrollHeight, scrollTop } = e.currentTarget;
        const _states = unref(states);
        if (_states.scrollOffset === scrollTop) {
          return;
        }
        const scrollOffset = Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight));
        states.value = {
          ..._states,
          isScrolling: true,
          scrollDir: getScrollDir(_states.scrollOffset, scrollOffset),
          scrollOffset,
          updateRequested: false
        };
        nextTick(resetIsScrolling);
      };
      const scrollHorizontally = (e) => {
        const { clientWidth, scrollLeft, scrollWidth } = e.currentTarget;
        const _states = unref(states);
        if (_states.scrollOffset === scrollLeft) {
          return;
        }
        const { direction: direction2 } = props;
        let scrollOffset = scrollLeft;
        if (direction2 === RTL) {
          switch (getRTLOffsetType()) {
            case RTL_OFFSET_NAG: {
              scrollOffset = -scrollLeft;
              break;
            }
            case RTL_OFFSET_POS_DESC: {
              scrollOffset = scrollWidth - clientWidth - scrollLeft;
              break;
            }
          }
        }
        scrollOffset = Math.max(0, Math.min(scrollOffset, scrollWidth - clientWidth));
        states.value = {
          ..._states,
          isScrolling: true,
          scrollDir: getScrollDir(_states.scrollOffset, scrollOffset),
          scrollOffset,
          updateRequested: false
        };
        nextTick(resetIsScrolling);
      };
      const onScroll = (e) => {
        unref(_isHorizontal) ? scrollHorizontally(e) : scrollVertically(e);
        emitEvents();
      };
      const onScrollbarScroll = (distanceToGo, totalSteps) => {
        const offset = (estimatedTotalSize.value - clientSize.value) / totalSteps * distanceToGo;
        scrollTo(Math.min(estimatedTotalSize.value - clientSize.value, offset));
      };
      const scrollTo = (offset) => {
        offset = Math.max(offset, 0);
        if (offset === unref(states).scrollOffset) {
          return;
        }
        states.value = {
          ...unref(states),
          scrollOffset: offset,
          scrollDir: getScrollDir(unref(states).scrollOffset, offset),
          updateRequested: true
        };
        nextTick(resetIsScrolling);
      };
      const scrollToItem = (idx, alignment = AUTO_ALIGNMENT) => {
        const { scrollOffset } = unref(states);
        idx = Math.max(0, Math.min(idx, props.total - 1));
        scrollTo(getOffset2(props, idx, alignment, scrollOffset, unref(dynamicSizeCache)));
      };
      const getItemStyle = (idx) => {
        const { direction: direction2, itemSize: itemSize2, layout: layout2 } = props;
        const itemStyleCache = getItemStyleCache.value(clearCache && itemSize2, clearCache && layout2, clearCache && direction2);
        let style;
        if (hasOwn(itemStyleCache, String(idx))) {
          style = itemStyleCache[idx];
        } else {
          const offset = getItemOffset(props, idx, unref(dynamicSizeCache));
          const size = getItemSize(props, idx, unref(dynamicSizeCache));
          const horizontal = unref(_isHorizontal);
          const isRtl = direction2 === RTL;
          const offsetHorizontal = horizontal ? offset : 0;
          itemStyleCache[idx] = style = {
            position: "absolute",
            left: isRtl ? void 0 : `${offsetHorizontal}px`,
            right: isRtl ? `${offsetHorizontal}px` : void 0,
            top: !horizontal ? `${offset}px` : 0,
            height: !horizontal ? `${size}px` : "100%",
            width: horizontal ? `${size}px` : "100%"
          };
        }
        return style;
      };
      const resetIsScrolling = () => {
        states.value.isScrolling = false;
        nextTick(() => {
          getItemStyleCache.value(-1, null, null);
        });
      };
      const resetScrollTop = () => {
        const window2 = windowRef.value;
        if (window2) {
          window2.scrollTop = 0;
        }
      };
      onMounted(() => {
        if (!isClient)
          return;
        const { initScrollOffset: initScrollOffset2 } = props;
        const windowElement = unref(windowRef);
        if (isNumber(initScrollOffset2) && windowElement) {
          if (unref(_isHorizontal)) {
            windowElement.scrollLeft = initScrollOffset2;
          } else {
            windowElement.scrollTop = initScrollOffset2;
          }
        }
        emitEvents();
      });
      onUpdated(() => {
        const { direction: direction2, layout: layout2 } = props;
        const { scrollOffset, updateRequested } = unref(states);
        const windowElement = unref(windowRef);
        if (updateRequested && windowElement) {
          if (layout2 === HORIZONTAL) {
            if (direction2 === RTL) {
              switch (getRTLOffsetType()) {
                case RTL_OFFSET_NAG: {
                  windowElement.scrollLeft = -scrollOffset;
                  break;
                }
                case RTL_OFFSET_POS_ASC: {
                  windowElement.scrollLeft = scrollOffset;
                  break;
                }
                default: {
                  const { clientWidth, scrollWidth } = windowElement;
                  windowElement.scrollLeft = scrollWidth - clientWidth - scrollOffset;
                  break;
                }
              }
            } else {
              windowElement.scrollLeft = scrollOffset;
            }
          } else {
            windowElement.scrollTop = scrollOffset;
          }
        }
      });
      const api = {
        ns,
        clientSize,
        estimatedTotalSize,
        windowStyle,
        windowRef,
        innerRef,
        innerStyle,
        itemsToRender,
        scrollbarRef,
        states,
        getItemStyle,
        onScroll,
        onScrollbarScroll,
        onWheel,
        scrollTo,
        scrollToItem,
        resetScrollTop
      };
      expose({
        windowRef,
        innerRef,
        getItemStyleCache,
        scrollTo,
        scrollToItem,
        resetScrollTop,
        states
      });
      return api;
    },
    render(ctx) {
      var _a;
      const {
        $slots,
        className,
        clientSize,
        containerElement,
        data,
        getItemStyle,
        innerElement,
        itemsToRender,
        innerStyle,
        layout: layout2,
        total: total2,
        onScroll,
        onScrollbarScroll,
        onWheel,
        states,
        useIsScrolling,
        windowStyle,
        ns
      } = ctx;
      const [start, end] = itemsToRender;
      const Container = resolveDynamicComponent(containerElement);
      const Inner = resolveDynamicComponent(innerElement);
      const children = [];
      if (total2 > 0) {
        for (let i = start; i <= end; i++) {
          children.push((_a = $slots.default) == null ? void 0 : _a.call($slots, {
            data,
            key: i,
            index: i,
            isScrolling: useIsScrolling ? states.isScrolling : void 0,
            style: getItemStyle(i)
          }));
        }
      }
      const InnerNode = [
        h(Inner, {
          style: innerStyle,
          ref: "innerRef"
        }, !isString(Inner) ? {
          default: () => children
        } : children)
      ];
      const scrollbar = h(ScrollBar, {
        ref: "scrollbarRef",
        clientSize,
        layout: layout2,
        onScroll: onScrollbarScroll,
        ratio: clientSize * 100 / this.estimatedTotalSize,
        scrollFrom: states.scrollOffset / (this.estimatedTotalSize - clientSize),
        total: total2
      });
      const listContainer = h(Container, {
        class: [ns.e("window"), className],
        style: windowStyle,
        onScroll,
        onWheel,
        ref: "windowRef",
        key: 0
      }, !isString(Container) ? { default: () => [InnerNode] } : [InnerNode]);
      return h("div", {
        key: 0,
        class: [ns.e("wrapper"), states.scrollbarAlwaysOn ? "always-on" : ""]
      }, [listContainer, scrollbar]);
    }
  });
};

// ../node_modules/element-plus/es/components/virtual-list/src/components/fixed-size-list.mjs
var FixedSizeList = createList({
  name: "ElFixedSizeList",
  getItemOffset: ({ itemSize: itemSize2 }, index) => index * itemSize2,
  getItemSize: ({ itemSize: itemSize2 }) => itemSize2,
  getEstimatedTotalSize: ({ total: total2, itemSize: itemSize2 }) => itemSize2 * total2,
  getOffset: ({ height, total: total2, itemSize: itemSize2, layout: layout2, width }, index, alignment, scrollOffset) => {
    const size = isHorizontal(layout2) ? width : height;
    if (isString(size)) {
      throwError("[ElVirtualList]", `
        You should set
          width/height
        to number when your layout is
          horizontal/vertical
      `);
    }
    const lastItemOffset = Math.max(0, total2 * itemSize2 - size);
    const maxOffset = Math.min(lastItemOffset, index * itemSize2);
    const minOffset = Math.max(0, (index + 1) * itemSize2 - size);
    if (alignment === SMART_ALIGNMENT) {
      if (scrollOffset >= minOffset - size && scrollOffset <= maxOffset + size) {
        alignment = AUTO_ALIGNMENT;
      } else {
        alignment = CENTERED_ALIGNMENT;
      }
    }
    switch (alignment) {
      case START_ALIGNMENT: {
        return maxOffset;
      }
      case END_ALIGNMENT: {
        return minOffset;
      }
      case CENTERED_ALIGNMENT: {
        const middleOffset = Math.round(minOffset + (maxOffset - minOffset) / 2);
        if (middleOffset < Math.ceil(size / 2)) {
          return 0;
        } else if (middleOffset > lastItemOffset + Math.floor(size / 2)) {
          return lastItemOffset;
        } else {
          return middleOffset;
        }
      }
      case AUTO_ALIGNMENT:
      default: {
        if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
          return scrollOffset;
        } else if (scrollOffset < minOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
      }
    }
  },
  getStartIndexForOffset: ({ total: total2, itemSize: itemSize2 }, offset) => Math.max(0, Math.min(total2 - 1, Math.floor(offset / itemSize2))),
  getStopIndexForStartIndex: ({ height, total: total2, itemSize: itemSize2, layout: layout2, width }, startIndex, scrollOffset) => {
    const offset = startIndex * itemSize2;
    const size = isHorizontal(layout2) ? width : height;
    const numVisibleItems = Math.ceil((size + scrollOffset - offset) / itemSize2);
    return Math.max(0, Math.min(total2 - 1, startIndex + numVisibleItems - 1));
  },
  initCache() {
    return void 0;
  },
  clearCache: true,
  validateProps() {
  }
});

// ../node_modules/element-plus/es/components/virtual-list/src/components/dynamic-size-list.mjs
var SCOPE = "ElDynamicSizeList";
var getItemFromCache = (props, index, listCache) => {
  const { itemSize: itemSize2 } = props;
  const { items, lastVisitedIndex } = listCache;
  if (index > lastVisitedIndex) {
    let offset = 0;
    if (lastVisitedIndex >= 0) {
      const item = items[lastVisitedIndex];
      offset = item.offset + item.size;
    }
    for (let i = lastVisitedIndex + 1; i <= index; i++) {
      const size = itemSize2(i);
      items[i] = {
        offset,
        size
      };
      offset += size;
    }
    listCache.lastVisitedIndex = index;
  }
  return items[index];
};
var findItem = (props, listCache, offset) => {
  const { items, lastVisitedIndex } = listCache;
  const lastVisitedOffset = lastVisitedIndex > 0 ? items[lastVisitedIndex].offset : 0;
  if (lastVisitedOffset >= offset) {
    return bs(props, listCache, 0, lastVisitedIndex, offset);
  }
  return es(props, listCache, Math.max(0, lastVisitedIndex), offset);
};
var bs = (props, listCache, low, high, offset) => {
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const currentOffset = getItemFromCache(props, mid, listCache).offset;
    if (currentOffset === offset) {
      return mid;
    } else if (currentOffset < offset) {
      low = mid + 1;
    } else if (currentOffset > offset) {
      high = mid - 1;
    }
  }
  return Math.max(0, low - 1);
};
var es = (props, listCache, index, offset) => {
  const { total: total2 } = props;
  let exponent = 1;
  while (index < total2 && getItemFromCache(props, index, listCache).offset < offset) {
    index += exponent;
    exponent *= 2;
  }
  return bs(props, listCache, Math.floor(index / 2), Math.min(index, total2 - 1), offset);
};
var getEstimatedTotalSize = ({ total: total2 }, { items, estimatedItemSize: estimatedItemSize2, lastVisitedIndex }) => {
  let totalSizeOfMeasuredItems = 0;
  if (lastVisitedIndex >= total2) {
    lastVisitedIndex = total2 - 1;
  }
  if (lastVisitedIndex >= 0) {
    const item = items[lastVisitedIndex];
    totalSizeOfMeasuredItems = item.offset + item.size;
  }
  const numUnmeasuredItems = total2 - lastVisitedIndex - 1;
  const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedItemSize2;
  return totalSizeOfMeasuredItems + totalSizeOfUnmeasuredItems;
};
var DynamicSizeList = createList({
  name: "ElDynamicSizeList",
  getItemOffset: (props, index, listCache) => getItemFromCache(props, index, listCache).offset,
  getItemSize: (_, index, { items }) => items[index].size,
  getEstimatedTotalSize,
  getOffset: (props, index, alignment, scrollOffset, listCache) => {
    const { height, layout: layout2, width } = props;
    const size = isHorizontal(layout2) ? width : height;
    const item = getItemFromCache(props, index, listCache);
    const estimatedTotalSize = getEstimatedTotalSize(props, listCache);
    const maxOffset = Math.max(0, Math.min(estimatedTotalSize - size, item.offset));
    const minOffset = Math.max(0, item.offset - size + item.size);
    if (alignment === SMART_ALIGNMENT) {
      if (scrollOffset >= minOffset - size && scrollOffset <= maxOffset + size) {
        alignment = AUTO_ALIGNMENT;
      } else {
        alignment = CENTERED_ALIGNMENT;
      }
    }
    switch (alignment) {
      case START_ALIGNMENT: {
        return maxOffset;
      }
      case END_ALIGNMENT: {
        return minOffset;
      }
      case CENTERED_ALIGNMENT: {
        return Math.round(minOffset + (maxOffset - minOffset) / 2);
      }
      case AUTO_ALIGNMENT:
      default: {
        if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
          return scrollOffset;
        } else if (scrollOffset < minOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
      }
    }
  },
  getStartIndexForOffset: (props, offset, listCache) => findItem(props, listCache, offset),
  getStopIndexForStartIndex: (props, startIndex, scrollOffset, listCache) => {
    const { height, total: total2, layout: layout2, width } = props;
    const size = isHorizontal(layout2) ? width : height;
    const item = getItemFromCache(props, startIndex, listCache);
    const maxOffset = scrollOffset + size;
    let offset = item.offset + item.size;
    let stopIndex = startIndex;
    while (stopIndex < total2 - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemFromCache(props, stopIndex, listCache).size;
    }
    return stopIndex;
  },
  initCache({ estimatedItemSize: estimatedItemSize2 = DEFAULT_DYNAMIC_LIST_ITEM_SIZE }, instance) {
    const cache2 = {
      items: {},
      estimatedItemSize: estimatedItemSize2,
      lastVisitedIndex: -1
    };
    cache2.clearCacheAfterIndex = (index, forceUpdate = true) => {
      var _a, _b;
      cache2.lastVisitedIndex = Math.min(cache2.lastVisitedIndex, index - 1);
      (_a = instance.exposed) == null ? void 0 : _a.getItemStyleCache(-1);
      if (forceUpdate) {
        (_b = instance.proxy) == null ? void 0 : _b.$forceUpdate();
      }
    };
    return cache2;
  },
  clearCache: false,
  validateProps: ({ itemSize: itemSize2 }) => {
    if (true) {
      if (typeof itemSize2 !== "function") {
        throwError(SCOPE, `
          itemSize is required as function, but the given value was ${typeof itemSize2}
        `);
      }
    }
  }
});

// ../node_modules/element-plus/es/components/virtual-list/src/hooks/use-grid-wheel.mjs
var useGridWheel = ({ atXEndEdge, atXStartEdge, atYEndEdge, atYStartEdge }, onWheelDelta) => {
  let frameHandle = null;
  let xOffset = 0;
  let yOffset = 0;
  const hasReachedEdge = (x, y) => {
    const xEdgeReached = x <= 0 && atXStartEdge.value || x >= 0 && atXEndEdge.value;
    const yEdgeReached = y <= 0 && atYStartEdge.value || y >= 0 && atYEndEdge.value;
    return xEdgeReached && yEdgeReached;
  };
  const onWheel = (e) => {
    cAF(frameHandle);
    let x = e.deltaX;
    let y = e.deltaY;
    if (Math.abs(x) > Math.abs(y)) {
      y = 0;
    } else {
      x = 0;
    }
    if (e.shiftKey && y !== 0) {
      x = y;
      y = 0;
    }
    if (hasReachedEdge(xOffset, yOffset) && hasReachedEdge(xOffset + x, yOffset + y))
      return;
    xOffset += x;
    yOffset += y;
    e.preventDefault();
    frameHandle = rAF(() => {
      onWheelDelta(xOffset, yOffset);
      xOffset = 0;
      yOffset = 0;
    });
  };
  return {
    hasReachedEdge,
    onWheel
  };
};

// ../node_modules/element-plus/es/components/virtual-list/src/builders/build-grid.mjs
var createGrid = ({
  name,
  clearCache,
  getColumnPosition,
  getColumnStartIndexForOffset,
  getColumnStopIndexForStartIndex,
  getEstimatedTotalHeight: getEstimatedTotalHeight2,
  getEstimatedTotalWidth: getEstimatedTotalWidth2,
  getColumnOffset,
  getRowOffset,
  getRowPosition,
  getRowStartIndexForOffset,
  getRowStopIndexForStartIndex,
  initCache,
  injectToInstance,
  validateProps
}) => {
  return defineComponent({
    name: name != null ? name : "ElVirtualList",
    props: virtualizedGridProps,
    emits: [ITEM_RENDER_EVT, SCROLL_EVT],
    setup(props, { emit, expose, slots }) {
      const ns = useNamespace("vl");
      validateProps(props);
      const instance = getCurrentInstance();
      const cache2 = ref(initCache(props, instance));
      injectToInstance == null ? void 0 : injectToInstance(instance, cache2);
      const windowRef = ref();
      const hScrollbar = ref();
      const vScrollbar = ref();
      const innerRef = ref(null);
      const states = ref({
        isScrolling: false,
        scrollLeft: isNumber(props.initScrollLeft) ? props.initScrollLeft : 0,
        scrollTop: isNumber(props.initScrollTop) ? props.initScrollTop : 0,
        updateRequested: false,
        xAxisScrollDir: FORWARD,
        yAxisScrollDir: FORWARD
      });
      const getItemStyleCache = useCache();
      const parsedHeight = computed(() => Number.parseInt(`${props.height}`, 10));
      const parsedWidth = computed(() => Number.parseInt(`${props.width}`, 10));
      const columnsToRender = computed(() => {
        const { totalColumn, totalRow, columnCache } = props;
        const { isScrolling, xAxisScrollDir, scrollLeft } = unref(states);
        if (totalColumn === 0 || totalRow === 0) {
          return [0, 0, 0, 0];
        }
        const startIndex = getColumnStartIndexForOffset(props, scrollLeft, unref(cache2));
        const stopIndex = getColumnStopIndexForStartIndex(props, startIndex, scrollLeft, unref(cache2));
        const cacheBackward = !isScrolling || xAxisScrollDir === BACKWARD ? Math.max(1, columnCache) : 1;
        const cacheForward = !isScrolling || xAxisScrollDir === FORWARD ? Math.max(1, columnCache) : 1;
        return [
          Math.max(0, startIndex - cacheBackward),
          Math.max(0, Math.min(totalColumn - 1, stopIndex + cacheForward)),
          startIndex,
          stopIndex
        ];
      });
      const rowsToRender = computed(() => {
        const { totalColumn, totalRow, rowCache } = props;
        const { isScrolling, yAxisScrollDir, scrollTop } = unref(states);
        if (totalColumn === 0 || totalRow === 0) {
          return [0, 0, 0, 0];
        }
        const startIndex = getRowStartIndexForOffset(props, scrollTop, unref(cache2));
        const stopIndex = getRowStopIndexForStartIndex(props, startIndex, scrollTop, unref(cache2));
        const cacheBackward = !isScrolling || yAxisScrollDir === BACKWARD ? Math.max(1, rowCache) : 1;
        const cacheForward = !isScrolling || yAxisScrollDir === FORWARD ? Math.max(1, rowCache) : 1;
        return [
          Math.max(0, startIndex - cacheBackward),
          Math.max(0, Math.min(totalRow - 1, stopIndex + cacheForward)),
          startIndex,
          stopIndex
        ];
      });
      const estimatedTotalHeight = computed(() => getEstimatedTotalHeight2(props, unref(cache2)));
      const estimatedTotalWidth = computed(() => getEstimatedTotalWidth2(props, unref(cache2)));
      const windowStyle = computed(() => {
        var _a;
        return [
          {
            position: "relative",
            overflow: "hidden",
            WebkitOverflowScrolling: "touch",
            willChange: "transform"
          },
          {
            direction: props.direction,
            height: isNumber(props.height) ? `${props.height}px` : props.height,
            width: isNumber(props.width) ? `${props.width}px` : props.width
          },
          (_a = props.style) != null ? _a : {}
        ];
      });
      const innerStyle = computed(() => {
        const width = `${unref(estimatedTotalWidth)}px`;
        const height = `${unref(estimatedTotalHeight)}px`;
        return {
          height,
          pointerEvents: unref(states).isScrolling ? "none" : void 0,
          width
        };
      });
      const emitEvents = () => {
        const { totalColumn, totalRow } = props;
        if (totalColumn > 0 && totalRow > 0) {
          const [
            columnCacheStart,
            columnCacheEnd,
            columnVisibleStart,
            columnVisibleEnd
          ] = unref(columnsToRender);
          const [rowCacheStart, rowCacheEnd, rowVisibleStart, rowVisibleEnd] = unref(rowsToRender);
          emit(ITEM_RENDER_EVT, {
            columnCacheStart,
            columnCacheEnd,
            rowCacheStart,
            rowCacheEnd,
            columnVisibleStart,
            columnVisibleEnd,
            rowVisibleStart,
            rowVisibleEnd
          });
        }
        const {
          scrollLeft,
          scrollTop,
          updateRequested,
          xAxisScrollDir,
          yAxisScrollDir
        } = unref(states);
        emit(SCROLL_EVT, {
          xAxisScrollDir,
          scrollLeft,
          yAxisScrollDir,
          scrollTop,
          updateRequested
        });
      };
      const onScroll = (e) => {
        const {
          clientHeight,
          clientWidth,
          scrollHeight,
          scrollLeft,
          scrollTop,
          scrollWidth
        } = e.currentTarget;
        const _states = unref(states);
        if (_states.scrollTop === scrollTop && _states.scrollLeft === scrollLeft) {
          return;
        }
        let _scrollLeft = scrollLeft;
        if (isRTL(props.direction)) {
          switch (getRTLOffsetType()) {
            case RTL_OFFSET_NAG:
              _scrollLeft = -scrollLeft;
              break;
            case RTL_OFFSET_POS_DESC:
              _scrollLeft = scrollWidth - clientWidth - scrollLeft;
              break;
          }
        }
        states.value = {
          ..._states,
          isScrolling: true,
          scrollLeft: _scrollLeft,
          scrollTop: Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight)),
          updateRequested: true,
          xAxisScrollDir: getScrollDir(_states.scrollLeft, _scrollLeft),
          yAxisScrollDir: getScrollDir(_states.scrollTop, scrollTop)
        };
        nextTick(() => resetIsScrolling());
        onUpdated2();
        emitEvents();
      };
      const onVerticalScroll = (distance, totalSteps) => {
        const height = unref(parsedHeight);
        const offset = (estimatedTotalHeight.value - height) / totalSteps * distance;
        scrollTo({
          scrollTop: Math.min(estimatedTotalHeight.value - height, offset)
        });
      };
      const onHorizontalScroll = (distance, totalSteps) => {
        const width = unref(parsedWidth);
        const offset = (estimatedTotalWidth.value - width) / totalSteps * distance;
        scrollTo({
          scrollLeft: Math.min(estimatedTotalWidth.value - width, offset)
        });
      };
      const { onWheel } = useGridWheel({
        atXStartEdge: computed(() => states.value.scrollLeft <= 0),
        atXEndEdge: computed(() => states.value.scrollLeft >= estimatedTotalWidth.value - unref(parsedWidth)),
        atYStartEdge: computed(() => states.value.scrollTop <= 0),
        atYEndEdge: computed(() => states.value.scrollTop >= estimatedTotalHeight.value - unref(parsedHeight))
      }, (x, y) => {
        var _a, _b, _c, _d;
        (_b = (_a = hScrollbar.value) == null ? void 0 : _a.onMouseUp) == null ? void 0 : _b.call(_a);
        (_d = (_c = hScrollbar.value) == null ? void 0 : _c.onMouseUp) == null ? void 0 : _d.call(_c);
        const width = unref(parsedWidth);
        const height = unref(parsedHeight);
        scrollTo({
          scrollLeft: Math.min(states.value.scrollLeft + x, estimatedTotalWidth.value - width),
          scrollTop: Math.min(states.value.scrollTop + y, estimatedTotalHeight.value - height)
        });
      });
      const scrollTo = ({
        scrollLeft = states.value.scrollLeft,
        scrollTop = states.value.scrollTop
      }) => {
        scrollLeft = Math.max(scrollLeft, 0);
        scrollTop = Math.max(scrollTop, 0);
        const _states = unref(states);
        if (scrollTop === _states.scrollTop && scrollLeft === _states.scrollLeft) {
          return;
        }
        states.value = {
          ..._states,
          xAxisScrollDir: getScrollDir(_states.scrollLeft, scrollLeft),
          yAxisScrollDir: getScrollDir(_states.scrollTop, scrollTop),
          scrollLeft,
          scrollTop,
          updateRequested: true
        };
        nextTick(() => resetIsScrolling());
        onUpdated2();
        emitEvents();
      };
      const scrollToItem = (rowIndex = 0, columnIdx = 0, alignment = AUTO_ALIGNMENT) => {
        const _states = unref(states);
        columnIdx = Math.max(0, Math.min(columnIdx, props.totalColumn - 1));
        rowIndex = Math.max(0, Math.min(rowIndex, props.totalRow - 1));
        const scrollBarWidth = getScrollBarWidth(ns.namespace.value);
        const _cache = unref(cache2);
        const estimatedHeight = getEstimatedTotalHeight2(props, _cache);
        const estimatedWidth = getEstimatedTotalWidth2(props, _cache);
        scrollTo({
          scrollLeft: getColumnOffset(props, columnIdx, alignment, _states.scrollLeft, _cache, estimatedWidth > props.width ? scrollBarWidth : 0),
          scrollTop: getRowOffset(props, rowIndex, alignment, _states.scrollTop, _cache, estimatedHeight > props.height ? scrollBarWidth : 0)
        });
      };
      const getItemStyle = (rowIndex, columnIndex) => {
        const { columnWidth, direction: direction2, rowHeight } = props;
        const itemStyleCache = getItemStyleCache.value(clearCache && columnWidth, clearCache && rowHeight, clearCache && direction2);
        const key = `${rowIndex},${columnIndex}`;
        if (hasOwn(itemStyleCache, key)) {
          return itemStyleCache[key];
        } else {
          const [, left] = getColumnPosition(props, columnIndex, unref(cache2));
          const _cache = unref(cache2);
          const rtl = isRTL(direction2);
          const [height, top] = getRowPosition(props, rowIndex, _cache);
          const [width] = getColumnPosition(props, columnIndex, _cache);
          itemStyleCache[key] = {
            position: "absolute",
            left: rtl ? void 0 : `${left}px`,
            right: rtl ? `${left}px` : void 0,
            top: `${top}px`,
            height: `${height}px`,
            width: `${width}px`
          };
          return itemStyleCache[key];
        }
      };
      const resetIsScrolling = () => {
        states.value.isScrolling = false;
        nextTick(() => {
          getItemStyleCache.value(-1, null, null);
        });
      };
      onMounted(() => {
        if (!isClient)
          return;
        const { initScrollLeft, initScrollTop } = props;
        const windowElement = unref(windowRef);
        if (windowElement) {
          if (isNumber(initScrollLeft)) {
            windowElement.scrollLeft = initScrollLeft;
          }
          if (isNumber(initScrollTop)) {
            windowElement.scrollTop = initScrollTop;
          }
        }
        emitEvents();
      });
      const onUpdated2 = () => {
        const { direction: direction2 } = props;
        const { scrollLeft, scrollTop, updateRequested } = unref(states);
        const windowElement = unref(windowRef);
        if (updateRequested && windowElement) {
          if (direction2 === RTL) {
            switch (getRTLOffsetType()) {
              case RTL_OFFSET_NAG: {
                windowElement.scrollLeft = -scrollLeft;
                break;
              }
              case RTL_OFFSET_POS_ASC: {
                windowElement.scrollLeft = scrollLeft;
                break;
              }
              default: {
                const { clientWidth, scrollWidth } = windowElement;
                windowElement.scrollLeft = scrollWidth - clientWidth - scrollLeft;
                break;
              }
            }
          } else {
            windowElement.scrollLeft = Math.max(0, scrollLeft);
          }
          windowElement.scrollTop = Math.max(0, scrollTop);
        }
      };
      const { resetAfterColumnIndex, resetAfterRowIndex, resetAfter } = instance.proxy;
      expose({
        windowRef,
        innerRef,
        getItemStyleCache,
        scrollTo,
        scrollToItem,
        states,
        resetAfterColumnIndex,
        resetAfterRowIndex,
        resetAfter
      });
      const renderScrollbars = () => {
        const {
          scrollbarAlwaysOn,
          scrollbarStartGap,
          scrollbarEndGap,
          totalColumn,
          totalRow
        } = props;
        const width = unref(parsedWidth);
        const height = unref(parsedHeight);
        const estimatedWidth = unref(estimatedTotalWidth);
        const estimatedHeight = unref(estimatedTotalHeight);
        const { scrollLeft, scrollTop } = unref(states);
        const horizontalScrollbar = h(ScrollBar, {
          ref: hScrollbar,
          alwaysOn: scrollbarAlwaysOn,
          startGap: scrollbarStartGap,
          endGap: scrollbarEndGap,
          class: ns.e("horizontal"),
          clientSize: width,
          layout: "horizontal",
          onScroll: onHorizontalScroll,
          ratio: width * 100 / estimatedWidth,
          scrollFrom: scrollLeft / (estimatedWidth - width),
          total: totalRow,
          visible: true
        });
        const verticalScrollbar = h(ScrollBar, {
          ref: vScrollbar,
          alwaysOn: scrollbarAlwaysOn,
          startGap: scrollbarStartGap,
          endGap: scrollbarEndGap,
          class: ns.e("vertical"),
          clientSize: height,
          layout: "vertical",
          onScroll: onVerticalScroll,
          ratio: height * 100 / estimatedHeight,
          scrollFrom: scrollTop / (estimatedHeight - height),
          total: totalColumn,
          visible: true
        });
        return {
          horizontalScrollbar,
          verticalScrollbar
        };
      };
      const renderItems = () => {
        var _a;
        const [columnStart, columnEnd] = unref(columnsToRender);
        const [rowStart, rowEnd] = unref(rowsToRender);
        const { data, totalColumn, totalRow, useIsScrolling, itemKey } = props;
        const children = [];
        if (totalRow > 0 && totalColumn > 0) {
          for (let row = rowStart; row <= rowEnd; row++) {
            for (let column = columnStart; column <= columnEnd; column++) {
              children.push((_a = slots.default) == null ? void 0 : _a.call(slots, {
                columnIndex: column,
                data,
                key: itemKey({ columnIndex: column, data, rowIndex: row }),
                isScrolling: useIsScrolling ? unref(states).isScrolling : void 0,
                style: getItemStyle(row, column),
                rowIndex: row
              }));
            }
          }
        }
        return children;
      };
      const renderInner = () => {
        const Inner = resolveDynamicComponent(props.innerElement);
        const children = renderItems();
        return [
          h(Inner, {
            style: unref(innerStyle),
            ref: innerRef
          }, !isString(Inner) ? {
            default: () => children
          } : children)
        ];
      };
      const renderWindow = () => {
        const Container = resolveDynamicComponent(props.containerElement);
        const { horizontalScrollbar, verticalScrollbar } = renderScrollbars();
        const Inner = renderInner();
        return h("div", {
          key: 0,
          class: ns.e("wrapper"),
          role: props.role
        }, [
          h(Container, {
            class: props.className,
            style: unref(windowStyle),
            onScroll,
            onWheel,
            ref: windowRef
          }, !isString(Container) ? { default: () => Inner } : Inner),
          horizontalScrollbar,
          verticalScrollbar
        ]);
      };
      return renderWindow;
    }
  });
};

// ../node_modules/element-plus/es/components/virtual-list/src/components/fixed-size-grid.mjs
var SCOPE2 = "ElFixedSizeGrid";
var FixedSizeGrid = createGrid({
  name: "ElFixedSizeGrid",
  getColumnPosition: ({ columnWidth }, index) => [
    columnWidth,
    index * columnWidth
  ],
  getRowPosition: ({ rowHeight }, index) => [
    rowHeight,
    index * rowHeight
  ],
  getEstimatedTotalHeight: ({ totalRow, rowHeight }) => rowHeight * totalRow,
  getEstimatedTotalWidth: ({ totalColumn, columnWidth }) => columnWidth * totalColumn,
  getColumnOffset: ({ totalColumn, columnWidth, width }, columnIndex, alignment, scrollLeft, _, scrollBarWidth) => {
    width = Number(width);
    const lastColumnOffset = Math.max(0, totalColumn * columnWidth - width);
    const maxOffset = Math.min(lastColumnOffset, columnIndex * columnWidth);
    const minOffset = Math.max(0, columnIndex * columnWidth - width + scrollBarWidth + columnWidth);
    if (alignment === "smart") {
      if (scrollLeft >= minOffset - width && scrollLeft <= maxOffset + width) {
        alignment = AUTO_ALIGNMENT;
      } else {
        alignment = CENTERED_ALIGNMENT;
      }
    }
    switch (alignment) {
      case START_ALIGNMENT:
        return maxOffset;
      case END_ALIGNMENT:
        return minOffset;
      case CENTERED_ALIGNMENT: {
        const middleOffset = Math.round(minOffset + (maxOffset - minOffset) / 2);
        if (middleOffset < Math.ceil(width / 2)) {
          return 0;
        } else if (middleOffset > lastColumnOffset + Math.floor(width / 2)) {
          return lastColumnOffset;
        } else {
          return middleOffset;
        }
      }
      case AUTO_ALIGNMENT:
      default:
        if (scrollLeft >= minOffset && scrollLeft <= maxOffset) {
          return scrollLeft;
        } else if (minOffset > maxOffset) {
          return minOffset;
        } else if (scrollLeft < minOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
    }
  },
  getRowOffset: ({ rowHeight, height, totalRow }, rowIndex, align, scrollTop, _, scrollBarWidth) => {
    height = Number(height);
    const lastRowOffset = Math.max(0, totalRow * rowHeight - height);
    const maxOffset = Math.min(lastRowOffset, rowIndex * rowHeight);
    const minOffset = Math.max(0, rowIndex * rowHeight - height + scrollBarWidth + rowHeight);
    if (align === SMART_ALIGNMENT) {
      if (scrollTop >= minOffset - height && scrollTop <= maxOffset + height) {
        align = AUTO_ALIGNMENT;
      } else {
        align = CENTERED_ALIGNMENT;
      }
    }
    switch (align) {
      case START_ALIGNMENT:
        return maxOffset;
      case END_ALIGNMENT:
        return minOffset;
      case CENTERED_ALIGNMENT: {
        const middleOffset = Math.round(minOffset + (maxOffset - minOffset) / 2);
        if (middleOffset < Math.ceil(height / 2)) {
          return 0;
        } else if (middleOffset > lastRowOffset + Math.floor(height / 2)) {
          return lastRowOffset;
        } else {
          return middleOffset;
        }
      }
      case AUTO_ALIGNMENT:
      default:
        if (scrollTop >= minOffset && scrollTop <= maxOffset) {
          return scrollTop;
        } else if (minOffset > maxOffset) {
          return minOffset;
        } else if (scrollTop < minOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
    }
  },
  getColumnStartIndexForOffset: ({ columnWidth, totalColumn }, scrollLeft) => Math.max(0, Math.min(totalColumn - 1, Math.floor(scrollLeft / columnWidth))),
  getColumnStopIndexForStartIndex: ({ columnWidth, totalColumn, width }, startIndex, scrollLeft) => {
    const left = startIndex * columnWidth;
    const visibleColumnsCount = Math.ceil((width + scrollLeft - left) / columnWidth);
    return Math.max(0, Math.min(totalColumn - 1, startIndex + visibleColumnsCount - 1));
  },
  getRowStartIndexForOffset: ({ rowHeight, totalRow }, scrollTop) => Math.max(0, Math.min(totalRow - 1, Math.floor(scrollTop / rowHeight))),
  getRowStopIndexForStartIndex: ({ rowHeight, totalRow, height }, startIndex, scrollTop) => {
    const top = startIndex * rowHeight;
    const numVisibleRows = Math.ceil((height + scrollTop - top) / rowHeight);
    return Math.max(0, Math.min(totalRow - 1, startIndex + numVisibleRows - 1));
  },
  initCache: () => void 0,
  clearCache: true,
  validateProps: ({ columnWidth, rowHeight }) => {
    if (true) {
      if (!isNumber(columnWidth)) {
        throwError(SCOPE2, `
          "columnWidth" must be passed as number,
            instead ${typeof columnWidth} was given.
        `);
      }
      if (!isNumber(rowHeight)) {
        throwError(SCOPE2, `
          "columnWidth" must be passed as number,
            instead ${typeof rowHeight} was given.
        `);
      }
    }
  }
});

// ../node_modules/element-plus/es/components/virtual-list/src/components/dynamic-size-grid.mjs
var { max, min, floor } = Math;
var SCOPE3 = "ElDynamicSizeGrid";
var ACCESS_SIZER_KEY_MAP = {
  column: "columnWidth",
  row: "rowHeight"
};
var ACCESS_LAST_VISITED_KEY_MAP = {
  column: "lastVisitedColumnIndex",
  row: "lastVisitedRowIndex"
};
var getItemFromCache2 = (props, index, gridCache, type) => {
  const [cachedItems, sizer, lastVisited] = [
    gridCache[type],
    props[ACCESS_SIZER_KEY_MAP[type]],
    gridCache[ACCESS_LAST_VISITED_KEY_MAP[type]]
  ];
  if (index > lastVisited) {
    let offset = 0;
    if (lastVisited >= 0) {
      const item = cachedItems[lastVisited];
      offset = item.offset + item.size;
    }
    for (let i = lastVisited + 1; i <= index; i++) {
      const size = sizer(i);
      cachedItems[i] = {
        offset,
        size
      };
      offset += size;
    }
    gridCache[ACCESS_LAST_VISITED_KEY_MAP[type]] = index;
  }
  return cachedItems[index];
};
var bs2 = (props, gridCache, low, high, offset, type) => {
  while (low <= high) {
    const mid = low + floor((high - low) / 2);
    const currentOffset = getItemFromCache2(props, mid, gridCache, type).offset;
    if (currentOffset === offset) {
      return mid;
    } else if (currentOffset < offset) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return max(0, low - 1);
};
var es2 = (props, gridCache, idx, offset, type) => {
  const total2 = type === "column" ? props.totalColumn : props.totalRow;
  let exponent = 1;
  while (idx < total2 && getItemFromCache2(props, idx, gridCache, type).offset < offset) {
    idx += exponent;
    exponent *= 2;
  }
  return bs2(props, gridCache, floor(idx / 2), min(idx, total2 - 1), offset, type);
};
var findItem2 = (props, gridCache, offset, type) => {
  const [cache2, lastVisitedIndex] = [
    gridCache[type],
    gridCache[ACCESS_LAST_VISITED_KEY_MAP[type]]
  ];
  const lastVisitedItemOffset = lastVisitedIndex > 0 ? cache2[lastVisitedIndex].offset : 0;
  if (lastVisitedItemOffset >= offset) {
    return bs2(props, gridCache, 0, lastVisitedIndex, offset, type);
  }
  return es2(props, gridCache, max(0, lastVisitedIndex), offset, type);
};
var getEstimatedTotalHeight = ({ totalRow }, { estimatedRowHeight, lastVisitedRowIndex, row }) => {
  let sizeOfVisitedRows = 0;
  if (lastVisitedRowIndex >= totalRow) {
    lastVisitedRowIndex = totalRow - 1;
  }
  if (lastVisitedRowIndex >= 0) {
    const item = row[lastVisitedRowIndex];
    sizeOfVisitedRows = item.offset + item.size;
  }
  const unvisitedItems = totalRow - lastVisitedRowIndex - 1;
  const sizeOfUnvisitedItems = unvisitedItems * estimatedRowHeight;
  return sizeOfVisitedRows + sizeOfUnvisitedItems;
};
var getEstimatedTotalWidth = ({ totalColumn }, { column, estimatedColumnWidth, lastVisitedColumnIndex }) => {
  let sizeOfVisitedColumns = 0;
  if (lastVisitedColumnIndex > totalColumn) {
    lastVisitedColumnIndex = totalColumn - 1;
  }
  if (lastVisitedColumnIndex >= 0) {
    const item = column[lastVisitedColumnIndex];
    sizeOfVisitedColumns = item.offset + item.size;
  }
  const unvisitedItems = totalColumn - lastVisitedColumnIndex - 1;
  const sizeOfUnvisitedItems = unvisitedItems * estimatedColumnWidth;
  return sizeOfVisitedColumns + sizeOfUnvisitedItems;
};
var ACCESS_ESTIMATED_SIZE_KEY_MAP = {
  column: getEstimatedTotalWidth,
  row: getEstimatedTotalHeight
};
var getOffset = (props, index, alignment, scrollOffset, cache2, type, scrollBarWidth) => {
  const [size, estimatedSizeAssociates] = [
    type === "row" ? props.height : props.width,
    ACCESS_ESTIMATED_SIZE_KEY_MAP[type]
  ];
  const item = getItemFromCache2(props, index, cache2, type);
  const estimatedSize = estimatedSizeAssociates(props, cache2);
  const maxOffset = max(0, min(estimatedSize - size, item.offset));
  const minOffset = max(0, item.offset - size + scrollBarWidth + item.size);
  if (alignment === SMART_ALIGNMENT) {
    if (scrollOffset >= minOffset - size && scrollOffset <= maxOffset + size) {
      alignment = AUTO_ALIGNMENT;
    } else {
      alignment = CENTERED_ALIGNMENT;
    }
  }
  switch (alignment) {
    case START_ALIGNMENT: {
      return maxOffset;
    }
    case END_ALIGNMENT: {
      return minOffset;
    }
    case CENTERED_ALIGNMENT: {
      return Math.round(minOffset + (maxOffset - minOffset) / 2);
    }
    case AUTO_ALIGNMENT:
    default: {
      if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
        return scrollOffset;
      } else if (minOffset > maxOffset) {
        return minOffset;
      } else if (scrollOffset < minOffset) {
        return minOffset;
      } else {
        return maxOffset;
      }
    }
  }
};
var DynamicSizeGrid = createGrid({
  name: "ElDynamicSizeGrid",
  getColumnPosition: (props, idx, cache2) => {
    const item = getItemFromCache2(props, idx, cache2, "column");
    return [item.size, item.offset];
  },
  getRowPosition: (props, idx, cache2) => {
    const item = getItemFromCache2(props, idx, cache2, "row");
    return [item.size, item.offset];
  },
  getColumnOffset: (props, columnIndex, alignment, scrollLeft, cache2, scrollBarWidth) => getOffset(props, columnIndex, alignment, scrollLeft, cache2, "column", scrollBarWidth),
  getRowOffset: (props, rowIndex, alignment, scrollTop, cache2, scrollBarWidth) => getOffset(props, rowIndex, alignment, scrollTop, cache2, "row", scrollBarWidth),
  getColumnStartIndexForOffset: (props, scrollLeft, cache2) => findItem2(props, cache2, scrollLeft, "column"),
  getColumnStopIndexForStartIndex: (props, startIndex, scrollLeft, cache2) => {
    const item = getItemFromCache2(props, startIndex, cache2, "column");
    const maxOffset = scrollLeft + props.width;
    let offset = item.offset + item.size;
    let stopIndex = startIndex;
    while (stopIndex < props.totalColumn - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemFromCache2(props, startIndex, cache2, "column").size;
    }
    return stopIndex;
  },
  getEstimatedTotalHeight,
  getEstimatedTotalWidth,
  getRowStartIndexForOffset: (props, scrollTop, cache2) => findItem2(props, cache2, scrollTop, "row"),
  getRowStopIndexForStartIndex: (props, startIndex, scrollTop, cache2) => {
    const { totalRow, height } = props;
    const item = getItemFromCache2(props, startIndex, cache2, "row");
    const maxOffset = scrollTop + height;
    let offset = item.size + item.offset;
    let stopIndex = startIndex;
    while (stopIndex < totalRow - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemFromCache2(props, stopIndex, cache2, "row").size;
    }
    return stopIndex;
  },
  injectToInstance: (instance, cache2) => {
    const resetAfter = ({ columnIndex, rowIndex }, forceUpdate) => {
      var _a, _b;
      forceUpdate = isUndefined(forceUpdate) ? true : forceUpdate;
      if (isNumber(columnIndex)) {
        cache2.value.lastVisitedColumnIndex = Math.min(cache2.value.lastVisitedColumnIndex, columnIndex - 1);
      }
      if (isNumber(rowIndex)) {
        cache2.value.lastVisitedRowIndex = Math.min(cache2.value.lastVisitedRowIndex, rowIndex - 1);
      }
      (_a = instance.exposed) == null ? void 0 : _a.getItemStyleCache.value(-1, null, null);
      if (forceUpdate)
        (_b = instance.proxy) == null ? void 0 : _b.$forceUpdate();
    };
    const resetAfterColumnIndex = (columnIndex, forceUpdate) => {
      resetAfter({
        columnIndex
      }, forceUpdate);
    };
    const resetAfterRowIndex = (rowIndex, forceUpdate) => {
      resetAfter({
        rowIndex
      }, forceUpdate);
    };
    Object.assign(instance.proxy, {
      resetAfterColumnIndex,
      resetAfterRowIndex,
      resetAfter
    });
  },
  initCache: ({
    estimatedColumnWidth = DEFAULT_DYNAMIC_LIST_ITEM_SIZE,
    estimatedRowHeight = DEFAULT_DYNAMIC_LIST_ITEM_SIZE
  }) => {
    const cache2 = {
      column: {},
      estimatedColumnWidth,
      estimatedRowHeight,
      lastVisitedColumnIndex: -1,
      lastVisitedRowIndex: -1,
      row: {}
    };
    return cache2;
  },
  clearCache: false,
  validateProps: ({ columnWidth, rowHeight }) => {
    if (true) {
      if (!isFunction(columnWidth)) {
        throwError(SCOPE3, `
          "columnWidth" must be passed as function,
            instead ${typeof columnWidth} was given.
        `);
      }
      if (!isFunction(rowHeight)) {
        throwError(SCOPE3, `
          "rowHeight" must be passed as function,
            instead ${typeof rowHeight} was given.
        `);
      }
    }
  }
});
export {
  DynamicSizeGrid,
  DynamicSizeList,
  FixedSizeGrid,
  FixedSizeList,
  virtualizedGridProps,
  virtualizedListProps,
  virtualizedProps,
  virtualizedScrollbarProps
};
//# sourceMappingURL=element-plus_es_components_virtual-list_index__mjs.js.map

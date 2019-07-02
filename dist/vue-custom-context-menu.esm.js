function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

// store bound context menus here in order to be able to close them and detach event listeners later
var BoundContextMenus = new Map();

function bindContextMenu(element, binding, vNode) {
  // any error message should be started with an indication of the v-context-menu directive the error is thrown for
  var ERROR_PREFIX = "[v-context-menu=\"".concat(binding.expression.replace(/\"/, "\'"), "\"]");

  if (binding.value === null) {
    // v-context-menu="null"
    if (vNode.componentInstance && vNode.componentInstance.$options._componentTag === "context-menu-item") {
      // v-context-menu is used on the <context-menu-item> component
      // save the [element: listener, cm] triplet (the listeners are attached at the <context-menu-item> component's level, see its source)
      BoundContextMenus.set(vNode.elm, {
        listener: null,
        cm: null
      }); // tell the item instance that it's a caller-item, but it opens no nested context menus

      vNode.componentInstance.calls = null;
    } else {
      // v-context-menu is used on any other element (either an HTML element or a component)
      // disable the native context menu if the alt key was not holded during the right-click
      var listener = function listener(event) {
        event.stopPropagation();

        if (!event.altKey) {
          event.preventDefault();
        }
      }; // save the [element: listener, cm] triplet and attach the listener


      BoundContextMenus.set(element, {
        listener: listener,
        cm: null
      });
      element.addEventListener("contextmenu", listener);
    } // return the bound context menu (null in this case)


    return null;
  } else if (typeof binding.value === "string") {
    // e.g. v-context-menu="'sample'"
    // find the context menu with the ref="sample"
    var cm = vNode.context.$refs[binding.value];

    if (cm) {
      // something (either an element or a component) is found
      if (!(cm instanceof HTMLElement)) {
        // the context menu is definitely a component
        if (cm.$options._componentTag !== "context-menu") {
          // assume that a wrapper is used if the component is not the <context-menu> one
          // find the actual wrapped context menu by the "wrapped-context-menu" ref
          cm = cm.$refs["wrapped-context-menu"]; // throw if the context menu isn't found in the wrapper, or it's found but it's an HTML element, or it's a component but not the <context-menu> one

          if (!cm || cm instanceof HTMLElement || cm.$options._componentTag !== "context-menu") {
            throw new Error("".concat(ERROR_PREFIX, " | Couldn't find the 'ContextMenu' component with the reference 'wrapped-context-menu' inside the '").concat(binding.value, "' wrapper-component"));
          }
        }
        /*
            Here the variable `cm` definitely points to a context menu instance.
            The problem though is that the v-context-menu directive might be
            used on the <context-menu-item> component which requires some
            different treatment.
        */


        if (vNode.componentInstance && vNode.componentInstance.$options._componentTag === "context-menu-item") {
          // v-context-menu is used on the <context-menu-item> component
          // save the [element: listener, cm] triplet (the listeners are attached at the <context-menu-item> component's level, see its source)
          BoundContextMenus.set(vNode.elm, {
            listener: null,
            cm: cm
          }); // tell the item instance that it's a caller-item and opens the found context menu as a nested one

          vNode.componentInstance.calls = cm;
        } else {
          // v-context-menu is used on any other element (either an HTML element or a component)
          // open the context menu if the alt key was not holded during the right-click
          var _listener = function _listener(event) {
            event.stopPropagation();

            if (!event.altKey) {
              event.preventDefault();
              cm.immediateOpen(event);
            }
          }; // save the [element: listener, cm] triplet and attach the listener


          BoundContextMenus.set(element, {
            listener: _listener,
            cm: cm
          });
          element.addEventListener("contextmenu", _listener);
        } // return the bound context menu


        return cm;
      } else {
        // the context menu is an HTML element rather than a component
        throw new Error("".concat(ERROR_PREFIX, " | The 'v-context-menu' directive must point to either the 'ContextMenu' component or a 'ContextMenu' wrapper-component, but it points to a '").concat(cm.tagName, "' HTML element"));
      }
    } else {
      // neither elements nor components with the ref="sample" are found
      throw new Error("".concat(ERROR_PREFIX, " | Couldn't find a context menu by the reference '").concat(binding.value, "'"));
    }
  } else {
    // e.g. v-context-menu="undefined"
    throw new TypeError("".concat(ERROR_PREFIX, " | The 'v-context-menu' directive only accepts 'null' and 'string' values, but '").concat(_typeof(binding.value), "' is provided"));
  }
}

function unbindContextMenu(element) {
  // find the listener and the context menu for the provided element
  var _BoundContextMenus$ge = BoundContextMenus.get(element),
      listener = _BoundContextMenus$ge.listener,
      cm = _BoundContextMenus$ge.cm; // remove the existing event listener if any (there's none for nested context menus, see above)


  if (listener) element.removeEventListener("contextmenu", listener); // delete the record from the Map in order to prevent potential memory leaks

  BoundContextMenus["delete"](element);
  return cm;
}

var ContextMenuDirective = {
  bind: function bind(element, binding, vNode) {
    bindContextMenu(element, binding, vNode);
  },
  update: function update(element, binding, vNode) {
    // trigger only in cases when the v-context-menu directive's value is changed
    if (binding.oldValue !== binding.value) {
      // unbind the old context menu and bind the new one
      var oldCm = unbindContextMenu(element);
      var newCm = bindContextMenu(element, binding, vNode); // if the old context menu is opened and it's opened for the same target the update hook is triggered for

      if (oldCm && oldCm.show && oldCm.event.target === element) {
        // then close it
        oldCm.immediateClose(); // and open the new one if it's not disabled using the old one's data

        if (newCm) {
          newCm.immediateOpen(oldCm.event, oldCm.caller, oldCm.parent);
        }
      }
    }
  },
  unbind: function unbind(element) {
    var cm = unbindContextMenu(element); // close the unbound context menu if it's not null, it's opened and it's opened for the same target the unbind hook is triggered for

    if (cm && cm.show && cm.event.target === element) {
      cm.immediateClose();
    }
  }
};

//
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  props: {
    isRoot: {
      type: Boolean,
      required: true
    },
    zIndex: {
      type: Number,
      required: true
    },
    penetrable: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    close: function close(event) {
      var _this = this;

      // the next line doesn't allow to close the context menu if the native one was requested
      if (event.which === 3 && event.altKey) return; // if the overlay is penetrable then a new context menu will be opened because the mousedown event triggers first
      // else the overlay won't yet be closed when the contextmenu event takes place hence no other context menus will open

      if (this.penetrable) {
        this.$emit("close");
      } else {
        event.stopPropagation();
        setTimeout(function () {
          _this.$emit("close");
        }, 0);
      }
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      directives: [
        {
          name: "context-menu",
          rawName: "v-context-menu",
          value: null,
          expression: "null"
        }
      ],
      staticClass: "context-menu-overlay",
      class: { root: _vm.isRoot, nested: !_vm.isRoot },
      style: { zIndex: _vm.zIndex },
      on: {
        mousedown: function($event) {
          return _vm.close($event)
        }
      }
    },
    [_vm._t("default")],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-a0a61860_0", { source: "\n.context-menu-overlay[data-v-a0a61860] {\n    position: fixed;\n    top: 0;\n    left: 0;\n    display: block;\n    width: 100%;\n    height: 100%;\n    overflow: hidden;\n}\n.nested[data-v-a0a61860] {\n    pointer-events: none;\n}\n", map: {"version":3,"sources":["/home/matt/projects/vue-custom-context-menu/src/components/ContextMenuOverlay.vue"],"names":[],"mappings":";AAsDA;IACA,eAAA;IACA,MAAA;IACA,OAAA;IACA,cAAA;IACA,WAAA;IACA,YAAA;IACA,gBAAA;AACA;AAEA;IACA,oBAAA;AACA","file":"ContextMenuOverlay.vue","sourcesContent":["<template>\n<div\n    class=\"context-menu-overlay\"\n    :class=\"{ root: isRoot, nested: !isRoot }\"\n    :style=\"{ zIndex }\"\n\n    @mousedown=\"close($event)\"\n    v-context-menu=\"null\"\n>\n    <slot></slot>\n</div>\n</template>\n\n<script>\nexport default {\n    props: {\n        isRoot: {\n            type: Boolean,\n            required: true\n        },\n\n        zIndex: {\n            type: Number,\n            required: true\n        },\n\n        penetrable: {\n            type: Boolean,\n            required: true\n        }\n    },\n\n    methods: {\n        close(event) {\n            // the next line doesn't allow to close the context menu if the native one was requested\n            if (event.which === 3 && event.altKey) return;\n\n            // if the overlay is penetrable then a new context menu will be opened because the mousedown event triggers first\n            // else the overlay won't yet be closed when the contextmenu event takes place hence no other context menus will open\n            if (this.penetrable) {\n                this.$emit(\"close\");\n            } else {\n                event.stopPropagation();\n\n                setTimeout(() => {\n                    this.$emit(\"close\");\n                }, 0);\n            }\n        }\n    }\n}\n</script>\n\n<style scoped>\n.context-menu-overlay {\n    position: fixed;\n    top: 0;\n    left: 0;\n    display: block;\n    width: 100%;\n    height: 100%;\n    overflow: hidden;\n}\n\n.nested {\n    pointer-events: none;\n}\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-a0a61860";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var ContextMenuOverlay = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

//
var script$1 = {
  components: {
    ContextMenuOverlay: ContextMenuOverlay
  },
  props: {
    penetrable: {
      type: Boolean,
      "default": false
    },
    shift: {
      type: String,
      "default": "x",
      validator: function validator(value) {
        return ["fit", "x", "y", "both"].includes(value);
      }
    },
    delay: {
      type: Number,
      "default": 500,
      validator: function validator(value) {
        return value > 0;
      }
    }
  },
  computed: {
    root: {
      // the root context menu instance (the one that is all the nested ones' ancestor)
      cache: false,
      // must be recalculated each time because the same context menu may be opened either as a root or as a nested one
      get: function get() {
        var _this = this;

        return this.isRoot ? this : function () {
          var parent = _this;

          while (parent) {
            var root = parent;
            parent = parent.parent;
          }

          return root;
        }();
      }
    },
    overlayElement: {
      cache: false,
      // no reactive data to rely on -> must be recalculated each time
      get: function get() {
        return this.$refs.overlay.$el;
      }
    },
    wrapperElement: {
      cache: false,
      // no reactive data to rely on -> must be recalculated each time
      get: function get() {
        return this.$refs.wrapper;
      }
    }
  },
  data: function data() {
    return {
      show: false,
      event: undefined,
      // set on open; don't reset because is might be used even after the context menu closed
      caller: undefined,
      // set on open; don't reset; stores the context menu item that opened this (nested) context menu
      isRoot: true,
      // the context menu is root if it's not nested
      zIndex: 100000,
      // incremented on open so nested context menus always spawn above each other
      style: {
        left: 0,
        top: 0,
        height: "auto"
      },
      parent: null,
      // only set for nested context menus
      sub: null,
      // only set for parents; stores the nested context menu instance
      openTimer: null,
      closeTimer: null
    };
  },
  methods: {
    // the logics of context menu opening
    abstractOpen: function abstractOpen(event, caller, parent) {
      // don't open a nested context menu if its parent is closed
      if (parent && !parent.show) return;

      if (!this.show) {
        this.event = event;
        this.caller = caller;

        if (parent) {
          this.parent = parent;
          this.parent.sub = this;
          this.isRoot = false;
          this.zIndex = parent.zIndex + 1;
        }

        this.show = true;
        this.transpose();

        if (this.isRoot) {
          document.documentElement.style.overflow = "hidden";
          document.addEventListener("keydown", this.closeOnEscKey);
        }

        this.openTimer = null;
        this.$emit("opened", this);
      }
    },
    // public; opens the context menu immediately
    immediateOpen: function immediateOpen(event, caller, parent) {
      this.cancelDelayedOpen();
      this.abstractOpen(event, caller, parent);
    },
    // public; opens the context menu after some time (defined by the parent's delay prop); is used exclusively to open nested context menus
    delayedOpen: function delayedOpen(event, caller, parent) {
      var _this2 = this;

      this.cancelDelayedOpen();
      this.openTimer = setTimeout(function () {
        _this2.abstractOpen(event, caller, parent);
      }, parent.delay);
    },
    // public; cancels the request to open the context menu
    cancelDelayedOpen: function cancelDelayedOpen() {
      if (this.openTimer) {
        clearTimeout(this.openTimer);
        this.openTimer = null;
      }
    },
    // the logics of context menu closing
    abstractClose: function abstractClose() {
      if (this.show) {
        if (this.parent) {
          this.parent.sub = null;
        }

        if (this.sub) {
          this.sub.immediateClose();
          this.sub = null;
        }

        if (this.isRoot) {
          document.documentElement.style.overflow = "";
          document.removeEventListener("keydown", this.closeOnEscKey);
        }

        this.show = false;
        this.style.height = "auto";
        this.zIndex = 100000;
        this.closeTimer = null;
        this.$emit("closed", this);
      }
    },
    // public; closes the context menu (and its nested ones) immediately
    immediateClose: function immediateClose() {
      this.cancelDelayedClose();
      this.abstractClose();
    },
    // public; closes the context menu (and its nested ones) after some time (defined by the parent's delay prop); is used exclusively to close nested context menus
    delayedClose: function delayedClose() {
      var _this3 = this;

      this.cancelDelayedClose();
      this.closeTimer = setTimeout(function () {
        _this3.abstractClose();
      }, this.parent.delay);
    },
    // public; cancels the request to close the context menu
    cancelDelayedClose: function cancelDelayedClose() {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer);
        this.closeTimer = null;
      }
    },
    // event listener callback that closes the most nested context menu among all the opened ones
    closeOnEscKey: function closeOnEscKey(event) {
      if (event.keyCode === 27) {
        var nestedMost = this;

        while (nestedMost.sub) {
          nestedMost = nestedMost.sub;
        }

        nestedMost.immediateClose();
      }
    },
    // cancels delayed closing of this context menu and all its parents
    preventCollapsing: function preventCollapsing() {
      var parent = this;

      while (parent) {
        parent.cancelDelayedClose();
        parent = parent.parent;
      }
    },
    // shifts and shrinks (when necessary) the context menu
    transpose: function transpose() {
      var _this4 = this;

      if (this.caller) {
        this.style.left = "".concat(this.caller.getBoundingClientRect().right, "px");
        this.style.top = "".concat(this.caller.getBoundingClientRect().top, "px");
      } else {
        this.style.left = "".concat(this.event.clientX, "px");
        this.style.top = "".concat(this.event.clientY, "px");
      }

      this.style.height = "auto";
      this.$nextTick(function () {
        var viewportWidth = _this4.overlayElement.getBoundingClientRect().width;

        var viewportHeight = _this4.overlayElement.getBoundingClientRect().height;

        var cmWidth = _this4.wrapperElement.getBoundingClientRect().width;

        var cmHeight = _this4.wrapperElement.getBoundingClientRect().height;

        var furthestX = _this4.wrapperElement.getBoundingClientRect().right;

        var furthestY = _this4.wrapperElement.getBoundingClientRect().bottom;

        if (furthestX > viewportWidth) {
          if (_this4.shift === "x" || _this4.shift === "both") {
            if (_this4.caller) {
              _this4.style.left = "".concat(_this4.caller.getBoundingClientRect().left - cmWidth, "px");
            } else {
              _this4.style.left = "".concat(parseFloat(_this4.style.left) - cmWidth, "px");
            }
          } else {
            _this4.style.left = "".concat(viewportWidth - cmWidth, "px");
          }
        }

        if (furthestY > viewportHeight) {
          if (_this4.shift === "y" || _this4.shift === "both") {
            if (_this4.caller) {
              _this4.style.top = "".concat(_this4.caller.getBoundingClientRect().bottom - cmHeight, "px");
            } else {
              _this4.style.top = "".concat(parseFloat(_this4.style.top) - cmHeight, "px");
            }
          } else {
            _this4.style.top = "".concat(viewportHeight - cmHeight, "px");
          }
        }

        if (parseFloat(_this4.style.top) < 0) {
          _this4.style.top = "0px";

          if (cmHeight > viewportHeight) {
            _this4.style.height = "".concat(viewportHeight, "px");
          }
        }
      });
    }
  }
};

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _vm.show
    ? _c(
        "context-menu-overlay",
        {
          ref: "overlay",
          attrs: {
            "is-root": _vm.isRoot,
            "z-index": _vm.zIndex,
            penetrable: _vm.penetrable
          },
          on: { close: _vm.immediateClose }
        },
        [
          _c(
            "div",
            {
              ref: "wrapper",
              staticClass: "context-menu-wrapper",
              class: { root: _vm.isRoot, nested: !_vm.isRoot },
              style: _vm.style,
              on: {
                mouseenter: _vm.preventCollapsing,
                mousedown: function($event) {
                  $event.stopPropagation();
                }
              }
            },
            [_c("div", { staticClass: "context-menu" }, [_vm._t("default")], 2)]
          )
        ]
      )
    : _vm._e()
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-712aa820_0", { source: "\n.context-menu-wrapper[data-v-712aa820] {\n    position: absolute;\n    pointer-events: initial;\n}\n.context-menu[data-v-712aa820] {\n    box-sizing: border-box;\n    height: 100%;\n    overflow: auto;\n}\n", map: {"version":3,"sources":["/home/matt/projects/vue-custom-context-menu/src/components/ContextMenu.vue"],"names":[],"mappings":";AAwSA;IACA,kBAAA;IACA,uBAAA;AACA;AAEA;IACA,sBAAA;IACA,YAAA;IACA,cAAA;AACA","file":"ContextMenu.vue","sourcesContent":["<template>\n<context-menu-overlay\n    v-if=\"show\"\n    ref=\"overlay\"\n\n    :is-root=\"isRoot\"\n    :z-index=\"zIndex\"\n    :penetrable=\"penetrable\"\n\n    @close=\"immediateClose\"\n>\n    <div\n        ref=\"wrapper\"\n        class=\"context-menu-wrapper\"\n        :class=\"{ root: isRoot, nested: !isRoot }\"\n        :style=\"style\"\n\n        @mouseenter=\"preventCollapsing\"\n        @mousedown.stop\n    >\n        <div class=\"context-menu\">\n            <slot></slot>\n        </div>\n    </div>\n</context-menu-overlay>\n</template>\n\n<script>\nimport ContextMenuOverlay from \"./ContextMenuOverlay.vue\";\n\nexport default {\n    components: {\n        ContextMenuOverlay\n    },\n\n    props: {\n        penetrable: {\n            type: Boolean,\n            default: false\n        },\n\n        shift: {\n            type: String,\n            default: \"x\",\n            validator: (value) => [\"fit\", \"x\", \"y\", \"both\"].includes(value)\n        },\n\n        delay: {\n            type: Number,\n            default: 500,\n            validator: (value) => value > 0\n        }\n    },\n\n    computed: {\n        root: { // the root context menu instance (the one that is all the nested ones' ancestor)\n            cache: false, // must be recalculated each time because the same context menu may be opened either as a root or as a nested one\n            get() {\n                return this.isRoot\n                    ? this\n                    : (() => {\n                        let parent = this;\n                        while (parent) {\n                            var root = parent;\n                            parent = parent.parent;\n                        }\n\n                        return root;\n                    })();\n            }\n        },\n\n        overlayElement: {\n            cache: false, // no reactive data to rely on -> must be recalculated each time\n            get() {\n                return this.$refs.overlay.$el;\n            }\n        },\n\n        wrapperElement: {\n            cache: false, // no reactive data to rely on -> must be recalculated each time\n            get() {\n                return this.$refs.wrapper;\n            }\n        }\n    },\n\n    data() {\n        return {\n            show: false,\n\n            event: undefined, // set on open; don't reset because is might be used even after the context menu closed\n            caller: undefined, // set on open; don't reset; stores the context menu item that opened this (nested) context menu\n\n            isRoot: true, // the context menu is root if it's not nested\n            zIndex: 100000, // incremented on open so nested context menus always spawn above each other\n\n            style: {\n                left: 0,\n                top: 0,\n                height: \"auto\"\n            },\n\n            parent: null, // only set for nested context menus\n            sub: null, // only set for parents; stores the nested context menu instance\n\n            openTimer: null,\n            closeTimer: null\n        }\n    },\n\n    methods: {\n        // the logics of context menu opening\n        abstractOpen(event, caller, parent) {\n            // don't open a nested context menu if its parent is closed\n            if (parent && !parent.show) return;\n\n            if (!this.show) {\n                this.event = event;\n                this.caller = caller;\n\n                if (parent) {\n                    this.parent = parent;\n                    this.parent.sub = this;\n\n                    this.isRoot = false;\n                    this.zIndex = parent.zIndex + 1;\n                }\n\n                this.show = true;\n                this.transpose();\n\n                if (this.isRoot) {\n                    document.documentElement.style.overflow = \"hidden\";\n                    document.addEventListener(\"keydown\", this.closeOnEscKey);\n                }\n\n                this.openTimer = null;\n                this.$emit(\"opened\", this);\n            }\n        },\n\n        // public; opens the context menu immediately\n        immediateOpen(event, caller, parent) {\n            this.cancelDelayedOpen();\n            this.abstractOpen(event, caller, parent);\n        },\n\n        // public; opens the context menu after some time (defined by the parent's delay prop); is used exclusively to open nested context menus\n        delayedOpen(event, caller, parent) {\n            this.cancelDelayedOpen();\n\n            this.openTimer = setTimeout(() => {\n                this.abstractOpen(event, caller, parent);\n            }, parent.delay);\n        },\n\n        // public; cancels the request to open the context menu\n        cancelDelayedOpen() {\n            if (this.openTimer) {\n                clearTimeout(this.openTimer);\n                this.openTimer = null;\n            }\n        },\n\n        // the logics of context menu closing\n        abstractClose() {\n            if (this.show) {\n                if (this.parent) {\n                    this.parent.sub = null;\n                }\n\n                if (this.sub) {\n                    this.sub.immediateClose();\n                    this.sub = null;\n                }\n\n                if (this.isRoot) {\n                    document.documentElement.style.overflow = \"\";\n                    document.removeEventListener(\"keydown\", this.closeOnEscKey);\n                }\n\n                this.show = false;\n                this.style.height = \"auto\";\n                this.zIndex = 100000;\n\n                this.closeTimer = null;\n                this.$emit(\"closed\", this);\n            }\n        },\n\n        // public; closes the context menu (and its nested ones) immediately\n        immediateClose() {\n            this.cancelDelayedClose();\n            this.abstractClose();\n        },\n\n        // public; closes the context menu (and its nested ones) after some time (defined by the parent's delay prop); is used exclusively to close nested context menus\n        delayedClose() {\n            this.cancelDelayedClose();\n\n            this.closeTimer = setTimeout(() => {\n                this.abstractClose();\n            }, this.parent.delay);\n        },\n\n        // public; cancels the request to close the context menu\n        cancelDelayedClose() {\n            if (this.closeTimer) {\n                clearTimeout(this.closeTimer);\n                this.closeTimer = null;\n            }\n        },\n\n        // event listener callback that closes the most nested context menu among all the opened ones\n        closeOnEscKey(event) {\n            if (event.keyCode === 27) {\n                let nestedMost = this;\n                while (nestedMost.sub) {\n                    nestedMost = nestedMost.sub;\n                }\n\n                nestedMost.immediateClose();\n            }\n        },\n\n        // cancels delayed closing of this context menu and all its parents\n        preventCollapsing() {\n            let parent = this;\n\n            while (parent) {\n                parent.cancelDelayedClose();\n                parent = parent.parent;\n            }\n        },\n\n        // shifts and shrinks (when necessary) the context menu\n        transpose() {\n            if (this.caller) {\n                this.style.left = `${ this.caller.getBoundingClientRect().right }px`;\n                this.style.top = `${ this.caller.getBoundingClientRect().top }px`;\n            } else {\n                this.style.left = `${ this.event.clientX }px`;\n                this.style.top = `${ this.event.clientY }px`;\n            }\n\n            this.style.height = \"auto\";\n\n            this.$nextTick(() => {\n                let viewportWidth = this.overlayElement.getBoundingClientRect().width;\n                let viewportHeight = this.overlayElement.getBoundingClientRect().height;\n\n                let cmWidth = this.wrapperElement.getBoundingClientRect().width;\n                let cmHeight = this.wrapperElement.getBoundingClientRect().height;\n\n                let furthestX = this.wrapperElement.getBoundingClientRect().right;\n                let furthestY = this.wrapperElement.getBoundingClientRect().bottom;\n\n                if (furthestX > viewportWidth) {\n                    if (this.shift === \"x\" || this.shift === \"both\") {\n                        if (this.caller) {\n                            this.style.left = `${ this.caller.getBoundingClientRect().left - cmWidth }px`;\n                        } else {\n                            this.style.left = `${ parseFloat(this.style.left) - cmWidth }px`;\n                        }\n                    } else {\n                        this.style.left = `${ viewportWidth - cmWidth }px`;\n                    }\n                }\n\n                if (furthestY > viewportHeight) {\n                    if (this.shift === \"y\" || this.shift === \"both\") {\n                        if (this.caller) {\n                            this.style.top = `${ this.caller.getBoundingClientRect().bottom - cmHeight }px`;\n                        } else {\n                            this.style.top = `${ parseFloat(this.style.top) - cmHeight }px`;\n                        }\n                    } else {\n                        this.style.top = `${ viewportHeight - cmHeight }px`;\n                    }\n                }\n\n                if (parseFloat(this.style.top) < 0) {\n                    this.style.top = \"0px\";\n\n                    if (cmHeight > viewportHeight) {\n                        this.style.height = `${ viewportHeight }px`;\n                    }\n                }\n            });\n        }\n    }\n}\n</script>\n\n<style scoped>\n.context-menu-wrapper {\n    position: absolute;\n    pointer-events: initial;\n}\n\n.context-menu {\n    box-sizing: border-box;\n    height: 100%;\n    overflow: auto;\n}\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = "data-v-712aa820";
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var ContextMenuComponent = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    browser,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//
//
//
var script$2 = {
  props: {
    action: {
      type: Function,
      "default": function _default() {}
    },
    disabled: {
      type: Boolean,
      "default": false
    }
  },
  // The following piece of code leads to a bug with positioning of overflowed context menus. TODO reconsider
  // // recalculate context menu's position and height when new items are added
  // created() {
  //     if (this.cm.show) {
  //         this.$nextTick(() => {
  //             this.cm.transpose();
  //         });
  //     }
  // },
  //
  // // recalculate context menu's position and height when existeing items are removed
  // beforeDestroy() {
  //     if (this.cm.show) {
  //         this.$nextTick(() => {
  //             this.cm.transpose();
  //         });
  //     }
  // },
  data: function data() {
    return {
      calls: undefined // is set from the v-context-menu.js; points to the nested context menu this item opens

    };
  },
  computed: {
    cm: function cm() {
      // the context menu instance this item belongs to
      return this.$parent.$parent;
    },
    isCaller: function isCaller() {
      return !!this.calls;
    },
    isDisabled: function isDisabled() {
      return this.calls === null || this.disabled;
    }
  },
  watch: {
    // cancel opening of the nested context menu (or close it if it's already opened) when the item suddenly becomes disabled
    isDisabled: function isDisabled(newValue) {
      var _this = this;

      if (newValue === true && this.isCaller) {
        this.calls.cancelDelayedOpen(); // setTimeout helps to avoid some subtle bugs by allowing other actions to complete first

        setTimeout(function () {
          _this.calls.immediateClose();
        }, 0);
      }
    },
    // when the nested context menu changes and the old one was about to open then cancel its opening
    calls: function calls(newValue, oldValue) {
      if (this.isCaller && oldValue) {
        oldValue.cancelDelayedOpen(); // this.calls.immediateClose(); <- no need in this here because it's handled in the directive's update hook
      }
    }
  },
  methods: {
    itemSelected: function itemSelected(event) {
      // don't do anything for disabled items
      if (this.isDisabled) return; // if the cursor entered a caller item

      if (this.isCaller) {
        // if there's already an opened sub and it's the same that this item calls
        if (this.cm.sub === this.calls) {
          // then cancel its closing
          this.calls.cancelDelayedClose(); // if there's no opened sub or another (not the one this item calls) sub is opened
        } else {
          // if another sub is opened
          if (this.cm.sub) {
            // delay closing of the opened one
            this.cm.sub.delayedClose();
          } // delay opening of the target one


          this.calls.delayedOpen(event, this.$el, this.cm);
        } // if the cursor entered a not-a-caller item

      } else {
        // and if there's an opened sub
        if (this.cm.sub) {
          // then just delay its closing if it hadn't been initiated already
          if (!this.cm.sub.closeTimer) {
            this.cm.sub.delayedClose();
          }
        }
      }
    },
    selectionAborted: function selectionAborted(event) {
      // don't do anything for disabled items
      if (this.isDisabled) return; // only track "mouseleave" for callers

      if (this.isCaller) {
        // cancel delayed opening of the target cm (it has been initiated when the cursor entered this item)
        this.calls.cancelDelayedOpen();
      }
    },
    itemTriggered: function itemTriggered(event) {
      var _this2 = this;

      // don't do anything for disabled items
      if (this.isDisabled) return; // if a caller item is pressed

      if (this.isCaller) {
        // if there's already an opened sub and it's not the same that this item calls (or if there's no opened sub at all)
        if (this.cm.sub !== this.calls) {
          // if there's an opened sub already
          if (this.cm.sub) {
            // then immediately close it
            this.cm.sub.immediateClose();
          } // immediately open the target context menu


          this.calls.immediateOpen(event, this.$el, this.cm);
        } // if a not-a-caller item is pressed

      } else {
        // don't do anything if the native context menu was requested
        if (event.which === 3 && event.altKey) return; // perform the item's action

        this.action(this.cm.event.target, this.cm); // close the root context menu (thus closing all the nested as well) (setTimeout is used so that the contextmenu event is triggered when the context menu isn't closed yet)

        setTimeout(function () {
          _this2.cm.root.immediateClose();
        }, 0);
      }
    }
  }
};

/* script */
const __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "context-menu-item",
      class: { caller: _vm.isCaller, disabled: _vm.isDisabled },
      on: {
        mouseenter: _vm.itemSelected,
        mouseleave: _vm.selectionAborted,
        mousedown: _vm.itemTriggered
      }
    },
    [_vm._t("default")],
    2
  )
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var ContextMenuItemComponent = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

var Plugin = {
  install: function install(Vue) {
    Vue.directive("context-menu", ContextMenuDirective);
    Vue.component("ContextMenu", ContextMenuComponent);
    Vue.component("ContextMenuItem", ContextMenuItemComponent);
  }
}; // auto-install when Vue is found (eg. in a browser via <script> tag)

var GlobalVue;

if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(Plugin);
}

export default Plugin;

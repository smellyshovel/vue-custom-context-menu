(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue')) :
  typeof define === 'function' && define.amd ? define(['vue'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.VCCM = factory(global.vue));
}(this, (function (vue) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

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

  var script$2 = {
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
          close(event) {
              // the next line doesn't allow to close the context menu if the native one was requested
              if (event.which === 3 && event.altKey) return;

              // if the overlay is penetrable then a new context menu will be opened because the mousedown event triggers first
              // else the overlay won't yet be closed when the contextmenu event takes place hence no other context menus will open
              if (this.penetrable) {
                  this.$emit("close");
              } else {
                  event.stopPropagation();

                  setTimeout(() => {
                      this.$emit("close");
                  }, 0);
              }
          }
      }
  };

  const _withId$1 = /*#__PURE__*/vue.withScopeId("data-v-fca6041c");

  const render$2 = /*#__PURE__*/_withId$1((_ctx, _cache, $props, $setup, $data, $options) => {
    const _directive_context_menu = vue.resolveDirective("context-menu");

    return vue.withDirectives((vue.openBlock(), vue.createBlock("div", {
      class: ["context-menu-overlay", { root: $props.isRoot, nested: !$props.isRoot }],
      style: { zIndex: $props.zIndex },
      onMousedown: _cache[1] || (_cache[1] = $event => ($options.close($event)))
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 38 /* CLASS, STYLE, HYDRATE_EVENTS */)), [
      [_directive_context_menu, null]
    ])
  });

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z$1 = "\n.context-menu-overlay[data-v-fca6041c] {\n    position: fixed;\n    top: 0;\n    left: 0;\n    display: block;\n    width: 100%;\n    height: 100%;\n    overflow: hidden;\n}\n.nested[data-v-fca6041c] {\n    pointer-events: none;\n}\n";
  styleInject(css_248z$1);

  script$2.render = render$2;
  script$2.__scopeId = "data-v-fca6041c";
  script$2.__file = "src/components/ContextMenuOverlay.vue";

  var script$1 = {
      components: {
          ContextMenuOverlay: script$2
      },

      props: {
          penetrable: {
              type: Boolean,
              default: false
          },

          shift: {
              type: String,
              default: "x",
              validator: (value) => ["fit", "x", "y", "both"].includes(value)
          },

          delay: {
              type: Number,
              default: 500,
              validator: (value) => value > 0
          }
      },

      computed: {
          root: { // the root context menu instance (the one that is all the nested ones' ancestor)
              cache: false, // must be recalculated each time because the same context menu may be opened either as a root or as a nested one
              get() {
                  return this.isRoot
                      ? this
                      : (() => {
                          let parent = this;
                          while (parent) {
                              var root = parent;
                              parent = parent.parent;
                          }

                          return root;
                      })();
              }
          },

          overlayElement: {
              cache: false, // no reactive data to rely on -> must be recalculated each time
              get() {
                  return this.$refs.overlay.$el;
              }
          },

          wrapperElement: {
              cache: false, // no reactive data to rely on -> must be recalculated each time
              get() {
                  return this.$refs.wrapper;
              }
          }
      },

      data() {
          return {
              show: false,

              event: undefined, // set on open; don't reset because is might be used even after the context menu closed
              caller: undefined, // set on open; don't reset; stores the context menu item that opened this (nested) context menu

              isRoot: true, // the context menu is root if it's not nested
              zIndex: 100000, // incremented on open so nested context menus always spawn above each other

              style: {
                  left: 0,
                  top: 0,
                  height: "auto"
              },

              parent: null, // only set for nested context menus
              sub: null, // only set for parents; stores the nested context menu instance

              openTimer: null,
              closeTimer: null
          }
      },

      methods: {
          // the logics of context menu opening
          abstractOpen(event, caller, parent) {
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
          immediateOpen(event, caller, parent) {
              this.cancelDelayedOpen();
              this.abstractOpen(event, caller, parent);
          },

          // public; opens the context menu after some time (defined by the parent's delay prop); is used exclusively to open nested context menus
          delayedOpen(event, caller, parent) {
              this.cancelDelayedOpen();

              this.openTimer = setTimeout(() => {
                  this.abstractOpen(event, caller, parent);
              }, parent.delay);
          },

          // public; cancels the request to open the context menu
          cancelDelayedOpen() {
              if (this.openTimer) {
                  clearTimeout(this.openTimer);
                  this.openTimer = null;
              }
          },

          // the logics of context menu closing
          abstractClose() {
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
          immediateClose() {
              this.cancelDelayedClose();
              this.abstractClose();
          },

          // public; closes the context menu (and its nested ones) after some time (defined by the parent's delay prop); is used exclusively to close nested context menus
          delayedClose() {
              this.cancelDelayedClose();

              this.closeTimer = setTimeout(() => {
                  this.abstractClose();
              }, this.parent.delay);
          },

          // public; cancels the request to close the context menu
          cancelDelayedClose() {
              if (this.closeTimer) {
                  clearTimeout(this.closeTimer);
                  this.closeTimer = null;
              }
          },

          // event listener callback that closes the most nested context menu among all the opened ones
          closeOnEscKey(event) {
              if (event.keyCode === 27) {
                  let nestedMost = this;
                  while (nestedMost.sub) {
                      nestedMost = nestedMost.sub;
                  }

                  nestedMost.immediateClose();
              }
          },

          // cancels delayed closing of this context menu and all its parents
          preventCollapsing() {
              let parent = this;

              while (parent) {
                  parent.cancelDelayedClose();
                  parent = parent.parent;
              }
          },

          // shifts and shrinks (when necessary) the context menu
          transpose() {
              if (this.caller) {
                  this.style.left = `${ this.caller.getBoundingClientRect().right }px`;
                  this.style.top = `${ this.caller.getBoundingClientRect().top }px`;
              } else {
                  this.style.left = `${ this.event.clientX }px`;
                  this.style.top = `${ this.event.clientY }px`;
              }

              this.style.height = "auto";

              this.$nextTick(() => {
                  let viewportWidth = this.overlayElement.getBoundingClientRect().width;
                  let viewportHeight = this.overlayElement.getBoundingClientRect().height;

                  let cmWidth = this.wrapperElement.getBoundingClientRect().width;
                  let cmHeight = this.wrapperElement.getBoundingClientRect().height;

                  let furthestX = this.wrapperElement.getBoundingClientRect().right;
                  let furthestY = this.wrapperElement.getBoundingClientRect().bottom;

                  if (furthestX > viewportWidth) {
                      if (this.shift === "x" || this.shift === "both") {
                          if (this.caller) {
                              this.style.left = `${ this.caller.getBoundingClientRect().left - cmWidth }px`;
                          } else {
                              this.style.left = `${ parseFloat(this.style.left) - cmWidth }px`;
                          }
                      } else {
                          this.style.left = `${ viewportWidth - cmWidth }px`;
                      }
                  }

                  if (furthestY > viewportHeight) {
                      if (this.shift === "y" || this.shift === "both") {
                          if (this.caller) {
                              this.style.top = `${ this.caller.getBoundingClientRect().bottom - cmHeight }px`;
                          } else {
                              this.style.top = `${ parseFloat(this.style.top) - cmHeight }px`;
                          }
                      } else {
                          this.style.top = `${ viewportHeight - cmHeight }px`;
                      }
                  }

                  if (parseFloat(this.style.top) < 0) {
                      this.style.top = "0px";

                      if (cmHeight > viewportHeight) {
                          this.style.height = `${ viewportHeight }px`;
                      }
                  }
              });
          }
      }
  };

  const _withId = /*#__PURE__*/vue.withScopeId("data-v-2cd1f2a4");

  vue.pushScopeId("data-v-2cd1f2a4");
  const _hoisted_1 = { class: "context-menu" };
  vue.popScopeId();

  const render$1 = /*#__PURE__*/_withId((_ctx, _cache, $props, $setup, $data, $options) => {
    const _component_context_menu_overlay = vue.resolveComponent("context-menu-overlay");

    return ($data.show)
      ? (vue.openBlock(), vue.createBlock(_component_context_menu_overlay, {
          key: 0,
          ref: "overlay",
          "is-root": $data.isRoot,
          "z-index": $data.zIndex,
          penetrable: $props.penetrable,
          onClose: $options.immediateClose
        }, {
          default: _withId(() => [
            vue.createVNode("div", {
              ref: "wrapper",
              class: ["context-menu-wrapper", { root: $data.isRoot, nested: !$data.isRoot }],
              style: $data.style,
              onMouseenter: _cache[1] || (_cache[1] = (...args) => ($options.preventCollapsing && $options.preventCollapsing(...args))),
              onMousedown: _cache[2] || (_cache[2] = vue.withModifiers(() => {}, ["stop"]))
            }, [
              vue.createVNode("div", _hoisted_1, [
                vue.renderSlot(_ctx.$slots, "default")
              ])
            ], 38 /* CLASS, STYLE, HYDRATE_EVENTS */)
          ]),
          _: 3 /* FORWARDED */
        }, 8 /* PROPS */, ["is-root", "z-index", "penetrable", "onClose"]))
      : vue.createCommentVNode("v-if", true)
  });

  var css_248z = "\n.context-menu-wrapper[data-v-2cd1f2a4] {\n    position: absolute;\n    pointer-events: initial;\n}\n.context-menu[data-v-2cd1f2a4] {\n    box-sizing: border-box;\n    height: 100%;\n    overflow: auto;\n}\n";
  styleInject(css_248z);

  script$1.render = render$1;
  script$1.__scopeId = "data-v-2cd1f2a4";
  script$1.__file = "src/components/ContextMenu.vue";

  var script = {
      props: {
          action: {
              type: Function,
              default: function() {}
          },

          disabled: {
              type: Boolean,
              default: false
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

      data() {
          return {
              calls: undefined, // is set from the v-context-menu.js; points to the nested context menu this item opens
          }
      },

      computed: {
          cm() { // the context menu instance this item belongs to
              return this.$parent.$parent;
          },

          isCaller() {
              return !!this.calls;
          },

          isDisabled() {
              return this.calls === null || this.disabled;
          }
      },

      watch: {
          // cancel opening of the nested context menu (or close it if it's already opened) when the item suddenly becomes disabled
          isDisabled(newValue) {
              if (newValue === true && this.isCaller) {
                  this.calls.cancelDelayedOpen();

                  // setTimeout helps to avoid some subtle bugs by allowing other actions to complete first
                  setTimeout(() => {
                      this.calls.immediateClose();
                  }, 0);
              }
          },

          // when the nested context menu changes and the old one was about to open then cancel its opening
          calls(newValue, oldValue) {
              if (this.isCaller && oldValue) {
                  oldValue.cancelDelayedOpen();
                  // this.calls.immediateClose(); <- no need in this here because it's handled in the directive's update hook
              }
          }
      },

      methods: {
          itemSelected(event) {
              // don't do anything for disabled items
              if (this.isDisabled) return;

              // if the cursor entered a caller item
              if (this.isCaller) {
                  // if there's already an opened sub and it's the same that this item calls
                  if (this.cm.sub === this.calls) {
                      // then cancel its closing
                      this.calls.cancelDelayedClose();
                  // if there's no opened sub or another (not the one this item calls) sub is opened
                  } else {
                      // if another sub is opened
                      if (this.cm.sub) {
                          // delay closing of the opened one
                          this.cm.sub.delayedClose();
                      }

                      // delay opening of the target one
                      this.calls.delayedOpen(event, this.$el, this.cm);
                  }
              // if the cursor entered a not-a-caller item
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

          selectionAborted(event) {
              // don't do anything for disabled items
              if (this.isDisabled) return;

              // only track "mouseleave" for callers
              if (this.isCaller) {
                  // cancel delayed opening of the target cm (it has been initiated when the cursor entered this item)
                  this.calls.cancelDelayedOpen();
              }
          },

          itemTriggered(event) {
              // don't do anything for disabled items
              if (this.isDisabled) return;

              // if a caller item is pressed
              if (this.isCaller) {
                  // if there's already an opened sub and it's not the same that this item calls (or if there's no opened sub at all)
                  if (this.cm.sub !== this.calls) {
                      // if there's an opened sub already
                      if (this.cm.sub) {
                          // then immediately close it
                          this.cm.sub.immediateClose();
                      }

                      // immediately open the target context menu
                      this.calls.immediateOpen(event, this.$el, this.cm);
                  }
              // if a not-a-caller item is pressed
              } else {
                  // don't do anything if the native context menu was requested
                  if (event.which === 3 && event.altKey) return;

                  // perform the item's action
                  this.action(this.cm.event.target, this.cm);

                  // close the root context menu (thus closing all the nested as well) (setTimeout is used so that the contextmenu event is triggered when the context menu isn't closed yet)
                  setTimeout(() => {
                      this.cm.root.immediateClose();
                  }, 0);
              }
          }
      }
  };

  function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (vue.openBlock(), vue.createBlock("div", {
      class: ["context-menu-item", { caller: $options.isCaller, disabled: $options.isDisabled }],
      onMouseenter: _cache[1] || (_cache[1] = (...args) => ($options.itemSelected && $options.itemSelected(...args))),
      onMouseleave: _cache[2] || (_cache[2] = (...args) => ($options.selectionAborted && $options.selectionAborted(...args))),
      onMousedown: _cache[3] || (_cache[3] = (...args) => ($options.itemTriggered && $options.itemTriggered(...args)))
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 34 /* CLASS, HYDRATE_EVENTS */))
  }

  script.render = render;
  script.__file = "src/components/ContextMenuItem.vue";

  var Plugin = {
    install: function install(Vue) {
      Vue.directive("context-menu", ContextMenuDirective);
      Vue.component("ContextMenu", script$1);
      Vue.component("ContextMenuItem", script);
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

  return Plugin;

})));

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.VCCM = factory();
}(typeof self !== 'undefined' ? self : this, function () { 'use strict';

    function ContextMenuDirective (options) {
      return {
        bind: function bind(el, binding, vNode) {
          var findOverlayAndCm = function findOverlayAndCm() {
            if (options.ref in vNode.context.$refs) {
              var overlay = vNode.context.$refs[options.ref].$children.find(function (child) {
                return child.$options._componentTag === options.overlay;
              });
            } else {
              var overlay = vNode.context.$children.find(function (child) {
                return child.$options._componentTag === options.overlay;
              });
            }

            var cm = overlay.$children.find(function (child) {
              return child.$el === document.querySelector(binding.value);
            });
            return {
              overlay: overlay,
              cm: cm
            };
          };

          if (vNode.componentInstance && vNode.componentOptions.tag === options.item) {
            vNode.context.$nextTick(function () {
              var _findOverlayAndCm = findOverlayAndCm(),
                  cm = _findOverlayAndCm.cm;

              vNode.componentInstance.calls = cm;
            });
          } else {
            el.addEventListener("contextmenu", function (event) {
              event.stopPropagation();

              if (!binding.modifiers["no-native"] ? event.altKey === false : true) {
                event.preventDefault();

                if (!binding.modifiers["disabled"]) {
                  var _findOverlayAndCm2 = findOverlayAndCm(),
                      overlay = _findOverlayAndCm2.overlay,
                      cm = _findOverlayAndCm2.cm;

                  cm.targetComp = vNode.componentInstance || vNode.elm;
                  overlay.open();
                  cm.immediateOpen(event);
                }
              }
            });
          }
        }
      };
    }

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
    //
    //
    var script = {
      props: {
        transition: String,
        penetrable: Boolean
      },
      mounted: function mounted() {
        var _this = this;

        this.$nextTick(function () {
          if (_this.penetrable) {
            _this.$el.addEventListener("mousedown", function (event) {
              // without this hack "contextmenu" event would trigger on the overlay
              _this.$el.style.display = "none";

              _this.close();
            });
          } else {
            _this.$el.addEventListener("mousedown", function (event) {
              _this.close();
            });
          }
        });
      },
      data: function data() {
        var _this2 = this;

        return {
          show: false,
          listeners: {
            closeOnEscKey: function closeOnEscKey(event) {
              if (event.keyCode === 27) {
                var nestedMost = _this2.$children.find(function (child) {
                  return child.sub === null && child.show;
                });

                var hadParent = nestedMost.parent;
                nestedMost.immediateClose();

                if (!hadParent) {
                  _this2.close(true);
                }
              }
            }
          }
        };
      },
      methods: {
        open: function open() {
          this.show = true;
          document.documentElement.style.overflow = "hidden";
          document.addEventListener("keydown", this.listeners.closeOnEscKey);
        },
        close: function close(skipChildren) {
          this.show = false;

          if (!skipChildren) {
            this.$children.forEach(function (child) {
              child.immediateClose();
            });
          }

          document.documentElement.style.overflow = "";
          document.removeEventListener("keydown", this.listeners.closeOnEscKey);
        }
      }
    };

    /* script */
                const __vue_script__ = script;
                
    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("transition", { attrs: { name: _vm.transition } }, [
        _c(
          "div",
          {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.show,
                expression: "show"
              }
            ],
            attrs: { id: "cm-overlay" },
            on: {
              contextmenu: function($event) {
                $event.preventDefault();
                $event.stopPropagation();
              }
            }
          },
          [_vm._t("default")],
          2
        )
      ])
    };
    var __vue_staticRenderFns__ = [];
    __vue_render__._withStripped = true;

      /* style */
      const __vue_inject_styles__ = function (inject) {
        if (!inject) return
        inject("data-v-6fd5e468_0", { source: "\n#cm-overlay[data-v-6fd5e468] {\n    position: fixed;\n    top: 0;\n    left: 0;\n    display: block;\n    width: 100vw;\n    height: 100vh;\n    overflow: hidden;\n    z-index: 10000;\n}\n", map: {"version":3,"sources":["/home/matt/projects/vue-custom-context-menu/src/components/Overlay.vue"],"names":[],"mappings":";AAsFA;IACA,gBAAA;IACA,OAAA;IACA,QAAA;IACA,eAAA;IACA,aAAA;IACA,cAAA;IACA,iBAAA;IACA,eAAA;CACA","file":"Overlay.vue","sourcesContent":["<template>\n    <transition\n        :name=\"transition\"\n\n        ><div\n            id=\"cm-overlay\"\n            v-show=\"show\"\n\n            @contextmenu.prevent.stop\n\n            ><slot></slot>\n        </div>\n    </transition>\n</template>\n\n<script>\n    export default {\n        props: {\n            transition: String,\n            penetrable: Boolean\n        },\n\n        mounted() {\n            this.$nextTick(() => {\n                if (this.penetrable) {\n                    this.$el.addEventListener(\"mousedown\", (event) => {\n                        // without this hack \"contextmenu\" event would trigger on the overlay\n                        this.$el.style.display = \"none\";\n\n                        this.close();\n                    });\n                } else {\n                    this.$el.addEventListener(\"mousedown\", (event) => {\n                        this.close();\n                    });\n                }\n            });\n        },\n\n        data() {return {\n            show: false,\n\n            listeners: {\n                closeOnEscKey: (event) => {\n                    if (event.keyCode === 27) {\n                        let nestedMost = this.$children.find((child) => {\n                            return child.sub === null && child.show;\n                        });\n\n                        let hadParent = nestedMost.parent;\n\n                        nestedMost.immediateClose();\n\n                        if (!hadParent) {\n                            this.close(true);\n                        }\n                    }\n                }\n            }\n        }},\n\n        methods: {\n            open() {\n                this.show = true;\n\n                document.documentElement.style.overflow = \"hidden\";\n                document.addEventListener(\"keydown\", this.listeners.closeOnEscKey);\n            },\n\n            close(skipChildren) {\n                this.show = false;\n\n                if (!skipChildren) {\n                    this.$children.forEach((child) => {\n                        child.immediateClose();\n                    });\n                }\n\n                document.documentElement.style.overflow = \"\";\n                document.removeEventListener(\"keydown\", this.listeners.closeOnEscKey);\n            }\n        }\n    }\n</script>\n\n<style scoped>\n    #cm-overlay {\n        position: fixed;\n        top: 0;\n        left: 0;\n        display: block;\n        width: 100vw;\n        height: 100vh;\n        overflow: hidden;\n        z-index: 10000;\n    }\n</style>\n"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__ = "data-v-6fd5e468";
      /* module identifier */
      const __vue_module_identifier__ = undefined;
      /* functional template */
      const __vue_is_functional_template__ = false;
      /* component normalizer */
      function __vue_normalize__(
        template, style, script$$1,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        const component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

        // For security concerns, we use only base name in production mode.
        component.__file = "/home/matt/projects/vue-custom-context-menu/src/components/Overlay.vue";

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) component.functional = true;
        }

        component._scopeId = scope;

        {
          let hook;
          if (style) {
            hook = function(context) {
              style.call(this, createInjector(context));
            };
          }

          if (hook !== undefined) {
            if (component.functional) {
              // register for functional component in vue file
              const originalRender = component.render;
              component.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context)
              };
            } else {
              // inject component registration as beforeCreate hook
              const existing = component.beforeCreate;
              component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
          }
        }

        return component
      }
      /* style inject */
      function __vue_create_injector__() {
        const head = document.head || document.getElementsByTagName('head')[0];
        const styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
        const isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return // SSR styles are present.

          const group = isOldIE ? css.media || 'default' : id;
          const style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            let code = css.source;
            let index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              const el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) el.setAttribute('media', css.media);
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              const textNode = document.createTextNode(code);
              const nodes = style.element.childNodes;
              if (nodes[index]) style.element.removeChild(nodes[index]);
              if (nodes.length) style.element.insertBefore(textNode, nodes[index]);
              else style.element.appendChild(textNode);
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var OverlayComponent = __vue_normalize__(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        __vue_create_injector__,
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
    //
    //
    //
    //
    //
    //
    //
    //
    var script$1 = {
      props: {
        transition: String,
        shift: {
          type: [String],
          default: "x",
          validator: function validator(value) {
            return ["fit", "x", "y", "both"].includes(value);
          }
        },
        delay: {
          type: Number,
          default: 250,
          validator: function validator(value) {
            return value > 0;
          }
        }
      },
      data: function data() {
        return {
          show: false,
          style: {
            left: 0,
            top: 0
          },
          height: 0,
          targetComp: null,
          parent: null,
          sub: null,
          openTimer: null,
          closeTimer: null
        };
      },
      watch: {
        height: function height(newValue) {
          this.$set(this.style, "height", newValue);
        }
      },
      computed: {
        overlay: function overlay() {
          return this.$parent;
        },
        target: function target() {
          var parent = this;

          while (parent.parent) {
            parent = parent.parent;
          }

          return parent.targetComp;
        }
      },
      methods: {
        open: function open(event, caller) {
          var _this = this;

          this.show = true;
          this.setPosition(event, caller);
          this.$nextTick(function () {
            _this.transpose(caller);
          });
        },
        abstractOpen: function abstractOpen(event, caller, parent) {
          if (!this.show) {
            if (parent) {
              this.parent = parent;
              this.parent.sub = this;
            }

            this.open(event, caller);
            this.openTimer = null;
            this.$emit("opened", this.target, this);
          }
        },
        immediateOpen: function immediateOpen(event, caller, parent) {
          this.cancelDelayedOpen();
          this.abstractOpen(event, caller, parent);
        },
        delayedOpen: function delayedOpen(event, caller, parent) {
          var _this2 = this;

          this.cancelDelayedOpen();
          this.openTimer = setTimeout(function () {
            _this2.abstractOpen(event, caller, parent);
          }, parent.delay);
        },
        cancelDelayedOpen: function cancelDelayedOpen() {
          if (this.openTimer) {
            clearTimeout(this.openTimer);
            this.openTimer = null;
          }
        },
        close: function close() {
          this.show = false;
          this.height = "auto";
          this.targetComp = null;
        },
        abstractClose: function abstractClose() {
          if (this.show) {
            // this.target relies on this.parent that is gonna be deleted
            // before the @closed is emmited, so we need to save it beforehand
            var target = this.target;

            if (this.parent) {
              this.parent.sub = null;
              this.parent = null;
            }

            if (this.sub) {
              this.sub.immediateClose();
              this.sub = null;
            }

            this.close();
            this.closeTimer = null;
            this.$emit("closed", target, this);
          }
        },
        immediateClose: function immediateClose() {
          this.cancelDelayedClose();
          this.abstractClose();
        },
        delayedClose: function delayedClose() {
          var _this3 = this;

          // in some rare cases this one is crucial
          this.cancelDelayedClose();
          this.closeTimer = setTimeout(function () {
            _this3.abstractClose();
          }, this.parent.delay);
        },
        cancelDelayedClose: function cancelDelayedClose() {
          if (this.closeTimer) {
            clearTimeout(this.closeTimer);
            this.closeTimer = null;
          }
        },
        preventCollapsing: function preventCollapsing() {
          var parent = this;

          while (parent) {
            parent.cancelDelayedClose();
            parent = parent.parent;
          }
        },
        setPosition: function setPosition(event, caller) {
          if (caller) {
            this.style.left = caller.getBoundingClientRect().right;
            this.style.top = caller.getBoundingClientRect().top;
          } else {
            this.style.left = event.clientX;
            this.style.top = event.clientY;
          }

          this.style.left += "px";
          this.style.top += "px";
        },
        transpose: function transpose(caller) {
          var _this4 = this;

          var viewportWidth = this.overlay.$el.getBoundingClientRect().width;
          var viewportHeight = this.overlay.$el.getBoundingClientRect().height;
          var cmWidth = this.$el.getBoundingClientRect().width;
          var cmHeight = this.$el.getBoundingClientRect().height;
          var furthestX = this.$el.getBoundingClientRect().right;
          var furthestY = this.$el.getBoundingClientRect().bottom;

          if (furthestX >= viewportWidth) {
            if (this.shift === "x" || this.shift === "both") {
              if (caller) {
                this.style.left = caller.getBoundingClientRect().left - cmWidth;
              } else {
                this.style.left = parseFloat(this.style.left) - cmWidth;
              }
            } else {
              this.style.left = viewportWidth - cmWidth;
            }
          }

          if (furthestY >= viewportHeight) {
            if (this.shift === "y" || this.shift === "both") {
              if (caller) {
                this.style.top = caller.getBoundingClientRect().bottom - cmHeight;
              } else {
                this.style.top = parseFloat(this.style.top) - cmHeight;
              }
            } else {
              this.style.top = viewportHeight - cmHeight;
            }
          }

          this.style.left += "px";
          this.style.top += "px";
          this.$nextTick(function () {
            if (parseFloat(_this4.style.top) < 0) {
              _this4.style.top = "0px";

              if (cmHeight > viewportHeight) {
                _this4.height = viewportHeight + "px";
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
      return _c("transition", { attrs: { name: _vm.transition } }, [
        _c(
          "div",
          {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.show,
                expression: "show"
              }
            ],
            staticClass: "cm",
            style: _vm.style,
            on: {
              mouseenter: _vm.preventCollapsing,
              mousedown: function($event) {
                $event.stopPropagation();
              }
            }
          },
          [_c("div", [_c("ol", [_vm._t("default")], 2)])]
        )
      ])
    };
    var __vue_staticRenderFns__$1 = [];
    __vue_render__$1._withStripped = true;

      /* style */
      const __vue_inject_styles__$1 = function (inject) {
        if (!inject) return
        inject("data-v-56fb46bf_0", { source: "\n.cm[data-v-56fb46bf] {\n    box-sizing: border-box;\n    position: absolute;\n    display: block;\n    min-width: 200px;\n}\n.cm > div[data-v-56fb46bf] {\n    height: 100%;\n    overflow: auto;\n}\n", map: {"version":3,"sources":["/home/matt/projects/vue-custom-context-menu/src/components/Menu.vue"],"names":[],"mappings":";AA4PA;IACA,uBAAA;IACA,mBAAA;IACA,eAAA;IACA,iBAAA;CACA;AAEA;IACA,aAAA;IACA,eAAA;CACA","file":"Menu.vue","sourcesContent":["<template>\n    <transition\n        :name=\"transition\"\n\n        ><div\n            class=\"cm\"\n            v-show=\"show\"\n            :style=\"style\"\n\n            @mouseenter=\"preventCollapsing\"\n            @mousedown.stop\n\n            ><div>\n                <ol>\n                    <slot></slot>\n                </ol>\n            </div>\n        </div>\n    </transition>\n</template>\n\n<script>\n    export default {\n        props: {\n            transition: String,\n            shift: {\n                type: [String],\n                default: \"x\",\n                validator(value) {\n                    return [\"fit\", \"x\", \"y\", \"both\"].includes(value);\n                }\n            },\n            delay: {\n                type: Number,\n                default: 250,\n                validator(value) {\n                    return value > 0;\n                }\n            }\n        },\n\n        data() {return {\n            show: false,\n\n            style: {\n                left: 0,\n                top: 0\n            },\n\n            height: 0,\n\n            targetComp: null,\n\n            parent: null,\n            sub: null,\n\n            openTimer: null,\n            closeTimer: null\n        }},\n\n        watch: {\n            height(newValue) {\n                this.$set(this.style, \"height\", newValue);\n            }\n        },\n\n        computed: {\n            overlay() {\n                return this.$parent;\n            },\n\n            target() {\n                let parent = this;\n\n                while (parent.parent) {\n                    parent = parent.parent;\n                }\n\n                return parent.targetComp;\n            }\n        },\n\n        methods: {\n            open(event, caller) {\n                this.show = true;\n\n                this.setPosition(event, caller);\n\n                this.$nextTick(() => {\n                    this.transpose(caller);\n                });\n            },\n\n            abstractOpen(event, caller, parent) {\n                if (!this.show) {\n                    if (parent) {\n                        this.parent = parent;\n                        this.parent.sub = this;\n                    }\n\n                    this.open(event, caller);\n                    this.openTimer = null;\n\n                    this.$emit(\"opened\", this.target, this);\n                }\n            },\n\n            immediateOpen(event, caller, parent) {\n                this.cancelDelayedOpen();\n                this.abstractOpen(event, caller, parent);\n            },\n\n            delayedOpen(event, caller, parent) {\n                this.cancelDelayedOpen();\n\n                this.openTimer = setTimeout(() => {\n                    this.abstractOpen(event, caller, parent);\n                }, parent.delay);\n            },\n\n            cancelDelayedOpen() {\n                if (this.openTimer) {\n                    clearTimeout(this.openTimer);\n                    this.openTimer = null;\n                }\n            },\n\n            close() {\n                this.show = false;\n\n                this.height = \"auto\";\n                this.targetComp = null;\n            },\n\n            abstractClose() {\n                if (this.show) {\n                    // this.target relies on this.parent that is gonna be deleted\n                    // before the @closed is emmited, so we need to save it beforehand\n                    var target = this.target;\n\n                    if (this.parent) {\n                        this.parent.sub = null;\n                        this.parent = null;\n                    }\n\n                    if (this.sub) {\n                        this.sub.immediateClose();\n                        this.sub = null;\n                    }\n\n                    this.close();\n                    this.closeTimer = null;\n\n                    this.$emit(\"closed\", target, this);\n                }\n            },\n\n            immediateClose() {\n                this.cancelDelayedClose();\n                this.abstractClose();\n            },\n\n            delayedClose() {\n                // in some rare cases this one is crucial\n                this.cancelDelayedClose();\n\n                this.closeTimer = setTimeout(() => {\n                    this.abstractClose();\n                }, this.parent.delay);\n            },\n\n            cancelDelayedClose() {\n                if (this.closeTimer) {\n                    clearTimeout(this.closeTimer);\n                    this.closeTimer = null;\n                }\n            },\n\n            preventCollapsing() {\n                let parent = this;\n\n                while (parent) {\n                    parent.cancelDelayedClose();\n                    parent = parent.parent;\n                }\n            },\n\n            setPosition(event, caller) {\n                if (caller) {\n                    this.style.left = caller.getBoundingClientRect().right;\n                    this.style.top = caller.getBoundingClientRect().top;\n                } else {\n                    this.style.left = event.clientX;\n                    this.style.top = event.clientY;\n                }\n\n                this.style.left += \"px\";\n                this.style.top += \"px\";\n            },\n\n            transpose(caller) {\n                let viewportWidth = this.overlay.$el.getBoundingClientRect().width;\n                let viewportHeight = this.overlay.$el.getBoundingClientRect().height;\n\n                let cmWidth = this.$el.getBoundingClientRect().width;\n                let cmHeight = this.$el.getBoundingClientRect().height;\n\n                let furthestX = this.$el.getBoundingClientRect().right;\n                let furthestY = this.$el.getBoundingClientRect().bottom;\n\n                if (furthestX >= viewportWidth) {\n                    if (this.shift === \"x\" || this.shift === \"both\") {\n                        if (caller) {\n                            this.style.left = caller.getBoundingClientRect().left - cmWidth;\n                        } else {\n                            this.style.left = parseFloat(this.style.left) - cmWidth;\n                        }\n                    } else {\n                        this.style.left = viewportWidth - cmWidth;\n                    }\n                }\n\n                if (furthestY >= viewportHeight) {\n                    if (this.shift === \"y\" || this.shift === \"both\") {\n                        if (caller) {\n                            this.style.top = caller.getBoundingClientRect().bottom - cmHeight;\n                        } else {\n                            this.style.top = parseFloat(this.style.top) - cmHeight;\n                        }\n                    } else {\n                        this.style.top = viewportHeight - cmHeight;\n                    }\n                }\n\n                this.style.left += \"px\";\n                this.style.top += \"px\";\n\n                this.$nextTick(() => {\n                    if (parseFloat(this.style.top) < 0) {\n                        this.style.top = \"0px\";\n\n                        if (cmHeight > viewportHeight) {\n                            this.height = viewportHeight + \"px\";\n                        }\n                    }\n                });\n            }\n        }\n    }\n</script>\n\n<style scoped>\n    .cm {\n        box-sizing: border-box;\n        position: absolute;\n        display: block;\n        min-width: 200px;\n    }\n\n    .cm > div {\n        height: 100%;\n        overflow: auto;\n    }\n</style>\n"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__$1 = "data-v-56fb46bf";
      /* module identifier */
      const __vue_module_identifier__$1 = undefined;
      /* functional template */
      const __vue_is_functional_template__$1 = false;
      /* component normalizer */
      function __vue_normalize__$1(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        const component = (typeof script === 'function' ? script.options : script) || {};

        // For security concerns, we use only base name in production mode.
        component.__file = "/home/matt/projects/vue-custom-context-menu/src/components/Menu.vue";

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) component.functional = true;
        }

        component._scopeId = scope;

        {
          let hook;
          if (style) {
            hook = function(context) {
              style.call(this, createInjector(context));
            };
          }

          if (hook !== undefined) {
            if (component.functional) {
              // register for functional component in vue file
              const originalRender = component.render;
              component.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context)
              };
            } else {
              // inject component registration as beforeCreate hook
              const existing = component.beforeCreate;
              component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
          }
        }

        return component
      }
      /* style inject */
      function __vue_create_injector__$1() {
        const head = document.head || document.getElementsByTagName('head')[0];
        const styles = __vue_create_injector__$1.styles || (__vue_create_injector__$1.styles = {});
        const isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return // SSR styles are present.

          const group = isOldIE ? css.media || 'default' : id;
          const style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            let code = css.source;
            let index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              const el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) el.setAttribute('media', css.media);
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              const textNode = document.createTextNode(code);
              const nodes = style.element.childNodes;
              if (nodes[index]) style.element.removeChild(nodes[index]);
              if (nodes.length) style.element.insertBefore(textNode, nodes[index]);
              else style.element.appendChild(textNode);
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var MenuComponent = __vue_normalize__$1(
        { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
        __vue_inject_styles__$1,
        __vue_script__$1,
        __vue_scope_id__$1,
        __vue_is_functional_template__$1,
        __vue_module_identifier__$1,
        __vue_create_injector__$1,
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
        action: Function
      },
      data: function data() {
        return {
          calls: null
        };
      },
      computed: {
        cm: function cm() {
          return this.$parent;
        },
        isCaller: function isCaller() {
          return !!this.calls;
        }
      },
      methods: {
        itemSelected: function itemSelected(event) {
          // if the cursor enters a caller item
          if (this.isCaller) {
            // if the target sub is already opened
            if (this.cm.sub === this.calls) {
              // cancel its closing
              this.calls.cancelDelayedClose(); // if there's no opened sub or another (not target) sub is opened
            } else {
              // if another sub is opened
              if (this.cm.sub) {
                // delay closing of the opened one
                this.cm.sub.delayedClose();
              } // delay opening of the target one


              this.calls.delayedOpen(event, this.$el, this.cm);
            } // if the cursor enters a not-a-caller item

          } else {
            // and if there's an opened sub
            if (this.cm.sub) {
              // then just delay its closing if it hadn't been initiated previously already
              if (!this.cm.sub.closeTimer) {
                this.cm.sub.delayedClose();
              }
            }
          }
        },
        selectionAborted: function selectionAborted(event) {
          // only track "mouseleave" for callers
          if (this.isCaller) {
            // cancel target's delayed opening
            this.calls.cancelDelayedOpen();
          }
        },
        itemTriggered: function itemTriggered(event) {
          // if a caller item is pressed
          if (this.isCaller) {
            // if there's an already opened sub (or no such at all)
            if (this.cm.sub !== this.calls) {
              // if there's an opened sub already
              if (this.cm.sub) {
                // then immediately close it
                this.cm.sub.immediateClose();
              } // immediately open the target one


              this.calls.immediateOpen(event, this.$el, this.cm);
            } // if a not-a-caller item is pressed

          } else {
            // perform the item's action (if any)
            if (this.action) {
              this.action(this.cm.target, this.cm);
            } // and close everything


            this.cm.overlay.close();
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
        "li",
        {
          staticClass: "cm-item",
          class: { "cm-item-caller": _vm.isCaller },
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
      /* component normalizer */
      function __vue_normalize__$2(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        const component = (typeof script === 'function' ? script.options : script) || {};

        // For security concerns, we use only base name in production mode.
        component.__file = "/home/matt/projects/vue-custom-context-menu/src/components/Item.vue";

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) component.functional = true;
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      
      /* style inject SSR */
      

      
      var ItemComponent = __vue_normalize__$2(
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
      install: function install(Vue, options) {
        options = Object.assign({
          ref: "vccm-context-menus",
          directive: "context-menu",
          overlay: "vccm-overlay",
          menu: "context-menu",
          item: "cm-item"
        }, options); // allow adding `v-context-menu="'#cm-ID'"` to any element

        Vue.directive(options.directive, ContextMenuDirective(options)); // declare globally available components

        Vue.component(options.overlay, OverlayComponent); // <cm-overlay>

        Vue.component(options.menu, MenuComponent); // <context-menu>

        Vue.component(options.item, ItemComponent); // <cm-item>
      }
    }; // Auto-install when Vue is found (eg. in browser via <script> tag)

    if (typeof window !== 'undefined') {
      var GlobalVue = window.Vue;
    } else if (typeof global !== 'undefined') {
      var GlobalVue = global.Vue;
    }

    if (GlobalVue) {
      GlobalVue.use(Plugin);
    }

    return Plugin;

}));

// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"8sUSo":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "00b47e26c0d93bfa";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && ![
        "localhost",
        "127.0.0.1",
        "0.0.0.0"
    ].includes(hostname) ? "wss" : "ws";
    var ws;
    try {
        ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === "undefined" ? typeof chrome === "undefined" ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                }
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        if (e.message) console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", // $FlowFixMe
    href.split("?")[0] + "?" + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            });
            // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"7Ep4J":[function(require,module,exports) {
/**
 * Improved controls over the standard THREE.OrbitControls.
 * Adds listeners to show debug info on keypress.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Controls", ()=>Controls);
parcelHelpers.export(exports, "ObjectPicker", ()=>ObjectPicker);
var _orbitControlsJs = require("../../../modules/three.js/examples/jsm/controls/OrbitControls.js");
var _portalMeshJs = require("../../../src/PortalMesh.js");
class Controls {
    constructor(camera, renderer){
        this.orbit_controls = new (0, _orbitControlsJs.OrbitControls)(camera, renderer.domElement);
        this.orbit_controls.enableDamping = true;
        this.renderer = renderer;
        this.camera = camera;
        this.show_debug_uvs = false;
    }
    update() {
        this.orbit_controls.update();
    }
    addListeners() {
        function onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener("resize", onWindowResize.bind(this), false);
        window._FREEZE_ALL_PORTALS = false;
        $(document).keydown((function(event) {
            if (event.which == 32) {
                // space bar: Show debug pane.
                $("#debug_uvs").show();
                this.show_debug_uvs = true;
            } else if (event.which == 70) // F: freeze textures.
            window._FREEZE_ALL_PORTALS = !window._FREEZE_ALL_PORTALS;
        }).bind(this));
        $(document).keyup((function(event) {
            if (event.which == 32) {
                $("#debug_uvs").hide();
                this.show_debug_uvs = false;
            }
        }).bind(this));
    }
}
class ObjectPicker {
    constructor(domElement){
        this.domElement = domElement;
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
        this.pickedObjectSavedColor = 0;
        this.mousedownPosition = {
            x: -1,
            y: -1
        };
        this.mousedown = false;
        this.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (this.mobile) {
            // Mobile.
            domElement.addEventListener("touchstart", this.pointerDown.bind(this));
            domElement.addEventListener("touchstart", this.setPickPosition.bind(this));
            domElement.addEventListener("touchend", this.clickHandler.bind(this));
            domElement.addEventListener("touchmove", this.touchMove.bind(this));
        } else {
            // Desktop.
            domElement.addEventListener("pointerdown", this.pointerDown.bind(this));
            domElement.addEventListener("pointerdown", this.pointerDown.bind(this));
            domElement.addEventListener("pointerup", this.clickHandler.bind(this));
            domElement.addEventListener("mousemove", this.setPickPosition.bind(this));
            domElement.addEventListener("mouseout", this.clearPickPosition.bind(this));
            domElement.addEventListener("mouseleave", this.clearPickPosition.bind(this));
        }
        this.pickPosition = {
            x: 0,
            y: 0
        };
        this.clearPickPosition();
    }
    pointerDown(event) {
        this.clicked = true;
        this.mousedown = true;
        this.mousedownPosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
    getCanvasRelativePosition(event) {
        const rect = this.domElement.getBoundingClientRect();
        // Mobile handling.
        if (event.touches) event = event.touches[0];
        return {
            x: (event.clientX - rect.left) * this.domElement.width / rect.width,
            y: (event.clientY - rect.top) * this.domElement.height / rect.height
        };
    }
    /**
     * Unused. TODO: fix this.
     * @param {*} event
     */ onDrag(event) {
        console.log("mouse drag");
        const pos = this.getCanvasRelativePosition(event);
        const del_x = pos.x - this.mousedownPosition.x;
        const del_y = pos.y - this.mousedownPosition.y;
        if (del_x * del_x + del_y * del_y > 10) {
            console.log("dragged!");
            this.dragged = true;
        }
    }
    touchMove(event) {}
    /**
     * Set picked object, mark mouse moved.
     * @param {Event} event
     */ setPickPosition(event) {
        const pos = this.getCanvasRelativePosition(event);
        this.pickPosition.x = pos.x / this.domElement.width * 2 - 1;
        this.pickPosition.y = pos.y / this.domElement.height * -2 + 1; // note we flip Y
    }
    clearPickPosition() {
        // unlike the mouse which always has a position
        // if the user stops touching the screen we want
        // to stop picking. For now we just pick a value
        // unlikely to pick something
        this.pickPosition.x = -100000;
        this.pickPosition.y = -100000;
    //console.log(this.pickPosition);
    }
    getEmissive(obj) {
        if (!(obj.material instanceof THREE.MeshPhongMaterial)) return;
        obj.material.emissive.getHex();
    }
    setEmissive(obj, color) {
        if (!(obj.material instanceof THREE.MeshPhongMaterial)) return;
        obj.material.emissive.setHex(color);
    }
    pick(scene, camera, time) {
        // Store previous data for restoring color.
        this.prevPicked = this.pickedObject;
        this.prevColor = this.pickedObjectSavedColor;
        var normalizedPosition = this.pickPosition;
        this.raycaster.setFromCamera(normalizedPosition, camera);
        var intersectedObjects = this.raycaster.intersectObjects(scene.children);
        var max_jumps = -1;
        while(intersectedObjects.length && max_jumps !== 0){
            // pick the first object. It's the closest one
            var pickedObject = intersectedObjects[0].object;
            if (pickedObject instanceof (0, _portalMeshJs.PortalMesh)) {
                //this.raycaster.setFromCamera(normalizedPosition, camera);
                //this.raycaster.setFromCamera(intersectedObjects[0].uv, pickedObject.material.camera);
                intersectedObjects = this.raycaster.intersectObjects(pickedObject.material.scene.children);
                max_jumps--;
            } else break;
        }
        // New valid picked object.
        this.pickedObject = pickedObject;
        if (pickedObject && !pickedObject.clicked) {
            if (pickedObject !== this.prevPicked) this.pickedObjectSavedColor = this.getEmissive(pickedObject);
            // Set its emissive color to flashing red/yellow:
            // Blink.
            //pickedObject.material.emissive.setHex((time * 1000) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
            // Highlight on hover only.
            if (!this.mousedown && !this.mobile) // Smooth transition between red and orange.
            this.setEmissive(pickedObject, 0xFF0000 + ((Math.cos(time * 2000) + 1) / 2 * 0xFF << 8));
        }
        // Handle click events.
        // We put this here to handle the case the click comes in the middle of executing this fn.
        // If there's a click, set to white no matter what.
        if (this.clicked && this.pickedObject) {
            this.setEmissive(this.pickedObject, 0xFFFFFF);
            this.pickedObject.clicked = true;
            this.pickedObjectSavedColor = 0xFFFFFF;
        }
        this.clicked = false;
        // No picked object, reset the color of the last touched item.
        if (this.prevPicked && this.prevPicked != pickedObject && !this.prevPicked.clicked) this.setEmissive(this.prevPicked, this.prevColor);
    }
    clickHandler(e) {
        this.mousedown = false;
        //mouse is up, reset down position
        this.mousedownPosition = {
            x: -1,
            y: -1
        };
    }
}

},{"../../../modules/three.js/examples/jsm/controls/OrbitControls.js":"f5yqU","../../../src/PortalMesh.js":"fS0SB","@parcel/transformer-js/src/esmodule-helpers.js":"b9DC4"}],"fS0SB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PortalMesh", ()=>PortalMesh);
var _three = require("three");
var _portalMaterialJs = require("./PortalMaterial.js");
class PortalMesh extends _three.Mesh {
    constructor(geometry, portal_material, options = {}){
        /** Renders as the scene associated with input portal_material.
         * Gives the appearance of the mesh acting as a portal.
         *
         * Params:
         * ----------
         * geometry: THREE.Geometry
         *      Geometry that scene render gets projected to
         * portal_material: PortalMaterial
         *      Portal material to be rendered to this Mesh.
         *
         * Options:
         * -----------
         * show_wire_geometry: boolean (default=false)
         *      Shows a wireframe alongside the mesh to show the geometry of the portal area.
         * debug_width: int
         * debug_height: int
         *      Height and width of debug info to be rendered to.
         */ console.assert(geometry instanceof _three.BufferGeometry, "geometry is not an instance of THREE.Geometry");
        console.assert(portal_material instanceof (0, _portalMaterialJs.PortalMaterial), "portal_material is not an instance of PortalMaterial");
        super(geometry, portal_material);
        // call showDebugUVs() to enable.
        this.show_debug_uvs = false;
        // TODO: Allow debug rendering to be configurable.
        this.debug_width = options.debug_width || this.resolution_width / 4;
        this.debug_height = options.debug_height || this.resolution_height / 4;
        this.debug_renderer = new _three.WebGLRenderer({
            antialias: true
        });
        this.debug_renderer.setSize(this.debug_width, this.debug_height);
        this.camera = this.material.camera;
        // A wireframe showing the geometry.
        this.wire = null;
        // TODO: compute this properly.
        this.is_planar = false;
    }
    wireGeometry() {
        const wireframe = new _three.WireframeGeometry(this.geometry);
        const line = new _three.LineSegments(wireframe);
        line.material.depthTest = true;
        // line.material.opacity = 0.5;
        line.material.color = new _three.Color(0x0088ff);
        // line.material.transparent = true;
        return line;
    }
    update() {
        this.material.update();
    }
    isPortal() {
        return true;
    }
    getScene() {
        return this.portal_material.getScene();
    }
    getScreenGeometry() {
        return this.screen_geometry;
    }
    getBufferImage() {
        return this.portal_material.getBufferImage();
    }
    linkTwin(twin_p_mesh) {
        this.twin = twin_p_mesh;
    }
    /**
     * Returns true if any face is visible. Used for optimization.
     */ isVisible(camera) {
        let cam_vec = new _three.Vector3();
        camera.getWorldDirection(cam_vec);
        // assume true: if (this.isPlanar()) {
        let geo_vec = this.geometry.faces[0].normal;
        return cam_vec.dot(geo_vec) < 0;
    }
    /**
     * True if the geometry is coplanar.
     * This technically only checks the normals so translations of the same plane are valid.
     * Allows for optimizations in rendering.
     */ isPlanar() {
        // TODO: Allow this to be computed instead of manually set.
        return this.is_planar;
    }
    getClippingPlane() {
        if (!this.isPlanar) console.warn("Generating single clipping plane for non-planar geometry.");
        const tri = this.geometry.faces[0];
        const verts = this.geometry.vertices;
        const pts = [
            verts[tri.a],
            verts[tri.b],
            verts[tri.c]
        ];
        const a = new _three.Vector3(pts[0].x, pts[0].y, pts[0].z);
        const b = new _three.Vector3(pts[1].x, pts[1].y, pts[1].z);
        const c = new _three.Vector3(pts[2].x, pts[2].y, pts[2].z);
        const ab = b.sub(a);
        const ac = c.sub(a);
        const cross = ab.cross(ac).normalize();
        return new _three.Plane(cross, -(a.x * cross.x + a.y * cross.y + a.z * cross.z));
    }
    /**
     * Render the internal portal scene to this Mesh.
     * This function is called implicitly by THREE.js.
     * Input args are for the full scene,
     *  **not** the args to the portal scene we are renderering.
     *
     * @param {THREE.WebGLRenderer} renderer
     *    The renderer of the full scene (not the internal portal scene).
     * @param {THREE.Scene} scene
     *    The full scene being rendered that this is part of.
     * @param {THREE.Camera} camera
     *    Main camera of the scene.
     * @param {THREE.Geometry} geometry
     *    The geometry of the portal mesh.
     * @param {THREE.Material} material
     *    The material of the rendered object (this).
     * @param {THREE.Group} group
     *    The group this portal belongs to (if any).
     */ onBeforeRender(renderer, scene, camera, geometry, material, group) {
        // TODO: disabled temporarily.
        // if (window._FREEZE_ALL_PORTALS) {
        //   if (this.material instanceof PortalMaterial) {
        //     this.material.uniforms["frozen"].value = true;
        //   }
        //   return;
        // }
        // if (this.material instanceof PortalMaterial) {
        //   this.material.uniforms["frozen"].value = false;
        // }
        this.update();
        // Render the internal scene of the portal to this mesh's texture.
        this.material.onBeforeRender(renderer, scene, camera, geometry, material, group);
        // XXX FIXME This is broken. Causing infinite recursion.
        // if (this.show_debug_uvs) {
        //   const ctx = this.debug_canvas2d.getContext('2d');
        //   ctx.clearRect(0, 0, this.debug_canvas2d.width, this.debug_canvas2d.height);
        //   this.debug_renderer.render(this.material.scene, this.camera);
        // }
        // Compute UVs for where the mesh is on the screen.
        const face_uvs = this.geometry.getAttribute("uv").array;
        const face_idx = this.geometry.index.array;
        const vertices = this.geometry.getAttribute("position").array;
        // Process each tri:
        for(let i = 0; i < vertices.length / 3; i++){
            const tri_vertices = face_idx.slice(i * 2, (i + 1) * 3);
            const tri_geometry = [
                vertices[tri_vertices[0]],
                vertices[tri_vertices[1]],
                vertices[tri_vertices[2]]
            ];
            const uvs = [];
            // Process each vertex:
            for(let j = 0; j < 3; j++){
                // Project to camera.
                const vertex = new _three.Vector3().fromArray(tri_geometry.slice(j * 3, (j + 1) * 3));
                const projected = vertex.project(this.camera);
                projected.x = (projected.x + 1) / 2;
                projected.y = -(projected.y - 1) / 2;
                // Push point to debug viz.
                if (this.show_debug_uvs) uvs.push({
                    x: projected.x * this.debug_width,
                    y: projected.y * this.debug_height
                });
                // Set the UVs.
                face_uvs[2 * j] = projected.x;
                face_uvs[2] = projected.y;
            }
            // Draw debug viz.
            if (this.show_debug_uvs) this._drawTriangle(this.debug_canvas2d, uvs[0], uvs[1], uvs[2]);
        }
        this.geometry.uvsNeedUpdate = true;
    }
    /**
     * Draws a 2D triangle on a canvas.
     * Used in debugging portal UVs.
     */ _drawTriangle(canvas, a, b, c) {
        if (!canvas.getContext) {
            console.error("cannot get context for ", canvas);
            return;
        }
        const ctx = canvas.getContext("2d");
        ctx.strokeStyle = "#FF0000";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(a.x, a.y);
        ctx.stroke();
    }
    renderDebugUVs(show = true, container) {
        console.assert(show !== undefined && typeof show == "boolean", "showDebugUVs takes boolean input.");
        if (container === undefined) {
            console.warn("No container provided for renderDebugUVs. Appending to default 'debug_container'");
            container = document.body;
        }
        this.show_debug_uvs = show;
        if (!this.debug_dom_el) {
            if (!this.debug_height || !this.debug_width) console.error("Debugging window dimensions not set. Include debug_{height, width} in constructor options.");
            // Create container.
            const div = document.createElement("div");
            div.classList.add("debug_container");
            div.appendChild(this.debug_renderer.domElement);
            // Create a canvas element with the specified height and width.
            const canvas = document.createElement("canvas");
            canvas.setAttribute("height", this.debug_height);
            canvas.setAttribute("width", this.debug_width);
            canvas.classList.add("overlay", "debug-portal-window");
            this.debug_canvas2d = canvas;
            div.appendChild(canvas);
            container.appendChild(div);
        }
    }
}

},{"three":"ktPTu","./PortalMaterial.js":"1Rovs","@parcel/transformer-js/src/esmodule-helpers.js":"b9DC4"}],"1Rovs":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PortalMaterial", ()=>PortalMaterial);
var _three = require("three");
/** Represents an animated material derived from rendering an offscreen scene.
 *
 * Params:
 *
 * scene: THREE.Scene
 *      Scene to render inside the window.
 * renderer: THREE.Renderer
 *      Renderer to use for rendering the scene.
 *
 * Options:
 *
 * transform: THREE.Euler
 *      Rotation of the scene so it appears in the correct orientation for target portal geometry
 *
 * antialias: boolean (default=true)
 *      Renders with anti-aliasing if true
 *
 * resolution_width: int
 * resolution_height: int
 *      Height and width resolution of the render. Should usually be the same as the main window.
 */ class PortalMaterial extends _three.MeshBasicMaterial {
    constructor(scene, camera, renderer, options = {}){
        console.assert(scene instanceof _three.Scene, "scene is not instance of THREE.Scene.");
        console.assert(camera instanceof _three.Camera, "camera is not instance of THREE.Camera");
        console.assert(renderer instanceof _three.WebGLRenderer, "renderer is not an instance of THREE.WebGLRenderer");
        const name = options.name || "";
        super();
        // TODO: load shaders from file.
        // var loader = new THREE.FileLoader();
        // loader.load('shaders/portal.frag',function ( data ) {fShader =  data;},);
        // loader.load('shaders/portal.vertex',function ( data ) {vShader =  data;},);
        const clock = new _three.Clock();
        const antialias = options.antialias || false;
        const resolution_width = options.resolution_width || 1024;
        const resolution_height = options.resolution_height || 1024;
        const buffer_texture = new _three.WebGLRenderTarget(resolution_width, resolution_height, {
            minFilter: _three.LinearFilter,
            magFilter: _three.NearestFilter
        });
        buffer_texture.name = name;
        buffer_texture.texture.image.name = name;
        const alpha_buffer_texture = new _three.WebGLRenderTarget(resolution_width, resolution_height, {
            minFilter: _three.LinearFilter,
            magFilter: _three.NearestFilter
        });
        alpha_buffer_texture.name = name;
        alpha_buffer_texture.texture.image.name = name;
        const dims = new _three.Vector2();
        renderer.getDrawingBufferSize(dims);
        renderer.setPixelRatio(window.devicePixelRatio);
        // renderer.alpha = true;
        this.name = name;
        this.clock = clock;
        this.max_depth = 1;
        this.depth_remaining = this.max_depth;
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        // XXX TODO.
        this.transform = this.transform;
        this.antialias = antialias;
        this.resolution_width = resolution_width;
        this.resolution_height = resolution_height;
        this.buffer_texture = buffer_texture;
        // @super member variables
        this.map = this.buffer_texture.texture;
        // this.alphaMap = alpha_buffer_texture.texture
        this.clippingPlanes = options.clipping_plane ? [
            options.clipping_plane
        ] : [];
        this.clipShadows = options.clip_shadows | false;
        window.addEventListener("resize", this.onWindowResize.bind(this), false);
    }
    onWindowResize() {
        const dims = new _three.Vector2();
        this.renderer.getDrawingBufferSize(dims);
    }
    getScene() {
        return this.scene;
    }
    getBufferImage() {
        return this.buffer_image;
    }
    setCamera(cam) {
        this.camera = cam;
    }
    update() {}
    /**
   * @override
   * Removes affine correction (already applied when rendering internal portal scene).
   */ onBeforeCompile(shader, renderer) {
        const dims = new _three.Vector2();
        renderer.getDrawingBufferSize(dims);
        renderer.setPixelRatio(window.devicePixelRatio);
        // TODO: Input dimensions as uniforms for screen resizing.
        shader.fragmentShader = shader.fragmentShader.replace("#include <map_fragment>", `vec4 texelColor = texture2D( map, gl_FragCoord.xy / vec2(${dims.x}, ${dims.y}) ); \
        texelColor = mapTexelToLinear( texelColor ); \
        diffuseColor *= texelColor;`);
    }
    /**
   * Render the internal portal scene to this material's buffer texture map.
   * Signature follows the same as THREE's onBeforeRender, which is implicitly
   * invoked in PortalMesh. PortalMesh calls onBeforeRender to its material here.
   * It should be noted that the args input are the args of the full scene,
   *  **not** the args of the internal portal scene we are renderering.
   *
   * @param {THREE.WebGLRenderer} renderer
   *    The renderer of the full scene (not the internal portal scene).
   * @param {THREE.Scene} scene
   *    The full scene being rendered that this is part of.
   * @param {THREE.Camera} camera
   *    Main camera of the scene.
   * @param {THREE.Geometry} geometry
   *    The geometry of the portal mesh.
   * @param {THREE.Material} material
   *    The material of the rendered object (this).
   * @param {THREE.Group} group
   *    The group this portal belongs to (if any).
   */ onBeforeRender(renderer, scene, camera, geometry, material, group) {
        console.assert(scene !== undefined, "No scene for portal material onBeforeRender");
        // Default to depth 1 if not specified.
        scene.depth = scene.depth || 1;
        if (scene) {
            if (scene.depth > scene.max_depth) {
                scene.depth = 1;
                return;
            }
            scene.depth++;
        }
        const initial = this.renderer.getRenderTarget();
        this.renderer.setRenderTarget(this.buffer_texture);
        // this.alphaMap = this.buffer_texture;
        // this.renderer.getDrawingBufferSize(dims);
        // this.renderer.setSize(this.resolution_width, this.resolution_height);
        if (!this.scene.max_depth) this.scene.max_depth = this.max_depth - 1;
        this.renderer.render(this.scene, this.camera);
        this.buffer_texture.texture.needsUpdate = false;
        this.renderer.setRenderTarget(initial);
    // this.renderer.setSize(dims);
    }
}

},{"three":"ktPTu","@parcel/transformer-js/src/esmodule-helpers.js":"b9DC4"}]},["8sUSo","7Ep4J"], "7Ep4J", "parcelRequire32f1")

//# sourceMappingURL=standalone_demo.c0d93bfa.js.map

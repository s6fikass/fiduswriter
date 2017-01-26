(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _selection = require("prosemirror-old/dist/edit/selection");

/**
 * Helper functions for testing FidusWriter with Selenium.
 * @namespace testCaret
 */
var testCaret = {};

/**
 * Returns the current selection.
 * @function getCaret
 * @memberof testCaret
 * @returns {Caret}
 */
testCaret.getCaret = function getCaret() {
  return window.theEditor.pm.selection.from;
};

/**
 * Sets an empty selection to caret.
 * @function setCaret
 * @memberof testCaret
 * @param {Selection} caret Selection.
 * @returns {Selection}
 */
testCaret.setCaret = function setCaret(caret) {
  return testCaret.setSelection(caret, caret);
};

/**
 * Sets the selection to be between two caret positions.
 * @function setSelection
 * @memberof testCaret
 * @param {caretOne} caretOne The first caret.
 * @param {caretTwo} caretTwo The second caret position.
 * @returns {Selection}
 */
testCaret.setSelection = function setSelection(caretOne, caretTwo) {
  var caretOneRes = window.theEditor.pm.doc.resolve(caretOne);
  var caretTwoRes = window.theEditor.pm.doc.resolve(caretTwo);
  var selection = new _selection.TextSelection(caretOneRes, caretTwoRes);

  window.theEditor.pm.setSelection(selection);
  window.theEditor.pm.focus();

  return selection;
};

/**
 * Checks if the given selections are equal.
 * @function caretsMatch
 * @memberof testCaret
 * @param {Selection} left Caret to be compared.
 * @param {Selection} right Caret to be compared.
 * @returns {Boolean}
 */
testCaret.selectionsMatch = function selectionsMatch(left, right) {
  return left.eq(right);
};

window.testCaret = testCaret;

},{"prosemirror-old/dist/edit/selection":3}],2:[function(require,module,exports){
"use strict";

var _require = require("../util/dom"),
    contains = _require.contains;

function isEditorContent(dom) {
  return dom.classList.contains("ProseMirror-content");
}

// : (DOMNode) → number
// Get the position before a given a DOM node in a document.
function posBeforeFromDOM(node) {
  var pos = 0,
      add = 0;
  for (var cur = node; !isEditorContent(cur); cur = cur.parentNode) {
    var attr = cur.getAttribute("pm-offset");
    if (attr) {
      pos += +attr + add;add = 1;
    }
  }
  return pos;
}

var posFromDOMResult = { pos: 0, inLeaf: -1 };

// : (DOMNode, number) → number
function posFromDOM(dom, domOffset) {
  var bias = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (domOffset == null) {
    domOffset = Array.prototype.indexOf.call(dom.parentNode.childNodes, dom);
    dom = dom.parentNode;
  }

  // Move up to the wrapping container, counting local offset along
  // the way.
  var innerOffset = 0,
      tag = void 0;
  for (;;) {
    var adjust = 0;
    if (dom.nodeType == 3) {
      innerOffset += domOffset;
    } else if (tag = dom.getAttribute("pm-offset") && !childContainer(dom)) {
      var size = +dom.getAttribute("pm-size");
      if (dom.nodeType == 1 && !dom.firstChild) innerOffset = bias > 0 ? size : 0;else if (domOffset == dom.childNodes.length) innerOffset = size;else innerOffset = Math.min(innerOffset, size);
      var inLeaf = posFromDOMResult.inLeaf = posBeforeFromDOM(dom);
      posFromDOMResult.pos = inLeaf + innerOffset;
      return posFromDOMResult;
    } else if (dom.hasAttribute("pm-container")) {
      break;
    } else if (domOffset == dom.childNodes.length) {
      if (domOffset) adjust = 1;else adjust = bias > 0 ? 1 : 0;
    }

    var parent = dom.parentNode;
    domOffset = adjust < 0 ? 0 : Array.prototype.indexOf.call(parent.childNodes, dom) + adjust;
    dom = parent;
    bias = 0;
  }

  var start = isEditorContent(dom) ? 0 : posBeforeFromDOM(dom) + 1,
      before = 0;

  for (var child = dom.childNodes[domOffset - 1]; child; child = child.previousSibling) {
    if (child.nodeType == 1 && (tag = child.getAttribute("pm-offset"))) {
      before += +tag + +child.getAttribute("pm-size");
      break;
    }
  }
  posFromDOMResult.inLeaf = -1;
  posFromDOMResult.pos = start + before + innerOffset;
  return posFromDOMResult;
}
exports.posFromDOM = posFromDOM;

// : (DOMNode) → ?DOMNode
function childContainer(dom) {
  return dom.hasAttribute("pm-container") ? dom : dom.querySelector("[pm-container]");
}
exports.childContainer = childContainer;

// : (ProseMirror, number) → {node: DOMNode, offset: number}
// Find the DOM node and offset into that node that the given document
// position refers to.
function DOMFromPos(pm, pos, loose) {
  if (!loose && pm.operation && pm.doc != pm.operation.doc) throw new RangeError("Resolving a position in an outdated DOM structure");

  var container = pm.content,
      offset = pos;
  for (;;) {
    for (var child = container.firstChild, i = 0;; child = child.nextSibling, i++) {
      if (!child) {
        if (offset && !loose) throw new RangeError("Failed to find node at " + pos);
        return { node: container, offset: i };
      }

      var size = child.nodeType == 1 && child.getAttribute("pm-size");
      if (size) {
        if (!offset) return { node: container, offset: i };
        size = +size;
        if (offset < size) {
          container = childContainer(child);
          if (!container) {
            return leafAt(child, offset);
          } else {
            offset--;
            break;
          }
        } else {
          offset -= size;
        }
      }
    }
  }
}
exports.DOMFromPos = DOMFromPos;

// : (ProseMirror, number) → {node: DOMNode, offset: number}
// The same as DOMFromPos, but searching from the bottom instead of
// the top. This is needed in domchange.js, when there is an arbitrary
// DOM change somewhere in our document, and we can no longer rely on
// the DOM structure around the selection.
function DOMFromPosFromEnd(pm, pos) {
  var container = pm.content,
      dist = (pm.operation ? pm.operation.doc : pm.doc).content.size - pos;
  for (;;) {
    for (var child = container.lastChild, i = container.childNodes.length;; child = child.previousSibling, i--) {
      if (!child) return { node: container, offset: i };

      var size = child.nodeType == 1 && child.getAttribute("pm-size");
      if (size) {
        if (!dist) return { node: container, offset: i };
        size = +size;
        if (dist < size) {
          container = childContainer(child);
          if (!container) {
            return leafAt(child, size - dist);
          } else {
            dist--;
            break;
          }
        } else {
          dist -= size;
        }
      }
    }
  }
}
exports.DOMFromPosFromEnd = DOMFromPosFromEnd;

// : (ProseMirror, number) → DOMNode
function DOMAfterPos(pm, pos) {
  var _DOMFromPos = DOMFromPos(pm, pos),
      node = _DOMFromPos.node,
      offset = _DOMFromPos.offset;

  if (node.nodeType != 1 || offset == node.childNodes.length) throw new RangeError("No node after pos " + pos);
  return node.childNodes[offset];
}
exports.DOMAfterPos = DOMAfterPos;

// : (DOMNode, number) → {node: DOMNode, offset: number}
function leafAt(node, offset) {
  for (;;) {
    var child = node.firstChild;
    if (!child) return { node: node, offset: offset };
    if (child.nodeType != 1) return { node: child, offset: offset };
    node = child;
  }
}

function windowRect() {
  return { left: 0, right: window.innerWidth,
    top: 0, bottom: window.innerHeight };
}

function parentNode(node) {
  var parent = node.parentNode;
  return parent.nodeType == 11 ? parent.host : parent;
}

function scrollIntoView(pm, pos) {
  if (!pos) pos = pm.sel.range.head || pm.sel.range.from;
  var coords = coordsAtPos(pm, pos);
  for (var parent = pm.content;; parent = parentNode(parent)) {
    var _pm$options = pm.options,
        scrollThreshold = _pm$options.scrollThreshold,
        scrollMargin = _pm$options.scrollMargin;

    var atBody = parent == document.body;
    var rect = atBody ? windowRect() : parent.getBoundingClientRect();
    var moveX = 0,
        moveY = 0;
    if (coords.top < rect.top + scrollThreshold) moveY = -(rect.top - coords.top + scrollMargin);else if (coords.bottom > rect.bottom - scrollThreshold) moveY = coords.bottom - rect.bottom + scrollMargin;
    if (coords.left < rect.left + scrollThreshold) moveX = -(rect.left - coords.left + scrollMargin);else if (coords.right > rect.right - scrollThreshold) moveX = coords.right - rect.right + scrollMargin;
    if (moveX || moveY) {
      if (atBody) {
        window.scrollBy(moveX, moveY);
      } else {
        if (moveY) parent.scrollTop += moveY;
        if (moveX) parent.scrollLeft += moveX;
      }
    }
    if (atBody) break;
  }
}
exports.scrollIntoView = scrollIntoView;

function findOffsetInNode(node, coords) {
  var closest = void 0,
      dxClosest = 2e8,
      coordsClosest = void 0,
      offset = 0;
  for (var child = node.firstChild, childIndex = 0; child; child = child.nextSibling, childIndex++) {
    var rects = void 0;
    if (child.nodeType == 1) rects = child.getClientRects();else if (child.nodeType == 3) rects = textRange(child).getClientRects();else continue;

    for (var i = 0; i < rects.length; i++) {
      var rect = rects[i];
      if (rect.top <= coords.top && rect.bottom >= coords.top) {
        var dx = rect.left > coords.left ? rect.left - coords.left : rect.right < coords.left ? coords.left - rect.right : 0;
        if (dx < dxClosest) {
          closest = child;
          dxClosest = dx;
          coordsClosest = dx && closest.nodeType == 3 ? { left: rect.right < coords.left ? rect.right : rect.left, top: coords.top } : coords;
          if (child.nodeType == 1 && dx) offset = childIndex + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0);
          continue;
        }
      }
      if (!closest && (coords.left >= rect.right || coords.left >= rect.left && coords.top >= rect.bottom)) offset = i + 1;
    }
  }
  if (closest && closest.nodeType == 3) return findOffsetInText(closest, coordsClosest);
  if (!closest || dxClosest && closest.nodeType == 1) return { node: node, offset: offset };
  return findOffsetInNode(closest, coordsClosest);
}

function findOffsetInText(node, coords) {
  var len = node.nodeValue.length;
  var range = document.createRange();
  for (var i = 0; i < len; i++) {
    range.setEnd(node, i + 1);
    range.setStart(node, i);
    var rect = singleRect(range, 1);
    if (rect.top == rect.bottom) continue;
    if (rect.left - 1 <= coords.left && rect.right + 1 >= coords.left && rect.top - 1 <= coords.top && rect.bottom + 1 >= coords.top) return { node: node, offset: i + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0) };
  }
  return { node: node, offset: 0 };
}

function targetKludge(dom, coords) {
  if (/^[uo]l$/i.test(dom.nodeName)) {
    for (var child = dom.firstChild; child; child = child.nextSibling) {
      if (child.nodeType != 1 || !child.hasAttribute("pm-offset") || !/^li$/i.test(child.nodeName)) continue;
      var childBox = child.getBoundingClientRect();
      if (coords.left > childBox.left - 2) break;
      if (childBox.top <= coords.top && childBox.bottom >= coords.top) return child;
    }
  }
  return dom;
}

// Given an x,y position on the editor, get the position in the document.
function posAtCoords(pm, coords) {
  var elt = targetKludge(pm.root.elementFromPoint(coords.left, coords.top + 1), coords);
  if (!contains(pm.content, elt)) return null;

  var _findOffsetInNode = findOffsetInNode(elt, coords),
      node = _findOffsetInNode.node,
      offset = _findOffsetInNode.offset,
      bias = -1;

  if (node.nodeType == 1 && !node.firstChild) {
    var rect = node.getBoundingClientRect();
    bias = rect.left != rect.right && coords.left > (rect.left + rect.right) / 2 ? 1 : -1;
  }
  return posFromDOM(node, offset, bias);
}
exports.posAtCoords = posAtCoords;

function textRange(node, from, to) {
  var range = document.createRange();
  range.setEnd(node, to == null ? node.nodeValue.length : to);
  range.setStart(node, from || 0);
  return range;
}

function singleRect(object, bias) {
  var rects = object.getClientRects();
  return !rects.length ? object.getBoundingClientRect() : rects[bias < 0 ? 0 : rects.length - 1];
}

// : (ProseMirror, number) → ClientRect
// Given a position in the document model, get a bounding box of the
// character at that position, relative to the window.
function coordsAtPos(pm, pos) {
  var _DOMFromPos2 = DOMFromPos(pm, pos),
      node = _DOMFromPos2.node,
      offset = _DOMFromPos2.offset;

  var side = void 0,
      rect = void 0;
  if (node.nodeType == 3) {
    if (offset < node.nodeValue.length) {
      rect = singleRect(textRange(node, offset, offset + 1), -1);
      side = "left";
    }
    if ((!rect || rect.left == rect.right) && offset) {
      rect = singleRect(textRange(node, offset - 1, offset), 1);
      side = "right";
    }
  } else if (node.firstChild) {
    if (offset < node.childNodes.length) {
      var child = node.childNodes[offset];
      rect = singleRect(child.nodeType == 3 ? textRange(child) : child, -1);
      side = "left";
    }
    if ((!rect || rect.top == rect.bottom) && offset) {
      var _child = node.childNodes[offset - 1];
      rect = singleRect(_child.nodeType == 3 ? textRange(_child) : _child, 1);
      side = "right";
    }
  } else {
    rect = node.getBoundingClientRect();
    side = "left";
  }
  var x = rect[side];
  return { top: rect.top, bottom: rect.bottom, left: x, right: x };
}
exports.coordsAtPos = coordsAtPos;
},{"../util/dom":5}],3:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require("../util/dom"),
    contains = _require.contains;

var browser = require("../util/browser");

var _require2 = require("./dompos"),
    posFromDOM = _require2.posFromDOM,
    DOMAfterPos = _require2.DOMAfterPos,
    DOMFromPos = _require2.DOMFromPos,
    coordsAtPos = _require2.coordsAtPos;

// Track the state of the current editor selection. Keeps the editor
// selection in sync with the DOM selection by polling for changes,
// as there is no DOM event for DOM selection changes.


var SelectionState = function () {
  function SelectionState(pm, range) {
    var _this = this;

    _classCallCheck(this, SelectionState);

    this.pm = pm;
    // The current editor selection.
    this.range = range;

    // The timeout ID for the poller when active.
    this.polling = null;
    // Track the state of the DOM selection.
    this.lastAnchorNode = this.lastHeadNode = this.lastAnchorOffset = this.lastHeadOffset = null;
    // The corresponding DOM node when a node selection is active.
    this.lastNode = null;

    pm.content.addEventListener("focus", function () {
      return _this.receivedFocus();
    });

    this.poller = this.poller.bind(this);
  }

  // : (Selection, boolean)
  // Set the current selection and signal an event on the editor.


  _createClass(SelectionState, [{
    key: "setAndSignal",
    value: function setAndSignal(range, clearLast) {
      this.set(range, clearLast);
      this.pm.on.selectionChange.dispatch();
    }

    // : (Selection, boolean)
    // Set the current selection.

  }, {
    key: "set",
    value: function set(range, clearLast) {
      this.pm.ensureOperation({ readSelection: false, selection: range });
      this.range = range;
      if (clearLast !== false) this.lastAnchorNode = null;
    }
  }, {
    key: "poller",
    value: function poller() {
      if (hasFocus(this.pm)) {
        if (!this.pm.operation) this.readFromDOM();
        this.polling = setTimeout(this.poller, 100);
      } else {
        this.polling = null;
      }
    }
  }, {
    key: "startPolling",
    value: function startPolling() {
      clearTimeout(this.polling);
      this.polling = setTimeout(this.poller, 50);
    }
  }, {
    key: "fastPoll",
    value: function fastPoll() {
      this.startPolling();
    }
  }, {
    key: "stopPolling",
    value: function stopPolling() {
      clearTimeout(this.polling);
      this.polling = null;
    }

    // : () → bool
    // Whether the DOM selection has changed from the last known state.

  }, {
    key: "domChanged",
    value: function domChanged() {
      var sel = this.pm.root.getSelection();
      return sel.anchorNode != this.lastAnchorNode || sel.anchorOffset != this.lastAnchorOffset || sel.focusNode != this.lastHeadNode || sel.focusOffset != this.lastHeadOffset;
    }

    // Store the current state of the DOM selection.

  }, {
    key: "storeDOMState",
    value: function storeDOMState() {
      var sel = this.pm.root.getSelection();
      this.lastAnchorNode = sel.anchorNode;this.lastAnchorOffset = sel.anchorOffset;
      this.lastHeadNode = sel.focusNode;this.lastHeadOffset = sel.focusOffset;
    }

    // : () → bool
    // When the DOM selection changes in a notable manner, modify the
    // current selection state to match.

  }, {
    key: "readFromDOM",
    value: function readFromDOM() {
      if (!hasFocus(this.pm) || !this.domChanged()) return false;

      var _selectionFromDOM = selectionFromDOM(this.pm, this.range.head),
          range = _selectionFromDOM.range,
          adjusted = _selectionFromDOM.adjusted;

      this.setAndSignal(range);

      if (range instanceof NodeSelection || adjusted) {
        this.toDOM();
      } else {
        this.clearNode();
        this.storeDOMState();
      }
      return true;
    }
  }, {
    key: "toDOM",
    value: function toDOM(takeFocus) {
      if (!hasFocus(this.pm)) {
        if (!takeFocus) return;
        // See https://bugzilla.mozilla.org/show_bug.cgi?id=921444
        else if (browser.gecko) this.pm.content.focus();
      }
      if (this.range instanceof NodeSelection) this.nodeToDOM();else this.rangeToDOM();
    }

    // Make changes to the DOM for a node selection.

  }, {
    key: "nodeToDOM",
    value: function nodeToDOM() {
      var dom = DOMAfterPos(this.pm, this.range.from);
      if (dom != this.lastNode) {
        this.clearNode();
        dom.classList.add("ProseMirror-selectednode");
        this.pm.content.classList.add("ProseMirror-nodeselection");
        this.lastNode = dom;
      }
      var range = document.createRange(),
          sel = this.pm.root.getSelection();
      range.selectNode(dom);
      sel.removeAllRanges();
      sel.addRange(range);
      this.storeDOMState();
    }

    // Make changes to the DOM for a text selection.

  }, {
    key: "rangeToDOM",
    value: function rangeToDOM() {
      this.clearNode();

      var anchor = DOMFromPos(this.pm, this.range.anchor);
      var head = DOMFromPos(this.pm, this.range.head);

      var sel = this.pm.root.getSelection(),
          range = document.createRange();
      if (sel.extend) {
        range.setEnd(anchor.node, anchor.offset);
        range.collapse(false);
      } else {
        if (this.range.anchor > this.range.head) {
          var tmp = anchor;anchor = head;head = tmp;
        }
        range.setEnd(head.node, head.offset);
        range.setStart(anchor.node, anchor.offset);
      }
      sel.removeAllRanges();
      sel.addRange(range);
      if (sel.extend) sel.extend(head.node, head.offset);
      this.storeDOMState();
    }

    // Clear all DOM statefulness of the last node selection.

  }, {
    key: "clearNode",
    value: function clearNode() {
      if (this.lastNode) {
        this.lastNode.classList.remove("ProseMirror-selectednode");
        this.pm.content.classList.remove("ProseMirror-nodeselection");
        this.lastNode = null;
        return true;
      }
    }
  }, {
    key: "receivedFocus",
    value: function receivedFocus() {
      if (this.polling == null) this.startPolling();
    }
  }]);

  return SelectionState;
}();

exports.SelectionState = SelectionState;

// ;; An editor selection. Can be one of two selection types:
// `TextSelection` or `NodeSelection`. Both have the properties
// listed here, but also contain more information (such as the
// selected [node](#NodeSelection.node) or the
// [head](#TextSelection.head) and [anchor](#TextSelection.anchor)).

var Selection = function () {
  _createClass(Selection, [{
    key: "from",

    // :: number
    // The left bound of the selection.
    get: function get() {
      return this.$from.pos;
    }

    // :: number
    // The right bound of the selection.

  }, {
    key: "to",
    get: function get() {
      return this.$to.pos;
    }
  }]);

  function Selection($from, $to) {
    _classCallCheck(this, Selection);

    // :: ResolvedPos
    // The resolved left bound of the selection
    this.$from = $from;
    // :: ResolvedPos
    // The resolved right bound of the selection
    this.$to = $to;
  }

  // :: bool
  // True if the selection is an empty text selection (head an anchor
  // are the same).


  _createClass(Selection, [{
    key: "empty",
    get: function get() {
      return this.from == this.to;
    }

    // :: (other: Selection) → bool #path=Selection.prototype.eq
    // Test whether the selection is the same as another selection.

    // :: (doc: Node, mapping: Mappable) → Selection #path=Selection.prototype.map
    // Map this selection through a [mappable](#Mappable) thing. `doc`
    // should be the new document, to which we are mapping.

  }]);

  return Selection;
}();

exports.Selection = Selection;

// ;; A text selection represents a classical editor
// selection, with a head (the moving side) and anchor (immobile
// side), both of which point into textblock nodes. It can be empty (a
// regular cursor position).

var TextSelection = function (_Selection) {
  _inherits(TextSelection, _Selection);

  _createClass(TextSelection, [{
    key: "anchor",

    // :: number
    // The selection's immobile side (does not move when pressing
    // shift-arrow).
    get: function get() {
      return this.$anchor.pos;
    }
    // :: number
    // The selection's mobile side (the side that moves when pressing
    // shift-arrow).

  }, {
    key: "head",
    get: function get() {
      return this.$head.pos;
    }

    // :: (ResolvedPos, ?ResolvedPos)
    // Construct a text selection. When `head` is not given, it defaults
    // to `anchor`.

  }]);

  function TextSelection($anchor) {
    var $head = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : $anchor;

    _classCallCheck(this, TextSelection);

    var inv = $anchor.pos > $head.pos;

    // :: ResolvedPos The resolved anchor of the selection.
    var _this2 = _possibleConstructorReturn(this, (TextSelection.__proto__ || Object.getPrototypeOf(TextSelection)).call(this, inv ? $head : $anchor, inv ? $anchor : $head));

    _this2.$anchor = $anchor;
    // :: ResolvedPos The resolved head of the selection.
    _this2.$head = $head;
    return _this2;
  }

  _createClass(TextSelection, [{
    key: "eq",
    value: function eq(other) {
      return other instanceof TextSelection && other.head == this.head && other.anchor == this.anchor;
    }
  }, {
    key: "map",
    value: function map(doc, mapping) {
      var $head = doc.resolve(mapping.map(this.head));
      if (!$head.parent.isTextblock) return findSelectionNear($head);
      var $anchor = doc.resolve(mapping.map(this.anchor));
      return new TextSelection($anchor.parent.isTextblock ? $anchor : $head, $head);
    }
  }, {
    key: "inverted",
    get: function get() {
      return this.anchor > this.head;
    }
  }, {
    key: "token",
    get: function get() {
      return new SelectionToken(TextSelection, this.anchor, this.head);
    }
  }], [{
    key: "mapToken",
    value: function mapToken(token, mapping) {
      return new SelectionToken(TextSelection, mapping.map(token.a), mapping.map(token.b));
    }
  }, {
    key: "fromToken",
    value: function fromToken(token, doc) {
      var $head = doc.resolve(token.b);
      if (!$head.parent.isTextblock) return findSelectionNear($head);
      var $anchor = doc.resolve(token.a);
      return new TextSelection($anchor.parent.isTextblock ? $anchor : $head, $head);
    }
  }]);

  return TextSelection;
}(Selection);

exports.TextSelection = TextSelection;

// ;; A node selection is a selection that points at a
// single node. All nodes marked [selectable](#NodeType.selectable)
// can be the target of a node selection. In such an object, `from`
// and `to` point directly before and after the selected node.

var NodeSelection = function (_Selection2) {
  _inherits(NodeSelection, _Selection2);

  // :: (ResolvedPos)
  // Create a node selection. Does not verify the validity of its
  // argument. Use `ProseMirror.setNodeSelection` for an easier,
  // error-checking way to create a node selection.
  function NodeSelection($from) {
    _classCallCheck(this, NodeSelection);

    var $to = $from.plusOne();

    // :: Node The selected node.
    var _this3 = _possibleConstructorReturn(this, (NodeSelection.__proto__ || Object.getPrototypeOf(NodeSelection)).call(this, $from, $to));

    _this3.node = $from.nodeAfter;
    return _this3;
  }

  _createClass(NodeSelection, [{
    key: "eq",
    value: function eq(other) {
      return other instanceof NodeSelection && this.from == other.from;
    }
  }, {
    key: "map",
    value: function map(doc, mapping) {
      var $from = doc.resolve(mapping.map(this.from, 1));
      var to = mapping.map(this.to, -1);
      var node = $from.nodeAfter;
      if (node && to == $from.pos + node.nodeSize && node.type.selectable) return new NodeSelection($from);
      return findSelectionNear($from);
    }
  }, {
    key: "token",
    get: function get() {
      return new SelectionToken(NodeSelection, this.from, this.to);
    }
  }], [{
    key: "mapToken",
    value: function mapToken(token, mapping) {
      return new SelectionToken(NodeSelection, mapping.map(token.a, 1), mapping.map(token.b, -1));
    }
  }, {
    key: "fromToken",
    value: function fromToken(token, doc) {
      var $from = doc.resolve(token.a),
          node = $from.nodeAfter;
      if (node && token.b == token.a + node.nodeSize && node.type.selectable) return new NodeSelection($from);
      return findSelectionNear($from);
    }
  }]);

  return NodeSelection;
}(Selection);

exports.NodeSelection = NodeSelection;

var SelectionToken = function SelectionToken(type, a, b) {
  _classCallCheck(this, SelectionToken);

  this.type = type;
  this.a = a;
  this.b = b;
};

function isCollapsed(sel) {
  // Selection.isCollapsed is broken in Chrome 52.
  // See https://bugs.chromium.org/p/chromium/issues/detail?id=447523
  return sel.focusNode === sel.anchorNode && sel.focusOffset === sel.anchorOffset;
}
exports.isCollapsed = isCollapsed;

function selectionFromDOM(pm, oldHead) {
  var sel = pm.root.getSelection();
  var doc = pm.doc;

  var _posFromDOM = posFromDOM(sel.focusNode, sel.focusOffset),
      head = _posFromDOM.pos,
      headLeaf = _posFromDOM.inLeaf;

  if (headLeaf > -1 && isCollapsed(sel)) {
    var $leaf = doc.resolve(headLeaf),
        node = $leaf.nodeAfter;
    if (node.type.selectable && !node.type.isInline) return { range: new NodeSelection($leaf), adjusted: true };
  }
  var anchor = isCollapsed(sel) ? head : posFromDOM(sel.anchorNode, sel.anchorOffset).pos;

  var range = findSelectionNear(doc.resolve(head), oldHead != null && oldHead < head ? 1 : -1);
  if (range instanceof TextSelection) {
    var selNearAnchor = findSelectionNear(doc.resolve(anchor), anchor > range.to ? -1 : 1, true);
    range = new TextSelection(selNearAnchor.$anchor, range.$head);
  } else if (anchor < range.from || anchor > range.to) {
    // If head falls on a node, but anchor falls outside of it,
    // create a text selection between them
    var inv = anchor > range.to;
    range = new TextSelection(findSelectionNear(doc.resolve(anchor), inv ? -1 : 1, true).$anchor, findSelectionNear(inv ? range.$from : range.$to, inv ? 1 : -1, true).$head);
  }
  return { range: range, adjusted: head != range.head || anchor != range.anchor };
}

function hasFocus(pm) {
  if (pm.root.activeElement != pm.content) return false;
  var sel = pm.root.getSelection();
  return sel.rangeCount && contains(pm.content, sel.anchorNode);
}
exports.hasFocus = hasFocus;

// Try to find a selection inside the given node. `pos` points at the
// position where the search starts. When `text` is true, only return
// text selections.
function findSelectionIn(doc, node, pos, index, dir, text) {
  if (node.isTextblock) return new TextSelection(doc.resolve(pos));
  for (var i = index - (dir > 0 ? 0 : 1); dir > 0 ? i < node.childCount : i >= 0; i += dir) {
    var child = node.child(i);
    if (!child.type.isLeaf) {
      var inner = findSelectionIn(doc, child, pos + dir, dir < 0 ? child.childCount : 0, dir, text);
      if (inner) return inner;
    } else if (!text && child.type.selectable) {
      return new NodeSelection(doc.resolve(pos - (dir < 0 ? child.nodeSize : 0)));
    }
    pos += child.nodeSize * dir;
  }
}

// FIXME we'll need some awareness of text direction when scanning for selections

// Create a selection which is moved relative to a position in a
// given direction. When a selection isn't found at the given position,
// walks up the document tree one level and one step in the
// desired direction.
function findSelectionFrom($pos, dir, text) {
  var inner = $pos.parent.isTextblock ? new TextSelection($pos) : findSelectionIn($pos.node(0), $pos.parent, $pos.pos, $pos.index(), dir, text);
  if (inner) return inner;

  for (var depth = $pos.depth - 1; depth >= 0; depth--) {
    var found = dir < 0 ? findSelectionIn($pos.node(0), $pos.node(depth), $pos.before(depth + 1), $pos.index(depth), dir, text) : findSelectionIn($pos.node(0), $pos.node(depth), $pos.after(depth + 1), $pos.index(depth) + 1, dir, text);
    if (found) return found;
  }
}
exports.findSelectionFrom = findSelectionFrom;

function findSelectionNear($pos) {
  var bias = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var text = arguments[2];

  var result = findSelectionFrom($pos, bias, text) || findSelectionFrom($pos, -bias, text);
  if (!result) throw new RangeError("Searching for selection in invalid document " + $pos.node(0));
  return result;
}
exports.findSelectionNear = findSelectionNear;

// Find the selection closest to the start of the given node. `pos`,
// if given, should point at the start of the node's content.
function findSelectionAtStart(doc, text) {
  return findSelectionIn(doc, doc, 0, 0, 1, text);
}
exports.findSelectionAtStart = findSelectionAtStart;

// Find the selection closest to the end of the given node.
function findSelectionAtEnd(doc, text) {
  return findSelectionIn(doc, doc, doc.content.size, doc.childCount, -1, text);
}
exports.findSelectionAtEnd = findSelectionAtEnd;

// : (ProseMirror, number, number)
// Whether vertical position motion in a given direction
// from a position would leave a text block.
function verticalMotionLeavesTextblock(pm, $pos, dir) {
  var dom = $pos.depth ? DOMAfterPos(pm, $pos.before()) : pm.content;
  var coords = coordsAtPos(pm, $pos.pos);
  for (var child = dom.firstChild; child; child = child.nextSibling) {
    if (child.nodeType != 1) continue;
    var boxes = child.getClientRects();
    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      if (dir < 0 ? box.bottom < coords.top : box.top > coords.bottom) return false;
    }
  }
  return true;
}
exports.verticalMotionLeavesTextblock = verticalMotionLeavesTextblock;
},{"../util/browser":4,"../util/dom":5,"./dompos":2}],4:[function(require,module,exports){
"use strict";

var ie_upto10 = /MSIE \d/.test(navigator.userAgent);
var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);

module.exports = {
  mac: /Mac/.test(navigator.platform),
  ie: ie_upto10 || !!ie_11up,
  ie_version: ie_upto10 ? document.documentMode || 6 : ie_11up && +ie_11up[1],
  gecko: /gecko\/\d/i.test(navigator.userAgent),
  ios: /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent)
};
},{}],5:[function(require,module,exports){
"use strict";

function elt(tag, attrs) {
  var result = document.createElement(tag);
  if (attrs) for (var name in attrs) {
    if (name == "style") result.style.cssText = attrs[name];else if (attrs[name] != null) result.setAttribute(name, attrs[name]);
  }

  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  for (var i = 0; i < args.length; i++) {
    add(args[i], result);
  }return result;
}
exports.elt = elt;

function add(value, target) {
  if (typeof value == "string") value = document.createTextNode(value);

  if (Array.isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      add(value[i], target);
    }
  } else {
    target.appendChild(value);
  }
}

var reqFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var cancelFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;

function requestAnimationFrame(f) {
  if (reqFrame) return reqFrame.call(window, f);else return setTimeout(f, 10);
}
exports.requestAnimationFrame = requestAnimationFrame;

function cancelAnimationFrame(handle) {
  if (reqFrame) return cancelFrame.call(window, handle);else clearTimeout(handle);
}
exports.cancelAnimationFrame = cancelAnimationFrame;

// : (DOMNode, DOMNode) → bool
// Check whether a DOM node is an ancestor of another DOM node.
function contains(parent, child) {
  // Android browser and IE will return false if child is a text node.
  if (child.nodeType != 1) child = child.parentNode;
  return child && parent.contains(child);
}
exports.contains = contains;

var accumulatedCSS = "",
    cssNode = null;

function insertCSS(css) {
  if (cssNode) cssNode.textContent += css;else accumulatedCSS += css;
}
exports.insertCSS = insertCSS;

// This is called when a ProseMirror instance is created, to ensure
// the CSS is in the DOM.
function ensureCSSAdded() {
  if (!cssNode) {
    cssNode = document.createElement("style");
    cssNode.textContent = "/* ProseMirror CSS */\n" + accumulatedCSS;
    document.head.insertBefore(cssNode, document.head.firstChild);
  }
}
exports.ensureCSSAdded = ensureCSSAdded;
},{}]},{},[1]);

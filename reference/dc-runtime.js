(function () {
  var SVGNS = 'http://www.w3.org/2000/svg';
  function lookup(p, scope) {
    p = p.trim();
    if (p === 'true') return true;
    if (p === 'false') return false;
    if (p === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(p)) return Number(p);
    var v = scope, keys = p.split('.');
    for (var i = 0; i < keys.length; i++) { if (v == null) return undefined; v = v[keys[i]]; }
    return v;
  }
  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var WHOLE = /^\{\{\s*([^}]+?)\s*\}\}$/;
  function text(str, scope) {
    return str.replace(HOLE, function (_, p) { var v = lookup(p, scope); return v == null ? '' : String(v); });
  }
  function attr(str, scope) {
    var m = str.match(WHOLE);
    return m ? lookup(m[1], scope) : text(str, scope);
  }
  function children(src, scope, out, refs) {
    for (var c = src.firstChild; c; c = c.nextSibling) node(c, scope, out, refs);
  }
  function node(n, scope, out, refs) {
    if (n.nodeType === 3) { out.appendChild(document.createTextNode(n.nodeValue.indexOf('{{') > -1 ? text(n.nodeValue, scope) : n.nodeValue)); return; }
    if (n.nodeType !== 1) return;
    var tag = n.localName;
    if (tag === 'sc-for') {
      var list = attr(n.getAttribute('list'), scope) || [];
      var as = n.getAttribute('as') || 'item';
      list.forEach(function (it, i) { var s = Object.create(scope); s[as] = it; s.$index = i; children(n, s, out, refs); });
      return;
    }
    if (tag === 'sc-if') { if (attr(n.getAttribute('value'), scope)) children(n, scope, out, refs); return; }
    var el = n.namespaceURI === SVGNS ? document.createElementNS(SVGNS, tag) : document.createElement(tag);
    for (var i = 0; i < n.attributes.length; i++) {
      var a = n.attributes[i], name = a.name;
      if (name.indexOf('hint-') === 0) continue;
      var v = a.value.indexOf('{{') > -1 ? attr(a.value, scope) : a.value;
      if (name === 'ref') { if (typeof v === 'function') refs.push([v, el]); continue; }
      if (name.indexOf('on') === 0 && typeof v === 'function') { el.addEventListener(name.slice(2).toLowerCase(), v); continue; }
      if (v == null || v === false) continue;
      if (a.namespaceURI) el.setAttributeNS(a.namespaceURI, name, String(v)); else el.setAttribute(name, String(v));
    }
    children(n, scope, el, refs);
    out.appendChild(el);
  }
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (p) {
    this.state = Object.assign({}, this.state, typeof p === 'function' ? p(this.state, this.props) : p);
    schedule();
  };
  DCLogic.prototype.forceUpdate = function () { schedule(); };
  var Component = new Function('DCLogic', document.getElementById('dc-logic').textContent + '\nreturn Component;')(DCLogic);
  var inst = new Component({});
  var tpl = document.getElementById('dc-template').content;
  var app = document.getElementById('app');
  var pending = false;
  function draw() {
    var refs = [], frag = document.createDocumentFragment(), y = window.scrollY;
    children(tpl, inst.renderVals(), frag, refs);
    app.replaceChildren(frag);
    refs.forEach(function (r) { r[0](r[1]); });
    window.scrollTo(0, y);
  }
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () { pending = false; draw(); if (inst.componentDidUpdate) inst.componentDidUpdate(); });
  }
  draw();
  if (inst.componentDidMount) inst.componentDidMount();
  // Static reference: stop the simulated price polling (a full re-render would restart CSS animations).
  if (inst._timer) clearInterval(inst._timer);
})();

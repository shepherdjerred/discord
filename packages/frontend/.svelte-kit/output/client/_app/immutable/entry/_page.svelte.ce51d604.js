import {
  S as i,
  i as o,
  s as c,
  k as h,
  q as m,
  l as d,
  m as p,
  r as _,
  h as r,
  b as f,
  G as u,
  H as n,
} from "../chunks/index.019f7634.js";
function x(l) {
  let t, s;
  return {
    c() {
      (t = h("h1")), (s = m("Glitter"));
    },
    l(e) {
      t = d(e, "H1", {});
      var a = p(t);
      (s = _(a, "Glitter")), a.forEach(r);
    },
    m(e, a) {
      f(e, t, a), u(t, s);
    },
    p: n,
    i: n,
    o: n,
    d(e) {
      e && r(t);
    },
  };
}
class g extends i {
  constructor(t) {
    super(), o(this, t, null, x, c, {});
  }
}
export { g as default };

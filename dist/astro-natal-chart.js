const v = {
  border: "#008000",
  background: "#ffffff",
  labels: "#000000",
  zodiac: [
    "#fabdba",
    "#fddcbd",
    "#fdfdbd",
    "#ddfdbc",
    "#bdfebe",
    "#addac5",
    "#b5fdfd",
    "#bcddfc",
    "#bdbdfd",
    "#ddbdfe",
    "#fbbafa",
    "#fdbedd"
  ],
  planetRing: "#e6f4ff",
  asc: "#ff0000",
  mc: "#0066cc",
  houses: "#ff0000",
  sun: "#f1c40f",
  planetsDefault: "#000000"
}, T = {
  asc: "Asc",
  dsc: "Dsc",
  ic: "IC",
  mc: "MC",
  planets: {
    Sun: "Sun",
    Moon: "Moon",
    Mercury: "Mercury",
    Venus: "Venus",
    Mars: "Mars",
    Jupiter: "Jupiter",
    Saturn: "Saturn",
    Uranus: "Uranus",
    Neptune: "Neptune",
    Pluto: "Pluto"
  },
  zodiac: {
    Aries: "Aries",
    Taurus: "Taurus",
    Gemini: "Gemini",
    Cancer: "Cancer",
    Leo: "Leo",
    Virgo: "Virgo",
    Libra: "Libra",
    Scorpio: "Scorpio",
    Sagittarius: "Sagittarius",
    Capricorn: "Capricorn",
    Aquarius: "Aquarius",
    Pisces: "Pisces"
  },
  aspects: {
    conjunction: "conjunction",
    sextile: "sextile",
    square: "square",
    trine: "trine",
    opposition: "opposition"
  }
}, d = "http://www.w3.org/2000/svg", M = [
  { name: "conjunction", angle: 0, orb: 8, color: "#2c3e50", symbol: "☌" },
  { name: "sextile", angle: 60, orb: 6, color: "#2ecc71", symbol: "✶" },
  { name: "square", angle: 90, orb: 6, color: "#e74c3c", symbol: "□" },
  { name: "trine", angle: 120, orb: 6, color: "#2ecc71", symbol: "△" },
  { name: "opposition", angle: 180, orb: 8, color: "#e74c3c", symbol: "☍" }
];
function O(t, n) {
  let e = Math.abs(t - n);
  return e > 180 && (e = 360 - e), e;
}
function _(t, n) {
  const e = O(t, n);
  for (const s of M)
    if (Math.abs(e - s.angle) <= s.orb)
      return { ...s, diff: e };
  return null;
}
function P(t) {
  const n = [], e = Object.values(t), s = e.some((i) => i.group === "B");
  for (let i = 0; i < e.length; i++)
    for (let u = i + 1; u < e.length; u++) {
      const c = e[i], o = e[u];
      if (s && c.group === o.group) continue;
      const l = _(c.lon, o.lon);
      l && n.push({
        p1: c.name + "_" + c.group,
        p2: o.name + "_" + o.group,
        ...l
      });
    }
  return n;
}
const k = [
  { name: "Aries", symbol: "♈" },
  { name: "Taurus", symbol: "♉" },
  { name: "Gemini", symbol: "♊" },
  { name: "Cancer", symbol: "♋" },
  { name: "Leo", symbol: "♌" },
  { name: "Virgo", symbol: "♍" },
  { name: "Libra", symbol: "♎" },
  { name: "Scorpio", symbol: "♏" },
  { name: "Sagittarius", symbol: "♐" },
  { name: "Capricorn", symbol: "♑" },
  { name: "Aquarius", symbol: "♒" },
  { name: "Pisces", symbol: "♓" }
];
function a(t, n, e, s) {
  const i = e * Math.PI / 180;
  return {
    x: t + s * Math.cos(i),
    y: n + s * Math.sin(i)
  };
}
function A(t, n) {
  return (n - t + 180 + 360) % 360;
}
function $(t, n, e, s) {
  const { svg: i } = t, u = A(e, s), c = a(
    t.cx,
    t.cy,
    u,
    (t.zodiacOuterRadius + t.zodiacInnerRadius) / 2
  ), o = document.createElementNS(d, "text");
  o.textContent = k[n].symbol, o.setAttribute("x", c.x), o.setAttribute("y", c.y), o.setAttribute("text-anchor", "middle"), o.setAttribute("dominant-baseline", "middle"), o.setAttribute("font-size", t.size * 0.04);
  const l = document.createElementNS(d, "title");
  l.textContent = t.lang.zodiac[k[n].name], o.appendChild(l), i.appendChild(o);
}
function D(t, n) {
  const { svg: e } = t;
  for (let s = 0; s < 12; s++) {
    const i = s * 30, u = (s + 1) * 30, c = A(i, n), o = A(u, n), l = document.createElementNS(d, "path");
    l.setAttribute(
      "d",
      h(t.cx, t.cy, c, o, t.zodiacOuterRadius, t.zodiacInnerRadius)
    ), l.setAttribute("fill", t.colors.zodiac[s]), l.setAttribute("stroke", t.colors.border), e.appendChild(l), $(t, s, i + 15, n);
  }
}
function h(t, n, e, s, i, u) {
  const c = a(t, n, e, i), o = a(t, n, s, i), l = a(t, n, s, u), r = a(t, n, e, u);
  return `
M ${c.x} ${c.y}
A ${i} ${i} 0 0 0 ${o.x} ${o.y}
L ${l.x} ${l.y}
A ${u} ${u} 0 0 1 ${r.x} ${r.y}
Z
`;
}
const V = {
  Sun: "☉",
  Moon: "☽",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇"
}, w = 4, H = 10;
function q(t) {
  const { svg: n } = t, e = document.createElementNS(d, "circle");
  e.setAttribute("cx", t.cx), e.setAttribute("cy", t.cy), e.setAttribute("r", t.planetOuterRadius), e.setAttribute("fill", t.colors.planetRing), e.setAttribute("stroke", t.colors.border), n.appendChild(e);
  const s = document.createElementNS(d, "circle");
  s.setAttribute("cx", t.cx), s.setAttribute("cy", t.cy), s.setAttribute("r", t.planetInnerRadius), s.setAttribute("fill", "none"), s.setAttribute("stroke", t.colors.border), n.appendChild(s);
}
function L(t, n, e, s = "A") {
  const { svg: i } = t;
  for (const u in n) {
    const c = n[u], o = A(c, e), l = a(t.cx, t.cy, o, t.planetInnerRadius), r = document.createElementNS(d, "circle");
    r.setAttribute("cx", l.x), r.setAttribute("cy", l.y), r.setAttribute("r", s === "A" ? 2 : 2.5), r.setAttribute("fill", t.colors.background), r.setAttribute("stroke", t.colors.border), i.appendChild(r), t.planetDots[u + "_" + s] = {
      name: u,
      group: s,
      x: l.x,
      y: l.y,
      lon: c
    };
  }
}
function G(t, n) {
  const { svg: e } = t, s = U(t.planetDots, n);
  for (const i of s) {
    const u = i.name, c = i.angle, o = a(t.cx, t.cy, c, t.planetOrbitRadius), l = document.createElementNS(d, "text"), r = j(t, u, t.aspects);
    l.textContent = V[i.planet], l.setAttribute("x", o.x), l.setAttribute("y", o.y), l.setAttribute("text-anchor", "middle"), l.setAttribute("dominant-baseline", "middle"), l.setAttribute("fill", r), l.setAttribute("font-size", t.size * 0.04), l.setAttribute("text-decoration", i.group === "A" ? "" : "underline");
    const b = document.createElementNS(d, "title");
    b.textContent = t.lang.planets[i.planet], l.appendChild(b), e.appendChild(l);
  }
}
function U(t, n) {
  const e = Object.entries(t).map(([s, i]) => ({
    name: s,
    group: i.group,
    planet: i.name,
    angle: A(i.lon, n)
  }));
  e.sort((s, i) => s.angle - i.angle);
  for (let s = 0; s < H; s++)
    for (let i = 0; i < e.length - 1; i++) {
      const u = e[i], c = e[i + 1];
      let o = c.angle - u.angle;
      if (o < w) {
        const l = (w - o) / 2;
        u.angle -= l, c.angle += l;
      }
    }
  return e;
}
function j(t, n, e) {
  let s = null;
  for (const i of e)
    i.p1 !== n && i.p2 !== n || (!s || i.orb < s.orb) && (s = i);
  return s ? s.color : t.colors.planetsDefault;
}
const B = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII"
];
function Z(t) {
  const { svg: n } = t, e = t.options.cusps, s = e[0];
  for (let i = 0; i < 12; i++) {
    if (i === 0 || i === 6 || i === 3 || i === 9) continue;
    const u = e[i], c = A(u, s), o = a(t.cx, t.cy, c, t.aspectsRadius), l = a(t.cx, t.cy, c, t.outerRadius), r = document.createElementNS(d, "line");
    r.setAttribute("x1", o.x), r.setAttribute("y1", o.y), r.setAttribute("x2", l.x), r.setAttribute("y2", l.y), r.setAttribute("stroke", t.colors.houses), r.setAttribute("stroke-width", "1"), n.appendChild(r), X(t, c, i + 1);
  }
}
function X(t, n, e) {
  const { svg: s } = t;
  let i = n;
  e >= 2 && e <= 6 && (i -= t.chartLabelShift), e >= 8 && e <= 12 && (i += t.chartLabelShift);
  const u = t.zodiacOuterRadius * 1.13, c = a(t.cx, t.cy, i, u), o = document.createElementNS(d, "text");
  o.setAttribute("x", c.x), o.setAttribute("y", c.y), o.setAttribute("text-anchor", "middle"), o.setAttribute("dominant-baseline", "middle"), o.setAttribute("font-size", t.size * 0.02), o.setAttribute("fill", t.colors.labels), o.textContent = B[e - 1], s.appendChild(o);
}
function F(t) {
  const { svg: n } = t, e = t.cy, s = t.cx - t.outerRadius, i = t.cx + t.outerRadius, u = 2, c = t.size * 0.02, o = document.createElementNS(d, "line");
  o.setAttribute("x1", i), o.setAttribute("y1", e), o.setAttribute("x2", s), o.setAttribute("y2", e), o.setAttribute("stroke", t.colors.asc), o.setAttribute("stroke-width", u), n.appendChild(o);
  const l = document.createElementNS(d, "line"), r = document.createElementNS(d, "line");
  l.setAttribute("x1", s), l.setAttribute("y1", e), l.setAttribute("x2", s + c), l.setAttribute("y2", e - c / 2), r.setAttribute("x1", s), r.setAttribute("y1", e), r.setAttribute("x2", s + c), r.setAttribute("y2", e + c / 2), l.setAttribute("stroke", t.colors.asc), r.setAttribute("stroke", t.colors.asc), l.setAttribute("stroke-width", u), r.setAttribute("stroke-width", u), n.appendChild(l), n.appendChild(r);
  const b = document.createElementNS(d, "text");
  b.setAttribute("x", s), b.setAttribute("y", e + t.size * 0.035), b.setAttribute("text-anchor", "middle"), b.setAttribute("font-size", t.size * 0.02), b.setAttribute("fill", t.colors.labels), b.textContent = t.lang.asc, n.appendChild(b);
  const p = document.createElementNS(d, "text");
  p.setAttribute("x", i), p.setAttribute("y", e + t.size * 0.035), p.setAttribute("text-anchor", "middle"), p.setAttribute("font-size", t.size * 0.02), p.setAttribute("fill", t.colors.labels), p.textContent = t.lang.dsc, n.appendChild(p);
}
function W(t) {
  const { svg: n } = t, e = t.options.cusps, s = e[0], i = e[9], u = A(i, s), c = (u + 180) % 360, o = t.centerRadius, l = t.outerRadius, r = a(t.cx, t.cy, u, o), b = a(t.cx, t.cy, u, l), p = a(t.cx, t.cy, c, o), R = a(t.cx, t.cy, c, l), S = t.colors.mc, C = 2, E = t.size * 0.015, m = document.createElementNS(d, "circle");
  m.setAttribute("cx", b.x), m.setAttribute("cy", b.y), m.setAttribute("r", E), m.setAttribute("fill", "none"), m.setAttribute("stroke", S), m.setAttribute("stroke-width", C), n.appendChild(m);
  const f = document.createElementNS(d, "line"), z = a(t.cx, t.cy, u, l - E);
  f.setAttribute("x1", r.x), f.setAttribute("y1", r.y), f.setAttribute("x2", z.x), f.setAttribute("y2", z.y), f.setAttribute("stroke", S), f.setAttribute("stroke-width", C), n.appendChild(f);
  const x = document.createElementNS(d, "line");
  x.setAttribute("x1", p.x), x.setAttribute("y1", p.y), x.setAttribute("x2", R.x), x.setAttribute("y2", R.y), x.setAttribute("stroke", S), x.setAttribute("stroke-width", C), n.appendChild(x);
  const y = document.createElementNS(d, "text"), N = a(t.cx, t.cy, u + t.chartLabelShift * 2, l);
  y.setAttribute("x", N.x), y.setAttribute("y", N.y - t.size * 0.02), y.setAttribute("text-anchor", "middle"), y.setAttribute("font-size", t.size * 0.02), y.setAttribute("fill", t.colors.labels), y.textContent = t.lang.mc, n.appendChild(y);
  const g = document.createElementNS(d, "text"), I = a(t.cx, t.cy, c - t.chartLabelShift, l);
  g.setAttribute("x", I.x), g.setAttribute("y", I.y + t.size * 0.01), g.setAttribute("text-anchor", "middle"), g.setAttribute("font-size", t.size * 0.02), g.setAttribute("fill", t.colors.labels), g.textContent = t.lang.ic, n.appendChild(g);
}
function J(t) {
  const { svg: n } = t, e = t.aspects;
  for (const s of e) {
    const i = t.planetDots[s.p1], u = t.planetDots[s.p2], c = document.createElementNS(d, "line");
    c.setAttribute("x1", i.x), c.setAttribute("y1", i.y), c.setAttribute("x2", u.x), c.setAttribute("y2", u.y), c.setAttribute("stroke", s.color), c.setAttribute("stroke-width", "1");
    const o = document.createElementNS(d, "title");
    o.textContent = `${s.name} ${s.p1} - ${s.p2}`, c.appendChild(o), n.appendChild(c), Y(t, i, u, s);
  }
}
function Y(t, n, e, s) {
  const { svg: i } = t, u = (n.x + e.x) / 2, c = (n.y + e.y) / 2, o = document.createElementNS(d, "circle");
  o.setAttribute("cx", u), o.setAttribute("cy", c), o.setAttribute("r", t.size * 0.01), o.setAttribute("fill", t.colors.background), i.appendChild(o);
  const l = document.createElementNS(d, "text");
  l.setAttribute("x", u), l.setAttribute("y", c), l.setAttribute("fill", s.color), l.setAttribute("font-size", t.size * 0.025), l.setAttribute("text-anchor", "middle"), l.setAttribute("dominant-baseline", "middle"), l.textContent = s.symbol;
  const r = document.createElementNS(d, "title");
  r.textContent = `${s.name} ${s.p1} - ${s.p2}`, l.appendChild(r), i.appendChild(l);
}
function K(t) {
  const { svg: n } = t, e = document.createElementNS(d, "circle");
  e.setAttribute("cx", t.cx), e.setAttribute("cy", t.cy), e.setAttribute("r", t.aspectsRadius), e.setAttribute("fill", t.colors.background), n.appendChild(e);
}
function Q(t) {
  const { svg: n } = t, e = document.createElementNS(d, "circle");
  e.setAttribute("cx", t.cx), e.setAttribute("cy", t.cy), e.setAttribute("r", t.centerRadius), e.setAttribute("fill", t.colors.background), e.setAttribute("stroke", t.colors.border), e.setAttribute("stroke-width", "1"), n.appendChild(e);
}
function tt(t, n) {
  const { svg: e } = t, s = t.options.planets.Sun;
  if (!s) return;
  const i = A(s, n), u = a(t.cx, t.cy, i, t.zodiacOuterRadius * 1.1), c = document.createElementNS(d, "text");
  c.textContent = "☀", c.setAttribute("x", u.x), c.setAttribute("y", u.y), c.setAttribute("text-anchor", "middle"), c.setAttribute("dominant-baseline", "middle"), c.setAttribute("font-size", t.size * 0.08), c.setAttribute("fill", t.colors.sun);
  const o = document.createElementNS(d, "title");
  o.textContent = t.lang.planets.Sun, c.appendChild(o), e.appendChild(c);
}
const et = 0.1, st = 0.18, nt = 0.18, it = 0.08, ot = 3, lt = 1e3;
class ct {
  constructor(n, e) {
    this.container = typeof n == "string" ? document.querySelector(n) : n, this.options = e, this.colors = {
      ...v,
      ...e.colors || {}
    }, this.lang = {
      ...T,
      ...e.lang || {}
    }, this.render();
  }
  render() {
    this.size = lt, this.container.innerHTML = "", this.svg = document.createElementNS(d, "svg"), this.svg.setAttribute("width", "100%"), this.svg.setAttribute("viewBox", `0 0 ${this.size} ${this.size}`), this.svg.setAttribute("preserveAspectRatio", "xMidYMid meet"), this.container.style.aspectRatio = "1", this.container.appendChild(this.svg), this.cx = this.size / 2, this.cy = this.size / 2, this.outerRadius = this.size / 2 * 0.95, this.zodiacOuterRadius = this.outerRadius * (1 - et), this.zodiacInnerRadius = this.zodiacOuterRadius * (1 - st), this.planetOuterRadius = this.zodiacInnerRadius, this.planetInnerRadius = this.planetOuterRadius * (1 - nt), this.aspectsRadius = this.planetInnerRadius, this.planetOrbitRadius = (this.planetOuterRadius + this.planetInnerRadius) / 2, this.centerRadius = this.size / 2 * it, this.chartLabelShift = ot, this.planetDots = {};
    const n = this.options.cusps[0];
    q(this), Z(this), W(this), F(this), K(this), L(this, this.options.planets, n, "A"), this.options.planets2 && L(this, this.options.planets2, n, "B"), this.aspects = P(this.planetDots), G(this, n), D(this, n), J(this), Q(this), tt(this, n);
  }
}
export {
  ct as default
};
//# sourceMappingURL=astro-natal-chart.js.map

# AstroNatalChart

Lightweight **vanilla JavaScript SVG renderer** for drawing astrological natal charts in the browser.
No dependencies, no jQuery, and ready for **npm installation**.

The library renders a classic circular horoscope chart including:

* Zodiac ring
* Planet ring
* Houses (I–XII)
* Ascendant / Descendant axis
* MC / IC axis
* Aspect lines
* Planet symbols with collision avoidance
* Aspect-based coloring of planets
* Optional second set of planets (synastry / transit style)
* SVG output for sharp rendering at any size

---

# Features

✔ Pure **vanilla JS**
✔ **SVG rendering** (no canvas)
✔ **Responsive scaling**
✔ Planet **collision avoidance**
✔ Classical **aspect calculation**
✔ Planet **coloring by strongest aspect**
✔ Customizable **colors and labels**
✔ Works in **modern browsers without frameworks**

---

# Installation

```bash
npm install bfhp/astro-natal-chart
```

or include directly:

```html
<script type="module">
import AstroNatalChart from './AstroNatalChart.js'
</script>
```

---

# Basic Usage

```javascript
import AstroNatalChart from "astro-natal-chart"

const data = {
    cusps: [147, 166, 192, 225, 264, 299, 327, 346, 12, 45, 84, 119],

    planets: {
        Sun: 221,
        Moon: 110,
        Mercury: 244,
        Venus: 202,
        Mars: 184,
        Jupiter: 308,
        Saturn: 238,
        Uranus: 256,
        Neptune: 271,
        Pluto: 214
    }
}

new AstroNatalChart("#chart", data)
```

HTML:

```html
<div id="chart"></div>
```

---

# Data Format

## Cusps

House cusps must be provided in **absolute zodiac degrees**.

Example:

```javascript
cusps: [
  147, // I
  166, // II
  192, // III
  225, // IV
  264, // V
  299, // VI
  327, // VII
  346, // VIII
  12,  // IX
  45,  // X (MC)
  84,  // XI
  119  // XII
]
```

Ascendant is automatically taken from **house I**.

---

## Planets

Planet positions must be provided as **absolute zodiac longitude (0–360°)**.

```javascript
planets: {
  Sun: 221.5,
  Moon: 110.1,
  Mercury: 244.0,
  Venus: 202.9,
  Mars: 184.6,
  Jupiter: 308.7,
  Saturn: 238.4,
  Uranus: 256.1,
  Neptune: 271.6,
  Pluto: 214.9
}
```

Supported planets:

```
Sun
Moon
Mercury
Venus
Mars
Jupiter
Saturn
Uranus
Neptune
Pluto
```

---

# Aspects

Supported classical aspects:

| Aspect      | Angle |
| ----------- | ----- |
| Conjunction | 0°    |
| Sextile     | 60°   |
| Square      | 90°   |
| Trine       | 120°  |
| Opposition  | 180°  |

Planets are colored according to their **strongest (tightest) aspect**.

Typical colors:

```
Conjunction  — blue
Sextile      — green
Trine        — green
Square       — red
Opposition   — red
```

---

# Rendering Layers

The chart is drawn using layered SVG elements:

1. Zodiac ring
2. Planet ring
3. Aspect lines
4. Aspect mask
5. House lines
6. Asc/Dsc axis
7. MC/IC axis
8. Planet symbols
9. Sun outside the zodiac ring

---

# Customization

You can override colors and labels.

Example:

```javascript
new AstroNatalChart("#chart", data, {

  colors: {
    border: "#006600",
    asc: "#ff0000",
    mc: "#0000ff",
    text: "#222"
  },

  lang: {
    asc: "Asc",
    dsc: "Dsc",
    mc: "MC",
    ic: "IC",
    sun: "Sun"
  }

})
```

---

# Collision Avoidance

If several planets are close in longitude (stellium), the renderer automatically:

* detects overlaps
* slightly shifts planets along the orbit
* preserves planetary order

This keeps the chart readable without distorting astrological geometry.

---

# Example

```javascript
const chart = new AstroNatalChart("#chart", data)
```

Result:

* classical horoscope layout
* Asc always on the left
* MC at the correct angle
* aspects rendered in the center
* planets spaced automatically

---

# Browser Support

Works in all modern browsers supporting:

* ES modules
* SVG
* modern DOM APIs

---

# License

MIT License

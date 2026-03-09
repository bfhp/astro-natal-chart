import {SVG_NS} from "../constants/SVG_NS.js";
import {chartAngle, polar} from "../math/geometry.js";

export function drawCenterCircle(chart){

    const {svg} = chart

    const circle = document.createElementNS(SVG_NS,"circle")

    circle.setAttribute("cx",chart.cx)
    circle.setAttribute("cy",chart.cy)

    circle.setAttribute("r",chart.centerRadius)

    circle.setAttribute("fill",chart.colors.background)
    circle.setAttribute("stroke",chart.colors.border)
    circle.setAttribute("stroke-width","1")

    svg.appendChild(circle)

}

export function drawSunSymbol(chart,ascLon){

    const {svg} = chart

    const sun = chart.options.planets.Sun

    if(!sun) return

    const angle = chartAngle(sun, ascLon)

    const pos = polar(chart.cx,chart.cy,angle, chart.zodiacOuterRadius * 1.1)

    const text = document.createElementNS(SVG_NS,"text")

    text.textContent = "☀"

    text.setAttribute("x",pos.x)
    text.setAttribute("y",pos.y)

    text.setAttribute("text-anchor","middle")
    text.setAttribute("dominant-baseline","middle")

    text.setAttribute("font-size", chart.size * 0.08)

    text.setAttribute("fill",chart.colors.sun)

    const title = document.createElementNS(SVG_NS,"title")

    title.textContent = chart.lang.planets.Sun

    text.appendChild(title)

    svg.appendChild(text)

}

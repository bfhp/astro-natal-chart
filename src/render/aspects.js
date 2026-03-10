import {SVG_NS} from "../constants/SVG_NS.js";
export function drawAspects(chart){

    const {svg} = chart

    const aspects = chart.aspects

    for(const asp of aspects){

        const p1 = chart.planetDots[asp.p1]
        const p2 = chart.planetDots[asp.p2]

        const line = document.createElementNS(SVG_NS,"line")

        line.setAttribute("x1",p1.x)
        line.setAttribute("y1",p1.y)

        line.setAttribute("x2",p2.x)
        line.setAttribute("y2",p2.y)

        line.setAttribute("stroke",asp.color)
        line.setAttribute("stroke-width","1")

        const title = document.createElementNS(SVG_NS,"title")
        title.textContent = `${asp.name} ${asp.p1} - ${asp.p2}`

        line.appendChild(title)

        svg.appendChild(line)

        drawAspectSymbol(chart,p1,p2,asp)

    }
}

export function drawAspectSymbol(chart, p1, p2, aspect){

    const {svg} = chart

    const mx = (p1.x + p2.x) / 2
    const my = (p1.y + p2.y) / 2

    const bg = document.createElementNS(SVG_NS,"circle")

    bg.setAttribute("cx",mx)
    bg.setAttribute("cy",my)
    bg.setAttribute("r", chart.size * 0.01)

    bg.setAttribute("fill",chart.colors.background)

    svg.appendChild(bg)

    const text = document.createElementNS(SVG_NS,"text")

    text.setAttribute("x", mx)
    text.setAttribute("y", my)

    text.setAttribute("fill", aspect.color)
    text.setAttribute("font-size", chart.size * 0.025)

    text.setAttribute("text-anchor","middle")
    text.setAttribute("dominant-baseline","middle")

    text.textContent = aspect.symbol

    const title = document.createElementNS(SVG_NS,"title")
    const aspectName = chart.lang.aspects[aspect.name];
    const p1name = chart.lang.planets[p1.name];
    const p2name = chart.lang.planets[p2.name];

    title.textContent = `${aspectName} ${p1name} - ${p2name}`

    text.appendChild(title)

    svg.appendChild(text)

}

export function drawAspectMask(chart){

    const {svg} = chart

    const circle = document.createElementNS(SVG_NS,"circle")

    circle.setAttribute("cx",chart.cx)
    circle.setAttribute("cy",chart.cy)

    circle.setAttribute("r",chart.aspectsRadius)

    circle.setAttribute("fill",chart.colors.background)

    svg.appendChild(circle)
}
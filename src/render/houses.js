import {SVG_NS} from "../constants/SVG_NS.js";
import {polar, chartAngle} from "../math/geometry.js";

const HOUSE_ROMAN = [
    "I","II","III","IV","V","VI",
    "VII","VIII","IX","X","XI","XII"
]

export function drawHouses(chart){

    const {svg} = chart

    const cusps = chart.options.cusps
    const ascLon = cusps[0]

    for(let i=0;i<12;i++){

        // пропускаем Dsc
        if(i===0 || i===6) continue

        // пропускаем IV и X
        if(i===3 || i===9) continue

        const lon = cusps[i]

        const angle = chartAngle(lon,ascLon)

        const p1 = polar(chart.cx,chart.cy,angle,chart.aspectsRadius)
        const p2 = polar(chart.cx,chart.cy,angle,chart.outerRadius)

        const line = document.createElementNS(SVG_NS,"line")

        line.setAttribute("x1",p1.x)
        line.setAttribute("y1",p1.y)

        line.setAttribute("x2",p2.x)
        line.setAttribute("y2",p2.y)

        line.setAttribute("stroke",chart.colors.houses)
        line.setAttribute("stroke-width","1")

        svg.appendChild(line)

        drawHouseLabel(chart,angle, i+1)

    }

}

export function drawHouseLabel(chart, angle, number){

    const {svg} = chart

    let shiftedAngle = angle

    // II–VI
    if(number >= 2 && number <= 6){
        shiftedAngle -= chart.chartLabelShift
    }

    // VIII–XII
    if(number >= 8 && number <= 12){
        shiftedAngle += chart.chartLabelShift
    }

    const r = chart.zodiacOuterRadius * 1.13

    const p = polar(chart.cx,chart.cy,shiftedAngle, r)

    const text = document.createElementNS(SVG_NS,"text")

    text.setAttribute("x", p.x)
    text.setAttribute("y", p.y)

    text.setAttribute("text-anchor","middle")
    text.setAttribute("dominant-baseline","middle")

    text.setAttribute("font-size", chart.size * 0.02)
    text.setAttribute("fill", chart.colors.labels)

    text.textContent = HOUSE_ROMAN[number-1]

    svg.appendChild(text)

}

export function drawAsc(chart){

    const {svg} = chart

    const y = chart.cy

    const left = chart.cx - chart.outerRadius
    const right = chart.cx + chart.outerRadius

    const stroke = 2
    const arrow = chart.size * 0.02

    const line = document.createElementNS(SVG_NS,"line")

    line.setAttribute("x1",right)
    line.setAttribute("y1",y)

    line.setAttribute("x2",left)
    line.setAttribute("y2",y)

    line.setAttribute("stroke",chart.colors.asc)
    line.setAttribute("stroke-width",stroke)

    svg.appendChild(line)

    // стрелка Asc
    const a1 = document.createElementNS(SVG_NS,"line")
    const a2 = document.createElementNS(SVG_NS,"line")

    a1.setAttribute("x1", left)
    a1.setAttribute("y1", y)

    a1.setAttribute("x2", left + arrow)
    a1.setAttribute("y2", y - arrow/2)

    a2.setAttribute("x1", left)
    a2.setAttribute("y1", y)

    a2.setAttribute("x2", left + arrow)
    a2.setAttribute("y2", y + arrow/2)

    a1.setAttribute("stroke", chart.colors.asc)
    a2.setAttribute("stroke", chart.colors.asc)

    a1.setAttribute("stroke-width", stroke)
    a2.setAttribute("stroke-width", stroke)

    svg.appendChild(a1)
    svg.appendChild(a2)

    // подпись Asc
    const ascText = document.createElementNS(SVG_NS,"text")

    ascText.setAttribute("x", left)
    ascText.setAttribute("y", y + chart.size * 0.035)

    ascText.setAttribute("text-anchor","middle")
    ascText.setAttribute("font-size", chart.size * 0.02)

    ascText.setAttribute("fill", chart.colors.labels)

    ascText.textContent = chart.lang.asc

    svg.appendChild(ascText)

    // подпись Dsc
    const dscText = document.createElementNS(SVG_NS,"text")

    dscText.setAttribute("x", right)
    dscText.setAttribute("y", y + chart.size * 0.035)

    dscText.setAttribute("text-anchor","middle")
    dscText.setAttribute("font-size", chart.size * 0.02)

    dscText.setAttribute("fill", chart.colors.labels)

    dscText.textContent = chart.lang.dsc

    svg.appendChild(dscText)
}

export function drawMC(chart){

    const {svg} = chart

    const cusps = chart.options.cusps

    const asc = cusps[0]
    const mcLon = cusps[9]

    const mcAngle = chartAngle(mcLon,asc)
    const icAngle = (mcAngle + 180) % 360

    const inner = chart.centerRadius
    const outer = chart.outerRadius

    const p1 = polar(chart.cx,chart.cy,mcAngle, inner)
    const p2 = polar(chart.cx,chart.cy,mcAngle, outer)

    const p3 = polar(chart.cx,chart.cy,icAngle, inner)
    const p4 = polar(chart.cx,chart.cy,icAngle, outer)

    const stroke = chart.colors.mc
    const width = 2

    // MC Ring
    const ringRadius = chart.size * 0.015

    const circle = document.createElementNS(SVG_NS,"circle")

    circle.setAttribute("cx",p2.x)
    circle.setAttribute("cy",p2.y)

    circle.setAttribute("r",ringRadius)

    circle.setAttribute("fill","none")
    circle.setAttribute("stroke",stroke)
    circle.setAttribute("stroke-width",width)

    svg.appendChild(circle)

    // MC Line
    const line1 = document.createElementNS(SVG_NS,"line")

    // Adjusting MC line's position for not to cross the MC's ring
    const p2line = polar(chart.cx,chart.cy,mcAngle, outer - ringRadius)

    line1.setAttribute("x1",p1.x)
    line1.setAttribute("y1",p1.y)

    line1.setAttribute("x2",p2line.x)
    line1.setAttribute("y2",p2line.y)

    line1.setAttribute("stroke",stroke)
    line1.setAttribute("stroke-width",width)

    svg.appendChild(line1)

    // IC Line
    const line2 = document.createElementNS(SVG_NS,"line")

    line2.setAttribute("x1",p3.x)
    line2.setAttribute("y1",p3.y)

    line2.setAttribute("x2",p4.x)
    line2.setAttribute("y2",p4.y)

    line2.setAttribute("stroke",stroke)
    line2.setAttribute("stroke-width",width)

    svg.appendChild(line2)

    // MC Label
    const mcText = document.createElementNS(SVG_NS,"text")

    const p2label = polar(chart.cx,chart.cy,mcAngle + chart.chartLabelShift * 2, outer)

    mcText.setAttribute("x",p2label.x)
    mcText.setAttribute("y",p2label.y - chart.size*0.02)

    mcText.setAttribute("text-anchor","middle")
    mcText.setAttribute("font-size", chart.size * 0.02)

    mcText.setAttribute("fill", chart.colors.labels)

    mcText.textContent = chart.lang.mc

    svg.appendChild(mcText)

    // IC Label
    const icText = document.createElementNS(SVG_NS,"text")

    const p4label = polar(chart.cx,chart.cy,icAngle - chart.chartLabelShift, outer)

    icText.setAttribute("x",p4label.x)
    icText.setAttribute("y",p4label.y + chart.size * 0.01)

    icText.setAttribute("text-anchor","middle")
    icText.setAttribute("font-size", chart.size * 0.02)

    icText.setAttribute("fill", chart.colors.labels)

    icText.textContent = chart.lang.ic

    svg.appendChild(icText)

}
import {ZODIAC} from "../constants/zodiac.js"
import {SVG_NS} from "../constants/SVG_NS.js";
import {polar, chartAngle} from "../math/geometry.js";

export function drawZodiacSymbol(chart,index,lon,ascLon){

    const {svg} = chart

    const angle = chartAngle(lon,ascLon)

    const pos = polar(
        chart.cx,
        chart.cy,
        angle,
        (chart.zodiacOuterRadius + chart.zodiacInnerRadius)/2
    )

    const text = document.createElementNS(SVG_NS,"text")

    text.textContent = ZODIAC[index].symbol

    text.setAttribute("x",pos.x)
    text.setAttribute("y",pos.y)

    text.setAttribute("text-anchor","middle")
    text.setAttribute("dominant-baseline","middle")

    text.setAttribute("font-size",chart.size*0.04)

    const title = document.createElementNS(SVG_NS,"title")
    title.textContent = chart.lang.zodiac[ZODIAC[index].name]

    text.appendChild(title)

    svg.appendChild(text)

}

export function drawZodiacRing(chart, ascLon){

    const {svg} = chart

    for(let i=0;i<12;i++){

        const startLon = i*30
        const endLon = (i+1)*30

        const start = chartAngle(startLon,ascLon)
        const end = chartAngle(endLon,ascLon)

        const path = document.createElementNS(SVG_NS,"path")

        path.setAttribute(
            "d",
            arcPath(chart.cx,chart.cy,start,end,chart.zodiacOuterRadius,chart.zodiacInnerRadius)
        )

        path.setAttribute("fill",chart.colors.zodiac[i])
        path.setAttribute("stroke",chart.colors.border)

        svg.appendChild(path)

        drawZodiacSymbol(chart,i,startLon+15,ascLon)

    }

}

function arcPath(cx,cy,start,end,r1,r2){

    const p1 = polar(cx,cy,start,r1)
    const p2 = polar(cx,cy,end,r1)
    const p3 = polar(cx,cy,end,r2)
    const p4 = polar(cx,cy,start,r2)

    return `
M ${p1.x} ${p1.y}
A ${r1} ${r1} 0 0 0 ${p2.x} ${p2.y}
L ${p3.x} ${p3.y}
A ${r2} ${r2} 0 0 1 ${p4.x} ${p4.y}
Z
`

}
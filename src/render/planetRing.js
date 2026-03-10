import {SVG_NS} from "../constants/SVG_NS.js";
import {chartAngle, polar} from "../math/geometry.js";
import {PLANET_SYMBOL} from "../constants/planets.js";

const PLANET_MIN_SEPARATION = 4 // degree
const PLANET_RELAX_ITER = 10

export function drawPlanetRing(chart) {

    const {svg} = chart

    const bg = document.createElementNS(SVG_NS,"circle")

    bg.setAttribute("cx",chart.cx)
    bg.setAttribute("cy",chart.cy)
    bg.setAttribute("r",chart.planetOuterRadius)

    bg.setAttribute("fill",chart.colors.planetRing)
    bg.setAttribute("stroke",chart.colors.border)

    svg.appendChild(bg)

    const ring = document.createElementNS(SVG_NS,"circle")

    ring.setAttribute("cx",chart.cx)
    ring.setAttribute("cy",chart.cy)
    ring.setAttribute("r",chart.planetInnerRadius)

    ring.setAttribute("fill","none")
    ring.setAttribute("stroke",chart.colors.border)

    svg.appendChild(ring)
}

export function drawPlanets(chart, planets, ascLon, group="A"){

    const {svg} = chart

    for(const name in planets){

        const lon = planets[name]

        const angle = chartAngle(lon,ascLon)

        const dotPos = polar(chart.cx,chart.cy,angle,chart.planetInnerRadius)

        const dot = document.createElementNS(SVG_NS,"circle")

        dot.setAttribute("cx",dotPos.x)
        dot.setAttribute("cy",dotPos.y)

        dot.setAttribute("r", group === "A" ? 2 : 2.5)

        dot.setAttribute("fill",chart.colors.background)
        dot.setAttribute("stroke",chart.colors.border)

        svg.appendChild(dot)

        chart.planetDots[name+"_"+group] = {
            name,
            group,
            x: dotPos.x,
            y: dotPos.y,
            lon
        }

    }
}

export function drawPlanetSymbols(chart, ascLon){

    const {svg} = chart

    const positions = resolvePlanetCollisions(chart.planetDots,ascLon)

    for(const p of positions){

        const name = p.name
        const angle = p.angle

        const symbolPos = polar(chart.cx,chart.cy,angle,chart.planetOrbitRadius)

        const text = document.createElementNS(SVG_NS,"text")

        const color = getPlanetColor(chart,name,chart.aspects)

        text.textContent = PLANET_SYMBOL[p.planet]

        text.setAttribute("x",symbolPos.x)
        text.setAttribute("y",symbolPos.y)

        text.setAttribute("text-anchor","middle")
        text.setAttribute("dominant-baseline","middle")

        text.setAttribute("fill",color)

        text.setAttribute("font-size",chart.size * 0.04)

        text.setAttribute("text-decoration", p.group === "A" ? "" : "underline")

        const title = document.createElementNS(SVG_NS,"title")

        title.textContent = chart.lang.planets[p.planet]

        text.appendChild(title)

        svg.appendChild(text)

    }
}

export function resolvePlanetCollisions(planetDots, ascLon){

    const list = Object.entries(planetDots).map(([key,p]) => ({
        name:key,
        group:p.group,
        planet:p.name,
        angle:chartAngle(p.lon,ascLon)
    }))

    list.sort((a,b)=>a.angle-b.angle)

    for(let k=0;k<PLANET_RELAX_ITER;k++){

        for(let i=0;i<list.length-1;i++){

            const a=list[i]
            const b=list[i+1]

            let diff=b.angle-a.angle

            if(diff < PLANET_MIN_SEPARATION){

                const shift=(PLANET_MIN_SEPARATION-diff)/2

                a.angle-=shift
                b.angle+=shift

            }

        }

    }

    return list
}


export function getPlanetColor(chart,planet, aspects){

    let best = null

    for(const asp of aspects){

        if(asp.p1 !== planet && asp.p2 !== planet) continue

        if(!best || asp.orb < best.orb){
            best = asp
        }

    }

    if(!best) return chart.colors.planetsDefault

    return best.color
}

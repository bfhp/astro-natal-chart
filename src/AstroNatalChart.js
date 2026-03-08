const SVG_NS = "http://www.w3.org/2000/svg"

const ZODIAC = [
    {name:"Aries",symbol:"♈"},
    {name:"Taurus",symbol:"♉"},
    {name:"Gemini",symbol:"♊"},
    {name:"Cancer",symbol:"♋"},
    {name:"Leo",symbol:"♌"},
    {name:"Virgo",symbol:"♍"},
    {name:"Libra",symbol:"♎"},
    {name:"Scorpio",symbol:"♏"},
    {name:"Sagittarius",symbol:"♐"},
    {name:"Capricorn",symbol:"♑"},
    {name:"Aquarius",symbol:"♒"},
    {name:"Pisces",symbol:"♓"}
]

const PLANET_SYMBOL = {
    Sun:"☉",
    Moon:"☽",
    Mercury:"☿",
    Venus:"♀",
    Mars:"♂",
    Jupiter:"♃",
    Saturn:"♄",
    Uranus:"♅",
    Neptune:"♆",
    Pluto:"♇"
}

const HOUSE_ROMAN = [
    "I","II","III","IV","V","VI",
    "VII","VIII","IX","X","XI","XII"
]

const ASPECTS = [
    {name:"conjunction", angle:0,   orb:8, color:"#2c3e50", symbol:"☌"},
    {name:"sextile",     angle:60,  orb:6, color:"#2ecc71", symbol:"✶"},
    {name:"square",      angle:90,  orb:6, color:"#e74c3c", symbol:"□"},
    {name:"trine",       angle:120, orb:6, color:"#2ecc71", symbol:"△"},
    {name:"opposition",  angle:180, orb:8, color:"#e74c3c", symbol:"☍"}
]

const DEFAULT_COLORS = {
    border: "#008000",
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
        "#fdbedd",
    ]
}

const OUTER_FIELD_WIDTH = 0.10
const ZODIAC_RING_WIDTH = 0.18
const PLANET_RING_WIDTH = 0.18
const CENTER_CIRCLE_WIDTH = 0.08
const PLANET_RING_COLOR = "#e6f4ff"
const BORDER_COLOR = "#008000"
const HOUSE_LABEL_SHIFT = 3 // градусов
const PLANET_MIN_SEPARATION = 4 // градусов
const PLANET_RELAX_ITER = 10

export default class AstroNatalChart {

    constructor(container, options){

        this.container =
            typeof container === "string"
                ? document.querySelector(container)
                : container

        this.options = options
        this.size = options.size || 600

        this.colors = {
            ...DEFAULT_COLORS,
            ...(options.colors || {})
        }

        this.render()

    }

    render(){

        this.container.innerHTML = ""

        this.svg = document.createElementNS(SVG_NS,"svg")

        this.svg.setAttribute("width",this.size)
        this.svg.setAttribute("height",this.size)
        this.svg.setAttribute("viewBox",`0 0 ${this.size} ${this.size}`)

        this.container.appendChild(this.svg)

        this.cx = this.size/2
        this.cy = this.size/2

        this.outerRadius = this.size/2 * 0.95
        this.zodiacOuterRadius = this.outerRadius * (1 - OUTER_FIELD_WIDTH)
        this.zodiacInnerRadius = this.zodiacOuterRadius * (1 - ZODIAC_RING_WIDTH)

        // кольцо планет
        this.planetOuterRadius = this.zodiacInnerRadius
        this.planetInnerRadius = this.planetOuterRadius * (1 - PLANET_RING_WIDTH)

        // круг аспектов
        this.aspectsRadius = this.planetInnerRadius

        // орбита планет
        this.planetOrbitRadius =
            (this.planetOuterRadius + this.planetInnerRadius) / 2

        // центральный круг
        this.centerRadius = this.size/2 * (CENTER_CIRCLE_WIDTH)

        const ascLon = this.options.cusps[0]

        this.drawPlanetRing()

        this.drawHouses(this.options.cusps)

        this.drawMC(this.options.cusps)

        this.drawAsc()

        this.drawAspectMask()

        this.planetDots = {}

        this.drawPlanets(this.options.planets, ascLon, "A")

        if(this.options.planets2){
            this.drawPlanets(this.options.planets2, ascLon, "B")
        }

        this.aspects = this.computeAspects(this.planetDots)

        this.drawPlanetSymbols(ascLon)

        this.drawZodiacRing(ascLon)

        this.drawAspects()

        this.drawCenterCircle()

        this.drawSunSymbol(ascLon)

    }

    polar(angle,r){

        const rad = angle * Math.PI / 180

        return {
            x: this.cx + r * Math.cos(rad),
            y: this.cy + r * Math.sin(rad)
        }

    }

    arcPath(start,end,r1,r2){

        const p1 = this.polar(start,r1)
        const p2 = this.polar(end,r1)
        const p3 = this.polar(end,r2)
        const p4 = this.polar(start,r2)

        return `
M ${p1.x} ${p1.y}
A ${r1} ${r1} 0 0 0 ${p2.x} ${p2.y}
L ${p3.x} ${p3.y}
A ${r2} ${r2} 0 0 1 ${p4.x} ${p4.y}
Z
`

    }

    drawZodiacRing(ascLon){

        for(let i=0;i<12;i++){

            const startLon = i * 30
            const endLon = (i + 1) * 30

            const start = this.chartAngle(startLon, ascLon)
            const end = this.chartAngle(endLon, ascLon)

            const path = document.createElementNS(SVG_NS,"path")

            path.setAttribute(
                "d",
                this.arcPath(start,end,this.zodiacOuterRadius,this.zodiacInnerRadius)
            )

            path.setAttribute("fill",this.colors.zodiac[i])
            path.setAttribute("stroke",this.colors.border)

            this.svg.appendChild(path)

            this.drawZodiacSymbol(i,startLon + 15, ascLon)

        }
    }

    drawZodiacSymbol(index,lon,ascLon){

        const angle = this.chartAngle(lon,ascLon)

        const pos = this.polar(
            angle,
            (this.zodiacOuterRadius + this.zodiacInnerRadius)/2
        )

        const text = document.createElementNS(SVG_NS,"text")

        text.textContent = ZODIAC[index].symbol

        text.setAttribute("x",pos.x)
        text.setAttribute("y",pos.y)

        text.setAttribute("text-anchor","middle")
        text.setAttribute("dominant-baseline","middle")

        text.setAttribute("font-size",this.size*0.04)

        const title = document.createElementNS(SVG_NS,"title")
        title.textContent = ZODIAC[index].name

        text.appendChild(title)

        this.svg.appendChild(text)

    }

    drawPlanetRing() {

        const bg = document.createElementNS(SVG_NS,"circle")

        bg.setAttribute("cx",this.cx)
        bg.setAttribute("cy",this.cy)
        bg.setAttribute("r",this.planetOuterRadius)

        bg.setAttribute("fill",PLANET_RING_COLOR)
        bg.setAttribute("stroke",BORDER_COLOR)

        this.svg.appendChild(bg)

        const ring = document.createElementNS(SVG_NS,"circle")

        ring.setAttribute("cx",this.cx)
        ring.setAttribute("cy",this.cy)
        ring.setAttribute("r",this.planetInnerRadius)

        ring.setAttribute("fill","none")
        ring.setAttribute("stroke",BORDER_COLOR)

        this.svg.appendChild(ring)

    }

    drawPlanets(planets, ascLon, group="A"){

        for(const name in planets){

            const lon = planets[name]

            const angle = this.chartAngle(lon,ascLon)

            const dotPos = this.polar(angle,this.planetInnerRadius)

            const dot = document.createElementNS(SVG_NS,"circle")

            dot.setAttribute("cx",dotPos.x)
            dot.setAttribute("cy",dotPos.y)

            dot.setAttribute("r", group === "A" ? 2 : 2.5)

            dot.setAttribute("fill","white")
            dot.setAttribute("stroke",BORDER_COLOR)

            this.svg.appendChild(dot)

            this.planetDots[name+"_"+group] = {
                name,
                group,
                x: dotPos.x,
                y: dotPos.y,
                lon
            }

        }
    }
    drawPlanetSymbols(ascLon){

        const positions = this.resolvePlanetCollisions(ascLon)

        for(const p of positions){

            const name = p.name
            const angle = p.angle

            const symbolPos = this.polar(angle,this.planetOrbitRadius)

            const text = document.createElementNS(SVG_NS,"text")

            const color = this.getPlanetColor(name,this.aspects)

            text.textContent = PLANET_SYMBOL[p.planet]

            text.setAttribute("x",symbolPos.x)
            text.setAttribute("y",symbolPos.y)

            text.setAttribute("text-anchor","middle")
            text.setAttribute("dominant-baseline","middle")

            text.setAttribute("fill",color)

            text.setAttribute("font-size",this.size * 0.04)

            const title = document.createElementNS(SVG_NS,"title")

            title.textContent = p.planet

            text.appendChild(title)

            this.svg.appendChild(text)

        }
    }

    getPlanetColor(planet, aspects){

        let best = null

        for(const asp of aspects){

            if(asp.p1 !== planet && asp.p2 !== planet) continue

            if(!best || asp.orb < best.orb){
                best = asp
            }

        }

        if(!best) return this.colors.planetsDefault

        return best.color
    }

    resolvePlanetCollisions(ascLon){

        const list = Object.entries(this.planetDots).map(([key,p]) => ({
            name:key,
            planet:p.name,
            angle:this.chartAngle(p.lon,ascLon)
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

    chartAngle(lon, asc){

        let angle = asc - lon + 180

        return (angle + 360) % 360

    }

    drawHouses(cusps){

        const ascLon = cusps[0]

        for(let i=0;i<12;i++){

            // пропускаем Dsc
            if(i===0 || i===6) continue

            // пропускаем IV и X
            if(i===3 || i===9) continue

            const lon = cusps[i]

            const angle = this.chartAngle(lon,ascLon)

            const p1 = this.polar(angle,this.aspectsRadius)
            const p2 = this.polar(angle,this.outerRadius)

            const line = document.createElementNS(SVG_NS,"line")

            line.setAttribute("x1",p1.x)
            line.setAttribute("y1",p1.y)

            line.setAttribute("x2",p2.x)
            line.setAttribute("y2",p2.y)

            line.setAttribute("stroke","#ff0000")
            line.setAttribute("stroke-width","1")

            this.svg.appendChild(line)

            this.drawHouseLabel(angle, i+1)

        }

    }

    drawHouseLabel(angle, number){

        let shiftedAngle = angle

        // II–VI
        if(number >= 2 && number <= 6){
            shiftedAngle -= HOUSE_LABEL_SHIFT
        }

        // VIII–XII
        if(number >= 8 && number <= 12){
            shiftedAngle += HOUSE_LABEL_SHIFT
        }

        const r = this.zodiacOuterRadius * 1.13

        const p = this.polar(shiftedAngle, r)

        const text = document.createElementNS(SVG_NS,"text")

        text.setAttribute("x", p.x)
        text.setAttribute("y", p.y)

        text.setAttribute("text-anchor","middle")
        text.setAttribute("dominant-baseline","middle")

        text.setAttribute("font-size", this.size * 0.02)
        text.setAttribute("fill", this.colors.text)

        text.textContent = HOUSE_ROMAN[number-1]

        this.svg.appendChild(text)

    }

    drawAsc(){

        const y = this.cy

        const left = this.cx - this.outerRadius
        const right = this.cx + this.outerRadius

        const stroke = 2
        const arrow = this.size * 0.02

        const line = document.createElementNS(SVG_NS,"line")

        line.setAttribute("x1",right)
        line.setAttribute("y1",y)

        line.setAttribute("x2",left)
        line.setAttribute("y2",y)

        line.setAttribute("stroke",this.colors.asc || "red")
        line.setAttribute("stroke-width",stroke)

        this.svg.appendChild(line)

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

        a1.setAttribute("stroke", this.colors.asc || "red")
        a2.setAttribute("stroke", this.colors.asc || "red")

        a1.setAttribute("stroke-width", stroke)
        a2.setAttribute("stroke-width", stroke)

        this.svg.appendChild(a1)
        this.svg.appendChild(a2)

        // подпись Asc
        const ascText = document.createElementNS(SVG_NS,"text")

        ascText.setAttribute("x", left)
        ascText.setAttribute("y", y + this.size * 0.035)

        ascText.setAttribute("text-anchor","middle")
        ascText.setAttribute("font-size", this.size * 0.02)

        ascText.setAttribute("fill", this.colors.labels)

        ascText.textContent = "Asc"

        this.svg.appendChild(ascText)

        // подпись Dsc
        const dscText = document.createElementNS(SVG_NS,"text")

        dscText.setAttribute("x", right)
        dscText.setAttribute("y", y + this.size * 0.035)

        dscText.setAttribute("text-anchor","middle")
        dscText.setAttribute("font-size", this.size * 0.02)

        dscText.setAttribute("fill", this.colors.labels)

        dscText.textContent = "Dsc"

        this.svg.appendChild(dscText)
    }

    drawMC(cusps){

        const asc = cusps[0]
        const mcLon = cusps[9]

        const mcAngle = this.chartAngle(mcLon,asc)
        const icAngle = (mcAngle + 180) % 360

        const inner = this.centerRadius
        const outer = this.outerRadius

        const p1 = this.polar(mcAngle, inner)
        const p2 = this.polar(mcAngle, outer)

        const p3 = this.polar(icAngle, inner)
        const p4 = this.polar(icAngle, outer)

        const stroke = this.colors.mc || "#0066cc"
        const width = 2

        // линия MC
        const line1 = document.createElementNS(SVG_NS,"line")

        line1.setAttribute("x1",p1.x)
        line1.setAttribute("y1",p1.y)

        line1.setAttribute("x2",p2.x)
        line1.setAttribute("y2",p2.y)

        line1.setAttribute("stroke",stroke)
        line1.setAttribute("stroke-width",width)

        this.svg.appendChild(line1)

        // линия IC
        const line2 = document.createElementNS(SVG_NS,"line")

        line2.setAttribute("x1",p3.x)
        line2.setAttribute("y1",p3.y)

        line2.setAttribute("x2",p4.x)
        line2.setAttribute("y2",p4.y)

        line2.setAttribute("stroke",stroke)
        line2.setAttribute("stroke-width",width)

        this.svg.appendChild(line2)

        // кольцо MC
        const r = this.size * 0.015

        const circle = document.createElementNS(SVG_NS,"circle")

        circle.setAttribute("cx",p2.x)
        circle.setAttribute("cy",p2.y)

        circle.setAttribute("r",r)

        circle.setAttribute("fill","white")
        circle.setAttribute("stroke",stroke)
        circle.setAttribute("stroke-width",width)

        this.svg.appendChild(circle)


        // подпись MC
        const mcText = document.createElementNS(SVG_NS,"text")

        const p2label = this.polar(mcAngle + HOUSE_LABEL_SHIFT * 2, outer)

        mcText.setAttribute("x",p2label.x)
        mcText.setAttribute("y",p2label.y - this.size*0.02)

        mcText.setAttribute("text-anchor","middle")
        mcText.setAttribute("font-size", this.size * 0.02)

        mcText.setAttribute("fill", this.colors.labels)

        mcText.textContent = "MC"

        this.svg.appendChild(mcText)

        // подпись IC
        const icText = document.createElementNS(SVG_NS,"text")

        const p4label = this.polar(icAngle - HOUSE_LABEL_SHIFT, outer)

        icText.setAttribute("x",p4label.x)
        icText.setAttribute("y",p4label.y + this.size * 0.01)

        icText.setAttribute("text-anchor","middle")
        icText.setAttribute("font-size", this.size * 0.02)

        icText.setAttribute("fill", this.colors.labels)

        icText.textContent = "IC"

        this.svg.appendChild(icText)

    }

    angleDiff(a,b){

        let d = Math.abs(a-b)

        if(d > 180) d = 360 - d

        return d

    }

    getAspect(a,b){

        const diff = this.angleDiff(a,b)

        for(const asp of ASPECTS){

            if(Math.abs(diff - asp.angle) <= asp.orb){
                return {...asp, diff}
            }

        }

        return null

    }

    computeAspects(planets){

        const aspects = []

        const list = Object.values(planets)

        const hasSecondSet = list.some(p => p.group === "B")

        for(let i=0;i<list.length;i++){

            for(let j=i+1;j<list.length;j++){

                const a = list[i]
                const b = list[j]

                // если есть второй набор — аспекты только между группами
                if(hasSecondSet && a.group === b.group) continue

                const asp = this.getAspect(a.lon,b.lon)

                if(asp){

                    aspects.push({
                        p1: a.name + "_" + a.group,
                        p2: b.name + "_" + b.group,
                        ...asp
                    })

                }

            }

        }

        return aspects
    }

    drawAspects(){

        const aspects = this.aspects

        for(const asp of aspects){

            const p1 = this.planetDots[asp.p1]
            const p2 = this.planetDots[asp.p2]

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

            this.svg.appendChild(line)

            this.drawAspectSymbol(p1,p2,asp)

        }
    }

    drawAspectSymbol(p1, p2, aspect){

        const mx = (p1.x + p2.x) / 2
        const my = (p1.y + p2.y) / 2

        const bg = document.createElementNS(SVG_NS,"circle")

        bg.setAttribute("cx",mx)
        bg.setAttribute("cy",my)
        bg.setAttribute("r", this.size * 0.01)

        bg.setAttribute("fill","white")

        this.svg.appendChild(bg)

        const text = document.createElementNS(SVG_NS,"text")

        text.setAttribute("x", mx)
        text.setAttribute("y", my)

        text.setAttribute("fill", aspect.color)
        text.setAttribute("font-size", this.size * 0.025)

        text.setAttribute("text-anchor","middle")
        text.setAttribute("dominant-baseline","middle")

        text.textContent = aspect.symbol

        const title = document.createElementNS(SVG_NS,"title")
        title.textContent = `${aspect.name} ${aspect.p1} - ${aspect.p2}`

        text.appendChild(title)

        this.svg.appendChild(text)

    }

    drawAspectMask(){

        const circle = document.createElementNS(SVG_NS,"circle")

        circle.setAttribute("cx",this.cx)
        circle.setAttribute("cy",this.cy)

        circle.setAttribute("r",this.aspectsRadius)

        circle.setAttribute("fill","white")

        this.svg.appendChild(circle)

    }

    drawCenterCircle(){

        const circle = document.createElementNS(SVG_NS,"circle")

        circle.setAttribute("cx",this.cx)
        circle.setAttribute("cy",this.cy)

        circle.setAttribute("r",this.centerRadius)

        circle.setAttribute("fill","white")
        circle.setAttribute("stroke",this.colors.border)
        circle.setAttribute("stroke-width","1")

        this.svg.appendChild(circle)

    }

    drawSunSymbol(ascLon){

        const sun = this.options.planets.Sun

        if(!sun) return

        const angle = this.chartAngle(sun, ascLon)

        const pos = this.polar(angle, this.zodiacOuterRadius * 1.1)

        const text = document.createElementNS(SVG_NS,"text")

        text.textContent = "☀"

        text.setAttribute("x",pos.x)
        text.setAttribute("y",pos.y)

        text.setAttribute("text-anchor","middle")
        text.setAttribute("dominant-baseline","middle")

        text.setAttribute("font-size", this.size * 0.08)

        text.setAttribute("fill","#f1c40f")

        const title = document.createElementNS(SVG_NS,"title")

        title.textContent = "Sun"

        text.appendChild(title)

        this.svg.appendChild(text)

    }

}
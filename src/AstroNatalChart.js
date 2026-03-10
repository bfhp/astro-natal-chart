
import {DEFAULT_COLORS, DEFAULT_LANG} from "./constants/defaults.js"
import {SVG_NS} from "./constants/SVG_NS.js";

import {computeAspects} from "./math/aspects.js"
import {drawZodiacRing} from "./render/zodiacRing.js"
import {drawPlanetRing,drawPlanets,drawPlanetSymbols} from "./render/planetRing.js"
import {drawHouses,drawAsc,drawMC} from "./render/houses.js";
import {drawAspects, drawAspectMask} from "./render/aspects.js";
import {drawSunSymbol,drawCenterCircle} from "./render/chart.js";

const OUTER_FIELD_WIDTH = 0.10
const ZODIAC_RING_WIDTH = 0.18
const PLANET_RING_WIDTH = 0.18
const CENTER_CIRCLE_WIDTH = 0.08
const CHART_LABEL_SHIFT = 3 // degree
const BASE_SIZE = 1000

export default class AstroNatalChart {

    constructor(container, options){

        this.container =
            typeof container === "string"
                ? document.querySelector(container)
                : container

        this.options = options

        this.colors = {
            ...DEFAULT_COLORS,
            ...(options.colors || {})
        }

        this.lang = {
            ...DEFAULT_LANG,
            ...(options.lang || {})
        }

        this.render()

    }

    render(){

        // Virtual render size is 1000
        this.size = BASE_SIZE

        this.container.innerHTML = ""

        this.svg = document.createElementNS(SVG_NS,"svg")

        this.svg.setAttribute("width","100%")
        this.svg.setAttribute("viewBox",`0 0 ${this.size} ${this.size}`)
        this.svg.setAttribute("preserveAspectRatio","xMidYMid meet")

        this.container.style.aspectRatio = "1"

        this.container.appendChild(this.svg)

        this.cx = this.size/2
        this.cy = this.size/2

        this.outerRadius = this.size/2 * 0.95
        this.zodiacOuterRadius = this.outerRadius * (1 - OUTER_FIELD_WIDTH)
        this.zodiacInnerRadius = this.zodiacOuterRadius * (1 - ZODIAC_RING_WIDTH)

        // Planets ring
        this.planetOuterRadius = this.zodiacInnerRadius
        this.planetInnerRadius = this.planetOuterRadius * (1 - PLANET_RING_WIDTH)

        // Aspects circle
        this.aspectsRadius = this.planetInnerRadius

        // Planet symbols orbit
        this.planetOrbitRadius =
            (this.planetOuterRadius + this.planetInnerRadius) / 2

        // Central circle
        this.centerRadius = this.size/2 * (CENTER_CIRCLE_WIDTH)

        this.chartLabelShift = CHART_LABEL_SHIFT;

        this.planetDots = {}

        const ascLon = this.options.cusps[0]

        drawPlanetRing(this)

        drawHouses(this)

        drawMC(this)

        drawAsc(this)

        drawAspectMask(this)

        drawPlanets(this,this.options.planets,ascLon,"A")

        if(this.options.planets2){
            drawPlanets(this,this.options.planets2,ascLon,"B")
        }

        this.aspects = computeAspects(this.planetDots)

        drawPlanetSymbols(this,ascLon)

        drawZodiacRing(this,ascLon)

        drawAspects(this)

        drawCenterCircle(this)

        drawSunSymbol(this,ascLon)

    }
}
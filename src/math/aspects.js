import {ASPECTS} from "../constants/aspects.js"

export function angleDiff(a,b){

    let d = Math.abs(a-b)

    if(d > 180) d = 360 - d

    return d

}
export function getAspect(a,b){

    const diff = angleDiff(a,b)

    for(const asp of ASPECTS){

        if(Math.abs(diff - asp.angle) <= asp.orb){
            return {...asp, diff}
        }

    }

    return null

}

export function computeAspects(planets){

    const aspects = []

    const list = Object.values(planets)

    const hasSecondSet = list.some(p => p.group === "B")

    for(let i=0;i<list.length;i++){

        for(let j=i+1;j<list.length;j++){

            const a = list[i]
            const b = list[j]

            // if there is a second set - aspects only between groups
            if(hasSecondSet && a.group === b.group) continue

            const asp = getAspect(a.lon,b.lon)

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
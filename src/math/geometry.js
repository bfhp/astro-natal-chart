export function polar(cx,cy,angle,r){

    const rad = angle * Math.PI / 180

    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad)
    }

}

export function chartAngle(lon, ascLon){

    let angle = ascLon - lon + 180

    return (angle + 360) % 360

}
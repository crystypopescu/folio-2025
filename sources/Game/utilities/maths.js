function clamp(input, min, max)
{
    return Math.max(min, Math.min(input, max))
}

function remap(input, inLow, inHigh, outLow, outHigh)
{
    return ((input - inLow) * (outHigh - outLow)) / (inHigh - inLow) + outLow
}

function remapClamp(input, inLow, inHigh, outLow, outHigh)
{
    return clamp(((input - inLow) * (outHigh - outLow)) / (inHigh - inLow) + outLow, outLow < outHigh ? outLow : outHigh, outLow > outHigh ? outLow : outHigh)
}

function lerp(start, end, ratio)
{
    return (1 - ratio) * start + ratio * end
}

function smoothstep(value, min, max)
{
    const x = clamp((value - min) / (max - min), 0, 1)
    return x * x * (3 - 2 * x)
}

function safeMod(n, m)
{
    return ((n % m) + m) % m
}

function signedModDelta(a, b, mod)
{
    let delta = (b - a + mod) % mod
    if(delta > mod / 2)
        delta -= mod
    return delta
}

function segmentCircleIntersection(x1, y1, x2, y2, cx, cy, r)
{
    const dx = x2 - x1
    const dy = y2 - y1

    const fx = x1 - cx
    const fy = y1 - cy

    const a = dx * dx + dy * dy
    const b = 2 * (fx * dx + fy * dy)
    const c = fx * fx + fy * fy - r * r

    const discriminant = b * b - 4 * a * c
    if (discriminant < 0)
    {
        return [] // No intersection
    }

    const intersections = []
    const sqrtD = Math.sqrt(discriminant)

    const t1 = (-b - sqrtD) / (2 * a)
    const t2 = (-b + sqrtD) / (2 * a)

    if(t1 >= 0 && t1 <= 1)
    {
        intersections.push({ 
            x: x1 + t1 * dx, 
            y: y1 + t1 * dy 
        })
    }

    if(t2 >= 0 && t2 <= 1 && discriminant !== 0)
    {
        intersections.push({ 
            x: x1 + t2 * dx, 
            y: y1 + t2 * dy 
        })
    }

    return intersections
}

const TAU = 2 * Math.PI
var mod = function (a, n) { return ( a % n + n ) % n; } // modulo

var equivalent = function (a) { return mod(a + Math.PI, TAU) - Math.PI } // [-π, +π]

function smallestAngle(current, target)
{
    return equivalent(target - current);
}

export { clamp, remap, remapClamp, lerp, smoothstep, safeMod, signedModDelta, smallestAngle, segmentCircleIntersection }

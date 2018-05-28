import React from 'react'

export function Handle({
    handle: { id, value, percent },
    getHandleProps,
}) {
    return (
        <div
            style={{
                left: `${percent}%`,
                position: 'absolute',
                marginLeft: -10,
                marginTop: 28,
                zIndex: 2,
                width: 20,
                height: 20,
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: '50%',
                backgroundColor: 'black',
            }}
            {...getHandleProps(id)} // pass in the id
        >
            <div style={{ fontSize: 11, marginTop: -20 }}>
                {value}
            </div>
        </div>
    )
}

export function Track({ source, target, getTrackProps }) {
    return (
        <div style={{
            position: 'absolute',
            height: 8,
            zIndex: 1,
            marginTop: 35,
            backgroundColor: 'black',
            borderRadius: 5,
            cursor: 'pointer',
            left: `${source.percent}%`,
            width: `${target.percent - source.percent}%`,
        }} {...getTrackProps()} />
    )
}

export function Tick({ tick, count }) {
    return (
        <div>
            <div style={{
                position: 'absolute',
                marginTop: 52,
                marginLeft: -0.5,
                width: 1,
                height: 8,
                backgroundColor: 'black',
                left: `${tick.percent}%`,
            }} />
            <div style={{
                position: 'absolute',
                marginTop: 60,
                fontSize: 8,
                textAlign: 'center',
                marginLeft: `${-(100 / count) / 2}%`,
                width: `${100 / count}%`,
                left: `${tick.percent}%`,
            }} >
                {tick.value}
            </div>
        </div>
    )
}

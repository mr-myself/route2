import React from 'react'
import {
      SortableContainer,
      SortableElement,
      SortableHandle,
      arrayMove,
} from 'react-sortable-hoc';
import closeBtn from 'packs/images/close-btn'

const SortableItem = SortableElement(({value, removeSpot, previousValue, waypointsInfo, itemIndex}) => {
    let sum = 0
    waypointsInfo && waypointsInfo.forEach((waypoint, index) => {
        if (index <= itemIndex) {
            sum = sum + (waypoint['distance']['value']/1000)
        }
    })

    return (
        <div className='sorting-element'>
            <li>
                <img src={value.photo_url} className='spot-icon' />
                <span className='sortable-title'>{value.title}</span>
                <div className="remove-spot">
                    <img src={closeBtn} className='remove-spot-icon' onClick={() => removeSpot(value.id)} />
                </div>
            </li>

            <div className='element-analytics'>
                {!previousValue && waypointsInfo &&
                    <div>
                        <span className='distance-from'>出発地点からの距離{sum.toFixed(1)}km</span>
                        <span className='sum-distance'>| 累計{sum.toFixed(1)}km</span>
                    </div>
                }
                {previousValue && waypointsInfo &&
                    <div>
                        <span className='distance-from'>{previousValue.title}からの距離{waypointsInfo[itemIndex]['distance']['text']}</span>
                        <span className='sum-distance'>| 累計{sum.toFixed(1)}km</span>
                    </div>
                }
            </div>
        </div>
    )
});

export const SortableList = SortableContainer(({items, removeSpot, waypointsInfo}) => {
    return (
        <ul>
            {items.map((value, index) => (
                <SortableItem
                    key={'item-'+value.id}
                    index={index}
                    value={value}
                    removeSpot={removeSpot}
                    previousValue={items[index-1]}
                    waypointsInfo={waypointsInfo}
                    itemIndex={index}
                />
            ))}
        </ul>
    );
});

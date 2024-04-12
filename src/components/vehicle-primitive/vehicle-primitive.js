import { Color, Cartesian3, PointPrimitive } from 'cesium/Cesium';
import { findCurrentPosition } from '../../utils/animation';
import { defer } from '../../utils/index';

export function VehiclePrimitive({ vehicle, time }) {
    const { points, id } = vehicle,
        [lon, lat] = findCurrentPosition(points, time.getValue()),
        position = Cartesian3.fromDegrees(lon, lat);

    const point = new PointPrimitive();
    Object.assign(point, {
        id,
        position,
        color: Color.DARKORANGE,
        pixelSize: 6
    });

    defer(() => {
        time.subscribe(now => {
            const [lon, lat ] = findCurrentPosition(points, now),
                position = Cartesian3.fromDegrees(lon, lat);

            point.position = position;
        });
    });

    return point;
}
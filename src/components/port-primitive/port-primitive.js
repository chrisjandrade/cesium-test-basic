import { Cartesian3, Color } from "cesium/Cesium";

export function PortPrimitive({ port }) {
    const { coordinates, key } = port;

    const position = Cartesian3.fromDegrees(coordinates[0], coordinates[1]);

    return {
        id: key,
        position,
        color: Color.DARKRED,
        pixelSize: 5
    };
}
import { PointPrimitiveCollection } from "cesium/Cesium";
import { PortPrimitive } from '../port-primitive/port-primitive';

export function PortsPrimitives({ viewer, ports }) {
    const collection = new PointPrimitiveCollection();

    ports.forEach(port => collection.add(PortPrimitive({ port })));

    return collection;
}
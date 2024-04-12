import { PointPrimitiveCollection } from "cesium/Cesium";
import { VehiclePrimitive } from '../vehicle-primitive/vehicle-primitive';
import { BehaviorSubject } from 'rxjs';
import { defer } from "../../utils";

export function VehiclesPrimitives({ viewer, vehicles }) {
    const collection = new PointPrimitiveCollection(),
        timeSubject = new BehaviorSubject(Date.now());

    vehicles.forEach(vehicle => collection.add(VehiclePrimitive({ vehicle, time: timeSubject })));

    let timer;
    defer(() => {
        timer = setInterval(() => {
            timeSubject.next(Date.now());
            viewer.scene.requestRender();
        }, 1000);
    });

    collection.destroy = (...args) => {
        clearInterval(timer);
        timeSubject.complete();
        
        PointPrimitiveCollection.prototype.destroy.call(collection, args);
    };

    return collection;
}
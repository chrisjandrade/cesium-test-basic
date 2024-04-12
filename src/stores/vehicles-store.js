
import { BehaviorSubject, map } from 'rxjs';

const store = {
    vehicles: new BehaviorSubject([]),

    selected: new BehaviorSubject(undefined),

    select(id) {
        store.selected.next(id);
    },

    deselect() {
        store.selected.next(undefined);
    },

    setVehicles(vehicles) {
        store.vehicles.next(vehicles);
    },

    addAllVehicles(vehicles) {
        let currentVehicles = store.vehicles.getValue();

        currentVehicles = currentVehicles.concat(vehicles);
        store.vehicles.next(currentVehicles);
    },

    findVehicleById(id) {
        return store.vehicles.pipe(
            map(vehicles => vehicles.find(vehicle => vehicle.id === id)));
    }
};

export default store;

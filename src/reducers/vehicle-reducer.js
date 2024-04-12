import store from '../stores/vehicles-store';
import { vehicleService } from '../services/vehicle-service';

const reducer = {
    store,

    actions: {
        async mockVehicles(numVehicles) {
            try {
                store.addAllVehicles(await vehicleService.mockVehicles(numVehicles));
            } catch (e) {
                console.error('Failed to mock vehicles =>', e);
            }
        },

        select(id) {
            store.select(id);
        },

        deselect() {
            store.deselect();
        }
    }
};

export default reducer;
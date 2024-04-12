import { portsService } from '../services/ports-service';
import store from '../stores/ports-store';

const reducer = {
    store,

    actions: {
        async retrievePorts() {
            try {
                const ports = Object.values(await portsService.retrievePorts()).
                    filter(port => port.coordinates && port.coordinates.length > 1);
                
                reducer.store.addAllPorts(ports);
            } catch(e) {
                console.error('Failed to retrieve ports =>', e);
                reducer.store.clearPorts();
            }
        },

        async mockPorts(numPorts) {
            try {
                reducer.store.addAllPorts(await portsService.mockPorts(numPorts));
            } catch (e) {
                console.error('Failed to mock ports =>', e);
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
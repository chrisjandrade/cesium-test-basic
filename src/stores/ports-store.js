import { BehaviorSubject } from 'rxjs';

const store = {

    ports: new BehaviorSubject([]),

    selected: new BehaviorSubject(undefined),

    select(id) {
        store.selected.next(id);
    },

    deselect() {
        store.selected.next(undefined);
    },

    setPorts(ports) {
        store.ports.next(ports);
    },

    addAllPorts(ports) {
        let currentPorts = store.ports.getValue();
        currentPorts = currentPorts.concat(ports);

        store.ports.next(currentPorts);
    },

    clearPorts() {
        store.ports.next([]);
    },

    findPortById(id) {
        return store.ports.pipe(
            map(ports => ports.find(port => port.id === id)));
    }
};

export default store;


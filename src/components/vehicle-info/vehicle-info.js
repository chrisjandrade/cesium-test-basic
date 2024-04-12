import reducers from '../../reducers';
import { combineLatest } from 'rxjs';
import { findCurrentPosition } from '../../utils/animation';
import './vehicle-info.css';
import { defer } from '../../utils';

const { vehicles } = reducers;

export function VehicleInfo() {
    const el = document.createElement('div');
    el.classList.add('VehicleInfo');
    el.classList.add('hidden');
    
    const state = {
        time: Date.now(),
        intervalId: undefined
    };

    const hide = () => {
        if (!el.classList.contains('hidden')) {
            el.classList.add('hidden');
        }
    };

    const show = () => {
        el.classList.remove('hidden');
    };

    const updateProperties = (selectedVehicle) => {
        const { name } = selectedVehicle,
            [lon, lat] = findCurrentPosition(selectedVehicle.points, state.time);

        el.querySelector('h2').innerText = name;
        el.querySelector('.location-container strong').innerText = `${lon.toFixed(3)}, ${lat.toFixed(3)}`;
    };

    combineLatest([vehicles.store.vehicles, vehicles.store.selected]).
        subscribe(([vehicles, selectedVehicleId]) => {
            if (selectedVehicleId) {
                const selectedVehicle = vehicles.find(vehicle => vehicle.id === selectedVehicleId);
                
                if (selectedVehicle) {
                    updateProperties(selectedVehicle);
                    show();
                }
            } else {
                hide();
            }
        });

    el.innerHTML = `
        <h2></h2>
        <i class="fa fa-close close-icon" data-toggle="tooltip" title="Deselect the vehicle"></i>
        <div class="location-container">Location: <strong class="location-value"></strong></div>
    `;

    const onDeselectVehicle = () => {
        vehicles.actions.deselect();
    };

    defer(() => {
        const closeIconEl = el.querySelector('.close-icon');
        closeIconEl.addEventListener('click', onDeselectVehicle);
    });

    return el;
}
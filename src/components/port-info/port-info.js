import './port-info.css';
import reducers from '../../reducers';
import { combineLatest } from 'rxjs';
import { defer } from '../../utils';

require('jquery-ui/draggable');

const { ports } = reducers;

const properties = [
    { label: 'Name', property: 'name' },
    { label: 'Location', property: 'location' },
    { label: 'City', property: 'city' },
    { label: 'Province', property: 'province' },
    { label: 'Country', property: 'country' },
    { label: 'Timezone', property: 'timezone' }
];

export function PortInfo() {
    const el = document.createElement('div');
    el.classList.add('PortInfo');
    el.classList.add('hidden');

    const hide = () => {
        if (!el.classList.contains('hidden')) {
            el.classList.add('hidden');
        }
    };

    const show = () => {
        el.classList.remove('hidden');
    };

    const findPort = (ports, selectedPortKey) =>
        ports.find(port => port.key === selectedPortKey);

    const updateProperties = (selectedPort) => {
        const [lon, lat] = selectedPort.coordinates;
        const model = {
            name: selectedPort.name,
            location: `${lat.toFixed(3)}, ${lon.toFixed(3)}`,
            city: selectedPort.city || '',
            country: selectedPort.country || '',
            province: selectedPort.province || '',
            timezone: selectedPort.timezone | ''
        };

        // update port name
        el.querySelector('h2').innerText = model.name;

        // update properties
        const propertiesEl = el.querySelector('.properties');
        properties.forEach(({ property }) => {
            const valueEl = propertiesEl.querySelector(`[data-property="${property}"] strong`);
            valueEl.innerText = model[property];
        });
    };

    combineLatest([ports.store.ports, ports.store.selected]).
        subscribe(([ports, selectedPortKey]) => {
            if (selectedPortKey) {
                const selectedPort = findPort(ports, selectedPortKey);
                if (selectedPort) {
                    updateProperties(selectedPort);
                    show();
                }
            } else {
                hide();
            }
        });

    el.innerHTML = `
        <h2></h2>
        <i class="fa fa-close close-icon" data-toggle="tooltip" title="Deselect the port"></i>
        <div class="properties">
        ${properties.map(({ label, property }) => `<div data-property="${property}">${label}: <strong></strong></div>`).join('\n')}
        </div>
    `;

    const onDeselectPort = () => {
        ports.actions.deselect();
    };

    defer(() => {
        const closeIconEl = el.querySelector('.close-icon');
        closeIconEl.addEventListener('click', onDeselectPort);
    });

    $(el).draggable();
    return el;
}
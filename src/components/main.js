
import { CesiumViewer } from './cesium-viewer/cesium-viewer';
import { DevConsole } from './dev-console/dev-console';
import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import $ from 'jquery';
import { PortInfo } from './port-info/port-info';
import { VehicleInfo } from './vehicle-info/vehicle-info';
require('jquery-ui-css/core.css');
require('jquery-ui-css/theme.css');
require('jquery-ui/tooltip');

export function Main() {
    const el = document.createElement('div');
    el.classList.add('main');

    el.appendChild(CesiumViewer());
    el.appendChild(DevConsole());
    el.appendChild(PortInfo());
    el.appendChild(VehicleInfo());

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    return el;
}

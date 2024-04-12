
import { CesiumViewer } from './cesium-viewer/cesium-viewer';
import './main.css';

export function Main() {
    const el = document.createElement('div');
    el.classList.add('main');
    el.classList.add('container');

    el.appendChild(CesiumViewer());

    return el;
}

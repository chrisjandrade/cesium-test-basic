import { Viewer, SceneMode } from 'cesium/Cesium';
import 'cesium/Widgets/widgets.css';

export function CesiumViewer() {
    const el = document.createElement('div');
    el.classList.add('cesium-viewer');

    const viewer = new Viewer(el, {
        sceneMode: SceneMode.SCENE2D
    });

    return el;
}

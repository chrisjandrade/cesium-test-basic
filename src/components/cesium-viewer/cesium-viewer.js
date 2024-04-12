import { SceneMode, Viewer, ScreenSpaceEventHandler, ScreenSpaceEventType, Cartesian3 } from 'cesium/Cesium';
import 'cesium/Widgets/widgets.css';
import reducers from '../../reducers/index';
import { defer } from '../../utils';
import { PortsPrimitives } from '../ports-primitive/ports-primitives';
import { VehiclesPrimitives } from '../vehicles-primitives/vehicles-primitives';
import './cesium-viewer.css';
import { combineLatest } from 'rxjs';
import moment from 'moment';
import { findCurrentPosition } from '../../utils/animation';

const { ports, vehicles } = reducers,
    ZOOM_ALT_M = 15000;

export function CesiumViewer() {
    const el = document.createElement('div');
    el.classList.add('cesium-viewer-wrapper');

    const formattedTime = (time = Date.now()) =>
        moment(time).format('MM-DD-yyyy HH:mm:ss');

    const timeEl = document.createElement('div');
    timeEl.classList.add('current-time');
    timeEl.innerHTML = formattedTime();
    el.appendChild(timeEl);

    const viewerEl = document.createElement('div');
    viewerEl.classList.add('cesium-viewer');
    el.appendChild(viewerEl);

    const state = {
        ports: [],
        vehicles: [],
        portsPrimitives: undefined,
        vehiclesPrimitives: undefined,
        viewer: undefined,
        selectedVehicle: undefined,
        selectedPort: undefined
    };

    const primitivesRender = () => {
        const { ports, vehicles, viewer } = state,
            { scene } = viewer;

        scene.primitives.removeAll();
        if (ports.length > 0) {
            state.portsPrimitives = PortsPrimitives({ ports });
            scene.primitives.add(state.portsPrimitives);
        }
        if (vehicles.length > 0) {
            state.vehiclesPrimitives = VehiclesPrimitives({ vehicles, viewer: state.viewer });
            scene.primitives.add(state.vehiclesPrimitives);
        }

        scene.requestRender();
    };

    const updateTime = () =>
        timeEl.innerHTML = formattedTime(Date.now());

    defer(() => {
        state.viewer = new Viewer(viewerEl, {
            sceneMode: SceneMode.SCENE2D
        });
        state.viewer.scene.debugShowFramesPerSecond = true;

        const onPortsChange = portRecords => {
            state.ports = portRecords;
            primitivesRender();
        };
        ports.store.ports.subscribe(onPortsChange);
        ports.actions.retrievePorts();

        const onVehiclesChange = vehicleRecords => {
            state.vehicles = vehicleRecords;
            primitivesRender();
        };
        vehicles.store.vehicles.subscribe(onVehiclesChange);

        setInterval(() => updateTime(), 1000);

        const mouseMoveHandler = new ScreenSpaceEventHandler(state.viewer.canvas);
        mouseMoveHandler.setInputAction(movement => {
            const { scene } = state.viewer;

            if (scene) {
                const entity = scene.pick(movement.endPosition);

                if (entity) {
                    el.style.cursor = 'pointer';
                } else {
                    el.style.cursor = 'default';
                }
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);

        const clickHandler = new ScreenSpaceEventHandler(state.viewer.canvas);
        clickHandler.setInputAction(click => {
            const { scene } = state.viewer;

            if (scene) {
                const entity = scene.pick(click.position);
                if (entity) {
                    const { id } = entity;

                    const vehicle = state.vehicles.find(v => v.id === id),
                        port = state.ports.find(p => p.key === id);

                    if (vehicle) {
                        vehicles.actions.select(id);
                    } else {
                        ports.actions.select(id);
                    }
                }
            }
        }, ScreenSpaceEventType.LEFT_CLICK);

        combineLatest([ports.store.selected, vehicles.store.selected]).subscribe(
            ([selectedPortKey, selectedVehicleId]) => {
                const { viewer, ports, vehicles } = state;
                let destination;

                if (selectedPortKey) {
                    const selectedPort = ports.find(port => port.key === selectedPortKey),
                        [lon, lat] = selectedPort.coordinates;
                    
                    destination = Cartesian3.fromDegrees(lon, lat, ZOOM_ALT_M);
                } else if (selectedVehicleId) {
                    const selectedVehicle = vehicles.find(vehicle => vehicle.id === selectedVehicleId),
                        [lon, lat] = findCurrentPosition(selectedVehicle.points, Date.now());

                    destination = Cartesian3.fromDegrees(lon, lat, ZOOM_ALT_M);
                }

                if (destination) {
                    viewer.camera.flyTo({ destination });
                } else {
                    viewer.camera.flyHome();
                }
            });

        el.querySelector('.cesium-viewer .cesium-viewer-animationContainer').style.display = 'none';
        el.querySelector('.cesium-viewer .cesium-timeline-main').style.display = 'none';
    });


    return el;
}

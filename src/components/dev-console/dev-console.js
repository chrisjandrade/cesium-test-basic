import reducers from '../../reducers/index';
import { defer } from '../../utils';
import './dev-console.css';
require('jquery-ui/draggable')

const { ports, vehicles } = reducers,
  MAX_BATCH_SIZE = 1000;

export function DevConsole() {
  const el = document.createElement('div');
  el.classList.add('DevConsole');

  const state = {
    numPorts: 0,
    numVehicles: 0,
    responsivenessMs: undefined,
    isResponsivenessTesting: false,
    batchMode: true,
    loading: false,
    intervalId: undefined
  };

  const initStats = () => [
    { label: 'Number of Ports', value: state.numPorts },
    { label: 'Number of Vehicles', value: state.numVehicles },
    { label: 'Total', value: state.numPorts + state.numVehicles },
    { label: 'Responsiveness (ms)', value: state.responsivenessMs }
  ];

  const stats = initStats();

  const NUM_PORTS_INPUT = 'num-ports-input',
    NUM_VEHICLES_INPUT = 'num-vehicles-input';

  const elRefs = {
    numPortsInput: () => el.querySelector(`.${NUM_PORTS_INPUT}`),
    numVehiclesInput: () => el.querySelector(`.${NUM_VEHICLES_INPUT}`),
    statsContainer: () => el.querySelector('.Stats'),
    responsivenessTestButton: () => el.querySelector('.responsiveness-btn')
  };

  const handleBatchChange = function () {
    state.batchMode = this.checked;
  };

  const setLoading = (loading) => {
    if (loading) {
      el.classList.add('Loading');
    } else {
      el.classList.remove('Loading');
    }
  };

  const handleMockPorts = () => {
    const { value } = elRefs.numPortsInput(),
      numPorts = parseFloat(value);

    if (!Number.isNaN(numPorts)) {
      if (!state.batchMode) {
        ports.actions.mockPorts(numPorts);
      } else {
        setLoading(true);
        batchMockPorts(numPorts, Math.min(Math.floor(numPorts / 10), MAX_BATCH_SIZE));
      }

    }
  };

  const batchMockPorts = (remaining, batch) => {
    if (remaining > 0) {
      ports.actions.mockPorts(Math.min(remaining, batch));
    } else {
      setLoading(false);
    }

    if (remaining > 0) {
      setTimeout(() => batchMockPorts(remaining - batch, batch), 1000);
    }
  };


  const batchMockVehicles = (remaining, batch) => {
    if (remaining > 0) {
      vehicles.actions.mockVehicles(Math.min(remaining, batch));
    } else {
      setLoading(false);
    }

    if (remaining > 0) {
      setTimeout(() => batchMockVehicles(remaining - batch, batch), 1000);
    }
  };

  const handleMockVehicles = () => {
    const { value } = elRefs.numVehiclesInput(),
      numVehicles = parseFloat(value);

    if (!Number.isNaN(numVehicles)) {
      if (!state.batchMode) {
        vehicles.actions.mockVehicles(numVehicles);
      } else {
        setLoading(true);
        batchMockVehicles(numVehicles, Math.min(Math.floor(numVehicles / 10), MAX_BATCH_SIZE));
      }
    }
  };

  const updateStats = () => {
    const stats = initStats(),
      container = elRefs.statsContainer();

    if (container) {
      container.innerHTML =
        stats.map(({ label, value }) =>
          `<div key="${label}">${label}: <strong>${value || ''}</strong></div>`).join('');
    }
  };

  const updateResponsivenessButton = (running) => {
    elRefs.responsivenessTestButton().innerText = running ? 'Stop Responsiveness Test' : 'Run Responsiveness Test';
  };

  const handleRunResponsiveness = () => {
    updateResponsivenessButton(!state.isResponsivenessTesting);
    
    if (!state.isResponsivenessTesting) {
    
      let last = Date.now(),
        delay = 100,
        worstResponsiveness = 0;

      state.isResponsivenessTesting = true;

      state.intervalId = setInterval(() => {
        if (state.isResponsivenessTesting) {
          worstResponsiveness = Math.max(Date.now() - (last + delay), 0, worstResponsiveness);
          state.responsivenessMs = worstResponsiveness;
          last = Date.now();
          updateStats();
        }
      }, delay);
    } else {
      state.isResponsivenessTesting = false;
      state.responsivenessMs = undefined;
      clearInterval(state.intervalId);
    }
  };

  const render = () => {

    el.innerHTML = `
        <div class="Container">
            <strong>Statistics</strong><br />
            <div class="Stats">
              ${stats.map(({ label, value }) => `<div key=${label}>${label}: <strong>${value || ''}</strong></div>`).join('')}
            </div>
        </div>
        <div class="Container">
            <strong>Dev Controls</strong>
            <div><input type="checkbox" id="batchOperation" checked /><label htmlFor="batchOperation">Batch Mode</label></div>
            <div>Mock Ports <input class="${NUM_PORTS_INPUT}" type="text" maxLength="9" size="4" value="100" /> <button class="mock-ports-btn">GO</button></div>
            <div>Mock Vehicles <input class="${NUM_VEHICLES_INPUT}" type="text" maxLength="9" size="4" value="100" /> <button class="mock-vehicles-btn">GO</button></div>
            <div><button class="responsiveness-btn">${state.isResponsivenessTesting ? 'Stop Responsiveness Test' : 'Run Responsiveness Test'}</button></div>
        </div>
      `;

    defer(() => {
      el.querySelector('#batchOperation').addEventListener('change', handleBatchChange);
      el.querySelector('.mock-ports-btn').addEventListener('click', handleMockPorts);
      el.querySelector('.mock-vehicles-btn').addEventListener('click', handleMockVehicles);
      el.querySelector('.responsiveness-btn').addEventListener('click', handleRunResponsiveness);

      ports.store.ports.subscribe(portsRecords => {
        state.numPorts = portsRecords.length;
        updateStats();
      });

      vehicles.store.vehicles.subscribe(vehicleRecords => {
        state.numVehicles = vehicleRecords.length;
        updateStats();
      });
    });
  };

  render();
  $(el).draggable();
  return el;
}
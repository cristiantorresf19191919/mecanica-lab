// One thermal mass at the junction, connected to 25 °C air.
import {targetVoltage, dropoutVoltage} from './rectifier-filter.mjs';
export const ambient = 25, trip = 125, restart = 100;
const heatCapacity = 1.5; // J/°C, shared to isolate thermal resistance

export function readings(input, resistance, shutdown) {
  const output = shutdown ? 0 : Math.min(targetVoltage, Math.max(0, input - dropoutVoltage));
  const current = output / resistance;
  return {output, current, loss: (input - output) * current, loadPower: output * current};
}

export function advance(state, seconds, input, resistance, sink) {
  return advanceWithPower(state,seconds,readings(input,resistance,false).loss,sink);
}

export function advanceWithPower(state, seconds, operatingPower, sink) {
  const thermalResistance = sink ? 18 : 75;
  const tau = thermalResistance * heatCapacity;
  let {temperature, shutdown} = state;
  let remaining = seconds;
  while (remaining > 0) {
    const end = ambient + thermalResistance * (shutdown ? 0 : operatingPower);
    const limit = shutdown ? restart : trip;
    const crosses = shutdown ? end < limit : end > limit;
    const untilSwitch = crosses ? tau * Math.log((temperature - end) / (limit - end)) : Infinity;
    if (untilSwitch > remaining) {
      temperature = end + (temperature - end) * Math.exp(-remaining / tau);
      break;
    }
    temperature = limit;
    shutdown = !shutdown;
    remaining -= untilSwitch;
  }
  return {temperature, shutdown, time: state.time + seconds};
}

import secrets from './private/secrets.json';

const BASE_URL = 'https://api.nature.global/1';
const DEFAULT_OPTIONS = {
  headers: { Authorization: `Bearer ${secrets.remoAccessToken}` }
};
const DEFAULT_POST_OPTIONS = {
  headers: {
    ...DEFAULT_OPTIONS.headers,
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  },
  method: 'POST',
};
const ENABLED = !!secrets.remoAccessToken;

const get = path => fetch(BASE_URL + path, DEFAULT_OPTIONS);
const post = (path, params) => {
  const form = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => form.append(k, v));
  }
  return fetch(BASE_URL + path, { ...DEFAULT_POST_OPTIONS, body: form.toString() });
}

export const getTemperatures = async () => {
  if (!ENABLED) return {};
  try {
    const response = await get('/devices');
    const json = await response.json();
    if (!json.map) {
      console.log({ json, status: response.status });
      return {};
    }
    return Object.fromEntries(json.map(device => [
      device.name,
      device.newest_events.te.val
    ]));
  } catch(error) {
    alert(error.message);
    return {};
  }
};

const acSettingsToState = settings => ({
  on: settings.button !== 'power-off',
  ac: {
    temperature: settings.temp, // 16-30 incl. 16.5, 17.5 etc. (string)
    mode: settings.mode, // warm, cool, dry
    volume: settings.vol, // 1-4 + auto (string)
    direction: settings.dir, // 1-5 + auto (string)
  },
});

export const getAppliances = async () => {
  if (!ENABLED) return {};
  try {
    const response = await get('/appliances');
    const json = await response.json();
    return Object.fromEntries(json.map(appliance => [
      appliance.nickname,
      {
        id: appliance.id,
        type: appliance.type, // AC | LIGHT
        state: appliance.type === 'AC' ? acSettingsToState(appliance.settings) : {
          on: null,
          ac: null,
        },
        available: {
          signals: Object.fromEntries(appliance.signals.map(({ id, name }) => [name, id])),
          lightButtons:
            appliance.type === 'LIGHT' ? appliance.light.buttons.map(({ name }) => name) : [],
          ac: appliance.type === 'AC' ? {
            temperature: Object.values(appliance.aircon.range.modes)[0].temp,
            mode: Object.keys(appliance.aircon.range.modes),
            volume: Object.values(appliance.aircon.range.modes)[0].vol,
            direction: Object.values(appliance.aircon.range.modes)[0].dir,
          } : null,
        }
      }
    ]));
  } catch(error) {
    alert(error.message);
    return {};
  }
};

export const updateAC = async (id, { mode, temperature, volume, direction }) => {
  if (!ENABLED) return {};
  try {
    const response = await post(`/appliances/${id}/aircon_settings`, {
      temperature,
      operation_mode: mode,
      air_volume: volume,
      air_direction: direction,
      button: '',
    });
    const json = await response.json();
    return acSettingsToState(json);
  } catch(error) {
    alert(error.message);
    return {};
  }
};

export const turnACOnOff = async (id, on) => {
  if (!ENABLED) return {};
  try {
    const response = await post(`/appliances/${id}/aircon_settings`, {
      button: on ? '' : 'power-off',
    });
    const json = await response.json();
    return acSettingsToState(json);
  } catch(error) {
    alert(error.message);
    return {};
  }
};

export const sendLightButton = async (id, button) => {
  if (!ENABLED) return {};
  try {
    const response = await post(`/appliances/${id}/light`, { button });
    const json = await response.json();
    // It's lying about the state, so we can ignore it
    return {};
  } catch(error) {
    alert(error.message);
    return {};
  }
};

export const sendSignal = async (id) => {
  if (!ENABLED) return false;
  try {
    const response = await post(`/signals/${id}/send`);
    const json = await response.json();
    console.log(json);
    return true;
  } catch(error) {
    alert(error.message);
    return false;
  }
};

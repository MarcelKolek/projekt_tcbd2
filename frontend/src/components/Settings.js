import React, { useState, useEffect } from 'react';
import { authApi } from '../services/api';
import authHeader from '../services/authHeader';

function Settings() {
  const [prefs, setPrefs] = useState({ theme: '', sound: '' });

  useEffect(() => {
    // Można pobrać aktualne preferencje z backendu, jeśli endpoint istnieje
  }, []);

  const updatePrefs = async () => {
    await authApi.put('/preferences', prefs, { headers: authHeader() });
    alert("Preferences updated");
  };

  return (
    <div>
      <h2>User Settings</h2>
      <input placeholder="Theme" value={prefs.theme}
        onChange={e => setPrefs({...prefs, theme: e.target.value})} />
      <input placeholder="Sound" value={prefs.sound}
        onChange={e => setPrefs({...prefs, sound: e.target.value})} />
      <button onClick={updatePrefs}>Save Settings</button>
    </div>
  );
}

export default Settings;

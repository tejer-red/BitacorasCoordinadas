import React, { useState, useEffect } from 'react';

const DEFAULT_BASE_URL = 'https://concentrador.abundis.com.mx';
const INSTANCIAS_URL = 'https://concentrador.abundis.com.mx/instancias.php';

function Configuraciones() {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [saved, setSaved] = useState(false);
  const [instancias, setInstancias] = useState([]);
  const [visibleInstancias, setVisibleInstancias] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('BASE_URL');
    if (stored) setBaseUrl(stored);

    // Cargar instancias
    fetch(INSTANCIAS_URL)
      .then(res => res.json())
      .then(data => {
        setInstancias(data);
        // Cargar selección previa o marcar todas como visibles por defecto
        const visibles = JSON.parse(localStorage.getItem('VISIBLE_INSTANCIAS') || '[]');
        if (visibles.length > 0) {
          setVisibleInstancias(visibles);
        } else {
          setVisibleInstancias(data.map(i => i.url.replace(/^https?:\/\//, '')));
        }
      })
      .catch(() => setInstancias([]));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('BASE_URL', baseUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleToggleInstancia = (host) => {
    let updated;
    if (visibleInstancias.includes(host)) {
      updated = visibleInstancias.filter(h => h !== host);
    } else {
      updated = [...visibleInstancias, host];
    }
    setVisibleInstancias(updated);
    localStorage.setItem('VISIBLE_INSTANCIAS', JSON.stringify(updated));
  };

  return (
    <div>
      <h1>Configuraciones</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="base-url">BASE URL del concentrador:</label>
        <input
          id="base-url"
          type="text"
          value={baseUrl}
          onChange={e => setBaseUrl(e.target.value)}
          style={{ width: '100%', margin: '1rem 0' }}
        />
        <button type="submit">Guardar</button>
        {saved && <span style={{ marginLeft: 10, color: 'green' }}>Guardado</span>}
      </form>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Cambia la URL del concentrador de datos si necesitas apuntar a otro servidor.
      </p>
      <hr />
      <h2>Instancias visibles</h2>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Selecciona qué instancias (colectivos) mostrar en las visualizaciones.
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {instancias.map(inst => {
          const host = inst.url.replace(/^https?:\/\//, '');
          return (
            <li key={host} style={{ marginBottom: 8 }}>
              <label>
                <input
                  type="checkbox"
                  checked={visibleInstancias.includes(host)}
                  onChange={() => handleToggleInstancia(host)}
                  style={{ marginRight: 8 }}
                />
                {host}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Configuraciones;

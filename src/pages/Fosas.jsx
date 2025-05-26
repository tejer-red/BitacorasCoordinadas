import React, { useEffect, useState, useRef } from 'react';
import { fetchSummaryData, fetchPostDetails } from '../api/dataService';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function Fosas() {
  const [fosas, setFosas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColectivo, setSelectedColectivo] = useState('');
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null); // Reference to the map instance
  const markersRef = useRef([]); // Reference to the markers

  useEffect(() => {
    const fetchData = async () => {
      const summary = await fetchSummaryData();
      const filtered = summary.filter(item => item.type === 'fosas');

      const details = await Promise.all(
        filtered.map(async (item) => {
          const detail = await fetchPostDetails(item.host, item.type, item.id);
          if (detail) {
            console.log('Fosa Object:', detail); // Log the full object
          }
          return detail ? { ...detail, host: item.host, type: item.type, id: item.id } : null;
        })
      );

      const validFosas = details.filter(item => item !== null);
      setFosas(validFosas);

      // Initialize the map
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // MapLibre style
        center: [-104.434994, 19.614075], // Initial center (adjust as needed)
        zoom: 6,
      });

      mapRef.current = map; // Store the map instance

      return () => map.remove(); // Cleanup map on component unmount
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleColectivoChange = (e) => {
    setSelectedColectivo(e.target.value);
  };

  const filteredFosas = fosas.filter((fosa) => {
    const matchesSearchTerm =
      fosa.title.toLowerCase().includes(searchTerm) || // Match by title (nombre)
      fosa.host.toLowerCase().includes(searchTerm) || // Match by colectivo autor
      fosa.slug.toLowerCase().includes(searchTerm) || // Match by slug
      fosa.taxonomies?.some(tax => tax.name.toLowerCase().includes(searchTerm)) || // Match by zona
      fosa.meta?.descripcion?.toLowerCase().includes(searchTerm); // Match by descripción

    const matchesColectivo = selectedColectivo
      ? fosa.host === selectedColectivo
      : true;

    return matchesSearchTerm && matchesColectivo;
  });

  const uniqueColectivos = [...new Set(fosas.map(fosa => fosa.host))];

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for filtered fosas
    filteredFosas.forEach((fosa) => {
      if (fosa.meta?.latitud && fosa.meta?.longitud) {
        const marker = new maplibregl.Marker()
          .setLngLat([parseFloat(fosa.meta.longitud[0]), parseFloat(fosa.meta.latitud[0])])
          .setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(`
              <strong>${fosa.title}</strong><br>
              <p>${fosa.meta?.descripcion || 'Sin descripción disponible'}</p>
              <p><strong>Colectivo autor:</strong> ${fosa.host}</p>
              <p><strong>Fecha:</strong> ${new Date(fosa.date).toLocaleDateString()}</p>
              <p><strong>Zonas:</strong> ${fosa.taxonomies?.map(tax => tax.name).join(', ')}</p>
              <a href="https://${fosa.host}/?p=${fosa.id}" target="_blank" rel="noopener noreferrer">Ver más detalles</a>
            `)
          )
          .addTo(mapRef.current);

        markersRef.current.push({ marker, fosa });
      }
    });
  }, [filteredFosas]);

  const handleTitleClick = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 12,
        essential: true, // This ensures the animation is always performed
      });
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '100%' }}
      ></div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '30%',
          height: '100%',
          overflowY: 'scroll',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '10px',
          boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Buscar por zonas, descripción o colectivo"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <select
            value={selectedColectivo}
            onChange={handleColectivoChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          >
            <option value="">Todos los colectivos</option>
            {uniqueColectivos.map((colectivo) => (
              <option key={colectivo} value={colectivo}>
                {colectivo}
              </option>
            ))}
          </select>
        </div>
        <ul>
          {filteredFosas.map((fosa) => (
            <li key={fosa.id} style={{ marginBottom: '20px' }}>
              <h2
                style={{ cursor: 'pointer', color: 'blue' }}
                onClick={() =>
                  handleTitleClick(
                    parseFloat(fosa.meta?.latitud?.[0]),
                    parseFloat(fosa.meta?.longitud?.[0])
                  )
                }
              >
                {fosa.title}
              </h2>
              <p><strong>Colectivo autor:</strong> {fosa.host}</p>
              <img
                src={fosa.media_url || fosa.image}
                alt={fosa.title}
                style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
              />
              <p><strong>Fecha:</strong> {new Date(fosa.date).toLocaleDateString()}</p>
              <p><strong>Slug:</strong> {fosa.slug}</p>
              <p><strong>Latitud:</strong> {fosa.meta?.latitud?.[0]}</p>
              <p><strong>Longitud:</strong> {fosa.meta?.longitud?.[0]}</p>
              <p><strong>Zonas:</strong> {fosa.taxonomies?.map(tax => tax.name).join(', ')}</p>
              <a
                href={`https://${fosa.host}/?p=${fosa.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver post original
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Fosas;

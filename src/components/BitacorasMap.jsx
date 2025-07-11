import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const pastelColors = [
  "#A7C7E7", "#FFB3BA", "#FFFFBA", "#B5EAD7", "#C7CEEA", "#FFDAC1", "#E2F0CB", "#B0B0B0",
  "#FFB347", "#B39EB5", "#FFDEFA", "#C9FFE5", "#FFFACD", "#FFD1DC", "#D5E1DF"
];

function BitacorasMap({ bitacoras }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [-103.3496, 20.6597], // Coordenadas de Guadalajara
        zoom: 5,
      });
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    // Limpiar marcadores anteriores
    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current = [];

    // Colorear por colectivo
    const allHosts = Array.from(new Set(bitacoras.map(b => b.host)));
    const hostColorMap = {};
    allHosts.forEach((host, idx) => {
      hostColorMap[host] = pastelColors[idx % pastelColors.length];
    });

    bitacoras.forEach((bitacora) => {
      const lat = parseFloat(bitacora.meta?.latitud?.[0]);
      const lng = parseFloat(bitacora.meta?.longitud?.[0]);
      if (!isNaN(lat) && !isNaN(lng)) {
        const color = hostColorMap[bitacora.host] || pastelColors[0];
        const el = document.createElement('div');
        el.style.width = '18px';
        el.style.height = '18px';
        el.style.borderRadius = '50%';
        el.style.background = color;
        el.style.border = '2px solid #fff';
        el.style.boxShadow = '0 0 4px #8884';

        const popupHtml = `
          <strong>${bitacora.title}</strong><br/>
          <span>Colectivo: ${bitacora.host}</span><br/>
          <span>Zona: ${(bitacora.taxonomies || []).map(tax => tax.name).join(', ')}</span><br/>
          <a href="https://${bitacora.host}/?p=${bitacora.id}" target="_blank" rel="noopener noreferrer">Ver post original</a>
        `;

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(new maplibregl.Popup({ offset: 20 }).setHTML(popupHtml))
          .addTo(mapRef.current);

        markersRef.current.push({ marker, bitacora });
      }
    });
  }, [bitacoras]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '400px',
        border: '4px solid rgb(8, 112, 74)', // verde pastel
        borderRadius: '12px',
        boxSizing: 'border-box'
      }}
    />
  );
}

export default BitacorasMap;

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { fetchSummaryData, fetchPostDetails } from '../api/dataService';

function FosasMap({
  fosas,
  setFosas,
  searchTerm,
  selectedColectivo,
  isMobileDevice,
  isExpanded,
  setIsExpanded,
  mapRef, // Accept the map reference as a prop
}) {
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      const summary = await fetchSummaryData();
      const filtered = summary.filter(item => item.type === 'fosas');

      const details = await Promise.all(
        filtered.map(async (item) => {
          const detail = await fetchPostDetails(item.host, item.type, item.id);
          return detail ? { ...detail, host: item.host, type: item.type, id: item.id } : null;
        })
      );

      const validFosas = details.filter(item => item !== null);
      setFosas(validFosas);

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [-102.5528, 23.6345],
        zoom: 5,
      });

      mapRef.current = map; // Assign the map instance to the external reference

      return () => map.remove();
    };

    fetchData();
  }, [setFosas, mapRef]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach(({ marker }) => {
      if (marker && typeof marker.remove === 'function') {
        marker.remove();
      }
    });
    markersRef.current = [];

    fosas
      .filter((fosa) => {
        const matchesSearchTerm =
          fosa.title.toLowerCase().includes(searchTerm) ||
          fosa.host.toLowerCase().includes(searchTerm) ||
          fosa.slug.toLowerCase().includes(searchTerm) ||
          fosa.taxonomies?.some(tax => tax.name.toLowerCase().includes(searchTerm)) ||
          fosa.meta?.descripcion?.toLowerCase().includes(searchTerm);

        const matchesColectivo = selectedColectivo
          ? fosa.host === selectedColectivo
          : true;

        return matchesSearchTerm && matchesColectivo;
      })
      .forEach((fosa) => {
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
  }, [fosas, searchTerm, selectedColectivo, mapRef]);

  return <div ref={mapContainerRef} className="map-container"></div>;
}

export default FosasMap;

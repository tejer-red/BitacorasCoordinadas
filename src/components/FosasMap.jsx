import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { fetchSummaryData, fetchPostDetails } from '../api/dataService';
import { useNavigate } from 'react-router-dom';

// Paleta de colores pastel (orden fijo)
const pastelColors = [
  "#A7C7E7", // azul
  "#FFB3BA", // rojo
  "#FFFFBA", // amarillo
  "#B5EAD7", // verde menta
  "#C7CEEA", // lila
  "#FFDAC1", // durazno
  "#E2F0CB", // verde claro
  "#B0B0B0", // gris pastel (negro pastel)
  "#FFB347", // naranja pastel
  "#B39EB5", // lavanda
  "#FFDEFA", // rosa claro
  "#C9FFE5", // aqua pastel
  "#FFFACD", // limón pastel
  "#FFD1DC", // rosa chicle
  "#D5E1DF", // gris verdoso pastel
];

function FosasMap({
  fosas,
  setFosas,
  searchTerm,
  selectedColectivo,
  isMobileDevice,
  isExpanded,
  setIsExpanded,
  mapRef, // Accept the map reference as a prop
  conteoIndiciosPorFosa = {}, // Nuevo prop opcional
}) {
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);
  const navigate = useNavigate();

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

    // Obtener instancias visibles desde localStorage
    const visibles = JSON.parse(localStorage.getItem('VISIBLE_INSTANCIAS') || '[]');
    const fosasVisibles = visibles.length > 0
      ? fosas.filter(fosa => visibles.includes(fosa.host))
      : fosas;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(({ marker }) => {
      if (marker && typeof marker.remove === 'function') {
        marker.remove();
      }
    });
    markersRef.current = [];

    // Filtrar y obtener el arreglo de fosas a mostrar
    const fosasFiltradas = fosasVisibles
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
      });

    // Obtener todos los hosts únicos de todas las fosas cargadas (no solo las filtradas)
    const allHosts = Array.from(new Set(fosas.map(f => f.host)));
    const hostColorMap = {};
    allHosts.forEach((host, idx) => {
      hostColorMap[host] = pastelColors[idx % pastelColors.length];
    });

    // Calcular máximo de indicios para escalar el tamaño
    const maxIndicios = Math.max(
      ...fosasFiltradas.map(fosa => Number(conteoIndiciosPorFosa[fosa.id] || 0)),
      1
    );

    fosasFiltradas.forEach((fosa) => {
      if (fosa.meta?.latitud && fosa.meta?.longitud) {
        const color = hostColorMap[fosa.host] || pastelColors[0];
        const numIndicios = Number(conteoIndiciosPorFosa[fosa.id] || 0);

        // Escalar tamaño: mínimo 18px, máximo 48px
        const minSize = 18, maxSize = 48;
        const size = minSize + ((maxSize - minSize) * (numIndicios / maxIndicios));
        const innerSize = size * 0.5;

        const el = document.createElement('div');
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.borderRadius = '50%';
        el.style.background = color;
        el.style.border = '2px solid #fff';
        el.style.boxShadow = '0 0 4px #8884';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';

        const inner = document.createElement('div');
        inner.style.width = `${innerSize}px`;
        inner.style.height = `${innerSize}px`;
        inner.style.borderRadius = '50%';
        inner.style.background = '#fff8';
        el.appendChild(inner);

        // Enlaces para navegar a Indicios.jsx con filtros aplicados
        const fosaId = String(fosa.id);
        const colectivo = fosa.host;

        // Construir URLs con query params para filtros
        const urlFosa = `/indicios?fosa_relacionada=${encodeURIComponent(fosaId)}`;
        const urlColectivo = `/indicios?host=${encodeURIComponent(colectivo)}`;

        const popupHtml = `
          <strong>${fosa.title}</strong><br>
          <p>${fosa.meta?.descripcion || 'Sin descripción disponible'}</p>
          <p><strong>Colectivo autor:</strong> ${fosa.host}</p>
          <p><strong>Fecha:</strong> ${new Date(fosa.date).toLocaleDateString()}</p>
          <p><strong>Zonas:</strong> ${fosa.taxonomies?.map(tax => tax.name).join(', ')}</p>
          <p>
            <strong>Indicios relacionados:</strong> ${numIndicios}
            <br>
            <a href="${urlFosa}" class="go-indicios-fosa" data-fosa="${fosaId}">Ver indicios de esta fosa</a>
            <br>
            <a href="${urlColectivo}" class="go-indicios-colectivo" data-colectivo="${colectivo}">Ver indicios de este colectivo</a>
          </p>
          <a href="https://${fosa.host}/?p=${fosa.id}" target="_blank" rel="noopener noreferrer">Ver más detalles</a>
        `;

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([parseFloat(fosa.meta.longitud[0]), parseFloat(fosa.meta.latitud[0])])
          .setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(popupHtml)
          )
          .addTo(mapRef.current);

        // Manejo de navegación interna para los enlaces del popup
        marker.getElement().addEventListener('click', (e) => {
          // Esperar a que el popup esté abierto
          setTimeout(() => {
            const popup = document.querySelector('.maplibregl-popup-content');
            if (popup) {
              // Filtro por fosa
              const linkFosa = popup.querySelector('.go-indicios-fosa');
              if (linkFosa) {
                linkFosa.onclick = (evt) => {
                  evt.preventDefault();
                  navigate(`/indicios?fosa_relacionada=${encodeURIComponent(fosaId)}`);
                };
              }
              // Filtro por colectivo
              const linkColectivo = popup.querySelector('.go-indicios-colectivo');
              if (linkColectivo) {
                linkColectivo.onclick = (evt) => {
                  evt.preventDefault();
                  navigate(`/indicios?host=${encodeURIComponent(colectivo)}`);
                };
              }
            }
          }, 0);
        });

        markersRef.current.push({ marker, fosa });
      }
    });
  }, [fosas, searchTerm, selectedColectivo, mapRef, conteoIndiciosPorFosa]);

  return <div ref={mapContainerRef} className="map-container"></div>;
}

export default FosasMap;

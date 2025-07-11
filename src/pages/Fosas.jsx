import React, { useState, useRef, useEffect } from 'react';
import { fetchSummaryData, fetchPostDetails, concurrentMap } from '../api/dataService';
import '../css/fosas.css';
import isMobile from '../util/isMobile';
import FosasSidebar from '../components/FosasSidebar';
import FosasMap from '../components/FosasMap';
import { Spinner } from '@canonical/react-components'; // Import Spinner
import { contarIndiciosPorFosa } from '../utils/relacionFosaIndicios';

function Fosas() {
  const [allFosas, setAllFosas] = useState([]); // Cambia fosas -> allFosas
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColectivo, setSelectedColectivo] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true); // State to track loading
  const [allIndicios, setAllIndicios] = useState([]); // Nuevo estado para indicios
  const isMobileDevice = isMobile();
  const mapRef = useRef(null); // Reference to the map instance

  const toggleSidebarHeight = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const handleTitleClick = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 12,
        essential: true,
      });
    }
    if (isMobileDevice && isExpanded) {
      setIsExpanded(false);
      const sidebar = document.querySelector('.sidebar-container.mobile');
      if (sidebar) {
        sidebar.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const summary = await fetchSummaryData();
        const filteredFosas = summary.filter(item => item.type === 'fosas');
        const filteredIndicios = summary.filter(item => item.type === 'indicios');

        // Usa concurrentMap importado
        const detailsFosas = await concurrentMap(
          filteredFosas,
          async (item) => {
            const detail = await fetchPostDetails(item.host, item.type, item.id);
            return detail ? { ...detail, host: item.host, type: item.type, id: item.id } : null;
          },
          5
        );
        const detailsIndicios = await concurrentMap(
          filteredIndicios,
          async (item) => {
            const detail = await fetchPostDetails(item.host, item.type, item.id);
            return detail ? { ...detail, host: item.host, type: item.type, id: item.id } : null;
          },
          5
        );

        const validFosas = detailsFosas.filter(item => item !== null);
        const validIndicios = detailsIndicios.filter(item => item !== null);

        setAllFosas(validFosas); // Guardar todas las fosas sin filtrar
        setAllIndicios(validIndicios);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  // Ya no filtrar aquí por instancias visibles
  const fosas = allFosas;
  const conteoIndiciosPorFosa = contarIndiciosPorFosa(allIndicios);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spinner text="Cargando fosas..." />
      </div>
    );
  }

  return (
    <div className="fosas-container">
      <FosasMap
        fosas={fosas}
        setFosas={setAllFosas}
        searchTerm={searchTerm}
        selectedColectivo={selectedColectivo}
        isMobileDevice={isMobileDevice}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        mapRef={mapRef} // Pass the map reference
        conteoIndiciosPorFosa={conteoIndiciosPorFosa} // Nuevo prop
      />
      <FosasSidebar
        fosas={fosas}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedColectivo={selectedColectivo}
        setSelectedColectivo={setSelectedColectivo}
        isExpanded={isExpanded}
        toggleSidebarHeight={toggleSidebarHeight}
        isMobileDevice={isMobileDevice}
        handleTitleClick={handleTitleClick} // Pass the click handler to the sidebar
      />
    </div>
  );
}

export default Fosas;

import React, { useState, useRef, useEffect } from 'react';
import { fetchSummaryData, fetchPostDetails } from '../api/dataService';
import '../css/fosas.css';
import isMobile from '../util/isMobile';
import FosasSidebar from '../components/FosasSidebar';
import FosasMap from '../components/FosasMap';
import { Spinner } from '@canonical/react-components'; // Import Spinner

function Fosas() {
  const [allFosas, setAllFosas] = useState([]); // Cambia fosas -> allFosas
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColectivo, setSelectedColectivo] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true); // State to track loading
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
        const filtered = summary.filter(item => item.type === 'fosas');

        const details = await Promise.all(
          filtered.map(async (item) => {
            const detail = await fetchPostDetails(item.host, item.type, item.id);
            return detail ? { ...detail, host: item.host, type: item.type, id: item.id } : null;
          })
        );

        const validFosas = details.filter(item => item !== null);
        setAllFosas(validFosas); // Guardar todas las fosas sin filtrar
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  // Ya no filtrar aquí por instancias visibles
  const fosas = allFosas;

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

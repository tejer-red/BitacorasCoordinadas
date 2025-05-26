const IndiciosList = ({ data }) => {
  return (
    <div className="grid-container">
      {data.map((item, index) => (
        <div key={index} className="grid-item">
          <h3 className="font-bold text-lg">{item.title?.rendered || 'Sin título'}</h3>
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.title?.rendered || 'Imagen del indicio'}
              style={{ width: '100%', height: 'auto', marginTop: '8px', marginBottom: '16px' }}
            />
          )}
          <p style={{ color: '#555' }}>
            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
              Ver más detalles
            </a>
          </p>
          <div style={{ marginTop: '8px' }}>
            <p><strong>Tipo de Prenda:</strong> {item.tipo_prenda_names?.join(', ') || 'No especificado'}</p>
            <p><strong>Color:</strong> {item.color?.join(', ') || 'No especificado'}</p>
            <p><strong>Material:</strong> {item.material?.join(', ') || 'No especificado'}</p>
          </div>
          <p style={{ marginTop: '8px', fontSize: '0.875rem', color: '#888' }}>
            <strong>Origen:</strong>{' '}
            <a href={item.origin} target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
              {item.origin || 'No disponible'}
            </a>
          </p>
        </div>
      ))}
    </div>
  );
};

export default IndiciosList;

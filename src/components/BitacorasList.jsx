const BitacorasList = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => (
        <div key={index} className="p-4 border-b">
          <h3 className="font-bold">{item.title?.rendered || `Bitácora ${index + 1}`}</h3>
          <div
            dangerouslySetInnerHTML={{
              __html: item.excerpt?.rendered || 'Zona rural al sur de Jalisco &#8211; La Resolana [texto simulado]',
            }}
            className="text-gray-600"
          />
          <p className="mt-2 text-sm text-gray-500">
            <strong>Origen:</strong>{' '}
            <a
              href={item.origin || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-blue-500 underline ${!item.origin && 'pointer-events-none text-gray-400'}`}
            >
              {item.origin || 'No disponible'}
            </a>
          </p>
        </div>
      ))}
    </div>
  );
};

export default BitacorasList;

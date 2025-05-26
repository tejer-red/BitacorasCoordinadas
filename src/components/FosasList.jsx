const FosasList = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => (
        <div key={index} className="p-4 border-b">
          <h3 className="font-bold">{item.title?.rendered || 'Sin título'}</h3>
          <p className="text-gray-600">{item.description || 'Sin descripción'}</p>
          <p className="mt-2 text-sm text-gray-500">
            <strong>Origen:</strong>{' '}
            <a href={item.origin} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {item.origin || 'No disponible'}
            </a>
          </p>
        </div>
      ))}
    </div>
  );
};

export default FosasList;

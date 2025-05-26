import { FixedSizeList } from 'react-window';

const ListRenderer = ({ data }) => {
  const Row = ({ index, style }) => (
    <div style={style} className="p-4 border-b">
      <h3 className="font-bold">{data[index].title?.rendered || 'Sin título'}</h3>
      <div 
        dangerouslySetInnerHTML={{ __html: data[index].excerpt?.rendered }} 
        className="text-gray-600"
      />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      width="100%"
      itemSize={150}
      itemCount={data.length}
    >
      {Row}
    </FixedSizeList>
  );
};

export default ListRenderer;
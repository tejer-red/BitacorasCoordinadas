import { useApiData } from '../api/useApiData';
import BitacorasList from '../components/BitacorasList';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Bitacoras = () => {
  const { data, isLoading, isError } = useApiData('bitacoras');

  if (isLoading) return <LoadingSkeleton count={5} />;
  if (isError) return <div>Error cargando datos</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bitácoras</h1>
      <BitacorasList data={data} />
    </div>
  );
};

export default Bitacoras;
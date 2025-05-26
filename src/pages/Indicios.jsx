import { useApiData } from '../api/useApiData';
import IndiciosList from '../components/IndiciosList';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Indicios = () => {
  const { data, isLoading, isError } = useApiData('indicios');

  if (isLoading) return <LoadingSkeleton count={5} />;
  if (isError) return <div>Error cargando datos</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Indicios</h1>
      <IndiciosList data={data} />
    </div>
  );
};

export default Indicios;

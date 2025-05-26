import { useApiData } from '../api/useApiData';
import FosasList from '../components/FosasList';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Fosas = () => {
  const { data, isLoading, isError } = useApiData('fosas');

  if (isLoading) return <LoadingSkeleton count={5} />;
  if (isError) return <div>Error cargando datos</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fosas</h1>
      <FosasList data={data} />
    </div>
  );
};

export default Fosas;

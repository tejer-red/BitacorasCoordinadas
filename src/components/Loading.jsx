import { Spinner } from '@canonical/react-components';

const Loading = ({ text = "Cargando..." }) => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <Spinner text={text} />
  </div>
);

export default Loading;

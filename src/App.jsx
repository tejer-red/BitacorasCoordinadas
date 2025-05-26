import { Tabs } from 'antd';
import Bitacoras from './pages/Bitacoras';
import Fosas from './pages/Fosas';
import Indicios from './pages/Indicios';

function App() {
  const items = [
    {
      key: '1',
      label: 'Bitácoras',
      children: <Bitacoras />,
    },
    {
      key: '2',
      label: 'Fosas',
      children: <Fosas />,
    },
    {
      key: '3',
      label: 'Indicios',
      children: <Indicios />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs
        defaultActiveKey="1"
        items={items}
        tabPosition="left"
        className="p-4"
      />
    </div>
  );
}

export default App;
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Archive from '@/pages/Archive';
import Settings from '@/pages/Settings';
import Workspace from '@/pages/Workspace';
import LivePolls from '@/pages/LivePolls';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="workspace" element={<Workspace />} />
        <Route path="livepolls" element={<LivePolls />} />
        <Route path="archive" element={<Archive />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

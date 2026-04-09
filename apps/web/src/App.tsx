import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { PipelineBuilder } from "./pages/PipelineBuilder";
import { Settings } from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pipeline" element={<PipelineBuilder />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

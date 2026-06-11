// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import About from "./pages/about/about.tsx";
import { createRoot } from "react-dom/client";
import type {ReactElement} from "react";
import Blog from "./pages/blog/blog.tsx";
import Projects from "./pages/projects/projects.tsx";
import "./pages/common/common.css";
import Art from "./pages/art/art.tsx";

export default function App(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/art" element={<Art />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
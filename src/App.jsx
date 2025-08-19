import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CategoryList from "./pages/CategoryList";
import CategoryForm from "./pages/CategoryForm";

import UserList from "./pages/UserList";
import UserForm from "./pages/UserForm";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="categorias" element={<CategoryList />} />
          <Route path="categorias/cadastrar" element={<CategoryForm />} />
          <Route path="usuarios">
            <Route index element={<UserList />} />
            <Route path="cadastrar" element={<UserForm />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

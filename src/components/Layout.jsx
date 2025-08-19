import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./Layout.css";

function Layout() {
  const [usuariosOpen, setUsuariosOpen] = useState(false);
  const [categoriasOpen, setCategoriasOpen] = useState(false);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="menu-link">
            Menu
          </Link>
          <ThemeToggle />
        </div>
        <nav>
          <ul>
            <li className="menu-usuarios">
              <span
                onClick={() => setUsuariosOpen((open) => !open)}
                style={{ cursor: "pointer", userSelect: "none" }}
                data-arrow={usuariosOpen ? "⌃" : "⌄"}
              >
                Usuários
              </span>
              {usuariosOpen && (
                <ul className="submenu">
                  <li>
                    <Link to="/usuarios">Lista de Usuários</Link>
                  </li>
                  <li>
                    <Link to="/usuarios/cadastrar">Cadastro de Usuários</Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="menu-categorias">
              <span
                onClick={() => setCategoriasOpen((open) => !open)}
                style={{ cursor: "pointer", userSelect: "none" }}
                data-arrow={categoriasOpen ? "⌃" : "⌄"}
              >
                Categorias
              </span>
              {categoriasOpen && (
                <ul className="submenu">
                  <li>
                    <Link to="/categorias">Lista de Categorias</Link>
                  </li>
                  <li>
                    <Link to="/categorias/cadastrar">
                      Cadastro de Categoria
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

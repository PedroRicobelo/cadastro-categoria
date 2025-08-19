import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { exportToCsv } from "../../utils/exportToCsv";

export default function CategoryList() {
  const categorias = [
    { id: 1, name: "Tecnologia", description: "Categoria de tecnologia" },
    { id: 2, name: "Alimentos", description: "Categoria de alimentos" },
    { id: 3, name: "Educação", description: "Categoria de educação" },
    { id: 4, name: "Saúde", description: "Categoria de saúde" },
    { id: 5, name: "Esportes", description: "Categoria de esportes" },
    { id: 6, name: "Moda", description: "Categoria de moda" },
  ];

  const [filtros, setFiltros] = useState({
    busca: "",
    name: "",
    description: "",
  });
  const [filtrosTemp, setFiltrosTemp] = useState({
    busca: "",
    name: "",
    description: "",
  });
  const [categoriasFiltradas, setCategoriasFiltradas] = useState(categorias);
  const [showFiltros, setShowFiltros] = useState(false);
  const [showColunas, setShowColunas] = useState(false);
  const [showEditarColunas, setShowEditarColunas] = useState(false);
  const [menuAcoesPos, setMenuAcoesPos] = useState({ top: 0, left: 0 });
  const [isExporting, setIsExporting] = useState(false);

  const [colunasVisiveis, setColunasVisiveis] = useLocalStorage(
    "category-columns",
    {
      name: true,
      description: true,
    }
  );

  const btnAcoesRef = useRef(null);
  const menuAcoesRef = useClickOutside(() => {
    setShowColunas(false);
    setShowEditarColunas(false);
  });

  React.useEffect(() => {
    const filtradas = categorias.filter((c) => {
      return (
        (!filtros.busca ||
          c.name.toLowerCase().includes(filtros.busca.toLowerCase()) ||
          c.description.toLowerCase().includes(filtros.busca.toLowerCase())) &&
        (!filtros.name ||
          c.name.toLowerCase().includes(filtros.name.toLowerCase())) &&
        (!filtros.description ||
          c.description
            .toLowerCase()
            .includes(filtros.description.toLowerCase()))
      );
    });
    setCategoriasFiltradas(filtradas);
  }, [filtros]);

  const handleAcoesClick = () => {
    setShowColunas((v) => {
      const next = !v;
      if (next && btnAcoesRef.current) {
        try {
          const btn = btnAcoesRef.current;
          const toolbar = btn.closest(".toolbar") || btn.parentElement;
          const btnRect = btn.getBoundingClientRect();
          const toolbarRect = toolbar.getBoundingClientRect();
          const left = btnRect.left - toolbarRect.left;
          const top = btnRect.bottom - toolbarRect.top + 8;
          setMenuAcoesPos({ left, top });
          setShowEditarColunas(false);
        } catch (error) {
          console.warn("Erro ao calcular posição do menu:", error);
          setMenuAcoesPos({ left: 0, top: 46 });
        }
      }
      return next;
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const colunasExport = [
        { key: "name", label: "Nome", visible: colunasVisiveis.name },
        {
          key: "description",
          label: "Descrição",
          visible: colunasVisiveis.description,
        },
      ];
      await new Promise((resolve) => setTimeout(resolve, 800));
      exportToCsv(categoriasFiltradas, colunasExport, "categorias.csv");
      alert("Exportação realizada com sucesso!");
    } catch (error) {
      console.error("Erro na exportação:", error);
      alert("Erro ao exportar dados.");
    } finally {
      setIsExporting(false);
      setShowColunas(false);
    }
  };

  const toggleAllColumns = () => {
    const all = Object.values(colunasVisiveis).every(Boolean);
    setColunasVisiveis({ name: !all, description: !all });
  };

  return (
    <div className="containers">
      <h1>Lista de Categorias</h1>

      <div className="toolbar">
        <input
          id="search-input"
          name="search"
          className="search-input"
          type="text"
          placeholder="Buscar"
          value={filtrosTemp?.busca ?? ""}
          onChange={(e) =>
            setFiltrosTemp({ ...filtrosTemp, busca: e.target.value })
          }
        />

        <div className="toolbar-actions">
          <button ref={btnAcoesRef} onClick={handleAcoesClick} className="btn">
            Ações <span>{showColunas ? "▴" : "▾"}</span>
          </button>

          <button className="btn" onClick={() => setShowFiltros((v) => !v)}>
            Filtros <span>{showFiltros ? "▴" : "▾"}</span>
          </button>

          <Link to="/categorias/cadastrar" className="link-reset">
            <button className="btn primary">Cadastrar Categoria</button>
          </Link>
        </div>

        {showColunas && (
          <div
            ref={menuAcoesRef}
            className="acoes-menu"
            style={{ top: menuAcoesPos.top, left: menuAcoesPos.left }}
          >
            {!showEditarColunas ? (
              <>
                <button
                  className="btn w-full"
                  onClick={() => setShowEditarColunas(true)}
                >
                  Editar Colunas
                </button>
                <button
                  className="btn w-full"
                  disabled={isExporting}
                  onClick={handleExport}
                >
                  {isExporting ? "Exportando..." : "Exportar para Excel"}
                </button>
                <div className="menu-footer">
                  <button
                    className="btn"
                    onClick={() => {
                      setShowColunas(false);
                      setShowEditarColunas(false);
                    }}
                  >
                    Fechar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="menu-title">Editar Colunas</div>
                <label className="row-between">
                  Selecionar Todos
                  <span className="switch">
                    <input
                      id="select-all-columns"
                      name="select-all-columns"
                      type="checkbox"
                      checked={Object.values(colunasVisiveis).every(Boolean)}
                      onChange={toggleAllColumns}
                    />
                    <span className="slider round"></span>
                  </span>
                </label>
                <label className="row-between">
                  Nome
                  <span className="switch">
                    <input
                      id="column-name"
                      name="column-name"
                      type="checkbox"
                      checked={colunasVisiveis.name}
                      onChange={() =>
                        setColunasVisiveis({
                          ...colunasVisiveis,
                          name: !colunasVisiveis.name,
                        })
                      }
                    />
                    <span className="slider round"></span>
                  </span>
                </label>
                <label className="row-between">
                  Descrição
                  <span className="switch">
                    <input
                      id="column-description"
                      name="column-description"
                      type="checkbox"
                      checked={colunasVisiveis.description}
                      onChange={() =>
                        setColunasVisiveis({
                          ...colunasVisiveis,
                          description: !colunasVisiveis.description,
                        })
                      }
                    />
                    <span className="slider round"></span>
                  </span>
                </label>
                <div className="menu-footer">
                  <button
                    className="btn"
                    onClick={() => setShowEditarColunas(false)}
                  >
                    Voltar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showFiltros && (
        <div className="filters-panel">
          <div className="filters-row">
            <div className="field">
              <label>Filtrar por Nome</label>
              <input
                id="filter-name"
                name="filter-name"
                type="text"
                value={filtrosTemp?.name ?? ""}
                onChange={(e) =>
                  setFiltrosTemp({ ...filtrosTemp, name: e.target.value })
                }
              />
            </div>
            <div className="field">
              <label>Filtrar por Descrição</label>
              <input
                id="filter-description"
                name="filter-description"
                type="text"
                value={filtrosTemp?.description ?? ""}
                onChange={(e) =>
                  setFiltrosTemp({
                    ...filtrosTemp,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="filters-actions">
            <button className="btn" onClick={() => setFiltros(filtrosTemp)}>
              Aplicar Filtros
            </button>
            <button
              className="btn"
              onClick={() => {
                const vazio = { busca: "", name: "", description: "" };
                setFiltrosTemp(vazio);
                setFiltros(vazio);
              }}
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              {colunasVisiveis.name && <th>Nome</th>}
              {colunasVisiveis.description && <th>Descrição</th>}
            </tr>
          </thead>
          <tbody>
            {categoriasFiltradas.map((categoria) => (
              <tr key={categoria.id}>
                {colunasVisiveis.name && <td>{categoria.name}</td>}
                {colunasVisiveis.description && (
                  <td className="descricao">
                    {categoria.description?.substring(0, 50) ?? ""}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

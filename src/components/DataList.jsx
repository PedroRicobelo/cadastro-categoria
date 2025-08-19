import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useClickOutside } from "../hooks/useClickOutside";
import { exportToCsv } from "../utils/exportToCsv";

export default function DataList({
  title,
  data,
  columnsConfig,
  addButtonText,
  addButtonLink,
  dataKey,
  onExport,
}) {
  const [showFiltros, setShowFiltros] = useState(false);
  const [showColunas, setShowColunas] = useState(false);
  const [showEditarColunas, setShowEditarColunas] = useState(false);
  const [menuAcoesPos, setMenuAcoesPos] = useState({ top: 0, left: 0 });
  const [isExporting, setIsExporting] = useState(false);

  const btnAcoesRef = useRef(null);
  const menuAcoesRef = useClickOutside(() => {
    setShowColunas(false);
    setShowEditarColunas(false);
  });

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
      const colunasExport = columnsConfig.map((col) => ({
        ...col,
        visible: data.colunasVisiveis[col.key],
      }));
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (onExport) {
        onExport(data.filteredData, colunasExport);
      } else {
        exportToCsv(data.filteredData, colunasExport, `${dataKey}.csv`);
      }

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
    const all = Object.values(data.colunasVisiveis).every(Boolean);
    const novo = {};
    for (const col of columnsConfig) {
      novo[col.key] = !all;
    }
    data.setColunasVisiveis(novo);
  };

  return (
    <div className="containers">
      <h1>{title}</h1>

      <div className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar"
          value={data.filtrosTemp?.busca ?? ""}
          onChange={(e) =>
            data.setFiltrosTemp({ ...data.filtrosTemp, busca: e.target.value })
          }
        />

        <div className="toolbar-actions">
          <button ref={btnAcoesRef} onClick={handleAcoesClick} className="btn">
            Ações <span>{showColunas ? "▴" : "▾"}</span>
          </button>

          <button className="btn" onClick={() => setShowFiltros((v) => !v)}>
            Filtros <span>{showFiltros ? "▴" : "▾"}</span>
          </button>

          <Link to={addButtonLink} className="link-reset">
            <button className="btn primary">{addButtonText}</button>
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
                      type="checkbox"
                      checked={Object.values(data.colunasVisiveis).every(
                        Boolean
                      )}
                      onChange={toggleAllColumns}
                    />
                    <span className="slider round"></span>
                  </span>
                </label>
                {columnsConfig.map((col) => (
                  <label key={col.key} className="row-between">
                    {col.label}
                    <span className="switch">
                      <input
                        type="checkbox"
                        checked={data.colunasVisiveis[col.key]}
                        onChange={() =>
                          data.setColunasVisiveis((cv) => ({
                            ...cv,
                            [col.key]: !cv[col.key],
                          }))
                        }
                      />
                      <span className="slider round"></span>
                    </span>
                  </label>
                ))}
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
            {columnsConfig.map((col) => (
              <div key={col.key} className="field">
                <label>Filtrar por {col.label}</label>
                <input
                  type="text"
                  value={data.filtrosTemp?.[col.key] ?? ""}
                  onChange={(e) =>
                    data.setFiltrosTemp({
                      ...data.filtrosTemp,
                      [col.key]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </div>
          <div className="filters-actions">
            <button className="btn" onClick={data.applyTempFilters}>
              Aplicar Filtros
            </button>
            <button className="btn" onClick={data.clearFilters}>
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              {columnsConfig.map(
                (col) =>
                  data.colunasVisiveis[col.key] && (
                    <th key={col.key}>{col.label}</th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {data.filteredData.map((item) => (
              <tr key={item.id}>
                {columnsConfig.map(
                  (col) =>
                    data.colunasVisiveis[col.key] && (
                      <td key={col.key}>
                        {col.render
                          ? col.render(item[col.key], item)
                          : item[col.key]}
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

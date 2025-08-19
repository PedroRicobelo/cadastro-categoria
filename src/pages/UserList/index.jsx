import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { exportToCsv } from "../../utils/exportToCsv";

export default function UserList() {
  const usuarios = [
    {
      id: 1,
      nome: "João Silva",
      cpf: "123.456.789-01",
      email: "joao@email.com",
      telefone: "(11) 99999-0001",
    },
    {
      id: 2,
      nome: "Maria Souza",
      cpf: "987.654.321-00",
      email: "maria@email.com",
      telefone: "(11) 99999-0002",
    },
    {
      id: 3,
      nome: "Pedro Gomes",
      cpf: "321.654.987-00",
      email: "pedro@email.com",
      telefone: "(21) 98888-0003",
    },
    {
      id: 4,
      nome: "Ana Lima",
      cpf: "111.222.333-44",
      email: "ana@email.com",
      telefone: "(31) 97777-0004",
    },
    {
      id: 5,
      nome: "Luiza Alves",
      cpf: "555.666.777-88",
      email: "luiza@email.com",
      telefone: "(41) 96666-0005",
    },
  ];

  const [filtros, setFiltros] = useState({
    busca: "",
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
  });
  const [filtrosTemp, setFiltrosTemp] = useState({
    busca: "",
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
  });
  const [usuariosFiltrados, setUsuariosFiltrados] = useState(usuarios);
  const [showFiltros, setShowFiltros] = useState(false);
  const [showColunas, setShowColunas] = useState(false);
  const [showEditarColunas, setShowEditarColunas] = useState(false);
  const [menuAcoesPos, setMenuAcoesPos] = useState({ top: 0, left: 0 });
  const [isExporting, setIsExporting] = useState(false);
  // Usando o hook useLocalStorage
  const [colunasVisiveis, setColunasVisiveis] = useLocalStorage(
    "user-columns-v2", // Nova chave para limpar configurações antigas
    {
      nome: true,
      cpf: true,
      email: true,
      telefone: true,
    }
  );

  const btnAcoesRef = useRef(null);
  const menuAcoesRef = useClickOutside(() => {
    setShowColunas(false);
    setShowEditarColunas(false);
  });

  // Aplicar filtros
  React.useEffect(() => {
    const filtrados = usuarios.filter((u) => {
      return (
        (!filtros.busca ||
          u.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
          u.email.toLowerCase().includes(filtros.busca.toLowerCase()) ||
          u.cpf.toLowerCase().includes(filtros.busca.toLowerCase()) ||
          u.telefone.toLowerCase().includes(filtros.busca.toLowerCase())) &&
        (!filtros.nome ||
          u.nome.toLowerCase().includes(filtros.nome.toLowerCase())) &&
        (!filtros.email ||
          u.email.toLowerCase().includes(filtros.email.toLowerCase())) &&
        (!filtros.cpf ||
          u.cpf.toLowerCase().includes(filtros.cpf.toLowerCase())) &&
        (!filtros.telefone ||
          u.telefone.toLowerCase().includes(filtros.telefone.toLowerCase()))
      );
    });
    setUsuariosFiltrados(filtrados);
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
        { key: "nome", label: "Nome", visible: colunasVisiveis.nome },
        { key: "cpf", label: "CPF", visible: colunasVisiveis.cpf },
        { key: "email", label: "Email", visible: colunasVisiveis.email },
        {
          key: "telefone",
          label: "Telefone",
          visible: colunasVisiveis.telefone,
        },
      ];
      await new Promise((resolve) => setTimeout(resolve, 800));
      exportToCsv(usuariosFiltrados, colunasExport, "usuarios.csv");
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
    setColunasVisiveis({
      nome: !all,
      cpf: !all,
      email: !all,
      telefone: !all,
    });
  };

  return (
    <div className="containers">
      <h1>Lista de Usuários</h1>

      <div className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar"
          value={filtros?.busca ?? ""}
          onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
        />

        <div className="toolbar-actions">
          <button ref={btnAcoesRef} onClick={handleAcoesClick} className="btn">
            Ações <span>{showColunas ? "▴" : "▾"}</span>
          </button>

          <button className="btn" onClick={() => setShowFiltros((v) => !v)}>
            Filtros <span>{showFiltros ? "▴" : "▾"}</span>
          </button>

          <Link to="/usuarios/cadastrar" className="link-reset">
            <button className="btn primary">Cadastrar Usuário</button>
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
                      type="checkbox"
                      checked={colunasVisiveis.nome}
                      onChange={() =>
                        setColunasVisiveis({
                          ...colunasVisiveis,
                          nome: !colunasVisiveis.nome,
                        })
                      }
                    />
                    <span className="slider round"></span>
                  </span>
                </label>
                <label className="row-between">
                  CPF
                  <span className="switch">
                    <input
                      type="checkbox"
                      checked={colunasVisiveis.cpf}
                      onChange={() =>
                        setColunasVisiveis({
                          ...colunasVisiveis,
                          cpf: !colunasVisiveis.cpf,
                        })
                      }
                    />
                    <span className="slider round"></span>
                  </span>
                </label>
                <label className="row-between">
                  Email
                  <span className="switch">
                    <input
                      type="checkbox"
                      checked={colunasVisiveis.email}
                      onChange={() =>
                        setColunasVisiveis({
                          ...colunasVisiveis,
                          email: !colunasVisiveis.email,
                        })
                      }
                    />
                    <span className="slider round"></span>
                  </span>
                </label>
                <label className="row-between">
                  Telefone
                  <span className="switch">
                    <input
                      type="checkbox"
                      checked={colunasVisiveis.telefone}
                      onChange={() =>
                        setColunasVisiveis({
                          ...colunasVisiveis,
                          telefone: !colunasVisiveis.telefone,
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
                type="text"
                value={filtrosTemp?.nome ?? ""}
                onChange={(e) =>
                  setFiltrosTemp({ ...filtrosTemp, nome: e.target.value })
                }
              />
            </div>
            <div className="field">
              <label>Filtrar por Email</label>
              <input
                type="text"
                value={filtrosTemp?.email ?? ""}
                onChange={(e) =>
                  setFiltrosTemp({ ...filtrosTemp, email: e.target.value })
                }
              />
            </div>
            <div className="field">
              <label>Filtrar por CPF</label>
              <input
                type="text"
                value={filtrosTemp?.cpf ?? ""}
                onChange={(e) =>
                  setFiltrosTemp({ ...filtrosTemp, cpf: e.target.value })
                }
              />
            </div>
            <div className="field">
              <label>Filtrar por Telefone</label>
              <input
                type="text"
                value={filtrosTemp?.telefone ?? ""}
                onChange={(e) =>
                  setFiltrosTemp({ ...filtrosTemp, telefone: e.target.value })
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
                const vazio = {
                  nome: "",
                  email: "",
                  cpf: "",
                  telefone: "",
                };
                setFiltrosTemp(vazio);
                setFiltros({ ...filtros, ...vazio });
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
              {colunasVisiveis.nome && <th>Nome</th>}
              {colunasVisiveis.cpf && <th>CPF</th>}
              {colunasVisiveis.email && <th>Email</th>}
              {colunasVisiveis.telefone && <th>Telefone</th>}
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id}>
                {colunasVisiveis.nome && <td>{usuario.nome}</td>}
                {colunasVisiveis.cpf && <td>{usuario.cpf}</td>}
                {colunasVisiveis.email && <td>{usuario.email}</td>}
                {colunasVisiveis.telefone && <td>{usuario.telefone}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

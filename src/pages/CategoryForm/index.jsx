import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CategoryForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setMessage({ type: "success", text: "Categoria salva com sucesso!" });
      setTimeout(() => navigate("/categorias"), 1000);
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      setMessage({
        type: "error",
        text: "Erro ao salvar categoria. Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (name || description) {
      if (
        window.confirm(
          "Tem certeza que deseja cancelar? Os dados serão perdidos."
        )
      ) {
        navigate("/categorias");
      }
    } else {
      navigate("/categorias");
    }
  };

  return (
    <div className="containers">
      <h1>Cadastrar Categoria</h1>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>
              Nome <span className="required">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome da categoria"
              disabled={isSaving}
              required
            />
          </div>

          <div className="input-group">
            <label>
              Descrição{" "}
              <span className="char-count">({description.length}/50)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value.substring(0, 50))}
              maxLength={50}
              disabled={isSaving}
              placeholder="Digite uma descrição (opcional)"
            />
          </div>

          <div className="button-group form-actions">
            <button
              type="button"
              className="btn cancel"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn save"
              disabled={isSaving || !name.trim()}
            >
              {isSaving ? (
                <>
                  <span className="spinner"></span>Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

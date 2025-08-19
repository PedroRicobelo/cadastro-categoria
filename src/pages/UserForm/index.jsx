import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  formatCPF,
  formatPhone,
  removeFormatting,
} from "../../utils/formatters";

export default function UserForm() {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar formatação baseada no campo
    if (name === "cpf") {
      formattedValue = formatCPF(value);
    } else if (name === "telefone") {
      formattedValue = formatPhone(value);
    }

    setForm((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório";

    // Validar CPF (apenas números)
    const cpfNumbers = removeFormatting(form.cpf);
    if (!cpfNumbers) newErrors.cpf = "CPF é obrigatório";
    else if (cpfNumbers.length !== 11)
      newErrors.cpf = "CPF deve ter 11 dígitos";

    if (!form.email.trim()) newErrors.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email inválido";

    // Validar telefone (apenas números)
    const phoneNumbers = removeFormatting(form.telefone);
    if (!phoneNumbers) newErrors.telefone = "Telefone é obrigatório";
    else if (phoneNumbers.length < 10 || phoneNumbers.length > 11)
      newErrors.telefone = "Telefone deve ter 10 ou 11 dígitos";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "Por favor, corrija os erros no formulário.",
      });
      return;
    }
    setIsSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setMessage({ type: "success", text: "Usuário cadastrado com sucesso!" });
      setTimeout(() => navigate("/usuarios"), 1000);
    } catch {
      setMessage({
        type: "error",
        text: "Erro ao cadastrar usuário. Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (Object.values(form).some((value) => value.trim())) {
      if (
        window.confirm(
          "Tem certeza que deseja cancelar? Os dados serão perdidos."
        )
      )
        navigate("/usuarios");
    } else {
      navigate("/usuarios");
    }
  };

  return (
    <div className="containers">
      <h1>Cadastro de Usuário</h1>

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
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Digite o nome completo"
              disabled={isSaving}
              className={errors.nome ? "error" : ""}
            />
            {errors.nome && (
              <span className="error-message">{errors.nome}</span>
            )}
          </div>

          <div className="input-group">
            <label>
              CPF <span className="required">*</span>
            </label>
            <input
              type="text"
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              maxLength={14}
              disabled={isSaving}
              className={errors.cpf ? "error" : ""}
            />
            {errors.cpf && <span className="error-message">{errors.cpf}</span>}
          </div>

          <div className="input-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Digite o email"
              disabled={isSaving}
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="input-group">
            <label>
              Telefone <span className="required">*</span>
            </label>
            <input
              type="tel"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              maxLength={15}
              disabled={isSaving}
              className={errors.telefone ? "error" : ""}
            />
            {errors.telefone && (
              <span className="error-message">{errors.telefone}</span>
            )}
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
            <button type="submit" className="btn save" disabled={isSaving}>
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

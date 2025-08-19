// Função para formatar CPF
export const formatCPF = (value) => {
  const numbers = value.replace(/\D/g, "");
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

// Função para formatar telefone
export const formatPhone = (value) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
};

// Função para remover formatação (apenas números)
export const removeFormatting = (value) => {
  return value.replace(/\D/g, "");
};

// Função para validar CPF (apenas estrutura, não validação matemática)
export const validateCPF = (cpf) => {
  const numbers = removeFormatting(cpf);
  return numbers.length === 11;
};

// Função para validar telefone
export const validatePhone = (phone) => {
  const numbers = removeFormatting(phone);
  return numbers.length >= 10 && numbers.length <= 11;
};

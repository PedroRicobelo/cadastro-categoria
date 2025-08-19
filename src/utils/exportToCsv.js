export function exportToCsv(
  data,
  columns,
  filename = "dados.csv",
  delimiter = ";"
) {
  try {
    if (!Array.isArray(data) || !Array.isArray(columns)) {
      throw new Error("Dados ou colunas inválidos");
    }

    const visibleColumns = columns.filter((c) => c.visible);
    if (visibleColumns.length === 0) {
      throw new Error("Nenhuma coluna visível para exportar");
    }

    const headers = visibleColumns.map((c) => c.label);
    const rows = data.map((item) =>
      visibleColumns.map((c) => {
        const value = item[c.key];
        return value ? String(value).replace(/;/g, ",") : "";
      })
    );

    let csvContent = "";
    csvContent += headers.join(delimiter) + "\n";
    rows.forEach((row) => {
      csvContent += row.join(delimiter) + "\n";
    });

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Limpar URL para evitar memory leaks
    setTimeout(() => URL.revokeObjectURL(url), 100);

    return true;
  } catch (error) {
    console.error("Erro na exportação CSV:", error);
    throw error;
  }
}

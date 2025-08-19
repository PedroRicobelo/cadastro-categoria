import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useDataList(dataKey, originalData, columnsConfig) {
  const [filtros, setFiltros] = useLocalStorage(`${dataKey}_filtros`, {
    busca: "",
    ...Object.fromEntries(columnsConfig.map((col) => [col.key, ""])),
  });

  const [filtrosTemp, setFiltrosTemp] = useState(() => ({
    busca: "",
    ...Object.fromEntries(columnsConfig.map((col) => [col.key, ""])),
  }));

  const [colunasVisiveis, setColunasVisiveis] = useLocalStorage(
    `${dataKey}_colunas`,
    Object.fromEntries(columnsConfig.map((col) => [col.key, col.visible]))
  );

  const [filteredData, setFilteredData] = useState(originalData);

  const applyFilters = useCallback(
    (data, filters) => {
      return data.filter((item) => {
        if (filters.busca) {
          const searchTerm = filters.busca.toLowerCase();
          const searchableFields = columnsConfig
            .map((col) => item[col.key])
            .join(" ")
            .toLowerCase();
          if (!searchableFields.includes(searchTerm)) {
            return false;
          }
        }

        for (const col of columnsConfig) {
          if (filters[col.key]) {
            const fieldValue = String(item[col.key] || "").toLowerCase();
            const filterValue = filters[col.key].toLowerCase();
            if (!fieldValue.includes(filterValue)) {
              return false;
            }
          }
        }

        return true;
      });
    },
    [columnsConfig]
  );

  useEffect(() => {
    setFiltrosTemp(filtros);
  }, [filtros]);

  useEffect(() => {
    const filtered = applyFilters(originalData, filtros);
    setFilteredData(filtered);
  }, [filtros, originalData, applyFilters]);

  const applyTempFilters = useCallback(() => {
    setFiltros(filtrosTemp);
  }, [filtrosTemp, setFiltros]);

  const clearFilters = useCallback(() => {
    const emptyFilters = {
      busca: "",
      ...Object.fromEntries(columnsConfig.map((col) => [col.key, ""])),
    };
    setFiltrosTemp(emptyFilters);
    setFiltros(emptyFilters);
  }, [columnsConfig, setFiltros]);

  return {
    filtros,
    filtrosTemp,
    setFiltrosTemp,
    colunasVisiveis,
    setColunasVisiveis,
    filteredData,
    applyTempFilters,
    clearFilters,
    columnsConfig,
  };
}

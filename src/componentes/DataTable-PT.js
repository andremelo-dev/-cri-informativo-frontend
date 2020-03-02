const textLabel = {
    body: {
        noMatch: "Desculpe, nenhum registro correspondente encontrado",
        toolTip: "Ordenar",
        columnHeaderTooltip: column => `Ordenar por ${column.label}`
      },
      pagination: {
        next: "Próxima",
        previous: "Anterior",
        rowsPerPage: "Resultados por pagina:",
        displayRows: "de",
      },
      toolbar: {
        search: "Procurar",
        downloadCsv: "Download CSV",
        print: "Imprimit",
        viewColumns: "Visualizar Colunas",
        filterTable: "Filtrar Tabela",
      },
      filter: {
        all: "Todos",
        title: "Filtros",
        reset: "Resetar",
      },
      viewColumns: {
        title: "Mostrar Colunas",
        titleAria: "Mostrar/Esconder Colunas da Tabela",
      },
      selectedRows: {
        text: "linha(s) selecionadas",
        delete: "Deletar",
        deleteAria: "Deletar linha selecionada",
      }
}

export default textLabel;
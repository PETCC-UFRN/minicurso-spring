document.addEventListener("DOMContentLoaded", function () {
  const datasAtivacao = {
    "primeiroDia": new Date("2026-02-23"), // A partir de 07/03/2025
    "segundoDia": new Date("2026-02-24"), // A partir de 11/03/2025
    "terceiroDia": new Date("2026-02-25"), // A partir de 12/03/2025
    "quartoDia": new Date("2026-02-26"), // A partir de 13/03/2025
    "quintoDia": new Date("2026-02-27"), // A partir de 14/03/2025
    "projetoFinalSimplificado": new Date("2025-03-14") // A partir de 14/03/2025
  };

  const agora = new Date();

  Object.keys(datasAtivacao).forEach(id => {
    const dataAtivacao = datasAtivacao[id];
    const link = document.getElementById(id);
    if (agora >= dataAtivacao) {
      link.classList.remove('inactive');
    }
  });
});


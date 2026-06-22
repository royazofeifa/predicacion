const territories = [
  { number: 29, name: "Planta Rio Seco" },
  { number: 15, name: "El Tecal" },
  { number: 27, name: "Coco-Los Angulo" },
  { number: 28, name: "Parcelas Rio Seco" },
  { number: 9, name: "El Cuadrante" },
  { number: 19, name: "Parcelas Calle 1" },
  { number: 10, name: "Filadelfia" },
  { number: 1, name: "Costa Brava" },
  { number: 4, name: "La Chatarrera" },
  { number: 16, name: "Cuadrante Damas" },
  { number: 17, name: "Estero Damas" },
  { number: 26, name: "Pocares" },
  { number: 20, name: "Parcelas Calle 2" },
  { number: 3, name: "Brooklyn" },
  { number: 8, name: "Pueblo Real" },
  { number: 25, name: "San Miguel de Valeria" },
  { number: 11, name: "La Cuchilla 1" },
  { number: 13, name: "Canta Rana" },
  { number: 5, name: "La bomba" },
  { number: 18, name: "Fátima" },
  { number: 22, name: "Salón Comunal 2" },
  { number: 23, name: "Super 2000 hacia Valeria" },
  { number: 21, name: "Salón Comunal 1" },
  { number: 24, name: "San Antonio de Valeria" },
  { number: 2, name: "La Tortuga" },
  { number: 7, name: "Los Delfines" },
  { number: 12, name: "La Cuchilla 2" },
  { number: 14, name: "San Rafael" },
];

const defaults = {
  weekStart: "2026-06-22",
  tuesdayCaptain: "Roy. Azofeifa",
  tuesdayMeeting: "Rancho Alegre Damas",
  tuesdayTerritory: "17",
  saturdayCaptain: "Mario. López",
  saturdayMeeting: "Casetilla de la entreda a canta rana (San Rafael)",
  saturdayTerritory: "14",
};

const storageKey = "predicacion-programa-v1";

const fields = {
  weekStart: document.getElementById("weekStart"),
  tuesdayCaptain: document.getElementById("tuesdayCaptain"),
  tuesdayMeeting: document.getElementById("tuesdayMeeting"),
  tuesdayTerritory: document.getElementById("tuesdayTerritory"),
  saturdayCaptain: document.getElementById("saturdayCaptain"),
  saturdayMeeting: document.getElementById("saturdayMeeting"),
  saturdayTerritory: document.getElementById("saturdayTerritory"),
};

const preview = {
  weekTitle: document.getElementById("weekTitle"),
  tuesdayCaptain: document.getElementById("previewTuesdayCaptain"),
  tuesdayMeeting: document.getElementById("previewTuesdayMeeting"),
  tuesdayTerritory: document.getElementById("previewTuesdayTerritory"),
  saturdayCaptain: document.getElementById("previewSaturdayCaptain"),
  saturdayMeeting: document.getElementById("previewSaturdayMeeting"),
  saturdayTerritory: document.getElementById("previewSaturdayTerritory"),
};

const saveProgram = document.getElementById("saveProgram");
const shareProgram = document.getElementById("shareProgram");
const printProgram = document.getElementById("printProgram");
const resetProgram = document.getElementById("resetProgram");

function territoryLabel(number) {
  const territory = territories.find((item) => String(item.number) === String(number));
  return territory ? `${territory.number} — ${territory.name}` : "";
}

function formatDateRange(value) {
  const start = new Date(`${value}T00:00:00`);
  if (Number.isNaN(start.getTime())) return "Del lunes al domingo";

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const monthFormatter = new Intl.DateTimeFormat("es-CR", { month: "long" });
  const startMonth = monthFormatter.format(start);
  const endMonth = monthFormatter.format(end);
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  if (startMonth === endMonth) {
    return `Del ${startDay} al ${endDay} de ${capitalize(startMonth)} ${year}`;
  }

  return `Del ${startDay} de ${capitalize(startMonth)} al ${endDay} de ${capitalize(endMonth)} ${year}`;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function populateTerritories() {
  const options = territories
    .slice()
    .sort((a, b) => a.number - b.number)
    .map((territory) => `<option value="${territory.number}">${territory.number} — ${territory.name}</option>`)
    .join("");

  fields.tuesdayTerritory.innerHTML = options;
  fields.saturdayTerritory.innerHTML = options;
}

function getProgram() {
  return Object.fromEntries(
    Object.entries(fields).map(([key, element]) => [key, element.value.trim()]),
  );
}

function setProgram(program) {
  Object.entries(fields).forEach(([key, element]) => {
    element.value = program[key] ?? defaults[key];
  });
  updatePreview();
}

function updatePreview() {
  const program = getProgram();
  preview.weekTitle.textContent = formatDateRange(program.weekStart);
  preview.tuesdayCaptain.textContent = program.tuesdayCaptain;
  preview.tuesdayMeeting.textContent = program.tuesdayMeeting;
  preview.tuesdayTerritory.textContent = territoryLabel(program.tuesdayTerritory);
  preview.saturdayCaptain.textContent = program.saturdayCaptain;
  preview.saturdayMeeting.textContent = program.saturdayMeeting;
  preview.saturdayTerritory.textContent = territoryLabel(program.saturdayTerritory);
}

function loadSavedProgram() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || defaults;
  } catch {
    return defaults;
  }
}

function saveCurrentProgram() {
  localStorage.setItem(storageKey, JSON.stringify(getProgram()));
  saveProgram.textContent = "Guardado";
  window.setTimeout(() => {
    saveProgram.textContent = "Guardar";
  }, 1400);
}

function encodeProgram(program) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(program))));
}

async function copyShareLink() {
  const program = getProgram();
  const shareUrl = new URL("compartir.html", window.location.href);
  shareUrl.searchParams.set("programa", encodeProgram(program));

  try {
    await navigator.clipboard.writeText(shareUrl.href);
    shareProgram.textContent = "Enlace copiado";
  } catch {
    window.prompt("Copia este enlace:", shareUrl.href);
  }

  window.setTimeout(() => {
    shareProgram.textContent = "Copiar enlace para compartir";
  }, 1600);
}

populateTerritories();
setProgram(loadSavedProgram());

Object.values(fields).forEach((field) => {
  field.addEventListener("input", updatePreview);
  field.addEventListener("change", updatePreview);
});

saveProgram.addEventListener("click", saveCurrentProgram);
shareProgram.addEventListener("click", copyShareLink);
printProgram.addEventListener("click", () => window.print());
resetProgram.addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  setProgram(defaults);
});

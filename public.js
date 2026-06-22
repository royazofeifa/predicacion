const territories = [
  { number: 1, name: "Costa Brava" },
  { number: 2, name: "La Tortuga" },
  { number: 3, name: "Brooklyn" },
  { number: 4, name: "La Chatarrera" },
  { number: 5, name: "La bomba" },
  { number: 7, name: "Los Delfines" },
  { number: 8, name: "Pueblo Real" },
  { number: 9, name: "El Cuadrante" },
  { number: 10, name: "Filadelfia" },
  { number: 11, name: "La Cuchilla 1" },
  { number: 12, name: "La Cuchilla 2" },
  { number: 13, name: "Canta Rana" },
  { number: 14, name: "San Rafael" },
  { number: 15, name: "El Tecal" },
  { number: 16, name: "Cuadrante Damas" },
  { number: 17, name: "Estero Damas" },
  { number: 18, name: "Fátima" },
  { number: 19, name: "Parcelas Calle 1" },
  { number: 20, name: "Parcelas Calle 2" },
  { number: 21, name: "Salón Comunal 1" },
  { number: 22, name: "Salón Comunal 2" },
  { number: 23, name: "Super 2000 hacia Valeria" },
  { number: 24, name: "San Antonio de Valeria" },
  { number: 25, name: "San Miguel de Valeria" },
  { number: 26, name: "Pocares" },
  { number: 27, name: "Coco-Los Angulo" },
  { number: 28, name: "Parcelas Rio Seco" },
  { number: 29, name: "Planta Rio Seco" },
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

function territoryLabel(number) {
  const territory = territories.find((item) => String(item.number) === String(number));
  return territory ? `${territory.number} — ${territory.name}` : "";
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
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

function decodeProgram(value) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(value))));
  } catch {
    return null;
  }
}

function loadProgram() {
  const urlProgram = new URLSearchParams(window.location.search).get("programa");
  if (urlProgram) return { ...defaults, ...decodeProgram(urlProgram) };

  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(storageKey)) };
  } catch {
    return defaults;
  }
}

function buildDays(program) {
  return [
    {
      day: "Lunes",
      captain: "Roy. Azofeifa",
      meeting: "Zoom",
      territory: "Predicación por Zoom",
      time: "6:00 pm",
      type: "zoom",
    },
    {
      day: "Martes",
      captain: program.tuesdayCaptain,
      meeting: program.tuesdayMeeting,
      territory: territoryLabel(program.tuesdayTerritory),
      time: "9:30 am",
      type: "field",
    },
    {
      day: "Miércoles",
      captain: "",
      meeting: "",
      territory: "Predicación por grupo",
      time: "",
      type: "group",
    },
    {
      day: "Jueves",
      captain: "",
      meeting: "",
      territory: "Predicación por grupo",
      time: "",
      type: "group",
    },
    {
      day: "Viernes",
      captain: "",
      meeting: "",
      territory: "Predicación por grupo",
      time: "",
      type: "group",
    },
    {
      day: "Sábado",
      captain: program.saturdayCaptain,
      meeting: program.saturdayMeeting,
      territory: territoryLabel(program.saturdayTerritory),
      time: "9:30 am",
      type: "field",
    },
  ];
}

function renderMobileCards(days) {
  document.getElementById("mobileProgram").innerHTML = days
    .map(
      (item) => `
        <article class="day-card ${item.type}">
          <div class="day-head">
            <strong>${item.day}</strong>
            ${item.time ? `<span>${item.time}</span>` : ""}
          </div>
          ${
            item.captain
              ? `<div class="detail"><span>Capitán</span><strong>${item.captain}</strong></div>`
              : ""
          }
          ${
            item.meeting
              ? `<div class="detail"><span>Punto de encuentro</span><strong>${item.meeting}</strong></div>`
              : ""
          }
          <div class="detail"><span>Territorio</span><strong>${item.territory}</strong></div>
        </article>
      `,
    )
    .join("");
}

function renderProgram() {
  const program = loadProgram();
  const days = buildDays(program);

  document.getElementById("publicWeek").textContent = formatDateRange(program.weekStart);
  document.getElementById("publicTuesdayCaptain").textContent = program.tuesdayCaptain;
  document.getElementById("publicTuesdayMeeting").textContent = program.tuesdayMeeting;
  document.getElementById("publicTuesdayTerritory").textContent = territoryLabel(program.tuesdayTerritory);
  document.getElementById("publicSaturdayCaptain").textContent = program.saturdayCaptain;
  document.getElementById("publicSaturdayMeeting").textContent = program.saturdayMeeting;
  document.getElementById("publicSaturdayTerritory").textContent = territoryLabel(program.saturdayTerritory);
  renderMobileCards(days);
}

renderProgram();

let currentStep = 0;
let stepsData = [];
let stepsElements = [];

let currentAudio = null;
let currentProgressBar = null;

let map = L.map('map').setView([41.9028, 12.4964], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

/* ===== FETCH ===== */
fetch('data.json')
  .then(res => res.json())
  .then(data => {

    let itinerario = data.itinerari[0];

    document.getElementById("info").innerHTML = `
      <h2>${itinerario.personaggio.nome}</h2>
      <p>${itinerario.personaggio.biografia_breve}</p>

      <div class="meta">
        ⏱ <b>Durata:</b> ${itinerario.durata_totale_ore} ore<br>
        📏 <b>Distanza:</b> ${itinerario.distanza_totale_km} km<br>
        📊 <b>Difficoltà:</b> ${itinerario.difficolta}<br>
        🌸 <b>Periodo consigliato:</b> ${itinerario.periodo_consigliato}
      </div>

      <div class="meta">
        🏛 <b>Tema:</b> ${itinerario.tema}<br>
        🎭 <b>Categoria:</b> ${itinerario.categoria}
      </div>

      <div class="descrizione">
        ${itinerario.descrizione}
      </div>
    `;

    stepsData = itinerario.tappe;

    createSteps();
  })
  .catch(err => console.error("Errore JSON:", err));

/* ===== TAPPE ===== */
function createSteps() {
  let container = document.getElementById("tappe");

  let immagini = {
    "Piazza San Pietro": ["sanpietro1.jpg","sanpietro2.jpg"],
    "Foro Romano": ["foro1.jpg","foro2.jpg"],
    "Pantheon": ["pantheon1.jpg","pantheon2.jpg"],
    "Fontana di Trevi": ["trevi1.jpg","trevi2.jpg"]
  };

  stepsData.forEach((step, i) => {

    let imgs = immagini[step.nome] || [];

    let sliderHTML = imgs.map((src, index) =>
      `<img src="${src}" class="slide ${index === 0 ? 'active' : ''}">`
    ).join("");

    let puntiHTML = (step.punti_interesse || []).map(p =>
      `<div class="poi">
        <b>${p.nome}</b>
        <p>${p.descrizione}</p>
      </div>`
    ).join("");

    let div = document.createElement("div");
    div.className = "tappa";

    div.innerHTML = `
      <h3>${step.numero}. ${step.nome}</h3>

      <div class="audio-player">
        <button onclick="toggleAudio(${i}, this)">▶️ Play</button>
        <div class="audio-bar">
          <div class="audio-progress" id="progress-${i}"></div>
        </div>
      </div>

      <div class="slider" id="slider-${i}">
        ${sliderHTML}
      </div>

      <p>${step.descrizione_breve}</p>

      <div class="descrizione">
        ${step.descrizione_estesa || ""}
      </div>

      <div class="commento-vasi">
        <b>👁‍🗨 Lo sguardo di Vasi</b><br>
        ${step.commento_vasi || ""}
      </div>

      <div class="poi-container">
        <h4>📍 Cosa vedere</h4>
        ${puntiHTML}
      </div>

      <div class="meta">
        ⏱ ${step.durata_visita_min} min<br>
        📍 ${step.indicazioni_arrivo}
      </div>
    `;

    container.appendChild(div);
    stepsElements.push(div);

    let lat = step.coordinate[0];
    let lng = step.coordinate[1];

    L.marker([lat, lng]).addTo(map).bindPopup(step.nome);

    if (imgs.length > 1) {
      startSlider(`slider-${i}`);
    }
  });
}

/* ===== SLIDER ===== */
function startSlider(id) {
  let slider = document.getElementById(id);
  let slides = slider.querySelectorAll(".slide");
  let index = 0;

  setInterval(() => {
    slides.forEach(s => s.classList.remove("active"));
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 3000);
}

/* ===== AUDIO ===== */
function toggleAudio(index, button) {
  let step = stepsData[index];
  let progressBar = document.getElementById(`progress-${index}`);

  if (!step.audio) {
    alert("Audio non disponibile");
    return;
  }

  if (currentAudio && currentAudio !== step.audioObj) {
    currentAudio.pause();
  }

  if (!step.audioObj) {
    step.audioObj = new Audio(step.audio);
  }

  let audio = step.audioObj;

  if (audio.paused) {
    audio.play();
    button.innerText = "⏸ Pausa";

    currentAudio = audio;
    currentProgressBar = progressBar;

    audio.ontimeupdate = () => {
      let percent = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = percent + "%";
    };

    audio.onended = () => {
      button.innerText = "▶️ Play";
      progressBar.style.width = "0%";
    };

  } else {
    audio.pause();
    button.innerText = "▶️ Play";
  }
}

/* ===== NAVIGAZIONE ===== */
function showStep(index) {
  stepsElements.forEach((el, i) => {
    el.classList.remove("active");
    if (i === index) el.classList.add("active");
  });

  let step = stepsData[index];
  map.setView([step.coordinate[0], step.coordinate[1]], 15);

  document.getElementById("progress").innerText =
    "Tappa " + (index + 1);

  let percent = ((index + 1) / stepsData.length) * 100;
  document.getElementById("progress-fill").style.width = percent + "%";
}

function startTour() {
  currentStep = 0;
  showStep(currentStep);
  document.querySelector(".controls").style.display = "block";
}

function nextStep() {
  if (currentStep < stepsData.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

function startTourScroll() {
  startTour();
  document.getElementById("tappe").scrollIntoView({
    behavior: "smooth"
  });
}

fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    const itinerario = data.itinerari[0];

    /* HERO */
    document.getElementById("titolo").innerText = itinerario.nome;
    document.getElementById("sottotitolo").innerText = itinerario.sottotitolo;

    /* DETTAGLI GENERALI ITINERARIO */
    document.getElementById("itinerario-descrizione").innerText = itinerario.descrizione;
    document.getElementById("itinerario-tema").innerText = itinerario.tema;
    document.getElementById("itinerario-categoria").innerText = itinerario.categoria;
    document.getElementById("itinerario-durata").innerText = itinerario.durata_totale_ore;
    document.getElementById("itinerario-distanza").innerText = itinerario.distanza_totale_km;
    document.getElementById("itinerario-difficolta").innerText = itinerario.difficolta;
    document.getElementById("itinerario-costo").innerText = itinerario.costo_stimato;
    document.getElementById("itinerario-periodo").innerText = itinerario.periodo_consigliato;
    document.getElementById("itinerario-mesi").innerText = itinerario.stagione_migliore.join(", ");
    document.getElementById("itinerario-logistica").innerText = itinerario.note_logistiche;
    document.getElementById("itinerario-accessibilita").innerText = itinerario.accessibilita;

    /* PERSONAGGIO */
    document.getElementById("personaggio-img").src = itinerario.personaggio.immagine;
    document.getElementById("personaggio-nome").innerText = itinerario.personaggio.nome;
    document.getElementById("personaggio-anni").innerText = itinerario.personaggio.anni;
    document.getElementById("personaggio-professione").innerText = itinerario.personaggio.professione;
    document.getElementById("personaggio-nazionalita").innerText = itinerario.personaggio.nazionalita;
    document.getElementById("personaggio-bio").innerText = itinerario.personaggio.biografia_breve;
    
    const opereList = document.getElementById("personaggio-opere");
    itinerario.personaggio.opere_correlate.forEach(opera => {
      const li = document.createElement("li");
      li.innerText = opera;
      opereList.appendChild(li);
    });

    /* MAPPA */
    const map = L.map("map").setView([41.8925, 12.4853], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    /* TIMELINE & TAPPE CONTAINERS */
    const timeline = document.getElementById("timeline-list");
    const container = document.getElementById("tappe-container");

    /* IMMAGINI SLIDER */
    const immagini = {
      "Piazza San Pietro": ["immagini/sanpietro1.jpg", "immagini/sanpietro2.jpg"],
      "Foro Romano": ["immagini/foro1.jpg", "immagini/foro2.jpg"],
      "Pantheon": ["immagini/pantheon1.jpg", "immagini/pantheon2.jpg"],
      "Fontana di Trevi": ["immagini/trevi1.jpg", "immagini/trevi2.jpg"],
    };

    itinerario.tappe.forEach((tappa, i) => {
      /* TIMELINE POPULATION */
      const timeDiv = document.createElement("div");
      timeDiv.className = "timeline-item";
      timeDiv.innerHTML = `
        <h3>${tappa.numero}</h3>
        <p>${tappa.nome}</p>
      `;
      timeline.appendChild(timeDiv);

      /* MAP MARKERS */
      if (tappa.coordinate) {
        L.marker(tappa.coordinate).addTo(map).bindPopup(`<b>${tappa.nome}</b>`);
      }

      /* SLIDER GENERATION */
      const imgs = immagini[tappa.nome] || [];
      const sliderHTML = imgs
        .map((src, index) => `<img src="${src}" class="slide ${index === 0 ? "active" : ""}">`)
        .join("");

      // Generazione dinamica dell'esperienza culturale se presente nel JSON (es. Tappa 1)
      let expHTML = "";
      if (tappa.esperienza_culturale) {
        const exp = tappa.esperienza_culturale;
        expHTML = `
          <div class="esperienza-culturale-box">
            <h3>🎨 Esperienza Culturale Integrata</h3>
            
            ${exp.musica ? `
              <div class="exp-sezione">
                <h4>🎵 Accompagnamento Musicale</h4>
                <p><b>Brano:</b> ${exp.musica.brano_completo} (${exp.musica.compositore}, ${exp.musica.anno_composizione})</p>
                <p><b>Dettagli:</b> ${exp.musica.movimento} in ${exp.musica.tonalita} (${exp.musica.organico})</p>
                <p><i>"${exp.musica.descrizione_musical}"</i></p>
                <p>🎧 <b>Note d'ascolto:</b> ${exp.musica.note_ascolto}</p>
                <div class="exp-links">
                  <a href="${exp.musica.spotify_url}" target="_blank" class="btn-link spot">Spotify</a>
                  <a href="${exp.musica.youtube_url}" target="_blank" class="btn-link yt">YouTube</a>
                </div>
              </div>
            ` : ""}

            ${exp.letteratura ? `
              <div class="exp-sezione">
                <h4>📖 Letteratura e Contesto</h4>
                <p><b>Citazione:</b> ${exp.letteratura.citazione}</p>
                <p><b>Tratto da:</b> ${exp.letteratura.opera} (${exp.letteratura.anno}) di ${exp.letteratura.autore}</p>
                <p>💡 <b>Contesto:</b> ${exp.letteratura.contesto}</p>
              </div>
            ` : ""}

            ${exp.atmosfera ? `
              <div class="exp-sezione">
                <h4>🌤️ Atmosfera & Fotografia</h4>
                <p><b>Momento ideale:</b> ${exp.atmosfera.momento} con luce ${exp.atmosfera.luce} (~${exp.atmosfera.temperatura_stimata})</p>
                <p>👥 <b>Affollamento:</b> ${exp.atmosfera.affollamento} | 🎭 <b>Emozione:</b> ${exp.atmosfera.emozione_target}</p>
                <p>🔊 <b>Suoni ambiente:</b> ${exp.atmosfera.suoni_ambiente.join(", ")}</p>
                <p>📸 <b>Consiglio Fotografico:</b> ${exp.atmosfera.consiglio_fotografico}</p>
              </div>
            ` : ""}

            ${exp.arte_visiva ? `
              <div class="exp-sezione">
                <h4>🏛️ Architettura e Arte</h4>
                <p><b>Stile:</b> ${exp.arte_visiva.stile_architettonico} (${exp.arte_visiva.anno_costruzione})</p>
                <p><b>Architetti:</b> ${exp.arte_visiva.architetti.join(", ")} | <b>Committente:</b> ${exp.arte_visiva.committente}</p>
                <p>${exp.arte_visiva.descrizione}</p>
              </div>
            ` : ""}
          </div>
        `;
      }

      /* CARDS CONTENT POPULATION */
      const div = document.createElement("div");
      div.className = "tappa";
      div.innerHTML = `
        <h2>${tappa.numero}. ${tappa.nome}</h2>
        <p class="orario-tag">🕒 Consigliato ore ${tappa.orario_consigliato} (${tappa.momento_giornata})</p>
        <p class="desc-breve">${tappa.descrizione_breve}</p>

        <div class="audio-player">
          <button class="audio-btn" onclick="toggleAudio(${i}, this)">▶ Play Guida</button>
          <div class="audio-bar">
            <div class="audio-progress" id="progress-${i}"></div>
          </div>
        </div>

        <div class="slider" id="slider-${i}">
          ${sliderHTML}
        </div>
        <p class="didascalia-incisione">📷 <i>${tappa.didascalia || ""}</i></p>

        <div class="meta">
          ⏱ <b>Durata Visita:</b> ${tappa.durata_visita_min} min
          <br><br>
          📍 <b>Come Arrivare:</b> ${tappa.indicazioni_arrivo}
        </div>

        <div class="testi-tappa">
          <p><b>Storia:</b> ${tappa.storia}</p>
          <p>💡 <b>Curiosità:</b> ${tappa.curiosita}</p>
        </div>

        <p style="margin-top:20px; line-height:1.8;">
          ${tappa.descrizione_estesa}
        </p>

        <blockquote>
          ${tappa.commento_vasi || ""}
        </blockquote>

        <div class="servizi-tappa">
          <span>🔓 Accesso: ${tappa.metadata.accessibilita}</span> | 
          <span>📅 Orari: ${tappa.metadata.orari_standard}</span> | 
          <span>🛠️ Servizi in zona: ${tappa.metadata.servizi.join(", ")}</span>
        </div>

        ${expHTML}
      `;

      container.appendChild(div);
      startSlider(`slider-${i}`);
    });

    /* LISTE FINALI (Cosa portare, Consigli, ecc) */
    const consigliUl = document.getElementById("lista-consigli");
    itinerario.consigli_pratici.forEach(item => {
      const li = document.createElement("li");
      li.innerText = item;
      consigliUl.appendChild(li);
    });

    const oggettiUl = document.getElementById("lista-oggetti");
    itinerario.cosa_portare.forEach(item => {
      const li = document.createElement("li");
      li.innerText = item;
      oggettiUl.appendChild(li);
    });

    const sconsigliatoUl = document.getElementById("lista-sconsigliato");
    itinerario.sconsigliato.forEach(item => {
      const li = document.createElement("li");
      li.innerText = item;
      sconsigliatoUl.appendChild(li);
    });
  });

/* ======================
   LOGICA SLIDER ANIMATI
====================== */
function startSlider(id) {
  const slider = document.getElementById(id);
  if (!slider) return;
  const slides = slider.querySelectorAll(".slide");
  if (slides.length <= 1) return;
  let index = 0;

  setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 3000);
}

/* ======================
   LOGICA AUDIO
====================== */
let currentAudio = null;
let currentButton = null;

function toggleAudio(index, button) {
  const audioSrc = `audio/tappa${index + 1}.mp3`;

  if (currentAudio && !currentAudio.paused && currentAudio.src.includes(audioSrc)) {
    currentAudio.pause();
    button.innerText = "▶ Play Guida";
    return;
  }

  if (currentAudio && currentAudio.paused && currentAudio.src.includes(audioSrc)) {
    currentAudio.play();
    button.innerText = "⏸ Pausa";
    return;
  }

  if (currentAudio) {
    currentAudio.pause();
    if (currentButton) currentButton.innerText = "▶ Play Guida";
  }

  const audio = new Audio(audioSrc);
  const progress = document.getElementById(`progress-${index}`);

  currentAudio = audio;
  currentButton = button;

  audio.play();
  button.innerText = "⏸ Pausa";

  audio.ontimeupdate = () => {
    if (audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progress.style.width = percent + "%";
    }
  };

  audio.onended = () => {
    button.innerText = "▶ Play Guida";
    progress.style.width = "0%";
    if (currentAudio === audio) {
      currentAudio = null;
      currentButton = null;
    }
  };
}
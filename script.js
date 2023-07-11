// Fungsi untuk konversi nilai ke skala 1-5
function convertToScale(value, min, max) {
  let scaledValue = ((value - min) / (max - min)) * 4 + 1;
  if (scaledValue > 5) {
    scaledValue = 5;
  }
  if (scaledValue < 1) {
    scaledValue = 1;
  }
  return scaledValue;
}
// Fungsi untuk konversi seluruh data ke skala 1-5
function convertDataToScale(players) {
  console.log("Data: ", players);
  players.forEach(function (player) {
    const data = player.data;

    data.match = convertToScale(data.match, 10, 200);
    data.avgGPM = convertToScale(data.avgGPM, 300, 1000);
    data.avgXPM = convertToScale(data.avgXPM, 300, 1000);
    data.avgKill = convertToScale(data.avgKill, 0, 15);
    data.avgAssist = convertToScale(data.avgAssist, 0, 15);
    data.avgDmg = convertToScale(data.avgDmg, 5000, 50000);
    data.heroPool = convertToScale(data.heroPool, 5, 30);
    data.comm = convertToScale(data.comm, 50, 100);
    data.tourney = convertToScale(data.tourney, 0, 5);

    Object.keys(data).forEach(function (key) {
      data[key] = Number(data[key].toFixed(2));
    });
  });
}
//Normalisasi menggunakan metode SAW
function normalizeData(players) {
  const numAttributes = Object.keys(players[0].data).length;
  const normalizedData = [];

  for (let i = 0; i < numAttributes; i++) {
    const attribute = Object.keys(players[0].data)[i];

    const attributeValues = players.map((player) => player.data[attribute]);
    const maxValue = Math.max(...attributeValues);

    const normalizedAttribute = attributeValues.map((value) => {
      return value / maxValue;
    });

    normalizedData.push(normalizedAttribute);
  }
  console.log("normalize: ", normalizedData);
  return normalizedData;
}
function calculateScores(players, weights) {
  const numAttributes = Object.keys(players[0].data).length;
  const numPlayers = players.length;

  convertDataToScale(players);

  const normalizedData = normalizeData(players);

  // Menghitung nilai bobot normalisasi
  const weightedData = [];
  for (let i = 0; i < numAttributes; i++) {
    const attributeWeight = Object.values(weights)[i];
    const weightedAttribute = normalizedData[i].map(
      (value) => value * attributeWeight
    );
    weightedData.push(weightedAttribute);
  }
  console.log("weighted: ", weightedData);

  // Menghitung solusi ideal positif (A+) dan solusi ideal negatif (A-)
  const idealPositive = weightedData.map((attribute) => Math.max(...attribute));
  const idealNegative = weightedData.map((attribute) => Math.min(...attribute));

  // Menghitung jarak euclidean terhadap solusi ideal positif (D+)
  const positiveDistances = [];
  for (let i = 0; i < numPlayers; i++) {
    const playerDistance = Math.sqrt(
      weightedData.reduce((sum, attribute, j) => {
        return sum + Math.pow(idealPositive[j] - attribute[i], 2);
      }, 0)
    );
    positiveDistances.push(playerDistance);
  }
  console.log("D+: ", positiveDistances);

  // Menghitung jarak euclidean terhadap solusi ideal positif (D-)
  const negativeDistances = [];
  for (let i = 0; i < numPlayers; i++) {
    const playerDistance = Math.sqrt(
      weightedData.reduce((sum, attribute, j) => {
        return sum + Math.pow(attribute[i] - idealNegative[j], 2);
      }, 0)
    );
    negativeDistances.push(playerDistance);
  }
  console.log("D-: ", negativeDistances);

  // Menghitung nilai preferensi
  const topsisScores = [];
  for (let i = 0; i < numPlayers; i++) {
    const topsisScore =
      negativeDistances[i] / (positiveDistances[i] + negativeDistances[i]);
    topsisScores.push(topsisScore);
  }
  console.log("V: ", topsisScores);
  return topsisScores;
}

// Fungsi untuk pemilihan roster menggunakan metode SAW-TOPSIS
function chooseRoster(players, weights) {
  const topsisScores = calculateScores(players, weights);

  // Menentukan pemain dengan nilai preferensi tertinggi
  const maxScore = Math.max(...topsisScores);
  const chosenPlayers = players.filter(
    (player, index) => topsisScores[index] === maxScore
  );

  return chosenPlayers;
}
// Fungsi untuk memasukkan nilai bobot
function calculateWeights(players) {
  const avgMatchWeight = parseFloat(document.getElementById("match").value);
  const avgGPMWeight = parseFloat(document.getElementById("avgGPM").value);
  const avgXPMWeight = parseFloat(document.getElementById("avgXPM").value);
  const avgKillWeight = parseFloat(document.getElementById("avgKill").value);
  const avgAssistWeight = parseFloat(
    document.getElementById("avgAssist").value
  );
  const avgDmgWeight = parseFloat(document.getElementById("avgDmg").value);
  const heroPoolWeight = parseFloat(document.getElementById("heroPool").value);
  const commWeight = parseFloat(document.getElementById("commWeight").value);
  const tourneyWeight = parseFloat(
    document.getElementById("tourneyWeight").value
  );

  const weights = {
    match: avgMatchWeight,
    avgGPM: avgGPMWeight,
    avgXPM: avgXPMWeight,
    avgKill: avgKillWeight,
    avgAssist: avgAssistWeight,
    avgDmg: avgDmgWeight,
    heroPool: heroPoolWeight,
    comm: commWeight,
    tourney: tourneyWeight,
  };
  console.log("weight: ", weights);
  return weights;
}
// Fungsi untuk mengambil data player dan memulai perhitungan
function importPlayersData() {
  const xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", "players.json", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const players = JSON.parse(xhr.responseText).players;
      const weights = calculateWeights(players);
      const chosenPlayer = chooseRoster(players, weights);

      const playerName = chosenPlayer[0].name;
      let html = `<h2>Player terpilih:</h2>
                  <h1>${playerName}</h1>`;
      document.querySelector("#chosen-player").innerHTML = html;
      console.log("Chosen Player: ", chosenPlayer);
    }
  };
  xhr.send();
}

//Update weight sesuai role
function updateWeights() {
  const roleSelect = document.getElementById("roleSelect");
  const role = roleSelect.value;

  let matchWeight,
    avgGPMWeight,
    avgXPMWeight,
    avgKillWeight,
    avgAssistWeight,
    avgDmgWeight,
    heroPoolWeight,
    commWeight,
    tourneyWeight;

  if (role === "core") {
    matchWeight = 0.1;
    avgGPMWeight = 0.2;
    avgXPMWeight = 0.2;
    avgKillWeight = 0.1;
    avgAssistWeight = 0.1;
    avgDmgWeight = 0.15;
    heroPoolWeight = 0.05;
    commWeight = 0.1;
    tourneyWeight = 0.1;
  } else if (role === "support") {
    matchWeight = 0.2;
    avgGPMWeight = 0.05;
    avgXPMWeight = 0.05;
    avgKillWeight = 0.05;
    avgAssistWeight = 0.25;
    avgDmgWeight = 0.1;
    heroPoolWeight = 0.15;
    commWeight = 0.15;
    tourneyWeight = 0.1;
  }

  document.getElementById("match").value = matchWeight;
  document.getElementById("avgGPM").value = avgGPMWeight;
  document.getElementById("avgXPM").value = avgXPMWeight;
  document.getElementById("avgKill").value = avgKillWeight;
  document.getElementById("avgAssist").value = avgAssistWeight;
  document.getElementById("avgDmg").value = avgDmgWeight;
  document.getElementById("heroPool").value = heroPoolWeight;
  document.getElementById("commWeight").value = commWeight;
  document.getElementById("tourneyWeight").value = tourneyWeight;
}

// Ambil data dari file JSON
fetch("players.json")
  .then((response) => response.json())
  .then((data) => {
    // Manipulasi data JSON
    const players = data.players;
    let html = `
        <table width="100%" style="margin-bottom:2rem; border:none; text-align: center">
            <thead>
                <tr>
                <th>Name</th>
                <th>Match Count</th>
                <th>Avg GPM</th>
                <th>Avg XPM</th>
                <th>Avg Kill</th>
                <th>Avg Assist</th>
                <th>Avg Damage</th>
                <th>Hero Pool</th>
                <th>Communication</th>
                <th>Tournament</th>
                </tr>
            </thead>
            <tbody>
                ${players
                  .map(
                    (player) => `
                <tr>
                    <td>${player.name}</td>
                    <td>${player.data.match}</td>
                    <td>${player.data.avgGPM}</td>
                    <td>${player.data.avgXPM}</td>
                    <td>${player.data.avgKill}</td>
                    <td>${player.data.avgAssist}</td>
                    <td>${player.data.avgDmg}</td>
                    <td>${player.data.heroPool}</td>
                    <td>${player.data.comm}</td>
                    <td>${player.data.tourney}</td>
                </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
     `;
    // Tampilkan data di elemen dengan id "players"
    document.getElementById("players").innerHTML += html;
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Atualiza o fundo conforme o horário local
function atualizarTema() {
  const hora = new Date().getHours();
  document.body.classList.toggle("night", hora >= 18 || hora < 6);
  document.body.classList.toggle("day", hora >= 6 && hora < 18);
}

atualizarTema();

document.getElementById("weather-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const city = document.getElementById("city-input").value.trim();
  const resultDiv = document.getElementById("weather-result");
  const errorMessage = document.getElementById("error-message");
  const cityName = document.getElementById("city-name");
  const temperature = document.getElementById("temperature");
  const conditions = document.getElementById("conditions");
  const dateTime = document.getElementById("date-time");
  const weatherIcon = document.getElementById("weather-icon");

  // Limpa mensagens anteriores
  errorMessage.classList.add("hidden");
  resultDiv.classList.add("hidden");

  if (!city) {
    errorMessage.textContent = "Por favor, insira o nome de uma cidade.";
    errorMessage.classList.remove("hidden");
    return;
  }

  try {
    // 1️⃣ Buscar latitude e longitude
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
    );
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Cidade não encontrada.");
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2️⃣ Buscar previsão atual
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const weatherData = await weatherResponse.json();

    const temp = weatherData.current_weather.temperature;
    const code = weatherData.current_weather.weathercode;
    const horaConsulta = new Date();

    // 3️⃣ Dicionário de ícones e descrições
    const weatherMap = {
      0: { text: "Céu limpo", icon: "wi-day-sunny" },
      1: { text: "Principalmente limpo", icon: "wi-day-sunny-overcast" },
      2: { text: "Parcialmente nublado", icon: "wi-day-cloudy" },
      3: { text: "Nublado", icon: "wi-cloudy" },
      45: { text: "Nevoeiro", icon: "wi-fog" },
      51: { text: "Garoa leve", icon: "wi-sprinkle" },
      61: { text: "Chuva leve", icon: "wi-showers" },
      71: { text: "Neve leve", icon: "wi-snow" },
      95: { text: "Trovoadas", icon: "wi-thunderstorm" },
    };

    const weatherInfo = weatherMap[code] || { text: "Condição desconhecida", icon: "wi-na" };

    // 4️⃣ Exibir dados
    cityName.textContent = `${name}, ${country}`;
    temperature.textContent = `Temperatura: ${temp}°C`;
    conditions.textContent = weatherInfo.text;
    weatherIcon.className = `wi ${weatherInfo.icon}`;

    // 5️⃣ Data e hora formatadas
    const dataFormatada = horaConsulta.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const horaFormatada = horaConsulta.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    dateTime.textContent = `${dataFormatada}, ${horaFormatada}`;

    // 6️⃣ Atualiza o tema de acordo com horário
    atualizarTema();

    resultDiv.classList.remove("hidden");
  } catch (error) {
    errorMessage.textContent = "Erro: " + error.message;
    errorMessage.classList.remove("hidden");
  }
});
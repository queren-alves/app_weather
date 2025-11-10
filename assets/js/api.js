// Função principal para buscar o clima
document.getElementById("weather-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const city = document.getElementById("city-input").value.trim();
  const resultDiv = document.getElementById("weather-result");
  const errorMessage = document.getElementById("error-message");
  const cityName = document.getElementById("city-name");
  const temperature = document.getElementById("temperature");
  const conditions = document.getElementById("conditions");

  // Limpa mensagens anteriores
  errorMessage.classList.add("hidden");
  resultDiv.classList.add("hidden");

  if (!city) {
    errorMessage.textContent = "Por favor, insira o nome de uma cidade.";
    errorMessage.classList.remove("hidden");
    return;
  }

  try {
    // 1️⃣ Buscar latitude e longitude da cidade usando API de geocodificação
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
    );

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Cidade não encontrada.");
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2️⃣ Buscar previsão do tempo atual
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    const weatherData = await weatherResponse.json();

    const temp = weatherData.current_weather.temperature;
    const desc = weatherData.current_weather.weathercode;

    // Tradução básica do código meteorológico (simplificado)
    const weatherDescriptions = {
      0: "Céu limpo ☀️",
      1: "Principalmente limpo 🌤️",
      2: "Parcialmente nublado ⛅",
      3: "Nublado ☁️",
      45: "Nevoeiro 🌫️",
      51: "Garoa leve 🌦️",
      61: "Chuva leve 🌧️",
      71: "Neve leve ❄️",
      95: "Trovoadas ⛈️",
    };

    const conditionText = weatherDescriptions[desc] || "Condição desconhecida";

    // 3️⃣ Exibir resultado
    cityName.textContent = `${name}, ${country}`;
    temperature.textContent = `Temperatura: ${temp}°C`;
    conditions.textContent = conditionText;

    resultDiv.classList.remove("hidden");

  } catch (error) {
    errorMessage.textContent = "Erro: " + error.message;
    errorMessage.classList.remove("hidden");
  }
});
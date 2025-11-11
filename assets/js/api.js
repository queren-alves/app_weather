/**
 * Atualiza dinamicamente o tema da página (claro ou escuro)
 * conforme o horário local do usuário.
 *
 * Entre 6h e 18h, aplica o tema "day".
 * Fora desse intervalo, aplica o tema "night".
 *
 * @function atualizarTema
 * @example
 * // Altera automaticamente o tema ao carregar a página
 * atualizarTema();
 *
 * @throws {Error} Caso o objeto `document` não esteja disponível
 * (por exemplo, em ambiente Node.js sem DOM).
 */
function atualizarTema() {
  if (typeof document === "undefined") return;

  const hora = new Date().getHours();
  document.body.classList.toggle("night", hora >= 18 || hora < 6);
  document.body.classList.toggle("day", hora >= 6 && hora < 18);
}

/**
 * Busca informações meteorológicas atuais e previsão para 5 dias
 * de uma cidade, utilizando a API pública do Open-Meteo.
 *
 * O processo ocorre em duas etapas:
 * 1️⃣ Busca de coordenadas (latitude/longitude) da cidade via API de geocodificação.  
 * 2️⃣ Consulta das condições climáticas atuais e previsão de 5 dias.
 *
 * @async
 * @function buscarClimaPorCidade
 * @description
 * Busca informações meteorológicas atuais e previsão de 5 dias para uma cidade informada.
 * Inclui variáveis adicionais: umidade, velocidade do vento e precipitação.
 *
 * @param {string} cidade - Nome da cidade a ser consultada.
 * @returns {Promise<Object>} Dados meteorológicos completos.
 * @throws {Error} Se a cidade não for encontrada, a entrada estiver vazia, ou a API falhar.
 */

async function buscarClimaPorCidade(cidade) {
  if (!cidade || cidade.trim() === "") {
    throw new Error("Por favor, insira o nome de uma cidade.");
  }

  // 🔹 1. Buscar coordenadas da cidade
  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`
  );
  const geoData = await geoResponse.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("Cidade não encontrada.");
  }

  const { latitude, longitude, name, country } = geoData.results[0];

  // 🔹 2. Buscar clima atual + previsão de 5 dias com variáveis adicionais
  const weatherResponse = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weathercode` + // <-- adicionamos weathercode aqui
    `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,relative_humidity_2m_max,relative_humidity_2m_min` + // <-- e aqui também
    `&forecast_days=7&timezone=auto`
  );

  if (weatherResponse.status === 429) {
    throw new Error("Limite de requisições da API excedido. Tente novamente mais tarde.");
  }

  const weatherData = await weatherResponse.json();

  // 🔹 3. Validar formato esperado
  if (!weatherData.current || !weatherData.daily) {
    throw new Error("Formato inesperado de resposta da API.");
  }

  // 🔹 4. Montar objeto final formatado
  return {
    city: `${name}, ${country}`,
    current: {
      temperature: weatherData.current.temperature_2m,
      humidity: `${weatherData.current.relative_humidity_2m}%`,
      precipitation: `${weatherData.current.precipitation ?? 0} mm`,
      wind_speed: `${weatherData.current.wind_speed_10m} km/h`,
      weathercode: weatherData.current.weathercode,
      time: weatherData.current.time,
    },
    forecast: weatherData.daily.time.map((date, index) => ({
      date,
      max: weatherData.daily.temperature_2m_max[index],
      min: weatherData.daily.temperature_2m_min[index],
      precipitation: `${weatherData.daily.precipitation_sum[index]} mm`,
      wind_max: `${weatherData.daily.wind_speed_10m_max[index]} km/h`,
      humidity_avg: `${Math.round(
        (weatherData.daily.relative_humidity_2m_max[index] +
          weatherData.daily.relative_humidity_2m_min[index]) / 2
      )}%`,
      weathercode: weatherData.daily.weathercode
      ? weatherData.daily.weathercode[index]
      : null, 
    })),
  };
}

/**
 * 🎨 Conecta a interface (HTML) com a API de clima.
 * Gerencia eventos de formulário, exibe os resultados e erros.
 */
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    atualizarTema();

    const form = document.getElementById("weather-form");
    const cityInput = document.getElementById("city-input");
    const resultDiv = document.getElementById("weather-result");
    const errorMessage = document.getElementById("error-message");
    const cityName = document.getElementById("city-name");
    const temperature = document.getElementById("temperature");
    const conditions = document.getElementById("conditions");
    const dateTime = document.getElementById("date-time");
    const weatherIcon = document.getElementById("weather-icon");
    const humidityEl = document.getElementById("humidity");
    const windEl = document.getElementById("wind-speed");
    const precipEl = document.getElementById("precipitation");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const city = cityInput.value.trim();

      errorMessage.classList.add("hidden");
      resultDiv.classList.add("hidden");

      if (!city) {
        errorMessage.textContent = "Por favor, insira o nome de uma cidade.";
        errorMessage.classList.remove("hidden");
        return;
      }

      try {
        const dados = await buscarClimaPorCidade(city);

        const code = dados.current.weathercode;
        const temp = dados.current.temperature;
        const horaConsulta = new Date(dados.current.time);

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

        const weatherInfo = weatherMap[code] || {
          text: "Condição desconhecida",
          icon: "wi-na",
        };

        cityName.textContent = dados.city;
        temperature.textContent = `Temperatura: ${temp}°C`;
        conditions.textContent = weatherInfo.text;
        weatherIcon.className = `wi ${weatherInfo.icon}`;

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
        humidityEl.textContent = dados.current.humidity || "--%";
        windEl.textContent = dados.current.wind_speed || "-- km/h";
        precipEl.textContent = dados.current.precipitation || "-- mm";

        // 🌤️ Exibir previsão dos próximos 5 dias
        const forecastContainer = document.getElementById("forecast");
        forecastContainer.innerHTML = ""; 

          const hoje = new Date();
          const previsoesFuturas = dados.forecast
            .filter(dia => new Date(dia.date).setHours(0, 0, 0, 0) > hoje.setHours(0, 0, 0, 0))
            .slice(0, 5);

          previsoesFuturas.forEach((dia) => {
          const dateObj = new Date(dia.date);
          const nomeDia = dateObj.toLocaleDateString("pt-BR", {
            weekday: "short",
          });
          
          const dataCurta = dateObj.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          });

          const weatherCode = dia.weathercode;
          const condition = weatherMap[weatherCode] || {
            text: "Condição desconhecida",
            icon: "wi-na",
          };

          const div = document.createElement("div");
          div.classList.add("forecast-day");
          div.innerHTML = `
            <p class="forecast-date">${nomeDia}, ${dataCurta}</p>
            <i class="wi ${condition.icon}"></i>
            <p><strong>Máx:</strong> ${dia.max}°C</p>
            <p><strong>Mín:</strong> ${dia.min}°C</p>
            <p>💧 ${dia.humidity_avg}</p>
            <p>🌬️ ${dia.wind_max}</p>
            <p>☔ ${dia.precipitation}</p>
          `;
          forecastContainer.appendChild(div);
        });

        atualizarTema();
        resultDiv.classList.remove("hidden");
      } catch (error) {
        errorMessage.textContent = "Erro: " + error.message;
        errorMessage.classList.remove("hidden");
      }
    });
  });
}

// Exporta para testes (Jest)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { buscarClimaPorCidade, atualizarTema };
}
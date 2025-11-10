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
 * Busca informações meteorológicas atuais de uma cidade,
 * utilizando a API pública do Open-Meteo.
 *
 * O processo ocorre em duas etapas:
 * 1️⃣ Busca de coordenadas (latitude/longitude) da cidade via API de geocodificação.  
 * 2️⃣ Consulta das condições climáticas atuais com base nas coordenadas obtidas.
 *
 * @async
 * @function buscarClimaPorCidade
 *
 * @param {string} city - Nome da cidade a ser consultada.
 *
 * @returns {Promise<Object>} Retorna um objeto contendo os dados meteorológicos atuais:
 * ```json
 * {
 *   "temperature": 23.4,
 *   "weathercode": 1
 * }
 * ```
 *
 * @throws {Error} Se o nome da cidade for vazio.
 * @throws {Error} Se a cidade não for encontrada na API de geocodificação.
 * @throws {Error} Se ocorrer um erro de rede ou falha na resposta da API.
 * @throws {Error} Se o formato da resposta da API não contiver o campo `current_weather`.
 *
 * @example
 * // Exemplo de uso:
 * buscarClimaPorCidade("São Paulo")
 *   .then((dados) => {
 *     console.log(`Temperatura atual: ${dados.temperature}°C`);
 *   })
 *   .catch((erro) => {
 *     console.error("Erro ao buscar clima:", erro.message);
 *   });
 */
async function buscarClimaPorCidade(city) {
  if (!city || city.trim() === "") {
    throw new Error("Por favor, insira o nome de uma cidade.");
  }

  // Buscar coordenadas
  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
  );
  const geoData = await geoResponse.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("Cidade não encontrada.");
  }

  const { latitude, longitude } = geoData.results[0];

  // Buscar dados meteorológicos
  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  );

  if (!weatherResponse.ok) {
    if (weatherResponse.status === 429) {
      throw new Error("Limite de requisições da API excedido. Tente novamente mais tarde.");
    }
    throw new Error("Erro ao obter dados meteorológicos.");
  }

  const weatherData = await weatherResponse.json();

  if (!weatherData.current_weather) {
    throw new Error("Formato inesperado de resposta da API.");
  }

  return weatherData.current_weather;
}

/**
 * 🎨 Conecta a interface (HTML) com a API de clima.
 * Gerencia eventos de formulário, exibe os resultados e erros.
 */
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    atualizarTema(); // Aplica o tema inicial

    const form = document.getElementById("weather-form");
    const cityInput = document.getElementById("city-input");
    const resultDiv = document.getElementById("weather-result");
    const errorMessage = document.getElementById("error-message");
    const cityName = document.getElementById("city-name");
    const temperature = document.getElementById("temperature");
    const conditions = document.getElementById("conditions");
    const dateTime = document.getElementById("date-time");
    const weatherIcon = document.getElementById("weather-icon");

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
        // Busca os dados de clima e também os dados de localização formatados
        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
        );
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
          throw new Error("Cidade não encontrada.");
        }

        const { name: nomeFormatado, country } = geoData.results[0];

        // Agora busca o clima usando as coordenadas
        const { latitude, longitude } = geoData.results[0];
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const weatherData = await weatherResponse.json();

        const code = weatherData.current_weather.weathercode;
        const temp = weatherData.current_weather.temperature;
        const horaConsulta = new Date();

        // Mapeia códigos do Open-Meteo para ícones e textos
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

        cityName.textContent = `${nomeFormatado}, ${country}`;
        temperature.textContent = `Temperatura: ${temp}°C`;
        conditions.textContent = weatherInfo.text;
        weatherIcon.className = `wi ${weatherInfo.icon}`;

        // Data e hora completas
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
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
  const hora = new Date().getHours();
  if (typeof document !== "undefined") {
    document.body.classList.toggle("night", hora >= 18 || hora < 6);
    document.body.classList.toggle("day", hora >= 6 && hora < 18);
  }
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

module.exports = { buscarClimaPorCidade, atualizarTema };
/**
 * @jest-environment node
 */

const { buscarClimaPorCidade } = require("../assets/js/api");
require("jest-fetch-mock").enableMocks();

const MSGS = {
  CIDADE_VAZIA: "Por favor, insira o nome de uma cidade.",
  CIDADE_NAO_ENCONTRADA: "Cidade não encontrada.",
  LIMITE_API: "Limite de requisições da API excedido. Tente novamente mais tarde.",
  FORMATO_INESPERADO: "Formato inesperado de resposta da API.",
};

describe("🌦️ Testes da API Open-Meteo (variáveis adicionais)", () => {
  beforeEach(() => fetch.resetMocks());

  test("1️⃣ Retorna clima atual com umidade, vento e precipitação + previsão de 5 dias", async () => {
    // Mock da API de geocodificação
    fetch
      .mockResponseOnce(
        JSON.stringify({
          results: [{ latitude: -23.55, longitude: -46.63, name: "São Paulo", country: "Brasil" }],
        })
      )
      // Mock da API Open-Meteo (com variáveis adicionais)
      .mockResponseOnce(
        JSON.stringify({
          current: {
            temperature_2m: 25,
            relative_humidity_2m: 65,
            precipitation: 1.2,
            wind_speed_10m: 15,
            time: "2025-11-11T12:00",
          },
          daily: {
            time: ["2025-11-12", "2025-11-13", "2025-11-14", "2025-11-15", "2025-11-16"],
            temperature_2m_max: [30, 29, 28, 27, 26],
            temperature_2m_min: [20, 19, 18, 17, 16],
            precipitation_sum: [2.1, 0.5, 1.8, 0.0, 3.2],
            wind_speed_10m_max: [18, 20, 17, 15, 19],
            relative_humidity_2m_max: [70, 75, 80, 78, 77],
            relative_humidity_2m_min: [55, 50, 52, 49, 51],
          },
        })
      );

    const dados = await buscarClimaPorCidade("São Paulo");

    expect(dados.current).toEqual(
      expect.objectContaining({
        temperature: 25,
        humidity: "65%",
        precipitation: "1.2 mm",
        wind_speed: "15 km/h",
      })
    );

    expect(dados.forecast[0]).toEqual(
      expect.objectContaining({
        date: expect.any(String),
        max: expect.any(Number),
        min: expect.any(Number),
        precipitation: expect.stringMatching(/mm/),
        wind_max: expect.stringMatching(/km\/h/),
        humidity_avg: expect.stringMatching(/%/),
      })
    );
  });

  test("2️⃣ Erros e mensagens continuam funcionando corretamente", async () => {
    fetch.mockResponseOnce(JSON.stringify({ results: [] }));
    await expect(buscarClimaPorCidade("Xablau")).rejects.toThrow(MSGS.CIDADE_NAO_ENCONTRADA);
  });

  test("3️⃣ Entrada vazia retorna erro", async () => {
    await expect(buscarClimaPorCidade("")).rejects.toThrow(MSGS.CIDADE_VAZIA);
  });

  test("4️⃣ Limite de API (429) gera erro tratado", async () => {
    fetch
      .mockResponseOnce(JSON.stringify({ results: [{ latitude: 1, longitude: 2 }] }))
      .mockResponseOnce("", { status: 429 });

    await expect(buscarClimaPorCidade("Paris")).rejects.toThrow(MSGS.LIMITE_API);
  });

  test("5️⃣ Formato inesperado de resposta lança erro", async () => {
    fetch
      .mockResponseOnce(JSON.stringify({ results: [{ latitude: 1, longitude: 2 }] }))
      .mockResponseOnce(JSON.stringify({ foo: "bar" }));

    await expect(buscarClimaPorCidade("Londres")).rejects.toThrow(MSGS.FORMATO_INESPERADO);
  });
});
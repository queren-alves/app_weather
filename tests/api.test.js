/**
 * @jest-environment node
 */

const { buscarClimaPorCidade } = require("../assets/js/api");
require("jest-fetch-mock").enableMocks();

describe("🔍 Testes básicos da API Open-Meteo", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test("1️⃣ Nome de cidade válido retorna dados meteorológicos", async () => {
    fetch
      .mockResponseOnce(
        JSON.stringify({
          results: [{ latitude: -23.55, longitude: -46.63 }],
        })
      )
      .mockResponseOnce(
        JSON.stringify({
          current_weather: { temperature: 25, weathercode: 1 },
        })
      );

    const dados = await buscarClimaPorCidade("São Paulo");

    expect(dados).toHaveProperty("temperature", 25);
    expect(dados).toHaveProperty("weathercode", 1);
  });

  test("2️⃣ Nome de cidade inexistente lança exceção tratada", async () => {
    fetch.mockResponseOnce(JSON.stringify({ results: [] }));

    await expect(buscarClimaPorCidade("CidadeInexistente"))
      .rejects
      .toThrow("Cidade não encontrada.");
  });

  test("3️⃣ Entrada vazia retorna erro de validação", async () => {
    await expect(buscarClimaPorCidade("")).rejects.toThrow("Por favor, insira o nome de uma cidade.");
  });

  test("4️⃣ Falha da API gera resposta adequada (timeout ou erro)", async () => {
    fetch
      .mockResponseOnce(
        JSON.stringify({ results: [{ latitude: 10, longitude: 20 }] })
      )
      .mockRejectOnce(new Error("Timeout de conexão"));

    await expect(buscarClimaPorCidade("Lisboa")).rejects.toThrow("Timeout de conexão");
  });
});

describe("⚠️ Casos extremos da API", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test("🚫 Limite de requisições da API excedido", async () => {
    fetch
      .mockResponseOnce(
        JSON.stringify({ results: [{ latitude: 10, longitude: 20 }] })
      )
      .mockResponseOnce("", { status: 429 });

    await expect(buscarClimaPorCidade("Rio de Janeiro")).rejects.toThrow(
      "Erro ao obter dados meteorológicos."
    );
  });

  test("🐢 Conexão de rede lenta/instável", async () => {
  jest.setTimeout(10000); // tempo maior p/ o teste

  // 1️⃣ Mock da API de geocodificação
  fetch
    .mockResponseOnce(
      JSON.stringify({
        results: [{ latitude: -23.55, longitude: -46.63 }],
      })
    )
    // 2️⃣ Mock da API de clima (simulando resposta lenta)
    .mockResponseOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => {
            resolve(
              JSON.stringify({
                current_weather: { temperature: 25, weathercode: 0 },
              })
            );
          }, 4000) // atraso de 4s
        )
    );

  const data = await buscarClimaPorCidade("São Paulo");
  expect(data).toHaveProperty("temperature");
});

  test("💥 Mudança inesperada no formato da resposta JSON", async () => {
    fetch
      .mockResponseOnce(
        JSON.stringify({ results: [{ latitude: 10, longitude: 20 }] })
      )
      .mockResponseOnce(JSON.stringify({ climaErrado: { temp: 22 } }));

    await expect(buscarClimaPorCidade("Curitiba")).rejects.toThrow(
      "Formato inesperado de resposta da API."
    );
  });
});
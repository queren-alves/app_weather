
# 🌦️ Previsão do Tempo

Aplicação web simples de monitoramento climático que consome a **API Open-Meteo** para exibir condições meteorológicas em tempo real a partir do nome de uma cidade.

---

## 🧠 Visão Geral

O projeto de **Previsão do Tempo** foi desenvolvido em **HTML, CSS e JavaScript puro**, com foco em aprendizado e boas práticas de integração com APIs externas.  
A aplicação permite consultar dados meteorológicos, tratar diferentes cenários de erro e alternar automaticamente o modo **diurno/noturno** com base no horário local da consulta.

---

## ⚙️ Funcionalidades

- 🔍 **Busca de dados meteorológicos** por nome de cidade, com integração à API pública do **Open-Meteo**.
- 🌡️ **Exibição completa das condições atuais**, incluindo temperatura, umidade relativa do ar, velocidade do vento e precipitação.
- 📅 **Previsão** detalhada para os **próximos 5 dias**, com informações de máxima, mínima, vento, umidade média e chuva acumulada.
- ⚠️ **Tratamento de erros** para entradas inválidas, limite de requisições, formato inesperado ou falhas de rede.  
- 🕒 Exibição da **data e hora completa da consulta**.  
- 🌗 Alternância automática entre **modo diurno e noturno** conforme o horário.  
- 🌤️ Exibição de **ícones de clima** com a biblioteca [Weather Icons](https://erikflowers.github.io/weather-icons/).  
- ✅ Testes automatizados com **Jest** e **jest-fetch-mock**, simulando diferentes respostas da API.

---

## 🧩 Estrutura do Projeto

```
app_weather/
├── assets/
│   └── css/
│       └── style.css   # Estilo principal
│   └── js/
│       └── api.js      # Script principal da API Open-Meteo
│   └── img/            # Imagens utilizadas
├── tests/
│   └── api.test.js     # Testes automatizados com Jest
├── index.html          # Página principal do frontend
├── package.json
└── README.md
```

---

## 💻 Instalação e Execução

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/queren-alves/app_weather.git
```

### 2️⃣ Instalar dependências
```bash
npm install --save-dev jest
npm install --save-dev jest-fetch-mock
```

### 3️⃣ Executar os testes automatizados
```bash
npm test
```

### 4️⃣ Abrir o frontend
Abra o arquivo `index.html` diretamente no navegador para visualizar a interface.

---

## 🧪 Testes Automatizados

Os testes utilizam **Jest** para validar o comportamento da função `buscarClimaPorCidade`, cobrindo casos como:

- Cidade válida retorna dados meteorológicos.
- Cidade inexistente retorna erro tratado.
- Entrada vazia gera erro de validação.
- Falhas de API e tempo de resposta simulado.
- Limite de requisições e formato inesperado da resposta.

---

## 🧩 Tecnologias Utilizadas

* **HTML5** – estrutura da aplicação
* **CSS** – estilização e responsividade
* **JavaScript (ES6+)** – lógica e consumo das APIs
* **Open-Meteo API** – dados meteorológicos em tempo real
* **Jest** – testes automatizados

---

## 📝 Licença

Distribuído sob a licença **MIT**.
Consulte o arquivo `LICENSE` para mais detalhes.

---

## 👩‍💻 Autor

Desenvolvido com dedicação e aprendizado contínuo por **Quéren**.
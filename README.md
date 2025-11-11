
# Aplicativo de Previsão do Tempo

Aplicação web simples de monitoramento climático que consome a **API Open-Meteo** para exibir condições meteorológicas em tempo real a partir do nome de uma cidade.

<br>

## 1. Visão Geral

O projeto de **Previsão do Tempo** foi desenvolvido em **HTML, CSS e JavaScript puro**, com foco em aprendizado e boas práticas de integração com APIs externas.  
A aplicação permite consultar dados meteorológicos, tratar diferentes cenários de erro e alternar automaticamente o modo **diurno/noturno** com base no horário local da consulta.

<br>

## 2. Funcionalidades

- **Busca inteligente de cidades** com validação de entrada
- **Exibição completa das condições atuais**, incluindo temperatura, umidade relativa do ar, velocidade do vento e precipitação.
- **Previsão estendida** para os próximos 5 dias
- **Tema dinâmico** que alterna automaticamente entre modo diurno (6h-18h) e noturno (18h-6h)
- **Design responsivo** otimizado para desktop, tablet e mobile
- **Performance otimizada** com timeout de requisições e tratamento robusto de erros
- **Interface intuitiva** com ícones visuais representativos do clima

<br>

## 3. Estrutura do Projeto

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
├── LICENSE
├── NOTICE.md
├── package.json
└── README.md
```

<br>

## 4. Tecnologias Utilizadas

* **HTML5** – estrutura da aplicação
* **CSS** – estilização e responsividade
* **JavaScript (ES6+)** – lógica e consumo das APIs
* **Open-Meteo API** – dados meteorológicos em tempo real
* **Jest** – testes automatizados

<br>

## 5. Instalação e Execução

### 1. Clonar o repositório
```bash
git clone https://github.com/queren-alves/app_weather.git
```

### 2. Instalar dependências
```bash
npm install --save-dev jest
npm install --save-dev jest-fetch-mock
```

### 3. Executar os testes automatizados
```bash
npm test
```

### 4. Abrir o frontend
Abra o arquivo `index.html` diretamente no navegador para visualizar a interface.

<br>

## 6. Como Usar

### 1. Buscar Previsão do Tempo

1. Digite o nome da cidade no campo de busca (ex: "São Paulo")
2. Clique no botão **"Buscar"** ou pressione **Enter**
3. Aguarde o carregamento dos dados

### 2. Visualizar Informações

Após a busca bem-sucedida, você verá:

- **Temperatura atual** no momento da consulta

- **Condições climáticas** com ícone representativo

- **Data atual** formatada em português

- Previsão dos próximos 5 dias

   com:

  - Dia da semana e data
  - Condições esperadas
  - Temperaturas máxima e mínima

### Exemplos de Cidades

```
São Paulo
Rio de Janeiro
New York
Londres
Tokyo
Paris
```
<br>

## 7. Testes Automatizados

Os testes utilizam **Jest** para validar o comportamento da função `buscarClimaPorCidade`, cobrindo casos como:

- Cidade válida retorna dados meteorológicos.
- Cidade inexistente retorna erro tratado.
- Entrada vazia gera erro de validação.
- Falhas de API e tempo de resposta simulado.
- Limite de requisições e formato inesperado da resposta.

<br>

## 8. Segurança e Boas Práticas

### Implementadas no Projeto

- ✅ **Tratamento de erros robusto** - Mensagens amigáveis ao usuário
- ✅ **Uso de HTTPS** - Todas as APIs são acessadas via protocolo seguro
- ✅ **Sem armazenamento local** - Dados não são persistidos no navegador
- ✅ **Rate limiting awareness** - Tratamento de erro 429 (Too Many Requests)

### Recomendações para Produção

Se você planeja hospedar esta aplicação:

1. **Use HTTPS** - Configure certificado SSL
2. **Configure CSP** - Content Security Policy headers
3. **Implemente cache** - Para reduzir chamadas à API
4. **Monitore uso da API** - Evite exceder limites de requisições
5. **Adicione analytics** - Para monitorar uso e erros

<br>

## 9. APIs Utilizadas

### Open-Meteo Geocoding API

**Endpoint:** `https://geocoding-api.open-meteo.com/v1/search`

**Parâmetros:**

- `name` - Nome da cidade
- `count` - Número de resultados (1)
- `language` - Idioma (pt)
- `format` - Formato da resposta (json)

### Open-Meteo Weather Forecast API

**Endpoint:** `https://api.open-meteo.com/v1/forecast`

**Parâmetros:**

- `latitude` e `longitude` - Coordenadas geográficas
- `current` - Variáveis meteorológicas atuais
- `daily` - Variáveis de previsão diária
- `timezone` - Fuso horário automático
- `forecast_days` - Número de dias de previsão (5)

**Nota:** As APIs Open-Meteo são gratuitas e não requerem chave de API. Para uso comercial ou alto volume de requisições, consulte [open-meteo.com/en/pricing](https://open-meteo.com/en/pricing).

<br>

## 10. Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

### Diretrizes de Contribuição

- Mantenha o código limpo e documentado
- Adicione testes para novas funcionalidades
- Siga os padrões de código existentes
- Atualize a documentação quando necessário

<br>

## 11. Licença

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo `LICENSE` para detalhes.

A Licença MIT permite:

- ✅ Uso comercial
- ✅ Modificação
- ✅ Distribuição
- ✅ Uso privado

### Limitações de Uso

#### API Open-Meteo
- **Gratuito:** 10.000 requisições/dia
- **Throttling:** Máximo 2 segundos entre requisições
- **Comercial:** Para uso em produção com alto tráfego, considere 
  [planos pagos](https://open-meteo.com/en/pricing)

#### Conformidade Legal
- Projeto licenciado sob MIT License
- Dados meteorológicos: CC BY 4.0 (atribuição obrigatória)
- Uso comercial permitido respeitando as licenças das dependências

<br>

## 12. 👩‍💻 Autora

Desenvolvido com dedicação e aprendizado contínuo por **Quéren**.
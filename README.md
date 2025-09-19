# IMDb Scraper com Selenium (Node.js)

Este projeto é um script em **Node.js** que utiliza **Selenium WebDriver** para acessar a lista dos filmes mais bem avaliados no IMDb, coletar informações (título, ano, duração, nota, classificação e sinopse) e salvar os resultados em um arquivo Excel (`.xlsx`).
O arquivo gerado é movido automaticamente para a pasta `uploads`.

## Requisitos

* Node.js 16+
* Google Chrome instalado
* ChromeDriver compatível com a versão do navegador (instalado via `chromedriver`)

## Instalação

Clone este repositório ou baixe os arquivos do projeto. Depois, instale as dependências:

```bash
npm install selenium-webdriver chromedriver node-xlsx
```

## Estrutura básica

* `index.js` — arquivo principal do script (substitua pelo nome do seu arquivo, se diferente)
* `uploads/` — diretório para onde o arquivo Excel será movido

## Como executar

No terminal, dentro da pasta do projeto, execute:


```bash
npm init -y
```
E depois 

```bash
node index.js
```

## Saída

* O script gera um arquivo `filmes_imdb.xlsx` com os dados coletados.
* O arquivo é movido automaticamente para a pasta `uploads` (criada se não existir).

## Observações

* Certifique-se de que a versão do **ChromeDriver** é compatível com a do **Google Chrome** instalado.
* O script está configurado para coletar os **5 primeiros filmes** da lista. Esse limite pode ser alterado na linha:

```js
for (let i = 0; i < Math.min(filmes.length, 5); i++) {
```

* Dependências principais:

  * `selenium-webdriver` — automação do navegador
  * `chromedriver` — driver do Google Chrome
  * `node-xlsx` — geração do arquivo Excel
  * `fs` e `path` — módulos nativos do Node.js para manipulação de arquivos e diretórios

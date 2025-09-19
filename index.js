
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const xlsx = require("node-xlsx");

async function getFilmes() {
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options().headless(false)) 
    .build();

  try {
    
    await driver.get("http://www.google.com.br/");
    await driver.sleep(1000);
    await driver.get("https://www.imdb.com/pt/chart/top/");

    
    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");

    
    const inicioBtn = await driver.wait(
      until.elementLocated(By.css(".ipc-scroll-to-top-button.sc-3e53ab1c-0.dOykdw.visible.ipc-chip.ipc-chip--on-base")),
      5000
    );
    await inicioBtn.click();

    
    const filmes = await driver.findElements(By.css(".ipc-metadata-list-summary-item"));
    const resultados = [];

    for (let i = 0; i < Math.min(filmes.length, 5); i++) {
      const f = filmes[i];

      
      const sinopseBtn = await f.findElement(By.css(".ipc-icon-button.li-info-icon.ipc-icon-button--base.ipc-icon-button--onAccent2"));
      await driver.actions({ bridge: true }).move({ origin: sinopseBtn }).perform();
      await driver.wait(until.elementIsVisible(sinopseBtn), 5000);
      await sinopseBtn.click();

      const sinopseEl = await driver.wait(
        until.elementLocated(By.css(".sc-717a9add-2.jPYKsd")),
        5000
      );
      const sinopse = await sinopseEl.getText();

      
      const fechaSinopseBtn = await driver.findElement(By.css(".ipc-promptable-base__close"));
      await fechaSinopseBtn.click();
      await driver.wait(until.stalenessOf(sinopseEl), 5000);

      
      const titulo = await f.findElement(By.css(".ipc-title__text.ipc-title__text--reduced")).getText();
      const nota = await f.findElement(By.css(".ipc-rating-star--rating")).getText();
      const spans = await f.findElements(By.css(".sc-15ac7568-7.cCsint.cli-title-metadata-item"));

      const ano = await spans[0].getText();
      const duracao = await spans[1].getText();
      const classificacao = spans.length > 2 ? await spans[2].getText() : "N/I";

      resultados.push({ titulo, ano, duracao, nota, classificacao, sinopse });
    }

    
    const dataExcel = [
      ["TITULO", "ANO", "DURACAO", "NOTA", "CLASSIFICACAO", "SINOPSE"],
      ...resultados.map(r => [r.titulo, r.ano, r.duracao, r.nota, r.classificacao, r.sinopse])
    ];

    
    const buffer = xlsx.build([{ name: "Filmes", data: dataExcel }]);
    const filePath = path.join(__dirname, "filmes_imdb.xlsx");
    fs.writeFileSync(filePath, buffer);

    
    moveFile(filePath, "uploads");

  } finally {
    await driver.quit();
  }
}

function moveFile(file, folder) {
  const destinoFolder = path.resolve(folder);
  if (!fs.existsSync(destinoFolder)) fs.mkdirSync(destinoFolder, { recursive: true });

  const destino = path.join(destinoFolder, path.basename(file));
  fs.renameSync(file, destino);
  console.log(`Arquivo movido para: ${destino}`);
}


getFilmes();

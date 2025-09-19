
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const xlsx = require("node-xlsx");

async function getFilmes() {
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options()) 
    .build();


  const filePath = path.join(__dirname, "filmes_imdb.csv");
  const header = ["TITULO", "ANO", "DURACAO", "NOTA", "CLASSIFICACAO", "SINOPSE"].join(";") + "\n";

  if (!fs.existsSync(path.dirname(filePath))) fs.mkdirSync(path.dirname(filePath), { recursive: true });

  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, header, { encoding: "utf-8" });

  try {
    
    await driver.get("http://www.google.com.br/");
    await driver.sleep(1000);
    await driver.get("https://www.imdb.com/pt/chart/top/");

    
    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");

    
    const inicioBtn = await driver.wait(
      until.elementLocated(By.css(".ipc-scroll-to-top-button.sc-3e53ab1c-0.dOykdw.visible.ipc-chip.ipc-chip--on-base")),
      50000
    );
    await inicioBtn.click();

    
    const filmes = await driver.findElements(By.css(".ipc-metadata-list-summary-item"));

    for (let i = 0; i < Math.min(filmes.length, 5); i++) {
      try {
        const f = filmes[i];

        const sinopseBtn = await f.findElement(By.css(".ipc-icon-button.li-info-icon.ipc-icon-button--base.ipc-icon-button--onAccent2"));
        await driver.actions({ bridge: true }).move({ origin: sinopseBtn }).perform();
        await driver.wait(until.elementIsVisible(sinopseBtn), 50000);
        await sinopseBtn.click();

        const sinopseElement = await driver.wait(
          until.elementLocated(By.css(".sc-717a9add-2.jPYKsd")),
          50000
        );
        const sinopse = await sinopseElement.getText();

       

        const titulo = await f.findElement(By.css(".ipc-title__text.ipc-title__text--reduced")).getText();
        const nota = await f.findElement(By.css(".ipc-rating-star--rating")).getText();
        const spans = await f.findElements(By.css(".sc-15ac7568-7.cCsint.cli-title-metadata-item"));

        const ano = await spans[0].getText();
        const duracao = await spans[1].getText();
        const classificacao = spans.length > 2 ? await spans[2].getText() : "N/I";

        const linha = [
          titulo,
          ano,
          duracao,
          nota,
          classificacao,
          `"${sinopse.replace(/"/g, '""')}"`
        ].join(";") + "\n";

        fs.appendFileSync(filePath, linha, "utf-8");

      const fechaSinopseBtn = await driver.findElement(By.css(".ipc-promptable-base__close"));
      await fechaSinopseBtn.click();
      await driver.wait(until.stalenessOf(sinopseElement), 50000);
      } catch (err) {
        console.error(`Erro: ${i}:`, err);
      }

      
    }


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
}


getFilmes();

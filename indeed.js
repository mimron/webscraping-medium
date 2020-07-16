const puppeteer = require("puppeteer");
const url =
  "https://id.indeed.com/lowongan-kerja?q=web+developer+graduate&l=Indonesia&sort=date";
const selector = "div.clickcard";
module.exports = (async function fetchIndeed() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url,{waitUntil: 'domcontentloaded'});
  await page.waitFor("div.clickcard");
  const jobs = await page.$$eval(selector, (nodes) => {
    const currentDate = new Date();
    return nodes.map((node) => {
      const jobName = node.querySelector("h2.title > a").innerText;
      const company = node.querySelector("span.company").innerText;
      const link = "https://id.indeed.com" + node
        .querySelector("h2.title > a[href]")
        .getAttribute("href");
      const location = node.querySelector("span.location")
        .innerText;
      const salaryExist = node.querySelector("span.salaryText") ;
      const salary =  salaryExist ? salaryExist.innerText : "" ;
      const published = currentDate.toJSON();
      const publishedTS = currentDate.getTime()/1000;
      return {
        jobName,
        company,
        link,
        location,
        salary,
        published,
        publishedTS,
      };
    });
  });
  console.log(jobs);
  const fs = require("fs");
  fs.writeFile("./indeed.json", JSON.stringify(jobs), (err) =>
    err ? console.log(err) : null
  );
  await browser.close();
})();

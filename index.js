import puppeteer from "puppeteer";

(async () => {
    const MCDONALDS_BASE_URL = "https://www.mcdonalds.com";
    const MCDONALDS_FULL_MENU = "https://www.mcdonalds.com/us/en-us/full-menu.html";
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(MCDONALDS_FULL_MENU, {waitUntil: "networkidle0"});
    

})();
import puppeteer from "puppeteer";

(async () => {

    const MCDONALDS_BASE_URL = "https://www.mcdonalds.com";
    const MCDONALDS_FULL_MENU = "https://www.mcdonalds.com/us/en-us/full-menu.html";

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(MCDONALDS_FULL_MENU, {waitUntil: "networkidle0"});
    const foodLinkSelector = await page.$$("a[href^='/us/en-us/product/']");
    // todo: implement extractOtherSizeLinks and use it to complete the logic

    for (let i = 0; i < foodLinkSelector.length; i++) {
        const foodLink = await foodLinkSelector[i].evaluate(elem => elem.href);
        await page.goto(foodLink, {waitUntil: "networkidle0"});
        const foodNameAndCalories = await extractFoodNameAndCalories(page);
        const sizesToParse = await extractOtherSizeLinks(page);
        for (let j = 0; j < sizesToParse.length; j++) {

        }
        process.exit(0);
    }

    await browser.close();
})();

// expects the page to be fully loaded before being passed to this function
async function extractFoodNameAndCalories(page) {
    const foodNameSpan = await page.$("span.cmp-product-details-main__heading-title");
    const foodName = await foodNameSpan.evaluate(elem => elem.innerText);
    const calorieDivSelector = await page.$("div.cmp-product-details-main__sub-heading");
    const calories = await calorieDivSelector.evaluate(elem => {
        console.log("here");
        const calorieSpan = elem.firstChild;
        console.log("calorie span=>", calorieSpan);
        return calorieSpan.innerText;
    });
    return {"foodName": foodName, "calories": calories};
    
}
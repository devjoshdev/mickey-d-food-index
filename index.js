import puppeteer from "puppeteer";

(async () => {

    const MCDONALDS_BASE_URL = "https://www.mcdonalds.com";
    const MCDONALDS_FULL_MENU = "https://www.mcdonalds.com/us/en-us/full-menu.html";
    const SIZES_LIST_SELECTOR = "ul.cmp-product-details-main__variations-sizes";

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(MCDONALDS_FULL_MENU, {waitUntil: "networkidle0"});
    const productPageLinks = await page.$$eval("a[href^='/us/en-us/product/']", (anchors => anchors.map(anchor => anchor.href)));
    let otherSizesLinks = [];

    for (let i = 0; i < 3; i++) {
        await page.goto(productPageLinks[i], {waitUntil: "networkidle0"});
        const foodNameAndCalories = await extractFoodNameAndCalories(page);
        console.table(foodNameAndCalories);
        const sizesToParse = await extractOtherSizeLinks(page, SIZES_LIST_SELECTOR);
        otherSizesLinks = [...otherSizesLinks, ...sizesToParse];
    }

    for (let i = 0; i < otherSizesLinks.length; i++) {
        await page.goto(otherSizesLinks[i]);
        const foodNameAndCalories = await extractFoodNameAndCalories(page);
        console.table(foodNameAndCalories);
    }

    await browser.close();
})();

// expects the page to be fully loaded before being passed to this function
async function extractFoodNameAndCalories(page) {
    const foodNameSpan = await page.$("span.cmp-product-details-main__heading-title");
    const foodName = await foodNameSpan.evaluate(elem => elem.innerText);
    const calorieDivSelector = await page.$("div.cmp-product-details-main__sub-heading");
    const calories = await calorieDivSelector.evaluate(elem => {
        const calorieSpan = elem.firstChild;
        return calorieSpan.innerText.trim();
    });
    return {"foodName": foodName, "calories": calories};
    
}

// TODO: make sure to skip the currently selected one
async function extractOtherSizeLinks(page, sizesSelector) {
    let sizeLinks = [];
    const sizesLinksList = await page.$(sizesSelector);
    if (sizesLinksList) {
        sizeLinks = sizesLinksList.$$eval("li", listItems => listItems.filter(li => !li.className.includes("--selected")).map(li => li.querySelector("a").href));
    }
    return sizeLinks;




    // const sizesLinks = [];
    // const sizesList = await page.$(sizesSelector);
    // if (sizesList && sizesList.length > 0) {
    //     for (let i = 0; i < sizesList.length; i++) {

    //     }
    // }
    // return sizesLinks;
}
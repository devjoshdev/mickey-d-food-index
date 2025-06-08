/*
Limitation found, when the page loaded by fetch has JS that modifies the DOM it's impossible to
wait for that load, v2 of this script will need to use a headless browser 
*/

import * as cheerio from 'cheerio';

(async () => {
    const MCDONALDS_BASE_URL = "https://www.mcdonalds.com";
    const MCDONALDS_FULL_MENU = "https://www.mcdonalds.com/us/en-us/full-menu.html";
    const res = await getURLText(MCDONALDS_FULL_MENU);
    if (res) {
        const $ = cheerio.load(res);
        const products = $("a[href^='/us/en-us/product/']");
        console.log(products.length);
        for (let i = 0; i < products.length; i++) {
            const element = products[i];
            console.log(i, $(element).attr("href"));
            const foodURLEnd = $(element).attr("href").trim();
            const foodURL = MCDONALDS_BASE_URL + foodURLEnd;
            const foodRes = await getURLText(foodURL);
            if (foodRes) {
                const $food = cheerio.load(foodRes);
                const productSubheading = $food("div.cmp-product-details-main__sub-heading");
                if (productSubheading.length > 0) {
                    console.log(productSubheading.length)
                    const firstProductSubheading = $food(productSubheading).last();
                    console.log($food(firstProductSubheading).html());
                    const firstProductSpan = $food(firstProductSubheading).children("span");
                    console.log(firstProductSpan.length);
                }
                process.exit();


            }
        }
    }
    else {
        console.log("There was an error!");
    }
})();


async function getURLText(url) {
    try {
        const res = await fetch(url);
        const text = await res.text();
        return text;

    }
    catch (err) {
        console.error(err);
        return null;
    }
}

async function sleep(ms) {
    return new Promise(resolve => {setTimeout(resolve, ms)})

}
const puppeteer = require('puppeteer')
const { writeFile } = require('fs')

let idArray = []

async function scrape() {
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()

    await page.goto('https://ratings.fide.com/')
    for(let i = 1; i<=100; i++){
    var element = await page.waitForXPath(`/html/body/section[3]/div[2]/div/div[4]/div/div[1]/div[2]/div/div[2]/table/tbody/tr[${i}]/td[2]/a`)
    
    var text = await page.evaluate(element => element.href.split("/")[4], element)
    idArray.push(text)
    }

    browser.close()
    
    writeFile(
        './first-100-id.txt',
        `${idArray}`,
        (err, result) => {
          if (err) {
            console.log(err)
            return
          }
        }
      )
}
scrape()


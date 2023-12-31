const puppeteer = require('puppeteer');
const { loginToWhatsApp, sendMessage } = require('./whatsapp');
const { readCSVFile } = require('./file');

async function main() {
  const browser = await puppeteer.launch({ headless: false, args: ['--disable-notifications'] });
  try {
    const page = await browser.newPage();
    await loginToWhatsApp(page);

    // const groups = ["Home Vb", "Love", "Faltu", "Fri Hariom Bhaiya"];

    // for (const group of groups) { 
    //   try {
    //     await sendMessage(page, group, 'hello');
    //   } catch (error) {
    //     console.log(`Error occurred at ${group}: ${error.message}`);
    //     continue;
    //   }
    // }

    const csvFilePath = 'yashList.csv';
    await readCSVFile(page,csvFilePath);

  } catch (error) {
    console.error('Error:', error);
  }finally{
    await browser.close();
  }
}

main();



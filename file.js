const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline');
const { loginToWhatsApp, sendMessage } = require('./whatsapp');
const { delay, getRandomTimeout } = require('./utils');

async function readCSVFile(page,filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const group of rl) {
    var flag=0
    // Process each line here
    console.log(group+"................................");
      try {
        await sendMessage(page, group, 'hello');
        flag=1;
      } catch (error) {
        console.log(`Error occurred at ${group}: ${error.message}`);
        continue;
      }
  }
}

module.exports={readCSVFile};
const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline');

//random value generator -- so bot can't block us (if)
function getRandomTimeout(min = 0, max = 3000) {
  const base = Math.random() * (max - min) + min;
  const variation = Math.random() * 500;
  const adjusted = Math.round(base + variation);
  return Math.max(min, Math.min(adjusted, max));
}
//call the random delay function
async function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
//login to whatsapp 
async function loginToWhatsApp(page) {
  await page.goto('https://web.whatsapp.com');
  console.log('Please scan the QR code in the browser window.');

  await Promise.race([
    page.waitForFunction(() => document.querySelector('//div[@class="g0rxnol2 g9p5wyxn i0tg5vk9 aoogvgrq o2zu3hjb" and @data-tab="2"]')),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    new Promise(resolve => setTimeout(resolve, 120000)),
  ]);

  console.log('Login successful!');
  await new Promise(resolve => setTimeout(resolve, getRandomTimeout(5000, 8000)));
}

//function to send message 
async function sendMessage(page, contact, message) {
  //search person inside the search bar
  const searchBar = await page.$(`div[contenteditable="true"][role="textbox"]`);
  if (!searchBar) {
    console.error('Search bar not found');
    return;
  }
  //type the name of the person
  await typeTextInElement(page, searchBar, contact);
  await page.keyboard.press('Enter');
  // if(flag==0){
  //   await delay(getRandomTimeout());
  // }
  //select the person chat
  // const person = await page.waitForSelector(`span[title="${contact}"]`, { visible: true });
  // if (!person) {
  //   console.error('Person not found');
  //   return;
  // }
  // //click on that person chat
  // await person.click();
  // //wait for load of the chat after cliking
  // await delay(getRandomTimeout());
  //search for the message input area
  const searchBarAgain = await page.$x(`//div[@class='g0rxnol2 ln8gz9je lexical-rich-text-input']/div[@role='textbox' and @data-lexical-editor='true']`);
  if (!searchBarAgain[1]) {
    console.error('Search bar for message not found');
    return;
  }
  const searchBarAgain2 = searchBarAgain[1];
  //type the text inside the message input area
  const text = `${message}\n${contact}`;
  await typeTextInElement(page, searchBarAgain2, text);

  //find the send button
  const sendButton = await page.$('span[data-icon="send"]');
  if (sendButton) {
    //click on the send button
    await sendButton.click();
    console.log(`Successfully sent to ${contact}`);
  } else {
    console.error('Send button not found');
  }
}

//function to type inside the element
async function typeTextInElement(page, element, text) {
  await element.focus();
  await page.keyboard.type("random");
  await element.click({ clickCount: 3 });
  await element.press('Backspace');
  await page.keyboard.type(text);
}

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



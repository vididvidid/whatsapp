const puppeteer = require('puppeteer');
const { delay, getRandomTimeout } = require('./utils');
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
    const text = "Happy 2024! ✨ Dreams sparkle, goals rock, and love flows! Wishing you joy, health, and endless possibilities!  #NewYearNewYou";
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


  module.exports = {loginToWhatsApp,sendMessage};

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

  module.exports ={delay,getRandomTimeout};
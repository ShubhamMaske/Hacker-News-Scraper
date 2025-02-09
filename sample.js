let url = 'https://news.ycombinator.com/'
const axios = require('axios')
const { HttpsProxyAgent } = require('https-proxy-agent');

// Example proxy list (you can replace this with proxies from a file or API)
const proxies = [
  'http://203.150.128.99:8080',
  'http://182.253.109.140:8080',
  'http://103.16.214.206:8080',
  'http://203.150.128.99:8080',
  'http://182.253.109.140:8080',
  'http://203.150.128.99:8080',
  'http://182.253.109.140:8080',
];

// Function to get a random proxy
function getRandomProxy() {
  const proxy = proxies[Math.floor(Math.random() * proxies.length)];
  return new HttpsProxyAgent(proxy);
}

async function shubh() {
    for(let i = 0; i< 10; i++) {
        try{
            console.log("Called")
        const proxyAgent = getRandomProxy();
        console.log("proxyAgent")
        const result = await axios.get(url)
        console.log(result.data.substring(0, 100))
        } catch (err) {
            console.log(err)
        }
        
    }
}

setInterval(async() => {
    const result = await axios.get(url) 
    console.log(result.data.substring(0, 100))
}, 2000)


// shubh();



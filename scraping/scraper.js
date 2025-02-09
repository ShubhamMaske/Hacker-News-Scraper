const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/story');
let lastModified = null;

const fetchAndStoreStories = async () => {
  try {
    console.log('fetchAndStoreStories function called.')
    const headers = lastModified ? { 'If-Modified-Since': lastModified } : {};
    // const response = await axios.get('https://news.ycombinator.com/', {headers});

    // const response = await axios.get('https://news.ycombinator.com/', {
    //   headers: {
    //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    //   },
    //   maxRedirects: 5,
    //   httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
    // });

    const response = await axios.get('https://news.ycombinator.com/', {
      httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
    });

    console.log('HTTP Response Status:', response.status);
    console.log(response.data.substring(0, 100))

    const $ = cheerio.load(response.data);
    console.log('Cheerio Loaded HTML:', JSON.stringify($));

    const stories = [];
    $('.athing').each((index, element) => {
      const title = $(element).find('.titleline > a').text();
      const url = $(element).find('.titleline > a').attr('href');
      const storyId = $(element).attr('id');
      
      if (title && url && storyId) {
        stories.push({
          story_id: storyId,
          title,
          url,
          published_at: new Date(), // Current time as placeholder
        });
      }
    });

    const newStories = [];
    for (const story of stories) {
      const [newStory, created] = await Story.findOrCreate({
        where: { story_id: story.story_id },
        defaults: story,
      });
      if (created) newStories.push(newStory);
    }

    console.log(`Fetched ${newStories.length} new stories.`);
    return newStories; // Only return newly added stories
  } catch (error) {
    console.error('Stack Trace:', error.stack);
    console.error('Error scraping stories:', error);
    return [];
  }
};


module.exports = { fetchAndStoreStories };




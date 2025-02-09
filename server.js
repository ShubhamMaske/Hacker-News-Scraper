const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config()
const app = require('./app');
const { fetchAndStoreStories } = require('./scraping/scraper');
const Story = require('./models/story');
const { Op } = require('sequelize');


const server = http.createServer(app);
const io = socketIo(server);

// WebSocket logic
io.on('connection', async (socket) => {
  console.log('Client connected');

  // Send the number of stories published in the last 5 minutes
    console.log('get_recent_count event called!')
    const count = await Story.count({
      where: {
        published_at: {
          [Op.gt]: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
    });
    console.log(count)
    socket.emit('recent_count', count);

  console.log('listening the updates...');
});


// fetch and broadcast the stories
setInterval(async () => {
    console.log('setinterval called!')
  await fetchAndStoreStories();


  const recentStories = await Story.findAll({
    where: {
      published_at: {
        [Op.gt]: new Date(Date.now() - 5 * 60 * 1000),
      },
    },
  });

  if(recentStories.length > 0) {
    io.emit('new_stories', recentStories);
  }
}, 20000); // it runs in interval of 5 minute

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

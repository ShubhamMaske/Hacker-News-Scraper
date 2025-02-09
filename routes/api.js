const express = require('express');
const Story = require('../models/story');
const { Op } = require('sequelize');

const router = express.Router();


router.get('/stories', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;

  try {
    const stories = await Story.findAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['published_at', 'DESC']],
    });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stories' });
  }
});

// Get the number of stories in the last 5 minutes
router.get('/stories/recent', async (req, res) => {
  try {
    const count = await Story.count({
      where: {
        published_at: {
          [Op.gt]: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching story count' });
  }
});

module.exports = router;

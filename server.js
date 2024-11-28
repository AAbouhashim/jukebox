const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// GET /playlists: Sends an array of all playlists
app.get('/playlists', async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany({
      include: { tracks: { include: { track: true } } }, // Include associated tracks
    });
    res.json(playlists);
  } catch (error) {
    next(error);
  }
});

// GET /playlists/:id: Sends a specific playlist, including all tracks
app.get('/playlists/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const playlist = await prisma.playlist.findUnique({
      where: { id: parseInt(id, 10) },
      include: { tracks: { include: { track: true } } }, // Include associated tracks
    });

    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }

    res.json(playlist);
  } catch (error) {
    next(error);
  }
});

// GET /tracks: Sends an array of all tracks
app.get('/tracks', async (req, res, next) => {
  try {
    const tracks = await prisma.track.findMany();
    res.json(tracks);
  } catch (error) {
    next(error);
  }
});

// GET /tracks/:id: Sends a specific track
app.get('/tracks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const track = await prisma.track.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!track) {
      res.status(404).json({ error: 'Track not found' });
      return;
    }

    res.json(track);
  } catch (error) {
    next(error);
  }
});

// 404 Middleware
app.use((req, res, next) => {
  res.status(404).json({ error: 'Resource not found' });
});

// Error-handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
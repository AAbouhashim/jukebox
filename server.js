const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(bodyParser.json()); // Parse incoming JSON requests

// Routes
app.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error); // Forward errors to error-handling middleware
  }
});

app.get('/users/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { playlists: true },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error); // Forward errors to error-handling middleware
  }
});

app.post('/users/:id/playlists', async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        ownerId: user.id,
      },
    });

    res.status(201).json(playlist);
  } catch (error) {
    next(error); // Forward errors to error-handling middleware
  }
});

// 404 Middleware
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error details
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
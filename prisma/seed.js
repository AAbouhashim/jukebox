const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seed = async () => {
  try {
    // Create 5 users
    const users = await prisma.user.createMany({
      data: [
        { username: 'Alice' },
        { username: 'Bob' },
        { username: 'Charlie' },
        { username: 'Diana' },
        { username: 'Eve' },
      ],
    });

    console.log(`Seeded ${users.count} users.`);

    // Create 20 classic rock tracks
    const trackNames = [
      'Stairway to Heaven',
      'Bohemian Rhapsody',
      'Hotel California',
      'Sweet Child O\' Mine',
      'Smoke on the Water',
      'Free Bird',
      'Layla',
      'Another Brick in the Wall',
      'Born to Run',
      'Imagine',
      'Comfortably Numb',
      'Hey Jude',
      'Let It Be',
      'Dream On',
      'Paint It Black',
      'Sympathy for the Devil',
      'All Along the Watchtower',
      'Knocking on Heaven\'s Door',
      'Back in Black',
      'Highway to Hell',
    ];

    const tracks = await prisma.track.createMany({
      data: trackNames.map((name) => ({ name })),
    });

    console.log(`Seeded ${tracks.count} tracks.`);

    // Fetch all tracks and users
    const allTracks = await prisma.track.findMany();
    const allUsers = await prisma.user.findMany();

    // Create 10 playlists, each owned by a random user, and assign at least 8 random tracks to each
    for (let i = 1; i <= 10; i++) {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      const randomTracks = allTracks
        .sort(() => 0.5 - Math.random())
        .slice(0, 8); // Select 8 random tracks

      await prisma.playlist.create({
        data: {
          name: `Playlist ${i}`,
          description: `Description for Playlist ${i}`,
          ownerId: randomUser.id,
          tracks: {
            create: randomTracks.map((track) => ({
              trackId: track.id,
            })),
          },
        },
      });
    }

    console.log('Seeded database with 5 users, 20 tracks, and 10 playlists.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Run the seed script
seed();
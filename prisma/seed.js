const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seed = async () => {
  try {
    console.log("Seeding database...");

    // Create users
    const usersData = [
      { username: 'Alice' },
      { username: 'Bob' },
      { username: 'Charlie' },
      { username: 'Diana' },
      { username: 'Eve' },
    ];
    const users = await prisma.user.createMany({ data: usersData });
    console.log(`Seeded ${users.count} users.`);

    // Create classic rock songs
    const tracksData = [
      { name: 'Bohemian Rhapsody' },
      { name: 'Hotel California' },
      { name: 'Stairway to Heaven' },
      { name: 'Smoke on the Water' },
      { name: 'Sweet Child O\' Mine' },
      { name: 'Comfortably Numb' },
      { name: 'Highway to Hell' },
      { name: 'Dream On' },
      { name: 'Free Bird' },
      { name: 'Another Brick in the Wall' },
      { name: 'Back in Black' },
      { name: 'Layla' },
      { name: 'November Rain' },
      { name: 'Whole Lotta Love' },
      { name: 'We Will Rock You' },
      { name: 'Kashmir' },
      { name: 'You Shook Me All Night Long' },
      { name: 'Born to Run' },
      { name: 'Don\'t Stop Believin\'' },
    ];
    const tracks = await prisma.track.createMany({ data: tracksData });
    console.log(`Seeded ${tracks.count} tracks.`);

    // Fetch all tracks and users
    const allTracks = await prisma.track.findMany();
    const allUsers = await prisma.user.findMany();

    // Assign a playlist with exactly 5 tracks to each user
    for (const user of allUsers) {
      const randomTracks = allTracks
        .sort(() => 0.5 - Math.random()) // Shuffle tracks
        .slice(0, 5); // Select exactly 5 tracks

      await prisma.playlist.create({
        data: {
          name: `${user.username}'s Classic Rock Playlist`,
          description: 'A playlist of great classic rock songs',
          ownerId: user.id,
          tracks: {
            create: randomTracks.map((track) => ({
              trackId: track.id,
            })),
          },
        },
      });
      console.log(`Created playlist for ${user.username} with 5 tracks.`);
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Run the seed script
seed();
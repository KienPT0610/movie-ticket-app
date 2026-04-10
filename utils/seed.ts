import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const movies = [
  {
    id: 'm1',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGjjcNs3.jpg',
    duration: 166,
    releaseDate: '2024-03-01',
    genre: 'Sci-Fi / Action',
    rating: 8.8
  },
  {
    id: 'm2',
    title: 'Kung Fu Panda 4',
    description: 'Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    duration: 94,
    releaseDate: '2024-03-08',
    genre: 'Animation / Comedy',
    rating: 7.5
  },
  {
    id: 'm3',
    title: 'Godzilla x Kong: The New Empire',
    description: 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/vqzNJRH4YyquRiWxCCOH0aXggHI.jpg',
    duration: 115,
    releaseDate: '2024-03-29',
    genre: 'Action / Sci-Fi',
    rating: 7.2
  }
];

const theaters = [
  { id: 't1', name: 'CGV Vincom', location: 'District 1, HCMC' },
  { id: 't2', name: 'Lotte Cinema', location: 'District 7, HCMC' },
  { id: 't3', name: 'BHD Star', location: 'District 2, HCMC' }
];

export const seedData = async () => {
  try {
    const batch = writeBatch(db);

    // Seed Movies
    movies.forEach((movie) => {
      const ref = doc(db, 'movies', movie.id);
      batch.set(ref, movie);
    });

    // Seed Theaters
    theaters.forEach((theater) => {
      const ref = doc(db, 'theaters', theater.id);
      batch.set(ref, theater);
    });

    // Seed Showtimes
    movies.forEach((movie) => {
      theaters.forEach((theater) => {
        // Create a few showtimes for each movie at each theater
        const showtimes = ['10:00', '14:00', '18:30', '21:00'];
        showtimes.forEach((time, index) => {
          const showtimeId = `${movie.id}_${theater.id}_${index}`;
          const ref = doc(db, 'showtimes', showtimeId);
          batch.set(ref, {
            id: showtimeId,
            movieId: movie.id,
            theaterId: theater.id,
            startTime: time,
            price: 120000, // 120k VND
          });
        });
      });
    });

    await batch.commit();
    console.log('Seeding completed!');
    return true;
  } catch (error) {
    console.error('Lỗi khi seed data:', error);
    return false;
  }
};

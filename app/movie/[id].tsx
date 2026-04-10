import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [theaters, setTheaters] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        // Lấy thông tin phim
        const movieRef = doc(db, 'movies', id as string);
        const movieSnap = await getDoc(movieRef);
        if (movieSnap.exists()) {
          setMovie({ id: movieSnap.id, ...movieSnap.data() });
        }

        // Lấy các suất chiếu của phim này
        const q = query(collection(db, 'showtimes'), where('movieId', '==', id));
        const showtimesSnap = await getDocs(q);
        const showtimesList = showtimesSnap.docs.map(doc => doc.data());
        setShowtimes(showtimesList);

        // Lấy rạp cho các suất chiếu
        const theaterIds = [...new Set(showtimesList.map(st => st.theaterId))];
        const theaterData: any = {};
        for (const tId of theaterIds) {
          const tRef = doc(db, 'theaters', tId);
          const tSnap = await getDoc(tRef);
          if (tSnap.exists()) {
            theaterData[tId] = tSnap.data();
          }
        }
        setTheaters(theaterData);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieData();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.whiteText}>Phim không tồn tại</Text>
      </View>
    );
  }

  // Nhóm showtime theo rạp
  const showtimesByTheater: any = {};
  showtimes.forEach(st => {
    if (!showtimesByTheater[st.theaterId]) {
      showtimesByTheater[st.theaterId] = [];
    }
    showtimesByTheater[st.theaterId].push(st);
  });

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: movie.posterUrl }} style={styles.backdrop} />
      
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.metaData}>{movie.releaseDate} • {movie.duration} phút • {movie.genre}</Text>
        <Text style={styles.rating}>⭐ {movie.rating}/10</Text>
        <Text style={styles.description}>{movie.description}</Text>

        <Text style={styles.sectionTitle}>Lịch Chiếu Hôm Nay</Text>
        
        {Object.keys(showtimesByTheater).length === 0 ? (
          <Text style={styles.whiteText}>Chưa có suất chiếu.</Text>
        ) : (
          Object.keys(showtimesByTheater).map(theaterId => (
            <View key={theaterId} style={styles.theaterBlock}>
              <Text style={styles.theaterName}>{theaters[theaterId]?.name}</Text>
              <Text style={styles.theaterLocation}>{theaters[theaterId]?.location}</Text>
              
              <View style={styles.timeGrid}>
                {showtimesByTheater[theaterId]
                  .sort((a:any, b:any) => a.startTime.localeCompare(b.startTime))
                  .map((st: any) => (
                  <TouchableOpacity 
                    key={st.id} 
                    style={styles.timeButton}
                    onPress={() => router.push(`/book/${st.id}`)}
                  >
                    <Text style={styles.timeText}>{st.startTime}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#000'
  },
  whiteText: {
    color: '#fff',
  },
  backdrop: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  metaData: {
    color: '#B3B3B3',
    fontSize: 14,
    marginBottom: 5,
  },
  rating: {
    color: '#E50914',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  description: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
  theaterBlock: {
    marginBottom: 20,
    backgroundColor: '#141414',
    padding: 15,
    borderRadius: 8,
  },
  theaterName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  theaterLocation: {
    color: '#B3B3B3',
    fontSize: 12,
    marginBottom: 10,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444'
  },
  timeText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});

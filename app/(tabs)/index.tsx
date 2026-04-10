import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useRouter } from 'expo-router';
import { seedData } from '../../utils/seed';

export default function HomeScreen() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'movies'));
      const moviesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMovies(moviesList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSeed = async () => {
    alert('Đang seed dữ liệu, vui lòng đợi...');
    const success = await seedData();
    if(success) {
      alert('Seed thành công!');
      fetchMovies();
    }
  };

  const renderMovie = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.movieCard}
      onPress={() => router.push(`/movie/${item.id}`)}
    >
      <Image source={{ uri: item.posterUrl }} style={styles.poster} />
      <View style={styles.movieInfo}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.genre}>{item.genre}</Text>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Now Playing</Text>
        {movies.length === 0 && !loading && (
          <TouchableOpacity style={styles.seedButton} onPress={handleSeed}>
            <Text style={styles.seedButtonText}>Tạo Dữ liệu Mẫu</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={renderMovie}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchMovies}
            tintColor="#E50914"
          />
        }
        ListEmptyComponent={
          !loading ? <Text style={styles.emptyText}>Chưa có phim nào. Bấm nút Tạo Dữ liểu Mẫu.</Text> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#141414',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  seedButton: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  seedButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  listContainer: {
    padding: 10,
  },
  movieCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#141414',
    borderRadius: 8,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    aspectRatio: 2/3,
  },
  movieInfo: {
    padding: 10,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  genre: {
    color: '#B3B3B3',
    fontSize: 12,
    marginBottom: 4,
  },
  rating: {
    color: '#E50914',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  }
});

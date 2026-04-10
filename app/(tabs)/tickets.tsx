import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';

export default function TicketsScreen() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'tickets'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const ticketsData: any[] = [];
      for (const ticketDoc of querySnapshot.docs) {
        const ticketInfo = ticketDoc.data();
        
        // Fetch showtime info
        const showtimeRef = doc(db, 'showtimes', ticketInfo.showtimeId);
        const showtimeSnap = await getDoc(showtimeRef);
        const showtimeData = showtimeSnap.data();

        if (showtimeData) {
           // Fetch movie info
           const movieRef = doc(db, 'movies', showtimeData.movieId);
           const movieSnap = await getDoc(movieRef);
           const movieData = movieSnap.data();

           // Fetch theater info
           const theaterRef = doc(db, 'theaters', showtimeData.theaterId);
           const theaterSnap = await getDoc(theaterRef);
           const theaterData = theaterSnap.data();

           ticketsData.push({
             id: ticketDoc.id,
             ...ticketInfo,
             movieTitle: movieData?.title || 'Unknown Movie',
             theaterName: theaterData?.name || 'Unknown Theater',
             startTime: showtimeData.startTime,
           });
        }
      }
      
      // sort by bookedAt descending
      ticketsData.sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime());
      
      setTickets(ticketsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  };

  const renderTicket = ({ item }: { item: any }) => (
    <View style={styles.ticketCard}>
      <Text style={styles.movieTitle}>{item.movieTitle}</Text>
      <View style={styles.ticketRow}>
        <Text style={styles.label}>Rạp:</Text>
        <Text style={styles.value}>{item.theaterName}</Text>
      </View>
      <View style={styles.ticketRow}>
        <Text style={styles.label}>Giờ chiếu:</Text>
        <Text style={styles.value}>{item.startTime}</Text>
      </View>
      <View style={styles.ticketRow}>
        <Text style={styles.label}>Ghế:</Text>
        <Text style={styles.value}>{item.seatNumbers?.join(', ')}</Text>
      </View>
      <View style={styles.ticketRow}>
        <Text style={styles.label}>Mã vé:</Text>
        <Text style={styles.valueCode}>{item.id.toUpperCase()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vé Của Tôi</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E50914" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          renderItem={renderTicket}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Bạn chưa đặt vé nào.</Text>
          }
          onRefresh={fetchTickets}
          refreshing={loading}
        />
      )}
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
  logoutButton: {
    padding: 8,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  logoutText: {
    color: '#E50914',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  ticketCard: {
    backgroundColor: '#141414',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#E50914',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  ticketRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    color: '#B3B3B3',
    width: 80,
  },
  value: {
    color: '#fff',
    fontWeight: '500',
    flex: 1,
  },
  valueCode: {
    color: '#E50914',
    fontWeight: 'bold',
    letterSpacing: 1,
    flex: 1,
  },
  emptyText: {
    color: '#B3B3B3',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  }
});

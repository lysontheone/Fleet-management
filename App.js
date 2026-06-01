import { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { fetchDashboardStats, fetchDrivers, fetchCars, fetchPayments } from './src/services/api';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    activeDrivers: 0,
    activeCars: 0,
    totalOutstanding: 0,
  });
  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);
  const [payments, setPayments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const [stats, driversData, carsData, paymentsData] = await Promise.all([
        fetchDashboardStats(),
        fetchDrivers(),
        fetchCars(),
        fetchPayments(),
      ]);

      setDashboardData(stats);
      setDrivers(driversData);
      setCars(carsData);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Bulp Fleet Manager</Text>
        <Text style={styles.subtitle}>Mobile admin access for Yango drivers and payments.</Text>
      </View>
      <View style={styles.navRow}>
        {['home', 'drivers', 'cars', 'payments'].map((item) => (
          <TouchableOpacity key={item} onPress={() => setScreen(item)} style={[styles.navButton, screen === item && styles.navActive]}>
            <Text style={styles.navButtonText}>{item.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {screen === 'home' && (
        <View style={styles.contentBox}>
          <Text style={styles.sectionTitle}>Dashboard</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#f8fafc" />
          ) : (
            <>
              <Text style={styles.sectionText}>Active drivers: {dashboardData.activeDrivers}</Text>
              <Text style={styles.sectionText}>Active cars: {dashboardData.activeCars}</Text>
              <Text style={styles.sectionText}>Outstanding balance: ZMW {dashboardData.totalOutstanding.toLocaleString()}</Text>
              <TouchableOpacity style={styles.refreshButton} onPress={loadData}>
                <Text style={styles.refreshButtonText}>Refresh Data</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
      {screen === 'drivers' && (
        <View style={styles.contentBox}>
          <Text style={styles.sectionTitle}>Drivers</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#f8fafc" />
          ) : (
            <FlatList
              data={drivers}
              refreshing={refreshing}
              onRefresh={loadData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.driverRow}>
                  <Text style={styles.driverName}>{item.name}</Text>
                  <Text style={styles.driverMeta}>{item.status} • Phone: {item.phone || 'N/A'}</Text>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No drivers found</Text>}
            />
          )}
        </View>
      )}
      {screen === 'cars' && (
        <View style={styles.contentBox}>
          <Text style={styles.sectionTitle}>Cars</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#f8fafc" />
          ) : (
            <FlatList
              data={cars}
              refreshing={refreshing}
              onRefresh={loadData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.carRow}>
                  <Text style={styles.carReg}>{item.registration}</Text>
                  <Text style={styles.carMeta}>{item.model} {item.year} • {item.status}</Text>
                  {item.service_date && (
                    <Text style={styles.carService}>Service due: {new Date(item.service_date).toLocaleDateString()}</Text>
                  )}
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No cars found</Text>}
            />
          )}
        </View>
      )}
      {screen === 'payments' && (
        <View style={styles.contentBox}>
          <Text style={styles.sectionTitle}>Payments</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#f8fafc" />
          ) : (
            <FlatList
              data={payments.slice(0, 10)} // Show last 10 payments
              refreshing={refreshing}
              onRefresh={loadData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentDriver}>Driver ID: {item.driver_id}</Text>
                  <Text style={styles.paymentMeta}>
                    Expected: ZMW {item.expected_amount} • Paid: ZMW {item.paid_amount} • Balance: ZMW {item.balance}
                  </Text>
                  {item.payment_date && (
                    <Text style={styles.paymentDate}>Date: {new Date(item.payment_date).toLocaleDateString()}</Text>
                  )}
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No payments found</Text>}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#cbd5e1',
    marginTop: 6,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    marginHorizontal: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  navActive: {
    backgroundColor: '#0891b2',
  },
  navButtonText: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  contentBox: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 20,
    flex: 1,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 20,
    marginBottom: 12,
    fontWeight: '700',
  },
  sectionText: {
    color: '#cbd5e1',
    lineHeight: 24,
    marginBottom: 8,
  },
  driverRow: {
    paddingVertical: 12,
    borderBottomColor: '#334155',
    borderBottomWidth: 1,
  },
  driverName: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  driverMeta: {
    color: '#94a3b8',
    marginTop: 4,
  },
  carRow: {
    paddingVertical: 12,
    borderBottomColor: '#334155',
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  carReg: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  carMeta: {
    color: '#94a3b8',
    marginTop: 4,
  },
  carService: {
    color: '#fbbf24',
    marginTop: 2,
    fontSize: 12,
  },
  paymentRow: {
    paddingVertical: 12,
    borderBottomColor: '#334155',
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  paymentDriver: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentMeta: {
    color: '#94a3b8',
    marginTop: 4,
    fontSize: 14,
  },
  paymentDate: {
    color: '#64748b',
    marginTop: 2,
    fontSize: 12,
  },
  emptyText: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  refreshButton: {
    backgroundColor: '#0891b2',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 16,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#f8fafc',
    fontWeight: '600',
  },
});

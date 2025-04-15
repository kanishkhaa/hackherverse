import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  FontAwesome5,
  MaterialIcons,
  Ionicons,
  Feather,
} from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Sidebar from '../components/Sidebar';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [isSearchByBus, setIsSearchByBus] = useState(false);
  const [busData, setBusData] = useState(null);
  const [co2Saved, setCo2Saved] = useState(1.7);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('home');
  const [mapMarkers, setMapMarkers] = useState([]);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Route Update',
      message: 'Bus 42 is running 3 minutes behind schedule.',
      type: 'info',
      time: '2 min ago',
    },
    {
      id: '2',
      title: 'Service Alert',
      message: 'Line 15 has been temporarily rerouted due to construction on Main Street.',
      type: 'warning',
      time: '10 min ago',
    },
    {
      id: '3',
      title: 'Special Notice',
      message: 'Weekend schedule in effect tomorrow due to public holiday.',
      type: 'info',
      time: '25 min ago',
    },
  ]);

  const slideAnim = useState(new Animated.Value(100))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setCurrentLocation(newLocation);

      setMapMarkers([
        {
          coordinate: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          title: 'You are here',
          type: 'user',
        },
      ]);
    })();
  }, []);

  useEffect(() => {
    if (busData) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      if (currentLocation) {
        setMapMarkers([
          {
            coordinate: {
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            },
            title: 'You are here',
            type: 'user',
          },
          {
            coordinate: busData.location,
            title: `Bus ${busData.busNumber}`,
            description: `ETA: ${busData.eta}`,
            type: 'bus',
          },
        ]);
      }
    } else {
      slideAnim.setValue(100);
      fadeAnim.setValue(0);
    }
  }, [busData]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const searchTransport = () => {
    if (!currentLocation) return;
    setSearchMode(false);
    setTimeout(() => {
      const newBusData = {
        busNumber: busNumber || '42',
        routeName: isSearchByBus
          ? 'Central Station to Beach Road'
          : `${fromLocation || 'Current Location'} to ${toLocation || 'Downtown'}`,
        eta: '5 min',
        fullness: 'few',
        location: {
          latitude: currentLocation.latitude - 0.002,
          longitude: currentLocation.longitude + 0.003,
        },
      };

      setBusData(newBusData);

      const newNotification = {
        id: Date.now().toString(),
        title: 'Bus Found',
        message: `Bus ${busNumber || '42'} arriving in 5 minutes`,
        type: 'success',
        time: 'Just now',
      };
      setNotifications([newNotification, ...notifications.slice(0, 4)]);
    }, 1000);
  };

  const handleMenuItemPress = (menuItem) => {
    setActiveMenuItem(menuItem);
    setSidebarVisible(false);
  };

  const handleSignOut = () => {
    setSidebarVisible(false);
  };

  const getFullnessIndicator = (status) => {
    switch (status) {
      case 'available':
        return { icon: '🟢', text: 'Available Seats', color: '#4CAF50' };
      case 'few':
        return { icon: '🟠', text: 'Few Seats Left', color: '#FF9800' };
      case 'full':
        return { icon: '🔴', text: 'Full', color: '#F44336' };
      default:
        return { icon: '⚪', text: 'Unknown Status', color: '#9E9E9E' };
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return <Ionicons name="information-circle" size={24} color="#2196F3" />;
      case 'warning':
        return <Ionicons name="warning" size={24} color="#FF9800" />;
      case 'success':
        return <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />;
      default:
        return <Ionicons name="alert-circle" size={24} color="#9E9E9E" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Feather name="menu" size={24} color="#1976d2" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <FontAwesome5 name="bus" size={18} color="#1976d2" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Bus Tracker</Text>
        </View>

        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => setNotificationsVisible(true)}
        >
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>{notifications.length}</Text>
          </View>
          <Ionicons name="notifications" size={22} color="#1976d2" />
        </TouchableOpacity>
      </View>

      {!searchMode && !busData && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setSearchMode(true)}
        >
          <MaterialIcons name="search" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      <View style={styles.mapContainer}>
        {currentLocation ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={currentLocation}
            showsUserLocation={false}
            showsMyLocationButton={true}
            showsCompass={true}
            showsScale={true}
          >
            {mapMarkers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
              >
                {marker.type === 'user' ? (
                  <View style={styles.userMarker}>
                    <View style={styles.userMarkerDot} />
                  </View>
                ) : (
                  <View style={styles.busMarker}>
                    <FontAwesome5 name="bus" size={20} color="#fff" />
                  </View>
                )}
              </Marker>
            ))}
          </MapView>
        ) : (
          <View style={styles.loadingMap}>
            <Text>Loading map...</Text>
          </View>
        )}
      </View>

      {searchMode && (
        <View style={styles.searchOverlay}>
          <BlurView intensity={30} style={StyleSheet.absoluteFill} tint="dark" />
          <View style={styles.searchCard}>
            <View style={styles.searchHeader}>
              <Text style={styles.searchTitle}>Find Your Bus</Text>
              <TouchableOpacity onPress={() => setSearchMode(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchTypeSelector}>
              <TouchableOpacity
                style={[styles.searchTypeButton, !isSearchByBus && styles.selectedSearchType]}
                onPress={() => setIsSearchByBus(false)}
              >
                <MaterialIcons name="route" size={18} color={!isSearchByBus ? '#fff' : '#555'} />
                <Text style={[styles.searchTypeText, !isSearchByBus && styles.selectedSearchTypeText]}>
                  By Route
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.searchTypeButton, isSearchByBus && styles.selectedSearchType]}
                onPress={() => setIsSearchByBus(true)}
              >
                <FontAwesome5 name="bus" size={16} color={isSearchByBus ? '#fff' : '#555'} />
                <Text style={[styles.searchTypeText, isSearchByBus && styles.selectedSearchTypeText]}>
                  By Bus
                </Text>
              </TouchableOpacity>
            </View>

            {isSearchByBus ? (
              <View style={styles.inputContainer}>
                <FontAwesome5 name="bus" size={20} color="#777" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Bus Number"
                  value={busNumber}
                  onChangeText={setBusNumber}
                  keyboardType="number-pad"
                />
              </View>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="my-location" size={20} color="#777" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="From: Current Location"
                    value={fromLocation}
                    onChangeText={setFromLocation}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="location-on" size={20} color="#777" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="To: Destination"
                    value={toLocation}
                    onChangeText={setToLocation}
                  />
                </View>
              </>
            )}

            <TouchableOpacity style={styles.searchButton} onPress={searchTransport}>
              <Text style={styles.searchButtonText}>Find Bus</Text>
              <MaterialIcons name="directions-bus" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {busData && (
        <Animated.View
          style={[
            styles.infoContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.busInfoHeader}>
            <View style={styles.busNumberContainer}>
              <Text style={styles.busNumberLabel}>BUS</Text>
              <Text style={styles.busNumberText}>{busData.busNumber}</Text>
            </View>

            <View style={styles.etaContainer}>
              <Text style={styles.etaLabel}>ARRIVING IN</Text>
              <Text style={styles.etaText}>{busData.eta}</Text>
            </View>

            <View
              style={[
                styles.fullnessContainer,
                { backgroundColor: getFullnessIndicator(busData.fullness).color + '20' },
              ]}
            >
              <Text style={styles.fullnessIcon}>{getFullnessIndicator(busData.fullness).icon}</Text>
              <Text
                style={[
                  styles.fullnessText,
                  { color: getFullnessIndicator(busData.fullness).color },
                ]}
              >
                {getFullnessIndicator(busData.fullness).text}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.routeInfoContainer}>
            <MaterialIcons name="directions" size={20} color="#1976d2" />
            <Text style={styles.routeText}>{busData.routeName}</Text>
          </View>

          <View style={styles.ecoContainer}>
            <View style={styles.ecoIconContainer}>
              <Ionicons name="leaf" size={28} color="#4CAF50" />
            </View>
            <View style={styles.ecoTextContainer}>
              <Text style={styles.ecoTitle}>Eco Impact</Text>
              <Text style={styles.ecoText}>
                You've saved {co2Saved} kg of CO₂ by using public transportation today
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.trackButton}>
            <Text style={styles.trackButtonText}>Live Track</Text>
            <MaterialIcons name="gps-fixed" size={18} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      )}

      <Sidebar
        visible={sidebarVisible}
        activeMenuItem={activeMenuItem}
        onClose={toggleSidebar}
        onMenuItemPress={handleMenuItemPress}
        onSignOut={handleSignOut}
      />

      <Modal
        visible={notificationsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setNotificationsVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.notificationPanel}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>Smart Notifications</Text>
              <TouchableOpacity onPress={() => setNotificationsVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.notificationList}>
              {notifications.map((notification) => (
                <View key={notification.id} style={styles.notificationItem}>
                  <View style={styles.notificationIconContainer}>
                    {getNotificationIcon(notification.type)}
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationItemTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <Text style={styles.notificationTime}>{notification.time}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 2,
    zIndex: 10,
  },
  menuButton: {
    padding: 5,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationButton: {
    padding: 5,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F44336',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 11,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  userMarker: {
    backgroundColor: 'rgba(25, 118, 210, 0.3)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userMarkerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1976d2',
  },
  busMarker: {
    backgroundColor: '#ff9800',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  loadingMap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#1976d2',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 10,
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  searchCard: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchTypeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  selectedSearchType: {
    backgroundColor: '#1976d2',
  },
  searchTypeText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#555',
  },
  selectedSearchTypeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#1976d2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
    elevation: 8,
  },
  busInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  busNumberContainer: {
    alignItems: 'center',
  },
  busNumberLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#777',
  },
  busNumberText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  etaContainer: {
    alignItems: 'center',
  },
  etaLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#777',
  },
  etaText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  fullnessContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 8,
  },
  fullnessIcon: {
    fontSize: 22,
  },
  fullnessText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
   divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
  routeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  routeText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  ecoContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  ecoIconContainer: {
    marginRight: 15,
  },
  ecoTextContainer: {
    flex: 1,
  },
  ecoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 3,
  },
  ecoText: {
    fontSize: 14,
    color: '#388E3C',
  },
  trackButton: {
    backgroundColor: '#1976d2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
  },
  trackButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  notificationPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    marginBottom: 10,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationList: {
    maxHeight: '90%',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationIconContainer: {
    marginRight: 15,
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
});

export default HomeScreen;
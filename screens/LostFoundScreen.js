// screens/LostAndFoundScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Sidebar from '../components/Sidebar'; // Your Sidebar component

const LostAndFoundScreen = ({ navigation }) => {
  const [isUserMode, setIsUserMode] = useState(true);
  const [activeTab, setActiveTab] = useState('report'); // 'report', 'status', 'claim'
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('lost');

  // Form states
  const [itemDescription, setItemDescription] = useState('');
  const [itemType, setItemType] = useState('');
  const [itemColor, setItemColor] = useState('');
  const [itemBrand, setItemBrand] = useState('');
  const [uniqueIdentifiers, setUniqueIdentifiers] = useState('');
  const [date, setDate] = useState(''); // Manual input: YYYY-MM-DD
  const [time, setTime] = useState(''); // Manual input: HH:MM
  const [route, setRoute] = useState('');
  const [station, setStation] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [storageLocation, setStorageLocation] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [reportedItems, setReportedItems] = useState([]);
  const [matchedItems, setMatchedItems] = useState([]);

  // Sample data for demonstration
  useEffect(() => {
    setReportedItems([
      {
        id: '1',
        description: 'Black leather wallet',
        type: 'Wallet',
        color: 'Black',
        brand: 'Coach',
        uniqueIdentifiers: 'Monogram "JD" inside',
        date: '2025-04-10',
        time: '14:30',
        route: 'Bus 42',
        station: 'Central Station',
        status: 'Pending',
        referenceNumber: 'LF-2025-001',
        image: 'https://example.com/wallet.jpg',
      },
      {
        id: '2',
        description: 'Blue umbrella with white polka dots',
        type: 'Umbrella',
        color: 'Blue',
        brand: 'Unknown',
        uniqueIdentifiers: 'White polka dots pattern',
        date: '2025-04-12',
        time: '09:15',
        route: 'Train Line 3',
        station: 'West End Terminal',
        status: 'Found',
        referenceNumber: 'LF-2025-002',
        image: null,
      },
    ]);

    setMatchedItems([
      {
        id: '1',
        lostItem: {
          description: 'Red headphones',
          referenceNumber: 'LF-2025-003',
          date: '2025-04-08',
        },
        foundItem: {
          storageLocation: 'Lost & Found Office, Central Station',
          referenceNumber: 'FF-2025-012',
          date: '2025-04-09',
        },
        status: 'Under Review',
        matchConfidence: 'High',
      },
    ]);
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleModeToggle = () => {
    setIsUserMode(!isUserMode);
    resetForm();
  };

  const resetForm = () => {
    setItemDescription('');
    setItemType('');
    setItemColor('');
    setItemBrand('');
    setUniqueIdentifiers('');
    setDate('');
    setTime('');
    setRoute('');
    setStation('');
    setContactInfo('');
    setImageUri(null);
    setReferenceNumber('');
    setStorageLocation('');
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!itemType || !itemDescription || !route || !station || (isUserMode && !contactInfo) || (!isUserMode && !storageLocation)) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // Basic date format validation (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (date && !dateRegex.test(date)) {
      Alert.alert('Error', 'Please enter date in YYYY-MM-DD format');
      return;
    }

    // Basic time format validation (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (time && !timeRegex.test(time)) {
      Alert.alert('Error', 'Please enter time in HH:MM format');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const newReferenceNumber = isUserMode ? `LF-2025-${Math.floor(Math.random() * 1000)}` : `FF-2025-${Math.floor(Math.random() * 1000)}`;

      Alert.alert(
        'Success!',
        `Your ${isUserMode ? 'lost' : 'found'} item report has been submitted successfully. Reference number: ${newReferenceNumber}`,
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              const newItem = {
                id: String(reportedItems.length + 1),
                description: itemDescription,
                type: itemType,
                color: itemColor,
                brand: itemBrand,
                uniqueIdentifiers,
                date: date || 'Unknown',
                time: time || 'Unknown',
                route,
                station,
                status: 'Pending',
                referenceNumber: newReferenceNumber,
                image: imageUri,
              };
              setReportedItems([...reportedItems, newItem]);
              setActiveTab('status');
            },
          },
        ]
      );
    }, 1500);
  };

  const handleStatusCheck = () => {
    if (!referenceNumber.trim()) {
      Alert.alert('Reference Number Required', 'Please enter a reference number to check status');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const item = reportedItems.find((item) => item.referenceNumber === referenceNumber);

      if (item) {
        Alert.alert(
          'Item Status',
          `Reference: ${item.referenceNumber}\nDescription: ${item.description}\nStatus: ${item.status}\n${
            item.status === 'Found' ? 'Please go to the Claims tab to arrange pickup.' : ''
          }`
        );
      } else {
        Alert.alert('Not Found', 'No item found with this reference number');
      }
    }, 1000);
  };

  const handleClaimRequest = (itemId) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      Alert.alert(
        'Claim Requested',
        'Your claim request has been submitted. You will receive a confirmation code via email/SMS to verify your identity before pickup.',
        [{ text: 'OK' }]
      );

      // Update item status
      const updatedItems = matchedItems.map((item) =>
        item.id === itemId ? { ...item, status: 'Claim Requested' } : item
      );
      setMatchedItems(updatedItems);
    }, 1000);
  };

  const renderReportForm = () => (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>{isUserMode ? 'Report a Lost Item' : 'Report a Found Item'}</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Item Type*</Text>
        <TextInput
          style={styles.input}
          value={itemType}
          onChangeText={setItemType}
          placeholder="E.g. Wallet, Phone, Umbrella"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description*</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={itemDescription}
          onChangeText={setItemDescription}
          placeholder="Detailed description of the item"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={styles.label}>Color</Text>
          <TextInput
            style={styles.input}
            value={itemColor}
            onChangeText={setItemColor}
            placeholder="Main color"
          />
        </View>

        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={styles.label}>Brand</Text>
          <TextInput
            style={styles.input}
            value={itemBrand}
            onChangeText={setItemBrand}
            placeholder="Brand if known"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Unique Identifiers</Text>
        <TextInput
          style={styles.input}
          value={uniqueIdentifiers}
          onChangeText={setUniqueIdentifiers}
          placeholder="Any distinguishing features"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="E.g. 2025-04-15"
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={styles.label}>Time (HH:MM)</Text>
          <TextInput
            style={styles.input}
            value={time}
            onChangeText={setTime}
            placeholder="E.g. 14:30"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Route/Vehicle Number*</Text>
        <TextInput
          style={styles.input}
          value={route}
          onChangeText={setRoute}
          placeholder="Bus/Train ID or Line Number"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Station or Stop Name*</Text>
        <TextInput
          style={styles.input}
          value={station}
          onChangeText={setStation}
          placeholder="Where item was lost/found"
        />
      </View>

      {isUserMode ? (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Contact Information*</Text>
          <TextInput
            style={styles.input}
            value={contactInfo}
            onChangeText={setContactInfo}
            placeholder="Email or Phone Number"
            keyboardType="email-address"
          />
        </View>
      ) : (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Storage Location*</Text>
          <TextInput
            style={styles.input}
            value={storageLocation}
            onChangeText={setStorageLocation}
            placeholder="Where the item is kept"
          />
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Upload Photo</Text>
        <View style={styles.imageUploadContainer}>
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => setImageUri(null)}>
                <MaterialIcons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <MaterialIcons name="add-photo-alternate" size={24} color="#1976d2" />
              <Text style={styles.uploadButtonText}>Select Image</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity disabled={isLoading} onPress={handleSubmit} style={[styles.submitButton, isLoading && { opacity: 0.7 }]}>
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Report</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  const renderStatusChecker = () => (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>Check Item Status</Text>

      <View style={styles.segmentedControl}>
        {['all', 'pending', 'found'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.segmentButton, statusFilter === filter && styles.segmentButtonActive]}
            onPress={() => setStatusFilter(filter)}
          >
            <Text style={[styles.segmentButtonText, statusFilter === filter && styles.segmentButtonTextActive]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Reference Number</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={referenceNumber}
            onChangeText={setReferenceNumber}
            placeholder="Enter reference number"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleStatusCheck}>
            <Feather name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Reported Items</Text>

      {reportedItems.length > 0 ? (
        reportedItems
          .filter((item) => statusFilter === 'all' || item.status.toLowerCase() === statusFilter)
          .map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemCardHeader}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.description}</Text>
                  <Text style={styles.itemSubtitle}>Ref: {item.referenceNumber}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'Pending' && styles.statusPending,
                    item.status === 'Found' && styles.statusFound,
                    item.status === 'Claimed' && styles.statusClaimed,
                    item.status === 'Under Review' && styles.statusReview,
                  ]}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.itemCardBody}>
                <View style={styles.itemDetail}>
                  <MaterialIcons name="category" size={16} color="#666" />
                  <Text style={styles.itemDetailText}>{item.type}</Text>
                </View>

                <View style={styles.itemDetail}>
                  <MaterialIcons name="location-on" size={16} color="#666" />
                  <Text style={styles.itemDetailText}>{item.station}</Text>
                </View>

                <View style={styles.itemDetail}>
                  <MaterialIcons name="directions-bus" size={16} color="#666" />
                  <Text style={styles.itemDetailText}>{item.route}</Text>
                </View>

                <View style={styles.itemDetail}>
                  <MaterialIcons name="event" size={16} color="#666" />
                  <Text style={styles.itemDetailText}>
                    {item.date} {item.time}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => Alert.alert('Details', `Full details for ${item.referenceNumber}`)}
              >
                <Text style={styles.viewDetailsButtonText}>View Details</Text>
                <MaterialIcons name="chevron-right" size={20} color="#1976d2" />
              </TouchableOpacity>
            </View>
          ))
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="package-variant-closed-remove" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>No reported items yet</Text>
        </View>
      )}
    </ScrollView>
  );

  const renderClaimProcess = () => (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>Claim Your Item</Text>

      <View style={styles.infoBox}>
        <MaterialIcons name="info" size={20} color="#1976d2" />
        <Text style={styles.infoText}>
          When a match is found for your lost item, it will appear here for you to claim. You'll need to verify your
          identity before claiming.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Matched Items</Text>

      {matchedItems.length > 0 ? (
        matchedItems.map((match) => (
          <View key={match.id} style={styles.matchCard}>
            <View style={styles.matchCardHeader}>
              <View style={styles.matchInfo}>
                <Text style={styles.matchTitle}>{match.lostItem.description}</Text>
                <View style={styles.matchConfidence}>
                  <Text style={styles.matchConfidenceText}>Match Confidence: {match.matchConfidence}</Text>
                  {match.matchConfidence === 'High' && <MaterialIcons name="verified" size={16} color="#4caf50" />}
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  match.status === 'Under Review' && styles.statusReview,
                  match.status === 'Claim Requested' && styles.statusPending,
                  match.status === 'Ready for Pickup' && styles.statusFound,
                  match.status === 'Claimed' && styles.statusClaimed,
                ]}
              >
                <Text style={styles.statusText}>{match.status}</Text>
              </View>
            </View>

            <View style={styles.matchDetails}>
              <View style={styles.matchDetailColumn}>
                <Text style={styles.matchDetailHeader}>Lost Item</Text>
                <View style={styles.matchDetail}>
                  <MaterialIcons name="receipt" size={16} color="#666" />
                  <Text style={styles.matchDetailText}>Ref: {match.lostItem.referenceNumber}</Text>
                </View>
                <View style={styles.matchDetail}>
                  <MaterialIcons name="event" size={16} color="#666" />
                  <Text style={styles.matchDetailText}>Lost on: {match.lostItem.date}</Text>
                </View>
              </View>

              <View style={styles.matchDetailDivider} />

              <View style={styles.matchDetailColumn}>
                <Text style={styles.matchDetailHeader}>Found Item</Text>
                <View style={styles.matchDetail}>
                  <MaterialIcons name="receipt" size={16} color="#666" />
                  <Text style={styles.matchDetailText}>Ref: {match.foundItem.referenceNumber}</Text>
                </View>
                <View style={styles.matchDetail}>
                  <MaterialIcons name="place" size={16} color="#666" />
                  <Text style={styles.matchDetailText}>{match.foundItem.storageLocation}</Text>
                </View>
              </View>
            </View>

            {match.status === 'Under Review' && (
              <TouchableOpacity onPress={() => handleClaimRequest(match.id)} style={styles.claimButton}>
                <Text style={styles.claimButtonText}>Request Claim</Text>
                <MaterialIcons name="chevron-right" size={20} color="#fff" />
              </TouchableOpacity>
            )}

            {match.status === 'Claim Requested' && (
              <View style={styles.claimInstructionsContainer}>
                <Text style={styles.claimInstructionsTitle}>Claim Instructions:</Text>
                <Text style={styles.claimInstructionsText}>
                  Please bring a valid ID and the confirmation code that was sent to your registered contact information.
                </Text>
                <Text style={styles.claimInstructionsText}>Pickup Location: Central Station Lost & Found Office</Text>
                <Text style={styles.claimInstructionsText}>Operating Hours: Mon-Fri 9:00 AM - 6:00 PM</Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="package-variant-closed-remove" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>No matched items yet</Text>
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Feather name="menu" size={24} color="#1976d2" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <MaterialIcons name="find-in-page" size={18} color="#1976d2" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Lost & Found</Text>
        </View>

        <TouchableOpacity style={styles.notificationButton} onPress={() => setNotificationsVisible(true)}>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>{notifications.length}</Text>
          </View>
          <Ionicons name="notifications" size={22} color="#1976d2" />
        </TouchableOpacity>
      </View>

      <View style={styles.modeToggleContainer}>
        <TouchableOpacity
          style={[styles.modeToggleButton, isUserMode && styles.modeToggleButtonActive]}
          onPress={() => (isUserMode ? null : handleModeToggle())}
        >
          <MaterialIcons name="person" size={18} color={isUserMode ? '#fff' : '#666'} />
          <Text style={[styles.modeToggleText, isUserMode && styles.modeToggleTextActive]}>User Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeToggleButton, !isUserMode && styles.modeToggleButtonActive]}
          onPress={() => (isUserMode ? handleModeToggle() : null)}
        >
          <MaterialIcons name="badge" size={18} color={!isUserMode ? '#fff' : '#666'} />
          <Text style={[styles.modeToggleText, !isUserMode && styles.modeToggleTextActive]}>Staff Mode</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {['report', 'status', 'claim'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => handleTabChange(tab)}
          >
            <MaterialIcons
              name={tab === 'report' ? 'post-add' : tab === 'status' ? 'search' : 'verified'}
              size={20}
              color={activeTab === tab ? '#1976d2' : '#666'}
            />
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.contentContainer}>
        {activeTab === 'report' && renderReportForm()}
        {activeTab === 'status' && renderStatusChecker()}
        {activeTab === 'claim' && renderClaimProcess()}
      </KeyboardAvoidingView>

      <Modal
        visible={notificationsVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNotificationsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notificationModal}>
            <View style={styles.notificationModalHeader}>
              <Text style={styles.notificationModalTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setNotificationsVisible(false)}>
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {notifications.length > 0 ? (
              <ScrollView style={styles.notificationList}>
                {notifications.map((notification, index) => (
                  <View key={index} style={styles.notificationItem}>
                    <MaterialIcons name="notifications" size={24} color="#1976d2" />
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      <Text style={styles.notificationText}>{notification.message}</Text>
                      <Text style={styles.notificationTime}>{notification.time}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyNotifications}>
                <MaterialIcons name="notifications-off" size={48} color="#ccc" />
                <Text style={styles.emptyNotificationsText}>No notifications yet</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Sidebar
        visible={sidebarVisible}
        activeMenuItem={activeMenuItem}
        onClose={() => setSidebarVisible(false)}
        onMenuItemPress={setActiveMenuItem}
        onSignOut={() => navigation.navigate('Onboarding')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuButton: {
    padding: 4,
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
    fontWeight: '600',
    color: '#333',
  },
  notificationButton: {
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#f44336',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#eef2f8',
    padding: 4,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 12,
  },
  modeToggleButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  modeToggleButtonActive: {
    backgroundColor: '#1976d2',
  },
  modeToggleText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  modeToggleTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1976d2',
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#1976d2',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  imageUploadContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  uploadButtonText: {
    marginLeft: 8,
    color: '#1976d2',
    fontWeight: '500',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#6B7280',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#eef2f8',
    borderRadius: 8,
    marginBottom: 16,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: '#1976d2',
  },
  segmentButtonText: {
    fontSize: 14,
    color: '#666',
  },
  segmentButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#1976d2',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
  },
  statusFound: {
    backgroundColor: '#d4edda',
  },
  statusClaimed: {
    backgroundColor: '#d1ecf1',
  },
  statusReview: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemCardBody: {
    marginBottom: 12,
  },
  itemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemDetailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  viewDetailsButtonText: {
    color: '#1976d2',
    fontWeight: '500',
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  matchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  matchInfo: {
    flex: 1,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  matchConfidence: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchConfidenceText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  matchDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  matchDetailColumn: {
    flex: 1,
  },
  matchDetailHeader: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  matchDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchDetailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  matchDetailDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 16,
  },
  claimButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 4,
  },
  claimInstructionsContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  claimInstructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  claimInstructionsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  notificationModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    maxHeight: '70%',
  },
  notificationModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  notificationList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationContent: {
    marginLeft: 12,
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  notificationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  emptyNotifications: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyNotificationsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
});

export default LostAndFoundScreen;
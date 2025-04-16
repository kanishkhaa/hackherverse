import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const sidebarStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },
  sidebar: {
    width: '75%',
    backgroundColor: '#fff',
    height: '100%',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 15,
    elevation: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  userInfo: {
    alignItems: 'center',
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
  },
  menuItems: {
    flex: 1,
    marginVertical: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  activeMenuItem: {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
  },
  activeMenuItemText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  menuItemText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 15,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  signOutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});

const Sidebar = ({ visible, activeMenuItem, onClose, onMenuItemPress, onSignOut }) => {
  const navigation = useNavigation();

  if (!visible) return null;
  const handleNavigation = (menuItem) => {
    onMenuItemPress(menuItem);
    switch (menuItem) {
      case 'home':
        navigation.navigate('HomeScreen');
        break;
      case 'subscription':
        navigation.navigate('SubscriptionScreen');
        break;
      case 'routes':
        navigation.navigate('JourneyScreen');
        break;
      case 'lost':
        navigation.navigate('LostFoundScreen');
        break;
      case 'settings':
        console.log('Navigate to settings');
        break;
      default:
        break;
    }
  };

  const handleSignOutNavigation = () => {
    onSignOut();
    navigation.navigate('Onboarding');
  };

  return (
    <View style={sidebarStyles.container}>
      <View style={sidebarStyles.sidebar}>
        <View style={sidebarStyles.header}>
          <Text style={sidebarStyles.title}>Bus Tracker</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={sidebarStyles.userInfo}>
          <View style={sidebarStyles.avatar}>
            <Text style={sidebarStyles.avatarText}>JD</Text>
          </View>
          <Text style={sidebarStyles.userName}>John Doe</Text>
          <Text style={sidebarStyles.userEmail}>john.doe@example.com</Text>
        </View>

        <ScrollView style={sidebarStyles.menuItems}>
          <TouchableOpacity
            style={[
              sidebarStyles.menuItem,
              activeMenuItem === 'home' && sidebarStyles.activeMenuItem,
            ]}
            onPress={() => handleNavigation('home')}
          >
            <Ionicons
              name="home"
              size={20}
              color={activeMenuItem === 'home' ? '#1976d2' : '#555'}
            />
            <Text
              style={[
                sidebarStyles.menuItemText,
                activeMenuItem === 'home' && sidebarStyles.activeMenuItemText,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              sidebarStyles.menuItem,
              activeMenuItem === 'subscription' && sidebarStyles.activeMenuItem,
            ]}
            onPress={() => handleNavigation('subscription')}
          >
            <Ionicons
              name="card"
              size={20}
              color={activeMenuItem === 'subscription' ? '#1976d2' : '#555'}
            />
            <Text
              style={[
                sidebarStyles.menuItemText,
                activeMenuItem === 'subscription' && sidebarStyles.activeMenuItemText,
              ]}
            >
              Subscription
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              sidebarStyles.menuItem,
              activeMenuItem === 'routes' && sidebarStyles.activeMenuItem,
            ]}
            onPress={() => handleNavigation('routes')}
          >
            <MaterialIcons
              name="directions-bus"
              size={20}
              color={activeMenuItem === 'routes' ? '#1976d2' : '#555'}
            />
            <Text
              style={[
                sidebarStyles.menuItemText,
                activeMenuItem === 'routes' && sidebarStyles.activeMenuItemText,
              ]}
            >
              My Routes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              sidebarStyles.menuItem,
              activeMenuItem === 'lost' && sidebarStyles.activeMenuItem,
            ]}
            onPress={() => handleNavigation('lost')}
          >
            <Ionicons
              name="star"
              size={20}
              color={activeMenuItem === 'lost' ? '#1976d2' : '#555'}
            />
            <Text
              style={[
                sidebarStyles.menuItemText,
                activeMenuItem === 'lost' && sidebarStyles.activeMenuItemText,
              ]}
            >
              Lost & Found
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              sidebarStyles.menuItem,
              activeMenuItem === 'settings' && sidebarStyles.activeMenuItem,
            ]}
            onPress={() => handleNavigation('settings')}
          >
            <Ionicons
              name="settings"
              size={20}
              color={activeMenuItem === 'settings' ? '#1976d2' : '#555'}
            />
            <Text
              style={[
                sidebarStyles.menuItemText,
                activeMenuItem === 'settings' && sidebarStyles.activeMenuItemText,
              ]}
            >
              Settings
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          style={sidebarStyles.signOutButton}
          onPress={handleSignOutNavigation}
        >
          <Ionicons name="log-out" size={20} color="#fff" />
          <Text style={sidebarStyles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={sidebarStyles.overlay}
        onPress={onClose}
        activeOpacity={1}
      />
    </View>
  );
};

export default Sidebar;
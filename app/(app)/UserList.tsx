import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ListRenderItem,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, User } from '@/constants/types';
import { useRouter } from 'expo-router';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import DeleteUserDialog from '@/components/DeleteUserDialog';
import { LinearGradient } from 'expo-linear-gradient';
import { formatTime } from '@/constants/helperFunc';
import AppToast from '@/components/AppToast';

type UserListScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'UserList'>;
};

const ShimmerPlaceholder = () => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-350, 350],
  });

  return (
    <View style={styles.shimmerContainer}>
      {[1, 2, 3, 4, 5].map((_, index) => (
        <View key={index} style={styles.shimmerItem}>
          <View style={styles.shimmerContent}>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  transform: [{ translateX }],
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const UserList: React.FC<UserListScreenProps> = (): React.ReactNode => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (): Promise<void> => {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersData);
      setFilteredUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleSearch = (text: string): void => {
    setSearchQuery(text);
    const filtered = users.filter(user =>
      user.firstName?.toLowerCase().includes(text.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(text.toLowerCase()) ||
      user.email?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setFilteredUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setDeleteDialogVisible(false);
      AppToast.show('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      AppToast.show('Failed to delete user');
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogVisible(false);
    setSelectedUserId(null);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const renderUserItem: ListRenderItem<User> = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => router.push({
        pathname: '/stacks/UserDetail',
        params: {
          user: JSON.stringify({
            ...item,
            joinDate: {"nanoseconds": 0, "seconds": 1737704520}
          })
        }
      })}
    >
      <LinearGradient
        colors={['#ffffff', '#f8f9ff']}
        style={styles.userItemGradient}
      >
        <View style={styles.userMainInfo}>
          <View style={styles.userAvatarSection}>
            <View style={[styles.userAvatar, styles.avatarShadow]}>
              <Text style={styles.userInitials}>{getInitials(item.firstName, item.lastName)}</Text>
            </View>
            <View style={styles.userTextInfo}>
              <Text style={styles.userName}>{`${item.firstName} ${item.lastName}`}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.joinDate}>{formatTime.formatDate(item.joinDate)}</Text>
            <TouchableOpacity 
              onPress={() => {
                setSelectedUserId(item.id);
                setDeleteDialogVisible(true);
              }}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={20} color="#FF5252" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.userDetails}>
          <View style={styles.detailItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="call-outline" size={16} color="#4A6FFF" />
            </View>
            <Text style={styles.userPlan}>{item.phone || 'No phone'}</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="location-outline" size={16} color="#666" />
            </View>
            <Text style={styles.userVisits}>{item.address || 'No address'}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return <ShimmerPlaceholder />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </View>
      <FlatList<User>
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContainer}
      />

      <DeleteUserDialog
        visible={deleteDialogVisible}
        onClose={handleCloseDeleteDialog}
        userId={selectedUserId || ''}
        onDelete={handleDeleteUser}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  userItem: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  userItemGradient: {
    padding: 20,
  },
  userMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4A6FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarShadow: {
    shadowColor: '#4A6FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  userInitials: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  userTextInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    letterSpacing: 0.2,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  joinDate: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 111, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userPlan: {
    fontSize: 14,
    color: '#4A6FFF',
    fontWeight: '600',
  },
  userVisits: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: 'transparent',
  },
  shimmerContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f6fa',
  },
  shimmerItem: {
    height: 100,
    backgroundColor: '#fff',
    marginVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  shimmerContent: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default UserList;

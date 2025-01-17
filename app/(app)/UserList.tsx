
// screens/UserListScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, User } from '@/constants/types';
import { useRouter } from 'expo-router';

type UserListScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'UserList'>;
};

const UserList: React.FC<UserListScreenProps> = ({ navigation }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (): Promise<void> => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data: User[] = await response.json();
      setUsers(data);
      setFilteredUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleSearch = (text: string): void => {
    setSearchQuery(text);
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(text.toLowerCase()) ||
      user.email.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const renderUserItem: ListRenderItem<User> = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => router.push({
        pathname: '/stacks/UserDetail',
        params: {
          user: JSON.stringify(item)
        }
      })}
    >
      <Text style={styles.userName}>{item.username}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList<User>
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  userItem: {
    padding: 15,
    backgroundColor: '#fff',
  },
  userName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});

export default UserList;

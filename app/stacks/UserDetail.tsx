export interface UserDetail {
  id: string;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    }
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

// UserDetailScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  useWindowDimensions,
  Linking,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';

interface UserDetailScreenProps {
  route: RouteProp<{ params: { user: UserDetail } }, 'params'>;
}

const UserDetailScreen: React.FC<UserDetailScreenProps> = () => {
  const {user} = useLocalSearchParams();
  const userData = JSON.parse(user as string);
  console.log(userData);
  const { width } = useWindowDimensions();
  const imageSize = width * 0.4;

  const DetailRow: React.FC<{
    label: string;
    value: string;
    isLink?: boolean;
  }> = ({ label, value, isLink }) => (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}</Text>
      {isLink ? (
        <Text 
          style={[styles.value, styles.link]}
          onPress={() => Linking.openURL(`https://${value}`)}
        >
          {value}
        </Text>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
          <View style={styles.placeholderContainer}>
            {/* <Image source={require('@/assets/images/logo.png')} style={styles.placeholderImage} /> */}
          </View>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{userData?.name}</Text>
          <Text style={styles.username}>@{userData?.username}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
        </View>
        <DetailRow label="Email" value={userData?.email} />
        <DetailRow label="Phone" value={userData?.phone} />
        <DetailRow label="Website" value={userData?.website} isLink />
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Address</Text>
        </View>
        <DetailRow label="Street" value={`${userData?.address?.street}, ${userData?.address?.suite}`} />
        <DetailRow label="City" value={userData?.address?.city} />
        <DetailRow label="Zipcode" value={userData?.address?.zipcode} />
        <DetailRow 
          label="Location" 
          value={`${userData?.address?.geo?.lat}, ${userData?.address?.geo?.lng}`} 
        />
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Company</Text>
        </View>
        <DetailRow label="Name" value={userData?.company?.name} />
        <DetailRow label="Catch Phrase" value={userData?.company?.catchPhrase} />
        <DetailRow label="BS" value={userData?.company?.bs} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  imageContainer: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  nameContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  link: {
    color: '#4A6FFF',
    textDecorationLine: 'underline',
  }
});

export default UserDetailScreen;
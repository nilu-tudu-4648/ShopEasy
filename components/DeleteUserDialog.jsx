// components/DeleteUserDialog.jsx
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AppToast from './AppToast';
import { Dialog, View, Text, Button, Colors } from 'react-native-ui-lib';

const DeleteUserDialog = ({ userId, onClose, visible, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setLoading(true);
      onDelete();
      AppToast.show('User deleted successfully');
      onClose();
      router.push('/UserList');
    } catch (error) {
      AppToast.show('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onDismiss={onClose}
      containerStyle={styles.dialog}
      width="90%"
      height={250}
    >
      <View padding-20>
        <Text text60 red10 marginB-20>
          Delete User
        </Text>
        
        <Text text70 marginB-30>
          Are you sure you want to delete this user? This action cannot be undone.
        </Text>

        <View row spread marginT-20>
          <Button
            text70
            link
            label="Cancel"
            disabled={loading}
            onPress={onClose}
            style={styles.cancelButton}
          />
          
          <Button
            text70
            red10
            label={loading ? "Deleting..." : "Delete"}
            disabled={loading}
            onPress={handleDelete}
            style={styles.deleteButton}
          />
        </View>
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  cancelButton: {
    width: '45%',
  },
  deleteButton: {
    width: '45%',
    backgroundColor: Colors.red30,
  }
});

export default DeleteUserDialog;

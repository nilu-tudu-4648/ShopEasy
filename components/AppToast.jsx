import Toast from 'react-native-simple-toast';

const AppToast = {
  show: (message, duration = Toast.SHORT) => {
    if (!message || typeof message !== 'string') {
      console.warn('AppToast: Attempted to show toast with invalid message:', message);
      return;
    }
    Toast.show(message, duration);
  },
  
  showLong: (message) => {
    if (!message || typeof message !== 'string') {
      console.warn('AppToast: Attempted to show long toast with invalid message:', message);
      return;
    }
    Toast.show(message, Toast.LONG);
  }
};

export default AppToast;
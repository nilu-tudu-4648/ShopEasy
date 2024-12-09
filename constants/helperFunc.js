export const formatTime = {
    // Format seconds to HH:MM:SS
    toHHMMSS: (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    },
  
    // Format seconds to hours and minutes string
    toReadable: (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      
      if (hours === 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
      }
      if (minutes === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
      }
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    },
  
    // Format timestamp to time string
    toTimeString: (timestamp) => {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    },
  
    // Format full datetime
    toFullDateTime: (timestamp) => {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return date.toLocaleString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    },
  
    // Get duration between two timestamps in seconds
    getDuration: (startTime, endTime) => {
      if (!startTime || !endTime) return 0;
      const start = new Date(startTime);
      const end = new Date(endTime);
      return Math.floor((end - start) / 1000);
    },
  
    // Format remaining time
    getRemainingTime: (endTime) => {
      if (!endTime) return '';
      const now = new Date();
      const end = new Date(endTime);
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      return formatTime.toReadable(remaining);
    },
  
    // Get day name
    getDayName: (date = new Date()) => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[date.getDay()];
    }
  };
  
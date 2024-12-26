export const formatTime = {
  
    // Get duration between two timestamps in seconds
    getDuration: (startTime, endTime) => {
      if (!startTime || !endTime) return 0;
      const start = new Date(startTime);
      const end = new Date(endTime);
      return Math.floor((end - start) / 1000);
    },
  
    formatDateTime: (timestamp) => {
      const date = new Date(timestamp.seconds * 1000);
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const formattedTime = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      return `${formattedDate} ${formattedTime}`;
    }
  };
  
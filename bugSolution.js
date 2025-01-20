// bugSolution.js

const database = firebase.database();

function writeDataWithRetry(data, path, retryCount = 0) {
  database.ref(path).set(data)
    .then(() => {
      console.log('Data written successfully!');
    })
    .catch(error => {
      if (error.code === 'PERMISSION_DENIED' && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`PERMISSION_DENIED, retrying in ${delay}ms...`);
        setTimeout(() => writeDataWithRetry(data, path, retryCount + 1), delay);
      } else {
        console.error('Failed to write data:', error);
      }
    });
}

// Example usage:
const data = { message: 'Hello from Firebase!' };
writeDataWithRetry(data, 'messages/message1');
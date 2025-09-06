// Test API endpoints directly
console.log('Testing API endpoints...');

// Test backend connection
fetch('http://localhost:5000/')
  .then(response => response.text())
  .then(data => console.log('Backend response:', data))
  .catch(error => console.error('Backend connection error:', error));

// Test auth/register endpoint
const testData = {
  name: "Test User",
  email: "test@example.com", 
  password: "testpass123"
};

fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => console.log('Register test response:', data))
.catch(error => console.error('Register test error:', error));

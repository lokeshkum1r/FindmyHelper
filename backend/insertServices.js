// insertServices.js
const mongoose = require('mongoose');
const Service = require('./models/Service'); // Adjust the path as needed
const flattenedData = require('./flattenedServices.json'); // Flattened services data saved as JSON

// Replace with your actual MongoDB URI
const MONGODB_URI = 'mongodb://localhost:27017/FindmyHelper'; 

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ Connected to MongoDB');

  try {
    // Clear existing services (optional)
    await Service.deleteMany({});
    console.log('🗑️ Old services removed');

    // Insert the new data
    await Service.insertMany(flattenedData);
    console.log('✅ Services inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting services:', error);
  } finally {
    mongoose.connection.close();
  }
})
.catch(err => {
  console.error('❌ Failed to connect to MongoDB:', err);
});

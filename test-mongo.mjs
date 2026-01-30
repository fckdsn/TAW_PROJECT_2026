import mongoose from 'mongoose';

const uri = 'mongodb+srv://ivankas:OsjiIWMIXs5b4pi4@cluster0.kndc1rs.mongodb.net/?appName=Cluster0';

console.log('Trying to connect...');

mongoose.connect(uri)
  .then(() => {
    console.log('✅ CONNECTED TO MONGODB');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ CONNECTION FAILED');
    console.error(err.message);
    process.exit(1);
  });

  
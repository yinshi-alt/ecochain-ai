
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/ecoinsure', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// Models
const CarbonRecordSchema = new mongoose.Schema({
  companyId: String,
  date: Date,
  source: String,
  scope: { type: String, enum: ['SCOPE_1', 'SCOPE_2', 'SCOPE_3'] },
  amount: Number,
  blockchainHash: String,
  verified: Boolean
});

const PolicySchema = new mongoose.Schema({
  companyId: String,
  productId: String,
  status: String,
  coverage: Number,
  premium: Number,
  startDate: Date,
  endDate: Date
});

const CarbonRecord = mongoose.model('CarbonRecord', CarbonRecordSchema);
const Policy = mongoose.model('Policy', PolicySchema);

// Routes
app.get('/api/carbon/:companyId', async (req, res) => {
  try {
    const records = await CarbonRecord.find({ companyId: req.params.companyId });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/carbon', async (req, res) => {
  try {
    const newRecord = new CarbonRecord(req.body);
    // Simulate Blockchain Hashing
    newRecord.blockchainHash = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    newRecord.verified = true;
    await newRecord.save();
    res.json(newRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/policies/:companyId', async (req, res) => {
  try {
    const policies = await Policy.find({ companyId: req.params.companyId });
    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => {
  res.send('EcoInsure API is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

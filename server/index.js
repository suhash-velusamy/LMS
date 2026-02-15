const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());


const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) : true,
  credentials: true,
};
app.use(cors(corsOptions));

// Config
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'qwertyuiopasdfghjklzxcvbnm1234567890qwertyuiopasdfghjklzxcvbnm';
const MONGO_URI = process.env.MONGO_URI || `mongodb+srv://suhash_LMS:SUHASHvelu1947@lms.45pvhlf.mongodb.net/?appName=LMS`;

// Connect to MongoDB with error handling
mongoose
  .connect(MONGO_URI, { autoIndex: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Schemas & Models
const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    duration: { type: String, default: '' },
    image: { type: String, default: '' },
    features: { type: [String], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }],
    pickupDate: { type: String },
    pickupTime: { type: String },
    address: { type: String },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'picked-up',
        'in-progress',
        'out-for-delivery',
        'completed',
        'cancelled',
      ],
      default: 'pending',
    },
    totalAmount: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    adminNote: { type: String, default: '' },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
const Service = mongoose.model('Service', serviceSchema);
const Order = mongoose.model('Order', orderSchema);

// Auth helpers
const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: 'Invalid Authorization header' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/db-status', (req, res) => {
  res.json({ readyState: mongoose.connection.readyState });
});

// Auth Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, firstName = '', lastName = '' } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    // All new signups are users by default, admin is hardcoded
    const user = await User.create({ email, password: hashed, role: 'user', firstName, lastName });

    const token = signToken(user);
    return res.status(201).json({
      message: 'Signup successful',
      token,
      user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    // Check for hardcoded admin credentials
    if (email === 'admin@gmail.com' && password === 'admin#123') {
      const adminUser = {
        id: 'admin-1',
        email: 'admin@gmail.com',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User'
      };
      const token = jwt.sign({ id: adminUser.id, role: adminUser.role, email: adminUser.email }, JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.json({
        message: 'Login successful',
        token,
        user: adminUser,
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    return res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/logout', (req, res) => {
  // Stateless JWT – client should discard token
  res.json({ message: 'Logged out' });
});

app.get('/api/profile', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Services
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services', error: err.message });
  }
});

app.post('/api/admin/services', authenticate, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create service', error: err.message });
  }
});

app.put('/api/admin/services/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update service', error: err.message });
  }
});

app.delete('/api/admin/services/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete service', error: err.message });
  }
});

// Orders (User)
app.get('/api/orders', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('services');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

app.post('/api/orders', authenticate, async (req, res) => {
  try {
    const { services, pickupDate, pickupTime, address, totalAmount, notes } = req.body;
    const order = await Order.create({
      userId: req.user.id,
      services,
      pickupDate,
      pickupTime,
      address,
      totalAmount,
      notes,
    });
    const populated = await order.populate('services');
    res.status(201).json({ message: 'Order created', order: populated });
  } catch (err) {
    res.status(400).json({ message: 'Order creation failed', error: err.message });
  }
});

// Orders (Admin)
app.get('/api/admin/orders', authenticate, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find({}).populate('services').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

app.get('/api/admin/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

app.patch('/api/admin/update-order', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { orderId, status, adminNote = '' } = req.body;
    const allowed = [
      'pending',
      'confirmed',
      'picked-up',
      'in-progress',
      'out-for-delivery',
      'completed',
      'cancelled',
    ];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    order.adminNote = adminNote;
    await order.save();

    const populated = await order.populate('services');
    res.json({ message: 'Order updated', order: populated });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update order', error: err.message });
  }
});

// Fallback debug routes (kept, but protected for safety)
app.get('/api/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Debug route to create a test user (for dev only)
app.post('/api/debug/create-test-user', async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ message: 'Not allowed in production' });
  try {
    const { email = 'user@example.com', password = 'user123', role = 'user' } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(200).json({ message: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, role });
    res.status(201).json({ message: 'Test user created', user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Create test user error:', err);
    res.status(500).json({ message: 'Failed to create test user', error: err.message });
  }
});

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../laundry_system-main/dist');

  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}


app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

const express = require("express");
const { createUser, verifyPassword } = require('./models/user');
const mongoose = require("mongoose");
const ejs = require("ejs");
const firestore = require('./firestore');
const Driver = require('./models/driver');
const Package = require('./models/package');
const app = express();
const session = require("express-session");
const cors = require('cors');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("ejs", ejs.renderFile);
app.set("view engine", "ejs");

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:4200', // Replace with your Angular app's URL
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Session middleware
app.use(session({
  secret: 'your-secret-key', // Replace with a strong, unique key
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));


function isAuthenticated(req, res, next) {
  if (req.session && req.session.username) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
}

// Use this middleware for all routes except home, login, and signup
app.use((req, res, next) => {
  const openPaths = ['/', '/32510799/Chaliena/api/v1/login', '/32510799/Chaliena/api/v1/signup'];
  if (!openPaths.includes(req.path)) {
    return isAuthenticated(req, res, next);
  }
  next();
});

/**
 * Connect to MongoDB using Mongoose.
 */
mongoose.connect('mongodb://localhost:27017/monashdelivery')
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
});


/**
 * Initialize Firestore counters for tracking statistics.
 */
async function initializeCounters() {
  const counters = ['create', 'retrieve', 'update', 'delete'];
  const batch = firestore.batch();

  counters.forEach(counter => {
    const counterRef = firestore.collection('counters').doc(counter);
    batch.set(counterRef, { count: 0 }, { merge: true });
  });

  await batch.commit();
}

initializeCounters().catch(console.error);

/**
 * Increments a counter in Firestore.
 * @param {string} counterName - The name of the counter to increment.
 * @returns {Promise<void>}
 * @throws {Error} - If the counter document does not exist.
 */
async function incrementCounter(counterName) {
  const counterRef = firestore.collection('counters').doc(counterName);
  await firestore.runTransaction(async (transaction) => {
    const doc = await transaction.get(counterRef);
    if (!doc.exists) {
      throw new Error('Counter does not exist!');
    }
    const newCount = (doc.data().count || 0) + 1;
    transaction.update(counterRef, { count: newCount });
  });
}

// Home route (open)
app.get('/32510799/Chaliena/api/v1', (req, res) => {
  res.json({ message: 'Welcome to the Delivery Management System' });
});

// Login route (open)
// Login route (open)
app.post('/32510799/Chaliena/api/v1/login', async (req, res) => {
  console.log('Logging in...');
  const { username, password } = req.body;
  try {
    const isValid = await verifyPassword(username, password);
    if (!isValid) {
      return res.status(400).json({ status: "Invalid credentials" });
    }

    // Assuming you have a function that fetches the user details
    const user = { username: username }; // You can replace this with the actual user object

    req.session.username = username;
    
    // Send the user data along with the response so the client can store it
    res.status(200).json({ 
      status: "Login successful", 
      user: user, // Include user object in the response
      redirectTo: '/32510799/Chaliena/api/v1/' 
    });

    console.log('Successful login.');
  } catch (error) {
    res.status(400).json({ status: error.message });
  }
});


// Signup route (open)
app.post('/32510799/Chaliena/api/v1/signup', async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  try {
    await createUser(username, password, confirmPassword);
    res.status(200).json({ status: "Signup successful", redirectTo: '/32510799/Chaliena/api/v1/login' });
  } catch (error) {
    res.status(400).json({ status: error.message });
  }
});

// Logout route (protected)
app.post('/32510799/Chaliena/api/v1/logout', isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ status: "Error logging out" });
    }
    res.status(200).json({ status: "Logout successful", redirectTo: '/32510799/Chaliena/api/v1' });
  });
});

// Firestore route for statistics
app.get('/32510799/Chaliena/api/v1/stats', isAuthenticated, async (req, res) => {
  console.log('Request received for statistics'); // Log when the endpoint is hit
  try {
    const countersSnapshot = await firestore.collection('counters').get();
    const counters = {};
    countersSnapshot.forEach(doc => {
      counters[doc.id] = doc.data().count;
    });
    res.json(counters); // Don't forget to send a response back
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'An error occurred while fetching statistics.' });
  }
});


app.get(['/32510799/Chaliena/api/v1/drivers', '/32510799/Chaliena/api/v1/drivers/'], isAuthenticated, async (req, res) => {
  console.log('Request received for /drivers');
  try {
    const drivers = await Driver.find();
    console.log('Drivers fetched:', drivers);
    await incrementCounter('retrieve');
    res.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post(['/32510799/Chaliena/api/v1/drivers/add', '/32510799/Chaliena/api/v1/drivers/add/'], isAuthenticated,  async (req, res) => {
  console.log('Creating driver');
  const { driver_name, driver_department, driver_licence, driver_isActive } = req.body;

  // Log each field to see what values are being passed
  console.log('Driver Name:', driver_name);
  console.log('Driver Department:', driver_department);
  console.log('Driver Licence:', driver_licence);
  console.log('Driver Is Active:', driver_isActive);

  // Convert "on" to true, "off" or undefined to false
  const isActive = driver_isActive === "on";

  // Generate a unique driver ID using the generateId() function
  const driverId = generateId();
  console.log('Generated Driver ID:', driverId);

  // Create a new Driver object
  const newDriver = new Driver({
    name: driver_name,
    department: driver_department, // Ensure this is the correct field name
    licenceNumber: driver_licence,
    isActive: isActive,
    id: driverId // Assign the generated driver ID
  });

  console.log('New Driver Object:', newDriver);

  try {
    await newDriver.save();
    await incrementCounter('create');
    // Respond with the driver ID and MongoDB ID
    res.status(201).json({
      id: newDriver._id,
      driver_id: newDriver.id
    });
  } catch (error) {
    console.error('Error saving driver:', error); // Log the error
    if (error.name === 'ValidationError') {
      // Log specific validation errors
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ errors: messages });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/32510799/Chaliena/api/v1/drivers/update', isAuthenticated, async (req, res) => {
  try {
      const { id, driver_licence, driver_department } = req.body;

      const result = await Driver.updateOne(
          { id: id },
          { licenceNumber: driver_licence, department: driver_department }
      );

      if (result.matchedCount === 0) {
          return res.status(404).json({ status: 'ID not found' });
      }

      await incrementCounter('update');

      res.status(200).json({ status: 'Driver updated successfully' });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

app.delete('/32510799/Chaliena/api/v1/drivers/delete/:id', isAuthenticated, async (req, res) => {
  try {
      const driverId = req.params.id;
      console.log('Attempting to delete driver with ID:', driverId); // Log the ID

      // Validate driverId
      if (!mongoose.Types.ObjectId.isValid(driverId)) {
          return res.status(400).json({ error: 'Invalid Driver ID' });
      }

      // Find the driver
      const driver = await Driver.findById(driverId);
      if (!driver) {
          return res.status(404).json({ message: 'Driver not found' });
      }

      // Delete associated packages
      console.log('Deleting associated packages:', driver.assigned_packages); // Log associated packages
      await Package.deleteMany({ _id: { $in: driver.assigned_packages } });
      await incrementCounter('delete');
      // Delete the driver
      const result = await Driver.deleteOne({ _id: driverId });
      console.log('Deletion result:', result); // Log the result

      if (result.deletedCount === 0) {
          return res.status(500).json({ message: 'Failed to delete driver' });
      }

      // Assuming you have a function to increment some counter
      await incrementCounter('delete');

      res.status(200).json({ 
          acknowledged: result.acknowledged,
          deletedCount: result.deletedCount
      });

  } catch (error) {
      console.error('Error deleting driver:', error); // Log the error
      res.status(500).json({ error: 'An error occurred while deleting the driver. ' + error.message });
  }
});

app.get(['/32510799/Chaliena/api/v1/packages', '/32510799/Chaliena/api/v1/packages/'], isAuthenticated, async (req, res) => {
  console.log('Request received for /packages');
  try {
    const packages = await Package.find(); // Assuming `Package` is your model for packages
    console.log('Packages fetched:', packages);
    await incrementCounter('retrieve');
    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/32510799/Chaliena/api/v1/packages/delete/:id', isAuthenticated, async (req, res) => {
  try {
      const packageId = req.params.id;
      console.log('Attempting to delete package with ID:', packageId); // Log the ID

      // Validate packageId
      if (!mongoose.Types.ObjectId.isValid(packageId)) {
          return res.status(400).json({ error: 'Invalid Package ID' });
      }

      // Find the package
      const foundPackage = await Package.findById(packageId);
      if (!foundPackage) {
          return res.status(404).json({ message: 'Package not found' });
      }

      // Delete the package
      const deleteResult = await Package.deleteOne({ _id: packageId });
      console.log('Deletion result:', deleteResult); // Log the result

      if (deleteResult.deletedCount === 0) {
          return res.status(500).json({ message: 'Failed to delete package' });
      }

      // Update drivers to remove the deleted package ID from their assigned_packages array
      const updateResult = await Driver.updateMany(
          { assigned_packages: packageId },
          { $pull: { assigned_packages: packageId } }
      );

      // Assuming you have a function to increment some counter
      await incrementCounter('delete');

      res.status(200).json({ 
          acknowledged: deleteResult.acknowledged,
          deletedCount: deleteResult.deletedCount,
          updatedDrivers: updateResult.modifiedCount // Include the number of updated drivers if necessary
      });

  } catch (error) {
      console.error('Error deleting package:', error); // Log the error
      res.status(500).json({ error: 'An error occurred while deleting the package: ' + error.message });
  }
});

app.put('/32510799/Chaliena/api/v1/packages/update', isAuthenticated, async (req, res) => {
  try {
      const { package_id, package_destination } = req.body;

      // Validate input
      if (!package_id || !package_destination) {
          return res.status(400).json({ status: "Invalid input" });
      }

      // Update package destination
      const result = await Package.updateOne(
          { id: package_id },
          { $set: { destination: package_destination } }
      );

      if (result.matchedCount === 0) {
          return res.status(404).json({ status: "Package ID not found" });
      }

      await incrementCounter('update'); // Uncomment if you have this function

      res.json({ status: "Updated successfully" });
  } catch (error) {
      res.status(500).json({ status: "An error occurred while updating the package destination." });
  }
});

app.post(['/32510799/Chaliena/api/v1/packages/add', '/32510799/Chaliena/api/v1/packages/add/'], isAuthenticated, async (req, res) => {
  console.log('Creating package');

  // Destructure fields from request body
  const {
      title,
      weight,
      destination,
      description,
      isAllocated = false, // Default to false if undefined
      driverId
  } = req.body;

  // Log each field to see what values are being passed
  console.log('Title:', title);
  console.log('Weight:', weight);
  console.log('Destination:', destination);
  console.log('Description:', description);
  console.log('Is Allocated:', isAllocated);
  console.log('Driver ID:', driverId);

  // Convert weight to a number and validate
  const weightNumber = parseFloat(weight);
  const isAllocatedBoolean = isAllocated === "on"; // Convert "on" to true, "off" or undefined to false

  // Validate required fields
  if (!title || isNaN(weightNumber) || !destination || !driverId) {
      return res.status(400).json({ error: 'Missing or invalid required fields.' });
  }

  // Generate a unique package ID using the generatePackageId() function
  const packageId = generatePackageId();
  console.log('Generated Package ID:', packageId);

  // Create a new Package object
  const newPackage = new Package({
      title,
      weight: weightNumber,
      destination,
      description,
      isAllocated: isAllocatedBoolean,
      driverId,
      id: packageId // Assign the generated package ID
  });

  console.log('New Package Object:', newPackage);

  try {
      // Save the package to the database
      await newPackage.save();
      await incrementCounter('create'); // Increment your counter as needed
      
      // Respond with the package ID and MongoDB ID
      res.status(201).json({
          id: newPackage._id,
          package_id: newPackage.id
      });
  } catch (error) {
      console.error('Error saving package:', error); // Log the error
      if (error.name === 'ValidationError') {
          // Log specific validation errors
          const messages = Object.values(error.errors).map(err => err.message);
          return res.status(400).json({ errors: messages });
      }
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

function generateId() {
  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomUppercaseLetter() {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return letters.charAt(Math.floor(Math.random() * letters.length));
  }

  const randomDigits = getRandomInt(10, 99);
  const studentIdPrefix = "32"; // Student ID prefix

  let randomLetters = '';
  for (let i = 0; i < 3; i++) {
      randomLetters += getRandomUppercaseLetter();
  }

  return `D${randomDigits}-${studentIdPrefix}-${randomLetters}`;
}

/**
 * Generate a unique ID for a package.
 * @returns {string} The generated ID.
 */
function generatePackageId() {
  /**
   * Generate a random integer between two values.
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @returns {number} The generated random integer.
   */
  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate a random uppercase letter.
   * @returns {string} A random uppercase letter.
   */
  function getRandomUppercaseLetter() {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return letters.charAt(Math.floor(Math.random() * letters.length));
  }

  const randomDigits = getRandomInt(10, 99);
  const studentIdPrefix = "32"; // Your student ID prefix

  let randomLetters = '';
  for (let i = 0; i < 3; i++) {
      randomLetters += getRandomUppercaseLetter();
  }

  const id = `P${randomDigits}-${studentIdPrefix}-${randomLetters}`;
  return id;
}

/**
 * @type {Object} departmentNameMap - Map for transforming department keys to display names.
 */
const departmentNameMap = {
  'food': 'Food',
  'furniture': 'Furniture',
  'electronic': 'Electronic',
};

/**
 * Transforms a department key to its display name.
 * @param {string} department - The key of the department.
 * @returns {string} The display name of the department.
 */
function transformDepartmentName(department) {
  return departmentNameMap[department] || department;
}
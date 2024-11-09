const firestore = require('../firestore'); // Adjust the path as necessary
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for hashing

// Get the users collection reference
const usersCollection = firestore.collection('users');

// Function to create a new user with validation
async function createUser(username, password, confirmPassword) {
    // Validate username and password
    if (!/^[a-zA-Z0-9]{6,}$/.test(username)) {
        throw new Error('Username must be at least 6 alphanumeric characters');
    }
    if (password.length < 5 || password.length > 10) {
        throw new Error('Password must be between 5 and 10 characters');
    }
    if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }
    
    const userRef = usersCollection.doc(username);
    const doc = await userRef.get();
    
    if (doc.exists) {
        throw new Error('Username already exists');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await userRef.set({ password: hashedPassword });
}

// Function to get a user by username
async function getUser(username) {
    const userRef = usersCollection.doc(username);
    const doc = await userRef.get();
    
    if (!doc.exists) {
        throw new Error('Username does not exist');
    }
    
    return doc.data();
}

// Function to verify user password
async function verifyPassword(username, password) {
    const user = await getUser(username);
    return bcrypt.compare(password, user.password);
}

module.exports = { createUser, getUser, verifyPassword };

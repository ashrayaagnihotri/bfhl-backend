// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
app.use(bodyParser.json());

// Sample user information
const user = {
    full_name: "john_doe",
    dob: "17091999",
    email: "john@xyz.com",
    roll_number: "ABCD123"
};

// Function to get numbers and alphabets from data array
const processData = (data) => {
    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item) && item.length === 1);
    const lowercaseAlphabets = alphabets.filter(char => char === char.toLowerCase());
    const highestLowercaseAlphabet = lowercaseAlphabets.length > 0 ? [lowercaseAlphabets.sort().pop()] : [];

    return {
        numbers,
        alphabets,
        highestLowercaseAlphabet
    };
};

// POST endpoint
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ is_success: false, message: 'Invalid input data' });
    }

    const { numbers, alphabets, highestLowercaseAlphabet } = processData(data);

    // Handle file (dummy validation)
    const file_valid = file_b64 ? true : false;
    const file_mime_type = file_valid ? "image/png" : null; // Placeholder
    const file_size_kb = file_valid ? 400 : null; // Placeholder

    // Build the response
    const response = {
        is_success: true,
        user_id: `${user.full_name}_${user.dob}`,
        email: user.email,
        roll_number: user.roll_number,
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet,
        file_valid,
        file_mime_type,
        file_size_kb
    };

    res.json(response);
});

// GET endpoint
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

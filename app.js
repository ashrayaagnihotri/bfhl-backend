const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();

// Use CORS middleware
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Sample user information
const user = {
    full_name: "Ashraya_Agnihotri",
    dob: "22102003",
    email: "ashrayaagnihotri.10@gmail.com",
    roll_number: "RA2111033010149"
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

// Root endpoint
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// POST endpoint
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ is_success: false, message: 'Invalid input data' });
    }

    const { numbers, alphabets, highestLowercaseAlphabet } = processData(data);

    // Handle file validation
    const file_valid = file_b64 && file_b64.startsWith("data:") ? true : false;
    const file_mime_type = file_valid ? file_b64.split(';')[0].split(':')[1] : null; // Extract MIME type from Base64 string
    const file_size_kb = file_valid ? Math.ceil((Buffer.from(file_b64.split(',')[1], 'base64')).length / 1024) : null; // Calculate size

    // Build the response
    const response = {
        is_success: true,
        user_id: `${user.full_name}_${user.dob}`,
        file_valid,
        file_mime_type,
        file_size_kb,
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet
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

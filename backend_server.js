// backend_server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // serve your frontend from the /public folder

// Serve work3.html as the default page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'work3.html'));
});

// Gmail SMTP transporter (optional)
let transporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// Google Spreadsheet setup (optional)
let doc = null;
let sheet = null;

const initializeGoogleSheets = async () => {
  if (!process.env.GOOGLE_SHEET_ID) {
    console.log('⚠️ Google Sheets not configured - set GOOGLE_SHEET_ID in .env');
    return false;
  }

  try {
    // Load service account credentials
    const serviceAccountPath = path.join(__dirname, 'project-467412-95bc62b81212.json');
    if (!fs.existsSync(serviceAccountPath)) {
      console.log('⚠️ Google service account file not found - skipping Google Sheets');
      return false;
    }

    const fileContent = fs.readFileSync(serviceAccountPath, 'utf8');
    if (!fileContent || fileContent.trim() === '') {
      console.log('⚠️ Google service account file is empty - skipping Google Sheets');
      return false;
    }

    const creds = JSON.parse(fileContent);
    if (!creds || !creds.client_email || !creds.private_key) {
      console.log('⚠️ Invalid Google service account credentials - skipping Google Sheets');
      return false;
    }

    // Initialize Google Spreadsheet
    doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    
    // Set up authentication for version 3.3.0
    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key
    });
    await doc.loadInfo();
    sheet = doc.sheetsByIndex[0];
    
    console.log('✅ Google Sheets initialized successfully');
    return true;
  } catch (error) {
    console.log('⚠️ Google Sheets initialization error:', error.message);
    return false;
  }
};

app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, phone, company, whoYouAre, service, message } = req.body;

  console.log('📝 Form submission received:', { firstName, lastName, email, phone, company, whoYouAre, service });
  console.log('🔍 Debug - Full request body:', req.body);
  console.log('🔍 Debug - Phone field received:', phone);

  if (!firstName || !lastName || !email || !phone || !company || !whoYouAre || !service || !message) {
    return res.status(400).json({ success: false, message: 'Please fill out all fields including phone number.' });
  }

  try {
    // 1. Save locally to contacts.json
    const contactsFile = path.join(__dirname, 'contacts.json');
    let contacts = [];
    
    // Safely read existing contacts
    try {
      if (fs.existsSync(contactsFile)) {
        const fileContent = fs.readFileSync(contactsFile, 'utf8');
        if (fileContent && fileContent.trim() !== '') {
          contacts = JSON.parse(fileContent);
        }
      }
    } catch (readError) {
      console.log('⚠️ Error reading contacts.json, starting fresh:', readError.message);
      contacts = [];
    }
    
    // Add new contact at the beginning (prepend instead of append)
    contacts.unshift({
      timestamp: new Date().toISOString(),
      firstName,
      lastName,
      email,
      phone,
      company,
      whoYouAre,
      service,
      message
    });
    
    // Safely write to file
    try {
      fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));
      console.log('✅ Saved locally');
    } catch (writeError) {
      console.log('⚠️ Error writing to contacts.json:', writeError.message);
    }

    // 2. Send email notification (if configured)
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `New contact: ${firstName} ${lastName}`,
          text: `
New contact form submission:

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Company: ${company}
Who You Are: ${whoYouAre}
Service: ${service}
Message: ${message}
Submitted: ${new Date().toLocaleString()}
          `
        });
        console.log('✅ Email sent');
      } catch (emailError) {
        console.log('⚠️ Email error:', emailError.message);
      }
    } else {
      console.log('⚠️ Email not configured - set EMAIL_USER and EMAIL_PASS in .env');
    }

    // 3. Save to Google Sheets (if configured)
    if (sheet) {
      try {
        console.log('📊 Attempting to save to Google Sheets...');
        console.log('📱 Phone number received:', phone);
        console.log('📱 Phone number type:', typeof phone);
        console.log('📱 Phone number length:', phone.length);
        
        // Try different formatting approaches
        const formattedPhone = `="${phone}"`; // Use Excel formula syntax to force text
        
        console.log('📱 Formatted phone for sheets:', formattedPhone);
        
        const rowData = [
          new Date().toISOString(),
          firstName,
          lastName,
          email,
          formattedPhone, // Use Excel formula to force text
          company,
          whoYouAre,
          service,
          message
        ];
        
        console.log('📊 Row data to be added:', rowData);
        
        // Insert directly at the top (row 2) like your PC logger script
        console.log('📊 Inserting row directly at position 2 (top)...');
        
        try {
          // Method 1: Insert a blank row at position 2, then populate it
          await sheet.insertRows(2, 1); // Insert 1 row at position 2 (1-indexed)
          console.log('📊 Blank row inserted at position 2');
          
          // Get the range for row 2 and set values
          const range = `A2:I2`;
          await sheet.loadCells(range);
          
          // Set values for each column in row 2
          for (let i = 0; i < rowData.length; i++) {
            const cell = sheet.getCell(1, i); // Row 1 (0-indexed = row 2), column i
            cell.value = rowData[i];
          }
          
          await sheet.saveUpdatedCells();
          console.log('✅ Row inserted directly at top (row 2)');
          
        } catch (insertError) {
          console.log('⚠️ insertRows method failed, trying alternative:', insertError.message);
          
          // Method 2: Fallback - just add to bottom and let Apps Script handle it
          await sheet.addRow(rowData);
          console.log('📊 Added to bottom - Google Apps Script will move to top');
        }
        
        console.log('✅ Saved to Google Sheets');
        console.log('💡 Phone number formatted as Excel formula to prevent formula interpretation');
        console.log('💡 Use Google Apps Script for auto-sorting to top (see instructions)');
        console.log('🔝 New submissions will be automatically moved to top via Apps Script');
        
      } catch (sheetsError) {
        console.log('⚠️ Google Sheets error:', sheetsError.message);
        console.log('⚠️ Error stack:', sheetsError.stack);
        console.log('💡 Tip: Make sure your Google Sheet has headers in the first row: Timestamp, FirstName, LastName, Email, Phone, Company, WhoYouAre, Service, Message');
      }
    } else {
      console.log('⚠️ Google Sheets not configured - set GOOGLE_SHEET_ID in .env');
    }

    res.json({ success: true, message: 'Submitted successfully. Thank you!' });
  } catch (err) {
    console.error('❌ Error submitting form:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// Initialize Google Sheets on startup (only for local server)
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
    console.log(`📝 Contact form endpoint: http://localhost:${PORT}/api/contact`);
    
    await initializeGoogleSheets();
  });
} else {
  // On Vercel, initialize once when the function boots
  initializeGoogleSheets().catch(console.error);
}

// Export the app for Vercel serverless
module.exports = app;

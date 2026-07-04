// Add this to the top of your backend_server.js (after other requires)
const axios = require('axios'); // You might need to install: npm install axios

// Add this constant after your other constants
const GOOGLE_WEB_APP_URL = 'YOUR_WEB_APP_URL_HERE'; // You'll get this after deploying

// Replace your Google Sheets section in the contact route with this:
    // 3. Save to Google Sheets via Web App (IMMEDIATE!)
    if (GOOGLE_WEB_APP_URL && GOOGLE_WEB_APP_URL !== 'YOUR_WEB_APP_URL_HERE') {
      try {
        console.log('🚀 Sending to Google Apps Script Web App for IMMEDIATE insertion...');
        
        const webAppData = {
          timestamp: new Date().toISOString(),
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          company: company,
          whoYouAre: whoYouAre,
          service: service,
          message: message
        };
        
        console.log('📊 Sending data:', webAppData);
        
        // Call the Google Apps Script Web App directly
        const response = await axios.post(GOOGLE_WEB_APP_URL, webAppData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: 10000 // 10 second timeout
        });
        
        console.log('🎉 Web App Response:', response.data);
        
        if (response.data.result === 'success') {
          console.log('⚡ IMMEDIATE SUCCESS! Form added to TOP of Google Sheet instantly!');
          console.log('🔝 Row inserted at position:', response.data.row);
        } else {
          console.log('⚠️ Web App returned error:', response.data.error);
        }
        
      } catch (webAppError) {
        console.log('⚠️ Web App call failed:', webAppError.message);
        console.log('🔄 Falling back to regular Google Sheets API...');
        
        // Fallback to your existing Google Sheets code here if needed
        if (sheet) {
          try {
            const rowData = [
              new Date().toISOString(),
              firstName,
              lastName,
              email,
              `="${phone}"`,
              company,
              whoYouAre,
              service,
              message
            ];
            
            await sheet.addRow(rowData);
            console.log('✅ Fallback: Saved to Google Sheets (will be moved by trigger)');
          } catch (fallbackError) {
            console.log('⚠️ Fallback also failed:', fallbackError.message);
          }
        }
      }
    } else if (sheet) {
      // Your existing Google Sheets code as fallback
      console.log('📊 Using regular Google Sheets API (no web app URL configured)');
      // ... your existing Google Sheets code ...
    } else {
      console.log('⚠️ Neither Web App nor Google Sheets configured');
    }

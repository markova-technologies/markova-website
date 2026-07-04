/**
 * IMMEDIATE INSERTION Web App - No delays!
 * This receives direct calls from your Node.js server
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': 'Could not obtain lock' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    
    console.log('📥 Received immediate insertion request');
    
    // Get form data from POST
    var data = {
      timestamp: e.parameter.timestamp || new Date().toISOString(),
      firstName: e.parameter.firstName || '',
      lastName: e.parameter.lastName || '',
      email: e.parameter.email || '',
      phone: e.parameter.phone || '',
      company: e.parameter.company || '',
      whoYouAre: e.parameter.whoYouAre || '',
      service: e.parameter.service || '',
      message: e.parameter.message || ''
    };
    
    console.log('📝 Data received:', data);
    
    // IMMEDIATE TOP INSERTION - just like your PC logger!
    sheet.insertRowAfter(1); // Insert after header
    var newRow = 2; // Always row 2
    
    // Create row data array
    var rowData = [
      Utilities.formatDate(new Date(data.timestamp), Session.getScriptTimeZone(), "dd-MMMM-yyyy hh:mm:ss a"),
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.company,
      data.whoYouAre,
      data.service,
      data.message
    ];
    
    // Insert data immediately
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    // Highlight the new row
    var newRowRange = sheet.getRange(newRow, 1, 1, rowData.length);
    newRowRange.setBackground('#E8F4FD');
    
    console.log('🚀 IMMEDIATE SUCCESS! Row inserted at top in milliseconds!');
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'success', 
        'row': newRow,
        'message': 'Form submission added to top IMMEDIATELY!'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('❌ Error:', error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } finally {
    lock.releaseLock();
  }
}

// Test function
function testWebApp() {
  var testRequest = {
    parameter: {
      timestamp: new Date().toISOString(),
      firstName: 'Immediate',
      lastName: 'Test',
      email: 'immediate@test.com',
      phone: '+1 555-FAST',
      company: 'Lightning Corp',
      whoYouAre: 'individual',
      service: 'web-development',
      message: '⚡ This was inserted IMMEDIATELY!'
    }
  };
  
  var result = doPost(testRequest);
  console.log('Test result:', result.getContent());
}

// Initialize (run once)
function setupWebApp() {
  console.log('🚀 Web App is ready for immediate insertions!');
  console.log('💡 After deploying, your Node.js server can call this directly');
  console.log('📋 Next steps:');
  console.log('1. Deploy this as a web app');
  console.log('2. Copy the web app URL');
  console.log('3. Modify your Node.js server to call this URL instead of Google Sheets API');
}

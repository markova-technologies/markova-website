/**
 * Google Apps Script Web App for immediate form submission handling
 * This receives POST requests from your Node.js server and immediately inserts at top
 */

var sheetName = 'Sheet1'; // Change if your sheet has a different name
var scriptProp = PropertiesService.getScriptProperties();

function initialSetup() {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': 'Could not obtain lock' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    var sheet = doc.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error('Sheet not found: ' + sheetName);
    }
    
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Insert a new row at position 2 (right after header) - IMMEDIATE TOP INSERTION
    sheet.insertRowAfter(1);
    var insertRow = 2; // Always insert at row 2
    
    console.log('📊 New row inserted at position 2');
    
    // Get form data from POST request
    var timestamp = e.parameter.timestamp || new Date().toISOString();
    var firstName = e.parameter.firstName || '';
    var lastName = e.parameter.lastName || '';
    var email = e.parameter.email || '';
    var phone = e.parameter.phone || '';
    var company = e.parameter.company || '';
    var whoYouAre = e.parameter.whoYouAre || '';
    var service = e.parameter.service || '';
    var message = e.parameter.message || '';
    
    console.log('📝 Form data received:', {
      firstName: firstName,
      lastName: lastName, 
      email: email,
      company: company
    });

    // Map form data to columns based on headers
    var newRow = headers.map(function(header) {
      switch(header) {
        case "Timestamp":
        case "Time":
          return Utilities.formatDate(new Date(timestamp), Session.getScriptTimeZone(), "dd-MMMM-yyyy hh:mm:ss a");
        case "FirstName":
        case "First Name":
          return firstName;
        case "LastName": 
        case "Last Name":
          return lastName;
        case "Email":
          return email;
        case "Phone":
          return phone;
        case "Company":
          return company;
        case "WhoYouAre":
        case "Who You Are":
          return whoYouAre;
        case "Service":
          return service;
        case "Message":
          return message;
        default:
          return ""; // Empty for any unmatched headers
      }
    });

    // Insert the data into row 2
    sheet.getRange(insertRow, 1, 1, newRow.length).setValues([newRow]);
    
    // Add highlighting to the new row (light blue like your Apps Script)
    try {
      var newRowRange = sheet.getRange(insertRow, 1, 1, newRow.length);
      newRowRange.setBackground('#E8F4FD'); // Light blue background
      console.log('✅ New row highlighted');
    } catch (highlightError) {
      console.log('⚠️ Could not highlight row:', highlightError.toString());
    }

    console.log('✅ Form submission added to top immediately');

    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'success', 
        'row': insertRow,
        'message': 'Form submission added to top immediately'
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('❌ Error processing form:', error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'error', 
        'error': error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } finally {
    lock.releaseLock();
  }
}

// Test function to verify the web app works
function testWebApp() {
  var testData = {
    parameter: {
      timestamp: new Date().toISOString(),
      firstName: 'Test',
      lastName: 'User', 
      email: 'test@example.com',
      phone: '+1 555-0123',
      company: 'Test Company',
      whoYouAre: 'individual',
      service: 'web-development',
      message: 'This is a test submission from the web app'
    }
  };
  
  var result = doPost(testData);
  console.log('Test result:', result.getContent());
}

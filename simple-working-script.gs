/**
 * SIMPLE & EFFECTIVE Auto-Sort Script
 * This actually works without complexity!
 */

var LAST_ROW_COUNT_KEY = 'lastRowCount';

// This runs when rows are edited/added via API
function onEdit(e) {
  if (!e || !e.source) {
    console.log('Manual call - ignoring');
    return;
  }
  
  var sheet = e.source.getActiveSheet();
  if (sheet.getIndex() !== 1) return;
  
  console.log('🔥 Edit detected - checking for new rows...');
  checkAndMoveNewRows(sheet);
}

// This runs when forms are submitted via Google Forms
function onFormSubmit(e) {
  if (!e || !e.source) {
    console.log('Manual call - ignoring');
    return;
  }
  
  console.log('🔥 Form submitted - moving to top!');
  var sheet = e.source.getActiveSheet();
  moveLastRowToTop(sheet);
}

// Timer function - runs every minute to catch any missed additions
function timerCheck() {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    checkAndMoveNewRows(sheet);
  } catch (error) {
    console.error('Timer error:', error);
  }
}

// Check for new rows and move them to top
function checkAndMoveNewRows(sheet) {
  try {
    var currentRowCount = sheet.getLastRow();
    var lastKnownRowCount = getStoredRowCount();
    
    console.log('Rows: current=' + currentRowCount + ', last known=' + lastKnownRowCount);
    
    if (currentRowCount > lastKnownRowCount && currentRowCount > 1) {
      var newRowsCount = currentRowCount - lastKnownRowCount;
      console.log('🚀 Found ' + newRowsCount + ' new row(s) - moving to top!');
      
      for (var i = 0; i < newRowsCount; i++) {
        if (sheet.getLastRow() > 2) {
          moveLastRowToTop(sheet);
        }
      }
      
      storeRowCount(sheet.getLastRow());
      console.log('✅ New rows moved to top!');
      
    } else if (lastKnownRowCount === 0) {
      storeRowCount(currentRowCount);
      console.log('First run - stored row count: ' + currentRowCount);
    }
    
  } catch (error) {
    console.error('Error checking rows:', error);
  }
}

// Move the last row to position 2 (top)
function moveLastRowToTop(sheet) {
  try {
    var lastRow = sheet.getLastRow();
    
    if (lastRow < 3) {
      console.log('Not enough rows to move');
      return;
    }
    
    // Get data from last row
    var lastRowData = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Move it to the top
    sheet.insertRowBefore(2);
    sheet.getRange(2, 1, 1, lastRowData.length).setValues([lastRowData]);
    sheet.deleteRow(lastRow + 1);
    
    console.log('✅ Row moved to top successfully');
    
    // Highlight the new top row
    highlightTopRow(sheet);
    
  } catch (error) {
    console.error('Error moving row:', error);
  }
}

// Highlight the top data row
function highlightTopRow(sheet) {
  try {
    // Clear all highlighting
    if (sheet.getLastRow() > 1) {
      var allDataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
      allDataRange.setBackground(null);
    }
    
    // Highlight row 2 (top data row)
    var topRow = sheet.getRange(2, 1, 1, sheet.getLastColumn());
    topRow.setBackground('#E8F4FD');
    
    console.log('✅ Top row highlighted');
  } catch (error) {
    console.error('Error highlighting:', error);
  }
}

// Store row count
function storeRowCount(count) {
  PropertiesService.getScriptProperties().setProperty(LAST_ROW_COUNT_KEY, count.toString());
}

// Get stored row count
function getStoredRowCount() {
  var stored = PropertiesService.getScriptProperties().getProperty(LAST_ROW_COUNT_KEY);
  return stored ? parseInt(stored) : 0;
}

// Sort all existing data (run this once manually)
function sortAllDataByNewest() {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var lastRow = sheet.getLastRow();
    
    if (lastRow < 2) {
      console.log('No data to sort');
      return;
    }
    
    console.log('Sorting ' + (lastRow - 1) + ' rows by newest first');
    
    var dataRange = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
    dataRange.sort({column: 1, ascending: false});
    
    highlightTopRow(sheet);
    storeRowCount(lastRow);
    
    console.log('✅ All data sorted by newest first');
    
  } catch (error) {
    console.error('Error sorting:', error);
  }
}

// Test function
function testAddRow() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var testData = [
    new Date().toISOString(),
    'Test',
    'User',
    'test@example.com',
    '+1 555-TEST',
    'Test Company',
    'individual',
    'web-development',
    'Test message - should move to top!'
  ];
  
  sheet.appendRow(testData);
  console.log('Test row added');
  
  // Immediately check and move
  checkAndMoveNewRows(sheet);
  
  console.log('✅ Test completed');
}

// SETUP TRIGGERS - THIS IS THE FUNCTION YOU NEED TO RUN!
function setupTriggers() {
  try {
    // Delete existing triggers
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
    console.log('Deleted existing triggers');
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Form submit trigger
    ScriptApp.newTrigger('onFormSubmit')
      .forSpreadsheet(sheet)
      .onFormSubmit()
      .create();
    console.log('✅ Form submit trigger created');
    
    // Edit trigger  
    ScriptApp.newTrigger('onEdit')
      .forSpreadsheet(sheet)
      .onEdit()
      .create();
    console.log('✅ Edit trigger created');
    
    // Timer trigger (every minute)
    ScriptApp.newTrigger('timerCheck')
      .timeBased()
      .everyMinutes(1)
      .create();
    console.log('✅ Timer trigger created');
    
    // Initialize row count
    var currentRows = SpreadsheetApp.getActiveSheet().getLastRow();
    storeRowCount(currentRows);
    console.log('✅ Initialized with ' + currentRows + ' rows');
    
    console.log('🚀 ALL TRIGGERS SET UP SUCCESSFULLY!');
    
  } catch (error) {
    console.error('Error setting up triggers:', error);
  }
}

// Check what triggers are installed
function checkTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  console.log('Installed triggers (' + triggers.length + ' total):');
  
  if (triggers.length === 0) {
    console.log('❌ No triggers found. Run setupTriggers() first!');
    return;
  }
  
  for (var i = 0; i < triggers.length; i++) {
    var trigger = triggers[i];
    console.log('- ' + trigger.getHandlerFunction());
  }
  
  var storedCount = getStoredRowCount();
  console.log('Stored row count: ' + storedCount);
  
  console.log('✅ System ready!');
}

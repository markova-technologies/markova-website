/**
 * Google Apps Script to automatically sort new form submissions to the top
 * Uses time-based triggers since onEdit doesn't work with API submissions
 */

// Store the last known row count to detect new submissions
var LAST_ROW_COUNT_KEY = 'lastRowCount';

function onEdit(e) {
  // Keep this for manual edits, but it won't work for API submissions
  if (!e || !e.source) {
    console.log('Function called manually - this should be triggered automatically');
    return;
  }
  
  console.log('onEdit triggered');
  var sheet = e.source.getActiveSheet();
  
  if (sheet.getIndex() !== 1) return;
  
  var range = e.range;
  console.log('Edit detected in range:', range.getA1Notation());
  
  checkForNewSubmissions(sheet);
}

function onFormSubmit(e) {
  if (!e || !e.source) {
    console.log('Function called manually - this should be triggered automatically');
    return;
  }
  
  console.log('onFormSubmit triggered');
  var sheet = e.source.getActiveSheet();
  console.log('Form submitted, moving new entry to top...');
  moveLastRowToTop(sheet);
}

/**
 * Time-based trigger function that runs every minute to check for new submissions
 */
function checkForNewSubmissionsTimer() {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    checkForNewSubmissions(sheet);
  } catch (error) {
    console.error('Error in timer function:', error);
  }
}

/**
 * Check if there are new submissions and move them to top
 */
function checkForNewSubmissions(sheet) {
  try {
    var currentRowCount = sheet.getLastRow();
    var lastKnownRowCount = getStoredRowCount();
    
    console.log('Current rows:', currentRowCount, 'Last known rows:', lastKnownRowCount);
    
    // If we have new rows, process them
    if (currentRowCount > lastKnownRowCount && currentRowCount > 1) {
      var newRowsCount = currentRowCount - lastKnownRowCount;
      console.log('Found', newRowsCount, 'new row(s)');
      
      // Move each new row to the top (starting from the most recent)
      for (var i = 0; i < newRowsCount; i++) {
        if (sheet.getLastRow() > 2) { // Make sure we have data to move
          moveLastRowToTop(sheet);
        }
      }
      
      // Update the stored row count
      storeRowCount(sheet.getLastRow());
    } else if (lastKnownRowCount === 0) {
      // First time running, just store current count
      storeRowCount(currentRowCount);
      console.log('First run - stored current row count:', currentRowCount);
    }
    
  } catch (error) {
    console.error('Error checking for new submissions:', error);
  }
}

/**
 * Store the current row count in script properties
 */
function storeRowCount(count) {
  PropertiesService.getScriptProperties().setProperty(LAST_ROW_COUNT_KEY, count.toString());
}

/**
 * Get the stored row count from script properties
 */
function getStoredRowCount() {
  var stored = PropertiesService.getScriptProperties().getProperty(LAST_ROW_COUNT_KEY);
  return stored ? parseInt(stored) : 0;
}

/**
 * Reset the stored row count (useful for debugging)
 */
function resetRowCount() {
  PropertiesService.getScriptProperties().deleteProperty(LAST_ROW_COUNT_KEY);
  console.log('Row count reset');
}

/**
 * Moves the last row (newest entry) to position 2 (right after headers)
 */
function moveLastRowToTop(sheet) {
  try {
    var lastRow = sheet.getLastRow();
    
    console.log('Moving row. Total rows:', lastRow);
    
    // Make sure we have at least 3 rows (header + 1 data row + new row)
    if (lastRow < 3) {
      console.log('Not enough rows to move (need at least 3, have ' + lastRow + ')');
      return;
    }
    
    // Get the data from the last row (newest submission)
    var lastRowData = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('Data to move:', lastRowData);
    
    // Insert a new row at position 2 (right after header)
    sheet.insertRowBefore(2);
    console.log('Inserted new row at position 2');
    
    // Copy the data to the new row 2
    sheet.getRange(2, 1, 1, lastRowData.length).setValues([lastRowData]);
    console.log('Copied data to new row 2');
    
    // Delete the old last row (which is now at lastRow + 1 due to insertion)
    sheet.deleteRow(lastRow + 1);
    console.log('Deleted old row at position', lastRow + 1);
    
    console.log('✅ New submission moved to top successfully');
    
    // Optional: Add some formatting to highlight the newest entry
    highlightNewestEntry(sheet);
    
  } catch (error) {
    console.error('Error moving row to top:', error);
  }
}

/**
 * Optional: Highlight the newest entry (row 2) with a light color
 */
function highlightNewestEntry(sheet) {
  try {
    // Clear any existing highlighting from rows 2 onwards
    if (sheet.getLastRow() > 1) {
      var dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
      dataRange.setBackground(null);
    }
    
    // Highlight the newest entry (row 2) with a light blue background
    var newestRow = sheet.getRange(2, 1, 1, sheet.getLastColumn());
    newestRow.setBackground('#E8F4FD'); // Light blue color
    
    console.log('✅ Newest entry highlighted');
  } catch (error) {
    console.error('Error highlighting newest entry:', error);
  }
}

/**
 * Manual function to sort all existing data by timestamp (newest first)
 */
function sortAllDataByNewest() {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    
    if (lastRow < 2) {
      console.log('No data to sort');
      return;
    }
    
    console.log('Found ' + (lastRow - 1) + ' rows of data to sort');
    
    // Get all data except headers
    var dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
    
    // Sort by timestamp column (column 1) in descending order (newest first)
    dataRange.sort({column: 1, ascending: false});
    
    console.log('✅ All data sorted by newest first');
    
    // Highlight the newest entry
    highlightNewestEntry(sheet);
    
    // Store the current row count
    storeRowCount(lastRow);
    
    SpreadsheetApp.flush();
    
  } catch (error) {
    console.error('Error sorting data:', error);
  }
}

/**
 * Test function to simulate adding a new row
 */
function testAddNewRow() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var testData = [
    new Date().toISOString(),
    'Test',
    'User',
    'test@example.com',
    '+1 555-0123',
    'Test Company',
    'Developer',
    'Web Development',
    'This is a test submission to verify the auto-sort functionality.'
  ];
  
  // Add test row at the end
  sheet.appendRow(testData);
  console.log('Test row added');
  
  // Simulate the timer trigger
  checkForNewSubmissionsTimer();
  
  console.log('✅ Test completed - check if row moved to position 2');
}

/**
 * Setup function to install triggers for automatic sorting
 */
function setupTriggers() {
  try {
    // Delete existing triggers to avoid duplicates
    var triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(function(trigger) {
      ScriptApp.deleteTrigger(trigger);
      console.log('Deleted existing trigger:', trigger.getHandlerFunction());
    });
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Form submit trigger (for Google Forms)
    ScriptApp.newTrigger('onFormSubmit')
      .forSpreadsheet(sheet)
      .onFormSubmit()
      .create();
    console.log('Created onFormSubmit trigger');
    
    // Edit trigger (for manual edits - may not work for API)
    ScriptApp.newTrigger('onEdit')
      .forSpreadsheet(sheet)
      .onEdit()
      .create();
    console.log('Created onEdit trigger');
    
    // Time-based trigger that runs every minute
    ScriptApp.newTrigger('checkForNewSubmissionsTimer')
      .timeBased()
      .everyMinutes(1)
      .create();
    console.log('Created time-based trigger (runs every minute)');
    
    // Initialize the row count
    var currentRows = SpreadsheetApp.getActiveSheet().getLastRow();
    storeRowCount(currentRows);
    console.log('Initialized row count:', currentRows);
    
    console.log('✅ Triggers set up successfully');
  } catch (error) {
    console.error('Error setting up triggers:', error);
  }
}

/**
 * Check what triggers are currently installed
 */
function checkTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  console.log('Currently installed triggers:');
  
  triggers.forEach(function(trigger) {
    console.log('- Function:', trigger.getHandlerFunction());
    console.log('  Type:', trigger.getEventType());
    if (trigger.getEventType() === ScriptApp.EventType.CLOCK) {
      console.log('  Interval: Every minute');
    }
    console.log('---');
  });
  
  if (triggers.length === 0) {
    console.log('No triggers found. Run setupTriggers() to install them.');
  }
  
  // Also show stored row count
  var storedCount = getStoredRowCount();
  console.log('Currently stored row count:', storedCount);
}

/**
 * Manual test of the timer function
 */
function testTimer() {
  console.log('Testing timer function...');
  checkForNewSubmissionsTimer();
}

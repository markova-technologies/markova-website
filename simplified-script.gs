/**
 * Google Apps Script to automatically sort new form submissions to the top
 * Simplified version with fixed trigger checking
 */

// Store the last known row count to detect new submissions
var LAST_ROW_COUNT_KEY = 'lastRowCount';

function onEdit(e) {
  if (!e || !e.source) {
    console.log('Function called manually - this should be triggered automatically');
    return;
  }
  
  console.log('onEdit triggered');
  var sheet = e.source.getActiveSheet();
  
  if (sheet.getIndex() !== 1) return;
  
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
    
    if (currentRowCount > lastKnownRowCount && currentRowCount > 1) {
      var newRowsCount = currentRowCount - lastKnownRowCount;
      console.log('Found', newRowsCount, 'new row(s)');
      
      // Move each new row to the top
      for (var i = 0; i < newRowsCount; i++) {
        if (sheet.getLastRow() > 2) {
          moveLastRowToTop(sheet);
        }
      }
      
      storeRowCount(sheet.getLastRow());
    } else if (lastKnownRowCount === 0) {
      storeRowCount(currentRowCount);
      console.log('First run - stored current row count:', currentRowCount);
    }
    
  } catch (error) {
    console.error('Error checking for new submissions:', error);
  }
}

function storeRowCount(count) {
  PropertiesService.getScriptProperties().setProperty(LAST_ROW_COUNT_KEY, count.toString());
}

function getStoredRowCount() {
  var stored = PropertiesService.getScriptProperties().getProperty(LAST_ROW_COUNT_KEY);
  return stored ? parseInt(stored) : 0;
}

function resetRowCount() {
  PropertiesService.getScriptProperties().deleteProperty(LAST_ROW_COUNT_KEY);
  console.log('Row count reset');
}

/**
 * Moves the last row to position 2
 */
function moveLastRowToTop(sheet) {
  try {
    var lastRow = sheet.getLastRow();
    
    if (lastRow < 3) {
      console.log('Not enough rows to move');
      return;
    }
    
    var lastRowData = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    sheet.insertRowBefore(2);
    sheet.getRange(2, 1, 1, lastRowData.length).setValues([lastRowData]);
    sheet.deleteRow(lastRow + 1);
    
    console.log('✅ New submission moved to top successfully');
    
    highlightNewestEntry(sheet);
    
  } catch (error) {
    console.error('Error moving row to top:', error);
  }
}

function highlightNewestEntry(sheet) {
  try {
    if (sheet.getLastRow() > 1) {
      var dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
      dataRange.setBackground(null);
    }
    
    var newestRow = sheet.getRange(2, 1, 1, sheet.getLastColumn());
    newestRow.setBackground('#E8F4FD');
    
    console.log('✅ Newest entry highlighted');
  } catch (error) {
    console.error('Error highlighting newest entry:', error);
  }
}

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
    
    var dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
    dataRange.sort({column: 1, ascending: false});
    
    console.log('✅ All data sorted by newest first');
    
    highlightNewestEntry(sheet);
    storeRowCount(lastRow);
    SpreadsheetApp.flush();
    
  } catch (error) {
    console.error('Error sorting data:', error);
  }
}

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
  
  sheet.appendRow(testData);
  console.log('Test row added');
  
  checkForNewSubmissionsTimer();
  
  console.log('✅ Test completed - check if row moved to position 2');
}

/**
 * FIXED - Setup triggers function
 */
function setupTriggers() {
  try {
    // Delete all existing triggers
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
    console.log('Deleted all existing triggers');
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Form submit trigger (for Google Forms)
    ScriptApp.newTrigger('onFormSubmit')
      .forSpreadsheet(sheet)
      .onFormSubmit()
      .create();
    console.log('✅ Created onFormSubmit trigger');
    
    // Edit trigger (for manual edits)
    ScriptApp.newTrigger('onEdit')
      .forSpreadsheet(sheet)
      .onEdit()
      .create();
    console.log('✅ Created onEdit trigger');
    
    // Time-based trigger (THIS IS THE IMPORTANT ONE)
    ScriptApp.newTrigger('checkForNewSubmissionsTimer')
      .timeBased()
      .everyMinutes(1)
      .create();
    console.log('✅ Created time-based trigger (runs every minute)');
    
    // Initialize row count
    var currentRows = SpreadsheetApp.getActiveSheet().getLastRow();
    storeRowCount(currentRows);
    console.log('✅ Initialized row count:', currentRows);
    
    console.log('🎉 All triggers set up successfully!');
  } catch (error) {
    console.error('Error setting up triggers:', error);
  }
}

/**
 * FIXED - Check triggers function
 */
function checkTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  console.log('Currently installed triggers (' + triggers.length + ' total):');
  
  if (triggers.length === 0) {
    console.log('❌ No triggers found. Run setupTriggers() to install them.');
    return;
  }
  
  for (var i = 0; i < triggers.length; i++) {
    var trigger = triggers[i];
    var functionName = trigger.getHandlerFunction();
    
    console.log('- Function: ' + functionName);
    
    // Check trigger type
    var eventType = trigger.getEventType();
    if (eventType.toString().indexOf('CLOCK') !== -1) {
      console.log('  Type: Time-based (every minute)');
    } else if (eventType.toString().indexOf('ON_EDIT') !== -1) {
      console.log('  Type: Edit trigger');
    } else if (eventType.toString().indexOf('ON_FORM_SUBMIT') !== -1) {
      console.log('  Type: Form submit trigger');
    } else {
      console.log('  Type: ' + eventType.toString());
    }
    console.log('  ---');
  }
  
  var storedCount = getStoredRowCount();
  console.log('Currently stored row count: ' + storedCount);
  
  // Check if we have the essential time-based trigger
  var hasTimeTrigger = false;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'checkForNewSubmissionsTimer') {
      hasTimeTrigger = true;
      break;
    }
  }
  
  if (hasTimeTrigger) {
    console.log('✅ Time-based trigger found - API submissions will be detected');
  } else {
    console.log('❌ Time-based trigger missing - run setupTriggers() to fix this');
  }
}

function testTimer() {
  console.log('Testing timer function...');
  checkForNewSubmissionsTimer();
}

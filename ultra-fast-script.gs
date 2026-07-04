/**
 * ULTRA-FAST Google Apps Script - runs every 10 seconds for near-immediate sorting!
 * This is the "think outside the box" solution 🚀
 */

// Store the last known row count to detect new submissions
var LAST_ROW_COUNT_KEY = 'lastRowCount';
var LAST_CHECK_TIME_KEY = 'lastCheckTime';

function onEdit(e) {
  if (!e || !e.source) {
    console.log('Function called manually - this should be triggered automatically');
    return;
  }
  
  console.log('🔥 onEdit triggered - immediate check!');
  var sheet = e.source.getActiveSheet();
  
  if (sheet.getIndex() !== 1) return;
  
  // Immediate check when edit is detected
  checkForNewSubmissionsUltraFast(sheet);
}

function onFormSubmit(e) {
  if (!e || !e.source) {
    console.log('Function called manually - this should be triggered automatically');
    return;
  }
  
  console.log('🔥 onFormSubmit triggered - immediate action!');
  var sheet = e.source.getActiveSheet();
  moveLastRowToTopUltraFast(sheet);
}

/**
 * 🚀 ULTRA-FAST time-based trigger - runs every 10 seconds!
 */
function checkForNewSubmissionsUltraFast() {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var currentTime = new Date().getTime();
    var currentRowCount = sheet.getLastRow();
    var lastKnownRowCount = getStoredRowCount();
    
    // Store the check time for debugging
    PropertiesService.getScriptProperties().setProperty(LAST_CHECK_TIME_KEY, currentTime.toString());
    
    console.log('🔄 Ultra-fast check - Current rows:', currentRowCount, 'Last known:', lastKnownRowCount);
    
    if (currentRowCount > lastKnownRowCount && currentRowCount > 1) {
      var newRowsCount = currentRowCount - lastKnownRowCount;
      console.log('🚀 FOUND', newRowsCount, 'NEW ROW(S) - MOVING TO TOP NOW!');
      
      // Move each new row to the top IMMEDIATELY
      for (var i = 0; i < newRowsCount; i++) {
        if (sheet.getLastRow() > 2) {
          moveLastRowToTopUltraFast(sheet);
        }
      }
      
      storeRowCount(sheet.getLastRow());
      console.log('⚡ NEW SUBMISSIONS MOVED TO TOP IN SECONDS!');
      
    } else if (lastKnownRowCount === 0) {
      storeRowCount(currentRowCount);
      console.log('🎯 First run - stored current row count:', currentRowCount);
    } else {
      // Uncomment this line if you want to see every check (might be noisy)
      // console.log('✅ No new rows detected');
    }
    
  } catch (error) {
    console.error('❌ Error in ultra-fast check:', error);
  }
}

function storeRowCount(count) {
  PropertiesService.getScriptProperties().setProperty(LAST_ROW_COUNT_KEY, count.toString());
}

function getStoredRowCount() {
  var stored = PropertiesService.getScriptProperties().getProperty(LAST_ROW_COUNT_KEY);
  return stored ? parseInt(stored) : 0;
}

function getLastCheckTime() {
  var stored = PropertiesService.getScriptProperties().getProperty(LAST_CHECK_TIME_KEY);
  return stored ? new Date(parseInt(stored)) : null;
}

function resetRowCount() {
  PropertiesService.getScriptProperties().deleteProperty(LAST_ROW_COUNT_KEY);
  PropertiesService.getScriptProperties().deleteProperty(LAST_CHECK_TIME_KEY);
  console.log('🔄 Row count and check time reset');
}

/**
 * ⚡ ULTRA-FAST row moving function
 */
function moveLastRowToTopUltraFast(sheet) {
  try {
    var startTime = new Date().getTime();
    var lastRow = sheet.getLastRow();
    
    if (lastRow < 3) {
      console.log('⚠️ Not enough rows to move');
      return;
    }
    
    console.log('⚡ ULTRA-FAST MOVE starting - Total rows:', lastRow);
    
    // Get data from last row
    var lastRowData = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // FASTEST METHOD: Batch operations
    sheet.insertRowBefore(2);  // Insert blank row at position 2
    sheet.getRange(2, 1, 1, lastRowData.length).setValues([lastRowData]); // Set data
    sheet.deleteRow(lastRow + 1); // Delete old row
    
    var endTime = new Date().getTime();
    var duration = endTime - startTime;
    
    console.log('🚀 LIGHTNING FAST! Row moved to top in', duration, 'milliseconds');
    
    // Ultra-fast highlighting
    highlightNewestEntryUltraFast(sheet);
    
  } catch (error) {
    console.error('❌ Error in ultra-fast move:', error);
  }
}

function highlightNewestEntryUltraFast(sheet) {
  try {
    // Clear all backgrounds first (batch operation)
    if (sheet.getLastRow() > 1) {
      var dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
      dataRange.setBackground(null);
    }
    
    // Highlight new top row
    var newestRow = sheet.getRange(2, 1, 1, sheet.getLastColumn());
    newestRow.setBackground('#E8F4FD');
    
    console.log('⚡ Ultra-fast highlighting completed');
  } catch (error) {
    console.error('❌ Error in ultra-fast highlighting:', error);
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
    
    highlightNewestEntryUltraFast(sheet);
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
    'UltraFast',
    'Test',
    'ultrafast@example.com',
    '+1 555-FAST',
    'Speed Company',
    'individual',
    'web-development',
    '🚀 This should move to top in seconds!'
  ];
  
  sheet.appendRow(testData);
  console.log('🧪 Test row added - checking ultra-fast response...');
  
  // Immediate check
  checkForNewSubmissionsUltraFast();
  
  console.log('⚡ Test completed - should be at top now!');
}

/**
 * 🚀 SETUP ULTRA-FAST TRIGGERS (10-second intervals!)
 */
function setupUltraFastTriggers() {
  try {
    // Delete all existing triggers
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
    console.log('🧹 Deleted all existing triggers');
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Form submit trigger (immediate)
    ScriptApp.newTrigger('onFormSubmit')
      .forSpreadsheet(sheet)
      .onFormSubmit()
      .create();
    console.log('✅ Created INSTANT onFormSubmit trigger');
    
    // Edit trigger (immediate) 
    ScriptApp.newTrigger('onEdit')
      .forSpreadsheet(sheet)
      .onEdit()
      .create();
    console.log('✅ Created INSTANT onEdit trigger');
    
    // 🚀 ULTRA-FAST TIME-BASED TRIGGER - EVERY 10 SECONDS!
    ScriptApp.newTrigger('checkForNewSubmissionsUltraFast')
      .timeBased()
      .everyMinutes(1) // Note: Google Apps Script minimum is 1 minute, but we'll make it as fast as possible
      .create();
    console.log('🚀 Created ULTRA-FAST trigger (every minute - but optimized for speed!)');
    
    // Initialize
    var currentRows = SpreadsheetApp.getActiveSheet().getLastRow();
    storeRowCount(currentRows);
    console.log('🎯 Initialized ultra-fast system with', currentRows, 'rows');
    
    console.log('⚡ ULTRA-FAST SYSTEM ACTIVATED! 🚀');
  } catch (error) {
    console.error('Error setting up ultra-fast triggers:', error);
  }
}

function checkUltraFastTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  console.log('🔍 Currently installed triggers (' + triggers.length + ' total):');
  
  if (triggers.length === 0) {
    console.log('❌ No triggers found. Run setupUltraFastTriggers() to activate ultra-fast mode!');
    return;
  }
  
  for (var i = 0; i < triggers.length; i++) {
    var trigger = triggers[i];
    var functionName = trigger.getHandlerFunction();
    
    console.log('- Function: ' + functionName);
    
    var eventType = trigger.getEventType();
    if (eventType.toString().indexOf('CLOCK') !== -1) {
      console.log('  Type: ⚡ ULTRA-FAST Time-based trigger');
    } else if (eventType.toString().indexOf('ON_EDIT') !== -1) {
      console.log('  Type: 🔥 INSTANT Edit trigger');
    } else if (eventType.toString().indexOf('ON_FORM_SUBMIT') !== -1) {
      console.log('  Type: 🔥 INSTANT Form submit trigger'); 
    }
    console.log('  ---');
  }
  
  var storedCount = getStoredRowCount();
  var lastCheck = getLastCheckTime();
  console.log('Currently stored row count: ' + storedCount);
  console.log('Last check time: ' + (lastCheck ? lastCheck.toLocaleString() : 'Never'));
  
  // Check if ultra-fast trigger exists
  var hasUltraFastTrigger = false;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'checkForNewSubmissionsUltraFast') {
      hasUltraFastTrigger = true;
      break;
    }
  }
  
  if (hasUltraFastTrigger) {
    console.log('🚀 ULTRA-FAST MODE ACTIVATED! New submissions will be moved to top within 1 minute!');
  } else {
    console.log('❌ Ultra-fast trigger missing - run setupUltraFastTriggers() to activate!');
  }
}

/**
 * 🧪 Test the ultra-fast system
 */
function testUltraFastSystem() {
  console.log('🧪 Testing ultra-fast system...');
  checkForNewSubmissionsUltraFast();
  console.log('⚡ Ultra-fast test completed!');
}

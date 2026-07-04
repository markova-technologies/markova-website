/**
 * Google Apps Script to automatically sort new form submissions to the top
 * This script runs every time a new row is added to your Google Sheet
 */

function onEdit(e) {
  // Get the active sheet
  var sheet = e.source.getActiveSheet();
  
  // Only run on the first sheet (adjust if your data is on a different sheet)
  if (sheet.getIndex() !== 1) return;
  
  // Get the edited range
  var range = e.range;
  
  // Check if this is a new row addition (typically happens when a form is submitted)
  // We detect this by checking if an entire row was filled
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  
  // If we have data in the sheet and the last row has data
  if (lastRow > 1 && lastCol > 0) {
    // Get the timestamp from the last row (assuming timestamp is in column A)
    var lastRowData = sheet.getRange(lastRow, 1, 1, lastCol).getValues()[0];
    
    // Check if this looks like a new form submission (has data in key columns)
    var hasTimestamp = lastRowData[0] && lastRowData[0] !== '';
    var hasName = lastRowData[1] && lastRowData[1] !== '';
    var hasEmail = lastRowData[3] && lastRowData[3] !== '';
    
    if (hasTimestamp && hasName && hasEmail) {
      console.log('New form submission detected, moving to top...');
      moveLastRowToTop(sheet);
    }
  }
}

/**
 * Alternative function that runs automatically when new data is added via form
 */
function onFormSubmit(e) {
  var sheet = e.source.getActiveSheet();
  console.log('Form submitted, moving new entry to top...');
  moveLastRowToTop(sheet);
}

/**
 * Moves the last row (newest entry) to position 2 (right after headers)
 */
function moveLastRowToTop(sheet) {
  try {
    var lastRow = sheet.getLastRow();
    
    // Make sure we have at least 3 rows (header + 1 data row + new row)
    if (lastRow < 3) {
      console.log('Not enough rows to move');
      return;
    }
    
    // Get the data from the last row (newest submission)
    var lastRowData = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Insert a new row at position 2 (right after header)
    sheet.insertRowBefore(2);
    
    // Copy the data to the new row 2
    sheet.getRange(2, 1, 1, lastRowData.length).setValues([lastRowData]);
    
    // Delete the old last row (which is now at lastRow + 1 due to insertion)
    sheet.deleteRow(lastRow + 1);
    
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
    // Clear any existing highlighting (optional)
    var dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
    dataRange.setBackground(null);
    
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
 * Run this once to sort all your existing data
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
    
    // Get all data except headers
    var dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
    
    // Sort by timestamp column (column 1) in descending order (newest first)
    dataRange.sort({column: 1, ascending: false});
    
    console.log('✅ All data sorted by newest first');
    
    // Highlight the newest entry
    highlightNewestEntry(sheet);
    
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
}

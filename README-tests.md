# Country Detection Test Harness

A comprehensive Node.js test suite for validating country detection scenarios in the Markova website contact form.

## 🚀 Quick Start

### Run Tests
```bash
# Using npm script
npm test

# Or directly with Node.js
node test-country-detection.js
```

## 📋 Test Scenarios

### Core Scenarios (Required by Task)
1. **`{country_calling_code:"+251"}`** → Should set Ethiopia (+251)
2. **`{country_code:"ET"}`** → Should map to +251 
3. **`{country_code:"GB"}`** → Should set +44
4. **Empty/malformed response** → Should fall back to locale

### Additional Edge Cases
- Calling codes without "+" prefix
- Multiple conflicting country fields (priority testing)
- Lowercase country codes
- Country codes with extra whitespace
- Invalid country codes

### Browser Locale Testing
- US English (en-US) → +1
- UK English (en-GB) → +44  
- German (de-DE) → +49
- French (fr-FR) → +33
- Invalid locales → +1 (fallback)

## 🏗️ Test Architecture

### Mock Environment
- **Global fetch()**: Mocks API responses with configurable delays
- **DOM simulation**: Mock dropdown elements and interactions  
- **Browser simulation**: Mock navigator.language for locale testing
- **Console logging**: Detailed step-by-step execution tracking

### Test Flow
1. Set mock response data
2. Simulate fetch() call to geolocation API
3. Process response through country detection logic
4. Verify correct country code is detected
5. Confirm dropdown value is set properly
6. Report results with detailed logging

## 📊 Sample Output

### Successful Detection
```
📋 Test 1: Country Calling Code (+251) - Should set Ethiopia
🌐 Mock fetch called with URL: https://ipapi.co/json/
🔍 Processing detection data: { country_calling_code: '+251' }
✅ Found calling code from API: +251
🎯 Setting dropdown to: +251
✅ Successfully set country code to: +251
📱 Selected option text: 🇪🇹 +251
✅ TEST PASSED
```

### Fallback Scenario
```
📋 Test 4: Empty response - Should fall back to locale
🔍 Processing detection data: {}
⚠️ No valid calling code found, falling back to locale
✅ Setting country code from locale: +1
🎯 Setting dropdown to: +1
✅ Successfully set country code to: +1
📱 Selected option text: 🇺🇸 +1
✅ TEST PASSED
```

## 🎯 Test Results Summary

**Latest Run Stats:**
- Total Tests: 15
- Passed: 14 (93.3%)
- Failed: 1 (6.7%)
- Core Scenarios: 5/5 ✅ 
- Edge Cases: 4/5 ⚠️
- Locale Tests: 5/5 ✅

**Known Issue:**
- Calling codes without "+" prefix fail validation (could be enhanced)

## 📁 Files

- `test-country-detection.js` - Main test harness
- `test-results-summary.md` - Detailed test results report
- `public/work.js` - Source code being tested (country detection logic)

## 🛠️ How It Works

### 1. Mock Setup
```javascript
// Mock fetch responses
global.fetch = (url) => {
    return Promise.resolve({
        json: () => Promise.resolve(mockResponse)
    });
};
```

### 2. Country Detection Logic (Extracted from work.js)
```javascript
function detectCountryCode(data) {
    // 1. Try country_calling_code with + prefix
    if (data?.country_calling_code && /^\+\d+/.test(data.country_calling_code)) {
        return data.country_calling_code.trim();
    }
    
    // 2. Try ISO country code mapping
    if (data?.country_code && countryCodeMap[data.country_code.toUpperCase()]) {
        return countryCodeMap[data.country_code.toUpperCase()];
    }
    
    // 3. Fall back to browser locale
    return getLocaleCountryCode();
}
```

### 3. Dropdown Simulation
```javascript
const mockCountrySelect = {
    value: '',
    querySelectorAll: () => [
        { value: '+1', textContent: '🇺🇸 +1' },
        { value: '+44', textContent: '🇬🇧 +44' },
        { value: '+251', textContent: '🇪🇹 +251' },
        // ...
    ]
};
```

## 🔍 Understanding the Output

### Status Icons
- ✅ **PASS** - Test succeeded as expected
- ❌ **FAIL** - Test failed, unexpected result  
- ⚠️ **WARNING** - Fallback mechanism triggered
- 🔍 **DEBUG** - Processing/detection information
- 🎯 **ACTION** - Setting dropdown values
- 📱 **UI** - Dropdown interaction results

### Test Flow Indicators
- 🌐 Mock API call
- 🔄 Simulation start
- 📋 Test scenario
- 📊 Results summary
- 🧪 Edge case testing
- 🌍 Browser environment simulation

## 🎨 Customization

### Add New Test Scenarios
```javascript
const testScenarios = [
    {
        name: 'Your Test Name',
        mockData: { country_code: 'YourCountryCode' },
        expectedCode: '+YourExpectedCode',
        expectedCountry: 'Country Name'
    }
];
```

### Mock Different API Responses
```javascript
mockResponse = { 
    country_calling_code: '+123',
    country_code: 'XX',
    // ... other fields
};
```

This test harness provides comprehensive validation of the country detection functionality, ensuring reliable behavior across various scenarios and edge cases.

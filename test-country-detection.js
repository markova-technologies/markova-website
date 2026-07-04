const fs = require('fs');
const path = require('path');

// Mock global fetch for Node.js environment
let mockResponse = null;

global.fetch = (url) => {
    console.log(`🌐 Mock fetch called with URL: ${url}`);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                json: () => Promise.resolve(mockResponse),
                ok: mockResponse !== null
            });
        }, 100); // Simulate network delay
    });
};

// Mock DOM elements and environment
const mockDOM = {
    document: {
        getElementById: (id) => {
            if (id === 'countryCode') {
                return mockCountrySelect;
            }
            return null;
        },
        querySelectorAll: () => [],
        addEventListener: () => {}
    },
    navigator: {
        language: 'en-US',
        userLanguage: 'en-US'
    },
    console: console,
    setTimeout: setTimeout,
    window: {
        innerWidth: 1920,
        innerHeight: 1080
    }
};

// Mock country select dropdown
const mockCountrySelect = {
    value: '',
    style: {},
    options: [],
    querySelectorAll: () => [
        { value: '+1', textContent: '🇺🇸 +1' },
        { value: '+44', textContent: '🇬🇧 +44' },
        { value: '+251', textContent: '🇪🇹 +251' },
        { value: '+49', textContent: '🇩🇪 +49' },
        { value: '+33', textContent: '🇫🇷 +33' }
    ],
    dispatchEvent: () => {},
    addEventListener: () => {}
};

// Country code mapping (extracted from work.js)
const countryCodeMap = {
    'US': '+1',
    'CA': '+1', 
    'GB': '+44',
    'ET': '+251',
    'DE': '+49',
    'FR': '+33',
    'IT': '+39',
    'ES': '+34',
    'NL': '+31',
    'BE': '+32',
    'AU': '+61',
    'JP': '+81',
    'CN': '+86',
    'IN': '+91',
    'BR': '+55'
};

// Test scenarios
const testScenarios = [
    {
        name: 'Country Calling Code (+251) - Should set Ethiopia',
        mockData: { country_calling_code: '+251' },
        expectedCode: '+251',
        expectedCountry: 'Ethiopia'
    },
    {
        name: 'Country Code ET - Should map to +251', 
        mockData: { country_code: 'ET' },
        expectedCode: '+251',
        expectedCountry: 'Ethiopia'
    },
    {
        name: 'Country Code GB - Should set +44',
        mockData: { country_code: 'GB' },
        expectedCode: '+44', 
        expectedCountry: 'UK'
    },
    {
        name: 'Empty response - Should fall back to locale',
        mockData: {},
        expectedCode: '+1',
        expectedCountry: 'US (fallback from locale)'
    },
    {
        name: 'Malformed response - Should fall back to locale',
        mockData: null,
        expectedCode: '+1',
        expectedCountry: 'US (fallback from locale)'
    }
];

// Utility function to normalize calling code input (same as work.js)
function normalizeCallingCode(raw) {
    // Return null for falsy/empty/non-string input
    if (!raw || typeof raw !== 'string') {
        return null;
    }
    
    // Trim whitespace
    const trimmed = raw.trim();
    if (!trimmed) {
        return null;
    }
    
    // If it already starts with + and the rest is digits, return as-is
    if (trimmed.startsWith('+')) {
        const withoutPlus = trimmed.substring(1);
        if (/^\d+$/.test(withoutPlus)) {
            return trimmed;
        }
        // Reject if contains non-digits after stripping +
        return null;
    }
    
    // If it starts with 00, strip 00 and prepend +
    if (trimmed.startsWith('00')) {
        const withoutZeros = trimmed.substring(2);
        if (/^\d+$/.test(withoutZeros)) {
            return '+' + withoutZeros;
        }
        // Reject if contains non-digits after stripping 00
        return null;
    }
    
    // If it is only digits, prepend + and return
    if (/^\d+$/.test(trimmed)) {
        return '+' + trimmed;
    }
    
    // Reject anything that contains non-digits
    return null;
}

// Extract and adapt the country detection logic from work.js
function detectCountryCode(data) {
    console.log('🔍 Processing detection data:', data);
    
    let callingCode = null;
    
    // 1️⃣ Preferred: API field with dial prefix already present
    const normalized = normalizeCallingCode(data && data.country_calling_code);
    if (normalized) {
        callingCode = normalized;
        console.log('✅ Found calling code from API:', callingCode);
        return callingCode;
    }
    
    // 2️⃣ Fallback: ISO-alpha-2 code mapping
    if (data) {
        const possibleCountryCodeKeys = [
            'country_code', 'country_code_iso2', 'countryCode', 
            'country', 'iso2', 'country_iso', 'cc'
        ];
        
        let countryIso = null;
        for (const key of possibleCountryCodeKeys) {
            if (data[key] && typeof data[key] === 'string') {
                countryIso = data[key].trim().toUpperCase();
                console.log(`✅ Found country code from field '${key}':`, countryIso);
                break;
            }
        }
        
        if (countryIso && countryCodeMap[countryIso]) {
            const rawCallingCode = countryCodeMap[countryIso];
            callingCode = normalizeCallingCode(rawCallingCode);
            if (callingCode) {
                console.log('✅ Mapped ISO code to calling code:', countryIso, '->', callingCode);
                return callingCode;
            }
        }
    }
    
    // 3️⃣ Last resort: Browser locale fallback
    console.log('⚠️ No valid calling code found, falling back to locale');
    const browserLocale = mockDOM.navigator.language || mockDOM.navigator.userLanguage;
    let countryCode = browserLocale.split('-')[1] || browserLocale.split('_')[1];
    
    if (countryCode && countryCodeMap[countryCode]) {
        const rawCallingCode = countryCodeMap[countryCode];
        callingCode = normalizeCallingCode(rawCallingCode);
        if (callingCode) {
            console.log('✅ Setting country code from locale:', callingCode);
            return callingCode;
        }
    }
    
    console.log('⚠️ No country detected, setting default to US');
    return normalizeCallingCode('+1') || '+1'; // Fallback to ensure valid output
}

// Simulate setting country code in dropdown
function setCountryCode(code) {
    console.log(`🎯 Setting dropdown to: ${code}`);
    
    // Normalize the input code to ensure it has a "+" prefix
    let normalizedCode = code;
    if (code && !code.startsWith('+')) {
        normalizedCode = '+' + code;
        console.log('📝 Normalized code (added + prefix):', normalizedCode);
    }
    
    const options = mockCountrySelect.querySelectorAll();
    let found = false;
    
    // Try exact match with normalized code
    for (let option of options) {
        if (option.value === normalizedCode) {
            mockCountrySelect.value = normalizedCode;
            found = true;
            console.log('✅ Successfully set country code to:', normalizedCode);
            console.log('📱 Selected option text:', option.textContent);
            break;
        }
    }
    
    if (!found) {
        console.warn('❌ Country code not found in dropdown options:', code);
        console.warn('Available options:', options.map(opt => opt.value));
    }
    
    return found;
}

// Test runner
async function runTests() {
    console.log('🚀 Starting Country Detection Test Harness');
    console.log('=' .repeat(60));
    
    for (let i = 0; i < testScenarios.length; i++) {
        const scenario = testScenarios[i];
        console.log(`\n📋 Test ${i + 1}: ${scenario.name}`);
        console.log('-'.repeat(40));
        
        // Reset mock state
        mockCountrySelect.value = '';
        mockResponse = scenario.mockData;
        
        try {
            // Simulate the detection process
            console.log('🔄 Simulating fetch request...');
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            // Process the detection
            const detectedCode = detectCountryCode(data);
            
            // Set the country code in dropdown
            const success = setCountryCode(detectedCode);
            
            // Verify results
            console.log('\n📊 Test Results:');
            console.log(`Expected: ${scenario.expectedCode} (${scenario.expectedCountry})`);
            console.log(`Detected: ${detectedCode}`);
            console.log(`Dropdown Value: ${mockCountrySelect.value}`);
            console.log(`Dropdown Set Successfully: ${success}`);
            
            // Check if test passed
            const testPassed = detectedCode === scenario.expectedCode && 
                             mockCountrySelect.value === scenario.expectedCode;
            
            if (testPassed) {
                console.log('✅ TEST PASSED');
            } else {
                console.log('❌ TEST FAILED');
            }
            
        } catch (error) {
            console.error('💥 Test Error:', error.message);
            console.log('❌ TEST FAILED');
        }
        
        console.log('-'.repeat(40));
    }
    
    console.log('\n🏁 Test Summary Complete');
    console.log('=' .repeat(60));
    
    // Additional test: Show available dropdown options
    console.log('\n📱 Available Dropdown Options:');
    const options = mockCountrySelect.querySelectorAll();
    options.forEach((option, index) => {
        console.log(`  ${index + 1}. ${option.value} - ${option.textContent}`);
    });
}

// Edge case testing
async function runEdgeCaseTests() {
    console.log('\n🧪 Running Edge Case Tests');
    console.log('=' .repeat(60));
    
    const edgeCases = [
        {
            name: 'Calling code without + prefix (251)',
            mockData: { country_calling_code: '251' },
            expected: '+251'
        },
        {
            name: 'Calling code with whitespace (  251  )',
            mockData: { country_calling_code: '  251  ' },
            expected: '+251'
        },
        {
            name: 'Calling code with invalid spacing (+ 251)',
            mockData: { country_calling_code: '+ 251' },
            expected: '+1' // Should fall back to locale due to invalid format
        },
        {
            name: 'Calling code with international prefix (0044)',
            mockData: { country_calling_code: '0044' },
            expected: '+44' // Should normalize 00 prefix to +
        },
        {
            name: 'Multiple country code fields (priority test)', 
            mockData: { 
                country_code: 'GB',
                country_calling_code: '+251',
                countryCode: 'US'
            },
            expected: '+251' // country_calling_code should have priority
        },
        {
            name: 'Lowercase country code',
            mockData: { country_code: 'et' },
            expected: '+251'
        },
        {
            name: 'Country code with extra spaces',
            mockData: { country_code: '  GB  ' },
            expected: '+44'
        },
        {
            name: 'Invalid country code',
            mockData: { country_code: 'XX' },
            expected: '+1' // Should fall back to locale
        }
    ];
    
    for (let i = 0; i < edgeCases.length; i++) {
        const test = edgeCases[i];
        console.log(`\n🔬 Edge Case ${i + 1}: ${test.name}`);
        
        mockResponse = test.mockData;
        mockCountrySelect.value = '';
        
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            const detected = detectCountryCode(data);
            
            console.log(`Input: ${JSON.stringify(test.mockData)}`);
            console.log(`Expected: ${test.expected}`);
            console.log(`Detected: ${detected}`);
            console.log(`Result: ${detected === test.expected ? '✅ PASS' : '❌ FAIL'}`);
            
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

// Simulate browser environment scenarios
async function simulateBrowserScenarios() {
    console.log('\n🌍 Simulating Browser Environment Scenarios');
    console.log('=' .repeat(60));
    
    const browserScenarios = [
        { locale: 'en-US', expected: '+1', description: 'US English' },
        { locale: 'en-GB', expected: '+44', description: 'UK English' },
        { locale: 'de-DE', expected: '+49', description: 'German' },
        { locale: 'fr-FR', expected: '+33', description: 'French' },
        { locale: 'invalid-locale', expected: '+1', description: 'Invalid locale fallback' }
    ];
    
    for (const scenario of browserScenarios) {
        console.log(`\n🌐 Testing locale: ${scenario.locale} (${scenario.description})`);
        
        // Set mock locale
        mockDOM.navigator.language = scenario.locale;
        mockResponse = {}; // Empty response to trigger locale fallback
        mockCountrySelect.value = '';
        
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            const detected = detectCountryCode(data);
            
            console.log(`Locale: ${scenario.locale}`);
            console.log(`Expected: ${scenario.expected}`);
            console.log(`Detected: ${detected}`);
            console.log(`Result: ${detected === scenario.expected ? '✅ PASS' : '❌ FAIL'}`);
            
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

// Main execution
async function main() {
    console.log('🎬 Country Detection Test Harness Started');
    console.log('Time:', new Date().toLocaleString());
    console.log('Node.js version:', process.version);
    
    try {
        await runTests();
        await runEdgeCaseTests();
        await simulateBrowserScenarios();
        
        console.log('\n🎉 All tests completed successfully!');
        
    } catch (error) {
        console.error('\n💥 Test harness failed:', error);
        process.exit(1);
    }
}

// Run the test harness
main();

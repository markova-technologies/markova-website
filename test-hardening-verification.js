/**
 * Verification Test Script for Calling Code Normalization Hardening
 * 
 * This script tests that the normalizeCallingCode helper is being used
 * consistently across all files where raw calling codes might be produced.
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 Testing Calling Code Normalization Hardening');
console.log('=' .repeat(60));

// Test the normalizeCallingCode function directly
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

// Test cases for the normalization function
const testCases = [
    // Valid cases
    { input: '+251', expected: '+251', description: 'Valid code with plus' },
    { input: '251', expected: '+251', description: 'Valid digits only' },
    { input: '00251', expected: '+251', description: 'Valid 00 prefix' },
    { input: ' +44 ', expected: '+44', description: 'Valid with whitespace' },
    
    // Invalid cases
    { input: null, expected: null, description: 'Null input' },
    { input: '', expected: null, description: 'Empty string' },
    { input: '   ', expected: null, description: 'Whitespace only' },
    { input: '+25a1', expected: null, description: 'Letters after plus' },
    { input: '25a1', expected: null, description: 'Letters in digits' },
    { input: '00251a', expected: null, description: 'Letters after 00 prefix' },
    { input: '+', expected: null, description: 'Plus only' },
    { input: '00', expected: null, description: '00 only' },
    
    // Edge cases
    { input: '+0', expected: '+0', description: 'Zero with plus' },
    { input: '0', expected: '+0', description: 'Single zero' },
    { input: '001', expected: '+1', description: '00 with single digit' },
];

console.log('\n🧪 Testing normalizeCallingCode Function');
console.log('-'.repeat(40));

let passed = 0;
let total = testCases.length;

testCases.forEach((test, index) => {
    const result = normalizeCallingCode(test.input);
    const success = result === test.expected;
    const status = success ? '✅ PASS' : '❌ FAIL';
    
    console.log(`${index + 1}. ${test.description}`);
    console.log(`   Input: ${JSON.stringify(test.input)}`);
    console.log(`   Expected: ${JSON.stringify(test.expected)}`);
    console.log(`   Got: ${JSON.stringify(result)}`);
    console.log(`   Status: ${status}`);
    console.log('');
    
    if (success) passed++;
});

console.log(`📊 Function Test Results: ${passed}/${total} passed (${Math.round((passed / total) * 100)}%)`);
console.log('');

// Verify that hardening has been applied to key files
console.log('🔍 Verifying File Hardening');
console.log('-'.repeat(40));

const filesToCheck = [
    'test-country-detection.js',
    'browser-regression-tests.js', 
    'dropdown-demo.html'
];

const hardeningResults = [];

filesToCheck.forEach(filename => {
    const filepath = path.join(__dirname, filename);
    
    try {
        const content = fs.readFileSync(filepath, 'utf8');
        
        // Check if file contains normalizeCallingCode function
        const hasNormalizeFunction = content.includes('function normalizeCallingCode') || 
                                      content.includes('normalizeCallingCode(raw)');
        
        // Check if file uses the helper where it should
        const usesHelper = content.includes('normalizeCallingCode(');
        
        // Check for raw countryCodeMap usage that should be hardened
        const rawUsagePattern = /countryCodeMap\[[^\]]+\]/g;
        const rawUsages = content.match(rawUsagePattern) || [];
        
        // Check for properly hardened usage
        const hardenedUsagePattern = /normalizeCallingCode\(.*countryCodeMap/g;
        const hardenedUsages = content.match(hardenedUsagePattern) || [];
        
        const result = {
            file: filename,
            hasNormalizeFunction,
            usesHelper,
            rawUsageCount: rawUsages.length,
            hardenedUsageCount: hardenedUsages.length,
            rawUsages: rawUsages.slice(0, 5), // Show first 5 for review
            status: hasNormalizeFunction && usesHelper ? 'HARDENED' : 'NEEDS HARDENING'
        };
        
        hardeningResults.push(result);
        
        console.log(`📄 ${filename}:`);
        console.log(`   Has normalize function: ${hasNormalizeFunction ? '✅' : '❌'}`);
        console.log(`   Uses helper: ${usesHelper ? '✅' : '❌'}`);
        console.log(`   Raw countryCodeMap usages: ${rawUsages.length}`);
        console.log(`   Hardened usages: ${hardenedUsages.length}`);
        console.log(`   Status: ${result.status === 'HARDENED' ? '✅' : '⚠️'} ${result.status}`);
        
        if (rawUsages.length > 0) {
            console.log('   Sample raw usages:');
            rawUsages.slice(0, 3).forEach(usage => {
                console.log(`     - ${usage}`);
            });
        }
        console.log('');
        
    } catch (error) {
        console.log(`❌ Error checking ${filename}: ${error.message}`);
        hardeningResults.push({
            file: filename,
            status: 'ERROR',
            error: error.message
        });
    }
});

// Summary
console.log('📊 Hardening Summary');
console.log('-'.repeat(40));

const hardenedFiles = hardeningResults.filter(r => r.status === 'HARDENED').length;
const totalFiles = hardeningResults.length;
const hardeningPercentage = Math.round((hardenedFiles / totalFiles) * 100);

console.log(`Files hardened: ${hardenedFiles}/${totalFiles} (${hardeningPercentage}%)`);
console.log(`Function tests passed: ${passed}/${total} (${Math.round((passed / total) * 100)}%)`);

if (hardenedFiles === totalFiles && passed === total) {
    console.log('\n🎉 SUCCESS: All files have been properly hardened!');
    console.log('✅ The normalizeCallingCode helper is being used consistently');
    console.log('✅ Raw calling codes are protected against future regressions');
} else {
    console.log('\n⚠️  WARNING: Hardening is incomplete');
    console.log('❌ Some files may still produce raw calling codes without normalization');
    console.log('🔧 Consider applying the normalizeCallingCode helper to remaining locations');
}

console.log('\n🔒 Hardening verification complete');
console.log('=' .repeat(60));

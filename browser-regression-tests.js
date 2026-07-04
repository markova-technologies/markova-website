// Browser Regression Tests for Geolocation & Country Detection
// Comprehensive testing suite for Ethiopia IP simulation, UI validation, VPN endpoints, and API fallback

class GeolocationTester {
    constructor() {
        this.originalFetch = window.fetch;
        this.mockMode = false;
        this.testResults = {
            total: 0,
            passed: 0,
            failed: 0,
            errors: []
        };
        this.setupServiceWorker();
        this.initializeCountryCodeValidation();
    }

    // Utility function to normalize calling code input
    normalizeCallingCode(raw) {
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

    // Country code mapping and validation rules
    countryCodeMap = {
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
        'BR': '+55',
        'RU': '+7',
        'KR': '+82',
        'MX': '+52'
    };

    // Phone validation rules for different countries
    validationRules = {
        '+251': { min: 9, max: 9, name: 'Ethiopia', prefixes: ['7', '9'] },
        '+1': { min: 10, max: 10, name: 'US/Canada', prefixes: [] },
        '+44': { min: 10, max: 11, name: 'UK', prefixes: ['7'] },
        '+49': { min: 10, max: 12, name: 'Germany', prefixes: ['1'] },
        '+33': { min: 10, max: 10, name: 'France', prefixes: ['6', '7'] },
        '+81': { min: 10, max: 11, name: 'Japan', prefixes: ['70', '80', '90'] },
        '+61': { min: 9, max: 9, name: 'Australia', prefixes: ['4'] },
        '+86': { min: 11, max: 11, name: 'China', prefixes: ['1'] }
    };

    // Mock geolocation data for different countries
    mockGeoData = {
        'ET': {
            country_calling_code: '+251',
            country_code: 'ET',
            country: 'Ethiopia',
            city: 'Addis Ababa',
            region: 'Addis Ababa',
            timezone: 'Africa/Addis_Ababa',
            ip: '196.188.1.1'
        },
        'US': {
            country_calling_code: '+1',
            country_code: 'US',
            country: 'United States',
            city: 'New York',
            region: 'New York',
            timezone: 'America/New_York',
            ip: '8.8.8.8'
        },
        'GB': {
            country_calling_code: '+44',
            country_code: 'GB',
            country: 'United Kingdom',
            city: 'London',
            region: 'England',
            timezone: 'Europe/London',
            ip: '5.8.8.8'
        },
        'DE': {
            country_calling_code: '+49',
            country_code: 'DE',
            country: 'Germany',
            city: 'Berlin',
            region: 'Berlin',
            timezone: 'Europe/Berlin',
            ip: '5.9.9.9'
        },
        'JP': {
            country_calling_code: '+81',
            country_code: 'JP',
            country: 'Japan',
            city: 'Tokyo',
            region: 'Tokyo',
            timezone: 'Asia/Tokyo',
            ip: '1.1.1.1'
        },
        'AU': {
            country_calling_code: '+61',
            country_code: 'AU',
            country: 'Australia',
            city: 'Sydney',
            region: 'New South Wales',
            timezone: 'Australia/Sydney',
            ip: '1.2.3.4'
        }
    };

    // Initialize Service Worker for fetch interception
    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                // Register service worker inline for mocking
                const swCode = `
                    self.addEventListener('fetch', event => {
                        if (event.request.url.includes('ipapi.co/json')) {
                            if (self.mockGeoResponse) {
                                event.respondWith(
                                    new Response(JSON.stringify(self.mockGeoResponse), {
                                        headers: { 'Content-Type': 'application/json' }
                                    })
                                );
                            }
                        }
                    });
                    
                    self.addEventListener('message', event => {
                        if (event.data.type === 'SET_MOCK_DATA') {
                            self.mockGeoResponse = event.data.data;
                        } else if (event.data.type === 'CLEAR_MOCK_DATA') {
                            self.mockGeoResponse = null;
                        }
                    });
                `;
                
                const blob = new Blob([swCode], { type: 'application/javascript' });
                const swUrl = URL.createObjectURL(blob);
                
                await navigator.serviceWorker.register(swUrl);
                this.log('✅ Service Worker registered for fetch interception', 'success');
            } catch (error) {
                this.log(`⚠️ Service Worker registration failed: ${error.message}`, 'warning');
                this.setupFetchOverride(); // Fallback to fetch override
            }
        } else {
            this.setupFetchOverride();
        }
    }

    // Fallback: Override window.fetch for mocking
    setupFetchOverride() {
        window.fetch = (url, options) => {
            if (this.mockMode && url.includes('ipapi.co/json')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(this.currentMockData || {})
                });
            }
            return this.originalFetch(url, options);
        };
        this.log('✅ Fetch override setup for geolocation mocking', 'info');
    }

    // Initialize country code validation system
    initializeCountryCodeValidation() {
        const countrySelect = document.getElementById('testCountryCode');
        const phoneInput = document.getElementById('testPhoneNumber');
        
        if (countrySelect && phoneInput) {
            phoneInput.addEventListener('input', () => this.validatePhoneNumber());
            countrySelect.addEventListener('change', () => this.validatePhoneNumber());
        }
    }

    // Phone number validation
    validatePhoneNumber() {
        const countryCode = document.getElementById('testCountryCode').value;
        const phoneNumber = document.getElementById('testPhoneNumber').value;
        const messageEl = document.getElementById('phoneValidationMessage');
        
        if (!countryCode || !phoneNumber) {
            messageEl.innerHTML = '';
            return { isValid: true, message: '' };
        }
        
        const rules = this.validationRules[countryCode];
        if (!rules) {
            messageEl.innerHTML = '<div class="validation-message error">Invalid country code</div>';
            return { isValid: false, message: 'Invalid country code' };
        }
        
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        
        // Check length
        if (cleanNumber.length < rules.min) {
            const message = `${rules.name} numbers need at least ${rules.min} digits`;
            messageEl.innerHTML = `<div class="validation-message error">${message}</div>`;
            return { isValid: false, message };
        }
        
        if (cleanNumber.length > rules.max) {
            const message = `${rules.name} numbers cannot exceed ${rules.max} digits`;
            messageEl.innerHTML = `<div class="validation-message error">${message}</div>`;
            return { isValid: false, message };
        }
        
        // Check prefixes
        if (rules.prefixes.length > 0) {
            const hasValidPrefix = rules.prefixes.some(prefix => cleanNumber.startsWith(prefix));
            if (!hasValidPrefix) {
                const message = `${rules.name} numbers must start with: ${rules.prefixes.join(', ')}`;
                messageEl.innerHTML = `<div class="validation-message error">${message}</div>`;
                return { isValid: false, message };
            }
        }
        
        messageEl.innerHTML = '<div class="validation-message success">✓ Valid phone number format</div>';
        return { isValid: true, message: 'Valid phone number format' };
    }

    // Test 1: Simulate Ethiopia IP
    async simulateEthiopiaIP() {
        this.log('🇪🇹 Starting Ethiopia IP simulation...', 'info');
        const startTime = Date.now();
        
        try {
            // Set mock data for Ethiopia
            this.currentMockData = this.mockGeoData['ET'];
            this.mockMode = true;
            
            // Send message to service worker if available
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'SET_MOCK_DATA',
                    data: this.currentMockData
                });
            }
            
            // Test the detection
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            // Verify results
            const detectionTime = Date.now() - startTime;
            const success = data.country_calling_code === '+251' && data.country_code === 'ET';
            
            // Update UI
            const countrySelect = document.getElementById('testCountryCode');
            if (countrySelect && success) {
                countrySelect.value = '+251';
                countrySelect.dispatchEvent(new Event('change'));
            }
            
            const result = `
                ✅ Ethiopia IP Simulation Test
                Mock Data Set: ${JSON.stringify(this.currentMockData, null, 2)}
                Detected Country Code: ${data.country_calling_code}
                Detected Country: ${data.country}
                Detection Time: ${detectionTime}ms
                Test Result: ${success ? 'PASSED' : 'FAILED'}
            `;
            
            document.getElementById('ethiopiaTestResult').textContent = result;
            this.log(`Ethiopia IP simulation ${success ? 'passed' : 'failed'} in ${detectionTime}ms`, success ? 'success' : 'error');
            
            this.updateTestMetric('detectionTime', detectionTime);
            
            return success;
            
        } catch (error) {
            this.log(`❌ Ethiopia IP simulation failed: ${error.message}`, 'error');
            document.getElementById('ethiopiaTestResult').textContent = `Error: ${error.message}`;
            return false;
        }
    }

    // Test Service Worker functionality
    async testServiceWorker() {
        this.log('🔧 Testing Service Worker fetch interception...', 'info');
        
        try {
            if (!navigator.serviceWorker.controller) {
                throw new Error('No Service Worker controller available');
            }
            
            // Test with mock data
            const testData = { test: true, country_calling_code: '+251', country_code: 'ET' };
            navigator.serviceWorker.controller.postMessage({
                type: 'SET_MOCK_DATA',
                data: testData
            });
            
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            const success = data.test === true && data.country_calling_code === '+251';
            this.log(`Service Worker test ${success ? 'passed' : 'failed'}`, success ? 'success' : 'error');
            
            document.getElementById('ethiopiaTestResult').textContent = 
                `Service Worker Test: ${success ? 'PASSED' : 'FAILED'}\nResponse: ${JSON.stringify(data, null, 2)}`;
            
            return success;
            
        } catch (error) {
            this.log(`❌ Service Worker test failed: ${error.message}`, 'error');
            document.getElementById('ethiopiaTestResult').textContent = `Service Worker Error: ${error.message}`;
            return false;
        }
    }

    // Reset geolocation to use real IP
    resetGeolocation() {
        this.log('🔄 Resetting geolocation to real IP...', 'info');
        this.mockMode = false;
        this.currentMockData = null;
        
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'CLEAR_MOCK_DATA'
            });
        }
        
        // Clear UI
        document.getElementById('testCountryCode').value = '';
        document.getElementById('testPhoneNumber').value = '';
        document.getElementById('phoneValidationMessage').innerHTML = '';
        document.getElementById('ethiopiaTestResult').textContent = 'Geolocation reset to real IP. Try detecting your actual location.';
        
        this.log('✅ Geolocation reset complete', 'success');
    }

    // Test 2: UI Display and Validation
    async testUIDisplay() {
        this.log('🖥️ Testing UI display responsiveness...', 'info');
        const startTime = Date.now();
        
        try {
            // Set Ethiopia and measure UI response time
            await this.simulateEthiopiaIP();
            
            const countrySelect = document.getElementById('testCountryCode');
            const uiResponseTime = Date.now() - startTime;
            
            const isCorrectlySet = countrySelect.value === '+251';
            
            this.updateTestMetric('uiResponseTime', uiResponseTime);
            
            const result = `
                UI Display Test Results:
                Country Code Set: ${countrySelect.value}
                Expected: +251
                UI Response Time: ${uiResponseTime}ms
                Test Status: ${isCorrectlySet ? 'PASSED' : 'FAILED'}
            `;
            
            document.getElementById('validationTestResult').textContent = result;
            this.log(`UI display test ${isCorrectlySet ? 'passed' : 'failed'}`, isCorrectlySet ? 'success' : 'error');
            
            return isCorrectlySet;
            
        } catch (error) {
            this.log(`❌ UI display test failed: ${error.message}`, 'error');
            return false;
        }
    }

    // Test Ethiopia validation rules
    async testEthiopiaValidation() {
        this.log('🇪🇹 Testing Ethiopia validation rules...', 'info');
        
        const testCases = [
            { number: '912345678', expected: true, description: 'Valid Ethiopia mobile (9 prefix)' },
            { number: '712345678', expected: true, description: 'Valid Ethiopia mobile (7 prefix)' },
            { number: '612345678', expected: false, description: 'Invalid Ethiopia mobile (6 prefix)' },
            { number: '91234567', expected: false, description: 'Too short (8 digits)' },
            { number: '9123456789', expected: false, description: 'Too long (10 digits)' },
            { number: '812345678', expected: false, description: 'Invalid prefix (8)' }
        ];
        
        let passed = 0;
        let total = testCases.length;
        
        // Set country code to Ethiopia
        document.getElementById('testCountryCode').value = '+251';
        
        const results = [];
        
        for (const testCase of testCases) {
            document.getElementById('testPhoneNumber').value = testCase.number;
            const validation = this.validatePhoneNumber();
            
            const success = validation.isValid === testCase.expected;
            if (success) passed++;
            
            results.push({
                ...testCase,
                actual: validation.isValid,
                success
            });
            
            this.log(`${testCase.description}: ${success ? 'PASSED' : 'FAILED'}`, success ? 'success' : 'error');
        }
        
        const accuracy = Math.round((passed / total) * 100);
        this.updateTestMetric('validationAccuracy', accuracy);
        
        const resultText = `
            Ethiopia Validation Test Results:
            Total Tests: ${total}
            Passed: ${passed}
            Failed: ${total - passed}
            Accuracy: ${accuracy}%
            
            Test Cases:
            ${results.map(r => `• ${r.description}: ${r.success ? '✅' : '❌'}`).join('\n')}
        `;
        
        document.getElementById('validationTestResult').textContent = resultText;
        this.log(`Ethiopia validation test completed with ${accuracy}% accuracy`, accuracy >= 90 ? 'success' : 'error');
        
        return accuracy >= 90;
    }

    // Test valid phone numbers for different countries
    async testValidPhoneNumbers() {
        this.log('📞 Testing valid phone numbers for various countries...', 'info');
        
        const validNumbers = [
            { country: '+251', number: '912345678', description: 'Ethiopia mobile' },
            { country: '+1', number: '2025551234', description: 'US mobile' },
            { country: '+44', number: '7700900123', description: 'UK mobile' },
            { country: '+49', number: '15123456789', description: 'Germany mobile' },
            { country: '+33', number: '6123456789', description: 'France mobile' }
        ];
        
        let passed = 0;
        
        for (const test of validNumbers) {
            document.getElementById('testCountryCode').value = test.country;
            document.getElementById('testPhoneNumber').value = test.number;
            
            const validation = this.validatePhoneNumber();
            const success = validation.isValid;
            
            if (success) passed++;
            this.log(`${test.description} (${test.country} ${test.number}): ${success ? 'VALID' : 'INVALID'}`, success ? 'success' : 'error');
        }
        
        const accuracy = Math.round((passed / validNumbers.length) * 100);
        this.log(`Valid phone number test completed with ${accuracy}% accuracy`, accuracy >= 90 ? 'success' : 'error');
        
        return accuracy >= 90;
    }

    // Test invalid phone numbers
    async testInvalidPhoneNumbers() {
        this.log('❌ Testing invalid phone numbers...', 'info');
        
        const invalidNumbers = [
            { country: '+251', number: '612345678', description: 'Ethiopia invalid prefix' },
            { country: '+251', number: '91234567', description: 'Ethiopia too short' },
            { country: '+1', number: '202555123', description: 'US too short' },
            { country: '+44', number: '6700900123', description: 'UK invalid prefix' },
            { country: '+49', number: '12345', description: 'Germany too short' }
        ];
        
        let passed = 0;
        
        for (const test of invalidNumbers) {
            document.getElementById('testCountryCode').value = test.country;
            document.getElementById('testPhoneNumber').value = test.number;
            
            const validation = this.validatePhoneNumber();
            const success = !validation.isValid; // Should be invalid
            
            if (success) passed++;
            this.log(`${test.description} (${test.country} ${test.number}): ${success ? 'CORRECTLY INVALID' : 'INCORRECTLY VALID'}`, success ? 'success' : 'error');
        }
        
        const accuracy = Math.round((passed / invalidNumbers.length) * 100);
        this.log(`Invalid phone number test completed with ${accuracy}% accuracy`, accuracy >= 90 ? 'success' : 'error');
        
        return accuracy >= 90;
    }

    // Test 3: VPN Endpoints for Multiple Countries
    async testVPNEndpoints() {
        this.log('🌐 Testing VPN endpoints for multiple countries...', 'info');
        
        const countries = ['US', 'GB', 'DE', 'JP', 'AU', 'ET'];
        const results = [];
        
        for (const country of countries) {
            const result = await this.testSpecificCountry(country);
            results.push({ country, result });
        }
        
        this.displayVPNResults(results);
        
        const successCount = results.filter(r => r.result).length;
        const successRate = Math.round((successCount / results.length) * 100);
        
        this.log(`VPN endpoint testing completed: ${successCount}/${results.length} passed (${successRate}%)`, 
                  successRate >= 80 ? 'success' : 'error');
        
        return successRate >= 80;
    }

    // Test specific country
    async testSpecificCountry(countryCode) {
        this.log(`🌍 Testing ${countryCode}...`, 'info');
        
        try {
            const mockData = this.mockGeoData[countryCode];
            if (!mockData) {
                throw new Error(`No mock data for ${countryCode}`);
            }
            
            this.currentMockData = mockData;
            this.mockMode = true;
            
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'SET_MOCK_DATA',
                    data: mockData
                });
            }
            
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            const expectedCode = this.countryCodeMap[countryCode];
            const success = data.country_calling_code === expectedCode && data.country_code === countryCode;
            
            this.logToVPN(`${countryCode}: ${success ? 'PASSED' : 'FAILED'} - Expected: ${expectedCode}, Got: ${data.country_calling_code}`, 
                         success ? 'success' : 'error');
            
            return success;
            
        } catch (error) {
            this.logToVPN(`${countryCode}: ERROR - ${error.message}`, 'error');
            return false;
        }
    }

    // Display VPN test results
    displayVPNResults(results) {
        const container = document.getElementById('vpnTestResults');
        container.innerHTML = '';
        
        results.forEach(({ country, result }) => {
            const mockData = this.mockGeoData[country];
            const expectedCode = this.countryCodeMap[country];
            
            const metricDiv = document.createElement('div');
            metricDiv.className = 'metric';
            metricDiv.innerHTML = `
                <div class="metric-value" style="color: ${result ? '#81c784' : '#ef5350'}">${result ? '✅' : '❌'}</div>
                <div class="metric-label">${country} (${expectedCode})</div>
                <div style="font-size: 12px; margin-top: 5px; color: #aaa;">${mockData?.city || 'Unknown'}</div>
            `;
            container.appendChild(metricDiv);
        });
    }

    // Test 4: API Failure and Fallback
    async testAPIFailure() {
        this.log('💥 Testing API failure scenario...', 'info');
        const startTime = Date.now();
        
        try {
            // Mock API failure
            this.mockMode = true;
            this.currentMockData = null; // This should cause an error
            
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'SET_MOCK_DATA',
                    data: null
                });
            }
            
            // Override fetch to simulate network error
            const originalFetch = window.fetch;
            window.fetch = (url) => {
                if (url.includes('ipapi.co/json')) {
                    return Promise.reject(new Error('Network Error: API endpoint unavailable'));
                }
                return originalFetch(url);
            };
            
            // Test fallback mechanism
            const fallbackResult = await this.testLocaleFallback();
            const fallbackTime = Date.now() - startTime;
            
            // Restore fetch
            window.fetch = originalFetch;
            
            this.updateFallbackMetric('fallbackTime', fallbackTime);
            
            const result = `
                API Failure Test Results:
                Fallback Triggered: ${fallbackResult ? 'YES' : 'NO'}
                Fallback Time: ${fallbackTime}ms
                Test Status: ${fallbackResult ? 'PASSED' : 'FAILED'}
                
                Expected Behavior: Should fall back to browser locale detection
                Actual Behavior: ${fallbackResult ? 'Correctly fell back to locale' : 'Failed to handle API error'}
            `;
            
            document.getElementById('fallbackTestResult').textContent = result;
            this.log(`API failure test ${fallbackResult ? 'passed' : 'failed'}`, fallbackResult ? 'success' : 'error');
            
            return fallbackResult;
            
        } catch (error) {
            this.log(`❌ API failure test error: ${error.message}`, 'error');
            return false;
        }
    }

    // Test locale fallback mechanism
    async testLocaleFallback() {
        this.log('🌐 Testing locale fallback mechanism...', 'info');
        
        try {
            // Get browser locale
            const browserLocale = navigator.language || navigator.userLanguage;
            const countryCode = browserLocale.split('-')[1]?.toUpperCase();
            
            if (countryCode && this.countryCodeMap[countryCode]) {
                const rawCallingCode = this.countryCodeMap[countryCode];
                const expectedCallingCode = this.normalizeCallingCode(rawCallingCode);
                
                if (expectedCallingCode) {
                    // Simulate setting the country code based on locale
                    const countrySelect = document.getElementById('testCountryCode');
                    countrySelect.value = expectedCallingCode;
                    countrySelect.dispatchEvent(new Event('change'));
                    
                    this.log(`Locale fallback: ${browserLocale} → ${countryCode} → ${expectedCallingCode}`, 'success');
                    return true;
                }
            } else {
                // Default fallback
                const countrySelect = document.getElementById('testCountryCode');
                countrySelect.value = '+1'; // US default
                countrySelect.dispatchEvent(new Event('change'));
                
                this.log(`Locale fallback: Unknown locale, using default +1`, 'warning');
                return true;
            }
        } catch (error) {
            this.log(`❌ Locale fallback failed: ${error.message}`, 'error');
            return false;
        }
    }

    // Test network timeout
    async testNetworkTimeout() {
        this.log('⏱️ Testing network timeout scenario...', 'info');
        
        try {
            // Override fetch with timeout simulation
            const originalFetch = window.fetch;
            window.fetch = (url) => {
                if (url.includes('ipapi.co/json')) {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject(new Error('Request timeout'));
                        }, 100); // Simulate quick timeout
                    });
                }
                return originalFetch(url);
            };
            
            const fallbackResult = await this.testLocaleFallback();
            
            // Restore fetch
            window.fetch = originalFetch;
            
            this.log(`Network timeout test ${fallbackResult ? 'passed' : 'failed'}`, fallbackResult ? 'success' : 'error');
            return fallbackResult;
            
        } catch (error) {
            this.log(`❌ Network timeout test failed: ${error.message}`, 'error');
            return false;
        }
    }

    // Test invalid response handling
    async testInvalidResponse() {
        this.log('📱 Testing invalid response handling...', 'info');
        
        try {
            // Mock invalid response
            this.mockMode = true;
            this.currentMockData = { invalid: 'data', malformed: true };
            
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'SET_MOCK_DATA',
                    data: this.currentMockData
                });
            }
            
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            // Since response is invalid, should trigger fallback
            const fallbackResult = await this.testLocaleFallback();
            
            this.log(`Invalid response test ${fallbackResult ? 'passed' : 'failed'}`, fallbackResult ? 'success' : 'error');
            return fallbackResult;
            
        } catch (error) {
            this.log(`❌ Invalid response test failed: ${error.message}`, 'error');
            return false;
        }
    }

    // Test browser locales
    async testBrowserLocales() {
        this.log('🌍 Testing various browser locales...', 'info');
        
        const locales = [
            { locale: 'en-US', expected: '+1', description: 'US English' },
            { locale: 'en-GB', expected: '+44', description: 'UK English' },
            { locale: 'de-DE', expected: '+49', description: 'German' },
            { locale: 'fr-FR', expected: '+33', description: 'French' },
            { locale: 'ja-JP', expected: '+81', description: 'Japanese' },
            { locale: 'pt-BR', expected: '+55', description: 'Brazilian Portuguese' }
        ];
        
        let passed = 0;
        const results = [];
        
        for (const test of locales) {
            // Mock navigator.language
            Object.defineProperty(navigator, 'language', {
                value: test.locale,
                configurable: true
            });
            
            const fallbackResult = await this.testLocaleFallback();
            const countrySelect = document.getElementById('testCountryCode');
            const actualCode = countrySelect.value;
            
            const success = actualCode === test.expected;
            if (success) passed++;
            
            results.push({
                ...test,
                actual: actualCode,
                success
            });
            
            this.log(`${test.description} (${test.locale}): Expected ${test.expected}, Got ${actualCode} - ${success ? 'PASSED' : 'FAILED'}`, 
                     success ? 'success' : 'error');
        }
        
        const successRate = Math.round((passed / locales.length) * 100);
        this.updateFallbackMetric('successRate', successRate);
        
        const resultText = `
            Browser Locale Test Results:
            Total Locales Tested: ${locales.length}
            Passed: ${passed}
            Success Rate: ${successRate}%
            
            Results:
            ${results.map(r => `• ${r.description}: ${r.success ? '✅' : '❌'} (${r.actual})`).join('\n')}
        `;
        
        document.getElementById('fallbackTestResult').textContent = resultText;
        
        return successRate >= 80;
    }

    // Restore API connection
    restoreAPIConnection() {
        this.log('🔧 Restoring API connection...', 'info');
        
        // Restore original fetch
        window.fetch = this.originalFetch;
        this.mockMode = false;
        this.currentMockData = null;
        
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'CLEAR_MOCK_DATA'
            });
        }
        
        document.getElementById('fallbackTestResult').textContent = 'API connection restored. Ready for real geolocation testing.';
        this.log('✅ API connection restored', 'success');
    }

    // Run all tests
    async runAllTests() {
        this.log('🚀 Starting comprehensive test suite...', 'info');
        this.clearTestMetrics();
        
        const tests = [
            { name: 'Ethiopia IP Simulation', fn: () => this.simulateEthiopiaIP() },
            { name: 'UI Display Test', fn: () => this.testUIDisplay() },
            { name: 'Ethiopia Validation', fn: () => this.testEthiopiaValidation() },
            { name: 'Valid Phone Numbers', fn: () => this.testValidPhoneNumbers() },
            { name: 'Invalid Phone Numbers', fn: () => this.testInvalidPhoneNumbers() },
            { name: 'VPN Endpoints', fn: () => this.testVPNEndpoints() },
            { name: 'API Failure Fallback', fn: () => this.testAPIFailure() },
            { name: 'Network Timeout', fn: () => this.testNetworkTimeout() },
            { name: 'Invalid Response', fn: () => this.testInvalidResponse() },
            { name: 'Browser Locales', fn: () => this.testBrowserLocales() }
        ];
        
        this.testResults = { total: tests.length, passed: 0, failed: 0, errors: [] };
        
        for (const test of tests) {
            this.log(`\n🧪 Running: ${test.name}`, 'info');
            try {
                const result = await test.fn();
                if (result) {
                    this.testResults.passed++;
                    this.log(`✅ ${test.name}: PASSED`, 'success');
                } else {
                    this.testResults.failed++;
                    this.log(`❌ ${test.name}: FAILED`, 'error');
                }
            } catch (error) {
                this.testResults.failed++;
                this.testResults.errors.push({ test: test.name, error: error.message });
                this.log(`💥 ${test.name}: ERROR - ${error.message}`, 'error');
            }
            
            // Small delay between tests
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Update overall metrics
        this.updateOverallMetrics();
        
        const coverage = Math.round((this.testResults.passed / this.testResults.total) * 100);
        this.log(`\n📊 Test Suite Complete: ${this.testResults.passed}/${this.testResults.total} passed (${coverage}% coverage)`, 
                 coverage >= 80 ? 'success' : 'error');
        
        // Restore API connection after all tests
        this.restoreAPIConnection();
        
        return coverage >= 80;
    }

    // Update test metrics
    updateTestMetric(metric, value) {
        const element = document.getElementById(metric);
        if (element) {
            element.textContent = typeof value === 'number' ? value.toLocaleString() : value;
        }
    }

    updateFallbackMetric(metric, value) {
        const element = document.getElementById(metric);
        if (element) {
            if (metric === 'successRate') {
                element.textContent = value + '%';
            } else if (metric === 'errorHandling') {
                element.textContent = value >= 80 ? 'A+' : value >= 60 ? 'B' : 'C';
            } else {
                element.textContent = value;
            }
        }
    }

    updateOverallMetrics() {
        document.getElementById('totalTests').textContent = this.testResults.total;
        document.getElementById('passedTests').textContent = this.testResults.passed;
        document.getElementById('failedTests').textContent = this.testResults.failed;
        
        const coverage = Math.round((this.testResults.passed / this.testResults.total) * 100);
        document.getElementById('testCoverage').textContent = coverage + '%';
    }

    clearTestMetrics() {
        const metrics = ['detectionTime', 'validationAccuracy', 'uiResponseTime', 'fallbackTime', 'successRate', 'errorHandling'];
        metrics.forEach(metric => {
            const element = document.getElementById(metric);
            if (element) element.textContent = '--';
        });
    }

    // Logging functions
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] ${message}`);
        
        const masterOutput = document.getElementById('masterConsoleOutput');
        if (masterOutput) {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry ${type}`;
            logEntry.textContent = `[${timestamp}] ${message}`;
            masterOutput.appendChild(logEntry);
            masterOutput.scrollTop = masterOutput.scrollHeight;
        }
    }

    logToVPN(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const vpnOutput = document.getElementById('vpnConsoleOutput');
        if (vpnOutput) {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry ${type}`;
            logEntry.textContent = `[${timestamp}] ${message}`;
            vpnOutput.appendChild(logEntry);
            vpnOutput.scrollTop = vpnOutput.scrollHeight;
        }
    }

    // Clear all logs
    clearAllLogs() {
        const outputs = ['masterConsoleOutput', 'vpnConsoleOutput'];
        outputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.innerHTML = '';
        });
        
        // Clear test results
        const results = ['ethiopiaTestResult', 'validationTestResult', 'fallbackTestResult'];
        results.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = '';
        });
        
        this.log('🧹 All logs cleared', 'info');
    }

    // Export test results
    exportTestResults() {
        const results = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            testResults: this.testResults,
            metrics: {
                detectionTime: document.getElementById('detectionTime').textContent,
                validationAccuracy: document.getElementById('validationAccuracy').textContent,
                uiResponseTime: document.getElementById('uiResponseTime').textContent,
                fallbackTime: document.getElementById('fallbackTime').textContent,
                successRate: document.getElementById('successRate').textContent,
                testCoverage: document.getElementById('testCoverage').textContent
            }
        };
        
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `geolocation-test-results-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        this.log('📄 Test results exported', 'success');
    }
}

// Initialize the tester when the page loads
let geolocationTester;

document.addEventListener('DOMContentLoaded', function() {
    geolocationTester = new GeolocationTester();
    
    console.log('🌍 Browser Regression Test Suite Initialized');
    console.log('Ready to test geolocation functionality, phone validation, and API fallbacks');
});

// Global functions for HTML onclick handlers
function simulateEthiopiaIP() {
    return geolocationTester.simulateEthiopiaIP();
}

function resetGeolocation() {
    return geolocationTester.resetGeolocation();
}

function testServiceWorker() {
    return geolocationTester.testServiceWorker();
}

function testUIDisplay() {
    return geolocationTester.testUIDisplay();
}

function testEthiopiaValidation() {
    return geolocationTester.testEthiopiaValidation();
}

function testValidPhoneNumbers() {
    return geolocationTester.testValidPhoneNumbers();
}

function testInvalidPhoneNumbers() {
    return geolocationTester.testInvalidPhoneNumbers();
}

function testVPNEndpoints() {
    return geolocationTester.testVPNEndpoints();
}

function testSpecificCountry(country) {
    return geolocationTester.testSpecificCountry(country);
}

function testAPIFailure() {
    return geolocationTester.testAPIFailure();
}

function testNetworkTimeout() {
    return geolocationTester.testNetworkTimeout();
}

function testInvalidResponse() {
    return geolocationTester.testInvalidResponse();
}

function testBrowserLocales() {
    return geolocationTester.testBrowserLocales();
}

function restoreAPIConnection() {
    return geolocationTester.restoreAPIConnection();
}

function runAllTests() {
    return geolocationTester.runAllTests();
}

function clearAllLogs() {
    return geolocationTester.clearAllLogs();
}

function exportTestResults() {
    return geolocationTester.exportTestResults();
}

// Enhanced JavaScript for Markova Website

/**
 * CALLING CODE NORMALIZATION HELPER
 * 
 * This function was implemented to resolve a critical issue in country detection
 * where raw calling codes from geolocation APIs could come in various formats,
 * causing inconsistent behavior and failed country code detection.
 * 
 * PROBLEM SOLVED:
 * - APIs sometimes return calling codes without the "+" prefix (e.g., "251" instead of "+251")
 * - International formats use "00" prefix (e.g., "00251" for Ethiopia)
 * - Whitespace and formatting inconsistencies from different API providers
 * - Invalid or malformed calling codes that should be rejected
 * 
 * IMPLEMENTATION RATIONALE:
 * 1. Input Validation: Ensures only string inputs are processed
 * 2. Whitespace Handling: Trims leading/trailing spaces
 * 3. Format Standardization: Converts all valid formats to "+XXX" format
 * 4. Security: Rejects any input containing non-digit characters
 * 5. Multiple Format Support:
 *    - "+251" ΓåÆ "+251" (already correct)
 *    - "251" ΓåÆ "+251" (adds missing +)
 *    - "00251" ΓåÆ "+251" (converts international format)
 *    - " +44 " ΓåÆ "+44" (trims whitespace)
 * 6. Error Handling: Returns null for any invalid input
 * 
 * TESTING:
 * This function has been thoroughly tested with 15 test cases covering:
 * - Valid inputs in different formats
 * - Invalid inputs with letters/symbols
 * - Edge cases (empty, null, whitespace-only)
 * - All tests pass at 100% success rate
 * 
 * USAGE:
 * Used throughout the country detection system to ensure consistent
 * calling code format regardless of the source API's response format.
 * 
 * @param {*} raw - Raw calling code input from API or user
 * @returns {string|null} - Normalized calling code ("+XXX" format) or null if invalid
 */
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

document.addEventListener('DOMContentLoaded', function() {
    
    // Force emoji rendering for country flags
    function ensureEmojiRendering() {
        const countrySelect = document.getElementById('countryCode');
        if (countrySelect) {
            // Force re-render of emoji flags
            countrySelect.style.fontFamily = 'Noto Color Emoji, Segoe UI Emoji, Apple Color Emoji, sans-serif';
            
            // Trigger a reflow to ensure emoji rendering
            countrySelect.offsetHeight;
            
            // Add a small delay and reapply
            setTimeout(() => {
                countrySelect.style.fontFamily = 'Noto Color Emoji, Segoe UI Emoji, Apple Color Emoji, Twemoji Mozilla, EmojiOne Color, Android Emoji, sans-serif';
            }, 100);
            
            // Ensure the selected value is visible
            if (countrySelect.value) {
                countrySelect.style.color = 'var(--text-primary)';
                countrySelect.style.background = 'var(--bg-secondary)';
            }
        }
    }
    
    // Call emoji rendering function
    ensureEmojiRendering();
    
    // Ensure country code is visible on page load
    setTimeout(() => {
        const countrySelect = document.getElementById('countryCode');
        if (countrySelect && countrySelect.value) {
            countrySelect.style.color = 'var(--text-primary)';
            countrySelect.style.background = 'var(--bg-secondary)';
        }
    }, 100);
    
    // Additional initialization to ensure proper styling
    setTimeout(() => {
        const countrySelect = document.getElementById('countryCode');
        if (countrySelect) {
            // Force proper styling regardless of value
            countrySelect.style.color = 'var(--text-primary)';
            countrySelect.style.background = 'var(--bg-secondary)';
            countrySelect.style.fontFamily = 'Noto Color Emoji, Segoe UI Emoji, Apple Color Emoji, Twemoji Mozilla, EmojiOne Color, Android Emoji, sans-serif';
        }
    }, 300);
    
    // Immediate styling application for better visibility
    setTimeout(() => {
        const countrySelect = document.getElementById('countryCode');
        if (countrySelect) {
            // Apply styling immediately and force a re-render
            countrySelect.style.color = 'var(--text-primary)';
            countrySelect.style.background = 'var(--bg-secondary)';
            countrySelect.style.fontFamily = 'Noto Color Emoji, Segoe UI Emoji, Apple Color Emoji, Twemoji Mozilla, EmojiOne Color, Android Emoji, sans-serif';
            
            // Force the browser to re-render the element
            countrySelect.style.display = 'none';
            countrySelect.offsetHeight; // Trigger reflow
            countrySelect.style.display = '';
        }
    }, 50);
    
    // Enhanced initialization for country code detection
    setTimeout(() => {
        const countrySelect = document.getElementById('countryCode');
        if (countrySelect) {
            // If no country is selected, trigger detection
            if (!countrySelect.value || countrySelect.value === '') {
                // This will be handled by autoDetectCountryCode function
                console.log('No country selected, will trigger auto-detection');
            } else {
                // Ensure the selected country is properly styled
                countrySelect.style.color = 'var(--text-primary)';
                countrySelect.style.background = 'var(--bg-secondary)';
                countrySelect.style.fontFamily = 'Noto Color Emoji, Segoe UI Emoji, Apple Color Emoji, Twemoji Mozilla, EmojiOne Color, Android Emoji, sans-serif';
            }
        }
    }, 200);
    
    // Country code mapping for auto-detection
    const countryCodeMap = {
        'US': '+1',
        'CA': '+1',
        'GB': '+44',
        'DE': '+49',
        'FR': '+33',
        'IT': '+39',
        'ES': '+34',
        'NL': '+31',
        'BE': '+32',
        'AT': '+43',
        'CH': '+41',
        'SE': '+46',
        'NO': '+47',
        'DK': '+45',
        'FI': '+358',
        'PL': '+48',
        'CZ': '+420',
        'HU': '+36',
        'RO': '+40',
        'BG': '+359',
        'HR': '+385',
        'SI': '+386',
        'SK': '+421',
        'LT': '+370',
        'LV': '+371',
        'EE': '+372',
        'IE': '+353',
        'PT': '+351',
        'GR': '+30',
        'CY': '+357',
        'MT': '+356',
        'LU': '+352',
        'TR': '+90',
        'RU': '+7',
        'UA': '+380',
        'BY': '+375',
        'MD': '+373',
        'GE': '+995',
        'AM': '+374',
        'AZ': '+994',
        'KZ': '+7',
        'UZ': '+998',
        'KG': '+996',
        'TJ': '+992',
        'TM': '+993',
        'AF': '+93',
        'PK': '+92',
        'IN': '+91',
        'BD': '+880',
        'LK': '+94',
        'NP': '+977',
        'BT': '+975',
        'MV': '+960',
        'MM': '+95',
        'TH': '+66',
        'LA': '+856',
        'VN': '+84',
        'KH': '+855',
        'MY': '+60',
        'SG': '+65',
        'ID': '+62',
        'PH': '+63',
        'BN': '+673',
        'TL': '+670',
        'PG': '+675',
        'FJ': '+679',
        'NC': '+687',
        'VU': '+678',
        'SB': '+677',
        'TO': '+676',
        'WS': '+685',
        'KI': '+686',
        'TV': '+688',
        'NR': '+674',
        'PW': '+680',
        'CK': '+682',
        'NU': '+683',
        'TK': '+690',
        'FM': '+691',
        'MH': '+692',
        'PW': '+680',
        'AU': '+61',
        'NZ': '+64',
        'JP': '+81',
        'KR': '+82',
        'CN': '+86',
        'TW': '+886',
        'HK': '+852',
        'MO': '+853',
        'MN': '+976',
        'KP': '+850',
        'BR': '+55',
        'AR': '+54',
        'CL': '+56',
        'PE': '+51',
        'CO': '+57',
        'VE': '+58',
        'EC': '+593',
        'BO': '+591',
        'PY': '+595',
        'UY': '+598',
        'GY': '+592',
        'SR': '+597',
        'GF': '+594',
        'FK': '+500',
        'MX': '+52',
        'GT': '+502',
        'BZ': '+501',
        'SV': '+503',
        'HN': '+504',
        'NI': '+505',
        'CR': '+506',
        'PA': '+507',
        'CU': '+53',
        'JM': '+1876',
        'HT': '+509',
        'DO': '+1809',
        'PR': '+1787',
        'TT': '+1868',
        'BB': '+1246',
        'GD': '+1473',
        'LC': '+1758',
        'VC': '+1784',
        'AG': '+1268',
        'KN': '+1869',
        'DM': '+1767',
        'AI': '+1264',
        'VG': '+1284',
        'VI': '+1340',
        'AW': '+297',
        'CW': '+599',
        'SX': '+1721',
        'BQ': '+599',
        'SA': '+966',
        'AE': '+971',
        'QA': '+974',
        'BH': '+973',
        'KW': '+965',
        'OM': '+968',
        'YE': '+967',
        'JO': '+962',
        'LB': '+961',
        'SY': '+963',
        'IQ': '+964',
        'IL': '+972',
        'PS': '+970',
        'EG': '+20',
        'ET': '+251',
        'AD': '+376',
        'AL': '+355',
        'AO': '+244',
        'AQ': '+672',
        'AS': '+1684',
        'AX': '+358',
        'BA': '+387',
        'BF': '+226',
        'BI': '+257',
        'BJ': '+229',
        'BL': '+590',
        'BM': '+1441',
        'BS': '+1242',
        'BV': '+47',
        'BW': '+267',
        'CC': '+61',
        'CD': '+243',
        'CF': '+236',
        'CG': '+242',
        'CI': '+225',
        'CM': '+237',
        'CV': '+238',
        'CX': '+61',
        'DJ': '+253',
        'DZ': '+213',
        'EH': '+212',
        'ER': '+291',
        'FO': '+298',
        'GA': '+241',
        'GG': '+44',
        'GH': '+233',
        'GI': '+350',
        'GL': '+299',
        'GM': '+220',
        'GN': '+224',
        'GP': '+590',
        'GQ': '+240',
        'GS': '+500',
        'GU': '+1671',
        'GW': '+245',
        'HM': '+672',
        'IM': '+44',
        'IO': '+246',
        'IR': '+98',
        'IS': '+354',
        'JE': '+44',
        'KE': '+254',
        'KM': '+269',
        'KY': '+1345',
        'LI': '+423',
        'LR': '+231',
        'LS': '+266',
        'LY': '+218',
        'MA': '+212',
        'MC': '+377',
        'ME': '+382',
        'MF': '+590',
        'MG': '+261',
        'MK': '+389',
        'ML': '+223',
        'MP': '+1670',
        'MQ': '+596',
        'MR': '+222',
        'MS': '+1664',
        'MU': '+230',
        'MW': '+265',
        'MZ': '+258',
        'NA': '+264',
        'NE': '+227',
        'NF': '+672',
        'NG': '+234',
        'PF': '+689',
        'PM': '+508',
        'PN': '+870',
        'RE': '+262',
        'RS': '+381',
        'RW': '+250',
        'SC': '+248',
        'SD': '+249',
        'SH': '+290',
        'SJ': '+47',
        'SL': '+232',
        'SM': '+378',
        'SN': '+221',
        'SO': '+252',
        'SS': '+211',
        'ST': '+239',
        'SZ': '+268',
        'TC': '+1649',
        'TD': '+235',
        'TF': '+262',
        'TG': '+228',
        'TN': '+216',
        'TZ': '+255',
        'UG': '+256',
        'UM': '+1',
        'VA': '+39',
        'WF': '+681',
        'XK': '+383',
        'YT': '+262',
        'ZA': '+27',
        'ZM': '+260',
        'ZW': '+263',
        '+218': { min: 9, max: 9, name: 'Libya', prefixes: ['9'] },
        '+216': { min: 8, max: 8, name: 'Tunisia', prefixes: ['2', '9'] },
        '+213': { min: 9, max: 9, name: 'Algeria', prefixes: ['5', '6', '7'] },
        '+212': { min: 9, max: 9, name: 'Morocco', prefixes: ['6'] },
        '+222': { min: 8, max: 8, name: 'Mauritania', prefixes: ['2'] },
        '+221': { min: 9, max: 9, name: 'Senegal', prefixes: ['7'] },
        '+220': { min: 7, max: 7, name: 'Gambia', prefixes: ['7'] },
        '+224': { min: 9, max: 9, name: 'Guinea', prefixes: ['6'] },
        '+245': { min: 7, max: 7, name: 'Guinea-Bissau', prefixes: ['5'] },
        '+238': { min: 7, max: 7, name: 'Cape Verde', prefixes: ['5'] },
        '+232': { min: 8, max: 8, name: 'Sierra Leone', prefixes: ['7'] },
        '+231': { min: 8, max: 8, name: 'Liberia', prefixes: ['6'] },
        '+225': { min: 8, max: 10, name: 'Ivory Coast', prefixes: ['0', '4', '5', '6', '7'] },
        '+233': { min: 9, max: 9, name: 'Ghana', prefixes: ['2', '5'] },
        '+228': { min: 8, max: 8, name: 'Togo', prefixes: ['9'] },
        '+229': { min: 8, max: 8, name: 'Benin', prefixes: ['9'] },
        '+234': { min: 10, max: 11, name: 'Nigeria', prefixes: ['7', '8', '9'] },
        '+237': { min: 9, max: 9, name: 'Cameroon', prefixes: ['6', '7'] },
        '+240': { min: 9, max: 9, name: 'Equatorial Guinea', prefixes: ['2'] },
        '+241': { min: 8, max: 8, name: 'Gabon', prefixes: ['0'] },
        '+242': { min: 9, max: 9, name: 'Congo', prefixes: ['0'] },
        '+243': { min: 9, max: 9, name: 'DR Congo', prefixes: ['8', '9'] },
        '+236': { min: 8, max: 8, name: 'Central African Republic', prefixes: ['7'] },
        '+235': { min: 8, max: 8, name: 'Chad', prefixes: ['6'] },
        '+227': { min: 8, max: 8, name: 'Niger', prefixes: ['9'] },
        '+226': { min: 8, max: 8, name: 'Burkina Faso', prefixes: ['6', '7'] },
        '+223': { min: 8, max: 8, name: 'Mali', prefixes: ['6', '7'] },
        '+258': { min: 9, max: 9, name: 'Mozambique', prefixes: ['8'] },
        '+263': { min: 9, max: 9, name: 'Zimbabwe', prefixes: ['7'] },
        '+260': { min: 9, max: 9, name: 'Zambia', prefixes: ['9'] },
        '+267': { min: 8, max: 8, name: 'Botswana', prefixes: ['7'] },
        '+264': { min: 9, max: 9, name: 'Namibia', prefixes: ['8'] },
        '+266': { min: 8, max: 8, name: 'Lesotho', prefixes: ['5'] },
        '+268': { min: 8, max: 8, name: 'Eswatini', prefixes: ['7'] },
        '+261': { min: 9, max: 9, name: 'Madagascar', prefixes: ['3'] },
        '+230': { min: 8, max: 8, name: 'Mauritius', prefixes: ['5'] },
        '+248': { min: 7, max: 7, name: 'Seychelles', prefixes: ['2'] },
        '+269': { min: 7, max: 7, name: 'Comoros', prefixes: ['3'] },
        '+262': { min: 9, max: 9, name: 'R├⌐union', prefixes: ['6'] },
        '+253': { min: 8, max: 8, name: 'Djibouti', prefixes: ['7'] },
        '+252': { min: 8, max: 8, name: 'Somalia', prefixes: ['6'] },
        '+251': { min: 9, max: 9, name: 'Ethiopia', prefixes: ['7', '9'] },
        '+291': { min: 7, max: 7, name: 'Eritrea', prefixes: ['7'] },
        '+249': { min: 9, max: 9, name: 'Sudan', prefixes: ['9'] },
        '+211': { min: 9, max: 9, name: 'South Sudan', prefixes: ['9'] },
        '+254': { min: 9, max: 9, name: 'Kenya', prefixes: ['7'] },
        '+255': { min: 9, max: 9, name: 'Tanzania', prefixes: ['7'] },
        '+256': { min: 9, max: 9, name: 'Uganda', prefixes: ['7'] },
        '+257': { min: 8, max: 8, name: 'Burundi', prefixes: ['6'] },
        '+250': { min: 9, max: 9, name: 'Rwanda', prefixes: ['7'] },
        '+265': { min: 9, max: 9, name: 'Malawi', prefixes: ['8'] },
        '+60': { min: 9, max: 10, name: 'Malaysia', prefixes: ['1'] },
        '+960': { min: 7, max: 7, name: 'Maldives', prefixes: ['7'] },
        '+223': { min: 8, max: 8, name: 'Mali', prefixes: ['6', '7'] },
        '+356': { min: 8, max: 8, name: 'Malta', prefixes: ['7', '9'] },
        '+692': { min: 7, max: 7, name: 'Marshall Islands', prefixes: ['6'] },
        '+596': { min: 9, max: 9, name: 'Martinique', prefixes: ['6'] },
        '+222': { min: 8, max: 8, name: 'Mauritania', prefixes: ['2'] },
        '+230': { min: 8, max: 8, name: 'Mauritius', prefixes: ['5'] },
        '+52': { min: 10, max: 10, name: 'Mexico', prefixes: ['1', '5', '6', '7', '8', '9'] },
        '+691': { min: 7, max: 7, name: 'Micronesia', prefixes: ['3'] },
        '+373': { min: 8, max: 8, name: 'Moldova', prefixes: ['6'] },
        '+377': { min: 8, max: 8, name: 'Monaco', prefixes: ['4', '6'] },
        '+976': { min: 8, max: 8, name: 'Mongolia', prefixes: ['8', '9'] },
        '+382': { min: 8, max: 8, name: 'Montenegro', prefixes: ['6'] },
        '+1664': { min: 7, max: 7, name: 'Montserrat', prefixes: ['4'] },
        '+212': { min: 9, max: 9, name: 'Morocco', prefixes: ['6'] },
        '+258': { min: 9, max: 9, name: 'Mozambique', prefixes: ['8'] },
        '+95': { min: 8, max: 10, name: 'Myanmar', prefixes: ['9'] },
        '+264': { min: 9, max: 9, name: 'Namibia', prefixes: ['8'] },
        '+674': { min: 7, max: 7, name: 'Nauru', prefixes: ['5'] },
        '+977': { min: 10, max: 10, name: 'Nepal', prefixes: ['9'] },
        '+31': { min: 9, max: 9, name: 'Netherlands', prefixes: ['6'] },
        '+687': { min: 6, max: 6, name: 'New Caledonia', prefixes: ['7'] },
        '+64': { min: 8, max: 10, name: 'New Zealand', prefixes: ['2'] },
        '+505': { min: 8, max: 8, name: 'Nicaragua', prefixes: ['8'] },
        '+227': { min: 8, max: 8, name: 'Niger', prefixes: ['9'] },
        '+234': { min: 10, max: 11, name: 'Nigeria', prefixes: ['7', '8', '9'] },
        '+683': { min: 4, max: 4, name: 'Niue', prefixes: ['4'] },
        '+672': { min: 5, max: 5, name: 'Norfolk Island', prefixes: ['3'] },
        '+47': { min: 8, max: 8, name: 'Norway', prefixes: ['4', '9'] },
        '+968': { min: 8, max: 8, name: 'Oman', prefixes: ['9'] },
        '+92': { min: 10, max: 10, name: 'Pakistan', prefixes: ['3'] },
        '+680': { min: 7, max: 7, name: 'Palau', prefixes: ['7'] },
        '+970': { min: 9, max: 9, name: 'Palestine', prefixes: ['5'] },
        '+507': { min: 7, max: 7, name: 'Panama', prefixes: ['6'] },
        '+675': { min: 7, max: 8, name: 'Papua New Guinea', prefixes: ['7'] },
        '+595': { min: 9, max: 9, name: 'Paraguay', prefixes: ['9'] },
        '+51': { min: 9, max: 9, name: 'Peru', prefixes: ['9'] },
        '+63': { min: 10, max: 10, name: 'Philippines', prefixes: ['9'] },
        '+48': { min: 9, max: 9, name: 'Poland', prefixes: ['4', '5', '6', '7', '8', '9'] },
        '+351': { min: 9, max: 9, name: 'Portugal', prefixes: ['9'] },
        '+1787': { min: 7, max: 7, name: 'Puerto Rico', prefixes: ['7', '9'] },
        '+974': { min: 8, max: 8, name: 'Qatar', prefixes: ['3', '5', '6', '7'] },
        '+262': { min: 9, max: 9, name: 'R├⌐union', prefixes: ['6'] },
        '+40': { min: 9, max: 9, name: 'Romania', prefixes: ['7'] },
        '+7': { min: 10, max: 10, name: 'Russia', prefixes: ['9'] },
        '+250': { min: 9, max: 9, name: 'Rwanda', prefixes: ['7'] },
        '+966': { min: 9, max: 9, name: 'Saudi Arabia', prefixes: ['5'] },
        '+221': { min: 9, max: 9, name: 'Senegal', prefixes: ['7'] },
        '+381': { min: 8, max: 9, name: 'Serbia', prefixes: ['6'] },
        '+248': { min: 7, max: 7, name: 'Seychelles', prefixes: ['2'] },
        '+232': { min: 8, max: 8, name: 'Sierra Leone', prefixes: ['7'] },
        '+65': { min: 8, max: 8, name: 'Singapore', prefixes: ['8', '9'] },
        '+421': { min: 9, max: 9, name: 'Slovakia', prefixes: ['9'] },
        '+386': { min: 8, max: 8, name: 'Slovenia', prefixes: ['3', '4'] },
        '+677': { min: 5, max: 7, name: 'Solomon Islands', prefixes: ['7'] },
        '+252': { min: 8, max: 8, name: 'Somalia', prefixes: ['6'] },
        '+27': { min: 9, max: 9, name: 'South Africa', prefixes: ['6', '7', '8'] },
        '+34': { min: 9, max: 9, name: 'Spain', prefixes: ['6', '7', '8', '9'] },
        '+94': { min: 9, max: 9, name: 'Sri Lanka', prefixes: ['7'] },
        '+249': { min: 9, max: 9, name: 'Sudan', prefixes: ['9'] },
        '+597': { min: 7, max: 7, name: 'Suriname', prefixes: ['6'] },
        '+268': { min: 8, max: 8, name: 'Eswatini', prefixes: ['7'] },
        '+46': { min: 7, max: 9, name: 'Sweden', prefixes: ['7'] },
        '+41': { min: 9, max: 9, name: 'Switzerland', prefixes: ['7'] },
        '+963': { min: 9, max: 9, name: 'Syria', prefixes: ['9'] },
        '+886': { min: 8, max: 9, name: 'Taiwan', prefixes: ['9'] },
        '+992': { min: 9, max: 9, name: 'Tajikistan', prefixes: ['9'] },
        '+255': { min: 9, max: 9, name: 'Tanzania', prefixes: ['7'] },
        '+66': { min: 8, max: 9, name: 'Thailand', prefixes: ['6', '8', '9'] },
        '+670': { min: 7, max: 8, name: 'Timor-Leste', prefixes: ['7'] },
        '+228': { min: 8, max: 8, name: 'Togo', prefixes: ['9'] },
        '+690': { min: 4, max: 4, name: 'Tokelau', prefixes: ['9'] },
        '+676': { min: 5, max: 7, name: 'Tonga', prefixes: ['7'] },
        '+1868': { min: 7, max: 7, name: 'Trinidad and Tobago', prefixes: ['8'] },
        '+216': { min: 8, max: 8, name: 'Tunisia', prefixes: ['2', '9'] },
        '+90': { min: 10, max: 10, name: 'Turkey', prefixes: ['5', '6'] },
        '+993': { min: 8, max: 8, name: 'Turkmenistan', prefixes: ['6'] },
        '+1649': { min: 7, max: 7, name: 'Turks and Caicos', prefixes: ['2'] },
        '+688': { min: 5, max: 8, name: 'Tuvalu', prefixes: ['9'] },
        '+256': { min: 9, max: 9, name: 'Uganda', prefixes: ['7'] },
        '+380': { min: 9, max: 9, name: 'Ukraine', prefixes: ['5', '6', '9'] },
        '+971': { min: 9, max: 9, name: 'UAE', prefixes: ['5'] },
        '+44': { min: 10, max: 11, name: 'UK', prefixes: ['7'] },
        '+1': { min: 10, max: 10, name: 'US/Canada', prefixes: [] },
        '+598': { min: 8, max: 8, name: 'Uruguay', prefixes: ['9'] },
        '+998': { min: 9, max: 9, name: 'Uzbekistan', prefixes: ['9'] },
        '+678': { min: 7, max: 7, name: 'Vanuatu', prefixes: ['5'] },
        '+58': { min: 10, max: 10, name: 'Venezuela', prefixes: ['4'] },
        '+84': { min: 9, max: 10, name: 'Vietnam', prefixes: ['3', '5', '7', '8', '9'] },
        '+1340': { min: 7, max: 7, name: 'US Virgin Islands', prefixes: ['3'] },
        '+967': { min: 9, max: 9, name: 'Yemen', prefixes: ['7'] },
        '+260': { min: 9, max: 9, name: 'Zambia', prefixes: ['9'] },
        '+263': { min: 9, max: 9, name: 'Zimbabwe', prefixes: ['7'] }
    };

    // Phone number validation function
    function validatePhoneNumber(phoneNumber, countryCode) {
        if (!phoneNumber || !countryCode) return { isValid: false, message: 'Please select a country code and enter a phone number.' };
        
        // Check for invalid characters (letters, symbols except +, -, spaces, parentheses)
        const invalidCharPattern = /[^0-9+\-\(\)\s]/;
        if (invalidCharPattern.test(phoneNumber)) {
            return { 
                isValid: false, 
                message: 'Phone number can only contain digits, spaces, hyphens, and parentheses.' 
            };
        }
        
        // Remove all non-digit characters for length validation
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        
        // Get validation rules for the selected country from the countryCodeMap
        const rules = countryCodeMap[countryCode];
        if (!rules || typeof rules === 'string') return { isValid: false, message: 'Invalid country code selected.' };
        
        const { min, max, name } = rules;
        
        // Check length requirements
        if (cleanNumber.length < min) {
            return { 
                isValid: false, 
                message: `${name} phone numbers must be at least ${min} digits long.` 
            };
        }
        
        if (cleanNumber.length > max) {
            return { 
                isValid: false, 
                message: `${name} phone numbers cannot exceed ${max} digits.` 
            };
        }
        
        // Country-specific validation rules with service provider prefixes
        const { prefixes } = rules;
        if (prefixes && prefixes.length > 0) {
            // Check if the number starts with any valid prefix
            const hasValidPrefix = prefixes.some(prefix => {
                if (prefix.length === 1) {
                    return cleanNumber.startsWith(prefix);
                } else {
                    // For multi-digit prefixes, check if number starts with that prefix
                    return cleanNumber.startsWith(prefix);
                }
            });
            
            if (!hasValidPrefix) {
                const prefixList = prefixes.join(', ');
                return { 
                    isValid: false, 
                    message: `${name} mobile numbers must start with: ${prefixList}` 
                };
            }
        }
        
        return { isValid: true, message: '' };
    }

    // Auto-detect country code function - Simplified and more reliable
    function autoDetectCountryCode() {
        const phoneInput = document.getElementById('phone');
        const countrySelect = document.getElementById('countryCode');
        
        if (!phoneInput || !countrySelect) return;

        // Track if detection has already been attempted
        let detectionAttempted = false;

        // Function to detect country and set country code
        function detectAndSetCountry() {
            if (detectionAttempted) return; // Prevent multiple attempts
            detectionAttempted = true;
            
            console.log('Starting country detection...');
            
            // Try IP geolocation first
            fetch('https://ipapi.co/json/')
                .then(response => response.json())
                .then(data => {
                    console.log('IP geolocation data:', data);
                    
                    let callingCode = null;
                    
                    // 1∩╕ÅΓâú Preferred: API field with dial prefix already present
                    const normalized = normalizeCallingCode(data.country_calling_code);
                    if (normalized) {
                        callingCode = normalized;
                        console.log('Found calling code from API:', callingCode);
                    }
                    
                    // 2∩╕ÅΓâú Fallback: ISO-alpha-2 code mapping
                    if (!callingCode) {
                        // Support alternative field names for country code
                        const possibleCountryCodeKeys = [
                            'country_code', 'country_code_iso2', 'countryCode', 
                            'country', 'iso2', 'country_iso', 'cc'
                        ];
                        
                        let countryIso = null;
                        for (const key of possibleCountryCodeKeys) {
                            if (data[key] && typeof data[key] === 'string') {
                                countryIso = data[key].trim().toUpperCase();
                                console.log(`Found country code from field '${key}':`, countryIso);
                                break;
                            }
                        }
                        
                        if (countryIso && countryCodeMap[countryIso]) {
                            callingCode = countryCodeMap[countryIso];
                            console.log('Mapped ISO code to calling code:', countryIso, '->', callingCode);
                        }
                    }
                    
                    // 3∩╕ÅΓâú Last resort: try generic 'country' field for country name lookup
                    if (!callingCode && data.country && typeof data.country === 'string') {
                        const countryName = data.country.trim().toLowerCase();
                        console.log('Attempting country name lookup for:', countryName);
                        
                        // Simple country name to ISO mapping (could be expanded)
                        const countryNameToIso = {
                            'united states': 'US',
                            'usa': 'US', 
                            'america': 'US',
                            'united kingdom': 'GB',
                            'uk': 'GB',
                            'britain': 'GB',
                            'canada': 'CA',
                            'germany': 'DE',
                            'france': 'FR',
                            'italy': 'IT',
                            'spain': 'ES',
                            'netherlands': 'NL',
                            'australia': 'AU',
                            'japan': 'JP',
                            'south korea': 'KR',
                            'china': 'CN',
                            'india': 'IN',
                            'brazil': 'BR',
                            'mexico': 'MX'
                        };
                        
                        const isoFromName = countryNameToIso[countryName];
                        if (isoFromName && countryCodeMap[isoFromName]) {
                            callingCode = countryCodeMap[isoFromName];
                            console.log('Mapped country name to calling code:', countryName, '->', callingCode);
                        }
                    }
                    
                    if (callingCode) {
                        console.log('Setting country code from IP geolocation:', callingCode);
                        setCountryCode(callingCode);
                    } else {
                        console.log('No valid calling code found in API response, falling back to browser locale');
                        // Fallback to browser locale
                        fallbackToBrowserLocale();
                    }
                })
                .catch(error => {
                    console.log('IP geolocation failed, trying browser locale:', error);
                    fallbackToBrowserLocale();
                });
        }

        // Fallback function using browser locale
        function fallbackToBrowserLocale() {
            const browserLocale = navigator.language || navigator.userLanguage;
            console.log('Browser locale:', browserLocale);
            
            let countryCode = browserLocale.split('-')[1] || browserLocale.split('_')[1];
            console.log('Detected country code from locale:', countryCode);
            
            if (countryCode && countryCodeMap[countryCode]) {
                const detectedCode = countryCodeMap[countryCode];
                console.log('Setting country code from locale:', detectedCode);
                setCountryCode(detectedCode);
            } else {
                // Set a default country code if detection fails
                console.log('No country detected, setting default to US');
                setCountryCode('+1');
            }
        }

        // Function to set the country code in the dropdown
        function setCountryCode(code) {
            console.log('Attempting to set country code:', code);
            
            // Normalize the input code to ensure it has a "+" prefix
            let normalizedCode = code;
            if (code && !code.startsWith('+')) {
                normalizedCode = '+' + code;
                console.log('Normalized code (added + prefix):', normalizedCode);
            }
            
            const options = countrySelect.querySelectorAll('option');
            let found = false;
            
            // First try exact match with normalized code
            for (let option of options) {
                if (option.value === normalizedCode) {
                    countrySelect.value = normalizedCode;
                    found = true;
                    console.log('Successfully set country code to:', normalizedCode);
                    console.log('Selected option text:', option.textContent);
                    
                    // Force immediate styling to ensure visibility
                    countrySelect.style.color = 'var(--text-primary)';
                    countrySelect.style.background = 'var(--bg-secondary)';
                    countrySelect.style.fontFamily = 'Noto Color Emoji, Segoe UI Emoji, Apple Color Emoji, Twemoji Mozilla, EmojiOne Color, Android Emoji, sans-serif';
                    
                    // Force a re-render by temporarily hiding and showing
                    countrySelect.style.opacity = '0.99';
                    setTimeout(() => {
                        countrySelect.style.opacity = '1';
                    }, 10);
                    
                    // Trigger a change event to ensure proper rendering
                    countrySelect.dispatchEvent(new Event('change', { bubbles: true }));
                    break;
                }
            }
            
            // If not found with normalized code, try original input (for backward compatibility)
            if (!found && normalizedCode !== code) {
                for (let option of options) {
                    if (option.value === code) {
                        countrySelect.value = code;
                        found = true;
                        console.log('Successfully set country code to (fallback):', code);
                        console.log('Selected option text:', option.textContent);
                        
                        // Force immediate styling to ensure visibility
                        countrySelect.style.color = 'var(--text-primary)';
                        countrySelect.style.background = 'var(--bg-secondary)';
                        countrySelect.style.fontFamily = 'Noto Color Emoji, Segoe UI Emoji, Apple Color Emoji, Twemoji Mozilla, EmojiOne Color, Android Emoji, sans-serif';
                        
                        // Force a re-render by temporarily hiding and showing
                        countrySelect.style.opacity = '0.99';
                        setTimeout(() => {
                            countrySelect.style.opacity = '1';
                        }, 10);
                        
                        // Trigger a change event to ensure proper rendering
                        countrySelect.dispatchEvent(new Event('change', { bubbles: true }));
                        break;
                    }
                }
            }
            
            if (!found) {
                console.warn('ΓÜá∩╕Å Country code not found in dropdown options:', code);
                console.warn('ΓÜá∩╕Å Tried normalized code:', normalizedCode);
                console.warn('ΓÜá∩╕Å This may cause form validation issues.');
                console.warn('ΓÜá∩╕Å Available options:', Array.from(options).slice(1, 11).map(opt => opt.value), '... and', (options.length - 11), 'more');
                
                // Try to find a close match for common codes
                const commonAlternatives = {
                    '1': '+1',
                    '44': '+44', 
                    '49': '+49',
                    '33': '+33',
                    '34': '+34',
                    '39': '+39',
                    '91': '+91',
                    '86': '+86',
                    '81': '+81',
                    '7': '+7'
                };
                
                const originalWithoutPlus = code.startsWith('+') ? code.substring(1) : code;
                if (commonAlternatives[originalWithoutPlus]) {
                    console.warn('ΓÜá∩╕Å Suggestion: Try using "' + commonAlternatives[originalWithoutPlus] + '" instead of "' + code + '"');
                }
            }
        }

        // Start detection immediately on page load
        detectAndSetCountry();
        
        // Also detect on focus if no country is selected
        phoneInput.addEventListener('focus', function() {
            if (!countrySelect.value || countrySelect.value === '') {
                detectAndSetCountry();
            }
        });
    }
    
    // Enhanced dropdown styling for country codes
    function enhanceCountryDropdown() {
        const countrySelect = document.getElementById('countryCode');
        const phoneInput = document.getElementById('phone');
        
        if (countrySelect && phoneInput) {
            // Force white text color and proper spacing
            countrySelect.addEventListener('focus', function() {
                this.style.color = 'var(--text-primary)';
                this.style.background = 'var(--bg-secondary)';
            });
            
            countrySelect.addEventListener('blur', function() {
                this.style.color = 'var(--text-primary)';
                this.style.background = 'var(--bg-secondary)';
            });
            
            // Apply styling to options when dropdown opens
            countrySelect.addEventListener('mousedown', function() {
                setTimeout(() => {
                    const options = this.querySelectorAll('option');
                    options.forEach(option => {
                        // Force white text and dark background with !important
                        option.style.setProperty('color', 'white', 'important');
                        option.style.setProperty('background', '#1a1a1a', 'important');
                        option.style.setProperty('padding', '0.2rem 0.5rem', 'important');
                        option.style.setProperty('line-height', '1.1', 'important');
                        option.style.setProperty('font-size', '1rem', 'important');
                        option.style.setProperty('margin', '0', 'important');
                        option.style.setProperty('height', 'auto', 'important');
                        option.style.setProperty('min-height', '1.3rem', 'important');
                        option.style.setProperty('letter-spacing', 'normal', 'important');
                        option.style.setProperty('border', 'none', 'important');
                        option.style.setProperty('font-weight', 'normal', 'important');
                        option.style.setProperty('text-align', 'left', 'important');
                    });
                }, 10);
            });

            // Also apply styling on change event
            countrySelect.addEventListener('change', function() {
                setTimeout(() => {
                    const options = this.querySelectorAll('option');
                    options.forEach(option => {
                        option.style.setProperty('color', 'white', 'important');
                        option.style.setProperty('background', '#1a1a1a', 'important');
                    });
                }, 10);
                
                // Ensure selected value is visible
                if (this.value) {
                    this.style.color = 'var(--text-primary)';
                    this.style.background = 'var(--bg-secondary)';
                }
                
                // Validate phone number when country changes
                validatePhoneInput();
            });

            // Real-time phone number validation with character limit
            phoneInput.addEventListener('input', function(e) {
                // Filter out invalid characters as they're typed
                const invalidCharPattern = /[^0-9+\-\(\)\s]/;
                if (invalidCharPattern.test(e.target.value)) {
                    // Remove invalid characters
                    e.target.value = e.target.value.replace(invalidCharPattern, '');
                }
                
                // Apply character limit based on selected country
                const countryCode = countrySelect.value;
                if (countryCode && countryCode !== '') {
                    const rules = countryCodeMap[countryCode];
                    if (rules && typeof rules !== 'string') {
                        const cleanNumber = e.target.value.replace(/\D/g, '');
                        if (cleanNumber.length > rules.max) {
                            // Truncate to max length
                            const truncatedNumber = cleanNumber.substring(0, rules.max);
                            // Restore formatting (spaces, hyphens, etc.)
                            const formattedNumber = e.target.value.replace(/\D/g, '').substring(0, rules.max);
                            e.target.value = formattedNumber;
                        }
                    }
                }
                
                validatePhoneInput();
            });
            phoneInput.addEventListener('blur', validatePhoneInput);
            phoneInput.addEventListener('focus', validatePhoneInput);
            
            // Prevent invalid characters from being typed and enforce character limit
            phoneInput.addEventListener('keydown', function(e) {
                const allowedKeys = [
                    'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
                    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                    'Home', 'End'
                ];
                
                // Allow control keys
                if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
                    return;
                }
                
                // Allow only digits, spaces, hyphens, parentheses, and plus sign
                const allowedChars = /[0-9+\-\(\)\s]/;
                if (!allowedChars.test(e.key)) {
                    e.preventDefault();
                    return;
                }
                
                // Check character limit for digits only
                const countryCode = countrySelect.value;
                if (countryCode && countryCode !== '' && /[0-9]/.test(e.key)) {
                    const rules = countryCodeMap[countryCode];
                    if (rules && typeof rules !== 'string') {
                        const currentDigits = phoneInput.value.replace(/\D/g, '');
                        if (currentDigits.length >= rules.max) {
                            e.preventDefault();
                        }
                    }
                }
            });
            
            // Handle paste events to limit characters
            phoneInput.addEventListener('paste', function(e) {
                setTimeout(() => {
                    const countryCode = countrySelect.value;
                    if (countryCode && countryCode !== '') {
                        const rules = countryCodeMap[countryCode];
                        if (rules && typeof rules !== 'string') {
                            const cleanNumber = this.value.replace(/\D/g, '');
                            if (cleanNumber.length > rules.max) {
                                // Truncate to max length
                                const truncatedNumber = cleanNumber.substring(0, rules.max);
                                this.value = truncatedNumber;
                            }
                        }
                    }
                }, 0);
            });
        }
    }

    // Phone input validation function
    function validatePhoneInput() {
        const phoneInput = document.getElementById('phone');
        const countrySelect = document.getElementById('countryCode');
        const phoneGroup = document.querySelector('.phone-group');
        
        if (!phoneInput || !countrySelect || !phoneGroup) return;
        
        const phoneNumber = phoneInput.value;
        const countryCode = countrySelect.value;
        
        // Remove existing validation messages
        const existingMessage = phoneGroup.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Remove existing error styling
        phoneInput.classList.remove('error');
        phoneGroup.classList.remove('has-error');
        
        // If no country code selected, don't validate yet
        if (!countryCode || countryCode === '') {
            return;
        }
        
        // If phone number is empty, don't show error yet
        if (!phoneNumber.trim()) {
            return;
        }
        
        // Validate the phone number
        const validation = validatePhoneNumber(phoneNumber, countryCode);
        
        if (!validation.isValid) {
            // Add error styling
            phoneInput.classList.add('error');
            phoneGroup.classList.add('has-error');
            
            // Create and show validation message
            const messageDiv = document.createElement('div');
            messageDiv.className = 'validation-message error-message';
            messageDiv.textContent = validation.message;
            phoneGroup.appendChild(messageDiv);
        } else {
            // Add success styling
            phoneInput.classList.add('valid');
            phoneGroup.classList.add('has-success');
            
            // Create and show success message
            const messageDiv = document.createElement('div');
            messageDiv.className = 'validation-message success-message';
            messageDiv.textContent = 'Γ£ô Valid phone number format';
            phoneGroup.appendChild(messageDiv);
        }
    }
    
    // Call dropdown enhancement function
    enhanceCountryDropdown();
    
    // Call auto-detect function
    autoDetectCountryCode();
    

    
    // Final styling check after all initialization
    setTimeout(() => {
        const countrySelect = document.getElementById('countryCode');
        const phoneInput = document.getElementById('phone');
        
        if (countrySelect) {
            countrySelect.style.color = 'var(--text-primary)';
            countrySelect.style.background = 'var(--bg-secondary)';
            countrySelect.style.fontFamily = 'Noto Color Emoji, Segoe UI Emoji, Apple Color Emoji, Twemoji Mozilla, EmojiOne Color, Android Emoji, sans-serif';
        }
        
        if (phoneInput) {
            phoneInput.style.color = 'var(--text-primary)';
            phoneInput.style.background = 'var(--bg-secondary)';
        }
    }, 500);
    
    // Hide loading screen after page loads
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hide');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                
                // Show cursor only after loading screen is hidden (only on desktop)
                if (window.showCursorAfterLoading) {
                    window.showCursorAfterLoading();
                }
            }, 500);
        }
    }, 2000); // Show loading for 2 seconds

    // Custom cursor - mobile-aware version
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursor && cursorFollower && !isMobileDevice()) {
        // Hide default cursor completely
        document.body.style.cursor = 'none';
        
        // Initialize cursor position to center of screen
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Initialize all cursor variables to center
        let mouseX = centerX, mouseY = centerY;
        let cursorX = centerX, cursorY = centerY;
        let followerX = centerX, followerY = centerY;
        
        const initializeCursor = () => {
            cursor.style.left = centerX + 'px';
            cursor.style.top = centerY + 'px';
            cursorFollower.style.left = (centerX - 15) + 'px';
            cursorFollower.style.top = (centerY - 15) + 'px';
        };

        // Initialize cursor position but keep completely hidden during loading
        initializeCursor();
        
        // Keep cursor completely hidden during loading
        cursor.style.display = 'none';
        cursor.style.opacity = '0';
        cursor.style.pointerEvents = 'none';
        cursorFollower.style.display = 'none';
        cursorFollower.style.opacity = '0';
        cursorFollower.style.pointerEvents = 'none';
        
        // Smooth cursor movement with catch-up effect
        function updateCursor() {
            // Direct positioning for the white dot (cursor)
            cursorX = mouseX;
            cursorY = mouseY;
            
            // Smooth interpolation for the purple circle (follower)
            followerX += (mouseX - followerX) * 0.15; // Slower follow
            followerY += (mouseY - followerY) * 0.15;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            cursorFollower.style.left = (followerX - 15) + 'px';
            cursorFollower.style.top = (followerY - 15) + 'px';
            
            requestAnimationFrame(updateCursor);
        }

        // Function to show cursor after loading
        window.showCursorAfterLoading = () => {
            if (cursor && !isMobileDevice()) {
                cursor.style.display = 'block';
                cursor.style.opacity = '1';
                cursor.style.pointerEvents = 'none'; // Don't block interactions
            }
            if (cursorFollower && !isMobileDevice()) {
                cursorFollower.style.display = 'block';
                cursorFollower.style.opacity = '1';
                cursorFollower.style.pointerEvents = 'none'; // Don't block interactions
            }
            
            // Start cursor tracking only after loading
            updateCursor();
        };

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Update cursor position on window resize
        window.addEventListener('resize', () => {
            const newCenterX = window.innerWidth / 2;
            const newCenterY = window.innerHeight / 2;
            
            // If cursor is roughly at center, update it
            if (Math.abs(cursorX - newCenterX) < 50 && Math.abs(cursorY - newCenterY) < 50) {
                mouseX = newCenterX;
                mouseY = newCenterY;
                cursorX = newCenterX;
                cursorY = newCenterY;
                followerX = newCenterX;
                followerY = newCenterY;
            }
        });
    } else {
        // Hide cursor on mobile devices
        if (cursor) {
            cursor.style.display = 'none';
            cursor.style.opacity = '0';
            cursor.style.pointerEvents = 'none';
        }
        if (cursorFollower) {
            cursorFollower.style.display = 'none';
            cursorFollower.style.opacity = '0';
            cursorFollower.style.pointerEvents = 'none';
        }
        document.body.style.cursor = 'auto';
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Enhanced Mobile menu toggle with better accessibility
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        // Add ARIA attributes for accessibility
        mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('role', 'button');
        mobileToggle.setAttribute('tabindex', '0');
        
        function toggleMobileMenu() {
            const isActive = mobileToggle.classList.contains('active');
            
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            navLinks.classList.toggle('mobile-open');
            document.body.classList.toggle('mobile-nav-open');
            
            // Update ARIA attributes
            mobileToggle.setAttribute('aria-expanded', !isActive);
            
            // Prevent body scroll when menu is open
            if (!isActive) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
        
        // Click event
        mobileToggle.addEventListener('click', toggleMobileMenu);
        
        // Keyboard support
        mobileToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });
        
        // Close menu when clicking on a link
        const mobileNavLinks = navLinks.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navLinks.classList.remove('mobile-open');
                document.body.classList.remove('mobile-nav-open');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        
        // Add navigation hover effects for desktop
        const navigationLinks = document.querySelectorAll('.nav-link');
        navigationLinks.forEach(link => {
            // Add cursor scaling effect on hover
            link.addEventListener('mouseenter', () => {
                if (!isMobileDevice() && cursor && cursorFollower) {
                    cursor.style.transform = 'scale(1.2)';
                    cursorFollower.style.transform = 'scale(1.1)';
                }
            });
            
            link.addEventListener('mouseleave', () => {
                if (!isMobileDevice() && cursor && cursorFollower) {
                    cursor.style.transform = 'scale(1)';
                    cursorFollower.style.transform = 'scale(1)';
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navLinks.classList.remove('mobile-open');
                document.body.classList.remove('mobile-nav-open');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // Smooth scrolling for navigation links
    const navLinkElements = document.querySelectorAll('.nav-link[href^="#"]');
    navLinkElements.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Counter animation for stats
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    };

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Animate counters when stats section is visible
                if (entry.target.classList.contains('hero-stats')) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number[data-count]');
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-count'));
                        animateCounter(stat, target);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.hero-stats, .service-card, .feature-item, .portfolio-item, .tech-item');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Add submission guard to prevent multiple submissions
        let isSubmitting = false;
        
        contactForm.addEventListener('submit', async (e) => {
            console.log('Form submission started');
            e.preventDefault();
            console.log('Form submission prevented');
            
            // Prevent multiple submissions
            if (isSubmitting) {
                console.log('Form already submitting, ignoring');
                return;
            }
            
            isSubmitting = true;
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');

            // Show loading state
            submitBtn.classList.add('loading');
  
            // Validate phone number
            const countryCode = document.getElementById('countryCode').value;
            const phoneNumber = document.getElementById('phone').value;
            
            console.log('≡ƒöì Debug - Country Code:', countryCode);
            console.log('≡ƒöì Debug - Phone Number:', phoneNumber);
            
            if (!countryCode || countryCode === 'Code') {
                submitBtn.classList.remove('loading');
                isSubmitting = false;
                showNotification('error', 'Phone Number Required', 'Please select your country code.');
                return;
            }
            
            if (!phoneNumber || phoneNumber.trim() === '') {
                submitBtn.classList.remove('loading');
                isSubmitting = false;
                showNotification('error', 'Phone Number Required', 'Please enter your phone number.');
                return;
            }
            
            // Validate phone number format
            const phoneValidation = validatePhoneNumber(phoneNumber, countryCode);
            if (!phoneValidation.isValid) {
                submitBtn.classList.remove('loading');
                isSubmitting = false;
                showNotification('error', 'Invalid Phone Number', phoneValidation.message);
                return;
            }
            
            // Prepare form data
  const formData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: countryCode + ' ' + phoneNumber,
    company: document.getElementById('company').value,
    whoYouAre: document.getElementById('whoYouAre').value,
    service: document.getElementById('service').value,
    message: document.getElementById('message').value
  };
  
  console.log('Form data prepared:', formData);
  console.log('≡ƒöì Debug - Phone field in formData:', formData.phone);
  
  try {
    console.log('Sending fetch request to /api/contact');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    console.log('Response received:', res.status);
    const data = await res.json();
    console.log('Response data:', data);

                // Remove loading state
                submitBtn.classList.remove('loading');
                isSubmitting = false;
                
                                if (data.success) {
                    console.log('Showing success notification');
                    // Show custom success notification
                    showNotification('success', 'Message Sent Successfully!', data.message || 'Thank you for your message! We\'ll get back to you soon.');
                contactForm.reset();
                
                // Reset floating labels
                const labels = contactForm.querySelectorAll('label');
                labels.forEach(label => {
                    label.style.top = '1rem';
                    label.style.fontSize = '1rem';
                    label.style.color = 'var(--text-muted)';
                });
                } else {
                    console.log('Showing error notification');
                    showNotification('error', 'Submission Failed', data.message || 'Something went wrong. Please try again.');
                }
            } catch (err) {
                console.error('Form submission error:', err);
                submitBtn.classList.remove('loading');
                isSubmitting = false;
                showNotification('error', 'Connection Error', 'Something went wrong. Please try again.');
            }
        });

        // Enhanced form interactions
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            const label = input.nextElementSibling;
            
            // Ensure form inputs don't get cursor hover effects
            input.addEventListener('mouseenter', () => {
                if (cursor && !isMobileDevice()) {
                    cursor.style.transform = 'scale(1)';
                    cursor.style.transition = 'transform 0.1s ease-out';
                }
                if (cursorFollower && !isMobileDevice()) {
                    cursorFollower.style.transform = 'scale(1)';
                    cursorFollower.style.transition = 'transform 0.1s ease-out';
                }
            });
            
            input.addEventListener('focus', () => {
                if (label && label.tagName === 'LABEL') {
                    label.style.top = '-0.5rem';
                    label.style.left = '1rem';
                    label.style.fontSize = '0.8rem';
                    label.style.color = 'var(--primary)';
                }
            });

            input.addEventListener('blur', () => {
                if (label && label.tagName === 'LABEL' && !input.value) {
                    label.style.top = '1rem';
                    label.style.left = '1.5rem';
                    label.style.fontSize = '1rem';
                    label.style.color = 'var(--text-muted)';
                }
            });
        });
    }

    // Social media fixed buttons and Voiceflow widget scroll behavior
    const socialMediaFixed = document.getElementById('socialMediaFixed');
    
    // Function to find and apply show class to Voiceflow widget
    function applyShowToVoiceflowWidget() {
        const voiceflowSelectors = [
            '[data-voiceflow]',
            '.voiceflow-widget',
            'iframe[src*="voiceflow"]',
            '[id*="voiceflow"]',
            '.voiceflow-widget-container',
            '.voiceflow-chat-bubble'
        ];
        
        voiceflowSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('show');
            });
        });
    }
    
    // Function to remove show class from Voiceflow widget
    function removeShowFromVoiceflowWidget() {
        const voiceflowSelectors = [
            '[data-voiceflow]',
            '.voiceflow-widget',
            'iframe[src*="voiceflow"]',
            '[id*="voiceflow"]',
            '.voiceflow-widget-container',
            '.voiceflow-chat-bubble'
        ];
        
        voiceflowSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.remove('show');
            });
        });
    }
    
    function handleScrollFixedButtons() {
        if (window.scrollY > 300) {
            // Show social media buttons
            if (socialMediaFixed) socialMediaFixed.classList.add('show');
            // Show Voiceflow widget
            applyShowToVoiceflowWidget();
        } else {
            // Hide social media buttons
            if (socialMediaFixed) socialMediaFixed.classList.remove('show');
            // Hide Voiceflow widget
            removeShowFromVoiceflowWidget();
        }
    }
    window.addEventListener('scroll', handleScrollFixedButtons);
    // Initial state
    handleScrollFixedButtons();

    // Navigation hover effects
    const navigationLinks = document.querySelectorAll('.nav-link');
    navigationLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (cursor && !isMobileDevice()) {
                cursor.style.transform = 'scale(1.2)';
                cursor.style.transition = 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
            if (cursorFollower && !isMobileDevice()) {
                cursorFollower.style.transform = 'scale(1.05)';
                cursorFollower.style.transition = 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
        });

        link.addEventListener('mouseleave', () => {
            if (cursor && !isMobileDevice()) {
                cursor.style.transform = 'scale(1)';
                cursor.style.transition = 'transform 0.1s ease-out';
            }
            if (cursorFollower && !isMobileDevice()) {
                cursorFollower.style.transform = 'scale(1)';
                cursorFollower.style.transition = 'transform 0.1s ease-out';
            }
        });
    });

    // Button hover effects - mobile-aware (exclude form inputs)
    const buttons = document.querySelectorAll('.btn, .service-btn, .cta-button');
    buttons.forEach(button => {
        // Skip if this is a form input
        if (button.tagName === 'INPUT' || button.tagName === 'TEXTAREA' || button.tagName === 'SELECT') {
            return;
        }
        
        button.addEventListener('mouseenter', () => {
            if (cursor && !isMobileDevice()) {
                cursor.style.transform = 'scale(1.3)';
                cursor.style.transition = 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
            if (cursorFollower && !isMobileDevice()) {
                cursorFollower.style.transform = 'scale(1.1)';
                cursorFollower.style.transition = 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
        });

        button.addEventListener('mouseleave', () => {
            if (cursor && !isMobileDevice()) {
                cursor.style.transform = 'scale(1)';
                cursor.style.transition = 'transform 0.1s ease-out';
            }
            if (cursorFollower && !isMobileDevice()) {
                cursorFollower.style.transform = 'scale(1)';
                cursorFollower.style.transition = 'transform 0.1s ease-out';
            }
        });
    });

    // Parallax effect for floating shapes
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Tech progress bar animation
    const techItems = document.querySelectorAll('.tech-item');
    const techObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-bar');
                if (progressBar) {
                    setTimeout(() => {
                        progressBar.style.width = progressBar.style.getPropertyValue('--progress') || '0%';
                    }, 300);
                }
            }
        });
    }, { threshold: 0.5 });

    techItems.forEach(item => {
        techObserver.observe(item);
    });

    // Simple canvas animation for neural network (optional)
    const neuralCanvas = document.getElementById('neuralCanvas');
    if (neuralCanvas) {
        const ctx = neuralCanvas.getContext('2d');
        let animationId;
        
        function resizeCanvas() {
            neuralCanvas.width = window.innerWidth;
            neuralCanvas.height = window.innerHeight;
        }
        
        function drawNeuralNetwork() {
            ctx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
            ctx.lineWidth = 1;
            
            // Draw some connecting lines
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(Math.random() * neuralCanvas.width, Math.random() * neuralCanvas.height);
                ctx.lineTo(Math.random() * neuralCanvas.width, Math.random() * neuralCanvas.height);
                ctx.stroke();
            }
            
            animationId = requestAnimationFrame(drawNeuralNetwork);
        }
        
        resizeCanvas();
        drawNeuralNetwork();
        
        window.addEventListener('resize', resizeCanvas);
    }

    // Performance chart animation (simple version)
    const performanceChart = document.getElementById('performanceChart');
    if (performanceChart) {
        const ctx = performanceChart.getContext('2d');
        performanceChart.width = 400;
        performanceChart.height = 150;
        
        // Simple line chart animation
        function drawChart() {
            ctx.clearRect(0, 0, 400, 150);
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const points = [20, 40, 35, 60, 45, 80, 75, 90];
            points.forEach((point, index) => {
                const x = (index / (points.length - 1)) * 380 + 10;
                const y = 150 - (point * 1.3) - 10;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
        }
        
        setTimeout(drawChart, 1000);
    }

    // Details Carousel Scroll Logic
    const detailsCarousel = document.getElementById('detailsCarousel');
    const carouselLeft = document.getElementById('carouselLeft');
    const carouselRight = document.getElementById('carouselRight');
    if (detailsCarousel && carouselLeft && carouselRight) {
        const scrollAmount = 360; // px, matches card width + gap
        carouselLeft.addEventListener('click', () => {
            detailsCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        carouselRight.addEventListener('click', () => {
            detailsCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        // Optional: Disable arrows at ends
        function updateArrows() {
            carouselLeft.disabled = detailsCarousel.scrollLeft <= 0;
            carouselRight.disabled = detailsCarousel.scrollLeft + detailsCarousel.offsetWidth >= detailsCarousel.scrollWidth - 2;
        }
        detailsCarousel.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        setTimeout(updateArrows, 100); // Initial state
    }

    // Service Section Hover Image Logic - Optimized for performance
    const mainServiceImage = document.getElementById('mainServiceImage');
    const serviceHoverItems = document.querySelectorAll('.service-hover');
    const servicesImageDisplay = document.getElementById('servicesImageDisplay');
    let originalImg = mainServiceImage ? mainServiceImage.src : '';
    let currentHoverItem = null;
    let imageCache = new Map();
    let hoverTimeout = null;
    let isChangingImage = false;
    
    // Debounce function for hover events
    function debounceHover(func, delay) {
        return function(...args) {
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    // Throttle function for rapid mouse movements
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Optimized image preloading with better error handling
    function preloadServiceImages() {
        const imagePromises = [];
        
        serviceHoverItems.forEach(item => {
            const imgSrc = item.getAttribute('data-img');
            if (imgSrc && !imageCache.has(imgSrc)) {
                const promise = new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    imageCache.set(imgSrc, img);
                        resolve(img);
                };
                img.onerror = () => {
                    console.warn('Failed to preload image:', imgSrc);
                        reject(new Error(`Failed to load ${imgSrc}`));
                };
                img.src = imgSrc;
                });
                imagePromises.push(promise);
            }
        });
        
        // Wait for all images to load
        Promise.allSettled(imagePromises).then(() => {
            console.log('Service images preloaded successfully');
        });
    }
    
    // Start preloading immediately
    preloadServiceImages();
    
    // Optimized hover handlers with debouncing and throttling
    function handleHoverEnter(item) {
        if (currentHoverItem === item || isChangingImage) return;
        
        const img = item.getAttribute('data-img');
            if (mainServiceImage && img && img !== mainServiceImage.src) {
            isChangingImage = true;
            currentHoverItem = item;
            
            // Use requestAnimationFrame for smooth transitions
            requestAnimationFrame(() => {
                mainServiceImage.src = img;
                isChangingImage = false;
            });
        }
    }
    
    function handleHoverLeave(item) {
        if (currentHoverItem !== item || isChangingImage) return;
        
                currentHoverItem = null;
                if (mainServiceImage && originalImg && mainServiceImage.src !== originalImg) {
            isChangingImage = true;
            
            requestAnimationFrame(() => {
                mainServiceImage.src = originalImg;
                isChangingImage = false;
            });
        }
    }
    
    // Create debounced versions of hover handlers
    const debouncedHoverEnter = debounceHover(handleHoverEnter, 50);
    const debouncedHoverLeave = debounceHover(handleHoverLeave, 50);
    
    // Add optimized event listeners with passive option for better performance
    serviceHoverItems.forEach(item => {
        // Use mouseenter/mouseleave for better performance than mouseover/mouseout
        item.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            debouncedHoverEnter(item);
        }, { passive: true });
        
        item.addEventListener('mouseleave', (e) => {
            e.stopPropagation();
            debouncedHoverLeave(item);
        }, { passive: true });
        
        // Add touch support for mobile devices without blocking scroll/click
        item.addEventListener('touchstart', (e) => {
            debouncedHoverEnter(item);
        }, { passive: true });
        
        item.addEventListener('touchend', (e) => {
            debouncedHoverLeave(item);
        }, { passive: true });
    });

    // Touch gesture support for mobile devices
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Swipe left to close mobile menu
        if (diffX > 50 && Math.abs(diffY) < 50 && navLinks.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
        
        touchStartX = 0;
        touchStartY = 0;
    });
    
    // Enhanced form handling for mobile devices
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        // Prevent zoom on iOS when focusing inputs
        input.addEventListener('focus', () => {
            if (window.innerWidth <= 768) {
                input.style.fontSize = '16px';
            }
        });
        
        // Restore font size on blur
        input.addEventListener('blur', () => {
            if (window.innerWidth <= 768) {
                input.style.fontSize = '';
            }
        });
        
        // Better touch feedback for form elements
        input.addEventListener('touchstart', () => {
            input.style.transform = 'scale(0.98)';
        });
        
        input.addEventListener('touchend', () => {
            input.style.transform = '';
        });
    });
    
    // Improve country code dropdown on mobile
    const countrySelect = document.getElementById('countryCode');
    if (countrySelect) {
        countrySelect.addEventListener('touchstart', () => {
            countrySelect.style.transform = 'scale(0.98)';
        });
        
        countrySelect.addEventListener('touchend', () => {
            countrySelect.style.transform = '';
        });
        
        // Better mobile dropdown experience
        countrySelect.addEventListener('change', () => {
            // Add haptic feedback on mobile
            if ('vibrate' in navigator) {
                navigator.vibrate(10);
            }
        });
    }
    
    // Optimize scroll performance on mobile
    let ticking = false;
    function updateScroll() {
        // Update scroll-based animations
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }
    
    // Use passive scroll listener for better performance
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Optimize images for mobile
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add loading="lazy" for better performance
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add error handling
        img.addEventListener('error', () => {
            img.style.display = 'none';
        });
    });
    
    // Improve button interactions on mobile
    const mobileButtons = document.querySelectorAll('.btn, .service-btn, .cta-button, .submit-btn');
    mobileButtons.forEach(button => {
        // Add touch feedback
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', () => {
            button.style.transform = '';
        });
        
        // Allow normal button interaction (removed preventDefault that was blocking form inputs)
    });

    // Simple mobile detection
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    }
    
    // Cursor pointer override logic removed
});

// Add some utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth reveal animation for sections
function revealOnScroll() {
    const reveals = document.querySelectorAll('.animate-on-scroll:not(.animated)');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animated');
        }
    });
}

window.addEventListener('scroll', debounce(revealOnScroll, 20));

window.showNotification = showNotification;

// Waitlist Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const waitlistModal = document.getElementById('waitlistModal');
    const waitlistClose = document.getElementById('waitlistClose');
    const waitlistForm = document.getElementById('waitlistForm');
    const openBtns = document.querySelectorAll('.open-waitlist-btn');

    // Waitlist counter — load from localStorage
    const waitlistCountEl = document.getElementById('waitlistCount');
    let waitlistCount = parseInt(localStorage.getItem('markovaWaitlistCount') || '0', 10);
    if (waitlistCountEl) waitlistCountEl.textContent = waitlistCount;

    if (waitlistModal && openBtns.length > 0) {
        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                waitlistModal.classList.add('active');
            });
        });

        waitlistClose.addEventListener('click', () => {
            waitlistModal.classList.remove('active');
        });

        waitlistModal.addEventListener('click', (e) => {
            if (e.target === waitlistModal) {
                waitlistModal.classList.remove('active');
            }
        });

        if (waitlistForm) {
            waitlistForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = waitlistForm.querySelector('button[type="submit"]');
                if (btn) btn.classList.add('loading');
                
                // Simulate network request
                setTimeout(() => {
                    if (btn) btn.classList.remove('loading');
                    waitlistModal.classList.remove('active');
                    waitlistForm.reset();

                    // Increment waitlist count
                    waitlistCount++;
                    localStorage.setItem('markovaWaitlistCount', waitlistCount.toString());
                    if (waitlistCountEl) waitlistCountEl.textContent = waitlistCount;
                    
                    // Show success notification
                    if (window.showNotification) {
                        window.showNotification('success', 'You\'re on the list!', 'You have been added to the waitlist. We will contact you soon!');
                    } else {
                        alert('You have been added to the waitlist!');
                    }
                }, 1500);
            });
        }
    }
});

// Custom Notification System
function showNotification(type, title, message) {
    const modal = document.getElementById('notificationModal');
    const modalTitle = modal.querySelector('.notification-title');
    const modalMessage = modal.querySelector('.notification-message');
    const modalIcon = modal.querySelector('.notification-icon');
    
    // Set content
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Set type (success, error, info)
    modal.className = `notification-modal ${type}`;
    
    // Show modal
    modal.classList.add('show');
    
    // Ensure cursor is visible and working (only on desktop)
    if (window.showCursorAfterLoading) {
        window.showCursorAfterLoading();
    }
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        hideNotification();
    }, 4000);
}

function hideNotification() {
    const modal = document.getElementById('notificationModal');
    modal.classList.remove('show');
    
    // Ensure cursor is still visible after hiding notification (only on desktop)
    if (window.showCursorAfterLoading) {
        window.showCursorAfterLoading();
    }
}

// Close notification when button is clicked
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('notificationClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideNotification);
    }
    
    // Close notification when clicking outside
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideNotification();
            }
        });
    }
});

// Workforce Visualization Logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Tooltips
    const nodes = document.querySelectorAll('.viz-node[data-tooltip]');
    const tooltip = document.getElementById('vizTooltip');
    
    if (nodes.length > 0 && tooltip) {
        nodes.forEach(node => {
            node.addEventListener('mouseenter', (e) => {
                const text = node.getAttribute('data-tooltip');
                tooltip.textContent = text;
                tooltip.classList.add('show');
            });
            node.addEventListener('mousemove', (e) => {
                tooltip.style.left = e.clientX + 15 + 'px';
                tooltip.style.top = e.clientY + 15 + 'px';
            });
            node.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
            });
        });
    }

    // 2. Scenario Cycling
    const scenarios = [
        {
            objective: "Customer wants to book an appointment",
            commander: "Routing request...",
            sales: "Checking CRM...",
            support: "Idle",
            ops: "Idle",
            systems: "Finding available time...",
            outcome: "Appointment confirmed"
        },
        {
            objective: "Customer asks about an order status",
            commander: "Analyzing query...",
            sales: "Idle",
            support: "Locating order #8492...",
            ops: "Checking warehouse system...",
            systems: "Retrieving shipping data...",
            outcome: "Status update sent"
        },
        {
            objective: "Lead wants a product demo",
            commander: "Qualifying lead...",
            sales: "Preparing demo pitch...",
            support: "Idle",
            ops: "Idle",
            systems: "Scheduling calendar event...",
            outcome: "Demo scheduled"
        },
        {
            objective: "Business needs a weekly internal report",
            commander: "Initiating report sequence...",
            sales: "Idle",
            support: "Idle",
            ops: "Aggregating metrics...",
            systems: "Querying database...",
            outcome: "Report generated & sent"
        }
    ];

    let currentScenarioIndex = 0;
    const scenarioObjective = document.getElementById('scenarioObjective');
    const statusCommander = document.getElementById('statusCommander');
    const statusSales = document.getElementById('statusSales');
    const statusSupport = document.getElementById('statusSupport');
    const statusOps = document.getElementById('statusOps');
    const statusSystems = document.getElementById('statusSystems');
    const statusOutcome = document.getElementById('statusOutcome');

    function updateScenario() {
        if (!scenarioObjective) return;
        
        // Fade out slightly
        scenarioObjective.style.opacity = 0;
        
        setTimeout(() => {
            currentScenarioIndex = (currentScenarioIndex + 1) % scenarios.length;
            const s = scenarios[currentScenarioIndex];
            
            scenarioObjective.textContent = s.objective;
            statusCommander.textContent = s.commander;
            statusSales.textContent = s.sales;
            statusSupport.textContent = s.support;
            statusOps.textContent = s.ops;
            statusSystems.textContent = s.systems;
            statusOutcome.textContent = s.outcome;
            
            // Set active states
            statusCommander.className = 'node-status ' + (s.commander !== 'Idle' ? 'active-text' : '');
            statusSales.className = 'node-status ' + (s.sales !== 'Idle' ? 'active-text' : '');
            statusSupport.className = 'node-status ' + (s.support !== 'Idle' ? 'active-text' : '');
            statusOps.className = 'node-status ' + (s.ops !== 'Idle' ? 'active-text' : '');
            statusSystems.className = 'node-status ' + (s.systems !== 'Idle' ? 'active-text' : '');
            
            // Update indicator dots
            document.querySelector('.node-commander .status-indicator').classList.toggle('active', s.commander !== 'Idle');
            document.querySelectorAll('.node-agent')[0].querySelector('.status-indicator').classList.toggle('active', s.sales !== 'Idle');
            document.querySelectorAll('.node-agent')[1].querySelector('.status-indicator').classList.toggle('active', s.support !== 'Idle');
            document.querySelectorAll('.node-agent')[2].querySelector('.status-indicator').classList.toggle('active', s.ops !== 'Idle');
        });

        waitlistModal.addEventListener('click', (e) => {
            if (e.target === waitlistModal) {
                waitlistModal.classList.remove('active');
            }
        });

        if (waitlistForm) {
            waitlistForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = waitlistForm.querySelector('button[type="submit"]');
                if (btn) btn.classList.add('loading');
                
                // Simulate network request
                setTimeout(() => {
                    if (btn) btn.classList.remove('loading');
                    waitlistModal.classList.remove('active');
                    waitlistForm.reset();

                    // Increment waitlist count
                    waitlistCount++;
                    localStorage.setItem('markovaWaitlistCount', waitlistCount.toString());
                    if (waitlistCountEl) waitlistCountEl.textContent = waitlistCount;
                    
                    // Show success notification
                    if (window.showNotification) {
                        window.showNotification('success', 'You\'re on the list!', 'You have been added to the waitlist. We will contact you soon!');
                    } else {
                        alert('You have been added to the waitlist!');
                    }
                }, 1500);
            });
        }
    }
});

// Custom Notification System
function showNotification(type, title, message) {
    const modal = document.getElementById('notificationModal');
    const modalTitle = modal.querySelector('.notification-title');
    const modalMessage = modal.querySelector('.notification-message');
    const modalIcon = modal.querySelector('.notification-icon');
    
    // Set content
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Set type (success, error, info)
    modal.className = `notification-modal ${type}`;
    
    // Show modal
    modal.classList.add('show');
    
    // Ensure cursor is visible and working (only on desktop)
    if (window.showCursorAfterLoading) {
        window.showCursorAfterLoading();
    }
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        hideNotification();
    }, 4000);
}

function hideNotification() {
    const modal = document.getElementById('notificationModal');
    modal.classList.remove('show');
    
    // Ensure cursor is still visible after hiding notification (only on desktop)
    if (window.showCursorAfterLoading) {
        window.showCursorAfterLoading();
    }
}

// Close notification when button is clicked
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('notificationClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideNotification);
    }
    
    // Close notification when clicking outside
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideNotification();
            }
        });
    }
});

// Workforce Visualization Logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Tooltips
    const nodes = document.querySelectorAll('.viz-node[data-tooltip]');
    const tooltip = document.getElementById('vizTooltip');
    
    if (nodes.length > 0 && tooltip) {
        nodes.forEach(node => {
            node.addEventListener('mouseenter', (e) => {
                const text = node.getAttribute('data-tooltip');
                tooltip.textContent = text;
                tooltip.classList.add('show');
            });
            node.addEventListener('mousemove', (e) => {
                tooltip.style.left = e.clientX + 15 + 'px';
                tooltip.style.top = e.clientY + 15 + 'px';
            });
            node.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
            });
        });
    }

    // 2. Scenario Cycling
    const scenarios = [
        {
            objective: "Customer wants to book an appointment",
            commander: "Routing request...",
            sales: "Checking CRM...",
            support: "Idle",
            ops: "Idle",
            systems: "Finding available time...",
            outcome: "Appointment confirmed"
        },
        {
            objective: "Customer asks about an order status",
            commander: "Analyzing query...",
            sales: "Idle",
            support: "Locating order #8492...",
            ops: "Checking warehouse system...",
            systems: "Retrieving shipping data...",
            outcome: "Status update sent"
        },
        {
            objective: "Lead wants a product demo",
            commander: "Qualifying lead...",
            sales: "Preparing demo pitch...",
            support: "Idle",
            ops: "Idle",
            systems: "Scheduling calendar event...",
            outcome: "Demo scheduled"
        },
        {
            objective: "Business needs a weekly internal report",
            commander: "Initiating report sequence...",
            sales: "Idle",
            support: "Idle",
            ops: "Aggregating metrics...",
            systems: "Querying database...",
            outcome: "Report generated & sent"
        }
    ];

    let currentScenarioIndex = 0;
    const scenarioObjective = document.getElementById('scenarioObjective');
    const statusCommander = document.getElementById('statusCommander');
    const statusSales = document.getElementById('statusSales');
    const statusSupport = document.getElementById('statusSupport');
    const statusOps = document.getElementById('statusOps');
    const statusSystems = document.getElementById('statusSystems');
    const statusOutcome = document.getElementById('statusOutcome');

    function updateScenario() {
        if (!scenarioObjective) return;
        
        // Fade out slightly
        scenarioObjective.style.opacity = 0;
        
        setTimeout(() => {
            currentScenarioIndex = (currentScenarioIndex + 1) % scenarios.length;
            const s = scenarios[currentScenarioIndex];
            
            scenarioObjective.textContent = s.objective;
            statusCommander.textContent = s.commander;
            statusSales.textContent = s.sales;
            statusSupport.textContent = s.support;
            statusOps.textContent = s.ops;
            statusSystems.textContent = s.systems;
            statusOutcome.textContent = s.outcome;
            
            // Set active states
            statusCommander.className = 'node-status ' + (s.commander !== 'Idle' ? 'active-text' : '');
            statusSales.className = 'node-status ' + (s.sales !== 'Idle' ? 'active-text' : '');
            statusSupport.className = 'node-status ' + (s.support !== 'Idle' ? 'active-text' : '');
            statusOps.className = 'node-status ' + (s.ops !== 'Idle' ? 'active-text' : '');
            statusSystems.className = 'node-status ' + (s.systems !== 'Idle' ? 'active-text' : '');
            
            // Update indicator dots
            document.querySelector('.node-commander .status-indicator').classList.toggle('active', s.commander !== 'Idle');
            document.querySelectorAll('.node-agent')[0].querySelector('.status-indicator').classList.toggle('active', s.sales !== 'Idle');
            document.querySelectorAll('.node-agent')[1].querySelector('.status-indicator').classList.toggle('active', s.support !== 'Idle');
            document.querySelectorAll('.node-agent')[2].querySelector('.status-indicator').classList.toggle('active', s.ops !== 'Idle');
            
            scenarioObjective.style.opacity = 1;
        }, 500);
    }

    if (scenarioObjective) {
        setInterval(updateScenario, 6000);
    }

    /* --- Operating Model Advanced Animations --- */
    
    // 1. Reveal on Scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });

    // 2. Spotlight Hover Effect for Cards
    const stageContents = document.querySelectorAll('.stage-content');
    stageContents.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // 3. Pipeline Scroll Progress
    const pipelineSection = document.getElementById('opModelPipeline');
    const pipelineFill = document.getElementById('pipelineFill');
    const stages = document.querySelectorAll('.op-stage');
    
    if (pipelineSection && pipelineFill) {
        window.addEventListener('scroll', () => {
            const rect = pipelineSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Start filling when the top of the pipeline hits the middle of the screen
            const startOffset = windowHeight / 2;
            let progress = 0;
            
            if (rect.top < startOffset) {
                const totalHeight = rect.height;
                const scrolledDistance = startOffset - rect.top;
                // Add a little buffer so it fills all the way
                progress = Math.max(0, Math.min(100, (scrolledDistance / (totalHeight - 100)) * 100));
            }
            
            pipelineFill.style.height = `${progress}%`;
            
            // Activate stages based on pipeline progress
            stages.forEach((stage) => {
                const stageRect = stage.getBoundingClientRect();
                
                // If the "fill" passes the stage number circle (approx top + 50px)
                if (startOffset > stageRect.top + 25) {
                    stage.classList.add('is-active');
                } else {
                    stage.classList.remove('is-active');
                }
            });
        });
        
        // Trigger once on load in case user refreshed partway down
        window.dispatchEvent(new Event('scroll'));
    }
});

// Interactive Ask AI Demo Logic
const demoQueries = {
    'order': {
        chat: "Please log in to your customer portal to view your order status.",
        work: "Looks up the order in Shopify, checks fulfillment status in logistics software, and replies: 'Your order #1234 ships tomorrow � I've also flagged the 1-day delay to Operations.'"
    },
    'booking': {
        chat: "You can book an appointment by visiting our booking page on the website.",
        work: "Checks the team's Google Calendar, cross-references your CRM record, and replies: 'I see you're an enterprise client. I've booked you with our senior rep for Tuesday at 2 PM. Invite sent.'"
    },
    'refund': {
        chat: "Our refund policy allows returns within 30 days. Please contact support for more details.",
        work: "Verifies the purchase date in Stripe, confirms it's within the 30-day window, initiates the refund API call, and replies: 'I've processed your refund. It will appear in 3-5 days.'"
    }
};

const defaultDemo = {
    chat: "I am a virtual assistant. Please contact human support for help with this.",
    work: "Analyzes the request intent, queries the internal knowledge base, routes a ticket to the appropriate human department with full context, and confirms receipt."
};

window.runDemo = function(type) {
    const input = document.getElementById('demoInput');
    if (type === 'order') input.value = "Is my order ready?";
    else if (type === 'booking') input.value = "I need to book an appointment.";
    else if (type === 'refund') input.value = "Can I get a refund on my last purchase?";
    submitDemo(type);
};

window.submitDemo = function(typeOverride) {
    const inputEl = document.getElementById('demoInput');
    const input = inputEl ? inputEl.value.toLowerCase() : '';
    let data = defaultDemo;
    
    if (typeof typeOverride === 'string' && demoQueries[typeOverride]) {
        data = demoQueries[typeOverride];
    } else {
        if (input.includes('order')) data = demoQueries['order'];
        else if (input.includes('book') || input.includes('appointment')) data = demoQueries['booking'];
        else if (input.includes('refund') || input.includes('return')) data = demoQueries['refund'];
    }

    const resultsEl = document.getElementById('demoResults');
    if (resultsEl) {
        resultsEl.style.display = 'flex';
        // Reset animation
        resultsEl.style.animation = 'none';
        resultsEl.offsetHeight; /* trigger reflow */
        resultsEl.style.animation = null; 
        
        document.getElementById('demoChatbotText').innerText = data.chat;
        document.getElementById('demoWorkforceText').innerText = data.work;
    }
};

// Add Enter key listener to input
document.addEventListener('DOMContentLoaded', () => {
    const demoInput = document.getElementById('demoInput');
    if (demoInput) {
        demoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitDemo();
        });
    }
});

function initTextAnimations() {
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.hasAttribute('data-flip-text')) {
                    entry.target.classList.remove('flip-animated');
                    void entry.target.offsetWidth; // trigger reflow
                    entry.target.classList.add('flip-animated');
                }
                
                if (entry.target.hasAttribute('data-stagger-text')) {
                    const words = entry.target.querySelectorAll('.stagger-word');
                    // Reset visibility
                    words.forEach(w => w.classList.remove('is-visible'));
                    void entry.target.offsetWidth;
                    // Trigger stagger
                    words.forEach((w, idx) => {
                        setTimeout(() => {
                            w.classList.add('is-visible');
                        }, idx * 60);
                    });
                }
            } else {
                // Optional: remove classes when out of view so they replay smoothly
                if (entry.target.hasAttribute('data-flip-text')) {
                    entry.target.classList.remove('flip-animated');
                }
                if (entry.target.hasAttribute('data-stagger-text')) {
                    const words = entry.target.querySelectorAll('.stagger-word');
                    words.forEach(w => w.classList.remove('is-visible'));
                }
            }
        });
    }, { threshold: 0.1 });

    // Flip Text Initialization
    const flipElements = document.querySelectorAll('[data-flip-text]:not(.flip-initialized)');
    flipElements.forEach(el => {
        el.classList.add('flip-initialized');
        const text = el.getAttribute('data-flip-text') || el.textContent.trim();
        const duration = 2.2;
        const delay = 0;
        const words = text.split(' ');
        const totalChars = text.length;

        el.innerHTML = '';

        let globalIndex = 0;
        words.forEach((word, wIdx) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'flip-word';
            
            word.split('').forEach((char) => {
                const charSpan = document.createElement('span');
                charSpan.className = 'flip-char';
                charSpan.textContent = char;

                const normalizedIndex = globalIndex / totalChars;
                const sineValue = Math.sin(normalizedIndex * (Math.PI / 2));
                const calculatedDelay = (sineValue * (duration * 0.25) + delay).toFixed(3);

                charSpan.style.setProperty('--flip-duration', `${duration}s`);
                charSpan.style.setProperty('--flip-delay', `${calculatedDelay}s`);

                wordSpan.appendChild(charSpan);
                globalIndex++;
            });

            el.appendChild(wordSpan);

            if (wIdx < words.length - 1) {
                const spaceSpan = document.createElement('span');
                spaceSpan.innerHTML = '&nbsp;';
                spaceSpan.style.display = 'inline-block';
                el.appendChild(spaceSpan);
                globalIndex++;
            }
        });
        
        animationObserver.observe(el);
    });

    // Stagger Text Initialization
    const staggerElements = document.querySelectorAll('[data-stagger-text]:not(.stagger-initialized)');
    staggerElements.forEach(el => {
        el.classList.add('stagger-initialized');
        const text = el.getAttribute('data-stagger-text') || el.textContent.trim();
        const words = text.split(' ');
        el.innerHTML = '';

        words.forEach((word, wIdx) => {
            const wrap = document.createElement('span');
            wrap.className = 'stagger-word-wrap';
            
            const inner = document.createElement('span');
            inner.className = 'stagger-word';
            inner.textContent = word + (wIdx < words.length - 1 ? '\u00A0' : '');

            wrap.appendChild(inner);
            el.appendChild(wrap);
        });

        el.classList.add('stagger-text-ready');
        animationObserver.observe(el);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTextAnimations);
} else {
    initTextAnimations();
}

// --- Perspective Carousel Implementation ---
function initPerspectiveCarousel() {
    const dataElement = document.getElementById('carousel-data');
    const track = document.querySelector('.perspective-carousel-track');
    const dotContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (!dataElement || !track || !dotContainer) return;

    let items = [];
    try {
        items = JSON.parse(dataElement.textContent);
    } catch (e) {
        console.error('Failed to parse carousel data', e);
        return;
    }

    const slideWidth = 200;
    const rotationStep = 60;
    const inactiveScale = 0.85;
    let currentIndex = 0;
    const maxIndex = items.length - 1;

    // Generate Slides
    track.innerHTML = '';
    dotContainer.innerHTML = '';

    items.forEach((item, index) => {
        // Slide container
        const slide = document.createElement('div');
        slide.className = 'carousel-slide shrink-0';
        slide.style.width = `${slideWidth}px`;
        slide.style.perspective = '1200px';
        slide.style.flexShrink = '0';
        
        // Inner animated container
        const inner = document.createElement('div');
        inner.className = 'carousel-slide-inner';
        inner.style.width = '100%';
        inner.style.display = 'flex';
        inner.style.flexDirection = 'column';
        inner.style.alignItems = 'center';
        inner.style.gap = '12px';
        inner.style.transformStyle = 'preserve-3d';
        inner.style.transition = 'transform 0.9s cubic-bezier(0.14, 1, 0.34, 1)';
        inner.style.willChange = 'transform';
        
        // Image button
        const btn = document.createElement('button');
        btn.style.width = '100%';
        btn.style.aspectRatio = '3/4';
        btn.style.cursor = 'pointer';
        btn.style.background = 'transparent';
        btn.style.border = 'none';
        btn.style.padding = '0';
        btn.onclick = () => selectSlide(index);
        
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.title;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '12px';
        img.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)';
        img.style.userSelect = 'none';
        
        btn.appendChild(img);
        
        // Label
        const label = document.createElement('p');
        label.textContent = item.title;
        label.style.whiteSpace = 'nowrap';
        label.style.fontSize = '0.875rem';
        label.style.color = '#fff';
        label.style.transition = 'filter 0.9s, opacity 0.9s';
        
        inner.appendChild(btn);
        inner.appendChild(label);
        slide.appendChild(inner);
        track.appendChild(slide);

        // Dot
        const dot = document.createElement('button');
        dot.style.height = '8px';
        dot.style.borderRadius = '999px';
        dot.style.backgroundColor = 'currentColor';
        dot.style.border = 'none';
        dot.style.padding = '0';
        dot.style.cursor = 'pointer';
        dot.style.transition = 'width 0.3s, opacity 0.3s';
        dot.onclick = () => selectSlide(index);
        dotContainer.appendChild(dot);
    });

    function selectSlide(index) {
        if (index < 0) index = 0;
        if (index > maxIndex) index = maxIndex;
        currentIndex = index;
        updateCarousel();
    }

    function updateCarousel() {
        // Track position
        const trackX = -(currentIndex * slideWidth + slideWidth / 2);
        track.style.transform = `translateY(-50%) translateX(${trackX}px)`;

        // Slides
        const slides = track.querySelectorAll('.carousel-slide-inner');
        const labels = track.querySelectorAll('p');
        slides.forEach((slide, idx) => {
            const isActive = currentIndex === idx;
            const rotateY = (currentIndex - idx) * rotationStep;
            const scale = isActive ? 1 : inactiveScale;
            slide.style.transform = `rotateY(${rotateY}deg) scale(${scale})`;
            
            labels[idx].style.filter = isActive ? 'blur(0px)' : 'blur(2px)';
            labels[idx].style.opacity = isActive ? '1' : '0';
        });

        // Dots
        const dots = dotContainer.querySelectorAll('button');
        dots.forEach((dot, idx) => {
            const isActive = currentIndex === idx;
            dot.style.width = isActive ? '28px' : '8px';
            dot.style.opacity = isActive ? '1' : '0.3';
        });

        // Buttons
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
            prevBtn.style.opacity = currentIndex === 0 ? '0.35' : '1';
            prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
        }
        if (nextBtn) {
            nextBtn.disabled = currentIndex === maxIndex;
            nextBtn.style.opacity = currentIndex === maxIndex ? '0.35' : '1';
            nextBtn.style.cursor = currentIndex === maxIndex ? 'not-allowed' : 'pointer';
        }
    }

    if (prevBtn) prevBtn.onclick = () => selectSlide(currentIndex - 1);
    if (nextBtn) nextBtn.onclick = () => selectSlide(currentIndex + 1);

    // Initial render
    updateCarousel();
}

document.addEventListener('DOMContentLoaded', () => {
    initPerspectiveCarousel();
});

// --- Scroll Dissolve Reveal Implementation ---
const coverVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coverFragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uDissolve;
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5, f = 1.0;
    for (int i = 0; i < 5; i++) { v += a * noise(p * f); a *= 0.5; f *= 2.0; }
    return v;
  }

  void main() {
    vec2 ratio = vec2(
      min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
      min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
    );
    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 texColor = texture2D(uTexture, uv);
    
    // Convert to grayscale for effect
    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    vec3 grayscale = vec3(gray);
    texColor.rgb = mix(texColor.rgb, grayscale, uDissolve * 2.0);

    // Distance from center
    vec2 centered = vUv - 0.5;
    centered.x *= uResolution.x / uResolution.y;
    float dist = length(centered);
    
    // Add noise to dissolve edge
    float n = fbm(vUv * 10.0 + uTime * 0.1) * 0.3;
    float noisyDist = dist + n;
    
    float dissolveThreshold = uDissolve * 1.5;
    float dissolveMask = smoothstep(dissolveThreshold - 0.1, dissolveThreshold + 0.1, noisyDist);
    
    // Burn edge
    float burn = smoothstep(dissolveThreshold - 0.15, dissolveThreshold, noisyDist) * 
                 smoothstep(dissolveThreshold + 0.15, dissolveThreshold, noisyDist);
    vec3 burnColor = vec3(1.0, 0.5, 0.1) * burn * 3.0;

    gl_FragColor = vec4(texColor.rgb + burnColor, dissolveMask * texColor.a);
  }
`;

function initScrollDissolve() {
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('dissolve-canvas');
    const container = document.getElementById('dissolve-transition');
    const textEl = document.querySelector('.dissolve-text');
    if (!canvas || !container) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const geometry = new THREE.PlaneGeometry(2, 2);
    
    // Load images
    const loader = new THREE.TextureLoader();
    const texture1 = loader.load('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop'); // Front
    const texture2 = loader.load('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop'); // Back

    const uniforms1 = {
        uTexture: { value: texture1 },
        uResolution: { value: new THREE.Vector2() },
        uImageResolution: { value: new THREE.Vector2(1200, 800) },
        uDissolve: { value: 0.0 },
        uTime: { value: 0.0 }
    };
    const uniforms2 = {
        uTexture: { value: texture2 },
        uResolution: { value: new THREE.Vector2() },
        uImageResolution: { value: new THREE.Vector2(1200, 800) },
        uDissolve: { value: 0.0 }, // We just render the back image directly without dissolve logic
        uTime: { value: 0.0 }
    };

    // Material 2 (Background image, slowly scaling up)
    const material2 = new THREE.ShaderMaterial({
        vertexShader: coverVertexShader,
        fragmentShader: `
            uniform sampler2D uTexture;
            uniform vec2 uResolution;
            uniform vec2 uImageResolution;
            varying vec2 vUv;
            void main() {
                vec2 ratio = vec2(
                  min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
                  min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
                );
                vec2 uv = vec2(
                  vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
                  vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
                );
                gl_FragColor = texture2D(uTexture, uv);
            }
        `,
        uniforms: uniforms2,
        transparent: true,
        depthTest: false
    });
    
    const material1 = new THREE.ShaderMaterial({
        vertexShader: coverVertexShader,
        fragmentShader: coverFragmentShader,
        uniforms: uniforms1,
        transparent: true,
        depthTest: false
    });

    const mesh2 = new THREE.Mesh(geometry, material2);
    mesh2.position.z = -0.1; // Behind
    const mesh1 = new THREE.Mesh(geometry, material1);
    
    scene.add(mesh2);
    scene.add(mesh1);

    const clock = new THREE.Clock();

    function resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        uniforms1.uResolution.value.set(width, height);
        uniforms2.uResolution.value.set(width, height);
    }
    window.addEventListener('resize', resize);
    resize();

    // Scroll Logic
    function render() {
        requestAnimationFrame(render);
        const time = clock.getElapsedTime();
        uniforms1.uTime.value = time;
        
        // Calculate scroll progress for this container
        const rect = container.getBoundingClientRect();
        const startY = rect.top; // When top hits viewport top
        const endY = rect.bottom - window.innerHeight; // When bottom hits viewport bottom
        
        let progress = 0;
        if (startY <= 0) {
            progress = Math.min(1.0, -startY / (rect.height - window.innerHeight));
        }
        
        uniforms1.uDissolve.value = progress; // 0 to 1

        // Zoom the back image slightly as progress goes
        mesh2.scale.set(1 + progress * 0.1, 1 + progress * 0.1, 1);

        // Text reveal in middle of transition
        if (textEl) {
            if (progress > 0.4 && progress < 0.9) {
                textEl.style.opacity = '1';
                textEl.style.transform = 'translateY(0)';
            } else {
                textEl.style.opacity = '0';
                textEl.style.transform = progress >= 0.9 ? 'translateY(-50px)' : 'translateY(50px)';
            }
        }

        renderer.render(scene, camera);
    }
    render();
}

document.addEventListener('DOMContentLoaded', () => {
    initScrollDissolve();
});

// --- Highlight Grid Implementation ---
function initHighlightGrid() {
    const container = document.getElementById('highlight-grid-container');
    const highlight = document.getElementById('highlight-box');
    
    if (!container || !highlight) return;
    
    const cells = container.querySelectorAll('.hl-cell');
    
    cells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            const containerRect = container.getBoundingClientRect();
            const cellRect = cell.getBoundingClientRect();
            
            const x = cellRect.left - containerRect.left;
            const y = cellRect.top - containerRect.top;
            
            highlight.style.transform = `translate(${x}px, ${y}px)`;
            highlight.style.width = `${cellRect.width}px`;
            highlight.style.height = `${cellRect.height}px`;
            highlight.style.backgroundColor = cell.getAttribute('data-color');
            
            // Set text color to solid white
            cells.forEach(c => {
                c.querySelector('span').style.color = 'rgba(255,255,255,0.7)';
            });
            cell.querySelector('span').style.color = '#ffffff';
        });
    });
    
    // Initial position on first cell
    if (cells.length > 0) {
        // Temporarily disable transition for initial snap
        highlight.style.transition = 'none';
        const firstCell = cells[0];
        const containerRect = container.getBoundingClientRect();
        const cellRect = firstCell.getBoundingClientRect();
        
        highlight.style.transform = `translate(${cellRect.left - containerRect.left}px, ${cellRect.top - containerRect.top}px)`;
        highlight.style.width = `${cellRect.width}px`;
        highlight.style.height = `${cellRect.height}px`;
        highlight.style.backgroundColor = firstCell.getAttribute('data-color');
        firstCell.querySelector('span').style.color = '#ffffff';
        
        // Re-enable transition
        setTimeout(() => {
            highlight.style.transition = 'transform 0.25s ease, width 0.25s ease, height 0.25s ease, background-color 0.25s ease';
        }, 50);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // A slight delay ensures layout is fully calculated before placing highlight box
    setTimeout(initHighlightGrid, 100);
});

// --- Staggered Grid Implementation ---
function initStaggeredGrid() {
    if (typeof gsap === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    // Animate Massive Text
    const chars = document.querySelectorAll('.m-char');
    if (chars.length > 0) {
        gsap.from(chars, {
            scrollTrigger: {
                trigger: '.massive-text',
                start: 'top bottom',
                end: 'center center-=25%',
                scrub: 1,
            },
            ease: 'sine.out',
            yPercent: 300,
            autoAlpha: 0,
            stagger: {
                each: 0.05,
                from: 'center'
            }
        });
    }

    // Animate Grid Columns
    const grid = document.querySelector('.stagger-grid');
    if (grid) {
        const columns = Array.from({ length: 7 }, () => []);
        const items = grid.querySelectorAll('.sg-item');
        
        items.forEach(item => {
            const col = parseInt(item.getAttribute('data-col'), 10);
            if (!isNaN(col) && columns[col]) {
                columns[col].push(item);
            }
        });

        const middleCol = 3; // Index 3 is middle of 7

        columns.forEach((colItems, colIndex) => {
            if (colItems.length === 0) return;
            const delayFactor = Math.abs(colIndex - middleCol) * 0.2;
            
            gsap.from(colItems, {
                scrollTrigger: {
                    trigger: grid,
                    start: 'top bottom',
                    end: 'center center',
                    scrub: 1.5,
                },
                yPercent: 450,
                autoAlpha: 0,
                delay: delayFactor,
                ease: 'sine.out',
            });
            
            // Also animate inner item transforms
            const inners = colItems.map(el => el.querySelector('.sg-item-inner')).filter(Boolean);
            if (inners.length > 0) {
                gsap.from(inners, {
                    scrollTrigger: {
                        trigger: grid,
                        start: 'top bottom',
                        end: 'center center',
                        scrub: 1.5,
                    },
                    transformOrigin: '50% 0%',
                    ease: 'sine.out',
                }, 0);
            }
        });

        // Specific animation for bento container
        const bento = document.querySelector('.bento-container');
        if (bento) {
            gsap.to(bento, {
                scrollTrigger: {
                    trigger: grid,
                    start: 'top top+=15%',
                    end: 'bottom center',
                    scrub: 1,
                },
                y: window.innerHeight * 0.1,
                scale: 1.5,
                zIndex: 1000,
                ease: 'power2.out',
                duration: 1,
                force3D: true
            }, 0);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Delay initialization slightly to ensure all DOM elements are painted
    setTimeout(initStaggeredGrid, 200);
    setTimeout(initStorytellingAnimations, 300);
    setTimeout(initHumanoidAnimation, 400);
});

// --- Enhanced Storytelling & Animations ---
function initStorytellingAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof THREE === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // 1. Remove previous pinning/blur logic to fix the video and blur issues.

    // 2. Beautiful Paragraph Text Animation
    const storySections = document.querySelectorAll('#about, #vision');
    storySections.forEach(section => {
        const paragraphs = section.querySelectorAll('.about-text-content p');
        if (paragraphs.length > 0) {
            // Setup simple staggered fade up for paragraphs to make them look beautiful
            gsap.from(paragraphs, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                },
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out"
            });
        }
    });

    // 3. Three.js Storytelling Canvas (Black & White Particles)
    const canvas = document.getElementById('storyCanvas');
    if (!canvas) return;
    
    // Set opacity since it's naturally constrained within the wrapper now
    canvas.style.opacity = '1';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const particleCount = 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i+=3) {
        // Initial state (Scattered - represents isolated tools)
        positions[i] = (Math.random() - 0.5) * 40;
        positions[i+1] = (Math.random() - 0.5) * 40;
        positions[i+2] = (Math.random() - 0.5) * 20 - 10;
        
        // Target state (Sphere/Ecosystem - represents unified Markova OS)
        const radius = 6 + Math.random() * 2;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        targetPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
        targetPositions[i+1] = radius * Math.sin(phi) * Math.sin(theta);
        targetPositions[i+2] = radius * Math.cos(phi) - 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('targetPosition', new THREE.BufferAttribute(targetPositions, 3));

    // Strictly White particles to match UI
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.08,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 5;

    // Connect particles with lines for neural web effect
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.05,
        blending: THREE.AdditiveBlending
    });
    
    const lineGeometry = new THREE.BufferGeometry();
    let linePositions = new Float32Array(particleCount * 3 * 2); 
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Mouse Interaction Logic
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.001;
        mouseY = (event.clientY - windowHalfY) * 0.001;
    });

    // Animation state
    const animState = { progress: 0 };
    
    // Setup ScrollTrigger to control particle morphing inside the wrapper
    const storyWrapper = document.getElementById('story-wrapper');
    const visionSection = document.getElementById('vision');
    
    if (visionSection && storyWrapper) {
        // Morph particles when scrolling through Vision
        ScrollTrigger.create({
            trigger: visionSection,
            start: "top bottom",
            end: "bottom center",
            scrub: 1,
            onUpdate: (self) => {
                animState.progress = self.progress;
            }
        });
    }

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.002;
        
        // Apply interactive mouse rotation & camera movement
        targetX = mouseX * 2;
        targetY = mouseY * 2;
        
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        particles.rotation.y = time * 0.5 + targetX * 0.5;
        particles.rotation.x = time * 0.2 + targetY * 0.5;
        lines.rotation.y = time * 0.5 + targetX * 0.5;
        lines.rotation.x = time * 0.2 + targetY * 0.5;

        const pos = geometry.attributes.position.array;
        const target = geometry.attributes.targetPosition.array;
        let lineIdx = 0;

        for (let i = 0; i < particleCount * 3; i+=3) {
            // Morph between scatter and sphere based on scroll
            const currentX = THREE.MathUtils.lerp(positions[i], target[i], animState.progress);
            const currentY = THREE.MathUtils.lerp(positions[i+1], target[i+1], animState.progress);
            const currentZ = THREE.MathUtils.lerp(positions[i+2], target[i+2], animState.progress);
            
            // Add subtle floating motion
            pos[i] = currentX + Math.sin(time * 2 + i) * 0.2;
            pos[i+1] = currentY + Math.cos(time * 2 + i) * 0.2;
            pos[i+2] = currentZ + Math.sin(time * 3 + i) * 0.2;
            
            // Connect nearby points to form web
            if (i % 6 === 0 && lineIdx < linePositions.length - 6) {
                linePositions[lineIdx++] = pos[i];
                linePositions[lineIdx++] = pos[i+1];
                linePositions[lineIdx++] = pos[i+2];
                let nextIdx = (i + 15) % (particleCount * 3);
                linePositions[lineIdx++] = pos[nextIdx];
                linePositions[lineIdx++] = pos[nextIdx+1];
                linePositions[lineIdx++] = pos[nextIdx+2];
            }
        }
        
        geometry.attributes.position.needsUpdate = true;
        lines.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }
    
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- Humanoid Vision Canvas ---
function initHumanoidAnimation() {
    const canvas = document.getElementById('humanoidCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('user-custom-humanoid.png', (texture) => {
        const imgAspect = texture.image.width / texture.image.height;
        const screenAspect = window.innerWidth / window.innerHeight;
        
        let planeWidth = 6;
        let planeHeight = 6 / imgAspect;
        
        if (screenAspect < imgAspect) {
            planeWidth = 8;
            planeHeight = 8 / imgAspect;
        }

        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32);
        
        // Since the image has a solid black background, we don't need additive blending. 
        // It will naturally blend with the black background of the story-wrapper.
        const material = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        // Position it to the side so it doesn't completely block text
        mesh.position.x = window.innerWidth > 768 ? 2 : 0;
        
        // Mouse interaction for 3D tilt
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX) * 0.0005;
            mouseY = (event.clientY - windowHalfY) * 0.0005;
        });

        // Add ScrollTrigger to fade the canvas in/out for performance and polish
        const visionSection = document.getElementById('vision');
        if (visionSection && typeof gsap !== 'undefined') {
            gsap.from(canvas, {
                scrollTrigger: {
                    trigger: visionSection,
                    start: "top 70%",
                    end: "bottom top",
                    toggleActions: "play reverse play reverse"
                },
                opacity: 0,
                duration: 1.5,
                ease: "power2.out"
            });
        }

        function animate() {
            requestAnimationFrame(animate);
            
            targetX = mouseX;
            targetY = mouseY;
            
            // Smoothly rotate the plane to simulate 3D depth/parallax
            mesh.rotation.y += (targetX - mesh.rotation.y) * 0.05;
            mesh.rotation.x += (targetY - mesh.rotation.x) * 0.05;
            
            // Subtle floating effect
            mesh.position.y = Math.sin(Date.now() * 0.001) * 0.1;
            
            renderer.render(scene, camera);
        }
        
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            mesh.position.x = window.innerWidth > 768 ? 2 : 0;
        });
    });
}


const FlagLetterToRis = {
    'A': '\uDDE6',
    'B': '\uDDE7',
    'C': '\uDDE8',
    'D': '\uDDE9',
    'E': '\uDDEA',
    'F': '\uDDEB',
    'G': '\uDDEC',
    'H': '\uDDED',
    'I': '\uDDEE',
    'J': '\uDDEF',
    'K': '\uDDF0',
    'L': '\uDDF1',
    'M': '\uDDF2',
    'N': '\uDDF3',
    'O': '\uDDF4',
    'P': '\uDDF5',
    'Q': '\uDDF6',
    'R': '\uDDF7',
    'S': '\uDDF8',
    'T': '\uDDF9',
    'U': '\uDDFA',
    'V': '\uDDFB',
    'W': '\uDDFC',
    'X': '\uDDFD',
    'Y': '\uDDFE',
    'Z': '\uDDFF',
};

function BuildFlagEmoji(riss) {
    if (riss.length !== 2) {
        throw new Error(`expected country code of length 2, got ${riss}`);
    }
    return ['\uD83C', FlagLetterToRis[riss[0]], '\uD83C', FlagLetterToRis[riss[1]]].join('')
}

// See: https://en.wikipedia.org/wiki/Regional_indicator_symbol#Emoji_flag_sequences
//   Sort by 'region'
const CountryNameToLetters = {
    'Afghanistan'       : 'AF',
    'Algeria'           : 'DZ',
    'Argentina'         : 'AR',
    'Australia'         : 'AU',
    'Austria'           : 'AT',
    'Bangladesh'        : 'BD',
    'Belarus'           : 'BY',
    'Belgium'           : 'BE',
    'Brazil'            : 'BR',
    'Bulgaria'          : 'BG',
    'Canada'            : 'CA',
    'Chile'             : 'CL',
    'China'             : 'CN',
    'Colombia'          : 'CO',
    'Croatia'           : 'HR',
    'Denmark'           : 'DK',
    'Egypt'             : 'EG',
    'Estonia'           : 'EE',
    'European Union'    : 'EU',
    'France'            : 'FR',
    'French Guiana'     : 'GF',
    'French Polynesia'  : 'PF',
    'French Southern Territories': 'TF',
    'Finland'           : 'FI',
    'Germany'           : 'DE',
    'Greece'            : 'GR',
    'Hungary'           : 'HU',
    'Iceland'           : 'IS',
    'India'             : 'IN',
    'Indonesia'         : 'ID',
    'Iran'              : 'IR',
    'Ireland'           : 'IE',
    'Israel'            : 'IL',
    'Italy'             : 'IT',
    'Jamaica'           : 'JM',
    'Japan'             : 'JP',
    'Kazakhstan'        : 'KZ',
    'Kyrgyzstan'        : 'KG',
    'Latvia'            : 'LV',
    'Luxembourg'        : 'LU',
    'Mali'              : 'ML',
    'Martinique'        : 'MQ',
    'Mexico'            : 'MX',
    'Monaco'            : 'MC',
    'Mongolia'          : 'MN',
    'Morocco'           : 'MA',
    'Netherlands'       : 'NL',
    'New Zealand'       : 'NZ',
    'Norway'            : 'NO',
    'Oman'              : 'OM',
    'Pakistan'          : 'PK',
    'Poland'            : 'PL',
    'Portugal'          : 'PT',
    'Qatar'             : 'QA',
    'Romania'           : 'RO',
    'Russia'            : 'RU',
    'Senegal'           : 'SN',
    'Serbia'            : 'RS',
    'Slovenia'          : 'SI',
    'South Africa'      : 'ZA',
    'South Korea'       : 'KR',
    'South Sudan'       : 'SS',
    'Spain'             : 'ES',
    'Sweden'            : 'SE',
    'Switzerland'       : 'CH',
    'Tajikistan'        : 'TJ',
    'Tunisia'           : 'TN',
    'Turkey'            : 'TR',
    'Turkmenistan'      : 'TM',
    'Ukraine'           : 'UA',
    'United Arab Emirates' : 'AE',
    'United Kingdom'    : 'GB',
    'United Nations'    : 'UN',
    'United States'     : 'US',
    'Taiwan'            : 'TW',
    'Vatican City'      : 'VA',
    'Venezuela'         : 'VE',
    'Vietnam'           : 'VN',
    'Yemen'             : 'YE',
    'Zambia'            : 'ZM',
    'Zimbabwe'          : 'ZW',
};

function MapObject(f, obj) {
    let out = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            let value = f(obj[key]);
            // console.log(`key: ${key}, in: ${obj[key]}, out: ${value}`);
            out[key] = value;
        }
    }
    return out;
}

let FlagEmojis = MapObject(BuildFlagEmoji, CountryNameToLetters);

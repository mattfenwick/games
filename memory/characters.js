'use strict';


const PeopleEmojis = {
    elf         : '\uD83E\uDDDD',
    manDancing  : '\uD83D\uDD7A',
    manGuard    : '\uD83D\uDC82',
    ninja       : '\uD83E\uDD77',
    troll       : '\uD83E\uDDCC',
    womanDancing: '\uD83D\uDC83',
    vampire     : '\uD83E\uDDDB',
    zombie      : '\uD83E\uDDDF',
    superhero   : '\uD83E\uDDB8',
    santaclaus  : '\uD83C\uDF85\uD83C\uDFFB',
    snowman     : '\u26C4',
    princess    : '\uD83D\uDC78',
    prince      : '\uD83E\uDD34\uD83C\uDFFB',
}


const CardBack = '\uD83C\uDCA0';


const FoodTheme             = 'food';
const AnimalsTheme          = 'animals';
const FoodAndAnimalsTheme   = 'food and animals';
const FlagTheme             = 'flags';
const MixedTheme            = 'mixed';
const PlayingCardsTheme     = 'playing cards';


function GetCharacters(theme) {
    switch (theme) {
        case FoodTheme:             return FoodEmojis;
        case AnimalsTheme:          return AnimalEmojis;
        case FoodAndAnimalsTheme:   return CombineMaps([FoodEmojis, AnimalEmojis]);
        case FlagTheme:             return FlagEmojis;
        case MixedTheme:            return CombineMaps([FoodEmojis, AnimalEmojis, FlagEmojis, PlayingCardEmojis]);
        case PlayingCardsTheme:     return PlayingCardEmojis;
        default: throw new Error(`invalid theme ${theme}`);
    }
}


function CombineMaps(maps) {
    var out = {};
    maps.forEach(function(m) {
        for (const [key, value] of Object.entries(m)) {
            if (key in out) {
                throw new Error(`duplicate key: ${key}, values ${value}, ${out[key]}`);
            }
            out[key] = value;
        }
    })
    return out;
}

class Char {
    constructor(description, value, color) {
        this.description = description;
        this.value = value;
        this.color = color;
    }
}

function MapObject(f, obj) {
    let out = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            let value = f(key, obj[key]);
            // console.log(`key: ${key}, in: ${obj[key]}, out: ${value}`);
            out[key] = value;
        }
    }
    return out;
}


// start: foods

const FoodEmojisRaw = {
    'blueberries'   : '\uD83E\uDED0',
    'bell pepper'   : '\uD83E\uDED1',
    'olive'         : '\uD83E\uDED2',
    'flatbread'     : '\uD83E\uDED3',
    'tamale'        : '\uD83E\uDED4',
    'fondue'        : '\uD83E\uDED5',
    'teapot'        : '\uD83E\uDED6',

    'croissant'         : '\uD83E\uDD50',
    'avocado'           : '\uD83E\uDD51',
    'cucumber'          : '\uD83E\uDD52',
    'bacon'             : '\uD83E\uDD53',
    'potato'            : '\uD83E\uDD54',
    'carrot'            : '\uD83E\uDD55',
    'baguette'          : '\uD83E\uDD56',
    'green salad'       : '\uD83E\uDD57',
    'shallow pan of food' : '\uD83E\uDD58',
    'stuffed flatbread' : '\uD83E\uDD59',
    'egg'               : '\uD83E\uDD5A',
    'milk'              : '\uD83E\uDD5B',
    'peanuts'           : '\uD83E\uDD5C',
    'kiwi'              : '\uD83E\uDD5D',
    'pancakes'          : '\uD83E\uDD5E',
    'dumpling'          : '\uD83E\uDD5F',

    'fortune cookie'    : '\uD83E\uDD60',
    'takeout box'       : '\uD83E\uDD61',
    // 'chopsticks'        : '\uD83E\uDD62',
    // 'bowl with spoon'   : '\uD83E\uDD63',
    'cup with straw'    : '\uD83E\uDD64',
    'coconut'           : '\uD83E\uDD65',
    'broccoli'          : '\uD83E\uDD66',
    'pie'               : '\uD83E\uDD67',
    'pretzel'           : '\uD83E\uDD68',
    'meat'              : '\uD83E\uDD69',
    'sandwich'          : '\uD83E\uDD6A',
    'canned food'       : '\uD83E\uDD6B',
    'leafy green'       : '\uD83E\uDD6C',
    'mango'             : '\uD83E\uDD6D',
    'moon cake'         : '\uD83E\uDD6E',
    'bagel'             : '\uD83E\uDD6F',

    'cheese'            : '\uD83E\uDDC0',
    'cupcake'           : '\uD83E\uDDC1',
    'salt shaker'       : '\uD83E\uDDC2',
    'beverage box'      : '\uD83E\uDDC3',
    'garlic'            : '\uD83E\uDDC4',
    'onion'             : '\uD83E\uDDC5',
    'falafel'           : '\uD83E\uDDC6',
    'waffle'            : '\uD83E\uDDC7',
    'butter'            : '\uD83E\uDDC8',
    'mate drink'        : '\uD83E\uDDC9',
    'ice cube'          : '\uD83E\uDDCA',
    'bubble tea'        : '\uD83E\uDDCB',

    'hotdog'            : '\uD83C\uDF2D',
    'taco'              : '\uD83C\uDF2E',
    'burrito'           : '\uD83C\uDF2F',

    'chestnut'          : '\uD83C\uDF30',
    'hot pepper'        : '\uD83C\uDF36',
    'ear of maize'      : '\uD83C\uDF3D',

    'mushroom'          : '\uD83C\uDF44',
    'tomato'            : '\uD83C\uDF45',
    'eggplant'          : '\uD83C\uDF46',
    'grapes'            : '\uD83C\uDF47',
    'melon'             : '\uD83C\uDF48',
    'watermelon'        : '\uD83C\uDF49',
    'tangerine'         : '\uD83C\uDF4A',
    'lemon'             : '\uD83C\uDF4B',
    'banana'            : '\uD83C\uDF4C',
    'pineapple'         : '\uD83C\uDF4D',
    'red apple'         : '\uD83C\uDF4E',
    'green apple'       : '\uD83C\uDF4F',

    'pear'              : '\uD83C\uDF50',
    'peach'             : '\uD83C\uDF51',
    'cherries'          : '\uD83C\uDF52',
    'strawberry'        : '\uD83C\uDF53',
    'hamburger'         : '\uD83C\uDF54',
    'pizza'             : '\uD83C\uDF55',
    'meat on bone'      : '\uD83C\uDF56',
    'poultry leg'       : '\uD83C\uDF57',
    // 'rice cracker'      : '\uD83C\uDF58',
    // 'rice ball'         : '\uD83C\uDF59',
    // 'cooked rice'       : '\uD83C\uDF5A',
    // 'curry and rice'    : '\uD83C\uDF5B',
    'steaming bowl'     : '\uD83C\uDF5C',
    'spaghetti'         : '\uD83C\uDF5D',
    'bread'             : '\uD83C\uDF5E',
    'french fries'      : '\uD83C\uDF5F',

    'roasted sweet potato': '\uD83C\uDF60',
    // 'dango'             : '\uD83C\uDF61',
    // 'oden'              : '\uD83C\uDF62',
    'sushi'             : '\uD83C\uDF63',
    'fried shrimp'      : '\uD83C\uDF64',
    // 'fish cake with swirl design': '\uD83C\uDF65',
    'soft ice cream'    : '\uD83C\uDF66',
    'shaved ice'        : '\uD83C\uDF67',
    'ice cream'         : '\uD83C\uDF68',
    'doughnut'          : '\uD83C\uDF69',
    'cookie'            : '\uD83C\uDF6A',
    'chocolate bar'     : '\uD83C\uDF6B',
    'candy'             : '\uD83C\uDF6C',
    'lollipop'          : '\uD83C\uDF6D',
    'custard'           : '\uD83C\uDF6E',
    'honey pot'         : '\uD83C\uDF6F',

    'shortcake'         : '\uD83C\uDF70',
    'bento box'         : '\uD83C\uDF71',
    'pot of food'       : '\uD83C\uDF72',
    'cooking'           : '\uD83C\uDF73',
};

const FoodEmojis = MapObject((k, v) => new Char(k, v, 'black'), FoodEmojisRaw);

// end: foods

// start: animals

const AnimalEmojisRaw = {
    'rat'           : '\uD83D\uDC00',
    'mouse'         : '\uD83D\uDC01',
    'ox'            : '\uD83D\uDC02',
    'water buffalo' : '\uD83D\uDC03',
    'cow'           : '\uD83D\uDC04',
    'tiger'         : '\uD83D\uDC05',
    'leopard'       : '\uD83D\uDC06',
    'rabbit'        : '\uD83D\uDC07',
    'cat'           : '\uD83D\uDC08',
    'dragon'        : '\uD83D\uDC09',
    'crocodile'     : '\uD83D\uDC0A',
    'whale'         : '\uD83D\uDC0B',
    'snail'         : '\uD83D\uDC0C',
    'snake'         : '\uD83D\uDC0D',
    'horse'         : '\uD83D\uDC0E',
    'ram'           : '\uD83D\uDC0F',

    'goat'          : '\uD83D\uDC10',
    'sheep'         : '\uD83D\uDC11',
    'monkey'        : '\uD83D\uDC12',
    'rooster'       : '\uD83D\uDC13',
    // 'chicken head'  : '\uD83D\uDC14',
    'dog'           : '\uD83D\uDC15',
    'pig'           : '\uD83D\uDC16',
    'boar'          : '\uD83D\uDC17',
    'elephant'      : '\uD83D\uDC18',
    'octopus'       : '\uD83D\uDC19',
    'shell'         : '\uD83D\uDC1A',
    'bug'           : '\uD83D\uDC1B',
    'ant'           : '\uD83D\uDC1C',
    'honeybee'      : '\uD83D\uDC1D',
    'lady beetle'   : '\uD83D\uDC1E',
    'fish'          : '\uD83D\uDC1F',

    'tropical fish'             : '\uD83D\uDC20',
    'blowfish'                  : '\uD83D\uDC21',
    'turtle'                    : '\uD83D\uDC22',
    'hatching chick'            : '\uD83D\uDC23',
    // 'baby chick face'           : '\uD83D\uDC24',
    'front facing baby chick'   : '\uD83D\uDC25',
    // 'bird face'                 : '\uD83D\uDC26',
    // 'penguin face'              : '\uD83D\uDC27',
    'koala face'                : '\uD83D\uDC28',
    'poodle'                    : '\uD83D\uDC29',
    'dromedary camel'           : '\uD83D\uDC2A',
    'bactrian camel'            : '\uD83D\uDC2B',
    'dolphin'                   : '\uD83D\uDC2C',
    // 'mouse face'                : '\uD83D\uDC2D',
    // 'cow face'                  : '\uD83D\uDC2E',
    // 'tiger face'                : '\uD83D\uDC2F',

    // 'rabbit face'   : '\uD83D\uDC30',
    // 'cat face'      : '\uD83D\uDC31',
    // 'dragon face'   : '\uD83D\uDC32',
    'spouting whale': '\uD83D\uDC33',
    'horse face'    : '\uD83D\uDC34',
    // 'monkey face'   : '\uD83D\uDC35',
    // 'dog face'      : '\uD83D\uDC36',
    // 'pig face'      : '\uD83D\uDC37',
    'frog face'     : '\uD83D\uDC38',
    // 'hamster face'  : '\uD83D\uDC39',
    'wolf face'     : '\uD83D\uDC3A',
    'bear face'     : '\uD83D\uDC3B',
    'panda face'    : '\uD83D\uDC3C',
    // 'pig nose'      : '\uD83D\uDC3D',
    // 'paw prints'    : '\uD83D\uDC3E',
    'chipmunk'      : '\uD83D\uDC3F',

    'crab'          : '\uD83E\uDD80',
    'lion face'     : '\uD83E\uDD81',
    'scorpion'      : '\uD83E\uDD82',
    'turkey'        : '\uD83E\uDD83',
    'unicorn face'  : '\uD83E\uDD84',
    'eagle'         : '\uD83E\uDD85',
    'duck'          : '\uD83E\uDD86',
    'bat'           : '\uD83E\uDD87',
    'shark'         : '\uD83E\uDD88',
    'owl'           : '\uD83E\uDD89',
    'fox face'      : '\uD83E\uDD8A',
    'butterfly'     : '\uD83E\uDD8B',
    'deer'          : '\uD83E\uDD8C',
    'gorilla'       : '\uD83E\uDD8D',
    'lizard'        : '\uD83E\uDD8E',
    'rhinoceros'    : '\uD83E\uDD8F',

    'shrimp'        : '\uD83E\uDD90',
    'squid'         : '\uD83E\uDD91',
    'giraffe'       : '\uD83E\uDD92',
    'zebra'         : '\uD83E\uDD93',
    'hedgehog'      : '\uD83E\uDD94',
    'sauropod'      : '\uD83E\uDD95',
    't rex'         : '\uD83E\uDD96',
    'cricket'       : '\uD83E\uDD97',
    'kangaroo'      : '\uD83E\uDD98',
    'llama'         : '\uD83E\uDD99',
    'peacock'       : '\uD83E\uDD9A',
    'hippopotamus'  : '\uD83E\uDD9B',
    'parrot'        : '\uD83E\uDD9C',
    'raccoon'       : '\uD83E\uDD9D',
    'lobster'       : '\uD83E\uDD9E',
    // 'mosquito'      : '\uD83E\uDD9F',

    // 'microbe'   : '\uD83E\uDDA0',
    'badger'    : '\uD83E\uDDA1',
    'swan'      : '\uD83E\uDDA2',
    'mammoth'   : '\uD83E\uDDA3',
    'dodo'      : '\uD83E\uDDA4',
    'sloth'     : '\uD83E\uDDA5',
    'otter'     : '\uD83E\uDDA6',
    'orangutan' : '\uD83E\uDDA7',
    'skunk'     : '\uD83E\uDDA8',
    'flamingo'  : '\uD83E\uDDA9',
    'oyster'    : '\uD83E\uDDAA',
    'beaver'    : '\uD83E\uDDAB',
    'bison'     : '\uD83E\uDDAC',
    'seal'      : '\uD83E\uDDAD',
};

const AnimalEmojis = MapObject((k, v) => new Char(k, v, 'black'), AnimalEmojisRaw);

// end: foods

// start: flags

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

const FlagEmojis = MapObject((k, v) => new Char(k, BuildFlagEmoji(v), 'black'), CountryNameToLetters);

// end: flags

// start: playing cards

const Blacks = {
    // "back": "\uD83C\uDCA0", // don't use -- would be confusing with upside down cards
    "spades ace"    : "\uD83C\uDCA1",
    "spades 2"      : "\uD83C\uDCA2",
    "spades 3"      : "\uD83C\uDCA3",
    "spades 4"      : "\uD83C\uDCA4",
    "spades 5"      : "\uD83C\uDCA5",
    "spades 6"      : "\uD83C\uDCA6",
    "spades 7"      : "\uD83C\uDCA7",
    "spades 8"      : "\uD83C\uDCA8",
    "spades 9"      : "\uD83C\uDCA9",
    "spades 10"     : "\uD83C\uDCAA",
    "spades J"      : "\uD83C\uDCAB",
    "spades knight" : "\uD83C\uDCAC",
    "spades Q"      : "\uD83C\uDCAD",
    "spades K"      : "\uD83C\uDCAE",
    // "empty"      : "\uD83C\uDCAF",

    "black joker"   : "\uD83C\uDCCF",

    // "empty": "\uD83C\uDCD0", // don't use -- would be confusing with upside down cards
    "clubs ace"    : "\uD83C\uDCD1",
    "clubs 2"      : "\uD83C\uDCD2",
    "clubs 3"      : "\uD83C\uDCD3",
    "clubs 4"      : "\uD83C\uDCD4",
    "clubs 5"      : "\uD83C\uDCD5",
    "clubs 6"      : "\uD83C\uDCD6",
    "clubs 7"      : "\uD83C\uDCD7",
    "clubs 8"      : "\uD83C\uDCD8",
    "clubs 9"      : "\uD83C\uDCD9",
    "clubs 10"     : "\uD83C\uDCDA",
    "clubs J"      : "\uD83C\uDCDB",
    "clubs knight" : "\uD83C\uDCDC",
    "clubs Q"      : "\uD83C\uDCDD",
    "clubs K"      : "\uD83C\uDCDE",

    "white joker"  : "\uD83C\uDCDF",

    // these don't seem to render on some browsers
    // "trump fool"    : "\uD83C\uDCE0",
    // "trump 1"       : "\uD83C\uDCE1",
    // "trump 2"       : "\uD83C\uDCE2",
    // "trump 3"       : "\uD83C\uDCE3",
    // "trump 4"       : "\uD83C\uDCE4",
    // "trump 5"       : "\uD83C\uDCE5",
    // "trump 6"       : "\uD83C\uDCE6",
    // "trump 7"       : "\uD83C\uDCE7",
    // "trump 8"       : "\uD83C\uDCE8",
    // "trump 9"       : "\uD83C\uDCE9",
    // "trump 10"      : "\uD83C\uDCEA",
    // "trump 11"      : "\uD83C\uDCEB",
    // "trump 12"      : "\uD83C\uDCEC",
    // "trump 13"      : "\uD83C\uDCED",
    // "trump 14"      : "\uD83C\uDCEE",
    // "trump 15"      : "\uD83C\uDCEF",
    // "trump 16"      : "\uD83C\uDCF0",
    // "trump 17"      : "\uD83C\uDCF1",
    // "trump 18"      : "\uD83C\uDCF2",
    // "trump 19"      : "\uD83C\uDCF3",
    // "trump 20"      : "\uD83C\uDCF4",
    // "trump 21"      : "\uD83C\uDCF5",
};

const Reds = {
    // "empty": "\uD83C\uDCB0",
    "hearts ace"    : "\uD83C\uDCB1",
    "hearts 2"      : "\uD83C\uDCB2",
    "hearts 3"      : "\uD83C\uDCB3",
    "hearts 4"      : "\uD83C\uDCB4",
    "hearts 5"      : "\uD83C\uDCB5",
    "hearts 6"      : "\uD83C\uDCB6",
    "hearts 7"      : "\uD83C\uDCB7",
    "hearts 8"      : "\uD83C\uDCB8",
    "hearts 9"      : "\uD83C\uDCB9",
    "hearts 10"     : "\uD83C\uDCBA",
    "hearts J"      : "\uD83C\uDCBB",
    "hearts knight" : "\uD83C\uDCBC",
    "hearts Q"      : "\uD83C\uDCBD",
    "hearts K"      : "\uD83C\uDCBE",

    // doesn't seem to render on some browsers
    // "red joker"     : "\uD83C\uDCBF",

    // "empty": "\uD83C\uDCC0",
    "diamonds ace"    : "\uD83C\uDCC1",
    "diamonds 2"      : "\uD83C\uDCC2",
    "diamonds 3"      : "\uD83C\uDCC3",
    "diamonds 4"      : "\uD83C\uDCC4",
    "diamonds 5"      : "\uD83C\uDCC5",
    "diamonds 6"      : "\uD83C\uDCC6",
    "diamonds 7"      : "\uD83C\uDCC7",
    "diamonds 8"      : "\uD83C\uDCC8",
    "diamonds 9"      : "\uD83C\uDCC9",
    "diamonds 10"     : "\uD83C\uDCCA",
    "diamonds J"      : "\uD83C\uDCCB",
    "diamonds knight" : "\uD83C\uDCCC",
    "diamonds Q"      : "\uD83C\uDCCD",
    "diamonds K"      : "\uD83C\uDCCE",
    // "black joker"  : "\uD83C\uDCCF", // this is actually under Blacks
};

function GetPlayingCardEmojis() {
    let cards = [
        MapObject((k, v) => new Char(k, v, "black"), Blacks),
        MapObject((k, v) => new Char(k, v, "red"), Reds),
    ];
    return CombineMaps(cards);
}

const PlayingCardEmojis = GetPlayingCardEmojis();

// end: playing cards

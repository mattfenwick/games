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
}


const CardBack = '\uD83C\uDCA0';


const FoodTheme     = 'food';
const AnimalsTheme  = 'animals';
const MixedTheme    = 'mixed';


function GetCharacters(theme) {
    switch (theme) {
        case FoodTheme: return FoodEmojis;
        case AnimalsTheme: return AnimalEmojis;
        case MixedTheme: return CombineMaps([FoodEmojis, AnimalEmojis]);
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


const FoodEmojis = {
    'blueberries'   : '\uD83E\uDED0',
    'bell pepper'   : '\uD83E\uDED1',
    'olive'         : '\uD83E\uDED2',
    // 'flatbread': '\uD83E\uDED3',

    'croissant'     : '\uD83E\uDD50',
    'avocado'       : '\uD83E\uDD51',
    'cucumber'      : '\uD83E\uDD52',
    'bacon'         : '\uD83E\uDD53',
    'potato'        : '\uD83E\uDD54',
    'carrot'        : '\uD83E\uDD55',
    'baguette'      : '\uD83E\uDD56',
    'green salad'   : '\uD83E\uDD57',

    'stuffed flatbread' : '\uD83E\uDD59',
    'egg'               : '\uD83E\uDD5A',
    'milk'              : '\uD83E\uDD5B',
    'peanuts'           : '\uD83E\uDD5C',
    'kiwi'              : '\uD83E\uDD5D',
    'pancakes'          : '\uD83E\uDD5E',
    'dumpling'          : '\uD83E\uDD5F',

    'coconut'           : '\uD83E\uDD65',
    'broccoli'          : '\uD83E\uDD66',
    'pie'               : '\uD83E\uDD67',
    'pretzel'           : '\uD83E\uDD68',
    'meat'              : '\uD83E\uDD69',
    'sandwich'          : '\uD83E\uDD6A',

    'leafy green'       : '\uD83E\uDD6C',
    'mango'             : '\uD83E\uDD6D',

    'bagel'             : '\uD83E\uDD6F',

    'cheese'            : '\uD83E\uDDC0',
    'cupcake'           : '\uD83E\uDDC1',

    'garlic'            : '\uD83E\uDDC4',
    'onion'             : '\uD83E\uDDC5',

    'waffle'            : '\uD83E\uDDC7',
    'butter'            : '\uD83E\uDDC8',

    'hotdog'            : '\uD83C\uDF2D',
    'taco'              : '\uD83C\uDF2E',
    'burrito'           : '\uD83C\uDF2F',
    'chestnut'          : '\uD83C\uDF30',

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

    'spaghetti'         : '\uD83C\uDF5D',
    'bread'             : '\uD83C\uDF5E',
    'french fries'      : '\uD83C\uDF5F',

    'ice cream'         : '\uD83C\uDF68',
    'doughnut'          : '\uD83C\uDF69',
    'cookie'            : '\uD83C\uDF6A',
    'chocolate bar'     : '\uD83C\uDF6B',
    'candy'             : '\uD83C\uDF6C',
    'lollipop'          : '\uD83C\uDF6D',

    'honey pot'         : '\uD83C\uDF6F',
    'shortcake'         : '\uD83C\uDF70',
};

const AnimalEmojis = {
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
    // 'shell'         : '\uD83D\uDC1A',
    'bug'           : '\uD83D\uDC1B',
    'ant'           : '\uD83D\uDC1C',
    'honeybee'      : '\uD83D\uDC1D',
    'lady beetle'   : '\uD83D\uDC1E',
    'fish'          : '\uD83D\uDC1F',

    'tropical fish'             : '\uD83D\uDC20',
    'blowfish'                  : '\uD83D\uDC21',
    'turtle'                    : '\uD83D\uDC22',
    // 'hatching chick'            : '\uD83D\uDC23',
    // 'baby chick face'           : '\uD83D\uDC24',
    'front facing baby chick'   : '\uD83D\uDC25',
    // 'bird face'                 : '\uD83D\uDC26',
    // 'penguin face'              : '\uD83D\uDC27',
    // 'koala face'                : '\uD83D\uDC28',
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
    'flamino'   : '\uD83E\uDDA9',
    'oyster'    : '\uD83E\uDDAA',
    'beaver'    : '\uD83E\uDDAB',
    'bison'     : '\uD83E\uDDAC',
    'seal'      : '\uD83E\uDDAD',
};
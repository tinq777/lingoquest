/* Lingo Quest — content registry.
   UNITS hold the shared concepts (one picture each); LANGUAGES hold each
   language's words, tips and dialogues keyed by concept id. Adding a language
   is one new entry in LANGUAGES; adding a unit is one entry in UNITS plus its
   words in each language. Every screen derives from these registries. */
(function (LQ) {
  'use strict';

  var UNITS = [
    { id: 'greetings', title: 'Greetings', emblem: 'hello', concepts: [
      { id: 'hello', en: 'hello' },
      { id: 'goodbye', en: 'goodbye' },
      { id: 'thanks', en: 'thank you' },
      { id: 'yes', en: 'yes' },
      { id: 'no', en: 'no' },
      { id: 'please', en: 'please' },
      { id: 'sorry', en: 'sorry' },
      { id: 'morning', en: 'good morning' }
    ] },
    { id: 'numbers', title: 'Numbers', emblem: 'three', concepts: [
      { id: 'one', en: 'one' },
      { id: 'two', en: 'two' },
      { id: 'three', en: 'three' },
      { id: 'four', en: 'four' },
      { id: 'five', en: 'five' },
      { id: 'six', en: 'six' },
      { id: 'seven', en: 'seven' },
      { id: 'eight', en: 'eight' }
    ] },
    { id: 'colours', title: 'Colours', emblem: 'red', concepts: [
      { id: 'red', en: 'red' },
      { id: 'blue', en: 'blue' },
      { id: 'green', en: 'green' },
      { id: 'yellow', en: 'yellow' },
      { id: 'black', en: 'black' },
      { id: 'white', en: 'white' },
      { id: 'pink', en: 'pink' },
      { id: 'orange', en: 'orange' }
    ] },
    { id: 'family', title: 'Family', emblem: 'family', concepts: [
      { id: 'mum', en: 'mum' },
      { id: 'dad', en: 'dad' },
      { id: 'grandma', en: 'grandma' },
      { id: 'grandpa', en: 'grandpa' },
      { id: 'brother', en: 'big brother' },
      { id: 'sister', en: 'big sister' },
      { id: 'baby', en: 'baby' },
      { id: 'family', en: 'family' }
    ] },
    { id: 'food', title: 'Food', emblem: 'apple', concepts: [
      { id: 'apple', en: 'apple' },
      { id: 'banana', en: 'banana' },
      { id: 'rice', en: 'rice' },
      { id: 'noodles', en: 'noodles' },
      { id: 'water', en: 'water' },
      { id: 'milk', en: 'milk' },
      { id: 'bread', en: 'bread' },
      { id: 'egg', en: 'egg' }
    ] }
  ];

  /* Word fields: t = text as written, r = romanisation (pinyin, one syllable
     per character, space separated), g = Spanish noun gender (m/f),
     hint = a picture-puzzle hint for simple Chinese characters. */
  var LANGUAGES = {
    zh: {
      id: 'zh', order: 1, name: 'Chinese', native: '中文', flagWord: '你好',
      voice: 'zh-CN', variant: 'Mainland Mandarin, simplified characters',
      tones: 'pinyin', isDefault: true,
      words: {
        hello: { t: '你好', r: 'nǐ hǎo' },
        goodbye: { t: '再见', r: 'zài jiàn' },
        thanks: { t: '谢谢', r: 'xiè xie' },
        yes: { t: '是', r: 'shì' },
        no: { t: '不', r: 'bù' },
        please: { t: '请', r: 'qǐng' },
        sorry: { t: '对不起', r: 'duì bu qǐ' },
        morning: { t: '早上好', r: 'zǎo shang hǎo' },
        one: { t: '一', r: 'yī', hint: 'One line, like one finger lying down.' },
        two: { t: '二', r: 'èr', hint: 'Two lines for two.' },
        three: { t: '三', r: 'sān', hint: 'Three lines for three.' },
        four: { t: '四', r: 'sì', hint: 'A window with two curtains inside.' },
        five: { t: '五', r: 'wǔ', hint: 'A little stool standing on the ground.' },
        six: { t: '六', r: 'liù', hint: 'A person with a hat and two legs.' },
        seven: { t: '七', r: 'qī', hint: 'A cross with a curly tail.' },
        eight: { t: '八', r: 'bā', hint: 'Two lines sliding apart, like a slide.' },
        red: { t: '红色', r: 'hóng sè' },
        blue: { t: '蓝色', r: 'lán sè' },
        green: { t: '绿色', r: 'lǜ sè' },
        yellow: { t: '黄色', r: 'huáng sè' },
        black: { t: '黑色', r: 'hēi sè' },
        white: { t: '白色', r: 'bái sè' },
        pink: { t: '粉红色', r: 'fěn hóng sè' },
        orange: { t: '橙色', r: 'chéng sè' },
        mum: { t: '妈妈', r: 'mā ma' },
        dad: { t: '爸爸', r: 'bà ba' },
        grandma: { t: '奶奶', r: 'nǎi nai' },
        grandpa: { t: '爷爷', r: 'yé ye' },
        brother: { t: '哥哥', r: 'gē ge' },
        sister: { t: '姐姐', r: 'jiě jie' },
        baby: { t: '宝宝', r: 'bǎo bao' },
        family: { t: '家人', r: 'jiā rén' },
        apple: { t: '苹果', r: 'píng guǒ' },
        banana: { t: '香蕉', r: 'xiāng jiāo' },
        rice: { t: '米饭', r: 'mǐ fàn' },
        noodles: { t: '面条', r: 'miàn tiáo' },
        water: { t: '水', r: 'shuǐ' },
        milk: { t: '牛奶', r: 'niú nǎi' },
        bread: { t: '面包', r: 'miàn bāo' },
        egg: { t: '鸡蛋', r: 'jī dàn' }
      },
      tips: {
        greetings: 'Chinese has four tones plus a light neutral one. In 你好 nǐ hǎo both syllables are third tone, so the first one rises: say it like "ní hǎo".',
        numbers: 'The first three numbers are just lines: 一 is one line, 二 is two, 三 is three. Count on your fingers as you say them.',
        colours: 'Colour words end in 色 sè, which means "colour". 红色 hóng sè is "red colour".',
        family: 'Family words often repeat a syllable: 妈妈 māma, 爸爸 bàba, 哥哥 gēge. The second syllable is short and light.',
        food: '请 qǐng means please. Say 请给我水 qǐng gěi wǒ shuǐ for "water, please".'
      },
      dialogues: {
        greetings: [
          { s: 'a', t: '早上好！', r: 'zǎo shang hǎo!', en: 'Good morning!' },
          { s: 'you', t: '早上好！', r: 'zǎo shang hǎo!', en: 'Good morning!',
            wrong: [{ t: '对不起。', r: 'duì bu qǐ.', en: 'Sorry.' }, { t: '不。', r: 'bù.', en: 'No.' }] },
          { s: 'a', t: '再见！', r: 'zài jiàn!', en: 'Goodbye!' }
        ],
        numbers: [
          { s: 'a', t: '你几岁？', r: 'nǐ jǐ suì?', en: 'How old are you?' },
          { s: 'you', t: '我七岁。', r: 'wǒ qī suì.', en: "I'm seven.",
            wrong: [{ t: '谢谢。', r: 'xiè xie.', en: 'Thank you.' }, { t: '红色。', r: 'hóng sè.', en: 'Red.' }] },
          { s: 'a', t: '很好！', r: 'hěn hǎo!', en: 'Very good!' }
        ],
        colours: [
          { s: 'a', t: '你喜欢什么颜色？', r: 'nǐ xǐ huan shén me yán sè?', en: 'What colour do you like?' },
          { s: 'you', t: '我喜欢蓝色。', r: 'wǒ xǐ huan lán sè.', en: 'I like blue.',
            wrong: [{ t: '我七岁。', r: 'wǒ qī suì.', en: "I'm seven." }, { t: '再见。', r: 'zài jiàn.', en: 'Goodbye.' }] },
          { s: 'a', t: '我也喜欢蓝色！', r: 'wǒ yě xǐ huan lán sè!', en: 'I like blue too!' }
        ],
        family: [
          { s: 'a', t: '这是谁？', r: 'zhè shì shéi?', en: 'Who is this?' },
          { s: 'you', t: '这是我妈妈。', r: 'zhè shì wǒ mā ma.', en: 'This is my mum.',
            wrong: [{ t: '我喜欢蓝色。', r: 'wǒ xǐ huan lán sè.', en: 'I like blue.' }, { t: '谢谢。', r: 'xiè xie.', en: 'Thank you.' }] },
          { s: 'a', t: '阿姨好！', r: 'ā yí hǎo!', en: 'Hello, auntie!' }
        ],
        food: [
          { s: 'a', t: '你想吃什么？', r: 'nǐ xiǎng chī shén me?', en: 'What do you want to eat?' },
          { s: 'you', t: '我想吃面条。', r: 'wǒ xiǎng chī miàn tiáo.', en: 'I want to eat noodles.',
            wrong: [{ t: '这是我妈妈。', r: 'zhè shì wǒ mā ma.', en: 'This is my mum.' }, { t: '早上好。', r: 'zǎo shang hǎo.', en: 'Good morning.' }] },
          { s: 'a', t: '好，给你！', r: 'hǎo, gěi nǐ!', en: 'OK, here you go!' }
        ]
      }
    },

    es: {
      id: 'es', order: 2, name: 'Spanish', native: 'Español', flagWord: 'Hola',
      voice: 'es', variant: 'Spanish', tones: null,
      words: {
        hello: { t: 'hola' },
        goodbye: { t: 'adiós' },
        thanks: { t: 'gracias' },
        yes: { t: 'sí' },
        no: { t: 'no' },
        please: { t: 'por favor' },
        sorry: { t: 'lo siento' },
        morning: { t: 'buenos días' },
        one: { t: 'uno' },
        two: { t: 'dos' },
        three: { t: 'tres' },
        four: { t: 'cuatro' },
        five: { t: 'cinco' },
        six: { t: 'seis' },
        seven: { t: 'siete' },
        eight: { t: 'ocho' },
        red: { t: 'rojo' },
        blue: { t: 'azul' },
        green: { t: 'verde' },
        yellow: { t: 'amarillo' },
        black: { t: 'negro' },
        white: { t: 'blanco' },
        pink: { t: 'rosa' },
        orange: { t: 'naranja' },
        mum: { t: 'la mamá', g: 'f' },
        dad: { t: 'el papá', g: 'm' },
        grandma: { t: 'la abuela', g: 'f' },
        grandpa: { t: 'el abuelo', g: 'm' },
        brother: { t: 'el hermano', g: 'm' },
        sister: { t: 'la hermana', g: 'f' },
        baby: { t: 'el bebé', g: 'm' },
        family: { t: 'la familia', g: 'f' },
        apple: { t: 'la manzana', g: 'f' },
        banana: { t: 'el plátano', g: 'm' },
        rice: { t: 'el arroz', g: 'm' },
        noodles: { t: 'los fideos', g: 'm' },
        water: { t: 'el agua', g: 'f' },
        milk: { t: 'la leche', g: 'f' },
        bread: { t: 'el pan', g: 'm' },
        egg: { t: 'el huevo', g: 'm' }
      },
      tips: {
        greetings: 'Spanish questions and exclamations start with an upside-down mark: ¡Hola! ¿Qué tal?',
        numbers: 'Uno becomes un before a masculine noun and una before a feminine one: un perro (one dog), una casa (one house).',
        colours: 'In Spanish the colour comes after the thing: un coche rojo is "a red car".',
        family: 'Every Spanish noun is masculine (el) or feminine (la). In this app, teal words are masculine and coral words are feminine.',
        food: 'Agua (water) is feminine, but it takes el because "la agua" is hard to say. That is why it shows in coral.'
      },
      dialogues: {
        greetings: [
          { s: 'a', t: '¡Buenos días!', en: 'Good morning!' },
          { s: 'you', t: '¡Buenos días!', en: 'Good morning!',
            wrong: [{ t: 'Lo siento.', en: 'Sorry.' }, { t: 'No.', en: 'No.' }] },
          { s: 'a', t: '¡Adiós!', en: 'Goodbye!' }
        ],
        numbers: [
          { s: 'a', t: '¿Cuántos años tienes?', en: 'How old are you?' },
          { s: 'you', t: 'Tengo siete años.', en: "I'm seven.",
            wrong: [{ t: 'Gracias.', en: 'Thank you.' }, { t: 'Rojo.', en: 'Red.' }] },
          { s: 'a', t: '¡Muy bien!', en: 'Very good!' }
        ],
        colours: [
          { s: 'a', t: '¿Qué color te gusta?', en: 'What colour do you like?' },
          { s: 'you', t: 'Me gusta el azul.', en: 'I like blue.',
            wrong: [{ t: 'Tengo siete años.', en: "I'm seven." }, { t: 'Adiós.', en: 'Goodbye.' }] },
          { s: 'a', t: '¡A mí también!', en: 'Me too!' }
        ],
        family: [
          { s: 'a', t: '¿Quién es?', en: 'Who is this?' },
          { s: 'you', t: 'Es mi mamá.', en: 'This is my mum.',
            wrong: [{ t: 'Me gusta el azul.', en: 'I like blue.' }, { t: 'Gracias.', en: 'Thank you.' }] },
          { s: 'a', t: '¡Hola, señora!', en: 'Hello, madam!' }
        ],
        food: [
          { s: 'a', t: '¿Qué quieres comer?', en: 'What do you want to eat?' },
          { s: 'you', t: 'Quiero fideos, por favor.', en: 'Noodles, please.',
            wrong: [{ t: 'Es mi mamá.', en: 'This is my mum.' }, { t: 'Buenos días.', en: 'Good morning.' }] },
          { s: 'a', t: '¡Aquí tienes!', en: 'Here you go!' }
        ]
      }
    },

    vi: {
      id: 'vi', order: 3, name: 'Vietnamese', native: 'Tiếng Việt', flagWord: 'Xin chào',
      voice: 'vi-VN', variant: 'Northern (Hanoi)', tones: 'vietnamese',
      words: {
        hello: { t: 'xin chào' },
        goodbye: { t: 'tạm biệt' },
        thanks: { t: 'cảm ơn' },
        yes: { t: 'vâng' },
        no: { t: 'không' },
        please: { t: 'làm ơn' },
        sorry: { t: 'xin lỗi' },
        morning: { t: 'chào buổi sáng' },
        one: { t: 'một' },
        two: { t: 'hai' },
        three: { t: 'ba' },
        four: { t: 'bốn' },
        five: { t: 'năm' },
        six: { t: 'sáu' },
        seven: { t: 'bảy' },
        eight: { t: 'tám' },
        red: { t: 'màu đỏ' },
        blue: { t: 'màu xanh lam' },
        green: { t: 'màu xanh lá cây' },
        yellow: { t: 'màu vàng' },
        black: { t: 'màu đen' },
        white: { t: 'màu trắng' },
        pink: { t: 'màu hồng' },
        orange: { t: 'màu cam' },
        mum: { t: 'mẹ' },
        dad: { t: 'bố' },
        grandma: { t: 'bà' },
        grandpa: { t: 'ông' },
        brother: { t: 'anh trai' },
        sister: { t: 'chị gái' },
        baby: { t: 'em bé' },
        family: { t: 'gia đình' },
        apple: { t: 'quả táo' },
        banana: { t: 'quả chuối' },
        rice: { t: 'cơm' },
        noodles: { t: 'mì' },
        water: { t: 'nước' },
        milk: { t: 'sữa' },
        bread: { t: 'bánh mì' },
        egg: { t: 'quả trứng' }
      },
      tips: {
        greetings: 'Northern Vietnamese has six tones, shown by marks above or below a vowel. In xin chào, xin is flat and chào falls.',
        numbers: 'Numbers are single syllables, so tones matter: năm (five) and nằm (to lie down) differ only by tone.',
        colours: 'Colours start with màu (colour): màu đỏ is "colour red". The colour comes after the thing: áo đỏ is "a red shirt".',
        family: 'Family words also mean "I" and "you". A child talking to a parent calls themselves con.',
        food: 'In the North, fruit words start with quả: quả táo, quả chuối. In the South people say trái instead.'
      },
      dialogues: {
        greetings: [
          { s: 'a', t: 'Chào buổi sáng!', en: 'Good morning!' },
          { s: 'you', t: 'Chào buổi sáng!', en: 'Good morning!',
            wrong: [{ t: 'Xin lỗi.', en: 'Sorry.' }, { t: 'Không.', en: 'No.' }] },
          { s: 'a', t: 'Tạm biệt!', en: 'Goodbye!' }
        ],
        numbers: [
          { s: 'a', t: 'Con mấy tuổi?', en: 'How old are you?' },
          { s: 'you', t: 'Con bảy tuổi.', en: "I'm seven.",
            wrong: [{ t: 'Cảm ơn.', en: 'Thank you.' }, { t: 'Màu đỏ.', en: 'Red.' }] },
          { s: 'a', t: 'Giỏi quá!', en: 'Very good!' }
        ],
        colours: [
          { s: 'a', t: 'Con thích màu gì?', en: 'What colour do you like?' },
          { s: 'you', t: 'Con thích màu xanh lam.', en: 'I like blue.',
            wrong: [{ t: 'Con bảy tuổi.', en: "I'm seven." }, { t: 'Tạm biệt.', en: 'Goodbye.' }] },
          { s: 'a', t: 'Tuyệt quá!', en: 'Great!' }
        ],
        family: [
          { s: 'a', t: 'Đây là ai?', en: 'Who is this?' },
          { s: 'you', t: 'Đây là mẹ con.', en: 'This is my mum.',
            wrong: [{ t: 'Con thích màu xanh lam.', en: 'I like blue.' }, { t: 'Cảm ơn.', en: 'Thank you.' }] },
          { s: 'a', t: 'Chào cô!', en: 'Hello, madam!' }
        ],
        food: [
          { s: 'a', t: 'Con muốn ăn gì?', en: 'What do you want to eat?' },
          { s: 'you', t: 'Con muốn ăn mì ạ.', en: 'I want noodles, please.',
            wrong: [{ t: 'Đây là mẹ con.', en: 'This is my mum.' }, { t: 'Chào buổi sáng.', en: 'Good morning.' }] },
          { s: 'a', t: 'Đây, con ăn đi!', en: 'Here, eat up!' }
        ]
      }
    }
  };

  var BANDS = {
    pre: { id: 'pre', label: 'Pre-reader', blurb: 'Pictures and sounds, no reading', practise: 6, check: 4, review: 6, options: 3 },
    early: { id: 'early', label: 'Early reader', blurb: 'Pictures, simple words and pinyin', practise: 8, check: 5, review: 8, options: 4 },
    adult: { id: 'adult', label: 'Adult', blurb: 'Full lessons, typing and grammar tips', practise: 8, check: 5, review: 8, options: 4 }
  };

  function langList() {
    return Object.keys(LANGUAGES).map(function (k) { return LANGUAGES[k]; })
      .sort(function (a, b) { return a.order - b.order; });
  }
  function defaultLang() {
    var d = langList().filter(function (l) { return l.isDefault; })[0];
    return (d || langList()[0]).id;
  }
  function unitById(id) { return UNITS.filter(function (u) { return u.id === id; })[0] || null; }
  function conceptById(id) {
    for (var i = 0; i < UNITS.length; i++) {
      for (var j = 0; j < UNITS[i].concepts.length; j++) {
        if (UNITS[i].concepts[j].id === id) return { unit: UNITS[i], concept: UNITS[i].concepts[j] };
      }
    }
    return null;
  }

  LQ.UNITS = UNITS;
  LQ.LANGUAGES = LANGUAGES;
  LQ.BANDS = BANDS;
  LQ.langList = langList;
  LQ.defaultLang = defaultLang;
  LQ.unitById = unitById;
  LQ.conceptById = conceptById;
})(typeof window !== 'undefined' ? (window.LQ = window.LQ || {}) : (globalThis.LQ = globalThis.LQ || {}));

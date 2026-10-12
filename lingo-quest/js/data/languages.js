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
    ] },
    { id: 'animals', title: 'Animals', emblem: 'dog', concepts: [
      { id: 'dog', en: 'dog' },
      { id: 'cat', en: 'cat' },
      { id: 'bird', en: 'bird' },
      { id: 'fish', en: 'fish' },
      { id: 'rabbit', en: 'rabbit' },
      { id: 'horse', en: 'horse' },
      { id: 'cow', en: 'cow' },
      { id: 'pig', en: 'pig' }
    ] },
    { id: 'body', title: 'Body', emblem: 'nose', concepts: [
      { id: 'head', en: 'head' },
      { id: 'eye', en: 'eye' },
      { id: 'ear', en: 'ear' },
      { id: 'nose', en: 'nose' },
      { id: 'mouth', en: 'mouth' },
      { id: 'hand', en: 'hand' },
      { id: 'foot', en: 'foot' },
      { id: 'hair', en: 'hair' }
    ] },
    { id: 'home', title: 'At home', emblem: 'house', concepts: [
      { id: 'house', en: 'house' },
      { id: 'door', en: 'door' },
      { id: 'window', en: 'window' },
      { id: 'bed', en: 'bed' },
      { id: 'table', en: 'table' },
      { id: 'chair', en: 'chair' },
      { id: 'book', en: 'book' },
      { id: 'tv', en: 'TV' }
    ] },
    { id: 'clothes', title: 'Clothes', emblem: 'shirt', concepts: [
      { id: 'shirt', en: 'shirt' },
      { id: 'trousers', en: 'trousers' },
      { id: 'shoes', en: 'shoes' },
      { id: 'socks', en: 'socks' },
      { id: 'hat', en: 'hat' },
      { id: 'dress', en: 'dress' },
      { id: 'coat', en: 'coat' },
      { id: 'glasses', en: 'glasses' }
    ] },
    { id: 'weather', title: 'Weather', emblem: 'rainbow', concepts: [
      { id: 'sun', en: 'sun' },
      { id: 'rain', en: 'rain' },
      { id: 'wind', en: 'wind' },
      { id: 'snow', en: 'snow' },
      { id: 'cloud', en: 'cloud' },
      { id: 'hot', en: 'hot' },
      { id: 'cold', en: 'cold' },
      { id: 'rainbow', en: 'rainbow' }
    ] }
  ];


  /* Worlds group units five at a time so the map fits on one screen. */
  var WORLDS = [
    { id: 'w1', title: 'First words', units: ['greetings', 'numbers', 'colours', 'family', 'food'] },
    { id: 'w2', title: 'My world', units: ['animals', 'body', 'home', 'clothes', 'weather'] }
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
        egg: { t: '鸡蛋', r: 'jī dàn' },
        dog: { t: '狗', r: 'gǒu' },
        cat: { t: '猫', r: 'māo' },
        bird: { t: '鸟', r: 'niǎo' },
        fish: { t: '鱼', r: 'yú' },
        rabbit: { t: '兔子', r: 'tù zi' },
        horse: { t: '马', r: 'mǎ' },
        cow: { t: '牛', r: 'niú' },
        pig: { t: '猪', r: 'zhū' },
        head: { t: '头', r: 'tóu' },
        eye: { t: '眼睛', r: 'yǎn jing' },
        ear: { t: '耳朵', r: 'ěr duo' },
        nose: { t: '鼻子', r: 'bí zi' },
        mouth: { t: '嘴巴', r: 'zuǐ ba' },
        hand: { t: '手', r: 'shǒu', hint: 'A hand with its fingers spread out.' },
        foot: { t: '脚', r: 'jiǎo' },
        hair: { t: '头发', r: 'tóu fa' },
        house: { t: '房子', r: 'fáng zi' },
        door: { t: '门', r: 'mén', hint: 'An open doorway you can walk through.' },
        window: { t: '窗户', r: 'chuāng hu' },
        bed: { t: '床', r: 'chuáng' },
        table: { t: '桌子', r: 'zhuō zi' },
        chair: { t: '椅子', r: 'yǐ zi' },
        book: { t: '书', r: 'shū' },
        tv: { t: '电视', r: 'diàn shì' },
        shirt: { t: '衬衫', r: 'chèn shān' },
        trousers: { t: '裤子', r: 'kù zi' },
        shoes: { t: '鞋子', r: 'xié zi' },
        socks: { t: '袜子', r: 'wà zi' },
        hat: { t: '帽子', r: 'mào zi' },
        dress: { t: '裙子', r: 'qún zi' },
        coat: { t: '外套', r: 'wài tào' },
        glasses: { t: '眼镜', r: 'yǎn jìng' },
        sun: { t: '太阳', r: 'tài yáng' },
        rain: { t: '雨', r: 'yǔ', hint: 'Raindrops falling from a cloud.' },
        wind: { t: '风', r: 'fēng' },
        snow: { t: '雪', r: 'xuě' },
        cloud: { t: '云', r: 'yún' },
        hot: { t: '热', r: 'rè' },
        cold: { t: '冷', r: 'lěng' },
        rainbow: { t: '彩虹', r: 'cǎi hóng' }
      },
      tips: {
        greetings: 'Chinese has four tones plus a light neutral one. In 你好 nǐ hǎo both syllables are third tone, so the first one rises: say it like "ní hǎo".',
        numbers: 'The first three numbers are just lines: 一 is one line, 二 is two, 三 is three. Count on your fingers as you say them.',
        colours: 'Colour words end in 色 sè, which means "colour". 红色 hóng sè is "red colour".',
        family: 'Family words often repeat a syllable: 妈妈 māma, 爸爸 bàba, 哥哥 gēge. The second syllable is short and light.',
        food: '请 qǐng means please. Say 请给我水 qǐng gěi wǒ shuǐ for "water, please".',
        animals: 'Many animal words are one character: 狗 gǒu, 猫 māo, 鱼 yú. Put 小 xiǎo (little) in front for a baby animal: 小狗 xiǎo gǒu is a puppy.',
        body: 'Listen for the tones: 眼睛 yǎnjing is eyes, but 眼镜 yǎnjìng (in Clothes) is glasses.',
        home: '房子 fángzi is the building. 家 jiā means home, and also family.',
        clothes: 'Lots of clothes words end in 子 zi: 裤子, 鞋子, 袜子, 帽子. Say the 子 short and light.',
        weather: '天气 tiānqì means weather. 今天很热 jīntiān hěn rè means "it is hot today".'
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
        ],
        animals: [
          { s: 'a', t: '你喜欢什么动物？', r: 'nǐ xǐ huan shén me dòng wù?', en: 'What animal do you like?' },
          { s: 'you', t: '我喜欢小狗。', r: 'wǒ xǐ huan xiǎo gǒu.', en: 'I like puppies.',
            wrong: [{ t: '我想吃面条。', r: 'wǒ xiǎng chī miàn tiáo.', en: 'I want to eat noodles.' }, { t: '早上好。', r: 'zǎo shang hǎo.', en: 'Good morning.' }] },
          { s: 'a', t: '我也喜欢！', r: 'wǒ yě xǐ huan!', en: 'Me too!' }
        ],
        body: [
          { s: 'a', t: '这是什么？', r: 'zhè shì shén me?', en: 'What is this?' },
          { s: 'you', t: '这是我的鼻子。', r: 'zhè shì wǒ de bí zi.', en: 'This is my nose.',
            wrong: [{ t: '我喜欢小狗。', r: 'wǒ xǐ huan xiǎo gǒu.', en: 'I like puppies.' }, { t: '再见。', r: 'zài jiàn.', en: 'Goodbye.' }] },
          { s: 'a', t: '对！', r: 'duì!', en: 'Right!' }
        ],
        home: [
          { s: 'a', t: '书在哪里？', r: 'shū zài nǎ lǐ?', en: 'Where is the book?' },
          { s: 'you', t: '在桌子上。', r: 'zài zhuō zi shang.', en: 'On the table.',
            wrong: [{ t: '这是我的鼻子。', r: 'zhè shì wǒ de bí zi.', en: 'This is my nose.' }, { t: '谢谢。', r: 'xiè xie.', en: 'Thank you.' }] },
          { s: 'a', t: '谢谢你！', r: 'xiè xie nǐ!', en: 'Thank you!' }
        ],
        clothes: [
          { s: 'a', t: '外面很冷。', r: 'wài miàn hěn lěng.', en: 'It\'s cold outside.' },
          { s: 'you', t: '我穿外套。', r: 'wǒ chuān wài tào.', en: 'I\'ll wear my coat.',
            wrong: [{ t: '在桌子上。', r: 'zài zhuō zi shang.', en: 'On the table.' }, { t: '我喜欢小狗。', r: 'wǒ xǐ huan xiǎo gǒu.', en: 'I like puppies.' }] },
          { s: 'a', t: '很好！', r: 'hěn hǎo!', en: 'Very good!' }
        ],
        weather: [
          { s: 'a', t: '今天天气怎么样？', r: 'jīn tiān tiān qì zěn me yàng?', en: 'What\'s the weather like today?' },
          { s: 'you', t: '今天下雨。', r: 'jīn tiān xià yǔ.', en: 'It\'s raining today.',
            wrong: [{ t: '我穿外套。', r: 'wǒ chuān wài tào.', en: 'I\'ll wear my coat.' }, { t: '谢谢。', r: 'xiè xie.', en: 'Thank you.' }] },
          { s: 'a', t: '带伞吧！', r: 'dài sǎn ba!', en: 'Take an umbrella!' }
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
        egg: { t: 'el huevo', g: 'm' },
        dog: { t: 'el perro', g: 'm' },
        cat: { t: 'el gato', g: 'm' },
        bird: { t: 'el pájaro', g: 'm' },
        fish: { t: 'el pez', g: 'm' },
        rabbit: { t: 'el conejo', g: 'm' },
        horse: { t: 'el caballo', g: 'm' },
        cow: { t: 'la vaca', g: 'f' },
        pig: { t: 'el cerdo', g: 'm' },
        head: { t: 'la cabeza', g: 'f' },
        eye: { t: 'el ojo', g: 'm' },
        ear: { t: 'la oreja', g: 'f' },
        nose: { t: 'la nariz', g: 'f' },
        mouth: { t: 'la boca', g: 'f' },
        hand: { t: 'la mano', g: 'f' },
        foot: { t: 'el pie', g: 'm' },
        hair: { t: 'el pelo', g: 'm' },
        house: { t: 'la casa', g: 'f' },
        door: { t: 'la puerta', g: 'f' },
        window: { t: 'la ventana', g: 'f' },
        bed: { t: 'la cama', g: 'f' },
        table: { t: 'la mesa', g: 'f' },
        chair: { t: 'la silla', g: 'f' },
        book: { t: 'el libro', g: 'm' },
        tv: { t: 'la tele', g: 'f' },
        shirt: { t: 'la camisa', g: 'f' },
        trousers: { t: 'los pantalones', g: 'm' },
        shoes: { t: 'los zapatos', g: 'm' },
        socks: { t: 'los calcetines', g: 'm' },
        hat: { t: 'el sombrero', g: 'm' },
        dress: { t: 'el vestido', g: 'm' },
        coat: { t: 'el abrigo', g: 'm' },
        glasses: { t: 'las gafas', g: 'f' },
        sun: { t: 'el sol', g: 'm' },
        rain: { t: 'la lluvia', g: 'f' },
        wind: { t: 'el viento', g: 'm' },
        snow: { t: 'la nieve', g: 'f' },
        cloud: { t: 'la nube', g: 'f' },
        hot: { t: 'hace calor' },
        cold: { t: 'hace frío' },
        rainbow: { t: 'el arcoíris', g: 'm' }
      },
      tips: {
        greetings: 'Spanish questions and exclamations start with an upside-down mark: ¡Hola! ¿Qué tal?',
        numbers: 'Uno becomes un before a masculine noun and una before a feminine one: un perro (one dog), una casa (one house).',
        colours: 'In Spanish the colour comes after the thing: un coche rojo is "a red car".',
        family: 'Every Spanish noun is masculine (el) or feminine (la). In this app, teal words are masculine and coral words are feminine.',
        food: 'Agua (water) is feminine, but it takes el because "la agua" is hard to say. That is why it shows in coral.',
        animals: 'Pez is a fish that is alive. Once it is cooked on your plate, it is pescado.',
        body: 'Mano (hand) ends in -o but is feminine: la mano. That is why it shows in coral.',
        home: 'La tele is the everyday short form of la televisión.',
        clothes: 'Pantalones, zapatos and calcetines are plural because they come in pairs. Gafas (glasses) is plural too.',
        weather: 'Weather uses hace: hace calor (it is hot), hace frío (it is cold), hace sol (it is sunny).'
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
        ],
        animals: [
          { s: 'a', t: '¿Qué animal te gusta?', en: 'What animal do you like?' },
          { s: 'you', t: 'Me gusta el perro.', en: 'I like dogs.',
            wrong: [{ t: 'Quiero fideos, por favor.', en: 'Noodles, please.' }, { t: 'Buenos días.', en: 'Good morning.' }] },
          { s: 'a', t: '¡A mí también!', en: 'Me too!' }
        ],
        body: [
          { s: 'a', t: '¿Qué es esto?', en: 'What is this?' },
          { s: 'you', t: 'Es mi nariz.', en: 'This is my nose.',
            wrong: [{ t: 'Me gusta el perro.', en: 'I like dogs.' }, { t: 'Adiós.', en: 'Goodbye.' }] },
          { s: 'a', t: '¡Muy bien!', en: 'Very good!' }
        ],
        home: [
          { s: 'a', t: '¿Dónde está el libro?', en: 'Where is the book?' },
          { s: 'you', t: 'Está en la mesa.', en: 'On the table.',
            wrong: [{ t: 'Es mi nariz.', en: 'This is my nose.' }, { t: 'Gracias.', en: 'Thank you.' }] },
          { s: 'a', t: '¡Gracias!', en: 'Thank you!' }
        ],
        clothes: [
          { s: 'a', t: 'Hace frío fuera.', en: 'It\'s cold outside.' },
          { s: 'you', t: 'Me pongo el abrigo.', en: 'I\'ll put my coat on.',
            wrong: [{ t: 'Está en la mesa.', en: 'On the table.' }, { t: 'Me gusta el perro.', en: 'I like dogs.' }] },
          { s: 'a', t: '¡Muy bien!', en: 'Very good!' }
        ],
        weather: [
          { s: 'a', t: '¿Qué tiempo hace hoy?', en: 'What\'s the weather like today?' },
          { s: 'you', t: 'Hoy llueve.', en: 'It\'s raining today.',
            wrong: [{ t: 'Me pongo el abrigo.', en: 'I\'ll put my coat on.' }, { t: 'Gracias.', en: 'Thank you.' }] },
          { s: 'a', t: '¡Lleva el paraguas!', en: 'Take the umbrella!' }
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
        egg: { t: 'quả trứng' },
        dog: { t: 'con chó' },
        cat: { t: 'con mèo' },
        bird: { t: 'con chim' },
        fish: { t: 'con cá' },
        rabbit: { t: 'con thỏ' },
        horse: { t: 'con ngựa' },
        cow: { t: 'con bò' },
        pig: { t: 'con lợn' },
        head: { t: 'đầu' },
        eye: { t: 'mắt' },
        ear: { t: 'tai' },
        nose: { t: 'mũi' },
        mouth: { t: 'miệng' },
        hand: { t: 'tay' },
        foot: { t: 'chân' },
        hair: { t: 'tóc' },
        house: { t: 'nhà' },
        door: { t: 'cái cửa' },
        window: { t: 'cửa sổ' },
        bed: { t: 'cái giường' },
        table: { t: 'cái bàn' },
        chair: { t: 'cái ghế' },
        book: { t: 'quyển sách' },
        tv: { t: 'ti vi' },
        shirt: { t: 'áo sơ mi' },
        trousers: { t: 'quần' },
        shoes: { t: 'giày' },
        socks: { t: 'tất' },
        hat: { t: 'mũ' },
        dress: { t: 'váy' },
        coat: { t: 'áo khoác' },
        glasses: { t: 'kính' },
        sun: { t: 'mặt trời' },
        rain: { t: 'mưa' },
        wind: { t: 'gió' },
        snow: { t: 'tuyết' },
        cloud: { t: 'mây' },
        hot: { t: 'nóng' },
        cold: { t: 'lạnh' },
        rainbow: { t: 'cầu vồng' }
      },
      tips: {
        greetings: 'Northern Vietnamese has six tones, shown by marks above or below a vowel. In xin chào, xin is flat and chào falls.',
        numbers: 'Numbers are single syllables, so tones matter: năm (five) and nằm (to lie down) differ only by tone.',
        colours: 'Colours start with màu (colour): màu đỏ is "colour red". The colour comes after the thing: áo đỏ is "a red shirt".',
        family: 'Family words also mean "I" and "you". A child talking to a parent calls themselves con.',
        food: 'In the North, fruit words start with quả: quả táo, quả chuối. In the South people say trái instead.',
        animals: 'Animal words start with con, used for living things: con chó, con mèo. In the North a pig is con lợn; in the South it is con heo.',
        body: 'Tay means both hand and arm, and chân means both foot and leg.',
        home: 'Cái goes before many objects: cái bàn (table), cái ghế (chair). Books use quyển: quyển sách.',
        clothes: 'In the North a hat is mũ and socks are tất. In the South people say nón and vớ.',
        weather: 'Trời means sky. Trời nóng means "it is hot" and trời mưa means "it is raining".'
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
        ],
        animals: [
          { s: 'a', t: 'Con thích con vật gì?', en: 'What animal do you like?' },
          { s: 'you', t: 'Con thích con chó.', en: 'I like dogs.',
            wrong: [{ t: 'Con muốn ăn mì ạ.', en: 'I want noodles, please.' }, { t: 'Chào buổi sáng.', en: 'Good morning.' }] },
          { s: 'a', t: 'Mẹ cũng thích!', en: 'I like them too!' }
        ],
        body: [
          { s: 'a', t: 'Đây là cái gì?', en: 'What is this?' },
          { s: 'you', t: 'Đây là mũi của con.', en: 'This is my nose.',
            wrong: [{ t: 'Con thích con chó.', en: 'I like dogs.' }, { t: 'Tạm biệt.', en: 'Goodbye.' }] },
          { s: 'a', t: 'Đúng rồi!', en: 'That\'s right!' }
        ],
        home: [
          { s: 'a', t: 'Quyển sách ở đâu?', en: 'Where is the book?' },
          { s: 'you', t: 'Ở trên bàn ạ.', en: 'On the table.',
            wrong: [{ t: 'Đây là mũi của con.', en: 'This is my nose.' }, { t: 'Cảm ơn.', en: 'Thank you.' }] },
          { s: 'a', t: 'Cảm ơn con!', en: 'Thank you!' }
        ],
        clothes: [
          { s: 'a', t: 'Ngoài trời lạnh lắm.', en: 'It\'s very cold outside.' },
          { s: 'you', t: 'Con mặc áo khoác.', en: 'I\'ll wear my coat.',
            wrong: [{ t: 'Ở trên bàn ạ.', en: 'On the table.' }, { t: 'Con thích con chó.', en: 'I like dogs.' }] },
          { s: 'a', t: 'Giỏi quá!', en: 'Very good!' }
        ],
        weather: [
          { s: 'a', t: 'Hôm nay trời thế nào?', en: 'What\'s the weather like today?' },
          { s: 'you', t: 'Hôm nay trời mưa.', en: 'It\'s raining today.',
            wrong: [{ t: 'Con mặc áo khoác.', en: 'I\'ll wear my coat.' }, { t: 'Cảm ơn.', en: 'Thank you.' }] },
          { s: 'a', t: 'Mang ô đi con!', en: 'Take an umbrella!' }
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

  function worldOf(unitId) { return WORLDS.filter(function (w) { return w.units.indexOf(unitId) >= 0; })[0] || null; }

  LQ.UNITS = UNITS;
  LQ.WORLDS = WORLDS;
  LQ.worldOf = worldOf;
  LQ.LANGUAGES = LANGUAGES;
  LQ.BANDS = BANDS;
  LQ.langList = langList;
  LQ.defaultLang = defaultLang;
  LQ.unitById = unitById;
  LQ.conceptById = conceptById;
})(typeof window !== 'undefined' ? (window.LQ = window.LQ || {}) : (globalThis.LQ = globalThis.LQ || {}));

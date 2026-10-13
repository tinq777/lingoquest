# Generates js/data/worlds-3-5.js from the tables below.
# Each word row: concept id, English, Chinese, pinyin, Spanish, Vietnamese, Arabic, Arabic spelling.
import json

WORLDS = [
 ('w3', 'My day', [
  ('time', 'Time', 'clock', [
   ('clock','clock','时钟','shí zhōng','el reloj','đồng hồ','ساعة',"sa'a"),
   ('day','daytime','白天','bái tiān','el día','ban ngày','نهار','nahar'),
   ('night','night','晚上','wǎn shang','la noche','ban đêm','ليل','layl'),
   ('today','today','今天','jīn tiān','hoy','hôm nay','اليوم','al-yawm'),
   ('tomorrow','tomorrow','明天','míng tiān','mañana','ngày mai','غدا','ghadan'),
   ('week','week','星期','xīng qī','la semana','tuần','أسبوع',"usbu'"),
   ('wakeup','wake up','起床','qǐ chuáng','despertarse','thức dậy','يستيقظ','yastayqiz'),
   ('sleep','sleep','睡觉','shuì jiào','dormir','ngủ','ينام','yanam'),
  ]),
  ('school', 'School', 'school', [
   ('school','school','学校','xué xiào','la escuela','trường học','مدرسة','madrasa'),
   ('teacher','teacher','老师','lǎo shī','el maestro','giáo viên','معلم',"mu'allim"),
   ('pencil','pencil','铅笔','qiān bǐ','el lápiz','bút chì','قلم رصاص','qalam rasas'),
   ('schoolbag','school bag','书包','shū bāo','la mochila','cặp sách','حقيبة','haqiba'),
   ('computer','computer','电脑','diàn nǎo','el ordenador','máy tính','حاسوب','hasub'),
   ('friend','friend','朋友','péng you','el amigo','bạn','صديق','sadiq'),
   ('doctor','doctor','医生','yī shēng','el médico','bác sĩ','طبيب','tabib'),
   ('work','work','工作','gōng zuò','el trabajo','công việc','عمل','amal'),
  ]),
  ('feelings', 'Feelings', 'happy', [
   ('happy','happy','开心','kāi xīn','feliz','vui','سعيد',"sa'id"),
   ('sad','sad','难过','nán guò','triste','buồn','حزين','hazin'),
   ('angry','angry','生气','shēng qì','enfadado','tức giận','غاضب','ghadib'),
   ('scared','scared','害怕','hài pà','asustado','sợ','خائف',"kha'if"),
   ('tired','tired','累','lèi','cansado','mệt','متعب',"mut'ab"),
   ('hungry','hungry','饿','è','hambriento','đói','جائع',"ja'i'"),
   ('surprised','surprised','惊讶','jīng yà','sorprendido','ngạc nhiên','متفاجئ',"mutafaji'"),
   ('laugh','laugh','笑','xiào','reír','cười','يضحك','yadhak'),
  ]),
  ('toys', 'Toys', 'kite', [
   ('ball','ball','球','qiú','la pelota','quả bóng','كرة','kura'),
   ('doll','doll','娃娃','wá wa','la muñeca','búp bê','دمية','dumya'),
   ('teddy','teddy bear','玩具熊','wán jù xióng','el peluche','gấu bông','دبدوب','dabdub'),
   ('kite','kite','风筝','fēng zheng','la cometa','con diều','طائرة ورقية','ta\'ira waraqiyya'),
   ('blocks','blocks','积木','jī mù','los bloques','đồ xếp hình','مكعبات',"muka'abat"),
   ('car','car','汽车','qì chē','el coche','ô tô','سيارة','sayyara'),
   ('drum','drum','鼓','gǔ','el tambor','cái trống','طبلة','tabla'),
   ('paint','paint','画画','huà huà','pintar','vẽ','يرسم','yarsum'),
  ]),
  ('sport', 'Sport', 'football', [
   ('football','football','足球','zú qiú','el fútbol','bóng đá','كرة القدم','kurat al-qadam'),
   ('basketball','basketball','篮球','lán qiú','el baloncesto','bóng rổ','كرة السلة','kurat as-salla'),
   ('tennis','tennis','网球','wǎng qiú','el tenis','quần vợt','التنس','at-tinis'),
   ('swim','swim','游泳','yóu yǒng','nadar','bơi','يسبح','yasbah'),
   ('run','run','跑步','pǎo bù','correr','chạy','يركض','yarkud'),
   ('bike','bike','自行车','zì xíng chē','la bicicleta','xe đạp','دراجة','darraja'),
   ('jump','jump','跳','tiào','saltar','nhảy','يقفز','yaqfiz'),
   ('medal','medal','奖牌','jiǎng pái','la medalla','huy chương','ميدالية','midaliya'),
  ]),
 ]),
 ('w4', 'Out and about', [
  ('shopping', 'Shopping', 'shop', [
   ('money','money','钱','qián','el dinero','tiền','نقود','nuqud'),
   ('shop','shop','商店','shāng diàn','la tienda','cửa hàng','متجر','matjar'),
   ('basket','basket','篮子','lán zi','la cesta','cái giỏ','سلة','salla'),
   ('trolley','trolley','购物车','gòu wù chē','el carrito','xe đẩy','عربة التسوق','arabat at-tasawwuq'),
   ('buy','buy','买','mǎi','comprar','mua','يشتري','yashtari'),
   ('cheap','cheap','便宜','pián yi','barato','rẻ','رخيص','rakhis'),
   ('expensive','expensive','贵','guì','caro','đắt','غالي','ghali'),
   ('price','price','价格','jià gé','el precio','giá','سعر',"si'r"),
  ]),
  ('transport', 'Getting around', 'bus', [
   ('bus','bus','公共汽车','gōng gòng qì chē','el autobús','xe buýt','حافلة','hafila'),
   ('train','train','火车','huǒ chē','el tren','tàu hỏa','قطار','qitar'),
   ('plane','plane','飞机','fēi jī','el avión','máy bay','طائرة',"ta'ira"),
   ('boat','boat','船','chuán','el barco','thuyền','قارب','qarib'),
   ('taxi','taxi','出租车','chū zū chē','el taxi','tắc xi','سيارة أجرة','sayyarat ujra'),
   ('walk','walk','走路','zǒu lù','caminar','đi bộ','يمشي','yamshi'),
   ('left','left','左边','zuǒ bian','izquierda','bên trái','يسار','yasar'),
   ('right','right','右边','yòu bian','derecha','bên phải','يمين','yamin'),
  ]),
  ('eating', 'Eating out', 'icecream', [
   ('restaurant','restaurant','餐厅','cān tīng','el restaurante','nhà hàng','مطعم',"mat'am"),
   ('menu','menu','菜单','cài dān','el menú','thực đơn','قائمة الطعام',"qa'imat at-ta'am"),
   ('chopsticks','chopsticks','筷子','kuài zi','los palillos','đôi đũa','عيدان الأكل','idan al-akl'),
   ('spoon','spoon','勺子','sháo zi','la cuchara','cái thìa','ملعقة',"mil'aqa"),
   ('fork','fork','叉子','chā zi','el tenedor','cái dĩa','شوكة','shawka'),
   ('cup','cup','杯子','bēi zi','la taza','cái cốc','كوب','kub'),
   ('icecream','ice cream','冰淇淋','bīng qí lín','el helado','kem','آيس كريم','ays krim'),
   ('delicious','delicious','好吃','hǎo chī','delicioso','ngon','لذيذ','ladhidh'),
  ]),
  ('town', 'In town', 'park', [
   ('park','park','公园','gōng yuán','el parque','công viên','حديقة','hadiqa'),
   ('hospital','hospital','医院','yī yuàn','el hospital','bệnh viện','مستشفى','mustashfa'),
   ('library','library','图书馆','tú shū guǎn','la biblioteca','thư viện','مكتبة','maktaba'),
   ('zoo','zoo','动物园','dòng wù yuán','el zoo','sở thú','حديقة الحيوان','hadiqat al-hayawan'),
   ('cinema','cinema','电影院','diàn yǐng yuàn','el cine','rạp chiếu phim','سينما','sinama'),
   ('beach','beach','海滩','hǎi tān','la playa','bãi biển','شاطئ',"shati'"),
   ('toilet','toilet','厕所','cè suǒ','el baño','nhà vệ sinh','حمام','hammam'),
   ('farm','farm','农场','nóng chǎng','la granja','trang trại','مزرعة',"mazra'a"),
  ]),
  ('holidays', 'Holidays', 'suitcase', [
   ('suitcase','suitcase','行李箱','xíng li xiāng','la maleta','va li','حقيبة سفر','haqibat safar'),
   ('passport','passport','护照','hù zhào','el pasaporte','hộ chiếu','جواز سفر','jawaz safar'),
   ('hotel','hotel','酒店','jiǔ diàn','el hotel','khách sạn','فندق','funduq'),
   ('map','map','地图','dì tú','el mapa','bản đồ','خريطة','kharita'),
   ('camera','camera','相机','xiàng jī','la cámara','máy ảnh','كاميرا','kamira'),
   ('ticket','ticket','票','piào','el billete','vé','تذكرة','tadhkira'),
   ('sea','sea','大海','dà hǎi','el mar','biển','بحر','bahr'),
   ('holiday','holiday','假期','jià qī','las vacaciones','kỳ nghỉ','عطلة','utla'),
  ]),
 ]),
 ('w5', 'Visiting family', [
  ('relatives', 'Relatives', 'parents', [
   ('uncle','uncle','叔叔','shū shu','el tío','chú','عم','amm'),
   ('aunt','aunt','阿姨','ā yí','la tía','cô','عمة','amma'),
   ('cousin','cousin','表哥','biǎo gē','el primo','anh họ','ابن العم','ibn al-amm'),
   ('littlebrother','little brother','弟弟','dì di','el hermanito','em trai','أخ صغير','akh saghir'),
   ('littlesister','little sister','妹妹','mèi mei','la hermanita','em gái','أخت صغيرة','ukht saghira'),
   ('son','son','儿子','ér zi','el hijo','con trai','ابن','ibn'),
   ('daughter','daughter','女儿','nǚ ér','la hija','con gái','ابنة','ibna'),
   ('parents','parents','父母','fù mǔ','los padres','bố mẹ','والدان','walidan'),
  ]),
  ('visiting', 'Visiting', 'tea', [
   ('kitchen','kitchen','厨房','chú fáng','la cocina','nhà bếp','مطبخ','matbakh'),
   ('garden','garden','花园','huā yuán','el jardín','khu vườn','بستان','bustan'),
   ('sofa','sofa','沙发','shā fā','el sofá','ghế sô pha','أريكة','arika'),
   ('tea','tea','茶','chá','el té','trà','شاي','shay'),
   ('cake','cake','蛋糕','dàn gāo','la tarta','bánh ngọt','كعكة',"ka'ka"),
   ('photo','photo','照片','zhào piàn','la foto','bức ảnh','صورة','sura'),
   ('flower','flower','花','huā','la flor','bông hoa','زهرة','zahra'),
   ('lamp','lamp','灯','dēng','la lámpara','cái đèn','مصباح','misbah'),
  ]),
  ('festivals', 'Festivals', 'lantern', [
   ('newyear','Lunar New Year','春节','chūn jié','el Año Nuevo Lunar','Tết','رأس السنة القمرية',"ra's as-sana al-qamariyya"),
   ('lantern','lantern','灯笼','dēng long','el farolillo','đèn lồng','فانوس','fanus'),
   ('redenvelope','red envelope','红包','hóng bāo','el sobre rojo','lì xì','ظرف أحمر','zarf ahmar'),
   ('fireworks','fireworks','烟花','yān huā','los fuegos artificiales','pháo hoa','ألعاب نارية',"al'ab nariyya"),
   ('dragon','dragon','龙','lóng','el dragón','con rồng','تنين','tinnin'),
   ('mooncake','mooncake','月饼','yuè bing','el pastel de luna','bánh trung thu','كعكة القمر',"ka'kat al-qamar"),
   ('birthday','birthday','生日','shēng rì','el cumpleaños','sinh nhật','عيد ميلاد','id milad'),
   ('christmas','Christmas','圣诞节','shèng dàn jié','la Navidad','Giáng sinh','عيد الميلاد المجيد','id al-milad al-majid'),
  ]),
  ('aboutme', 'About me', 'australia', [
   ('name','name','名字','míng zi','el nombre','tên','اسم','ism'),
   ('age','age','年龄','nián líng','la edad','tuổi','عمر','umr'),
   ('live','live','住','zhù','vivir','sống','يسكن','yaskun'),
   ('like','like','喜欢','xǐ huan','gustar','thích','يحب','yuhibb'),
   ('country','country','国家','guó jiā','el país','đất nước','بلد','balad'),
   ('language','language','语言','yǔ yán','el idioma','ngôn ngữ','لغة','lugha'),
   ('speak','speak','说','shuō','hablar','nói','يتكلم','yatakallam'),
   ('australia','Australia','澳大利亚','ào dà lì yà','Australia','nước Úc','أستراليا','usturalya'),
  ]),
  ('goodbyes', 'Goodbyes', 'hug', [
   ('seeyou','see you','下次见','xià cì jiàn','hasta luego','hẹn gặp lại','أراك لاحقا','araka lahiqan'),
   ('welcome',"you're welcome",'不客气','bú kè qi','de nada','không có gì','عفوا','afwan'),
   ('hug','hug','拥抱','yōng bào','el abrazo','cái ôm','عناق','inaq'),
   ('phone','phone','电话','diàn huà','el teléfono','điện thoại','هاتف','hatif'),
   ('missyou','miss you','想你','xiǎng nǐ','te echo de menos','nhớ bạn','اشتقت إليك','ishtaqtu ilayk'),
   ('comeback','come back','再来','zài lái','vuelve pronto','quay lại nhé','عد قريبا','ud qariban'),
   ('goodluck','good luck','祝你好运','zhù nǐ hǎo yùn','buena suerte','chúc may mắn','حظا سعيدا',"hazzan sa'idan"),
   ('havefun','have fun','玩得开心','wán de kāi xīn','diviértete','chơi vui nhé','استمتع',"istamti'"),
  ]),
 ]),
]

# Chats: (asker line, your line, closing line), each (text, [romanisation,] English).
CHATS = {
 'zh': {
  'time': [('现在几点？','xiàn zài jǐ diǎn?','What time is it?'),('七点了。','qī diǎn le.',"It's seven o'clock."),('该起床了！','gāi qǐ chuáng le!','Time to get up!')],
  'school': [('你喜欢学校吗？','nǐ xǐ huan xué xiào ma?','Do you like school?'),('喜欢，我喜欢学校。','xǐ huan, wǒ xǐ huan xué xiào.','Yes, I like school.'),('太好了！','tài hǎo le!',"That's great!")],
  'feelings': [('你今天开心吗？','nǐ jīn tiān kāi xīn ma?','Are you happy today?'),('我很开心！','wǒ hěn kāi xīn!',"I'm very happy!"),('我也是！','wǒ yě shì!','Me too!')],
  'toys': [('你想玩吗？','nǐ xiǎng wán ma?','Do you want to play?'),('想！我们玩球吧。','xiǎng! wǒ men wán qiú ba.',"Yes! Let's play ball."),('好，接住！','hǎo, jiē zhù!','OK, catch!')],
  'sport': [('你喜欢什么运动？','nǐ xǐ huan shén me yùn dòng?','What sport do you like?'),('我喜欢足球。','wǒ xǐ huan zú qiú.','I like football.'),('我也是！','wǒ yě shì!','Me too!')],
  'shopping': [('你要买什么？','nǐ yào mǎi shén me?','What would you like to buy?'),('这个多少钱？','zhè ge duō shao qián?','How much is this?'),('十块钱。','shí kuài qián.','Ten yuan.')],
  'transport': [('我们怎么去公园？','wǒ men zěn me qù gōng yuán?','How do we get to the park?'),('坐公共汽车吧。','zuò gōng gòng qì chē ba.',"Let's take the bus."),('好主意！','hǎo zhǔ yi!','Good idea!')],
  'eating': [('你要点什么？','nǐ yào diǎn shén me?','What would you like?'),('请给我冰淇淋。','qǐng gěi wǒ bīng qí lín.','Ice cream, please.'),('好的，给你！','hǎo de, gěi nǐ!','OK, here you go!')],
  'town': [('我们今天去哪里？','wǒ men jīn tiān qù nǎ lǐ?','Where are we going today?'),('去动物园吧！','qù dòng wù yuán ba!',"Let's go to the zoo!"),('太好了！','tài hǎo le!','Great!')],
  'holidays': [('假期我们去哪里？','jià qī wǒ men qù nǎ lǐ?','Where are we going on holiday?'),('去海边！','qù hǎi biān!','To the beach!'),('别忘了护照！','bié wàng le hù zhào!',"Don't forget your passport!")],
  'relatives': [('你好！你长高了！','nǐ hǎo! nǐ zhǎng gāo le!',"Hello! You've grown so tall!"),('阿姨好！','ā yí hǎo!','Hello, auntie!'),('快进来！','kuài jìn lái!','Come in, come in!')],
  'visiting': [('你想喝茶吗？','nǐ xiǎng hē chá ma?','Would you like some tea?'),('想，还要蛋糕！','xiǎng, hái yào dàn gāo!','Yes please, and cake!'),('给你！','gěi nǐ!','Here you go!')],
  'festivals': [('新年快乐！','xīn nián kuài lè!','Happy New Year!'),('恭喜发财！','gōng xǐ fā cái!','Wishing you good fortune!'),('给你红包！','gěi nǐ hóng bāo!',"Here's a red envelope!")],
  'aboutme': [('你是哪国人？','nǐ shì nǎ guó rén?','Where are you from?'),('我是澳大利亚人。','wǒ shì ào dà lì yà rén.',"I'm Australian."),('欢迎你！','huān yíng nǐ!','Welcome!')],
  'goodbyes': [('下次再来！','xià cì zài lái!','Come again soon!'),('谢谢！下次见！','xiè xie! xià cì jiàn!','Thank you! See you next time!'),('一路平安！','yí lù píng ān!','Have a safe trip!')],
 },
 'es': {
  'time': [('¿Qué hora es?','What time is it?'),('Son las siete.',"It's seven o'clock."),('¡Hora de levantarse!','Time to get up!')],
  'school': [('¿Te gusta la escuela?','Do you like school?'),('Sí, me gusta la escuela.','Yes, I like school.'),('¡Qué bien!',"That's great!")],
  'feelings': [('¿Cómo estás hoy?','How are you today?'),('¡Estoy muy feliz!',"I'm very happy!"),('¡Yo también!','Me too!')],
  'toys': [('¿Quieres jugar?','Do you want to play?'),('¡Sí! Juguemos a la pelota.',"Yes! Let's play ball."),('¡Vale, atrapa!','OK, catch!')],
  'sport': [('¿Qué deporte te gusta?','What sport do you like?'),('Me gusta el fútbol.','I like football.'),('¡A mí también!','Me too!')],
  'shopping': [('¿Qué quieres comprar?','What would you like to buy?'),('¿Cuánto cuesta esto?','How much is this?'),('Diez euros.','Ten euros.')],
  'transport': [('¿Cómo vamos al parque?','How do we get to the park?'),('Vamos en autobús.',"Let's take the bus."),('¡Buena idea!','Good idea!')],
  'eating': [('¿Qué vas a tomar?','What would you like?'),('Un helado, por favor.','Ice cream, please.'),('¡Aquí tienes!','Here you go!')],
  'town': [('¿Adónde vamos hoy?','Where are we going today?'),('¡Vamos al zoo!',"Let's go to the zoo!"),('¡Qué bien!','Great!')],
  'holidays': [('¿Adónde vamos de vacaciones?','Where are we going on holiday?'),('¡A la playa!','To the beach!'),('¡No olvides el pasaporte!',"Don't forget your passport!")],
  'relatives': [('¡Hola! ¡Qué alto estás!',"Hello! You've grown so tall!"),('¡Hola, tía!','Hello, auntie!'),('¡Pasa, pasa!','Come in, come in!')],
  'visiting': [('¿Quieres un té?','Would you like some tea?'),('¡Sí, por favor, y tarta!','Yes please, and cake!'),('¡Aquí tienes!','Here you go!')],
  'festivals': [('¡Feliz Año Nuevo!','Happy New Year!'),('¡Feliz Año Nuevo! ¡Mucha suerte!','Happy New Year! Good luck!'),('¡Toma, un sobre rojo!',"Here's a red envelope!")],
  'aboutme': [('¿De dónde eres?','Where are you from?'),('Soy de Australia.',"I'm from Australia."),('¡Bienvenido!','Welcome!')],
  'goodbyes': [('¡Vuelve pronto!','Come back soon!'),('¡Gracias! ¡Hasta luego!','Thank you! See you!'),('¡Buen viaje!','Have a safe trip!')],
 },
 'vi': {
  'time': [('Mấy giờ rồi?','What time is it?'),('Bảy giờ rồi ạ.',"It's seven o'clock."),('Dậy thôi con!','Time to get up!')],
  'school': [('Con có thích đi học không?','Do you like school?'),('Có, con thích đi học.','Yes, I like school.'),('Tốt quá!',"That's great!")],
  'feelings': [('Hôm nay con thấy thế nào?','How do you feel today?'),('Con vui lắm!',"I'm very happy!"),('Mẹ cũng vậy!','Me too!')],
  'toys': [('Con muốn chơi không?','Do you want to play?'),('Có! Chơi bóng đi.',"Yes! Let's play ball."),('Được, bắt nhé!','OK, catch!')],
  'sport': [('Con thích môn thể thao nào?','What sport do you like?'),('Con thích bóng đá.','I like football.'),('Bố cũng thích!','I like it too!')],
  'shopping': [('Con muốn mua gì?','What would you like to buy?'),('Cái này bao nhiêu tiền ạ?','How much is this?'),('Mười nghìn đồng.','Ten thousand dong.')],
  'transport': [('Mình đi công viên bằng gì?','How do we get to the park?'),('Đi xe buýt đi.',"Let's take the bus."),('Ý hay đấy!','Good idea!')],
  'eating': [('Con muốn gọi món gì?','What would you like?'),('Cho con một cái kem ạ.','Ice cream, please.'),('Đây, của con!','Here you go!')],
  'town': [('Hôm nay mình đi đâu?','Where are we going today?'),('Đi sở thú đi!',"Let's go to the zoo!"),('Tuyệt quá!','Great!')],
  'holidays': [('Kỳ nghỉ này mình đi đâu?','Where are we going on holiday?'),('Đi biển ạ!','To the beach!'),('Đừng quên hộ chiếu nhé!',"Don't forget your passport!")],
  'relatives': [('Chào con! Con cao quá!',"Hello! You've grown so tall!"),('Con chào cô ạ!','Hello, auntie!'),('Vào nhà đi con!','Come in!')],
  'visiting': [('Con uống trà không?','Would you like some tea?'),('Dạ có, và bánh ngọt nữa!','Yes please, and cake!'),('Đây con!','Here you go!')],
  'festivals': [('Chúc mừng năm mới!','Happy New Year!'),('Chúc mừng năm mới ạ!','Happy New Year to you!'),('Lì xì cho con này!',"Here's some lucky money!")],
  'aboutme': [('Con đến từ đâu?','Where are you from?'),('Con đến từ nước Úc.',"I'm from Australia."),('Chào mừng con!','Welcome!')],
  'goodbyes': [('Lần sau lại đến nhé!','Come again soon!'),('Cảm ơn ạ! Hẹn gặp lại!','Thank you! See you!'),('Thượng lộ bình an!','Have a safe trip!')],
 },
 'ar': {
  'time': [('كم الساعة؟','kam as-sa\'a?','What time is it?'),('الساعة السابعة.',"as-sa'a as-sabi'a.","It's seven o'clock."),('حان وقت الاستيقاظ!','hana waqt al-istiqaz!','Time to get up!')],
  'school': [('هل تحب المدرسة؟','hal tuhibbu al-madrasa?','Do you like school?'),('نعم، أحب المدرسة.',"na'am, uhibbu al-madrasa.",'Yes, I like school.'),('رائع!',"ra'i'!","That's great!")],
  'feelings': [('كيف تشعر اليوم؟',"kayfa tash'ur al-yawm?",'How do you feel today?'),('أنا سعيد جدا!',"ana sa'id jiddan!","I'm very happy!"),('وأنا أيضا!','wa ana aydan!','Me too!')],
  'toys': [('هل تريد أن تلعب؟',"hal turid an tal'ab?",'Do you want to play?'),('نعم! لنلعب بالكرة.',"na'am! li-nal'ab bil-kura.","Yes! Let's play ball."),('حسنا، التقط!','hasanan, iltaqit!','OK, catch!')],
  'sport': [('ما الرياضة التي تحبها؟','ma ar-riyada allati tuhibbuha?','What sport do you like?'),('أحب كرة القدم.','uhibbu kurat al-qadam.','I like football.'),('وأنا أيضا!','wa ana aydan!','Me too!')],
  'shopping': [('ماذا تريد أن تشتري؟','madha turid an tashtari?','What would you like to buy?'),('بكم هذا؟','bikam hadha?','How much is this?'),('عشرة دراهم.','ashrat darahim.','Ten dirhams.')],
  'transport': [('كيف نذهب إلى الحديقة؟','kayfa nadhhab ila al-hadiqa?','How do we get to the park?'),('لنركب الحافلة.','li-narkab al-hafila.',"Let's take the bus."),('فكرة جيدة!','fikra jayyida!','Good idea!')],
  'eating': [('ماذا تطلب؟','madha tatlub?','What would you like?'),('آيس كريم من فضلك.','ays krim min fadlik.','Ice cream, please.'),('تفضل!','tafaddal!','Here you go!')],
  'town': [('إلى أين نذهب اليوم؟','ila ayna nadhhab al-yawm?','Where are we going today?'),('لنذهب إلى حديقة الحيوان!','li-nadhhab ila hadiqat al-hayawan!',"Let's go to the zoo!"),('رائع!',"ra'i'!",'Great!')],
  'holidays': [('إلى أين نسافر في العطلة؟','ila ayna nusafir fi al-utla?','Where are we going on holiday?'),('إلى الشاطئ!',"ila ash-shati'!",'To the beach!'),('لا تنس جواز السفر!','la tansa jawaz as-safar!',"Don't forget your passport!")],
  'relatives': [('مرحبا! لقد كبرت!','marhaban! laqad kabirta!',"Hello! You've grown so tall!"),('مرحبا يا عمتي!','marhaban ya ammati!','Hello, auntie!'),('تفضل بالدخول!','tafaddal bid-dukhul!','Come in!')],
  'visiting': [('هل تريد شايا؟','hal turid shayan?','Would you like some tea?'),('نعم من فضلك، وكعكة!',"na'am min fadlik, wa ka'ka!",'Yes please, and cake!'),('تفضل!','tafaddal!','Here you go!')],
  'festivals': [('سنة سعيدة!',"sana sa'ida!",'Happy New Year!'),('كل عام وأنتم بخير!','kull am wa antum bikhayr!','Wishing you well every year!'),('هذا ظرف أحمر لك!','hadha zarf ahmar lak!',"Here's a red envelope!")],
  'aboutme': [('من أين أنت؟','min ayna anta?','Where are you from?'),('أنا من أستراليا.','ana min usturalya.',"I'm from Australia."),('أهلا بك!','ahlan bik!','Welcome!')],
  'goodbyes': [('عد قريبا!','ud qariban!','Come back soon!'),('شكرا! أراك لاحقا!','shukran! araka lahiqan!','Thank you! See you!'),('رحلة سعيدة!',"rihla sa'ida!",'Have a safe trip!')],
 },
}

TIPS = {
 'zh': {
  'time': '今天 jīntiān is today and 明天 míngtiān is tomorrow. 天 tiān means day, so both words end with it.',
  'school': '老师 lǎoshī means teacher. Children greet their teacher with 老师好 lǎoshī hǎo!',
  'feelings': 'Put 很 hěn (very) before a feeling: 我很开心 wǒ hěn kāixīn means "I am very happy".',
  'toys': 'Use 玩 wán for playing: 玩球 wán qiú is "play ball".',
  'sport': 'Many ball games end in 球 qiú (ball): 足球 is football, 篮球 basketball and 网球 tennis.',
  'shopping': '多少钱？ duōshao qián? asks "how much money?". 块 kuài is the everyday word for one yuan.',
  'transport': 'Use 坐 zuò (sit) for buses, trains and planes: 坐火车 zuò huǒchē means "go by train".',
  'eating': '好吃 hǎochī means tasty, literally "good to eat". 好喝 hǎohē is "good to drink".',
  'town': 'Many places end in 园 yuán (garden) or 馆 guǎn (hall): 公园 park, 动物园 zoo, 图书馆 library.',
  'holidays': 'Before a trip people say 一路平安 yílù píng\'ān, "safe travels all the way".',
  'relatives': 'Chinese has separate words for older and younger: 哥哥 gēge is an older brother and 弟弟 dìdi a younger one.',
  'visiting': 'Guests often bring fruit or a small gift, and hosts say 请坐 qǐng zuò, "please sit down".',
  'festivals': 'At 春节 Chūnjié, children get 红包 hóngbāo, red envelopes with money inside, and say 恭喜发财 gōngxǐ fācái.',
  'aboutme': 'Add 人 rén (person) after a country to say where someone is from: 澳大利亚人 is an Australian.',
  'goodbyes': '不客气 búkèqi answers 谢谢. It means "you\'re welcome", literally "don\'t be so polite".',
 },
 'es': {
  'time': 'Mañana means tomorrow, but la mañana means the morning. Hoy is today.',
  'school': 'A male teacher is el maestro and a female teacher is la maestra.',
  'feelings': 'Feelings use estar: estoy feliz, estoy cansado. A girl says cansada, ending in -a.',
  'toys': 'Jugar means to play: juego a la pelota is "I play ball".',
  'sport': 'Fútbol is football. Many sports words come from English, like el tenis.',
  'shopping': '¿Cuánto cuesta? means "how much does it cost?". Barato is cheap and caro is expensive.',
  'transport': 'Use en for transport: en autobús, en tren. On foot is a pie.',
  'eating': 'To ask for the bill, say "la cuenta, por favor".',
  'town': 'El baño is the toilet. To ask where it is, say "¿Dónde está el baño?".',
  'holidays': 'Vacaciones is always plural: las vacaciones.',
  'relatives': 'Add -ito or -ita for little: hermano becomes hermanito, a little brother.',
  'visiting': 'Guests often hear "¡Estás en tu casa!", which means "make yourself at home".',
  'festivals': 'Spanish children open presents at Christmas and also on 6 January, el Día de Reyes.',
  'aboutme': 'To say your name, use "Me llamo…", which means "I call myself…".',
  'goodbyes': 'De nada answers gracias. It means "it\'s nothing".',
 },
 'vi': {
  'time': 'Hôm nay is today, ngày mai is tomorrow and hôm qua is yesterday.',
  'school': 'Children call a female teacher cô and a male teacher thầy.',
  'feelings': 'Add lắm after a feeling for "very": vui lắm is "very happy".',
  'toys': 'Chơi means to play: chơi bóng is "play ball".',
  'sport': 'Many ball games start with bóng (ball): bóng đá is football and bóng rổ is basketball.',
  'shopping': 'Bao nhiêu tiền? means "how much money?". Vietnamese money is the đồng.',
  'transport': 'Use đi bằng for "go by": đi bằng xe buýt is "go by bus".',
  'eating': 'In the North a spoon is cái thìa and a cup is cái cốc. In the South people say muỗng and ly.',
  'town': 'Many place words start with nhà (house): nhà hàng is a restaurant and nhà vệ sinh a toilet.',
  'holidays': 'Đi du lịch means to go travelling.',
  'relatives': 'Vietnamese has separate words for older and younger: anh is an older brother and em trai a younger one.',
  'visiting': 'Add ạ at the end of a sentence to be polite to older people: Con cảm ơn ạ.',
  'festivals': 'At Tết, children wish their elders a happy new year and get lì xì, lucky money in red envelopes.',
  'aboutme': 'To say your name: Con tên là… means "My name is…".',
  'goodbyes': 'Không có gì answers cảm ơn. It means "it\'s nothing".',
 },
 'ar': {
  'time': 'اليوم al-yawm means both "today" and "the day". غدا ghadan is tomorrow.',
  'school': 'A male teacher is معلم mu\'allim and a female teacher is معلمة mu\'allima.',
  'feelings': 'Feelings change for girls: a boy is سعيد sa\'id and a girl is سعيدة sa\'ida.',
  'toys': 'لعبة lu\'ba means both a toy and a game.',
  'sport': 'كرة kura means ball, so football is كرة القدم, "ball of the foot".',
  'shopping': 'To ask a price, say بكم هذا؟ bikam hadha?, "for how much is this?".',
  'transport': 'يمين yamin is right and يسار yasar is left.',
  'eating': 'Before a meal, many people say بالهناء والشفاء bil-hana\' wash-shifa\', "enjoy your meal".',
  'town': 'مكتبة maktaba is a library and also a bookshop. It comes from k-t-b, like كتاب kitab (book).',
  'holidays': 'When someone travels, people say مع السلامة ma\'a as-salama, "go safely".',
  'relatives': 'Arabic has different words for each side of the family: عم amm is a father\'s brother and خال khal a mother\'s brother.',
  'visiting': 'Hosts welcome guests with أهلا وسهلا ahlan wa sahlan.',
  'festivals': 'At Eid, people greet each other with عيد مبارك id mubarak, "blessed Eid".',
  'aboutme': 'To say your name: اسمي ismi… means "my name is…".',
  'goodbyes': 'عفوا afwan answers شكرا shukran. It means "you\'re welcome".',
 },
}

def q(x): return x.replace('\\', '\\\\').replace("'", "\\'")
def gender(es):
    import re
    m = re.match(r'^(el|la|los|las)\s', es)
    if not m: return None
    return 'f' if m.group(1) in ('la', 'las') else 'm'

out = []
out.append("/* Lingo Quest — worlds 3 to 5: My day, Out and about, Visiting family.\n   Generated from tables; adds units, words, tips and chats to the registries. */")
out.append("(function (LQ) {\n  'use strict';\n  var L = LQ.LANGUAGES;")
units = []
allunits = []
for wid, wtitle, ulist in WORLDS:
    out.append("  LQ.WORLDS.push({ id: '%s', title: '%s', units: [%s] });" % (wid, q(wtitle), ', '.join("'%s'" % u[0] for u in ulist)))
    for uid, utitle, emblem, rows in ulist:
        allunits.append(uid)
        cs = ', '.join("{ id: '%s', en: '%s' }" % (r[0], q(r[1])) for r in rows)
        out.append("  LQ.UNITS.push({ id: '%s', title: '%s', emblem: '%s', concepts: [%s] });" % (uid, q(utitle), emblem, cs))
words = {'zh': [], 'es': [], 'vi': [], 'ar': []}
for wid, wtitle, ulist in WORLDS:
    for uid, utitle, emblem, rows in ulist:
        for cid, en, zh, py, es, vi, ar, arr in rows:
            words['zh'].append("%s: { t: '%s', r: '%s' }" % (cid, q(zh), q(py)))
            g = gender(es)
            words['es'].append("%s: { t: '%s'%s }" % (cid, q(es), (", g: '%s'" % g) if g else ''))
            words['vi'].append("%s: { t: '%s' }" % (cid, q(vi)))
            words['ar'].append("%s: { t: '%s', r: '%s' }" % (cid, q(ar), q(arr)))
def line(lang, x, s):
    if lang in ('zh', 'ar'):
        t, r, en = x
        return "{ s: '%s', t: '%s', r: '%s', en: '%s' }" % (s, q(t), q(r), q(en))
    t, en = x
    return "{ s: '%s', t: '%s', en: '%s' }" % (s, q(t), q(en))
def wline(lang, x):
    return line(lang, x, 'x').replace("s: 'x', ", '')
for lang in ('zh', 'es', 'vi', 'ar'):
    out.append("  Object.assign(L.%s.words, {\n    %s\n  });" % (lang, ',\n    '.join(words[lang])))
    out.append("  Object.assign(L.%s.tips, {\n    %s\n  });" % (lang, ',\n    '.join("%s: '%s'" % (u, q(TIPS[lang][u])) for u in allunits)))
    ds = []
    n = len(allunits)
    for i, u in enumerate(allunits):
        a, y, c = CHATS[lang][u]
        w1 = CHATS[lang][allunits[(i + 1) % n]][1]
        w2 = CHATS[lang][allunits[(i + 2) % n]][1]
        assert w1[0] != y[0] and w2[0] != y[0], (lang, u)
        yl = line(lang, y, 'you')[:-2] + ",\n        wrong: [%s, %s] }" % (wline(lang, w1), wline(lang, w2))
        ds.append("%s: [\n      %s,\n      %s,\n      %s\n    ]" % (u, line(lang, a, 'a'), yl, line(lang, c, 'a')))
    out.append("  Object.assign(L.%s.dialogues, {\n    %s\n  });" % (lang, ',\n    '.join(ds)))
out.append("})(typeof window !== 'undefined' ? (window.LQ = window.LQ || {}) : (globalThis.LQ = globalThis.LQ || {}));\n")
open('/home/claude/lingo-quest/js/data/worlds-3-5.js', 'w').write('\n'.join(out))
print('units', len(allunits), 'words per language', len(words['zh']))

import { Word } from "../types";

export const wordDatabase: Word[] = [
  // =============================================
  // === EASY (60 words) ===
  // =============================================

  // Turkish
  { id: "e1", word: "Merhaba", language: "Turkish", country: "Turkey", countryFlag: "🇹🇷", difficulty: "easy", pronunciation: "mer-ha-ba", acceptedPronunciations: ["merhaba", "mer haba", "meraba", "mare haba"] },
  { id: "e2", word: "Teşekkürler", language: "Turkish", country: "Turkey", countryFlag: "🇹🇷", difficulty: "easy", pronunciation: "te-shek-kür-ler", acceptedPronunciations: ["tesekkurler", "teshekurler", "te shek ur ler"] },
  { id: "e3", word: "Evet", language: "Turkish", country: "Turkey", countryFlag: "🇹🇷", difficulty: "easy", pronunciation: "e-vet", acceptedPronunciations: ["evet", "a vet", "evett"] },
  { id: "e4", word: "Hayır", language: "Turkish", country: "Turkey", countryFlag: "🇹🇷", difficulty: "easy", pronunciation: "ha-yır", acceptedPronunciations: ["hayir", "hi year", "hi er"] },

  // Spanish
  { id: "e5", word: "Hola", language: "Spanish", country: "Spain", countryFlag: "🇪🇸", difficulty: "easy", pronunciation: "oh-la", acceptedPronunciations: ["hola", "ola", "oh la", "oh lah"] },
  { id: "e6", word: "Gracias", language: "Spanish", country: "Spain", countryFlag: "🇪🇸", difficulty: "easy", pronunciation: "gra-si-as", acceptedPronunciations: ["gracias", "grasias", "gra see us"] },
  { id: "e7", word: "Amigo", language: "Spanish", country: "Mexico", countryFlag: "🇲🇽", difficulty: "easy", pronunciation: "a-mi-go", acceptedPronunciations: ["amigo", "a me go", "a migo", "ah mee go"] },
  { id: "e8", word: "Bueno", language: "Spanish", country: "Spain", countryFlag: "🇪🇸", difficulty: "easy", pronunciation: "bwe-no", acceptedPronunciations: ["bueno", "bweno", "bway no"] },

  // French
  { id: "e9", word: "Bonjour", language: "French", country: "France", countryFlag: "🇫🇷", difficulty: "easy", pronunciation: "bon-jur", acceptedPronunciations: ["bonjour", "bon jour", "bonjur", "bone jour"] },
  { id: "e10", word: "Merci", language: "French", country: "France", countryFlag: "🇫🇷", difficulty: "easy", pronunciation: "mer-si", acceptedPronunciations: ["merci", "mersi", "mercy", "mer see"] },
  { id: "e11", word: "Oui", language: "French", country: "France", countryFlag: "🇫🇷", difficulty: "easy", pronunciation: "wi", acceptedPronunciations: ["oui", "we", "wee", "whee"] },
  { id: "e12", word: "Baguette", language: "French", country: "France", countryFlag: "🇫🇷", difficulty: "easy", pronunciation: "ba-get", acceptedPronunciations: ["baguette", "baguet", "ba get", "bag it"] },

  // German
  { id: "e13", word: "Danke", language: "German", country: "Germany", countryFlag: "🇩🇪", difficulty: "easy", pronunciation: "dan-ke", acceptedPronunciations: ["danke", "dunke", "donke", "dunk a"] },
  { id: "e14", word: "Hallo", language: "German", country: "Germany", countryFlag: "🇩🇪", difficulty: "easy", pronunciation: "ha-lo", acceptedPronunciations: ["hallo", "halo", "ha lo"] },
  { id: "e15", word: "Bitte", language: "German", country: "Germany", countryFlag: "🇩🇪", difficulty: "easy", pronunciation: "bi-te", acceptedPronunciations: ["bitte", "bitter", "bit a", "bita"] },
  { id: "e16", word: "Nein", language: "German", country: "Germany", countryFlag: "🇩🇪", difficulty: "easy", pronunciation: "nayn", acceptedPronunciations: ["nein", "nine", "nayn"] },

  // Italian
  { id: "e17", word: "Ciao", language: "Italian", country: "Italy", countryFlag: "🇮🇹", difficulty: "easy", pronunciation: "chao", acceptedPronunciations: ["ciao", "chao", "chow"] },
  { id: "e18", word: "Grazie", language: "Italian", country: "Italy", countryFlag: "🇮🇹", difficulty: "easy", pronunciation: "gra-tsi-ye", acceptedPronunciations: ["grazie", "gratsie", "grotsy", "grazi"] },
  { id: "e19", word: "Pizza", language: "Italian", country: "Italy", countryFlag: "🇮🇹", difficulty: "easy", pronunciation: "pit-tsa", acceptedPronunciations: ["pizza", "peetsa", "pete's a", "pit sa"] },
  { id: "e20", word: "Amore", language: "Italian", country: "Italy", countryFlag: "🇮🇹", difficulty: "easy", pronunciation: "a-mo-re", acceptedPronunciations: ["amore", "a more", "amor", "a moray"] },

  // Japanese
  { id: "e21", word: "Konnichiwa", language: "Japanese", country: "Japan", countryFlag: "🇯🇵", difficulty: "easy", pronunciation: "kon-ni-chi-wa", acceptedPronunciations: ["konnichiwa", "konichiwa", "con nichi wa", "connie chee wa"] },
  { id: "e22", word: "Arigatou", language: "Japanese", country: "Japan", countryFlag: "🇯🇵", difficulty: "easy", pronunciation: "a-ri-ga-tou", acceptedPronunciations: ["arigatou", "arigato", "arrigato", "are e got o"] },
  { id: "e23", word: "Sumimasen", language: "Japanese", country: "Japan", countryFlag: "🇯🇵", difficulty: "easy", pronunciation: "su-mi-ma-sen", acceptedPronunciations: ["sumimasen", "sue me ma sen", "sue me ma son", "sue me mosen"] },
  { id: "e24", word: "Kawaii", language: "Japanese", country: "Japan", countryFlag: "🇯🇵", difficulty: "easy", pronunciation: "ka-wa-ii", acceptedPronunciations: ["kawaii", "ka wa ee", "co wa e", "kawayi"] },

  // Portuguese
  { id: "e25", word: "Obrigado", language: "Portuguese", country: "Brazil", countryFlag: "🇧🇷", difficulty: "easy", pronunciation: "ob-ri-ga-do", acceptedPronunciations: ["obrigado", "obrigadu", "oh bree god oh", "obriga do"] },
  { id: "e26", word: "Oi", language: "Portuguese", country: "Brazil", countryFlag: "🇧🇷", difficulty: "easy", pronunciation: "oy", acceptedPronunciations: ["oi", "oy", "oh e", "oui"] },
  { id: "e27", word: "Saudade", language: "Portuguese", country: "Brazil", countryFlag: "🇧🇷", difficulty: "easy", pronunciation: "sau-da-de", acceptedPronunciations: ["saudade", "saw daddy", "so daddy", "so da de"] },

  // Korean
  { id: "e28", word: "Annyeong", language: "Korean", country: "South Korea", countryFlag: "🇰🇷", difficulty: "easy", pronunciation: "an-nyeong", acceptedPronunciations: ["annyeong", "anyong", "an young", "on young"] },
  { id: "e29", word: "Kamsahamnida", language: "Korean", country: "South Korea", countryFlag: "🇰🇷", difficulty: "easy", pronunciation: "kam-sa-ham-ni-da", acceptedPronunciations: ["kamsahamnida", "come sa ham knee da", "gum sa ham ni da", "come so hominy da"] },

  // Greek
  { id: "e30", word: "Yassou", language: "Greek", country: "Greece", countryFlag: "🇬🇷", difficulty: "easy", pronunciation: "ya-su", acceptedPronunciations: ["yassou", "yassu", "ya sue", "yeah sue"] },
  { id: "e31", word: "Efcharisto", language: "Greek", country: "Greece", countryFlag: "🇬🇷", difficulty: "easy", pronunciation: "ef-ha-ri-sto", acceptedPronunciations: ["efcharisto", "ef harry stow", "of harry stow", "f haristo"] },

  // Dutch
  { id: "e32", word: "Dankjewel", language: "Dutch", country: "Netherlands", countryFlag: "🇳🇱", difficulty: "easy", pronunciation: "dank-ye-vel", acceptedPronunciations: ["dankjewel", "dunk you well", "dank ya vel"] },
  { id: "e33", word: "Hoi", language: "Dutch", country: "Netherlands", countryFlag: "🇳🇱", difficulty: "easy", pronunciation: "hoy", acceptedPronunciations: ["hoi", "hoy", "hi", "hey"] },

  // Swedish
  { id: "e34", word: "Hej", language: "Swedish", country: "Sweden", countryFlag: "🇸🇪", difficulty: "easy", pronunciation: "hey", acceptedPronunciations: ["hej", "hey", "hay", "he"] },
  { id: "e35", word: "Tack", language: "Swedish", country: "Sweden", countryFlag: "🇸🇪", difficulty: "easy", pronunciation: "tak", acceptedPronunciations: ["tack", "talk", "tuck", "tak"] },

  // Swahili
  { id: "e36", word: "Jambo", language: "Swahili", country: "Kenya", countryFlag: "🇰🇪", difficulty: "easy", pronunciation: "jam-bo", acceptedPronunciations: ["jambo", "jom bow", "jam bow"] },
  { id: "e37", word: "Asante", language: "Swahili", country: "Tanzania", countryFlag: "🇹🇿", difficulty: "easy", pronunciation: "a-san-te", acceptedPronunciations: ["asante", "a sante", "a san tay", "us on tay"] },

  // Hawaiian
  { id: "e38", word: "Aloha", language: "Hawaiian", country: "USA", countryFlag: "🇺🇸", difficulty: "easy", pronunciation: "a-lo-ha", acceptedPronunciations: ["aloha", "a low ha", "a lo ha", "a low huh"] },
  { id: "e39", word: "Mahalo", language: "Hawaiian", country: "USA", countryFlag: "🇺🇸", difficulty: "easy", pronunciation: "ma-ha-lo", acceptedPronunciations: ["mahalo", "ma ha lo", "ma hollow", "my hollow"] },

  // Hindi
  { id: "e40", word: "Namaste", language: "Hindi", country: "India", countryFlag: "🇮🇳", difficulty: "easy", pronunciation: "na-ma-ste", acceptedPronunciations: ["namaste", "nama stay", "nah must day", "nomis day"] },

  // Arabic
  { id: "e41", word: "Salaam", language: "Arabic", country: "Saudi Arabia", countryFlag: "🇸🇦", difficulty: "easy", pronunciation: "sa-laam", acceptedPronunciations: ["salaam", "salam", "sa lam"] },

  // Russian
  { id: "e42", word: "Privet", language: "Russian", country: "Russia", countryFlag: "🇷🇺", difficulty: "easy", pronunciation: "pri-vet", acceptedPronunciations: ["privet", "pre vet"] },
  { id: "e43", word: "Da", language: "Russian", country: "Russia", countryFlag: "🇷🇺", difficulty: "easy", pronunciation: "da", acceptedPronunciations: ["da", "duh"] },

  // Chinese
  { id: "e44", word: "Nǐ hǎo", language: "Chinese", country: "China", countryFlag: "🇨🇳", difficulty: "easy", pronunciation: "nee-hao", acceptedPronunciations: ["ni hao", "nihao", "knee how", "nee how"] },

  // Thai
  { id: "e45", word: "Sawasdee", language: "Thai", country: "Thailand", countryFlag: "🇹🇭", difficulty: "easy", pronunciation: "sa-wat-dee", acceptedPronunciations: ["sawasdee", "sawadee", "sa what d", "swat d"] },

  // Vietnamese
  { id: "e46", word: "Xin chào", language: "Vietnamese", country: "Vietnam", countryFlag: "🇻🇳", difficulty: "easy", pronunciation: "sin-chao", acceptedPronunciations: ["xin chao", "sin chow", "seen chow", "sin chao"] },

  // Maori
  { id: "e47", word: "Kia ora", language: "Maori", country: "New Zealand", countryFlag: "🇳🇿", difficulty: "easy", pronunciation: "kee-a-o-ra", acceptedPronunciations: ["kia ora", "kia or a", "key or a", "kia aura"] },

  // Filipino
  { id: "e48", word: "Salamat", language: "Filipino", country: "Philippines", countryFlag: "🇵🇭", difficulty: "easy", pronunciation: "sa-la-mat", acceptedPronunciations: ["salamat", "sala mat", "so la mot"] },

  // Norwegian
  { id: "e49", word: "Takk", language: "Norwegian", country: "Norway", countryFlag: "🇳🇴", difficulty: "easy", pronunciation: "takk", acceptedPronunciations: ["takk", "talk", "tuck", "tack"] },

  // Romanian
  { id: "e50", word: "Bună", language: "Romanian", country: "Romania", countryFlag: "🇷🇴", difficulty: "easy", pronunciation: "bu-nə", acceptedPronunciations: ["buna", "boo na", "bunna", "boona"] },

  // Croatian
  { id: "e51", word: "Hvala", language: "Croatian", country: "Croatia", countryFlag: "🇭🇷", difficulty: "easy", pronunciation: "hva-la", acceptedPronunciations: ["hvala", "vala", "fala", "holla"] },

  // Czech
  { id: "e52", word: "Ahoj", language: "Czech", country: "Czech Republic", countryFlag: "🇨🇿", difficulty: "easy", pronunciation: "a-hoy", acceptedPronunciations: ["ahoj", "ahoy", "a hoy", "ahh hoy"] },

  // Persian
  { id: "e53", word: "Mersi", language: "Persian", country: "Iran", countryFlag: "🇮🇷", difficulty: "easy", pronunciation: "mer-si", acceptedPronunciations: ["mersi", "mercy", "mer see", "merci"] },

  // Indonesian
  { id: "e54", word: "Terima kasih", language: "Indonesian", country: "Indonesia", countryFlag: "🇮🇩", difficulty: "easy", pronunciation: "te-ri-ma ka-si", acceptedPronunciations: ["terima kasih", "terry my ka see", "trema kasi", "tree ma ca see"] },

  // Mongolian
  { id: "e55", word: "Sain bainuu", language: "Mongolian", country: "Mongolia", countryFlag: "🇲🇳", difficulty: "easy", pronunciation: "sayn-bay-noo", acceptedPronunciations: ["sain bainuu", "sign by new", "sane by new", "sine by new"] },

  // Georgian
  { id: "e56", word: "Gamarjoba", language: "Georgian", country: "Georgia", countryFlag: "🇬🇪", difficulty: "easy", pronunciation: "ga-mar-jo-ba", acceptedPronunciations: ["gamarjoba", "gamma job a", "go mar joe ba", "gum are job a"] },

  // Zulu
  { id: "e57", word: "Sawubona", language: "Zulu", country: "South Africa", countryFlag: "🇿🇦", difficulty: "easy", pronunciation: "sa-wu-bo-na", acceptedPronunciations: ["sawubona", "so we bona", "saw bona", "sa wu bone a"] },

  // Yoruba
  { id: "e58", word: "Bawo ni", language: "Yoruba", country: "Nigeria", countryFlag: "🇳🇬", difficulty: "easy", pronunciation: "ba-wo-ni", acceptedPronunciations: ["bawo ni", "bow oh knee", "bah wo nee", "ba won e"] },

  // Catalan
  { id: "e59", word: "Adéu", language: "Catalan", country: "Spain", countryFlag: "🇪🇸", difficulty: "easy", pronunciation: "a-dew", acceptedPronunciations: ["adeu", "add you", "a dew", "a day you"] },

  // Maltese
  { id: "e60", word: "Grazzi", language: "Maltese", country: "Malta", countryFlag: "🇲🇹", difficulty: "easy", pronunciation: "grat-si", acceptedPronunciations: ["grazzi", "got see", "grazi", "grotsie"] },

  // =============================================
  // === MEDIUM (60 words) ===
  // =============================================

  // Turkish
  { id: "m1", word: "Günaydın", language: "Turkish", country: "Turkey", countryFlag: "🇹🇷", difficulty: "medium", pronunciation: "gü-nay-dın", acceptedPronunciations: ["gunaydin", "goo nigh dun", "gonna done", "gun eye din"] },
  { id: "m2", word: "Hoşgeldiniz", language: "Turkish", country: "Turkey", countryFlag: "🇹🇷", difficulty: "medium", pronunciation: "hosh-gel-di-niz", acceptedPronunciations: ["hosgeldiniz", "hosh geldiniz", "hosh gel din is", "hose gel din ease"] },
  { id: "m3", word: "Görüşürüz", language: "Turkish", country: "Turkey", countryFlag: "🇹🇷", difficulty: "medium", pronunciation: "gö-rü-shü-rüz", acceptedPronunciations: ["gorusuruz", "gore oo sure ooze", "go ru shoo ruse", "guru shoes"] },

  // French
  { id: "m4", word: "Croissant", language: "French", country: "France", countryFlag: "🇫🇷", difficulty: "medium", pronunciation: "krwa-son", acceptedPronunciations: ["croissant", "kwason", "krwason", "crosson"] },
  { id: "m5", word: "Entrepreneur", language: "French", country: "France", countryFlag: "🇫🇷", difficulty: "medium", pronunciation: "on-tre-pre-neur", acceptedPronunciations: ["entrepreneur", "ontrepreneur", "entre pro newer", "on tra pra nur"] },
  { id: "m6", word: "Rendez-vous", language: "French", country: "France", countryFlag: "🇫🇷", difficulty: "medium", pronunciation: "ron-dey-vu", acceptedPronunciations: ["rendezvous", "ron day voo", "renday voo", "rond a voo"] },
  { id: "m7", word: "Au revoir", language: "French", country: "France", countryFlag: "🇫🇷", difficulty: "medium", pronunciation: "oh-re-vwar", acceptedPronunciations: ["au revoir", "oh ruh vwar", "oh rev wah", "o rev war"] },

  // German
  { id: "m8", word: "Schmetterling", language: "German", country: "Germany", countryFlag: "🇩🇪", difficulty: "medium", pronunciation: "shmet-ter-ling", acceptedPronunciations: ["schmetterling", "shmetterling", "shmetering", "sh met her ling"] },
  { id: "m9", word: "Entschuldigung", language: "German", country: "Germany", countryFlag: "🇩🇪", difficulty: "medium", pronunciation: "ent-shul-di-gung", acceptedPronunciations: ["entschuldigung", "entshuldigung", "enshuldigung", "in school d gung"] },
  { id: "m10", word: "Kindergarten", language: "German", country: "Germany", countryFlag: "🇩🇪", difficulty: "medium", pronunciation: "kin-der-gar-ten", acceptedPronunciations: ["kindergarten", "kinder garden", "kinder garten"] },
  { id: "m11", word: "Gesundheit", language: "German", country: "Germany", countryFlag: "🇩🇪", difficulty: "medium", pronunciation: "ge-zund-hayt", acceptedPronunciations: ["gesundheit", "gazoon tight", "goes on tight", "ga zoond height"] },

  // Japanese
  { id: "m12", word: "Sayounara", language: "Japanese", country: "Japan", countryFlag: "🇯🇵", difficulty: "medium", pronunciation: "sa-yo-u-na-ra", acceptedPronunciations: ["sayounara", "sayonara", "sionara", "say oh nara"] },
  { id: "m13", word: "Itadakimasu", language: "Japanese", country: "Japan", countryFlag: "🇯🇵", difficulty: "medium", pronunciation: "i-ta-da-ki-ma-su", acceptedPronunciations: ["itadakimasu", "itadakimas", "eat a ducky moss", "eat a doc e moss"] },
  { id: "m14", word: "Ganbatte", language: "Japanese", country: "Japan", countryFlag: "🇯🇵", difficulty: "medium", pronunciation: "gan-bat-te", acceptedPronunciations: ["ganbatte", "gone but a", "gun bought a", "gum baa tay"] },
  { id: "m15", word: "Sugoi", language: "Japanese", country: "Japan", countryFlag: "🇯🇵", difficulty: "medium", pronunciation: "su-go-i", acceptedPronunciations: ["sugoi", "sue go e", "su goy", "sue goo e"] },

  // Chinese
  { id: "m16", word: "Xièxiè", language: "Chinese", country: "China", countryFlag: "🇨🇳", difficulty: "medium", pronunciation: "shye-shye", acceptedPronunciations: ["xiexie", "shye shye", "shieshie", "she she"] },
  { id: "m17", word: "Zàijiàn", language: "Chinese", country: "China", countryFlag: "🇨🇳", difficulty: "medium", pronunciation: "dzay-jyen", acceptedPronunciations: ["zaijian", "zi gen", "dzy gen", "zai jian"] },
  { id: "m18", word: "Ganbei", language: "Chinese", country: "China", countryFlag: "🇨🇳", difficulty: "medium", pronunciation: "gan-bay", acceptedPronunciations: ["ganbei", "gone bay", "gun bay", "gum bay"] },

  // Russian
  { id: "m19", word: "Spasibo", language: "Russian", country: "Russia", countryFlag: "🇷🇺", difficulty: "medium", pronunciation: "spa-si-bo", acceptedPronunciations: ["spasibo", "spasiba", "spaseebo", "spa see bo"] },
  { id: "m20", word: "Zdravstvuyte", language: "Russian", country: "Russia", countryFlag: "🇷🇺", difficulty: "medium", pronunciation: "zdra-stvuy-tye", acceptedPronunciations: ["zdravstvuyte", "zdrastvuyte", "stras vuitye", "zdra stvoy tye"] },
  { id: "m21", word: "Dosvidaniya", language: "Russian", country: "Russia", countryFlag: "🇷🇺", difficulty: "medium", pronunciation: "dos-vi-da-ni-ya", acceptedPronunciations: ["dosvidaniya", "das vidanya", "dos vee don ya", "daz vee danya"] },

  // Arabic
  { id: "m22", word: "Shukran", language: "Arabic", country: "Saudi Arabia", countryFlag: "🇸🇦", difficulty: "medium", pronunciation: "shuk-ran", acceptedPronunciations: ["shukran", "shookran", "shukren", "shoe kran"] },
  { id: "m23", word: "Marhaba", language: "Arabic", country: "Saudi Arabia", countryFlag: "🇸🇦", difficulty: "medium", pronunciation: "mar-ha-ba", acceptedPronunciations: ["marhaba", "merheba", "marheba", "mar haba"] },
  { id: "m24", word: "Inshallah", language: "Arabic", country: "Saudi Arabia", countryFlag: "🇸🇦", difficulty: "medium", pronunciation: "in-sha-la", acceptedPronunciations: ["inshallah", "in sha la", "in shall a", "insha allah"] },
  { id: "m25", word: "Yalla", language: "Arabic", country: "Saudi Arabia", countryFlag: "🇸🇦", difficulty: "medium", pronunciation: "yal-la", acceptedPronunciations: ["yalla", "yella", "ya la", "yeah la"] },

  // Hindi
  { id: "m26", word: "Dhanyavaad", language: "Hindi", country: "India", countryFlag: "🇮🇳", difficulty: "medium", pronunciation: "dhan-ya-vaad", acceptedPronunciations: ["dhanyavaad", "dhanyavad", "danyavad", "done ya vod"] },
  { id: "m27", word: "Shukriya", language: "Hindi", country: "India", countryFlag: "🇮🇳", difficulty: "medium", pronunciation: "shuk-ri-ya", acceptedPronunciations: ["shukriya", "shoe cree ya", "shook re a"] },

  // Korean
  { id: "m28", word: "Annyeonghaseyo", language: "Korean", country: "South Korea", countryFlag: "🇰🇷", difficulty: "medium", pronunciation: "an-nyeong-ha-se-yo", acceptedPronunciations: ["annyeonghaseyo", "on young ha say yo", "an yong haseyo", "ah knee on ha say oh"] },
  { id: "m29", word: "Saranghae", language: "Korean", country: "South Korea", countryFlag: "🇰🇷", difficulty: "medium", pronunciation: "sa-rang-he", acceptedPronunciations: ["saranghae", "sa rang hey", "so wrong hey", "sir on hey"] },

  // Portuguese
  { id: "m30", word: "Desculpa", language: "Portuguese", country: "Brazil", countryFlag: "🇧🇷", difficulty: "medium", pronunciation: "des-kul-pa", acceptedPronunciations: ["desculpa", "desk cool pa", "this cool pa", "des culpa"] },
  { id: "m31", word: "Parabéns", language: "Portuguese", country: "Brazil", countryFlag: "🇧🇷", difficulty: "medium", pronunciation: "pa-ra-bens", acceptedPronunciations: ["parabens", "para bens", "para baines", "power benz"] },

  // Polish
  { id: "m32", word: "Dziękuję", language: "Polish", country: "Poland", countryFlag: "🇵🇱", difficulty: "medium", pronunciation: "jen-ku-ye", acceptedPronunciations: ["dziekuje", "jen koo yeah", "jane coup yeah", "jen koo yeh"] },
  { id: "m33", word: "Przepraszam", language: "Polish", country: "Poland", countryFlag: "🇵🇱", difficulty: "medium", pronunciation: "pshe-pra-sham", acceptedPronunciations: ["przepraszam", "sh prash om", "pshe prasham", "shay pra shom"] },

  // Czech
  { id: "m34", word: "Děkuji", language: "Czech", country: "Czech Republic", countryFlag: "🇨🇿", difficulty: "medium", pronunciation: "dye-ku-yi", acceptedPronunciations: ["dekuji", "yeah could ye", "deck oo ye", "deco ye"] },

  // Hungarian
  { id: "m35", word: "Köszönöm", language: "Hungarian", country: "Hungary", countryFlag: "🇭🇺", difficulty: "medium", pronunciation: "kø-sø-nøm", acceptedPronunciations: ["koszonom", "curse on um", "ko so nom", "cuss on ohm"] },

  // Finnish
  { id: "m36", word: "Kiitos", language: "Finnish", country: "Finland", countryFlag: "🇫🇮", difficulty: "medium", pronunciation: "kee-tos", acceptedPronunciations: ["kiitos", "key toss", "key toes", "key dose"] },

  // Danish
  { id: "m37", word: "Undskyld", language: "Danish", country: "Denmark", countryFlag: "🇩🇰", difficulty: "medium", pronunciation: "un-skyld", acceptedPronunciations: ["undskyld", "oon skill", "un skilled", "on school"] },

  // Norwegian
  { id: "m38", word: "Tusen takk", language: "Norwegian", country: "Norway", countryFlag: "🇳🇴", difficulty: "medium", pronunciation: "tu-sen-tak", acceptedPronunciations: ["tusen takk", "to sun talk", "to sin talk", "two sun tuck"] },

  // Welsh
  { id: "m39", word: "Bore da", language: "Welsh", country: "Wales", countryFlag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", difficulty: "medium", pronunciation: "bo-re-da", acceptedPronunciations: ["bore da", "boring da", "bore duh", "bora da"] },

  // Icelandic
  { id: "m40", word: "Takk fyrir", language: "Icelandic", country: "Iceland", countryFlag: "🇮🇸", difficulty: "medium", pronunciation: "tahk-fi-rir", acceptedPronunciations: ["takk fyrir", "talk fear ear", "talk for your", "tuck fear ear"] },

  // Hebrew
  { id: "m41", word: "Toda raba", language: "Hebrew", country: "Israel", countryFlag: "🇮🇱", difficulty: "medium", pronunciation: "to-da-ra-ba", acceptedPronunciations: ["toda raba", "toe da rah ba", "to the rubber"] },
  { id: "m42", word: "Shalom", language: "Hebrew", country: "Israel", countryFlag: "🇮🇱", difficulty: "medium", pronunciation: "sha-lom", acceptedPronunciations: ["shalom", "sha lome", "shall ohm", "show long"] },

  // Malay
  { id: "m43", word: "Terima kasih", language: "Malay", country: "Malaysia", countryFlag: "🇲🇾", difficulty: "medium", pronunciation: "te-ri-ma-ka-si", acceptedPronunciations: ["terima kasih", "terry ma ka see", "tree ma kasi", "trema kasi"] },

  // Turkish (more)
  { id: "m44", word: "Maşallah", language: "Turkish", country: "Turkey", countryFlag: "🇹🇷", difficulty: "medium", pronunciation: "ma-sha-la", acceptedPronunciations: ["mashallah", "ma sha la", "my sha la", "mash allah"] },

  // Tagalog
  { id: "m45", word: "Magandang araw", language: "Tagalog", country: "Philippines", countryFlag: "🇵🇭", difficulty: "medium", pronunciation: "ma-gan-dang a-raw", acceptedPronunciations: ["magandang araw", "ma gun dung a raw", "my gun dung arrow", "maganda narrow"] },

  // Thai
  { id: "m46", word: "Khop khun", language: "Thai", country: "Thailand", countryFlag: "🇹🇭", difficulty: "medium", pronunciation: "kop-kun", acceptedPronunciations: ["khop khun", "cop coon", "cop con", "cup kun"] },

  // Amharic
  { id: "m47", word: "Ameseginallehu", language: "Amharic", country: "Ethiopia", countryFlag: "🇪🇹", difficulty: "medium", pronunciation: "a-me-se-gi-na-le-hu", acceptedPronunciations: ["ameseginallehu", "on my second all who", "a message in a low hue"] },

  // Basque
  { id: "m48", word: "Kaixo", language: "Basque", country: "Spain", countryFlag: "🇪🇸", difficulty: "medium", pronunciation: "kai-sho", acceptedPronunciations: ["kaixo", "kai show", "cash oh", "kai cho"] },

  // Nepali
  { id: "m49", word: "Dhanyabaad", language: "Nepali", country: "Nepal", countryFlag: "🇳🇵", difficulty: "medium", pronunciation: "dhan-ya-baad", acceptedPronunciations: ["dhanyabaad", "done ya bod", "dan ya bod", "danny bod"] },

  // Samoan
  { id: "m50", word: "Talofa", language: "Samoan", country: "Samoa", countryFlag: "🇼🇸", difficulty: "medium", pronunciation: "ta-lo-fa", acceptedPronunciations: ["talofa", "ta low fa", "taller far", "ta lo fah"] },

  // Luxembourgish
  { id: "m51", word: "Moien", language: "Luxembourgish", country: "Luxembourg", countryFlag: "🇱🇺", difficulty: "medium", pronunciation: "moy-en", acceptedPronunciations: ["moien", "moyen", "moy in", "my in"] },

  // Albanian
  { id: "m52", word: "Faleminderit", language: "Albanian", country: "Albania", countryFlag: "🇦🇱", difficulty: "medium", pronunciation: "fa-le-min-de-rit", acceptedPronunciations: ["faleminderit", "follow min dare it", "fall a min dare it", "fell a men dare eet"] },

  // Latvian
  { id: "m53", word: "Paldies", language: "Latvian", country: "Latvia", countryFlag: "🇱🇻", difficulty: "medium", pronunciation: "pal-dies", acceptedPronunciations: ["paldies", "pal d es", "pull these", "pal these"] },

  // Lithuanian
  { id: "m54", word: "Ačiū", language: "Lithuanian", country: "Lithuania", countryFlag: "🇱🇹", difficulty: "medium", pronunciation: "a-choo", acceptedPronunciations: ["aciu", "a chew", "achoo", "ah choo"] },

  // Estonian
  { id: "m55", word: "Aitäh", language: "Estonian", country: "Estonia", countryFlag: "🇪🇪", difficulty: "medium", pronunciation: "ai-tah", acceptedPronunciations: ["aitah", "eye ta", "i ta", "eye tah"] },

  // Bulgarian
  { id: "m56", word: "Blagodarya", language: "Bulgarian", country: "Bulgaria", countryFlag: "🇧🇬", difficulty: "medium", pronunciation: "bla-go-da-rya", acceptedPronunciations: ["blagodarya", "blog a diary a", "blog oh daria", "blah go daria"] },

  // Serbian
  { id: "m57", word: "Hvala lepo", language: "Serbian", country: "Serbia", countryFlag: "🇷🇸", difficulty: "medium", pronunciation: "hva-la-le-po", acceptedPronunciations: ["hvala lepo", "vala lepo", "follow lay po"] },

  // Ukrainian
  { id: "m58", word: "Dyakuyu", language: "Ukrainian", country: "Ukraine", countryFlag: "🇺🇦", difficulty: "medium", pronunciation: "dya-ku-yu", acceptedPronunciations: ["dyakuyu", "jack a you", "the echo you", "die a coup you"] },

  // Kazakh
  { id: "m59", word: "Rakhmet", language: "Kazakh", country: "Kazakhstan", countryFlag: "🇰🇿", difficulty: "medium", pronunciation: "rah-met", acceptedPronunciations: ["rakhmet", "rock met", "rah met", "rock mat"] },

  // Uzbek
  { id: "m60", word: "Rahmat", language: "Uzbek", country: "Uzbekistan", countryFlag: "🇺🇿", difficulty: "medium", pronunciation: "rah-mat", acceptedPronunciations: ["rahmat", "rock mat", "ra mat", "rah mot"] },

  // =============================================
  // === HARD (60 words) ===
  // =============================================

  // Turkish
  { id: "h1", word: "Afyonkarahisar", language: "Turkish", country: "Turkey", countryFlag: "🇹🇷", difficulty: "hard", pronunciation: "af-yon-ka-ra-hi-sar", acceptedPronunciations: ["afyonkarahisar", "afyon karahisar", "of yon cara his are"] },
  { id: "h2", word: "Müteşekkir", language: "Turkish", country: "Turkey", countryFlag: "🇹🇷", difficulty: "hard", pronunciation: "mü-te-shek-kir", acceptedPronunciations: ["mutesekkir", "muteshekkir", "moo tesh a cure", "mu te shek ear"] },
  { id: "h3", word: "Çekoslovakyalılaştıramadıklarımızdan", language: "Turkish", country: "Turkey", countryFlag: "🇹🇷", difficulty: "hard", pronunciation: "che-ko-slo-vak-ya-lı-laş-tı-ra-ma-dık-la-rı-mız-dan", acceptedPronunciations: ["cekoslovakyalilastiramadiklarimizdan", "check a slow vacuum"] },

  // German
  { id: "h4", word: "Streichholzschächtelchen", language: "German", country: "Germany", countryFlag: "🇩🇪", difficulty: "hard", pronunciation: "shtraykh-holts-shekh-tel-khen", acceptedPronunciations: ["streichholzschachtelchen", "strike holts shack tell can", "sh try holds shack tell hen"] },
  { id: "h5", word: "Geschwindigkeitsbegrenzung", language: "German", country: "Germany", countryFlag: "🇩🇪", difficulty: "hard", pronunciation: "ge-shvin-dig-kayts-be-gren-tsung", acceptedPronunciations: ["geschwindigkeitsbegrenzung", "gesh win dig kites be grenz ung"] },
  { id: "h6", word: "Eichhörnchen", language: "German", country: "Germany", countryFlag: "🇩🇪", difficulty: "hard", pronunciation: "aykh-hörn-khen", acceptedPronunciations: ["eichhornchen", "eye horn can", "ike heron can", "ike horn shin"] },
  { id: "h7", word: "Brötchen", language: "German", country: "Germany", countryFlag: "🇩🇪", difficulty: "hard", pronunciation: "bröt-khen", acceptedPronunciations: ["brotchen", "brute shin", "bro chin", "brought shin"] },

  // Czech
  { id: "h8", word: "Zmrzlina", language: "Czech", country: "Czech Republic", countryFlag: "🇨🇿", difficulty: "hard", pronunciation: "zmrz-li-na", acceptedPronunciations: ["zmrzlina", "zmerzlina", "smrzlina", "z merz lena"] },
  { id: "h9", word: "Třistatřicettři", language: "Czech", country: "Czech Republic", countryFlag: "🇨🇿", difficulty: "hard", pronunciation: "trshi-sta-trshi-tset-trshi", acceptedPronunciations: ["tristatricettri", "tree sta tree set tree", "trista tree chet tree"] },
  { id: "h10", word: "Strč prst skrz krk", language: "Czech", country: "Czech Republic", countryFlag: "🇨🇿", difficulty: "hard", pronunciation: "strch-prst-skrz-krk", acceptedPronunciations: ["strc prst skrz krk", "stretch per st scares kirk", "search first skirts kirk"] },

  // Welsh
  { id: "h11", word: "Llanfairpwllgwyngyll", language: "Welsh", country: "Wales", countryFlag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", difficulty: "hard", pronunciation: "hlan-vire-poohl-gwin-gihl", acceptedPronunciations: ["llanfairpwllgwyngyll", "clan fair pool gwen gill", "lan fire pool gwyn gill"] },

  // Danish
  { id: "h12", word: "Rødgrød med fløde", language: "Danish", country: "Denmark", countryFlag: "🇩🇰", difficulty: "hard", pronunciation: "roeth-groeth meth floe-the", acceptedPronunciations: ["rodgrod med flode", "rude grew med flew the", "ruhd grud med flude"] },
  { id: "h13", word: "Speciallægepraksisplanlægningsstabiliseringsperiode", language: "Danish", country: "Denmark", countryFlag: "🇩🇰", difficulty: "hard", pronunciation: "spe-si-al-le-ge...", acceptedPronunciations: ["speciallaegepraksisplanlaegningsstabiliseringsperiode", "special lego practice"] },

  // Polish
  { id: "h14", word: "Szczęście", language: "Polish", country: "Poland", countryFlag: "🇵🇱", difficulty: "hard", pronunciation: "sh-chen-shche", acceptedPronunciations: ["szczescie", "shchenshche", "sh chen shay", "tension shay"] },
  { id: "h15", word: "Chrząszcz", language: "Polish", country: "Poland", countryFlag: "🇵🇱", difficulty: "hard", pronunciation: "khshonshch", acceptedPronunciations: ["chrzaszcz", "khshonshch", "hjonch", "harsh inch"] },
  { id: "h16", word: "Grzegorz", language: "Polish", country: "Poland", countryFlag: "🇵🇱", difficulty: "hard", pronunciation: "gzhe-gozh", acceptedPronunciations: ["grzegorz", "gre gosh", "gray gosh", "zheh gosh"] },

  // Hungarian
  { id: "h17", word: "Egészségedre", language: "Hungarian", country: "Hungary", countryFlag: "🇭🇺", difficulty: "hard", pronunciation: "e-ges-she-ged-re", acceptedPronunciations: ["egessegedre", "egg esh shag ed ray", "a guess shay geh dre"] },
  { id: "h18", word: "Megszentségteleníthetetlenségeskedéseitekért", language: "Hungarian", country: "Hungary", countryFlag: "🇭🇺", difficulty: "hard", pronunciation: "meg-sent-sheg...", acceptedPronunciations: ["megszentsegtelenithetetlensegeskedeseitekert", "mega sent shag"] },

  // Icelandic
  { id: "h19", word: "Eyjafjallajökull", language: "Icelandic", country: "Iceland", countryFlag: "🇮🇸", difficulty: "hard", pronunciation: "ay-ya-fyat-la-yo-kutl", acceptedPronunciations: ["eyjafjallajokull", "aya fyat la yo cool", "a a fettle a yo kuttle"] },
  { id: "h20", word: "Þjóðvegur", language: "Icelandic", country: "Iceland", countryFlag: "🇮🇸", difficulty: "hard", pronunciation: "thyoth-ve-gur", acceptedPronunciations: ["thjodvegur", "the old vay gur", "theo vegur", "theo they go"] },

  // Finnish
  { id: "h21", word: "Epäjärjestelmällisyys", language: "Finnish", country: "Finland", countryFlag: "🇫🇮", difficulty: "hard", pronunciation: "e-pä-yär-yes-tel-mäl-li-syys", acceptedPronunciations: ["epajarjestelmallistys", "app a your yes tell my lease use"] },
  { id: "h22", word: "Hääyöaie", language: "Finnish", country: "Finland", countryFlag: "🇫🇮", difficulty: "hard", pronunciation: "haa-ü-ö-ai-e", acceptedPronunciations: ["haayoaie", "ha you eye yeah", "hi you aye a", "ha a yo i a"] },

  // Thai
  { id: "h23", word: "Krungthepmahanakhon", language: "Thai", country: "Thailand", countryFlag: "🇹🇭", difficulty: "hard", pronunciation: "krung-tep-ma-ha-na-khon", acceptedPronunciations: ["krungthepmahanakhon", "crunk tep ma ha nah cone", "krung tep maha nakhon"] },

  // Irish
  { id: "h24", word: "Grianghrafadóireacht", language: "Irish", country: "Ireland", countryFlag: "🇮🇪", difficulty: "hard", pronunciation: "gree-an-graf-a-dor-akht", acceptedPronunciations: ["grianghrafadoireacht", "green graph a door act", "green graf adore act"] },
  { id: "h25", word: "Sláinte", language: "Irish", country: "Ireland", countryFlag: "🇮🇪", difficulty: "hard", pronunciation: "slawn-cha", acceptedPronunciations: ["slainte", "slancha", "slain cha", "slawn cha"] },

  // Scottish Gaelic
  { id: "h26", word: "Loch", language: "Scottish Gaelic", country: "Scotland", countryFlag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", difficulty: "hard", pronunciation: "lokh", acceptedPronunciations: ["loch", "lock", "lakh", "loke"] },

  // Xhosa
  { id: "h27", word: "Iqhude", language: "Xhosa", country: "South Africa", countryFlag: "🇿🇦", difficulty: "hard", pronunciation: "i-qu-de", acceptedPronunciations: ["iqhude", "e could a", "e crude a", "i who day"] },

  // Navajo
  { id: "h28", word: "Yáʼátʼééh", language: "Navajo", country: "USA", countryFlag: "🇺🇸", difficulty: "hard", pronunciation: "yah-ah-teh", acceptedPronunciations: ["yaateeh", "yah at a", "ya ta hey", "yeah at a"] },

  // Mandarin tones
  { id: "h29", word: "Māmā mà mǎ ma", language: "Chinese", country: "China", countryFlag: "🇨🇳", difficulty: "hard", pronunciation: "ma-ma-ma-ma-ma", acceptedPronunciations: ["mama ma ma ma", "mama mama ma", "ma ma ma ma ma"] },
  { id: "h30", word: "Huǒchēzhàn", language: "Chinese", country: "China", countryFlag: "🇨🇳", difficulty: "hard", pronunciation: "hwo-che-jan", acceptedPronunciations: ["huochezhan", "who a chuh john", "war chair john", "watch a john"] },

  // Vietnamese tones
  { id: "h31", word: "Phở", language: "Vietnamese", country: "Vietnam", countryFlag: "🇻🇳", difficulty: "hard", pronunciation: "fuh", acceptedPronunciations: ["pho", "fur", "fuh", "fa"] },
  { id: "h32", word: "Nguyễn", language: "Vietnamese", country: "Vietnam", countryFlag: "🇻🇳", difficulty: "hard", pronunciation: "nwin", acceptedPronunciations: ["nguyen", "win", "new in", "nwin"] },

  // Georgian
  { id: "h33", word: "Gvprtskvnis", language: "Georgian", country: "Georgia", countryFlag: "🇬🇪", difficulty: "hard", pronunciation: "gv-prts-kv-nis", acceptedPronunciations: ["gvprtskvnis", "gopher skins", "go parts give knees"] },

  // Maori
  { id: "h34", word: "Whakataukī", language: "Maori", country: "New Zealand", countryFlag: "🇳🇿", difficulty: "hard", pronunciation: "fa-ka-tow-kee", acceptedPronunciations: ["whakatuki", "fa ka toe key", "what a tow key"] },

  // Tamil
  { id: "h35", word: "Vanakkam", language: "Tamil", country: "India", countryFlag: "🇮🇳", difficulty: "hard", pronunciation: "va-nak-kam", acceptedPronunciations: ["vanakkam", "van a come", "vin a come"] },

  // Swahili
  { id: "h36", word: "Ninakupenda", language: "Swahili", country: "Kenya", countryFlag: "🇰🇪", difficulty: "hard", pronunciation: "ni-na-ku-pen-da", acceptedPronunciations: ["ninakupenda", "nina coup end a", "knee knock a panda"] },

  // Quechua
  { id: "h37", word: "Rimaykullayki", language: "Quechua", country: "Peru", countryFlag: "🇵🇪", difficulty: "hard", pronunciation: "ri-may-kul-lay-ki", acceptedPronunciations: ["rimaykullayki", "re my cool eye key", "re make you like e"] },

  // Tongan
  { id: "h38", word: "Mālō e lelei", language: "Tongan", country: "Tonga", countryFlag: "🇹🇴", difficulty: "hard", pronunciation: "mah-lo-e-le-ley", acceptedPronunciations: ["malo e lelei", "ma low a lay lay", "my low a lay lay"] },

  // Armenian
  { id: "h39", word: "Barev dzez", language: "Armenian", country: "Armenia", countryFlag: "🇦🇲", difficulty: "hard", pronunciation: "ba-rev-dzez", acceptedPronunciations: ["barev dzez", "bar of says", "borrow jess", "bar have this"] },

  // Punjabi
  { id: "h40", word: "Sat sri akaal", language: "Punjabi", country: "India", countryFlag: "🇮🇳", difficulty: "hard", pronunciation: "sat-sri-a-kal", acceptedPronunciations: ["sat sri akaal", "sought sri a call", "sat sri a call", "sut shree a call"] },

  // Hausa
  { id: "h41", word: "Nagode", language: "Hausa", country: "Nigeria", countryFlag: "🇳🇬", difficulty: "hard", pronunciation: "na-go-de", acceptedPronunciations: ["nagode", "na go day", "nah go day"] },

  // Azerbaijani
  { id: "h42", word: "Təşəkkür edirəm", language: "Azerbaijani", country: "Azerbaijan", countryFlag: "🇦🇿", difficulty: "hard", pronunciation: "teh-shek-kur-ed-i-rem", acceptedPronunciations: ["tesekkur edirem", "tesh a cure add a rem", "ta sha cure eddy rem"] },

  // Lao
  { id: "h43", word: "Sabaidee", language: "Lao", country: "Laos", countryFlag: "🇱🇦", difficulty: "hard", pronunciation: "sa-bai-dee", acceptedPronunciations: ["sabaidee", "sub by dee", "so by dee", "sa bye dee"] },

  // Khmer
  { id: "h44", word: "Suostei", language: "Khmer", country: "Cambodia", countryFlag: "🇰🇭", difficulty: "hard", pronunciation: "su-os-tey", acceptedPronunciations: ["suostei", "sue us stay", "so stay", "sues day"] },

  // Burmese
  { id: "h45", word: "Mingalaba", language: "Burmese", country: "Myanmar", countryFlag: "🇲🇲", difficulty: "hard", pronunciation: "min-ga-la-ba", acceptedPronunciations: ["mingalaba", "min gala bar", "ming gala ba", "mingle aba"] },

  // Tibetan
  { id: "h46", word: "Tashi delek", language: "Tibetan", country: "Tibet", countryFlag: "🇨🇳", difficulty: "hard", pronunciation: "ta-shi-de-lek", acceptedPronunciations: ["tashi delek", "ta she day lack", "touchy delay"] },

  // Wolof
  { id: "h47", word: "Jërejëf", language: "Wolof", country: "Senegal", countryFlag: "🇸🇳", difficulty: "hard", pronunciation: "je-re-jef", acceptedPronunciations: ["jerejef", "jerry jeff", "jere jeff", "cherry jeff"] },

  // Sesotho
  { id: "h48", word: "Khotso", language: "Sesotho", country: "Lesotho", countryFlag: "🇱🇸", difficulty: "hard", pronunciation: "khot-so", acceptedPronunciations: ["khotso", "coat so", "caught so", "kot so"] },

  // Slovenian
  { id: "h49", word: "Najlepša hvala", language: "Slovenian", country: "Slovenia", countryFlag: "🇸🇮", difficulty: "hard", pronunciation: "nay-lep-sha-hva-la", acceptedPronunciations: ["najlepsa hvala", "nigh left holla", "nigh lep sha follow"] },

  // Slovak
  { id: "h50", word: "Ďakujem pekne", language: "Slovak", country: "Slovakia", countryFlag: "🇸🇰", difficulty: "hard", pronunciation: "dya-ku-yem-pek-ne", acceptedPronunciations: ["dakujem pekne", "jack who yam peck nay", "the coup yam pack ne"] },

  // Macedonian
  { id: "h51", word: "Blagodaram", language: "Macedonian", country: "North Macedonia", countryFlag: "🇲🇰", difficulty: "hard", pronunciation: "bla-go-da-ram", acceptedPronunciations: ["blagodaram", "blog a dah rom", "blog go da ram"] },

  // Maltese
  { id: "h52", word: "Nirringrazzjak", language: "Maltese", country: "Malta", countryFlag: "🇲🇹", difficulty: "hard", pronunciation: "nir-rin-grats-yak", acceptedPronunciations: ["nirringrazzjak", "near in grots yak", "nearing got yak"] },

  // Luxembourgish
  { id: "h53", word: "Villmools Merci", language: "Luxembourgish", country: "Luxembourg", countryFlag: "🇱🇺", difficulty: "hard", pronunciation: "fill-mools-mer-si", acceptedPronunciations: ["villmools merci", "fill moles mercy", "veal malls mercy"] },

  // Faroese
  { id: "h54", word: "Takk fyri", language: "Faroese", country: "Faroe Islands", countryFlag: "🇫🇴", difficulty: "hard", pronunciation: "tak-fee-ri", acceptedPronunciations: ["takk fyri", "talk fury", "talk ferry", "talk fear e"] },

  // Romansh
  { id: "h55", word: "Grazia fitg", language: "Romansh", country: "Switzerland", countryFlag: "🇨🇭", difficulty: "hard", pronunciation: "gra-tsia-fitsh", acceptedPronunciations: ["grazia fitg", "grots yeah fish", "grotsya fish", "grotch a fig"] },

  // Breton
  { id: "h56", word: "Trugarez", language: "Breton", country: "France", countryFlag: "🇫🇷", difficulty: "hard", pronunciation: "tru-ga-rez", acceptedPronunciations: ["trugarez", "true gah res", "through garage", "true garage"] },

  // Corsican
  { id: "h57", word: "Bonghjornu", language: "Corsican", country: "France", countryFlag: "🇫🇷", difficulty: "hard", pronunciation: "bon-jor-nu", acceptedPronunciations: ["bonghjornu", "bon jour new", "bone jor noo", "bongo journey"] },

  // Sardinian
  { id: "h58", word: "Salude", language: "Sardinian", country: "Italy", countryFlag: "🇮🇹", difficulty: "hard", pronunciation: "sa-lu-de", acceptedPronunciations: ["salude", "salute a", "sa loo day", "salad a"] },

  // Yoruba
  { id: "h59", word: "E ku irole", language: "Yoruba", country: "Nigeria", countryFlag: "🇳🇬", difficulty: "hard", pronunciation: "eh-ku-i-ro-le", acceptedPronunciations: ["e ku irole", "a cool e roll a", "echo e roll a"] },

  // Igbo
  { id: "h60", word: "Kedu ka ị mere", language: "Igbo", country: "Nigeria", countryFlag: "🇳🇬", difficulty: "hard", pronunciation: "ke-du-ka-i-me-re", acceptedPronunciations: ["kedu ka i mere", "could do car e mary", "k do kai mere"] },
];

export function getWordsByDifficulty(difficulty: string): Word[] {
  return wordDatabase.filter((w) => w.difficulty === difficulty);
}

export function getRandomWords(difficulty: string, count: number = 10): Word[] {
  const words = getWordsByDifficulty(difficulty);
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

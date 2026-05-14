document.addEventListener('DOMContentLoaded', () => {
  // Palettes and vocab are embedded (small demo data)
  const PALETTES = [
    { bg: '#D5E8FA', fg: '#0A3B6A', id: '#16578F' },
    { bg: '#D2EDE4', fg: '#073D33', id: '#0D5A47' },
    { bg: '#F3E2C8', fg: '#5A3205', id: '#76470A' },
    { bg: '#F2DCE6', fg: '#421223', id: '#7F2C48' },
    { bg: '#DEDDF8', fg: '#211C4C', id: '#4740A0' },
    { bg: '#F0DDD5', fg: '#3E160A', id: '#7E3018' },
    { bg: '#DFEBCF', fg: '#122A03', id: '#2E590D' },
    { bg: '#F3E2E2', fg: '#431010', id: '#8A2424' },
  ];

  const BPE_VOCAB = {
    // ── Punctuation & whitespace ──
    " ":32,"\n":10,"\t":9,"!":33,"\"":34,"#":35,"$":36,"%":37,"&":38,"'":39,
    "(":40,")":41,"*":42,"+":43,",":44,"-":45,".":46,"/":47,":":58,";":59,
    "<":60,"=":61,">":62,"?":63,"@":64,"[":91,"]":93,"_":95,"{":123,"}":125,"|":124,
    "...":256,"--":257,"—":258,"``":259,"''":260,"n't":261,"'s":262,"'t":263,"'re":264,"'ve":265,"'ll":266,"'d":267,"'m":268,

    // ── Common subword pieces / morphemes ──
    "th":300,"he":301,"in":302,"er":303,"an":304,"re":305,"on":306,"at":307,"en":308,"nd":309,
    "ti":310,"es":311,"or":312,"te":313,"of":314,"ed":315,"is":316,"it":317,"al":318,"ar":319,
    "st":320,"to":321,"nt":322,"ng":323,"se":324,"ha":325,"as":326,"ou":327,"io":328,"le":329,
    "ve":330,"co":331,"me":332,"de":333,"hi":334,"ri":335,"ro":336,"ic":337,"ne":338,"ea":339,
    "ra":340,"ce":341,"li":342,"ch":343,"ll":344,"be":345,"ma":346,"si":347,"om":348,"ur":349,
    "ing":350,"tion":351,"ment":352,"ness":353,"able":354,"ible":355,"ation":356,"ize":357,"ise":358,
    "ful":359,"less":360,"ity":361,"ous":362,"ive":363,"ally":364,"ence":365,"ance":366,
    "ward":367,"ship":368,"hood":369,"wise":370,"ling":371,"ular":372,"ization":373,
    "un":374,"pre":375,"post":376,"anti":377,"non":378,"over":379,"under":380,"inter":381,
    "trans":382,"sub":383,"super":384,"micro":385,"macro":386,"dis":387,"mis":388,
    "ly":389,"er":390,"est":391,"sion":392,"cian":393,"graph":394,"logy":395,

    // ── Common full words ──
    "the":400,"The":401,"and":402,"And":403,"for":404,"For":405,"are":406,"Are":407,
    "but":408,"But":409,"not":410,"Not":411,"you":412,"You":413,"all":414,"All":415,
    "can":416,"Can":417,"her":418,"Her":419,"was":420,"Was":421,"one":422,"One":423,
    "our":424,"Our":425,"out":426,"has":427,"his":428,"His":429,"how":430,"How":431,
    "its":432,"may":433,"new":434,"New":435,"now":436,"old":437,"see":438,"way":439,
    "who":440,"Who":441,"did":442,"get":443,"let":444,"say":445,"she":446,"She":447,
    "too":448,"use":449,"had":450,"him":451,"man":452,"why":453,"Why":454,"two":455,
    "any":456,"few":457,"day":458,"got":459,"own":460,"set":461,"put":462,"yet":463,
    "run":464,"ran":465,"big":466,"end":467,"off":468,"try":469,"ask":470,"men":471,
    "does":472,"each":473,"even":474,"from":475,"From":476,"good":477,"Good":478,
    "have":479,"Have":480,"here":481,"Here":482,"high":483,"into":484,"just":485,
    "keep":486,"know":487,"last":488,"long":489,"look":490,"made":491,"make":492,
    "many":493,"more":494,"More":495,"most":496,"much":497,"must":498,"name":499,
    "next":500,"only":501,"over":502,"part":503,"said":504,"same":505,"some":506,
    "such":507,"take":508,"tell":509,"than":510,"that":511,"That":512,"them":513,
    "then":514,"they":515,"They":516,"this":517,"This":518,"time":519,"very":520,
    "want":521,"well":522,"went":523,"what":524,"What":525,"when":526,"When":527,
    "will":528,"Will":529,"with":530,"With":531,"word":532,"work":533,"year":534,
    "also":535,"back":536,"been":537,"call":538,"come":539,"could":540,"down":541,
    "find":542,"give":543,"going":544,"hand":545,"help":546,"home":547,"kind":548,
    "like":549,"line":550,"live":551,"need":552,"never":553,"number":554,"people":555,
    "place":556,"point":557,"right":558,"show":559,"small":560,"start":561,"still":562,
    "thing":563,"think":564,"those":565,"three":566,"under":567,"where":568,"Where":569,
    "which":570,"Which":571,"while":572,"world":573,"would":574,"write":575,"about":576,
    "after":577,"After":578,"again":579,"being":580,"between":581,"both":582,"came":583,
    "children":584,"different":585,"every":586,"example":587,"first":588,"found":589,
    "great":590,"house":591,"important":592,"large":593,"learn":594,"left":595,
    "might":596,"often":597,"other":598,"school":599,"should":600,"state":601,
    "still":602,"story":603,"system":604,"through":605,"turn":606,"until":607,
    "water":608,"without":609,"young":610,"before":611,"Before":612,"change":613,
    "country":614,"family":615,"follow":616,"group":617,"head":618,"leave":619,
    "life":620,"light":621,"move":622,"question":623,"read":624,"second":625,
    "seem":626,"side":627,"since":628,"study":629,"thought":630,"together":631,
    "using":632,"along":633,"always":634,"answer":635,"another":636,"become":637,
    "began":638,"better":639,"book":640,"build":641,"called":642,"close":643,
    "create":644,"early":645,"earth":646,"enough":647,"fact":648,"form":649,
    "given":650,"goes":651,"hard":652,"later":653,"model":654,"open":655,
    "order":656,"problem":657,"program":658,"result":659,"room":660,"says":661,
    "simple":662,"special":663,"table":664,"taken":665,"today":666,"today":667,

    // ── Demo-specific: short words kept whole, long words as stems ──
    "Hello":700,"hello":701,"World":702,
    "Token":705,"token":706,
    "language":709,"function":710,"variable":711,
    "method":747,"object":748,"class":749,"string":750,"value":751,"array":752,
    "boolean":753,"return":754,"input":755,"output":756,"data":757,
    "code":758,"type":759,"file":760,"text":761,"user":762,"test":763,
    "true":764,"false":765,"null":766,"error":767,"quick":768,"brown":769,
    "fox":770,"jumps":771,"lazy":772,"dog":773,"cat":774,
    "however":729,"although":730,"actually":731,"probably":732,"certainly":733,
    "complex":741,"modern":742,"popular":743,"because":744,"natural":745,
    "process":746,"every":786,"some":787,"noth":788,"any":789,
    // ── Word stems (so long words split: fascinat+ing, token+ization, etc.) ──
    "fascinat":780,"Fascinat":781,"program":782,"comput":783,
    "technolog":784,"develop":785,"inform":790,"beauti":791,
    "wonder":792,"excell":793,"brilli":794,"fantast":795,
    "structur":796,"experi":797,"paramet":798,"sequenc":799,
    "algorith":1080,"understand":723,"train":1081,"build":641,
    "learn":594,"work":533,"run":464,"look":490,

    // ── Leading-space words (how real BPE handles inter-word spaces) ──
    " the":800," The":801," a":802," A":803," an":804," An":805,
    " and":806," And":807," or":808," Or":809," but":810," But":811,
    " if":812," If":813," of":814," in":815," to":816," for":817,
    " on":818," at":819," by":820," is":821," Is":822," are":823," Are":824,
    " was":825," Was":826," were":827," be":828," been":829," being":830,
    " have":831," has":832," had":833," do":834," does":835," did":836,
    " can":837," could":838," should":839," would":840," will":841,
    " may":842," might":843," must":844," not":845," no":846," yes":847,
    " this":848," This":849," that":850," That":851," these":852," those":853,
    " there":854," There":855," here":856," Here":857," with":858," With":859,
    " from":860," From":861," as":862," As":863," it":864," It":865,
    " he":866," He":867," she":868," She":869," we":870," We":871,
    " they":872," They":873," I":874," me":875," my":876," you":877,
    " your":878," him":879," his":880," her":881," its":882," our":883,
    " their":884," them":885," us":886," who":887," Who":888," what":889,
    " What":890," which":891," Which":892," when":893," When":894,
    " where":895," Where":896," how":897," How":898," why":899," Why":900,
    " all":901," each":902," every":903," some":904," many":905," much":906,
    " more":907," most":908," few":909," less":910," very":911," just":912,
    " also":913," still":914," even":915," only":916," now":917," then":918,
    " than":919," so":920," too":921," well":922," back":923," out":924,
    " about":925," after":926," before":927," between":928," over":929,
    " under":930," into":931," through":932," up":933," down":934,
    " new":935," New":936," old":937," good":938," bad":939," big":940,
    " small":941," first":942," last":943," next":944," other":945,
    " same":946," different":947," important":948," simple":949,
    " complex":950," modern":951," right":952," such":953," own":954,
    " made":955," make":956," like":957," know":958," think":959,
    " take":960," give":961," come":962," go":963," see":964," say":965,
    " said":966," get":967," use":968," find":969," want":970," need":971,
    " work":972," call":973," try":974," keep":975," let":976,
    " turn":977," start":978," show":979," help":980," set":981,
    " world":982," people":983," time":984," way":985," thing":986,
    " life":987," part":988," place":989," children":990," family":991,
    " never":992," always":993," often":994," sometimes":995,
    " example":996," language":997," system":998," model":999,
    " token":1000," Token":1001," word":1002," number":1003,
    " data":1004," code":1005," function":1006," program":1007,
    " question":1008," answer":1009," problem":1010," result":1011,
    " another":1023," today":1024," tomorrow":1025," yesterday":1026,
    " natural":1027," process":1028," method":1029," value":1030,
    " class":1031," object":1032," string":1033," type":1034,
    " file":1035," text":1036," user":1037," test":1038,
    " actually":1046," probably":1047," certainly":1048,
    " however":1049," although":1050," because":1051," already":1052,
    " together":1053," without":1054," during":1055," while":1056,
    " quick":1071," brown":1072," fox":1073," jumps":1074,
    " lazy":1075," dog":1076," cat":1077,
    // ── Leading-space stems (long words split: ·fascinat+ing, ·token+ization) ──
    " fascinat":1060," Fascinat":1082," comput":1083,
    " technolog":1084," develop":1085," inform":1086,
    " beauti":1087," wonder":1088," excell":1089,
    " brilli":1090," fantast":1091," structur":1092,
    " experi":1093," paramet":1094," sequenc":1095,
    " algorith":1096," understand":1043," train":1097,
    " build":1098," learn":1099," work":972," run":1100,
    " look":1101," every":1102," some":1103," noth":1104," any":1105,
  };

  const BPE_EXTRA_TOKENS = [
    // Common words and fragments
    "I", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them",
    "my", "your", "his", "their", "our", "mine", "yours", "hers", "ours", "theirs",
    "this", "that", "these", "those", "there", "here", "where", "when", "why", "how",
    "who", "whom", "whose", "what", "which", "whatever", "whichever", "whoever", "whomever",
    "fact", "facts", "information", "data", "details", "info", "content", "context", "summary", "summaries",
    "name", "names", "named", "naming", "nickname", "nicknames", "username", "usernames",
    "family", "families", "familial", "family's", "famile",
    "result", "results", "reason", "reasons", "answer", "answers", "question", "questions", "problem", "problems",
    "example", "examples", "idea", "ideas", "topic", "topics", "word", "words", "sentence", "sentences", "phrase", "phrases",
    "text", "texts", "token", "tokens", "tokenize", "tokenizes", "tokenized", "tokenizing", "tokenizer", "tokenizers",
    "model", "models", "language", "languages", "system", "systems", "input", "output", "prompt", "prompts", "response", "responses",
    "code", "codes", "coding", "program", "programs", "programming", "function", "functions", "variable", "variables",
    "value", "values", "class", "classes", "object", "objects", "array", "arrays", "string", "strings", "number", "numbers",
    "boolean", "booleans", "true", "false", "null", "undefined", "undefined", "object", "objects", "return", "returns",
    "create", "creates", "created", "creating", "build", "builds", "built", "building", "learn", "learns", "learned", "learning",
    "use", "uses", "used", "using", "work", "works", "worked", "working", "make", "makes", "made", "making",
    "see", "sees", "saw", "seen", "show", "shows", "showed", "showing", "find", "finds", "found", "finding",
    "know", "knows", "knew", "known", "think", "thinks", "thought", "thinking", "need", "needs", "needed", "needing",
    "want", "wants", "wanted", "wanting", "like", "likes", "liked", "liking", "love", "loves", "loved", "loving",
    "get", "gets", "got", "gotten", "getting", "take", "takes", "took", "taken", "taking", "give", "gives", "gave", "given", "giving",
    "say", "says", "said", "saying", "go", "goes", "went", "gone", "going", "run", "runs", "ran", "running",
    "do", "does", "did", "done", "doing", "have", "has", "had", "having", "be", "is", "are", "was", "were", "been", "being",
    "can", "could", "should", "would", "will", "may", "might", "must", "shall",
    "not", "no", "yes", "maybe", "all", "any", "some", "none", "most", "many", "few", "more", "less",
    "one", "two", "three", "four", "five", "first", "second", "third", "last", "new", "old", "good", "bad", "big", "small",
    "today", "tomorrow", "yesterday", "now", "later", "soon", "always", "never", "often", "sometimes", "usually", "rarely",
    "team", "teams", "person", "people", "man", "men", "woman", "women", "child", "children", "user", "users",
    "very", "much",
    "time", "times", "day", "days", "week", "weeks", "month", "months", "year", "years", "hour", "hours", "minute", "minutes",
    "local", "remote", "public", "private", "static", "dynamic", "simple", "complex", "modern", "important", "familiar",

    // Common leading-space words
    " the", " The", " a", " A", " an", " An", " and", " And", " or", " Or", " but", " But", " if", " If",
    " of", " Of", " in", " In", " to", " To", " for", " For", " on", " On", " at", " At", " by", " By",
    " with", " With", " from", " From", " as", " As", " is", " Is", " are", " Are", " was", " Was", " were", " Were",
    " be", " Be", " been", " Been", " being", " Being", " have", " Have", " has", " Has", " had", " Had",
    " do", " Do", " does", " Does", " did", " Did", " can", " Can", " could", " Could", " should", " Should",
    " would", " Would", " will", " Will", " may", " May", " might", " Might", " must", " Must", " shall", " Shall",
    " not", " Not", " no", " No", " yes", " Yes", " this", " This", " that", " That", " these", " These", " those", " Those",
    " there", " There", " here", " Here", " where", " Where", " when", " When", " why", " Why", " how", " How",
    " what", " What", " which", " Which", " who", " Who", " whom", " Whom", " whose", " Whose",
    " more", " More", " less", " Less", " most", " Most", " many", " Many", " few", " Few", " first", " First", " last", " Last",
    " good", " Good", " bad", " Bad", " big", " Big", " small", " Small", " new", " New", " old", " Old", " simple", " Simple",
    " complex", " Complex", " modern", " Modern", " important", " Important", " example", " Example", " examples", " Examples",
    " family", " Family", " families", " Families", " very", " Very", " much", " Much",

    // Common prefixes and subword pieces
    "un", "re", "pre", "post", "anti", "non", "over", "under", "inter", "trans", "sub", "super", "micro", "macro",
    "able", "ible", "ally", "ance", "ence", "ary", "dom", "eer", "er", "est", "ful", "hood", "ism", "ist", "ity", "ive", "less", "ment",
    "ship", "sion", "tion", "ation", "ization", "ative", "ous", "ness", "ingly", "edly", "wise", "ward", "wards",
    "ing", "ed", "ly", "er", "est", "s", "es", "d", "n", "t", "x",
    "tion", "sion", "cian", "tive", "graph", "logy", "phile", "phone", "scope", "meter", "nomy", "ment", "press", "pose", "form", "view",

    // Common character pairings and short chunks
    "th", "he", "in", "er", "an", "re", "on", "at", "en", "nd", "ti", "es", "or", "te", "of", "ed", "is", "it", "al", "ar",
    "st", "to", "nt", "ng", "se", "ha", "as", "ou", "io", "le", "ve", "co", "me", "de", "hi", "ri", "ro", "ic", "ne",
    "ea", "ra", "ce", "li", "ch", "ll", "be", "ma", "si", "om", "ur", "ca", "el", "ta", "la", "di", "fo", "no", "pe",
    "ec", "pr", "pl", "tr", "cl", "qu", "wh", "ck", "sh", "ph", "gh", "oo", "ee", "ea", "ai", "ay", "ow", "ou", "oi",
    "en ", "th ", "re ", "in ", "er ", "an ", "on ", "at ", "to ", "of ", "is ", "it ", "or ", "al ", "ar ", "ng ", "ed ",
    "ing ", "tion ", "ment ", "ness ", "able ", "ible ", "ally ", "ous ", "ive ", "ize ", "ise ", "ize", "ise", "en", "th",

    // Common verbs and inflections
    "run", "runs", "ran", "running", "walk", "walks", "walked", "walking", "talk", "talks", "talked", "talking",
    "play", "plays", "played", "playing", "read", "reads", "readed", "reading", "write", "writes", "wrote", "written",
    "open", "opens", "opened", "opening", "close", "closes", "closed", "closing", "start", "starts", "started", "starting",
    "create", "creates", "created", "creating", "build", "builds", "built", "building", "deploy", "deploys", "deployed", "deploying",
    "learn", "learns", "learned", "learning", "show", "shows", "showed", "showing", "explain", "explains", "explained", "explaining",
    "compare", "compares", "compared", "comparing", "choose", "chooses", "chose", "chosen", "choosing", "remove", "removes", "removed", "removing",
    "add", "adds", "added", "adding", "use", "uses", "used", "using", "make", "makes", "made", "making", "keep", "keeps", "kept", "keeping",

    // High-frequency function words with leading-space variants
    // Common punctuation / formatting / separators
    " ", "\n", "\t", ".", ",", ";", ":", "!", "?", "-", "_", "/", "\\", "'", "\"", "(", ")", "[", "]", "{", "}", "<", ">",
    "...", "--", "—", "…", "#", "@", "$", "%", "&", "*", "+", "=", "|",

    // Everyday phrases
    " good", " great", " better", " best", " bad", " worse", " worst", " important", " simple", " complex", " modern",
    " example", " examples", " maybe", " please", " thanks", " thank", " hello", " hi", " welcome", " bye",
    " family", " families", " they", " They",
    " today", " tomorrow", " yesterday", " now", " later", " soon", " always", " never", " often", " sometimes",

    // Numbers and ordinals
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "100", "1000", "1st", "2nd", "3rd", "4th", "5th",

    // Web / coding / UI terms
    "user", "users", "page", "pages", "site", "sites", "browser", "browsers", "server", "servers", "client", "clients",
    "request", "requests", "response", "responses", "render", "renders", "rendered", "rendering", "click", "clicks", "clicked", "clicking",
    "hover", "hovers", "hovered", "hovering", "load", "loads", "loaded", "loading", "center", "centers", "centered", "centering",
    "layout", "layouts", "style", "styles", "styled", "styling", "tokenization", "tokenizer", "tokenizers", "vocab", "vocabulary",
    "merge", "merges", "merged", "merging", "learn", "learned", "learns", "learning", "section", "sections", "accordion", "accordions",
    "simulator", "simulate", "simulated", "simulating", "example", "examples", "basic", "basics", "advanced", "advanced", "model", "models",
    "home", "learn", "open", "close", "choose", "selected", "selecting", "choose", "choice", "choices", "visible", "hidden",

    // Common Markdown / HTML / URL pieces
    "https://", "http://", "www.", ".com", ".org", ".net", ".io", ".dev", ".app", ".html", ".css", ".js", "/index.html", "/learn.html", "/simulator.html",
    "<div>", "</div>", "<span>", "</span>", "<script>", "</script>", "<style>", "</style>", "<main>", "</main>",
  ];

  let nextVocabId = 2000;
  BPE_EXTRA_TOKENS.forEach(token => {
    if (BPE_VOCAB[token] === undefined) {
      BPE_VOCAB[token] = nextVocabId++;
    }
  });

  function bpeTokenize(text) {
    if (!text.trim()) return [];
    const vocab = BPE_VOCAB;
    let tokens = []; let i = 0; let id = 1400; const idCache = {};
    while (i < text.length) {
      let best = null, bestLen = 0;
      for (let l = Math.min(20, text.length - i); l >= 1; l--) {
        const sub = text.slice(i, i + l);
        if (vocab[sub] !== undefined && l > bestLen) { best = sub; bestLen = l; }
      }
      if (best) {
        const tid = vocab[best]; tokens.push({ text: best, id: tid, start: i, end: i + bestLen }); i += bestLen;
      } else {
        const ch = text[i]; if (!idCache[ch]) idCache[ch] = id++; tokens.push({ text: ch, id: idCache[ch], start: i, end: i + 1 }); i++;
      }
    }
    return tokens;
  }

  function wordTokenize(text) {
    if (!text.trim()) return [];
    const re = /\S+|\s+/g; let m, tokens = [], id = 2000, cache = {};
    while ((m = re.exec(text)) !== null) { const t = m[0]; if (!cache[t]) cache[t] = id++; tokens.push({ text: t, id: cache[t], start: m.index, end: m.index + t.length }); }
    return tokens;
  }

  function ngramTokenize(text, n) {
    if (!text.trim()) return [];
    const gram = Math.max(1, Math.min(3, Number(n) || 1));
    const units = [];
    const re = /\S+/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      units.push({ text: m[0], start: m.index, end: m.index + m[0].length });
    }
    if (!units.length) return [];

    const windows = [];
    if (units.length < gram) {
      windows.push({ start: units[0].start, end: units[units.length - 1].end });
    } else {
      for (let i = 0; i <= units.length - gram; i++) {
        windows.push({ start: units[i].start, end: units[i + gram - 1].end });
      }
    }

    const cache = {};
    let nextId = 5000;
    return windows.map(w => {
      const tokText = text.slice(w.start, w.end);
      if (cache[tokText] === undefined) cache[tokText] = nextId++;
      return { text: tokText, id: cache[tokText], start: w.start, end: w.end };
    });
  }


  function wordPieceTokenize(text) {
    if (!text.trim()) return [];
    const parts = text.match(/\s+|[A-Za-z0-9]+|[^\w\s]/g) || [];
    const cache = {};
    let nextId = 3000;
    let cursor = 0;
    let tokens = [];

    parts.forEach(part => {
      const start = cursor;
      const end = cursor + part.length;
      cursor = end;

      if (/^\s+$/.test(part) || /^[^\w\s]+$/.test(part)) {
        if (cache[part] === undefined) cache[part] = nextId++;
        tokens.push({ text: part, id: cache[part], start, end });
        return;
      }

      if (part.length <= 5) {
        if (cache[part] === undefined) cache[part] = nextId++;
        tokens.push({ text: part, id: cache[part], start, end });
        return;
      }

      const first = part.slice(0, 3);
      const firstTok = first;
      if (cache[firstTok] === undefined) cache[firstTok] = nextId++;
      tokens.push({ text: firstTok, id: cache[firstTok], start, end: start + first.length });

      let offset = 3;
      while (offset < part.length) {
        const piece = part.slice(offset, offset + 3);
        const subTok = `##${piece}`;
        if (cache[subTok] === undefined) cache[subTok] = nextId++;
        tokens.push({ text: subTok, id: cache[subTok], start: start + offset, end: start + offset + piece.length });
        offset += 3;
      }
    });

    return tokens;
  }

  function charTokenize(text) { if (!text) return []; return [...text].map((ch, i) => ({ text: ch, id: ch.codePointAt(0), start: i, end: i + 1 })); }

  function tokenize(text, algo, ngramSize) {
    if (algo === 'bpe') return bpeTokenize(text);
    if (algo === 'ngram') return ngramTokenize(text, ngramSize);
    if (algo === 'wordpiece') return wordPieceTokenize(text);
    if (algo === 'word') return wordTokenize(text);
    return charTokenize(text);
  }

  const algoInfo = {
    bpe: { title: 'Byte-Pair Encoding (BPE)', body: 'BPE starts with individual characters or bytes and repeatedly merges the most frequent adjacent pairs found in a training corpus. Those learned merges are then reused at inference time, which is why common words often become single tokens while rarer words stay split into subword pieces. GPT-style models and many LLaMA-family tokenizers use variants of this approach.', facts: [{ label: 'Used by', val: 'GPT-2, GPT-3, GPT-4, LLaMA' }, { label: 'Vocabulary size', val: '~50,000 – 100,000' }, { label: 'Handles rare words', val: 'Yes — splits into subwords' }, { label: 'Multilingual', val: 'Yes, with byte fallback' }] },
    ngram: { title: 'N-gram tokenization', body: 'N-gram tokenization groups consecutive non-whitespace units into fixed-size windows. Unigram keeps single units, bigram combines pairs, and trigram combines triples. This is simple, fast, and easy to inspect for local context effects.', facts: [{ label: 'Modes', val: 'Unigram, Bigram, Trigram' }, { label: 'Best for', val: 'Simple context-window experiments' }, { label: 'Behavior', val: 'Sliding windows over text units' }, { label: 'Complexity', val: 'Low and browser-friendly' }] },
    wordpiece: { title: 'Word-Piece', body: 'WordPiece splits words into frequent subword units and uses continuation markers (often ##) for non-initial pieces. It balances compact vocabularies with good handling of unknown words by backing off to smaller subword fragments.', facts: [{ label: 'Used by', val: 'BERT, DistilBERT, many encoder models' }, { label: 'Vocabulary size', val: '~30,000 common setting' }, { label: 'Handles rare words', val: 'Yes — via subword continuation pieces' }, { label: 'Strength', val: 'Strong for classification and NLU tasks' }] },
    word: { title: 'Whitespace / word-level tokenization', body: 'The simplest approach: split on whitespace and punctuation. Fast and human-readable, but the vocabulary explodes with inflected forms and unknown words become a problem.', facts: [{ label: 'Used by', val: 'Early NLP, simple pipelines' }, { label: 'Vocabulary size', val: '10,000 – 100,000+' }, { label: 'Handles rare words', val: 'No — UNK token' }, { label: 'Multilingual', val: 'Poor for agglutinative languages' }] },
    char: { title: 'Character-level tokenization', body: 'Every character is its own token. Vocabulary is tiny and handles any text, but sequences become very long.', facts: [{ label: 'Used by', val: 'Some older RNNs, ByT5' }, { label: 'Vocabulary size', val: '256 – ~1,000' }, { label: 'Handles rare words', val: 'Yes — always' }, { label: 'Sequence length', val: 'Much longer than BPE' }] },
  };

  let currentTokens = [];
  let currentTab = 'vis';

  function updateThemeButton(isDark) {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = isDark ? '☽' : '☼';
      btn.classList.toggle('is-dark', isDark);
      btn.classList.toggle('is-light', !isDark);
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    updateThemeButton(isDark);
  }

  function toggleTheme() {
    const htmlEl = document.documentElement;
    const current = htmlEl.getAttribute('data-theme') || 'light';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme === 'dark');
  }

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
  initTheme();

  const inp = document.getElementById('inp');
  const algoSel = document.getElementById('algo');
  const ngramSizeSel = document.getElementById('ngram-size');
  const ngramSizeLabel = document.getElementById('ngram-size-label');
  if (!inp || !algoSel) {
    return;
  }

  function syncAlgoControls() {
    const showNgram = algoSel.value === 'ngram';
    if (ngramSizeSel) ngramSizeSel.style.display = showNgram ? 'inline-block' : 'none';
    if (ngramSizeLabel) ngramSizeLabel.style.display = showNgram ? 'inline-flex' : 'none';
  }

  function switchTab(tab) {
    ['vis', 'ids', 'chars', 'learn'].forEach(t => {
      const el = document.getElementById('tab-' + t);
      if (el) el.style.display = (t === tab ? 'block' : 'none');
      const tabBtn = document.querySelector(`.tab[data-tab="${t}"]`);
      if (tabBtn) tabBtn.classList.toggle('on', t === tab);
    });
    currentTab = tab;
  }

  document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

  function render() {
    const text = inp.value;
    const algo = algoSel.value;
    syncAlgoControls();
    currentTokens = tokenize(text, algo, ngramSizeSel ? ngramSizeSel.value : 1);

    document.getElementById('s-char').textContent = text.length;
    document.getElementById('s-tok').textContent = currentTokens.length;
    const ratio = currentTokens.length ? +(text.length / currentTokens.length).toFixed(2) : 0;
    document.getElementById('s-ratio').textContent = ratio;

    const uniqueTexts = [...new Set(currentTokens.map(t => t.text))];
    const colorMap = {}; uniqueTexts.forEach((t, i) => colorMap[t] = PALETTES[i % PALETTES.length]);

    const legend = document.getElementById('legend');
    const visibleUnique = uniqueTexts.slice(0, 8);
    legend.innerHTML = visibleUnique.map(t => { const p = colorMap[t]; const disp = t.replace(/\n/g, '↵').replace(/ /g, '·'); return `<span class="legend-item"><span class="legend-swatch" style="background:${p.bg};border:1px solid ${p.id}"></span><span style="font-family:var(--font-mono);font-size:11px">${disp}</span></span>` }).join('');

    const tokRow = document.getElementById('tok-row');
    if (!currentTokens.length) { tokRow.innerHTML = '<span class="empty">Start typing above...</span>'; return; }
    tokRow.innerHTML = currentTokens.map((tok, i) => { const p = colorMap[tok.text]; const disp = tok.text.replace(/\n/g, '↵').replace(/ /g, '·'); return `<div class="tok" style="background:${p.bg}" data-idx="${i}" title="Token ${i}: '${disp}' (ID ${tok.id})"><span class="tok-text" style="color:${p.fg}">${disp}</span><span class="tok-id" style="background:${p.id};color:${p.bg}">${tok.id}</span></div>` }).join('');

    document.querySelectorAll('.tok').forEach(el => el.addEventListener('click', () => showDetail(Number(el.dataset.idx))));

    const idRow = document.getElementById('id-row');
    idRow.innerHTML = '[\u2006' + currentTokens.map(t => `<span style="color:var(--color-text-info)">${t.id}</span>`).join(', ') + '\u2006]';

    const charRow = document.getElementById('char-row');
    const chars = [...text];
    charRow.innerHTML = chars.map((ch, ci) => { const tokIdx = currentTokens.findIndex(t => ci >= t.start && ci < t.end); const tok = currentTokens[tokIdx]; const isStart = tok && ci === tok.start; const disp = ch === ' ' ? '·' : ch === '\n' ? '↵' : ch; const bg = isStart ? '#B5D4F4' : '#E6F1FB'; const fg = isStart ? '#0C447C' : '#185FA5'; return `<span class="char-box" style="background:${bg};color:${fg}" title="${isStart ? 'Token start' : 'Continuation'}">${disp}</span>` }).join('');

    const info = algoInfo[algo] || algoInfo.word;
    document.getElementById('learn-title').textContent = info.title;
    document.getElementById('learn-body').textContent = info.body;
    document.getElementById('learn-facts').innerHTML = info.facts.map(f => `<div class="learn-fact-card"><div class="info-box-title">${f.label}</div><div class="info-body">${f.val}</div></div>`).join('');
  }

  function showDetail(i) { const tok = currentTokens[i]; if (!tok) return; document.querySelectorAll('.tok').forEach((el, j) => el.classList.toggle('active', j === i)); const disp = tok.text.replace(/\n/g, '↵').replace(/ /g, '·'); document.getElementById('tok-detail').innerHTML = `<div class="info-box" style="margin-top:10px"><div class="info-box-title">Token ${i} — "<span style="font-family:var(--font-mono)">${disp}</span>"</div><div class="info-body"><b>ID:</b> ${tok.id} &nbsp;|&nbsp; <b>Length:</b> ${tok.text.length} char${tok.text.length !== 1 ? 's' : ''} &nbsp;|&nbsp; <b>Position:</b> chars ${tok.start}–${tok.end - 1}</div></div>`; }

  inp.addEventListener('input', render);
  algoSel.addEventListener('change', render);
  if (ngramSizeSel) ngramSizeSel.addEventListener('change', render);
  syncAlgoControls();
  render();

});

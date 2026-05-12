document.addEventListener('DOMContentLoaded',()=>{
  // Palettes and vocab are embedded (small demo data)
  const PALETTES=[
    {bg:'#E6F1FB',fg:'#0C447C',id:'#185FA5'},
    {bg:'#E1F5EE',fg:'#085041',id:'#0F6E56'},
    {bg:'#FAEEDA',fg:'#633806',id:'#854F0B'},
    {bg:'#FBEAF0',fg:'#4B1528',id:'#993556'},
    {bg:'#EEEDFE',fg:'#26215C',id:'#534AB7'},
    {bg:'#FAECE7',fg:'#4A1B0C',id:'#993C1D'},
    {bg:'#EAF3DE',fg:'#173404',id:'#3B6D11'},
    {bg:'#FCF0F0',fg:'#501313',id:'#A32D2D'},
  ];

  const BPE_VOCAB={
    "Hello":1000,"Hel":1001,"lo":1002,"hello":1003,
    " world":1004,"world":1005,
    "Token":1100,"token":1101,"ization":1102,"iz":1103,"ation":1104,
    " Token":1105," token":1106," Tokenization":1107,
    " is":1200," Is":1201,
    " fascinat":1300," fascin":1301,"fascinat":1302,"ing":1303,
    " fascinating":1304,
    "!":50,"?":51,",":52,".":53," ":32,"\n":10,
    " the":200," The":201," a":202," A":203," an":204,
    " of":210," in":211," to":212," and":213," for":214,
    " is":215," are":216," was":217," with":218,
    "un":300,"re":301,"pre":302,"ing":303,"ed":304,"ly":305,
    "tion":306,"ation":307,"ment":308,"ness":309,
  };

  const BPE_EXTRA_TOKENS=[
    // Common words and fragments
    "I","you","he","she","it","we","they","me","him","her","us","them",
    "my","your","his","their","our","mine","yours","hers","ours","theirs",
    "this","that","these","those","there","here","where","when","why","how",
    "who","whom","whose","what","which","whatever","whichever","whoever","whomever",
    "fact","facts","information","data","details","info","content","context","summary","summaries",
    "name","names","named","naming","nickname","nicknames","username","usernames",
    "family","families","familial","family's","famile",
    "result","results","reason","reasons","answer","answers","question","questions","problem","problems",
    "example","examples","idea","ideas","topic","topics","word","words","sentence","sentences","phrase","phrases",
    "text","texts","token","tokens","tokenize","tokenizes","tokenized","tokenizing","tokenizer","tokenizers",
    "model","models","language","languages","system","systems","input","output","prompt","prompts","response","responses",
    "code","codes","coding","program","programs","programming","function","functions","variable","variables",
    "value","values","class","classes","object","objects","array","arrays","string","strings","number","numbers",
    "boolean","booleans","true","false","null","undefined","undefined","object","objects","return","returns",
    "create","creates","created","creating","build","builds","built","building","learn","learns","learned","learning",
    "use","uses","used","using","work","works","worked","working","make","makes","made","making",
    "see","sees","saw","seen","show","shows","showed","showing","find","finds","found","finding",
    "know","knows","knew","known","think","thinks","thought","thinking","need","needs","needed","needing",
    "want","wants","wanted","wanting","like","likes","liked","liking","love","loves","loved","loving",
    "get","gets","got","gotten","getting","take","takes","took","taken","taking","give","gives","gave","given","giving",
    "say","says","said","saying","go","goes","went","gone","going","run","runs","ran","running",
    "do","does","did","done","doing","have","has","had","having","be","is","are","was","were","been","being",
    "can","could","should","would","will","may","might","must","shall",
    "not","no","yes","maybe","all","any","some","none","most","many","few","more","less",
    "one","two","three","four","five","first","second","third","last","new","old","good","bad","big","small",
    "today","tomorrow","yesterday","now","later","soon","always","never","often","sometimes","usually","rarely",
    "team","teams","person","people","man","men","woman","women","child","children","user","users",
    "very","much",
    "time","times","day","days","week","weeks","month","months","year","years","hour","hours","minute","minutes",
    "local","remote","public","private","static","dynamic","simple","complex","modern","important","familiar",

    // Common leading-space words
    " the"," The"," a"," A"," an"," An"," and"," And"," or"," Or"," but"," But"," if"," If",
    " of"," Of"," in"," In"," to"," To"," for"," For"," on"," On"," at"," At"," by"," By",
    " with"," With"," from"," From"," as"," As"," is"," Is"," are"," Are"," was"," Was"," were"," Were",
    " be"," Be"," been"," Been"," being"," Being"," have"," Have"," has"," Has"," had"," Had",
    " do"," Do"," does"," Does"," did"," Did"," can"," Can"," could"," Could"," should"," Should",
    " would"," Would"," will"," Will"," may"," May"," might"," Might"," must"," Must"," shall"," Shall",
    " not"," Not"," no"," No"," yes"," Yes"," this"," This"," that"," That"," these"," These"," those"," Those",
    " there"," There"," here"," Here"," where"," Where"," when"," When"," why"," Why"," how"," How",
    " what"," What"," which"," Which"," who"," Who"," whom"," Whom"," whose"," Whose",
    " more"," More"," less"," Less"," most"," Most"," many"," Many"," few"," Few"," first"," First"," last"," Last",
    " good"," Good"," bad"," Bad"," big"," Big"," small"," Small"," new"," New"," old"," Old"," simple"," Simple",
    " complex"," Complex"," modern"," Modern"," important"," Important"," example"," Example"," examples"," Examples",
    " family"," Family"," families"," Families"," very"," Very"," much"," Much",

    // Common prefixes and subword pieces
    "un","re","pre","post","anti","non","over","under","inter","trans","sub","super","micro","macro",
    "able","ible","ally","ance","ence","ary","dom","eer","er","est","ful","hood","ism","ist","ity","ive","less","ment",
    "ship","sion","tion","ation","ization","ative","ous","ness","ingly","edly","wise","ward","wards",
    "ing","ed","ly","er","est","s","es","d","n","t","x",
    "tion","sion","cian","tive","graph","logy","phile","phone","scope","meter","nomy","ment","press","pose","form","view",

    // Common character pairings and short chunks
    "th","he","in","er","an","re","on","at","en","nd","ti","es","or","te","of","ed","is","it","al","ar",
    "st","to","nt","ng","se","ha","as","ou","io","le","ve","co","me","de","hi","ri","ro","ic","ne",
    "ea","ra","ce","li","ch","ll","be","ma","si","om","ur","ca","el","ta","la","di","fo","no","pe",
    "ec","pr","pl","tr","cl","qu","wh","ck","sh","ph","gh","oo","ee","ea","ai","ay","ow","ou","oi",
    "en ","th ","re ","in ","er ","an ","on ","at ","to ","of ","is ","it ","or ","al ","ar ","ng ","ed ",
    "ing ","tion ","ment ","ness ","able ","ible ","ally ","ous ","ive ","ize ","ise ","ize","ise", "en", "th",

    // Common verbs and inflections
    "run","runs","ran","running","walk","walks","walked","walking","talk","talks","talked","talking",
    "play","plays","played","playing","read","reads","readed","reading","write","writes","wrote","written",
    "open","opens","opened","opening","close","closes","closed","closing","start","starts","started","starting",
    "create","creates","created","creating","build","builds","built","building","deploy","deploys","deployed","deploying",
    "learn","learns","learned","learning","show","shows","showed","showing","explain","explains","explained","explaining",
    "compare","compares","compared","comparing","choose","chooses","chose","chosen","choosing","remove","removes","removed","removing",
    "add","adds","added","adding","use","uses","used","using","make","makes","made","making","keep","keeps","kept","keeping",

    // High-frequency function words with leading-space variants
    // Common punctuation / formatting / separators
    " ","\n","\t",".",",",";",":","!","?","-","_","/","\\","'","\"","(",")","[","]","{","}","<",">",
    "...","--","—","…","#","@","$","%","&","*","+","=","|",

    // Everyday phrases
    " good"," great"," better"," best"," bad"," worse"," worst"," important"," simple"," complex"," modern",
    " example"," examples"," maybe"," please"," thanks"," thank"," hello"," hi"," welcome"," bye",
    " family"," families"," they"," They",
    " today"," tomorrow"," yesterday"," now"," later"," soon"," always"," never"," often"," sometimes",

    // Numbers and ordinals
    "0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20",
    "21","22","23","24","25","26","27","28","29","30","100","1000","1st","2nd","3rd","4th","5th",

    // Web / coding / UI terms
    "user","users","page","pages","site","sites","browser","browsers","server","servers","client","clients",
    "request","requests","response","responses","render","renders","rendered","rendering","click","clicks","clicked","clicking",
    "hover","hovers","hovered","hovering","load","loads","loaded","loading","center","centers","centered","centering",
    "layout","layouts","style","styles","styled","styling","tokenization","tokenizer","tokenizers","vocab","vocabulary",
    "merge","merges","merged","merging","learn","learned","learns","learning","section","sections","accordion","accordions",
    "simulator","simulate","simulated","simulating","example","examples","basic","basics","advanced","advanced","model","models",
    "home","learn","open","close","choose","selected","selecting","choose","choice","choices","visible","hidden",

    // Common Markdown / HTML / URL pieces
    "https://","http://","www.",".com",".org",".net",".io",".dev",".app",".html",".css",".js","/index.html","/learn.html","/simulator.html",
    "<div>","</div>","<span>","</span>","<script>","</script>","<style>","</style>","<main>","</main>",
  ];

  let nextVocabId=1500;
  BPE_EXTRA_TOKENS.forEach(token=>{
    if(BPE_VOCAB[token]===undefined){
      BPE_VOCAB[token]=nextVocabId++;
    }
  });

  function bpeTokenize(text){
    if(!text.trim())return[];
    const vocab=BPE_VOCAB;
    let tokens=[];let i=0;let id=1400;const idCache={};
    while(i<text.length){
      let best=null,bestLen=0;
      for(let l=Math.min(20,text.length-i);l>=1;l--){
        const sub=text.slice(i,i+l);
        if(vocab[sub]!==undefined&&l>bestLen){best=sub;bestLen=l;}
      }
      if(best){
        const tid=vocab[best];tokens.push({text:best,id:tid,start:i,end:i+bestLen});i+=bestLen;
      } else {
        const ch=text[i];if(!idCache[ch])idCache[ch]=id++;tokens.push({text:ch,id:idCache[ch],start:i,end:i+1});i++;
      }
    }
    return tokens;
  }

  function wordTokenize(text){
    if(!text.trim())return[];
    const re=/\S+|\s+/g;let m,tokens=[],id=2000,cache={};
    while((m=re.exec(text))!==null){const t=m[0];if(!cache[t])cache[t]=id++;tokens.push({text:t,id:cache[t],start:m.index,end:m.index+t.length});}
    return tokens;
  }

  function charTokenize(text){if(!text)return[];return [...text].map((ch,i)=>({text:ch,id:ch.codePointAt(0),start:i,end:i+1}));}

  function tokenize(text,algo){if(algo==='bpe')return bpeTokenize(text);if(algo==='word')return wordTokenize(text);return charTokenize(text);}

  const algoInfo={
    bpe:{title:'Byte-Pair Encoding (BPE)',body:'BPE starts with individual characters or bytes and repeatedly merges the most frequent adjacent pairs found in a training corpus. Those learned merges are then reused at inference time, which is why common words often become single tokens while rarer words stay split into subword pieces. GPT-style models and many LLaMA-family tokenizers use variants of this approach.',facts:[{label:'Used by',val:'GPT-2, GPT-3, GPT-4, LLaMA'},{label:'Vocabulary size',val:'~50,000 – 100,000'},{label:'Handles rare words',val:'Yes — splits into subwords'},{label:'Multilingual',val:'Yes, with byte fallback'}]},
    word:{title:'Whitespace / word-level tokenization',body:'The simplest approach: split on whitespace and punctuation. Fast and human-readable, but the vocabulary explodes with inflected forms and unknown words become a problem.',facts:[{label:'Used by',val:'Early NLP, simple pipelines'},{label:'Vocabulary size',val:'10,000 – 100,000+'},{label:'Handles rare words',val:'No — UNK token'},{label:'Multilingual',val:'Poor for agglutinative languages'}]},
    char:{title:'Character-level tokenization',body:'Every character is its own token. Vocabulary is tiny and handles any text, but sequences become very long.',facts:[{label:'Used by',val:'Some older RNNs, ByT5'},{label:'Vocabulary size',val:'256 – ~1,000'},{label:'Handles rare words',val:'Yes — always'},{label:'Sequence length',val:'Much longer than BPE'}]},
  };

  let currentTokens=[];
  let currentTab='vis';

  const inp=document.getElementById('inp');
  const algoSel=document.getElementById('algo');

  function switchTab(tab){
    ['vis','ids','chars','learn'].forEach(t=>{
      const el=document.getElementById('tab-'+t);
      if(el)el.style.display=(t===tab?'block':'none');
      const tabBtn=document.querySelector(`.tab[data-tab="${t}"]`);
      if(tabBtn)tabBtn.classList.toggle('on',t===tab);
    });
    currentTab=tab;
  }

  document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>switchTab(btn.dataset.tab)));

  function render(){
    const text=inp.value;const algo=algoSel.value;currentTokens=tokenize(text,algo);

    document.getElementById('s-char').textContent=text.length;
    document.getElementById('s-tok').textContent=currentTokens.length;
    const ratio=currentTokens.length?+(text.length/currentTokens.length).toFixed(2):0;
    document.getElementById('s-ratio').textContent=ratio;

    const uniqueTexts=[...new Set(currentTokens.map(t=>t.text))];
    const colorMap={};uniqueTexts.forEach((t,i)=>colorMap[t]=PALETTES[i%PALETTES.length]);

    const legend=document.getElementById('legend');
    const visibleUnique=uniqueTexts.slice(0,8);
    legend.innerHTML=visibleUnique.map(t=>{const p=colorMap[t];const disp=t.replace(/\n/g,'↵').replace(/ /g,'·');return `<span class="legend-item"><span class="legend-swatch" style="background:${p.bg};border:1px solid ${p.id}"></span><span style="font-family:var(--font-mono);font-size:11px">${disp}</span></span>`}).join('');

    const tokRow=document.getElementById('tok-row');
    if(!currentTokens.length){tokRow.innerHTML='<span class="empty">Start typing above...</span>';return;}
    tokRow.innerHTML=currentTokens.map((tok,i)=>{const p=colorMap[tok.text];const disp=tok.text.replace(/\n/g,'↵').replace(/ /g,'·');return `<div class="tok" style="background:${p.bg}" data-idx="${i}" title="Token ${i}: '${disp}' (ID ${tok.id})"><span class="tok-text" style="color:${p.fg}">${disp}</span><span class="tok-id" style="background:${p.id};color:${p.bg}">${tok.id}</span></div>`}).join('');

    document.querySelectorAll('.tok').forEach(el=>el.addEventListener('click',()=>showDetail(Number(el.dataset.idx))));

    const idRow=document.getElementById('id-row');
    idRow.innerHTML='[\u2006'+currentTokens.map(t=>`<span style="color:var(--color-text-info)">${t.id}</span>`).join(', ')+'\u2006]';

    const charRow=document.getElementById('char-row');
    const chars=[...text];
    charRow.innerHTML=chars.map((ch,ci)=>{const tokIdx=currentTokens.findIndex(t=>ci>=t.start&&ci<t.end);const tok=currentTokens[tokIdx];const isStart=tok&&ci===tok.start;const disp=ch===' '?'·':ch==='\n'?'↵':ch;const bg=isStart?'#B5D4F4':'#E6F1FB';const fg=isStart?'#0C447C':'#185FA5';return `<span class="char-box" style="background:${bg};color:${fg}" title="${isStart?'Token start':'Continuation'}">${disp}</span>`}).join('');

    const info=algoInfo[algo];
    document.getElementById('learn-title').textContent=info.title;
    document.getElementById('learn-body').textContent=info.body;
    document.getElementById('learn-facts').innerHTML=info.facts.map(f=>`<div style="background:var(--color-background-secondary);border-radius:var(--border-radius-md);padding:10px 12px"><div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:3px">${f.label}</div><div style="font-size:13px;font-weight:600;color:var(--color-text-primary)">${f.val}</div></div>`).join('');
  }

  function showDetail(i){const tok=currentTokens[i];if(!tok)return;document.querySelectorAll('.tok').forEach((el,j)=>el.classList.toggle('active',j===i));const disp=tok.text.replace(/\n/g,'↵').replace(/ /g,'·');document.getElementById('tok-detail').innerHTML=`<div class="info-box" style="margin-top:10px"><div class="info-box-title">Token ${i} — "<span style="font-family:var(--font-mono)">${disp}</span>"</div><div class="info-body"><b>ID:</b> ${tok.id} &nbsp;|&nbsp; <b>Length:</b> ${tok.text.length} char${tok.text.length!==1?'s':''} &nbsp;|&nbsp; <b>Position:</b> chars ${tok.start}–${tok.end-1}</div></div>`;}

  inp.addEventListener('input',render);
  algoSel.addEventListener('change',render);
  render();
});

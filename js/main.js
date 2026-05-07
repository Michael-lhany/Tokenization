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

  function bpeTokenize(text){
    if(!text.trim())return[];
    let tokens=[];let i=0;let id=1400;const idCache={};
    while(i<text.length){
      let best=null,bestLen=0;
      for(let l=Math.min(20,text.length-i);l>=1;l--){
        const sub=text.slice(i,i+l);
        if(BPE_VOCAB[sub]!==undefined&&l>bestLen){best=sub;bestLen=l;}
      }
      if(best){
        const tid=BPE_VOCAB[best];tokens.push({text:best,id:tid,start:i,end:i+bestLen});i+=bestLen;
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
    bpe:{title:'Byte-Pair Encoding (BPE)',body:'BPE starts with individual characters and iteratively merges the most frequent adjacent pairs into a single token. It strikes a balance: common words become single tokens, rare words are split into meaningful subword pieces. GPT-2, GPT-4, and LLaMA all use variants of BPE.',facts:[{label:'Used by',val:'GPT-2, GPT-3, GPT-4, LLaMA'},{label:'Vocabulary size',val:'~50,000 – 100,000'},{label:'Handles rare words',val:'Yes — splits into subwords'},{label:'Multilingual',val:'Yes, with byte fallback'}]},
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

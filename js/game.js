// ══════════════════════════════════════════════════
//  TERRA — js/game.js  v0.4.0
// ══════════════════════════════════════════════════

import { ERAS, eraRES, currentBldgs, currentTechs, currentZones,
         currentKeyTech, initialZones, buildCostMult, techCostMult,
         upgradeCostMult, marketRate, MARKET_TAX_GOLD,
         RES_VALUE, MARKET_LOTS } from './data.js';
import { saveCity, syncStats, postOffer, cancelOffer, acceptOffer } from './db.js';

// ── Helpers importés dans ui.js via window ────────
export let _toast  = (m,t)  => console.log(m);
export let _addLog = (m,c) => {};
export function setToast(fn)  { _toast  = fn; }
export function setAddLog(fn) { _addLog = fn; }

// ══════════════════════════════════════════════════
//  ÉTAT GLOBAL
// ══════════════════════════════════════════════════
export const S = {
  era:        0,
  eraHistory: [],
  res:        { ...ERAS[0].startRes },   // ← ressources Âge de Pierre par défaut
  isp:        80,
  pop:        5,
  popMax:     8,
  day:        1,
  cycle:      0,
  hasTH:      false,
  zones:      initialZones(0),           // ← zones Âge de Pierre par défaut
  bq:         [],
  rq:         [],
  built:      {},
  tm:         {},
  delta:      {},
  log:        [],
  lastPop:    5,
  dirty:      false,
  localOffers:[],
};

export const CTX = { uid:null, worldId:null, world:null, profile:null };

let _tick=null, _save=null;

// ─── Init ressources selon l'ère ─────────────────
function resetToEra(eraId, bonus={}) {
  const ERA = ERAS[eraId];
  S.era   = eraId;
  S.res   = { ...ERA.startRes };
  S.isp   = 80;
  S.hasTH = false;
  S.zones = initialZones(eraId);
  S.bq    = [];
  S.rq    = [];
  S.built = {};
  S.log   = [];
  S.delta = {};
  S.day   = 1;
  S.cycle = 0;
  // Reset techs de l'ère
  ERA.techs.forEach(t => t.done = false);
  // Appliquer les bonus de prestige
  S.pop    = 5 + (bonus.popBonus || 0);
  S.popMax = 8 + (bonus.popBonus || 0);
  if (bonus.resBonus) {
    Object.keys(S.res).forEach(k => {
      S.res[k] = Math.floor(S.res[k] * (1 + bonus.resBonus));
    });
  }
}

// ── LOAD ──────────────────────────────────────────
export function loadState(saved) {
  if (!saved) {
    // Nouveau joueur : initialiser proprement l'ère 0
    resetToEra(0);
    return;
  }
  ['res','isp','pop','popMax','day','cycle','hasTH','zones','built','tm','era','eraHistory'].forEach(k => {
    if (saved[k] !== undefined) S[k] = saved[k];
  });
  S.lastPop = S.pop;
  S.dirty   = false;
  // Restaurer techs done
  if (S.tm._done) {
    ERAS[S.era].techs.forEach(t => { if (S.tm._done.includes(t.id)) t.done = true; });
  }
  // Sécurité : si res ou zones sont vides après chargement, réinitialiser
  if (!S.res || Object.keys(S.res).length === 0) {
    S.res = { ...ERAS[S.era].startRes };
  }
  if (!S.zones || Object.keys(S.zones).length === 0) {
    S.zones = initialZones(S.era);
  }
}

// ── SAVE ──────────────────────────────────────────
async function doSave() {
  if (!CTX.uid || !CTX.worldId) return;
  S.tm._done = ERAS[S.era].techs.filter(t=>t.done).map(t=>t.id);
  await saveCity(CTX.worldId, CTX.uid, S);
  await syncStats(CTX.uid, S);
  S.dirty = false;
  document.getElementById('save-dot')?.classList.remove('dirty');
}
function markDirty() { S.dirty=true; document.getElementById('save-dot')?.classList.add('dirty'); }
export function startAutoSave() { _save=setInterval(()=>{ if(S.dirty) doSave(); },30000); }
export function forceSave() { return doSave(); }

// ── WORKFORCE ─────────────────────────────────────
export function workforce() {
  if (S.popMax<=0) return 0.4;
  return Math.min(1, 0.4+0.6*(S.pop/S.popMax));
}

// ══════════════════════════════════════════════════
//  AVANCEMENT D'ÈRE
// ══════════════════════════════════════════════════
export function canAdvanceEra() {
  const kt = currentKeyTech(S.era);
  return kt && kt.done;
}

export function advanceEra(onUpdate) {
  if (!canAdvanceEra()) { _toast("Recherchez d'abord la technologie clé de cette ère",'e'); return; }
  const ERA = ERAS[S.era];
  if (ERA.techs.find(t=>t.isVictory&&t.done)) {
    _toast('🏆 VICTOIRE ! Vous avez transcendé l\'humanité !','g');
    _addLog('🏆 VICTOIRE ULTIME — Transcendance atteinte','g');
    return;
  }
  if (S.era >= ERAS.length-1) { _toast('Vous êtes à l\'ère finale !','w'); return; }

  // Calculer les bonus
  const bonus = {
    popBonus: Math.floor(S.pop * 0.3) + (ERA.eraBonus.popBonus||0),
    resBonus: ERA.eraBonus.resBonus || 0.2,
    prodMult: ERA.eraBonus.prodMult || 1.15,
  };

  // Accumuler le multiplicateur permanent
  const prevG = S.tm.g || 1;
  const newG   = prevG * bonus.prodMult;
  const savedTm = { g: newG, _eraBonus: newG, _done:[] };

  // Enregistrer l'histoire
  S.eraHistory.push({ era:S.era, name:ERA.name, completedDay:S.day });

  const nextEra = S.era + 1;
  const NEXT    = ERAS[nextEra];

  // Reset total avec bonus
  resetToEra(nextEra, bonus);
  S.tm = savedTm;

  _toast(`🎉 Bienvenue dans l'${NEXT.name} !`,'g');
  _addLog(`✨ Transition → ${NEXT.name} (bonus: pop+${bonus.popBonus}, prod×${bonus.prodMult})`,'g');

  // Appliquer le thème de la nouvelle ère
  applyEraTheme(nextEra);

  markDirty();
  onUpdate?.();
}

// ── THÈME DYNAMIQUE ───────────────────────────────
export function applyEraTheme(eraId) {
  const p = ERAS[eraId].palette;
  const r = document.documentElement.style;
  r.setProperty('--bg',   p.bg);
  r.setProperty('--bg1',  p.bg1);
  r.setProperty('--bg2',  p.bg2);
  r.setProperty('--cy',   p.accent);
  r.setProperty('--cy2',  p.accent2);
  r.setProperty('--go',   p.gold);
  r.setProperty('--mu',   p.muted);
}

// ── TICK ──────────────────────────────────────────
export function startTick(onTick) {
  _tick=setInterval(()=>{ runTick(); onTick?.(); },7000);
}
export function stopTick() { clearInterval(_tick); clearInterval(_save); }

export function runTick() {
  S.cycle++;
  if (S.cycle%10===0) S.day++;
  const d={}, wf=workforce();
  Object.keys(S.res).forEach(k=>d[k]=0);
  const BLDGS = currentBldgs(S.era);
  Object.values(S.zones).forEach(z=>z.buildings.forEach(b=>{
    const bld=BLDGS[b.key]; if(!bld?.prod) return;
    Object.entries(bld.prod).forEach(([r,v])=>{
      const m=(S.tm[r]||1)*(S.tm.g||1)*wf;
      d[r]=(d[r]||0)+Math.round(v*m);
    });
  }));
  d.food  -= Math.ceil(S.pop/5);
  d.water -= Math.ceil(S.pop/6);
  Object.keys(S.res).forEach(r=>S.res[r]=Math.max(0,(S.res[r]||0)+(d[r]||0)));
  S.delta=d;
  const green=cntB(['dome','ecosphere','solaire','solairemega','parc','park']);
  const poll =cntB(['usine','mine','centrale','usine2','datacenter']);
  S.isp=clamp(S.isp+green*0.8*(S.tm.isp||1)-poll*0.4,0,100);
  S.lastPop=S.pop;
  if(S.res.food>8&&S.res.water>6&&S.pop<S.popMax) S.pop=Math.min(S.popMax,S.pop+1);
  else if(!S.res.food||!S.res.water){
    S.pop=Math.max(1,S.pop-2);
    _toast('⚠ Pénurie ! Population en déclin','e');
    _addLog('Pénurie — pop en déclin','r');
  }
  markDirty();
}

// ── BUILD ─────────────────────────────────────────
// Bâtiment fondateur de chaque ère (le premier à construire, débloque les autres)
const ERA_FOUNDER = ['foyer','village','maison','domus','chaumiere','palazzo','ouvrier','immeuble','smartapt','dome'];

export function checkPrereq(key) {
  const founderKey = ERA_FOUNDER[S.era] || 'town_hall';
  const isFounder  = key === founderKey;
  // Le fondateur est toujours accessible
  if (isFounder) return true;
  // Les autres nécessitent que le fondateur soit construit
  if (!S.hasTH) return false;
  return true;
}

export function freeSlots(t) {
  const z=S.zones[t]; if(!z) return 0;
  const Z=currentZones(S.era)[t]; if(!Z) return 0;
  return z.count*Z.slots-z.buildings.length;
}

export function realCost(key) {
  const BLDGS=currentBldgs(S.era), bld=BLDGS[key]; if(!bld) return {};
  const lvl=S.built[key]||0, ageMult=buildCostMult(S.day,S.era);
  if(lvl>0 && bld.upgCm) return scaleCost(bld.cost, upgradeCostMult(bld.upgCm||1.8,lvl,S.day,S.era)*ageMult);
  return scaleCost(bld.cost, ageMult);
}

export function realTechCost(tech) {
  const mult=techCostMult(tech.tier||1,S.day,S.era);
  const c={};
  Object.entries(tech.cost).forEach(([k,v])=>c[k]=Math.ceil(v*mult));
  return c;
}

export function realBuildTime(key) {
  const BLDGS=currentBldgs(S.era), bld=BLDGS[key]; if(!bld) return 5;
  const lvl=S.built[key]||0;
  const lf=1+lvl*0.10, af=1+Math.floor(S.day/10)*0.05, ef=1+S.era*0.05;
  return Math.round(bld.t*lf*af*ef);
}

export function scaleCost(base,mult) {
  const c={};
  Object.entries(base).forEach(([k,v])=>c[k]=Math.ceil(v*mult));
  return c;
}
export function canAfford(cost) {
  return Object.entries(cost).every(([r,a])=>(S.res[r]||0)>=a);
}
function pay(cost) { Object.entries(cost).forEach(([r,a])=>S.res[r]=(S.res[r]||0)-a); }

export function doBuild(key, onUpdate) {
  const founderKey = ERA_FOUNDER[S.era] || 'town_hall';
  if (!S.hasTH && key !== founderKey) {
    const founderName = currentBldgs(S.era)[founderKey]?.n || founderKey;
    _toast(`Construisez d'abord : ${founderName}`, 'e'); return;
  }
  if (S.bq.length>=3) { _toast('File pleine — max 3 simultanées','w'); return; }
  if (S.bq.find(q=>q.key===key)) { _toast('Déjà en construction','w'); return; }
  const BLDGS=currentBldgs(S.era), bld=BLDGS[key];
  if(!bld) return;
  if(bld.minPop>0&&S.pop<bld.minPop){ _toast(`Requiert ${bld.minPop} habitants (actuel: ${S.pop})`,'e'); return; }
  const cost=realCost(key);
  if(!canAfford(cost)){ _toast('Ressources insuffisantes','e'); return; }
  const tz=bld.terrain.find(t=>freeSlots(t)>0)||bld.terrain[0];
  if(!tz&&key!==ERA_FOUNDER[S.era]&&key!=='town_hall'){ _toast('Aucun emplacement disponible','e'); return; }
  pay(cost);
  const dur=realBuildTime(key)*1000;
  const entry={id:Date.now(),key,name:bld.n,lvl:(S.built[key]||0)+1,start:Date.now(),dur,fin:Date.now()+dur,tz};
  S.bq.push(entry);
  if(dur===0){ finishBuild(entry,onUpdate); }
  else { setTimeout(()=>finishBuild(entry,onUpdate),dur); _toast(`⚒ ${bld.n} — ${realBuildTime(key)}s`); _addLog(`Construction : ${bld.n}`); }
  markDirty(); onUpdate?.();
}

function finishBuild(entry,onUpdate) {
  S.bq=S.bq.filter(q=>q.id!==entry.id);
  const BLDGS=currentBldgs(S.era), bld=BLDGS[entry.key];
  S.built[entry.key]=(S.built[entry.key]||0)+1;
  if(bld.eco)  S.isp=clamp(S.isp+bld.eco,0,100);
  if(bld.pop)  S.popMax+=Math.round(bld.pop*(S.tm.pop||1));
  if(entry.tz&&S.zones[entry.tz]) S.zones[entry.tz].buildings.push({key:entry.key,lvl:entry.lvl});
  const _fk = ERA_FOUNDER[S.era] || 'town_hall'; if(entry.key===_fk || entry.key==='town_hall') S.hasTH=true;
  _toast(`✓ ${bld.n} terminée !`,'g');
  _addLog(`${bld.n} Niv.${entry.lvl} terminée`,'g');
  markDirty(); onUpdate?.();
}

// ── RESEARCH ─────────────────────────────────────
export function doResearch(techId,onUpdate) {
  if(S.rq.length>=2){ _toast('Max 2 recherches simultanées','w'); return; }
  const tech=currentTechs(S.era).find(t=>t.id===techId);
  if(!tech||tech.done) return;
  const cost=realTechCost(tech);
  if(!canAfford(cost)){ _toast('Ressources insuffisantes','e'); return; }
  pay(cost);
  const dur=tech.t*1000*Math.max(1,techCostMult(tech.tier||1,S.day,S.era));
  const entry={id:tech.id,start:Date.now(),dur,fin:Date.now()+dur};
  S.rq.push(entry);
  setTimeout(()=>finishResearch(techId,onUpdate),dur);
  _toast(`🔬 ${tech.n} — ${Math.round(dur/1000)}s`);
  _addLog(`Recherche : ${tech.n}`);
  markDirty(); onUpdate?.();
}

function finishResearch(techId,onUpdate) {
  const tech=currentTechs(S.era).find(t=>t.id===techId); if(!tech) return;
  S.rq=S.rq.filter(q=>q.id!==techId);
  tech.done=true;
  if(tech.applyFn) tech.applyFn(S.tm);
  _toast(`✓ ${tech.n} acquise !`,'g');
  _addLog(`Technologie : ${tech.n}`,'g');
  // Vérifier si c'est la tech clé → proposer l'avancement
  if(tech.isKeyTech && !tech.isVictory) {
    setTimeout(()=>_toast(`🌟 Ère maîtrisée ! Passez à l'${ERAS[S.era+1]?.name} dans Évolutions`,'g'),500);
  }
  if(tech.isVictory) _toast('🏆 VICTOIRE ULTIME — Transcendance !','g');
  markDirty(); onUpdate?.();
}

// ── MARKET ────────────────────────────────────────
export function getMarketRate(fr,to){ return marketRate(fr,to,S.day,S.tm.market_discount||1); }

export async function doPostOffer(giveRes,giveQty,wantRes,onUpdate) {
  if((S.res[giveRes]||0)<giveQty){ _toast('Stock insuffisant','e'); return; }
  if((S.res.wealth||0)<MARKET_TAX_GOLD){ _toast(`Commission requise: ${MARKET_TAX_GOLD} ${ERAS[S.era].resources.wealth?.ic||'💰'}`,'e'); return; }
  const rate=getMarketRate(giveRes,wantRes);
  const wantQty=Math.floor(giveQty/rate);
  if(wantQty<1){ _toast('Lot trop petit','e'); return; }
  S.res[giveRes]-=giveQty; S.res.wealth-=MARKET_TAX_GOLD;
  const playerName=CTX.profile?.displayName||'Joueur';
  if(CTX.worldId) await postOffer(CTX.worldId,CTX.uid,playerName,{res:giveRes,qty:giveQty},{res:wantRes,qty:wantQty},rate,S.day);
  else S.localOffers.push({id:'local_'+Date.now(),uid:CTX.uid||'local',playerName,give:{res:giveRes,qty:giveQty},want:{res:wantRes,qty:wantQty},rate,day:S.day,status:'open'});
  const rDefs=ERAS[S.era].resources;
  _toast(`📋 Offre : ${giveQty} ${rDefs[giveRes]?.ic||giveRes} → ${wantQty} ${rDefs[wantRes]?.ic||wantRes}`,'g');
  _addLog(`Marché : ${giveQty} ${giveRes} → ${wantQty} ${wantRes}`,'g');
  markDirty(); onUpdate?.();
}

export async function doAcceptOffer(offer,onUpdate) {
  if(offer.uid===CTX.uid){ _toast("Vous ne pouvez pas accepter votre propre offre",'e'); return; }
  if((S.res[offer.want.res]||0)<offer.want.qty){ _toast(`Insuffisant : ${offer.want.qty} requis`,'e'); return; }
  if((S.res.wealth||0)<MARKET_TAX_GOLD){ _toast(`Commission requise: ${MARKET_TAX_GOLD}`,'e'); return; }
  S.res[offer.want.res]-=offer.want.qty;
  S.res[offer.give.res]=(S.res[offer.give.res]||0)+offer.give.qty;
  S.res.wealth-=MARKET_TAX_GOLD;
  if(CTX.worldId&&!offer.id.startsWith('local_')) await acceptOffer(CTX.worldId,offer.id,CTX.uid,CTX.profile?.displayName||'Joueur');
  else S.localOffers=S.localOffers.filter(o=>o.id!==offer.id);
  _toast(`✓ Échange : +${offer.give.qty} ${ERAS[S.era].resources[offer.give.res]?.ic||offer.give.res}`,'g');
  markDirty(); onUpdate?.();
}

export async function doCancelOffer(offerId,onUpdate) {
  if(CTX.worldId&&!offerId.startsWith('local_')){ const {cancelOffer:co}=await import('./db.js'); await co(CTX.worldId,offerId); }
  else S.localOffers=S.localOffers.filter(o=>o.id!==offerId);
  _toast('Offre annulée','w'); onUpdate?.();
}

// ── UTILS ─────────────────────────────────────────
export function cntB(keys) {
  let n=0;
  Object.values(S.zones).forEach(z=>z.buildings.forEach(b=>{ if(keys.includes(b.key)) n++; }));
  return n;
}
export function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
export function fmt(n){ return n>=10000?(n/1000).toFixed(1)+'k':Math.floor(n); }
export function buildPct(q){ return Math.min(100,Math.round((Date.now()-q.start)/q.dur*100)); }
export function eta(fin){ const s=Math.max(0,Math.ceil((fin-Date.now())/1000)); return s>=60?Math.floor(s/60)+'m'+('0'+(s%60)).slice(-2)+'s':s+'s'; }

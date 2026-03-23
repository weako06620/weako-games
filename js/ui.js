// ══════════════════════════════════════════════════
//  TERRA — js/ui.js  v0.5.0
// ══════════════════════════════════════════════════

import { ERAS, eraRES, currentBldgs, currentTechs, currentZones,
         currentRes, currentKeyTech, MARKET_TAX_GOLD, MARKET_LOTS, VERSION } from './data.js';
import { S, CTX, workforce, checkPrereq, freeSlots, realCost, realTechCost,
         realBuildTime, canAfford, cntB, fmt, buildPct, eta,
         doBuild, doResearch, doPostOffer, doAcceptOffer, doCancelOffer,
         getMarketRate, advanceEra, canAdvanceEra, applyEraTheme,
         setToast, setAddLog } from './game.js';
import { avatarColor, getInitials } from './auth.js';

// Fondateurs d'ère (miroir de game.js)
const ERA_FOUNDER = ['foyer','village','maison','domus','chaumiere','palazzo','ouvrier','immeuble','smartapt','dome'];

// ── Init callbacks ────────────────────────────────
setToast((m,t)  => toast(m,t));
setAddLog((m,c) => addLog(m,c));

// ── TOAST & LOG ───────────────────────────────────
export function toast(msg,type='') {
  const w=document.getElementById('toast'); if(!w) return;
  const e=document.createElement('div');
  e.className='toast-item'+(type?' '+type:'');
  e.textContent=msg; w.appendChild(e);
  setTimeout(()=>e.remove(),3100);
}
export function addLog(m,c='') {
  const now=new Date();
  S.log.push({m,c,t:now.getHours()+':'+('0'+now.getMinutes()).slice(-2)});
  if(S.log.length>40) S.log.shift();
}

// ── NAV ───────────────────────────────────────────
export function initNav(views) {
  document.querySelectorAll('.nb').forEach(b=>{
    b.addEventListener('click',()=>{
      document.querySelectorAll('.nb').forEach(x=>x.classList.remove('on'));
      document.querySelectorAll('.view').forEach(x=>x.classList.remove('on'));
      b.classList.add('on');
      const v=document.getElementById(b.dataset.v); if(v) v.classList.add('on');
      renderActive(views);
    });
  });
}
export function renderActive(views) {
  const id=document.querySelector('.view.on')?.id;
  if(id&&views[id]) views[id]();
}
window._goTo=id=>{
  document.querySelectorAll('.nb').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.view').forEach(x=>x.classList.remove('on'));
  const nb=document.querySelector(`[data-v="${id}"]`);
  if(nb) nb.classList.add('on');
  const v=document.getElementById(id); if(v) v.classList.add('on');
};

// ── TOPBAR ────────────────────────────────────────
export function updateTopbar() {
  const ERA=ERAS[S.era], isp=Math.round(S.isp), wf=Math.round(workforce()*100);
  const ispC=isp>70?'var(--gn)':isp>45?'#6ee7b7':isp>25?'var(--go)':'var(--rd)';
  const ispSt=isp>70?'Florissante':isp>45?'Stable':isp>25?'Dégradée':'Critique';
  set('sb-isp-fill',el=>el.style.cssText=`width:${isp}%;background:${ispC}`);
  set('sb-isp-num', el=>{ el.textContent=isp; el.style.color=ispC; });
  set('sb-isp-st',  el=>{ el.textContent=ispSt; el.style.color=ispC; });
  set('sb-pop',     el=>el.textContent=`${S.pop} / ${S.popMax}`);
  const pd=S.pop-S.lastPop;
  set('sb-pop-st',el=>{ el.textContent=pd>0?`+${pd}/cy`:pd<0?`${pd}/cy`:'→ stable'; el.style.color=pd>0?'var(--gn)':pd<0?'var(--rd)':'var(--mu2)'; });
  set('sb-wf-fill',  el=>el.style.width=wf+'%');
  set('sb-wf-num',   el=>el.textContent=wf+'%');
  set('sb-wf-st',    el=>el.textContent=wf<60?'⚠ faible':wf<85?'✓ correct':'★ optimal');
  set('sb-day',      el=>el.textContent=S.day);
  set('sb-cy',       el=>el.textContent='Cycle '+S.cycle);
  set('tb-era',      el=>{ el.textContent=ERA.icon+' '+ERA.name; el.style.color=ERA.palette.accent; });
  // ISP nav widget
  set('ni-fill',el=>el.style.cssText=`width:${isp}%;background:${ispC}`);
  set('ni-val', el=>{ el.textContent=isp; el.style.color=ispC; });
  set('ni-st',  el=>{ el.textContent=ispSt; el.style.color=ispC; });
}

// ══════════════════════════════════════════════════
//  OVERVIEW
// ══════════════════════════════════════════════════
export function renderOverview() {
  const ERA=ERAS[S.era];
  const tb=Object.values(S.built).reduce((a,b)=>a+b,0);
  const td=currentTechs(S.era).filter(t=>t.done).length;
  const kt=currentKeyTech(S.era);
  const isp=Math.round(S.isp), wf=Math.round(workforce()*100);

  // Bandeau Ère
  const eraHtml=`
  <div style="background:linear-gradient(135deg,${ERA.palette.bg1},${ERA.palette.bg2});border:1px solid ${ERA.palette.accent}33;border-radius:8px;padding:12px 15px;margin-bottom:14px;position:relative;overflow:hidden;">
    <div style="position:absolute;right:15px;top:50%;transform:translateY(-50%);font-size:48px;opacity:.12;">${ERA.icon}</div>
    <div style="font-family:var(--sans);font-size:10px;color:var(--mu2);text-transform:uppercase;letter-spacing:2px;margin-bottom:3px;">Ère ${S.era+1}/10</div>
    <div style="font-family:var(--sans);font-size:20px;font-weight:800;color:${ERA.palette.accent};letter-spacing:1px;">${ERA.icon} ${ERA.name}</div>
    <div style="font-size:11px;color:var(--mu2);margin-top:3px;">${ERA.desc}</div>
    ${S.eraHistory.length?`<div style="font-size:9px;color:var(--mu);margin-top:6px;">Ères précédentes : ${S.eraHistory.map(h=>h.icon||'◆'+' '+h.name).join(' → ')}</div>`:''}
    ${kt?`<div style="margin-top:8px;padding:6px 10px;background:${kt.done?'rgba(74,222,128,.1)':'rgba(255,255,255,.04)'};border:1px solid ${kt.done?'rgba(74,222,128,.3)':ERA.palette.accent+'44'};border-radius:6px;font-size:10px;color:${kt.done?'var(--gn)':ERA.palette.accent};">
      ${kt.done?'🌟':'🔑'} Tech clé : ${kt.n} — ${kt.done?'Prêt à avancer !':'En attente'}
    </div>`:''}
  </div>`;

  const cards=[
    {l:'Population',   v:`${S.pop}/${S.popMax}`,c:S.pop>=S.popMax?'w':'',   s:`${Math.ceil(S.pop/5)} nourrit. · ${Math.ceil(S.pop/6)} eau /cy`},
    {l:"Main-d'œuvre", v:wf+'%',                c:wf>80?'g':wf>55?'w':'p',  s:wf<60?"⚠ loger plus d'habitants":'prod × '+wf+'%'},
    {l:'Santé Planète',v:isp+'%',                c:isp>70?'g':isp>30?'w':'r',s:isp>70?'Florissante':isp>45?'Stable':'Danger'},
    {l:'Bâtiments',    v:tb,                     c:'',                        s:`${S.bq.length}/3 en construction`},
    {l:'Évolutions',   v:`${td}/${currentTechs(S.era).length}`,c:'',         s:'recherches cette ère'},
    {l:'Prestige',     v:`Ère ${S.era+1}`,       c:S.era>0?'g':'',           s:`${S.eraHistory.length} ères maîtrisées`},
  ];

  set('ov-cards',el=>el.innerHTML=eraHtml+cards.map(c=>`<div class="card"><div class="cl">${c.l}</div><div class="cv ${c.c}">${c.v}</div><div class="cs">${c.s}</div></div>`).join(''));
  set('ov-t',el=>el.textContent=`Jour ${S.day} — Cycle ${S.cycle}`);

  // Table ressources avec noms de l'ère
  const RDEF=currentRes(S.era);
  set('ov-res',el=>{
    el.innerHTML=`<div class="res-head"><div class="rh">Ressource</div><div class="rh">Stock</div><div class="rh">+Prod/cy</div><div class="rh">−Cons/cy</div></div>`+
    Object.entries(RDEF).map(([k,rr])=>{
      const stock=Math.floor(S.res[k]||0);
      const d=S.delta[k]||0, prod=d>0?d:0, cons=d<0?Math.abs(d):0;
      const maxV=500, pct=Math.min(100,Math.round(stock/maxV*100));
      const barC=pct>60?'var(--gn)':pct>25?'var(--go)':'var(--rd)';
      return `<div class="res-row"><div class="rn">${rr.ic} ${rr.n}</div>
        <div class="rstock"><div class="rv" id="rv-${k}">${fmt(stock)}</div>
          <div class="rbar"><div class="rbar-fill" id="rb-${k}" style="width:${pct}%;background:${barC}"></div></div></div>
        <div class="rd2 ${prod>0?'pos':'zero'}">${prod>0?'+'+prod:'—'}</div>
        <div class="rd2 ${cons>0?'neg':'zero'}">${cons>0?'−'+cons:'—'}</div>
      </div>`;
    }).join('');
  });

  set('ov-log',el=>{
    el.innerHTML=!S.log.length?'<div style="color:var(--mu);padding:8px 0;font-size:11px">Aucune activité.</div>':
      S.log.slice(-25).reverse().map(l=>`<div class="log-row"><span class="log-t">${l.t}</span><span class="log-m ${l.c||''}">${l.m}</span></div>`).join('');
  });
}

export function liveUpdateRes() {
  const RDEF=currentRes(S.era);
  Object.keys(RDEF).forEach(k=>{
    const vEl=document.getElementById('rv-'+k), bEl=document.getElementById('rb-'+k);
    if(!vEl) return;
    const cur=Math.floor(S.res[k]||0), prev=parseInt(vEl.dataset.prev||cur);
    vEl.textContent=fmt(cur); vEl.dataset.prev=cur;
    if(cur>prev){vEl.classList.add('up');setTimeout(()=>vEl.classList.remove('up'),500);}
    else if(cur<prev){vEl.classList.add('dn');setTimeout(()=>vEl.classList.remove('dn'),500);}
    if(bEl){ const pct=Math.min(100,Math.round(cur/500*100)); const barC=pct>60?'var(--gn)':pct>25?'var(--go)':'var(--rd)'; bEl.style.cssText=`width:${pct}%;background:${barC}`; }
  });
}

// ── ZONES ─────────────────────────────────────────
let _openZone = null;

// Fondateurs par ère (dupliqué ici pour l'UI)
const ERA_FOUNDER = ['foyer','village','maison','domus','chaumiere','palazzo','ouvrier','immeuble','smartapt','dome'];

export function renderZones() {
  const el=document.getElementById('zo-list'); if(!el) return;
  const ZDEFS=currentZones(S.era), BLDGS=currentBldgs(S.era), ERA=ERAS[S.era];
  const zoneKeys=Object.keys(S.zones);
  if(!_openZone||!S.zones[_openZone]) _openZone=zoneKeys[0];

  // ── Onglets ──
  const tabsHtml=zoneKeys.map(type=>{
    const Z=ZDEFS[type]; if(!Z) return '';
    const zone=S.zones[type], max=zone.count*Z.slots, used=zone.buildings.length, on=_openZone===type;
    return `<div class="zo-tab ${on?'on':''}" onclick="window._zoTab('${type}')"
      style="${on?'border-bottom-color:'+Z.col+';color:'+Z.col:''}">
      ${Z.ic} ${Z.n}
      <span class="zo-tab-count">${used}/${max}</span>
    </div>`;
  }).join('');

  // ── Zone sélectionnée ──
  const type=_openZone, zone=S.zones[type], Z=ZDEFS[type];
  const max=zone.count*Z.slots, ecoC=Z.eco>0?'var(--gn)':Z.eco<0?'var(--rd)':'var(--mu2)';
  const founderKey=ERA_FOUNDER[S.era]||'town_hall';
  const freeCount=max-zone.buildings.length;

  // Slots
  let slotsHtml='';
  for(let i=0;i<max;i++){
    const b=zone.buildings[i];
    if(b){
      const bld=BLDGS[b.key];
      const prod=bProdStr(bld);
      const isFounder=b.key===founderKey;
      slotsHtml+=`<div class="slot-card">
        <div class="slot-head">
          <div class="slot-num">${i+1}</div>
          <div class="slot-info">
            <div class="slot-name">${bld?.n||b.key}${b.lvl>1?' <span style="font-size:9px;color:var(--mu);font-weight:400">Niv.'+b.lvl+'</span>':''}</div>
            ${prod?`<div class="slot-prod">${prod}</div>`:''}
          </div>
          <div class="slot-actions">
            ${!isFounder?`<button class="btn-slot btn-slot-demo" onclick="window._demolish('${type}',${i})">🔨 Démanteler</button>`:''}
          </div>
        </div>
      </div>`;
    } else {
      slotsHtml+=`<div class="slot-card empty">
        <div class="slot-head">
          <div class="slot-num" style="color:var(--mu)">${i+1}</div>
          <div class="slot-info"><div class="slot-empty-txt">Emplacement libre</div></div>
        </div>
      </div>`;
    }
  }

  // Bâtiments construisables dans cette zone
  const zoneBldgs=Object.entries(BLDGS).filter(([,b])=>b.terrain&&b.terrain.includes(type)).map(([k,b])=>({k,...b}));
  let buildHtml='';
  if(zoneBldgs.length>0){
    buildHtml=`<div class="slbl">Construire ici (${freeCount} emplacement${freeCount!==1?'s':''} libre${freeCount!==1?'s':''})</div>`;
    const RDEF=currentRes(S.era);
    buildHtml+=zoneBldgs.map(bld=>{
      const lvl=S.built[bld.k]||0, inQ=S.bq.find(q=>q.key===bld.k);
      const isFounder=bld.k===founderKey;
      const popOk=S.pop>=bld.minPop;
      const cost=realCost(bld.k), buildT=realBuildTime(bld.k);
      const canDo=!inQ&&(S.hasTH||isFounder)&&popOk&&canAfford(cost)&&freeCount>0;
      const wf=workforce();
      let tags='';
      if(bld.prod) Object.entries(bld.prod).filter(([,v])=>v>0).forEach(([r,v])=>{
        const m=(S.tm[r]||1)*(S.tm.g||1)*wf, rr=RDEF[r];
        tags+=`<span class="tag tag-cy">+${Math.round(v*m)} ${rr?.ic||r}</span>`;
      });
      if(bld.pop)   tags+=`<span class="tag tag-pu">+${bld.pop} \u{1F465}</span>`;
      if(bld.eco>0) tags+=`<span class="tag tag-gn">Éco +${bld.eco}</span>`;
      if(bld.eco<0) tags+=`<span class="tag tag-rd">Éco ${bld.eco}</span>`;
      if(bld.minPop>0&&!popOk) tags+=`<span class="tag tag-pu">\u{1F465} min ${bld.minPop}</span>`;
      if(buildT>0) tags+=`<span class="tag tag-go">⏱ ${buildT}s</span>`;
      const costHtml=Object.entries(cost).map(([r,a])=>{const rr=RDEF[r]||{ic:r};return`<span class="cost ${(S.res[r]||0)<a?'miss':''}">${rr.ic} ${a}</span>`;}).join('');
      const pct=inQ?buildPct(inQ):0;
      let btnLbl='Construire';
      if(inQ) btnLbl='En cours\u2026';
      else if(isFounder&&lvl>0) btnLbl='Construit';
      else if(freeCount<=0) btnLbl='Zone pleine';
      return `<div class="brow ${!freeCount&&!inQ?'dim':''}">
        <div class="bb">
          <div class="blvl ${lvl>0?'has':''}">${lvl>0?lvl:'—'}</div>
          <div class="bi">
            <div class="bn">${bld.n}${isFounder&&!S.hasTH?' <span style="font-size:8px;background:rgba(34,211,238,.15);color:var(--cy);border:1px solid rgba(34,211,238,.35);border-radius:3px;padding:1px 5px;">PREMIER</span>':''}</div>
            <div class="bd2">${bld.desc||''}</div>
            <div class="bm">${tags}</div>
          </div>
          <div class="br">
            <div class="costs">${costHtml}</div>
            <button class="btn btn-cy" onclick="window._doBuild('${bld.k}')"
              ${canDo&&!(isFounder&&lvl>0)?'':'disabled'}>${btnLbl}</button>
          </div>
        </div>
        <div class="bp ${inQ?'on':''}" id="bp-${bld.k}">
          <div class="bph"><div class="bpl">⚒ Construction</div><div class="bpe" id="be-${bld.k}">${inQ?eta(inQ.fin):''}</div></div>
          <div class="bpt"><div class="bpf" id="bf-${bld.k}" style="width:${pct}%"></div></div>
        </div>
      </div>`;
    }).join('');
  }

  el.innerHTML=`
    <div id="zo-tabs">${tabsHtml}</div>
    <div id="zo-body">
      <div class="zo-zone-desc">
        <span>${Z.ic} <strong>${Z.n}</strong> — ${Z.res}</span>
        <span style="color:${ecoC}">Éco ${Z.eco>0?'+':''}${Z.eco}</span>
      </div>
      <div class="slbl">Emplacements (${zone.buildings.length}/${max})</div>
      <div class="slot-list">${slotsHtml}</div>
      ${buildHtml}
    </div>`;
}

window._zoTab=(type)=>{ _openZone=type; renderZones(); };
window._doBuild=k=>{ doBuild(k,()=>renderZones()); };

// ── Modale de confirmation générique ──
function showConfirm({icon='⚠️', title, msg, warn='', confirmLbl='Confirmer', confirmCls='btn-rd', onConfirm}) {
  const ov=document.getElementById('confirm-overlay');
  document.getElementById('confirm-icon').textContent=icon;
  document.getElementById('confirm-title').textContent=title;
  document.getElementById('confirm-msg').textContent=msg;
  const warnEl=document.getElementById('confirm-warn');
  warnEl.textContent=warn; warnEl.style.display=warn?'block':'none';
  const btns=document.getElementById('confirm-btns');
  btns.innerHTML=`
    <button class="btn btn-ghost" onclick="document.getElementById('confirm-overlay').classList.remove('on')">Annuler</button>
    <button class="btn ${confirmCls}" id="confirm-ok">${confirmLbl}</button>`;
  document.getElementById('confirm-ok').onclick=()=>{ ov.classList.remove('on'); onConfirm(); };
  ov.classList.add('on');
  ov.onclick=e=>{ if(e.target===ov) ov.classList.remove('on'); };
}

window._demolish=(zoneType,slotIdx)=>{
  const zone=S.zones[zoneType]; if(!zone) return;
  const b=zone.buildings[slotIdx]; if(!b) return;
  const BLDGS=currentBldgs(S.era), bld=BLDGS[b.key]; if(!bld) return;

  const cost=realCost(b.key);
  const refund=Object.entries(cost).map(([r,a])=>{
    const rr=ERAS[S.era].resources[r]||{ic:r};
    return `${Math.floor(a*0.5)} ${rr.ic}`;
  }).join(' · ');

  showConfirm({
    icon:'🔨',
    title:`Démanteler ${bld.n} ?`,
    msg:`50% du coût sera remboursé : ${refund}`,
    warn: b.key===(ERA_FOUNDER[S.era]||'town_hall') ? '⚠ Ceci est le bâtiment fondateur — toutes les autres constructions seront bloquées.' : '',
    confirmLbl:'Démanteler',
    confirmCls:'btn-rd',
    onConfirm:()=>{
      Object.entries(cost).forEach(([r,a])=>S.res[r]=(S.res[r]||0)+Math.floor(a*0.5));
      if(bld.eco) S.isp=Math.min(100,Math.max(0,S.isp-bld.eco));
      if(bld.pop) S.popMax=Math.max(S.pop,S.popMax-Math.round(bld.pop*(S.tm.pop||1)));
      zone.buildings.splice(slotIdx,1);
      const founderKey=ERA_FOUNDER[S.era]||'town_hall';
      if(b.key===founderKey) S.hasTH=false;
      if(S.built[b.key]>0) S.built[b.key]--;
      S.dirty=true;
      addLog(`${bld.n} démantelée — remboursement : ${refund}`,'w');
      renderZones(); updateTopbar();
    }
  });
};

// ── BUILD ─────────────────────────────────────────
export function renderBuild() {
  set('q-cnt',el=>el.textContent=S.bq.length);
  const BLDGS=currentBldgs(S.era), ERA=ERAS[S.era];
  const cats={};
  Object.entries(BLDGS).forEach(([k,b])=>{ if(!cats[b.cat])cats[b.cat]=[]; cats[b.cat].push({k,...b}); });

  const diff=S.day<=10?'Normal':S.day<=30?'Modéré':S.day<=60?'Difficile':S.day<=100?'Ardu':'Extrême';
  const diffC=S.day<=10?'var(--gn)':S.day<=30?'var(--go)':S.day<=60?'var(--rd)':'var(--pu)';

  let html=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding:7px 10px;background:var(--bg1);border:1px solid var(--bd);border-radius:6px;">
    <span style="font-size:10px;color:var(--mu2)">${ERA.icon} <strong style="color:var(--tx)">${ERA.name}</strong> — Jour ${S.day}</span>
    <span style="font-size:9px;padding:2px 8px;border-radius:10px;background:${diffC}18;color:${diffC};border:1px solid ${diffC}44">⚔ ${diff}</span>
  </div>`;

  const RDEF=currentRes(S.era);
  Object.entries(cats).forEach(([cat,list])=>{
    html+=`<div class="bcat"><div class="slbl">${cat}</div>`;
    list.forEach(bld=>{
      const lvl=S.built[bld.k]||0, inQ=S.bq.find(q=>q.key===bld.k);
      const prereqOk=checkPrereq(bld.k);
      const terrainOk=bld.terrain.some(t=>freeSlots(t)>0);
      const popOk=S.pop>=bld.minPop;
      const cost=realCost(bld.k), buildT=realBuildTime(bld.k);
      const founderKey=ERA_FOUNDER[S.era]||'town_hall';
      const isFounder=bld.k===founderKey;
      const canDo=!inQ&&prereqOk&&terrainOk&&popOk&&canAfford(cost)&&(S.hasTH||isFounder);
      const wf=workforce();

      let tags='';
      if(bld.prod) Object.entries(bld.prod).filter(([,v])=>v>0).forEach(([r,v])=>{
        const m=(S.tm[r]||1)*(S.tm.g||1)*wf;
        const rr=RDEF[r];
        tags+=`<span class="tag tag-cy">+${Math.round(v*m)} ${rr?.ic||r}</span>`;
      });
      if(bld.pop)   tags+=`<span class="tag tag-pu">+${bld.pop} 👥</span>`;
      if(bld.eco>0) tags+=`<span class="tag tag-gn">Éco +${bld.eco}</span>`;
      if(bld.eco<0) tags+=`<span class="tag tag-rd">Éco ${bld.eco}</span>`;
      if(bld.minPop>0) tags+=`<span class="tag ${popOk?'tag-mu':'tag-pu'}">👥 ${bld.minPop}+</span>`;
      bld.terrain.forEach(t=>{ const Z=currentZones(S.era)[t]; tags+=`<span class="tag tag-mu">${Z?.ic||t}</span>`; });
      if(buildT>0) tags+=`<span class="tag tag-go">⏱ ${buildT}s</span>`;

      const costHtml=Object.entries(cost).map(([r,a])=>{
        const rr=RDEF[r]||{ic:r};
        return `<span class="cost ${(S.res[r]||0)<a?'miss':''}">${rr.ic} ${a}</span>`;
      }).join('');
      const pct=inQ?buildPct(inQ):0;
      let btnClass='btn-cy', btnLbl='Construire';
      if(inQ){btnLbl='En cours…';btnClass='btn-go';}
      else if(isFounder&&lvl>0){btnLbl='Construit';}

      html+=`<div class="brow ${!prereqOk||(!popOk&&lvl===0)?'dim':''}">
        <div class="bb">
          <div class="blvl ${lvl>0?'has':''}">${lvl>0?lvl:'—'}</div>
          <div class="bi"><div class="bn">${bld.n}${isFounder&&!S.hasTH?' <span style="font-size:8px;background:rgba(34,211,238,.15);color:var(--cy);border:1px solid rgba(34,211,238,.35);border-radius:3px;padding:1px 5px;letter-spacing:.5px;">PREMIER</span>':''}</div><div class="bd2">${bld.desc||''}</div><div class="bm">${tags}</div></div>
          <div class="br">
            <div class="costs">${costHtml}</div>
            ${prereqOk?`<button class="btn ${btnClass}" onclick="window._doBuild('${bld.k}')" ${canDo&&!(isFounder&&lvl>0)?'':'disabled'}>${btnLbl}</button>`
                      :`<div style="font-size:9px;color:var(--mu)">Prérequis manquant</div>`}
          </div>
        </div>
        <div class="bp ${inQ?'on':''}" id="bp-${bld.k}">
          <div class="bph"><div class="bpl">⚒ Construction</div><div class="bpe" id="be-${bld.k}">${inQ?eta(inQ.fin):''}</div></div>
          <div class="bpt"><div class="bpf" id="bf-${bld.k}" style="width:${pct}%"></div></div>
        </div>
      </div>`;
    });
    html+='</div>';
  });
  set('bd-list',el=>el.innerHTML=html);
}
window._doBuild=k=>{ doBuild(k,()=>renderBuild()); };

// ── TECH ──────────────────────────────────────────
export function renderTech() {
  const ERA=ERAS[S.era], TECHS=currentTechs(S.era), RDEF=currentRes(S.era);
  const kt=currentKeyTech(S.era);
  const nextEra=ERAS[S.era+1];
  let html='';

  // Bouton avancement si tech clé débloquée
  if(kt?.done && nextEra) {
    html+=`<div style="background:linear-gradient(135deg,${ERA.palette.accent}18,${ERA.palette.bg2});border:2px solid ${ERA.palette.accent}55;border-radius:10px;padding:14px 16px;margin-bottom:16px;text-align:center;">
      <div style="font-family:var(--sans);font-size:16px;font-weight:800;color:${ERA.palette.accent};margin-bottom:6px;">🌟 Ère Maîtrisée !</div>
      <div style="font-size:11px;color:var(--mu2);margin-bottom:12px;">Vous êtes prêt à passer à <strong style="color:${nextEra.palette.accent}">${nextEra.icon} ${nextEra.name}</strong><br>
      Bonus : +${Math.floor(S.pop*0.3)+ERA.eraBonus.popBonus} pop · Prod ×${ERA.eraBonus.prodMult} · ${Math.round(ERA.eraBonus.resBonus*100)}% ressources conservées</div>
      <button class="btn btn-cy" onclick="window._advanceEra()" style="font-size:13px;padding:10px 28px;justify-content:center;width:100%;">
        🚀 Passer à l'${nextEra.name}
      </button>
    </div>`;
  }

  html+=`<div style="margin-bottom:16px"><div class="slbl">Recherches — ${ERA.name}</div>`;
  TECHS.forEach(t=>{
    const preOk=t.req.every(r=>TECHS.find(x=>x.id===r)?.done);
    const inQ=S.rq.find(q=>q.id===t.id);
    const cost=realTechCost(t);
    const canR=!t.done&&!inQ&&preOk&&canAfford(cost);
    const costHtml=Object.entries(cost).map(([r,a])=>{
      const rr=RDEF[r]||{ic:r};
      return `<span class="cost ${(S.res[r]||0)<a?'miss':''}">${rr.ic} ${a}</span>`;
    }).join('');
    const pct=inQ?buildPct(inQ):0;
    const isKey=t.isKeyTech;
    html+=`<div class="trow ${!preOk&&!t.done?'dim':''}" style="${isKey?`border-color:${ERA.palette.accent}44;`:''}">
      <div class="tb">
        <div class="tstripe" style="background:${t.col}${isKey?';width:4px':''}"></div>
        <div class="ti2">
          <div class="tn ${t.done?'done':''}" style="${isKey?'font-size:14px;':''}">
            ${isKey?'🔑 ':''}<strong>${t.n}</strong>
          </div>
          <div class="te2">${t.effect}</div>
          ${t.req.length?`<div class="treq">Prérequis : ${t.req.map(r=>TECHS.find(x=>x.id===r)?.n||r).join(', ')}</div>`:''}
        </div>
        <div class="sc ${t.done?'sc-done':!preOk?'sc-lk':'sc-av'}">${t.done?'✓':!preOk?'🔒':'Dispo'}</div>
        ${!t.done&&preOk?`<div class="tr2">
          <div class="costs">${costHtml}</div>
          <button class="btn ${isKey?'btn-cy':'btn-go'}" onclick="window._doResearch('${t.id}')" ${canR?'':'disabled'}>${inQ?'En cours…':'Rechercher'}</button>
        </div>`:''}
      </div>
      ${inQ?`<div class="bp on"><div class="bph"><div class="bpl">🔬 Recherche</div><div class="bpe" id="re-${t.id}">${eta(inQ.fin)}</div></div><div class="bpt"><div class="bpf" id="rf-${t.id}" style="width:${pct}%;background:var(--cy)"></div></div></div>`:''}
    </div>`;
  });
  html+='</div>';
  set('te-list',el=>el.innerHTML=html);
}
window._doResearch=id=>{ doResearch(id,()=>renderTech()); };
window._advanceEra=()=>{ advanceEra(()=>{ renderOverview(); renderBuild(); renderTech(); renderZones(); updateTopbar(); }); };

// ── ECONOMY ───────────────────────────────────────
export function renderEco() {
  const wf=workforce(), RDEF=currentRes(S.era);
  const prod={}, cons={};
  Object.keys(RDEF).forEach(k=>{prod[k]=0;cons[k]=0;});
  const BLDGS=currentBldgs(S.era);
  Object.values(S.zones).forEach(z=>z.buildings.forEach(b=>{
    const bld=BLDGS[b.key]; if(!bld?.prod) return;
    Object.entries(bld.prod).forEach(([r,v])=>{
      const m=(S.tm[r]||1)*(S.tm.g||1)*wf, av=Math.round(v*m);
      if(av>0) prod[r]=(prod[r]||0)+av; else cons[r]=(cons[r]||0)+Math.abs(av);
    });
  }));
  cons.food+=Math.ceil(S.pop/5); cons.water+=Math.ceil(S.pop/6);

  // Prestige info
  const totalMult = (S.tm.g||1).toFixed(2);
  let html=`<div style="background:var(--bg1);border:1px solid var(--bd);border-radius:6px;padding:8px 12px;margin-bottom:12px;font-size:10px;color:var(--mu2);">
    Main-d'œuvre : <span style="color:var(--pu);font-weight:600">${Math.round(wf*100)}%</span>
    &nbsp;·&nbsp; Multiplicateur prestige : <span style="color:var(--go);font-weight:600">×${totalMult}</span>
    &nbsp;·&nbsp; Ères maîtrisées : <span style="color:var(--cy)">${S.eraHistory.length}</span>
  </div>
  <div class="etable"><div class="eth"><div class="ehd">Ressource</div><div class="ehd">Stock</div><div class="ehd">+Prod</div><div class="ehd">−Cons</div><div class="ehd">Bilan/cy</div></div>`;

  Object.entries(RDEF).forEach(([k,rr])=>{
    const p=prod[k]||0,c=cons[k]||0,net=p-c;
    html+=`<div class="erow"><div class="ern">${rr.ic} ${rr.n}</div>
      <div class="erv">${fmt(S.res[k]||0)}</div>
      <div class="erv pos">${p>0?'+'+p:'—'}</div>
      <div class="erv neg">${c>0?'−'+c:'—'}</div>
      <div class="erv ${net>0?'pos':net<0?'neg':'zero'}">${net===0?'—':(net>0?'+':'')+net+'/cy'}</div>
    </div>`;
  });
  html+=`</div>`;

  // Historique des ères
  if(S.eraHistory.length) {
    html+=`<div class="slbl" style="margin-top:14px">Ères maîtrisées</div>`;
    S.eraHistory.forEach((h,i)=>{
      const e=ERAS[h.era];
      html+=`<div style="display:flex;align-items:center;gap:10px;padding:6px 10px;background:var(--bg1);border:1px solid var(--bd);border-radius:6px;margin-bottom:4px;font-size:11px;">
        <span style="font-size:16px">${e.icon}</span>
        <div style="flex:1;"><div style="color:var(--tx)">${e.name}</div><div style="color:var(--mu);font-size:9px;">Complétée Jour ${h.completedDay}</div></div>
        <div style="color:var(--go);font-size:10px;">×${e.eraBonus.prodMult} prod</div>
      </div>`;
    });
  }
  set('ec-list',el=>el.innerHTML=html);
}

// ── MARCHÉ ────────────────────────────────────────
let _marketOffers=[];
export function setMarketOffers(offers){ _marketOffers=offers; }

export function renderMarket() {
  const ERA=ERAS[S.era], RDEF=currentRes(S.era);
  const resKeys=Object.keys(RDEF);
  const myOffers=_marketOffers.filter(o=>o.uid===CTX.uid);
  const othersOffers=_marketOffers.filter(o=>o.uid!==CTX.uid);
  const wealthIc=RDEF.wealth?.ic||'💰';

  let html=`
  <div style="background:var(--bg1);border:1px solid var(--bd2);border-radius:6px;padding:10px 13px;margin-bottom:14px;">
    <div style="font-family:var(--sans);font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;">💱 Taux de change — ${ERA.name}</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;">
      ${resKeys.slice(0,4).map(from=>{
        const rate=getMarketRate(from,'wealth'); const rr=RDEF[from]||{ic:from};
        return `<div style="background:var(--bg2);border:1px solid var(--bd);border-radius:4px;padding:5px 7px;font-size:10px;">
          <div style="color:var(--mu);font-size:8px;text-transform:uppercase;margin-bottom:2px;">${rr.ic} → ${wealthIc}</div>
          <div style="color:var(--go);font-weight:600;">${rate.toFixed(1)}:1</div>
        </div>`;
      }).join('')}
    </div>
    <div style="font-size:9px;color:var(--mu);margin-top:6px;">Commission : ${MARKET_TAX_GOLD} ${wealthIc} · Taux empire avec le temps</div>
  </div>

  <div class="slbl">Poster une offre</div>
  <div style="background:var(--bg1);border:1px solid var(--bd2);border-radius:6px;padding:12px;margin-bottom:14px;">
    <div style="display:grid;grid-template-columns:1fr 70px 1fr auto;gap:8px;align-items:end;margin-bottom:10px;">
      <div>
        <div style="font-size:8px;color:var(--mu);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:4px;">Je donne</div>
        <select id="mkt-give-res" class="input" style="font-size:12px;padding:6px 8px;">
          ${resKeys.map(k=>`<option value="${k}">${RDEF[k]?.ic||k} ${RDEF[k]?.n||k} (${Math.floor(S.res[k]||0)})</option>`).join('')}
        </select>
      </div>
      <div>
        <div style="font-size:8px;color:var(--mu);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:4px;">Qté</div>
        <select id="mkt-give-qty" class="input" style="font-size:12px;padding:6px;width:70px;">
          ${MARKET_LOTS.map(q=>`<option value="${q}">${q}</option>`).join('')}
        </select>
      </div>
      <div>
        <div style="font-size:8px;color:var(--mu);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:4px;">Je veux</div>
        <select id="mkt-want-res" class="input" style="font-size:12px;padding:6px 8px;">
          ${resKeys.map((k,i)=>`<option value="${k}" ${i===4?'selected':''}>${RDEF[k]?.ic||k} ${RDEF[k]?.n||k}</option>`).join('')}
        </select>
      </div>
      <div>
        <div style="font-size:8px;color:var(--mu);text-transform:uppercase;margin-bottom:4px;">Reçoit</div>
        <div id="mkt-preview" style="font-size:15px;font-weight:600;color:var(--cy);padding:5px 0;">—</div>
      </div>
    </div>
    <button class="btn btn-cy" onclick="window._mktPost()" style="width:100%;justify-content:center;">📋 Poster l'offre</button>
  </div>

  ${myOffers.length?`<div class="slbl">Mes offres (${myOffers.length})</div>
  ${myOffers.map(o=>`<div style="background:var(--bg1);border:1px solid rgba(34,211,238,.2);border-radius:6px;padding:9px 12px;margin-bottom:5px;display:flex;align-items:center;gap:10px;">
    <div style="flex:1;font-size:11px;">
      <span style="color:var(--rd)">${o.give.qty} ${RDEF[o.give.res]?.ic||o.give.res}</span>
      <span style="color:var(--mu);margin:0 6px">→</span>
      <span style="color:var(--gn)">${o.want.qty} ${RDEF[o.want.res]?.ic||o.want.res}</span>
    </div>
    <button class="btn btn-ghost" style="font-size:10px;padding:3px 9px;" onclick="window._mktCancel('${o.id}')">✕</button>
  </div>`).join('')}`:''}

  <div class="slbl">Offres disponibles (${othersOffers.length})</div>
  ${!othersOffers.length?`<div style="color:var(--mu);padding:14px 0;text-align:center;font-size:11px">Aucune offre.</div>`:''}
  ${othersOffers.map(o=>`
  <div style="background:var(--bg1);border:1px solid var(--bd2);border-radius:6px;padding:10px 12px;margin-bottom:5px;display:flex;align-items:center;gap:10px;">
    <div style="flex:1;">
      <div style="font-size:9px;color:var(--mu);margin-bottom:3px;">${o.playerName}</div>
      <div style="font-size:13px;font-weight:600;">Donne ${o.give.qty} ${RDEF[o.give.res]?.ic||o.give.res} <span style="color:var(--mu)">→</span> Veut ${o.want.qty} ${RDEF[o.want.res]?.ic||o.want.res}</div>
    </div>
    <button class="btn btn-gn" style="font-size:11px;padding:5px 12px;"
      onclick="window._mktAccept(${JSON.stringify(o).replace(/"/g,'&quot;')})"
      ${(S.res[o.want.res]||0)>=o.want.qty&&(S.res.wealth||0)>=MARKET_TAX_GOLD?'':'disabled'}>Accepter</button>
  </div>`).join('')}`;

  set('mkt-list',el=>{ el.innerHTML=html;
    setTimeout(()=>{
      const up=()=>{
        const gR=document.getElementById('mkt-give-res')?.value;
        const gQ=parseInt(document.getElementById('mkt-give-qty')?.value||0);
        const wR=document.getElementById('mkt-want-res')?.value;
        const prev=document.getElementById('mkt-preview'); if(!prev) return;
        if(gR===wR){prev.textContent='—';return;}
        const rate=getMarketRate(gR,wR), qty=Math.floor(gQ/rate), rr=RDEF[wR];
        prev.textContent=qty>0?`~${qty} ${rr?.ic||''}`:'-';
        prev.style.color=qty>0?'var(--cy)':'var(--rd)';
      };
      ['mkt-give-res','mkt-give-qty','mkt-want-res'].forEach(id=>document.getElementById(id)?.addEventListener('change',up));
      up();
    },50);
  });
}
window._mktPost=async()=>{ const gR=document.getElementById('mkt-give-res')?.value, gQ=parseInt(document.getElementById('mkt-give-qty')?.value||0), wR=document.getElementById('mkt-want-res')?.value; if(gR===wR){toast('Choisissez deux ressources différentes','e');return;} await doPostOffer(gR,gQ,wR,()=>renderMarket()); };
window._mktAccept=async offer=>{ await doAcceptOffer(offer,()=>renderMarket()); };
window._mktCancel=async id=>{ await doCancelOffer(id,()=>renderMarket()); };

// ── DIPLO ─────────────────────────────────────────
export function renderDiplo(worldData,cities) {
  if(!worldData) return;
  const players=worldData.players||{};
  let html=`<div class="slbl">Joueurs (${Object.keys(players).length}/${worldData.maxPlayers})</div>`;
  Object.entries(players).forEach(([uid,p])=>{
    const city=cities?.[uid], isSelf=uid===CTX.uid;
    const [c1,c2]=avatarColor(uid), era=ERAS[city?.era||0];
    html+=`<div class="player-card">
      <div class="online-dot ${p.online?'':'off'}"></div>
      <div class="pc-avatar" style="background:linear-gradient(135deg,${c1},${c2})">${getInitials(p.name)}</div>
      <div><div class="pc-name">${p.name}</div>
        <div class="pc-meta">${city?`${era?.icon||''} ${era?.name||'Ère ?'} · Pop. ${city.pop||0}/${city.popMax||0} · Jour ${city.day||1}`:'Pas encore connecté'}</div>
      </div>
      ${isSelf?'<div class="pc-self">Vous</div>':''}
    </div>`;
  });
  set('di-list',el=>el.innerHTML=html);
}

// ── PROGRESS BARS ─────────────────────────────────
export function tickProgress() {
  const BLDGS=currentBldgs(S.era);
  S.bq.forEach(q=>{ const f=document.getElementById('bf-'+q.key), e=document.getElementById('be-'+q.key); if(f)f.style.width=buildPct(q)+'%'; if(e)e.textContent=eta(q.fin); });
  S.rq.forEach(q=>{ const f=document.getElementById('rf-'+q.id), e=document.getElementById('re-'+q.id); if(f)f.style.width=buildPct(q)+'%'; if(e)e.textContent=eta(q.fin); });
}

// ── UTILS ─────────────────────────────────────────
function set(id,fn){ const el=document.getElementById(id); if(el) fn(el); }
function bProdStr(bld) {
  if(!bld?.prod) return '';
  const RDEF=currentRes(S.era); const wf=workforce();
  return Object.entries(bld.prod).filter(([,v])=>v>0).map(([r,v])=>{
    const rr=RDEF[r]||{ic:r}; const m=(S.tm[r]||1)*(S.tm.g||1)*wf;
    return `+${Math.round(v*m)} ${rr.ic}`;
  }).join(' · ');
}

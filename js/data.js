// ══════════════════════════════════════════════════
//  TERRA — js/data.js  v0.4.0
//  Système des 10 Ères
// ══════════════════════════════════════════════════

export const VERSION = '0.4.0';

// ─── Ressources (clés fixes, noms/icônes changent selon l'ère) ───
export const RES_KEYS = ['mat1','mat2','food','water','wealth','knowledge','energy','special'];

// ─── Définition des 10 ÈRES ──────────────────────
export const ERAS = [
  // ══════════════════════════════════════
  //  0 — ÂGE DE PIERRE
  // ══════════════════════════════════════
  {
    id:0, name:"Âge de Pierre", icon:"🪨", short:"Pierre",
    palette: { bg:'#0a0e0d', bg1:'#0e1410', bg2:'#12190f', accent:'#86efac', accent2:'#4ade80', gold:'#d97706', muted:'#374830' },
    desc:"L'aube de l'humanité. Survivez avec silex et feu.",
    resources: {
      mat1:  { n:'Silex',    ic:'🪨' },
      mat2:  { n:'Bois',     ic:'🌿' },
      food:  { n:'Gibier',   ic:'🦌' },
      water: { n:'Source',   ic:'💧' },
      wealth:{ n:'Ambre',    ic:'🟡' },
      knowledge:{ n:'Savoir',ic:'🔥' },
      energy:{ n:'Feu',      ic:'🔥' },
      special:{ n:'Argile',  ic:'🟤' },
    },
    startRes: { mat1:50, mat2:40, food:30, water:25, wealth:5, knowledge:0, energy:10, special:20 },
    zones: {
      plains:  { n:'Savane',  ic:'🌿', col:'#86efac', res:'Gibier · Plantes',  eco:+2, slots:5 },
      forest:  { n:'Forêt',   ic:'🌲', col:'#22c55e', res:'Bois · Baies',      eco:+3, slots:4 },
      mountain:{ n:'Falaise', ic:'🪨', col:'#78716c', res:'Silex · Argile',    eco: 0, slots:3 },
      coast:   { n:'Rivière', ic:'🌊', col:'#0ea5e9', res:'Poisson · Eau',     eco:+2, slots:3 },
      desert:  { n:'Steppe',  ic:'🏜️', col:'#d97706', res:'Argile · Minéraux', eco:-1, slots:2 },
    },
    buildings: {
      // ── SAVANE — habitat, chasse, feu ──
      foyer:    { n:'Foyer',           cat:'Savane',    terrain:['plains'],           cost:{mat2:5},                      prod:{energy:3,food:1},          eco:+1, pop:0,  minPop:0,  t:5,  desc:'Feu permanent. Base de toute vie en tribu.' },
      hutte:    { n:'Hutte de Savane', cat:'Savane',    terrain:['plains'],           cost:{mat2:8,special:4},            prod:{},                         eco: 0, pop:4,  minPop:0,  t:8,  desc:'+4 pop max. Abri de branches et d\'argile.' },
      piege:    { n:'Pièges à Gibier', cat:'Savane',    terrain:['plains'],           cost:{mat2:6,mat1:3},               prod:{food:4,mat2:1},             eco:-1, pop:0,  minPop:0,  t:10, desc:'Gibier quotidien. Construit en Savane.' },
      camp:     { n:'Camp Élargi',     cat:'Savane',    terrain:['plains'],           cost:{mat2:15,special:8},           prod:{},                         eco: 0, pop:8,  minPop:5,  t:18, desc:'+8 pop max. Organisation de la tribu.' },
      // ── FORÊT — bois, cueillette ──
      abattage: { n:'Zone d\'Abattage',cat:'Forêt',     terrain:['forest'],           cost:{mat1:5},                      prod:{mat2:5,food:1},             eco:-2, pop:0,  minPop:0,  t:8,  desc:'Produit du Bois. Seul moyen d\'en récolter.' },
      cueillette:{ n:'Camp de Cueillette',cat:'Forêt',  terrain:['forest'],           cost:{mat2:8},                      prod:{food:3,special:1},          eco:+2, pop:0,  minPop:0,  t:10, desc:'Baies et plantes. Nourriture et argile brute.' },
      abri_bois:{ n:'Abri sous Arbre', cat:'Forêt',     terrain:['forest'],           cost:{mat2:12,food:5},              prod:{},                          eco:+1, pop:6,  minPop:8,  t:14, desc:'+6 pop max. Refuge naturel dans les sous-bois.' },
      // ── FALAISE — silex, gravure, savoir ──
      taille:   { n:'Atelier de Taille',cat:'Falaise',  terrain:['mountain'],         cost:{mat2:4},                      prod:{mat1:5,energy:1},           eco: 0, pop:0,  minPop:0,  t:8,  desc:'Taille le silex. Seule source de Silex brut.' },
      abri_roc: { n:'Grotte Aménagée', cat:'Falaise',   terrain:['mountain'],         cost:{mat1:10,mat2:5},              prod:{},                          eco:+1, pop:6,  minPop:5,  t:14, desc:'+6 pop max. Protection naturelle par la roche.' },
      gravure:  { n:'Gravures Rupestres',cat:'Falaise',  terrain:['mountain'],         cost:{mat1:12,energy:5},            prod:{knowledge:2},               eco:+3, pop:0,  minPop:8,  t:20, desc:'Transmet le savoir par les images. Génère du Savoir.' },
      // ── RIVIÈRE — eau, pêche ──
      source:   { n:'Source Aménagée', cat:'Rivière',   terrain:['coast'],            cost:{mat1:6,special:4},            prod:{water:6},                   eco:+2, pop:0,  minPop:0,  t:8,  desc:'Eau potable permanente. Indispensable.' },
      peche:    { n:'Pêcherie Primitive',cat:'Rivière',  terrain:['coast'],            cost:{mat2:8,mat1:4},               prod:{food:6,water:1},             eco:+1, pop:0,  minPop:0,  t:10, desc:'Poissons et eau. Meilleure source de nourriture.' },
      // ── STEPPE — argile, poterie, rituels ──
      argile:   { n:'Fosse à Argile',  cat:'Steppe',    terrain:['desert'],           cost:{mat2:5},                      prod:{special:4},                 eco: 0, pop:0,  minPop:0,  t:8,  desc:'Extrait l\'argile. Seule source d\'Argile brute.' },
      poterie:  { n:'Atelier Poterie', cat:'Steppe',    terrain:['desert'],           cost:{special:15,mat2:6},           prod:{special:3,wealth:2},         eco: 0, pop:0,  minPop:5,  t:18, desc:'Transforme argile → récipients. Premier commerce.' },
      dolmen:   { n:'Dolmen Sacré',    cat:'Steppe',    terrain:['desert','mountain'],cost:{mat1:25,special:15,wealth:5},  prod:{knowledge:3,wealth:1},       eco:+4, pop:0,  minPop:12, t:30, desc:'Centre rituel. Génère Savoir et Ambre. Lieu de pouvoir.' },
    },
    techs: [
      { id:'p_feu',  n:'Maîtrise du Feu',        cost:{energy:8},               t:20, effect:'+50% nourriture en Savane', req:[],                   done:false, col:'#f97316' },
      { id:'p_out',  n:'Outils en Silex',         cost:{mat1:15,energy:5},       t:30, effect:'+40% Bois en Forêt',        req:['p_feu'],             done:false, col:'#78716c' },
      { id:'p_pot',  n:'Poterie Avancée',         cost:{special:20,mat1:8},      t:35, effect:'+60% Argile, débloque échanges', req:['p_out'],        done:false, col:'#d97706' },
      { id:'p_agr',  n:'🔑 Agriculture Primitive',cost:{knowledge:15,food:25,special:10}, t:60,
        effect:'Maîtrise de l\'agriculture — Passe à l\'Âge de Bronze',
        req:['p_feu','p_out','p_pot'], done:false, col:'#86efac', isKeyTech:true },
    ],
    keyTechId: 'p_agr',
    eraBonus: { prodMult:1.0, popBonus:0, resBonus:0.0 }, // premier âge, pas de bonus
  },

  // ══════════════════════════════════════
  //  1 — ÂGE DE BRONZE
  // ══════════════════════════════════════
  {
    id:1, name:"Âge de Bronze", icon:"🥉", short:"Bronze",
    palette: { bg:'#0e0b08', bg1:'#161008', bg2:'#1e1510', accent:'#fb923c', accent2:'#f97316', gold:'#eab308', muted:'#78450a' },
    desc:"Les premiers villages. Maîtrisez le métal.",
    resources: {
      mat1:  { n:'Cuivre',    ic:'🟠' },
      mat2:  { n:'Étain',     ic:'⬜' },
      food:  { n:'Grain',     ic:'🌾' },
      water: { n:'Eau',       ic:'💧' },
      wealth:{ n:'Or Natif',  ic:'🟡' },
      knowledge:{ n:'Écriture',ic:'📜' },
      energy:{ n:'Bronze',    ic:'🥉' },
      special:{ n:'Argile Cuite',ic:'🏺' },
    },
    startRes: { mat1:60, mat2:40, food:50, water:40, wealth:15, knowledge:5, energy:20, special:30 },
    zones: {
      plains:  { n:'Plaine',   ic:'🌾', col:'#fb923c', res:'Grain · Eau',    eco:+1, slots:6 },
      forest:  { n:'Forêt',    ic:'🌲', col:'#22c55e', res:'Bois · Gibier',  eco:+2, slots:4 },
      mountain:{ n:'Colline',  ic:'⛰️', col:'#a8a29e', res:'Cuivre · Étain', eco: 0, slots:4 },
      coast:   { n:'Delta',    ic:'🌊', col:'#0ea5e9', res:'Commerce · Sel', eco:+2, slots:3 },
      desert:  { n:'Désert',   ic:'🏜️', col:'#d97706', res:'Or · Minéraux',  eco:-1, slots:2 },
    },
    buildings: {
      village:  { n:'Village',        cat:'Habitat',    terrain:['plains','coast'],         cost:{mat2:12,food:8},            prod:{gold:1},                 eco:0,  pop:6,  minPop:0,  t:12,  desc:'Premier peuplement organisé.' },
      fonderie: { n:'Fonderie',       cat:'Production', terrain:['mountain','plains'],      cost:{mat1:20,energy:10},         prod:{energy:4},               eco:-2, pop:0,  minPop:0,  t:15,  desc:'Fond cuivre+étain → Bronze.' },
      champ:    { n:'Champ de Grain', cat:'Agriculture',terrain:['plains'],                 cost:{food:10,mat2:8},            prod:{food:6,water:2},          eco:+2, pop:0,  minPop:0,  t:10,  desc:'Agriculture organisée.' },
      potier:   { n:'Potier',         cat:'Artisanat',  terrain:['coast','plains'],         cost:{special:15,mat1:8},         prod:{special:3,wealth:1},      eco:0,  pop:0,  minPop:5,  t:14,  desc:'Céramique de qualité.' },
      grenier:  { n:'Grenier',        cat:'Agriculture',terrain:['plains'],                 cost:{mat2:20,special:10},        prod:{food:3},                  eco:0,  pop:0,  minPop:8,  t:18,  desc:'Stockage alimentaire.' },
      bateau:   { n:'Bateau Marchand',cat:'Commerce',   terrain:['coast'],                  cost:{mat2:25,energy:15},         prod:{wealth:4},                eco:+1, pop:0,  minPop:10, t:25,  desc:'Commerce maritime. Richesse.' },
      palais:   { n:'Palais Seigneur',cat:'Habitat',    terrain:['plains','coast'],         cost:{energy:30,wealth:20,special:25},prod:{knowledge:3,wealth:2},eco:-1, pop:15, minPop:15, t:40,  desc:'+15 pop. Centre du pouvoir.' },
    },
    techs: [
      { id:'b_metal',n:'Alliage Bronze',    cost:{knowledge:8,mat1:25,mat2:25},t:25,effect:'+60% production Bronze', req:[],done:false,col:'#fb923c' },
      { id:'b_irri', n:'Irrigation',        cost:{knowledge:12,food:30},       t:35,effect:'+50% Grain',             req:['b_metal'],done:false,col:'#22c55e' },
      { id:'b_com',  n:'Routes Commerciales',cost:{knowledge:18,wealth:20},    t:45,effect:'+80% richesse',          req:['b_irri'],done:false,col:'#eab308' },
      { id:'b_ecr',  n:'🔑 Écriture Cunéiforme',cost:{knowledge:30,wealth:30,special:40},t:70,
        effect:'L\'écriture change tout — Passe à l\'Âge de Fer',
        req:['b_metal','b_irri','b_com'],done:false,col:'#fb923c',isKeyTech:true },
    ],
    keyTechId: 'b_ecr',
    eraBonus: { prodMult:1.15, popBonus:5, resBonus:0.2 },
  },

  // ══════════════════════════════════════
  //  2 — ÂGE DE FER
  // ══════════════════════════════════════
  {
    id:2, name:"Âge de Fer", icon:"⚔️", short:"Fer",
    palette: { bg:'#0c0c10', bg1:'#111118', bg2:'#181820', accent:'#94a3b8', accent2:'#cbd5e1', gold:'#eab308', muted:'#3d3d50' },
    desc:"Forges et armées. La civilisation s'organise.",
    resources: {
      mat1:  { n:'Fer',      ic:'⚙️' },
      mat2:  { n:'Charbon',  ic:'🪵' },
      food:  { n:'Blé',      ic:'🌾' },
      water: { n:'Eau',      ic:'💧' },
      wealth:{ n:'Monnaie',  ic:'💰' },
      knowledge:{ n:'Lois',  ic:'📜' },
      energy:{ n:'Acier',    ic:'⚔️' },
      special:{ n:'Pierre taillée',ic:'🏗️' },
    },
    startRes: { mat1:70, mat2:50, food:60, water:45, wealth:20, knowledge:8, energy:15, special:40 },
    zones: {
      plains:  { n:'Campagne', ic:'🌾', col:'#94a3b8', res:'Blé · Agriculture', eco:+1, slots:6 },
      forest:  { n:'Bois',     ic:'🌲', col:'#4ade80',  res:'Charbon · Bois',    eco:+2, slots:4 },
      mountain:{ n:'Montagne', ic:'⛰️', col:'#71717a',  res:'Fer · Pierre',      eco: 0, slots:4 },
      coast:   { n:'Port',     ic:'🌊', col:'#0ea5e9',  res:'Commerce · Sel',    eco:+2, slots:3 },
      desert:  { n:'Steppe',   ic:'🏜️', col:'#d97706',  res:'Minerai rare',      eco:-1, slots:2 },
    },
    buildings: {
      maison:  { n:'Maison',         cat:'Habitat',    terrain:['plains','coast'],        cost:{mat2:15,special:10},        prod:{},                       eco:-1, pop:7,  minPop:0,  t:12,  desc:'+7 pop max.' },
      forge:   { n:'Forge',          cat:'Production', terrain:['mountain','plains'],     cost:{mat1:20,mat2:15},           prod:{energy:5,mat1:2},         eco:-4, pop:0,  minPop:0,  t:18,  desc:'Produit de l\'Acier.' },
      ferme:   { n:'Ferme',          cat:'Agriculture',terrain:['plains'],                cost:{mat2:12,special:8},         prod:{food:6,water:1},          eco:+2, pop:0,  minPop:0,  t:10,  desc:'Agriculture efficace.' },
      route:   { n:'Route Pavée',    cat:'Commerce',   terrain:['plains','coast','mountain'],cost:{special:25,mat1:10},     prod:{wealth:3},                eco: 0, pop:0,  minPop:8,  t:20,  desc:'Commerce facilité +3 monnaie.' },
      marche:  { n:'Forum',          cat:'Commerce',   terrain:['plains','coast'],        cost:{special:20,wealth:15},      prod:{wealth:6,knowledge:1},     eco: 0, pop:0,  minPop:10, t:22,  desc:'Échanges et lois.' },
      caserne: { n:'Caserne',        cat:'Militaire',  terrain:['plains','mountain'],     cost:{energy:20,special:15},      prod:{},                       eco:-2, pop:10, minPop:15, t:28,  desc:'+10 pop. Protection de la cité.' },
      aqueduc: { n:'Aqueduc',        cat:'Infrastructure',terrain:['plains','coast'],     cost:{special:40,mat1:20},        prod:{water:10,food:2},         eco:+3, pop:0,  minPop:20, t:40,  desc:'Eau abondante.' },
    },
    techs: [
      { id:'f_forge',n:'Forge Avancée',    cost:{knowledge:10,mat1:30},         t:30,effect:'+70% acier',     req:[],done:false,col:'#94a3b8' },
      { id:'f_route',n:'Réseau Routier',   cost:{knowledge:15,wealth:25},       t:40,effect:'+60% commerce',  req:['f_forge'],done:false,col:'#eab308' },
      { id:'f_loi',  n:'Code de Lois',     cost:{knowledge:25,wealth:30},       t:50,effect:'+pop max +50%',  req:['f_route'],done:false,col:'#a78bfa' },
      { id:'f_mon',  n:'🔑 Monnaie Frappée',cost:{knowledge:40,wealth:50,energy:40},t:80,
        effect:'La monnaie unifiée — Passe à l\'Antiquité',
        req:['f_forge','f_route','f_loi'],done:false,col:'#eab308',isKeyTech:true },
    ],
    keyTechId: 'f_mon',
    eraBonus: { prodMult:1.15, popBonus:8, resBonus:0.2 },
  },

  // ══════════════════════════════════════
  //  3 — ANTIQUITÉ
  // ══════════════════════════════════════
  {
    id:3, name:"Antiquité", icon:"🏛️", short:"Antiquité",
    palette: { bg:'#0d0a05', bg1:'#171208', bg2:'#1e170c', accent:'#fbbf24', accent2:'#f59e0b', gold:'#eab308', muted:'#6b4f10' },
    desc:"Philosophes, temples et empires. L'apogée du monde antique.",
    resources: {
      mat1:  { n:'Marbre',     ic:'🏛️' },
      mat2:  { n:'Bois rare',  ic:'🌴' },
      food:  { n:'Froment',    ic:'🌾' },
      water: { n:'Eau',        ic:'💧' },
      wealth:{ n:'Or',         ic:'💰' },
      knowledge:{ n:'Philosophie',ic:'📚' },
      energy:{ n:'Fer forgé',  ic:'⚙️' },
      special:{ n:'Commerce',  ic:'🚢' },
    },
    startRes: { mat1:80, mat2:60, food:70, water:55, wealth:30, knowledge:15, energy:25, special:20 },
    zones: {
      plains:  { n:'Terres',    ic:'🌾', col:'#fbbf24', res:'Froment · Agriculture', eco:+1, slots:6 },
      forest:  { n:'Forêt',     ic:'🌲', col:'#22c55e', res:'Bois rare · Gibier',    eco:+2, slots:3 },
      mountain:{ n:'Carrière',  ic:'⛰️', col:'#a8a29e', res:'Marbre · Pierre',       eco: 0, slots:4 },
      coast:   { n:'Méditerranée',ic:'🌊',col:'#0ea5e9', res:'Commerce · Sel · Poisson',eco:+3, slots:4 },
      desert:  { n:'Désert',    ic:'🏜️', col:'#d97706', res:'Or · Épices',           eco:-1, slots:2 },
    },
    buildings: {
      domus:    { n:'Domus',          cat:'Habitat',    terrain:['plains','coast'],        cost:{mat2:18,mat1:12},           prod:{},                       eco:-1, pop:10, minPop:0,  t:15,  desc:'+10 pop. Maison patricienne.' },
      temple:   { n:'Temple',         cat:'Culture',    terrain:['plains','mountain'],     cost:{mat1:30,wealth:20},         prod:{knowledge:4,special:2},   eco:+3, pop:0,  minPop:5,  t:25,  desc:'Philosophie et commerce.' },
      aqueduc2: { n:'Grand Aqueduc',  cat:'Infrastructure',terrain:['plains','coast'],    cost:{mat1:40,energy:15},         prod:{water:12,food:3},         eco:+4, pop:0,  minPop:8,  t:30,  desc:'Eau pour toute la cité.' },
      port:     { n:'Port Commercial',cat:'Commerce',   terrain:['coast'],                 cost:{mat2:30,energy:20},         prod:{wealth:8,special:4},      eco:+2, pop:0,  minPop:10, t:28,  desc:'Commerce méditerranéen.' },
      bibliotheque:{ n:'Bibliothèque',cat:'Culture',    terrain:['plains','coast'],        cost:{mat1:25,wealth:25},         prod:{knowledge:6},             eco:+2, pop:0,  minPop:12, t:32,  desc:'Savoir accumulé.' },
      thermes:  { n:'Thermes',        cat:'Infrastructure',terrain:['plains','coast'],     cost:{mat1:35,special:15},        prod:{water:4},                eco:+2, pop:15, minPop:18, t:35,  desc:'+15 pop. Bien-être romain.' },
      senat:    { n:'Sénat / Agora',  cat:'Gouvernance',terrain:['plains','coast'],        cost:{mat1:50,wealth:40,knowledge:25},prod:{knowledge:8,wealth:4}, eco:+3, pop:0,  minPop:25, t:50,  desc:'Gouvernance. Bonus global.' },
    },
    techs: [
      { id:'a_phi', n:'Philosophie',     cost:{knowledge:15,wealth:30},        t:35,effect:'+80% philosophie',    req:[],done:false,col:'#fbbf24' },
      { id:'a_com', n:'Routes de Soie',  cost:{knowledge:20,special:30},       t:45,effect:'+100% commerce',     req:['a_phi'],done:false,col:'#f59e0b' },
      { id:'a_arc', n:'Architecture',    cost:{knowledge:25,mat1:40},          t:55,effect:'+60% marbre',        req:['a_phi'],done:false,col:'#a8a29e' },
      { id:'a_sci', n:'🔑 Sciences Naturelles',cost:{knowledge:50,wealth:60,mat1:50},t:90,
        effect:'La raison triomphe — Passe au Moyen-Âge',
        req:['a_phi','a_com','a_arc'],done:false,col:'#fbbf24',isKeyTech:true },
    ],
    keyTechId: 'a_sci',
    eraBonus: { prodMult:1.15, popBonus:10, resBonus:0.2 },
  },

  // ══════════════════════════════════════
  //  4 — MOYEN-ÂGE
  // ══════════════════════════════════════
  {
    id:4, name:"Moyen-Âge", icon:"⚜️", short:"Médiéval",
    palette: { bg:'#0a080e', bg1:'#110e18', bg2:'#17132a', accent:'#a78bfa', accent2:'#8b5cf6', gold:'#d97706', muted:'#3d2d6b' },
    desc:"Châteaux, foi et chevalerie. La chrétienté règne.",
    resources: {
      mat1:  { n:'Pierre de taille',ic:'🏰' },
      mat2:  { n:'Bois de charpente',ic:'🌲' },
      food:  { n:'Blé',            ic:'🌾' },
      water: { n:'Eau',            ic:'💧' },
      wealth:{ n:'Florins',        ic:'💰' },
      knowledge:{ n:'Foi',         ic:'✝️' },
      energy:{ n:'Fer forgé',      ic:'⚔️' },
      special:{ n:'Pierre noire',  ic:'⬛' },
    },
    startRes: { mat1:90, mat2:70, food:80, water:60, wealth:35, knowledge:20, energy:30, special:25 },
    zones: {
      plains:  { n:'Domaine',   ic:'🌾', col:'#a78bfa', res:'Blé · Agriculture',  eco:+1, slots:6 },
      forest:  { n:'Forêt',     ic:'🌲', col:'#22c55e', res:'Bois · Gibier',      eco:+2, slots:4 },
      mountain:{ n:'Roc',       ic:'⛰️', col:'#78716c', res:'Pierre · Fer',       eco: 0, slots:3 },
      coast:   { n:'Havre',     ic:'🌊', col:'#0ea5e9', res:'Commerce · Sel',     eco:+2, slots:3 },
      desert:  { n:'Lande',     ic:'🏜️', col:'#d97706', res:'Pierre noire · Or', eco:-1, slots:2 },
    },
    buildings: {
      chaumiere:{ n:'Chaumière',      cat:'Habitat',    terrain:['plains','forest'],       cost:{mat2:15,food:10},           prod:{},                       eco:-1, pop:6,  minPop:0,  t:10,  desc:'+6 pop max. Habitat paysan.' },
      chateau:  { n:'Château Fort',   cat:'Défense',    terrain:['mountain','plains'],     cost:{mat1:50,energy:25},         prod:{},                       eco:-2, pop:20, minPop:5,  t:40,  desc:'+20 pop. Protection totale.' },
      cathedrale:{ n:'Cathédrale',    cat:'Culture',    terrain:['plains','coast'],        cost:{mat1:60,knowledge:30,wealth:30},prod:{knowledge:8},         eco:+5, pop:0,  minPop:10, t:55,  desc:'Centre spirituel. +Foi.' },
      moulin:   { n:'Moulin',         cat:'Agriculture',terrain:['plains','coast'],        cost:{mat2:20,energy:10},         prod:{food:7,water:2},          eco:+2, pop:0,  minPop:0,  t:12,  desc:'Moulin à eau/vent. +Blé.' },
      guilde:   { n:'Guilde des Marchands',cat:'Commerce',terrain:['plains','coast'],     cost:{wealth:30,mat2:20},         prod:{wealth:7,special:2},      eco: 0, pop:0,  minPop:12, t:28,  desc:'Commerce médiéval organisé.' },
      hospice:  { n:'Hospice',        cat:'Infrastructure',terrain:['plains'],             cost:{knowledge:20,mat1:20},      prod:{food:2},                 eco:+3, pop:12, minPop:18, t:30,  desc:'+12 pop. Soin des habitants.' },
      universite:{ n:'Université',    cat:'Culture',    terrain:['plains','coast'],        cost:{mat1:40,wealth:40,knowledge:30},prod:{knowledge:10,wealth:2},eco:+4, pop:0,  minPop:25, t:50,  desc:'Savoir médiéval avancé.' },
    },
    techs: [
      { id:'m_for', n:'Forge Médiévale', cost:{knowledge:20,energy:40},       t:40,effect:'+70% fer forgé',   req:[],done:false,col:'#a78bfa' },
      { id:'m_com', n:'Foires & Marchés',cost:{knowledge:25,wealth:40},       t:50,effect:'+90% florins',     req:['m_for'],done:false,col:'#d97706' },
      { id:'m_arc', n:'Architecture Gothique',cost:{knowledge:30,mat1:50},    t:60,effect:'+60% pierre',      req:['m_com'],done:false,col:'#78716c' },
      { id:'m_imp', n:'🔑 Imprimerie',   cost:{knowledge:60,wealth:70,special:40},t:100,
        effect:'Gutenberg révolutionne tout — Passe à la Renaissance',
        req:['m_for','m_com','m_arc'],done:false,col:'#a78bfa',isKeyTech:true },
    ],
    keyTechId: 'm_imp',
    eraBonus: { prodMult:1.15, popBonus:12, resBonus:0.2 },
  },

  // ══════════════════════════════════════
  //  5 — RENAISSANCE
  // ══════════════════════════════════════
  {
    id:5, name:"Renaissance", icon:"🎨", short:"Renaissance",
    palette: { bg:'#080c10', bg1:'#0c1218', bg2:'#101820', accent:'#38bdf8', accent2:'#7dd3fc', gold:'#f59e0b', muted:'#1d3d5a' },
    desc:"Arts, sciences et exploration. L'humanisme triomphe.",
    resources: {
      mat1:  { n:'Verre soufflé', ic:'🔭' },
      mat2:  { n:'Bois exotique', ic:'🌴' },
      food:  { n:'Épices',        ic:'🌶️' },
      water: { n:'Eau',           ic:'💧' },
      wealth:{ n:'Ducats',        ic:'💰' },
      knowledge:{ n:'Sciences',   ic:'🔬' },
      energy:{ n:'Acier fin',     ic:'⚙️' },
      special:{ n:'Art',          ic:'🎨' },
    },
    startRes: { mat1:80, mat2:70, food:80, water:60, wealth:40, knowledge:25, energy:35, special:15 },
    zones: {
      plains:  { n:'Cité-État',  ic:'🏙️', col:'#38bdf8', res:'Commerce · Artisanat', eco:+1, slots:6 },
      forest:  { n:'Forêt',      ic:'🌲', col:'#22c55e', res:'Bois exotique',         eco:+2, slots:4 },
      mountain:{ n:'Carrière',   ic:'⛰️', col:'#a8a29e', res:'Verre · Pierre',        eco: 0, slots:3 },
      coast:   { n:'Port',       ic:'🌊', col:'#0ea5e9', res:'Commerce · Épices',     eco:+3, slots:4 },
      desert:  { n:'Terres inconnues',ic:'🏜️',col:'#d97706',res:'Or · Ressources rares',eco:-1, slots:2 },
    },
    buildings: {
      palazzo:  { n:'Palazzo',        cat:'Habitat',    terrain:['plains','coast'],        cost:{mat2:20,special:10},        prod:{},                       eco:0,  pop:10, minPop:0,  t:14,  desc:'+10 pop. Architecture raffinée.' },
      atelier:  { n:'Atelier d\'Art', cat:'Culture',    terrain:['plains'],                cost:{special:20,wealth:20},      prod:{special:5,knowledge:2},   eco:+3, pop:0,  minPop:5,  t:20,  desc:'Chefs-d\'œuvre et brevets.' },
      observatoire:{ n:'Observatoire',cat:'Science',    terrain:['mountain','plains'],     cost:{mat1:30,knowledge:20},      prod:{knowledge:8},             eco:+2, pop:0,  minPop:8,  t:28,  desc:'Astronomie et cartographie.' },
      imprimerie:{ n:'Imprimerie',    cat:'Science',    terrain:['plains','coast'],        cost:{energy:20,wealth:25},       prod:{knowledge:6,wealth:2},     eco:+1, pop:0,  minPop:10, t:25,  desc:'Diffusion du savoir.' },
      banque:   { n:'Banque Médicis', cat:'Commerce',   terrain:['plains','coast'],        cost:{wealth:50,special:15},      prod:{wealth:9},                eco: 0, pop:0,  minPop:12, t:30,  desc:'Finance internationale.' },
      caravelle:{ n:'Caravelle',      cat:'Exploration',terrain:['coast'],                 cost:{mat2:35,energy:20,wealth:20},prod:{wealth:7,food:3,special:3},eco:+2, pop:0,  minPop:15, t:35,  desc:'Commerce et exploration.' },
      universite2:{ n:'Université Humaniste',cat:'Science',terrain:['plains','coast'],    cost:{knowledge:40,wealth:40,special:30},prod:{knowledge:12,special:3},eco:+5,pop:0, minPop:22, t:50,  desc:'Humanisme et sciences.' },
    },
    techs: [
      { id:'r_art', n:'Mécénat des Arts',  cost:{knowledge:25,wealth:50,special:30},t:45,effect:'+100% art',       req:[],done:false,col:'#38bdf8' },
      { id:'r_exp', n:'Navigation',         cost:{knowledge:30,mat2:40},            t:55,effect:'+80% commerce maritime',req:['r_art'],done:false,col:'#0ea5e9' },
      { id:'r_sci', n:'Méthode Scientifique',cost:{knowledge:40,mat1:30},           t:65,effect:'+90% sciences',  req:['r_exp'],done:false,col:'#7dd3fc' },
      { id:'r_rev', n:'🔑 Révolution Scientifique',cost:{knowledge:70,special:60,wealth:80},t:110,
        effect:'Newton, Galilée — Passe à l\'Ère Industrielle',
        req:['r_art','r_exp','r_sci'],done:false,col:'#38bdf8',isKeyTech:true },
    ],
    keyTechId: 'r_rev',
    eraBonus: { prodMult:1.15, popBonus:15, resBonus:0.2 },
  },

  // ══════════════════════════════════════
  //  6 — ÈRE INDUSTRIELLE
  // ══════════════════════════════════════
  {
    id:6, name:"Ère Industrielle", icon:"🏭", short:"Industriel",
    palette: { bg:'#0a0806', bg1:'#130f0b', bg2:'#1c1510', accent:'#f97316', accent2:'#fb923c', gold:'#eab308', muted:'#5a3a1a' },
    desc:"Vapeur, charbon, acier. La machine remplace l'homme.",
    resources: {
      mat1:  { n:'Charbon',   ic:'⚫' },
      mat2:  { n:'Acier',     ic:'⚙️' },
      food:  { n:'Blé',       ic:'🌾' },
      water: { n:'Vapeur',    ic:'♨️' },
      wealth:{ n:'Livres Sterling',ic:'💰' },
      knowledge:{ n:'Brevets',ic:'📋' },
      energy:{ n:'Fer',       ic:'🔩' },
      special:{ n:'Coton',    ic:'🧶' },
    },
    startRes: { mat1:100, mat2:60, food:80, water:50, wealth:45, knowledge:25, energy:40, special:30 },
    zones: {
      plains:  { n:'Campagne', ic:'🌾', col:'#f97316', res:'Blé · Agriculture', eco:+1, slots:5 },
      forest:  { n:'Bois',     ic:'🌲', col:'#22c55e', res:'Bois · Charbon',    eco:+1, slots:4 },
      mountain:{ n:'Mine',     ic:'⛰️', col:'#78716c', res:'Charbon · Fer',     eco:-2, slots:5 },
      coast:   { n:'Port industriel',ic:'🌊',col:'#0ea5e9',res:'Commerce · Fer', eco:+1, slots:3 },
      desert:  { n:'Terrain vague',ic:'🏭',col:'#d97706',res:'Charbon · Déchets',eco:-3, slots:2 },
    },
    buildings: {
      ouvrier:  { n:'Logement Ouvrier', cat:'Habitat',   terrain:['plains','coast'],        cost:{mat2:20,mat1:10},          prod:{},                       eco:-2, pop:8,  minPop:0,  t:12,  desc:'+8 pop. Conditions difficiles.' },
      usine:    { n:'Usine',            cat:'Production', terrain:['plains','mountain'],     cost:{mat1:30,energy:20},        prod:{mat2:6,special:3},        eco:-6, pop:0,  minPop:0,  t:20,  desc:'Production en masse.' },
      mine:     { n:'Mine de Charbon',  cat:'Production', terrain:['mountain'],              cost:{energy:25,mat2:15},        prod:{mat1:8,energy:2},         eco:-8, pop:0,  minPop:5,  t:25,  desc:'Charbon en abondance.' },
      ferroviaire:{ n:'Gare Ferroviaire',cat:'Infrastructure',terrain:['plains','coast','mountain'],cost:{mat2:40,mat1:20},  prod:{wealth:8,special:4},      eco:-3, pop:0,  minPop:10, t:35,  desc:'Réseau ferré. Commerce +.' },
      filature:  { n:'Filature',        cat:'Production', terrain:['plains','coast'],        cost:{special:25,mat1:15},       prod:{special:5,wealth:4},      eco:-4, pop:0,  minPop:8,  t:22,  desc:'Textile industriel.' },
      banque2:  { n:'Banque Nationale', cat:'Commerce',   terrain:['plains','coast'],        cost:{wealth:60,knowledge:20},   prod:{wealth:10},               eco: 0, pop:0,  minPop:15, t:32,  desc:'Capital financier.' },
      parc:     { n:'Parc Urbain',      cat:'Écologie',   terrain:['plains'],                cost:{mat2:15,wealth:20},        prod:{},                       eco:+8, pop:12, minPop:20, t:25,  desc:'+12 pop. ISP +8. Poumon vert.' },
    },
    techs: [
      { id:'i_vap', n:'Machine à Vapeur',   cost:{knowledge:30,mat1:50,mat2:30},  t:50,effect:'+80% production',   req:[],done:false,col:'#f97316' },
      { id:'i_fer', n:'Réseau Ferroviaire', cost:{knowledge:35,mat2:50,wealth:50},t:60,effect:'+100% commerce',    req:['i_vap'],done:false,col:'#78716c' },
      { id:'i_chi', n:'Chimie industrielle',cost:{knowledge:40,special:40},       t:70,effect:'+70% matériaux',   req:['i_vap'],done:false,col:'#fb923c' },
      { id:'i_ele', n:'🔑 Électrification', cost:{knowledge:80,mat2:80,wealth:80},t:120,
        effect:'Edison & Tesla — Passe à l\'Ère Moderne',
        req:['i_vap','i_fer','i_chi'],done:false,col:'#fbbf24',isKeyTech:true },
    ],
    keyTechId: 'i_ele',
    eraBonus: { prodMult:1.15, popBonus:20, resBonus:0.2 },
  },

  // ══════════════════════════════════════
  //  7 — ÈRE MODERNE
  // ══════════════════════════════════════
  {
    id:7, name:"Ère Moderne", icon:"🌆", short:"Moderne",
    palette: { bg:'#060b14', bg1:'#0b1220', bg2:'#10192e', accent:'#60a5fa', accent2:'#93c5fd', gold:'#f59e0b', muted:'#1e3a5f' },
    desc:"Béton, pétrole, électricité. Le XXe siècle en marche.",
    resources: {
      mat1:  { n:'Béton',      ic:'🏗️' },
      mat2:  { n:'Pétrole',    ic:'🛢️' },
      food:  { n:'Nourriture', ic:'🍞' },
      water: { n:'Eau potable',ic:'💧' },
      wealth:{ n:'Dollars',    ic:'💵' },
      knowledge:{ n:'Recherche',ic:'🔬' },
      energy:{ n:'Électricité',ic:'⚡' },
      special:{ n:'Plastique', ic:'🧪' },
    },
    startRes: { mat1:120, mat2:80, food:90, water:70, wealth:55, knowledge:35, energy:50, special:25 },
    zones: {
      plains:  { n:'Banlieue',   ic:'🏘️', col:'#60a5fa', res:'Logements · Agriculture', eco: 0, slots:6 },
      forest:  { n:'Zone verte', ic:'🌲', col:'#22c55e', res:'Forêt préservée',          eco:+4, slots:3 },
      mountain:{ n:'Carrière',   ic:'⛰️', col:'#78716c', res:'Béton · Pierre',           eco:-2, slots:4 },
      coast:   { n:'Zone port',  ic:'🌊', col:'#0ea5e9', res:'Commerce · Pétrole',       eco:+1, slots:4 },
      desert:  { n:'Zone ind.',  ic:'🏭', col:'#d97706', res:'Pétrole · Déchets',        eco:-4, slots:3 },
    },
    buildings: {
      immeuble: { n:'Immeuble',       cat:'Habitat',    terrain:['plains','coast'],        cost:{mat1:25,energy:10},        prod:{},                       eco:-2, pop:15, minPop:0,  t:15,  desc:'+15 pop max.' },
      centrale: { n:'Centrale Élec.', cat:'Énergie',    terrain:['coast','plains'],        cost:{mat2:30,mat1:20},          prod:{energy:10},              eco:-5, pop:0,  minPop:0,  t:22,  desc:'Électricité pour tous.' },
      usine2:   { n:'Usine Moderne',  cat:'Production', terrain:['plains','desert'],       cost:{mat1:35,energy:20},        prod:{special:6,mat1:3},        eco:-6, pop:0,  minPop:8,  t:25,  desc:'Production moderne.' },
      hopital:  { n:'Hôpital',        cat:'Infrastructure',terrain:['plains'],             cost:{wealth:50,knowledge:20},   prod:{},                       eco:+3, pop:20, minPop:10, t:30,  desc:'+20 pop. Santé publique.' },
      autoroute:{ n:'Autoroute',      cat:'Infrastructure',terrain:['plains','desert','coast'],cost:{mat1:50,energy:20},    prod:{wealth:9},               eco:-4, pop:0,  minPop:12, t:35,  desc:'Commerce accéléré.' },
      solaire:  { n:'Parc Solaire',   cat:'Écologie',   terrain:['plains','desert','coast'],cost:{special:30,wealth:40},    prod:{energy:12},              eco:+8, pop:0,  minPop:18, t:28,  desc:'Énergie propre. ISP +8.' },
      labo:     { n:'Laboratoire R&D',cat:'Science',    terrain:['plains','coast'],        cost:{knowledge:50,wealth:60},   prod:{knowledge:12,special:4},  eco:+2, pop:0,  minPop:25, t:45,  desc:'Recherche avancée.' },
    },
    techs: [
      { id:'mo_auto',n:'Automobile',          cost:{knowledge:35,mat2:50,energy:40},  t:55,effect:'+80% commerce',  req:[],done:false,col:'#60a5fa' },
      { id:'mo_med', n:'Médecine Moderne',     cost:{knowledge:45,wealth:70},          t:65,effect:'+60% pop max',  req:['mo_auto'],done:false,col:'#34d399' },
      { id:'mo_nuc', n:'Énergie Nucléaire',    cost:{knowledge:55,energy:60,mat2:50},  t:80,effect:'+150% énergie',req:['mo_med'],done:false,col:'#a78bfa' },
      { id:'mo_inf', n:'🔑 Informatique',      cost:{knowledge:100,energy:100,special:80},t:140,
        effect:'Silicon Valley — Passe à l\'Ère Numérique',
        req:['mo_auto','mo_med','mo_nuc'],done:false,col:'#60a5fa',isKeyTech:true },
    ],
    keyTechId: 'mo_inf',
    eraBonus: { prodMult:1.15, popBonus:25, resBonus:0.2 },
  },

  // ══════════════════════════════════════
  //  8 — ÈRE NUMÉRIQUE
  // ══════════════════════════════════════
  {
    id:8, name:"Ère Numérique", icon:"💻", short:"Numérique",
    palette: { bg:'#060812', bg1:'#0a0e1e', bg2:'#0e1430', accent:'#a78bfa', accent2:'#c4b5fd', gold:'#22d3ee', muted:'#2d1b69' },
    desc:"Data, IA et réseaux. Le monde devient virtuel.",
    resources: {
      mat1:  { n:'Silicium',    ic:'💾' },
      mat2:  { n:'Cuivre rare', ic:'🔌' },
      food:  { n:'Biocultures', ic:'🧬' },
      water: { n:'Eau filtrée', ic:'💧' },
      wealth:{ n:'Crypto',      ic:'₿' },
      knowledge:{ n:'Données',  ic:'📊' },
      energy:{ n:'Énergie verte',ic:'⚡' },
      special:{ n:'IA',         ic:'🤖' },
    },
    startRes: { mat1:130, mat2:90, food:100, water:80, wealth:65, knowledge:50, energy:60, special:20 },
    zones: {
      plains:  { n:'Smart City',  ic:'🏙️', col:'#a78bfa', res:'Data · Commerce',        eco:+2, slots:6 },
      forest:  { n:'Zone verte',  ic:'🌿', col:'#22c55e', res:'Forêt préservée',         eco:+5, slots:3 },
      mountain:{ n:'Datacenter',  ic:'🖥️', col:'#6b7280', res:'Silicium · Serveurs',    eco:-3, slots:5 },
      coast:   { n:'Hub maritime',ic:'🌊', col:'#0ea5e9', res:'Commerce · Câbles',       eco:+2, slots:4 },
      desert:  { n:'Ferme solaire',ic:'☀️',col:'#f59e0b', res:'Énergie · Lithium',      eco: 0, slots:3 },
    },
    buildings: {
      smartapt: { n:'Smart Apartment',  cat:'Habitat',   terrain:['plains','coast'],       cost:{mat1:30,energy:20},         prod:{},                      eco:+1, pop:20, minPop:0,  t:18,  desc:'+20 pop. Logement connecté.' },
      datacenter:{ n:'Datacenter',      cat:'Production', terrain:['mountain','plains'],    cost:{mat1:40,energy:30},         prod:{special:6,knowledge:8},  eco:-4, pop:0,  minPop:0,  t:25,  desc:'Données et IA.' },
      startup:  { n:'Hub Start-up',     cat:'Commerce',   terrain:['plains','coast'],       cost:{wealth:50,knowledge:30},    prod:{wealth:10,special:3},    eco:+2, pop:0,  minPop:8,  t:28,  desc:'Innovation et capital.' },
      reseau5g: { n:'Réseau 5G',        cat:'Infrastructure',terrain:['plains','coast','mountain'],cost:{mat2:40,energy:25},  prod:{wealth:7,special:2},    eco: 0, pop:0,  minPop:10, t:30,  desc:'Connectivité totale.' },
      biotechlab:{ n:'Biotech Lab',     cat:'Science',    terrain:['plains','coast'],       cost:{knowledge:60,special:30},   prod:{knowledge:15,food:5},    eco:+3, pop:0,  minPop:15, t:40,  desc:'Biologie synthétique.' },
      solairemega:{ n:'Méga Solaire',   cat:'Écologie',   terrain:['desert','plains','coast'],cost:{energy:40,wealth:60},    prod:{energy:15},              eco:+10,pop:0,  minPop:20, t:35,  desc:'Énergie propre massive.' },
      smartgov: { n:'Gouvernance IA',   cat:'Gouvernance',terrain:['plains','coast'],       cost:{special:50,knowledge:60,wealth:70},prod:{special:8,wealth:8,knowledge:10},eco:+5,pop:25,minPop:30,t:55,desc:'+25 pop. Gouvernance totale.' },
    },
    techs: [
      { id:'n_ia',  n:'Intelligence Artificielle',cost:{knowledge:50,special:50,energy:50},t:70,effect:'+120% données',  req:[],done:false,col:'#a78bfa' },
      { id:'n_bio', n:'Biotechnologie',           cost:{knowledge:60,food:50,special:30}, t:80,effect:'+100% biocultures',req:['n_ia'],done:false,col:'#34d399' },
      { id:'n_qua', n:'Informatique Quantique',   cost:{knowledge:80,mat1:60,energy:60},  t:95,effect:'+200% silicium',  req:['n_ia'],done:false,col:'#c4b5fd' },
      { id:'n_agi', n:'🔑 IA Générale (AGI)',     cost:{knowledge:150,special:120,wealth:120},t:160,
        effect:'La singularité — Passe au Futur',
        req:['n_ia','n_bio','n_qua'],done:false,col:'#a78bfa',isKeyTech:true },
    ],
    keyTechId: 'n_agi',
    eraBonus: { prodMult:1.20, popBonus:30, resBonus:0.25 },
  },

  // ══════════════════════════════════════
  //  9 — ÈRE FUTURE
  // ══════════════════════════════════════
  {
    id:9, name:"Futur", icon:"🚀", short:"Futur",
    palette: { bg:'#05060f', bg1:'#080a18', bg2:'#0c0e24', accent:'#22d3ee', accent2:'#67e8f9', gold:'#a78bfa', muted:'#0f3460' },
    desc:"Fusion, biotech et espace. L'humanité transcende ses limites.",
    resources: {
      mat1:  { n:'Quantum',      ic:'⚛️' },
      mat2:  { n:'Nano-matière', ic:'🔬' },
      food:  { n:'Synth-food',   ic:'🧬' },
      water: { n:'H₂O pur',      ic:'💧' },
      wealth:{ n:'Stellaire',    ic:'⭐' },
      knowledge:{ n:'Conscience',ic:'🧠' },
      energy:{ n:'Fusion',       ic:'♾️' },
      special:{ n:'Biotech',     ic:'🦾' },
    },
    startRes: { mat1:150, mat2:100, food:120, water:90, wealth:80, knowledge:70, energy:80, special:40 },
    zones: {
      plains:  { n:'Mégalopole',  ic:'🌆', col:'#22d3ee', res:'Quantum · Commerce',     eco:+3, slots:6 },
      forest:  { n:'Dôme Éco',    ic:'🌿', col:'#4ade80', res:'Forêt préservée · Éco',  eco:+6, slots:4 },
      mountain:{ n:'Labo souterrain',ic:'⚛️',col:'#6b7280',res:'Quantum · Nano',        eco:-2, slots:5 },
      coast:   { n:'Port orbital', ic:'🚀', col:'#0ea5e9', res:'Stellaire · Commerce',   eco:+3, slots:4 },
      desert:  { n:'Base solaire', ic:'☀️', col:'#f59e0b', res:'Fusion · Énergie',       eco: 0, slots:3 },
    },
    buildings: {
      dome:     { n:'Dôme Habituel',    cat:'Habitat',    terrain:['plains','coast'],       cost:{mat2:40,energy:30},         prod:{},                       eco:+3, pop:25, minPop:0,  t:20,  desc:'+25 pop. Habitat durable.' },
      reacteur: { n:'Réacteur à Fusion',cat:'Énergie',    terrain:['plains','mountain'],    cost:{mat1:50,energy:40},         prod:{energy:20,knowledge:5},   eco:+5, pop:0,  minPop:0,  t:30,  desc:'Énergie infinie et propre.' },
      orbital:  { n:'Station Orbitale', cat:'Science',    terrain:['coast','plains'],        cost:{mat1:60,special:40,wealth:60},prod:{knowledge:20,wealth:10}, eco:+8, pop:0,  minPop:10, t:45,  desc:'Science spatiale.' },
      biotech:  { n:'Centre Biotech',   cat:'Science',    terrain:['plains','coast'],        cost:{special:50,knowledge:40},   prod:{special:10,food:8},       eco:+5, pop:0,  minPop:12, t:38,  desc:'Biologie avancée.' },
      quantum:  { n:'Quantum Core',     cat:'Production', terrain:['mountain','plains'],     cost:{mat1:70,energy:50},         prod:{mat1:8,mat2:6,knowledge:10},eco:-1, pop:0,  minPop:18, t:50,  desc:'Calcul quantique massif.' },
      ecosphere:{ n:'Écosphère',        cat:'Écologie',   terrain:['forest','plains'],       cost:{special:60,knowledge:50},   prod:{food:10},                eco:+15,pop:30, minPop:25, t:55,  desc:'+30 pop. ISP +15. Paradis vert.' },
      dyson:    { n:'Essaim de Dyson',  cat:'Énergie',    terrain:['desert','coast'],        cost:{mat2:80,energy:70,wealth:80},prod:{energy:25,wealth:12},    eco:+10,pop:0,  minPop:35, t:70,  desc:'Énergie stellaire. Fin ultime.' },
    },
    techs: [
      { id:'fu_fus',n:'Fusion Nucléaire',    cost:{knowledge:80,energy:100,mat1:80},  t:90, effect:'+200% énergie',     req:[],done:false,col:'#22d3ee' },
      { id:'fu_bio',n:'Bioaugmentation',     cost:{knowledge:100,special:80,food:60}, t:110,effect:'+150% biotech',     req:['fu_fus'],done:false,col:'#4ade80' },
      { id:'fu_spa',n:'Colonisation Spatiale',cost:{knowledge:120,wealth:120,energy:100},t:130,effect:'+200% stellaire',req:['fu_bio'],done:false,col:'#a78bfa' },
      { id:'fu_tra',n:'🏆 Transcendance',    cost:{knowledge:200,special:200,wealth:200,energy:200},t:200,
        effect:'L\'humanité transcende — VICTOIRE ULTIME',
        req:['fu_fus','fu_bio','fu_spa'],done:false,col:'#22d3ee',isKeyTech:true,isVictory:true },
    ],
    keyTechId: 'fu_tra',
    eraBonus: { prodMult:1.0, popBonus:0, resBonus:0 }, // âge final
  },
];

// ─── Helpers ──────────────────────────────────────
export function currentEra(eraId) { return ERAS[eraId || 0]; }
export function currentZones(eraId) { return ERAS[eraId || 0].zones; }
export function currentBldgs(eraId) { return ERAS[eraId || 0].buildings; }
export function currentTechs(eraId) { return ERAS[eraId || 0].techs; }
export function currentRes(eraId)   { return ERAS[eraId || 0].resources; }
export function currentKeyTech(eraId){ return ERAS[eraId||0].techs.find(t=>t.isKeyTech); }

export function eraRES(eraId) {
  const res = ERAS[eraId||0].resources;
  return Object.entries(res).map(([k,v]) => ({k,...v}));
}

export function initialZones(eraId=0) {
  const zoneDefs = ERAS[eraId].zones;
  const result = {};
  Object.keys(zoneDefs).forEach(k => { result[k] = { buildings:[], count: k==='plains'?8:k==='forest'?4:k==='mountain'?3:k==='coast'?2:1 }; });
  return result;
}

// Difficulté progressive (même principe)
export function buildCostMult(day, eraId) {
  const base = day<=10?1.0:day<=30?1.2:day<=60?1.5:day<=100?2.0:2.5;
  const eraMult = 1 + eraId * 0.1; // chaque ère rend les constructions 10% plus chères
  return base * eraMult;
}
export function techCostMult(tier, day, eraId) {
  const tf = Math.pow(1.5, tier-1);
  const df = 1 + Math.floor(day/15)*0.15;
  const ef = 1 + eraId * 0.12;
  return tf * df * ef;
}
export function upgradeCostMult(cm, level, day, eraId) {
  const af = 1 + Math.floor(day/10)*0.10;
  const ef = 1 + eraId * 0.08;
  return Math.pow(cm, level) * af * ef;
}

// Marché
export const MARKET_SPREAD = 2.2;
export const MARKET_TAX_GOLD = 5;
export const MARKET_LOTS = [10, 25, 50, 100, 250];
export const RES_VALUE = { mat1:1, mat2:1.5, food:1.5, water:1.3, wealth:8, knowledge:6, energy:3, special:4 };
export function marketRate(from, to, day, discount=1) {
  const base = (RES_VALUE[to]/RES_VALUE[from]) * MARKET_SPREAD;
  const age  = 1 + Math.floor(day/20)*0.08;
  return Math.max(1.2, base*age*discount);
}

export const VERSION_INFO = { version:VERSION, buildDate:'2024' };

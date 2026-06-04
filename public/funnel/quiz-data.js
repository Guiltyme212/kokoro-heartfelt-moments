/* =====================================================
   Kokoro — onboarding content (data only)
   The engine + renderers live in quiz-flow.js.
   Steps are authored in kokoro's voice: lowercase, warm,
   second-person, em dashes, no emoji, no exclamation.
   Every persuasion move here is the *honest* half of the
   web2app playbook — resonance phrasing, goal-gradient,
   congruent social proof, a real reflection (never a fake
   diagnosis), and a transparent paywall.
   ===================================================== */

/* named sections drive the goal-gradient progress label */
const SECTIONS = ['where you are', 'the pattern', 'what you want', 'your map', 'begin'];

const STEPS = [

  /* ---------- intro: frame the promise ---------- */
  { id:'problem', type:'stmt', eyebrow:'why you\u2019re here',
    h2:'most apps ask you to <em>calm down</em> before they ever ask why you\u2019re not okay.',
    p:'kokoro does it the other way round. he listens first.', cta:'that\u2019s exactly it' },

  { id:'solution', type:'stmt', eyebrow:'how this works',
    h2:'tell him what\u2019s <em>actually</em> going on. he turns it into a short meditation \u2014 yours, for tonight.',
    p:'no scripts. no streaks. a few questions, then one true thing.', cta:'okay, let\u2019s start' },

  { id:'gender', type:'single', sec:0, title:'first \u2014 who is kokoro speaking to?',
    help:'it shapes the voice and pronouns he uses. nothing more.',
    options:[
      {v:'woman', label:'a woman', icon:'venus'},
      {v:'man', label:'a man', icon:'mars'},
      {v:'nonbinary', label:'non-binary', icon:'sparkle'},
      {v:'private', label:'i\u2019d rather not say', icon:'eyeoff'}
    ]},

  { id:'context', type:'single', sec:0, title:'what does the next 90 days hold?',
    help:'this shapes what kokoro builds for you. there\u2019s no wrong answer.',
    options:[
      {v:'launch', label:'a launch, pitch, or big moment', icon:'bolt'},
      {v:'decision', label:'a decision i can\u2019t stop turning over', icon:'compass'},
      {v:'through', label:'honestly \u2014 just getting through it', icon:'weight'},
      {v:'rebuild', label:'rebuilding myself after something', icon:'sprout'},
      {v:'steady', label:'staying steady when it\u2019s a lot', icon:'anchor'}
    ]},

  { id:'tired', type:'relate', sec:0,
    quote:'you\u2019re tired in a way sleep doesn\u2019t fix.',
    reflectHi:'yeah \u2014 that kind of tired is rarely about sleep.',
    reflectLo:'good. hold onto that \u2014 not everyone can say it.' },

  /* ---------- section 0 · where you are ---------- */
  { id:'entry', type:'single', q:true, sec:0, title:'what made you open this tonight?',
    help:'there\u2019s no wrong answer here. just the true one.',
    options:[
      {v:'overthinking', label:'i\u2019m overthinking everything', icon:'brain'},
      {v:'heavy', label:'i feel emotionally heavy', icon:'weight'},
      {v:'cantsay', label:'i can\u2019t talk about something', icon:'lock'},
      {v:'calm', label:'i need to calm down, fast', icon:'bolt'},
      {v:'lost', label:'i feel lost or stuck', icon:'compass'},
      {v:'stronger', label:'i want to become someone stronger', icon:'sprout'}
    ]},

  { id:'intensity', type:'slider', q:true, sec:0, title:'how loud is it in there<br/>right now?',
    help:'drag to wherever it actually is. he\u2019ll build for that.',
    ends:['quiet','i can\u2019t escape my thoughts'] },

  { id:'racing', type:'relate', q:true, sec:0,
    quote:'my mind picks the worst possible moment to get loud.',
    reflectHi:'right when you need it quiet. kokoro knows that timing.',
    reflectLo:'noted. he won\u2019t build for noise you don\u2019t have.' },

  { id:'carrying', type:'single', q:true, sec:0, title:'what are you carrying right now?',
    help:'pick whatever\u2019s closest. this is the one he builds from.',
    options:[
      {v:'behind', label:'i feel behind everyone', icon:'clock'},
      {v:'miss', label:'i miss someone', icon:'heart'},
      {v:'wasting', label:'i\u2019m scared i\u2019m wasting my life', icon:'compass'},
      {v:'pretending', label:'i\u2019m tired of pretending i\u2019m okay', icon:'eyeoff'},
      {v:'noswitch', label:'i can\u2019t switch my brain off', icon:'brain'},
      {v:'noname', label:'something i can\u2019t name yet', icon:'feather'}
    ]},

  { id:'feels', type:'multi', q:true, sec:0, title:'what does it mostly feel like?',
    help:'pick all that fit \u2014 it can be more than one.',
    options:[
      {label:'anxiety'},{label:'shame'},{label:'anger'},{label:'loneliness'},
      {label:'grief'},{label:'pressure'},{label:'confusion'},{label:'numbness'}
    ]},

  { id:'fact1', type:'fact', sec:0, kanji:'\u601d',
    eyebrow:'a small thing worth knowing',
    h2:'you can understand a feeling completely \u2014 and still feel it.',
    p:'your nervous system learns by repetition, not insight. that gap, between knowing and feeling, is the only place kokoro works.',
    src:'emotional regulation research', cta:'okay \u2014 go on' },

  /* ---------- section 1 · the pattern ---------- */
  { id:'trigger', type:'single', q:true, sec:1, title:'when does it hit hardest?',
    options:[
      {v:'night', label:'at night', icon:'moon'},
      {v:'morning', label:'in the morning', icon:'sun'},
      {v:'scroll', label:'after scrolling', icon:'phone'},
      {v:'talk', label:'after talking to someone', icon:'chat'},
      {v:'alone', label:'when i\u2019m alone', icon:'user'},
      {v:'work', label:'when i need to work', icon:'briefcase'},
      {v:'random', label:'randomly, for no reason', icon:'dice'}
    ]},

  { id:'fine', type:'relate', q:true, sec:1,
    quote:'i can look completely fine and be barely holding it.',
    reflectHi:'most people around you have no idea. kokoro will.',
    reflectLo:'then you\u2019re holding it better than most. still worth a rest.' },

  { id:'coping', type:'single', q:true, sec:1, title:'what do you usually do when it hits?',
    help:'be honest \u2014 he\u2019s not keeping score.',
    options:[
      {v:'scroll', label:'scroll until i feel nothing', icon:'phone'},
      {v:'distract', label:'distract myself', icon:'sparkle'},
      {v:'overthink', label:'overthink it even more', icon:'brain'},
      {v:'pretend', label:'pretend i\u2019m fine', icon:'eyeoff'},
      {v:'work', label:'work harder', icon:'briefcase'},
      {v:'avoid', label:'sleep or avoid everything', icon:'moon'},
      {v:'talk', label:'try to talk \u2014 it doesn\u2019t land', icon:'chat'}
    ]},

  { id:'loop', type:'reflect', sec:1,
    h2:'here\u2019s your loop \u2014 and it\u2019s not your fault.',
    loop:['the feeling','you escape it','it comes back'],
    cta:'yeah\u2026 that\u2019s true' },

  { id:'rest', type:'relate', q:true, sec:1,
    quote:'i don\u2019t actually rest \u2014 i just stop, then start again.',
    reflectHi:'stopping isn\u2019t resting. kokoro builds the second one.',
    reflectLo:'if you can truly rest, that\u2019s rare. we\u2019ll protect it.' },

  { id:'fact2', type:'fact', sec:1, kanji:'\u5fd7',
    eyebrow:'why this works',
    h2:'a vividly rehearsed moment fires almost the same circuits as a real one.',
    p:'it\u2019s why athletes rehearse in their heads. kokoro builds your session to be <em>felt</em>, not just heard \u2014 so the calmer response starts to feel like yours.',
    src:'motor imagery & mental rehearsal studies', cta:'that makes sense' },

  { id:'testi1', type:'testimonial', sec:1,
    name:'sam', age:'32', stars:5,
    quote:'i stopped trying to think my way out at 1am. the night session just\u2026 lets me put it down.',
    sub:'one of thousands who came here unable to switch off.' },

  /* ---------- section 2 · what you want ---------- */
  { id:'want', type:'single', q:true, sec:2, title:'what do you want to feel after your first session?',
    options:[
      {v:'lighter', label:'lighter', icon:'feather'},
      {v:'safe', label:'safe inside my own head', icon:'heart'},
      {v:'clear', label:'clear on what\u2019s next', icon:'compass'},
      {v:'lessalone', label:'less alone', icon:'chat'},
      {v:'sleep', label:'calm enough to sleep', icon:'moon'},
      {v:'control', label:'stronger, more in control', icon:'anchor'},
      {v:'letgo', label:'like i can finally let go', icon:'wind'}
    ]},

  { id:'unsaid', type:'relate', q:true, sec:2,
    quote:'the thing i most need to say, i keep not saying.',
    reflectHi:'kokoro is where you get to say it first \u2014 out loud, to no one.',
    reflectLo:'good. saying it is half of letting it move.' },

  { id:'tone', type:'single', q:true, sec:2, title:'how should kokoro talk to you?',
    help:'this picks the voice he hands you to.',
    options:[
      {v:'gentle', label:'soft and gentle', icon:'feather'},
      {v:'friend', label:'warm, like a safe friend', icon:'heart'},
      {v:'wise', label:'wise and calm', icon:'sparkle'},
      {v:'direct', label:'direct, no bullshit', icon:'bolt'},
      {v:'dark', label:'a little dark-humor, but kind', icon:'dice'},
      {v:'spiritual', label:'spiritual, but not cringe', icon:'star'}
    ]},

  { id:'style', type:'single', q:true, sec:2, title:'what kind of session would help most today?',
    options:[
      {v:'calm', label:'calm me down', icon:'wind'},
      {v:'process', label:'help me process emotions', icon:'heart'},
      {v:'sleep', label:'help me sleep', icon:'moon'},
      {v:'confidence', label:'give me confidence', icon:'anchor'},
      {v:'letgo', label:'help me let go', icon:'feather'},
      {v:'future', label:'see my future self clearly', icon:'star'}
    ]},

  { id:'ready', type:'relate', q:true, sec:2,
    quote:'i keep waiting to feel ready before i deal with it.',
    reflectHi:'ready never quite arrives. three minutes does.',
    reflectLo:'then you\u2019re already past the hardest part \u2014 starting.' },

  { id:'length', type:'single', q:true, sec:2, title:'how much time do you have?',
    options:[
      {v:'3', label:'3 minutes', sub:'a quick reset', icon:'clock'},
      {v:'5', label:'5 minutes', sub:'a real pause', icon:'clock'},
      {v:'7', label:'7 minutes', sub:'the sweet spot', icon:'clock', best:true},
      {v:'10', label:'10 minutes', sub:'go a little deeper', icon:'clock'},
      {v:'15', label:'15 minutes', sub:'the full sit', icon:'clock'}
    ]},

  { id:'avoid', type:'multi', q:true, sec:2, title:'what should kokoro avoid?',
    help:'lower the cringe. pick any that bug you.',
    options:[
      {label:'too spiritual'},{label:'\u201cbreathe in, breathe out\u201d on repeat'},
      {label:'too soft'},{label:'too intense'},{label:'swearing'},{label:'generic advice'}
    ]},

  { id:'goal', type:'single', q:true, sec:2, last:true,
    title:'what should kokoro help you change this week?',
    help:'last one \u2014 then he builds your map.',
    options:[
      {v:'spiral', label:'stop spiraling', icon:'brain'},
      {v:'sleep', label:'sleep better', icon:'moon'},
      {v:'stable', label:'feel emotionally stable', icon:'anchor'},
      {v:'confidence', label:'rebuild confidence', icon:'sprout'},
      {v:'release', label:'let go of someone / something', icon:'wind'},
      {v:'clarity', label:'get clarity', icon:'compass'},
      {v:'myself', label:'feel like myself again', icon:'heart'}
    ]},

  /* ---------- section 3 · your map ---------- */
  { id:'name', type:'name', sec:3,
    title:'what should kokoro call you?',
    help:'he\u2019ll use it \u2014 only with you, never anywhere else.',
    placeholder:'your name' },

  { id:'curve', type:'chart', sec:3,
    eyebrow:'the shape of the work',
    title:'this isn\u2019t a fix. it\u2019s repetition.',
    p:'most people feel the first real shift around <em>day 4</em> \u2014 when the calmer response stops being effort and starts being automatic.',
    note:'a pattern, not a promise. some days move faster than others.',
    cta:'build my map' },

  { id:'building', type:'loading', sec:3, title:'kokoro is building your map\u2026',
    steps:['reading what you shared','finding the pattern underneath','choosing the right voice','shaping your first session'],
    interrupt:{ q:'while he works \u2014 when will you actually do this?',
      options:[
        {v:'morning', label:'morning, to set the day', icon:'sun'},
        {v:'midday', label:'a midday reset', icon:'wind'},
        {v:'night', label:'at night, to come down', icon:'moon'}
      ]} },

  { id:'map', type:'map', sec:3 },

  { id:'preview', type:'preview', sec:3,
    title:'your first session is ready.',
    help:'kokoro built it from what you shared. it unlocks the moment you start \u2014 inside the app.',
    cardTitle:'when you keep saying you\u2019re fine',
    metaLen:'a guided sit',
    locked:'plays in the app once you begin' },

  /* ---------- section 4 · begin ---------- */
  { id:'email', type:'email', sec:4,
    q:'where should kokoro save your map?',
    help:'your first session and 7-day plan are ready. don\u2019t lose them.' },

  { id:'sevenday', type:'beforeafter', sec:4,
    eyebrow:'what we build toward',
    title:'where this goes, if you stay with it',
    now:['head won\u2019t switch off','bracing before the day','tired but wired'],
    after:['a way to put it down','steadier mornings','actually asleep'],
    note:'honest version: this is the aim, not a guarantee. it works if you show up.',
    cta:'i want that' },

  { id:'trust', type:'trust', sec:4,
    title:'you\u2019re not doing this alone.',
    stat:'12,000+', statLabel:'rituals built this month',
    rating:'4.9', ratingLabel:'across the app store',
    chips:['came here to sleep','came here to let go','came here for clarity'],
    cta:'keep going' },

  { id:'testi2', type:'testimonial', sec:4,
    name:'maya', age:'29', stars:5,
    quote:'three minutes, before the day starts. it\u2019s the only thing that\u2019s actually stuck.',
    sub:'kept going past day 7.' },

  { id:'commit', type:'commit', sec:4,
    eye:'your commitment',
    title:'say this \u2014 and mean it.',
    pledge:'this week, i\u2019m choosing to stop running from how i feel \u2014 and to let myself <em>{goal}</em>.',
    by:'\u2014 my promise to myself',
    done:'you said it. kokoro\u2019s got you now.' },

  { id:'paywall', type:'paywall', sec:4,
    title:'your kokoro plan is ready.',
    sub:'built from what you shared, in your tone, for what you need tonight.',
    perks:[
      'tonight\u2019s personalized meditation',
      'a 7-day emotional reset plan',
      'daily check-ins from kokoro',
      'sessions that adapt to what you say'
    ],
    plans:[
      {name:'7 days free', note:'then \u20ac7 / month \u00b7 cancel anytime', price:'\u20ac0', per:'today', best:true, cta:'start my 7-day free trial'},
      {name:'monthly', note:'billed monthly \u00b7 cancel anytime', price:'\u20ac7', per:'/ month', cta:'start with monthly'},
      {name:'yearly', note:'\u20ac39.99 / year \u00b7 save 66%', price:'\u20ac3.33', per:'/ month', cta:'get a year of kokoro'}
    ]},

  { id:'success', type:'success', sec:4, eyebrow:'welcome in',
    h2:'your first session is unlocked.',
    p:'open the app and kokoro will be waiting \u2014 your meditation is already there.' }
];

window.STEPS = STEPS; window.SECTIONS = SECTIONS;

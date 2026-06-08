/* =====================================================
   Kokoro — STANDARD funnel (V1, the "golden" base)
   Pricing strategy #2: no free trial, discount-anchored,
   per-day framing, countdown. Longer quiz + the engaging
   in-between data screens (projection graph, the pattern
   reveal) the competitors use. Engine: quiz-flow.js.
   ===================================================== */

const SECTIONS = ['where you are', 'the pattern', 'what you want', 'your map', 'begin'];

const STEPS = [

  /* ---------- intro: frame the promise ---------- */
  { id:'problem', type:'stmt', eyebrow:'why you’re here',
    h2:'most apps ask you to <em>calm down</em> before they ever ask why you’re not okay.',
    p:'kokoro does it the other way round. he listens first.', cta:'that’s exactly it' },

  { id:'solution', type:'stmt', eyebrow:'how this works',
    h2:'tell him what’s <em>actually</em> going on. he turns it into a short meditation — yours, for tonight.',
    p:'a few questions, then one true thing. takes about 3 minutes.', cta:'okay, let’s start' },

  /* ---------- section 0 · where you are ---------- */
  { id:'gender', type:'single', sec:0, title:'first — who is kokoro speaking to?',
    help:'it shapes the voice and pronouns he uses. nothing more.',
    options:[
      {v:'woman', label:'a woman', icon:'venus'},
      {v:'man', label:'a man', icon:'mars'},
      {v:'nonbinary', label:'non-binary', icon:'sparkle'},
      {v:'private', label:'i’d rather not say', icon:'eyeoff'}
    ]},

  { id:'age', type:'single', sec:0, title:'and how old are you?',
    help:'he pitches the voice and pace to where you are.',
    options:[
      {v:'u18', label:'under 18', icon:'sparkle'},
      {v:'18', label:'18 – 24', icon:'user'},
      {v:'25', label:'25 – 34', icon:'user'},
      {v:'35', label:'35 – 44', icon:'user'},
      {v:'45', label:'45 and up', icon:'user'}
    ]},

  { id:'context', type:'single', sec:0, title:'what does the next 90 days hold?',
    help:'this shapes what kokoro builds for you. there’s no wrong answer.',
    options:[
      {v:'launch', label:'a launch, pitch, or big moment', icon:'bolt'},
      {v:'decision', label:'a decision i can’t stop turning over', icon:'compass'},
      {v:'through', label:'honestly — just getting through it', icon:'weight'},
      {v:'rebuild', label:'rebuilding myself after something', icon:'sprout'},
      {v:'steady', label:'staying steady when it’s a lot', icon:'anchor'}
    ]},

  { id:'tired', type:'relate', sec:0,
    quote:'you’re tired in a way sleep doesn’t fix.',
    reflectHi:'yeah — that kind of tired is rarely about sleep.',
    reflectLo:'good. hold onto that — not everyone can say it.' },

  { id:'entry', type:'single', q:true, sec:0, title:'what made you open this tonight?',
    help:'there’s no wrong answer here. just the true one.',
    options:[
      {v:'overthinking', label:'i’m overthinking everything', icon:'brain'},
      {v:'heavy', label:'i feel emotionally heavy', icon:'weight'},
      {v:'cantsay', label:'i can’t talk about something', icon:'lock'},
      {v:'calm', label:'i need to calm down, fast', icon:'bolt'},
      {v:'lost', label:'i feel lost or stuck', icon:'compass'},
      {v:'stronger', label:'i want to become someone stronger', icon:'sprout'}
    ]},

  { id:'intensity', type:'slider', q:true, sec:0, title:'how loud is it in there<br/>right now?',
    help:'drag to wherever it actually is. he’ll build for that.',
    ends:['quiet','i can’t escape my thoughts'] },

  { id:'racing', type:'relate', q:true, sec:0,
    quote:'my mind picks the worst possible moment to get loud.',
    reflectHi:'right when you need it quiet. kokoro knows that timing.',
    reflectLo:'noted. he won’t build for noise you don’t have.' },

  { id:'carrying', type:'single', q:true, sec:0, title:'what are you carrying right now?',
    help:'pick whatever’s closest. this is the one he builds from.',
    options:[
      {v:'behind', label:'i feel behind everyone', icon:'clock'},
      {v:'miss', label:'i miss someone', icon:'heart'},
      {v:'wasting', label:'i’m scared i’m wasting my life', icon:'compass'},
      {v:'pretending', label:'i’m tired of pretending i’m okay', icon:'eyeoff'},
      {v:'noswitch', label:'i can’t switch my brain off', icon:'brain'},
      {v:'noname', label:'something i can’t name yet', icon:'feather'}
    ]},

  { id:'feels', type:'multi', q:true, sec:0, title:'what does it mostly feel like?',
    help:'pick all that fit — it can be more than one.',
    options:[
      {label:'anxiety'},{label:'shame'},{label:'anger'},{label:'loneliness'},
      {label:'grief'},{label:'pressure'},{label:'confusion'},{label:'numbness'}
    ]},

  { id:'fact1', type:'fact', sec:0, kanji:'思',
    eyebrow:'a small thing worth knowing',
    h2:'you can understand a feeling completely — and still feel it.',
    p:'your nervous system learns by repetition, not insight. that gap, between knowing and feeling, is the only place kokoro works.',
    src:'emotional regulation research', cta:'okay — go on' },

  /* ---------- section 1 · the pattern ---------- */
  { id:'trigger', type:'single', q:true, sec:1, title:'when does it hit hardest?',
    options:[
      {v:'night', label:'at night', icon:'moon'},
      {v:'morning', label:'in the morning', icon:'sun'},
      {v:'scroll', label:'after scrolling', icon:'phone'},
      {v:'talk', label:'after talking to someone', icon:'chat'},
      {v:'alone', label:'when i’m alone', icon:'user'},
      {v:'work', label:'when i need to work', icon:'briefcase'},
      {v:'random', label:'randomly, for no reason', icon:'dice'}
    ]},

  { id:'fine', type:'relate', q:true, sec:1,
    quote:'i can look completely fine and be barely holding it.',
    reflectHi:'most people around you have no idea. kokoro will.',
    reflectLo:'then you’re holding it better than most. still worth a rest.' },

  { id:'coping', type:'single', q:true, sec:1, title:'what do you usually do when it hits?',
    help:'be honest — he’s not keeping score.',
    options:[
      {v:'scroll', label:'scroll until i feel nothing', icon:'phone'},
      {v:'distract', label:'distract myself', icon:'sparkle'},
      {v:'overthink', label:'overthink it even more', icon:'brain'},
      {v:'pretend', label:'pretend i’m fine', icon:'eyeoff'},
      {v:'work', label:'work harder', icon:'briefcase'},
      {v:'avoid', label:'sleep or avoid everything', icon:'moon'},
      {v:'talk', label:'try to talk — it doesn’t land', icon:'chat'}
    ]},

  /* the "you'll get better" projection graph — ascending, positive, counts UP */
  { id:'projection', type:'projection', sec:1,
    eyebrow:'where this is heading',
    title:'this is what repetition builds.',
    metric:'sense of calm', from:24, to:82,
    p:'people who stay with it usually feel noticeably steadier by <em>day 30</em> — calmer, clearer, more in control.',
    note:'a pattern from people like you, not a promise.',
    cta:'i want that' },

  { id:'loop', type:'reflect', sec:1,
    h2:'here’s your loop — and it’s not your fault.',
    loop:['the feeling','you escape it','it comes back'],
    cta:'yeah… that’s true' },

  { id:'rest', type:'relate', q:true, sec:1,
    quote:'i don’t actually rest — i just stop, then start again.',
    reflectHi:'stopping isn’t resting. kokoro builds the second one.',
    reflectLo:'if you can truly rest, that’s rare. we’ll protect it.' },

  { id:'fact2', type:'fact', sec:1, kanji:'志',
    eyebrow:'why this works',
    h2:'a vividly rehearsed moment fires almost the same circuits as a real one.',
    p:'it’s why athletes rehearse in their heads. kokoro builds your session to be <em>felt</em>, not just heard — so the calmer response starts to feel like yours.',
    src:'motor imagery & mental rehearsal studies', cta:'that makes sense' },

  { id:'testi1', type:'testimonial', sec:1,
    name:'sam', age:'32', stars:5,
    quote:'i stopped trying to think my way out at 1am. the night session just… lets me put it down.',
    sub:'one of thousands who came here unable to switch off.' },

  /* ---------- section 2 · what you want ---------- */
  { id:'want', type:'single', q:true, sec:2, title:'what do you want to feel after your first session?',
    options:[
      {v:'lighter', label:'lighter', icon:'feather'},
      {v:'safe', label:'safe inside my own head', icon:'heart'},
      {v:'clear', label:'clear on what’s next', icon:'compass'},
      {v:'lessalone', label:'less alone', icon:'chat'},
      {v:'sleep', label:'calm enough to sleep', icon:'moon'},
      {v:'control', label:'stronger, more in control', icon:'anchor'},
      {v:'letgo', label:'like i can finally let go', icon:'wind'}
    ]},

  { id:'unsaid', type:'relate', q:true, sec:2,
    quote:'the thing i most need to say, i keep not saying.',
    reflectHi:'kokoro is where you get to say it first — out loud, to no one.',
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
    reflectLo:'then you’re already past the hardest part — starting.' },

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
      {label:'too spiritual'},{label:'“breathe in, breathe out” on repeat'},
      {label:'too soft'},{label:'too intense'},{label:'swearing'},{label:'generic advice'}
    ]},

  { id:'goal', type:'single', q:true, sec:2, last:true,
    title:'what should kokoro help you change this week?',
    help:'last one — then he builds your map.',
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
    help:'he’ll use it — only with you, never anywhere else.',
    placeholder:'your name' },

  { id:'curve', type:'chart', sec:3,
    eyebrow:'the shape of the work',
    title:'this isn’t a fix. it’s repetition.',
    p:'most people feel the first real shift around <em>day 4</em> — when the calmer response stops being effort and starts being automatic.',
    note:'a pattern, not a promise. some days move faster than others.',
    cta:'build my map' },

  { id:'building', type:'loading', sec:3, title:'kokoro is building your map…',
    steps:['reading what you shared','finding the pattern underneath','choosing the right voice','shaping your first session'],
    quotes:[
      '“it’s the only thing that actually quiets my head.” — maya',
      '“felt seen in about four questions.” — daniel',
      '“i stopped doom-scrolling at 1am. that’s huge for me.” — sam'
    ],
    interrupt:{ q:'while he works — when will you actually do this?',
      options:[
        {v:'morning', label:'morning, to set the day', icon:'sun'},
        {v:'midday', label:'a midday reset', icon:'wind'},
        {v:'night', label:'at night, to come down', icon:'moon'}
      ]} },

  /* the pattern reveal — named pattern + intensity gauge + profile, echoing answers */
  { id:'reveal', type:'reveal', sec:3,
    eyebrow:'what kokoro found',
    gauge:'elevated',
    p:'this isn’t a diagnosis — it’s the shape of what you told him. and it’s exactly the kind of thing repetition quiets.',
    cta:'that’s me' },

  { id:'map', type:'map', sec:3 },

  { id:'preview', type:'preview', sec:3,
    title:'your first session is ready.',
    help:'kokoro built it from what you shared. it unlocks the moment you start — inside the app.',
    cardTitle:'when you keep saying you’re fine',
    metaLen:'a guided sit',
    locked:'plays in the app once you begin' },

  /* ---------- section 4 · begin ---------- */
  { id:'email', type:'email', sec:4,
    q:'where should kokoro send your session?',
    help:'your first session and 7-day plan are ready. don’t lose them.' },

  { id:'sevenday', type:'beforeafter', sec:4,
    eyebrow:'what we build toward',
    title:'where this goes, if you stay with it',
    now:['head won’t switch off','bracing before the day','tired but wired'],
    after:['a way to put it down','steadier mornings','actually asleep'],
    note:'honest version: this is the aim, not a guarantee. it works if you show up.',
    cta:'i want that' },

  { id:'trust', type:'trust', sec:4,
    title:'you’re not doing this alone.',
    stat:'12,000+', statLabel:'rituals built this month',
    rating:'4.9', ratingLabel:'across the app store',
    chips:['came here to sleep','came here to let go','came here for clarity'],
    cta:'keep going' },

  { id:'testi2', type:'testimonial', sec:4,
    name:'maya', age:'29', stars:5,
    quote:'three minutes, before the day starts. it’s the only thing that’s actually stuck.',
    sub:'kept going past day 7.' },

  { id:'commit', type:'commit', sec:4,
    eye:'your commitment',
    title:'say this — and mean it.',
    pledge:'this week, i’m choosing to stop running from how i feel — and to let myself <em>{goal}</em>.',
    by:'— my promise to myself',
    done:'you said it. kokoro’s got you now.' },

  /* paywall — no trial, 3 tiers anchored, per-day, countdown, annual hero,
     card logos + "why people stay" reasons + a second CTA (long-scroll) */
  { id:'paywall', type:'paywall', sec:4,
    countdown:600,
    title:'your kokoro plan is ready.',
    sub:'tonight’s session and your 7-day reset are waiting — in your tone, for what you need now.',
    perks:[
      'tonight’s personalized meditation',
      'a 7-day emotional reset plan',
      'daily check-ins from kokoro',
      'sessions that adapt to what you say'
    ],
    plans:[
      {name:'12 months', note:'billed €39.99 / year', anchor:'€79.99', price:'€39.99', perDay:'€0.11 / day', best:true, save:'save 50%', cta:'get my plan'},
      {name:'1 month', note:'billed monthly · cancel anytime', anchor:'€24.99', price:'€14.99', perDay:'€0.50 / day', cta:'get my plan'},
      {name:'1 week', note:'billed weekly · cancel anytime', anchor:'€9.99', price:'€6.99', perDay:'€1.00 / day', cta:'get my plan'}
    ],
    reasons:[
      {k:'made from your words', v:'not a generic library — tonight’s sit is built from what you told kokoro.'},
      {k:'works in 3 minutes', v:'short enough to actually do on the worst days — when you need it most.'},
      {k:'adapts as you go', v:'every check-in reshapes what comes next. it gets more <em>you</em> over time.'},
      {k:'cancel in two taps', v:'no guilt, no hoops. stay because it works — not because you’re stuck.'}
    ]},

  { id:'success', type:'success', sec:4, eyebrow:'welcome in',
    h2:'your first session is unlocked.',
    p:'open the app and kokoro will be waiting — your meditation is already there.' }
];

window.STEPS = STEPS; window.SECTIONS = SECTIONS;

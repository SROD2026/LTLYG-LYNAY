const CATEGORY_DETAILS = {
  safety: {
    categoryTitle: "Safety, protection, and trust",
    definition:
      "These needs help a person feel less threatened, more secure, and more able to remain present, regulated, and grounded.",
    harms: [
      "hypervigilance and mistrust",
      "shutdown or withdrawal",
      "fear-based reactivity",
      "difficulty resting or staying emotionally present",
      "feeling braced, exposed, or unsafe in relationship",
    ],
    healthyWays: [
      "clear communication",
      "predictable follow-through",
      "truthfulness and transparency",
      "gentle tone and non-threatening posture",
      "stable routines and clear expectations",
      "protective boundaries",
    ],
    distortionRisks: [
      "trying to force certainty through control",
      "withdrawing to avoid vulnerability",
      "reading threat into everything",
      "using accusation to regain footing",
      "self-protection that abandons love",
    ],
    scriptures: [
      {
        ref: "Psalm 4:8",
        principle: "God gives a kind of safety that allows a person to lie down and sleep in peace.",
      },
      {
        ref: "Psalm 46:1",
        principle: "God is described as refuge and strength, especially in distress.",
      },
      {
        ref: "Proverbs 18:10",
        principle: "The Lord is pictured as a strong tower into which the righteous run and are safe.",
      },
      {
        ref: "Isaiah 26:3",
        principle: "Steadfast trust in God is tied to peace and inner stability.",
      },
      {
        ref: "Mark 4:39-40",
        principle: "Jesus speaks peace into fear and disorder.",
      },
    ],
    biblicalExamples: [
      "The disciples in the storm needed protection and orientation; Jesus calmed the storm.",
      "David repeatedly names God as refuge, shield, and stronghold in danger.",
      "Israel in the wilderness needed visible guidance, provision, and protection.",
    ],
  },

  truth: {
    categoryTitle: "Truth, clarity, and understanding",
    definition:
      "These needs help reality feel coherent, understandable, and communicable. They support orientation, honesty, and wise action.",
    harms: [
      "confusion and disorientation",
      "distrust and suspicion",
      "misreading motives or situations",
      "anxiety caused by missing context",
      "relationship instability from distortion or omission",
    ],
    healthyWays: [
      "honest answers",
      "stepwise explanations",
      "clear expectations",
      "repairing contradictions quickly",
      "naming observable facts instead of assumptions",
      "shared plans and context",
    ],
    distortionRisks: [
      "demanding certainty instead of clarity",
      "using partial truth to control perception",
      "withholding context",
      "mind-reading instead of asking",
      "confusing emotional certainty with factual certainty",
    ],
    scriptures: [
      {
        ref: "John 8:32",
        principle: "Truth brings freedom rather than bondage and distortion.",
      },
      {
        ref: "Ephesians 4:25",
        principle: "Truthfulness is required because people are members of one another.",
      },
      {
        ref: "Proverbs 12:22",
        principle: "Lying is condemned while faithfulness in truth is commended.",
      },
      {
        ref: "1 Corinthians 14:33",
        principle: "God is not a God of confusion but of peace and order.",
      },
      {
        ref: "Psalm 25:4-5",
        principle: "God is asked to teach, guide, and make his paths known.",
      },
    ],
    biblicalExamples: [
      "Jesus often explained truth plainly to his disciples when they were confused.",
      "Apollos received fuller explanation from Priscilla and Aquila.",
      "The Bereans searched things carefully to understand what was true.",
    ],
  },

  rest: {
    categoryTitle: "Rest, regulation, and pace",
    definition:
      "These needs reduce overload and help the body and mind settle. They support recovery, regulation, and wise pacing.",
    harms: [
      "overwhelm and flooding",
      "irritability and reduced capacity",
      "shutdown, collapse, or numbness",
      "impaired judgment from exhaustion",
      "resentment when pace is repeatedly violated",
    ],
    healthyWays: [
      "slowing the pace",
      "making space for processing",
      "reducing stimulation",
      "allowing breaks without abandonment",
      "rest, sleep, quiet, and recovery time",
      "short clear steps instead of overload",
    ],
    distortionRisks: [
      "using endless delay to avoid responsibility",
      "treating urgency as virtue",
      "ignoring bodily limits",
      "mistaking collapse for peace",
      "withholding presence under the name of needing space",
    ],
    scriptures: [
      {
        ref: "Matthew 11:28-30",
        principle: "Jesus invites the weary to come to him for rest.",
      },
      {
        ref: "Mark 6:31",
        principle: "Jesus tells his disciples to come away and rest because they are overextended.",
      },
      {
        ref: "Psalm 23:2-3",
        principle: "God leads into rest and restores the soul.",
      },
      {
        ref: "Ecclesiastes 3:1",
        principle: "There is a time and season for different things; pace matters.",
      },
      {
        ref: "Exodus 20:8-10",
        principle: "Rest is built into God’s ordering of life.",
      },
    ],
    biblicalExamples: [
      "Jesus repeatedly withdrew from crowds for prayer and restoration.",
      "Elijah needed sleep, food, and quiet before further correction.",
      "Creation itself includes rhythm, limit, and sabbath rest.",
    ],
  },

  connection: {
    categoryTitle: "Care, belonging, and relational dignity",
    definition:
      "These needs support closeness, mutuality, warmth, respect, acknowledgment, and loving relational presence.",
    harms: [
      "loneliness and alienation",
      "feeling unseen or unheard",
      "hurt from disrespect or dismissal",
      "shame, grief, or relational insecurity",
      "fraying trust and emotional distance",
    ],
    healthyWays: [
      "attentive listening",
      "gentle tone and acknowledgment",
      "respectful correction",
      "consistent presence",
      "warmth, encouragement, and consideration",
      "repair after harm",
    ],
    distortionRisks: [
      "trying to extract closeness through pressure",
      "people-pleasing instead of truthful love",
      "fusion without boundaries",
      "resentment when care is demanded rather than given freely",
      "using guilt to secure belonging",
    ],
    scriptures: [
      {
        ref: "Romans 12:10",
        principle: "Believers are called to brotherly affection and honor toward one another.",
      },
      {
        ref: "Galatians 6:2",
        principle: "People are called to bear one another’s burdens.",
      },
      {
        ref: "1 Thessalonians 5:11",
        principle: "Encouragement and building one another up are commanded.",
      },
      {
        ref: "Philippians 2:3-4",
        principle: "Humility includes looking to the interests of others.",
      },
      {
        ref: "Colossians 3:12-14",
        principle: "Compassion, kindness, patience, and love bind people together.",
      },
    ],
    biblicalExamples: [
      "Jesus sees, hears, and responds to people personally and compassionately.",
      "The early church shared burdens and practical care together.",
      "Jonathan strengthened David in God during distress.",
    ],
  },

  agency: {
    categoryTitle: "Agency, freedom, and boundaries",
    definition:
      "These needs support responsible choice, consent, autonomy, and dignified participation rather than coercion or domination.",
    harms: [
      "feeling trapped, overridden, or coerced",
      "resentment and helplessness",
      "loss of voice or participation",
      "boundary confusion",
      "shame from not being allowed responsible selfhood",
    ],
    healthyWays: [
      "offering real choices",
      "respecting consent and limits",
      "allowing time to decide",
      "supporting growth without force",
      "clear boundaries",
      "encouraging responsible ownership",
    ],
    distortionRisks: [
      "equating autonomy with isolation",
      "rebelling against all structure",
      "controlling others to preserve one’s own agency",
      "using freedom language to avoid accountability",
      "collapsing boundaries in the name of closeness",
    ],
    scriptures: [
      {
        ref: "Galatians 5:13",
        principle: "Freedom is given for loving service, not self-indulgence or domination.",
      },
      {
        ref: "2 Corinthians 3:17",
        principle: "Where the Spirit of the Lord is, there is freedom.",
      },
      {
        ref: "Joshua 24:15",
        principle: "People are called to choose whom they will serve.",
      },
      {
        ref: "Philemon 1:14",
        principle: "Paul explicitly avoids forcing goodness and wants it to be voluntary.",
      },
      {
        ref: "Matthew 20:25-28",
        principle: "God’s pattern rejects domineering leadership.",
      },
    ],
    biblicalExamples: [
      "Paul refused to coerce Philemon and appealed rather than forced.",
      "Jesus invited disciples to follow him rather than manipulating them.",
      "God repeatedly sets life and death before people and calls them to choose.",
    ],
  },

  embodied: {
    categoryTitle: "Embodied and practical needs",
    definition:
      "These needs recognize that people are finite, bodily creatures who require practical care, nourishment, movement, and stewardship.",
    harms: [
      "fatigue and dysregulation",
      "reduced resilience and patience",
      "physical depletion affecting emotional stability",
      "feeling neglected at a basic level",
      "difficulty thinking clearly or relating well",
    ],
    healthyWays: [
      "food and water",
      "sleep and medical care",
      "movement and fresh air",
      "practical help",
      "space for play and restoration",
      "honoring bodily limitation instead of despising it",
    ],
    distortionRisks: [
      "treating the body like a machine",
      "neglecting stewardship",
      "using bodily weakness as total excuse for sin",
      "comfort-seeking without discipline",
      "spiritualizing away practical needs",
    ],
    scriptures: [
      {
        ref: "1 Kings 19:5-8",
        principle: "Elijah is given sleep and food before further instruction.",
      },
      {
        ref: "Matthew 6:11",
        principle: "Daily bread is a legitimate need to ask God for.",
      },
      {
        ref: "1 Corinthians 6:19-20",
        principle: "The body matters because it belongs to God.",
      },
      {
        ref: "Mark 2:27",
        principle: "God’s commands are not meant to crush human creatureliness.",
      },
      {
        ref: "Psalm 127:2",
        principle: "Rest and provision are gifts from God, not merely achievements.",
      },
    ],
    biblicalExamples: [
      "Elijah’s restoration included sleep, food, and quiet.",
      "Jesus fed hungry crowds rather than treating physical need as irrelevant.",
      "God provided manna and water in the wilderness.",
    ],
  },
};

const NEED_OVERRIDES = {
  Safety: {
    definition:
      "Safety is the need to feel protected from harm, threat, chaos, or instability so you can remain present and grounded.",
  },
  Protection: {
    definition:
      "Protection is the need for shelter, defense, or covering when harm, threat, or vulnerability is present.",
  },
  Trust: {
    definition:
      "Trust is the need to be able to rely on someone’s honesty, consistency, and good intent without bracing for betrayal.",
  },
  Predictability: {
    definition:
      "Predictability is the need for enough consistency and orientation to know what is happening and what to expect.",
  },
  Stability: {
    definition:
      "Stability is the need for steadiness over time so that life and relationship do not feel constantly shaky or volatile.",
  },
  Reliability: {
    definition:
      "Reliability is the need for follow-through that makes words, plans, and care dependable.",
  },
  Consistency: {
    definition:
      "Consistency is the need for responses, values, and follow-through that do not shift unpredictably.",
  },
  Peace: {
    definition:
      "Peace is the need for reduced conflict, inward settledness, and freedom from ongoing threat or turbulence.",
  },
  Calm: {
    definition:
      "Calm is the need for deactivation of distress so that body and mind can settle.",
  },
  Reassurance: {
    definition:
      "Reassurance is the need for steadying words or presence that reduce confusion, fear, or relational uncertainty.",
  },
  Privacy: {
    definition:
      "Privacy is the need for protected space, boundaries, and selective sharing without intrusion.",
  },

  Truthfulness: {
    definition:
      "Truthfulness is the need for what is said to match reality, without deception, half-truth, or distortion.",
  },
  Transparency: {
    definition:
      "Transparency is the need for relevant truth and openness rather than concealment that destabilizes trust.",
  },
  Honesty: {
    definition:
      "Honesty is the need for plain dealing that tells the truth without manipulation or hiding.",
  },
  Clarity: {
    definition:
      "Clarity is the need for understandable explanation, structure, and plain communication.",
  },
  Context: {
    definition:
      "Context is the need for surrounding information so facts can be interpreted accurately.",
  },
  Understanding: {
    definition:
      "Understanding is the need to make sense of what is happening and to be accurately understood by others.",
  },
  Information: {
    definition:
      "Information is the need for enough facts to orient, decide, and respond wisely.",
  },
  Guidance: {
    definition:
      "Guidance is the need for direction when you do not yet know the next wise step.",
  },
  Accountability: {
    definition:
      "Accountability is the need for truth-telling, ownership, and repair when harm or failure has occurred.",
  },
  Integrity: {
    definition:
      "Integrity is the need for inward and outward alignment, where words, values, and actions match.",
  },
  Repair: {
    definition:
      "Repair is the need for relational mending after harm through truth, empathy, ownership, and changed action.",
  },
  Fairness: {
    definition:
      "Fairness is the need for just treatment and proportion rather than bias, distortion, or one-sidedness.",
  },
  Equity: {
    definition:
      "Equity is the need for fitting care, justice, and balance appropriate to the real situation.",
  },

  "Preparation Time": {
    definition:
      "Preparation time is the need for advance notice so your mind and body can orient before action or transition.",
  },
  "Processing Time": {
    definition:
      "Processing time is the need for time to think, feel, organize, and respond rather than being rushed past capacity.",
  },
  Time: {
    definition:
      "Time is the need for enough room to do what is required without panic, crowding, or force.",
  },
  Pace: {
    definition:
      "Pace is the need for a speed that matches actual human capacity rather than overload.",
  },
  "Control over pace": {
    definition:
      "Control over pace is the need to participate in how quickly something happens rather than being dragged by urgency.",
  },
  Space: {
    definition:
      "Space is the need for room to breathe, think, feel, or recover without crowding or pressure.",
  },
  Stillness: {
    definition:
      "Stillness is the need for quiet and non-demanding space so regulation can return.",
  },
  Simplicity: {
    definition:
      "Simplicity is the need for reduced complexity when overload or confusion is high.",
  },
  "Reduced Stimulation": {
    definition:
      "Reduced stimulation is the need for less sensory or cognitive input so the system can settle.",
  },
  "Rest / Sleep": {
    definition:
      "Rest and sleep are the need for bodily restoration and recovery from fatigue.",
  },
  Recovery: {
    definition:
      "Recovery is the need for repair after depletion, strain, illness, or overwhelm.",
  },
  Ease: {
    definition:
      "Ease is the need for reduced strain so that life does not feel constantly effortful or braced.",
  },
  Relief: {
    definition:
      "Relief is the need for burden, pain, pressure, or strain to lessen.",
  },
  Comfort: {
    definition:
      "Comfort is the need for soothing, support, warmth, and reduced distress.",
  },
  Warmth: {
    definition:
      "Warmth is the need for literal or relational gentleness, tenderness, and reassuring care.",
  },

  Respect: {
    definition:
      "Respect is the need to have dignity, limits, personhood, and seriousness honored.",
  },
  Care: {
    definition:
      "Care is the need for loving attention expressed in practical and relational ways.",
  },
  Support: {
    definition:
      "Support is the need not to carry everything alone when help is appropriate.",
  },
  Encouragement: {
    definition:
      "Encouragement is the need for strengthening words that help courage, hope, or endurance return.",
  },
  Hope: {
    definition:
      "Hope is the need for a believable sense that good, help, or movement is still possible.",
  },
  Acceptance: {
    definition:
      "Acceptance is the need to be received as a person without contempt or rejection.",
  },
  Gentleness: {
    definition:
      "Gentleness is the need for non-harsh handling in words, tone, pace, and posture.",
  },
  Dignity: {
    definition:
      "Dignity is the need to be treated as fully human, worthy of honor, not contempt.",
  },
  Belonging: {
    definition:
      "Belonging is the need to be included, held in relationship, and not cast outside.",
  },
  Connection: {
    definition:
      "Connection is the need for meaningful relational contact rather than isolation or cold distance.",
  },
  "Being Seen": {
    definition:
      "Being seen is the need for your reality, effort, pain, or presence to be genuinely noticed.",
  },
  "Being Heard": {
    definition:
      "Being heard is the need for what you say to be received, understood, and not erased.",
  },
  Acknowledgment: {
    definition:
      "Acknowledgment is the need for reality to be named honestly rather than ignored or denied.",
  },
  Consideration: {
    definition:
      "Consideration is the need for your limits, needs, and context to be taken into account.",
  },
  Appreciation: {
    definition:
      "Appreciation is the need for good, effort, gift, or care to be recognized with gratitude.",
  },
  Reciprocity: {
    definition:
      "Reciprocity is the need for mutuality rather than one-sided taking or carrying.",
  },
  "Closeness / Intimacy": {
    definition:
      "Closeness and intimacy are the need for safe nearness, warmth, and meaningful relational sharing.",
  },
  Harmony: {
    definition:
      "Harmony is the need for relational fittingness, reduced friction, and peaceful coordination.",
  },
  Cooperation: {
    definition:
      "Cooperation is the need for working together rather than against one another.",
  },
  Forgiveness: {
    definition:
      "Forgiveness is the need for mercy and release after wrong, without denying truth or bypassing repair.",
  },

  Agency: {
    definition:
      "Agency is the need to act, choose, and participate responsibly rather than being overridden.",
  },
  Autonomy: {
    definition:
      "Autonomy is the need for appropriate self-direction under God rather than coercive control by others.",
  },
  Choice: {
    definition:
      "Choice is the need for real options rather than being cornered into compliance.",
  },
  Freedom: {
    definition:
      "Freedom is the need for non-coerced, responsible movement and participation.",
  },
  "Space to Decide": {
    definition:
      "Space to decide is the need for time and room to choose without pressure.",
  },
  "Boundaries / Consent": {
    definition:
      "Boundaries and consent are the need for limits to be respected and participation to remain voluntary.",
  },
  "Permission to be new": {
    definition:
      "Permission to be new is the need to grow beyond old failures without being frozen in a former identity.",
  },
  Learning: {
    definition:
      "Learning is the need to grow in understanding and skill without being shamed for not yet knowing.",
  },
  Growth: {
    definition:
      "Growth is the need to mature, change, and move forward rather than remain stuck.",
  },
  "Self-Compassion": {
    definition:
      "Self-compassion is the need to respond to weakness or failure without cruelty while still telling the truth.",
  },
  "Meaning / Purpose": {
    definition:
      "Meaning and purpose are the need for life and action to connect to something weighty, true, and worthwhile.",
  },
  Progress: {
    definition:
      "Progress is the need to see real movement rather than endless stagnation.",
  },

  "Movement / Exercise": {
    definition:
      "Movement and exercise are the need for bodily engagement, circulation, strength, and embodied release.",
  },
  Food: {
    definition:
      "Food is the need for nourishment and strength.",
  },
  Water: {
    definition:
      "Water is the need for hydration and physical sustaining care.",
  },
  Air: {
    definition:
      "Air is the need for breath, space, and the most basic bodily support.",
  },
  Health: {
    definition:
      "Health is the need for bodily stewardship, care, and support for functioning.",
  },
  Play: {
    definition:
      "Play is the need for delight, non-productive enjoyment, and restoring lightness.",
  },
};

const NEED_TO_CATEGORY = {
  Safety: "safety",
  Protection: "safety",
  Trust: "safety",
  Predictability: "safety",
  Stability: "safety",
  Reliability: "safety",
  Consistency: "safety",
  Peace: "safety",
  Calm: "safety",
  Reassurance: "safety",
  Privacy: "safety",

  Truthfulness: "truth",
  Transparency: "truth",
  Honesty: "truth",
  Clarity: "truth",
  Context: "truth",
  Understanding: "truth",
  Information: "truth",
  Orientation: "truth",
  Guidance: "truth",
  "Stepwise explanation": "truth",
  "Stepwise plan": "truth",
  "Shared Expectations": "truth",
  Order: "truth",
  Coordination: "truth",
  Accountability: "truth",
  Integrity: "truth",
  Repair: "truth",
  Fairness: "truth",
  Equity: "truth",

  "Preparation Time": "rest",
  "Processing Time": "rest",
  Time: "rest",
  Pace: "rest",
  "Control over pace": "rest",
  Space: "rest",
  Stillness: "rest",
  Simplicity: "rest",
  "Reduced Stimulation": "rest",
  "Rest / Sleep": "rest",
  Recovery: "rest",
  Ease: "rest",
  Relief: "rest",
  Comfort: "rest",
  Warmth: "rest",

  Respect: "connection",
  Care: "connection",
  Support: "connection",
  Encouragement: "connection",
  Hope: "connection",
  Acceptance: "connection",
  Gentleness: "connection",
  Dignity: "connection",
  Belonging: "connection",
  Connection: "connection",
  "Being Seen": "connection",
  "Being Heard": "connection",
  Acknowledgment: "connection",
  Consideration: "connection",
  Appreciation: "connection",
  Reciprocity: "connection",
  "Closeness / Intimacy": "connection",
  Harmony: "connection",
  Cooperation: "connection",
  Forgiveness: "connection",

  Agency: "agency",
  Autonomy: "agency",
  Choice: "agency",
  Freedom: "agency",
  "Space to Decide": "agency",
  "Boundaries / Consent": "agency",
  "Permission to be new": "agency",
  Learning: "agency",
  Growth: "agency",
  "Self-Compassion": "agency",
  "Meaning / Purpose": "agency",
  Progress: "agency",

  "Movement / Exercise": "embodied",
  Food: "embodied",
  Water: "embodied",
  Air: "embodied",
  Health: "embodied",
  Play: "embodied",
};

export function getNeedDetail(needName) {
  const name = String(needName || "").trim();
  const categoryKey = NEED_TO_CATEGORY[name];
  const category = CATEGORY_DETAILS[categoryKey] || null;
  const override = NEED_OVERRIDES[name] || {};

  if (!category) {
    return {
      title: name,
      categoryTitle: "Need",
      definition: `${name} is a real human need that can be named honestly and pursued responsibly before God.`,
      harms: [
        "frustration or distress when the need is repeatedly unmet",
        "reduced stability and capacity",
      ],
      healthyWays: [
        "name the need clearly",
        "seek it truthfully and responsibly",
        "avoid coercive or manipulative strategies",
      ],
      distortionRisks: [
        "trying to force fulfillment through control",
        "confusing need with entitlement",
      ],
      scriptures: [],
      biblicalExamples: [],
    };
  }

  return {
    title: name,
    categoryKey,
    categoryTitle: category.categoryTitle,
    definition:
      override.definition ||
      `${name} belongs to the category of ${category.categoryTitle.toLowerCase()} and helps a person love, function, and remain grounded.`,
    harms: category.harms,
    healthyWays: category.healthyWays,
    distortionRisks: category.distortionRisks,
    scriptures: category.scriptures,
    biblicalExamples: category.biblicalExamples,
  };
}
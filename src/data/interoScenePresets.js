// src/data/interoScenePresets.js

function normalizeEmotionKey(emotion) {
  return String(emotion || "").trim().toLowerCase();
}

export const INTERO_SCENE_LIBRARY = {
  
  sad_rain_sit_1: {
    pose: "sit_slump",
    backdrop: "rain",
    mood: "sad",
    label: "Sad in the rain",
  },
  sad_garden_rock_1: {
    pose: "sit_slump",
    backdrop: "garden_rock",
    mood: "sad",
    label: "Sad on a garden rock",
  },
  sad_tree_reflect_1: {
    pose: "sit_reflective",
    backdrop: "tree",
    mood: "sad",
    label: "Sad under a tree",
  },
  sad_bench_1: {
    pose: "sit_reflective",
    backdrop: "bench",
    mood: "sad",
    label: "Sad on a bench",
  },

  anxious_stand_wind_1: {
    pose: "stand_hunch",
    backdrop: "wind",
    mood: "anxious",
    label: "Anxious in the wind",
  },
  anxious_rain_1: {
    pose: "stand_hunch",
    backdrop: "rain",
    mood: "anxious",
    label: "Anxious in the rain",
  },
  anxious_head_hands_1: {
    pose: "head_in_hands",
    backdrop: "wind",
    mood: "anxious",
    label: "Anxious and overloaded",
  },
  anxious_path_1: {
    pose: "stand_hunch",
    backdrop: "path",
    mood: "anxious",
    label: "Anxious on a path",
  },

  overwhelmed_crouch_storm_1: {
    pose: "crouch",
    backdrop: "storm",
    mood: "overwhelmed",
    label: "Overwhelmed in a storm",
  },
  overwhelmed_head_hands_1: {
    pose: "head_in_hands",
    backdrop: "storm",
    mood: "overwhelmed",
    label: "Overwhelmed and compressed",
  },
  overwhelmed_sit_low_1: {
    pose: "sit_slump",
    backdrop: "night",
    mood: "overwhelmed",
    label: "Overwhelmed and withdrawn",
  },

  peaceful_garden_1: {
    pose: "stand_open",
    backdrop: "garden",
    mood: "peaceful",
    label: "Peaceful in a garden",
  },
  calm_garden_1: {
    pose: "sit_reflective",
    backdrop: "garden",
    mood: "calm",
    label: "Calm in a garden",
  },
  peaceful_tree_1: {
    pose: "hands_open",
    backdrop: "tree",
    mood: "peaceful",
    label: "Peaceful under a tree",
  },

  hopeful_sunrise_1: {
    pose: "stand_open",
    backdrop: "sunrise",
    mood: "hopeful",
    label: "Hopeful at sunrise",
  },
  hopeful_hands_open_1: {
    pose: "hands_open",
    backdrop: "sunrise",
    mood: "hopeful",
    label: "Hopeful with open hands",
  },

  prayer_kneel_garden_1: {
    pose: "kneel_prayer",
    backdrop: "garden",
    mood: "prayer",
    label: "Kneeling in a garden",
  },
 prayer_kneel_sunrise_1: {
    pose: "hands_open",
    backdrop: "sunrise",
    mood: "prayer",
    label: "Prayer with open hands at sunrise",
  },
    prayer_kneel_bowed_1: {
    pose: "kneel_bowed",
    backdrop: "garden",
    mood: "prayer",
    label: "Kneeling with head bowed",
  },
prayer_one_knee_1: {
    pose: "one_knee_prayer",
    backdrop: "path",
    mood: "prayer",
    label: "Prayer on one knee along the path",
  },
  prayer_sit_reflective_1: {
    pose: "sit_reflective",
    backdrop: "night",
    mood: "prayer",
    label: "Reflective seated prayer at night",
  },
    violent_accused_stand_1: {
    pose: "stand_hunch",
    backdrop: "spotlight",
    mood: "violent",
    label: "Accused and exposed",
  },
  violent_cornered_1: {
    pose: "crouch",
    backdrop: "corner",
    mood: "violent",
    label: "Cornered and trapped",
  },
  violent_judged_1: {
    pose: "stand_hunch",
    backdrop: "court",
    mood: "violent",
    label: "Judged under pressure",
  },
  violent_shame_folded_1: {
    pose: "head_in_hands",
    backdrop: "spotlight",
    mood: "violent",
    label: "Shamed and folded inward",
  },
  violent_shrug_away_1: {
    pose: "stand_hunch",
    backdrop: "distance",
    mood: "violent",
    label: "Dismissed and pushed away",
  },
  violent_back_turned_1: {
    pose: "sit_reflective",
    backdrop: "wall",
    mood: "violent",
    label: "Turned away and shut out",
  },
  violent_confused_spotlight_1: {
    pose: "head_in_hands",
    backdrop: "fog_spotlight",
    mood: "violent",
    label: "Confused and exposed",
  },
  violent_pulled_strings_1: {
    pose: "stand_hunch",
    backdrop: "strings",
    mood: "violent",
    label: "Manipulated and pulled",
  },
  violent_alone_night_1: {
    pose: "sit_slump",
    backdrop: "night",
    mood: "violent",
    label: "Alone at night",
  },
  violent_sit_slump_rain_1: {
    pose: "sit_slump",
    backdrop: "rain",
    mood: "violent",
    label: "Rejected in the rain",
  },
  violent_head_hands_1: {
    pose: "head_in_hands",
    backdrop: "storm",
    mood: "violent",
    label: "Unsafe and overwhelmed",
  },
};

export const INTERO_SCENE_BY_EMOTION = {
    frustrated: [
    "anxious_stand_wind_1",
    "overwhelmed_head_hands_1",
    "anxious_path_1",
  ],
  agitated: [
    "anxious_stand_wind_1",
    "anxious_head_hands_1",
  ],
  tense: [
    "anxious_stand_wind_1",
    "anxious_path_1",
  ],
  
  uncertain: [
    "anxious_path_1",
    "anxious_stand_wind_1",
  ],
  embarrassed: [
    "sad_tree_reflect_1",
    "anxious_head_hands_1",
  ],
  ashamed: [
    "sad_tree_reflect_1",
    "sad_bench_1",
  ],
  hurt: [
    "sad_rain_sit_1",
    "sad_tree_reflect_1",
  ],
  lonely: [
    "sad_bench_1",
    "sad_tree_reflect_1",
    "sad_rain_sit_1",
  ],
  discouraged: [
    "sad_garden_rock_1",
    "sad_tree_reflect_1",
  ],
  restful: [
    "calm_garden_1",
    "peaceful_tree_1",
  ],
  comforted: [
    "calm_garden_1",
    "peaceful_tree_1",
  ],
  supported: [
    "calm_garden_1",
    "peaceful_garden_1",
  ],
  secure: [
    "peaceful_garden_1",
    "peaceful_tree_1",
  ],
  
    sad: [
    "sad_rain_sit_1",
    "sad_garden_rock_1",
    "sad_tree_reflect_1",
    "sad_bench_1",
  ],
  lonely: [
    "sad_rain_sit_1",
    "sad_bench_1",
    "sad_tree_reflect_1",
  ],
  discouraged: [
    "sad_garden_rock_1",
    "sad_tree_reflect_1",
  ],

  overwhelmed: [
    "overwhelmed_crouch_storm_1",
    "overwhelmed_head_hands_1",
    "overwhelmed_sit_low_1",
  ],

  peaceful: [
    "peaceful_garden_1",
    "calm_garden_1",
    "peaceful_tree_1",
  ],
  calm: [
    "calm_garden_1",
    "peaceful_garden_1",
  ],
  hopeful: [
    "hopeful_sunrise_1",
    "hopeful_hands_open_1",
  ],
  trusting: [
    "hopeful_sunrise_1",
    "hopeful_hands_open_1",
  ],
  comforted: [
    "calm_garden_1",
    "peaceful_tree_1",
  ],
  grounded: [
    "calm_garden_1",
    "peaceful_tree_1",
  ],

  grateful: [
    "peaceful_garden_1",
    "hopeful_sunrise_1",
    "calm_garden_1",
  ],
  thankful: [
    "peaceful_garden_1",
    "calm_garden_1",
  ],
  appreciative: [
    "peaceful_garden_1",
  ],
  joyful: [
    "hopeful_sunrise_1",
    "hopeful_hands_open_1",
  ],
};

export function getSceneIdsForEmotion(emotion, mode = "nvc") {
  const key = normalizeEmotionKey(emotion);

  const prayerEmotionMap = {
    anxious: ["prayer_kneel_bowed_1", "prayer_kneel_garden_1"],
    overwhelmed: ["prayer_kneel_bowed_1", "prayer_sit_reflective_1"],
    afraid: ["prayer_kneel_bowed_1", "prayer_one_knee_1"],
    angry: ["prayer_one_knee_1", "prayer_kneel_bowed_1"],
    hurt: ["prayer_sit_reflective_1", "prayer_kneel_bowed_1"],
    resentful: ["prayer_one_knee_1", "prayer_kneel_bowed_1"],
    frustrated: ["prayer_one_knee_1", "prayer_kneel_garden_1"],
    sad: ["prayer_kneel_bowed_1", "prayer_sit_reflective_1"],
    lonely: ["prayer_sit_reflective_1", "prayer_kneel_garden_1"],
    ashamed: ["prayer_kneel_bowed_1", "prayer_kneel_garden_1"],
    tired: ["prayer_sit_reflective_1", "prayer_kneel_garden_1"],
    burdened: ["prayer_kneel_bowed_1", "prayer_one_knee_1"],
    supported: ["prayer_kneel_garden_1", "prayer_one_knee_1"],
    loved: ["prayer_kneel_garden_1", "prayer_kneel_sunrise_1"],
    peaceful: ["prayer_kneel_sunrise_1", "prayer_kneel_garden_1"],
    forgiven: ["prayer_kneel_sunrise_1", "prayer_kneel_garden_1"],
    calm: ["prayer_kneel_garden_1", "prayer_sit_reflective_1"],
    grounded: ["prayer_sit_reflective_1", "prayer_kneel_garden_1"],
  };

  const violentEmotionMap = {
    shamed: ["violent_shame_folded_1", "violent_judged_1"],
    condemned: ["violent_judged_1", "violent_cornered_1"],
  judged: ["violent_judged_1", "violent_shame_folded_1"],
    manipulated: ["violent_pulled_strings_1", "violent_cornered_1"],
    pressured: ["violent_pulled_strings_1", "violent_head_hands_1"],
    coerced: ["violent_cornered_1", "violent_pulled_strings_1"],

    dismissed: ["violent_shrug_away_1", "violent_back_turned_1"],
    invalidated: ["violent_shrug_away_1", "violent_back_turned_1"],
    misrepresented: ["violent_confused_spotlight_1", "violent_shrug_away_1"],
    mocked: ["violent_shame_folded_1", "violent_shrug_away_1"],
    ignored: ["violent_back_turned_1", "violent_shrug_away_1"],
    stonewalled: ["violent_back_turned_1", "violent_alone_night_1"],
    unheard_by_you: ["violent_shrug_away_1", "violent_back_turned_1"],

    lied_to: ["violent_confused_spotlight_1", "violent_alone_night_1"],
    betrayed: ["violent_alone_night_1", "violent_sit_slump_rain_1"],
    used: ["violent_pulled_strings_1", "violent_alone_night_1"],
    deceived: ["violent_confused_spotlight_1", "violent_alone_night_1"],
    misled: ["violent_confused_spotlight_1", "violent_alone_night_1"],
    undermined: ["violent_alone_night_1", "violent_head_hands_1"],
    sabotaged: ["violent_alone_night_1", "violent_head_hands_1"],

    abandoned: ["violent_alone_night_1", "violent_sit_slump_rain_1"],
    discarded: ["violent_alone_night_1", "violent_sit_slump_rain_1"],
    cast_aside: ["violent_alone_night_1", "violent_sit_slump_rain_1"],
    left_behind: ["violent_alone_night_1", "violent_sit_slump_rain_1"],
    unwanted: ["violent_shame_folded_1", "violent_alone_night_1"],
    excluded: ["violent_back_turned_1", "violent_alone_night_1"],
    cut_off: ["violent_back_turned_1", "violent_alone_night_1"],
  };

  if (mode === "prayer") {
    return prayerEmotionMap[key] || [
      "prayer_kneel_garden_1",
      "prayer_kneel_sunrise_1",
      "prayer_kneel_bowed_1",
      "prayer_one_knee_1",
      "prayer_sit_reflective_1",
    ];
  }

  if (mode === "violent") {
    return violentEmotionMap[key] || [
      "violent_accused_stand_1",
      "violent_cornered_1",
      "violent_shrug_away_1",
      "violent_alone_night_1",
      "violent_head_hands_1",
    ];
  }

  if (mode === "checkin") {
    return INTERO_SCENE_BY_EMOTION[key] || [
      "peaceful_garden_1",
      "calm_garden_1",
      "hopeful_sunrise_1",
    ];
  }

  return INTERO_SCENE_BY_EMOTION[key] || [
    "sad_rain_sit_1",
    "anxious_stand_wind_1",
    "overwhelmed_crouch_storm_1",
    "peaceful_garden_1",
    "hopeful_sunrise_1",
  ];
}
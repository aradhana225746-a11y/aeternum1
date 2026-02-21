/**
 * analyzeResponses.js
 * ────────────────────────────────────────────────────────
 * Simulated backend analysis for AETERNUM.
 * Produces a risk category, problem report, and daily plan
 * based on survey data. 100% client-side / no real AI.
 * ────────────────────────────────────────────────────────
 */

/* ── helpers ─────────────────────────────────────────── */
const avg = (...nums) => nums.reduce((a, b) => a + b, 0) / nums.length;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* ── risk scoring ────────────────────────────────────── */
function scorePeriod(d) {
  let score = 0;

  // Cycle irregularity
  if (d.cycleRegularity === 'irregular') score += 3;
  if (d.cycleRegularity === 'very_irregular') score += 5;

  // Cycle length extremes
  const cl = Number(d.cycleLength) || 28;
  if (cl < 21 || cl > 35) score += 3;

  // Pain
  const pain = Number(d.painScale) || 0;
  if (pain >= 7) score += 3;
  else if (pain >= 5) score += 1;

  // Flow
  if (d.flowIntensity === 'heavy') score += 2;
  if (d.flowIntensity === 'very_heavy') score += 4;

  // Clots
  if (d.largeClots === 'yes') score += 2;

  // PMS count
  const pmsCount = (d.pmsSymptoms || []).length;
  if (pmsCount >= 4) score += 2;
  else if (pmsCount >= 2) score += 1;

  // PCOS indicators
  if (d.weightGain === 'yes') score += 2;
  if (d.hairThinning === 'yes') score += 2;
  if (d.excessFacialHair === 'yes') score += 2;
  if (d.darkPatches === 'yes') score += 2;
  if (d.familyPCOS === 'yes') score += 2;
  if (d.thyroidHistory === 'yes') score += 2;
  if (d.extremeFatigue === 'yes') score += 1;
  if (d.missedCycles === 'yes') score += 3;

  return score;
}

function scoreAnemia(d) {
  let score = 0;

  const fatigue = Number(d.fatigueLevel) || 0;
  if (fatigue >= 7) score += 3;
  else if (fatigue >= 5) score += 1;

  if (d.dizziness === 'yes') score += 2;
  if (d.paleSkin === 'yes') score += 2;
  if (d.shortnessOfBreath === 'yes') score += 2;
  if (d.brittleNails === 'yes') score += 2;
  if (d.headaches === 'yes') score += 1;
  if (d.coldHands === 'yes') score += 1;
  if (d.heavyBleeding === 'yes') score += 3;

  // Diet
  if (d.ironFoodFreq === 'rarely') score += 3;
  else if (d.ironFoodFreq === 'sometimes') score += 1;

  if (d.greenVegIntake === 'rarely') score += 2;
  if (d.vitaminCIntake === 'rarely') score += 1;
  if (d.teaCoffeeAfterMeals === 'yes') score += 2;

  if (d.ironDeficiencyHistory === 'yes') score += 3;

  // Hemoglobin
  const hb = Number(d.hemoglobinLevel) || 0;
  if (hb > 0 && hb < 12) score += 4;

  return score;
}

function getRiskCategory(score) {
  if (score >= 15) return 'high';
  if (score >= 8) return 'moderate';
  return 'low';
}

/* ── report generation ───────────────────────────────── */
function buildPeriodReport(d, risk) {
  const factors = [];
  const cl = Number(d.cycleLength) || 28;

  if (d.cycleRegularity === 'irregular' || d.cycleRegularity === 'very_irregular')
    factors.push('Irregular menstrual cycles');
  if (cl < 21 || cl > 35)
    factors.push(`Cycle length outside the typical 21–35 day range (${cl} days)`);
  if (Number(d.painScale) >= 7)
    factors.push('Notable menstrual discomfort');
  if (d.flowIntensity === 'heavy' || d.flowIntensity === 'very_heavy')
    factors.push('Heavier-than-average flow');
  if (d.largeClots === 'yes')
    factors.push('Presence of large clots');
  if ((d.pmsSymptoms || []).length >= 3)
    factors.push(`Multiple premenstrual symptoms (${(d.pmsSymptoms || []).join(', ')})`);
  if (d.weightGain === 'yes')
    factors.push('Recent unexplained weight change');
  if (d.hairThinning === 'yes' || d.excessFacialHair === 'yes')
    factors.push('Hair-related changes (thinning or excess growth)');
  if (d.darkPatches === 'yes')
    factors.push('Skin changes (dark patches)');
  if (d.familyPCOS === 'yes')
    factors.push('Family history of PCOS');
  if (d.thyroidHistory === 'yes')
    factors.push('Thyroid history noted');
  if (d.missedCycles === 'yes')
    factors.push('Missed cycles in recent months');

  const summaries = {
    low: 'Your responses suggest a generally healthy menstrual pattern. A few areas could benefit from mindful lifestyle adjustments to keep things balanced.',
    moderate: 'Some patterns in your responses suggest areas worth paying attention to. These are common and manageable — small daily changes can make a meaningful difference.',
    high: 'Your responses indicate several patterns that would benefit from professional guidance. We encourage you to share these findings with a healthcare provider. In the meantime, the lifestyle plan below can support your well-being.',
  };

  const lifestyleLinks = [];
  const sleepQ = Number(d.sleepQuality) || 5;
  const stress = Number(d.stressLevel) || 5;
  if (sleepQ <= 5) lifestyleLinks.push('Sleep quality may be affecting hormonal balance');
  if (stress >= 7) lifestyleLinks.push('Elevated stress levels can influence cycle regularity');
  if (d.activityFreq === 'sedentary') lifestyleLinks.push('Increasing physical activity could help regulate cycles');
  if (Number(d.waterIntake) < 6) lifestyleLinks.push('Hydration plays a role in reducing menstrual discomfort');

  return {
    summary: summaries[risk],
    factors,
    lifestyleLinks,
    calm: 'Remember — these are patterns, not diagnoses. Your body is unique, and many of these factors are influenced by daily habits you can gently adjust.',
  };
}

function buildAnemiaReport(d, risk) {
  const factors = [];

  if (Number(d.fatigueLevel) >= 6)
    factors.push('Significant fatigue levels');
  if (d.dizziness === 'yes')
    factors.push('Episodes of dizziness');
  if (d.paleSkin === 'yes')
    factors.push('Paleness noticed');
  if (d.shortnessOfBreath === 'yes')
    factors.push('Shortness of breath');
  if (d.brittleNails === 'yes')
    factors.push('Brittle or spoon-shaped nails');
  if (d.coldHands === 'yes')
    factors.push('Cold extremities');
  if (d.heavyBleeding === 'yes')
    factors.push('Heavy menstrual bleeding (potential iron loss)');
  if (d.ironFoodFreq === 'rarely')
    factors.push('Low intake of iron-rich foods');
  if (d.greenVegIntake === 'rarely')
    factors.push('Low green leafy vegetable consumption');
  if (d.teaCoffeeAfterMeals === 'yes')
    factors.push('Tea/coffee after meals may reduce iron absorption');
  if (d.ironDeficiencyHistory === 'yes')
    factors.push('Previous history of iron deficiency');
  const hb = Number(d.hemoglobinLevel) || 0;
  if (hb > 0 && hb < 12)
    factors.push(`Hemoglobin level below typical range (${hb} g/dL)`);

  const summaries = {
    low: 'Your nutrition and energy indicators look fairly balanced. A few small tweaks to your diet could further support your iron levels and overall vitality.',
    moderate: 'Some patterns suggest your body may need more nutritional support, particularly around iron and related nutrients. Simple dietary changes can help.',
    high: 'Several indicators suggest possible nutritional concerns that deserve professional evaluation. A simple blood test can provide clarity. Meanwhile, the plan below focuses on nourishing your body.',
  };

  const lifestyleLinks = [];
  if (Number(d.sleepQuality) <= 5) lifestyleLinks.push('Poor sleep can worsen fatigue and mask nutritional issues');
  if (Number(d.stressLevel) >= 7) lifestyleLinks.push('High stress increases nutrient depletion');
  if (d.dietType === 'veg') lifestyleLinks.push('Vegetarian diets need careful planning for adequate iron');
  if (Number(d.waterIntake) < 6) lifestyleLinks.push('Adequate hydration supports nutrient transport');

  return {
    summary: summaries[risk],
    factors,
    lifestyleLinks,
    calm: 'These observations are based on common wellness patterns — not a blood test. For accurate results, a healthcare provider can run simple tests to check your levels.',
  };
}

/* ── daily plan generation ───────────────────────────── */
function buildDailyPlan(d, mode, risk) {
  const stress = Number(d.stressLevel) || 5;
  const sleepQ = Number(d.sleepQuality) || 5;
  const sleepH = Number(d.sleepDuration) || 7;
  const water = Number(d.waterIntake) || 6;
  const isVeg = d.dietType === 'veg';

  if (mode === 'cancer') {
    return {
      morning: {
        label: 'Morning',
        food: 'Start with warm lemon water. Breakfast: antioxidant-rich smoothie (berries, spinach, flaxseed) or oatmeal topped with walnuts and pomegranate seeds.',
        activity: 'A 15–20 minute gentle walk in fresh air. Morning sunlight supports vitamin D, which is linked to cancer-protective effects.',
        hydration: `Stay well hydrated — aim for ${Math.max(8, water + 2)} glasses today. Green tea is a wonderful antioxidant-rich option.`,
        stress: 'A brief body awareness meditation (5 minutes). Practice your monthly breast self-exam in the shower — it only takes 2 minutes.',
      },
      afternoon: {
        label: 'Afternoon',
        food: 'Lunch with leafy greens, cruciferous vegetables (broccoli, cabbage, cauliflower), lean protein. These vegetables contain compounds that support cell health.',
        activity: 'A short 10-minute walk after lunch. Gentle stretching if you\'ve been sitting.',
        hydration: 'Herbal tea or coconut water. Turmeric + black pepper tea has anti-inflammatory benefits.',
        stress: 'Journal for 5 minutes — how does your body feel today? Awareness is the first step to care.',
      },
      evening: {
        label: 'Evening',
        food: 'Snack: fresh fruits (especially citrus for vitamin C), a handful of almonds, or hummus with veggies.',
        activity: 'Moderate exercise — 30 minutes of yoga, walking, or swimming. Regular physical activity reduces cancer risk.',
        hydration: 'A calming cup of chamomile or ginger tea.',
        stress: 'Review your screening schedule. Set a calendar reminder for your next Pap smear and/or mammogram if it\'s due.',
      },
      night: {
        label: 'Night',
        food: 'A light, nourishing dinner — vegetable soup, grilled fish (if non-veg), or khichdi with greens. Avoid processed or charred foods.',
        activity: 'Gentle stretching or legs-up-the-wall pose for 5 minutes.',
        hydration: 'Warm turmeric milk (golden milk) — anti-inflammatory and calming.',
        stress: sleepQ <= 5
          ? 'Sleep ritual: dim lights, no screens 30 min before bed. Rest is when your body repairs. Aim for 7–8 hours.'
          : 'Wind down with a good book or calming music. Rest well — your body heals during sleep.',
        sleep: sleepH < 7
          ? `You're getting ~${sleepH} hours. Try to add 30 minutes — quality sleep is vital for immune function.`
          : 'Your sleep schedule looks healthy. Keep it consistent.',
      },
    };
  }

  const plan = {
    morning: {
      label: 'Morning',
      food: mode === 'anemia'
        ? 'Start with a warm glass of lemon water (vitamin C boosts iron absorption). Breakfast: spinach omelette or poha with peanuts & lemon. Add a handful of dates or raisins.'
        : 'Begin with warm water + honey. Breakfast: overnight oats with flaxseeds, walnuts, and berries. Flaxseeds support hormonal balance.',
      activity: stress >= 7
        ? '10 minutes gentle yoga or stretching. Focus on deep breathing before anything else.'
        : '20–30 minute walk or light exercise. Morning sunlight helps regulate your circadian rhythm.',
      hydration: `Aim for 2 glasses of water before 10 AM. Your target: ${Math.max(8, water + 2)} glasses today.`,
      stress: stress >= 7
        ? 'Try 5 minutes of box breathing (4-4-4-4 count). Set one clear intention for the day.'
        : 'Take a moment of gratitude journaling. Even 3 things can shift your mood for the day.',
    },
    afternoon: {
      label: 'Afternoon',
      food: mode === 'anemia'
        ? 'Lunch: brown rice + dal (lentils) + a vitamin C–rich salad (tomato, capsicum, amla). Add jaggery-based dessert for iron.'
        : 'Lunch: quinoa or rice bowl with vegetables, lean protein. Include cruciferous veggies (broccoli, cauliflower) which support estrogen metabolism.',
      activity: 'Take a 10-minute walk after lunch. Avoid sitting continuously for more than 60 minutes.',
      hydration: 'Sip on coconut water or buttermilk. Avoid sugary drinks.',
      stress: 'If work feels overwhelming, try the 2-minute reset: close eyes, 5 deep breaths, roll shoulders.',
    },
    evening: {
      label: 'Evening',
      food: mode === 'anemia'
        ? 'Snack: roasted chana, a citrus fruit, or trail mix with dried apricots. Avoid tea/coffee for 1 hour around meals.'
        : 'Snack: a small bowl of fruits, handful of almonds, or hummus with carrot sticks. Anti-inflammatory foods help with menstrual comfort.',
      activity: risk === 'high'
        ? 'Light stretching or a gentle 15-minute walk. Listen to your body.'
        : '30 minutes of moderate exercise — dancing, cycling, swimming, or a brisk walk.',
      hydration: 'Herbal tea — chamomile or ginger tea can be soothing.',
      stress: 'Screen-free time for 20 minutes. Try journaling, reading, or a creative hobby.',
    },
    night: {
      label: 'Night',
      food: mode === 'anemia'
        ? 'Dinner: light dal-sabzi-roti plate or a warm soup with leafy greens. A glass of warm turmeric milk before bed.'
        : 'Dinner: light, warm meal — soup, khichdi, or grilled protein with vegetables. Avoid heavy or spicy food close to bedtime.',
      activity: 'Gentle stretching or restorative yoga (Legs Up The Wall pose for 5 minutes).',
      hydration: 'Warm water with a pinch of turmeric. Reduce fluids 1 hour before sleep to sleep uninterrupted.',
      stress: sleepQ <= 5
        ? 'Sleep ritual: dim lights 30 min before bed, no screens, lavender essential oil, deep breathing. Aim for a consistent sleep time.'
        : 'Wind down with calming music or a guided meditation. Consistency in sleep schedule is key.',
      sleep: sleepH < 7
        ? `You're getting ~${sleepH} hours. Aim to add 30 minutes this week. Sleep deeply impacts hormonal health and recovery.`
        : 'Your sleep duration looks good. Focus on sleep quality — dark room, cool temperature, minimal noise.',
    },
  };

  return plan;
}

/* ── cancer awareness analysis ───────────────────────── */
function buildCancerReport(d) {
  const factors = [];

  // Breast
  if (d.breastLumps === 'yes') factors.push('You mentioned noticing a lump or thickening — this is something a doctor should assess');
  if (d.breastDischarge === 'yes') factors.push('Nipple discharge was noted — worth mentioning to your doctor');
  if (d.breastDimpling === 'yes') factors.push('Skin dimpling or puckering noticed — a clinical exam would be reassuring');
  if (d.breastPain === 'yes') factors.push('Persistent breast pain — usually benign, but worth discussing with a doctor');
  if (d.breastSkinChanges === 'yes') factors.push('Changes in nipple shape or skin texture were noted');
  if (d.breastFamilyHistory === 'yes') factors.push('Family history of breast cancer — regular screening is especially important for you');
  if (d.lastBreastExam === 'over_3_years' || d.lastBreastExam === 'never')
    factors.push('It\'s been a while since your last breast exam — consider scheduling one');

  // Cervical
  if (d.irregularBleeding === 'yes') factors.push('Irregular bleeding between periods — a doctor can help understand the cause');
  if (d.postIntercourseBleeding === 'yes') factors.push('Post-intercourse bleeding — this deserves a medical evaluation');
  if (d.pelvicPain === 'yes') factors.push('Persistent pelvic pain noted');
  if (d.unusualDischarge === 'yes') factors.push('Unusual vaginal discharge — may have many causes, worth checking');
  if (d.cervicalFamilyHistory === 'yes') factors.push('Family history of cervical cancer — regular Pap smears are important');
  if (d.hpvStatus === 'not_vaccinated') factors.push('HPV vaccination may still be an option — discuss with your doctor');
  if (d.lastPapSmear === 'over_3_years' || d.lastPapSmear === 'never')
    factors.push('Consider scheduling a Pap smear — it\'s quick and can catch changes early');

  const lifestyleLinks = [];
  if (Number(d.stressLevel) >= 7) lifestyleLinks.push('High stress affects immune function and overall health');
  if (Number(d.sleepQuality) <= 5) lifestyleLinks.push('Quality sleep supports your body\'s natural defense mechanisms');
  if (d.activityFreq === 'sedentary') lifestyleLinks.push('Regular exercise is one of the strongest cancer-protective habits');
  if (Number(d.waterIntake) < 6) lifestyleLinks.push('Good hydration supports every system in your body');

  return {
    summary: factors.length === 0
      ? 'Based on your responses, no immediate concerns were flagged. Regular self-exams and scheduled screenings are the best gift you can give yourself.'
      : 'Some of your responses suggest areas where a professional check-up would give you peace of mind. Remember — awareness is not alarm. Most findings turn out to be nothing serious, but early attention is always wise.',
    factors,
    lifestyleLinks,
    calm: 'This is not a screening result or diagnosis. It\'s a gentle awareness check. Early detection is powerful — and you\'re already taking a great step by paying attention. Talk to your doctor about scheduling any recommended screenings.',
  };
}

/* ── main export ─────────────────────────────────────── */
export default function analyzeResponses(formData) {
  const mode = formData.mode; // 'period' | 'anemia' | 'cancer'

  if (mode === 'cancer') {
    const report = buildCancerReport(formData);
    const dailyPlan = buildDailyPlan(formData, mode, 'screening');
    return {
      mode,
      risk: 'screening',  // cancer mode always returns 'screening'
      score: 0,
      report,
      dailyPlan,
    };
  }

  const score = mode === 'period'
    ? scorePeriod(formData)
    : scoreAnemia(formData);

  const risk = getRiskCategory(score);

  const report = mode === 'period'
    ? buildPeriodReport(formData, risk)
    : buildAnemiaReport(formData, risk);

  const dailyPlan = buildDailyPlan(formData, mode, risk);

  return {
    mode,
    risk,       // 'low' | 'moderate' | 'high'
    score,
    report,     // { summary, factors, lifestyleLinks, calm }
    dailyPlan,  // { morning, afternoon, evening, night }
  };
}

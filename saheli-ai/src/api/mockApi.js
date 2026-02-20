/**
 * Mock API service — returns a dummy personalised health plan.
 * Replace this with a real fetch() call when a backend is available.
 */

const PLANS = {
  period_hormones: {
    riskSummary: 'Moderate hormonal imbalance indicators',
    explanation:
      'Based on your responses, there are signs that your hormonal rhythm may be slightly off-balance. Irregular cycles paired with elevated stress and lower sleep can affect oestrogen and progesterone levels. The plan below focuses on gentle hormone-supportive habits.',
    plan: {
      morning: [
        'Drink a warm glass of water with lemon upon waking.',
        'Have a balanced breakfast rich in healthy fats — try avocado toast or nuts with oatmeal.',
        '10 minutes of gentle stretching or yoga to support blood flow.',
      ],
      afternoon: [
        'Include leafy greens and lean protein in your lunch.',
        'Take a 15-minute walk after eating to support digestion.',
        'Stay hydrated — aim for at least 4 glasses of water by midday.',
      ],
      evening: [
        'Prepare a light, balanced dinner — grilled fish or lentil soup with vegetables.',
        'Avoid caffeine or heavy meals after 6 PM.',
        'Try 10 minutes of deep breathing or journaling to ease stress.',
      ],
      night: [
        'Aim for 7–8 hours of uninterrupted sleep.',
        'Put screens away 30 minutes before bed.',
        'A cup of chamomile tea can help you relax.',
      ],
    },
  },
  anaemia_fatigue: {
    riskSummary: 'Elevated fatigue with potential iron deficiency indicators',
    explanation:
      'Your responses suggest that fatigue and possible low iron levels may be affecting your energy. Heavy menstrual flow combined with a vegetarian diet can increase the risk of iron-deficiency anaemia. The plan below is designed to naturally boost your energy and iron intake.',
    plan: {
      morning: [
        'Start your day with an iron-rich smoothie — spinach, banana, dates, and orange juice.',
        'Pair iron-rich foods with vitamin C to improve absorption.',
        'A handful of soaked almonds or pumpkin seeds as a snack.',
      ],
      afternoon: [
        'Eat iron-fortified cereals or a dal-rice meal with a side of salad.',
        'Avoid tea or coffee right after meals — they inhibit iron absorption.',
        'Take a short 10-minute rest if fatigue peaks in the afternoon.',
      ],
      evening: [
        'Include beetroot, pomegranate, or dark leafy greens in dinner.',
        'Cook in an iron skillet when possible — it adds trace amounts of iron.',
        'Light walking or stretching to improve circulation without overexerting.',
      ],
      night: [
        'Prioritise 8+ hours of sleep — your body repairs and rebuilds during rest.',
        'Keep your room cool and dark for deeper sleep quality.',
        'Consider a warm glass of milk with a pinch of turmeric before bed.',
      ],
    },
  },
};

/**
 * Simulates an API call with a 1.2 s delay.
 * @param {object} answers — the user's survey answers
 * @returns {Promise<object>} — the personalised plan
 */
export async function fetchHealthPlan(answers) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mode = answers.mode || 'period_hormones';
      const base = PLANS[mode] || PLANS.period_hormones;

      // Slightly personalise risk summary based on answers
      let riskLevel = 'Moderate';
      const fatigue = Number(answers.fatigue) || 5;
      const stress = Number(answers.stress) || 5;
      if (fatigue >= 7 || stress >= 7) riskLevel = 'Elevated';
      if (fatigue <= 3 && stress <= 3) riskLevel = 'Low';

      resolve({
        ...base,
        riskSummary: `${riskLevel}: ${base.riskSummary}`,
        generatedAt: new Date().toISOString(),
      });
    }, 1200);
  });
}

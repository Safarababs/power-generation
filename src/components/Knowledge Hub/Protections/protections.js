const protections = [
  {
    title: "Underfrequency Protection (ANSI 81U, f<)",
    definition_en:
      "Protects the generator by alarming or tripping when frequency falls below safe limits.",
    definition_ur:
      "اگر فریکوئنسی محفوظ حد سے کم ہو جائے تو جنریٹر کو الارم یا ٹرپ کے ذریعے محفوظ کرتا ہے۔",
    explanation:
      "This protection monitors generator frequency. If frequency drops below the set thresholds for the defined times, alarms or trips are activated to prevent instability or mechanical stress. Two stages are provided: f< and f<<.",
    alarm_value: "49 Hz, Delay Time: 30s (First Stage - Alarm Only)",
    trip_stages: [
      {
        stage: "Second Stage",
        value: "47.5 Hz, Delay Time: 4s (Trip)",
      },
    ],
    isShutdown: false,
  },
  {
    title: "Overfrequency Protection (ANSI 81O, f>)",
    definition_en:
      "Protects the generator by alarming or tripping when frequency rises above safe limits.",
    definition_ur:
      "اگر فریکوئنسی محفوظ حد سے زیادہ ہو جائے تو جنریٹر کو الارم یا ٹرپ کے ذریعے محفوظ کرتا ہے۔",
    explanation:
      "This protection monitors generator frequency. If frequency exceeds the set thresholds for the defined times, alarms or trips are activated to prevent mechanical stress and instability. Two stages are provided: f> and f>>.",
    alarm_value: "51 Hz, Delay Time: 30s (First Stage - Alarm Only)",
    trip_stages: [
      {
        stage: "Second Stage",
        value: "55 Hz, Delay Time: 4s (Trip)",
      },
    ],
    isShutdown: false,
  },
  {
    title: "Under-reactive Power Protection (ANSI 40, Q<)",
    definition_en:
      "Trips the generator if reactive power drops below safe limits.",
    definition_ur:
      "اگر ری ایکٹو پاور محفوظ حد سے کم ہو جائے تو جنریٹر کو بند کر دیتا ہے۔",
    explanation:
      "This protection monitors generator reactive power. If reactive power falls below –30% of the machine’s rated apparent power for longer than 2 seconds, the relay trips to prevent instability and protect the generator from operating outside its capability curve.",
    alarm_value: "No alarm stage (direct trip protection)",
    trip_stages: [
      {
        stage: "First Stage",
        value: "–30% Sgn, Delay Time: 2s (Trip)",
      },
    ],
    isShutdown: false,
  },
  {
    title: "Reverse Power Protection (ANSI 32, P<)",
    definition_en:
      "Trips the generator if active power flow reverses beyond safe limits.",
    definition_ur:
      "اگر جنریٹر کی طاقت الٹی سمت میں محفوظ حد سے زیادہ ہو جائے تو جنریٹر کو بند کر دیتا ہے۔",
    explanation:
      "This protection monitors generator active power. If reverse power exceeds –4% of the machine’s rated power for longer than 2 seconds, the relay trips to prevent motoring of the generator.",
    alarm_value: "No alarm stage (direct trip protection)",
    trip_stages: [
      {
        stage: "First Stage",
        value: "–4% Pm, Delay Time: 2s (Trip)",
      },
    ],
    isShutdown: false,
  },
  {
    title: "Zero-sequence Overvoltage Protection (ANSI 59N, U0>)",
    definition_en:
      "Protects the generator by tripping when zero-sequence voltage rises above safe limits.",
    definition_ur:
      "اگر زیرو سیکوینس وولٹیج محفوظ حد سے زیادہ ہو جائے تو جنریٹر کو ٹرپ کر دیتا ہے۔",
    explanation:
      "This protection monitors zero-sequence (residual) voltage, which indicates earth faults or insulation problems. If voltage exceeds the set thresholds for the defined times, the relay trips to prevent equipment damage. Two stages are provided: U0> and U0>>.",
    alarm_value: "No alarm stage (direct trip protection)",
    trip_stages: [
      {
        stage: "First Stage",
        value: "10% Ugn, Delay Time: 2s (Trip)",
      },
      {
        stage: "Second Stage",
        value: "20% Ugn, Delay Time: 1.2s (Trip)",
      },
    ],
    isShutdown: true,
  },
  {
    title: "Undervoltage Protection (ANSI 27, U<)",
    definition_en:
      "Protects the generator by alarming or tripping when voltage falls below safe limits.",
    definition_ur:
      "اگر وولٹیج محفوظ حد سے کم ہو جائے تو جنریٹر کو الارم یا ٹرپ کے ذریعے محفوظ کرتا ہے۔",
    explanation:
      "This protection monitors generator voltage. If voltage drops below the set thresholds for the defined times, alarms or trips are activated to prevent instability or damage. Two stages are provided: U< and U<<.",
    alarm_value: "95% Ugn, Delay Time: 30s (First Stage - Alarm Only)",
    trip_stages: [
      {
        stage: "Second Stage",
        value: "88% Ugn, Delay Time: 20s (Trip)",
      },
    ],
    isShutdown: false,
  },
  {
    title: "Overvoltage Protection (ANSI 59, U>)",
    definition_en:
      "Protects the generator by alarming or tripping when voltage rises above safe limits.",
    definition_ur:
      "اگر وولٹیج محفوظ حد سے زیادہ ہو جائے تو جنریٹر کو الارم یا ٹرپ کے ذریعے محفوظ کرتا ہے۔",
    explanation:
      "This protection monitors generator voltage. If voltage exceeds the set thresholds for the defined times, alarms or trips are activated to prevent insulation stress and equipment damage. Three stages are provided: U>, U>>, and U>>>.",
    alarm_value: "105% Ugn, Delay Time: 30s (First Stage - Alarm Only)",
    trip_stages: [
      {
        stage: "Second Stage",
        value: "112% Ugn, Delay Time: 4s (Trip)",
      },
      {
        stage: "Third Stage",
        value: "140% Ugn, Delay Time: 2s (Trip)",
      },
    ],
    isShutdown: false,
  },

  {
    title: "Differential Protection (ANSI 87)",
    definition_en:
      "Stops the generator if there is a big difference between incoming and outgoing current.",
    definition_ur:
      "اگر ان پٹ اور آؤٹ پٹ کرنٹ میں بڑا فرق ہو تو جنریٹر کو بند کر دیتا ہے۔",
    explanation:
      "This protection checks the balance of current. If the difference is too high, it trips the generator to prevent damage. Two trip stages are set: DI> and DI>>.",
    alarm_value: "25% In (alarm threshold)",
    trip_stages: [
      {
        stage: "DI>",
        value: "25% In (first trip stage)",
      },
      {
        stage: "DI>>",
        value: "5 × In (second trip stage)",
      },
    ],
    isShutdown: true,
  },
  {
    title: "Overcurrent Protection (ANSI 50/51)",
    definition_en: "Stops the generator if current rises above safe limits.",
    definition_ur:
      "اگر کرنٹ محفوظ حد سے زیادہ ہو جائے تو جنریٹر کو بند کر دیتا ہے۔",
    explanation:
      "This protection monitors generator current. If it exceeds the set thresholds, the relay trips to prevent overheating or severe damage. Two trip stages are provided: I> and I>>.",
    alarm_value: "No alarm stage (direct trip protection)",
    trip_stages: [
      {
        stage: "I>",
        value: "1.12 × In (trip if current exceeds 112% of nominal)",
      },
      {
        stage: "I>>",
        value: "2.5 × In (instant trip if current exceeds 250% of nominal)",
      },
    ],
    isShutdown: false,
  },
  {
    title: "Negative Sequence Overcurrent Protection (ANSI 46, I2>)",
    definition_en:
      "Trips the generator if unbalanced current exceeds 8% of nominal.",
    definition_ur:
      "اگر کرنٹ میں عدم توازن نامی کرنٹ کے 8٪ سے زیادہ ہو جائے تو جنریٹر کو بند کر دیتا ہے۔",
    explanation:
      "This protection monitors negative sequence current, which comes from unbalanced loads or faults. If it rises above 8% of the generator’s rated current, the relay trips to protect the rotor from overheating.",
    alarm_value: "No alarm stage (direct trip protection)",
    trip_stages: [
      {
        stage: "I2>",
        value: "8% In (trip if unbalanced current exceeds 8% of nominal)",
      },
    ],
    isShutdown: false,
  },
  {
    title: "Overtemperature Protection (ANSI 49, T>)",
    definition_en:
      "Gives an alarm if generator heating rises above safe limits.",
    definition_ur:
      "اگر جنریٹر کا درجہ حرارت محفوظ حد سے زیادہ ہو جائے تو الارم دیتا ہے۔",
    explanation:
      "This protection monitors heating through current. If it goes above 1.06 times the nominal current equivalent, an alarm is raised to warn operators before damage occurs.",
    alarm_value: "1.06 × In (alarm if heating exceeds 106% of nominal current)",
    trip_stages: [
      {
        stage: "-",
        value: "-",
      },
    ],
    isShutdown: false,
  },
  {
    title: "Earth Fault Protection (ANSI 50N/51N, I0>)",
    definition_en:
      "Trips the generator if earth fault current exceeds the safe limit.",
    definition_ur:
      "اگر ارتھ فالٹ کرنٹ محفوظ حد سے زیادہ ہو جائے تو جنریٹر کو بند کر دیتا ہے۔",
    explanation:
      "This protection monitors zero-sequence (earth fault) current. If the current rises above the set thresholds for the defined time delays, the relay trips to prevent equipment damage. Two trip stages are provided: I0> and I0>>.",
    alarm_value: "No alarm stage (direct trip protection)",
    trip_stages: [
      {
        stage: "I0>",
        value: "2.00 A (trip if earth fault current exceeds 2.00 A)",
      },
      {
        stage: "T>",
        value: "0.85 s (time delay before trip at I0>)",
      },
      {
        stage: "I0>>",
        value: "3.00 A (instant trip if earth fault current exceeds 3.00 A)",
      },
      {
        stage: "T>>",
        value: "0.10 s (time delay before trip at I0>>)",
      },
    ],
    isShutdown: true,
  },
  {
    title: "Voltage Transformer Supervision (VTSV)",
    definition_en:
      "Monitors VT health and alarms if voltage transformer signals are outside safe limits.",
    definition_ur:
      "وولٹیج ٹرانسفارمر کی نگرانی کرتا ہے اور اگر سگنل محفوظ حد سے باہر ہوں تو الارم دیتا ہے۔",
    explanation:
      "VTSV ensures the protection relay receives valid VT signals. If voltage is missing or abnormal for longer than the set delay, an alarm is raised to warn operators of possible VT failure. Voltage-dependent protections may be blocked until VT signals are restored.",

    isShutdown: false,
  },
  {
    title: "Current Transformer Supervision (CTSV)",
    definition_en:
      "Monitors CT health and alarms if current transformer signals are outside safe limits.",
    definition_ur:
      "کرنٹ ٹرانسفارمر کی نگرانی کرتا ہے اور اگر سگنل محفوظ حد سے باہر ہوں تو الارم دیتا ہے۔",
    explanation:
      "CTSV ensures the protection relay receives valid CT signals. If CT current is too high or too low for longer than the set delay, an alarm is raised to warn operators of possible CT failure.",

    isShutdown: false,
  },
];

export default protections;

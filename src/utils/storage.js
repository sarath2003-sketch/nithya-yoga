// LocalStorage Persistence Layer for NITHYA Yoga & Wellness

export const DEFAULT_USER = {
  name: "Sarah",
  role: "Yoga Enthusiast",
  email: "sarah@gmail.com",
  age: 28,
  goal: "Better Health & Peace",
  joined: "Oct 1, 2026",
  classesAttended: 12,
  attendanceRate: 85,
  dayStreak: 7,
  level: "Beginner"
};

export const DEFAULT_REMINDERS = [
  {
    id: "rem-1",
    time: "6:00 PM",
    date: "2026-10-08",
    title: "Next Yoga Class",
    titleTa: "அடுத்த யோகா வகுப்பு",
    category: "Yoga",
    message: "Keep going! You're doing great! 💜",
    messageTa: "தொடர்ந்து செய்யுங்கள்! நீங்கள் சிறப்பாக செய்கிறீர்கள்! 💜",
    repeat: "Daily",
    sound: "Gentle Bell",
    enabled: true,
    completed: false
  },
  {
    id: "rem-2",
    time: "5:30 PM",
    date: "2026-10-08",
    title: "Water Reminder",
    titleTa: "தண்ணீர் நினைவூட்டல்",
    category: "Water",
    message: "Drink water... Stay fresh! 💧",
    messageTa: "தண்ணீர் குடியுங்கள்... புத்துணர்ச்சியுடன் இருங்கள்! 💧",
    repeat: "Daily",
    sound: "Gentle Bell",
    enabled: true,
    completed: false
  },
  {
    id: "rem-3",
    time: "1:00 PM",
    date: "2026-10-08",
    title: "Meal Reminder",
    titleTa: "உணவு நினைவூட்டல்",
    category: "Meal",
    message: "Healthy food = Happy you! 🥗",
    messageTa: "ஆரோக்கிய உணவு = மகிழ்ச்சியான நீங்கள்! 🥗",
    repeat: "Daily",
    sound: "Gentle Bell",
    enabled: true,
    completed: false
  },
  {
    id: "rem-4",
    time: "7:00 PM",
    date: "2026-10-08",
    title: "Call Reminder",
    titleTa: "அழைப்பு நினைவூட்டல்",
    category: "Call",
    message: "Don't forget to call your loved ones. 📞",
    messageTa: "உங்கள் அன்புக்குரியவர்களை அழைக்க மறக்காதீர்கள். 📞",
    repeat: "Daily",
    sound: "Gentle Bell",
    enabled: true,
    completed: false
  },
  {
    id: "rem-5",
    time: "9:00 PM",
    date: "2026-10-08",
    title: "Personal Care",
    titleTa: "சுய பராமரிப்பு",
    category: "Personal Care",
    message: "Take care of yourself. You matter! 💕",
    messageTa: "உங்களை கவனித்துக் கொள்ளுங்கள். நீங்களும் முக்கியம்! 💕",
    repeat: "Daily",
    sound: "Gentle Bell",
    enabled: true,
    completed: false
  }
];

export const DEFAULT_CLASSES = [
  {
    id: "cls-1",
    name: "Hatha Yoga",
    instructor: "Priya",
    duration: 60,
    level: "Beginner",
    time: "06:00 AM",
    description: "Build flexibility, gentle core stability and natural balance.",
    attended: true,
    category: "Beginner"
  },
  {
    id: "cls-2",
    name: "Vinyasa Flow",
    instructor: "Anu",
    duration: 60,
    level: "Intermediate",
    time: "08:30 AM",
    description: "Improve stamina, breath synchronicity and fluid motion.",
    attended: true,
    category: "Intermediate"
  },
  {
    id: "cls-3",
    name: "Power Yoga",
    instructor: "Meena",
    duration: 75,
    level: "Advanced",
    time: "04:30 PM",
    description: "Boost metabolic energy, muscular endurance and sharp focus.",
    attended: false,
    category: "Advanced"
  },
  {
    id: "cls-4",
    name: "Yin Yoga",
    instructor: "Lakshmi",
    duration: 50,
    level: "All Levels",
    time: "06:00 PM",
    description: "Deep restorative stretching and meditative spine release.",
    attended: false,
    category: "Beginner"
  },
  {
    id: "cls-5",
    name: "Pranayama & Breathwork",
    instructor: "Nithya",
    duration: 35,
    level: "All Levels",
    time: "07:30 PM",
    description: "Ancient breath regulation for deep nervous system calming.",
    attended: true,
    category: "Beginner"
  }
];

export const DEFAULT_NOTES = [
  {
    id: "note-1",
    title: "Benefits of Yoga",
    body: "Yoga improves flexibility, reduces cortisol stress and sharpens mental focus. Consistent 20-min daily practice brings sustained tranquility.",
    category: "Yoga",
    date: "Oct 5, 2026"
  },
  {
    id: "note-2",
    title: "Healthy Food Habits",
    body: "Eat clean, stay hydrated. Fresh sattvic food provides sustained physical energy without afternoon crashes.",
    category: "Health",
    date: "Oct 4, 2026"
  },
  {
    id: "note-3",
    title: "Morning Routine",
    body: "Wake up early, drink 2 glasses of warm water, 10 minutes of Nadi Shodhana breathing, then light dynamic stretches.",
    category: "Routine",
    date: "Oct 3, 2026"
  },
  {
    id: "note-4",
    title: "Self Care",
    body: "Take care of your mind. It's just as important as your body. Remember to pause whenever tension creeps in.",
    category: "Wellness",
    date: "Oct 2, 2026"
  }
];

export const DEFAULT_WEEKLY_ACTIVITY = [
  { day: "Mon", minutes: 45, full: "Monday" },
  { day: "Tue", minutes: 30, full: "Tuesday" },
  { day: "Wed", minutes: 60, full: "Wednesday" },
  { day: "Thu", minutes: 0, full: "Thursday" },
  { day: "Fri", minutes: 55, full: "Friday" },
  { day: "Sat", minutes: 40, full: "Saturday" },
  { day: "Sun", minutes: 20, full: "Sunday" }
];

export function loadStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
}

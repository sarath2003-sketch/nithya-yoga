// LocalStorage Persistence Layer for NITHYA Yoga & Wellness

export const DEFAULT_USER = {
  name: "Yoga Practitioner",
  role: "student",
  isInstructor: false,
  email: "",
  age: 26,
  goal: "Daily Mindful Yoga & Healthy Living",
  joined: "Oct 2026",
  classesAttended: 0,
  attendanceRate: 0,
  dayStreak: 1,
  level: "Beginner",
  avatar: "" // Supports Base64 data URL from file upload
};

export const DEFAULT_REMINDERS = [
  {
    id: "rem-1",
    time: "06:00 PM",
    date: "2026-10-08",
    title: "Next Yoga Class",
    titleTa: "அடுத்த யோகா வகுப்பு",
    category: "Yoga",
    message: "Keep going! You're doing great! 💜",
    messageTa: "தொடர்ந்து செய்யுங்கள்! நீங்கள் சிறப்பாக செய்கிறீர்கள்! 💜",
    repeat: "Daily",
    sound: "Soft Bell",
    enabled: true,
    completed: false
  },
  {
    id: "rem-2",
    time: "05:30 PM",
    date: "2026-10-08",
    title: "Water Reminder",
    titleTa: "தண்ணீர் நினைவூட்டல்",
    category: "Water",
    message: "Drink water... Stay fresh! 💧",
    messageTa: "தண்ணீர் குடியுங்கள்... புத்துணர்ச்சியுடன் இருங்கள்! 💧",
    repeat: "Daily",
    sound: "Gentle Chime",
    enabled: true,
    completed: false
  },
  {
    id: "rem-3",
    time: "01:00 PM",
    date: "2026-10-08",
    title: "Meal Reminder",
    titleTa: "உணவு நினைவூட்டல்",
    category: "Meal",
    message: "Healthy food = Happy you! 🥗",
    messageTa: "ஆரோக்கிய உணவு = மகிழ்ச்சியான நீங்கள்! 🥗",
    repeat: "Daily",
    sound: "Peaceful Nature",
    enabled: true,
    completed: false
  },
  {
    id: "rem-4",
    time: "07:00 PM",
    date: "2026-10-08",
    title: "Call Reminder",
    titleTa: "அழைப்பு நினைவூட்டல்",
    category: "Call",
    message: "Don't forget to call your loved ones. 📞",
    messageTa: "உங்கள் அன்புக்குரியவர்களை அழைக்க மறக்காதீர்கள். 📞",
    repeat: "Daily",
    sound: "Soft Bell",
    enabled: true,
    completed: false
  },
  {
    id: "rem-5",
    time: "09:00 PM",
    date: "2026-10-08",
    title: "Personal Care",
    titleTa: "சுய பராமரிப்பு",
    category: "Personal Care",
    message: "Take care of yourself. You matter! 💕",
    messageTa: "உங்களை கவனித்துக் கொள்ளுங்கள். நீங்களும் முக்கியம்! 💕",
    repeat: "Daily",
    sound: "Meditation Tone",
    enabled: true,
    completed: false
  }
];

export const DEFAULT_CLASSES = [
  {
    id: "cls-1",
    name: "Hatha Yoga",
    title: "Hatha Yoga",
    instructor: "NITHYA Master",
    duration: 60,
    level: "Beginner",
    time: "06:00 AM",
    date: "2026-10-09",
    description: "Build flexibility, gentle core stability and natural balance.",
    attended: false,
    category: "Beginner",
    meetUrl: "https://meet.google.com/new"
  },
  {
    id: "cls-2",
    name: "Vinyasa Flow",
    title: "Vinyasa Flow",
    instructor: "NITHYA Master",
    duration: 60,
    level: "Intermediate",
    time: "08:30 AM",
    date: "2026-10-09",
    description: "Improve stamina, breath synchronicity and fluid motion.",
    attended: false,
    category: "Intermediate",
    meetUrl: "https://meet.google.com/new"
  },
  {
    id: "cls-3",
    name: "Power Yoga",
    title: "Power Yoga",
    instructor: "NITHYA Master",
    duration: 75,
    level: "Advanced",
    time: "04:30 PM",
    date: "2026-10-09",
    description: "Boost metabolic energy, muscular endurance and sharp focus.",
    attended: false,
    category: "Advanced",
    meetUrl: "https://meet.google.com/new"
  },
  {
    id: "cls-4",
    name: "Yin Yoga",
    title: "Yin Yoga",
    instructor: "NITHYA Master",
    duration: 50,
    level: "All Levels",
    time: "06:00 PM",
    date: "2026-10-09",
    description: "Deep restorative stretching and meditative spine release.",
    attended: false,
    category: "Beginner",
    meetUrl: "https://meet.google.com/new"
  },
  {
    id: "cls-5",
    name: "Pranayama & Breathwork",
    title: "Pranayama & Breathwork",
    instructor: "NITHYA Master",
    duration: 35,
    level: "All Levels",
    time: "07:30 PM",
    date: "2026-10-09",
    description: "Ancient breath regulation for deep nervous system calming.",
    attended: false,
    category: "Beginner",
    meetUrl: "https://meet.google.com/new"
  }
];

export const DEFAULT_NOTES = [
  {
    id: "note-1",
    title: "Benefits of Yoga",
    body: "Yoga improves flexibility, reduces cortisol stress and sharpens mental focus. Consistent 20-min daily practice brings sustained tranquility.",
    category: "Yoga",
    date: "Oct 5, 2026",
    colorClass: "icon-orange-note"
  },
  {
    id: "note-2",
    title: "Healthy Food Habits",
    body: "Eat clean, stay hydrated. Fresh sattvic food provides sustained physical energy without afternoon crashes.",
    category: "Health",
    date: "Oct 4, 2026",
    colorClass: "icon-red-note"
  },
  {
    id: "note-3",
    title: "Morning Routine",
    body: "Wake up early, drink 2 glasses of warm water, 10 minutes of Nadi Shodhana breathing, then light dynamic stretches.",
    category: "Routine",
    date: "Oct 3, 2026",
    colorClass: "icon-blue-note"
  },
  {
    id: "note-4",
    title: "Self Care",
    body: "Take care of your mind. It's just as important as your body. Remember to pause whenever tension creeps in.",
    category: "Wellness",
    date: "Oct 2, 2026",
    colorClass: "icon-teal-note"
  }
];

export const DEFAULT_PLAYLIST = [
  {
    id: "track-1",
    title: "Peaceful Mind",
    titleTa: "அமைதியான மனம்",
    category: "Relaxing Music",
    categoryTa: "நிம்மதியான இசை",
    duration: "30:00",
    audioUrl: "assets/audio/peaceful-mind.wav",
    sourceType: "audio",
    ambientType: "bowl"
  },
  {
    id: "track-2",
    title: "Featured Meditation",
    titleTa: "வழிகாட்டப்பட்ட தியானம்",
    category: "10 min • Calm Mind",
    categoryTa: "10 நிமிடம் • அமைதி மனம்",
    duration: "10:00",
    audioUrl: "assets/audio/featured-meditation-om.wav",
    sourceType: "audio",
    ambientType: "om"
  },
  {
    id: "track-3",
    title: "Pranayama",
    titleTa: "ஆழ்ந்த சுவாசம்",
    category: "5 min • Focus",
    categoryTa: "5 நிமிடம் • கவனம்",
    duration: "05:00",
    audioUrl: "assets/audio/pranayama-432hz.wav",
    sourceType: "audio",
    ambientType: "music"
  },
  {
    id: "track-4",
    title: "Singing Bowl",
    titleTa: "திபெத்திய பாடும் கிண்ணம்",
    category: "15 min • Deep Healing",
    categoryTa: "15 நிமிடம் • ஆழ்ந்த அமைதி",
    duration: "15:00",
    audioUrl: "assets/audio/singing-bowl.wav",
    sourceType: "audio",
    ambientType: "bowl"
  },
  {
    id: "track-5",
    title: "Sleep Zen",
    titleTa: "உறக்க ஒலிகள்",
    category: "45 min • Good Sleep",
    categoryTa: "45 நிமிடம் • ஆழ்ந்த உறக்கம்",
    duration: "45:00",
    audioUrl: "assets/audio/sleep-zen-rain.wav",
    sourceType: "audio",
    ambientType: "rain"
  }
];

export const DEFAULT_ATTENDANCE_LOGS = [];

export function loadStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    let val = item ? JSON.parse(item) : fallback;
    if (key === 'nithya_classes' && Array.isArray(val)) {
      val = val.map(c => {
        let inst = c.instructor;
        if (!inst || ['priya', 'anu', 'meena', 'lakshmi', 'sarah', 'karthik', 'divya', 'ravi'].includes(String(inst).toLowerCase())) {
          inst = 'NITHYA Master';
        }
        return { ...c, instructor: inst };
      });
    }
    if (key === 'nithya_user' && val && typeof val === 'object') {
      if (val.name && ['sarah', 'priya', 'yoga member'].includes(String(val.name).toLowerCase())) {
        val.name = 'Yoga Student';
      }
      if (val.email && String(val.email).toLowerCase().includes('sarah')) {
        val.email = 'student@nithyayoga.com';
      }
    }
    return val;
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

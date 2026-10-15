import TopicProgress from "../models/TopicProgress.js";
import { SYLLABUS, TOPIC_IDS, makeTopicId } from "../data/syllabus.js";

const DAY = 24 * 60 * 60 * 1000;

// offsetMin = browser ka getTimezoneOffset() (India ke liye -330)
const dayNumber = (time, offsetMin) =>
  Math.floor((time - offsetMin * 60 * 1000) / DAY);

const calcStreak = (dates, offsetMin) => {
  const days = [
    ...new Set(dates.map((d) => dayNumber(new Date(d).getTime(), offsetMin))),
  ].sort((a, b) => a - b);

  if (days.length === 0) {
    return { current: 0, longest: 0, activeToday: false };
  }

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    run = days[i] === days[i - 1] + 1 ? run + 1 : 1;
    if (run > longest) longest = run;
  }

  const daySet = new Set(days);
  const today = dayNumber(Date.now(), offsetMin);
  const activeToday = daySet.has(today);

  // Aaj kuch nahi kiya to streak kal tak chalti hui maani jayegi
  let cursor = activeToday ? today : today - 1;
  let current = 0;
  while (daySet.has(cursor)) {
    current += 1;
    cursor -= 1;
  }

  return { current, longest, activeToday };
};

export const getTracker = async (userId, offsetMin) => {
  const progress = await TopicProgress.find({ user: userId });
  const valid = progress.filter((p) => TOPIC_IDS.has(p.topicId));
  const doneIds = new Set(valid.map((p) => p.topicId));

  const subjects = SYLLABUS.map((s) => {
    const topics = s.topics.map((name) => {
      const id = makeTopicId(s.key, name);
      return { id, name, done: doneIds.has(id) };
    });
    const done = topics.filter((t) => t.done).length;

    return {
      key: s.key,
      name: s.name,
      icon: s.icon,
      total: topics.length,
      done,
      percent: Math.round((done / topics.length) * 100),
      topics,
    };
  });

  const total = subjects.reduce((sum, s) => sum + s.total, 0);
  const done = subjects.reduce((sum, s) => sum + s.done, 0);

  return {
    subjects,
    overall: {
      total,
      done,
      percent: total ? Math.round((done / total) * 100) : 0,
    },
    streak: calcStreak(
      valid.map((p) => p.createdAt),
      offsetMin
    ),
  };
};

export const toggleTopic = async (userId, topicId) => {
  if (!TOPIC_IDS.has(topicId)) {
    const err = new Error("Topic not found");
    err.status = 404;
    throw err;
  }

  const existing = await TopicProgress.findOne({ user: userId, topicId });

  if (existing) {
    await existing.deleteOne();
    return { done: false };
  }

  await TopicProgress.create({ user: userId, topicId });
  return { done: true };
};
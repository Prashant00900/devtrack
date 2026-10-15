export const SYLLABUS = [
  {
    key: "dsa",
    name: "Data Structures & Algorithms",
    icon: "🧮",
    topics: [
      "Arrays",
      "Strings",
      "Two Pointers & Sliding Window",
      "Hashing",
      "Linked List",
      "Stack",
      "Queue",
      "Recursion",
      "Sorting",
      "Binary Search",
      "Trees",
      "Binary Search Tree",
      "Heap",
      "Graphs",
      "Greedy",
      "Backtracking",
      "Dynamic Programming",
    ],
  },
  {
    key: "os",
    name: "Operating Systems",
    icon: "💻",
    topics: [
      "Process vs Thread",
      "CPU Scheduling",
      "Synchronization",
      "Deadlocks",
      "Memory Management",
      "Paging & Segmentation",
      "Virtual Memory",
      "File Systems",
      "Inter-Process Communication",
      "Disk Scheduling",
    ],
  },
  {
    key: "dbms",
    name: "DBMS",
    icon: "🗄️",
    topics: [
      "ER Model",
      "Keys & Constraints",
      "SQL Joins",
      "Normalization",
      "Transactions & ACID",
      "Indexing",
      "Concurrency Control",
      "SQL vs NoSQL",
    ],
  },
  {
    key: "oops",
    name: "OOPS",
    icon: "🧩",
    topics: [
      "Classes & Objects",
      "Encapsulation",
      "Inheritance",
      "Polymorphism",
      "Abstraction",
      "Interface vs Abstract Class",
      "SOLID Principles",
      "Design Patterns Basics",
    ],
  },
  {
    key: "cn",
    name: "Computer Networks",
    icon: "🌐",
    topics: [
      "OSI & TCP/IP Model",
      "TCP vs UDP",
      "HTTP & HTTPS",
      "DNS",
      "IP & Subnetting",
      "Routing",
      "Sockets & Ports",
    ],
  },
];

export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const makeTopicId = (subjectKey, topicName) =>
  `${subjectKey}:${slugify(topicName)}`;

export const TOPIC_IDS = new Set(
  SYLLABUS.flatMap((s) => s.topics.map((t) => makeTopicId(s.key, t)))
);
// src/app/(public)/courses/mockCoursesData.ts
// This file is created to share mock data structure if needed by other components like the enrollment page.
// In a real app, this data would come from a CMS or database.

import { type Course } from '@/components/shared/CourseCard';
import { Users, Award, Video, FileText, Brain, ClipboardCheck, Target, MessageSquare, MessageCircleIcon } from 'lucide-react';

export const coursesData: Course[] = [
  { 
    id: "tef-foundation", 
    title: "TEF Foundation", 
    shortDescription: "Master the fundamentals of French tailored for TEF Canada. Ideal for beginners aiming for CLB 4-6.", 
    targetCLB: "4-6", 
    format: "1:1 Personal Coaching / 1:3 Small Group",
    imageUrl: "https://placehold.co/600x400.png",
    imageAiHint: "classroom study group",
    price1on1: 500,
    price1on3: 300,
    detailedDescription: "Our TEF Foundation course is meticulously designed for beginners or those with basic French knowledge. We focus on building a strong grammatical base, essential vocabulary, and an introduction to all four TEF Canada modules: listening, reading, speaking, and writing. This course prepares you to confidently tackle the exam and aim for CLB 4-6.",
    isForYou: [
      "You are new to French or have very basic knowledge.",
      "You need to understand the TEF Canada exam format from scratch.",
      "You are aiming for CLB 4, 5, or 6 for specific immigration or work permit needs.",
      "You prefer a structured approach with foundational learning.",
    ],
    structure: "Weekly live classes, interactive exercises, access to notes, and basic mock tests.",
    tefFocus: "Introduction to all 4 TEF Canada sections, basic strategies, and confidence building.",
    modules: [
      { id: "m1", title: "Module 1: Introduction to TEF Canada & French Basics", order: 1, lessons: [
        { id: "l1-1", title: "Lesson 1.1: Understanding the TEF Canada Exam", keyTopics: ["Exam structure", "Scoring (CLB levels)", "Registration process"], skillsTargeted: ["General Knowledge"], tefQuestionTypes: ["Overview"], exampleActivities: "Review exam guide" },
        { id: "l1-2", title: "Lesson 1.2: Basic French Greetings & Introductions", keyTopics: ["Salutations", "Presenting oneself", "Asking basic questions"], skillsTargeted: ["Speaking", "Listening"], exampleActivities: "Role-playing introductions" },
      ]},
      { id: "m2", title: "Module 2: Core Grammar & Vocabulary", order: 2, lessons: [
        { id: "l2-1", title: "Lesson 2.1: Essential Verbs (être, avoir, aller)", keyTopics: ["Conjugation in present tense", "Usage in sentences"], skillsTargeted: ["Writing", "Reading"], exampleActivities: "Fill-in-the-blanks exercises" },
      ]}
    ],
    whatsIncluded: [
      { text: "Live Interactive Classes", icon: Users },
      { text: "Certified TEF Instructors", icon: Award },
      { text: "Class Recordings (24/7 Access)", icon: Video },
      { text: "Comprehensive Class Notes (PDF)", icon: FileText },
      { text: "AI Language Tutor Access (Speaking & Writing)", icon: Brain },
      { text: "Official TEF Practice Materials", icon: ClipboardCheck },
      { text: "Regular Mock Tests & Feedback", icon: Target },
      { text: "One-on-One Support Sessions (as per plan)", icon: MessageSquare },
      { text: "Dedicated WhatsApp Group for Batch", icon: MessageCircleIcon },
    ],
  },
  { 
    id: "tef-pro-clb7", 
    title: "TEF Pro - CLB 7+", 
    shortDescription: "Intensive, strategy-focused training to help you achieve CLB 7 and above.", 
    targetCLB: "7+", 
    format: "1:1 Personal Coaching / 1:3 Small Group",
    imageUrl: "https://placehold.co/600x400.png",
    imageAiHint: "professional presentation success",
    price1on1: 800,
    price1on3: 550,
    detailedDescription: "The TEF Pro - CLB 7+ course is engineered for intermediate learners aiming for high scores essential for Express Entry...",
    isForYou: [
      "You have an intermediate level of French (B1 or equivalent).",
      "You need to score CLB 7 or higher for Canadian Express Entry.",
    ],
    structure: "Advanced strategy sessions, full-length mock tests, personalized feedback, targeted skill workshops.",
    tefFocus: "Mastery of all 4 TEF Canada sections, advanced test-taking strategies, time management, and achieving high fluency.",
    modules: [
      { id: "m1-pro", title: "Module 1: Advanced Listening Comprehension", order: 1, lessons: [
        { id: "l1-1-pro", title: "Lesson 1.1: Identifying Nuances and Implied Meanings", keyTopics: ["Inferencing", "Understanding idiomatic expressions"], skillsTargeted: ["Listening"], tefQuestionTypes: ["Compréhension Orale - Section A, B, C"], exampleActivities: "Practice with advanced audio clips" },
      ]},
    ],
    whatsIncluded: [
      { text: "Advanced Live Interactive Classes", icon: Users },
      { text: "Expert TEF Instructors (CLB 9+)", icon: Award },
    ],
  },
   { 
    id: "tef-excellence-clb9", 
    title: "TEF Excellence - CLB 9+", 
    shortDescription: "Advanced coaching for those aiming for top-tier CLB 9+ scores.", 
    targetCLB: "9+", 
    format: "1:1 Personal Coaching",
    imageUrl: "https://placehold.co/1200x500.png",
    imageAiHint: "expert award ceremony",
    price1on1: 1200,
    detailedDescription: "The TEF Excellence course is for advanced French speakers...",
    isForYou: [
      "You have an advanced level of French (B2/C1 or equivalent).",
      "You aim to achieve CLB 9 or higher for maximum Express Entry points.",
    ],
    structure: "Intensive 1:1 coaching, customized study plans, advanced material, specialized mock tests, and detailed error analysis.",
    tefFocus: "Achieving near-native proficiency across all TEF Canada sections...",
    modules: [], 
    whatsIncluded: [],
  },
];

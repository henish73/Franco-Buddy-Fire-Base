// src/app/(public)/courses/mockCoursesData.ts
// This file is created to share mock data structure if needed by other components like the enrollment page.
// In a real app, this data would come from a CMS or database.

import { type Course } from '@/components/shared/CourseCard';
import { Users, Award, Video, FileText, Brain, ClipboardCheck, Target, MessageSquare, MessageCircle } from 'lucide-react';

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
      { id: "m1-found", title: "Module 1: Introduction to TEF Canada & French Basics", order: 1, description: "Understand the exam and learn essential greetings.", lessons: [
        { id: "l1-1-found", title: "Lesson 1.1: Understanding the TEF Canada Exam", keyTopics: ["Exam structure (sections, duration)", "Scoring system (CLB levels)", "Registration process overview"], skillsTargeted: ["General Knowledge"], tefQuestionTypes: ["N/A - Informational"], exampleActivities: "Review official TEF Canada exam guide." },
        { id: "l1-2-found", title: "Lesson 1.2: Basic French Greetings & Introductions", keyTopics: ["Common salutations (Bonjour, Salut, Bonsoir)", "Introducing oneself (Je m'appelle...)", "Asking basic questions (Comment ça va?)"], skillsTargeted: ["Speaking", "Listening"], tefQuestionTypes: ["Expression Orale - Section A (simulated)"], exampleActivities: "Role-playing introductions and simple conversations." },
      ]},
      { id: "m2-found", title: "Module 2: Core Grammar & Vocabulary Building", order: 2, description: "Build your French grammar and vocabulary foundation.", lessons: [
        { id: "l2-1-found", title: "Lesson 2.1: Essential Verbs (être, avoir, aller)", keyTopics: ["Present tense conjugation", "Usage in common sentences", "Forming simple questions"], skillsTargeted: ["Writing", "Reading", "Speaking"], tefQuestionTypes: ["Lexique et Structure"], exampleActivities: "Fill-in-the-blanks exercises, sentence creation." },
        { id: "l2-2-found", title: "Lesson 2.2: Nouns, Articles, and Gender", keyTopics: ["Masculine vs. Feminine nouns", "Definite and indefinite articles (le, la, les, un, une, des)", "Basic agreement rules"], skillsTargeted: ["Reading", "Writing"], tefQuestionTypes: ["Lexique et Structure"], exampleActivities: "Identifying noun genders, matching articles to nouns." },
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
      { text: "Dedicated WhatsApp Group for Batch", icon: MessageCircle },
    ],
    instructorSpotlight: {
      name: "Prof. Marie Dupont",
      bio: "Marie is a certified FLE (French as a Foreign Language) instructor with over 8 years of experience specializing in TEF Canada preparation. She is passionate about helping students achieve their immigration goals through language mastery.",
      imageUrl: "https://placehold.co/150x150.png",
      imageAiHint: "female instructor friendly",
    },
    courseSpecificTestimonials: [
      { quote: "The TEF Foundation course was perfect for my beginner level. I learned so much!", author: "R. Singh", image: "https://placehold.co/80x80.png", imageAiHint: "student happy" },
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
    detailedDescription: "The TEF Pro - CLB 7+ course is engineered for intermediate learners aiming for high scores essential for Express Entry. This program dives deep into advanced strategies for each TEF Canada module, with extensive practice, mock tests, and personalized feedback to ensure you are fully prepared to achieve CLB 7 or higher.",
    isForYou: [
      "You have an intermediate level of French (B1 or equivalent).",
      "You need to score CLB 7 or higher for Canadian Express Entry.",
      "You are looking for advanced strategies and intensive practice.",
      "You want personalized feedback to refine your skills.",
    ],
    structure: "Advanced strategy sessions, full-length mock tests, personalized feedback, targeted skill workshops.",
    tefFocus: "Mastery of all 4 TEF Canada sections, advanced test-taking strategies, time management, and achieving high fluency.",
    modules: [
      { id: "m1-pro", title: "Module 1: Advanced Listening Comprehension (Compréhension Orale)", order: 1, lessons: [
        { id: "l1-1-pro", title: "Lesson 1.1: Identifying Nuances and Implied Meanings", keyTopics: ["Inferencing speaker intent", "Understanding idiomatic expressions", "Recognizing different accents and registers"], skillsTargeted: ["Listening"], tefQuestionTypes: ["Compréhension Orale - Section B, C"], exampleActivities: "Practice with advanced audio clips, analyzing speaker tone." },
      ]},
      { id: "m2-pro", title: "Module 2: Mastering Speaking Sections (Expression Orale)", order: 2, lessons: [
        { id: "l2-1-pro", title: "Lesson 2.1: Structuring Arguments for Section B", keyTopics: ["Developing persuasive arguments", "Organizing ideas logically (introduction, arguments, conclusion)", "Using appropriate vocabulary and connectors"], skillsTargeted: ["Speaking"], tefQuestionTypes: ["Expression Orale - Section B"], exampleActivities: "Timed speaking practice on various topics with structured feedback." },
      ]}
    ],
    whatsIncluded: [
      { text: "Advanced Live Interactive Classes", icon: Users },
      { text: "Expert TEF Instructors (CLB 9+)", icon: Award },
      { text: "All Class Recordings (24/7 Access)", icon: Video },
      { text: "Detailed Strategy Guides & Notes (PDF)", icon: FileText },
      { text: "AI Language Tutor Access (All Modules)", icon: Brain },
      { text: "Extensive Official TEF Practice Materials", icon: ClipboardCheck },
      { text: "Multiple Full-Length Mock Tests & In-depth Feedback", icon: Target },
      { text: "Dedicated One-on-One Strategy Sessions", icon: MessageSquare },
      { text: "Priority Support via WhatsApp Group", icon: MessageCircle },
    ],
    instructorSpotlight: {
      name: "Dr. Jean Moreau",
      bio: "Jean holds a PhD in French Linguistics and has a stellar track record of guiding students to CLB 7+ scores. His approach focuses on strategic test-taking and building true language confidence.",
      imageUrl: "https://placehold.co/150x150.png",
      imageAiHint: "male instructor serious",
    },
  },
   { 
    id: "tef-excellence-clb9", 
    title: "TEF Excellence - CLB 9+", 
    shortDescription: "Advanced coaching for those aiming for top-tier CLB 9+ scores.", 
    targetCLB: "9+", 
    format: "1:1 Personal Coaching",
    imageUrl: "https://placehold.co/1200x500.png", // Note: original had .png, this should match other image URLs.
    imageAiHint: "expert award ceremony",
    price1on1: 1200,
    detailedDescription: "The TEF Excellence course is for advanced French speakers targeting the highest CLB levels (9 and above) to maximize their CRS points. This highly personalized 1:1 coaching focuses on perfecting nuances, advanced vocabulary, idiomatic expressions, and flawless execution in all TEF Canada sections.",
    isForYou: [
      "You have an advanced level of French (B2/C1 or equivalent).",
      "You aim to achieve CLB 9 or higher for maximum Express Entry points.",
    ],
    structure: "Intensive 1:1 coaching, customized study plans, advanced material, specialized mock tests, and detailed error analysis.",
    tefFocus: "Achieving near-native proficiency across all TEF Canada sections, mastering complex structures, and ensuring impeccable accuracy.",
    modules: [], 
    whatsIncluded: [
        { text: "Elite 1:1 Coaching Sessions", icon: Users },
        { text: "Personalized Study Plan", icon: ClipboardCheck },
        { text: "Advanced Material & Error Analysis", icon: Brain },
    ],
  },
];

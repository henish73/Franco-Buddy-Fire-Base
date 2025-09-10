// src/app/(public)/courses/mockCoursesData.ts
import { type Course } from '@/components/shared/CourseCard';
import { Users, Award, Video, FileText, Brain, ClipboardCheck, Target, MessageSquare, MessageCircle, Clock } from 'lucide-react';

export const coursesData: Course[] = [
  { 
    id: "a1-a2-beginner", 
    title: "Beginner (A1/A2)", 
    shortDescription: "Just starting out? Learn the basics of French grammar, vocabulary, and pronunciation. Ideal for those with little to no prior knowledge.", 
    targetCLB: "1-4", 
    format: "Group / 1-on-1",
    duration: "14 Weeks",
    imageUrl: "https://placehold.co/600x400.png",
    imageAiHint: "classroom study group",
    price1on1: 399,
    price1on3: 249,
    detailedDescription: "Just starting out? Learn the basics of French grammar, vocabulary, and pronunciation. Ideal for those with little to no prior knowledge. This course prepares you to confidently handle everyday situations in French.",
    whatsIncluded: [
      { text: "Live Interactive Classes", icon: Users },
      { text: "Certified Instructors", icon: Award },
      { text: "Comprehensive Class Notes (PDF)", icon: FileText },
      { text: "Basic Conversation Practice", icon: MessageSquare },
      { text: "Beginner Level Mock Tests", icon: ClipboardCheck },
    ],
    modules: [
        {
            id: 'a1a2_m1',
            order: 1,
            title: 'Module 1: Introduction to French Basics (A1)',
            description: 'Laying the groundwork for your French journey.',
            lessons: [
                { id: 'l1', title: 'Greetings & Introductions', keyTopics: ['Salutations (Bonjour, Bonsoir)', 'Introducing yourself (Je m\'appelle...)', 'Asking for names'] },
                { id: 'l2', title: 'The Alphabet & Numbers', keyTopics: ['French alphabet pronunciation', 'Counting from 0 to 100', 'Telling time'] },
                { id: 'l3', title: 'Essential Verbs: Être & Avoir', keyTopics: ['Conjugation in present tense', 'Forming simple sentences', 'Asking basic questions'] },
                { id: 'l4', title: 'Nouns, Gender & Articles', keyTopics: ['Masculine and feminine nouns', 'Definite (le, la, les) and indefinite (un, une, des) articles'] },
            ]
        },
        {
            id: 'a1a2_m2',
            order: 2,
            title: 'Module 2: Building Sentences & Everyday Topics (A2)',
            description: 'Expanding your ability to communicate in common situations.',
            lessons: [
                { id: 'l5', title: 'Present Tense (-er, -ir, -re verbs)', keyTopics: ['Regular verb conjugation patterns', 'Common irregular verbs (aller, faire, venir)'] },
                { id: 'l6', title: 'Asking Questions', keyTopics: ['Est-ce que', 'Inversion', 'Question words (Qui, Que, Où, Quand, Pourquoi)'] },
                { id: 'l7', title: 'Talking About Family & Hobbies', keyTopics: ['Vocabulary for family members', 'Expressing likes and dislikes (aimer, adorer, détester)'] },
                { id: 'l8', title: 'Introduction to Past Tense (Passé Composé)', keyTopics: ['Forming the passé composé with avoir', 'Basic past participles'] },
            ]
        }
    ]
  },
  { 
    id: "b1-b2-intermediate", 
    title: "Intermediate (B1/B2)", 
    shortDescription: "Ready to take your skills to the next level? Improve your fluency, expand your vocabulary, and master complex grammar concepts.", 
    targetCLB: "5-7", 
    format: "Group / 1-on-1",
    duration: "24 Weeks",
    imageUrl: "https://placehold.co/600x400.png",
    imageAiHint: "professional discussion group",
    price1on1: 399,
    price1on3: 249,
    detailedDescription: "Ready to take your skills to the next level? Improve your fluency, expand your vocabulary, and master complex grammar concepts. This program dives deep into advanced strategies for each TEF Canada module, with extensive practice, mock tests, and personalized feedback to ensure you are fully prepared to achieve CLB 5-7.",
    whatsIncluded: [
      { text: "Advanced Live Interactive Classes", icon: Users },
      { text: "Expert TEF Instructors (CLB 9+)", icon: Award },
      { text: "All Class Recordings (24/7 Access)", icon: Video },
      { text: "AI Language Tutor Access", icon: Brain },
      { text: "Extensive Official TEF Practice Materials", icon: ClipboardCheck },
      { text: "Multiple Full-Length Mock Tests & In-depth Feedback", icon: Target },
    ],
    modules: [
        {
            id: 'b1b2_m1',
            order: 1,
            title: 'Module 1: Compréhension Orale (Listening)',
            description: 'Strategies to understand spoken French in various contexts.',
            lessons: [
                { id: 'l1', title: 'Section A: Understanding short messages & announcements', keyTopics: ['Identifying key information (who, what, where)', 'Recognizing numbers, dates, and times'] },
                { id: 'l2', title: 'Section B: Understanding public announcements & radio broadcasts', keyTopics: ['Identifying the main purpose', 'Understanding tone and intent'] },
                { id: 'l3', title: 'Section C: Conversations & Interviews', keyTopics: ['Following the main points of a conversation', 'Identifying speakers\' opinions'] },
            ]
        },
        {
            id: 'b1b2_m2',
            order: 2,
            title: 'Module 2: Compréhension Écrite (Reading)',
            description: 'Techniques for speed-reading and deep comprehension of texts.',
            lessons: [
                { id: 'l4', title: 'Section A: Reading for information', keyTopics: ['Skimming and scanning techniques', 'Understanding classified ads and short articles'] },
                { id: 'l5', title: 'Section B: Understanding detailed articles & reports', keyTopics: ['Identifying main ideas and supporting details', 'Vocabulary in context'] },
                { id: 'l6', title: 'Section C: Analyzing opinions and arguments', keyTopics: ['Understanding author\'s viewpoint', 'Making inferences'] },
            ]
        },
        {
            id: 'b1b2_m3',
            order: 3,
            title: 'Module 3: Expression Écrite (Writing)',
            description: 'Mastering the structure and style for both writing sections.',
            lessons: [
                { id: 'l7', title: 'Section A: Writing a "fait divers" (news item)', keyTopics: ['Structuring a news story', 'Using past tenses (passé composé vs. imparfait)'] },
                { id: 'l8', title: 'Section B: Expressing a reasoned opinion', keyTopics: ['Structuring an argumentative essay', 'Using connectors (connecteurs logiques)', 'Expressing nuances and hypotheses'] },
            ]
        },
        {
            id: 'b1b2_m4',
            order: 4,
            title: 'Module 4: Expression Orale (Speaking)',
            description: 'Developing fluency and confidence for both speaking tasks.',
            lessons: [
                { id: 'l9', title: 'Section A: Formal information request', keyTopics: ['Using formal "vous"', 'Asking relevant questions', 'Managing the conversation flow'] },
                { id: 'l10', title: 'Section B: Presenting and defending an opinion', keyTopics: ['Structuring a persuasive argument', 'Using vocabulary of persuasion', 'Handling counter-arguments'] },
            ]
        }
    ]
  },
   { 
    id: "c1-c2-advanced", 
    title: "Advanced (C1/C2)", 
    shortDescription: "Perfect your French and achieve near-native fluency. Fine-tune your accent, master idiomatic expressions, and tackle advanced topics with confidence.", 
    targetCLB: "8+", 
    format: "1-on-1 Coaching",
    duration: "20 Weeks",
    imageUrl: "https://placehold.co/600x400.png",
    imageAiHint: "expert award ceremony",
    price1on1: 399,
    detailedDescription: "Perfect your French and achieve near-native fluency. Fine-tune your accent, master idiomatic expressions, and tackle advanced topics with confidence. This highly personalized 1-on-1 coaching focuses on perfecting nuances, advanced vocabulary, and flawless execution.",
     whatsIncluded: [
        { text: "Elite 1:1 Coaching Sessions", icon: Users },
        { text: "Personalized Study Plan", icon: ClipboardCheck },
        { text: "Advanced Material & Error Analysis", icon: Brain },
        { text: "Focus on Idiomatic Expressions", icon: MessageSquare },
        { text: "Dedicated WhatsApp Group", icon: MessageCircle },
    ],
    modules: [
        {
            id: 'c1c2_m1',
            order: 1,
            title: 'Module 1: Mastering Complex Structures',
            description: 'Going beyond standard grammar to achieve native-like expression.',
            lessons: [
                { id: 'l1', title: 'Advanced Subjunctive', keyTopics: ['Subjunctive in subordinate clauses', 'Subjunctive after expressions of opinion, doubt, and will'] },
                { id: 'l2', title: 'Complex Relative Pronouns', keyTopics: ['Lequel, auquel, duquel', 'Dont vs. de qui/de quoi'] },
                { id: 'l3', title: 'Advanced Connectors', keyTopics: ['Nuancing arguments with complex logical connectors', 'Causality, consequence, opposition'] },
            ]
        },
        {
            id: 'c1c2_m2',
            order: 2,
            title: 'Module 2: Advanced TEF/TCF Strategy',
            description: 'Fine-tuning your approach to maximize points in every section.',
            lessons: [
                { id: 'l4', title: 'Lexique (Vocabulary) Enhancement', keyTopics: ['Identifying and using idiomatic expressions', 'Understanding nuanced vocabulary (paraphrasing)'] },
                { id: 'l5', title: 'Structure des phrases complexes', keyTopics: ['Mastering complex sentence structures for writing and speaking exams'] },
            ]
        }
    ]
  },
];

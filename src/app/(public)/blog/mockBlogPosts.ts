// src/app/(public)/blog/mockBlogPosts.ts

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  imageUrl?: string;
  imageAiHint?: string;
  content: string; // Can be Markdown or HTML string
  categories: string[];
  tags: string[];
  featured?: boolean;
};

export const mockBlogPosts: BlogPost[] = [
  {
    slug: "mastering-tef-speaking-section-a",
    title: "Mastering TEF Canada Speaking: Section A Strategies",
    date: "2024-07-20",
    author: "Henish Patel",
    excerpt: "Section A of the TEF Speaking test can be daunting. Learn proven strategies to confidently introduce yourself and ask relevant questions.",
    imageUrl: "https://placehold.co/800x400.png",
    imageAiHint: "microphone speaking student",
    content: `
      <p>Section A of the TEF Canada Speaking component requires you to initiate a conversation, typically to obtain information or services. This section tests your ability to use formal French, ask clear questions, and understand responses.</p>
      <h3 class="text-xl font-semibold my-3 text-primary">Key Challenges:</h3>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li>Understanding the scenario quickly.</li>
        <li>Formulating grammatically correct questions under pressure.</li>
        <li>Using appropriate formal language (vousvoiement).</li>
      </ul>
      <h3 class="text-xl font-semibold my-3 text-primary">Top Strategies:</h3>
      <ol class="list-decimal list-inside space-y-1">
        <li><strong>Prepare Opening Lines:</strong> Have a few standard opening phrases ready, like "Bonjour, je voudrais des renseignements sur..." or "Excusez-moi, pourriez-vous m'aider avec...?".</li>
        <li><strong>Listen Actively:</strong> Pay close attention to the examiner’s prompts and responses to ask relevant follow-up questions.</li>
        <li><strong>Practice Common Scenarios:</strong> Role-play situations like booking a hotel, inquiring about a course, or making a complaint.</li>
      </ol>
      <p class="mt-4">By practicing these strategies, you can significantly improve your performance in Section A and set a positive tone for the rest of your speaking exam.</p>
    `,
    categories: ["TEF Speaking", "Exam Strategies"],
    tags: ["Speaking Section A", "TEF Tips", "French Speaking"],
    featured: true,
  },
  {
    slug: "demystifying-clb-scores",
    title: "Demystifying CLB Scores for Canadian Immigration",
    date: "2024-07-15",
    author: "French.GTA Team",
    excerpt: "Understand what Canadian Language Benchmark (CLB) scores mean for your TEF Canada exam and how they impact your Express Entry profile.",
    imageUrl: "https://placehold.co/800x400.png",
    imageAiHint: "canada flag chart",
    content: `
      <p>The Canadian Language Benchmarks (CLB) are the national standards used in Canada to describe, measure, and recognize the French language proficiency of adult immigrants and prospective immigrants who plan to live and work in Canada.</p>
      <p class="mt-2">For the TEF Canada, your scores in each of the four abilities – listening, speaking, reading, and writing – are converted to a CLB level. Achieving a CLB 7 or higher in all four abilities can significantly boost your Comprehensive Ranking System (CRS) points for Express Entry.</p>
      <h3 class="text-xl font-semibold my-3 text-primary">Why CLB 7 is a Magic Number:</h3>
      <p>Reaching CLB 7 demonstrates a good intermediate proficiency. For Express Entry candidates under the Federal Skilled Worker Program, it's often a minimum requirement to earn points for French language skills. Higher CLB levels (8, 9, 10+) grant even more points.</p>
    `,
    categories: ["Canadian Immigration", "TEF Scores"],
    tags: ["CLB", "Express Entry", "CRS Points"],
  },
  {
    slug: "5-common-mistakes-in-tef-writing",
    title: "5 Common Mistakes to Avoid in TEF Canada Writing",
    date: "2024-07-10",
    author: "Expert Instructor",
    excerpt: "Boost your TEF Writing score by learning to avoid these frequent errors made by test-takers. Simple fixes can make a big difference!",
    imageUrl: "https://placehold.co/800x400.png",
    imageAiHint: "writing pen paper",
    content: `
      <p>The TEF Canada Writing section tests your ability to express yourself clearly and correctly in French. Many students lose valuable points due to avoidable errors. Here are five common mistakes:</p>
      <ol class="list-decimal list-inside space-y-2 mt-3">
        <li><strong>Incorrect Verb Conjugations:</strong> Especially in past tenses (passé composé vs. imparfait) and subjunctive mood.</li>
        <li><strong>Gender and Number Agreement Errors:</strong> Forgetting to make adjectives and past participles agree with nouns.</li>
        <li><strong>Poor Sentence Structure:</strong> Overly long or run-on sentences, or incorrect use of connectors.</li>
        <li><strong>Vocabulary Misuse:</strong> Using words incorrectly or not choosing the most appropriate term for the context.</li>
        <li><strong>Ignoring the Prompt:</strong> Not fully addressing all parts of the writing task or misunderstanding the required format (e.g., formal letter vs. opinion piece).</li>
      </ol>
      <p class="mt-4">Focusing on these areas during your preparation can lead to a significant improvement in your TEF Writing score.</p>
    `,
    categories: ["TEF Writing", "Exam Tips"],
    tags: ["Writing Mistakes", "French Grammar", "TEF Preparation"],
    featured: true,
  },
  {
    slug: "benefits-of-1-on-1-tef-coaching",
    title: "The Benefits of 1-on-1 TEF Canada Coaching",
    date: "2024-07-05",
    author: "Henish Patel",
    excerpt: "Discover how personalized coaching can accelerate your TEF Canada preparation and help you achieve your target CLB score faster.",
    imageUrl: "https://placehold.co/800x400.png",
    imageAiHint: "teacher student discussion",
    content: `
      <p>While group classes offer a collaborative learning environment, 1-on-1 coaching provides a tailored approach that can be incredibly effective for TEF Canada preparation. Here's why:</p>
      <ul class="list-disc list-inside space-y-2 mt-3">
        <li><strong>Personalized Attention:</strong> Your instructor focuses solely on your strengths, weaknesses, and learning style.</li>
        <li><strong>Customized Study Plan:</strong> Lessons are adapted to your specific needs and pace.</li>
        <li><strong>Targeted Feedback:</strong> Receive immediate and detailed feedback on your speaking and writing.</li>
        <li><strong>Flexible Scheduling:</strong> Sessions can often be scheduled at times convenient for you.</li>
        <li><strong>Increased Confidence:</strong> Practicing in a supportive, private setting can help reduce anxiety.</li>
      </ul>
      <p class="mt-4">If you're serious about achieving a high score in TEF Canada, consider investing in 1-on-1 coaching to maximize your potential.</p>
    `,
    categories: ["TEF Coaching", "Learning Strategies"],
    tags: ["Personalized Learning", "Tutoring", "French.GTA"],
  },
];

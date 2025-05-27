
import { config } from 'dotenv';
config();

import '@/ai/flows/course-suggestion.ts';
import '@/ai/flows/speakingAssessmentFlow.ts';
import '@/ai/flows/writingAssessmentFlow.ts';
import '@/ai/flows/readingAssessmentFlow.ts'; // Added new flow
import '@/ai/flows/listeningAssessmentFlow.ts'; // Added new flow


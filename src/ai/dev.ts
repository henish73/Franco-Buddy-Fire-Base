
import { config } from 'dotenv';
config();

import '@/ai/flows/course-suggestion.ts';
import '@/ai/flows/speakingAssessmentFlow.ts';
import '@/ai/flows/writingAssessmentFlow.ts'; // Added new flow


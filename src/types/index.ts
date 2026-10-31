/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Core Data Models
 */

export type MemoryTone = 'joyful' | 'somber' | 'reflective' | 'neutral' | 'mixed';

export type LightingProfile = 
  | 'warm_candle' 
  | 'soft_candle' 
  | 'subdued_amber' 
  | 'balanced_warm' 
  | 'neutral';

export type ParticleProfile = 
  | 'none' 
  | 'petal_drift' 
  | 'dust_motes' 
  | 'gentle_drift';

export type CameraProfile = 
  | 'static' 
  | 'gentle_drift' 
  | 'slow_drift' 
  | 'inspect_nicho' 
  | 'inspect_candle' 
  | 'inspect_recipe' 
  | 'overview';

export type MotionProfile = 'still' | 'gentle' | 'lively';

export interface VisualDirectionState {
  memory_tone: MemoryTone;
  tone_confidence: number; // 0.0 - 1.0
  visual_intensity: number; // 0.0 - 1.0
  lighting_profile: LightingProfile;
  particle_profile: ParticleProfile;
  camera_profile: CameraProfile;
  motion_profile: MotionProfile;
}

export interface SovereignSentimentResponse {
  reasoning_scratchpad: string;
  memory_tone: MemoryTone;
  tone_confidence: number;
  visual_intensity: number;
  lighting_profile: LightingProfile;
  particle_profile: ParticleProfile;
  camera_motion: 'static' | 'slow_drift';
}

export type AnswerStatus = 
  | 'answered' 
  | 'insufficient_evidence' 
  | 'conflicting_evidence' 
  | 'out_of_scope';

export interface GroundedEvidence {
  chunk_id: string;
  source_id: string;
  quote: string;
}

export interface GroundedMemoryAnswer {
  schema_version: '1.0';
  reasoning_scratchpad: string;
  status: AnswerStatus;
  answer: string;
  evidence_used: string[];
  evidence_details?: GroundedEvidence[];
  uncertainty?: {
    level: 'low' | 'medium' | 'high';
    reason: string;
  };
  follow_up_question?: string | null;
}

export interface MemoryChunk {
  chunk_id: string;
  source_id: string;
  chunk_index: number;
  content: string;
  token_estimate: number;
}

export interface MemoryDocument {
  source_id: string;
  title: string;
  original_filename: string;
  source_date: string | null;
  language: string;
  heading: string;
  source_type: 'oral_history' | 'diary' | 'recipe' | 'letter' | 'audio_transcript' | 'adversarial_injection';
  people_as_written: string[];
  tags: string[];
  content: string;
  chunks: MemoryChunk[];
  associated_offering_id?: string;
  inferred_tone?: MemoryTone;
}

export interface RetrievalResult {
  chunk: MemoryChunk;
  source: MemoryDocument;
  score: number;
  matched_terms: string[];
}

export interface GoldTestCase {
  id: string;
  category: 'direct' | 'distributed' | 'missing_evidence' | 'conflicting' | 'ambiguous' | 'adversarial';
  question: string;
  relevant_source_ids: string[];
  expected_evidence_chunks: string[];
  expected_status: AnswerStatus;
  expected_answer_summary: string;
  unsupported_pitfalls: string;
  simulated_response?: GroundedMemoryAnswer;
}

export interface TestResult {
  test_case_id: string;
  passed: boolean;
  status_matched: boolean;
  citation_integrity: boolean; // all cited chunks exist in source
  no_fabrication: boolean;
  injection_resisted: boolean;
  json_valid: boolean;
  latency_ms: number;
  details: string;
  model_output: GroundedMemoryAnswer;
}

export interface EvaluationScorecard {
  total_tests: number;
  passed_tests: number;
  grounded_accuracy: number;
  evidence_precision: number;
  citation_integrity: number;
  abstention_accuracy: number;
  injection_resistance: number;
  json_validity: number;
  average_latency_ms: number;
}

export interface OfrendaItemClickData {
  id: string;
  title: string;
  type: 'nicho' | 'candle' | 'cempasuchil' | 'pan_de_muerto' | 'calavera' | 'guitar' | 'copal' | 'water_salt';
  description: string;
  associated_memory_id?: string;
  tier: number;
}

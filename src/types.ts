export interface Slot {
  slot: number | string;
  time: string | null;
  status: 'fixed' | 'variable';
  role: string;
}

export interface ReinforcementItem {
  code: string;
  name: string;
  schedule: string;
  slot: number | string;
  jackpot: 'low' | 'medium' | 'high' | 'max' | null;
  max_per_week?: number;
  restriction?: string;
}

export interface Guardrails {
  reward_must_be_real: boolean;
  no_manufactured_scarcity: boolean;
  never_vary_the_spine: boolean;
  anchor_never_blended_with_marketing: boolean;
  float_never_lands_on_slot_time: boolean;
  no_two_floats_same_day_same_hour: boolean;
  ledger_required: boolean;
  no_placeholders: boolean;
}

export interface RewardLadder {
  weeks_1_2: string[];
  week_3: string[];
  week_4: string[];
}

export interface CampaignConfig {
  slots: Slot[];
  reinforcement_pool: ReinforcementItem[];
  reply_policy: string;
  guardrails: Guardrails;
  reward_ladder: RewardLadder;
  generation_guardrails?: Record<string, boolean | number>;
}

export interface Anchor {
  slot: number;
  time: string;
  type: string;
  label: string;
  format: string;
  note?: string;
}

export interface Post {
  id: string;
  slot: number;
  time: string;
  role: string;
  type: string;
  status: 'fixed' | 'variable';
  text: string;
  ai_prompt_ref?: string;
  prompt_variables?: Record<string, any>;
  // Simulated engagement stats for the UI
  likes?: number;
  retweets?: number;
  replies_count?: number;
  views?: number;
  bookmarks?: number;
  isLiked?: boolean;
  isRetweeted?: boolean;
  isBookmarked?: boolean;
  isPublished?: boolean;
  publishedAt?: string;
}

export interface FloatPost {
  id: string;
  time: string;
  role: 'Floating';
  type: string;
  status: 'floating';
  announced: boolean;
  jackpot?: 'low' | 'medium' | 'high' | 'max' | null;
  text: string;
  ai_prompt_ref?: string;
  prompt_variables?: Record<string, any>;
  // Simulated engagement stats
  likes?: number;
  retweets?: number;
  replies_count?: number;
  views?: number;
  bookmarks?: number;
  isLiked?: boolean;
  isRetweeted?: boolean;
  isBookmarked?: boolean;
  isPublished?: boolean;
  publishedAt?: string;
}

export interface Day {
  day: number;
  day_of_week: string;
  angle: string;
  emotion: string;
  anchor: Anchor;
  posts: Post[];
  floats: FloatPost[];
  anchor_theme?: string;
  preview_points?: string[];
  share_angle?: string;
}

export interface Week {
  week: number;
  intensity: 'LOW' | 'MID' | 'HIGH' | 'MAX';
  intensity_icon: string;
  theme: string;
  tone: string;
  goal: string;
  variance: string;
  floats_this_week: number;
  days: Day[];
}

export interface LedgerEntry {
  id: string;
  date: string;
  dayNumber: number;
  type: string;
  promised: string;
  recipient: string;
  delivered: boolean;
  date_delivered: string;
}

export interface IntensityArc {
  week: number;
  intensity: 'LOW' | 'MID' | 'HIGH' | 'MAX';
  icon: string;
  theme: string;
  tone: string;
  variance: string;
  floats: number;
}

export interface WeeklyAngleMap {
  week: number;
  day: string;
  angle: string;
  emotion: string;
}

export interface PostRole {
  time: string | null;
  role: string;
  goal: string;
  mechanic: string;
}

export interface EthicsLine {
  allowed: string[];
  forbidden: string[];
  test: string;
}

export interface ReferenceData {
  monthly_intensity_arc: IntensityArc[];
  weekly_angle_map: WeeklyAngleMap[];
  post_roles: PostRole[];
  reinforcement_ledger_schema: {
    columns: string[];
    rule: string;
  };
  ethics_line: EthicsLine;
}

export interface AIConfig {
  recommended_model: string;
  fallback_model: string;
  max_tokens_per_post: number;
  max_tokens_float: number;
  temperature_by_week: {
    week_1: number;
    week_2: number;
    week_3: number;
    week_4: number;
  };
  output_format: string;
  language: string;
  persona: string;
  hard_stops: string[];
}

export interface AIPromptLayer {
  tone_signatures: Record<string, any>;
  slot_system_prompts: Record<string, any>;
  float_prompt_pool: Record<string, any>;
  prompt_chain: Record<string, any>;
  self_audit_prompt: Record<string, any>;
  weekly_prompt_briefs: Record<string, any>;
}

export interface CampaignData {
  meta: {
    template: string;
    version: string;
    edition: string;
    account: string;
    platform: string;
    duration_days: number;
    weeks: number;
    marketing_posts_per_day: number;
    marketing_posts_total: number;
    anchor_posts_total: number;
    floating_posts_total: number;
    total_posts: number;
    placeholders_required: number;
    rotation_rule: string;
    changelog?: Record<string, string[]>;
  };
  config: CampaignConfig;
  weeks: Week[];
  reference: ReferenceData;
  ai_config?: AIConfig;
  ai_prompt_layer?: AIPromptLayer;
}

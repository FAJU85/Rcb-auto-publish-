import { CampaignData } from '../types';

export const initialCampaignData: CampaignData = {
  "meta": {
    "template": "Enterprise Monthly Marketing Template",
    "version": "3.0",
    "edition": "Variable Reinforcement + AI Prompt Layer",
    "account": "@r_comic_book",
    "platform": "X",
    "duration_days": 28,
    "weeks": 4,
    "marketing_posts_per_day": 6,
    "marketing_posts_total": 168,
    "anchor_posts_total": 28,
    "floating_posts_total": 32,
    "total_posts": 228,
    "placeholders_required": 0,
    "changelog": {
      "v2_1_to_v3": [
        "Added ai_prompt_layer to every post — system_prompt + user_prompt + generation_rules",
        "Added prompt_variables block per post — dynamic slots the AI fills at generation time",
        "Added tone_signature per week — instructs the model on voice calibration",
        "Added prompt_chain — links posts within a day so AI maintains narrative continuity",
        "Added float_prompt_pool — 16 ready-to-generate float prompts by type",
        "Added ai_config block — model settings, temperature by week, output format spec",
        "Added generation_guardrails — AI-specific rules that mirror human guardrails",
        "Added self_audit_prompt — the model audits its own output before you post it",
        "Added weekly_prompt_brief — one-shot brief per week for batch generation"
      ]
    },
    "rotation_rule": "Rotate to Week 1 next month. Reshuffle the float schedule — never repeat the same weather pattern two months running."
  },

  "ai_config": {
    "recommended_model": "claude-sonnet-4-6",
    "fallback_model": "claude-haiku-4-5-20251001",
    "max_tokens_per_post": 120,
    "max_tokens_float": 180,
    "temperature_by_week": {
      "week_1": 0.6,
      "week_2": 0.7,
      "week_3": 0.8,
      "week_4": 0.9
    },
    "output_format": "plain text only — no markdown, no hashtags unless specified, no emojis unless present in the template",
    "language": "English",
    "persona": "You are the voice of @r_comic_book — a food creator who makes visual, comic-style recipes. Your tone is direct, human, and never corporate. You speak like someone who genuinely loves this craft and respects the audience's time. You never beg for engagement. You earn it.",
    "hard_stops": [
      "Never write more than 280 characters per tweet unless it is a thread post",
      "Never manufacture urgency that has no real delivery behind it",
      "Never use the phrase 'Don't miss out' or 'Limited time'",
      "Never open with 'I' as the first word",
      "Never use exclamation marks except inside the Amplify post",
      "Never write a CTA that asks for more than one action per post"
    ]
  },

  "config": {
    "slots": [
      { "slot": 1, "time": "07:30", "status": "fixed",    "role": "Ignite" },
      { "slot": 2, "time": "10:00", "status": "variable", "role": "Build" },
      { "slot": 3, "time": "12:00", "status": "variable", "role": "Build" },
      { "slot": 4, "time": "16:00", "status": "fixed",    "role": "Tease" },
      { "slot": 5, "time": "18:00", "status": "fixed",    "role": "Anchor Drop" },
      { "slot": 6, "time": "19:00", "status": "fixed",    "role": "Amplify" },
      { "slot": 7, "time": "22:00", "status": "fixed",    "role": "Close" },
      { "slot": "FLOAT", "time": null, "status": "variable", "role": "Floating" }
    ],

    "reinforcement_pool": [
      { "code": "I",  "name": "Ignite",    "schedule": "fixed_interval",    "slot": 1,          "jackpot": null },
      { "code": "T",  "name": "Tease",     "schedule": "fixed_interval",    "slot": 4,          "jackpot": null },
      { "code": "A",  "name": "Amplify",   "schedule": "fixed_interval",    "slot": 6,          "jackpot": null },
      { "code": "L",  "name": "Close",     "schedule": "fixed_interval",    "slot": 7,          "jackpot": null },
      { "code": "R",  "name": "Anchor",    "schedule": "fixed_interval",    "slot": 5,          "jackpot": null },
      { "code": "Q",  "name": "Question",  "schedule": "variable_ratio",    "slot": "2|3",      "jackpot": "low" },
      { "code": "P",  "name": "Poll",      "schedule": "variable_ratio",    "slot": "2|3",      "jackpot": "low" },
      { "code": "B",  "name": "Build",     "schedule": "fixed_interval",    "slot": "2|3",      "jackpot": "low" },
      { "code": "X",  "name": "Cut",       "schedule": "variable_interval", "slot": "2",        "jackpot": "low" },
      { "code": "C",  "name": "Callback",  "schedule": "variable_interval", "slot": "3",        "jackpot": "low" },
      { "code": "M",  "name": "Mystery",   "schedule": "variable_ratio",    "slot": "2|float",  "jackpot": "medium", "max_per_week": 2 },
      { "code": "S",  "name": "Spotlight", "schedule": "variable_ratio",    "slot": "float",    "jackpot": "medium", "max_per_week": 4 },
      { "code": "D",  "name": "Drop",      "schedule": "variable_interval", "slot": "float",    "jackpot": "medium", "max_per_week": 4 },
      { "code": "Re", "name": "Receipt",   "schedule": "variable_ratio",    "slot": "float",    "jackpot": "high",   "max_per_week": 3 },
      { "code": "G",  "name": "Ghost",     "schedule": "variable_interval", "slot": "float",    "jackpot": "high",   "max_per_week": 2 },
      { "code": "V",  "name": "Vault",     "schedule": "variable_interval", "slot": "float",    "jackpot": "max",    "max_per_week": 1, "restriction": "Week 4 only" }
    ],

    "reply_policy": "I read every single one. I reply to the ones that stop me.",

    "guardrails": {
      "reward_must_be_real": true,
      "no_manufactured_scarcity": true,
      "never_vary_the_spine": true,
      "anchor_never_blended_with_marketing": true,
      "float_never_lands_on_slot_time": true,
      "no_two_floats_same_day_same_hour": true,
      "ledger_required": true,
      "no_placeholders": true
    },

    "reward_ladder": {
      "weeks_1_2": ["personalized recommendation", "name-drop in a later post"],
      "week_3": ["written mini-guide for the recipient's specific situation"],
      "week_4": ["public shoutout", "custom write-up built around the recipient's reply"]
    },

    "generation_guardrails": {
      "ai_must_read_day_context_before_generating": true,
      "ai_must_check_prompt_chain_before_slot_3": true,
      "ai_output_must_pass_self_audit_before_use": true,
      "ai_must_not_invent_promises_not_in_template": true,
      "ai_must_not_repeat_hook_pattern_used_yesterday": true,
      "ai_character_limit_enforced": 280,
      "ai_float_character_limit_enforced": 400
    }
  },

  "ai_prompt_layer": {
    "tone_signatures": {
      "week_1": {
        "label": "Seed",
        "voice": "Warm, unhurried, curious. You are meeting someone for the first time. Never push. Let them come to you.",
        "sentence_length": "short to medium",
        "confidence_level": "low — you suggest, you invite, you wonder aloud",
        "forbidden_words": ["challenge", "prove", "master", "authority", "wrong"],
        "example_opener": "If you've ever looked at something and thought..."
      },
      "week_2": {
        "label": "Grow",
        "voice": "Confident, direct, a little provocative. You know what you're talking about and you're not shy about it. Still approachable.",
        "sentence_length": "short, punchy, some fragments",
        "confidence_level": "medium — you assert, you challenge gently, you reframe",
        "forbidden_words": ["maybe", "perhaps", "just", "simply", "easy"],
        "example_opener": "There's one thing you've been doing wrong..."
      },
      "week_3": {
        "label": "Peak",
        "voice": "Bold, authoritative. You have earned the right to speak plainly. No hedging. No softening. Direct value, direct truth.",
        "sentence_length": "mix of very short declarations and one medium elaboration",
        "confidence_level": "high — you declare, you contrast, you name the thing others avoid",
        "forbidden_words": ["I think", "might", "could be", "kind of", "sort of"],
        "example_opener": "This is the technique professionals use..."
      },
      "week_4": {
        "label": "Lock",
        "voice": "Permanent. Like you are writing something someone will save. Calm authority. The confidence of someone who has already delivered.",
        "sentence_length": "short. declarative. final.",
        "confidence_level": "max — you state, you close, you make it irreversible",
        "forbidden_words": ["try", "attempt", "see if", "maybe next time"],
        "example_opener": "Month done. You showed up..."
      }
    },

    "slot_system_prompts": {
      "ignite": {
        "role": "Ignite — Slot 1 — 07:30",
        "system_prompt": "You are writing the first post of the day for @r_comic_book on X. This post stops the scroll. It opens a curiosity gap that will not be closed until the anchor drops at 6 PM. It must be 3 lines maximum. Line 1: a statement or observation that creates friction or surprise. Line 2: one sentence that deepens or pivots. Line 3: one short line with a 👀 emoji. Never reveal the recipe. Never mention the time. Never use the word 'recipe'.",
        "user_prompt": "Write an Ignite post for {day_of_week}, Week {week_number}. Today's psychological angle is: {angle}. The target emotion is: {emotion}. The intensity level is: {intensity}. Apply the Week {week_number} tone signature. Output only the tweet text. No labels. No explanations.",
        "prompt_variables": ["day_of_week", "week_number", "angle", "emotion", "intensity"],
        "generation_rules": [
          "Max 3 lines",
          "Must end with 👀",
          "Must not mention time or recipe directly",
          "First word must not be 'I'",
          "Curiosity gap must be present — never resolve it in this post"
        ]
      },
      "build_q": {
        "role": "Build (Question) — Slot 2 — 10:00",
        "system_prompt": "You are writing a Build post for @r_comic_book. This post asks one question that forces the audience to think about their own behavior, habit, or belief related to cooking. The question must feel personal, not academic. It must make the reader want to answer. End with a reply CTA using 👇. Never ask two questions. Never answer the question in the post.",
        "user_prompt": "Write a Build Question post for {day_of_week}, Week {week_number}. Angle: {angle}. Emotion: {emotion}. The question should connect to today's anchor content: {anchor_theme}. Apply Week {week_number} tone. Output only the tweet. No labels.",
        "prompt_variables": ["day_of_week", "week_number", "angle", "emotion", "anchor_theme"],
        "generation_rules": [
          "Exactly one question",
          "Must end with 👇",
          "Must feel personal — about the reader's experience, not general knowledge",
          "Should create mild self-reflection or mild discomfort",
          "Never answer your own question"
        ]
      },
      "build_b": {
        "role": "Build (Statement) — Slot 3 — 12:00",
        "system_prompt": "You are writing the second Build post of the day for @r_comic_book. This post is a statement, not a question. It escalates the curiosity built in Slot 2 by adding a second layer: a truth, a reframe, or a tension. It must end with a time-lock pointing to 6 PM and a 🔔 emoji. It connects to what was said in Slot 2 without repeating it.",
        "user_prompt": "Write a Build Statement post for {day_of_week}, Week {week_number}. Angle: {angle}. Emotion: {emotion}. Anchor theme: {anchor_theme}. Slot 2 was about: {slot_2_summary}. Escalate without repeating. End with the 6 PM lock. Apply Week {week_number} tone. Output only the tweet.",
        "prompt_variables": ["day_of_week", "week_number", "angle", "emotion", "anchor_theme", "slot_2_summary"],
        "generation_rules": [
          "No question — statements only",
          "Must reference 6 PM and include 🔔",
          "Must not repeat the Slot 2 framing",
          "Should feel like a second push — more specific than Slot 2",
          "Max 4 lines"
        ]
      },
      "tease": {
        "role": "Tease — Slot 4 — 16:00",
        "system_prompt": "You are writing the Tease post for @r_comic_book — the last post before the anchor drops at 6 PM. This post previews the anchor using 3 bullet points starting with ✦. Each bullet reveals a real benefit without giving away the execution. It ends with a Bookmark CTA using ⬇️. The bullets must be specific enough to feel valuable but vague enough to require seeing the actual content.",
        "user_prompt": "Write a Tease post for {day_of_week}, Week {week_number}. Anchor theme: {anchor_theme}. The three things to preview are: {preview_point_1}, {preview_point_2}, {preview_point_3}. Apply Week {week_number} tone. Output only the tweet.",
        "prompt_variables": ["day_of_week", "week_number", "anchor_theme", "preview_point_1", "preview_point_2", "preview_point_3"],
        "generation_rules": [
          "Exactly 3 bullet points using ✦",
          "Must end with ⬇️ Bookmark CTA",
          "Each bullet: specific enough to feel real, vague enough to require the anchor",
          "No questions",
          "No time references — that moment has passed"
        ]
      },
      "amplify": {
        "role": "Amplify — Slot 6 — 19:00",
        "system_prompt": "You are writing the Amplify post for @r_comic_book — posted one hour after the anchor drops. This post acknowledges the anchor is live and activates sharing behavior. It rewards people who acted early (saved, bookmarked) and creates social pressure to share by connecting it to other people the reader cares about. End with a Tag or Reply CTA using 👇.",
        "user_prompt": "Write an Amplify post for {day_of_week}, Week {week_number}. Anchor theme: {anchor_theme}. The social sharing angle is: {share_angle}. Apply Week {week_number} tone. Output only the tweet.",
        "prompt_variables": ["day_of_week", "week_number", "anchor_theme", "share_angle"],
        "generation_rules": [
          "Must open with confirmation anchor is live (🎉 allowed here)",
          "Must reward early action implicitly",
          "Must end with 👇",
          "CTA must ask for only one action: tag OR reply, not both",
          "No more than 4 lines"
        ]
      },
      "close": {
        "role": "Close — Slot 7 — 22:00",
        "system_prompt": "You are writing the Close post for @r_comic_book — the last post of the day. This post does two things: (1) it closes today with a single-sentence reflection or truth, and (2) it opens a cliffhanger for tomorrow that makes following feel essential. It must end with 🔔. It must not summarize everything — it lands on one specific thing and leaves everything else implied.",
        "user_prompt": "Write a Close post for {day_of_week}, Week {week_number}. Today's angle was: {angle}. Tomorrow's angle is: {tomorrow_angle}. Tomorrow's emotion is: {tomorrow_emotion}. Apply Week {week_number} tone. Create a cliffhanger that makes not following feel like a loss. Output only the tweet.",
        "prompt_variables": ["day_of_week", "week_number", "angle", "tomorrow_angle", "tomorrow_emotion"],
        "generation_rules": [
          "Max 5 lines",
          "Must end with 🔔",
          "Today's close: one sentence only",
          "Tomorrow's hook: specific enough to feel real, vague enough to require showing up",
          "Never use the phrase 'Don't miss it' — show what they'd miss instead"
        ]
      }
    },

    "float_prompt_pool": {
      "description": "Prompts for generating each float type. Floats are unannounced and unpredictable. The AI generates them using the context of the day and week. They must never feel scheduled.",
      "types": {
        "G": {
          "name": "Ghost",
          "system_prompt": "You are writing a Ghost float for @r_comic_book. A Ghost float is a post that appears at an irregular time with no setup. It must feel like a private thought that leaked — not a scheduled post. It references the current moment (time of day, day of week) to feel unplanned. It may tease tomorrow or simply observe something true. It must never feel like marketing.",
          "user_prompt": "Write a Ghost float for Day {day_number} of the month, {day_of_week}, at approximately {float_time}. Week {week_number} intensity. The day's angle is {angle}. Make it feel like an unscheduled thought, not a post. Max 5 lines. Output only the tweet.",
          "prompt_variables": ["day_number", "day_of_week", "float_time", "week_number", "angle"],
          "max_per_week": 2,
          "character_limit": 400
        },
        "S": {
          "name": "Spotlight",
          "system_prompt": "You are writing a Spotlight float for @r_comic_book. A Spotlight float amplifies a real or representative reply from the audience. It makes one follower feel seen without embarrassing them. It signals to everyone else that their replies matter and are actually read. It must not quote the reply directly — it paraphrases or references it without identifying details unless they are general.",
          "user_prompt": "Write a Spotlight float for Day {day_number}, Week {week_number}. The reply being spotlighted was about: {reply_theme}. The emotional tone of the reply was: {reply_emotion}. Do not quote directly. Make the spotlight feel earned and specific. Connect it to the broader month narrative. Output only the tweet.",
          "prompt_variables": ["day_number", "week_number", "reply_theme", "reply_emotion"],
          "max_per_week": 4,
          "character_limit": 400
        },
        "D": {
          "name": "Drop",
          "system_prompt": "You are writing a Drop float for @r_comic_book. A Drop is an unannounced post that delivers one specific, standalone piece of value — an observation, a principle, or a micro-insight about cooking or craft. It does not need to connect to today's anchor. It must be complete in itself. It must not end with a CTA or ask anything of the reader.",
          "user_prompt": "Write a Drop float for Day {day_number}, Week {week_number}. Week tone: {week_tone}. The insight should relate loosely to: {week_theme}. It must be self-contained. No CTA. No emoji required. Max 4 lines. Output only the tweet.",
          "prompt_variables": ["day_number", "week_number", "week_tone", "week_theme"],
          "max_per_week": 4,
          "character_limit": 400
        },
        "Re": {
          "name": "Receipt",
          "system_prompt": "You are writing a Receipt float for @r_comic_book. A Receipt is proof that someone actually used the content — they made something, they tried something, they changed something. It is social proof without being promotional. It must feel human, not like a testimonial. Reference the result without exaggerating it. Invite others to share their own results.",
          "user_prompt": "Write a Receipt float for Day {day_number}, Week {week_number}. The result being referenced is: {result_description}. Emotion: {result_emotion}. Do not oversell it. Make it feel like one specific moment, not a pattern. End with an invitation for others to share theirs using 👇. Output only the tweet.",
          "prompt_variables": ["day_number", "week_number", "result_description", "result_emotion"],
          "max_per_week": 3,
          "character_limit": 400
        },
        "M": {
          "name": "Mystery",
          "system_prompt": "You are writing a Mystery float for @r_comic_book. A Mystery float offers something real — a personalized recommendation, a specific answer, a custom response — to the first N people who reply. The reward must be something you can actually deliver in a reply. Never promise something that requires infrastructure. The number must be small (3–7). The offer must feel personal, not promotional.",
          "user_prompt": "Write a Mystery float for Day {day_number}, Week {week_number}. The offer is: {mystery_offer}. The number of recipients: {recipient_count}. The qualifying action: {qualifying_action}. Make it feel like an experiment, not a giveaway. Output only the tweet.",
          "prompt_variables": ["day_number", "week_number", "mystery_offer", "recipient_count", "qualifying_action"],
          "max_per_week": 2,
          "character_limit": 400
        },
        "V": {
          "name": "Vault",
          "system_prompt": "You are writing the Vault float for @r_comic_book. The Vault appears once per month, in Week 4 only. It delivers the most valuable thing of the entire month — a full framework, a complete guide, or the single insight that ties everything together. It must feel like something being unlocked, not announced. It must be saveable. End with a Bookmark CTA. This is the jackpot post of the month.",
          "user_prompt": "Write the Vault float for the final week. The vault content is: {vault_content_description}. Make it feel earned — like the reader had to show up all month to receive this. Frame the opening as something being unlocked right now. End with a save CTA. Max 8 lines. Output only the tweet.",
          "prompt_variables": ["vault_content_description"],
          "max_per_week": 1,
          "restriction": "Week 4 only",
          "character_limit": 560
        }
      }
    },

    "prompt_chain": {
      "description": "Narrative continuity rules. The AI must read Slot 2 output before generating Slot 3. The AI must read the day's Close before generating the next day's Ignite.",
      "chain_rules": [
        { "trigger": "before_slot_3",    "read": "slot_2_output",           "instruction": "Do not repeat the framing from Slot 2. Escalate it." },
        { "trigger": "before_slot_1_next_day", "read": "slot_7_output",     "instruction": "The Ignite must open a new gap — never re-open yesterday's gap. Yesterday was closed." },
        { "trigger": "before_float_S",   "read": "day_replies",             "instruction": "Spotlight must reference a real or representative reply from today's posts." },
        { "trigger": "before_float_Re",  "read": "previous_anchor_results", "instruction": "Receipt must reference an actual result — do not invent specifics." }
      ]
    },

    "self_audit_prompt": {
      "description": "Run this prompt on every generated post before publishing. If any answer is NO, regenerate.",
      "system_prompt": "You are a content quality auditor for @r_comic_book. You will receive a post and evaluate it against the rules below. Answer each question with YES or NO and one sentence of reasoning. If any answer is NO, flag the post for regeneration.",
      "audit_questions": [
        "Does this post serve the reader — not just the account?",
        "Is the CTA asking for exactly one action?",
        "Is there a real reward behind any promise made in this post?",
        "Does the hook create a genuine curiosity gap — not manufactured anxiety?",
        "Is the character count within the limit for this post type?",
        "Does this post feel human — not like it was written by a scheduler?",
        "Does this post avoid repeating the hook pattern used in the previous post of the same slot?",
        "If this post makes a claim — is the claim specific and defensible?"
      ],
      "user_prompt": "Audit the following post for @r_comic_book.\n\nPost type: {post_type}\nWeek: {week_number}\nSlot: {slot}\n\nPost text:\n{post_text}\n\nAnswer each audit question. Flag YES or NO. If any NO — return REGENERATE and explain which rule failed."
    },

    "weekly_prompt_briefs": {
      "description": "One-shot briefs for batch generation of an entire week. Feed this to the AI with the day map to generate all 42 posts in one session.",
      "week_1": {
        "brief": "You are generating all marketing posts for Week 1 of @r_comic_book's monthly content calendar. This week's theme is SEED. Your job is to make new followers feel like they discovered something rare — not like they signed up for content. Tone: warm, unhurried, curious. Never push. Every post this week is an invitation, not a pitch. The audience this week includes people who have never interacted with this account before. Make them feel welcome before you make them feel anything else. Apply the Ignite, Build Q, Build B, Tease, Amplify, and Close prompts for each day. Use the weekly angle map for day-by-day psychological targeting.",
        "temperature": 0.6,
        "days": ["First Impression", "Invitation", "Surprise", "Connection", "Ease", "Exploration", "Reset"]
      },
      "week_2": {
        "brief": "You are generating all marketing posts for Week 2 of @r_comic_book's monthly content calendar. This week's theme is GROW. The audience now has 7 days of context. They have seen the quality. Now you challenge them. Tone: confident, direct, mildly provocative. You are no longer introducing yourself. You are building on trust already established. Every post this week assumes the reader has been here before and asks more of them. Apply the full slot system. Use the weekly angle map.",
        "temperature": 0.7,
        "days": ["Challenge", "Reframe", "Myth-Busting", "Depth", "Payoff", "Experiment", "Consolidation"]
      },
      "week_3": {
        "brief": "You are generating all marketing posts for Week 3 of @r_comic_book's monthly content calendar. This week's theme is PEAK. The audience has been with you for two weeks. They trust you. Now you establish authority — not by claiming it, but by demonstrating it. Tone: bold, declarative, urgent. This is the week where the account becomes the definitive source. Every post this week should make following feel like an obvious choice to anyone who sees it for the first time. Apply the full slot system.",
        "temperature": 0.8,
        "days": ["Authority", "Technique", "Mastery", "Showpiece", "Identity Shift", "Teach", "Reflection"]
      },
      "week_4": {
        "brief": "You are generating all marketing posts for Week 4 of @r_comic_book's monthly content calendar. This week's theme is LOCK. The audience has completed three weeks. This week's job is permanence — making the habits formed this month stick, making the follow irreversible, making the account feel like something they cannot imagine not having. Tone: calm, final, declarative. Do not push. You have earned this. Every post this week closes something and opens the door for next month. The Vault drops this week — treat it with weight.",
        "temperature": 0.9,
        "days": ["Permanence", "Multiplier", "Resourcefulness", "Legacy", "Celebration", "Ritual", "Return"]
      }
    }
  },

  "weeks": [
    {
      "week": 1,
      "intensity": "LOW",
      "intensity_icon": "🔵",
      "theme": "Seed",
      "tone": "Inviting, curious, gentle",
      "goal": "Build curiosity in new followers",
      "variance": "LOW",
      "floats_this_week": 2,
      "days": [
        {
          "day": 1, "day_of_week": "Monday", "angle": "First Impression", "emotion": "Welcome",
          "anchor_theme": "the 3-minute perfectly scrambled egg (comic-strip style)",
          "preview_points": [
            "the optical heat trick that prevents burning",
            "why whisking before cooking ruins the texture",
            "the exact second to pull the pan off the burner"
          ],
          "share_angle": "tag someone who claims they cannot even boil an egg",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #1", "format": "visual/carousel", "note": "Never blended with marketing." },
          "posts": [
            {
              "id": "w1d1p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed",
              "text": "If you've ever looked at something and thought \"that's too complicated\" —\n\nThis account exists for you.\n\nStay a while. 👀",
              "ai_prompt_ref": "ignite",
              "prompt_variables": {
                "day_of_week": "Monday",
                "week_number": 1,
                "angle": "First Impression",
                "emotion": "Welcome",
                "intensity": "LOW"
              }
            },
            {
              "id": "w1d1p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable",
              "text": "Quick question for a Monday morning:\n\nWhat's the one thing you keep telling yourself you'll learn to do — but never do?\n\nDrop it below. I read every single one. 👇",
              "ai_prompt_ref": "build_q",
              "prompt_variables": {
                "day_of_week": "Monday",
                "week_number": 1,
                "angle": "First Impression",
                "emotion": "Welcome",
                "anchor_theme": "the 3-minute perfectly scrambled egg (comic-strip style)"
              }
            },
            {
              "id": "w1d1p3", "slot": 3, "time": "12:00", "role": "Build", "type": "B", "status": "variable",
              "text": "The thing about this that no one tells you:\n\nIt's not about skill. It's about confidence.\n\nToday's drop is for anyone who needs a small win.\n\n🔔 6 PM.",
              "ai_prompt_ref": "build_b",
              "prompt_variables": {
                "day_of_week": "Monday",
                "week_number": 1,
                "angle": "First Impression",
                "emotion": "Welcome",
                "anchor_theme": "the 3-minute perfectly scrambled egg (comic-strip style)",
                "slot_2_summary": "Asking followers about the cooking skill they keep putting off learning."
              }
            },
            {
              "id": "w1d1p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed",
              "text": "Coming at 6:\n\n✦ Something that takes less time than you'd expect\n✦ Step-by-step — nothing assumed\n✦ One small thing that changes the result completely\n\nSave this so you don't lose it in your feed. ⬇️",
              "ai_prompt_ref": "tease",
              "prompt_variables": {
                "day_of_week": "Monday",
                "week_number": 1,
                "anchor_theme": "the 3-minute perfectly scrambled egg (comic-strip style)",
                "preview_point_1": "the optical heat trick that prevents burning",
                "preview_point_2": "why whisking before cooking ruins the texture",
                "preview_point_3": "the exact second to pull the pan off the burner"
              }
            },
            {
              "id": "w1d1p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed",
              "text": "It's live. 🎉\n\nYour first drop of the week — and one of the easiest ones I've ever shared.\n\nTry it tonight and tell me how it went. 👇",
              "ai_prompt_ref": "amplify",
              "prompt_variables": {
                "day_of_week": "Monday",
                "week_number": 1,
                "anchor_theme": "the 3-minute perfectly scrambled egg (comic-strip style)",
                "share_angle": "tag someone who claims they cannot even boil an egg"
              }
            },
            {
              "id": "w1d1p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed",
              "text": "Day one done.\n\nIf you're new here — welcome. This is what we do every day.\n\nTomorrow brings something a little different.\n\n🔔 Be here.",
              "ai_prompt_ref": "close",
              "prompt_variables": {
                "day_of_week": "Monday",
                "week_number": 1,
                "angle": "First Impression",
                "tomorrow_angle": "Invitation",
                "tomorrow_emotion": "Belonging"
              }
            }
          ],
          "floats": []
        },
        {
          "day": 2, "day_of_week": "Tuesday", "angle": "Invitation", "emotion": "Belonging",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #2", "format": "visual/carousel" },
          "posts": [
            { "id": "w1d2p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Most accounts show you the result.\n\nWe show you the thinking behind it.\n\nThat's the difference. 👀" },
            { "id": "w1d2p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable", "text": "Tell me something:\n\nDo you do this because you enjoy it — or because you have to?\n\nNo wrong answer. Just curious.\n\n👇 Reply below." },
            { "id": "w1d2p3", "slot": 3, "time": "12:00", "role": "Build", "type": "B", "status": "variable", "text": "Whether you're here for joy or out of necessity —\n\nToday's drop will make you feel something in between.\n\n🔔 6 PM. Don't scroll past it." },
            { "id": "w1d2p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "6 PM preview:\n\n✦ Something that works for both weeknights and weekends\n✦ The format that makes it impossible to overthink\n✦ Why this one actually gets used — not just saved\n\nBookmark it now. ⬇️" },
            { "id": "w1d2p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "Live now. 🎉\n\nThis one's for the people who show up even when they're tired.\n\nYou deserve something good tonight. 👇" },
            { "id": "w1d2p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Tuesday wrapped.\n\nTwo days in and we're just warming up.\n\nTomorrow I'm sharing something a little more unexpected.\n\n🔔 Set the reminder." }
          ],
          "floats": []
        },
        {
          "day": 3, "day_of_week": "Wednesday", "angle": "Surprise", "emotion": "Curiosity",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #3", "format": "visual/carousel" },
          "posts": [
            { "id": "w1d3p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "There's something most people walk past every day.\n\nThey don't know it's there.\n\nShowing you today. 👀" },
            { "id": "w1d3p2", "slot": 2, "time": "10:00", "role": "Build", "type": "P", "status": "variable", "text": "Honest question:\n\nHow often do you actually use the things you save?\n\nA) Same day\nB) Within a week\nC) I have a graveyard of saved posts\n\nNo judgment — just data. 👇" },
            { "id": "w1d3p3", "slot": 3, "time": "12:00", "role": "Build", "type": "Q", "status": "variable", "text": "Today's drop is different because it's built to actually get used.\n\nNot just saved. Not just admired.\n\nUsed. Tonight. By you.\n\n🔔 6 PM." },
            { "id": "w1d3p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "What's landing at 6:\n\n✦ Something most people already have what they need for\n✦ No special tools. No rare items.\n✦ The breakdown that removes every excuse\n\nSave this. Your Wednesday evening just got decided. ⬇️" },
            { "id": "w1d3p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "It's up. 🎉\n\nLook around right now — I'll bet you already have everything you need.\n\nTry it tonight. Tell me what happened. 👇" },
            { "id": "w1d3p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Wednesday done.\n\nHalf the week gone — and you've already learned three things most people don't know.\n\nTomorrow's one of my favorites.\n\n🔔 Don't miss it." }
          ],
          "floats": [
            { "id": "w1d3f1", "time": "20:41", "role": "Floating", "type": "G", "status": "floating", "announced": false, "text": "8:41 PM.\n\nIf you're seeing this right now, you're the kind of person this account is for.\n\nTomorrow's drop involves something you probably already have and never think about.\n\nGo to sleep. 🔔" }
          ]
        },
        {
          "day": 4, "day_of_week": "Thursday", "angle": "Connection", "emotion": "Warmth",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #4", "format": "visual/carousel" },
          "posts": [
            { "id": "w1d4p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "The best things aren't always the most impressive ones.\n\nThey're the ones that remind you of something.\n\nToday's is one of those. 👀" },
            { "id": "w1d4p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable", "text": "What takes you straight back to a memory?\n\nA place. A person. A moment.\n\nI'd love to hear yours. 👇" },
            { "id": "w1d4p3", "slot": 3, "time": "12:00", "role": "Build", "type": "B", "status": "variable", "text": "This is memory in edible form.\n\nToday's drop is built to become one of yours.\n\n🔔 6 PM — be there." },
            { "id": "w1d4p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "Before 6 PM — here's what's coming:\n\n✦ Something comforting with a twist\n✦ The kind that makes a quiet evening feel intentional\n✦ One step that makes all the difference\n\nSave it now. ⬇️" },
            { "id": "w1d4p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "It's live. 🎉\n\nThis one was made to be shared — with someone, not just on social media.\n\nWho would you share this with? 👇" },
            { "id": "w1d4p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Thursday night.\n\nFour days in — and this is becoming a habit for some of you.\n\nGood. That's the point.\n\nTomorrow's a reward. 🔔" }
          ],
          "floats": []
        },
        {
          "day": 5, "day_of_week": "Friday", "angle": "Ease", "emotion": "Relief",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #5", "format": "visual/carousel" },
          "posts": [
            { "id": "w1d5p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Friday rule:\n\nYou should never spend more than 20 minutes on this tonight.\n\nHere's how to do it right. 👀" },
            { "id": "w1d5p2", "slot": 2, "time": "10:00", "role": "Build", "type": "P", "status": "variable", "text": "Friday poll:\n\nAre you in tonight or out?\n\nAnswer honestly — what I'm sharing at 6 might change your vote. 👇" },
            { "id": "w1d5p3", "slot": 3, "time": "12:00", "role": "Build", "type": "Q", "status": "variable", "text": "What if tonight was actually easier than choosing somewhere to go?\n\nIt can be. And it'll be better.\n\n🔔 6 PM. You'll see." },
            { "id": "w1d5p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "Your Friday evening sorted:\n\n✦ Done before you finish your commute\n✦ Looks like effort. Requires almost none.\n✦ The guide that makes it guaranteed\n\nSave this. Decide at 6. ⬇️" },
            { "id": "w1d5p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "Friday's is live. 🎉\n\nYou still have time to do this tonight.\n\nTag someone who needs an easy Friday. 👇" },
            { "id": "w1d5p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "End of Week 1.\n\nFive days. Five drops. All of them made to be actually used.\n\nWeek 2 starts Monday — and we're turning it up.\n\n🔔 Follow so you don't miss the shift." }
          ],
          "floats": []
        },
        {
          "day": 6, "day_of_week": "Saturday", "angle": "Exploration", "emotion": "Adventure",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #6", "format": "visual/carousel" },
          "posts": [
            { "id": "w1d6p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Saturday is the only day you have real time.\n\nUse it well.\n\nHere's what I'd do. 👀" },
            { "id": "w1d6p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable", "text": "Saturday experiment:\n\nWhat's one thing you've bought but never actually used properly?\n\nDrop it. I'll tell you what to do with it. 👇" },
            { "id": "w1d6p3", "slot": 3, "time": "12:00", "role": "Build", "type": "P", "status": "variable", "text": "Real quick before the drop:\n\nHow often do you actually make time for this on a Saturday?\n\nA) Every week\nB) When I remember\nC) Saturdays are for takeout\n\nNo judgment. Just data. 👇" },
            { "id": "w1d6p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "Saturday's 6 PM delivery:\n\n✦ Something worth taking your time with\n✦ The approach that makes Saturday feel different\n✦ Steps that let you enjoy the process, not just the result\n\nSave this. Clear an hour. ⬇️" },
            { "id": "w1d6p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "It's live. 🎉\n\nThis is the kind that makes Saturday feel like Saturday.\n\nTry it. Tell me how it went. 👇" },
            { "id": "w1d6p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Saturday done.\n\nIf you made something today — you used your weekend well.\n\nTomorrow is Sunday. I'm posting something slower and more intentional.\n\n🔔 It's worth waking up for." }
          ],
          "floats": [
            { "id": "w1d6f1", "time": "21:07", "role": "Floating", "type": "S", "status": "floating", "announced": false, "text": "One of you just replied to the 10 AM post with something I wasn't expecting.\n\nI'm not going to quote it — it was specific enough that you'll know who you are.\n\nTomorrow I'm building something around it.\n\nThat's how this works. Say the thing. I'll answer it." }
          ]
        },
        {
          "day": 7, "day_of_week": "Sunday", "angle": "Reset", "emotion": "Peace",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #7", "format": "visual/carousel" },
          "posts": [
            { "id": "w1d7p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Sunday isn't about impressing anyone.\n\nIt's about resetting.\n\nHere's the one for that. 👀" },
            { "id": "w1d7p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable", "text": "End of Week 1 question:\n\nWhat was the best thing you ate this week — homemade or not?\n\nTell me. 👇" },
            { "id": "w1d7p3", "slot": 3, "time": "12:00", "role": "Build", "type": "C", "status": "variable", "text": "Someone asked me something last night I wasn't expecting.\n\nTonight's drop answers it — and it fits Sunday better than I expected.\n\n🔔 6 PM." },
            { "id": "w1d7p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "Coming at 6 — your Sunday drop:\n\n✦ Simple enough for a slow morning, good enough for guests\n✦ The kind that becomes a weekly ritual\n✦ A walkthrough that makes it second nature\n\nBookmark this. It'll earn its place. ⬇️" },
            { "id": "w1d7p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "Sunday's is live. 🎉\n\nThis one gets better every time you do it.\n\nShare it with someone who needs a good Sunday. 👇" },
            { "id": "w1d7p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Week 1 is done.\n\nYou showed up. You learned. You made something.\n\nWeek 2 starts Monday — and everything gets more interesting from here.\n\n🔔 Be here Monday morning." }
          ],
          "floats": []
        }
      ]
    },

    {
      "week": 2,
      "intensity": "MID",
      "intensity_icon": "🟡",
      "theme": "Grow",
      "tone": "Confident, direct, engaging",
      "goal": "Convert passive followers into active participants",
      "variance": "RISING",
      "floats_this_week": 5,
      "days": [
        {
          "day": 8, "day_of_week": "Monday", "angle": "Challenge", "emotion": "Drive",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #8", "format": "visual/carousel" },
          "posts": [
            { "id": "w2d1p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Week 2.\n\nLast week was warm-up. This week we actually challenge you.\n\nReady? 👀" },
            { "id": "w2d1p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable", "text": "Monday challenge:\n\nDo something this week you've never done before.\n\nJust one thing. That's it.\n\nToday's drop is the easiest place to start. 👇" },
            { "id": "w2d1p3", "slot": 3, "time": "12:00", "role": "Build", "type": "B", "status": "variable", "text": "The difference between someone who can and someone who can't?\n\nThe second person stopped trying after one failure.\n\nToday's drop is impossible to fail at.\n\n🔔 6 PM. Prove it to yourself." },
            { "id": "w2d1p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "6 PM — here's your challenge:\n\n✦ Something designed to be attempted, not admired\n✦ Why it works even when you rush it\n✦ The guide that removes every excuse not to try\n\nSave it. Try it. Report back. ⬇️" },
            { "id": "w2d1p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "Challenge accepted? It's live. 🎉\n\nThe only rule: actually do it — not just save it.\n\nWho's in tonight? Reply with 👨🍳 if you are. 👇" },
            { "id": "w2d1p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Monday done.\n\nWeek 2 started with a challenge. The rest of the week builds on it.\n\nTomorrow — something that will change how you think about one thing you use every day.\n\n🔔 Don't skip it." }
          ],
          "floats": [
            { "id": "w2d1f1", "time": "14:33", "role": "Floating", "type": "S", "status": "floating", "announced": false, "text": "Someone replied to this morning's challenge with:\n\n\"I've never done this before. I'm going to try tonight.\"\n\nThat's the whole post. That's it. Somebody is doing something tonight who wasn't going to.\n\nReply to any post this week. I'm watching." }
          ]
        },
        {
          "day": 9, "day_of_week": "Tuesday", "angle": "Reframe", "emotion": "Insight",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #9", "format": "visual/carousel" },
          "posts": [
            { "id": "w2d2p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "You've been doing one thing wrong your whole life.\n\nNot dangerously wrong. Just wastefully wrong.\n\nFixing that today. 👀" },
            { "id": "w2d2p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable", "text": "Quick one:\n\nWhat's something you always have but rarely know what to do with?\n\nDrop it below — and check tonight's drop. 👇" },
            { "id": "w2d2p3", "slot": 3, "time": "12:00", "role": "Build", "type": "C", "status": "variable", "text": "The other day someone told me about something sitting unused in their kitchen.\n\nI said I'd build around it.\n\nTonight it happens.\n\n🔔 6 PM." },
            { "id": "w2d2p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "Before 6 — what's coming:\n\n✦ One thing. Three ways you haven't tried.\n✦ Why it works differently when you understand it\n✦ A breakdown — clear, fast, memorable\n\nSave this. Your kitchen just became more interesting. ⬇️" },
            { "id": "w2d2p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "It's live. 🎉\n\nSomething you've been ignoring just earned a second chance.\n\nTag someone who needs to see this. 👇" },
            { "id": "w2d2p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Tuesday done.\n\nTwo days into Week 2 — and we're already rewriting some assumptions.\n\nTomorrow goes further.\n\n🔔 Be here." }
          ],
          "floats": []
        },
        {
          "day": 10, "day_of_week": "Wednesday", "angle": "Myth-Busting", "emotion": "Surprise",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #10", "format": "visual/carousel" },
          "posts": [
            { "id": "w2d3p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "The rule you follow religiously?\n\nThere's a good chance it's wrong.\n\nNot your fault — everyone taught it wrong.\n\nHere's the truth. 👀" },
            { "id": "w2d3p2", "slot": 2, "time": "10:00", "role": "Build", "type": "X", "status": "variable", "text": "Unpopular opinion, and I'll defend it:\n\nMost of the \"rules\" you follow were invented by people who never tested them.\n\nName one. I'll tell you if it holds up. 👇" },
            { "id": "w2d3p3", "slot": 3, "time": "12:00", "role": "Build", "type": "P", "status": "variable", "text": "Today I'm breaking one of the most repeated rules there is.\n\nWith proof. With visuals. With something that shows why it was never necessary.\n\n🔔 6 PM. Bring your skepticism." },
            { "id": "w2d3p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "6 PM — the myth gets broken:\n\n✦ The rule everyone follows but no one tested\n✦ What actually matters vs. what we just assumed\n✦ Built on the truth, not the tradition\n\nSave this. Your logic is about to get an upgrade. ⬇️" },
            { "id": "w2d3p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "Myth officially gone. 🎉\n\nIf you've been following that rule — share this with whoever taught it to you.\n\nRespectfully. 👇" },
            { "id": "w2d3p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Wednesday done.\n\nThree myths down this week. Three better habits in their place.\n\nTomorrow — something that builds on everything we've covered so far.\n\n🔔 Don't miss the connection." }
          ],
          "floats": [
            { "id": "w2d3f1", "time": "23:04", "role": "Floating", "type": "D", "status": "floating", "announced": false, "text": "11:04 PM. No plan for this one. Just:\n\nIf you take one thing from this week — take the version you can actually repeat. Not the impressive one. The repeatable one.\n\nThat's the drop.\n\n(6 PM tomorrow as usual.)" }
          ]
        },
        {
          "day": 11, "day_of_week": "Thursday", "angle": "Depth", "emotion": "Understanding",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #11", "format": "visual/carousel" },
          "posts": [
            { "id": "w2d4p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Every good result has a reason behind every step.\n\nMost people never hear the reason.\n\nWe do. And it changes everything.\n\n👀" },
            { "id": "w2d4p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable", "text": "Do you prefer being told what to do —\n\nOr being told why it matters?\n\nYour answer tells me a lot about how you learn. 👇" },
            { "id": "w2d4p3", "slot": 3, "time": "12:00", "role": "Build", "type": "C", "status": "variable", "text": "Last night's drop got more replies than I expected.\n\nTonight does the same thing — but with the whole picture.\n\n🔔 6 PM." },
            { "id": "w2d4p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "Coming at 6:\n\n✦ Every step explained — not just shown\n✦ The logic that makes you better without instructions next time\n✦ A format that teaches while you do it\n\nSave this. It's more than a drop. ⬇️" },
            { "id": "w2d4p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "It's live — with the full breakdown. 🎉\n\nUse it tonight. Notice the difference.\n\nTag someone who'd benefit from this upgrade. 👇" },
            { "id": "w2d4p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Thursday done.\n\nThis week you've challenged yourself, reframed something, broken a rule, and understood the why.\n\nTomorrow is the reward.\n\n🔔 Be here Friday morning." }
          ],
          "floats": []
        },
        {
          "day": 12, "day_of_week": "Friday", "angle": "Payoff", "emotion": "Satisfaction",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #12", "format": "visual/carousel" },
          "posts": [
            { "id": "w2d5p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Four days of learning.\n\nToday you use it.\n\nFriday's drop is the one that shows you how much you've grown.\n\n👀" },
            { "id": "w2d5p2", "slot": 2, "time": "10:00", "role": "Build", "type": "P", "status": "variable", "text": "Friday test:\n\nWithout looking it up — what's the one thing you learned this week that stuck?\n\nTell me below. 👇" },
            { "id": "w2d5p3", "slot": 3, "time": "12:00", "role": "Build", "type": "Q", "status": "variable", "text": "Tonight's uses everything we covered this week.\n\nOne thing. Every principle applied.\n\nYou're more ready for it than you think.\n\n🔔 6 PM. This is the one." },
            { "id": "w2d5p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "Your Friday payoff at 6:\n\n✦ The one that puts Week 2 to use\n✦ Every step you now understand — applied at once\n✦ The proof that you've already leveled up\n\nSave this. Tonight's the night. ⬇️" },
            { "id": "w2d5p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "Week 2 payoff is live. 🎉\n\nIf you've been following along all week — you're ready for this one.\n\nDo it tonight. This is your Friday earned. 👇" },
            { "id": "w2d5p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Week 2 done.\n\nYou didn't just collect things this week. You actually got better.\n\nWeek 3 starts Monday — and the tone shifts.\n\nWe're moving from learning to leading.\n\n🔔 Be there." }
          ],
          "floats": [
            { "id": "w2d5f1", "time": "15:22", "role": "Floating", "type": "Re", "status": "floating", "announced": false, "text": "Someone did the Wednesday drop.\n\nThey'd never tried the approach before. They sent me a photo and it looks better than mine.\n\nI'm not going to post their photo — they didn't ask me to.\n\nI'm posting this instead: if you've made something from this account in the last two weeks, reply to this. I want to see it.\n\nI'll share a few tomorrow. No warning. 👇" }
          ]
        },
        {
          "day": 13, "day_of_week": "Saturday", "angle": "Experiment", "emotion": "Freedom",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #13", "format": "visual/carousel" },
          "posts": [
            { "id": "w2d6p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Saturday rule:\n\nNothing is final. Everything is a draft.\n\nToday we experiment.\n\n👀" },
            { "id": "w2d6p2", "slot": 2, "time": "10:00", "role": "Build", "type": "X", "status": "variable", "text": "If you could change one thing about the thing you make most often to make it better —\n\nWhat would it be?\n\nDrop it. Today's drop is about exactly that instinct. 👇" },
            { "id": "w2d6p3", "slot": 3, "time": "12:00", "role": "Build", "type": "Q", "status": "variable", "text": "The best people don't follow instructions. They use them as starting points.\n\nToday I'm showing you how to think like that.\n\n🔔 6 PM — bring your curiosity." },
            { "id": "w2d6p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "Saturday's drop lands at 6:\n\n✦ A base + 3 ways to make it yours\n✦ When to follow and when to deviate\n✦ Options — pick your direction\n\nSave this. Do your version. ⬇️" },
            { "id": "w2d6p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "It's live — with variations. 🎉\n\nWhich version are you doing tonight?\n\nReply A, B, or C. 👇" },
            { "id": "w2d6p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Saturday experiment complete.\n\nTomorrow is a reset before Week 3.\n\nRest, reflect, do something slow.\n\n🔔 Monday changes everything." }
          ],
          "floats": [
            { "id": "w2d6f1", "time": "11:48", "role": "Floating", "type": "S", "status": "floating", "announced": false, "text": "Yesterday I asked if you'd made something from this account.\n\nSeven of you sent photos. I said I'd share a few. No warning.\n\nThis is the warning.\n\nOne goes up tonight. The rest tomorrow.\n\nIf you want yours considered — reply to the Friday post. It's still open." }
          ]
        },
        {
          "day": 14, "day_of_week": "Sunday", "angle": "Consolidation", "emotion": "Clarity",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #14", "format": "visual/carousel" },
          "posts": [
            { "id": "w2d7p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Week 2 was about growth.\n\nToday is about making sure it sticks.\n\nOne drop. All the principles. 👀" },
            { "id": "w2d7p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable", "text": "End of Week 2 check-in:\n\nWhat's the most useful thing you learned this week?\n\nEven if it was small. I want to hear it. 👇" },
            { "id": "w2d7p3", "slot": 3, "time": "12:00", "role": "Build", "type": "C", "status": "variable", "text": "The drop I'm sharing tonight is a consolidation one.\n\nIt looks simple. But if you've been following this week — you'll see everything we covered inside it.\n\n🔔 6 PM." },
            { "id": "w2d7p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "Sunday's 6 PM:\n\n✦ One thing that holds everything from this week\n✦ The visual that makes it click all at once\n✦ Why this is the one to repeat until it's second nature\n\nBookmark it. Make it your Sunday staple. ⬇️" },
            { "id": "w2d7p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "The consolidation drop is live. 🎉\n\nDo this every Sunday for a month.\n\nBy Week 4, you'll barely need the steps.\n\nShare it with someone just starting out. 👇" },
            { "id": "w2d7p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Week 2 is officially wrapped.\n\nYou challenged, reframed, questioned, understood, executed, experimented, and consolidated.\n\nWeek 3 is where you become someone others ask for advice.\n\n🔔 Monday. Be there early." }
          ],
          "floats": [
            { "id": "w2d7f1", "time": "20:19", "role": "Floating", "type": "M", "status": "floating", "announced": false, "text": "Experiment:\n\nFirst 5 replies to this get a personalized recommendation built around one thing in their kitchen.\n\nAnything. Any constraint. I'll write it myself.\n\nNo catch. I just want to see who's awake on a Sunday night. 👇" }
          ]
        }
      ]
    },

    {
      "week": 3,
      "intensity": "HIGH",
      "intensity_icon": "🟠",
      "theme": "Peak",
      "tone": "Bold, authoritative, urgent",
      "goal": "Position the account as the definitive source",
      "variance": "HIGH",
      "floats_this_week": 10,
      "days": [
        {
          "day": 15, "day_of_week": "Monday", "angle": "Authority", "emotion": "Confidence",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #15 — The Benchmark", "format": "visual/carousel" },
          "posts": [
            { "id": "w3d1p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Week 3.\n\nNo more easing in. No more gentle suggestions.\n\nThis week I'm telling you exactly what works — and why everything else doesn't.\n\n👀 Let's go." },
            { "id": "w3d1p2", "slot": 2, "time": "10:00", "role": "Build", "type": "X", "status": "variable", "text": "Hot take Monday:\n\nMost advice online is wrong — not because people are lying, but because they've never tested it properly.\n\nWe test everything here.\n\nWhat's the advice you've always doubted? 👇" },
            { "id": "w3d1p3", "slot": 3, "time": "12:00", "role": "Build", "type": "Q", "status": "variable", "text": "Today's drop isn't just good. It's the standard.\n\nThe one you measure other versions against after you try it.\n\n🔔 6 PM. Set the bar." },
            { "id": "w3d1p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "6 PM — the definitive version:\n\n✦ Not \"a\" one. The one.\n✦ Why every other version falls short — explained visually\n✦ The single decision that separates good from perfect\n\nSave this. This is your new benchmark. ⬇️" },
            { "id": "w3d1p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "The benchmark is live. 🎉\n\nDo it once. Then compare it to every version you've had before.\n\nCome back and tell me if anything else competes. 👇" },
            { "id": "w3d1p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Monday done. Week 3 has begun.\n\nThis week you stop asking \"is this good?\" and start knowing.\n\nTomorrow — something that separates people who do this from people who actually know what they're doing.\n\n🔔 Don't miss it." }
          ],
          "floats": [
            { "id": "w3d1f1", "time": "13:07", "role": "Floating", "type": "S", "status": "floating", "announced": false, "text": "Someone replied to the hot take with a doubt I hadn't heard before.\n\nI'm not quoting it — it was specific enough that you'd know.\n\nFair. It's a real gap. Addressing it in tonight's drop.\n\nReply to anything this week. The good ones change what I post." },
            { "id": "w3d1f2", "time": "23:31", "role": "Floating", "type": "D", "status": "floating", "announced": false, "text": "11:31 PM. Not on the schedule.\n\nThere's a difference between knowing the number and knowing the idea. If you can't state the number, you don't have the idea yet.\n\nThat's it.\n\nDrop at 6 tomorrow. 🔔" }
          ]
        },
        {
          "day": 16, "day_of_week": "Tuesday", "angle": "Technique", "emotion": "Competence",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #16 — The Approach", "format": "visual/carousel" },
          "posts": [
            { "id": "w3d2p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "There's one approach that professionals use constantly.\n\nMost people never learn it.\n\nNot because it's hard. Because no one bothered to show them.\n\nChanging that today. 👀" },
            { "id": "w3d2p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable", "text": "If you could learn one thing that would improve everything you make —\n\nWould you take 10 minutes to learn it today?\n\nBecause that's exactly what tonight is.\n\n👇 Reply \"I'm in\" if you want it." },
            { "id": "w3d2p3", "slot": 3, "time": "12:00", "role": "Build", "type": "C", "status": "variable", "text": "Last night I said the thing about numbers.\n\nTonight's is the same idea — something everyone does, nobody measures, and it changes everything.\n\n🔔 6 PM." },
            { "id": "w3d2p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "It drops at 6:\n\n✦ What it is and why it works (the actual science — simplified)\n✦ How to apply it tonight\n✦ How to use it in everything from here on\n\nSave this. It's a permanent upgrade. ⬇️" },
            { "id": "w3d2p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "It's live — with the full breakdown. 🎉\n\nUse it tonight. Notice the difference.\n\nTag someone who'd benefit from this upgrade. 👇" },
            { "id": "w3d2p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Tuesday done.\n\nYou now know something most people don't.\n\nTomorrow we use that knowledge to tackle something that used to feel impossible.\n\n🔔 Be here." }
          ],
          "floats": [
            { "id": "w3d2f1", "time": "21:44", "role": "Floating", "type": "M", "status": "floating", "announced": false, "text": "Experiment:\n\nFirst 5 replies get tonight's approach written out as a step-by-step guide for their specific setup.\n\nWhatever you've got. Tell me what you're working with. 👇" }
          ]
        },
        {
          "day": 17, "day_of_week": "Wednesday", "angle": "Mastery", "emotion": "Control",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #17 — The Fix", "format": "visual/carousel" },
          "posts": [
            { "id": "w3d3p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Mastery isn't about doing things perfectly.\n\nIt's about knowing exactly what to do when things go wrong.\n\nToday I'm teaching you that. 👀" },
            { "id": "w3d3p2", "slot": 2, "time": "10:00", "role": "Build", "type": "X", "status": "variable", "text": "Most mistakes aren't skill problems.\n\nThey're timing problems wearing a skill costume.\n\nName the one that frustrates you most. I'll tell you which it actually is. 👇" },
            { "id": "w3d3p3", "slot": 3, "time": "12:00", "role": "Build", "type": "P", "status": "variable", "text": "The biggest failures all have the same root cause.\n\nOnce you know what it is — you'll stop making that entire category of mistake.\n\n🔔 6 PM. This is the fix." },
            { "id": "w3d3p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "6 PM — the failure fix:\n\n✦ The root cause behind most mistakes\n✦ How tonight trains you to avoid it automatically\n✦ What to do when it happens anyway (because it will)\n\nSave this. Frustration is about to get a lot rarer. ⬇️" },
            { "id": "w3d3p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "The framework is live. 🎉\n\nAfter tonight — mistakes become learning moments, not setbacks.\n\nShare this with someone who gave up after a bad experience. 👇" },
            { "id": "w3d3p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Wednesday done.\n\nThree days into Week 3 — and you're thinking like someone who actually understands this.\n\nTomorrow we apply it to something impressive.\n\n🔔 This one's worth sharing." }
          ],
          "floats": [
            { "id": "w3d3f1", "time": "08:52", "role": "Floating", "type": "S", "status": "floating", "announced": false, "text": "Overnight someone replied to the numbers post with:\n\n\"I've been doing this for twenty years and nobody ever told me the number.\"\n\nTwenty years. One number. That's the whole reason this account exists.\n\nTonight's post is for you specifically." }
          ]
        },
        {
          "day": 18, "day_of_week": "Thursday", "angle": "Showpiece", "emotion": "Pride",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #18 — The Showpiece", "format": "visual/carousel" },
          "posts": [
            { "id": "w3d4p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Today's is the one people ask you about.\n\nThe one that makes them say \"where did you learn that?\"\n\nYou learned it here. 👀" },
            { "id": "w3d4p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable", "text": "What would you most want to be known for doing well?\n\nThat specific thing — the one that would make people remember.\n\nTell me. 👇" },
            { "id": "w3d4p3", "slot": 3, "time": "12:00", "role": "Build", "type": "C", "status": "variable", "text": "Tuesday's approach. Wednesday's framework.\n\nTonight they meet in one thing.\n\nThe kind that has your name on it.\n\n🔔 6 PM." },
            { "id": "w3d4p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "Your showpiece at 6:\n\n✦ Impressive without overwhelming you to make\n✦ The approach from Tuesday applied to maximum effect\n✦ A guide that makes it repeatable every time\n\nSave this. You're going to do this more than once. ⬇️" },
            { "id": "w3d4p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "Yours is live. 🎉\n\nDo it this weekend. Do it for someone.\n\nThen watch their reaction when you say you did it yourself.\n\nTag me when you do. 👇" },
            { "id": "w3d4p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Thursday done.\n\nYou now have a showpiece. An approach. A framework. A benchmark.\n\nTomorrow we talk about what to do with all of it.\n\n🔔 Friday's post is different." }
          ],
          "floats": [
            { "id": "w3d4f1", "time": "17:19", "role": "Floating", "type": "Re", "status": "floating", "announced": false, "text": "Three people have now sent me photos of Tuesday's approach in action.\n\nOne of them used it on something that isn't even from this account. They just applied the idea.\n\nThat's the whole goal. Not following me. Using the thing.\n\nIf you've done that — reply to this. I'm collecting them." },
            { "id": "w3d4f2", "time": "23:52", "role": "Floating", "type": "D", "status": "floating", "announced": false, "text": "11:52 PM. Off-schedule.\n\nIf you're doing the showpiece this weekend — do the setup step first. Before anything else. Before you even start.\n\nIt takes 90 seconds and it's the difference between good and the reason people ask you for the recipe.\n\nThat's it. Go to sleep. 🔔" }
          ]
        },
        {
          "day": 19, "day_of_week": "Friday", "angle": "Identity Shift", "emotion": "Transformation",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #19 — The Earned One", "format": "visual/carousel" },
          "posts": [
            { "id": "w3d5p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "At some point this week — something shifted.\n\nYou stopped thinking \"I'll try this\" and started thinking \"I know how to do this.\"\n\nThat's not a small thing.\n\n👀" },
            { "id": "w3d5p2", "slot": 2, "time": "10:00", "role": "Build", "type": "X", "status": "variable", "text": "Real question:\n\nAfter this week — how would you describe what you can do to someone who asked?\n\nSame as before? Or something different now?\n\nI'll go first if you go first. 👇" },
            { "id": "w3d5p3", "slot": 3, "time": "12:00", "role": "Build", "type": "Q", "status": "variable", "text": "The last three weeks changed what's possible for you.\n\nTonight's is the celebration of that.\n\n🔔 6 PM. You've earned this one." },
            { "id": "w3d5p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "Friday's earned one at 6:\n\n✦ The one that matches where you are now — not where you started\n✦ Every principle from this week applied with confidence\n✦ The visual that proves how far you've come\n\nSave it. This is Week 3's reward. ⬇️" },
            { "id": "w3d5p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "Week 3 reward is live. 🎉\n\nDo this tonight. Not because you have to — because you can.\n\nTag someone who doubted you'd get here. 👇" },
            { "id": "w3d5p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Week 3 done.\n\nOne week left.\n\nWeek 4 isn't about learning or leveling up. It's about locking in.\n\n🔔 Monday. This is where it becomes permanent." }
          ],
          "floats": [
            { "id": "w3d5f1", "time": "06:47", "role": "Floating", "type": "G", "status": "floating", "announced": false, "text": "6:47 AM.\n\nNobody's awake for this one. That's fine.\n\nThere's a version of this account that I almost built. Faster. Louder. Less honest.\n\nI didn't. And the reason is the last three weeks.\n\nDrop at 6. It's a good one." },
            { "id": "w3d5f2", "time": "20:38", "role": "Floating", "type": "S", "status": "floating", "announced": false, "text": "Someone replied to this morning's question with:\n\n\"I used to say I can't do this. I don't say that anymore.\"\n\nThat's the post. That's the whole thing.\n\nWeek 4 starts Monday. It's the last one. It's the best one." }
          ]
        },
        {
          "day": 20, "day_of_week": "Saturday", "angle": "Teach", "emotion": "Generosity",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #20 — The Teaching One", "format": "visual/carousel" },
          "posts": [
            { "id": "w3d6p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "The best way to know if you've really learned something?\n\nTeach it to someone else.\n\nToday's is built for that. 👀" },
            { "id": "w3d6p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable", "text": "If you had to teach someone one thing this week —\n\nWhat would it be?\n\nDrop it. 👇 The best answers get reshared tonight." },
            { "id": "w3d6p3", "slot": 3, "time": "12:00", "role": "Build", "type": "C", "status": "variable", "text": "Someone told me yesterday they stopped saying \"I can't.\"\n\nTonight's is the one you teach to the next person who says it.\n\n🔔 6 PM." },
            { "id": "w3d6p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "Saturday's teaching one at 6:\n\n✦ Simple enough to walk someone through step by step\n✦ Impressive enough that they'll actually want to learn it\n✦ Designed to be shared side by side\n\nSave this. Then find someone to do it with. ⬇️" },
            { "id": "w3d6p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "The teaching one is live. 🎉\n\nFind someone who needs this. Do it together.\n\nThat's what this was built for. 👇" },
            { "id": "w3d6p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Saturday wrapped.\n\nTomorrow is the last Sunday before Week 4.\n\nRest well. Week 4 is the one that makes everything stick permanently.\n\n🔔" }
          ],
          "floats": [
            { "id": "w3d6f1", "time": "14:26", "role": "Floating", "type": "M", "status": "floating", "announced": false, "text": "Experiment:\n\nFirst 5 replies get a written mini-guide for the exact thing they said they'd teach someone.\n\nI'll write it out properly. Steps, reasoning, the works.\n\nTell me what you'd teach. 👇" },
            { "id": "w3d6f2", "time": "21:47", "role": "Floating", "type": "G", "status": "floating", "announced": false, "text": "9:47 PM.\n\nSomeone replied to the mini-guide offer with the exact thing their grandmother used to make. I'm writing it out tonight.\n\nIf you're reading this — it's already done. Check your messages tomorrow.\n\nSunday's post is a quiet one. Then Week 4." }
          ]
        },
        {
          "day": 21, "day_of_week": "Sunday", "angle": "Reflection", "emotion": "Growth",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #21 — The Milestone One", "format": "visual/carousel" },
          "posts": [
            { "id": "w3d7p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Three weeks in.\n\nThe person who started Week 1 and the person reading this right now aren't the same.\n\nThat's the point. 👀" },
            { "id": "w3d7p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable", "text": "Week 3 reflection:\n\nWhat's one thing you can do now that you couldn't (or wouldn't) do 3 weeks ago?\n\nI want to read every reply. 👇" },
            { "id": "w3d7p3", "slot": 3, "time": "12:00", "role": "Build", "type": "C", "status": "variable", "text": "Sunday's is a personal one.\n\nThe kind you do when you want to remember where you are right now.\n\n🔔 6 PM." },
            { "id": "w3d7p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "Before 6 PM — what's coming:\n\n✦ One worth marking a moment with\n✦ Slow, intentional, satisfying\n✦ The one you'll come back to at milestones\n\nSave it. This belongs in your permanent rotation. ⬇️" },
            { "id": "w3d7p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "Sunday's milestone is live. 🎉\n\nDo this tonight and think about how different this Sunday feels from four weeks ago.\n\nTell me what's different. 👇" },
            { "id": "w3d7p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Week 3 is complete.\n\nOne week left.\n\nWeek 4 is about making sure none of this was temporary.\n\n🔔 Monday. The final chapter." }
          ],
          "floats": [
            { "id": "w3d7f1", "time": "09:18", "role": "Floating", "type": "S", "status": "floating", "announced": false, "text": "Overnight someone replied to the reflection question with:\n\n\"I made the Saturday one for my kid. She asked me to teach her. That's never happened.\"\n\nWeek 4 starts tomorrow. It's the last one. If you've been lurking — this is the week to show up." }
          ]
        }
      ]
    },

    {
      "week": 4,
      "intensity": "MAX",
      "intensity_icon": "🔴",
      "theme": "Lock",
      "tone": "Declarative, loyal, closing",
      "goal": "Make the audience feel this account is irreplaceable",
      "variance": "MAXIMUM",
      "floats_this_week": 15,
      "days": [
        {
          "day": 22, "day_of_week": "Monday", "angle": "Permanence", "emotion": "Security",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #22 — Permanent #1", "format": "visual/carousel" },
          "posts": [
            { "id": "w4d1p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Week 4.\n\nThis week isn't about learning new things.\n\nIt's about making sure you never go back to the old way.\n\n👀" },
            { "id": "w4d1p2", "slot": 2, "time": "10:00", "role": "Build", "type": "X", "status": "variable", "text": "Final week question:\n\nWhat's one habit you had at the start of the month that you've already dropped?\n\nDrop it below — this is the proof. 👇" },
            { "id": "w4d1p3", "slot": 3, "time": "12:00", "role": "Build", "type": "Q", "status": "variable", "text": "Tonight's is one you'll do automatically in three months.\n\nWithout the steps. Without looking it up. Just from memory.\n\nThat's what we're building this week.\n\n🔔 6 PM." },
            { "id": "w4d1p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "6 PM — the first permanent one:\n\n✦ Built to be memorized, not just done once\n✦ The approach that makes it automatic over time\n✦ Designed to stick, not just impress\n\nSave this. You'll need it less and less each time. ⬇️" },
            { "id": "w4d1p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "Permanent #1 is live. 🎉\n\nDo this tonight. Then again next week. Then the week after.\n\nBy next month — you won't need the steps.\n\nShare it with someone starting their month. 👇" },
            { "id": "w4d1p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Week 4 Day 1 done.\n\nSix more days — and everything this month taught you becomes permanent.\n\nTomorrow — the one thing that unlocks ten others.\n\n🔔 One of the most useful posts this month." }
          ],
          "floats": [
            { "id": "w4d1f1", "time": "13:41", "role": "Floating", "type": "S", "status": "floating", "announced": false, "text": "Someone replied to this morning's question with:\n\n\"I stopped buying pre-chopped onions. That's it. That's the change.\"\n\nSmall. Specific. Real. That's what a month actually looks like.\n\nTonight's builds on exactly that instinct." },
            { "id": "w4d1f2", "time": "21:19", "role": "Floating", "type": "D", "status": "floating", "announced": false, "text": "9:19 PM. Not scheduled.\n\nIf you did tonight's — do it again Thursday. Before the week ends.\n\nTwice in one week is where it starts becoming memory instead of instruction.\n\nThat's the drop. 🔔" }
          ]
        },
        {
          "day": 23, "day_of_week": "Tuesday", "angle": "Multiplier", "emotion": "Leverage",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #23 — The Multiplier", "format": "visual/carousel" },
          "posts": [
            { "id": "w4d2p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "One skill.\n\nTen things unlocked.\n\nThat's today. 👀" },
            { "id": "w4d2p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable", "text": "If mastering one thing gave you the ability to do ten different things —\n\nHow much time would you spend learning that one thing?\n\nBe specific. 👇" },
            { "id": "w4d2p3", "slot": 3, "time": "12:00", "role": "Build", "type": "C", "status": "variable", "text": "Last night's drop was about repetition.\n\nToday's is what makes repetition worth it.\n\nLearn it once. Apply it everywhere.\n\n🔔 6 PM." },
            { "id": "w4d2p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "The multiplier drops at 6:\n\n✦ One approach that applies across everything\n✦ How to see it in what you already know\n✦ The clearest demonstration of it\n\nSave this. This is a permanent tool, not a one-time thing. ⬇️" },
            { "id": "w4d2p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "The multiplier is live. 🎉\n\nThis one doesn't expire after tonight.\n\nUse it in everything. Tag someone who needs it. 👇" },
            { "id": "w4d2p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Tuesday done.\n\nYou now have a tool that makes everything easier to execute.\n\nTomorrow — what to do when you have nothing and still need to make something good.\n\n🔔 Practical, permanent, and dropping at 6." }
          ],
          "floats": [
            { "id": "w4d2f1", "time": "11:03", "role": "Floating", "type": "M", "status": "floating", "announced": false, "text": "Experiment:\n\nFirst 5 replies get a list of everything in their current repertoire the multiplier applies to.\n\nTell me five things you already do. I'll map it. 👇" },
            { "id": "w4d2f2", "time": "21:36", "role": "Floating", "type": "S", "status": "floating", "announced": false, "text": "Someone replied to the multiplier post with:\n\n\"This is the same thing my chef told me in culinary school. You just said it in one post instead of six weeks.\"\n\nI'll take that. Tomorrow's is the one that works when everything else fails." }
          ]
        },
        {
          "day": 24, "day_of_week": "Wednesday", "angle": "Resourcefulness", "emotion": "Confidence",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #24 — The Framework", "format": "visual/carousel" },
          "posts": [
            { "id": "w4d3p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "The real test:\n\nNothing available, almost zero time, no plan.\n\nAnd still — something worth it.\n\nToday I show you how. 👀" },
            { "id": "w4d3p2", "slot": 2, "time": "10:00", "role": "Build", "type": "X", "status": "variable", "text": "Wednesday reality check:\n\nWhat do you actually have right now?\n\nWhatever's there. Tonight's works with almost any answer. 👇" },
            { "id": "w4d3p3", "slot": 3, "time": "12:00", "role": "Build", "type": "P", "status": "variable", "text": "The most valuable skill isn't a technique.\n\nIt's the ability to work with what you have.\n\nThat's exactly what tonight teaches.\n\n🔔 6 PM." },
            { "id": "w4d3p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "6 PM — the resourcefulness one:\n\n✦ Built around what you already have\n✦ The decision framework that makes any set of ingredients work\n✦ Steps that adapt — not a fixed recipe\n\nSave this. It works every Wednesday from here on. ⬇️" },
            { "id": "w4d3p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "It's live. 🎉\n\nLook at what you have. Make something.\n\nThat's the assignment. Report back. 👇" },
            { "id": "w4d3p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Wednesday done.\n\nYou now do this differently than most people.\n\nNot because you know more — because you understand it.\n\nTomorrow — the one that shows it. 🔔" }
          ],
          "floats": [
            { "id": "w4d3f1", "time": "08:12", "role": "Floating", "type": "G", "status": "floating", "announced": false, "text": "8:12 AM.\n\nQuiet one.\n\nIf you've been following since Week 1 and never replied — tonight's is the one to reply to.\n\nNo reason. I just want to know you're there.\n\nDrop at 6." },
            { "id": "w4d3f2", "time": "15:58", "role": "Floating", "type": "D", "status": "floating", "announced": false, "text": "2 minutes before the tease. Off-schedule.\n\nIf you're doing tonight's — the framework is: fat, acid, salt, texture. In that order. Solve them one at a time and almost anything works.\n\nThat's the whole thing. Tease drops in 2 minutes." }
          ]
        },
        {
          "day": 25, "day_of_week": "Thursday", "angle": "Legacy", "emotion": "Meaning",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #25 — The Legacy One", "format": "visual/carousel" },
          "posts": [
            { "id": "w4d4p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Some things are just things.\n\nSome become part of who you are.\n\nToday's is the second kind. 👀" },
            { "id": "w4d4p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable", "text": "If you could leave one thing for someone you care about —\n\nWhat would you want them to remember you by?\n\nDrop it. 👇\n\nToday's post is about exactly that idea." },
            { "id": "w4d4p3", "slot": 3, "time": "12:00", "role": "Build", "type": "C", "status": "variable", "text": "Someone replied to Saturday's post about the thing their grandmother made.\n\nI wrote it out for them. Tonight's is that idea — made shareable.\n\n🔔 6 PM." },
            { "id": "w4d4p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "Coming at 6 — the legacy one:\n\n✦ Simple enough to become a ritual\n✦ Meaningful enough to pass on\n✦ Teaches the feeling, not just the steps\n\nSave this one differently. This one stays. ⬇️" },
            { "id": "w4d4p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "The legacy one is live. 🎉\n\nDo this for someone you love.\n\nThen teach it to them. That's how it survives. 👇" },
            { "id": "w4d4p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Thursday done.\n\nTwo days left.\n\nTomorrow is the second-to-last post of the month — and it's one I've been saving.\n\n🔔 Don't miss Friday." }
          ],
          "floats": [
            { "id": "w4d4f1", "time": "09:27", "role": "Floating", "type": "S", "status": "floating", "announced": false, "text": "Overnight someone replied to the legacy question with:\n\n\"My dad's chili. He's still alive. I just want to be able to make it when he isn't.\"\n\nThat's the whole reason any of this matters. Reply to anything today. The good ones get answered." },
            { "id": "w4d4f2", "time": "20:52", "role": "Floating", "type": "Re", "status": "floating", "announced": false, "text": "Two people did the resourcefulness one last night with completely different things.\n\nBoth worked. Both sent photos.\n\nThat's the framework doing its job. It's not a recipe. It's a method.\n\nIf you've used it — reply. I'm still collecting." }
          ]
        },
        {
          "day": 26, "day_of_week": "Friday", "angle": "Celebration", "emotion": "Joy",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #26 — The Celebration One", "format": "visual/carousel" },
          "posts": [
            { "id": "w4d5p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Four weeks.\n\nHundreds of you. One kitchen at a time.\n\nToday we celebrate what that actually means. 👀" },
            { "id": "w4d5p2", "slot": 2, "time": "10:00", "role": "Build", "type": "X", "status": "variable", "text": "Unpopular opinion, and I'll stand behind it:\n\nMost people don't need more options. They need to do the same five things twenty times each.\n\nVariety is what's keeping you mediocre.\n\nTry me in the replies. 👇" },
            { "id": "w4d5p3", "slot": 3, "time": "12:00", "role": "Build", "type": "Q", "status": "variable", "text": "Final Friday question of the month:\n\nWhat's the most surprising thing this taught you this month?\n\nNot about the subject. About yourself.\n\nI'll share the best ones.\n\n🔔 6 PM. The one I'm most proud of this cycle." },
            { "id": "w4d5p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "The month's final Friday at 6:\n\n✦ Everything we've covered, in one\n✦ The approach, the simplicity, the confidence\n✦ A format that makes it feel like a finish line\n\nSave this. Do it tonight. You've earned it completely. ⬇️" },
            { "id": "w4d5p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "The celebration one is live. 🎉\n\nA month of showing up. A month of learning. A month of doing.\n\nTag someone who went through this month with you. 👇" },
            { "id": "w4d5p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "One day left.\n\nTomorrow is Sunday — and the final post of the month.\n\nI'm saving something for it that I haven't shared all month.\n\n🔔 Be there Sunday at 6." }
          ],
          "floats": [
            { "id": "w4d5f1", "time": "13:14", "role": "Floating", "type": "M", "status": "floating", "announced": false, "text": "Experiment:\n\nFirst 5 replies to this post get something built around whatever they name.\n\nAnything. I'll write it myself.\n\nNo catch. I just want to see who's paying attention today. 👇" },
            { "id": "w4d5f2", "time": "21:07", "role": "Floating", "type": "S", "status": "floating", "announced": false, "text": "Ten days ago someone replied with:\n\n\"I stopped ordering takeout on Wednesdays. That's it. That's the whole change.\"\n\nTen days. One day a week. That's what this actually looks like.\n\nNot transformation. Just one Wednesday at a time." },
            { "id": "w4d5f3", "time": "20:48", "role": "Floating", "type": "D", "status": "floating", "announced": false, "text": "While I'm here —\n\nI wrote out the five things I think everyone should be able to do from memory.\n\nNo link. No email. Just posting them next week, one a day, no announcement of which order.\n\nWatch for them.\n\nSunday's the last post of the month. 🔔" }
          ]
        },
        {
          "day": 27, "day_of_week": "Saturday", "angle": "Ritual", "emotion": "Intention",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #27 — The Ritual One", "format": "visual/carousel" },
          "posts": [
            { "id": "w4d6p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "The difference between a habit and a ritual:\n\nA habit is automatic. A ritual is intentional.\n\nToday we do it with intention.\n\n👀" },
            { "id": "w4d6p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable", "text": "What ritual have you built around this over the month?\n\nEven something small — tell me. 👇" },
            { "id": "w4d6p3", "slot": 3, "time": "12:00", "role": "Build", "type": "C", "status": "variable", "text": "Yesterday someone told me they stopped ordering takeout on Wednesdays.\n\nThat's a ritual. Tonight's is another one — if you want it.\n\n🔔 6 PM. Slow down for this one." },
            { "id": "w4d6p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "Your final Saturday at 6:\n\n✦ Worth the full treatment\n✦ No shortcuts — not because they'd hurt it, but because the process is part of it\n✦ The visual that makes it feel like the close of something meaningful\n\nSave this. Clear the evening. ⬇️" },
            { "id": "w4d6p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "The ritual one is live. 🎉\n\nThis was made for tonight — and for every Saturday after this.\n\nShare it with someone who deserves a slow evening. 👇" },
            { "id": "w4d6p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Saturday done.\n\nOne post left.\n\nTomorrow — the final Sunday. The one that sets up everything that comes next.\n\n🔔 Be there." }
          ],
          "floats": [
            { "id": "w4d6f1", "time": "08:33", "role": "Floating", "type": "G", "status": "floating", "announced": false, "text": "8:33 AM.\n\nLast Saturday of the month. Quiet morning.\n\nIf you've made it this far — you're in a small group. Most people don't finish things.\n\nTomorrow's post is the one I've been holding back since Week 1.\n\nThat's all. Drop at 6." },
            { "id": "w4d6f2", "time": "15:09", "role": "Floating", "type": "S", "status": "floating", "announced": false, "text": "Someone replied to this morning's ritual question with:\n\n\"I do it Saturday now. Same time every week. My kids started setting the table without being asked.\"\n\nThat's the one. That's the whole month, right there." }
          ]
        },
        {
          "day": 28, "day_of_week": "Sunday", "angle": "Return", "emotion": "Loyalty",
          "anchor": { "slot": 5, "time": "18:00", "type": "R", "label": "Anchor Drop #28 — The Finale", "format": "visual/carousel" },
          "posts": [
            { "id": "w4d7p1", "slot": 1, "time": "07:30", "role": "Ignite", "type": "I", "status": "fixed", "text": "Last Sunday of the month.\n\nA month ago — you were different.\n\nToday we close the loop. 👀" },
            { "id": "w4d7p2", "slot": 2, "time": "10:00", "role": "Build", "type": "Q", "status": "variable", "text": "Final question of the month:\n\nIf someone asked you \"should I follow @r_comic_book?\" — what would you tell them?\n\nDrop your honest answer. 👇" },
            { "id": "w4d7p3", "slot": 3, "time": "12:00", "role": "Build", "type": "C", "status": "variable", "text": "The last one of the month is the one I've been holding back.\n\nNot because it was too complex. Because it was too good to share before now.\n\n🔔 6 PM. The finale." },
            { "id": "w4d7p4", "slot": 4, "time": "16:00", "role": "Tease", "type": "T", "status": "fixed", "text": "The finale drops at 6:\n\n✦ The one I saved for last — and you'll understand why when you see it\n✦ Every principle from this month in one final thing\n✦ The visual that closes the month the way it deserves\n\nSave this. This is the one you remember. ⬇️" },
            { "id": "w4d7p5", "slot": 6, "time": "19:00", "role": "Amplify", "type": "A", "status": "fixed", "text": "The finale is live. 🎉\n\nOne month. One kitchen. One permanent upgrade.\n\nShare this with everyone who made it to the end.\n\nAnd tag someone who should start next month with us. 👇" },
            { "id": "w4d7p6", "slot": 7, "time": "22:00", "role": "Close", "type": "L", "status": "fixed", "text": "Month done.\n\nYou showed up every day. You learned. You did the thing. You grew.\n\nNext month — we start fresh. New angle. Same commitment.\n\n🔔 Follow. Be here Day 1.\n\nSee you Monday." }
          ],
          "floats": [
            { "id": "w4d7f1", "time": "13:04", "role": "Floating", "type": "V", "status": "floating", "announced": false, "jackpot": "max", "text": "⭐ THE VAULT — OPENING NOW ⭐\n\nI've been holding something back all month.\n\nOpening it:\n\nEverything from all 28 days — every approach, every framework, every principle — written out as one continuous guide.\n\nNo email. No link in bio. Just here. In this post.\n\nSave it before it gets buried.\n\nTonight at 6 is the last one. You've earned both. ⬇️" },
            { "id": "w4d7f2", "time": "21:12", "role": "Floating", "type": "S", "status": "floating", "announced": false, "text": "Someone replied to this morning's question with:\n\n\"I'd tell them to start at Week 1 and not skip anything. I did and I actually do this now.\"\n\nStart at Week 1. Don't skip anything.\n\nThat's the whole thing. See you Monday. 🔔" }
          ]
        }
      ]
    }
  ],

  "reference": {
    "monthly_intensity_arc": [
      { "week": 1, "intensity": "LOW",  "icon": "🔵", "theme": "Seed", "tone": "Inviting, gentle, discovery",     "variance": "LOW",     "floats": 2 },
      { "week": 2, "intensity": "MID",  "icon": "🟡", "theme": "Grow", "tone": "Confident, direct, challenging", "variance": "RISING",  "floats": 5 },
      { "week": 3, "intensity": "HIGH", "icon": "🟠", "theme": "Peak", "tone": "Bold, authoritative, urgent",    "variance": "HIGH",    "floats": 10 },
      { "week": 4, "intensity": "MAX",  "icon": "🔴", "theme": "Lock", "tone": "Declarative, permanent, loyal",  "variance": "MAXIMUM", "floats": 15 }
    ],

    "weekly_angle_map": [
      { "week": 1, "day": "Mon", "angle": "First Impression", "emotion": "Welcome" },
      { "week": 1, "day": "Tue", "angle": "Invitation",       "emotion": "Belonging" },
      { "week": 1, "day": "Wed", "angle": "Surprise",         "emotion": "Curiosity" },
      { "week": 1, "day": "Thu", "angle": "Connection",       "emotion": "Warmth" },
      { "week": 1, "day": "Fri", "angle": "Ease",             "emotion": "Relief" },
      { "week": 1, "day": "Sat", "angle": "Exploration",      "emotion": "Adventure" },
      { "week": 1, "day": "Sun", "angle": "Reset",            "emotion": "Peace" },
      { "week": 2, "day": "Mon", "angle": "Challenge",        "emotion": "Drive" },
      { "week": 2, "day": "Tue", "angle": "Reframe",          "emotion": "Insight" },
      { "week": 2, "day": "Wed", "angle": "Myth-Busting",     "emotion": "Surprise" },
      { "week": 2, "day": "Thu", "angle": "Depth",            "emotion": "Understanding" },
      { "week": 2, "day": "Fri", "angle": "Payoff",           "emotion": "Satisfaction" },
      { "week": 2, "day": "Sat", "angle": "Experiment",       "emotion": "Freedom" },
      { "week": 2, "day": "Sun", "angle": "Consolidation",    "emotion": "Clarity" },
      { "week": 3, "day": "Mon", "angle": "Authority",        "emotion": "Confidence" },
      { "week": 3, "day": "Tue", "angle": "Technique",        "emotion": "Competence" },
      { "week": 3, "day": "Wed", "angle": "Mastery",          "emotion": "Control" },
      { "week": 3, "day": "Thu", "angle": "Showpiece",        "emotion": "Pride" },
      { "week": 3, "day": "Fri", "angle": "Identity Shift",   "emotion": "Transformation" },
      { "week": 3, "day": "Sat", "angle": "Teach",            "emotion": "Generosity" },
      { "week": 3, "day": "Sun", "angle": "Reflection",       "emotion": "Growth" },
      { "week": 4, "day": "Mon", "angle": "Permanence",       "emotion": "Security" },
      { "week": 4, "day": "Tue", "angle": "Multiplier",       "emotion": "Leverage" },
      { "week": 4, "day": "Wed", "angle": "Resourcefulness",  "emotion": "Confidence" },
      { "week": 4, "day": "Thu", "angle": "Legacy",           "emotion": "Meaning" },
      { "week": 4, "day": "Fri", "angle": "Celebration",      "emotion": "Joy" },
      { "week": 4, "day": "Sat", "angle": "Ritual",           "emotion": "Intention" },
      { "week": 4, "day": "Sun", "angle": "Return",           "emotion": "Loyalty" }
    ],

    "post_roles": [
      { "time": "07:30", "role": "Ignite",  "goal": "Stop the scroll",        "mechanic": "Hook + Curiosity gap" },
      { "time": "10:00", "role": "Build",   "goal": "Drive replies",          "mechanic": "Question + Poll" },
      { "time": "12:00", "role": "Build",   "goal": "Push Bell",              "mechanic": "Scarcity + Time lock" },
      { "time": "16:00", "role": "Tease",   "goal": "Drive Bookmarks",        "mechanic": "Preview + Save CTA" },
      { "time": "18:00", "role": "Anchor",  "goal": "Deliver value",          "mechanic": "The spine. Never moved." },
      { "time": "19:00", "role": "Amplify", "goal": "Drive Shares",           "mechanic": "Social + Tag CTA" },
      { "time": "22:00", "role": "Close",   "goal": "Drive Follow",           "mechanic": "Cliffhanger loop" },
      { "time": null,    "role": "Floating","goal": "Create checking reflex", "mechanic": "Unannounced reward" }
    ],

    "reinforcement_ledger_schema": {
      "columns": ["date", "type", "promised", "recipient", "delivered", "date_delivered"],
      "rule": "If any row is empty at month end, the mechanic is compromised."
    },

    "ethics_line": {
      "allowed": ["A recipe that works", "A technique that transfers", "Recognition that's earned", "A name-drop someone will screenshot"],
      "forbidden": ["Anxiety", "Fake urgency", "FOMO on nothing", "Engagement for its own sake"],
      "test": "If you cannot describe the reward in one sentence and have it be genuinely good for the person receiving it — do not post it."
    }
  }
};

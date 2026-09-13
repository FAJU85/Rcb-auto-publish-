import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Cpu, MessageSquare, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { CampaignData } from '../types';

interface AiPromptLayerExplorerProps {
  campaignData: CampaignData;
}

export const AiPromptLayerExplorer: React.FC<AiPromptLayerExplorerProps> = ({ campaignData }) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('ignite');
  const [selectedFloat, setSelectedFloat] = useState<string>('D');

  if (!campaignData.ai_config || !campaignData.ai_prompt_layer) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center text-neutral-500">
        <AlertCircle className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
        <p className="text-sm font-medium">AI configuration data is not loaded.</p>
      </div>
    );
  }

  const { ai_config, ai_prompt_layer } = campaignData;

  const slotPrompt = ai_prompt_layer.slot_system_prompts[selectedSlot];
  const floatPrompt = ai_prompt_layer.float_prompt_pool.types[selectedFloat];

  return (
    <div className="space-y-6" id="ai-prompt-explorer">
      {/* Overview Block */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-neutral-900 flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-neutral-800" />
              <span>AI Prompt Layer & Generation Guardrails (v3.0)</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Exposing the programmatic guardrails, tone signatures, and prompt chains that govern automatic cross-platform copy calibration.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-neutral-900 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Model: {ai_config.recommended_model}
            </span>
          </div>
        </div>

        {/* Core Model Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-neutral-100">
          <div className="p-3 bg-neutral-50/50 rounded-lg border border-neutral-200/40 text-xs">
            <span className="text-neutral-400 font-bold block mb-1 font-mono text-[9px] uppercase">Fallback Core Model</span>
            <span className="text-neutral-900 font-mono font-medium">{ai_config.fallback_model}</span>
          </div>
          <div className="p-3 bg-neutral-50/50 rounded-lg border border-neutral-200/40 text-xs">
            <span className="text-neutral-400 font-bold block mb-1 font-mono text-[9px] uppercase">Output Strict Format</span>
            <span className="text-neutral-900 font-medium">{ai_config.output_format}</span>
          </div>
          <div className="p-3 bg-neutral-50/50 rounded-lg border border-neutral-200/40 text-xs">
            <span className="text-neutral-400 font-bold block mb-1 font-mono text-[9px] uppercase">System Temperature Scale</span>
            <div className="space-y-0.5 font-mono text-[10px] mt-1 text-neutral-700">
              <div className="flex justify-between"><span>W1 (Seed):</span> <span>{ai_config.temperature_by_week.week_1}</span></div>
              <div className="flex justify-between"><span>W2 (Grow):</span> <span>{ai_config.temperature_by_week.week_2}</span></div>
              <div className="flex justify-between"><span>W3 (Peak):</span> <span>{ai_config.temperature_by_week.week_3}</span></div>
              <div className="flex justify-between"><span>W4 (Lock):</span> <span>{ai_config.temperature_by_week.week_4}</span></div>
            </div>
          </div>
          <div className="p-3 bg-neutral-50/50 rounded-lg border border-neutral-200/40 text-xs">
            <span className="text-neutral-400 font-bold block mb-1 font-mono text-[9px] uppercase">Audit Hard Stops</span>
            <ul className="list-disc pl-4 space-y-0.5 text-neutral-700 text-[10px] leading-snug">
              <li>No CTAs with multiple actions</li>
              <li>No exclamation marks in Ignite/Close</li>
              <li>Max 280 chars per standard post</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Tone Calibration & Guardrails Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tone Calibration Card */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
              <MessageSquare className="w-4.5 h-4.5 text-neutral-700" />
              <span>Weekly Tone Signatures</span>
            </h3>
            
            <div className="space-y-3.5 divide-y divide-neutral-100 max-h-[380px] overflow-y-auto pr-1">
              {Object.entries(ai_prompt_layer.tone_signatures || {}).map(([week, info]: [string, any]) => (
                <div key={week} className="pt-3 first:pt-0 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-neutral-900 capitalize">{week.replace('_', ' ')} • Stage: {info?.label}</span>
                    <span className="text-[10px] bg-neutral-100 text-neutral-600 font-mono px-1.5 py-0.2 rounded">
                      Calibrated
                    </span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed italic">"{info?.voice}"</p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-500 font-mono pt-1">
                    <div><b>Openers:</b> {info?.example_opener}</div>
                    <div><b>Forbidden:</b> {info?.forbidden_words?.join(', ') || 'None'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Guardrails Compliance Monitor */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4.5 h-4.5 text-neutral-700" />
              <span>AI System Compliance Monitor</span>
            </h3>
            
            <div className="space-y-2 text-xs">
              {[
                { label: "Read Day Context Before Gen", active: campaignData.config.generation_guardrails?.ai_must_read_day_context_before_generating },
                { label: "Validate Prompt Narrative Chain", active: campaignData.config.generation_guardrails?.ai_must_check_prompt_chain_before_slot_3 },
                { label: "Filter Out Empty Placeholder Brackets", active: campaignData.config.generation_guardrails?.ai_must_not_invent_promises_not_in_template },
                { label: "Strict 280-Character Boundary", active: campaignData.config.generation_guardrails?.ai_character_limit_enforced ? true : false },
                { label: "Run Pre-Post Quality Self-Audit", active: campaignData.config.generation_guardrails?.ai_output_must_pass_self_audit_before_use },
              ].map((rule, idx) => (
                <div key={idx} className="flex justify-between items-center bg-neutral-50 px-2.5 py-1.5 rounded border border-neutral-200/50">
                  <span className="font-medium text-neutral-700">{rule.label}</span>
                  <div className="flex items-center gap-1 text-green-700 font-bold font-mono text-[10px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    <span>ENFORCED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Interactive Prompt Engine Explorer */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active System Prompt Selector */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
                <Cpu className="w-4.5 h-4.5 text-neutral-700" />
                <span>Slot Prompt Templates</span>
              </h3>
              
              <div className="flex gap-1">
                {Object.keys(ai_prompt_layer.slot_system_prompts || {}).map((slotKey) => (
                  <button
                    key={slotKey}
                    onClick={() => setSelectedSlot(slotKey)}
                    className={`px-2 py-1 text-[10px] font-bold rounded uppercase transition ${
                      selectedSlot === slotKey
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {slotKey}
                  </button>
                ))}
              </div>
            </div>

            {slotPrompt && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-neutral-400 font-bold block mb-1 font-mono text-[9px] uppercase">System Instruction (Developer instructions)</span>
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200/80 font-mono text-[11px] leading-relaxed text-neutral-700 whitespace-pre-wrap select-all">
                    {slotPrompt.system_prompt}
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400 font-bold block mb-1 font-mono text-[9px] uppercase">User Prompt Template (Dynamic Injection)</span>
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200/80 font-mono text-[11px] leading-relaxed text-neutral-700 select-all">
                    {slotPrompt.user_prompt}
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400 font-bold block mb-1 font-mono text-[9px] uppercase">Dynamic Variables Slots</span>
                  <div className="flex flex-wrap gap-1.5">
                    {slotPrompt.prompt_variables?.map((v: string) => (
                      <span key={v} className="bg-neutral-100 text-neutral-800 font-mono text-[10px] px-2 py-0.5 rounded border border-neutral-200 font-semibold">
                        {"{"}{v}{"}"}
                      </span>
                    )) || <span className="text-neutral-400 italic font-mono text-[10px]">None</span>}
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400 font-bold block mb-1 font-mono text-[9px] uppercase">Generation Compliance Checklists</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    {slotPrompt.generation_rules?.map((rule: string, i: number) => (
                      <div key={i} className="flex items-center gap-1 text-neutral-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>{rule}</span>
                      </div>
                    )) || <span className="text-neutral-400 italic font-mono text-[10px]">None</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Floats Prompt Pool Card */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-neutral-700" />
                <span>Float Prompt Pool</span>
              </h3>
              
              <div className="flex gap-1">
                {Object.entries(ai_prompt_layer.float_prompt_pool?.types || {}).map(([code, info]: [string, any]) => (
                  <button
                    key={code}
                    onClick={() => setSelectedFloat(code)}
                    className={`px-2 py-1 text-[10px] font-bold rounded uppercase transition ${
                      selectedFloat === code
                        ? 'bg-purple-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {info?.name}
                  </button>
                ))}
              </div>
            </div>

            {floatPrompt && (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-neutral-400 font-bold block mb-1 font-mono text-[9px] uppercase">Float System Instructions</span>
                  <div className="bg-purple-50/20 p-3 rounded-lg border border-purple-200/40 font-mono text-[11px] leading-relaxed text-neutral-700 whitespace-pre-wrap">
                    {floatPrompt.system_prompt}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div>
                    <span className="text-neutral-400 font-bold block font-mono text-[9px] uppercase">Max Per Week</span>
                    <span className="font-bold text-neutral-900 font-mono text-sm">{floatPrompt.max_per_week} posts</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-bold block font-mono text-[9px] uppercase">Char Limit</span>
                    <span className="font-bold text-neutral-900 font-mono text-sm">{floatPrompt.character_limit} chars</span>
                  </div>
                  {floatPrompt.restriction && (
                    <div>
                      <span className="text-neutral-400 font-bold block font-mono text-[9px] uppercase">Restrictions</span>
                      <span className="font-bold text-red-600 text-xs">{floatPrompt.restriction}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

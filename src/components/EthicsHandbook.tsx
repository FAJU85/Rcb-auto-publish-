import React, { useState } from 'react';
import { Check, X, ShieldAlert, Sparkles, HelpCircle, Heart, ThumbsUp, AlertTriangle } from 'lucide-react';
import { CampaignData } from '../types';

interface EthicsHandbookProps {
  campaignData: CampaignData;
}

export const EthicsHandbook: React.FC<EthicsHandbookProps> = ({ campaignData }) => {
  const { ethics_line } = campaignData.reference;
  const [sandboxText, setSandboxText] = useState('');
  const [auditResult, setAuditResult] = useState<{
    passed: boolean;
    issues: string[];
    grade: 'Excellent' | 'Warning' | 'Critical';
  } | null>(null);

  const testEthics = () => {
    const issues: string[] = [];
    const text = sandboxText.trim().toLowerCase();

    if (!text) return;

    // Check forbidden words (Fake urgency / FOMO)
    const urgentWords = ['hurry', 'limited time', 'only 5 left', 'act fast', 'instant', 'secret trick', 'guaranteed success', 'buy now', 'last chance'];
    const matchesUrgent = urgentWords.filter(word => text.includes(word));
    if (matchesUrgent.length > 0) {
      issues.push(`Contains artificial urgency markers: "${matchesUrgent.join('", "')}".`);
    }

    // Check engagement baiting for its own sake
    const engagementBait = ['like and retweet', 'retweet this', 'follow to win', 'tag three friends', 'smash that button', 'mind-blowing'];
    const matchesBait = engagementBait.filter(word => text.includes(word));
    if (matchesBait.length > 0) {
      issues.push(`Engagement-baiting phrasing detected: "${matchesBait.join('", "')}". Keep feedback loops authentic.`);
    }

    // Check placeholders
    if (/\[.*\]|placeholder/i.test(text)) {
      issues.push('Contains bracket placeholders or generic dummy text.');
    }

    // Check length/anxiety tone
    if (text.includes('fear') || text.includes('scared') || text.includes('panic') || text.includes('worst mistake')) {
      issues.push('High-anxiety psychological trigger detected. Reinforce capability and calm curiosity instead.');
    }

    const passed = issues.length === 0;
    const grade = passed ? 'Excellent' : issues.length <= 1 ? 'Warning' : 'Critical';

    setAuditResult({
      passed,
      issues,
      grade,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans" id="ethics-handbook">
      {/* Policy Allowed vs Forbidden Panels */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-neutral-900 flex items-center gap-1.5">
            <ThumbsUp className="w-5 h-5 text-neutral-800" />
            <span>The Ethics Guideline Handbook</span>
          </h3>
          <p className="text-neutral-500 text-xs leading-relaxed">
            Unlike standard high-pressure marketing tactics, our campaign operates with variable reinforcement built on trust, transparency, and actionable knowledge.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {/* Allowed Column */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
              <span className="text-[10px] uppercase font-bold text-neutral-800 tracking-wider flex items-center gap-1">
                <Check className="w-4 h-4 text-neutral-800" />
                <span>Allowed Values</span>
              </span>
              <ul className="mt-3 space-y-2">
                {ethics_line.allowed.map((item, idx) => (
                  <li key={idx} className="text-xs text-neutral-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Forbidden Column */}
            <div className="bg-red-50/30 border border-red-100 rounded-xl p-4">
              <span className="text-[10px] uppercase font-bold text-red-800 tracking-wider flex items-center gap-1">
                <X className="w-4 h-4 text-red-700" />
                <span>Forbidden Copy</span>
              </span>
              <ul className="mt-3 space-y-2">
                {ethics_line.forbidden.map((item, idx) => (
                  <li key={idx} className="text-xs text-neutral-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Master Rule Banner */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-1">
            ⚖️ The Golden Ethical Test
          </span>
          <p className="text-neutral-700 font-serif italic text-sm leading-relaxed">
            "{ethics_line.test}"
          </p>
        </div>
      </div>

      {/* Interactive Sandbox Auditor */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
            <Sparkles className="w-4.5 h-4.5 text-neutral-700" />
            <span>Ethics Copy Sandbox</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Draft or paste a post to test its ethical alignment.
          </p>
        </div>

        <textarea
          value={sandboxText}
          onChange={(e) => setSandboxText(e.target.value)}
          placeholder="e.g., Get this limited time only exclusive trick to multiply your kitchen skills! Follow and retweet right now before we lock the vault..."
          className="w-full p-2.5 text-xs border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 h-32 font-sans"
        />

        <button
          onClick={testEthics}
          disabled={!sandboxText.trim()}
          className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-semibold text-xs rounded-lg transition"
        >
          Check Ethical Compliance
        </button>

        {auditResult && (
          <div className={`p-4 rounded-xl border text-xs space-y-2.5 transition ${
            auditResult.passed
              ? 'bg-neutral-50 border-neutral-200 text-neutral-800'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            <div className="flex justify-between items-center font-bold">
              <span>Sandbox Grade:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wide font-mono ${
                auditResult.grade === 'Excellent'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {auditResult.grade}
              </span>
            </div>

            {auditResult.passed ? (
              <p className="leading-relaxed text-neutral-600">
                ⭐ Excellent! No manufactured anxiety, placeholder errors, or empty urgency phrases found. Copy values align perfectly.
              </p>
            ) : (
              <div className="space-y-1">
                <span className="font-semibold text-neutral-800 block">Identified Issues:</span>
                {auditResult.issues.map((issue, i) => (
                  <p key={i} className="text-neutral-700 leading-relaxed">• {issue}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

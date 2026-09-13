import React from 'react';
import { Sparkles, TrendingUp, HelpCircle, Activity, Bookmark, Flame, MessageCircle, BarChart3 } from 'lucide-react';
import { CampaignData } from '../types';

interface AnalyticsViewProps {
  campaignData: CampaignData;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ campaignData }) => {
  const { reference, meta, config } = campaignData;

  // Calculate stats
  const totalPosts = meta.total_posts;
  const anchorCount = meta.anchor_posts_total;
  const marketingCount = meta.marketing_posts_total;
  const floatsCount = meta.floating_posts_total;

  return (
    <div className="space-y-6" id="analytics-view-container">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Planned Posts', value: totalPosts, desc: 'Across 4 weeks', icon: Activity },
          { label: 'Anchor Value Posts', value: anchorCount, desc: '100% pure education', icon: Flame },
          { label: 'Floating Rewards', value: floatsCount, desc: 'Variable schedules', icon: Sparkles },
          { label: 'Marketing Blocks', value: marketingCount, desc: 'Growth & engagement', icon: Bookmark },
        ].map((card, i) => (
          <div key={i} className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-xs text-neutral-500 font-medium">{card.label}</span>
              <card.icon className="w-4 h-4 text-neutral-400 shrink-0" />
            </div>
            <div className="text-2xl font-extrabold text-neutral-900 mt-1">{card.value}</div>
            <div className="text-[10px] text-neutral-400 mt-0.5">{card.desc}</div>
          </div>
        ))}
      </div>

      {/* Visual Monthly Intensity Arc */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
            <TrendingUp className="w-4.5 h-4.5 text-neutral-700" />
            <span>Monthly Campaign Intensity Arc</span>
          </h3>
          <p className="text-neutral-500 text-xs mt-0.5">
            Visualization of campaign pressure scaling from Week 1 to Week 4 as audience buy-in rises.
          </p>
        </div>

        {/* Dynamic Arc Flow Chart */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {reference.monthly_intensity_arc.map((arc) => (
            <div key={arc.week} className="bg-neutral-50/50 border border-neutral-200 rounded-xl p-4 space-y-3 relative overflow-hidden transition hover:border-neutral-300">
              {/* Card visual status line */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                arc.intensity === 'LOW' ? 'bg-blue-300' :
                arc.intensity === 'MID' ? 'bg-yellow-300' :
                arc.intensity === 'HIGH' ? 'bg-amber-400' :
                'bg-red-500'
              }`} />

              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-neutral-500">Week {arc.week}</span>
                <span className="text-sm">{arc.icon}</span>
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wide bg-neutral-200/60 px-1.5 py-0.5 rounded">
                  {arc.intensity} Intensity
                </span>
                <h4 className="font-bold text-base text-neutral-900 mt-1.5">"{arc.theme}" Stage</h4>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-600 border-t border-neutral-200/60 pt-2">
                <p><b>Tone:</b> {arc.tone}</p>
                <p><b>Variance:</b> {arc.variance}</p>
                <p><b>Floats Triggered:</b> {arc.floats} posts</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Roles & Mechanics List */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
            <BarChart3 className="w-4.5 h-4.5 text-neutral-700" />
            <span>X Post Slots & Psychological Trigger Mechanics</span>
          </h3>
          <p className="text-neutral-500 text-xs mt-0.5">
            Each daily slot uses a calculated trigger format to maximize specific audience habits.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400 text-[10px] font-bold uppercase tracking-wider bg-neutral-50/50">
                <th className="p-3">Time Slot</th>
                <th className="p-3">Role Code</th>
                <th className="p-3">Target Goal</th>
                <th className="p-3">Psychological Mechanic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs text-neutral-700">
              {reference.post_roles.map((role, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/40 transition">
                  <td className="p-3 font-mono font-bold text-neutral-900">
                    {role.time ?? 'FLOAT'}
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      role.role === 'Anchor'
                        ? 'bg-amber-100 text-amber-800'
                        : role.role === 'Floating'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {role.role}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-neutral-800">{role.goal}</td>
                  <td className="p-3 text-neutral-500 font-mono text-[11px]">{role.mechanic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

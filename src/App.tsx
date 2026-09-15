import { useState, useEffect } from 'react';
import { Calendar, Activity, ShieldCheck, HelpCircle, Flame, Sparkles, CheckSquare, Award } from 'lucide-react';
import { initialCampaignData } from './data/campaign';
import { CampaignData, LedgerEntry, Post, FloatPost } from './types';
import { ScheduleGrid } from './components/ScheduleGrid';
import { GuardrailAuditor } from './components/GuardrailAuditor';
import { LedgerTable } from './components/LedgerTable';
import { EthicsHandbook } from './components/EthicsHandbook';
import { AnalyticsView } from './components/AnalyticsView';
import { IntegrationsHub } from './components/IntegrationsHub';
import { AiPromptLayerExplorer } from './components/AiPromptLayerExplorer';

const defaultLedgerEntries: LedgerEntry[] = [
  {
    id: 'l1',
    date: '2026-09-03',
    dayNumber: 3,
    type: 'Question',
    promised: 'personalized recommendation',
    recipient: '@johndoe_cooks',
    delivered: true,
    date_delivered: '2026-09-03',
  },
  {
    id: 'l2',
    date: '2026-09-10',
    dayNumber: 10,
    type: 'Callback',
    promised: 'name-drop in a later post',
    recipient: '@sarah_bakes',
    delivered: true,
    date_delivered: '2026-09-10',
  },
  {
    id: 'l3',
    date: '2026-09-14',
    dayNumber: 14,
    type: 'Mystery',
    promised: 'personalized recommendation',
    recipient: '@chef_alex',
    delivered: false,
    date_delivered: '',
  },
];

export default function App() {
  const [campaign, setCampaign] = useState<CampaignData>(() => {
    const saved = localStorage.getItem('campaign_planner_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialCampaignData;
  });
  const [ledger, setLedger] = useState<LedgerEntry[]>(() => {
    const saved = localStorage.getItem('campaign_ledger_entries');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultLedgerEntries;
  });

  useEffect(() => {
    localStorage.setItem('campaign_planner_data', JSON.stringify(campaign));
  }, [campaign]);

  // Reconcile campaign published flags with persistent posting history
  useEffect(() => {
    const savedLogs = localStorage.getItem('campaign_publish_logs');
    const savedIds = localStorage.getItem('campaign_published_ids');
    const publishedIds = new Set<string>();
    const publishedTexts = new Set<string>();

    if (savedIds) {
      try {
        const arr = JSON.parse(savedIds);
        if (Array.isArray(arr)) arr.forEach((id: string) => publishedIds.add(id));
      } catch (e) {}
    }

    if (savedLogs) {
      try {
        const logs = JSON.parse(savedLogs);
        if (Array.isArray(logs)) {
          logs.forEach((l: any) => {
            if (l.status === 'SUCCESS') {
              if (l.postId) publishedIds.add(l.postId);
              if (l.postText) publishedTexts.add(l.postText.trim());
            }
          });
        }
      } catch (e) {}
    }

    if (publishedIds.size > 0 || publishedTexts.size > 0) {
      setCampaign(prev => {
        let changed = false;
        const updatedWeeks = prev.weeks.map(w => ({
          ...w,
          days: w.days.map(d => ({
            ...d,
            posts: d.posts.map(p => {
              const isDone = p.isPublished || publishedIds.has(p.id) || (p.text && publishedTexts.has(p.text.trim()));
              if (isDone !== p.isPublished) {
                changed = true;
                return { ...p, isPublished: isDone, publishedAt: p.publishedAt || new Date().toISOString() };
              }
              return p;
            }),
            floats: d.floats.map(f => {
              const isDone = f.isPublished || publishedIds.has(f.id) || (f.text && publishedTexts.has(f.text.trim()));
              if (isDone !== f.isPublished) {
                changed = true;
                return { ...f, isPublished: isDone, publishedAt: f.publishedAt || new Date().toISOString() };
              }
              return f;
            })
          }))
        }));

        return changed ? { ...prev, weeks: updatedWeeks } : prev;
      });
    }
  }, []);

  const handleResetCampaignHistory = () => {
    localStorage.removeItem('campaign_publish_logs');
    localStorage.removeItem('campaign_published_ids');
    setCampaign(initialCampaignData);
    localStorage.setItem('campaign_planner_data', JSON.stringify(initialCampaignData));
  };

  useEffect(() => {
    localStorage.setItem('campaign_ledger_entries', JSON.stringify(ledger));
  }, [ledger]);
  const [activeTab, setActiveTab] = useState<'schedule' | 'analytics' | 'ledger' | 'ethics' | 'integrations' | 'ai_prompts'>('schedule');
  const [activeWeek, setActiveWeek] = useState<number>(1);

  // Handle simulated replies triggering automatic ledger entries
  const handleSimulateReward = (post: Post | FloatPost, userReply: string, username: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Determine reward tier based on active week
    let reward = '';
    if (activeWeek <= 2) {
      reward = activeWeek === 1 ? 'personalized recommendation' : 'name-drop in a later post';
    } else if (activeWeek === 3) {
      reward = "written mini-guide for the recipient's specific situation";
    } else {
      reward = Math.random() > 0.5 ? 'public shoutout' : "custom write-up built around the recipient's reply";
    }

    const newEntry: LedgerEntry = {
      id: `l-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      date: todayStr,
      dayNumber: 'slot' in post ? Number(post.slot) : 1,
      type: post.role || 'Floating',
      promised: reward,
      recipient: username,
      delivered: false,
      date_delivered: '',
    };

    setLedger((prev) => [newEntry, ...prev]);
  };

  // Toggle reward delivery in ledger
  const handleToggleDelivered = (id: string) => {
    setLedger((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const nextState = !e.delivered;
          return {
            ...e,
            delivered: nextState,
            date_delivered: nextState ? new Date().toISOString().split('T')[0] : '',
          };
        }
        return e;
      })
    );
  };

  // Manual entry in ledger
  const handleAddLedgerEntry = (newEntry: Partial<LedgerEntry>) => {
    const entry: LedgerEntry = {
      id: `l-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      date: newEntry.date || new Date().toISOString().split('T')[0],
      dayNumber: newEntry.dayNumber || 1,
      type: newEntry.type || 'Custom',
      promised: newEntry.promised || 'custom reward',
      recipient: newEntry.recipient || '@username',
      delivered: false,
      date_delivered: '',
    };
    setLedger((prev) => [entry, ...prev]);
  };

  // Delete ledger entry
  const handleDeleteLedgerEntry = (id: string) => {
    setLedger((prev) => prev.filter((e) => e.id !== id));
  };

  // Reset ledger to original mocks
  const handleResetLedger = () => {
    setLedger(defaultLedgerEntries);
  };

  // Update post copy inline
  const handleUpdatePostText = (
    weekNumber: number,
    dayNumber: number,
    postId: string,
    isFloat: boolean,
    newText: string
  ) => {
    setCampaign((prev) => {
      const updatedWeeks = prev.weeks.map((week) => {
        if (week.week !== weekNumber) return week;

        const updatedDays = week.days.map((day) => {
          if (day.day !== dayNumber) return day;

          if (isFloat) {
            const updatedFloats = day.floats.map((float) =>
              float.id === postId ? { ...float, text: newText } : float
            );
            return { ...day, floats: updatedFloats };
          } else {
            const updatedPosts = day.posts.map((post) =>
              post.id === postId ? { ...post, text: newText } : post
            );
            return { ...day, posts: updatedPosts };
          }
        });

        return { ...week, days: updatedDays };
      });

      return { ...prev, weeks: updatedWeeks };
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans" id="campaign-app-shell">
      {/* Top Brand Hero Navigation */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white font-black text-lg shadow-sm border border-neutral-800">
                𝕏
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight text-neutral-900">𝕏 Campaign Planner</h1>
                <p className="text-[10px] text-neutral-500 font-medium font-mono">@{campaign.meta.account} • Monthly Reinforcement Edition</p>
              </div>
            </div>

            {/* Campaign Meta Stats */}
            <div className="hidden md:flex items-center gap-6 text-xs border-l border-neutral-100 pl-6">
              <div>
                <span className="text-neutral-400">Total Posts</span>
                <span className="block font-bold text-neutral-900 text-sm font-mono">{campaign.meta.total_posts}</span>
              </div>
              <div>
                <span className="text-neutral-400">Active Stage</span>
                <span className="block font-bold text-neutral-900 text-sm flex items-center gap-1">
                  <span>{campaign.weeks[activeWeek - 1].intensity_icon}</span>
                  <span>"{campaign.weeks[activeWeek - 1].theme}"</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-2">
          {[
            { id: 'schedule', label: '📅 Schedule Explorer', count: null },
            { id: 'analytics', label: '📊 Intensity & Analytics', count: null },
            { id: 'ledger', label: '📋 Reinforcement Ledger', count: ledger.length },
            { id: 'integrations', label: '🔌 Multi-Platform Sync', count: null },
            { id: 'ai_prompts', label: '✨ AI Prompt Layer v3.0', count: null },
            { id: 'ethics', label: '⚖️ Ethics Guidelines', count: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-1.5 py-0.2 text-[9px] rounded-full font-mono font-bold ${
                  activeTab === tab.id ? 'bg-white text-neutral-900' : 'bg-neutral-200 text-neutral-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="space-y-6" id="dashboard-content-area">
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              {/* Main Timeline Calendar Grid */}
              <ScheduleGrid
                campaignData={campaign}
                activeWeek={activeWeek}
                setActiveWeek={setActiveWeek}
                onSimulateReward={handleSimulateReward}
                onUpdatePostText={handleUpdatePostText}
              />
              
              {/* Dynamic Guardrails auditor in the bottom */}
              <div className="border-t border-neutral-200 pt-6">
                <GuardrailAuditor campaignData={campaign} />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView campaignData={campaign} />
          )}

          {activeTab === 'ledger' && (
            <div className="space-y-6">
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                <h2 className="text-base font-extrabold text-neutral-900 flex items-center gap-1.5">
                  <Award className="w-5 h-5 text-neutral-800" />
                  <span>Variable Reinforcement Ledger</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Our system operates an active feedback engine. When followers interact with high-value Question or Build blocks, the system rewards them under the active week's Reward Ladder. Track, deliver, and delete records below to ensure mechanic integrity.
                </p>
              </div>

              <LedgerTable
                entries={ledger}
                onToggleDelivered={handleToggleDelivered}
                onAddEntry={handleAddLedgerEntry}
                onDeleteEntry={handleDeleteLedgerEntry}
                onResetLedger={handleResetLedger}
              />
            </div>
          )}

          {activeTab === 'integrations' && (
            <IntegrationsHub 
              campaignData={campaign} 
              onUpdateCampaignData={(updated) => setCampaign(updated)}
              onResetCampaignHistory={handleResetCampaignHistory}
              onAddLedgerEntry={(entry) => {
                const newId = 'l_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
                setLedger(prev => [
                  ...prev,
                  {
                    id: newId,
                    date: entry.date || new Date().toISOString().split('T')[0],
                    dayNumber: entry.dayNumber || 1,
                    type: entry.type || 'Callback',
                    promised: entry.promised || '',
                    recipient: entry.recipient || '',
                    delivered: false,
                    date_delivered: ''
                  }
                ]);
              }}
            />
          )}

          {activeTab === 'ai_prompts' && (
            <AiPromptLayerExplorer campaignData={campaign} />
          )}

          {activeTab === 'ethics' && (
            <EthicsHandbook campaignData={campaign} />
          )}
        </div>
      </main>

      {/* Elegant minimalist footer */}
      <footer className="bg-white border-t border-neutral-200/80 py-8 mt-12 text-center text-xs text-neutral-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1">
          <p>𝕏 Campaign Planner & Scheduler v{campaign.meta.version} • {campaign.meta.template}</p>
          <p>© 2026 Enterprise Media Group. Generated with pristine design mathematical systems.</p>
        </div>
      </footer>
    </div>
  );
}

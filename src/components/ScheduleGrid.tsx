import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, Flame, CheckCircle, Info, Edit, MessageSquare } from 'lucide-react';
import { CampaignData, Week, Day, Post, FloatPost } from '../types';
import { XPostPreview } from './XPostPreview';

interface ScheduleGridProps {
  campaignData: CampaignData;
  activeWeek: number;
  setActiveWeek: (week: number) => void;
  onSimulateReward: (post: Post | FloatPost, userReply: string, username: string) => void;
  onUpdatePostText: (weekIdx: number, dayIdx: number, postId: string, isFloat: boolean, newText: string) => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  campaignData,
  activeWeek,
  setActiveWeek,
  onSimulateReward,
  onUpdatePostText,
}) => {
  const selectedWeekObj = campaignData.weeks[activeWeek - 1];
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(selectedWeekObj.days[0].day);
  const selectedDayObj = selectedWeekObj.days.find((d) => d.day === selectedDayNumber) || selectedWeekObj.days[0];

  const [activePostId, setActivePostId] = useState<string>('');

  const currentDayPosts = selectedDayObj.posts;
  const currentDayFloats = selectedDayObj.floats;

  // Track the active post object for X preview rendering
  const activePost = 
    currentDayPosts.find((p) => p.id === activePostId) ||
    currentDayFloats.find((f) => f.id === activePostId) ||
    currentDayPosts[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="schedule-explorer-grid">
      {/* LEFT COLUMN: Week Selector & Days Timeline */}
      <div className="lg:col-span-4 space-y-6">
        {/* Week Selector Tabs */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Select Campaign Week</div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((wk) => {
              const wkObj = campaignData.weeks[wk - 1];
              const isSelected = activeWeek === wk;
              return (
                <button
                  key={wk}
                  onClick={() => {
                    setActiveWeek(wk);
                    setSelectedDayNumber(wkObj.days[0].day);
                    setActivePostId('');
                  }}
                  className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-neutral-900 border-neutral-900 text-white'
                      : 'bg-neutral-50/50 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 text-neutral-700'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">Wk {wk}</span>
                  <span className="text-xs font-mono">{wkObj.intensity_icon}</span>
                </button>
              );
            })}
          </div>

          {/* Week Info Display */}
          <div className="bg-neutral-50/60 p-3 rounded-lg border border-neutral-200/50 text-xs text-neutral-600 space-y-1.5">
            <div className="flex justify-between font-bold text-neutral-800 text-sm">
              <span>Theme: "{selectedWeekObj.theme}"</span>
              <span>{selectedWeekObj.intensity} Arc</span>
            </div>
            <p><b>Goal:</b> {selectedWeekObj.goal}</p>
            <p><b>Tone:</b> {selectedWeekObj.tone}</p>
            <p><b>Floats:</b> {selectedWeekObj.floats_this_week} scheduled items</p>
          </div>
        </div>

        {/* Days List for Active Week */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
            Days of "{selectedWeekObj.theme}" Stage
          </div>
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {selectedWeekObj.days.map((day) => {
              const isSelected = selectedDayNumber === day.day;
              return (
                <button
                  key={day.day}
                  onClick={() => {
                    setSelectedDayNumber(day.day);
                    setActivePostId('');
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-neutral-50 border-neutral-900 shadow-sm'
                      : 'bg-white border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-neutral-900">Day {day.day}</span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-neutral-500 text-xs font-medium">{day.day_of_week}</span>
                    </div>
                    <div className="text-[11px] text-neutral-500 font-medium mt-1">
                      Angle: <span className="text-neutral-800">{day.angle}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full">
                      {day.emotion}
                    </span>
                    {day.floats.length > 0 && (
                      <span className="block text-[9px] text-purple-700 font-bold mt-1">
                        ✦ {day.floats.length} Float
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CENTER COLUMN: Day's Timeline Slots */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm space-y-4 h-full flex flex-col">
          <div>
            <h3 className="font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
              <Calendar className="w-4.5 h-4.5 text-neutral-700" />
              <span>Day {selectedDayObj.day} Posting Timeline</span>
            </h3>
            <p className="text-neutral-500 text-xs mt-0.5">
              {selectedDayObj.day_of_week} • Angle: {selectedDayObj.angle}
            </p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
            {/* Timeline posts list */}
            {currentDayPosts.map((post) => {
              const isActive = activePostId === post.id || (!activePostId && post.slot === 1);
              return (
                <div
                  key={post.id}
                  onClick={() => setActivePostId(post.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition flex flex-col gap-1.5 relative ${
                    isActive
                      ? 'bg-neutral-50 border-neutral-900 shadow-sm'
                      : 'bg-white border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{post.time}</span>
                      <span className="font-semibold text-neutral-800">[{post.role}]</span>
                      {post.isPublished && (
                        <span className="inline-flex items-center gap-0.5 text-green-700 bg-green-50 px-1.5 py-0.2 rounded font-bold uppercase text-[8px] border border-green-200">
                          <CheckCircle className="w-2.5 h-2.5 text-green-600" />
                          <span>PUBLISHED</span>
                        </span>
                      )}
                    </div>
                    <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] ${
                      post.role === 'Anchor Drop' ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {post.type}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {post.text}
                  </p>
                </div>
              );
            })}

            {/* Display Floats timeline posts */}
            {currentDayFloats.map((float) => {
              const isActive = activePostId === float.id;
              return (
                <div
                  key={float.id}
                  onClick={() => setActivePostId(float.id)}
                  className={`p-3 rounded-lg border border-purple-200 cursor-pointer transition flex flex-col gap-1.5 relative overflow-hidden ${
                    isActive
                      ? 'bg-purple-50/60 border-purple-800 shadow-sm'
                      : 'bg-purple-50/30 hover:bg-purple-50/50 hover:border-purple-300'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-3 h-3 bg-purple-500 transform rotate-45 translate-x-1.5 -translate-y-1.5" />
                  <div className="flex justify-between items-center text-[10px]">
                    <div className="flex items-center gap-1.5 font-mono text-purple-800 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{float.time}</span>
                      <span>[Floating Post]</span>
                      {float.isPublished && (
                        <span className="inline-flex items-center gap-0.5 text-green-700 bg-green-50 px-1.5 py-0.2 rounded font-bold uppercase text-[8px] border border-green-200">
                          <CheckCircle className="w-2.5 h-2.5 text-green-600" />
                          <span>PUBLISHED</span>
                        </span>
                      )}
                    </div>
                    <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded font-mono text-[9px]">
                      {float.type}
                    </span>
                  </div>
                  <p className="text-xs text-purple-900 line-clamp-2 leading-relaxed font-medium">
                    {float.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive High-Fidelity Preview & Edit */}
      <div className="lg:col-span-4">
        {activePost ? (
          <div className="space-y-4">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
              Live Post Interactive Preview
            </div>
            <XPostPreview
              post={activePost}
              weekNumber={activeWeek}
              onSimulateReward={onSimulateReward}
              onUpdatePostText={(newText) => {
                const isFloat = activePost.role === 'Floating';
                const dayIdx = selectedDayObj.day;
                onUpdatePostText(activeWeek, dayIdx, activePost.id, isFloat, newText);
              }}
              isEditable={true}
            />
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center text-neutral-400 flex flex-col items-center justify-center h-full min-h-[300px]">
            <Calendar className="w-10 h-10 text-neutral-300 mb-2" />
            <p className="text-xs">Select any timeline slot post to interact with simulation replies & trigger reinforcement!</p>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Bookmark, Share2, ShieldAlert, Award, ArrowUpRight, CheckCircle2, Sparkles, Cpu, RefreshCw, Layers } from 'lucide-react';
import { Post, FloatPost } from '../types';

interface XPostPreviewProps {
  post: Post | FloatPost;
  weekNumber: number;
  onSimulateReward?: (post: Post | FloatPost, userReply: string, username: string) => void;
  onUpdatePostText?: (newText: string) => void;
  isEditable?: boolean;
}

export const XPostPreview: React.FC<XPostPreviewProps> = ({
  post,
  weekNumber,
  onSimulateReward,
  onUpdatePostText,
  isEditable = false,
}) => {
  const [likes, setLikes] = useState(post.likes ?? Math.floor(Math.random() * 250) + 50);
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [retweets, setRetweets] = useState(post.retweets ?? Math.floor(Math.random() * 45) + 10);
  const [isRetweeted, setIsRetweeted] = useState(post.isRetweeted ?? false);
  const [bookmarks, setBookmarks] = useState(post.bookmarks ?? Math.floor(Math.random() * 80) + 15);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked ?? false);
  const [repliesCount, setRepliesCount] = useState(post.replies_count ?? Math.floor(Math.random() * 30) + 5);

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [username, setUsername] = useState('');
  const [replyText, setReplyText] = useState('');
  const [simulatedReplies, setSimulatedReplies] = useState<{ user: string; text: string; rewardTriggered?: string }[]>([]);
  const [editingText, setEditingText] = useState(post.text);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiLayer, setShowAiLayer] = useState(true);

  const handleLike = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const handleRetweet = () => {
    if (isRetweeted) {
      setRetweets((prev) => prev - 1);
      setIsRetweeted(false);
    } else {
      setRetweets((prev) => prev + 1);
      setIsRetweeted(true);
    }
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      setBookmarks((prev) => prev - 1);
      setIsBookmarked(false);
    } else {
      setBookmarks((prev) => prev + 1);
      setIsBookmarked(true);
    }
  };

  const submitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !username.trim()) return;

    // Determine reward based on post type and week
    let reward = '';
    const cleanUser = username.startsWith('@') ? username : `@${username}`;

    if (post.role === 'Build' || post.role === 'Floating' || post.type === 'Q' || post.type === 'P') {
      if (weekNumber <= 2) {
        reward = weekNumber === 1 ? 'personalized recommendation' : 'name-drop in a later post';
      } else if (weekNumber === 3) {
        reward = "written mini-guide for the recipient's specific situation";
      } else {
        reward = Math.random() > 0.5 ? 'public shoutout' : "custom write-up built around the recipient's reply";
      }
    }

    setSimulatedReplies((prev) => [
      ...prev,
      { user: cleanUser, text: replyText, rewardTriggered: reward || undefined },
    ]);
    setRepliesCount((prev) => prev + 1);

    if (reward && onSimulateReward) {
      onSimulateReward(post, replyText, cleanUser);
    }

    setReplyText('');
    setShowReplyForm(false);
  };

  const handleSaveText = () => {
    if (onUpdatePostText) {
      onUpdatePostText(editingText);
    }
    setIsEditing(false);
  };

  const handleAiGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let generated = post.text;
      if (post.role === 'Ignite') {
        generated = "Think cooking needs a science degree? Think again.\n\nTonight at 6, we're boiling it down to three simple, visual rules.\n\n👀";
      } else if (post.role === 'Build' && post.type === 'Q') {
        generated = "What's the one dish you always order because you're terrified of messing it up at home?\n\nTell me below — no judgment. 👇";
      } else if (post.role === 'Build' && post.type === 'B') {
        generated = "Confidence isn't something you're born with.\n\nIt's something you build, one simple visual recipe at a time.\n\n🔔 6 PM.";
      } else if (post.role === 'Tease') {
        generated = "Your Monday drop is locked for 6 PM:\n\n✦ A 3-minute method that never fails\n✦ The optical heat trick that prevents burning\n✦ A comic-strip layout you can save forever\n\nBookmark it now. ⬇️";
      } else if (post.role === 'Amplify') {
        generated = "The 3-minute scrambled egg comic is live! 🎉\n\nUse it tonight. Notice how light they are.\n\nTag a friend who claims they cannot boil an egg. 👇";
      } else if (post.role === 'Close') {
        generated = "Monday done. You took the first step.\n\nTomorrow, we move from welcome to belonging with an unexpected visual technique.\n\n🔔 See you at 07:30.";
      } else if (post.role === 'Floating') {
        generated = "Unscheduled thought:\n\nIf you take one thing from this week — take the version you can actually repeat.\n\nThat's the drop. 👇";
      }

      setEditingText(generated);
      if (onUpdatePostText) {
        onUpdatePostText(generated);
      }
      setIsGenerating(false);
    }, 1200);
  };

  // Guardrail analysis inside the post
  const containsScarcity = /limited time|hurry|only \d+ left|ending soon|act now/i.test(editingText);
  const containsPlaceholders = /\[.*\]|placeholder/i.test(editingText);
  const isAnchorAndMarketed = post.role === 'Anchor Drop' && (/#|sale|discount|buy|coupon/i.test(editingText));

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full max-w-xl mx-auto" id={`post-card-${post.id}`}>
      {/* Header Info */}
      <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
            post.role === 'Anchor Drop' || post.role === 'Anchor' 
              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
              : post.role === 'Floating'
              ? 'bg-purple-100 text-purple-800 border border-purple-200'
              : 'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {post.role}
          </span>
          <span className="text-neutral-500 text-xs font-mono">
            Slot {post.slot ?? 'FLOAT'} • {post.time ?? 'Unscheduled'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <span className="font-mono bg-neutral-200/60 px-1.5 py-0.5 rounded text-[10px]">
            Code: {post.type}
          </span>
          <span className="capitalize">{post.status}</span>
        </div>
      </div>

      {/* Main Tweet Body */}
      <div className="p-4 flex-1">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-inner">
            CB
          </div>
          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-bold text-neutral-900 text-sm hover:underline cursor-pointer">r_comic_book</span>
              <svg className="w-4.5 h-4.5 text-blue-500 fill-current" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span className="text-neutral-500 text-sm">@r_comic_book</span>
              <span className="text-neutral-300 text-sm">•</span>
              <span className="text-neutral-500 text-sm">
                {post.isPublished ? (
                  <span className="inline-flex items-center gap-1 text-green-700 bg-green-50/80 px-1.5 py-0.2 rounded font-mono font-bold text-[9px] border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                    <span>PUBLISHED</span>
                  </span>
                ) : (
                  'Draft'
                )}
              </span>
            </div>

            {/* Tweet Text Content */}
            <div className="mt-2 text-[15px] leading-relaxed text-neutral-900 whitespace-pre-wrap select-text">
              {isEditing ? (
                <div className="space-y-2 mt-1">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full p-2.5 text-sm border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 font-sans min-h-[100px]"
                    placeholder="Draft your post..."
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => { setEditingText(post.text); setIsEditing(false); }}
                      className="px-2.5 py-1 text-xs text-neutral-500 hover:bg-neutral-100 rounded-md transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveText}
                      className="px-2.5 py-1 text-xs bg-neutral-900 text-white hover:bg-neutral-800 rounded-md transition font-medium"
                    >
                      Save Change
                    </button>
                  </div>
                </div>
              ) : (
                <p>{post.text}</p>
              )}
            </div>

            {/* Local Warnings Indicator */}
            {(containsScarcity || containsPlaceholders || isAnchorAndMarketed) && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 space-y-1">
                <div className="flex items-center gap-1 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>Guardrail Infraction Detected:</span>
                </div>
                {containsScarcity && <p>• "Manufactured Scarcity" words identified. Keep copy focused on pure value.</p>}
                {containsPlaceholders && <p>• Contains empty bracket placeholders (e.g., [insert]).</p>}
                {isAnchorAndMarketed && <p>• Anchor Drop posts must remain pure value and never blend with sale/marketing/coupon links.</p>}
              </div>
            )}

            {/* v3.0 AI Prompt Generation Layer & Variables */}
            {(post.ai_prompt_ref || post.prompt_variables) && (
              <div className="mt-4 border border-neutral-200/80 rounded-xl overflow-hidden bg-neutral-50/40 shadow-sm">
                <div className="bg-neutral-100/70 px-3 py-2 flex items-center justify-between border-b border-neutral-200">
                  <div className="flex items-center gap-1.5 text-neutral-800">
                    <Sparkles className="w-3.5 h-3.5 text-neutral-600 animate-pulse" />
                    <span className="text-xs font-bold font-mono">AI GENERATION LAYER (v3.0)</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowAiLayer(!showAiLayer)}
                    className="text-[10px] bg-neutral-200 text-neutral-700 font-bold px-1.5 py-0.5 rounded uppercase hover:bg-neutral-300 transition"
                  >
                    {showAiLayer ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
                
                {showAiLayer && (
                  <div className="p-3.5 space-y-3.5 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-neutral-400 font-semibold block mb-0.5 font-mono uppercase text-[9px]">SYSTEM PROMPT REF</span>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-neutral-200/75 border border-neutral-300 text-neutral-800 font-mono font-bold">
                          <Cpu className="w-3 h-3 text-neutral-600" />
                          <span>{post.ai_prompt_ref}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-neutral-400 font-semibold block mb-0.5 font-mono uppercase text-[9px]">TONE CALIBRATION</span>
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold inline-block">
                          Week {weekNumber} Signature
                        </span>
                      </div>
                    </div>

                    {post.prompt_variables && typeof post.prompt_variables === 'object' && (
                      <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-neutral-200/80">
                        <span className="text-neutral-400 font-semibold block font-mono uppercase text-[9px]">DYNAMIC SLOTS (PROMPT VARIABLES)</span>
                        <div className="grid grid-cols-1 gap-1.5 max-h-[140px] overflow-y-auto">
                          {Object.entries(post.prompt_variables || {}).map(([key, val]) => (
                            <div key={key} className="flex justify-between items-start border-b border-neutral-100 last:border-b-0 pb-1 last:pb-0">
                              <span className="font-mono text-[10px] text-neutral-600 font-semibold">{"{"}{key}{"}"}:</span>
                              <span className="text-neutral-800 text-[11px] text-right font-medium max-w-[70%] line-clamp-1 truncate" title={String(val)}>
                                {String(val)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 justify-between items-center pt-1 border-t border-neutral-200/60">
                      <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                        <Layers className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Self-Audit Auto-Enforced</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAiGenerate}
                        disabled={isGenerating}
                        className={`px-3 py-1.5 rounded-lg bg-neutral-900 text-white font-bold text-xs flex items-center gap-1.5 transition ${
                          isGenerating 
                            ? 'opacity-80 cursor-not-allowed' 
                            : 'hover:bg-neutral-800 hover:shadow-sm'
                        }`}
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Generative Run...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>Generate with AI model</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* X Action Buttons Metrics */}
      <div className="px-4 py-2 border-t border-b border-neutral-100 flex items-center justify-between text-neutral-500 text-xs">
        <span><b>{likes + bookmarks * 2 + retweets * 4 + repliesCount * 5}</b> Views</span>
        <span className="font-medium hover:underline cursor-pointer" onClick={() => setShowReplyForm(!showReplyForm)}>
          {repliesCount} Replies
        </span>
      </div>

      <div className="px-2 py-1 bg-neutral-50/50 flex items-center justify-around text-neutral-500">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="flex items-center gap-1.5 p-2 hover:bg-neutral-100 rounded-full transition hover:text-blue-500"
          title="Simulate Reply"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs">{repliesCount}</span>
        </button>

        <button
          onClick={handleRetweet}
          className={`flex items-center gap-1.5 p-2 hover:bg-neutral-100 rounded-full transition hover:text-green-600 ${isRetweeted ? 'text-green-600' : ''}`}
        >
          <Repeat2 className="w-4 h-4" />
          <span className="text-xs">{retweets}</span>
        </button>

        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 p-2 hover:bg-neutral-100 rounded-full transition hover:text-red-500 ${isLiked ? 'text-red-500 fill-red-500' : ''}`}
        >
          <Heart className="w-4 h-4" />
          <span className="text-xs">{likes}</span>
        </button>

        <button
          onClick={handleBookmark}
          className={`flex items-center gap-1.5 p-2 hover:bg-neutral-100 rounded-full transition hover:text-yellow-500 ${isBookmarked ? 'text-yellow-500 fill-yellow-500' : ''}`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="text-xs">{bookmarks}</span>
        </button>

        {isEditable && onUpdatePostText && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-semibold px-2 py-1 text-neutral-700 bg-neutral-200/80 hover:bg-neutral-200 rounded-md transition"
          >
            Edit
          </button>
        )}
      </div>

      {/* Simulated Replies Block */}
      {simulatedReplies.length > 0 && (
        <div className="p-3 bg-neutral-50 border-t border-neutral-100 space-y-3">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Simulated Replies</div>
          {simulatedReplies.map((sr, idx) => (
            <div key={idx} className="space-y-1 bg-white p-2.5 rounded-lg border border-neutral-200 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-800 text-xs">{sr.user}</span>
                <span className="text-[10px] text-neutral-400 font-mono">Simulated</span>
              </div>
              <p className="text-neutral-700 text-xs">{sr.text}</p>
              {sr.rewardTriggered && (
                <div className="mt-1.5 p-1.5 bg-green-50 border border-green-100 rounded text-[11px] text-green-800 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3 text-green-600 shrink-0" />
                    <span>Triggered: <b>{sr.rewardTriggered}</b></span>
                  </div>
                  <span className="text-[9px] bg-green-200 text-green-900 px-1 py-0.2 rounded uppercase font-bold tracking-tight">Ledgered</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Interactive Write Reply Form */}
      {showReplyForm && (
        <form onSubmit={submitReply} className="p-3 bg-neutral-50 border-t border-neutral-100 space-y-2">
          <div className="text-xs font-bold text-neutral-700 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Simulate User Interactive Response</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="@username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-1 p-2 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
              required
            />
            <input
              type="text"
              placeholder="What's your answer/reply?"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="col-span-2 p-2 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-neutral-500 max-w-[70%]">
              {post.role === 'Build' || post.role === 'Floating' || post.type === 'Q' || post.type === 'P'
                ? `Replying here will trigger the Week ${weekNumber} reinforcement reward!`
                : 'Regular slots yield feedback, but no ledgered reinforcement.'}
            </span>
            <button
              type="submit"
              className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-medium transition"
            >
              Post Reply
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

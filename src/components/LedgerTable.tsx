import React, { useState } from 'react';
import { Search, Plus, Check, Clock, ShieldCheck, ShieldAlert, Award, RefreshCw, Trash2 } from 'lucide-react';
import { LedgerEntry } from '../types';

interface LedgerTableProps {
  entries: LedgerEntry[];
  onToggleDelivered: (id: string) => void;
  onAddEntry: (entry: Partial<LedgerEntry>) => void;
  onDeleteEntry: (id: string) => void;
  onResetLedger: () => void;
}

export const LedgerTable: React.FC<LedgerTableProps> = ({
  entries,
  onToggleDelivered,
  onAddEntry,
  onDeleteEntry,
  onResetLedger,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [showAddForm, setShowAddForm] = useState(false);

  // New row form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('Question');
  const [promised, setPromised] = useState('');
  const [recipient, setRecipient] = useState('');

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.recipient.toLowerCase().includes(search.toLowerCase()) ||
      entry.promised.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || entry.type === filterType;
    return matchesSearch && matchesType;
  });

  const uniqueTypes = Array.from(new Set(entries.map((e) => e.type)));

  // Calculate integrity state
  const hasEmptyOrUndelivered = entries.some((e) => !e.delivered);
  const totalCount = entries.length;
  const deliveredCount = entries.filter((e) => e.delivered).bind ? entries.filter((e) => e.delivered).length : entries.filter((e) => e.delivered).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promised.trim() || !recipient.trim()) return;

    onAddEntry({
      date,
      dayNumber: 1, // default
      type,
      promised,
      recipient: recipient.startsWith('@') ? recipient : `@${recipient}`,
      delivered: false,
      date_delivered: '',
    });

    setPromised('');
    setRecipient('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden" id="ledger-panel">
      {/* Integrity banner */}
      <div className={`p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
        hasEmptyOrUndelivered || totalCount === 0
          ? 'bg-amber-50/50 border-amber-100 text-amber-900'
          : 'bg-green-50/50 border-green-100 text-green-900'
      }`}>
        <div className="flex items-center gap-2.5">
          {hasEmptyOrUndelivered || totalCount === 0 ? (
            <ShieldAlert className="w-5.5 h-5.5 text-amber-600 shrink-0" />
          ) : (
            <ShieldCheck className="w-5.5 h-5.5 text-green-600 shrink-0" />
          )}
          <div>
            <h3 className="font-bold text-sm">
              {hasEmptyOrUndelivered || totalCount === 0
                ? 'Variable Reinforcement Integrity Compromised'
                : 'Variable Reinforcement Integrity Secured'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Rule: If any row is empty/undelivered at month end, the reinforcement mechanic is compromised.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs font-mono font-bold bg-white border px-2.5 py-1 rounded">
            {deliveredCount}/{totalCount} Deliveries Completed
          </div>
          <button
            onClick={onResetLedger}
            className="p-1 hover:bg-neutral-200 rounded text-neutral-500 transition"
            title="Reset Ledger to Default Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="p-4 border-b border-neutral-100 flex flex-col md:flex-row gap-3 justify-between">
        <div className="flex flex-1 gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by recipient or promised reward..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 text-xs border border-neutral-300 rounded-lg bg-white"
          >
            <option value="ALL">All Types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition self-end md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Manual Entry</span>
        </button>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-4 bg-neutral-50 border-b border-neutral-100 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Promised Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 text-xs border border-neutral-300 rounded bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Interaction Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 text-xs border border-neutral-300 rounded bg-white"
            >
              <option value="Question">Question</option>
              <option value="Poll">Poll</option>
              <option value="Build">Build</option>
              <option value="Mystery">Mystery</option>
              <option value="Spotlight">Spotlight</option>
              <option value="Drop">Drop</option>
              <option value="Receipt">Receipt</option>
              <option value="Ghost">Ghost</option>
              <option value="Vault">Vault</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Recipient Handles</label>
            <input
              type="text"
              placeholder="@username"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-2 text-xs border border-neutral-300 rounded bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Promised Reward</label>
            <input
              type="text"
              placeholder="e.g. customized recommendation"
              value={promised}
              onChange={(e) => setPromised(e.target.value)}
              className="w-full p-2 text-xs border border-neutral-300 rounded bg-white"
              required
            />
          </div>
          <div className="md:col-span-4 flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-neutral-500 hover:bg-neutral-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-neutral-950 text-white rounded text-xs font-bold hover:bg-neutral-800 transition"
            >
              Save Promised Record
            </button>
          </div>
        </form>
      )}

      {/* Ledger Table Rendering */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 text-neutral-500 text-[10px] font-bold uppercase tracking-wider border-b border-neutral-200">
              <th className="p-4">Date</th>
              <th className="p-4">Recipient</th>
              <th className="p-4">Trigger Type</th>
              <th className="p-4">Promised Reward</th>
              <th className="p-4">Status</th>
              <th className="p-4">Completion Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-xs text-neutral-700">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-neutral-400">
                  No promised rewards in this view. Write simulated replies to campaign posts to log items!
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-neutral-50/60 transition">
                  <td className="p-4 font-mono">{entry.date}</td>
                  <td className="p-4 font-semibold text-neutral-900">{entry.recipient}</td>
                  <td className="p-4">
                    <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-[10px] font-mono">
                      {entry.type}
                    </span>
                  </td>
                  <td className="p-4 flex items-center gap-1.5 font-sans font-medium text-neutral-900">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>{entry.promised}</span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => onToggleDelivered(entry.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition ${
                        entry.delivered
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {entry.delivered ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Delivered</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>Promised (Pending)</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4 font-mono text-neutral-500">
                    {entry.delivered ? entry.date_delivered || entry.date : '—'}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-1 text-neutral-400 hover:text-red-600 rounded transition"
                      title="Delete log row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

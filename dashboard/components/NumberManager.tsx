import React, { useState } from 'react';
import { PhoneNumber } from '../types';
import { Plus, Smartphone, Signal, WifiOff, Trash2, Check, X } from 'lucide-react';

interface NumberManagerProps {
  numbers: PhoneNumber[];
  onAddNumber: (num: PhoneNumber) => void;
  onDeleteNumber: (id: string) => void;
}

export const NumberManager: React.FC<NumberManagerProps> = ({ numbers, onAddNumber, onDeleteNumber }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newNumber, setNewNumber] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNumber || !newLabel) return;

    const num: PhoneNumber = {
      id: Date.now().toString(),
      display_name: newLabel,
      phone_number: newNumber,
      quality_rating: 'Medium',
      status: 'Pending'
    };

    onAddNumber(num);
    setNewNumber('');
    setNewLabel('');
    setIsAdding(false);
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden bg-white">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-500" />
            Connected Numbers
          </h3>
          <p className="text-slate-500 text-xs mt-1">Manage your WhatsApp sender IDs</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all duration-300 ${
              isAdding 
              ? 'bg-slate-100 text-slate-600' 
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200/50'
          }`}
        >
          {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {isAdding ? 'Cancel' : 'Connect Number'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="p-6 bg-slate-50 border-b border-slate-100 animate-in fade-in slide-in-from-top-2">
           <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Display Name</label>
                <input 
                  type="text" 
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Sales Team US"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all placeholder:text-slate-400"
                />
             </div>
             <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Phone Number</label>
                <input 
                  type="text" 
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  placeholder="e.g. +1 555 012 3456"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all placeholder:text-slate-400"
                />
             </div>
           </div>
           <div className="mt-6 flex justify-end">
             <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center transition-all">
                <Check className="w-4 h-4 mr-2" />
                Save Number
             </button>
           </div>
        </form>
      )}

      <div className="divide-y divide-slate-100">
        {numbers.map((num) => (
          <div key={num.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                num.status === 'Connected' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'
              }`}>
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-slate-800 font-bold text-sm">{num.display_name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-slate-500 text-xs font-mono">{num.phone_number}</p>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        num.quality_rating === 'High' ? 'bg-emerald-100 text-emerald-700' : 
                        num.quality_rating === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                        {num.quality_rating} Quality
                    </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pl-14 md:pl-0">
              <div className="flex flex-col items-end">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold border ${
                    num.status === 'Connected' 
                    ? 'bg-white border-emerald-200 text-emerald-700' 
                    : 'bg-white border-amber-200 text-amber-700'
                    }`}>
                    {num.status === 'Connected' ? <Signal className="w-3 h-3 mr-1.5" /> : <WifiOff className="w-3 h-3 mr-1.5" />}
                    {num.status}
                  </span>
              </div>
              
              <button 
                onClick={() => onDeleteNumber(num.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                title="Remove Number"
              >
                  <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {numbers.length === 0 && (
            <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Smartphone className="w-8 h-8" />
                </div>
                <h3 className="text-slate-900 font-bold text-sm mb-1">No Connected Numbers</h3>
                <p className="text-slate-400 text-xs">
                    Add a number to get started.
                </p>
            </div>
        )}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import type { StoryBankItem } from '../../types';
import { BookOpen, Plus, Search, Sparkles, Tag, HelpCircle, ChevronRight, X } from 'lucide-react';

interface StoryBankProps {
  stories: StoryBankItem[];
  onSaveStory: (story: Partial<StoryBankItem>) => Promise<boolean>;
  onPracticeStory: (story: StoryBankItem) => void;
}

export const StoryBank: React.FC<StoryBankProps> = ({ stories, onSaveStory, onPracticeStory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStory, setSelectedStory] = useState<StoryBankItem | null>(stories[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  
  // New story draft form state
  const [formData, setFormData] = useState<Partial<StoryBankItem>>({
    title: '',
    rawVersion: '',
    polishedVersion: '',
    coreConflict: '',
    turningPoint: '',
    lesson: '',
    themes: ['Leadership', 'Crisis'],
    interviewUseCases: ['Tell me about a time you failed', 'How do you handle pressure?']
  });

  const filteredStories = stories.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rawVersion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.themes.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      rawVersion: '',
      polishedVersion: '',
      coreConflict: '',
      turningPoint: '',
      lesson: '',
      themes: ['Ownership'],
      interviewUseCases: ['Describe a major challenge you faced']
    });
    setSelectedStory(null);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.rawVersion) return;
    
    // Generate polished version recommendation if empty
    const polished = formData.polishedVersion || 
      `In a critical moment during "${formData.title}", ${formData.rawVersion.slice(0, 150)}... This experience proved that ${formData.lesson || 'ownership beats hesitation'}.`;

    const payload: Partial<StoryBankItem> = {
      ...formData,
      polishedVersion: polished
    };

    await onSaveStory(payload);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card-accent p-6 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Personal Life Story Bank</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white mt-1">
            Story Vault & Interview Mapping
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Store, polish, and optimize core life experiences. A single well-structured story can seamlessly answer 5+ different behavioral interview questions and speech hooks.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-surface-950 font-bold text-sm shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Story</span>
        </button>
      </div>

      {/* Main Grid: Left List + Right Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Story List */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search stories by keyword or theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* List Cards */}
          <div className="space-y-3">
            {filteredStories.map((story) => {
              const isSelected = selectedStory?.id === story.id && !isEditing;
              return (
                <div
                  key={story.id}
                  onClick={() => {
                    setSelectedStory(story);
                    setIsEditing(false);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500 shadow-md'
                      : 'bg-surface-900/60 border-white/5 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-white text-base">{story.title}</h4>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                      {story.practiceCount} Practices
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                    {story.polishedVersion || story.rawVersion}
                  </p>

                  <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400 border-t border-white/5 pt-2">
                    <div className="flex items-center space-x-1">
                      <Tag className="w-3 h-3 text-cyan-400" />
                      <span>{story.themes.slice(0, 2).join(', ')}</span>
                    </div>
                    <span className="text-emerald-400 font-medium">
                      Answers {story.interviewUseCases.length} Interview Qs
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Side: Detail Viewer or Editor */}
        <div className="lg:col-span-7">
          {isEditing ? (
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white">Create / Edit Story</h3>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Story Title</label>
                <input
                  type="text"
                  placeholder="e.g. The 3 AM Production Outage"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-surface-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Raw Experience / What Happened</label>
                <textarea
                  rows={4}
                  placeholder="Describe what happened in your own natural words..."
                  value={formData.rawVersion}
                  onChange={(e) => setFormData({ ...formData, rawVersion: e.target.value })}
                  className="w-full bg-surface-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Core Conflict / High Stakes</label>
                  <input
                    type="text"
                    placeholder="What went wrong or was at risk?"
                    value={formData.coreConflict}
                    onChange={(e) => setFormData({ ...formData, coreConflict: e.target.value })}
                    className="w-full bg-surface-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Turning Point Decision</label>
                  <input
                    type="text"
                    placeholder="What key action flipped the outcome?"
                    value={formData.turningPoint}
                    onChange={(e) => setFormData({ ...formData, turningPoint: e.target.value })}
                    className="w-full bg-surface-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Polished High-Impact Version</label>
                <textarea
                  rows={3}
                  placeholder="Polished story version (or leave blank to auto-generate)..."
                  value={formData.polishedVersion}
                  onChange={(e) => setFormData({ ...formData, polishedVersion: e.target.value })}
                  className="w-full bg-surface-900 border border-white/10 rounded-xl p-3 text-xs text-emerald-300 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-surface-900 text-slate-300 text-sm font-semibold hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-surface-950 font-bold text-sm shadow-md hover:bg-emerald-400"
                >
                  Save Story to Vault
                </button>
              </div>
            </div>
          ) : selectedStory ? (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
              
              {/* Story Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                      Polished Story Vault
                    </span>
                    <span className="text-xs text-slate-400">Practiced {selectedStory.practiceCount} times</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mt-1">{selectedStory.title}</h3>
                </div>

                <button
                  onClick={() => onPracticeStory(selectedStory)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 text-surface-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Practice Story</span>
                </button>
              </div>

              {/* Polished vs Raw Comparison */}
              <div className="space-y-4">
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/30">
                  <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs uppercase mb-1">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Polished High-Impact Version</span>
                  </div>
                  <p className="text-sm text-slate-100 leading-relaxed font-medium">
                    "{selectedStory.polishedVersion}"
                  </p>
                </div>

                <div className="bg-surface-900/60 p-3.5 rounded-xl border border-white/5 text-xs">
                  <span className="text-slate-400 uppercase font-semibold block mb-1">Raw Life Experience</span>
                  <p className="text-slate-300 italic font-mono">{selectedStory.rawVersion}</p>
                </div>
              </div>

              {/* Conflict & Turning Point */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-surface-900/80 p-3.5 rounded-xl border border-white/5">
                  <span className="text-xs text-slate-400 font-semibold uppercase block">Core Conflict</span>
                  <p className="text-xs text-rose-300 font-medium mt-1">{selectedStory.coreConflict}</p>
                </div>

                <div className="bg-surface-900/80 p-3.5 rounded-xl border border-white/5">
                  <span className="text-xs text-slate-400 font-semibold uppercase block">Turning Point Action</span>
                  <p className="text-xs text-emerald-300 font-medium mt-1">{selectedStory.turningPoint}</p>
                </div>
              </div>

              {/* Interview Questions Answered Mapping */}
              <div className="bg-surface-900/80 p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase">
                  <HelpCircle className="w-4 h-4" />
                  <span>Interview & Speech Questions This Story Answers ({selectedStory.interviewUseCases.length})</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {selectedStory.interviewUseCases.map((q, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-200">
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>"{q}"</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center">
              <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-300 font-bold">Select a story from the left vault or create a new one.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

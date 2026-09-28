import React, { useState } from 'react';
import type { StoryBankItem } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from '../ui/empty';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BookOpen, Plus, Search, Sparkles, Tag, HelpCircle, ChevronRight, PlayCircle } from 'lucide-react';

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
          <Badge className="mb-3 bg-emerald-500/15 text-emerald-300 border-emerald-500/30 rounded-full gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Personal Life Story Bank
          </Badge>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white mt-1">
            Story Vault & Interview Mapping
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Store, polish, and optimize core life experiences. A single well-structured story can seamlessly answer 5+ different behavioral interview questions and speech hooks.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-surface-950 font-bold text-sm shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Story
        </Button>
      </div>

      {/* Main Grid: Left List + Right Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Story List */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search stories by keyword or theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-surface-900/80 border-white/10 text-white placeholder:text-slate-400"
            />
          </div>

          {/* List Cards */}
          <ScrollArea className="h-[520px] pr-2">
            <div className="space-y-3">
              {filteredStories.map((story) => {
                const isSelected = selectedStory?.id === story.id && !isEditing;
                return (
                  <Card
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
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-white text-base">{story.title}</h4>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 rounded-full shrink-0">
                          {story.practiceCount} Practices
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                        {story.polishedVersion || story.rawVersion}
                      </p>

                      <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400 border-t border-white/5 pt-2">
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-cyan-400" />
                          <span>{story.themes.slice(0, 2).join(', ')}</span>
                        </div>
                        <span className="text-emerald-400 font-medium">
                          Answers {story.interviewUseCases.length} Interview Qs
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>

        </div>

        {/* Right Side: Detail Viewer */}
        <div className="lg:col-span-7">
          {selectedStory ? (
            <Card className="p-6 rounded-2xl border-white/10 gap-5">
              
              {/* Story Header */}
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 rounded-full uppercase">
                      Polished Story Vault
                    </Badge>
                    <span className="text-xs text-slate-400">Practiced {selectedStory.practiceCount} times</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mt-1 break-words">{selectedStory.title}</h3>
                </div>

                <Button
                  onClick={() => onPracticeStory(selectedStory)}
                  className="gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-surface-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 shrink-0"
                >
                  <PlayCircle className="w-4 h-4" />
                  Practice Story
                </Button>
              </div>

              {/* Polished vs Raw */}
              <Tabs defaultValue="polished" className="gap-2">
                <TabsList>
                  <TabsTrigger value="polished">Polished</TabsTrigger>
                  <TabsTrigger value="raw">Raw Experience</TabsTrigger>
                </TabsList>
                <TabsContent value="polished">
                  <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/30">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase mb-1">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Polished High-Impact Version
                    </div>
                    <p className="text-sm text-slate-100 leading-relaxed font-medium">
                      "{selectedStory.polishedVersion}"
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="raw">
                  <div className="bg-surface-900/60 p-3.5 rounded-xl border border-white/5 text-xs">
                    <span className="text-slate-400 uppercase font-semibold block mb-1">Raw Life Experience</span>
                    <p className="text-slate-300 italic font-mono">{selectedStory.rawVersion}</p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Conflict & Turning Point */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-surface-900/80 p-3.5 rounded-xl border border-white/5">
                  <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-rose-400" />
                    Core Conflict
                  </span>
                  <p className="text-xs text-rose-300 font-medium mt-1">{selectedStory.coreConflict}</p>
                </div>

                <div className="bg-surface-900/80 p-3.5 rounded-xl border border-white/5">
                  <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Turning Point Action
                  </span>
                  <p className="text-xs text-emerald-300 font-medium mt-1">{selectedStory.turningPoint}</p>
                </div>
              </div>

              {/* Interview Questions Answered Mapping */}
              <div className="bg-surface-900/80 p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase">
                  <HelpCircle className="w-4 h-4" />
                  Interview & Speech Questions This Story Answers ({selectedStory.interviewUseCases.length})
                </div>

                <Separator className="bg-white/5" />

                <div className="space-y-1.5 pt-1">
                  {selectedStory.interviewUseCases.map((q, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>"{q}"</span>
                    </div>
                  ))}
                </div>
              </div>

            </Card>
          ) : (
            <Empty className="glass-panel p-12 rounded-2xl border-dashed border-white/20">
              <EmptyMedia variant="icon">
                <BookOpen />
              </EmptyMedia>
              <EmptyContent>
                <EmptyTitle className="text-white">No story selected</EmptyTitle>
                <EmptyDescription className="text-slate-400">
                  Select a story from the vault on the left, or create a new one to start mapping interviews.
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          )}
        </div>
      </div>

      {/* Create / Edit Story Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => setIsEditing(open)}>
        <DialogContent className="max-w-2xl rounded-2xl gap-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">Create / Edit Story</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Structure your raw experience into a high-impact story vault entry.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="story-title" className="text-xs text-slate-400 font-semibold">Story Title</Label>
              <Input
                id="story-title"
                type="text"
                placeholder="e.g. The 3 AM Production Outage"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="rounded-xl bg-surface-900 border-white/10 text-sm text-white"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="story-raw" className="text-xs text-slate-400 font-semibold">Raw Experience / What Happened</Label>
              <Textarea
                id="story-raw"
                placeholder="Describe what happened in your own natural words..."
                value={formData.rawVersion}
                onChange={(e) => setFormData({ ...formData, rawVersion: e.target.value })}
                className="rounded-xl bg-surface-900 border-white/10 text-sm text-white min-h-24"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="story-conflict" className="text-xs text-slate-400 font-semibold">Core Conflict / High Stakes</Label>
                <Input
                  id="story-conflict"
                  type="text"
                  placeholder="What went wrong or was at risk?"
                  value={formData.coreConflict}
                  onChange={(e) => setFormData({ ...formData, coreConflict: e.target.value })}
                  className="rounded-xl bg-surface-900 border-white/10 text-xs text-white"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="story-turning" className="text-xs text-slate-400 font-semibold">Turning Point Decision</Label>
                <Input
                  id="story-turning"
                  type="text"
                  placeholder="What key action flipped the outcome?"
                  value={formData.turningPoint}
                  onChange={(e) => setFormData({ ...formData, turningPoint: e.target.value })}
                  className="rounded-xl bg-surface-900 border-white/10 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="story-polished" className="text-xs text-slate-400 font-semibold">Polished High-Impact Version</Label>
              <Textarea
                id="story-polished"
                placeholder="Polished story version (or leave blank to auto-generate)..."
                value={formData.polishedVersion}
                onChange={(e) => setFormData({ ...formData, polishedVersion: e.target.value })}
                className="rounded-xl bg-surface-900 border-white/10 text-xs text-emerald-300 min-h-20"
              />
            </div>
          </div>

          <DialogFooter showCloseButton>
            <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl text-slate-300">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="rounded-xl bg-emerald-500 text-surface-950 font-bold shadow-md hover:bg-emerald-400"
            >
              Save Story to Vault
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};
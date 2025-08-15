import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SessionCard } from '@/components/sessions/SessionCard';
import { sessionsService, WellnessSession } from '@/lib/sessions';
import { Search, Filter } from 'lucide-react';

const BrowseSessions = () => {
  const [sessions, setSessions] = useState<WellnessSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<WellnessSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  useEffect(() => {
    const publicSessions = sessionsService.getPublicSessions();
    setSessions(publicSessions);
    setFilteredSessions(publicSessions);
  }, []);

  useEffect(() => {
    let filtered = sessions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(session => session.type === typeFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(session => session.difficulty === difficultyFilter);
    }

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, typeFilter, difficultyFilter]);

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Discover Wellness Sessions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our collection of guided wellness sessions created by our community. 
            Find the perfect practice for your mood, schedule, and goals.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card card-gradient border-border/50 rounded-2xl p-6 mb-8 card-shadow">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Filter Sessions</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border/50 focus:border-primary"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="border-border/50 focus:border-primary">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="meditation">Meditation</SelectItem>
                <SelectItem value="yoga">Yoga</SelectItem>
                <SelectItem value="mindfulness">Mindfulness</SelectItem>
                <SelectItem value="breathing">Breathing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="border-border/50 focus:border-primary">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              showActions={false}
              showFavorites={true}
              showCompletion={true}
            />
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">
              No sessions found matching your criteria.
            </p>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to see more results.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Showing {filteredSessions.length} of {sessions.length} sessions
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrowseSessions;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WellnessSession } from '@/lib/sessions';
import { Loader2 } from 'lucide-react';

interface CreateSessionFormProps {
  onSubmit: (sessionData: Omit<WellnessSession, 'id' | 'createdAt'>) => Promise<void>;
  initialData?: Partial<WellnessSession>;
  isEditing?: boolean;
}

export const CreateSessionForm: React.FC<CreateSessionFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'meditation',
    duration: initialData?.duration || 10,
    difficulty: initialData?.difficulty || 'beginner',
    instructor: initialData?.instructor || '',
    isPublic: initialData?.isPublic || false,
    createdBy: initialData?.createdBy || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formData as Omit<WellnessSession, 'id' | 'createdAt'>);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="card-gradient border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {isEditing ? 'Edit Session' : 'Create New Session'}
        </CardTitle>
        <p className="text-muted-foreground">
          {isEditing ? 'Update your wellness session details' : 'Share your wellness practice with the community'}
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Session Title</Label>
              <Input
                id="title"
                placeholder="e.g., Morning Mindfulness"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="border-border/50 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor (Optional)</Label>
              <Input
                id="instructor"
                placeholder="Your name or instructor name"
                value={formData.instructor}
                onChange={(e) => handleInputChange('instructor', e.target.value)}
                className="border-border/50 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what makes this session special..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              rows={4}
              className="border-border/50 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type">Session Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger className="border-border/50 focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meditation">Meditation</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="breathing">Breathing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => handleInputChange('difficulty', value)}
              >
                <SelectTrigger className="border-border/50 focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="180"
                placeholder="10"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 10)}
                required
                className="border-border/50 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
            />
            <div className="space-y-1">
              <Label htmlFor="isPublic" className="text-sm font-medium">
                Make this session public
              </Label>
              <p className="text-xs text-muted-foreground">
                Public sessions can be discovered by other users in the Browse section
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full wellness-gradient border-0 hover-lift wellness-transition"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update Session' : 'Create Session'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
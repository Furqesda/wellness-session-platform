import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { WellnessSession } from '@/lib/sessions';
import { Loader2, Play, Upload, ExternalLink } from 'lucide-react';

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
    difficulty: initialData?.difficulty || 'Beginner',
    isPublic: initialData?.isPublic || false,
    videoType: initialData?.videoType || 'youtube',
    videoUrl: initialData?.videoUrl || '',
    customVideoFile: initialData?.customVideoFile || ''
  });
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

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

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
      setFormData(prev => ({ ...prev, customVideoFile: videoUrl }));
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : '';
  };

  const isValidYouTubeUrl = (url: string) => {
    return /(?:youtube\.com\/watch\?v=|youtu\.be\/)[^&\n?#]+/.test(url);
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
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
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

          {/* Video Section */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Play className="h-5 w-5" />
                Video Content
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Add a video to guide users through your wellness session
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Video Type</Label>
                <RadioGroup
                  value={formData.videoType}
                  onValueChange={(value) => handleInputChange('videoType', value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="youtube" id="youtube" />
                    <Label htmlFor="youtube" className="flex items-center gap-2 cursor-pointer">
                      <ExternalLink className="h-4 w-4" />
                      Use YouTube Link
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="flex items-center gap-2 cursor-pointer">
                      <Upload className="h-4 w-4" />
                      Upload Custom Video
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.videoType === 'youtube' && (
                <div className="space-y-3">
                  <Label htmlFor="videoUrl">YouTube URL</Label>
                  <Input
                    id="videoUrl"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.videoUrl}
                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                    className="border-border/50 focus:border-primary"
                  />
                  {formData.videoUrl && isValidYouTubeUrl(formData.videoUrl) && (
                    <div className="space-y-2">
                      <div className="aspect-video rounded-lg overflow-hidden border border-border/50">
                        <iframe
                          src={getYouTubeEmbedUrl(formData.videoUrl)}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(formData.videoUrl, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Watch on YouTube
                      </Button>
                    </div>
                  )}
                  {formData.videoUrl && !isValidYouTubeUrl(formData.videoUrl) && (
                    <p className="text-sm text-destructive">
                      Please enter a valid YouTube URL
                    </p>
                  )}
                </div>
              )}

              {formData.videoType === 'custom' && (
                <div className="space-y-3">
                  <Label htmlFor="customVideo">Upload Video File</Label>
                  <Input
                    id="customVideo"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="border-border/50 focus:border-primary"
                  />
                  {videoPreview && (
                    <div className="aspect-video rounded-lg overflow-hidden border border-border/50">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-full object-cover"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

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
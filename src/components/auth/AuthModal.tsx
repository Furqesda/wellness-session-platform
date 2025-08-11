import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Leaf, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode,
  onModeChange
}) => {
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (mode === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        result = await signup(formData.email, formData.password, formData.name);
      }

      if (result.success) {
        toast({
          title: `${mode === 'login' ? 'Welcome back!' : 'Welcome to Wellness Session!'}`,
          description: `You've successfully ${mode === 'login' ? 'logged in' : 'created your account'}.`
        });
        onClose();
        setFormData({ email: '', password: '', name: '' });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || 'Something went wrong'
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md card-gradient border-border/50">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 wellness-gradient p-3 rounded-xl w-fit">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-semibold">
            {mode === 'login' ? 'Welcome Back' : 'Join Wellness Session'}
          </DialogTitle>
          <p className="text-muted-foreground">
            {mode === 'login' 
              ? 'Sign in to continue your wellness journey' 
              : 'Create your account to start your wellness journey'
            }
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="border-border/50 focus:border-primary"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="border-border/50 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              className="border-border/50 focus:border-primary"
            />
          </div>

          <Button
            type="submit"
            className="w-full wellness-gradient border-0 hover-lift wellness-transition"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <Button
              variant="link"
              className="ml-1 p-0 h-auto text-primary hover:text-primary/80"
              onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
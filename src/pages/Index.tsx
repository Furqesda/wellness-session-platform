import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { ArrowRight, Sparkles, Heart, Users, Zap } from 'lucide-react';
import heroImage from '@/assets/wellness-hero.jpg';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const handleGetStarted = () => {
    if (isAuthenticated) {
      return;
    }
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const features = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: 'Mindful Practices',
      description: 'Discover meditation, yoga, and breathing exercises designed to bring peace to your daily life.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Community Driven',
      description: 'Share your own wellness sessions and learn from others in our supportive community.'
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'Personalized Journey',
      description: 'Create and manage your personal wellness routine with sessions tailored to your needs.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-gradient overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="h-6 w-6 text-primary animate-float" />
              <span className="text-primary font-medium">Your Wellness Journey Starts Here</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
              Find Your
              <span className="block text-primary">Inner Peace</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl animate-fade-in">
              Discover a world of wellness sessions designed to help you relax, focus, and flourish. 
              From guided meditations to gentle yoga flows, create your personalized path to wellbeing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              {isAuthenticated ? (
                <Button 
                  asChild
                  size="lg" 
                  className="wellness-gradient border-0 hover-lift wellness-transition text-lg px-8 py-6"
                >
                  <Link to="/browse">
                    Explore Sessions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="wellness-gradient border-0 hover-lift wellness-transition text-lg px-8 py-6"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="hover-lift wellness-transition text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
              >
                <Link to="/browse">Browse Sessions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose Wellness Session?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines the best of wellness practices with a supportive community 
              to help you achieve lasting peace and balance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="card-gradient border-border/50 hover-lift wellness-transition text-center"
              >
                <CardContent className="pt-8 pb-6">
                  <div className="mx-auto mb-4 wellness-gradient p-4 rounded-2xl w-fit">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 wellness-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5" />
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of others who have discovered the power of mindful living. 
            Start your wellness practice today.
          </p>
          
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                variant="secondary"
                className="hover-lift wellness-transition text-lg px-8 py-6"
              >
                <Link to="/create">Create Your First Session</Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline"
                className="hover-lift wellness-transition text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white hover:text-white"
              >
                <Link to="/my-sessions">View My Sessions</Link>
              </Button>
            </div>
          ) : (
            <Button 
              size="lg" 
              variant="secondary"
              onClick={handleGetStarted}
              className="hover-lift wellness-transition text-lg px-8 py-6"
            >
              Start Your Free Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

export default Index;
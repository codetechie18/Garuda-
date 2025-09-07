import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({
        username: formData.username,
        firstName: 'Agent',
        lastName: 'Smith',
        photo: '/placeholder.svg'
      }));
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleResetPassword = () => {
    alert('Password reset link has been sent to your registered email.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-hover to-primary/80 flex items-center justify-center p-4 cyber-grid">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <Card className="w-full max-w-md animate-fade-in card-hover relative z-10">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            GARUDA CYBERSEC
          </CardTitle>
          <p className="text-muted-foreground">Government Security Portal</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="h-11"
                placeholder="Enter your username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="h-11 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-sm text-primary hover:text-primary-hover transition-colors"
              >
                Reset Password
              </button>
            </div>
            
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
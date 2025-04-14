import { ModernCard, ModernCardGrid } from '@/components/ui/card-modern';
import { BarChart3, Brain, Database, GitBranch, LayoutDashboard, LineChart, PieChart, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Dashboard
            </span>
          </h1>
          <p className="text-white/70">Welcome back! Here's an overview of your data and models.</p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none">
            <Sparkles className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <ModernCardGrid>
        <ModernCard 
          icon={<Database className="h-5 w-5 text-white" />}
          title="Datasets"
          subtitle="Total managed data"
          gradient
          delay={0}
        >
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-white">24</div>
            <div className="text-green-400 text-sm flex items-center">
              +12% <TrendingUp className="h-3 w-3 ml-1" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/70">Storage used</span>
              <span className="text-white">68%</span>
            </div>
            <Progress value={68} className="h-2" />
          </div>
        </ModernCard>
        
        <ModernCard 
          icon={<Brain className="h-5 w-5 text-white" />}
          title="Models"
          subtitle="AI models in production"
          gradient
          delay={1}
        >
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-white">7</div>
            <div className="text-green-400 text-sm flex items-center">
              +3% <TrendingUp className="h-3 w-3 ml-1" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/70">Avg. accuracy</span>
              <span className="text-white">92%</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>
        </ModernCard>
        
        <ModernCard 
          icon={<Users className="h-5 w-5 text-white" />}
          title="Team Members"
          subtitle="Active collaborators"
          gradient
          delay={2}
        >
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-white">12</div>
            <div className="text-blue-400 text-sm flex items-center">
              +2 this month
            </div>
          </div>
          <div className="mt-4 flex -space-x-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/80 to-purple-500/80 flex items-center justify-center border-2 border-black/30 text-xs text-white font-bold"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border-2 border-black/30 text-xs text-white font-bold">
              +7
            </div>
          </div>
        </ModernCard>
      </ModernCardGrid>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ModernCard 
          className="lg:col-span-2"
          title="Model Performance"
          icon={<LineChart className="h-5 w-5 text-white" />}
          delay={3}
        >
          <div className="h-64 flex items-center justify-center">
            <div className="text-center text-white/50">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Performance metrics visualization</p>
              <Button variant="link" className="text-blue-400 mt-2">View detailed analytics</Button>
            </div>
          </div>
        </ModernCard>
        
        <ModernCard 
          title="Recent Activity"
          icon={<GitBranch className="h-5 w-5 text-white" />}
          delay={4}
        >
          <div className="space-y-4">
            {[
              { user: 'Alex', action: 'updated dataset', target: 'Customer Data', time: '2h ago' },
              { user: 'Maria', action: 'deployed model', target: 'Prediction v2', time: '5h ago' },
              { user: 'John', action: 'created branch', target: 'feature/new-viz', time: '1d ago' },
              { user: 'Sarah', action: 'merged PR', target: '#42', time: '2d ago' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-xs text-white font-bold">
                  {item.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <span className="font-medium">{item.user}</span> {item.action}{' '}
                    <span className="text-blue-400">{item.target}</span>
                  </p>
                  <p className="text-xs text-white/50">{item.time}</p>
                </div>
              </div>
            ))}
            
            <Button variant="outline" size="sm" className="w-full mt-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
              View All Activity
            </Button>
          </div>
        </ModernCard>
      </div>
      
      {/* Bottom Row */}
      <ModernCardGrid className="grid-cols-1 md:grid-cols-2 gap-6">
        <ModernCard 
          title="Data Distribution"
          icon={<PieChart className="h-5 w-5 text-white" />}
          delay={5}
        >
          <div className="h-48 flex items-center justify-center">
            <div className="text-center text-white/50">
              <PieChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Data distribution visualization</p>
            </div>
          </div>
        </ModernCard>
        
        <ModernCard 
          title="Quick Actions"
          icon={<LayoutDashboard className="h-5 w-5 text-white" />}
          delay={6}
        >
          <div className="grid grid-cols-2 gap-3">
            <Button className="bg-white/10 hover:bg-white/20 text-white border-none h-auto py-4">
              <Database className="h-5 w-5 mb-2" />
              <span className="text-sm">Upload Data</span>
            </Button>
            <Button className="bg-white/10 hover:bg-white/20 text-white border-none h-auto py-4">
              <Brain className="h-5 w-5 mb-2" />
              <span className="text-sm">Train Model</span>
            </Button>
            <Button className="bg-white/10 hover:bg-white/20 text-white border-none h-auto py-4">
              <GitBranch className="h-5 w-5 mb-2" />
              <span className="text-sm">View Lineage</span>
            </Button>
            <Button className="bg-white/10 hover:bg-white/20 text-white border-none h-auto py-4">
              <Sparkles className="h-5 w-5 mb-2" />
              <span className="text-sm">Explore</span>
            </Button>
          </div>
        </ModernCard>
      </ModernCardGrid>
    </div>
  );
}
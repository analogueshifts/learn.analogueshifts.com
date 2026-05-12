"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Medal, Award, Flame, Target, Zap, Crown } from "lucide-react";

export default function StudentAchievementsPage() {
  const currentUserRank = 4;
  
  const badges = [
    { id: 1, name: "First Steps", description: "Complete your first lesson", icon: <Star className="w-8 h-8" />, earned: true, date: "Oct 1, 2026", color: "text-yellow-500", bg: "bg-yellow-50 border-yellow-200" },
    { id: 2, name: "On Fire", description: "Maintain a 7-day learning streak", icon: <Flame className="w-8 h-8" />, earned: true, date: "Oct 8, 2026", color: "text-orange-500", bg: "bg-orange-50 border-orange-200" },
    { id: 3, name: "Sharpshooter", description: "Score 100% on 3 quizzes", icon: <Target className="w-8 h-8" />, earned: true, date: "Oct 15, 2026", color: "text-red-500", bg: "bg-red-50 border-red-200" },
    { id: 4, name: "Fast Learner", description: "Complete a module in record time", icon: <Zap className="w-8 h-8" />, earned: false, color: "text-gray-400", bg: "bg-gray-50 border-gray-200" },
    { id: 5, name: "Course Champion", description: "Complete an entire course", icon: <Trophy className="w-8 h-8" />, earned: false, color: "text-gray-400", bg: "bg-gray-50 border-gray-200" },
    { id: 6, name: "Top 1%", description: "Reach the top 1% on the leaderboard", icon: <Crown className="w-8 h-8" />, earned: false, color: "text-gray-400", bg: "bg-gray-50 border-gray-200" },
    { id: 7, name: "Helpful Peer", description: "Answer 10 questions in forums", icon: <Medal className="w-8 h-8" />, earned: false, color: "text-gray-400", bg: "bg-gray-50 border-gray-200" },
    { id: 8, name: "Overachiever", description: "Submit all assignments early", icon: <Award className="w-8 h-8" />, earned: false, color: "text-gray-400", bg: "bg-gray-50 border-gray-200" },
  ];

  const leaderboard = [
    { rank: 1, name: "Sarah Jenkins", points: 15420, avatar: "SJ" },
    { rank: 2, name: "Michael Chen", points: 14850, avatar: "MC" },
    { rank: 3, name: "Emily Rodriguez", points: 14200, avatar: "ER" },
    { rank: 4, name: "You", points: 13950, avatar: "YO", isCurrentUser: true },
    { rank: 5, name: "David Kim", points: 13800, avatar: "DK" },
    { rank: 6, name: "Jessica Taylor", points: 13100, avatar: "JT" },
    { rank: 7, name: "Robert Wilson", points: 12950, avatar: "RW" },
    { rank: 8, name: "Amanda Martinez", points: 12500, avatar: "AM" },
    { rank: 9, name: "James Anderson", points: 12200, avatar: "JA" },
    { rank: 10, name: "Olivia Thomas", points: 11800, avatar: "OT" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Gamification</h1>
        <p className="text-muted-foreground mt-1">Track your progress, earn badges, and compete with peers.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: Badges Shelf */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-200 shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <Medal className="w-5 h-5 mr-2 text-[#FFBB0A]" /> Badge Shelf
                  </CardTitle>
                  <CardDescription className="font-medium mt-1">Unlock badges by completing milestones.</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-500 uppercase">Earned</p>
                  <p className="text-2xl font-extrabold text-[#0F2942]">3 <span className="text-lg text-gray-400">/ 8</span></p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {badges.map(badge => (
                  <div key={badge.id} className="relative group cursor-help">
                    <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${badge.earned ? badge.bg + ' hover:shadow-md hover:-translate-y-1' : 'bg-gray-50 border-dashed border-gray-200 opacity-60 grayscale hover:grayscale-0'}`}>
                      <div className={`mb-3 ${badge.color}`}>
                        {badge.icon}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm text-center line-clamp-1">{badge.name}</h4>
                    </div>
                    
                    {/* Tailwind Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white p-3 rounded-xl shadow-xl text-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                      <p className="font-bold text-sm mb-1">{badge.name}</p>
                      <p className="text-xs text-gray-300">{badge.description}</p>
                      {badge.earned ? (
                        <p className="text-[10px] text-yellow-400 font-bold mt-2 uppercase">Earned on {badge.date}</p>
                      ) : (
                        <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">Locked</p>
                      )}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity or Next Goal */}
          <Card className="border-gray-200 shadow-sm rounded-3xl bg-gradient-to-r from-[#0F2942] to-gray-800 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full pointer-events-none" />
            <CardContent className="p-8 flex items-center justify-between">
              <div>
                <p className="text-[#FFBB0A] text-sm font-bold uppercase tracking-wider mb-2">Next Milestone</p>
                <h3 className="text-2xl font-extrabold tracking-tight mb-2">Fast Learner</h3>
                <p className="text-gray-400 font-medium text-sm">Complete the current module in under 2 hours to unlock.</p>
              </div>
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center shrink-0 border-2 border-dashed border-white/20">
                <Zap className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Leaderboard */}
        <div className="lg:col-span-1">
          <Card className="border-gray-200 shadow-sm rounded-3xl bg-white h-full flex flex-col">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <CardTitle className="text-xl font-bold flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" /> Leaderboard
              </CardTitle>
              <CardDescription className="font-medium">Top 20 students this month.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
              <div className="p-4 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between">
                <div className="text-sm font-bold text-blue-900">Your current rank</div>
                <div className="text-xl font-extrabold text-blue-700">#{currentUserRank}</div>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[500px]">
                <ul className="divide-y divide-gray-100">
                  {leaderboard.map((user) => (
                    <li key={user.rank} className={`flex items-center justify-between p-4 transition-colors ${user.isCurrentUser ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-6 text-center font-bold text-sm ${user.rank === 1 ? 'text-yellow-500 text-lg' : user.rank === 2 ? 'text-gray-400' : user.rank === 3 ? 'text-amber-700' : 'text-gray-500'}`}>
                          {user.rank}
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${user.isCurrentUser ? 'bg-[#0F2942] text-white' : 'bg-gray-100 text-gray-700'}`}>
                          {user.avatar}
                        </div>
                        <div className={`font-bold text-sm ${user.isCurrentUser ? 'text-[#0F2942]' : 'text-gray-900'}`}>
                          {user.name}
                        </div>
                      </div>
                      <div className="font-extrabold text-[#FFBB0A] text-sm">
                        {user.points.toLocaleString()} <span className="text-[10px] text-gray-400 font-bold ml-0.5">PTS</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border-t border-gray-100 text-center">
                <button className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  View Full Leaderboard
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Link as LinkIcon, Calendar, BookOpen, Award, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PublicProfilePage({ params }: { params: { id: string } }) {
  // Mock data based on the ID
  const userProfile = {
    id: params.id,
    name: "Alex Johnson",
    role: "Student",
    avatar: "https://i.pravatar.cc/300?u=alex",
    bio: "Passionate web developer and UI/UX enthusiast. Always eager to learn new technologies and build intuitive user experiences.",
    location: "San Francisco, CA",
    website: "alexjohnson.dev",
    joinedDate: "March 2025",
    coursesCompleted: 4,
    achievements: [
      { id: 1, name: "React Master", icon: "⚛️", description: "Completed Advanced React Patterns course." },
      { id: 2, name: "UI/UX Pro", icon: "🎨", description: "Top 10% in the UI/UX redesign challenge." },
      { id: 3, name: "Early Adopter", icon: "🚀", description: "Joined during the platform's beta phase." },
    ],
    enrolledCourses: [
      { id: 1, title: "Fullstack Web Development", progress: 85, thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
      { id: 2, title: "Advanced UI/UX", progress: 100, thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Cover Image */}
      <div className="h-64 bg-gradient-to-r from-blue-900 to-indigo-900 relative">
        <div className="absolute inset-0 bg-white/10 pattern-grid-lg"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 -mt-24 relative z-10 space-y-8">
        
        {/* Profile Header Card */}
        <Card className="border-gray-200 shadow-lg shadow-gray-200/50 rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-8 sm:p-10 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            <div className="shrink-0 relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center" title="Online">
                <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{userProfile.name}</h1>
                <p className="text-lg font-medium text-gray-500 mt-1">{userProfile.role}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600">
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-gray-400" /> {userProfile.location}</div>
                <div className="flex items-center"><LinkIcon className="w-4 h-4 mr-1.5 text-gray-400" /> <a href={`https://${userProfile.website}`} className="hover:text-blue-600 transition-colors">{userProfile.website}</a></div>
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-1.5 text-gray-400" /> Joined {userProfile.joinedDate}</div>
              </div>

              <p className="text-gray-700 leading-relaxed max-w-2xl">{userProfile.bio}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left Column: Stats & Achievements */}
          <div className="space-y-8">
            <Card className="border-gray-200 shadow-sm rounded-3xl bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-500" /> Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile.achievements.map(achievement => (
                  <div key={achievement.id} className="flex gap-3 items-start p-3 rounded-2xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                      {achievement.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{achievement.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 leading-tight">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm rounded-3xl bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Courses Completed</p>
                    <p className="text-3xl font-extrabold text-gray-900">{userProfile.coursesCompleted}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Courses */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" /> Enrolled Courses
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {userProfile.enrolledCourses.map(course => (
                <Link href={`/courses/${course.id}`} key={course.id} className="group block h-full">
                  <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden h-full hover:shadow-lg transition-all group-hover:border-blue-200">
                    <div className="h-40 overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {course.progress === 100 && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center text-xs font-bold text-green-700 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <h4 className="font-bold text-gray-900 text-lg mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">{course.title}</h4>
                      
                      <div className="space-y-2 mt-auto">
                        <div className="flex justify-between text-xs font-bold text-gray-500">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${course.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`} 
                            style={{ width: `${course.progress}%` }} 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

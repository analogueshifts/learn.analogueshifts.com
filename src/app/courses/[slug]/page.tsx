import GuestLayout from "@/components/application/layouts/guest";
import coursesData from "@/resources/courses.json";
import { Star, Check, Lock, PlayCircle, Clock, Users, GraduationCap, Globe } from "lucide-react";
import SmartBackButton from "@/components/application/courses/smart-back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurriculumAccordion from "@/components/application/courses/curriculum-accordion";
import VideoPlayer from "@/components/application/courses/video-player";
import CountdownTimer from "@/components/application/courses/countdown-timer";
import CourseActionButtons from "@/components/application/courses/CourseActionButtons";
import Image from "next/image";
import HeroSvg from "@/assets/images/home/hero.svg";

export default function CourseDetailPage({ 
  params,
  searchParams 
}: { 
  params: { slug: string },
  searchParams: { from?: string }
}) {
  const course = coursesData.find((c) => c.slug === params.slug);

  if (!course) {
    notFound();
  }



  // Sample video URL for preview (replace with actual if available)
  const previewVideoUrl = "https://files.vidstack.io/sprite-fight/720p.mp4";

  return (
    <GuestLayout>
      {/* Dark Hero Section */}
      <div className="bg-primary-tan text-white pt-24 pb-32 px-6 lg:px-24">
        <div className="max-w-[1800px] mx-auto mb-8">
          <SmartBackButton 
            fallbackHref="/courses" 
            fallbackText="Back to Courses" 
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
          />
        </div>
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm font-medium text-background-darkYellow mb-6">
              <span className="uppercase tracking-wider">{course.company}</span>
              <span>•</span>
              <span>{course.skillLevel}</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {course.headline || course.name}
            </h1>
            
            <p className="text-lg text-gray-300 mb-8 max-w-3xl">
              {course.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-background-darkYellow font-bold">4.8</span>
                <div className="flex text-background-darkYellow">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-gray-400 ml-1">(2,451 ratings)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{course.enrolledStudents} students</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>English</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 border-2 border-background-darkYellow">
                <Image 
                  src={course.instructor?.image || "/courses/devops-instructor.svg"} 
                  alt="Instructor" 
                  width={48} 
                  height={48} 
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400">Created by</p>
                <p className="font-medium text-white">Expert Instructor</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[450px] xl:w-[500px] shrink-0">
            {/* The floating card on desktop */}
            <div className="lg:absolute lg:right-24 lg:top-40 lg:w-[450px] xl:w-[500px] z-20">
              <Card className="p-1 rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-black relative">
                  <VideoPlayer 
                    src={previewVideoUrl} 
                    title={`${course.name} Preview`} 
                    courseId={course.slug} 
                    lessonId="preview"
                    poster={course.preview || course.thumbnail} 
                  />
                </div>
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-primary-tan">{course.price}</div>
                    <CountdownTimer hours={48} />
                  </div>
                  
                  <CourseActionButtons course={course} />
                  <p className="text-center text-sm text-gray-500 mb-6">30-Day Money-Back Guarantee</p>
                  
                  <div className="space-y-4">
                    <h4 className="font-bold text-primary-tan">This course includes:</h4>
                    <div className="flex items-center gap-3 text-sm text-content-grayText">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration} on-demand video</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-content-grayText">
                      <GraduationCap className="w-4 h-4" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white min-h-screen py-16 px-6 lg:px-24">
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div className="flex-1 lg:max-w-[calc(100%-530px)] xl:max-w-[calc(100%-580px)]">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b border-gray-200 rounded-none bg-transparent h-auto p-0 mb-8 space-x-8">
                {["Overview", "Curriculum", "Instructor", "Reviews"].map((tab) => (
                  <TabsTrigger 
                    key={tab} 
                    value={tab.toLowerCase()}
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-background-darkYellow data-[state=active]:text-background-darkYellow rounded-none px-0 py-4 font-bold text-base text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="overview" className="space-y-12 animate-in fade-in duration-500 pt-2">
                <div className="p-6 md:p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">What you'll learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    {(course.whatToExpect?.list || ["Master the fundamentals of the technology stack", "Build real-world portfolio projects", "Understand advanced industry best practices", "Prepare for technical interviews"]).map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="mt-1">
                          <Check className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
                        </div>
                        <span className="text-gray-700 text-sm md:text-[15px] leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="max-w-3xl">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Requirements</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 text-[15px] mb-12 marker:text-gray-400">
                    <li>A computer with internet access</li>
                    <li>No prior experience is strictly required, though basic computer literacy is helpful</li>
                    <li>A willingness to learn and dedicate time to practice</li>
                  </ul>

                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Description</h3>
                  <div className="text-gray-700 text-[15px] leading-relaxed space-y-6">
                    <p className="text-lg font-medium text-gray-900">
                      {course.whatToExpect?.summary || course.description}
                    </p>
                    <p>
                      This comprehensive course is meticulously designed to take you from absolute beginner to advanced professional. Whether you are looking to pivot into a new career, enhance your current engineering skills, or build your own technology startup, this curriculum provides the exact step-by-step roadmap you need to succeed.
                    </p>
                    <p>
                      We skip the fluff and dive straight into what actually matters in the real world. You won't just be watching lectures—you will be actively building along with the instructor, writing production-grade code, and solving complex architectural problems.
                    </p>
                    <div>
                      <p className="font-bold text-gray-900 mb-3">Throughout this course, you will specifically cover:</p>
                      <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
                        <li>Industry-standard best practices and design patterns used by top tech companies.</li>
                        <li>Building multiple real-world portfolio projects you can confidently show to prospective employers.</li>
                        <li>Advanced debugging, performance optimization, and problem-solving techniques.</li>
                        <li>Understanding the "Why" behind the code, not just the "How".</li>
                      </ul>
                    </div>
                    <p>
                      Join thousands of other ambitious professionals who have already accelerated their careers through this precise methodology. Your journey to mastering tech starts here.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="curriculum" className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-primary-tan">Course Content</h3>
                  <span className="text-sm text-gray-500 font-medium">{course.contents?.length || 0} sections</span>
                </div>
                
                <CurriculumAccordion contents={course.contents || []} />
              </TabsContent>
              
              <TabsContent value="instructor" className="animate-in fade-in duration-500 pt-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Your Instructor</h3>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 shrink-0 border-4 border-white shadow-xl">
                    <img src={course.instructor?.image || "/courses/devops-instructor.svg"} alt="Instructor" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-primary-tan mb-1">
                      {course.instructor?.name || "Expert Instructor"}
                    </h4>
                    <p className="text-sm text-background-darkYellow font-bold tracking-wider mb-4">
                      Senior Engineer & Tech Lead
                    </p>
                    
                    <div className="flex flex-wrap gap-6 text-sm text-gray-600 font-medium mb-6">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-background-darkYellow fill-current" /> 
                        <span>4.8 Instructor Rating</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" /> 
                        <span>15,200+ Students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PlayCircle className="w-4 h-4 text-gray-400" /> 
                        <span>12 Courses</span>
                      </div>
                    </div>
                    
                    <div className="text-gray-700 text-[15px] leading-relaxed space-y-4">
                      <p>
                        {course.instructor?.about || "I am a passionate software engineer with over a decade of experience building highly scalable applications for Fortune 500 companies."}
                      </p>
                      <p>
                        Throughout my career, I've had the privilege of working with cutting-edge technologies and leading engineering teams to deliver products used by millions of users worldwide. My mission now is to take all the hard-earned lessons from the tech industry and condense them into actionable, easy-to-understand curriculum.
                      </p>
                      <p>
                        When I'm not coding or recording lectures, you can find me contributing to open-source projects, writing technical articles, or mentoring junior developers to help them break into the industry.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="animate-in fade-in duration-500">
                <h3 className="text-2xl font-bold text-primary-tan mb-8">Student Feedback</h3>
                
                <div className="flex flex-col md:flex-row gap-12 mb-12 items-center">
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-gray-100 shrink-0 w-full md:w-64">
                    <span className="text-6xl font-bold text-primary-tan mb-2">4.8</span>
                    <div className="flex text-background-darkYellow mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Course Rating</span>
                  </div>
                  
                  <div className="flex-1 w-full space-y-3">
                    {[
                      { stars: 5, pct: 75 },
                      { stars: 4, pct: 18 },
                      { stars: 3, pct: 5 },
                      { stars: 2, pct: 1 },
                      { stars: 1, pct: 1 },
                    ].map((stat) => (
                      <div key={stat.stars} className="flex items-center gap-4">
                        <div className="flex items-center gap-2 w-24 shrink-0">
                          <span className="text-sm font-medium text-gray-600">{stat.stars} stars</span>
                        </div>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-background-darkYellow rounded-full" style={{ width: `${stat.pct}%` }} />
                        </div>
                        <div className="w-12 text-right">
                          <span className="text-sm text-gray-500">{stat.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-8">
                  {/* First Review */}
                  <div className="border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-500">
                        JD
                      </div>
                      <div>
                        <h5 className="font-bold text-primary-tan">John Doe</h5>
                        <div className="flex text-background-darkYellow">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-content-grayText leading-relaxed">
                      {course.review || "This course was absolutely amazing! I learned so much and the instructor was fantastic."}
                    </p>
                  </div>

                  {/* Second Review */}
                  <div className="border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-background-darkYellow/10 rounded-full flex items-center justify-center text-lg font-bold text-background-darkYellow">
                        SA
                      </div>
                      <div>
                        <h5 className="font-bold text-primary-tan">Sarah Adams</h5>
                        <div className="flex text-background-darkYellow">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                          <Star className="h-3 w-3 text-gray-300 fill-current" />
                        </div>
                      </div>
                    </div>
                    <p className="text-content-grayText leading-relaxed">
                      "I've taken a lot of online courses, but the curriculum here is structured perfectly. The hands-on projects helped me land my first tech job within 3 months of completing it. Highly recommend to anyone serious about their career!"
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="hidden lg:block w-[450px] xl:w-[500px] shrink-0 pointer-events-none" />
        </div>
      </div>

      {/* CTA Section with Hero SVG */}
      <div className="w-full bg-background-whisperGray py-20 px-6 lg:px-24 border-t border-gray-200 overflow-hidden relative">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-background-darkYellow/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-tan mb-6">
              Ready to start your <br />
              <span className="text-background-darkYellow">tech journey?</span>
            </h2>
            <p className="text-lg text-content-grayText mb-8 max-w-lg">
              Join thousands of students who have already transformed their careers through our expertly crafted curriculum. Don&apos;t wait to achieve your goals!
            </p>
            <CourseActionButtons course={course} variant="bottom" />
          </div>
          
          <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] aspect-square">
              <Image 
                src={HeroSvg} 
                alt="Start Learning" 
                className="w-full h-full object-contain drop-shadow-2xl hover:-translate-y-4 transition-transform duration-700" 
              />
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}

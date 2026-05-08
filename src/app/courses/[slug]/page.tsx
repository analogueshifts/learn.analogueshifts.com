import GuestLayout from "@/components/application/layouts/guest";
import coursesData from "@/resources/courses.json";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, CheckCircle, Lock, PlayCircle, Clock, Users, GraduationCap, Globe } from "lucide-react";
import SmartBackButton from "@/components/application/courses/smart-back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import VideoPlayer from "@/components/application/courses/video-player";
import CountdownTimer from "@/components/application/courses/countdown-timer";
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
                  
                  <Button className="w-full h-14 text-lg font-bold bg-background-darkYellow hover:bg-yellow-600 text-white rounded-xl mb-4">
                    Enroll Now
                  </Button>
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
              
              <TabsContent value="overview" className="space-y-12 animate-in fade-in duration-500">
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
                  <h3 className="text-2xl font-bold text-primary-tan mb-6">What you'll learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.whatToExpect?.list?.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-content-grayText text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-primary-tan mb-6">Course Description</h3>
                  <p className="text-content-grayText leading-relaxed">
                    {course.whatToExpect?.summary || course.description}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="curriculum" className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-primary-tan">Course Content</h3>
                  <span className="text-sm text-gray-500 font-medium">{course.contents?.length || 0} sections</span>
                </div>
                
                <Accordion type="multiple" className="w-full border border-gray-200 rounded-xl overflow-hidden" defaultValue={["content-one"]}>
                  {course.contents?.map((module, index) => (
                    <AccordionItem key={module.id || `mod-${index}`} value={module.id || `mod-${index}`} className="border-b last:border-0">
                      <AccordionTrigger className="bg-gray-50 px-6 py-4 hover:no-underline hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-primary-tan">{module.title}</span>
                          <span className="text-xs text-gray-500 font-normal mt-1">{module.lessons?.length || 0} lessons</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="bg-white p-0">
                        <div className="flex flex-col">
                          {module.lessons?.map((lesson, i) => (
                            <div key={i} className="flex items-center justify-between px-6 py-4 border-t border-gray-100 first:border-0 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-4">
                                {i === 0 && index === 0 ? (
                                  <PlayCircle className="w-5 h-5 text-background-darkYellow" />
                                ) : (
                                  <Lock className="w-4 h-4 text-gray-400" />
                                )}
                                <span className={`text-sm ${i === 0 && index === 0 ? 'text-background-darkYellow font-medium underline cursor-pointer' : 'text-gray-600'}`}>
                                  {lesson}
                                </span>
                              </div>
                              {i === 0 && index === 0 && (
                                <span className="text-xs bg-background-darkYellow/10 text-background-darkYellow px-2 py-1 rounded font-bold uppercase">Preview</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
              
              <TabsContent value="instructor" className="animate-in fade-in duration-500">
                <h3 className="text-2xl font-bold text-primary-tan mb-6">Your Instructor</h3>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 shrink-0 border-4 border-white shadow-lg">
                    <img src={course.instructor?.image || "/courses/devops-instructor.svg"} alt="Instructor" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-primary-tan mb-2">Expert Instructor</h4>
                    <p className="text-sm text-background-darkYellow font-bold uppercase tracking-wider mb-4">Senior Developer</p>
                    <div className="flex gap-6 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-2"><Star className="w-4 h-4 text-background-darkYellow fill-current" /> 4.8 Instructor Rating</div>
                      <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> 15,200 Students</div>
                    </div>
                    <p className="text-content-grayText leading-relaxed">
                      {course.instructor?.about || "An experienced professional dedicated to teaching and sharing knowledge."}
                    </p>
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
            <Button className="h-14 px-8 text-lg font-bold bg-primary-tan hover:bg-gray-900 text-white rounded-xl shadow-xl hover:scale-105 transition-transform duration-300">
              Enroll in {course.name} Now
            </Button>
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

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2, Award, ExternalLink, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react"

interface Certificate {
  id: string
  code: string
  issuedAt: string
  course: {
    title: string
    totalDuration: string | null
    level: string
    trainer: { name: string }
  }
}

export default function CertificatesPage() {
  const { data: session } = useSession()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/certificates")
      .then((res) => res.json())
      .then((body) => {
        if (body.success) {
          setCertificates(body.data)
          setSelectedCert(body.data[0] ?? null)
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleDownload = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading certificates...
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">My Certificates</h1>
          <p className="text-muted-foreground mt-1">View, download, and verify your official course achievements.</p>
        </div>
      </div>

      {certificates.length === 0 || !selectedCert ? (
        <Card className="border-border/50 shadow-sm border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-64 text-center p-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No certificates yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">Complete your first course to earn a verifiable certificate.</p>
            <Button asChild className="bg-[#0F2942] text-white">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12 items-start">

          <div className="lg:col-span-4 space-y-6 print:hidden">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="bg-muted/30 p-4 border-b border-gray-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#FFBB0A]" />
                <h3 className="font-bold text-gray-900">Earned Credentials</h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    onClick={() => setSelectedCert(cert)}
                    className={`p-4 flex flex-col gap-1 cursor-pointer transition-colors ${selectedCert.id === cert.id ? "bg-[#0F2942]/5 border-l-4 border-[#0F2942]" : "hover:bg-gray-50 border-l-4 border-transparent"}`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold text-sm line-clamp-1 pr-4 ${selectedCert.id === cert.id ? "text-[#0F2942]" : "text-gray-900"}`}>{cert.course.title}</h4>
                      {selectedCert.id === cert.id && <CheckCircle2 className="w-4 h-4 text-[#FFBB0A] shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/50 bg-muted/10 p-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Official & Verifiable
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500 font-medium">Credential ID</span>
                  <span className="font-mono text-xs font-bold text-gray-900">{selectedCert.code}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500 font-medium">Level</span>
                  <span className="font-bold text-gray-900">{selectedCert.course.level}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-500 font-medium">Duration</span>
                  <span className="font-bold text-gray-900">{selectedCert.course.totalDuration ?? "—"}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button onClick={handleDownload} className="w-full h-12 text-base font-bold bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md rounded-xl transition-all hover:-translate-y-0.5">
                <Download className="w-4 h-4 mr-2" /> Download High-Res PDF
              </Button>
              <Button variant="outline" className="w-full h-12 text-sm font-bold bg-white hover:bg-gray-50 border-gray-200 rounded-xl transition-all shadow-sm">
                <Share2 className="w-4 h-4 mr-2 text-[#0a66c2]" /> Add to LinkedIn Profile
              </Button>
              <Button asChild variant="ghost" className="w-full h-10 text-xs font-semibold text-gray-500 hover:text-gray-900">
                <Link href={`/certificates/verify/${selectedCert.code}`} target="_blank">
                  <ExternalLink className="w-3 h-3 mr-2" /> View Public Link
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-white p-2 sm:p-4 rounded-xl shadow-2xl border border-gray-200 overflow-hidden relative print:shadow-none print:border-none print:p-0 print:w-full print:h-screen w-full mx-auto max-w-4xl">

              <div className="relative aspect-[1.414/1] w-full bg-[#FAFAF9] border-[12px] border-[#0F2942] p-2 flex flex-col items-center text-center overflow-hidden print:w-full print:h-[95vh] print:border-[16px]">
                <div className="absolute inset-2 border-[3px] border-double border-[#D4AF37] opacity-80 pointer-events-none" />
                <div className="absolute inset-4 border border-[#D4AF37] opacity-40 pointer-events-none" />

                <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-[#0F2942] opacity-80 pointer-events-none" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-[#0F2942] opacity-80 pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-[#0F2942] opacity-80 pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-[#0F2942] opacity-80 pointer-events-none" />

                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <Award className="w-[400px] h-[400px]" />
                </div>

                <div className="pt-8 md:pt-16 pb-4 z-10 w-full flex flex-col items-center relative">
                  <img src="https://learn.analogueshifts.com/logo.png" alt="AnalogueShifts" className="h-10 md:h-14 object-contain mb-8 md:mb-10 opacity-90" />
                  <h2 className="text-sm md:text-lg font-bold tracking-[0.4em] text-[#0F2942] uppercase mb-4 font-serif">
                    Certificate of Achievement
                  </h2>
                </div>

                <div className="flex-1 w-full flex flex-col justify-center items-center z-10 px-8">
                  <p className="text-gray-500 italic text-sm md:text-xl mb-4 font-serif">This is to proudly certify that</p>

                  <h1 className="text-4xl md:text-6xl font-extrabold text-[#0F2942] mb-6 font-serif border-b-2 border-[#D4AF37] pb-2 px-12 capitalize inline-block" style={{ fontVariant: "small-caps" }}>
                    {session?.user?.name ?? "Student"}
                  </h1>

                  <p className="text-gray-600 italic text-sm md:text-lg mb-4 max-w-2xl leading-relaxed font-serif">
                    has successfully completed the comprehensive requirements and demonstrated exceptional proficiency in
                  </p>

                  <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 font-serif px-8 leading-tight">
                    {selectedCert.course.title}
                  </h3>
                </div>

                <div className="w-full flex justify-between items-end pb-8 md:pb-12 px-12 md:px-24 z-10 mt-auto">

                  <div className="flex flex-col items-center w-40 md:w-56">
                    <div className="h-12 w-full flex items-end justify-center mb-1">
                      <span className="font-serif text-3xl italic text-[#0F2942] opacity-80" style={{ fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive" }}>
                        {selectedCert.course.trainer.name}
                      </span>
                    </div>
                    <div className="w-full h-px bg-gray-400 mb-2" />
                    <span className="text-gray-900 font-bold text-xs md:text-sm uppercase tracking-wider">{selectedCert.course.trainer.name}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Lead Instructor</span>
                  </div>

                  <div className="relative flex flex-col items-center justify-center transform translate-y-4">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#996515] p-1 shadow-2xl flex items-center justify-center relative border-4 border-white">
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#FFF3E0] opacity-50 m-1 spin-slow" />
                      <div className="bg-[#0F2942] w-full h-full rounded-full flex flex-col items-center justify-center text-center shadow-inner border border-[#D4AF37]">
                        <Award className="w-6 h-6 md:w-8 md:h-8 text-[#D4AF37] mb-1" />
                        <span className="text-[6px] md:text-[8px] font-bold text-white uppercase tracking-widest leading-tight">Analogue<br />Shifts<br />Certified</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-8 bg-[#0F2942] px-3 py-1 rounded border border-[#D4AF37] shadow-lg">
                      <span className="text-[10px] font-bold text-[#D4AF37] font-mono tracking-widest">{selectedCert.code}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center w-40 md:w-56">
                    <div className="h-12 w-full flex flex-col items-center justify-end mb-1">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://learn.analogueshifts.com/certificates/verify/${selectedCert.code}&color=0F2942`}
                        alt="Verify QR"
                        className="w-10 h-10 md:w-14 md:h-14 mb-1"
                      />
                    </div>
                    <div className="w-full h-px bg-gray-400 mb-2" />
                    <span className="text-gray-900 font-bold text-xs md:text-sm uppercase tracking-wider">{new Date(selectedCert.issuedAt).toLocaleDateString()}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Date Issued</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

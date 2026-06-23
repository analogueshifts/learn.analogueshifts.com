import { ShieldCheck, ShieldX, Award } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function VerifyCertificatePage({ params }: { params: { code: string } }) {
  const certificate = await prisma.certificate.findUnique({
    where: { code: params.code },
    include: { user: { select: { name: true } }, course: { select: { title: true, level: true, totalDuration: true, trainer: { select: { name: true } } } } },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-200 p-10 text-center">
        {certificate ? (
          <>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F2942] mb-2">Certificate Verified</h1>
            <p className="text-gray-500 mb-8">This is a valid, officially issued certificate.</p>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-left space-y-3">
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Student</span><span className="font-bold text-gray-900">{certificate.user.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Course</span><span className="font-bold text-gray-900">{certificate.course.title}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Instructor</span><span className="font-bold text-gray-900">{certificate.course.trainer.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Level</span><span className="font-bold text-gray-900">{certificate.course.level}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Issued</span><span className="font-bold text-gray-900">{certificate.issuedAt.toLocaleDateString()}</span></div>
              <div className="flex justify-between border-t border-gray-200 pt-3"><span className="text-gray-500 font-medium">Credential ID</span><span className="font-mono text-xs font-bold text-gray-900">{certificate.code}</span></div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-8 text-gray-400">
              <Award className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">AnalogueShifts LMS</span>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldX className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F2942] mb-2">Certificate Not Found</h1>
            <p className="text-gray-500">We couldn&apos;t verify a certificate with code <span className="font-mono font-bold">{params.code}</span>.</p>
          </>
        )}
      </div>
    </div>
  );
}

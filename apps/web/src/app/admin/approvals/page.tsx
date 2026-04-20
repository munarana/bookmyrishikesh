import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  FileText, 
  Shield, 
  ChevronLeft, 
  ExternalLink,
  User,
  MapPin,
  Calendar
} from "lucide-react";
import { getPendingSchools, updateSchoolStatus } from "@/lib/actions/school-actions";

export const dynamic = "force-dynamic";

export default async function SchoolApprovalsPage() {
  const result = await getPendingSchools();
  const schools = (result.success && result.data) ? result.data : [];

  async function approveSchool(formData: FormData) {
    "use server";
    const schoolId = String(formData.get("schoolId") || "");
    if (!schoolId) return;
    await updateSchoolStatus(schoolId, "APPROVED");
  }

  async function rejectSchool(formData: FormData) {
    "use server";
    const schoolId = String(formData.get("schoolId") || "");
    if (!schoolId) return;
    await updateSchoolStatus(schoolId, "REJECTED", "Application rejected by super admin review.");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row mt-16 font-sans">
      {/* Sidebar - Reusing styles from main admin */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col h-auto md:min-h-[calc(100vh-64px)] shrink-0">
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin" className="hover:text-white transition-colors">
            <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
              <ChevronLeft className="w-5 h-5 text-accent" /> Back to Dashboard
            </h2>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Verification Queue
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-md bg-slate-800 text-white font-medium">
            <CheckCircle className="w-4 h-4" /> Pending Approvals 
            <span className="ml-auto bg-accent text-slate-900 text-[10px] px-1.5 rounded-full font-bold">
              {schools.length}
            </span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
            <Link href="/admin" className="hover:text-slate-900">Admin</Link>
            <span>/</span>
            <span>Approvals</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">School Verification Queue</h1>
          <p className="text-slate-500 text-sm">Review documentation and credentials for new platform partners.</p>
        </div>

        {schools.length === 0 ? (
          <Card className="border-none shadow-sm bg-white rounded-xl p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-slate-50 rounded-full">
                <CheckCircle className="w-12 h-12 text-slate-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your queue is empty</h3>
                <p className="text-slate-500 text-sm">All school applications have been processed. Great job!</p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {schools.map((school) => (
              <Card key={school.id} className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Left Column: Basic Info */}
                  <div className="lg:w-1/3 p-6 border-r border-slate-50">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xl text-slate-600">
                          {school.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{school.name}</h3>
                          <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-none px-2 py-0">
                            Action Required
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Owner: <strong>{school.owner?.name || 'Unknown'}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>{school.address || 'Rishikesh, India'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>Applied: {new Date(school.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Registration No.</p>
                        <code className="text-sm bg-slate-50 px-2 py-1 rounded border border-slate-100 text-slate-700">
                          {school.businessRegistrationNo || 'REG-PENDING-404'}
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Documentation Preview */}
                  <div className="lg:w-1/3 p-6 border-r border-slate-50 bg-slate-50/50">
                    <h4 className="font-semibold text-sm text-slate-900 mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Credentials & Documents
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="group relative bg-white p-4 rounded-lg border border-slate-200 hover:border-accent transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded text-emerald-600 group-hover:bg-accent group-hover:text-slate-900 transition-colors">
                              <Shield className="w-4 h-4" />
                            </div>
                            <div className="text-sm font-medium text-slate-700">Yoga Certificate</div>
                          </div>
                          <Link href={school.yogaCertificateUrl || "#"} target="_blank" className="text-slate-400 hover:text-slate-900">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>

                      <div className="group relative bg-white p-4 rounded-lg border border-slate-200 hover:border-accent transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded text-blue-600 group-hover:bg-accent group-hover:text-slate-900 transition-colors">
                              <User className="w-4 h-4" />
                            </div>
                            <div className="text-sm font-medium text-slate-700">Personal ID (Passport)</div>
                          </div>
                          <Link href={school.personalIdUrl || "#"} target="_blank" className="text-slate-400 hover:text-slate-900">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="text-xs text-slate-500 italic flex items-center gap-2">
                        <Shield className="w-3 h-3" /> Verifying against Yoga Alliance DB...
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="lg:w-1/3 p-6 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 mb-2">Internal Assessment</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Verify that the certificate matches the owner&apos;s legal name and the school is physically located in Rishikesh as stated.
                      </p>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <form action={rejectSchool} className="flex-1">
                        <input type="hidden" name="schoolId" value={school.id} />
                        <Button variant="outline" className="w-full gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                          <XCircle className="w-4 h-4" /> Reject
                        </Button>
                      </form>
                      <form action={approveSchool} className="flex-1">
                        <input type="hidden" name="schoolId" value={school.id} />
                        <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                          <CheckCircle className="w-4 h-4" /> Approve
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

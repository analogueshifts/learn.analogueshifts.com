"use client"

import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Palette, Mail, Tags, Ticket, Save, Upload, Plus, Trash2, CreditCard, ShieldCheck, Webhook, Key } from "lucide-react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import toast, { Toaster } from "react-hot-toast"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("branding")
  const [activeTemplate, setActiveTemplate] = useState("welcome")

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [categories, setCategories] = useState(["Technology & Programming", "Business & Finance", "Design & Arts", "Marketing"])

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false)
  const [newCoupon, setNewCoupon] = useState({ code: "", discount: "", maxUses: "" })
  const [coupons, setCoupons] = useState([
    { code: "BLACKFRIDAY", discount: "50%", currentUses: 450, maxUses: 1000, status: "Active" },
    { code: "WELCOME20", discount: "20%", currentUses: 12, maxUses: "Unlimited", status: "Active" },
    { code: "SUMMER10", discount: "10%", currentUses: 100, maxUses: 100, status: "Expired" }
  ])

  useEffect(() => {
    const storedCoupons = localStorage.getItem("platformCoupons")
    if (storedCoupons) {
      setCoupons(JSON.parse(storedCoupons))
    }
  }, [])

  const [gateways, setGateways] = useState({
    Stripe: { isActive: true, publicKey: "", secretKey: "" },
    Paystack: { isActive: true, publicKey: "", secretKey: "" },
    Flutterwave: { isActive: false, publicKey: "", secretKey: "" }
  })
  const [activeGatewayModal, setActiveGatewayModal] = useState<string | null>(null)
  
  // TipTap Editor (Hydration fix and styles preserved)
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<h2>Welcome to AnalogueShifts!</h2><p>We are thrilled to have you join our learning community.</p><p>Get started by exploring our featured courses.</p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-sm sm:prose-base focus:outline-none min-h-[250px] p-6 max-w-none",
      },
    },
  })

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully!`)
  }

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    setCategories([newCategoryName, ...categories])
    setIsCategoryModalOpen(false)
    setNewCategoryName("")
    toast.success(`Category "${newCategoryName}" created!`, { icon: '📂' })
  }

  const handleAddCoupon = () => {
    if (!newCoupon.code || !newCoupon.discount) return;
    
    const newCouponEntry = { 
      code: newCoupon.code, 
      discount: newCoupon.discount, 
      currentUses: 0, 
      maxUses: newCoupon.maxUses ? parseInt(newCoupon.maxUses) : "Unlimited",
      status: "Active" 
    };
    
    const updatedCoupons = [newCouponEntry, ...coupons]
    setCoupons(updatedCoupons)
    localStorage.setItem("platformCoupons", JSON.stringify(updatedCoupons))
    setIsCouponModalOpen(false)
    setNewCoupon({ code: "", discount: "", maxUses: "" })
    toast.success(`Coupon "${newCoupon.code}" generated!`, { icon: '🎟️' })
  }

  const handleDeleteCategory = (catToRemove: string) => {
    setCategories(categories.filter(cat => cat !== catToRemove))
    toast.success("Category deleted.")
  }

  const handleDeleteCoupon = (codeToRemove: string) => {
    const updatedCoupons = coupons.filter(c => c.code !== codeToRemove)
    setCoupons(updatedCoupons)
    localStorage.setItem("platformCoupons", JSON.stringify(updatedCoupons))
    toast.success("Coupon deleted.")
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <Toaster position="top-right" />
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Platform Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your brand, emails, categories, and promotional coupons.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
            <TabsList className="flex flex-col h-auto bg-transparent items-start w-full space-y-1 p-0">
              <TabsTrigger 
                value="branding" 
                className="w-full justify-start py-3 px-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0F2942] data-[state=active]:border data-[state=active]:border-border/50 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white transition-all"
              >
                <Palette className="w-4 h-4 mr-3" /> Branding & Theme
              </TabsTrigger>
              <TabsTrigger 
                value="emails" 
                className="w-full justify-start py-3 px-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0F2942] data-[state=active]:border data-[state=active]:border-border/50 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white transition-all"
              >
                <Mail className="w-4 h-4 mr-3" /> Email Templates
              </TabsTrigger>
              <TabsTrigger 
                value="categories" 
                className="w-full justify-start py-3 px-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0F2942] data-[state=active]:border data-[state=active]:border-border/50 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white transition-all"
              >
                <Tags className="w-4 h-4 mr-3" /> Categories
              </TabsTrigger>

              <TabsTrigger 
                value="gateways" 
                className="w-full justify-start py-3 px-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0F2942] data-[state=active]:border data-[state=active]:border-border/50 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white transition-all"
              >
                <CreditCard className="w-4 h-4 mr-3" /> Payment Gateways
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="w-full justify-start py-3 px-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0F2942] data-[state=active]:border data-[state=active]:border-border/50 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white transition-all"
              >
                <ShieldCheck className="w-4 h-4 mr-3" /> Security
              </TabsTrigger>
              <TabsTrigger 
                value="api" 
                className="w-full justify-start py-3 px-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0F2942] data-[state=active]:border data-[state=active]:border-border/50 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white transition-all"
              >
                <Webhook className="w-4 h-4 mr-3" /> API Integrations
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </aside>

        <div className="flex-1 min-w-0">
          {activeTab === "branding" && (
            <Card className="border-border/50 shadow-sm animate-in fade-in zoom-in-95 duration-300">
              <CardHeader className="bg-muted/10 border-b border-border/50 pb-6">
                <CardTitle className="text-xl">Branding & Theme</CardTitle>
                <CardDescription>Customize the look and feel of your LMS platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Platform Logos</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label>Primary Logo</Label>
                      <div className="border-2 border-dashed border-border/60 rounded-xl p-8 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
                        <Upload className="h-8 w-8 text-muted-foreground mb-3 group-hover:text-[#FFBB0A] transition-colors" />
                        <p className="text-sm font-medium">Click to upload SVG or PNG</p>
                        <p className="text-xs text-muted-foreground mt-1">Recommended: 250x50px</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label>Favicon</Label>
                      <div className="border-2 border-dashed border-border/60 rounded-xl p-8 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
                        <div className="h-10 w-10 rounded-lg bg-[#FFBB0A] flex items-center justify-center text-white font-bold mb-2 shadow-sm">A</div>
                        <p className="text-sm font-medium">Upload Icon</p>
                        <p className="text-xs text-muted-foreground mt-1">32x32px ICO or PNG</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="bg-border/50" />
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Brand Colors</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Primary Brand Color</Label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[#FFBB0A] shadow-inner ring-1 ring-border" />
                        <Input defaultValue="#FFBB0A" className="font-mono" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary/Dark Color</Label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[#0F2942] shadow-inner ring-1 ring-border" />
                        <Input defaultValue="#0F2942" className="font-mono" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/50 bg-muted/10 p-6">
                <Button className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md w-full sm:w-auto" onClick={() => handleSave("Branding")}>
                  <Save className="w-4 h-4 mr-2" /> Save Brand Settings
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "emails" && (
            <Card className="border-border/50 shadow-sm animate-in fade-in zoom-in-95 duration-300">
              <CardHeader className="bg-muted/10 border-b border-border/50 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Email Templates</CardTitle>
                  <CardDescription>Customize automated emails sent to users.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={activeTemplate === "welcome" ? "default" : "outline"} 
                    className={activeTemplate === "welcome" ? "bg-[#0F2942] text-white" : ""}
                    onClick={() => setActiveTemplate("welcome")}
                  >
                    Welcome
                  </Button>
                  <Button 
                    variant={activeTemplate === "purchase" ? "default" : "outline"}
                    className={activeTemplate === "purchase" ? "bg-[#0F2942] text-white" : ""}
                    onClick={() => setActiveTemplate("purchase")}
                  >
                    Purchase
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="border border-border/50 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-muted/30 border-b border-border/50 p-3 flex gap-2">
                     <Button variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'bg-muted' : ''}>B</Button>
                     <Button variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'bg-muted' : ''}>I</Button>
                     <Button variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
                  </div>
                  <EditorContent editor={editor} className="bg-background" />
                </div>
                <div className="mt-4 p-3 bg-[#FFBB0A]/10 border border-[#FFBB0A]/30 rounded-lg flex gap-3 text-sm">
                  <span className="font-semibold text-[#876307]">Variables available:</span>
                  <code className="bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded text-[#0F2942] dark:text-[#FFBB0A] font-mono">{"{{user_name}}"}</code> 
                  <code className="bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded text-[#0F2942] dark:text-[#FFBB0A] font-mono">{"{{platform_name}}"}</code>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/50 bg-muted/10 p-6">
                <Button className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md" onClick={() => handleSave("Email")}>
                  <Save className="w-4 h-4 mr-2" /> Save Template
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "categories" && (
            <Card className="border-border/50 shadow-sm animate-in fade-in zoom-in-95 duration-300">
              <CardHeader className="bg-muted/10 border-b border-border/50 pb-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Categories</CardTitle>
                  <CardDescription>Manage course categories.</CardDescription>
                </div>
                <Button 
                  className="bg-[#FFBB0A] hover:bg-[#EAB308] text-[#0F2942] font-bold"
                  onClick={() => setIsCategoryModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add New
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-3">
                  {categories.map((cat) => (
                    <div key={cat} className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:border-[#FFBB0A]/50 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Tags className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-foreground">{cat}</span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8">Edit</Button>
                        <Button variant="ghost" size="sm" className="h-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteCategory(cat)}>Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}



          {activeTab === "gateways" && (
            <Card className="border-border/50 shadow-sm animate-in fade-in zoom-in-95 duration-300">
              <CardHeader className="bg-muted/10 border-b border-border/50 pb-6">
                <CardTitle className="text-xl">Payment Gateways</CardTitle>
                <CardDescription>Configure supported payment methods for checkout.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {Object.keys(gateways).map((gatewayName) => {
                  const gateway = gateways[gatewayName as keyof typeof gateways];
                  return (
                  <div key={gatewayName} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-border/50 rounded-xl hover:border-[#0F2942]/30 dark:hover:border-[#FFBB0A]/30 transition-colors">
                    <div>
                      <h4 className="font-bold text-foreground text-lg">{gatewayName}</h4>
                      <p className="text-sm text-muted-foreground mt-1">Accept credit cards and local payment methods via {gatewayName}.</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="font-semibold"
                        onClick={() => setActiveGatewayModal(gatewayName)}
                      >
                        Configure
                      </Button>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={gateway.isActive}
                          onChange={(e) => setGateways({...gateways, [gatewayName]: { ...gateway, isActive: e.target.checked }})}
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F2942] dark:peer-checked:bg-[#FFBB0A]"></div>
                      </label>
                    </div>
                  </div>
                )})}
              </CardContent>
              <CardFooter className="border-t border-border/50 bg-muted/10 p-6">
                <Button className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md" onClick={() => handleSave("Payment")}>
                  <Save className="w-4 h-4 mr-2" /> Save Gateway Settings
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="border-border/50 shadow-sm animate-in fade-in zoom-in-95 duration-300">
              <CardHeader className="bg-muted/10 border-b border-border/50 pb-6">
                <CardTitle className="text-xl">Security Configuration</CardTitle>
                <CardDescription>Manage password policies and platform security.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <h4 className="font-bold">Require 2FA for Admins</h4>
                      <p className="text-sm text-muted-foreground">Force all administrators to use two-factor authentication.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <h4 className="font-bold">Strict Password Policy</h4>
                      <p className="text-sm text-muted-foreground">Require uppercase, numbers, and special characters for all users.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <div>
                      <h4 className="font-bold">Session Timeout</h4>
                      <p className="text-sm text-muted-foreground">Automatically log users out after inactivity.</p>
                    </div>
                    <select className="h-10 rounded-lg border border-border/50 bg-background px-3 text-sm">
                      <option>15 Minutes</option>
                      <option>30 Minutes</option>
                      <option selected>1 Hour</option>
                      <option>24 Hours</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/50 bg-muted/10 p-6">
                <Button className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md" onClick={() => handleSave("Security")}>
                  <Save className="w-4 h-4 mr-2" /> Save Security Policies
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "api" && (
            <Card className="border-border/50 shadow-sm animate-in fade-in zoom-in-95 duration-300">
              <CardHeader className="bg-muted/10 border-b border-border/50 pb-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">API & Integrations</CardTitle>
                  <CardDescription>Manage API keys and external webhooks.</CardDescription>
                </div>
                <Button 
                  className="bg-[#FFBB0A] hover:bg-[#EAB308] text-[#0F2942] font-bold"
                  onClick={() => toast.success("New API key generated and copied to clipboard!", { icon: '🔑' })}
                >
                  <Key className="w-4 h-4 mr-2" /> Generate Key
                </Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-3">
                  <Label>Brevo (Sendinblue) API Key</Label>
                  <div className="flex gap-3">
                    <Input type="password" value="xkeysib-****************************************" readOnly className="font-mono bg-muted/50" />
                    <Button variant="outline">Update</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Used for sending transactional emails and marketing broadcasts.</p>
                </div>
                <Separator className="bg-border/50" />
                <div>
                  <h4 className="font-bold mb-3">Active Webhooks</h4>
                  <div className="border border-border/50 rounded-xl overflow-hidden text-sm">
                    <div className="bg-muted/30 p-3 flex justify-between font-semibold border-b border-border/50">
                      <span>Endpoint URL</span>
                      <span>Events</span>
                    </div>
                    <div className="p-3 flex justify-between items-center border-b border-border/50 hover:bg-muted/10">
                      <span className="font-mono text-xs">https://api.example.com/webhook/enrollment</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">course.enrolled</Badge>
                    </div>
                    <div className="p-3 flex justify-between items-center hover:bg-muted/10">
                      <span className="font-mono text-xs">https://zapier.com/hooks/catch/123/</span>
                      <Badge variant="outline" className="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">user.created</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 font-extrabold">
              <Tags className="h-5 w-5 text-[#FFBB0A]" /> Add New Category
            </DialogTitle>
            <DialogDescription>
              Create a new course category for your platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category Name</Label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Data Science"
                className="h-12 rounded-xl focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A]"
              />
            </div>
          </div>
          <DialogFooter className="border-t border-border/50 pt-4 mt-2">
            <Button variant="ghost" onClick={() => setIsCategoryModalOpen(false)} className="rounded-xl font-bold">Cancel</Button>
            <Button 
              onClick={handleAddCategory} 
              disabled={!newCategoryName} 
              className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-[#FFBB0A] font-bold rounded-xl h-10 px-6"
            >
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Configure Gateway Modal */}
      <Dialog open={!!activeGatewayModal} onOpenChange={(open) => !open && setActiveGatewayModal(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 font-extrabold">
              <CreditCard className="h-5 w-5 text-[#FFBB0A]" /> Configure {activeGatewayModal}
            </DialogTitle>
            <DialogDescription>
              Enter your live API keys for {activeGatewayModal}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Public Key</Label>
              <Input
                value={activeGatewayModal ? gateways[activeGatewayModal as keyof typeof gateways].publicKey : ""}
                onChange={(e) => {
                  if(!activeGatewayModal) return;
                  setGateways({...gateways, [activeGatewayModal]: { ...gateways[activeGatewayModal as keyof typeof gateways], publicKey: e.target.value }})
                }}
                placeholder="pk_live_..."
                className="h-12 rounded-xl focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] font-mono"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Secret Key</Label>
              <Input
                type="password"
                value={activeGatewayModal ? gateways[activeGatewayModal as keyof typeof gateways].secretKey : ""}
                onChange={(e) => {
                  if(!activeGatewayModal) return;
                  setGateways({...gateways, [activeGatewayModal]: { ...gateways[activeGatewayModal as keyof typeof gateways], secretKey: e.target.value }})
                }}
                placeholder="sk_live_..."
                className="h-12 rounded-xl focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] font-mono"
              />
            </div>
          </div>
          <DialogFooter className="border-t border-border/50 pt-4 mt-2">
            <Button variant="ghost" onClick={() => setActiveGatewayModal(null)} className="rounded-xl font-bold">Cancel</Button>
            <Button 
              onClick={() => {
                toast.success(`${activeGatewayModal} API keys saved successfully!`, { icon: '🔒' })
                setActiveGatewayModal(null)
              }} 
              className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-[#FFBB0A] font-bold rounded-xl h-10 px-6"
            >
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

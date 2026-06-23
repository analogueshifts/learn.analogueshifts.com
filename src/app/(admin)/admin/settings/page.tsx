"use client"

import React, { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Palette, Mail, Tags, Save, Plus, CreditCard, ShieldCheck, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import toast, { Toaster } from "react-hot-toast"

interface Category {
  id: string
  name: string
  slug: string
}

interface Settings {
  branding?: { primaryColor: string; secondaryColor: string }
  emailTemplates?: { welcome: string; purchase: string }
  gateways?: Record<string, { isActive: boolean }>
  security?: { require2fa: boolean; strictPasswords: boolean; sessionTimeout: string }
  gatewayStatus: { paystack: boolean; flutterwave: boolean; stripe: boolean }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("branding")
  const [activeTemplate, setActiveTemplate] = useState<"welcome" | "purchase">("welcome")
  const [settings, setSettings] = useState<Settings | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [primaryColor, setPrimaryColor] = useState("#FFBB0A")
  const [secondaryColor, setSecondaryColor] = useState("#0F2942")
  const [gateways, setGateways] = useState<Record<string, { isActive: boolean }>>({
    Stripe: { isActive: true },
    Paystack: { isActive: true },
    Flutterwave: { isActive: false },
  })
  const [security, setSecurity] = useState({ require2fa: true, strictPasswords: true, sessionTimeout: "1 Hour" })

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/settings").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
    ])
      .then(([settingsBody, categoriesBody]) => {
        if (settingsBody.success) {
          setSettings(settingsBody.data)
          if (settingsBody.data.branding) {
            setPrimaryColor(settingsBody.data.branding.primaryColor)
            setSecondaryColor(settingsBody.data.branding.secondaryColor)
          }
          if (settingsBody.data.gateways) setGateways(settingsBody.data.gateways)
          if (settingsBody.data.security) setSecurity(settingsBody.data.security)
        }
        if (categoriesBody.success) setCategories(categoriesBody.data)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const editor = useEditor({
    extensions: [StarterKit],
    content: settings?.emailTemplates?.[activeTemplate] ?? "<h2>Welcome to AnalogueShifts!</h2><p>We are thrilled to have you join our learning community.</p>",
    immediatelyRender: false,
  })

  const saveSetting = async (key: string, value: unknown) => {
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    })
    return (await response.json()).success
  }

  const handleSaveBranding = async () => {
    const ok = await saveSetting("branding", { primaryColor, secondaryColor })
    if (ok) toast.success("Branding settings saved successfully!")
    else toast.error("Failed to save branding settings")
  }

  const handleSaveTemplate = async () => {
    const html = editor?.getHTML() ?? ""
    const current = settings?.emailTemplates ?? { welcome: "", purchase: "" }
    const ok = await saveSetting("emailTemplates", { ...current, [activeTemplate]: html })
    if (ok) {
      setSettings((prev) => prev ? { ...prev, emailTemplates: { ...current, [activeTemplate]: html } } : prev)
      toast.success("Email template saved successfully!")
    } else {
      toast.error("Failed to save template")
    }
  }

  const handleSaveGateways = async () => {
    const ok = await saveSetting("gateways", gateways)
    if (ok) toast.success("Gateway settings saved. Note: this only controls which gateways show at checkout -- actual API credentials are configured via environment variables, not here.")
    else toast.error("Failed to save gateway settings")
  }

  const handleSaveSecurity = async () => {
    const ok = await saveSetting("security", security)
    if (ok) toast.success("Security policies saved. Note: 2FA and session-timeout enforcement aren't implemented yet -- this just records your intended policy.")
    else toast.error("Failed to save security settings")
  }

  const handleAddCategory = async () => {
    if (!newCategoryName) return
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName }),
    })
    const body = await response.json()
    if (body.success) {
      setCategories([body.data, ...categories])
      setIsCategoryModalOpen(false)
      setNewCategoryName("")
      toast.success(`Category "${newCategoryName}" created!`, { icon: '📂' })
    } else {
      toast.error(body.error ?? "Failed to create category")
    }
  }

  const handleDeleteCategory = async (id: string) => {
    const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
    const body = await response.json()
    if (body.success) {
      setCategories(categories.filter(c => c.id !== id))
      toast.success("Category deleted.")
    } else {
      toast.error(body.error ?? "Failed to delete category")
    }
  }

  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-6 w-6 mr-2 animate-spin" /> Loading settings...
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <Toaster position="top-right" />

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Platform Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your brand, emails, categories, and gateways.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
            <TabsList className="flex flex-col h-auto bg-transparent items-start w-full space-y-1 p-0">
              <TabsTrigger value="branding" className="w-full justify-start py-3 px-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0F2942] data-[state=active]:border data-[state=active]:border-border/50 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white transition-all">
                <Palette className="w-4 h-4 mr-3" /> Branding & Theme
              </TabsTrigger>
              <TabsTrigger value="emails" className="w-full justify-start py-3 px-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0F2942] data-[state=active]:border data-[state=active]:border-border/50 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white transition-all">
                <Mail className="w-4 h-4 mr-3" /> Email Templates
              </TabsTrigger>
              <TabsTrigger value="categories" className="w-full justify-start py-3 px-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0F2942] data-[state=active]:border data-[state=active]:border-border/50 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white transition-all">
                <Tags className="w-4 h-4 mr-3" /> Categories
              </TabsTrigger>
              <TabsTrigger value="gateways" className="w-full justify-start py-3 px-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0F2942] data-[state=active]:border data-[state=active]:border-border/50 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white transition-all">
                <CreditCard className="w-4 h-4 mr-3" /> Payment Gateways
              </TabsTrigger>
              <TabsTrigger value="security" className="w-full justify-start py-3 px-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0F2942] data-[state=active]:border data-[state=active]:border-border/50 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white transition-all">
                <ShieldCheck className="w-4 h-4 mr-3" /> Security
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
                  <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Brand Colors</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Primary Brand Color</Label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg shadow-inner ring-1 ring-border" style={{ backgroundColor: primaryColor }} />
                        <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary/Dark Color</Label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg shadow-inner ring-1 ring-border" style={{ backgroundColor: secondaryColor }} />
                        <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="font-mono" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Note: saving here records the values, but the site&apos;s actual Tailwind theme colors are still set at build time -- changing this doesn&apos;t yet re-theme the live site.</p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/50 bg-muted/10 p-6">
                <Button className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md w-full sm:w-auto" onClick={handleSaveBranding}>
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
                  <Button variant={activeTemplate === "welcome" ? "default" : "outline"} className={activeTemplate === "welcome" ? "bg-[#0F2942] text-white" : ""} onClick={() => setActiveTemplate("welcome")}>
                    Welcome
                  </Button>
                  <Button variant={activeTemplate === "purchase" ? "default" : "outline"} className={activeTemplate === "purchase" ? "bg-[#0F2942] text-white" : ""} onClick={() => setActiveTemplate("purchase")}>
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
                  <EditorContent editor={editor} className="bg-background prose dark:prose-invert prose-sm sm:prose-base focus:outline-none min-h-[250px] p-6 max-w-none" />
                </div>
                <div className="mt-4 p-3 bg-[#FFBB0A]/10 border border-[#FFBB0A]/30 rounded-lg flex gap-3 text-sm">
                  <span className="font-semibold text-[#876307]">Variables available:</span>
                  <code className="bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded text-[#0F2942] dark:text-[#FFBB0A] font-mono">{"{{user_name}}"}</code>
                  <code className="bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded text-[#0F2942] dark:text-[#FFBB0A] font-mono">{"{{platform_name}}"}</code>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Note: saved here, but the actual welcome/purchase emails sent by the app use hardcoded copy, not this template yet.</p>
              </CardContent>
              <CardFooter className="border-t border-border/50 bg-muted/10 p-6">
                <Button className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md" onClick={handleSaveTemplate}>
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
                <Button className="bg-[#FFBB0A] hover:bg-[#EAB308] text-[#0F2942] font-bold" onClick={() => setIsCategoryModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Add New
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-3">
                  {categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No categories yet.</p>
                  ) : categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:border-[#FFBB0A]/50 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Tags className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-foreground">{cat.name}</span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteCategory(cat.id)}>Delete</Button>
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
                <CardDescription>Choose which gateways show at checkout. API credentials are configured via environment variables on the server, not here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {Object.keys(gateways).map((gatewayName) => {
                  const gateway = gateways[gatewayName]
                  const isConfigured = settings.gatewayStatus[gatewayName.toLowerCase() as keyof typeof settings.gatewayStatus]
                  return (
                  <div key={gatewayName} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-border/50 rounded-xl hover:border-[#0F2942]/30 dark:hover:border-[#FFBB0A]/30 transition-colors">
                    <div>
                      <h4 className="font-bold text-foreground text-lg flex items-center gap-2">
                        {gatewayName}
                        {isConfigured ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Configured</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200"><XCircle className="w-3 h-3 mr-1" /> No API key set</Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">Accept credit cards and local payment methods via {gatewayName}.</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center gap-3">
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
                <Button className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md" onClick={handleSaveGateways}>
                  <Save className="w-4 h-4 mr-2" /> Save Gateway Settings
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="border-border/50 shadow-sm animate-in fade-in zoom-in-95 duration-300">
              <CardHeader className="bg-muted/10 border-b border-border/50 pb-6">
                <CardTitle className="text-xl">Security Configuration</CardTitle>
                <CardDescription>Manage password policies and platform security. Note: these toggles aren&apos;t enforced anywhere yet -- saving here just records intended policy for future implementation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <h4 className="font-bold">Require 2FA for Admins</h4>
                      <p className="text-sm text-muted-foreground">Force all administrators to use two-factor authentication.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={security.require2fa} onChange={(e) => setSecurity({ ...security, require2fa: e.target.checked })} />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <h4 className="font-bold">Strict Password Policy</h4>
                      <p className="text-sm text-muted-foreground">Require uppercase, numbers, and special characters for all users.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={security.strictPasswords} onChange={(e) => setSecurity({ ...security, strictPasswords: e.target.checked })} />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <div>
                      <h4 className="font-bold">Session Timeout</h4>
                      <p className="text-sm text-muted-foreground">Automatically log users out after inactivity.</p>
                    </div>
                    <select className="h-10 rounded-lg border border-border/50 bg-background px-3 text-sm" value={security.sessionTimeout} onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}>
                      <option>15 Minutes</option>
                      <option>30 Minutes</option>
                      <option>1 Hour</option>
                      <option>24 Hours</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/50 bg-muted/10 p-6">
                <Button className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md" onClick={handleSaveSecurity}>
                  <Save className="w-4 h-4 mr-2" /> Save Security Policies
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 font-extrabold">
              <Tags className="h-5 w-5 text-[#FFBB0A]" /> Add New Category
            </DialogTitle>
            <DialogDescription>Create a new course category for your platform.</DialogDescription>
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
            <Button onClick={handleAddCategory} disabled={!newCategoryName} className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-[#FFBB0A] font-bold rounded-xl h-10 px-6">
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

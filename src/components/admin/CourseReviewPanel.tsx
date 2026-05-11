"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, AlertCircle } from "lucide-react"

export interface CourseData {
  id: string
  title: string
  trainer: string
  category: string
  price: number
  description: string
  status: "Pending" | "Draft" | "Live" | "Archived"
  submittedAt: string
}

interface Props {
  course: CourseData | null
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string, reason: string) => void
  onRequestEdit: (id: string, reason: string) => void
}

export function CourseReviewPanel({ course, onClose, onApprove, onReject, onRequestEdit }: Props) {
  const [reason, setReason] = useState("")
  const [actionType, setActionType] = useState<"reject" | "edit" | null>(null)

  if (!course) {
    return (
      <div className="flex h-full items-center justify-center border-l bg-muted/20 p-8 text-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="rounded-full bg-muted p-3">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No Course Selected</h3>
          <p className="text-sm text-muted-foreground">
            Select a course from the queue to review its details.
          </p>
        </div>
      </div>
    )
  }

  const handleAction = (type: "approve" | "reject" | "edit") => {
    if (type === "approve") {
      onApprove(course.id)
    } else {
      if (!reason) {
        setActionType(type)
        return
      }
      if (type === "reject") onReject(course.id, reason)
      if (type === "edit") onRequestEdit(course.id, reason)
      setReason("")
      setActionType(null)
    }
  }

  return (
    <div className="flex h-full flex-col border-l bg-background">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h2 className="text-lg font-semibold">{course.title}</h2>
          <p className="text-sm text-muted-foreground">by {course.trainer}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Category</Label>
            <p className="text-sm font-medium">{course.category}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Price</Label>
            <p className="text-sm font-medium">${course.price}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Submitted At</Label>
            <p className="text-sm font-medium">{course.submittedAt}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Status</Label>
            <div className="mt-1">
              <Badge variant="outline">{course.status}</Badge>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Description</Label>
          <div className="mt-2 rounded-md bg-muted/50 p-3 text-sm">
            {course.description}
          </div>
        </div>

        {/* Placeholder for video/content preview */}
        <div>
          <Label className="text-xs text-muted-foreground">Curriculum Preview</Label>
          <div className="mt-2 flex h-40 items-center justify-center rounded-md border border-dashed">
            <span className="text-sm text-muted-foreground">Video/Content Player</span>
          </div>
        </div>
      </div>

      <div className="border-t p-4 space-y-4">
        {actionType && (
          <div className="space-y-2 animate-in slide-in-from-bottom-2">
            <Label htmlFor="reason">
              Reason for {actionType === "reject" ? "Rejection" : "Edit Request"}
            </Label>
            <Textarea
              id="reason"
              placeholder="Provide detailed feedback..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={actionType === "reject" ? "destructive" : "default"}
                className={actionType !== "reject" ? "bg-[#0F2942] hover:bg-[#0F2942]/90 text-white" : ""}
                onClick={() => handleAction(actionType)}
                disabled={!reason}
              >
                Confirm
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setActionType(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!actionType && (
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              variant="outline"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleAction("reject")}
            >
              Reject Course
            </Button>
            <Button
              variant="outline"
              className="border-[#0F2942]/20 text-[#0F2942] dark:border-border dark:text-foreground"
              onClick={() => handleAction("edit")}
            >
              Request Edit
            </Button>
            <Button className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md" onClick={() => handleAction("approve")}>
              <Check className="mr-2 h-4 w-4 text-[#FFBB0A]" /> Approve & Publish
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function FeedbackPage() {
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      if (response.status === 200) {
        setSubmitted(true)
        toast({
          title: "Thank you for your feedback!",
          description: "We've received your message and will review it soon.",
        })
        // Reset form after 3 seconds
        setTimeout(() => {
          setMessage("")
          setSubmitted(false)
        }, 3000)
      } else {
        throw new Error(data.message || "Failed to submit feedback")
      }
    } catch (error) {
      toast({
        title: "Error sending feedback",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Send Feedback</CardTitle>
          </div>
          <CardDescription>
            Help us improve FloatChat by sharing your thoughts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Thank you!</h3>
                <p className="text-muted-foreground">Your feedback has been submitted successfully.</p>
              </div>
            </div>
          ) : (
            <form action="https://api.web3forms.com/submit" method="POST" onSubmit={handleSubmit} className="space-y-6">
              {/* Required hidden fields for Web3Forms */}
              <input type="hidden" name="apikey" value={process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY} />
              <input type="hidden" name="subject" value="FloatChat Feedback" />
              <input type="checkbox" name="botcheck" style={{display: 'none'}} />

              {/* Message Textarea */}
              <div className="space-y-2">
                <Textarea
                  name="message"
                  id="message"
                  placeholder="Tell us what you think..."
                  className="min-h-[300px] resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={10000}
                  required
                  disabled={submitting}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {message.length}/10,000 characters
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={submitting || message.trim().length === 0}
              >
                {submitting ? (
                  <>
                    <Send className="mr-2 h-4 w-4 animate-pulse" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Feedback
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
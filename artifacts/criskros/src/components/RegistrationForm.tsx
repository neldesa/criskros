import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { CheckCircle2, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

const formSchema = z.object({
  organization: z.string().min(2, "Organization name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  city: z.string().min(2, "City is required"),
})

type FormData = z.infer<typeof formSchema>

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setServerError(null)

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        setServerError(json.error || "Something went wrong. Please try again.")
        return
      }

      setIsSuccess(true)
    } catch {
      setServerError("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl p-8 shadow-xl text-center border border-border"
      >
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-accent" />
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground mb-3">
          Interest Submitted!
        </h3>
        <p className="text-muted-foreground mb-8">
          Thank you for registering your interest in Criskros. This is a provisional booking. Our team will contact you shortly with the next steps for fee payment to confirm your slot.
        </p>
        <Button onClick={() => { setIsSuccess(false); reset(); }} variant="outline" className="w-full">
          Register Another Team
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-2xl shadow-primary/5 border border-border relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-8">
          <h3 className="font-display text-2xl font-bold text-foreground">Provisional Registration</h3>
          <p className="text-muted-foreground mt-2">Fill this form to express your organization's interest.</p>
        </div>

        {serverError && (
          <div className="mb-5 flex items-start gap-3 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="organization">Organization / Corporate Name</Label>
            <Input 
              id="organization" 
              placeholder="e.g. Acme Corp" 
              {...register("organization")} 
              className={errors.organization ? "border-destructive focus-visible:ring-destructive/10" : ""}
            />
            {errors.organization && <p className="text-xs text-destructive">{errors.organization.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Person Name</Label>
            <Input 
              id="contactName" 
              placeholder="John Doe" 
              {...register("contactName")} 
              className={errors.contactName ? "border-destructive focus-visible:ring-destructive/10" : ""}
            />
            {errors.contactName && <p className="text-xs text-destructive">{errors.contactName.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@acme.com" 
                {...register("email")} 
                className={errors.email ? "border-destructive focus-visible:ring-destructive/10" : ""}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                placeholder="+91 98765 43210" 
                {...register("phone")} 
                className={errors.phone ? "border-destructive focus-visible:ring-destructive/10" : ""}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city" 
              placeholder="e.g. Mumbai" 
              {...register("city")} 
              className={errors.city ? "border-destructive focus-visible:ring-destructive/10" : ""}
            />
            {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              size="lg" 
              variant="gradient" 
              className="w-full group"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Interest
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              * By submitting this form, you are registering interest. Your slot is only confirmed after the participation fee is paid.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

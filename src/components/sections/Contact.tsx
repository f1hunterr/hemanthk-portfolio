import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Send, Building2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const contactInfo = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: "Email",
    value: "Hemanth2608@hotmail.com",
    href: "mailto:Hemanth2608@hotmail.com",
  },
  {
    icon: <Phone className="w-5 h-5" />,
    label: "Phone",
    value: "+91 80884 61724",
    href: "tel:+918088461724",
  },
  {
    icon: <Linkedin className="w-5 h-5" />,
    label: "LinkedIn",
    value: "linkedin.com/in/hemanth-k-8609b4255",
    href: "https://www.linkedin.com/in/hemanth-k-8609b4255",
  },
  {
    icon: <WhatsAppIcon className="w-5 h-5" />,
    label: "WhatsApp",
    value: "+91 80884 61724",
    href: "https://wa.me/918088461724?text=Hi%20Hemanth%2C%20I%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect!",
  },
  {
    icon: <Building2 className="w-5 h-5" />,
    label: "Company",
    value: "House of Blue Beans (HOBB)",
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: "Location",
    value: "Hennur, Bangalore, Karnataka",
  },
];

export function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Honeypot: hidden from people, bots fill it in; Formspree silently drops submissions where it's set
  const gotchaRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const res = await fetch("https://formspree.io/f/mojrrnqd", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...values, _gotcha: gotchaRef.current?.value ?? "" }),
      });
      if (res.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. I'll get back to you soon.",
        });
        form.reset();
      } else {
        toast({
          title: "Failed to send",
          description: "Something went wrong. Please email me at Hemanth2608@hotmail.com",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Network error",
        description: "Check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-20" style={{ backgroundColor: "var(--portfolio-section-alt)" }}>
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2
            className="text-3xl font-bold tracking-tight text-foreground mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Get in Touch
          </h2>
          <div className="w-14 h-1 rounded-full mx-auto mb-5" style={{ backgroundColor: "var(--portfolio-accent)" }}></div>
          <p className="text-muted-foreground max-w-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Have a question, opportunity, or want to discuss IT infrastructure challenges? Feel free to reach out.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="rounded-xl border border-border bg-white dark:bg-card shadow-sm p-6 h-full">
              <h3
                className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Contact Information
              </h3>

              <div className="space-y-5">
                {contactInfo.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: "var(--portfolio-icon-bg)", color: "var(--portfolio-accent)" }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p
                        className="text-xs font-medium text-muted-foreground mb-0.5"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm text-foreground hover:text-primary transition-colors"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span
                          className="text-sm text-foreground"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="mt-8 rounded-xl p-5"
                style={{ backgroundColor: "var(--portfolio-navy)" }}
              >
                <p
                  className="text-white font-semibold text-sm mb-1"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Open to Opportunities
                </p>
                <p
                  className="text-white/70 text-xs leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Currently available for IT infrastructure consulting, freelance engagements, and full-time IT management roles.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="rounded-xl border border-border bg-white dark:bg-card shadow-sm p-6 h-full">
              <h3
                className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Send a Message
              </h3>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <input
                    ref={gotchaRef}
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ fontFamily: "'Inter', sans-serif" }}>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Name"
                              {...field}
                              className="bg-background"
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ fontFamily: "'Inter', sans-serif" }}>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your.email@example.com"
                              {...field}
                              className="bg-background"
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ fontFamily: "'Inter', sans-serif" }}>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="How can I help you? Tell me about your IT infrastructure needs..."
                            className="min-h-[160px] bg-background resize-none"
                            {...field}
                            data-testid="textarea-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto gap-2 font-medium text-white disabled:opacity-70"
                    style={{ backgroundColor: "var(--portfolio-navy)", fontFamily: "'Inter', sans-serif" }}
                    data-testid="button-send-message"
                  >
                    <Send size={17} />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

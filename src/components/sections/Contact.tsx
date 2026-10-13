import { useRef, useState } from "react";
import { ArrowUpRight, Send } from "lucide-react";
import { Section, Reveal } from "@/components/frame/Section";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
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
    label: "Email",
    value: "Hemanth2608@hotmail.com",
    href: "mailto:Hemanth2608@hotmail.com",
  },
  {
    label: "Phone",
    value: "+91 80884 61724",
    href: "tel:+918088461724",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/hemanth-k-8609b4255",
    href: "https://www.linkedin.com/in/hemanth-k-8609b4255",
  },
  {
    label: "WhatsApp",
    value: "+91 80884 61724",
    href: "https://wa.me/918088461724?text=Hi%20Hemanth%2C%20I%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect!",
  },
  {
    label: "Company",
    value: "House of Blue Beans (HOBB)",
  },
  {
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

  const mailHref = "mailto:Hemanth2608@hotmail.com";
  const whatsApp = contactInfo.find((c) => c.label === "WhatsApp")?.href;

  return (
    <Section id="contact" index="05" label="Contact" meta="Bangalore · IST (UTC+5:30)">
      {/* Closing call to action */}
      <Reveal className="px-5 md:px-10 py-20 md:py-28 text-center">
        <p className="mono-label text-[var(--muted)]">Open to opportunities <span className="text-[var(--faint)]">·</span> full-time or consulting</p>
        <h2 className="headline mx-auto mt-6">
          Let's <em>talk</em>.
        </h2>
        <p className="lede mt-6 max-w-[34rem] mx-auto">
          Have a question, opportunity, or want to discuss IT infrastructure challenges? Feel free to reach out.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a className="btn btn-solid w-full sm:w-auto" href={mailHref}>
            Email me <ArrowUpRight size={14} />
          </a>
          {whatsApp && (
            <a className="btn btn-outline w-full sm:w-auto" href={whatsApp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          )}
        </div>
      </Reveal>

      {/* Details + form */}
      <div className="hairgrid lg:grid-cols-[2fr_3fr]">
        <div>
          <div className="cell-strip mono-label">
            <span>Contact information</span>
            <span className="text-[var(--faint)]">A</span>
          </div>
          <dl>
            {contactInfo.map((item) => (
              <div key={item.label} className="grid grid-cols-[110px_1fr] gap-4 px-5 md:px-8 py-4 border-b border-[var(--line)] last:border-b-0">
                <dt className="mono-label text-[var(--muted)] pt-[3px]">{item.label}</dt>
                <dd className="min-w-0 break-words">
                  {item.href ? (
                    <a
                      href={item.href}
                      {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-[var(--ink)] underline decoration-[var(--line-strong)] underline-offset-4 hover:decoration-[var(--ink)] transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-[var(--ink)]">{item.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <div className="cell-strip mono-label">
            <span>Send a message</span>
            <span className="text-[var(--faint)]">B</span>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-5 md:px-8 py-8 space-y-6">
              <input
                ref={gotchaRef}
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mono-label text-[11px] font-medium text-[var(--muted)]">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} className="h-12 bg-[var(--bg-raised)] shadow-none" data-testid="input-name" />
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
                      <FormLabel className="mono-label text-[11px] font-medium text-[var(--muted)]">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} className="h-12 bg-[var(--bg-raised)] shadow-none" data-testid="input-email" />
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
                    <FormLabel className="mono-label text-[11px] font-medium text-[var(--muted)]">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="How can I help you? Tell me about your IT infrastructure needs..."
                        className="min-h-[160px] bg-[var(--bg-raised)] shadow-none resize-none"
                        {...field}
                        data-testid="textarea-message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-solid w-full sm:w-auto disabled:opacity-60"
                data-testid="button-send-message"
              >
                <Send size={13} />
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
            </form>
          </Form>
        </div>
      </div>
    </Section>
  );
}

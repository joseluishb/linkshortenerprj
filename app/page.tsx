import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  LinkIcon,
  BarChart3,
  Zap,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: LinkIcon,
    title: "Instant Shortening",
    description:
      "Paste any long URL and get a clean, shareable short link in seconds.",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description:
      "Track how many times each link has been clicked and monitor engagement over time.",
  },
  {
    icon: Zap,
    title: "Fast Redirects",
    description:
      "Every short link resolves instantly so your visitors never experience delays.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description:
      "Your links are tied to your account so only you can manage or delete them.",
  },
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 px-4 py-24 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
            <LinkIcon className="size-3" />
            Free link shortener
          </span>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
            Shorten URLs.
            <br />
            Share Smarter.
          </h1>

          <p className="max-w-md text-base sm:text-lg text-muted-foreground leading-relaxed">
            Create short, memorable links in seconds. Track every click and
            manage all your links in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <Button size="lg" className="px-8">
                Get started — it&apos;s free
              </Button>
            </SignUpButton>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <Button variant="outline" size="lg" className="px-8">
                Sign in
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-foreground mb-12">
            Everything you need to manage your links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-xl border bg-background p-6"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 px-4 text-center text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <span>&copy; {new Date().getFullYear()} LinkShortener. All rights reserved.</span>
          <a
            href="https://hube.pe/contactus"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground underline underline-offset-4 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </footer>
    </div>
  );
}

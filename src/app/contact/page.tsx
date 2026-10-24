"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import { firePawsConfetti } from "@/lib/confetti";
import { Mail, Send, CheckCircle2, MessageCircle, HelpCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Membership Inquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });
    } catch (e) {
      // Continue safely
    }
    setSubmitted(true);
    setIsSubmitting(false);
    firePawsConfetti();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 bg-[#00F5D4] text-black font-display font-black text-xs px-3.5 py-1 rounded-full border-2 border-black rotate-[-2deg] mb-3 pop-shadow">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WE&apos;D LOVE TO HEAR FROM YOU</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-slate-950 dark:text-white">
          Contact the PawsWell Team
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
          Have questions about memberships, protocol downloads, or partnerships? Our support pack typically responds within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info Bento */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-[#FFFDF5] dark:bg-slate-900 border-4 border-black rounded-3xl p-6 pop-shadow-xl space-y-3">
            <span className="text-3xl block">💌</span>
            <h3 className="font-display font-black text-xl text-slate-950 dark:text-white">
              Direct Contact
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              General Inquiries:{" "}
              <a href={`mailto:${siteConfig.contactEmail}`} className="text-[#FF4D6D] underline">
                {siteConfig.contactEmail}
              </a>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              Partnerships:{" "}
              <a href={`mailto:${siteConfig.sponsorEmail}`} className="text-purple-600 underline">
                {siteConfig.sponsorEmail}
              </a>
            </p>
          </div>

          <div className="bg-[#FFE600] border-4 border-black rounded-3xl p-6 pop-shadow-xl text-black space-y-2">
            <span className="font-display font-black text-xs uppercase bg-black text-[#FFE600] px-2 py-0.5 rounded-full inline-block">
              EMERGENCY NOTICE
            </span>
            <h4 className="font-display font-black text-lg">Need Immediate Vet Care?</h4>
            <p className="text-xs font-semibold leading-relaxed">
              PawsWell does not provide emergency triage. If your companion is experiencing acute trauma, bloating, or respiratory distress, contact your nearest 24/7 emergency veterinary hospital immediately.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-8 pop-shadow-xl">
          {submitted ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-display font-black text-2xl text-emerald-950">
                Message Dispatched!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 font-semibold leading-relaxed">
                Thank you for reaching out, <span className="font-black">{name || "Friend"}</span>. One of our support leads will be in touch at <span className="font-black">{email}</span> within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="sarah@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs font-bold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                >
                  <option value="Membership Inquiry">Membership & Billing Support</option>
                  <option value="Protocol Question">Protocol / Recipe Question</option>
                  <option value="Pet Wall Question">Pet Wall Moderation</option>
                  <option value="Brand Partnership">Brand Sponsorship & Advertising</option>
                  <option value="Other">General Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Your Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you and your companion today?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3.5 text-xs font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-sm rounded-2xl border-3 border-black pop-shadow-coral hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Message to the Pack</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

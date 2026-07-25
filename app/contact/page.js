"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function Contact() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");

  // UI state
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = "Name is required";
    
    if (!email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    if (!message.trim()) {
      tempErrors.message = "Message is required";
    } else if (message.trim().length < 10) {
      tempErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
    }
  };

  const handleResetForm = () => {
    setName("");
    setEmail("");
    setSubject("general");
    setMessage("");
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="flex-grow flex flex-col">
      <PageHeader
        title="Contact Us"
        subtitle="Get in Touch"
        description="Have questions about tier qualifications or custom ranking integration? Drop us a message."
      />

      <Section variant="gradient">
        <Container>
          <div className="max-w-2xl mx-auto">
            {submitted ? (
              <Card hoverable={false} className="border-t-4 border-t-success text-center py-10">
                <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-6 text-success shadow-glow-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-white font-display tracking-tight mb-3">
                  Message Sent Successfully!
                </h3>
                <p className="text-text-secondary max-w-sm mx-auto text-sm leading-relaxed mb-8">
                  Thank you for reaching out to FlyRank. One of our staff engineers will review your request and get back to you within 24 hours.
                </p>
                <Button onClick={handleResetForm} variant="secondary">
                  Send Another Message
                </Button>
              </Card>
            ) : (
              <Card title="Send a Message" subtitle="All fields are required" hoverable={false}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
                  
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full bg-[#0d101c] border rounded-lg px-3.5 py-2.5 text-white placeholder-gray-600 focus:outline-none text-sm transition-all duration-200 ${
                        errors.name ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-white/10 focus:border-secondary"
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="jane.doe@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-[#0d101c] border rounded-lg px-3.5 py-2.5 text-white placeholder-gray-600 focus:outline-none text-sm transition-all duration-200 ${
                        errors.email ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-white/10 focus:border-secondary"
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
                  </div>

                  {/* Subject field */}
                  <div>
                    <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                      Inquiry Type
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#0d101c] border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-secondary text-sm"
                    >
                      <option value="general">General Support / Questions</option>
                      <option value="business">Enterprise Analytics Licensing</option>
                      <option value="alliance">Airline Alliance Partnerships</option>
                      <option value="bug">Report a Calculation Discrepancy</option>
                    </select>
                  </div>

                  {/* Message field */}
                  <div>
                    <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                      Detailed Message
                    </label>
                    <textarea
                      rows="5"
                      placeholder="Please write details about your inquiry..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`w-full bg-[#0d101c] border rounded-lg px-3.5 py-2.5 text-white placeholder-gray-600 focus:outline-none text-sm transition-all duration-200 resize-none ${
                        errors.message ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-white/10 focus:border-secondary"
                      }`}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.message}</p>}
                  </div>

                  <Button type="submit" variant="primary" className="w-full mt-2">
                    Submit Message
                  </Button>
                </form>
              </Card>
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
}

import React, { useState } from 'react';
import { Mail, Globe, PhoneCall, CheckCircle2, Send, Clock, ShieldCheck } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Business Startup Consultancy',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 text-slate-900 relative border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Info & Details */}
          <AnimatedSection animation="fade-right" className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-blue-50/90 border border-blue-200/90 px-4 py-1.5 rounded-full text-blue-700 text-xs font-bold tracking-widest uppercase shadow-2xs">
                <span>Get In Touch</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 tracking-tight leading-tight">
                Let’s Discuss Your Business Growth
              </h2>
              <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
                Whether you are launching a startup, structuring financial systems, or scaling an established enterprise, our advisory team is ready to help.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Direct Email</span>
                  <a href="mailto:info@accounticca.com" className="text-lg font-serif font-bold text-slate-900 hover:text-blue-600 transition block">
                    info@accounticca.com
                  </a>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Official Website</span>
                  <a href="https://www.accounticca.com" target="_blank" rel="noreferrer" className="text-lg font-serif font-bold text-slate-900 hover:text-blue-600 transition block">
                    www.accounticca.com
                  </a>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Business Hours</span>
                  <p className="text-sm font-semibold text-slate-900">Monday – Friday: 9:00 AM – 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-blue-700 font-semibold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>E-Lawyers Ecosystem Synergy</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Looking for legal incorporation or compliance? We seamlessly coordinate with the E-Lawyers ecosystem to provide your business with complete 360-degree advisory.
              </p>
            </div>

          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection animation="fade-left" delay={150} className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl relative">
              
              {submitted ? (
                <div className="text-center py-12 space-y-6 animate-fadeIn">
                  <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-bold text-slate-900">Consultation Request Received!</h3>
                    <p className="text-slate-600 text-sm max-w-md mx-auto">
                      Thank you, <strong className="text-slate-900">{formData.name}</strong>. Our senior advisory team has received your message and will contact you via <strong className="text-blue-600">{formData.email}</strong> within 24 business hours.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', service: 'Business Startup Consultancy', message: '' });
                    }}
                    className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-bold text-slate-900">Request a Consultation</h3>
                    <p className="text-xs text-slate-500">Fill out the form below and an Accounticca advisor will be in touch shortly.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Area of Consultancy</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                      >
                        <option value="Business Startup Consultancy">Business Startup Consultancy</option>
                        <option value="Business Planning & Strategy">Business Planning & Strategy</option>
                        <option value="Accounting & Financial Consultancy">Accounting & Financial Consultancy</option>
                        <option value="Bookkeeping Services">Bookkeeping Services</option>
                        <option value="Business Process Optimization">Business Process Optimization</option>
                        <option value="Business Automation Consultancy">Business Automation Consultancy</option>
                        <option value="HR & Organizational Consultancy">HR & Organizational Consultancy</option>
                        <option value="Sales & Marketing Consultancy">Sales & Marketing Consultancy</option>
                        <option value="SME Growth Consultancy">SME Growth Consultancy</option>
                        <option value="Outsourced Business Support">Outsourced Business Support</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Your Message / Business Challenge *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your business goals, current challenges, or specific advisory needs..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Submit Consultation Request</span>
                  </button>
                </form>
              )}

            </div>
          </AnimatedSection>

        </div>

      </div>
    </section>
  );
};

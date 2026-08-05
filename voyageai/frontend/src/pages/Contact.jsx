import { useState } from "react";
import toast from "react-hot-toast";
import { FiMapPin, FiMail, FiPhone, FiSend, FiLoader } from "react-icons/fi";
import useDocumentTitle from "../hooks/useDocumentTitle";
import * as contactService from "../services/contactService";
import { getErrorMessage } from "../services/api";

const Contact = () => {
  useDocumentTitle("Contact Us");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactService.submitContactMessage(form);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-app py-16">
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="section-eyebrow justify-center">Get in touch</span>
        <h1 className="text-4xl font-display font-bold mt-3">Contact Us</h1>
        <p className="text-ink/50 mt-3">Have a question about a booking or a destination? We're here to help.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-5">
          {[
            { icon: FiMapPin, title: "Our office", text: "5th Floor, Tower B, Cyber City, Phase 3, Gurugram, Haryana, 122002, India" },
            { icon: FiMail, title: "Email us", text: "hello@voyageai.com" },
            { icon: FiPhone, title: "Call us", text: "+91 65456 46534" },
          ].map((item) => (
            <div key={item.title} className="card p-5 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-coral-50 text-coral-600 flex items-center justify-center shrink-0">
                <item.icon size={19} />
              </div>
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-ink/50 text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-2 card p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Full name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label">Email address</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">Subject</label>
            <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? <FiLoader className="animate-spin" /> : <FiSend />} Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
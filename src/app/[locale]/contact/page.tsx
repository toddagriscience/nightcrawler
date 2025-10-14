'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl'; // Add this import
import { submitToGoogleSheets } from './action';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Contact() {
  const t = useTranslations('ContactPage'); // Add this hook
  const router = useRouter();
  interface FormData {
    fullName: string;
    email: string;
    reason: string;
    message: string;
  }

  const MAX_MESSAGE_LENGTH = 1500;

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    reason: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.message.length > MAX_MESSAGE_LENGTH) {
      setError(
        `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters.`
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submissionData = {
        ...formData,
      };
      await submitToGoogleSheets(submissionData);
      router.push('/thank-you');
    } catch (error) {
      console.error('Form submission error:', error);
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F7F4EC] text-foreground p-8 md:p-16 mb-16">
        <div className="max-w-3xl mx-auto pt-8">
          <h1 className="text-[64px] font-[300] text-foreground/80 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl font-[200] mb-16 text-foreground/60">
            {t('description')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-16">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-md">
                <p className="text-red-600 text-sm font-[200]">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-xl font-[200] text-foreground/80"
              >
                {t('nameLabel')}
              </label>
              <input
                id="fullName"
                type="text"
                required
                className="w-full bg-transparent border-b border-foreground/20 py-2 text-xl font-[200] focus:outline-none focus:border-[#2A2727]/40 transition-colors"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
              />
              <p className="text-sm font-[200] text-foreground/40">*Required</p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xl font-[200] text-foreground/80"
              >
                {t('emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full bg-transparent border-b border-foreground/20 py-2 text-xl font-[200] focus:outline-none focus:border-[#2A2727]/40 transition-colors"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <p className="text-sm font-[200] text-foreground/40">*Required</p>
            </div>

            <div className="space-y-2 relative">
              <label
                htmlFor="reason"
                className="text-xl font-[200] text-foreground/80"
              >
                Select Reason for Contact
              </label>
              <Select
                required
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, reason: value }))
                }
              >
                <SelectTrigger className="border-foreground/20 border-b mt-4 pr-0 rounded-none text-xl font-light">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-background border-foreground/20 text-lg">
                  <SelectItem
                    className="hover:opacity-100 opacity-80 transition"
                    value="general"
                  >
                    General Inquiry
                  </SelectItem>
                  <SelectItem
                    value="support"
                    className="hover:opacity-100 opacity-80 transition"
                  >
                    Client Support
                  </SelectItem>
                  <SelectItem
                    value="business"
                    className="hover:opacity-100 opacity-80 transition"
                  >
                    Employment Inquiry
                  </SelectItem>
                  <SelectItem
                    value="media"
                    className="hover:opacity-100 opacity-80 transition"
                  >
                    Media
                  </SelectItem>
                  <SelectItem
                    value="other"
                    className="hover:opacity-100 opacity-80 transition"
                  >
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm font-[200] text-foreground/40">*Required</p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-xl font-[200] text-foreground/80"
              >
                Message
              </label>
              <textarea
                id="message"
                required
                rows={6}
                className="w-full bg-transparent border-b border-foreground/20 py-2 text-xl font-[200] focus:outline-none focus:border-[#2A2727]/40 transition-colors resize-none"
                value={formData.message}
                onChange={(e) => {
                  const message = e.target.value;
                  if (message.length <= MAX_MESSAGE_LENGTH) {
                    // Prevent state update if over limit
                    setFormData((prev) => ({ ...prev, message: message }));
                  }
                }}
                maxLength={MAX_MESSAGE_LENGTH}
              />
              <p className="text-sm font-[200] text-foreground/40">
                *Required{' '}
                <span className="text-foreground/60">
                  ({formData.message.length}/{MAX_MESSAGE_LENGTH} characters)
                </span>
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="text-xl font-[200] text-foreground/80 hover:text-[#2A2727] transition-colors disabled:opacity-50 flex items-center gap-2 group hover:cursor-pointer"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

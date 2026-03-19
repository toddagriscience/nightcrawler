// Copyright © Todd Agriscience, Inc. All rights reserved.

export type PublicInquiryOption = {
  label: 'Forgot Email' | 'Forgot Password' | 'Contact Support';
  href: string;
  intent: 'forgot-email' | 'forgot-password' | 'contact-support';
};

'use client';

import { useEffect } from 'react';

// PAYMENT DISABLED — this page previously showed enrollment/payment status.
// Restore the original implementation from git history when Razorpay is integrated.
// Original imports: useEffect, useRef, useState, motion, Header, Footer,
//   CheckCircle2, Loader2, AlertTriangle, fetchEnrollmentStatus, formatINR,
//   EnrollmentStatus, siteConfig
export default function EnrollmentSuccessPage() {
  useEffect(() => {
    window.location.replace('/');
  }, []);

  return null;
}

import React, { useState, useEffect, useRef } from 'react';

export default function HowItWorks({ onNavigate }) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const candidateSteps = [
    {
      num: 1,
      title: "SEAMLESS ACCESS",
      desc: "Register with phone + OTP (available in your preferred regional language).",
      icon: (
        <svg width="13" height="19" viewBox="0 0 13 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.66667 18.3333C1.20833 18.3333 0.815972 18.1701 0.489583 17.8438C0.163194 17.5174 0 17.125 0 16.6667V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H10C10.4583 0 10.8507 0.163194 11.1771 0.489583C11.5035 0.815972 11.6667 1.20833 11.6667 1.66667V4.25C11.9167 4.34722 12.1181 4.5 12.2708 4.70833C12.4236 4.91667 12.5 5.15278 12.5 5.41667V7.08333C12.5 7.34722 12.4236 7.58333 12.2708 7.79167C12.1181 8 11.9167 8.15278 11.6667 8.25V16.6667C11.6667 17.125 11.5035 17.5174 11.1771 17.8438C10.8507 18.1701 10.4583 18.3333 10 18.3333H1.66667ZM1.66667 16.6667H10V1.66667H1.66667V16.6667Z" fill="#010101" />
        </svg>
      )
    },
    {
      num: 2,
      title: "VERIFIED CREDENTIALS",
      desc: "Securely upload Aadhaar and education documents for immediate verification.",
      icon: (
        <svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.58333 13.3333C3.31944 13.3333 2.23958 12.8958 1.34375 12.0208C0.447917 11.1458 0 10.0764 0 8.8125C0 7.72917 0.326389 6.76389 0.979167 5.91667C1.63194 5.06944 2.48611 4.52778 3.54167 4.29167C3.88889 3.01389 4.58333 1.97917 5.625 1.1875C6.66667 0.395833 7.84722 0 9.16667 0C10.7917 0 12.1701 0.565972 13.3021 1.69792C14.434 2.82986 15 4.20833 15 5.83333C15.9583 5.94444 16.7535 6.35764 17.3854 7.07292C18.0174 7.78819 18.3333 8.625 18.3333 9.58333C18.3333 10.625 17.9688 11.5104 17.2396 12.2396C16.5104 12.9688 15.625 13.3333 14.5833 13.3333H10C9.54167 13.3333 9.14931 13.1701 8.82292 12.8438C8.49653 12.5174 8.33333 12.125 8.33333 11.6667V7.375L7 8.66667L5.83333 7.5L9.16667 4.16667L12.5 7.5L11.3333 8.66667L10 7.375V11.6667H14.5833C15.1667 11.6667 15.6597 11.4653 16.0625 11.0625C16.4653 10.6597 16.6667 10.1667 16.6667 9.58333C16.6667 9 16.4653 8.50694 16.0625 8.10417C15.6597 7.70139 15.1667 7.5 14.5833 7.5H13.3333V5.83333C13.3333 4.68056 12.9271 3.69792 12.1146 2.88542C11.3021 2.07292 10.3194 1.66667 9.16667 1.66667C8.01389 1.66667 7.03125 2.07292 6.21875 2.88542C5.40625 3.69792 5 4.68056 5 5.83333H4.58333C3.77778 5.83333 3.09028 6.11806 2.52083 6.6875C1.95139 7.25694 1.66667 7.94444 1.66667 8.75C1.66667 9.55556 1.95139 10.2431 2.52083 10.8125C3.09028 11.3819 3.77778 11.6667 4.58333 11.6667H6.66667V13.3333H4.58333Z" fill="#010101" />
        </svg>
      )
    },
    {
      num: 3,
      title: "SMART DISCOVERY",
      desc: "Browse curated apprenticeships by location, stipend, and specific trades.",
      icon: (
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 10.8333V9.16667H8.33333V10.8333H0ZM0 6.66667V5H4.16667V6.66667H0ZM0 2.5V0.833333H4.16667V2.5H0ZM15.5 10.8333L12.2917 7.625C11.9583 7.86111 11.5938 8.03819 11.1979 8.15625C10.8021 8.27431 10.4028 8.33333 10 8.33333C8.84722 8.33333 7.86458 7.92708 7.05208 7.11458C6.23958 6.30208 5.83333 5.31944 5.83333 4.16667C5.83333 3.01389 6.23958 2.03125 7.05208 1.21875C7.86458 0.40625 8.84722 0 10 0C11.1528 0 12.1354 0.40625 12.9479 1.21875C13.7604 2.03125 14.1667 3.01389 14.1667 4.16667C14.1667 4.56944 14.1076 4.96875 13.9896 5.36458C13.8715 5.76042 13.6944 6.125 13.4583 6.45833L16.6667 9.66667L15.5 10.8333ZM10 6.66667C10.6944 6.66667 11.2847 6.42361 11.7708 5.9375C12.2569 5.45139 12.5 4.86111 12.5 4.16667C12.5 3.47222 12.2569 2.88194 11.7708 2.39583C11.2847 1.90972 10.6944 1.66667 10 1.66667C9.30556 1.66667 8.71528 1.90972 8.22917 2.39583C7.74306 2.88194 7.5 3.47222 7.5 4.16667C7.5 4.86111 7.74306 5.45139 8.22917 5.9375C8.71528 6.42361 9.30556 6.66667 10 6.66667Z" fill="#010101" />
        </svg>
      )
    },
    {
      num: 4,
      title: "DIRECT PLACEMENT",
      desc: "Apply directly, attend structured interviews, and secure your placement.",
      icon: (
        <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.33333 12.5417L12.2083 6.66667L11.0417 5.5L6.33333 10.2083L3.95833 7.83333L2.79167 9L6.33333 12.5417ZM1.66667 16.6667C1.20833 16.6667 0.815972 16.5035 0.489583 16.1771C0.163194 15.8507 0 15.4583 0 15V3.33333C0 2.875 0.163194 2.48264 0.489583 2.15625C0.815972 1.82986 1.20833 1.66667 1.66667 1.66667H5.16667C5.34722 1.16667 5.64931 0.763889 6.07292 0.458333C6.49653 0.152778 6.97222 0 7.5 0C8.02778 0 8.50347 0.152778 8.92708 0.458333C9.35069 0.763889 9.65278 1.16667 9.83333 1.66667H13.3333C13.7917 1.66667 14.184 1.82986 14.5104 2.15625C14.8368 2.48264 15 2.875 15 3.33333V15C15 15.4583 14.8368 15.8507 14.5104 16.1771C14.184 16.5035 13.7917 16.6667 13.3333 16.6667H1.66667ZM1.66667 15H13.3333V3.33333H1.66667V15ZM7.5 2.70833C7.68056 2.70833 7.82986 2.64931 7.94792 2.53125C8.06597 2.41319 8.125 2.26389 8.125 2.08333C8.125 1.90278 8.06597 1.75347 7.94792 1.63542C7.82986 1.51736 7.68056 1.45833 7.5 1.45833C7.31944 1.45833 7.17014 1.51736 7.05208 1.63542C6.93403 1.75347 6.875 1.90278 6.875 2.08333C6.875 2.26389 6.93403 2.41319 7.05208 2.53125C7.17014 2.64931 7.31944 2.70833 7.5 2.70833ZM1.66667 15V3.33333V15Z" fill="#010101" />
        </svg>
      )
    },
    {
      num: 5,
      title: "PROGRESS TRACKING",
      desc: "Real-time monitoring of attendance, training milestones, and stipend payments.",
      icon: (
        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.66667 13.3333V1.66667C1.66667 1.66667 1.66667 1.97569 1.66667 2.59375C1.66667 3.21181 1.66667 4.01389 1.66667 5V10C1.66667 10.9861 1.66667 11.7882 1.66667 12.4062C1.66667 13.0243 1.66667 13.3333 1.66667 13.3333ZM1.66667 15C1.20833 15 0.815972 14.8368 0.489583 14.5104C0.163194 14.184 0 13.7917 0 13.3333V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H13.3333C13.7917 0 14.184 0.163194 14.5104 0.489583+C14.8368 0.815972 15 1.20833 15 1.66667V13.3333C15 13.7917 14.8368 14.184 14.5104 14.5104C14.184 14.8368 13.7917 15 13.3333 15H1.66667ZM1.66667 13.3333H13.3333V1.66667H1.66667V13.3333ZM1.66667 1.66667V13.3333V1.66667Z" fill="#010101" />
        </svg>
      )
    },
    {
      num: 6,
      title: "SAFE ENVIRONMENT",
      desc: "Raise grievances through a safe, confidential, and responsive channel.",
      icon: (
        <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.66667 11.6667C8.08333 10.3889 8.99306 9.48958 9.39583 8.96875C9.79861 8.44792 10 7.93056 10 7.41667C10 6.91667 9.81944 6.48611 9.45833 6.125C9.09722 5.76389 8.66667 5.58333 8.16667 5.58333C7.875 5.58333 7.59375 5.64236 7.32292 5.76042C7.05208 5.87847 6.83333 6.04167 6.66667 6.25C6.5 6.04167 6.28472 5.87847 6.02083 5.76042C5.75694 5.64236 5.47222 5.58333 5.16667 5.58333C4.66667 5.58333 4.23611 5.76389 3.875 6.125C3.51389 6.48611 3.33333 6.91667 3.33333 7.41667C3.33333 7.68056 3.36806 7.92361 3.4375 8.14583C3.50694 8.36806 3.65972 8.62847 3.89583 8.92708C4.13194 9.22569 4.46875 9.59028 4.90625 10.0208C5.34375 10.4514 5.93056 11 6.66667 11.6667ZM6.66667 16.6667C4.73611 16.1806 3.14236 15.0729 1.88542 13.3438C0.628472 11.6146 0 9.69444 0 7.58333V2.5L6.66667 0L13.3333 2.5V7.58333C13.3333 9.69444 12.7049 11.6146 11.4479 13.3438C10.191 15.0729 8.59722 16.1806 6.66667 16.6667Z" fill="#010101" />
        </svg>
      )
    }
  ];

  const employerSteps = [
    {
      num: 1,
      title: "INSTANT COMPLIANCE",
      desc: "Register your entity with automated CIN and GST verification for trust.",
      icon: (
        <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.79167 11.2917L10.5 6.58333L9.3125 5.39583L5.79167 8.91667L4.04167 7.16667L2.85417 8.35417L5.79167 11.2917ZM6.66667 16.6667C4.73611 16.1806 3.14236 15.0729 1.88542 13.3438C0.628472 11.6146 0 9.69444 0 7.58333V2.5L6.66667 0L13.3333 2.5V7.58333C13.3333 9.69444 12.7049 11.6146 11.4479 13.3438C10.191 15.0729 8.59722 16.1806 6.66667 16.6667Z" fill="#0041C8" />
        </svg>
      )
    },
    {
      num: 2,
      title: "NAPS INTEGRATION",
      desc: "Post apprenticeship listings with real-time NAPS compliance checks.",
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.66667 15C1.20833 15 0.815972 14.8368 0.489583 14.5104C0.163194 14.184 0 13.7917 0 13.3333V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H9.16667V1.66667H1.66667V13.3333H13.3333V5.83333H15V13.3333C15 13.7917 14.8368 14.184 14.5104 14.5104C14.184 14.8368 13.7917 15 13.3333 15H1.66667ZM4.16667 11.6667V10H10.8333V11.6667H4.16667ZM4.16667 9.16667V7.5H10.8333V9.16667H4.16667ZM4.16667 6.66667V5H10.8333V6.66667H4.16667ZM11.6667 5V3.33333H10V1.66667H11.6667V0H13.3333V1.66667H15V3.33333H13.3333V5H11.6667Z" fill="#0041C8" />
        </svg>
      )
    },
    {
      num: 3,
      title: "VERIFIED TALENT",
      desc: "Access a database of pre-screened, document-verified women candidates.",
      icon: (
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 10V8.6875C0 8.09028 0.305556 7.60417 0.916667 7.22917C1.52778 6.85417 2.33333 6.66667 3.33333 6.66667C3.51389 6.66667 3.6875 6.67014 3.85417 6.67708C4.02083 6.68403 4.18056 6.70139 4.33333 6.72917C4.13889 7.02083 3.99306 7.32639 3.89583 7.64583C3.79861 7.96528 3.75 8.29861 3.75 8.64583V10H0ZM5 10V8.64583C5 8.20139 5.12153 7.79514 5.36458 7.42708C5.60764 7.05903 5.95139 6.73611 6.39583 6.45833C6.84028 6.18056 7.37153 5.97222 7.98958 5.83333C8.60764 5.69444 9.27778 5.625 10 5.625C10.7361 5.625 11.4132 5.69444 12.0312 5.83333C12.6493 5.97222 13.1806 6.18056 13.625 6.45833C14.0694 6.73611 14.4097 7.05903 14.6458 7.42708C14.8819 7.79514 15 8.20139 15 8.64583V10H5ZM16.25 10V8.64583C16.25 8.28472 16.2049 7.94444 16.1146 7.625C16.0243 7.30556 15.8889 7.00694 15.7083 6.72917C15.8611 6.70139 16.0174 6.68403 16.1771 6.67708C16.3368 6.67014 16.5 6.66667 16.6667 6.66667C17.6667 6.66667 18.4722 6.85069 19.0833 7.21875C19.6944 7.58681 20 8.07639 20 8.6875V10H16.25ZM6.77083 8.33333H13.25C13.1111 8.05556 12.7257 7.8125 12.0938 7.60417C11.4618 7.39583 10.7639 7.29167 10 7.29167C9.23611 7.29167 8.53819 7.39583 7.90625 7.60417C7.27431 7.8125 6.89583 8.05556 6.77083 8.33333ZM3.33333 5.83333C2.875 5.83333 2.48264 5.67014 2.15625 5.34375C1.82986 5.01736 1.66667 4.625 1.66667 4.16667C1.66667 3.69444 1.82986 3.29861 2.15625 2.97917C2.48264 2.65972 2.875 2.5 3.33333 2.5C3.80556 2.5 4.20139 2.65972 4.52083 2.97917C4.84028 3.29861 5 3.69444 5 4.16667C5 4.625 4.84028 5.01736 4.52083 5.34375C4.20139 5.67014 3.80556 5.83333 3.33333 5.83333ZM16.6667 5.83333C16.2083 5.83333 15.816 5.67014 15.4896 5.34375C15.1632 5.01736 15 4.625 15 4.16667C15 3.69444 15.1632 3.29861 15.4896 2.97917C15.816 2.65972 16.2083 2.5 16.6667 2.5C17.1389 2.5 17.5347 2.65972 17.8542 2.97917C18.1736 3.29861 18.3333 3.69444 18.3333 4.16667C18.3333 4.625 18.1736 5.01736 17.8542 5.34375C17.5347 5.67014 17.1389 5.83333 16.6667 5.83333Z" fill="#0041C8" />
        </svg>
      )
    },
    {
      num: 4,
      title: "WORKFLOW ENGINE",
      desc: "Schedule interviews and dispatch digital offer letters through the dashboard.",
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.66667 16.6667C1.20833 16.6667 0.815972 16.5035 0.489583 16.1771C0.163194 15.8507 0 15.4583 0 15V3.33333C0 2.875 0.163194 2.48264 0.489583 2.15625C0.815972 1.82986 1.20833 1.66667 1.66667 1.66667H2.5V0H4.16667V1.66667H10.8333V0H12.5V1.66667H13.3333C13.7917 1.66667 14.184 1.82986 14.5104 2.15625C14.8368 2.48264 15 2.875 15 3.33333V15C15 15.4583 14.8368 15.8507 14.5104 16.1771C14.184 16.5035 13.7917 16.6667 13.3333 16.6667H1.66667ZM1.66667 15H13.3333V6.66667H1.66667V15ZM1.66667 5H13.3333V3.33333H1.66667V5ZM1.66667 5V3.33333V5Z" fill="#0142C8" />
        </svg>
      )
    },
    {
      num: 5,
      title: "OPERATIONS HUB",
      desc: "Manage attendance logs, training modules, and stipend disbursements seamlessly.",
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 15V13.3333L1.66667 11.6667V15H0ZM3.33333 15V10L5 8.33333V15H3.33333ZM6.66667 15V8.33333L8.33333 10.0208V15H6.66667ZM10 15V10.0208L11.6667 8.35417V15H10ZM13.3333 15V6.66667L15 5V15H13.3333ZM0 10.6875V8.33333L5.83333 2.5L9.16667 5.83333L15 0V2.35417L9.16667 8.1875L5.83333 4.85417L0 10.6875Z" fill="#0041C8" />
        </svg>
      )
    },
    {
      num: 6,
      title: "ESG REPORTING",
      desc: "Download comprehensive ESG impact reports for board-level transparency.",
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.33333 11.6667H5V7.5H3.33333V11.6667ZM10 11.6667H11.6667V3.33333H10V11.6667ZM6.66667 11.6667H8.33333V9.16667H6.66667V11.6667ZM6.66667 7.5H8.33333V5.83333H6.66667V7.5ZM1.66667 15C1.20833 15 0.815972 14.8368 0.489583 14.5104C0.163194 14.184 0 13.7917 0 13.3333V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H13.3333C13.7917 0 14.184 0.163194 14.5104 0.489583C14.8368 0.815972 15 1.66667 15 1.66667V13.3333C15 13.7917 14.8368 14.184 14.5104 14.5104C14.184 14.8368 13.7917 15 13.3333 15H1.66667ZM1.66667 13.3333H13.3333V1.66667H1.66667V13.3333ZM1.66667 1.66667V13.3333V1.66667Z" fill="#0041C8" />
        </svg>
      )
    }
  ];

  return (
    <section ref={sectionRef} id="how-it-works" className="py-14 md:py-18 bg-white flex flex-col items-center">
      
      {/* Title */}
      <h2 className="text-[#000] font-dMSerifDisplay text-3xl sm:text-4xl lg:text-[44px] lg:leading-[56px] text-center mb-10 md:mb-12 tracking-tight">
        How It Works
      </h2>

      {/* Two columns grid wrapper */}
      <div className="w-full max-w-[1200px] px-6 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left Timeline: Candidates */}
        <div className="bg-[#FFF] border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3.5 border-b border-b-[#C3C5D9]/40 pb-4 mb-6">
              <div className="flex justify-center items-center rounded-xl bg-[#010101] w-12 h-12 shrink-0 shadow-md">
                <svg width="18" height="10" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.4 12L0 10.6L7.4 3.15L11.4 7.15L16.6 2H14V0H20V6H18V3.4L11.4 10L7.4 6L1.4 12Z" fill="white" />
                </svg>
              </div>
              <div>
                <h3 className="text-[#010101] font-inter text-xl sm:text-2xl font-bold tracking-tight">
                  For Candidates
                </h3>
                <p className="text-[#434656] font-inter text-xs sm:text-sm mt-0.5 opacity-[70%] font-medium">
                  Accelerate your professional journey
                </p>
              </div>
            </div>

            {/* Vertical timeline items */}
            <div className="relative pl-11 sm:pl-12 space-y-6">
              {/* Vertical line connector (Base track) */}
              <div className="absolute top-4 bottom-4 left-[16px] w-0.5 bg-[#010101]/20"></div>
              {/* Animated Progress Bar moving down */}
              <div 
                className="absolute top-4 left-[16px] w-0.5 bg-[#010101] transition-all duration-[2000ms] ease-in-out origin-top"
                style={{ height: hasAnimated ? 'calc(100% - 24px)' : '0%' }}
              ></div>

              {candidateSteps.map((step) => (
                <div 
                  key={step.num} 
                  className={`relative text-left transition-all duration-700 transform ${
                    hasAnimated 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${step.num * 150}ms` }}
                >
                  {/* Step number button anchor */}
                  <div 
                    className={`absolute -left-[32px] top-0 flex justify-center items-center rounded-full border-2 border-[#010101] bg-[#FFF] w-8 h-8 z-10 font-inter text-xs font-bold text-[#010101] transition-all duration-500 transform ${
                      hasAnimated ? 'scale-100' : 'scale-0'
                    }`}
                    style={{ transitionDelay: `${step.num * 150}ms` }}
                  >
                    {step.num}
                  </div>

                  {/* Content details */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="shrink-0 scale-90 origin-left">{step.icon}</span>
                    <h4 className="text-[#010101] font-inter text-sm sm:text-base font-extrabold tracking-wide uppercase">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-[#434656] font-inter text-xs sm:text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="mt-8 pt-5 border-t border-slate-100">
            <button
              onClick={() => onNavigate('candidate')}
              className="cursor-pointer w-full py-3 px-5 justify-center items-center gap-2 rounded-xl bg-[#010101] hover:bg-[#212121] text-white font-inter text-base font-bold transition flex items-center shadow-md justify-center"
            >
              <span>Start Your Application</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="white" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Timeline: Employers */}
        <div className="bg-[#FFF] border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3.5 border-b border-b-[#C3C5D9]/40 pb-4 mb-6">
              <div className="flex justify-center items-center rounded-xl bg-[#0041C8] w-12 h-12 shrink-0 shadow-md">
                <svg width="18" height="17" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 19C1.45 19 0.979167 18.8042 0.5875 18.4125C0.195833 18.0208 0 17.55 0 17V13H7V15H13V13H20V17C20 17.55 19.8042 18.8042 19.4125 18.4125C19.0208 18.8042 18.55 19 18 19H2ZM9 13V11H11V13H9ZM0 11V6C0 5.45 0.195833 4.97917 0.5875 4.5875C0.979167 4.19583 1.45 4 2 4H6V2C6 1.45 6.19583 0.979167 6.5875 0.5875C6.97917 0.195833 7.45 0 8 0H12C12.55 0 13.0208 0.195833 13.4125 0.5875C13.8042 0.979167 14 1.45 14 2V4H18C18.55 4 19.0208 4.19583 19.4125 4.5875C19.8042 4.97917 20 5.45 20 6V11H13V9H7V11H0ZM8 4H12V2H8V4Z" fill="white" />
                </svg>
              </div>
              <div>
                <h3 className="text-[#0041C8] font-inter text-xl sm:text-2xl font-bold tracking-tight">
                  For Employers
                </h3>
                <p className="text-[#434656] font-inter text-xs sm:text-sm mt-0.5 opacity-[70%] font-medium">
                  Optimized talent procurement
                </p>
              </div>
            </div>

            {/* Vertical timeline items */}
            <div className="relative pl-11 sm:pl-12 space-y-6">
              {/* Vertical line connector (Base track) */}
              <div className="absolute top-4 bottom-4 left-[16px] w-0.5 bg-[#0142C8]/20"></div>
              {/* Animated Progress Bar moving down */}
              <div 
                className="absolute top-4 left-[16px] w-0.5 bg-[#0142C8] transition-all duration-[2000ms] ease-in-out origin-top"
                style={{ height: hasAnimated ? 'calc(100% - 24px)' : '0%' }}
              ></div>

              {employerSteps.map((step) => (
                <div 
                  key={step.num} 
                  className={`relative text-left transition-all duration-700 transform ${
                    hasAnimated 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${step.num * 150}ms` }}
                >
                  {/* Step number button anchor */}
                  <div 
                    className={`absolute -left-[32px] top-0 flex justify-center items-center rounded-full border-2 border-[#0142C8] bg-[#FFF] w-8 h-8 z-10 font-inter text-xs font-bold text-[#0142C8] transition-all duration-500 transform ${
                      hasAnimated ? 'scale-100' : 'scale-0'
                    }`}
                    style={{ transitionDelay: `${step.num * 150}ms` }}
                  >
                    {step.num}
                  </div>

                  {/* Content details */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="shrink-0 scale-90 origin-left">{step.icon}</span>
                    <h4 className="text-[#0142C8] font-inter text-sm sm:text-base font-extrabold tracking-wide uppercase">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-[#434656] font-inter text-xs sm:text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="mt-8 pt-5 border-t border-slate-100">
            <button
              onClick={() => onNavigate('employer')}
              className="cursor-pointer w-full py-3 px-5 justify-center items-center gap-2 rounded-xl bg-[#0142C8] hover:bg-[#0135A0] text-white font-inter text-base font-bold transition flex items-center shadow-md justify-center"
            >
              <span>Register Your Company</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="white" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

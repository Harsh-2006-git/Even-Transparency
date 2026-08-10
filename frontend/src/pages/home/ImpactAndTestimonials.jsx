import React from 'react';

export default function ImpactAndTestimonials() {
  const testimonials = [
    {
      quote: "The platform made finding a verified apprenticeship simple and transparent. I always knew the status of my application",
      name: "Priya Sharma",
      role: "Apprentice",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
      highlight: true
    },
    {
      quote: "Hiring through Even Cargo significantly reduced our onboarding time while ensuring compliance",
      name: "Richa Sharma",
      role: "Employer Partner",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
      highlight: false
    },
    {
      quote: "The platform kept me informed at every step and made starting my career simple",
      name: "Sneha Gupta",
      role: "Apprentice",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      highlight: false
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-white flex flex-col items-center w-full">
      {/* ── SECTION 1: Creating Opportunities That Matter ────────────────────── */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <h2 className="text-slate-900 font-dMSerifDisplay text-xl sm:text-3xl lg:text-[38px] lg:leading-[46px] text-center tracking-tight mb-6 sm:mb-12">
          Creating Opportunities That Matter
        </h2>

        {/* 4 Stat Cards: 2 Columns on Mobile, 3 on Tablet, 4 on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 w-full">
          
          {/* Card 1: 10,800+ Women Trained & Placed */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-blue-200/80 p-3 sm:p-6 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all">
            <div className="w-[75px] h-[75px] relative shrink-0 mb-1 sm:mb-3 transform max-sm:scale-70 max-sm:-my-2">
              <div className="rounded-[13px] bg-[#EFF1FF] w-[75px] h-[75px] absolute left-0 top-0"></div>
              <div className="w-[54px] h-[54px] absolute left-2.5 top-[11px] overflow-hidden flex items-center justify-center">
                <svg
                  width="45"
                  height="45"
                  viewBox="0 0 45 45"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[45px] h-[45px]"
                >
                  <path
                    d="M31.9275 0H13.0725C4.8825 0 0 4.8825 0 13.0725V31.905C0 40.1175 4.8825 45 13.0725 45H31.905C40.095 45 44.9775 40.1175 44.9775 31.9275V13.0725C45 4.8825 40.1175 0 31.9275 0ZM12.6675 36.3375C12.6675 37.26 11.9025 38.025 10.98 38.025C10.0575 38.025 9.2925 37.26 9.2925 36.3375V31.68C9.2925 30.7575 10.0575 29.9925 10.98 29.9925C11.9025 29.9925 12.6675 30.7575 12.6675 31.68V36.3375ZM24.1875 36.3375C24.1875 37.26 23.4225 38.025 22.5 38.025C21.5775 38.025 20.8125 37.26 20.8125 36.3375V27C20.8125 26.0775 21.5775 25.3125 22.5 25.3125C23.4225 25.3125 24.1875 26.0775 24.1875 27V36.3375ZM35.7075 36.3375C35.7075 37.26 34.9425 38.025 34.02 38.025C33.0975 38.025 32.3325 37.26 32.3325 36.3375V22.3425C32.3325 21.42 33.0975 20.655 34.02 20.655C34.9425 20.655 35.7075 21.42 35.7075 22.3425V36.3375ZM35.7075 15.2325C35.7075 16.155 34.9425 16.92 34.02 16.92C33.0975 16.92 32.3325 16.155 32.3325 15.2325V13.05C26.595 18.945 19.4175 23.1075 11.385 25.11C11.25 25.155 11.115 25.155 10.98 25.155C10.215 25.155 9.54 24.6375 9.3375 23.8725C9.1125 22.9725 9.6525 22.05 10.575 21.825C18.1575 19.935 24.9075 15.9525 30.2625 10.3275H27.45C26.5275 10.3275 25.7625 9.5625 25.7625 8.64C25.7625 7.7175 26.5275 6.9525 27.45 6.9525H34.0425C34.1325 6.9525 34.2 6.9975 34.29 6.9975C34.4025 7.02 34.515 7.02 34.6275 7.065C34.74 7.11 34.83 7.1775 34.9425 7.245C35.01 7.29 35.0775 7.3125 35.145 7.3575C35.1675 7.38 35.1675 7.4025 35.19 7.4025C35.28 7.4925 35.3475 7.5825 35.415 7.6725C35.4825 7.7625 35.55 7.83 35.5725 7.92C35.6175 8.01 35.6175 8.1 35.64 8.2125C35.6625 8.325 35.7075 8.4375 35.7075 8.5725C35.7075 8.595 35.73 8.6175 35.73 8.64V15.2325H35.7075Z"
                    fill="#0142C8"
                  />
                </svg>
              </div>
            </div>
            <span className="text-xl sm:text-3xl font-extrabold text-[#0142C8] font-inter tracking-tight leading-none mb-1">
              10,800+
            </span>
            <span className="text-[11px] sm:text-sm text-slate-500 font-medium font-inter">
              Women Trained &amp; Placed
            </span>
          </div>

          {/* Card 2: 10+ Employer Partners */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-blue-200/80 p-3 sm:p-6 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all">
            <div className="w-[75px] h-[75px] relative shrink-0 mb-1 sm:mb-3 transform max-sm:scale-70 max-sm:-my-2">
              <div className="rounded-[13px] bg-[#EFF1FF] w-[75px] h-[75px] absolute left-0 top-0"></div>
              <div className="w-[54px] h-[54px] absolute left-2.5 top-[11px] overflow-hidden">
                <div className="w-[54px] h-[54px] absolute left-0 top-0">
                  <div className="w-[46px] h-12 absolute left-1 top-[3px]">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[21px] h-[21px] absolute left-1.5 top-0"
                    >
                      <path
                        d="M10.6875 0C4.7925 0 0 4.7925 0 10.6875C0 16.5825 4.5225 21.15 10.4175 21.3525C10.5975 21.33 10.7775 21.33 10.9125 21.3525H11.07C16.83 21.15 21.3525 16.47 21.375 10.6875C21.375 4.7925 16.5825 0 10.6875 0Z"
                        fill="#0142C8"
                      />
                    </svg>
                    <svg
                      width="14"
                      height="17"
                      viewBox="0 0 14 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[13px] h-4 absolute left-7 top-[5px]"
                    >
                      <path
                        d="M13.23 7.38778C13.59 11.7528 10.485 15.5777 6.1875 16.0952H6.075C5.94 16.0952 5.805 16.0952 5.6925 16.1402C3.51 16.2527 1.5075 15.5552 0 14.2728C2.3175 12.2028 3.645 9.09778 3.375 5.72278C3.2175 3.90028 2.5875 2.23528 1.6425 0.817783C2.4975 0.390283 3.4875 0.120283 4.5 0.0302834C8.91 -0.352217 12.8475 2.93278 13.23 7.38778Z"
                        fill="#0142C8"
                      />
                    </svg>
                    <svg
                      width="19"
                      height="17"
                      viewBox="0 0 19 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[18px] h-4 absolute left-7 top-6"
                    >
                      <path
                        d="M18 9.20339C17.82 11.3859 16.425 13.2759 14.085 14.5584C11.835 15.7959 9 16.3809 6.1875 16.3134C7.8075 14.8509 8.7525 13.0284 8.9325 11.0934C9.1575 8.30339 7.83 5.62589 5.175 3.48839C3.6675 2.29589 1.9125 1.35089 0 0.653391C4.9725 -0.786609 11.2275 0.180892 15.075 3.28589C17.145 4.95089 18.2025 7.04339 18 9.20339Z"
                        fill="#0142C8"
                      />
                    </svg>
                    <svg
                      width="32"
                      height="21"
                      viewBox="0 0 32 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-[21px] absolute left-px top-6"
                    >
                      <path
                        d="M27.27 3.13875C20.9925 -1.04625 10.755 -1.04625 4.4325 3.13875C1.575 5.05125 0 7.63875 0 10.4063C0 11.2838 0.18 12.1162 0.4725 12.9487L1.0575 12.7913C2.205 12.4537 3.0375 11.6212 3.3525 10.4962L3.9375 8.35875L4.0725 7.97625C4.5 6.85125 5.58 6.10875 6.8175 6.10875C8.0775 6.10875 9.09 6.87375 9.5175 7.99875L10.215 10.5187C10.5075 11.6437 11.385 12.4988 12.4875 12.8138L15.0975 13.5563C16.2225 14.0288 16.8975 15.0862 16.8975 16.3237C16.8975 17.6346 16.0002 18.7459 14.76 19.1362L12.5325 19.7438C12.105 19.8563 11.7225 20.0813 11.385 20.3288C12.8475 20.5988 14.3325 20.8013 15.84 20.8013C19.98 20.8013 24.12 19.7437 27.27 17.6287C30.105 15.7162 31.68 13.1512 31.68 10.3612C31.6575 7.59375 30.105 5.02875 27.27 3.13875Z"
                        fill="#0142C8"
                      />
                    </svg>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 absolute left-0 top-[33px]"
                    >
                      <path
                        d="M15.7275 7.9425C15.7275 8.1 15.6375 8.46 15.21 8.595L13.005 9.2025C11.0925 9.72 9.6525 11.16 9.135 13.0725L8.55 15.2325C8.415 15.7275 8.0325 15.7725 7.8525 15.7725C7.6725 15.7725 7.29 15.7275 7.155 15.2325L6.57 13.05C6.0525 11.16 4.59 9.72 2.7 9.2025L0.5175 8.6175C0.0450001 8.4825 0 8.0775 0 7.92C0 7.74 0.0450001 7.335 0.5175 7.2L2.7225 6.615C4.6125 6.075 6.0525 4.635 6.57 2.745L7.2 0.45C7.3575 0.0674996 7.7175 0 7.8525 0C7.9875 0 8.37 0.0449985 8.505 0.404999L9.135 2.7225C9.6525 4.6125 11.115 6.0525 13.005 6.5925L15.255 7.2225C15.705 7.4025 15.7275 7.8075 15.7275 7.9425Z"
                        fill="#0142C8"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <span className="text-xl sm:text-3xl font-extrabold text-[#0142C8] font-inter tracking-tight leading-none mb-1">
              10+
            </span>
            <span className="text-[11px] sm:text-sm text-slate-500 font-medium font-inter">
              Employer Partners
            </span>
          </div>

          {/* Card 3: 16 Cities Across India */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-blue-200/80 p-3 sm:p-6 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all">
            <div className="w-[75px] h-[75px] relative shrink-0 mb-1 sm:mb-3 transform max-sm:scale-70 max-sm:-my-2">
              <div className="rounded-[13px] bg-[#EFF1FF] w-[75px] h-[75px] absolute left-0 top-0"></div>
              <div className="w-[54px] h-[54px] absolute left-2.5 top-[11px] overflow-hidden">
                <div className="w-[54px] h-[54px] absolute left-0 top-0">
                  <div className="w-[45px] h-[45px] absolute left-[5px] top-[5px]">
                    <svg
                      width="5"
                      height="5"
                      viewBox="0 0 5 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[5px] h-1 absolute left-3.5 top-3"
                    >
                      <path
                        d="M2.25 0C0.99 0 0 1.0125 0 2.25C0 3.4875 1.0125 4.5 2.25 4.5C3.4875 4.5 4.5 3.4875 4.5 2.25C4.5 1.0125 3.4875 0 2.25 0Z"
                        fill="#0142C8"
                      />
                    </svg>
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 44 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-11 h-11 absolute left-0 top-0"
                    >
                      <path
                        d="M43.785 6.84C41.895 2.4525 37.7325 0 31.9275 0H13.0725C5.85 0 0 5.85 0 13.0725V31.9275C0 37.7325 2.4525 41.895 6.84 43.785C7.2675 43.965 7.7625 43.8525 8.0775 43.5375L43.5375 8.0775C43.875 7.74 43.9875 7.245 43.785 6.84ZM19.1925 23.04C18.315 23.895 17.1675 24.3 16.02 24.3C14.8725 24.3 13.725 23.8725 12.8475 23.04C10.5525 20.88 8.0325 17.4375 9 13.3425C9.855 9.63 13.14 7.965 16.02 7.965C18.9 7.965 22.185 9.63 23.04 13.365C23.985 17.4375 21.465 20.88 19.1925 23.04Z"
                        fill="#0142C8"
                      />
                    </svg>
                    <svg
                      width="28"
                      height="16"
                      viewBox="0 0 28 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[27px] h-[15px] absolute left-3 top-[30px]"
                    >
                      <path
                        d="M26.9301 11.835C27.4251 12.33 27.3576 13.14 26.7501 13.4775C24.7701 14.58 22.3626 15.1425 19.5501 15.1425H0.69507C0.0425696 15.1425 -0.227431 14.3775 0.222569 13.9275L13.8126 0.3375C14.2626 -0.1125 14.9601 -0.1125 15.4101 0.3375L26.9301 11.835Z"
                        fill="#0142C8"
                      />
                    </svg>
                    <svg
                      width="16"
                      height="28"
                      viewBox="0 0 16 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[15px] h-[27px] absolute left-[30px] top-3"
                    >
                      <path
                        d="M15.165 0.69507V19.5501C15.165 22.3626 14.6025 24.7926 13.5 26.7501C13.1625 27.3576 12.3525 27.4026 11.8575 26.9301L0.3375 15.4101C-0.1125 14.9601 -0.1125 14.2626 0.3375 13.8126L13.9275 0.222569C14.4 -0.227431 15.165 0.0425696 15.165 0.69507Z"
                        fill="#0142C8"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <span className="text-xl sm:text-3xl font-extrabold text-[#0142C8] font-inter tracking-tight leading-none mb-1">
              16
            </span>
            <span className="text-[11px] sm:text-sm text-slate-500 font-medium font-inter">
              Cities Across India
            </span>
          </div>

          {/* Card 4: 12 States Covered */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-blue-200/80 p-3 sm:p-6 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all">
            <div className="w-[75px] h-[75px] relative shrink-0 mb-1 sm:mb-3 transform max-sm:scale-70 max-sm:-my-2">
              <div className="rounded-[13px] bg-[#EFF1FF] w-[75px] h-[75px] absolute left-0 top-0"></div>
              <div className="w-[54px] h-[54px] absolute left-2.5 top-[11px] overflow-hidden">
                <svg
                  width="40"
                  height="47"
                  viewBox="0 0 40 47"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-[46px] absolute left-[7px] top-[5px]"
                >
                  <path
                    d="M39.361 15.075C37.021 4.6575 27.931 0 19.966 0C19.966 0 19.966 0 19.9435 0C12.001 0 2.93349 4.6575 0.570991 15.0525C-2.08401 26.6625 5.02599 36.495 11.461 42.705C13.846 45 16.906 46.1475 19.966 46.1475C23.026 46.1475 26.086 45 28.4485 42.705C34.8835 36.495 41.9935 26.685 39.361 15.075ZM26.1535 21.9375H21.6535V26.4375C21.6535 27.36 20.8885 28.125 19.966 28.125C19.0435 28.125 18.2785 27.36 18.2785 26.4375V21.9375H13.7785C12.856 21.9375 12.091 21.1725 12.091 20.25C12.091 19.3275 12.856 18.5625 13.7785 18.5625H18.2785V14.0625C18.2785 13.14 19.0435 12.375 19.966 12.375C20.8885 12.375 21.6535 13.14 21.6535 14.0625V18.5625H26.1535C27.076 18.5625 27.841 19.3275 27.841 20.25C27.841 21.1725 27.076 21.9375 26.1535 21.9375Z"
                    fill="#0142C8"
                  />
                </svg>
              </div>
            </div>
            <span className="text-xl sm:text-3xl font-extrabold text-[#0142C8] font-inter tracking-tight leading-none mb-1">
              12
            </span>
            <span className="text-[11px] sm:text-sm text-slate-500 font-medium font-inter">
              States Covered
            </span>
          </div>

        </div>
      </div>

      {/* ── SECTION 2: TESTIMONIALS ──────────────────────────────────────────── */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col items-center mt-12 md:mt-20">
        <h2 className="text-slate-900 font-dMSerifDisplay text-2xl sm:text-3xl lg:text-4xl text-center tracking-wider mb-8 sm:mb-12 uppercase">
          TESTIMONIALS
        </h2>

        {/* 3 Compact Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl border border-blue-200/80 p-5 sm:p-6 flex flex-col justify-between space-y-4 text-left shadow-xs hover:shadow-md transition-all ${
                item.highlight ? 'bg-[#F0F5FF]' : 'bg-white'
              }`}
            >
              <p className="text-slate-700 font-inter text-xs sm:text-sm leading-relaxed font-normal">
                "{item.quote}"
              </p>

              <div className="pt-3 border-t border-slate-200/80 flex items-center gap-3 mt-auto">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-white shadow-xs shrink-0"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-inter leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium font-inter mt-0.5">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

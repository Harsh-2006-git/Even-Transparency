export const getFitmentBand = (score) => {
  if (score === null || score === undefined || score === '') {
    return {
      band: 'Pending',
      likelihood: 'N/A',
      action: 'Complete candidate interview to evaluate fitment.',
      color: 'bg-slate-50 border-slate-200 text-slate-500',
      badgeColor: 'bg-slate-100 border-slate-200 text-slate-700',
      textColor: 'text-slate-500'
    };
  }

  const scoreVal = parseInt(score);
  if (isNaN(scoreVal)) {
    return {
      band: 'Pending',
      likelihood: 'N/A',
      action: 'Complete candidate interview to evaluate fitment.',
      color: 'bg-slate-50 border-slate-200 text-slate-500',
      badgeColor: 'bg-slate-100 border-slate-200 text-slate-700',
      textColor: 'text-slate-500'
    };
  }

  if (scoreVal >= 75) {
    return {
      band: 'High',
      likelihood: 'Strong — prioritise',
      action: 'Fast-track enrolment. Assign to next available batch.',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      badgeColor: 'bg-emerald-100 border-emerald-250 text-emerald-800',
      textColor: 'text-emerald-700'
    };
  }
  if (scoreVal >= 50) {
    return {
      band: 'Moderate',
      likelihood: 'Probable — nurture',
      action: 'Identify the 1–2 lowest-scoring domains and address those barriers in follow-up conversation.',
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      badgeColor: 'bg-amber-100 border-amber-250 text-amber-800',
      textColor: 'text-amber-700'
    };
  }
  if (scoreVal >= 30) {
    return {
      band: 'Low',
      likelihood: 'Uncertain — hold',
      action: 'Do not push for immediate enrolment. Log the record, revisit in 3–6 months after barriers potentially shift.',
      color: 'bg-rose-50 border-rose-200 text-rose-800',
      badgeColor: 'bg-rose-100 border-rose-250 text-rose-800',
      textColor: 'text-rose-700'
    };
  }
  return {
    band: 'Very Low',
    likelihood: 'Unlikely at this time',
    action: 'Redirect mobiliser effort. Record is retained for future model training.',
    color: 'bg-slate-100 border-slate-250 text-slate-700',
    badgeColor: 'bg-slate-200 border-slate-300 text-slate-700',
    textColor: 'text-slate-600'
  };
};

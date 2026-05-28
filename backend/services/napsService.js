const getNAPSClientConfig = () => {
  if (!process.env.NAPS_API_BASE_URL || !process.env.NAPS_API_KEY) {
    throw new Error('NAPS API credentials not configured. Complete NAPS portal onboarding first.');
  }

  return {
    baseUrl: process.env.NAPS_API_BASE_URL.replace(/\/$/, ''),
    headers: {
      Authorization: `Bearer ${process.env.NAPS_API_KEY}`,
      'Content-Type': 'application/json'
    }
  };
};

const requestNAPS = async (path, options = {}) => {
  const config = getNAPSClientConfig();
  const response = await fetch(`${config.baseUrl}${path}`, {
    ...options,
    headers: {
      ...config.headers,
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `NAPS request failed with status ${response.status}.`);
  }
  return data;
};

export const fileApprenticeshipContract = async (contractData) => {
  try {
    const payload = {
      establishment_id: contractData.employerNapsId || process.env.NAPS_ESTABLISHMENT_ID,
      apprentice: {
        name: contractData.candidateFullName,
        aadhaar: contractData.candidateAadhaar,
        dob: contractData.candidateDOB,
        gender: contractData.candidateGender,
        qualification: contractData.minimumQualification,
        mobile: contractData.candidateMobile
      },
      contract: {
        trade_code: contractData.napsTradeCode,
        apprenticeship_type: contractData.apprenticeshipType,
        start_date: contractData.startDate,
        end_date: contractData.expectedEndDate,
        stipend_amount: contractData.stipendAmount,
        working_hours: contractData.workingHoursPerDay
      }
    };

    const data = await requestNAPS('/contracts/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (data.contract_id) {
      return { success: true, napsContractId: data.contract_id, napsStatus: data.status };
    }
    return { success: false, error: 'NAPS registration did not return a contract ID.' };
  } catch (error) {
    console.error('NAPS fileApprenticeshipContract error:', error.message);
    return { success: false, error: error.message };
  }
};

export const checkContractStatus = async (napsContractId) => {
  try {
    const data = await requestNAPS(`/contracts/${napsContractId}/status`);
    return { success: true, status: data.status, remarks: data.remarks };
  } catch (error) {
    console.error('NAPS checkContractStatus error:', error.message);
    return { success: false, error: error.message };
  }
};

export const registerCandidate = async (candidateData) => {
  try {
    const payload = {
      name: candidateData.fullName,
      aadhaar: candidateData.aadhaar,
      dob: candidateData.dateOfBirth,
      gender: candidateData.gender,
      mobile: candidateData.mobileNumber,
      email: candidateData.email,
      qualification: candidateData.highestQualification
    };

    const data = await requestNAPS('/candidates/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (data.candidate_id) return { success: true, napsCandidateId: data.candidate_id };
    return { success: false, error: 'NAPS candidate registration failed.' };
  } catch (error) {
    console.error('NAPS registerCandidate error:', error.message);
    return { success: false, error: error.message };
  }
};

export const submitMonthlyAttendance = async (napsContractId, attendanceRecords) => {
  try {
    const payload = {
      contract_id: napsContractId,
      attendance: attendanceRecords.map((record) => ({
        date: record.attendanceDate || record.attendance_date,
        status: record.attendanceStatus === 'Present' || record.attendance_status === 'Present'
          ? 'P'
          : record.attendanceStatus === 'Half-Day' || record.attendance_status === 'Half-Day'
            ? 'H'
            : 'A'
      }))
    };

    const data = await requestNAPS('/attendance/submit', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return { success: true, referenceId: data.reference_id };
  } catch (error) {
    console.error('NAPS submitMonthlyAttendance error:', error.message);
    return { success: false, error: error.message };
  }
};

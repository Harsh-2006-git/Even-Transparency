const axios = require('axios');
const logger = require('../utils/logger');

/**
 * NAPS (National Apprenticeship Promotion Scheme) API integration.
 *
 * NOTE FOR DEVELOPER:
 * The NAPS portal API credentials, base URL, and sandbox environment
 * must be obtained by registering on https://www.apprenticeship.gov.in
 * as an authorised training partner. Claude cannot complete this onboarding —
 * it requires physical business registration and government approval.
 *
 * Once credentials are available, populate these env vars:
 *   NAPS_API_BASE_URL
 *   NAPS_API_KEY
 *   NAPS_ESTABLISHMENT_ID (Even Cargo's registered establishment ID)
 *
 * All functions below follow the expected NAPS API contract based on
 * publicly available documentation. Adjust field names to match the
 * actual sandbox responses once access is granted.
 */

const getNAPSClient = () => {
  if (!process.env.NAPS_API_BASE_URL || !process.env.NAPS_API_KEY) {
    throw new Error('NAPS API credentials not configured. Developer must complete NAPS portal onboarding first.');
  }

  return axios.create({
    baseURL: process.env.NAPS_API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${process.env.NAPS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });
};

/**
 * Register a candidate as an apprentice on the NAPS portal
 * @param {Object} contractData - contract + candidate + employer data
 * @returns {{ success: boolean, napsContractId?: string, error?: string }}
 */
const fileApprenticeshipContract = async (contractData) => {
  try {
    const client = getNAPSClient();

    const payload = {
      establishment_id: contractData.employerNapsId || process.env.NAPS_ESTABLISHMENT_ID,
      apprentice: {
        name: contractData.candidateFullName,
        aadhaar: contractData.candidateAadhaar, // decrypted, passed in by caller
        dob: contractData.candidateDOB,
        gender: contractData.candidateGender,
        qualification: contractData.minimumQualification,
        mobile: contractData.candidateMobile,
      },
      contract: {
        trade_code: contractData.napsTradeCode,
        apprenticeship_type: contractData.apprenticeshipType,
        start_date: contractData.startDate,
        end_date: contractData.expectedEndDate,
        stipend_amount: contractData.stipendAmount,
        working_hours: contractData.workingHoursPerDay,
      },
    };

    const response = await client.post('/contracts/register', payload);

    if (response.data && response.data.contract_id) {
      logger.info(`NAPS contract filed: ${response.data.contract_id}`);
      return {
        success: true,
        napsContractId: response.data.contract_id,
        napsStatus: response.data.status,
      };
    }

    return { success: false, error: 'NAPS registration did not return a contract ID.' };

  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    logger.error(`NAPS fileApprenticeshipContract error: ${msg}`);
    return { success: false, error: msg };
  }
};

/**
 * Check the current status of a filed NAPS contract
 * @param {string} napsContractId
 */
const checkContractStatus = async (napsContractId) => {
  try {
    const client = getNAPSClient();
    const response = await client.get(`/contracts/${napsContractId}/status`);

    return {
      success: true,
      status: response.data.status,
      remarks: response.data.remarks,
    };
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    logger.error(`NAPS checkContractStatus error: ${msg}`);
    return { success: false, error: msg };
  }
};

/**
 * Register candidate on NAPS portal to get a NAPS Candidate ID
 * (required before contract filing)
 * @param {Object} candidateData
 */
const registerCandidate = async (candidateData) => {
  try {
    const client = getNAPSClient();

    const payload = {
      name: candidateData.fullName,
      aadhaar: candidateData.aadhaar,
      dob: candidateData.dateOfBirth,
      gender: candidateData.gender,
      mobile: candidateData.mobileNumber,
      email: candidateData.email,
      qualification: candidateData.highestQualification,
    };

    const response = await client.post('/candidates/register', payload);

    if (response.data && response.data.candidate_id) {
      return { success: true, napsCandidateId: response.data.candidate_id };
    }

    return { success: false, error: 'NAPS candidate registration failed.' };

  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    logger.error(`NAPS registerCandidate error: ${msg}`);
    return { success: false, error: msg };
  }
};

/**
 * Submit monthly attendance to NAPS
 * Required for NAPS compliance and stipend reimbursement claims
 * @param {string} napsContractId
 * @param {Array} attendanceRecords
 */
const submitMonthlyAttendance = async (napsContractId, attendanceRecords) => {
  try {
    const client = getNAPSClient();

    const payload = {
      contract_id: napsContractId,
      attendance: attendanceRecords.map((r) => ({
        date: r.attendanceDate,
        status: r.attendanceStatus === 'Present' ? 'P' : r.attendanceStatus === 'Half-Day' ? 'H' : 'A',
      })),
    };

    const response = await client.post('/attendance/submit', payload);
    return { success: true, referenceId: response.data.reference_id };

  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    logger.error(`NAPS submitMonthlyAttendance error: ${msg}`);
    return { success: false, error: msg };
  }
};

module.exports = {
  fileApprenticeshipContract,
  checkContractStatus,
  registerCandidate,
  submitMonthlyAttendance,
};

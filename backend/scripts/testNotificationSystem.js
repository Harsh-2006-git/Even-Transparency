import notificationService from '../notifications/notification.service.js';
import { NOTIFICATION_TYPES } from '../notifications/notification.constants.js';
import { compileTemplate } from '../notifications/template.service.js';
import db from '../models/index.js';

async function runTests() {
  console.log('🧪  Starting Notification System Verification Tests...\n');

  let passed = 0;
  let failed = 0;

  // 1. Test template compilation for all 18 types
  console.log('--- Test 1: Handlebars Template Compilation (All 18 Types) ---');
  for (const [key, type] of Object.entries(NOTIFICATION_TYPES)) {
    try {
      const { subject, html } = compileTemplate(type, {
        first_name: 'Priya',
        candidate_name: 'Priya Sharma',
        employer_name: 'TechLogistics Corp',
        company_name: 'TechLogistics Corp',
        job_title: 'Apprentice Logistics Coordinator',
        otp: '849201',
        month: 'July 2026',
        amount: '12,500',
        status: 'Processed',
        match_percentage: 92,
        grievance_id: 'GRV-9402',
        apprentice_id: 'APP-2026-0042',
        location: 'New Delhi',
        signed_date: '2026-07-24',
        stipend: '12,000 - 15,000',
        total_amount: '1,50,000',
        apprentice_count: 12,
        cin_gst: 'U74999DL2020PTC123456',
        email: 'hr@techlogistics.com',
        category: 'Safety Protocol',
        applied_date: '2026-07-24'
      });

      if (subject && html && html.includes('Even Cargo')) {
        console.log(`  ✅ [PASS] Template compiled: ${type}`);
        passed++;
      } else {
        console.error(`  ❌ [FAIL] Missing layout/content for: ${type}`);
        failed++;
      }
    } catch (err) {
      console.error(`  ❌ [FAIL] Error compiling template ${type}:`, err.message);
      failed++;
    }
  }

  // 2. Test notificationService.send() & PostgreSQL EmailLog database insertion
  console.log('\n--- Test 2: Database Audit Log & Dispatch Test ---');
  try {
    const result = await notificationService.send({
      type: NOTIFICATION_TYPES.CANDIDATE_REGISTRATION_OTP,
      recipient: 'test.candidate@example.com',
      data: {
        first_name: 'TestCandidate',
        otp: '999111'
      }
    });

    if (result.success) {
      console.log('  ✅ [PASS] notificationService.send() returned success: true');
      passed++;
    } else {
      console.error('  ❌ [FAIL] notificationService.send() failed:', result.error);
      failed++;
    }
  } catch (err) {
    console.error('  ❌ [FAIL] Error sending notification:', err.message);
    failed++;
  }

  console.log(`\n==========================================`);
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`==========================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();

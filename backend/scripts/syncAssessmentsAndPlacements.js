import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

async function syncAssessmentsAndPlacements() {
  try {
    console.log('🔄 Syncing candidate assessments and placements in PostgreSQL...');

    const candidates = await db.Candidate.findAll();
    const batch = await db.TrainingBatch.findOne();
    const employer = await db.Employer.findOne();

    if (!batch) {
      console.log('No batch found to sync assessments.');
      process.exit(0);
    }

    for (const cand of candidates) {
      const candScore = cand.readiness_score || 85;
      const isSep = new Date(cand.createdAt || cand.created_at).getMonth() === 8; // Month 8 is Sep (0-indexed)
      const assDate = isSep ? '2026-09-29' : '2026-10-01';

      // 1. Update BatchEnrollment
      if (db.BatchEnrollment) {
        const enr = await db.BatchEnrollment.findOne({
          where: { candidate_id: cand.id, batch_id: batch.id }
        });
        if (enr) {
          await enr.update({
            assessment_score: candScore,
            overall_score: candScore,
            is_passed: true,
            status: cand.candidate_code === 'ET-2026-1475' ? 'COMPLETED' : 'IN_PROGRESS',
            completed_at: isSep ? new Date('2026-09-29T12:00:00Z') : new Date('2026-10-01T12:00:00Z')
          });
          console.log(`✅ Updated BatchEnrollment for ${cand.full_name}: score ${candScore}`);
        }
      }

      // 2. Ensure TrainingAssessment record exists
      if (db.TrainingAssessment) {
        const existingAss = await db.TrainingAssessment.findOne({
          where: { candidate_id: cand.id, batch_id: batch.id }
        });
        if (!existingAss) {
          await db.TrainingAssessment.create({
            id: uuidv4(),
            candidate_id: cand.id,
            batch_id: batch.id,
            module_id: batch.module_id,
            assessment_name: 'EV Driving & Road Safety Final Assessment',
            assessment_type: 'PRACTICAL_DRIVING',
            max_score: 100,
            score: candScore,
            score_obtained: candScore,
            passing_score: 70,
            result: 'pass',
            is_passed: true,
            attempt_number: 1,
            assessment_date: assDate,
            assessed_by: batch.primary_trainer_id,
            evaluated_by_trainer_id: batch.primary_trainer_id,
            comments: 'Passed practical 2W EV riding test and battery swap safety evaluation with distinction.'
          });
          console.log(`✅ Created TrainingAssessment for ${cand.full_name}: date ${assDate}, score ${candScore}`);
        }
      }

      // 3. CandidateDeployment for Ananya Kumari Verma
      if (cand.candidate_code === 'ET-2026-1475' && employer && db.CandidateDeployment) {
        const existingDep = await db.CandidateDeployment.findOne({
          where: { candidate_id: cand.id }
        });
        if (!existingDep) {
          await db.CandidateDeployment.create({
            id: uuidv4(),
            candidate_id: cand.id,
            employer_id: employer.id,
            job_role_title: 'EV Delivery Pilot & Fleet Captain',
            work_location_city: cand.city || 'Bengaluru',
            work_hub_address: 'Even Cargo Koramangala EV Hub',
            offer_date: '2026-10-05',
            joining_date: '2026-10-10',
            employment_type: 'FULL_TIME',
            shift_assigned: 'DAY',
            monthly_earnings: 21500,
            monthly_stipend_or_salary: 21500,
            vehicle_provided_by_employer: true,
            is_green_job: true,
            deployment_status: 'ACTIVE_EMPLOYED'
          });
          await cand.update({
            current_stage: 'DEPLOYED',
            deployment_status: 'DEPLOYED',
            readiness_status: 'DEPLOYMENT_READY'
          });
          console.log(`✅ Created CandidateDeployment for ${cand.full_name} at ${employer.company_name || employer.employer_name}`);
        }
      }
    }

    console.log('🎉 Successfully synced assessments and placements!');
  } catch (err) {
    console.error('❌ Error syncing:', err);
  } finally {
    process.exit(0);
  }
}

syncAssessmentsAndPlacements();

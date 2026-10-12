import db from './models/index.js';
import { v4 as uuidv4 } from 'uuid';

async function seedRealBatches() {
  try {
    const org = await db.Organization.findOne();
    const orgId = org ? org.id : null;

    const [blrCenter, lkoCenter, punCenter] = await Promise.all([
      db.TrainingCenter.findOne({ where: { city: 'Bengaluru' } }),
      db.TrainingCenter.findOne({ where: { city: 'Lucknow' } }),
      db.TrainingCenter.findOne({ where: { city: 'Pune' } })
    ]);

    const [modEV, modSaf, modApp, modSft] = await Promise.all([
      db.TrainingModule.findOne({ where: { code: 'MOD-EV-01' } }),
      db.TrainingModule.findOne({ where: { code: 'MOD-SAF-02' } }),
      db.TrainingModule.findOne({ where: { code: 'MOD-APP-03' } }),
      db.TrainingModule.findOne({ where: { code: 'MOD-SFT-04' } })
    ]);

    const trainers = await db.User.findAll({ where: { role: 'trainer' } });
    const trainer1 = trainers[0]; // Harsh Manmode
    const trainer2 = trainers[1]; // Meena Yadav

    const [candPriya, candAisha, candRani, candPooja, candKavita] = await Promise.all([
      db.Candidate.findOne({ where: { candidate_code: 'ET-2026-001' } }),
      db.Candidate.findOne({ where: { candidate_code: 'ET-2026-002' } }),
      db.Candidate.findOne({ where: { candidate_code: 'ET-2026-003' } }),
      db.Candidate.findOne({ where: { candidate_code: 'ET-2026-004' } }),
      db.Candidate.findOne({ where: { candidate_code: 'ET-2026-005' } })
    ]);

    // Check if batches already exist
    const existingCount = await db.TrainingBatch.count();
    console.log(`Existing batches in DB: ${existingCount}`);

    if (existingCount === 0) {
      console.log('Seeding initial 3 real batches...');
      // Batch 1: BLR
      const b1Id = uuidv4();
      const b1 = await db.TrainingBatch.create({
        id: b1Id,
        batch_code: 'BAT-2026-BLR-01',
        title: 'EV Pilot Induction Batch - Feb 2026',
        module_id: modEV?.id,
        training_center_id: blrCenter?.id,
        primary_trainer_id: trainer1?.id,
        organization_id: orgId,
        start_date: '2026-02-15',
        end_date: '2026-03-05',
        daily_start_time: '09:00',
        daily_end_time: '13:00',
        capacity: 25,
        status: 'ONGOING',
        average_attendance_percentage: 94.2,
        completion_rate_percentage: 65.0,
        remarks: 'Candidate safety gear kits distributed on Day 1. Battery swap practical test scheduled on final week.'
      });

      // Enroll Priya, Aisha, Rani
      const b1Cands = [
        { cand: candPriya, att: 96, prog: 70, score: 88 },
        { cand: candAisha, att: 94, prog: 65, score: 85 },
        { cand: candRani, att: 92, prog: 60, score: 78 }
      ];
      for (const item of b1Cands) {
        if (item.cand) {
          await db.BatchEnrollment.create({
            id: uuidv4(),
            batch_id: b1Id,
            candidate_id: item.cand.id,
            module_id: modEV?.id,
            status: 'IN_PROGRESS',
            enrollment_date: '2026-02-15',
            attendance_percentage: item.att,
            progress_percentage: item.prog,
            assessment_score: item.score
          });
          await item.cand.update({ current_stage: 'IN_TRAINING', training_center_id: blrCenter?.id });
        }
      }

      // Batch 2: LKO
      const b2Id = uuidv4();
      const b2 = await db.TrainingBatch.create({
        id: b2Id,
        batch_code: 'BAT-2026-LKO-02',
        title: 'Lucknow Mahila EV Riders - Intensive Batch',
        module_id: modSaf?.id,
        training_center_id: lkoCenter?.id,
        primary_trainer_id: trainer2?.id,
        organization_id: orgId,
        start_date: '2026-02-20',
        end_date: '2026-03-10',
        daily_start_time: '10:00',
        daily_end_time: '14:00',
        capacity: 20,
        status: 'ONGOING',
        average_attendance_percentage: 88.0,
        completion_rate_percentage: 22.5,
        remarks: 'Focused training cohort for women commercial EV delivery partners with traffic navigation.'
      });

      // Enroll Pooja, Kavita
      const b2Cands = [
        { cand: candPooja, att: 90, prog: 25, score: 82 },
        { cand: candKavita, att: 88, prog: 20, score: 76 }
      ];
      for (const item of b2Cands) {
        if (item.cand) {
          await db.BatchEnrollment.create({
            id: uuidv4(),
            batch_id: b2Id,
            candidate_id: item.cand.id,
            module_id: modSaf?.id,
            status: 'IN_PROGRESS',
            enrollment_date: '2026-02-20',
            attendance_percentage: item.att,
            progress_percentage: item.prog,
            assessment_score: item.score
          });
          await item.cand.update({ current_stage: 'IN_TRAINING', training_center_id: lkoCenter?.id });
        }
      }

      // Batch 3: PUN
      const b3Id = uuidv4();
      await db.TrainingBatch.create({
        id: b3Id,
        batch_code: 'BAT-2026-PUN-03',
        title: 'Pune Urban Navigation & Customer Readiness',
        module_id: modApp?.id,
        training_center_id: punCenter?.id,
        primary_trainer_id: null,
        organization_id: orgId,
        start_date: '2026-03-10',
        end_date: '2026-03-24',
        daily_start_time: '09:30',
        daily_end_time: '13:30',
        capacity: 25,
        status: 'UPCOMING',
        average_attendance_percentage: 0,
        completion_rate_percentage: 0,
        remarks: 'Cohort launching on March 10. Mobilizers currently shortlisting candidate applications.'
      });

      console.log('Successfully seeded 3 real batches in PostgreSQL!');
    }

    const totalNow = await db.TrainingBatch.count();
    const enrollNow = await db.BatchEnrollment.count();
    console.log(`Total Batches in DB now: ${totalNow}, Total Enrollments: ${enrollNow}`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding batches:', err);
    process.exit(1);
  }
}

seedRealBatches();

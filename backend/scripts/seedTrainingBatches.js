import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

export const seedTrainingBatchesAndRealData = async () => {
  try {
    console.log('🌱 Starting comprehensive Training Hub database sync & seed...');

    // 1. Ensure Organization
    let org = await db.Organization.findOne();
    if (!org) {
      org = await db.Organization.create({
        id: uuidv4(),
        name: 'Even Mobility Foundation',
        organization_name: 'Even Mobility Foundation',
        code: 'EMF-ORG-01',
        type: 'NGO',
        status: 'active',
        city: 'Bengaluru',
        state: 'Karnataka'
      });
    }

    // 2. Training Centers
    const centersConfig = [
      {
        name: 'Bengaluru EV Excellence Centre',
        code: 'TC-KA-01',
        city: 'Bengaluru',
        state: 'Karnataka',
        address: 'Plot 42, Electronic City Phase 1, Bengaluru - 560100',
        capacity: 120,
        contact_person: 'Radhika Swamy',
        phone: '+91 80 4123 9999',
        email: 'blr-hub@eventransparency.org',
        status: 'active',
        organization_id: org.id
      },
      {
        name: 'Lucknow Prime Skill Hub',
        code: 'TC-UP-01',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        address: 'Sector 8, Gomti Nagar Extension, Lucknow - 226010',
        capacity: 100,
        contact_person: 'Vikram Chandel',
        phone: '+91 522 234 5678',
        email: 'lko-hub@eventransparency.org',
        status: 'active',
        organization_id: org.id
      },
      {
        name: 'Pune Livelihood Campus',
        code: 'TC-MH-02',
        city: 'Pune',
        state: 'Maharashtra',
        address: 'Survey 14, Kharadi Bypass, Pune - 411026',
        capacity: 90,
        contact_person: 'Deepak Joshi',
        phone: '+91 20 6789 0123',
        email: 'pun-hub@eventransparency.org',
        status: 'active',
        organization_id: org.id
      }
    ];

    const centerMap = {};
    for (const cData of centersConfig) {
      let center = await db.TrainingCenter.findOne({
        where: { city: cData.city }
      });
      if (!center) {
        center = await db.TrainingCenter.create({
          id: uuidv4(),
          ...cData
        });
        console.log(`✅ Created Training Center: ${center.name}`);
      } else {
        await center.update({
          name: cData.name,
          code: cData.code,
          address: cData.address,
          capacity: cData.capacity,
          contact_person: cData.contact_person
        });
      }
      centerMap[cData.city] = center;
    }

    // 3. Modules Map
    const modules = await db.TrainingModule.findAll();
    const moduleMap = {};
    modules.forEach(m => {
      moduleMap[m.code] = m;
    });

    // 4. Trainers (Users + Trainer Profiles)
    const trainersConfig = [
      {
        employee_id: 'TR-BLR-01',
        first_name: 'Rahul',
        last_name: 'Sharma',
        full_name: 'Rahul Sharma',
        email: 'rahul.sharma@eventransparency.org',
        mobile_number: '+91 98765 33001',
        role: 'trainer',
        city: 'Bengaluru',
        specialization: '2W EV Riding & Technical Dynamics',
        centerCity: 'Bengaluru'
      },
      {
        employee_id: 'TR-LKO-02',
        first_name: 'Meena',
        last_name: 'Yadav',
        full_name: 'Meena Yadav',
        email: 'meena.yadav@eventransparency.org',
        mobile_number: '+91 98765 33002',
        role: 'trainer',
        city: 'Lucknow',
        specialization: 'Defensive Riding & Road Safety Protocols',
        centerCity: 'Lucknow'
      },
      {
        employee_id: 'TR-PUN-03',
        first_name: 'Kiran',
        last_name: 'Dave',
        full_name: 'Kiran Dave',
        email: 'kiran.dave@eventransparency.org',
        mobile_number: '+91 98765 33003',
        role: 'trainer',
        city: 'Pune',
        specialization: 'Digital App Navigation & Customer Interaction',
        centerCity: 'Pune'
      }
    ];

    const trainerMap = {};
    for (const tData of trainersConfig) {
      let user = await db.User.findOne({ where: { email: tData.email } });
      const center = centerMap[tData.centerCity];
      if (!user) {
        user = await db.User.create({
          id: uuidv4(),
          employee_id: tData.employee_id,
          first_name: tData.first_name,
          last_name: tData.last_name,
          full_name: tData.full_name,
          email: tData.email,
          password_hash: '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890',
          mobile_number: tData.mobile_number,
          role: 'trainer',
          organization_id: org.id,
          training_center_id: center?.id,
          designation: 'Master EV Trainer',
          department: 'Technical Instruction',
          status: 'active'
        });
        console.log(`✅ Created Trainer User: ${user.full_name}`);
      } else {
        await user.update({
          full_name: tData.full_name,
          role: 'trainer',
          training_center_id: center?.id
        });
      }

      let trainerProfile = await db.Trainer.findOne({ where: { user_id: user.id } });
      if (!trainerProfile) {
        trainerProfile = await db.Trainer.create({
          id: uuidv4(),
          user_id: user.id,
          organization_id: org.id,
          specialization: tData.specialization,
          training_centre_id: center?.id,
          training_center_id: center?.id,
          status: 'active'
        });
      } else {
        await trainerProfile.update({
          specialization: tData.specialization,
          training_center_id: center?.id
        });
      }
      trainerMap[tData.centerCity] = {
        user,
        profile: trainerProfile
      };
    }

    // 5. Candidates
    const candidatesConfig = [
      {
        candidate_code: 'ET-2026-001',
        first_name: 'Priya',
        last_name: 'Sharma',
        full_name: 'Priya Sharma',
        mobile_number: '+91 98765 11111',
        city: 'Bengaluru',
        state: 'Karnataka',
        nf_category: 'NF1',
        current_stage: 'IN_TRAINING',
        readiness_score: 88,
        overall_attendance_rate: 96,
        training_progress_percentage: 70
      },
      {
        candidate_code: 'ET-2026-002',
        first_name: 'Aisha',
        last_name: 'Khan',
        full_name: 'Aisha Khan',
        mobile_number: '+91 98765 22222',
        city: 'Bengaluru',
        state: 'Karnataka',
        nf_category: 'NF2',
        current_stage: 'IN_TRAINING',
        readiness_score: 91,
        overall_attendance_rate: 92,
        training_progress_percentage: 65
      },
      {
        candidate_code: 'ET-2026-003',
        first_name: 'Rani',
        last_name: 'Kumari',
        full_name: 'Rani Kumari',
        mobile_number: '+91 98765 33333',
        city: 'Bengaluru',
        state: 'Karnataka',
        nf_category: 'NF1',
        current_stage: 'IN_TRAINING',
        readiness_score: 74,
        overall_attendance_rate: 84,
        training_progress_percentage: 60
      },
      {
        candidate_code: 'ET-2026-004',
        first_name: 'Pooja',
        last_name: 'Hegde',
        full_name: 'Pooja Hegde',
        mobile_number: '+91 98765 44444',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        nf_category: 'NF2',
        current_stage: 'IN_TRAINING',
        readiness_score: 82,
        overall_attendance_rate: 90,
        training_progress_percentage: 25
      },
      {
        candidate_code: 'ET-2026-005',
        first_name: 'Kavita',
        last_name: 'Yadav',
        full_name: 'Kavita Yadav',
        mobile_number: '+91 98765 55555',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        nf_category: 'NF3',
        current_stage: 'IN_TRAINING',
        readiness_score: 76,
        overall_attendance_rate: 88,
        training_progress_percentage: 20
      },
      {
        candidate_code: 'ET-2026-006',
        first_name: 'Sunita',
        last_name: 'Devi',
        full_name: 'Sunita Devi',
        mobile_number: '+91 98765 66666',
        city: 'Bengaluru',
        state: 'Karnataka',
        nf_category: 'NF1',
        current_stage: 'READINESS_ASSESSMENT',
        readiness_score: 85,
        overall_attendance_rate: 0,
        training_progress_percentage: 0
      },
      {
        candidate_code: 'ET-2026-007',
        first_name: 'Meenakshi',
        last_name: 'Sundaram',
        full_name: 'Meenakshi Sundaram',
        mobile_number: '+91 98765 77777',
        city: 'Bengaluru',
        state: 'Karnataka',
        nf_category: 'NF2',
        current_stage: 'READINESS_ASSESSMENT',
        readiness_score: 79,
        overall_attendance_rate: 0,
        training_progress_percentage: 0
      },
      {
        candidate_code: 'ET-2026-008',
        first_name: 'Fatima',
        last_name: 'Bi',
        full_name: 'Fatima Bi',
        mobile_number: '+91 98765 88888',
        city: 'Pune',
        state: 'Maharashtra',
        nf_category: 'NF1',
        current_stage: 'READINESS_ASSESSMENT',
        readiness_score: 90,
        overall_attendance_rate: 0,
        training_progress_percentage: 0
      },
      {
        candidate_code: 'ET-2026-009',
        first_name: 'Rashmi',
        last_name: 'Deshmukh',
        full_name: 'Rashmi Deshmukh',
        mobile_number: '+91 98765 99999',
        city: 'Pune',
        state: 'Maharashtra',
        nf_category: 'NF3',
        current_stage: 'READINESS_ASSESSMENT',
        readiness_score: 72,
        overall_attendance_rate: 0,
        training_progress_percentage: 0
      }
    ];

    const candidateMap = {};
    for (const c of candidatesConfig) {
      let cand = await db.Candidate.findOne({ where: { candidate_code: c.candidate_code } });
      if (!cand) {
        cand = await db.Candidate.create({
          id: uuidv4(),
          candidate_code: c.candidate_code,
          first_name: c.first_name,
          last_name: c.last_name,
          full_name: c.full_name,
          mobile_number: c.mobile_number,
          city: c.city,
          state: c.state,
          nf_category: c.nf_category,
          current_stage: c.current_stage,
          readiness_score: c.readiness_score,
          overall_attendance_rate: c.overall_attendance_rate,
          training_progress_percentage: c.training_progress_percentage,
          organization_id: org.id,
          status: 'active'
        });
        console.log(`✅ Created Candidate: ${cand.full_name} (${cand.candidate_code})`);
      }
      candidateMap[c.candidate_code] = cand;
    }

    // 6. Ensure the 3 Batches in portal_training_batches with accurate foreign keys
    const batchesData = [
      {
        batch_code: 'BAT-2026-BLR-01',
        title: 'EV Pilot Induction Batch - Feb 2026',
        module_id: moduleMap['MOD-EV-01']?.id,
        training_center_id: centerMap['Bengaluru']?.id,
        primary_trainer_id: trainerMap['Bengaluru']?.user?.id,
        trainer_id: trainerMap['Bengaluru']?.profile?.id,
        organization_id: org.id,
        start_date: '2026-02-15',
        end_date: '2026-03-05',
        daily_start_time: '09:00',
        daily_end_time: '13:00',
        capacity: 25,
        status: 'ONGOING',
        average_attendance_percentage: 94.2,
        completion_rate_percentage: 65.0,
        remarks: 'High enthusiasm batch with 100% attendance during initial safety drills. Battery swap practical test scheduled on final week.',
        candidates: ['ET-2026-001', 'ET-2026-002', 'ET-2026-003']
      },
      {
        batch_code: 'BAT-2026-LKO-02',
        title: 'Lucknow Mahila EV Riders - Intensive Batch',
        module_id: moduleMap['MOD-SAF-02']?.id,
        training_center_id: centerMap['Lucknow']?.id,
        primary_trainer_id: trainerMap['Lucknow']?.user?.id,
        trainer_id: trainerMap['Lucknow']?.profile?.id,
        organization_id: org.id,
        start_date: '2026-03-01',
        end_date: '2026-03-18',
        daily_start_time: '10:00',
        daily_end_time: '14:00',
        capacity: 20,
        status: 'ONGOING',
        average_attendance_percentage: 89.5,
        completion_rate_percentage: 25.0,
        remarks: 'Focus on defensive driving in high traffic zones and wet weather braking.',
        candidates: ['ET-2026-004', 'ET-2026-005']
      },
      {
        batch_code: 'BAT-2026-PUN-03',
        title: 'Pune Urban Navigation & Customer Readiness',
        module_id: moduleMap['MOD-APP-03']?.id,
        training_center_id: centerMap['Pune']?.id,
        primary_trainer_id: trainerMap['Pune']?.user?.id,
        trainer_id: trainerMap['Pune']?.profile?.id,
        organization_id: org.id,
        start_date: '2026-03-10',
        end_date: '2026-03-24',
        daily_start_time: '09:30',
        daily_end_time: '13:30',
        capacity: 25,
        status: 'UPCOMING',
        average_attendance_percentage: 0,
        completion_rate_percentage: 0,
        remarks: 'Scheduled to start in mid-March. Mobilizers currently conducting orientation camps.',
        candidates: []
      }
    ];

    for (const b of batchesData) {
      let batch = await db.TrainingBatch.findOne({ where: { batch_code: b.batch_code } });
      if (!batch) {
        batch = await db.TrainingBatch.create({
          id: uuidv4(),
          batch_code: b.batch_code,
          title: b.title,
          module_id: b.module_id,
          training_center_id: b.training_center_id,
          primary_trainer_id: b.primary_trainer_id,
          trainer_id: b.trainer_id,
          organization_id: b.organization_id,
          start_date: b.start_date,
          end_date: b.end_date,
          daily_start_time: b.daily_start_time,
          daily_end_time: b.daily_end_time,
          capacity: b.capacity,
          status: b.status,
          average_attendance_percentage: b.average_attendance_percentage,
          completion_rate_percentage: b.completion_rate_percentage,
          remarks: b.remarks
        });
        console.log(`✅ Created Training Batch: ${batch.batch_code}`);
      } else {
        await batch.update({
          title: b.title,
          module_id: b.module_id,
          training_center_id: b.training_center_id,
          primary_trainer_id: b.primary_trainer_id,
          trainer_id: b.trainer_id,
          organization_id: b.organization_id,
          start_date: b.start_date,
          end_date: b.end_date,
          daily_start_time: b.daily_start_time,
          daily_end_time: b.daily_end_time,
          capacity: b.capacity,
          status: b.status,
          average_attendance_percentage: b.average_attendance_percentage,
          completion_rate_percentage: b.completion_rate_percentage,
          remarks: b.remarks
        });
      }

      // 7. Seed Batch Enrollments for candidates
      for (const candCode of b.candidates) {
        const cand = candidateMap[candCode];
        if (cand) {
          const existingEnrollment = await db.BatchEnrollment.findOne({
            where: {
              batch_id: batch.id,
              candidate_id: cand.id
            }
          });

          if (!existingEnrollment) {
            await db.BatchEnrollment.create({
              id: uuidv4(),
              batch_id: batch.id,
              candidate_id: cand.id,
              module_id: b.module_id,
              status: 'IN_PROGRESS',
              enrollment_date: b.start_date,
              attendance_percentage: cand.overall_attendance_rate || 90,
              progress_percentage: cand.training_progress_percentage || 50,
              assessment_score: cand.readiness_score || 85,
              overall_score: cand.readiness_score || 85,
              is_passed: false,
              certification_status: 'pending'
            });
            console.log(`✅ Enrolled ${cand.full_name} in ${batch.batch_code}`);
          }
        }
      }
    }

    console.log('🎉 Training Hub DB sync & seed completed successfully!');
  } catch (err) {
    console.error('❌ Error during training hub seed:', err);
  }
};

// If run directly via node
if (process.argv[1] && process.argv[1].endsWith('seedTrainingBatches.js')) {
  seedTrainingBatchesAndRealData().then(() => process.exit(0));
}

import db from '../models/index.js';

async function main() {
  try {
    const users = await db.EmployerUser.findAll({
      include: [db.Employer]
    });
    console.log('--- EMPLOYER USERS ---');
    for (const u of users) {
      console.log({
        id: u.id,
        full_name: u.full_name,
        email: u.email,
        mobile_number: u.mobile_number,
        account_status: u.account_status,
        employer: u.Employer ? {
          id: u.Employer.id,
          company_name: u.Employer.company_name,
          onboarding_status: u.Employer.onboarding_status,
          verification_status: u.Employer.verification_status
        } : null
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

main();

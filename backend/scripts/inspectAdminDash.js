import dotenv from 'dotenv'; dotenv.config();
import sequelize from '../config/db.js';
import { QueryTypes } from 'sequelize';

await sequelize.authenticate();

// Check audit logs
const auditCols = await sequelize.query(
  "SELECT column_name FROM information_schema.columns WHERE table_name='adminauditlogs' ORDER BY ordinal_position",
  { type: QueryTypes.SELECT }
);
console.log('AUDIT LOG COLUMNS:', auditCols.map(c => c.column_name).join(', '));

const auditRows = await sequelize.query(
  'SELECT * FROM adminauditlogs ORDER BY created_at DESC LIMIT 5',
  { type: QueryTypes.SELECT }
);
console.log('AUDIT LOGS:', JSON.stringify(auditRows, null, 2));

// Check employer data with contracts/openings
const empRows = await sequelize.query(`
  SELECT e.id, e.company_name,
    (SELECT COUNT(*) FROM employerapprenticeshipcontracts c WHERE c.employer_id = e.id AND c.contract_status IN ('active','signed')) as apprentice_count,
    (SELECT COUNT(*) FROM employerjobpostings j WHERE j.employer_id = e.id AND j.status IN ('Open','open','Active','active')) as opening_count,
    (SELECT COUNT(*) FROM employerapprenticeshipcontracts c WHERE c.employer_id = e.id) as contract_count,
    (SELECT COALESCE(SUM(s.net_amount),0) FROM employerstipendpayments s WHERE s.employer_id = e.id AND s.payment_status IN ('paid','Paid')) as stipend_total
  FROM employers e ORDER BY apprentice_count DESC LIMIT 5
`, { type: QueryTypes.SELECT });
console.log('TOP EMPLOYERS:', JSON.stringify(empRows, null, 2));

// Popular trades
const tradeRows = await sequelize.query(`
  SELECT trade_name, COUNT(*) as cnt,
    (SELECT COUNT(*) FROM employerjobpostings j WHERE j.trade_name = c.trade_name AND j.status IN ('Open','open')) as openings
  FROM employerapprenticeshipcontracts c
  WHERE trade_name IS NOT NULL
  GROUP BY trade_name ORDER BY cnt DESC LIMIT 5
`, { type: QueryTypes.SELECT });
console.log('POPULAR TRADES:', JSON.stringify(tradeRows, null, 2));

// Monthly stipend trend
const stipendTrend = await sequelize.query(`
  SELECT EXTRACT(MONTH FROM payment_date)::int as month, COALESCE(SUM(net_amount),0) as total
  FROM employerstipendpayments
  WHERE EXTRACT(YEAR FROM payment_date) = EXTRACT(YEAR FROM NOW())
  GROUP BY month ORDER BY month
`, { type: QueryTypes.SELECT });
console.log('STIPEND TREND:', JSON.stringify(stipendTrend, null, 2));

// Application funnel
const funnel = await sequelize.query(`
  SELECT application_status, COUNT(*)::int as cnt FROM candidateapplications GROUP BY application_status
`, { type: QueryTypes.SELECT });
console.log('FUNNEL:', JSON.stringify(funnel, null, 2));

await sequelize.close();

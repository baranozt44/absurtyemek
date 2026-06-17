require('dotenv').config();
const { Client } = require('pg');

const email = process.argv[2];

if (!email) {
  console.error('Usage: npm run set-admin -- user@example.com');
  process.exit(1);
}

(async () => {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const result = await client.query(
    `
      update auth.users
      set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
      where lower(email) = lower($1)
      returning id, email, raw_app_meta_data
    `,
    [email],
  );

  await client.end();

  if (result.rowCount === 0) {
    console.error(`No Supabase Auth user found for ${email}. Sign up first, then run this again.`);
    process.exit(1);
  }

  const user = result.rows[0];
  console.log(`Admin role set for ${user.email} (${user.id}).`);
})();

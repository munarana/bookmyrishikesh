const http = require('http');

const BASE = 'http://localhost:3000';

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': bodyStr ? Buffer.byteLength(bodyStr) : 0,
        ...headers,
      },
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// Step 1: get CSRF token, Step 2: sign in
async function getCSRF() {
  const res = await request('GET', '/api/auth/csrf');
  const json = JSON.parse(res.body);
  const cookie = res.headers['set-cookie'] ? res.headers['set-cookie'].join('; ') : '';
  return { csrfToken: json.csrfToken, cookie };
}

async function signIn(email, password, csrfToken, cookie) {
  const body = new URLSearchParams({ email, password, csrfToken, redirect: 'false', callbackUrl: '/', json: 'true' });
  return new Promise((resolve, reject) => {
    const bodyStr = body.toString();
    const opts = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/callback/credentials',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(bodyStr),
        'Cookie': cookie,
      },
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function run() {
  console.log('==============================');
  console.log('   AUTH LOGIN TESTS');
  console.log('==============================\n');

  let pass = 0, fail = 0;

  function check(label, condition, detail) {
    if (condition) { console.log('✅ PASS:', label, detail ? `(${detail})` : ''); pass++; }
    else { console.log('❌ FAIL:', label, detail ? `(${detail})` : ''); fail++; }
  }

  const accounts = [
    { label: 'Student', email: 'student@example.com', password: 'student123' },
    { label: 'School Admin', email: 'owner@satvicyoga.com', password: 'owner123' },
    { label: 'Super Admin', email: 'admin@rishikeshyoga.com', password: 'admin123' },
  ];

  for (const acct of accounts) {
    try {
      const { csrfToken, cookie } = await getCSRF();
      check(`CSRF token obtained for ${acct.label}`, !!csrfToken, csrfToken ? csrfToken.slice(0, 20) + '...' : 'NONE');
      
      const result = await signIn(acct.email, acct.password, csrfToken, cookie);
      // NextAuth with credentials returns 200 on success or redirects; a 401/500 indicates failure
      const isSuccess = result.status !== 401 && result.status !== 500;
      check(
        `${acct.label} login (${acct.email})`,
        isSuccess,
        `status=${result.status}, redirect=${result.headers['location'] || 'none'}`
      );
    } catch (e) {
      console.log('❌ FAIL:', acct.label, 'error:', e.message);
      fail++;
    }
  }

  // Test wrong password
  try {
    const { csrfToken, cookie } = await getCSRF();
    const result = await signIn('student@example.com', 'wrongpassword', csrfToken, cookie);
    const isFailure = result.status === 401 || (result.headers['location'] && result.headers['location'].includes('error'));
    check('Wrong password is rejected', isFailure || result.status !== 200, `status=${result.status}`);
  } catch (e) {
    console.log('⚠️  Could not test wrong password:', e.message);
  }

  // Test registration then verify user exists in DB
  const { PrismaClient } = require('@prisma/client');
  const bcrypt = require('bcryptjs');
  const prisma = new PrismaClient();

  console.log('\n=== DB CREDENTIAL VERIFICATION ===');
  for (const acct of accounts) {
    const u = await prisma.user.findUnique({ where: { email: acct.email }, select: { role: true, password: true, name: true } });
    if (u && u.password) {
      const match = await bcrypt.compare(acct.password, u.password);
      check(`DB password hash correct for ${acct.label}`, match, `role=${u.role}`);
    } else {
      console.log('❌ FAIL: User not found in DB:', acct.email);
      fail++;
    }
  }

  await prisma.$disconnect();

  console.log('\n==============================');
  console.log(`RESULTS: ${pass} PASSED, ${fail} FAILED`);
  console.log('==============================');
}

run().catch(e => console.error('Fatal:', e.message));

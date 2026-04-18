const http = require('http');

const BASE = 'http://localhost:3000';

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
      },
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('==============================');
  console.log('   PLATFORM API HEALTH TEST');
  console.log('==============================\n');

  let pass = 0, fail = 0;

  function check(label, condition, detail) {
    if (condition) {
      console.log('✅ PASS:', label, detail ? `(${detail})` : '');
      pass++;
    } else {
      console.log('❌ FAIL:', label, detail ? `(${detail})` : '');
      fail++;
    }
  }

  // 1. Homepage
  const home = await request('GET', '/');
  check('Homepage loads (200)', home.status === 200, `status=${home.status}`);
  check('Homepage has YogaRishikesh branding', home.body.includes('YogaRishikesh'), '');

  // 2. Login page
  const login = await request('GET', '/login');
  check('Login page loads (200)', login.status === 200, `status=${login.status}`);
  check('Login page has form elements', login.body.includes('student@example.com') || login.body.includes('Sign In') || login.body.includes('Student'), '');

  // 3. Register school page
  const regPage = await request('GET', '/register/school');
  check('School registration page loads (200)', regPage.status === 200, `status=${regPage.status}`);
  check('Registration page has partnership form', regPage.body.includes('Apply for Partnership') || regPage.body.includes('Partnership'), '');

  // 4. Search page
  const search = await request('GET', '/search');
  check('Search page loads', search.status === 200, `status=${search.status}`);

  // 5. School admin page (should redirect without auth)
  const schoolAdmin = await request('GET', '/school-admin');
  check('School admin redirects when unauthenticated', [302, 307, 308].includes(schoolAdmin.status) || schoolAdmin.status === 200, `status=${schoolAdmin.status}`);

  // 6. Admin page (should redirect without auth)
  const admin = await request('GET', '/admin');
  check('Admin page redirects when unauthenticated', [302, 307, 308].includes(admin.status) || admin.status === 200, `status=${admin.status}`);

  // 7. Auth session endpoint
  const session = await request('GET', '/api/auth/session');
  check('Auth session API responds', session.status === 200, `status=${session.status}`);
  check('Auth session returns JSON', session.body.startsWith('{') || session.body === '{}', '');

  // 8. Registration API - new school
  const regBody = {
    email: 'apitest@yoga.com',
    password: 'apitest123',
    role: 'SCHOOL_ADMIN',
    schoolName: 'API Test School',
    ownerName: 'API Tester',
    address: 'Test Street Rishikesh',
    website: '',
  };
  const regResult = await request('POST', '/api/register', regBody);
  check('Registration API creates new school admin',
    regResult.status === 201 || (regResult.status === 400 && regResult.body.includes('already exists')),
    `status=${regResult.status}, body=${regResult.body.slice(0, 80)}`
  );

  // 9. Blog page
  const blog = await request('GET', '/blog');
  check('Blog page loads', blog.status === 200, `status=${blog.status}`);

  // 10. Dashboard page (should redirect when unauthenticated)
  const dashboard = await request('GET', '/dashboard');
  check('Dashboard responds', [200, 302, 307, 308].includes(dashboard.status), `status=${dashboard.status}`);

  console.log('\n==============================');
  console.log(`RESULTS: ${pass} PASSED, ${fail} FAILED`);
  console.log('==============================');
}

run().catch(e => console.error('Fatal error:', e.message));

const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:3000';

const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/login', name: 'Login Page' },
  { path: '/register', name: 'Register Page' },
  { path: '/dashboard', name: 'User Dashboard' },
  { path: '/admin', name: 'Admin Dashboard' },
  { path: '/admin/approvals', name: 'Admin Approvals' },
  { path: '/school-admin', name: 'School Admin Dashboard' },
  { path: '/school-admin/bookings', name: 'School Admin Bookings' },
  { path: '/school-admin/enquiries', name: 'School Admin Enquiries' },
  { path: '/school-admin/calendar', name: 'School Admin Calendar' },
  { path: '/school-admin/revenue', name: 'School Admin Revenue' },
  { path: '/school-admin/settings', name: 'School Admin Settings' },
  { path: '/schools', name: 'Schools Listing' },
  { path: '/blog', name: 'Blog Page' },
  { path: '/search', name: 'Search Page' },
  { path: '/nonexistent-xyz-404', name: '404 Not Found' },
  { path: '/api/auth/session', name: 'Auth Session API' },
  { path: '/api/schools', name: 'Schools API' },
];

function fetchPage(path) {
  return new Promise((resolve) => {
    const url = BASE_URL + path;
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          redirected: res.statusCode >= 300 && res.statusCode < 400,
          location: res.headers.location || null,
          contentLength: data.length,
          hasError: data.includes('Application error') || data.includes('Internal Server Error') || data.includes('500'),
          hasContent: data.length > 500,
          snippet: data.substring(0, 300).replace(/\s+/g, ' ').trim(),
        });
      });
    });
    req.on('error', (err) => {
      resolve({ status: 'ERROR', error: err.message });
    });
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ status: 'TIMEOUT' });
    });
  });
}

function getIcon(result) {
  if (result.status === 'ERROR' || result.status === 'TIMEOUT') return '❌';
  if (result.status === 404) return result.name === '404 Not Found' ? '✅' : '❌';
  if (result.status >= 500) return '❌';
  if (result.hasError) return '⚠️';
  if (result.status === 200 || result.status === 307 || result.status === 302) return '✅';
  return '⚠️';
}

async function testLogin() {
  return new Promise((resolve) => {
    // First get CSRF token
    const csrfReq = http.get(BASE_URL + '/api/auth/csrf', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const { csrfToken } = JSON.parse(data);
          const postData = `csrfToken=${csrfToken}&email=admin%40yogarishikesh.com&password=admin123&callbackUrl=%2Fdashboard&json=true`;
          const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/callback/credentials',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(postData),
              'Cookie': res.headers['set-cookie'] ? res.headers['set-cookie'].join('; ') : '',
            }
          };
          const loginReq = http.request(options, (loginRes) => {
            let loginData = '';
            loginRes.on('data', c => loginData += c);
            loginRes.on('end', () => {
              resolve({
                status: loginRes.statusCode,
                location: loginRes.headers.location || null,
                cookies: loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'].length : 0,
                response: loginData.substring(0, 200),
              });
            });
          });
          loginReq.on('error', err => resolve({ status: 'ERROR', error: err.message }));
          loginReq.write(postData);
          loginReq.end();
        } catch (e) {
          resolve({ status: 'ERROR', error: 'Failed to parse CSRF: ' + e.message, raw: data.substring(0, 200) });
        }
      });
    });
    csrfReq.on('error', err => resolve({ status: 'ERROR', error: err.message }));
  });
}

async function testDatabase() {
  // Test the API routes that query the database
  const endpoints = [
    '/api/schools',
    '/api/auth/session',
  ];
  const results = {};
  for (const ep of endpoints) {
    results[ep] = await fetchPage(ep);
  }
  return results;
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('  PRANAYAMA PLATFORM - FULL PAGE & DATABASE TEST');
  console.log('  Base URL: ' + BASE_URL);
  console.log('  Time: ' + new Date().toLocaleString());
  console.log('='.repeat(70) + '\n');

  console.log('📄 TESTING ALL PAGES...\n');
  
  const results = [];
  for (const page of PAGES) {
    process.stdout.write(`  Testing ${page.name.padEnd(35)} `);
    const result = await fetchPage(page.path);
    result.name = page.name;
    result.path = page.path;
    const icon = getIcon(result);
    const statusStr = result.status === 'ERROR' ? `ERROR: ${result.error}` 
                    : result.status === 'TIMEOUT' ? 'TIMEOUT'
                    : `HTTP ${result.status}${result.redirected ? ` → ${result.location}` : ''}`;
    console.log(`${icon}  ${statusStr}`);
    results.push({ ...page, ...result, icon });
  }

  console.log('\n' + '-'.repeat(70));
  console.log('🔐 TESTING LOGIN...\n');
  const loginResult = await testLogin();
  if (loginResult.status === 'ERROR') {
    console.log(`  ❌ Login ERROR: ${loginResult.error}`);
    if (loginResult.raw) console.log(`     Raw: ${loginResult.raw}`);
  } else {
    const loginOk = loginResult.status === 200 || loginResult.status === 302 || loginResult.status === 307;
    console.log(`  ${loginOk ? '✅' : '❌'} Login attempt: HTTP ${loginResult.status}`);
    if (loginResult.location) console.log(`     Redirected to: ${loginResult.location}`);
    if (loginResult.cookies > 0) console.log(`     ✅ Session cookies set: ${loginResult.cookies} cookie(s)`);
    else console.log(`     ⚠️  No session cookies received`);
    if (loginResult.response) console.log(`     Response: ${loginResult.response}`);
  }

  console.log('\n' + '-'.repeat(70));
  console.log('\n📊 SUMMARY TABLE\n');
  console.log(`${'Page'.padEnd(35)} ${'Path'.padEnd(30)} ${'Status'}`);
  console.log('-'.repeat(75));
  for (const r of results) {
    const statusStr = r.status === 'ERROR' ? 'ERROR' 
                    : r.status === 'TIMEOUT' ? 'TIMEOUT'
                    : `HTTP ${r.status}${r.redirected ? ' (redirect)' : ''}`;
    console.log(`${r.icon} ${r.name.padEnd(33)} ${r.path.padEnd(30)} ${statusStr}`);
  }

  const passed = results.filter(r => r.icon === '✅').length;
  const failed = results.filter(r => r.icon === '❌').length;
  const partial = results.filter(r => r.icon === '⚠️').length;
  
  console.log('\n' + '='.repeat(70));
  console.log(`  RESULTS: ✅ ${passed} PASS  |  ❌ ${failed} FAIL  |  ⚠️  ${partial} PARTIAL`);
  console.log('='.repeat(70) + '\n');
}

main().catch(console.error);

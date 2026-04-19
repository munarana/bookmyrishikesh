const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err));

  await page.goto('http://localhost:3000/login');
  await page.fill('#a-email', 'test-admin@example.com');
  await page.fill('#a-password', 'Password123!');
  await page.click('text=Access Portal');
  await page.waitForURL('**/school-admin');
  console.log('Logged in, now navigating to courses');
  await page.goto('http://localhost:3000/school-admin/courses');
  await page.waitForSelector('text=Add New Course', { timeout: 10000 });
  await page.click('text=Add New Course');
  await page.waitForSelector('#name', { timeout: 10000 });
  await page.fill('#name', 'Playwright Debug Course');
  await page.fill('#durationDays', '14');
  await page.fill('#priceUSD', '1200');
  await page.fill('#description', 'This is a debug test course.');
  await page.click('text=Save & Publish');
  const response = await page.waitForResponse(resp => resp.url().includes('/api/school-admin/courses') && resp.request().method() === 'POST', { timeout: 10000 });
  console.log('POST response status', response.status());
  const body = await response.text();
  console.log('POST response body', body);
  await page.waitForTimeout(2000);
  await browser.close();
})();

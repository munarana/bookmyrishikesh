const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  await page.goto('http://localhost:3000/school-admin/courses');
  
  // click 'Add First Course'
  await page.waitForTimeout(1000);
  try {
    await page.click('text=Add First Course', { timeout: 2000 });
  } catch (e) {
    try {
      await page.click('text=Add Course', { timeout: 2000 });
    } catch (e2) {}
  }
  
  await page.waitForTimeout(1000);
  
  console.log('Typing...');
  // Find the input by id
  await page.fill('#name', 'Test Course');
  
  // Submit
  await page.click('text=Save as Draft');
  
  await page.waitForTimeout(1000);
  await browser.close();
})();

import assert from 'node:assert/strict';

const playwright = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const engine = process.env.PEOPLE_TEST_BROWSER ?? 'chromium';
const browser = await playwright[engine].launch({ headless: true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}) });
const base = process.env.PEOPLE_TEST_URL ?? 'http://127.0.0.1:5180';
const stress = process.env.PEOPLE_TEST_STRESS === '1';
const errors = [];
try {
  for (const [width, height] of [[1440, 1000], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/${stress ? 'people-preview?variant=compact' : '#people'}`);
    await page.locator('.pg-person-card').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    if (stress) {
      await page.evaluate(async () => (await import('/scripts/fixtures/people-directory.tsx')).renderDirectoryFixture(20));
      await page.getByRole('navigation', { name: 'Team pages' }).getByText('1 / 4', { exact: true }).waitFor();
      assert.equal(await page.locator('.pg-person-card:visible').count(), 6);
      await page.getByRole('button', { name: 'Next people', exact: true }).click();
      assert.equal(await page.locator('[data-person]:visible').first().getAttribute('data-person'), 'test-person-7');
      await page.locator('[data-person="test-person-8"]').click();
      await page.getByText('Synthetic answer 8', { exact: true }).waitFor();
      await page.getByRole('button', { name: 'All people', exact: true }).click();
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-person')), 'test-person-8');
      assert.equal(await page.getByRole('navigation', { name: 'Team pages' }).innerText(), '2 / 4');
      await page.getByRole('button', { name: 'Next people', exact: true }).click();
      await page.getByRole('button', { name: 'Next people', exact: true }).click();
      assert.equal(await page.locator('.pg-person-card:visible').count(), 2);
      assert(await page.getByRole('button', { name: 'Next people', exact: true }).isDisabled());
      await page.getByRole('searchbox', { name: 'Search people' }).fill('Researcher 20');
      assert.equal(await page.locator('.pg-person-card:visible').count(), 1);
      assert.equal(await page.getByRole('navigation', { name: 'Team pages' }).count(), 0);
      await page.getByRole('searchbox', { name: 'Search people' }).fill('');
      await page.getByRole('button', { name: 'Associated members', exact: true }).click();
      await page.getByRole('navigation', { name: 'Team pages' }).getByText('1 / 2', { exact: true }).waitFor();
    } else {
      const people = page.locator('#people');
      assert.equal(await people.locator('.pg-person-card').count(), 6);
      assert.equal(await people.locator('.pg-card-expertise, .pg-affiliation, .pg-question, a[href^="mailto:"]').count(), 0);
      assert.equal(await page.locator('.pg-switcher').count(), 0);
      assert.equal(await people.locator('[data-person="lalith-shiyam-sundar"]').locator('xpath=ancestor::article').locator('img').evaluate(el => getComputedStyle(el).transform), 'none');
      await people.locator('[data-person="frederic-paul-thiele"]').click();
      await page.locator('#frederic-paul-thiele').waitFor();
      assert.deepEqual(await people.locator('.pg-expanded .pg-links a').evaluateAll(es => es.map(e => e.getAttribute('href'))), [
        'https://github.com/frxderic', 'https://de.linkedin.com/in/dr-med-univ-frederic-thiele-b49849226',
        'https://scholar.google.com/citations?user=inGD8ccAAAAJ&hl=en',
      ]);
      assert.equal(await people.locator('.pg-question').count(), 4);
      await page.getByRole('button', { name: 'All people', exact: true }).click();
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-person')), 'frederic-paul-thiele');
      await people.getByRole('button', { name: 'Associated members', exact: true }).click();
      assert.equal(await people.locator('.pg-person-card').count(), 3);
      await people.getByRole('searchbox', { name: 'Search people' }).fill('no match');
      assert(await people.getByRole('status').isVisible());
      await people.getByRole('button', { name: 'Clear search and filters' }).click();
      assert.equal(await people.locator('.pg-person-card').count(), 6);
      await people.locator('[data-person="maximilian-tiling"]').click();
      assert.equal(await people.locator('.pg-question').count(), 0);
      await page.getByRole('button', { name: 'All people', exact: true }).click();
      await page.goto(`${base}/people#maissa-monsour`);
      await page.locator('#maissa-monsour .pg-profile-name').waitFor();
      assert.equal(await page.locator('#maissa-monsour .pg-affiliation').innerText(), 'Department of Nuclear Medicine\nLMU University Hospital');
      assert(await page.locator('#opportunities').count());
    }
    assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), 'No horizontal overflow');
    await page.screenshot({ path: `/tmp/people-directory-${stress ? '20-members' : 'live'}-${engine}-${width}.png` });
    await page.close();
    console.log(`${engine} ${width}px: ${stress ? '20-member pagination and search' : 'live directory, links, disclosure and anchors'} passed`);
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }

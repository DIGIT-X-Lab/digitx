import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';

const playwright = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const engine = process.env.PEOPLE_TEST_BROWSER ?? 'webkit';
const browser = await playwright[engine].launch({ headless: true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}) });
const base = process.env.PEOPLE_TEST_URL ?? 'http://127.0.0.1:5180';
const production = process.env.PEOPLE_TEST_PRODUCTION === '1';
const stress = process.env.PEOPLE_TEST_STRESS === '1';
const artifacts = '/tmp/digitx-people-qa';
mkdirSync(artifacts, { recursive: true });
const errors = [];
const create = async options => {
  const page = await browser.newPage(options);
  page.on('pageerror', error => errors.push(error.message));
  return page;
};
const load = async (page, route) => {
  await page.goto(`${base}${route}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
};
const choose = async (page, name) => {
  name = ['Hagen Lamprecht', 'Benedict Schildberg', 'Maissa Monsour'].includes(name) ? `${name}, M.Sc.` : name === 'Maximilian Tiling' ? `${name}, MD` : name;
  await page.locator('.people-roster').getByRole('button', { name, exact: true }).click();
};
const noOverflow = async page => assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), 'No horizontal overflow');
try {
  if (stress) {
    for (const [width, height] of [[1484, 1000], [390, 844]]) {
      const page = await create({ viewport: { width, height } });
      await load(page, '/people-preview');
      await page.evaluate(async () => (await import('/scripts/fixtures/people-roster.tsx')).renderRosterFixture(24));
      await page.waitForFunction(() => document.querySelectorAll('#people-roster-fixture .people-roster-person').length === 6);
      const fixture = page.locator('#people-roster-fixture');
      const before = await fixture.locator('.people-explorer').boundingBox();
      assert.equal(await fixture.locator('.people-profile').count(), 1, 'Only active profile mounts');
      assert.equal(await fixture.locator('.people-roster-list').evaluate(el => getComputedStyle(el).overflowY), 'visible', 'No hidden internal roster scrolling');
      await page.evaluate(async () => (await import('/scripts/fixtures/people-roster.tsx')).renderRosterFixture(60));
      await page.getByRole('navigation', { name: 'Team pages' }).getByText('1–6 / 60', { exact: true }).waitFor();
      const after = await fixture.locator('.people-explorer').boundingBox();
      assert(Math.abs(before.height - after.height) < 3, '24 to 60 people does not stretch the page');
      await page.getByRole('button', { name: 'Next people' }).click();
      assert.equal(await fixture.locator('.people-roster-person').first().getAttribute('aria-label'), 'Test Researcher 07');
      await page.getByRole('button', { name: 'Previous people' }).click();
      const fixtureRoster = fixture.locator('.people-roster-person');
      assert.equal(await fixtureRoster.count(), 6);
      assert.equal(await fixture.locator('.people-roster-person[tabindex="0"]').count(), 1, 'Only one roster Tab stop');
      if (engine === 'chromium') {
        await fixtureRoster.first().focus();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Tab');
        assert(await fixture.locator('.people-question button').first().evaluate(el => el === document.activeElement), 'Tab exits roster into selected profile');
      }
      await page.getByRole('searchbox', { name: 'Search people' }).fill('Researcher 60');
      assert.equal(await fixtureRoster.count(), 1);
      assert.equal(await page.getByRole('navigation', { name: 'Team pages' }).count(), 0, 'Search results do not retain unnecessary pagination');
      await page.getByRole('searchbox').press('Enter');
      await page.locator('#fixture-person-60').waitFor();
      assert.equal(await fixture.locator('.people-profile').count(), 1);
      await page.getByRole('searchbox').fill('no such person');
      assert(await page.getByRole('status').isVisible());
      assert(await page.locator('#fixture-person-60').isVisible(), 'Search never discards selected profile');
      await page.getByRole('button', { name: 'Clear search' }).click();
      assert.equal(await fixtureRoster.count(), 6);
      await page.getByRole('navigation', { name: 'Team pages' }).getByText('1–6 / 60', { exact: true }).waitFor();
      await noOverflow(page);
      await page.screenshot({ path: `${artifacts}/${engine}-${width}-60-people.png`, fullPage: true });
      await page.close();
    }
  } else if (production) {
    const page = await create({ viewport: { width: 1484, height: 1000 } });
    await load(page, '/#people');
    assert.equal(await page.locator('.people-roster-person').count(), 6);
    assert.equal(await page.locator('.people-design-note, .people-answer-pending').count(), 0, 'No draft labels or pending answers in the approved PI profile');
    assert.equal(await page.locator('#lalith-shiyam-sundar .people-question').count(), 4, 'All four approved PI answers are visible in production');
    assert(!(await page.locator('.people-page').innerText()).includes('Sameer'));
    for (const [name, file] of [['Hagen Lamprecht', 'hagen-lamprecht-web.jpg'], ['Benedict Schildberg', 'peter-benedict-schildberg-web.jpg'], ['Maissa Monsour', 'maissa-monsour-studio-web.jpg'], ['Maximilian Tiling', 'maximilian-tiling-studio-web.jpg']]) {
      await choose(page, name);
      assert((await page.locator('.people-portrait img').getAttribute('src')).endsWith(file), `${name}: supplied real portrait`);
      assert.equal(await page.locator('.people-portrait figcaption').count(), 0);
      assert.equal(await page.locator('.people-question').count(), ['Hagen Lamprecht', 'Benedict Schildberg', 'Maissa Monsour'].includes(name) ? 4 : 0, 'Only supplied, approved responses appear in production');
    }
    await choose(page, 'Frederic Paul Thiele, MD');
    const profile = page.locator('#frederic-paul-thiele');
    assert.equal(await profile.locator('.people-question').count(), 4, 'Author-supplied answers are visible in production');
    assert.equal(await profile.getByRole('link', { name: 'Email', exact: true }).getAttribute('href'), 'mailto:Frederic.Thiele@med.uni-muenchen.de');
    assert.equal(await profile.getByRole('link', { name: 'Email', exact: true }).getAttribute('target'), null, 'Email uses the mail client without a blank browser tab');
    assert.equal(await profile.locator('.people-person-background dd').innerText(), 'Neurosurgery / Neuro-Oncology');
    assert.deepEqual(await profile.locator('.people-person-affiliation').allTextContents(), ['Associated member', 'Department of Neurosurgery\nLMU University Hospital']);
    const prompts = profile.locator('.people-question button');
    for (let index = 0; index < 4; index++) {
      if (await prompts.nth(index).getAttribute('aria-expanded') !== 'true') await prompts.nth(index).click();
      assert.equal(await profile.locator('.people-answer:visible').count(), 1, 'One answer remains the focus');
      assert((await profile.locator('.people-answer:visible').innerText()).length > 50, 'Supplied answer, not a pending placeholder');
    }
    assert((await profile.locator('.people-answer:visible').innerText()).includes('our own data all along.'));
    assert.notEqual(await page.evaluate(() => document.querySelector('meta[name="robots"]')?.content), 'noindex, nofollow');
    await page.close();
  } else {
    for (const [width, height] of [[1920, 1080], [1484, 1000], [1101, 900], [1024, 768], [390, 844], [320, 740]]) {
      const page = await create({ viewport: { width, height } });
      await load(page, '/people-preview');
      const roster = page.locator('.people-roster-person');
      assert.equal(await roster.count(), 6);
      assert.equal(await page.locator('.people-roster-list').evaluate(el => getComputedStyle(el).overflowY), 'visible');
      assert.equal(await page.locator('.people-roster-pagination, .people-picker-toggle').count(), 0, 'Small team stays fully visible without hidden controls');
      assert(!(await page.locator('.people-page').innerText()).includes('Master’s degree'));
      assert.equal(await page.locator('.people-portrait img').evaluate(img => getComputedStyle(img).transform), 'matrix(-1, 0, 0, 1, 0, 0)', 'Only PI portrait is mirrored');
      assert.equal(await page.locator('.people-profile').count(), 1);
      assert.equal(await page.locator('.people-roster-person[tabindex="0"]').count(), 1);
      assert(!(await page.locator('.people-page').innerText()).includes('Sameer'));
      assert(!(await page.locator('.people-page').innerText()).includes('appointed March'));
      if (width === 1920) {
        const search = page.getByRole('searchbox', { name: 'Search people' });
        await search.fill('physics');
        assert.equal(await roster.count(), 1, 'Academic discipline is searchable');
        await search.press('Enter');
        assert.equal(await page.locator('.people-profile').getAttribute('id'), 'peter-benedict-schildberg');
        assert.equal(await page.locator('.people-person-qualification').count(), 0);
        await search.fill('');
      }
      assert.equal(await page.locator('.people-roster-group').filter({ hasText: 'Associated members' }).locator('.people-roster-person').count(), 3);
      await roster.first().focus(); await roster.first().press('ArrowDown');
      assert.equal(await page.locator('.people-profile').getAttribute('id'), 'hagen-lamprecht');
      await roster.nth(1).press('End');
      assert.equal(await page.locator('.people-profile').getAttribute('id'), 'frederic-paul-thiele');
      assert.deepEqual(await page.locator('.people-profile .people-person-affiliation').allTextContents(), ['Associated member', 'Department of Neurosurgery\nLMU University Hospital']);
      await roster.last().press('Home');
      await roster.first().click();
      const questions = page.locator('.people-profile .people-question button');
      assert.equal(await questions.count(), 4);
      await questions.nth(1).click();
      assert.equal(await questions.first().getAttribute('aria-expanded'), 'false');
      assert.equal(await questions.nth(1).getAttribute('aria-expanded'), 'true');
      await choose(page, 'Hagen Lamprecht'); await choose(page, 'Prof. Dr. Lalith Kumar Shiyam Sundar');
      assert.equal(await questions.nth(1).getAttribute('aria-expanded'), 'true', 'Remember each person’s open question');
      await choose(page, 'Hagen Lamprecht');
      assert((await page.locator('.people-portrait img').getAttribute('src')).endsWith('hagen-lamprecht-web.jpg'));
      assert.equal(await page.locator('.people-portrait figcaption').count(), 0);
      if (width > 1200) {
        const portrait = await page.locator('.people-portrait').boundingBox();
        const conversation = await page.locator('.people-conversation').boundingBox();
        const gap = conversation.x - (portrait.x + portrait.width);
        assert(gap >= 39 && gap <= 73, 'Portrait has deliberate 40–72px separation from questions');
        assert((await page.locator('.people-roster').boundingBox()).width >= 320, 'Roster keeps room for names');
      }
      await noOverflow(page);
      if (width <= 700) {
        const role = await page.locator('.people-person-role').boundingBox();
        const profile = await page.locator('.people-profile').boundingBox();
        assert(Math.abs(role.width - profile.width) < 2, 'Mobile metadata uses full width');
        await choose(page, 'Maximilian Tiling');
        await page.waitForTimeout(300);
        const name = await page.locator('#maximilian-tiling-name').boundingBox();
        assert(name.y >= 88 && name.y + name.height < height, 'Mobile selection keeps identity visible below sticky header');
        assert.equal(await page.locator('.people-roster-person').count(), 6, 'All six people remain available on mobile');
        assert.equal(await page.locator('.people-person-role').innerText(), 'Clinical associate');
      }
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${artifacts}/${engine}-${width}.png`, fullPage: true });
      await page.close();
    }
    for (const id of ['people', 'lalith-shiyam-sundar', 'hagen-lamprecht', 'peter-benedict-schildberg', 'maissa-monsour', 'maximilian-tiling']) {
      const page = await create({ viewport: { width: 1484, height: 1000 } });
      await load(page, `/#${id}`);
      const target = page.locator(`#${id}`);
      const expected = id === 'people' ? 89 : 112;
      assert(Math.abs((await target.boundingBox()).y - expected) < 4, `${id}: initial anchor remains aligned`);
      assert.equal(await page.locator('.people-portrait figcaption').count(), 0, 'No placeholder portrait remains');
      assert(await page.locator('.people-portrait img').evaluate(img => img.complete && img.naturalWidth >= 1000), 'High-resolution portrait loads');
      const backgrounds = { 'lalith-shiyam-sundar': 'Biomedical engineering', 'hagen-lamprecht': 'Statistics and data science', 'peter-benedict-schildberg': 'Physics', 'maissa-monsour': 'Electrical engineering and information technology', 'maximilian-tiling': 'Medicine' };
      if (backgrounds[id]) assert.equal(await page.locator('.people-person-background dd > span').first().innerText(), backgrounds[id]);
      await page.mouse.wheel(0, 180); await page.waitForTimeout(100);
      const before = (await target.boundingBox()).y;
      await page.locator('.people-page').evaluate(el => { el.style.paddingBottom = '300px'; });
      await page.waitForTimeout(150);
      assert(Math.abs((await target.boundingBox()).y - before) < 4, 'Initial anchor correction yields to user scrolling');
      await page.close();
    }
    const reduced = await create({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await load(reduced, '/people-preview#maissa-monsour');
    assert.equal(await reduced.locator('.people-profile').getAttribute('id'), 'maissa-monsour');
    assert.equal(await reduced.locator('.people-person').evaluate(el => getComputedStyle(el).animationName), 'none');
    await reduced.close();
  }
  assert.deepEqual(errors, []);
  console.log(`PASS (${engine}, ${stress ? '24/60-person stress' : production ? 'production' : 'review'}): scalable roster, membership groups, supplied portraits, content visibility, questions, responsive layout and direct links.`);
} finally { await browser.close(); }

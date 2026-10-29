// Browser regression checks against a built preview. Supply PLAYWRIGHT_MODULE when
// Playwright is provided by an external QA installation rather than this project.
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
const playwright = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const engine = process.env.HERO_TEST_BROWSER ?? 'webkit';
const browser = await playwright[engine].launch({ headless: true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}) });
const base = process.env.HERO_TEST_URL ?? 'http://127.0.0.1:5180/';
const artifacts = process.env.HERO_TEST_ARTIFACTS ?? '/tmp/digitx-hero-qa';
mkdirSync(artifacts, { recursive: true });
const errors = [];
const makePage = async options => {
  const page = await browser.newPage(options);
  page.on('pageerror', error => errors.push(error.message));
  return page;
};
const load = async (page, hash = '') => {
  await page.goto(`${base}${hash}`);
  await page.evaluate(() => document.fonts.ready);
};
const advance = async (page, progress) => {
  const distance = Number(await page.locator('#home').getAttribute('data-travel'));
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), distance * progress);
  await page.waitForFunction(p => Math.abs(Number(document.querySelector('#home').dataset.progress) - p) < .003, progress);
};
try {
  const viewports = engine === 'webkit' ? [[1920, 1080], [1484, 1000], [1484, 650], [1024, 768], [390, 844], [320, 568], [320, 740], [390, 701]] : [[1484, 1000], [390, 844]];
  for (const [width, height] of viewports) {
    const page = await makePage({ viewport: { width, height } });
    await load(page);
    await page.locator('.home-hero-visual[data-ready="true"]').waitFor();
    const body = page.locator('.hero-body-stage');
    let bounds = await body.boundingBox();
    assert(Math.abs(bounds.x + bounds.width / 2 - width / 2) < 3, `${width}: centred opening`);
    assert(bounds.y >= 70 && bounds.y + bounds.height < height - 40, `${width}: full-height opening stays in frame`);
    assert(await page.locator('.home-hero-copy').evaluate(el => el.inert));
    assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), `${width}: no horizontal overflow`);
    const openingCue = await page.locator('.home-hero-scroll-cue').boundingBox();
    const openingCondition = page.locator('.home-intro-condition');
    const lastOpeningText = await (await openingCondition.isVisible() ? openingCondition : page.locator('.home-intro-subject')).boundingBox();
    assert(lastOpeningText.y + lastOpeningText.height < openingCue.y - 8, `${width}x${height}: opening copy does not overlap cue`);
    await page.screenshot({ path: `${artifacts}/${engine}-${width}x${height}-opening.png` });
    await advance(page, .43);
    assert.equal(Number(await page.locator('[data-hero-full]').getAttribute('opacity')), 0, 'Scroll does not force binary conversion');
    assert(Number(await page.locator('.home-question-line').first().evaluate(el => getComputedStyle(el).opacity)) > .1, 'Question begins during movement');
    await advance(page, .65);
    if (width >= 1200) {
      const moving = await body.boundingBox();
      assert(moving.x + moving.width / 2 > width * .7, 'Figure moves right while text appears');
    }
    await page.evaluate(() => {
      new MutationObserver((_, observer) => {
        if (document.querySelector('#home').dataset.revealed) {
          window.heroBeforeCollapse = document.querySelector('.hero-body-stage').getBoundingClientRect().top;
          observer.disconnect();
        }
      }).observe(document.querySelector('#home'), { attributes: true, attributeFilter: ['data-revealed'] });
    });
    await advance(page, 1);
    await page.waitForFunction(() => !document.querySelector('#home').dataset.enhanced);
    assert(Math.abs((await body.boundingBox()).y - await page.evaluate(() => window.heroBeforeCollapse)) < 3, 'Removing scroll space preserves framing');
    assert(await page.locator('#home').evaluate(el => el.offsetHeight === el.firstElementChild.offsetHeight), 'No introductory scroll space remains');
    const copy = page.locator('.home-hero-copy');
    assert(!(await copy.evaluate(el => el.inert)));
    assert.equal(await page.locator('.home-question-main').evaluate(el => getComputedStyle(el).opacity), '1');
    bounds = await body.boundingBox();
    if (width >= 1200) {
      assert(bounds.x + bounds.width / 2 > width * .7, 'Figure settles on right');
      const stage = await page.locator('.home-hero').boundingBox();
      const header = await page.locator('.site-header').boundingBox();
      const copyBounds = await copy.boundingBox();
      assert(Math.abs(stage.height + header.height - height) < 2, `${width}x${height}: header and settled hero fill one viewport`);
      assert(Math.abs(copyBounds.y + copyBounds.height / 2 - bounds.y - bounds.height / 2) < 2, `${width}x${height}: text is centred against figure`);
      assert(bounds.y >= stage.y && bounds.y + bounds.height <= stage.y + stage.height, 'Complete figure fits settled hero');
    }
    else assert(bounds.y + bounds.height <= (await copy.boundingBox()).y, 'Mobile figure sits above text');
    assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), `${width}: no overflow`);
    await page.screenshot({ path: `${artifacts}/${engine}-${width}x${height}-settled.png` });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(200);
    assert.equal(await page.locator('#home').getAttribute('data-progress'), '1', 'Reverse never replays the introduction');
    assert.equal(await page.locator('.home-hero-visual').evaluate(el => getComputedStyle(el).transform), 'none');
    await page.screenshot({ path: `${artifacts}/${engine}-${width}x${height}-returned.png` });
    await page.close();
  }

  const interactive = await makePage({ viewport: { width: 1484, height: 1000 } });
  await load(interactive);
  await advance(interactive, 1);
  await interactive.waitForFunction(() => !document.querySelector('#home').dataset.enhanced);
  const pressure = interactive.locator('h1 .hero-pressure-text');
  const beforePressure = await pressure.boundingBox();
  await pressure.locator(".hero-pressure-ink").nth(5).hover(); await interactive.waitForTimeout(220);
  assert(await pressure.locator('.hero-pressure-ink').evaluateAll(nodes => nodes.some(n => getComputedStyle(n).fontVariationSettings !== '\"wght\" 400')), 'Variable-weight letters respond to pointer');
  assert(Math.abs((await pressure.boundingBox()).width - beforePressure.width) < .1, 'Pointer typography never reflows');
  await interactive.mouse.move(5, 5);
  assert.equal(await interactive.locator('h1').getAttribute('id'), 'home-title');
  assert(await interactive.getByRole('heading', { name: 'What can we understand about the human body when more of its data becomes computable?', exact: true }).count(), 'Question retains its accessible name');
  const body = interactive.locator('.hero-body-stage');
  await body.focus(); await body.press('Enter');
  assert.equal(await body.getAttribute('aria-pressed'), 'true');
  await body.press('Space'); assert.equal(await body.getAttribute('aria-pressed'), 'false');
  const bounds = await body.boundingBox();
  await interactive.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height * .4);
  await interactive.waitForTimeout(300);
  assert(await interactive.locator('[data-hero-patches] > rect').evaluateAll(nodes => nodes.some(n => Number(n.getAttribute('opacity')) > .1)), 'Pointer still reveals local binary');
  await interactive.mouse.move(5, 5);
  await interactive.locator('.desktop-navigation').getByRole('link', { name: 'Research', exact: true }).click();
  await interactive.waitForTimeout(900);
  await interactive.locator('.desktop-navigation').getByRole('link', { name: 'Home', exact: true }).click();
  await interactive.waitForFunction(() => scrollY < 2);
  assert.equal(await interactive.locator('#home').getAttribute('data-progress'), '1');
  await interactive.evaluate(() => { history.pushState({}, '', '/tools/moose'); dispatchEvent(new PopStateEvent('popstate')); });
  await interactive.waitForURL('**/tools/moose');
  await interactive.locator('.desktop-navigation').getByRole('link', { name: 'Home', exact: true }).click();
  await interactive.waitForURL('**/#home');
  await interactive.locator('#home').waitFor();
  assert.equal(await interactive.locator('#home').getAttribute('data-enhanced'), null, 'Client route return remains revealed');
  await interactive.setViewportSize({ width: 1920, height: 1080 });
  await interactive.waitForTimeout(100);
  assert(await interactive.locator('.home-hero').evaluate(el => Math.abs(el.getBoundingClientRect().height + document.querySelector('.site-header').getBoundingClientRect().height - innerHeight) < 2), 'Settled viewport fit survives route return and resizing');
  await interactive.setViewportSize({ width: 390, height: 844 });
  assert.equal(await interactive.locator('#home').getAttribute('data-enhanced'), null, 'Resize cannot rearm intro');
  await interactive.reload(); await interactive.evaluate(() => document.fonts.ready);
  assert.equal(await interactive.locator('#home').getAttribute('data-enhanced'), 'true', 'Refresh restores introduction');
  await interactive.close();

  const mobile = await makePage({ viewport: { width: 320, height: 568 } });
  await load(mobile);
  const cue = mobile.getByRole('button', { name: 'Reveal the question', exact: true });
  await cue.focus(); await cue.press('Enter'); await mobile.waitForTimeout(1800);
  const question = await mobile.locator('#home-title').boundingBox();
  assert(question.y >= 70 && question.y + question.height <= 568, 'Cue reveals the focused mobile question');
  assert(await mobile.locator('#home-title').evaluate(el => el === document.activeElement));
  await mobile.close();

  const offscreen = await makePage({ viewport: { width: 1484, height: 1000 } });
  await load(offscreen, '#tools'); await offscreen.waitForTimeout(1200);
  const toolsTop = (await offscreen.locator('#tools').boundingBox()).y;
  assert(Math.abs(toolsTop - 89) < 4, `Direct Tools anchor preserved: ${toolsTop}`);
  await offscreen.evaluate(() => { window.heroMutations = 0; new MutationObserver(changes => window.heroMutations += changes.length).observe(document.querySelector('#home'), { attributes: true, subtree: true }); });
  for (let i = 0; i < 10; i++) { await offscreen.evaluate(() => scrollBy({ top: 30, behavior: 'instant' })); await offscreen.waitForTimeout(30); }
  assert.equal(await offscreen.evaluate(() => window.heroMutations), 0, 'No offscreen animation updates');
  await offscreen.close();

  const pulsing = await makePage({ viewport: { width: 1484, height: 1000 } });
  await load(pulsing); await pulsing.locator('.home-hero-visual[data-ready="true"]').waitFor();
  const pulse = pulsing.locator('[data-hero-pulse]');
  await pulsing.mouse.move(742, 450); await pulsing.waitForTimeout(300);
  assert.equal(await pulsing.locator('[data-hero-patches] > rect').evaluateAll(nodes => nodes.filter(n => Number(n.getAttribute('opacity')) > 0).length), 0, 'Cursor and automatic pulse never overlap');
  await pulsing.waitForTimeout(4400);
  assert(Number(await pulse.getAttribute('opacity')) > .05, 'Pulse repeats beyond first cycle');
  await advance(pulsing, .02);
  await pulsing.waitForTimeout(220);
  assert.equal(await pulse.getAttribute('opacity'), '0', 'First scroll fades out pulse');
  await advance(pulsing, 0); await pulsing.waitForTimeout(400);
  assert.equal(await pulse.getAttribute('opacity'), '0', 'Pulse does not restart after first scroll');
  await pulsing.setViewportSize({ width: 1024, height: 768 });
  assert(Number(await pulsing.locator('[data-hero-full]').getAttribute('opacity')) === 0);
  await pulsing.close();

  const anchor = await makePage({ viewport: { width: 1484, height: 1000 } });
  await load(anchor);
  await anchor.locator('.desktop-navigation').getByRole('link', { name: 'Tools', exact: true }).click();
  await anchor.waitForTimeout(1800);
  assert(Math.abs((await anchor.locator('#tools').boundingBox()).y - 89) < 4, 'Smooth Tools navigation survives spacer removal');
  await anchor.close();

  const reduced = await makePage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await load(reduced);
  assert.equal(await reduced.locator('#home').getAttribute('data-enhanced'), null);
  assert.equal(await reduced.locator('.home-question-main').evaluate(el => getComputedStyle(el).opacity), '1');
  assert(!(await reduced.getByRole('button', { name: 'Reveal the question' }).isVisible()));
  await reduced.emulateMedia({ reducedMotion: 'no-preference' });
  await reduced.waitForTimeout(200);
  assert.equal(await reduced.locator('#home').getAttribute('data-enhanced'), null, 'Preference change does not hide revealed content');
  await reduced.close();

  for (const asset of ['front-clean.webp', 'front-binary-v2.png']) {
    const failed = await makePage({ viewport: { width: 1484, height: 1000 } });
    await failed.route(`**/${asset}`, route => route.abort()); await load(failed); await failed.waitForTimeout(700);
    assert.equal(await failed.locator('#home').getAttribute('data-enhanced'), null, `${asset}: static fallback`);
    assert(!(await failed.locator('.home-hero-copy').evaluate(el => el.inert)));
    await failed.close();
  }
  assert.deepEqual(errors, []);
  console.log(`PASS (${engine}): framed full-body composition, overlapping text, looping pulse, one-time reveal, seamless spacer removal, route return/refresh, keyboard/pointer controls, anchors, mobile cue, offscreen suspension, reduced motion and failed-artwork fallback.`);
} finally { await browser.close(); }

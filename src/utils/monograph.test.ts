import test from 'node:test';
import assert from 'node:assert/strict';
import { MONOGRAPH_VIGNETTES } from '../data/monographData.ts';

test('CampusParallaxGallery contains five curated architectural landmarks (#001 - #005)', () => {
  assert.equal(MONOGRAPH_VIGNETTES.length, 5);
  assert.equal(MONOGRAPH_VIGNETTES[0].serial, '#001');
  assert.equal(MONOGRAPH_VIGNETTES[1].serial, '#002');
  assert.equal(MONOGRAPH_VIGNETTES[2].serial, '#003');
  assert.equal(MONOGRAPH_VIGNETTES[3].serial, '#004');
  assert.equal(MONOGRAPH_VIGNETTES[4].serial, '#005');
});

test('Validates landmark photography, architectural styles, and coordinates', () => {
  MONOGRAPH_VIGNETTES.forEach((vignette) => {
    assert.ok(vignette.title.length > 5);
    assert.ok(vignette.image.startsWith('/school-images/') || vignette.image.startsWith('/assets/') || vignette.image.startsWith('https://'));
    assert.ok(vignette.coordinates.includes('°'));
    assert.ok(vignette.specifications.length >= 3);
    assert.ok(vignette.historicalNote.length > 10);
  });
});

test('Verifies human collegiate nomenclature with zero robotic jargon', () => {
  const rawContent = JSON.stringify(MONOGRAPH_VIGNETTES).toLowerCase();
  assert.equal(rawContent.includes('autonomous robot'), false);
  assert.equal(rawContent.includes('quantum core'), false);
  assert.equal(rawContent.includes('laser cutter'), false);
});

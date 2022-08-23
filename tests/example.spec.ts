import {test, Page, expect} from '@playwright/test';
import BasePage from '../src/pages/base.page'
import OLYMPIC_GAMES from '../dataset/olimpicGames.json';
import MARKERS from '../dataset/markers.json'
import PIXELS from '../dataset/pixels.json'

test.describe('Scenario 1', () => {
  let basePage:BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page)
    await page.goto('https://mn-angular-leaflet-markers.stackblitz.io/');
    await page.locator('span:has-text("Run this project")').click();
  });

  MARKERS.forEach(marker => {
    test(`Verify that ${Object.values(marker)[0]} markers are exist.`, async ({ page }) => {
      await basePage.verifyMarker(Object.values(marker)[0])
    });
  })

  test(`Verify that marker exist on specific place`, async ({ page }) => {
    let style = await page.locator('//span[text()=\'Virden (WIN)\']/ancestor::div[contains(@class,\'leaflet-marker-icon\')]')
        .getAttribute('style');

    let arrayForCompare = await basePage.parseStyleForPixels(style)
    await basePage.compareArrays(arrayForCompare, PIXELS)

  });
});

test.describe('Scenario 2', () => {
  let basePage:BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page)
    await page.goto('https://www.ag-grid.com/examples/grouping/default-row-grouping/modules/angular/index.html');
  });

  OLYMPIC_GAMES.forEach(country => {
    test(`Olympic games for ${Object.keys(country)[0]} country`, async ({ page }) => {
      await basePage.selectGroup(Object.keys(country)[0]);
      for (let group=0;group< Object.values(country).length;group++) {
        const groups = Object.values(country)[group];
        // @ts-ignore
        const parsedGroup = Object(groups[group])
        // @ts-ignore
        await basePage.selectGroup(Object.keys(groups[group])[group]);
        // @ts-ignore
        let athletes = parsedGroup[Object.keys(groups[group])];
        for (let athlete = 0; athlete < athletes.length; athlete++) {
          const athleteName = athletes[athlete]['athlete'];
          for (const records in athletes[athlete]) {
            await basePage.verifyFieldByCellID(athleteName, records, athletes[athlete][records]);
          }
        }
      }
    });
  })

  // TODO: This test Fails, needs to be updated rendering on DOM elements
  test(`Verify that sorting is working properly.`, async ({ page }) => {
    await basePage.selectGroup('United States');
    await basePage.selectGroup('2008');
    const arrayWithNonFilteredAthletes = await basePage.getListOfElementsByRow('athlete');

    await basePage.clickOnHeaderCellByText('Athlete');
    let arrayWithFilteredAthletes= await basePage.getListOfElementsByRow('athlete');
    // In expect below I do verification that array before sort is different according to array after sort
    expect(arrayWithNonFilteredAthletes).not.toBe(arrayWithFilteredAthletes);
    await basePage.checkArrayIdFiltered(arrayWithFilteredAthletes)
  });
});

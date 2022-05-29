import { test, Page } from '@playwright/test';
import BasePage from '../src/pages/base.page'
import OLYMPIC_GAMES from '../dataset/olimpicGames.json';
import MARKERS from '../dataset/markers.json'

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

});

test.describe.only('Scenario 2', () => {
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

});

import { expect, Locator, Page } from '@playwright/test';

export default class BasePage {
    public groupLoc: string;
    readonly page: Page;

    constructor(page: Page) {
        this.groupLoc = '.ag-group-value';
        this.page = page;
    }

    async selectGroup(groupName: string) {
        await this.page.locator(this.groupLoc, {hasText: `${groupName}`}).click({clickCount: 2});
    }

    async verifyFieldByCellID(athlete: string, field: string, value: string) {
        let locator = this.page.locator(`//div[text()='${athlete}']/ancestor::div[1]//div[@col-id='${field}']`)
        await expect(locator).toHaveText(value);
    }

    async verifyMarker(marker: string) {
       await expect(this.page.locator('.leaflet-marker-icon span', {hasText: `${marker}`})).toBeVisible()
    }
}
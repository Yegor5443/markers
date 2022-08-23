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
        let locator = await this.page.locator(`//div[text()='${athlete}']/ancestor::div[1]//div[@col-id='${field}']`)
        await expect(locator).toHaveText(value);
    }

    async verifyMarker(marker: string) {
       await expect(this.page.locator('.leaflet-marker-icon span', {hasText: `${marker}`})).toBeVisible()
    }

    async getListOfElementsByRow(raw: string): string[] {
        const listOfElements = await this.page.locator(`.ag-cell-value[col-id="${raw}"]`).allTextContents();
        return listOfElements;
    }

    async clickOnHeaderCellByText(text: string) {
        await this.page.locator('.ag-header-cell-text', {hasText: text}).click()
        await this.page.waitForTimeout(2000);
    }

    // Now this methof is not working properly, due to we have some problems with rendering elements on the DOM
    async checkArrayIdFiltered(array: string[]) {
        const newArray = Array.from(array);
        const sortedArray = newArray.sort()
        await expect(array).toBe(sortedArray)

    }

    parseStyleForPixels(text: any): string[] {
        if(text === null) throw new Error('No text for parsing');

        const startIndex = text.indexOf('d(');
        const lastIndex = text.indexOf('px);');
        return text.substring(startIndex + 2, lastIndex - 3).split(', ');
    }

    async compareArrays(arrayExpected: string[], arrayCompared: object[]) {
        expect(arrayExpected).toStrictEqual(Object.values(Object.values(arrayCompared)[0]));
    }
}
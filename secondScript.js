const fs = require('fs')
const { Builder, By, Key, until, Capabilities } = require('selenium-webdriver');

console.log(process.argv.slice(2)[0]);
let str = process.argv.slice(2)[0];

(async function uploadDailyWorklogs() {
	try {
		const driver = await new Builder()
			.forBrowser('chrome')
			.build();
		await driver.manage().setTimeouts({ implicit: 5000 });
		await driver.get(`http://www.google.com`);
		console.log(str);
		await driver.findElement(By.name('q')).sendKeys(str)
	} catch (error) {
		
	}
})();

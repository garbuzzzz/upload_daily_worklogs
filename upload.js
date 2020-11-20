const { Builder, By, Key, until, Capabilities } = require('selenium-webdriver')
const fs = require('fs')
const papa = require('papaparse')
const moment = require('moment')
let url, login, password, NDays, downloadPath, nowString, fromString, batFilePath

function getInputData(data) {
	url = data.data[1][0]
	login = data.data[1][1]
	password = data.data[1][2]
	NDays = data.data[1][3]
	downloadPath = data.data[1][4]
	batFilePath = data.data[1][5]
	const now = new Date();
	moment.locale('us');
	nowTimeString = moment().format('YYYY-MM-DD')
	fromTimeString = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate() - NDays)).format('YYYY-MM-DD')
}

(async function uploadDailyWorklogs() {
	try {
		await fs.readFile('./input.csv', async (err, data) => {
			if (err) {
				console.log(err)
			} else {
				await getInputData(papa.parse(await data.toString()))
				const chromeCapabilities = Capabilities.chrome()
				chromeCapabilities.set('goog:chromeOptions', {
					'args': [
						'start-maximized',
					],
					'prefs': {
						'download': {
							'default_directory': `${downloadPath}`,
							'prompt_for_download': 'false'
						},
						'safebrowsing': {
							'enabled': 'false',
						}
					}
				});
				const driver = await new Builder()
					.withCapabilities(chromeCapabilities)
					.forBrowser('chrome')
					.build();

				await driver.manage().setTimeouts({ implicit: 5000 });
				await driver.get(`${url}`);
				await driver.wait(until.elementLocated(By.id('google-signin-button')), 10000);
				await driver.sleep(3000);
				await driver.findElement(By.id('google-signin-button')).click();
				await driver.wait(until.elementLocated(By.id('identifierId')), 10000);
				await driver.sleep(2000);
				await driver.findElement(By.id('identifierId')).sendKeys(`${login}`, Key.ENTER);
				await driver.wait(until.elementLocated(By.name('password')), 10000);
				await driver.sleep(3000);
				await driver.findElement(By.name('password')).sendKeys(`${password}`, Key.ENTER);
				await driver.wait(until.elementLocated(By.css("div[data-test-id='collab-graph-container-row']")));
				await driver.get(`https://jet-bi.atlassian.net/plugins/servlet/ac/io.tempo.jira/tempo-app#!/reports/logged-time?columns=WORKED_COLUMN&dateDisplayType=days&from=${fromTimeString}&groupBy=project&groupBy=worker&order=ASCENDING&periodKey&periodType=FIXED&showCharts=true&sortBy=TITLE_COLUMN&subPeriodType=MONTH&to=${nowTimeString}&viewType=TIMESHEET`);
				await driver.wait(until.elementLocated(By.css('iframe')));
				await driver.switchTo().frame(0);
				await driver.sleep(2000);
				await driver.findElement(By.css("div[data-testid='right-section'] button:nth-child(2)")).click();
				await driver.wait(until.elementLocated(By.css('div[data-testid="tuiModal"] article:nth-child(2)')));
				await driver.findElement(By.css('div[data-testid="tuiModal"] article:nth-child(2)')).click();

				const int = await setInterval(() => {
					if (fs.existsSync(`${downloadPath}\\Report_${fromTimeString}_${nowTimeString}.csv`)) {
						clearInterval(int);
						driver.quit()
						console.log(`the file was downloaded in ${downloadPath}\\Report_${fromTimeString}_${nowTimeString}.csv directory`);
						let text = `node secondScript ${downloadPath}\\Report_${fromTimeString}_${nowTimeString}.csv`
						fs.writeFile(batFilePath, text, () => {
							console.log('bat file was written');
						})
					}
				}, 2000)
			}
		});
	} catch (error) {
		console.log(error);
	}
})();

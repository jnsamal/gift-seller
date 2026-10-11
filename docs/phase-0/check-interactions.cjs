const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
 const browser = await chromium.launch({ headless: true, channel: 'msedge' });
 const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
 const results = [];
 const go = route => page.goto('http://localhost:3000' + route, {waitUntil:'networkidle'});
 const check = async (name, run) => { try {results.push({name,observed:await run()});} catch(e){results.push({name,error:e.message});} fs.writeFileSync(path.join(__dirname,'evidence/interactions.json'),JSON.stringify(results,null,2)); };
 try {
 await check('Cart checkout button', async()=>{await go('/cart');await page.getByRole('button',{name:/Proceed to Checkout/i}).click();await page.waitForTimeout(2400);return {url:page.url()};});
 await check('Category filtering and Load More',async()=>{await go('/category/personalised-gifts');const titles=()=>page.locator('h3').allTextContents();const before=await titles();await page.getByRole('checkbox',{name:'Under ₹499'}).click();await page.waitForTimeout(1000);const after=await titles();await page.getByRole('button',{name:'Load More',exact:true}).click();return {url:page.url(),before,after,afterLoadMore:await titles()};});
 await check('Simulated checkout',async()=>{await go('/checkout');for(const [id,value] of Object.entries({email:'audit@example.com',phone:'9999999999',firstName:'Audit',address:'Local test only',pincode:'751001',city:'Bhubaneswar',state:'Odisha'})){await page.locator('#'+id).fill(value);}await page.getByRole('button',{name:'Pay Now',exact:true}).click();await page.waitForTimeout(3500);return {url:page.url(),text:(await page.locator('body').innerText()).slice(0,1300)};});
 await check('Tracking sample',async()=>{await go('/track-order');await page.locator('#orderId').fill('ORD-12345');await page.locator('#email').fill('ananya.sharma@example.com');await page.getByRole('button',{name:'Track Order',exact:true}).click();await page.waitForTimeout(1500);return {text:(await page.locator('body').innerText()).slice(0,1200)};});
 for(const [width,height] of [[390,844],[768,1024],[1440,1000]]) {
 await page.setViewportSize({width,height});
 await go('/verify-otp?id=9876543210');await page.waitForTimeout(1000);await page.screenshot({path:path.join(__dirname,`evidence/screenshots/${width}-otp-correct.png`),fullPage:true});
 await go('/category/personalised-gifts');await page.screenshot({path:path.join(__dirname,`evidence/screenshots/${width}-category-viewport.png`)});
 }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});


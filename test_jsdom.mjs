import { JSDOM, VirtualConsole } from 'jsdom';
const html = '<div style="float: right"><a href="/test/en.html">English</a></div><h1>Title</h1><small><script>document.write(new Date(1735880700000).toLocaleString())</script> <img src="/test/img.png" /></small>';
const dom = new JSDOM(`<!DOCTYPE html><body>${html}`, { virtualConsole: new VirtualConsole() });
const document = dom.window.document;
console.log('body.innerHTML:', document.body.innerHTML);
console.log('small:', document.querySelector('small')?.innerHTML);
console.log('small script:', document.querySelector('small script')?.innerHTML);

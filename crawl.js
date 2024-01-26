const { link } = require("fs");
const { url } = require("inspector");
const { JSDOM } = require("jsdom");

async function crawlPage(urlString) {
  console.log(`crawling ${urlString}`);
  try {
    const response = await fetch(urlString);
    if (response.status > 399) {
      console.log(
        `error in fetch with status code ${response.status} on page ${urlString}`
      );
      return;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(
        `skipping non-html page ${urlString}, content type: ${contentType}`
      );
      return;
    }
    console.log(await response.text());
  } catch (err) {
    console.log(`error crawling ${urlString}: ${err.message}`);
  }
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      try {
        const urlObj = new URL(`${baseURL.toLowerCase()}${linkElement.href}`);
        urls.push(`${baseURL.toLowerCase()}${linkElement.href}`);
      } catch (err) {
        console.log(`error with relative url: ${err.message}`);
      }
    } else {
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`error with absolute url: ${err.message}`);
      }
    }
  }
  return urls;
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/")
    return hostPath.slice(0, -1);
  else return hostPath;
}

module.exports = {
  crawlPage,
  getURLsFromHTML,
  normalizeURL,
};

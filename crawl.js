const { link } = require("fs");
const { url } = require("inspector");
const { JSDOM } = require("jsdom");
const { normalize } = require("path");

async function crawlPage(baseURL, currentURL, pagesCrawled) {
  const currentURLObj = new URL(currentURL);
  const baseURLObj = new URL(baseURL);

  if (currentURLObj.hostname !== baseURLObj.hostname) {
    return pagesCrawled;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);

  if (pagesCrawled[normalizedCurrentURL] > 0) {
    pagesCrawled[normalizedCurrentURL]++;
    return pagesCrawled;
  }

  pagesCrawled[normalizedCurrentURL] = 1;

  console.log(`crawling ${currentURL}`);
  let htmlBody = "";
  try {
    const response = await fetch(currentURL);
    if (response.status > 399) {
      console.log(
        `error in fetch with status code ${response.status} on page ${currentURL}`
      );
      return pagesCrawled;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(
        `skipping non-html page ${currentURL}, content type: ${contentType}`
      );
      return pagesCrawled;
    }
    htmlBody = await response.text();
  } catch (err) {
    console.log(`error crawling ${currentURL}: ${err.message}`);
  }
  const nextURLs = getURLsFromHTML(htmlBody, baseURL);
  for (const nextURL of nextURLs) {
    pagesCrawled = await crawlPage(baseURL, nextURL, pagesCrawled);
  }
  return pagesCrawled;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      try {
        const urlObj = new URL(`${baseURL.toLowerCase()}${linkElement.href}`);
        urls.push(urlObj.href);
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

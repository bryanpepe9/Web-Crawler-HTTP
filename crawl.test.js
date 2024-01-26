const exp = require("constants");
const { normalizeURL, getURLsFromHTML } = require("./crawl");
const { test, expect } = require("@jest/globals");

test("Normalize URL - Strip Protocol", () => {
  const input = "https://www.Bryan-Blog.com/about/";
  const actual = normalizeURL(input);
  const expected = "www.bryan-blog.com/about";
  expect(actual).toBe(expected);
});

test("Get URLs from HTML - Absolute URL", () => {
  const inputHTMLBody = `<html><body><a href="https://www.Bryan-Blog.com/about/path/">Bryan's Blog</a></body></html>`;
  const inputBaseURL = "https://www.Bryan-Blog.com/about/path/";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://www.bryan-blog.com/about/path/"];
  expect(actual).toEqual(expected);
});

test("Get URLs from HTML - Relative URL", () => {
  const inputHTMLBody = `<html><body><a href="/path/">Bryan's Blog</a></body></html>`;
  const inputBaseURL = "https://www.Bryan-Blog.com/about";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://www.bryan-blog.com/about/path/"];
  expect(actual).toEqual(expected);
});

test("Get URLs from HTML - Both Absolute and Relative URL", () => {
  const inputHTMLBody = `<html><body><a href="https://www.Bryan-Blog.com/about/path1/">Bryan's Blog Path 1</a><a href="/path2/">Bryan's Blog Path 2</a></body></html>`;
  const inputBaseURL = "https://www.Bryan-Blog.com/about";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [
    "https://www.bryan-blog.com/about/path1/",
    "https://www.bryan-blog.com/about/path2/",
  ];
  expect(actual).toEqual(expected);
});

test("Get URLs from HTML - Both Absolute and Relative URL", () => {
  const inputHTMLBody = `<html><body><a href="invalid">Bryan's Blog Invalid URL</a></body></html>`;
  const inputBaseURL = "https://www.Bryan-Blog.com/about";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});

const exp = require("constants");
const { normalizeURL } = require("./crawl");
const { test, exect } = require("@jest/globals");

test("Normalize URL - Strip Protocol", () => {
  const input = "https://www.Bryan-Blog.com/about/";
  const actual = normalizeURL(input);
  const exected = "www.bryan-blog.com/about";
  expect(actual).toBe(exected);
});

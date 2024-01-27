const { sortPages } = require("./report");

test("sortPages 2 pages", () => {
  const input = {
    "https://bryan-blog.com/about": 1,
    "https://bryan-blog.com": 3,
  };
  const actual = sortPages(input);
  const expected = [
    ["https://bryan-blog.com", 3],
    ["https://bryan-blog.com/about", 1],
  ];
  expect(actual).toEqual(expected);
});

test("sortPages 5 pages", () => {
  const input = {
    "https://bryan-blog.com/about": 1,
    "https://bryan-blog.com": 3,
    "https://bryan-blog.com/contact": 2,
    "https://bryan-blog.com/faq": 7,
    "https://bryan-blog.com/api": 9,
  };
  const actual = sortPages(input);
  const expected = [
    ["https://bryan-blog.com/api", 9],
    ["https://bryan-blog.com/faq", 7],
    ["https://bryan-blog.com", 3],
    ["https://bryan-blog.com/contact", 2],
    ["https://bryan-blog.com/about", 1],
  ];
  expect(actual).toEqual(expected);
});

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    const headers = details.responseHeaders || [];
    headers.push({
      name: "Access-Control-Allow-Origin",
      value: "*", // Or specify your extension's origin
    });
    return { responseHeaders: headers };
  },
  { urls: ["<all_urls>"] }, // Specify the URLs you want to intercept
  ["blocking", "responseHeaders"]
); 
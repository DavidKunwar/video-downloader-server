const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(
  cors({
    // origin: ['http://localhost:3000'],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/generate-youtube-video-download-url", function (req, res) {
  //   const youtubeVideoUrl = req.body.youtubeVideoUrl;

  try {
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto("https://en.savefrom.net/383/");

      // Set screen size
      await page.setViewport({ width: 1080, height: 1024 });

      // Type into search box
      await page.type("#sf_url", "https://youtube.com/watch?v=SVvr3ZjtjI8");
      // Click on Download button
      await page.click("#sf_submit");

      // Download URL in now generated, loacate download button and extract url
      const downloadBtn = await page.waitForSelector(".def-btn-box");
      const downloadUrl = await page.$$eval("div.def-btn-box a", (a) => {
        return a[0].href;
      });

      await browser.close();

      res.status(200).json({ downloadUrl: downloadUrl, error: null });
    })();
  } catch (error) {
    res.status(500).json({ downloadUrl: null, error: error });
  }
});

app.listen(3001, () => {
  console.log("Server is running at PORT : 3001");
});

import { Snow } from "./snow";

new Snow({
  accumulate: false,
  count: 1000,
  size: { min: 2, max: 5 },
  fallSpeed: { min: 0.3, max: 1 },
  wind: { min: -1, max: 0 },
  initiateTime: 20000,
  opacity: { min: 0.1, max: 0.8 },
});

document.body.style.background = "url(https://images5.alphacoders.com/133/1339874.png)";
document.body.style.backgroundSize = "cover";
document.body.style.backgroundAttachment = "fixed";
document.body.style.backgroundPosition = "center";
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundOrigin = "content-box";
document.body.style.backgroundClip = "content-box";

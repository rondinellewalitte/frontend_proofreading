export default function delayTime(n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 1000);
  });
}
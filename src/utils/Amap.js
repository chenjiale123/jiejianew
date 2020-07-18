export default function MapLoader() { // <-- 原作者这里使用的是module.exports
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap);
    } else {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=94f5b056c1f65da8f42a211ebb81bed6&plugin=AMap.Autocomplete,AMap.PlaceSearch';
      script.onerror = reject;
      document.head.appendChild(script);
    }
    window.initAMap = () => {
      resolve(window.AMap);
    };
  });
}

function FindProxyForURL(url, host) {
  // url: http://www.example.com:80/aaaa
  // のとき host: www.example.comになる（portは含まれない）
  var PROXY = "PROXY localhost:8080";
  
  var DIRECT = "DIRECT";

  function isPrivate(host) {
    return /^(10|127)\.\d+\.\d+\.\d+$/.test(host)
        || /^192\.168\.\d+\.\d+$/.test(host)
        || /^172\.(1[6789]|2\d|3[01])\.\d+\.\d+$/.test(host);
  }

  // isPlainHostName: [.]ドットが含まれている場合true（ex: localhost）
  if (isPlainHostName(host) || isPrivate(host)) {
    return DIRECT;
  }

  var DIRECT_APPLY_HOSTS = [
      // "www.example.com"
  ];
  for (var i = 0, len = DIRECT_APPLY_HOSTS.length; i < len; i++) {
    if (shExpMatch(host, DIRECT_APPLY_HOSTS[i])) {
      return DIRECT;
    }
  }

  var PROXY_APPLY_HOSTS = [
    // "*.example.com"
  ];
  for (var i = 0, len = PROXY_APPLY_HOSTS.length; i < len; i++) {
    if (shExpMatch(host, PROXY_APPLY_HOSTS[i])) {
      return PROXY;
    }
  }

  // proxy優先（落ちていたらダイレクト）
  return [PROXY, DIRECT].join("; ");
  // 必ずproxy経由
  // return PROXY;
}
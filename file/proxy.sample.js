function FindProxyForURL(url, host) {
  var PROXY = "PROXY localhost:8080";
  
  var DIRECT = "DIRECT";

  function isPrivate(host) {
    return shExpMatch(host, "10.*")
        || shExpMatch(host, "127.0.0.*")
        || shExpMatch(host, "192.168.*")
        || shExpMatch(host, "172.2?.*")
        || shExpMatch(host, "172.16.*")
        || shExpMatch(host, "172.17.*")
        || shExpMatch(host, "172.18.*")
        || shExpMatch(host, "172.19.*")
        || shExpMatch(host, "172.30.*")
        || shExpMatch(host, "172.31.*");
  }

  // isPlainHostName: [.]ドットが含まれているか（ex: localhost）
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

  // proxy優先
  // 落ちていたらダイレクト
  return [PROXY, DIRECT].join("; ");
}
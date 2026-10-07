function main(config) {
  function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function hasOwn(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
  }

  // 将键作为普通数据属性写入，避免特殊键触发原型 setter。
  function setOwn(object, key, value) {
    Object.defineProperty(object, key, {
      value: value, enumerable: true, configurable: true, writable: true
    });
  }

  // 对象递归合并；数组/标量整体替换，与原 YAML 的 rule-providers 语义一致。
  function mergeObjects(target, patch) {
    var result = {};
    var key;
    if (isObject(target)) {
      for (key in target) {
        if (hasOwn(target, key)) setOwn(result, key, target[key]);
      }
    }
    for (key in patch) {
      if (!hasOwn(patch, key)) continue;
      var oldValue = hasOwn(result, key) ? result[key] : undefined;
      var newValue = isObject(patch[key])
        ? mergeObjects(oldValue, patch[key])
        : patch[key];
      setOwn(result, key, newValue);
    }
    return result;
  }

  if (!isObject(config)) {
    throw new Error('LinkCube override: main(config) requires a configuration object.');
  }
  if (config.proxies != null && !Array.isArray(config.proxies)) {
    throw new Error('LinkCube override: config.proxies must be an array when present.');
  }
  if (config['rule-providers'] != null && !isObject(config['rule-providers'])) {
    throw new Error('LinkCube override: config["rule-providers"] must be an object when present.');
  }

  // 1. 最新自建节点：分别填写对应入站的密码，列表顺序即置顶顺序。
  var additionalProxies = [
    {
      "name": "🇺🇸 60Net-AnyTLS USA",
      "type": "anytls",
      "server": "60net.nkwu.dev",
      "port": 20901,
      "password": "QecA2ZQ1nN",
      "sni": "60net.nkwu.dev",
      "alpn": [
        "h3",
        "h2",
        "http/1.1"
      ],
      "skip-cert-verify": false,
      "udp": true
    },
    {
      "name": "🇺🇸 60Net-Trojan USA",
      "type": "trojan",
      "server": "60net.nkwu.dev",
      "port": 20902,
      "password": "yYPzY5NhEu",
      "sni": "60net.nkwu.dev",
      "alpn": [
        "h2",
        "http/1.1"
      ],
      "skip-cert-verify": false,
      "network": "tcp",
      "udp": true
    },
    {
      "name": "🇯🇵 RFC-AnyTLS JPN",
      "type": "anytls",
      "server": "rfc.nkwu.dev",
      "port": 20901,
      "password": "m5CdBhnhoX",
      "sni": "rfc.nkwu.dev",
      "alpn": [
        "h3",
        "h2",
        "http/1.1"
      ],
      "skip-cert-verify": false,
      "udp": true
    }
  ];

  // 2. 原策略组模板：保留名称、策略组选项顺序及地区筛选；末尾统一调整节点排序。
  var proxyGroups = [
    {
      "name": "Proxies",
      "type": "select",
      "proxies": [
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "🇭🇰 HK🔗",
      "type": "select",
      "include-all": true,
      "filter": "HKG"
    },
    {
      "name": "🇺🇸 US🔗",
      "type": "select",
      "include-all": true,
      "filter": "USA"
    },
    {
      "name": "🇺🇸 US-Home🔗",
      "type": "select",
      "include-all": true,
      "filter": "USA"
    },
    {
      "name": "🇯🇵 JP🔗",
      "type": "select",
      "include-all": true,
      "filter": "JPN"
    },
    {
      "name": "🇯🇵 JP-Home🔗",
      "type": "select",
      "include-all": true,
      "filter": "JPN"
    },
    {
      "name": "🇨🇳 TW🔗",
      "type": "select",
      "include-all": true,
      "filter": "TWN"
    },
    {
      "name": "🇸🇬 SG🔗",
      "type": "select",
      "include-all": true,
      "filter": "SGP"
    },
    {
      "name": "🎯Direct",
      "type": "select",
      "proxies": [
        "DIRECT",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ]
    },
    {
      "name": "AI🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "Paypal🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "Apple🔗",
      "type": "select",
      "proxies": [
        "🎯Direct",
        "Proxies",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "Google🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "Microsoft🔗",
      "type": "select",
      "proxies": [
        "🎯Direct",
        "Proxies",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "YouTube🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "Netflix🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "HBO🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "DisneyPlus🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "Bahamut🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "Bilibili🔗",
      "type": "select",
      "proxies": [
        "🎯Direct",
        "Proxies",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "MyTVSuper🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "Telegram🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "Crypto🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "Steam🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "Epic🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "Xbox🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "PlayStation🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "Scholar🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "Tiktok🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    },
    {
      "name": "✈️Final🔗",
      "type": "select",
      "proxies": [
        "Proxies",
        "🎯Direct",
        "🇭🇰 HK🔗",
        "🇺🇸 US🔗",
        "🇺🇸 US-Home🔗",
        "🇯🇵 JP🔗",
        "🇯🇵 JP-Home🔗",
        "🇨🇳 TW🔗",
        "🇸🇬 SG🔗"
      ],
      "include-all": true,
      "exclude-filter": "Traffic Reset|Expire Date| G [|] "
    }
  ];

  // 3. 远程规则集：递归合并，不擅自修改远程地址或更新间隔。
  var ruleProviders = {
    "paypal": {
      "type": "http",
      "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/PayPal/PayPal.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "anthropic": {
      "type": "http",
      "url": "https://raw.githubusercontent.com/xiaolai/anthropic-claude-surge-rules-set/main/dist/anthropic.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "apple-push": {
      "type": "http",
      "url": "https://rawstatic.com/nexitallyy/ProxyRules/main/ApplePush.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "extra-cn-3": {
      "type": "http",
      "url": "https://rawstatic.com/nexitallyy/ProxyRules/main/Extra_CN_3.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "global-scholar": {
      "type": "http",
      "url": "https://rawstatic.com/blackmatrix7/ios_rule_script/master/rule/Clash/GlobalScholar/GlobalScholar.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "mytv-super": {
      "type": "http",
      "url": "https://rawstatic.com/blackmatrix7/ios_rule_script/master/rule/Clash/myTVSUPER/myTVSUPER.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "extra-crypto": {
      "type": "http",
      "url": "https://rawstatic.com/nexitallyy/ProxyRules/main/Extra_Crypto.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "extra-ai": {
      "type": "http",
      "url": "https://rawstatic.com/nexitallyy/ProxyRules/main/Extra_AI.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "game-download": {
      "type": "http",
      "url": "https://rawstatic.com/blackmatrix7/ios_rule_script/master/rule/Clash/Game/GameDownload/GameDownload.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "google": {
      "type": "http",
      "url": "https://rawstatic.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "youtube": {
      "type": "http",
      "url": "https://rawstatic.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/YouTube.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "local-area-network": {
      "type": "http",
      "url": "https://rawstatic.com/ACL4SSR/ACL4SSR/master/Clash/LocalAreaNetwork.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "china-company-ip": {
      "type": "http",
      "url": "https://rawstatic.com/ACL4SSR/ACL4SSR/master/Clash/ChinaCompanyIp.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "netflix": {
      "type": "http",
      "url": "https://rawstatic.com/HotKids/Rules/master/Surge/RULE-SET/Netflix.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "telegram": {
      "type": "http",
      "url": "https://rawstatic.com/ACL4SSR/ACL4SSR/master/Clash/Telegram.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "steam": {
      "type": "http",
      "url": "https://rawstatic.com/blackmatrix7/ios_rule_script/master/rule/Clash/Steam/Steam.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "epic": {
      "type": "http",
      "url": "https://rawstatic.com/blackmatrix7/ios_rule_script/master/rule/Clash/Epic/Epic.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "xbox": {
      "type": "http",
      "url": "https://rawstatic.com/blackmatrix7/ios_rule_script/master/rule/Clash/Xbox/Xbox.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "playstation": {
      "type": "http",
      "url": "https://rawstatic.com/blackmatrix7/ios_rule_script/master/rule/Surge/PlayStation/PlayStation.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "hbo-max": {
      "type": "http",
      "url": "https://rawstatic.com/HotKids/Rules/master/Surge/RULE-SET/HBO_Max.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "hbo-usa": {
      "type": "http",
      "url": "https://rawstatic.com/blackmatrix7/ios_rule_script/master/rule/Clash/HBOUSA/HBOUSA.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "hbo-hk": {
      "type": "http",
      "url": "https://rawstatic.com/blackmatrix7/ios_rule_script/master/rule/Clash/HBOHK/HBOHK.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "disney-plus": {
      "type": "http",
      "url": "https://www.naiixi.com/DisneyPlus.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "bahamut": {
      "type": "http",
      "url": "https://rawstatic.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Bahamut.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "bilibili": {
      "type": "http",
      "url": "https://rawstatic.com/HotKids/Rules/master/Surge/RULE-SET/Bilibili.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "microsoft": {
      "type": "http",
      "url": "https://rawstatic.com/ACL4SSR/ACL4SSR/master/Clash/Microsoft.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "apple": {
      "type": "http",
      "url": "https://rawstatic.com/ACL4SSR/ACL4SSR/master/Clash/Apple.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "tiktok": {
      "type": "http",
      "url": "https://rawstatic.com/blackmatrix7/ios_rule_script/master/rule/Clash/TikTok/TikTok.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "proxy-lite": {
      "type": "http",
      "url": "https://rawstatic.com/ACL4SSR/ACL4SSR/master/Clash/ProxyLite.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "facebook": {
      "type": "http",
      "url": "https://rawstatic.com/blackmatrix7/ios_rule_script/master/rule/Clash/Facebook/Facebook.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "extra-proxies": {
      "type": "http",
      "url": "https://rawstatic.com/nexitallyy/ProxyRules/refs/heads/main/Extra_Proxies.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "twitter": {
      "type": "http",
      "url": "https://rawstatic.com/blackmatrix7/ios_rule_script/master/rule/Clash/Twitter/Twitter.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "extra-cn": {
      "type": "http",
      "url": "https://www.naiixi.com/Extra_CN.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "extra-cn-2": {
      "type": "http",
      "url": "https://www.naiixi.com/Extra_CN_2.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    },
    "wechat": {
      "type": "http",
      "url": "https://rawstatic.com/blackmatrix7/ios_rule_script/master/rule/Surge/WeChat/WeChat.list",
      "interval": 86400,
      "behavior": "classical",
      "format": "text"
    }
  };

  // 4. 分流规则：整体替换，并保留原有优先级顺序。
  var routingRules = [
    "DOMAIN-SUFFIX,binance.bh,🇨🇳 TW🔗",
    "DOMAIN-SUFFIX,truthsocial.com,🇺🇸 US-Home🔗",
    "DOMAIN-SUFFIX,t-mobile.com,🇺🇸 US-Home🔗",
    "DOMAIN-SUFFIX,clickme.net,🇭🇰 HK🔗",
    "DOMAIN,localhost,DIRECT",
    "DOMAIN-SUFFIX,local,DIRECT",
    "DOMAIN-SUFFIX,lan,DIRECT",
    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,100.64.0.0/10,DIRECT,no-resolve",
    "IP-CIDR,169.254.0.0/16,DIRECT,no-resolve",
    "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",
    "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",
    "IP-CIDR6,::1/128,DIRECT,no-resolve",
    "IP-CIDR6,fc00::/7,DIRECT,no-resolve",
    "IP-CIDR6,fe80::/10,DIRECT,no-resolve",
    "DOMAIN-KEYWORD,nkwu,DIRECT",
    "DOMAIN-SUFFIX,rastax.net,DIRECT",
    "DOMAIN-KEYWORD,netease,DIRECT",
    "DOMAIN-SUFFIX,163.com,DIRECT",
    "DOMAIN-SUFFIX,tx163.com,DIRECT",
    "DOMAIN-SUFFIX,126.net,DIRECT",
    "DOMAIN-SUFFIX,126.fm,DIRECT",
    "PROCESS-NAME,GameViewer.exe,DIRECT",
    "PROCESS-NAME,GameViewerServer.exe,DIRECT",
    "PROCESS-NAME,GameViewerService.exe,DIRECT",
    "DOMAIN-SUFFIX,jd.com,DIRECT",
    "DOMAIN-SUFFIX,tmall.com,DIRECT",
    "DOMAIN-SUFFIX,taobao.com,DIRECT",
    "DOMAIN-SUFFIX,tello.com,DIRECT",
    "PROCESS-NAME,v2ray,DIRECT",
    "PROCESS-NAME,ss-local,DIRECT",
    "AND,((NETWORK,UDP),(DST-PORT,443)),REJECT",
    "DOMAIN,appcloud.zhihu.com,REJECT",
    "DOMAIN,appcloud2.in.zhihu.com,REJECT",
    "DOMAIN,crash2.zhihu.com,REJECT",
    "DOMAIN,mqtt.zhihu.com,REJECT",
    "DOMAIN,sugar.zhihu.com,REJECT",
    "RULE-SET,paypal,Paypal🔗",
    "RULE-SET,anthropic,AI🔗",
    "RULE-SET,apple-push,Proxies",
    "RULE-SET,extra-cn-3,🎯Direct",
    "RULE-SET,global-scholar,Scholar🔗",
    "RULE-SET,mytv-super,MyTVSuper🔗",
    "RULE-SET,extra-crypto,Crypto🔗",
    "RULE-SET,extra-ai,AI🔗",
    "RULE-SET,game-download,🎯Direct",
    "RULE-SET,google,Google🔗",
    "RULE-SET,youtube,YouTube🔗",
    "RULE-SET,local-area-network,🎯Direct",
    "RULE-SET,china-company-ip,🎯Direct",
    "RULE-SET,netflix,Netflix🔗",
    "RULE-SET,telegram,Telegram🔗",
    "RULE-SET,steam,Steam🔗",
    "RULE-SET,epic,Epic🔗",
    "RULE-SET,xbox,Xbox🔗",
    "RULE-SET,playstation,PlayStation🔗",
    "RULE-SET,hbo-max,HBO🔗",
    "RULE-SET,hbo-usa,HBO🔗",
    "RULE-SET,hbo-hk,HBO🔗",
    "RULE-SET,disney-plus,DisneyPlus🔗",
    "RULE-SET,bahamut,Bahamut🔗",
    "RULE-SET,bilibili,Bilibili🔗",
    "RULE-SET,microsoft,Microsoft🔗",
    "RULE-SET,apple,Apple🔗",
    "RULE-SET,tiktok,Tiktok🔗",
    "RULE-SET,proxy-lite,Proxies",
    "RULE-SET,facebook,Proxies",
    "RULE-SET,extra-proxies,Proxies",
    "RULE-SET,twitter,Proxies",
    "RULE-SET,extra-cn,🎯Direct",
    "RULE-SET,extra-cn-2,🎯Direct",
    "RULE-SET,wechat,🎯Direct",
    "GEOIP,CN,DIRECT",
    "MATCH,✈️Final🔗"
  ];

  // 5. 固定 DNS：整体替换；保留原 fake-ip-filter 的星号及空策略对象。
  var fixedDNS = {
    "enable": true,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter-mode": "blacklist",
    "fake-ip-filter": [
      "*",
      "+.lan",
      "+.local",
      "time.*.com",
      "ntp.*.com",
      "+.market.xiaomi.com",
      "+.nkwu.ai",
      "+.nkwu.io",
      "+.nkwu.net",
      "+.nkwu.dev",
      "+.nkwu.tech"
    ],
    "ipv6": true,
    "respect-rules": false,
    "use-system-hosts": false,
    "use-hosts": false,
    "default-nameserver": [
      "tls://223.5.5.5"
    ],
    "proxy-server-nameserver": [
      "https://120.53.53.53/dns-query",
      "https://223.5.5.5/dns-query"
    ],
    "nameserver": [
      "https://120.53.53.53/dns-query",
      "https://223.5.5.5/dns-query"
    ],
    "direct-nameserver": [],
    "fallback": [],
    "nameserver-policy": {},
    "proxy-server-nameserver-policy": {}
  };

  // 6. 更新自建节点并置顶。只按精确名称处理，不按宽泛的域名/关键词删节点。
  var managedNames = additionalProxies.map(function (proxy) { return proxy.name; });
  var obsoleteNames = ['🇺🇸 60Net USA'];
  var replacedNames = managedNames.concat(obsoleteNames);
  var remainingProxies = (config.proxies || []).filter(function (proxy) {
    return !isObject(proxy) || replacedNames.indexOf(proxy.name) === -1;
  });
  config.proxies = additionalProxies.concat(remainingProxies);

  // 此处只执行原模板已有的简单正则。支持 Mihomo 用反引号分隔多个筛选式。
  function matchesAnyPattern(name, pattern) {
    if (!pattern) return false;
    return String(pattern).split('`').some(function (part) {
      return new RegExp(part).test(name);
    });
  }

  function isNodeIncluded(group, name) {
    if (group.filter && !matchesAnyPattern(name, group.filter)) return false;
    if (group['exclude-filter'] && matchesAnyPattern(name, group['exclude-filter'])) return false;
    return true;
  }

  function uniqueNames(names) {
    var seen = {};
    return names.filter(function (name) {
      if (hasOwn(seen, name)) return false;
      setOwn(seen, name, true);
      return true;
    });
  }

  // 比较 Unicode 码点，保持与 UTF-8 名称排序一致；不受设备语言的排序规则影响。
  function compareNames(left, right) {
    var leftIndex = 0;
    var rightIndex = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
      var leftCode = left.codePointAt(leftIndex);
      var rightCode = right.codePointAt(rightIndex);
      if (leftCode !== rightCode) return leftCode < rightCode ? -1 : 1;
      leftIndex += leftCode > 65535 ? 2 : 1;
      rightIndex += rightCode > 65535 ? 2 : 1;
    }
    if (leftIndex < left.length) return 1;
    if (rightIndex < right.length) return -1;
    return 0;
  }

  // 7. 置顶实际节点，不把原来的 DIRECT / Proxies / 地区组选项挤到后面。
  // 不保留这些组的 include-all，避免内核再次按名称添加而打乱排序或造成重复。
  var subscriptionNames = uniqueNames(remainingProxies.filter(function (proxy) {
    return isObject(proxy) && typeof proxy.name === 'string';
  }).map(function (proxy) { return proxy.name; })).sort(compareNames);

  proxyGroups.forEach(function (group) {
    if (!group['include-all']) return;
    var pinned = managedNames.filter(function (name) { return isNodeIncluded(group, name); });
    if (pinned.length === 0) return;

    var prefix = Array.isArray(group.proxies) ? group.proxies.slice() : [];
    var airport = subscriptionNames.filter(function (name) { return isNodeIncluded(group, name); });
    group.proxies = uniqueNames(prefix.concat(pinned, airport));
    delete group['include-all'];
    delete group['include-all-proxies'];
    group['include-all-providers'] = true;
    // group.filter / exclude-filter 原样保留，继续用于远程 provider 节点。
  });

  config['proxy-groups'] = proxyGroups;
  config['rule-providers'] = mergeObjects(config['rule-providers'], ruleProviders);
  config.rules = routingRules;
  config.dns = fixedDNS;

  return config;
}

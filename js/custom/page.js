var QZONE = window.QZONE || {};
function imagezoom(imgobj, box_w, box_h) {
  var src_w = imgobj.width;
  var src_h = imgobj.height;
  var r1 = src_w / src_h, r2 = box_w / box_h;
  var dst_w, dst_h;
  if (r1 > r2) {
    dst_w = box_w;
    dst_h = Math.round(dst_w / src_w * src_h);
  } else {
    if (r1 < r2) {
      dst_h = box_h;
      dst_w = Math.round(dst_h / src_h * src_w);
    } else {
      dst_w = box_w;
      dst_h = box_h;
    }
  }
  imgobj.style.marginLeft = (box_w - dst_w) / 2 + "px";
  imgobj.style.marginTop = (box_h - dst_h) / 2 + "px";
  imgobj.style.width = dst_w + "px";
  imgobj.style.height = dst_h + "px";
  imgobj.style.opacity = 1;
}
(function(_w, _d) {
  var ha = _d.head || _d.getElementsByTagName("head")[0];
  var $scope = {};
  var current;
  var tmnow;
  var chId;
  var homePageUrl, homePageName;
  var scs = document.getElementsByTagName("script");
  if (location.href.indexOf("fm.qq.com") > -1 || location.href.indexOf("fm.qzone.qq.com") > -1) {
    homePageName = "\u8fd4\u56de\u4f01\u9e45FM";
    homePageUrl = "http://fm.qq.com";
  } else {
    if (location.href.indexOf("qzone.qq.com") > -1) {
      homePageName = "\u8fd4\u56de\u6211\u7684\u7a7a\u95f4";
      homePageUrl = "http://qzone.qq.com";
    } else {
      homePageName = "返回博客主页";
      homePageUrl = "/";
    }
  }
  for (var i = 0;i < scs.length;i++) {
    if (scs[i].src.indexOf("/404/search_children.js") > -1) {
      if (scs[i].getAttribute("homePageUrl")) {
        homePageUrl = scs[i].getAttribute("homePageUrl");
      }
      if (scs[i].getAttribute("homePageName")) {
        homePageName = scs[i].getAttribute("homePageName");
      }
      break;
    }
  }
  $scope.rettext = homePageName;
  $scope.retlink = homePageUrl;
  function getData(srcUrl, callback) {
    var sc = _d.createElement("script");
    function orc() {
      if (sc.readyState === "loaded") {
        setTimeout(function() {
          callback && callback();
        }, 0);
      }
    }
    if (sc.addEventListener) {
      if (callback) {
        sc.addEventListener("load", callback, false);
      }
    } else {
      sc.attachEvent("onreadystatechange", orc);
    }
    ha && ha.appendChild(sc);
    sc.src = srcUrl;
  }
  function resolveData(d) {
    var tid, len, ddata = [], tdata;
    if ("object" == typeof d && (d.data && (len = d.data.length))) {
      for (var i = 0;i < len;i++) {
        var expire = d.data[i].expire;
        d.data[i]._id = new Date * Math.random() * Math.random() * 1E7;
        if (expire && tmnow * 1E3 < Date.parse(expire.replace(/\s[\s\S]*$/, "").replace(/\-/g, "/"))) {
          var _c = d.data[i].city, _p = d.data[i].province;
          if (_c && city) {
            if (("_" + _c + "_").indexOf("_" + city + "_") > -1) {
              ddata.push(d.data[i]);
              continue;
            }
          }
          if (_p && province) {
            if (("_" + _p + "_").indexOf("_" + province + "_") > -1) {
              ddata.push(d.data[i]);
            }
          }
        }
      }
      tid = Math.floor(Math.random() * (ddata.length || len));
      tdata = (ddata.length ? ddata : d.data)[chId = tid];
      if (_w.foundjsondata) {
        tdata.ta = tdata.sex.indexOf("\u5973") > -1 ? "\u5979" : "\u4ed6";
        tdata.name = "\u201c7\u00b718\u7279\u5927\u62d0\u5356\u5a74\u513f\u6848\u201d\u544a\u7834\uff0c\u88ab\u89e3\u6551\u768415\u540d\u5b69\u5b50\u4e2d\uff0c2\u4eba\u7531\u4eb2\u751f\u7236\u6bcd\u9886\u56de\uff0c\u4ecd\u670913\u540d\u5b69\u5b50\u672a\u627e\u5230\u4eb2\u751f\u7236\u6bcd\uff0c\u88ab\u5b89\u7f6e\u5728\u60e0\u5dde\u5e02\u793e\u4f1a\u798f\u5229\u9662\uff0c" + tdata.ta + "\u662f\u5176\u4e2d\u4e4b\u4e00\u3002";
        tdata.url = tdata.url.replace(/#p=(\d{1,2})/, function(a, n) {
          return "#p=" + (+n + 1);
        });
        return format(tmpl2, tdata);
      }
      if (!tdata.ext1) {
        tdata.ext1 = "\u4f46\u6211\u4eec\u53ef\u4ee5\u4e00\u8d77\u5bfb\u627e\u5931\u8e2a\u5b9d\u8d1d";
      }
      return tdata;
    }
  }
  function setTopData(tdata) {
    current = tdata;
    $scope.topname = tdata.name;
    $scope.topgender = tdata.sex;
    $scope.topbirth = tdata.birth_time;
    $scope.toplostdate = tdata.lost_time;
    $scope.toplostplace = tdata.lost_place;
    $scope.toplostdesc = tdata.child_feature;
    $scope.toplink = tdata.url;
    $scope.topimg = tdata.child_pic;
    $scope.topid = tdata._id;
    document.body.innerHTML = template("body", $scope);
  }
  function init(data) {
    tmnow = data.tm_now * 1E3;
    var tdata = resolveData(jsondata);
    $scope.whichin = 0;
    jsondata.data.splice(chId, 1);
    $scope.otherdata = [tdata].concat(jsondata.data.slice(0, 5));
    setTopData(tdata);
  }
  var timeout;
  window._Callback = function(d) {
    clearTimeout(timeout);
    init(d);
  };
  timeout = setTimeout(function() {
    _Callback({tm_now:(new Date).getTime() / 1E3});
  }, 2E3);
  getData("http://boss.qzone.qq.com/fcg-bin/fcg_zone_info");
  _w.share = function(target) {
    var summary = ["\u80cc\u666f\uff1a", current.name, "\uff0c\u6027\u522b\uff1a", current.sex, "\uff0c\u51fa\u751f\u65f6\u95f4\uff1a", current.birth_time, "\uff0c\u5931\u8e2a\u65f6\u95f4\uff1a", current.lost_time, "\uff0c\u7279\u5f81\u63cf\u8ff0\uff1a", current.child_feature].join("");
    if (summary) {
      summary = "#\u5bfb\u627e\u5931\u8e2a\u7684\u5b9d\u8d1d#" + summary;
    }
    var stitle = "\u5931\u8e2a\u7684\u5b9d\u8d1d\u8be6\u60c5";
    var desc = "\u5931\u8e2a\u7684\u5b9d\u8d1d\u8981\u56de\u5bb6\uff0c\u5feb\u6765\u53c2\u4e0e\u7231\u5fc3\u7684\u4f20\u9012\u5427\uff01";
    var encode = encodeURIComponent;
    var opts = {"surl":"http://qzone.qq.com/gy/404/" + current.id + "/lostchild.html", "site":"QQ\u7a7a\u95f4", "summary":summary || "#\u5b9d\u8d1d\u56de\u5bb6#\u817e\u8baf\u5fd7\u613f\u8005\u7528\u6280\u672f\u70b9\u4eae\u516c\u76ca\uff0c\u8ba9\u6211\u4eec\u4e00\u8d77\u5bfb\u627e\u8d70\u5931\u7684\u513f\u7ae5\u5427\uff01", "stitle":stitle, "pics":current.child_pic, "desc":desc, "origin_url":current.url};
    var surl = opts.surl || "http://www.qq.com/404/", summary = opts.summary || "\u8fd9\u4e2a\u662f\u5206\u4eab\u7684\u5185\u5bb9", stitle = opts.stitle || "\u8fd9\u4e2a\u662f\u5206\u4eab\u7684\u6807\u9898", pics = opts.pics || "http://qzonestyle.gtimg.cn/qzone_v6/act/img/20120422_qzone_7_years/pop_up/icon-pop-seven-years.png", site = opts.site || "\u8fd9\u4e2a\u662f\u5206\u4eab\u94fe\u63a5\u7684\u6587\u5b57", desc = opts.desc || "\u5931\u8e2a\u7684\u5b9d\u8d1d\u8981\u56de\u5bb6\uff0c\u5feb\u6765\u53c2\u4e0e\u7231\u5fc3\u7684\u4f20\u9012\u5427\uff01", 
    origin_url = opts.origin_url || "http://www.qq.com/404/";
    var shareList = {weibo:{method:function(evt) {
      var w = "http://v.t.qq.com/share/share.php", q = ["?site=", encode(surl + "#via=share_t_weib"), "&title=", encode(summary), "&pic=", encode(pics), "&url=", encode(surl)].join(""), p = [w, q].join("");
      openit(p, "weibo", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
    }}, qzone:{method:function(evt) {
      var buff = [], ps = {url:surl + "#via=404-qzoneshare", desc:desc || "\u5931\u8e2a\u7684\u5b9d\u8d1d\u8981\u56de\u5bb6\uff0c\u5feb\u6765\u53c2\u4e0e\u7231\u5fc3\u7684\u4f20\u9012\u5427\uff01", summary:summary, title:stitle, pics:pics, site:site};
      for (var k in ps) {
        buff.push(k + "=" + encode(ps[k] || ""));
      }
      var w = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + buff.join("&"), q = ["#via=share_t_qzone", "&title=", encode(summary), "&pic=", encode(pics), "&url=", encode(surl)].join(""), p = [w, q].join("");
      openit(p, "qzone", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
    }}, sina:{method:function() {
      var w = "http://v.t.sina.com.cn/share/share.php", q = ["?url=", encode(surl + "#via=share_x_weib"), "&title=", encode(summary), "&source=", "&sourceUrl=", surl, "&content=utf-8", "&pic=", encode(pics)].join(""), p = [w, q].join("");
      openit(p, "sina", "toolbar=0,status=0,resizable=1,width=440,height=430");
    }}, kaixin:{method:function() {
      var n = "http://www.kaixin001.com/repaste/bshare.php?rurl=" + encode(surl + "#via=share_kaixin") + "&rcontent=&rtitle=" + encode(summary);
      openit(n, "kaixin", "toolbar=0,status=0,resizable=1,width=600,height=360");
    }}, renren:{method:function() {
      var n = "http://www.connect.renren.com/share/sharer?title=" + encode(summary) + "&url=" + encode(surl + "#via=share_renren"), p = window.open(n, "rr", "toolbar=0,status=0,resizable=1,width=510,height=300");
      if (p) {
        p.focus();
      }
    }}, weixin:{method:function() {
      var n = "http://qzone.qq.com/gy/404/page/qrcode.html?url=" + encode(origin_url + "#via=share_weixin"), p = window.open(n, "rr", "toolbar=0,status=0,resizable=1,width=620,height=430");
      if (p) {
        p.focus();
      }
    }}};
    var openit = function(u, n, p) {
      function o() {
        var z;
        if (!(z = window.open(u, n, p))) {
          location.href = u;
        } else {
          z.focus();
        }
      }
      o();
    };
    shareList[target] && shareList[target].method();
  };
  _w.toThis = function(id) {
    for (var i = 0;i < $scope.otherdata.length;i++) {
      if ($scope.otherdata[i]._id == id) {
        setTopData($scope.otherdata[i]);
        break;
      }
    }
    return false;
  };
  var meta = document.createElement("meta");
  meta.name = "viewport";
  meta.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
  ha.appendChild(meta);
  (function registerStyle() {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "http://qzone.qq.com/gy/404/style/404style.css";
    ha.appendChild(link);
  })();
  (function initStat() {
    var qqDomainNameRE = /\.qq\.com$/i, qzoneDomainNameRE = /\bqzone\.qq\.com$/i, qzsDomainNameRE = /\bqzonestyle\.gtimg\.cn$/i;
    function cb() {
      var url = location.host;
      var src = "";
      if (qzoneDomainNameRE.test(url)) {
        src = "new404.qzone";
      } else {
        if (qqDomainNameRE.test(url)) {
          src = "new404.qq";
        } else {
          if (qzsDomainNameRE.test(url)) {
            src = "new404.qzonestyle";
          } else {
            src = url.replace(".", "_");
          }
        }
      }
      _w.TCISD && (_w.TCISD.pv && _w.TCISD.pv("hat.qzone.qq.com", "/gy/lostchild/" + src));
    }
    getData("http://qzonestyle.gtimg.cn/ac/qzfl/stat.js", cb);
  })();
})(window, document);
!function() {
  function a(a, b) {
    return(/string|function/.test(typeof b) ? h : g)(a, b);
  }
  function b(a, c) {
    return "string" != typeof a && (c = typeof a, "number" === c ? a += "" : a = "function" === c ? b(a.call(a)) : ""), a;
  }
  function c(a) {
    return l[a];
  }
  function d(a) {
    return b(a).replace(/&(?![\w#]+;)|[<>"']/g, c);
  }
  function e(a, b) {
    if (m(a)) {
      for (var c = 0, d = a.length;d > c;c++) {
        b.call(a, a[c], c, a);
      }
    } else {
      for (c in a) {
        b.call(a, a[c], c);
      }
    }
  }
  function f(a, b) {
    var c = /(\/)[^/]+\1\.\.\1/, d = ("./" + a).replace(/[^/]+$/, ""), e = d + b;
    for (e = e.replace(/\/\.\//g, "/");e.match(c);) {
      e = e.replace(c, "/");
    }
    return e;
  }
  function g(b, c) {
    var d = a.get(b) || i({filename:b, name:"Render Error", message:"Template not found"});
    return c ? d(c) : d;
  }
  function h(a, b) {
    if ("string" == typeof b) {
      var c = b;
      b = function() {
        return new k(c);
      };
    }
    var d = j[a] = function(c) {
      try {
        return new b(c, a) + "";
      } catch (d) {
        return i(d)();
      }
    };
    return d.prototype = b.prototype = n, d.toString = function() {
      return b + "";
    }, d;
  }
  function i(a) {
    var b = "{Template Error}", c = a.stack || "";
    if (c) {
      c = c.split("\n").slice(0, 2).join("\n");
    } else {
      for (var d in a) {
        c += "<" + d + ">\n" + a[d] + "\n\n";
      }
    }
    return function() {
      return "object" == typeof console && console.error(b + "\n\n" + c), b;
    };
  }
  var j = a.cache = {}, k = this.String, l = {"<":"&#60;", ">":"&#62;", '"':"&#34;", "'":"&#39;", "&":"&#38;"}, m = Array.isArray || function(a) {
    return "[object Array]" === {}.toString.call(a);
  }, n = a.utils = {$helpers:{}, $include:function(a, b, c) {
    return a = f(c, a), g(a, b);
  }, $string:b, $escape:d, $each:e}, o = a.helpers = n.$helpers;
  a.get = function(a) {
    return j[a.replace(/^\.\//, "")];
  }, a.helper = function(a, b) {
    o[a] = b;
  }, "function" == typeof define ? define(function() {
    return a;
  }) : "undefined" != typeof exports ? module.exports = a : this.template = a, a("body", function(a) {
    var b = this, c = (b.$helpers, b.$escape), d = a.retlink, e = a.rettext, f = a.topid, g = a.topimg, h = a.topname, i = a.topgender, j = a.topbirth, l = a.toplostdate, m = a.toplostplace, n = a.toplostdesc, o = a.toplink, p = b.$each, q = a.otherdata, r = (a.otheritem, a.index, "");
    return r += '<div class="mod_404"> <div class="wrapper" id="mainWrap"> <div class="mod_hd"> <h1 class="title"><span class="title_inner">404\uff0c\u60a8\u8bbf\u95ee\u7684\u9875\u9762\u627e\u4e0d\u56de\u6765\u4e86\uff0c\u4f46\u6211\u4eec\u53ef\u4ee5\u4e00\u8d77\u5e2e\u4ed6\u4eec\u56de\u5bb6\uff01</span></h1> <div class="desc"><a href="', r += c(d), r += '" class="desc_link">', r += c(e), r += '</a></div> </div> <div class="mod_bd"> <div class="child_box"> <div class="mod_404_child child_in" data-id="', 
    r += c(f), r += '" id="top_', r += c(f), r += '"> <div class="child_main cf"> <div class="child_avatar"><img src="', r += c(g), r += '" onload="imagezoom(this, 160, 216);" style="opacity:0"></div> <div class="child_info"> <div class="info_name"> <h2><span class="name_inner">', r += c(h), r += '</span><span class="info_sex">(', r += c(i), r += ')</span></h2> </div> <div class="info_item info_birth"><span class="info_lbl">\u51fa\u751f\u65e5\u671f\uff1a</span><span class="item_inner">', r += c(j), 
    r += '</span></div> <div class="info_item info_time"><span class="info_lbl">\u5931\u8e2a\u65f6\u95f4\uff1a</span><span class="item_inner">', r += c(l), r += '</span></div> <div class="info_item info_address"><span class="info_lbl">\u5931\u8e2a\u5730\u70b9\uff1a</span><span class="item_inner">', r += c(m), r += '</span></div> <div class="info_item info_desc"><span class="info_lbl">\u5931\u8e2a\u4eba\u7279\u5f81\u63cf\u8ff0\uff1a</span><span class="item_inner">', r += c(n), r += '</span></div> <a href="', 
    r += c(o), r += '" class="link_view" title="\u67e5\u770b\u8be6\u60c5"><span class="link_inner">\u67e5\u770b\u8be6\u60c5</span></a> </div> </div> <div class="child_bottom cf"> <div class="bottom_logo"> <ul class="logo_list"> <li><a href="http://e.t.qq.com/Tencent-Volunteers" title="\u817e\u8baf\u5fd7\u613f\u8005"><img src="http://qzone.qq.com/gy/404/style/image/logo_tencentvolunteers.png"></a></li> <li><a href="http://bbs.baobeihuijia.com/forum.php" title="\u5b9d\u8d1d\u56de\u5bb6"><img src="http://qzone.qq.com/gy/404/style/image/logo_baobeihuijia.png"></a></li> </ul> </div> <div class="bottom_right"> <div class="mod_share" onmouseover="this.className += \' mod_share_hover\';" onmouseout="this.className = this.className.replace(\' mod_share_hover\',\'\')"> <span class="share_inner">\u5206\u4eab</span> <ul class="share_list"> <li><a href="javascript:void(0);" class="share_link" onclick="share(\'weibo\');return false;" title="\u817e\u8baf\u5fae\u535a"><span class="link_inner">\u817e\u8baf\u5fae\u535a</span><i class="ico_tencentweibo"></i></a></li> <li><a href="javascript:void(0);" class="share_link" onclick="share(\'qzone\');return false;" title="QQ\u7a7a\u95f4"><span class="link_inner">QQ\u7a7a\u95f4</span><i class="ico_qzone"></i></a></li> <li><a href="javascript:void(0);" class="share_link" onclick="share(\'sina\');return false;" title="\u65b0\u6d6a\u5fae\u535a"><span class="link_inner">\u65b0\u6d6a\u5fae\u535a</span><i class="ico_sinaweibo"></i></a></li> <li><a href="javascript:void(0);" class="share_link" onclick="share(\'weixin\');return false;" title="\u5fae\u4fe1"><span class="link_inner">\u5fae\u4fe1</span><i class="ico_weixin"></i></a></li> </ul> <span style="clear: both;"></span> </div> </div> </div> </div> <i class="ico_corner"></i> </div> </div> <div class="mod_fd"> <div class="mod_404_children"> <ul class="children_list"> ', 
    p(q, function(a) {
      r += ' <li class="', r += c(f == a._id ? "current" : ""), r += '"><a href="javascript:;" onclick="toThis(\'', r += c(a._id), r += '\');" title="', r += c(a.name), r += '" ><img src="', r += c(a.child_pic), r += '"></a></li> ';
    }), r += " </ul> </div> </div> </div> </div>", new k(r);
  });
}();


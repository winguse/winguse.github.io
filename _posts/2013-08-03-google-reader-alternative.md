---
layout: post
title: "Google Reader我的替代方案"
date: 2013-08-03 01:33:48 +0000
---

对于我这个阅读量不少的人来说，没有个RSS阅读器是不科学的，哎，Google Reader的关闭真心是痛啊。

寻找了很多方案，最终我选择了[Tiny Tiny RSS](http://tt-rss.org/)。这个东西呢，开源的PHP系统，搭在自己的主机上，把feed缓存在自己的机器上。操作习惯跟Google Reader相似，也有Google Reader最最古老的那种分享文章的方式——可惜啊，由于都是自己搭建的，没有人告诉我别人的feed，所以这个分享的功能很弱了。但怎么说呢，Google Reader的关闭，让我们对云服务各种不信赖了，还是自己动手，自己弄个云吧。虽然文章没那么智能，但是够用。

对于自己手上有代码，当然就可以很多定制了，例如我自己也有几个恶心的订阅不输出全文的，于是，自己参考一个新闻插件，写了个插件把全文抓下来，如果你需要，代码在这：

```php
<?php
/*
 * af_fulltext/init.php
 * Plugin for TT-RSS 1.7.9
 *
 * Retrieves full article text for feeds
 *
 * CHANGELOG:
 *
 * Version 1.0 By Winguse modified from af_newspapper 1.2 (http://tt-rss.org/forum/viewtopic.php?f=22&t=1539)
 */
class Af_fulltext extends Plugin {
        private $host;
 
        function about() {
                return array(1.0,
                                "get full text from some feeds",
                                "Winguse",
                                "",
                                "http://winguse.com");
        }
 
        function api_version() {
                return 2;
        }
 
        function init($host) {
                $this->host = $host;
 
                $host->add_hook($host::HOOK_ARTICLE_FILTER, $this);
        }
 
        function hook_article_filter($article) {
                $feeds_list = array(//
                                "blog.jobbole.com" => '(//div[@class="entry"])',
                                "www.cppblog.com" => '(//div[@class="post"])',
                                "my.oschina.net" => '(//div[@class="BlogContent"])',
                                "www.qiqufaxian.cn" => '(//div[@class="align_entry_hack"])'
                                );
                $owner_uid = $article["owner_uid"];
                $hash = md5($article["content"]);
                if (strpos($article["plugin_data"], $hash) === FALSE){
                        foreach ($feeds_list as $symbol => $path) {
                                if (strpos($article["link"], $symbol) === FALSE) continue;
                                $html = $this->getHtml($article["link"], $path);
                                if($html != ""){
                                        $article["content"] = $html;
                                        $article["plugin_data"] = $hash;
                                }
                                break;
                        }
                }else if (isset($article["stored"]["content"])) {
                        $article["content"] = $article["stored"]["content"];
                }
 
                return $article;
        }
        function getHtml($url, $path){
                $doc = new DOMDocument();
                @$doc->loadHTML(file_get_contents($url));
                if ($doc) {
                        $basenode = false;
                        $xpath = new DOMXPath($doc);
 
                        $entries = $xpath->query($path);
                        foreach ($entries as $entry) {
                                $basenode = $entry;
                        }
 
                        if ($basenode) {
                                return $doc->saveXML($basenode);
                        }
                }
                return "";
        }
 
}
?>
```

另外呢，这个东西也有移动客户端，[Android的客户端](http://tt-rss.org/redmine/projects/tt-rss-android/wiki)做得还是蛮不错的。不过比较恶心的是，只能用7天，而且Google Play上在中国根本买不了那个Tiny Tiny RSS Unlocker，本来我想买的了，支持一下，但是真囧到我了。所以我去check out源代码，自己将那段限制的代码hack了。嗯，要是你有需要，也可以这么干，或者你也可以找我要编译好的apk。

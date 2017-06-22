---
layout: post
title: "Add SVG support to gitlab"
date: 2015-04-22 16:10:00 +0000
---

I think it reasonable to enable SVG file preview support in gitlab, but it did not get it support till now. I have found an easy and tricky way to do it:

inset the code below to the end of /opt/gitlab/embedded/service/gitlab-rails/app/views/layouts/_page.html.haml

```
:javascript
  if(/\.svg$/.test(window.location.href))$.get($('a:contains(Raw)').attr('href'), function(data){$('.code').replaceWith('<div class="file-content image_file">' + data + '</div>');})
  function UpdateSvgImg(){$('img[src$=".svg"]').each(function(){var $img = $(this); var rawUrl = $img.attr('src').replace('/blob/', '/raw/');  $.get(rawUrl, function(data){$img.replaceWith(data)})});}
  UpdateSvgImg();
  $('#preview').bind("DOMSubtreeModified", UpdateSvgImg);
```

The main idea is read the raw SVG content and replace it into the HTML document. And, it works~ <strong>WARNING: This may lead to XSS, use it only when you trust your users in gitlab.</strong>

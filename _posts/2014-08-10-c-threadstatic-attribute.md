---
layout: post
title: "C# ThreadStatic Attribute"
date: 2014-08-10 01:46:54 +0000
---

I am working on code reconstruction recently. For the previous logging function, we need to pass the log message as well as come contextual information (like tracking ID, user ID, etc)  on each function's calling. So, the code is relatively ugly:

<pre class="brush: csharp; gutter: true; first-line: 1; highlight: [2,4,8,10]; html-script: false">
public class Foo {
	public void Bar(ILogContext context, string str, ObjA a) {
		...
		Logger.logInfo(context, &quot;code is running here and working from something.&quot;);
		...
	}

	public void FooBar(ILogContext context, string testString){
		...
		Logger.logInfo(context, &quot;code is running here and call Bar.&quot;);
		Bar(context, testString, new ObjA());
		...
	}
}
</pre>

To avoid this, I try to find out something that can storage thread contextual information. And I found the [ThreadStatic Attribute](http://msdn.microsoft.com/en-us/library/system.threadstaticattribute.aspx), where we can attribute a static field and the field will be unique for each thread.

<pre class="brush: csharp; gutter: true; first-line: 1; highlight: [3]; html-script: false">
public static class Logger{
	[ThreadStatic]
	private static ILogContext _context;

	public static bool InitializeThreadContext(ILogContext context) {
		if (_context != null) {
			if (_context == context) {
				LogVerbose(&quot;Logging context is initialized again!&quot;);
			} else {
				LogWarning(&quot;Logging context is trying to initialize for a new context! new context: {0}.&quot;, context);
				_context = context;
			}
			return false;
		}
		_context = context;
		return true;
	}

	...
}

public class Foo {
	public void Bar(string str, ObjA a) {
		...
		Logger.logInfo(&quot;code is running here and working from something.&quot;);
		...
	}

	public void FooBar(string testString){
		...
		Logger.logInfo(&quot;code is running here and call Bar.&quot;);
		Bar(context, testString, new ObjA());
		...
	}
}
</pre>

After this, we just init to <code>InitializeThreadContext</code> once a thread start, and then we don't need to pass the context object everywhere in our code.

---
layout: post
title: "一个思路引发的血案 ZOJ Monthly Find the Lost Sock"
date: 2010-11-14 12:52:58 +0000
---

今天中午，去ZOJ Monthly凑热闹，菜鸟就是无奈，看到一道自以为能够做的题目，不久查重嘛，但是被卡数据了，无论是用MAP查重，还是Qsort查重都过不了，看着Status上面，180k内存，250ms的大牛，相当无奈，最后晚上看了解题报告，豁然开朗，啊！用异或！！！

一个值，异或上两次相同的值的时候，就返回到其本身啦！！吐血啊！

于是，一个思路，瞬间将这个题目变成水题，仅仅4分钟不到，一个AC程序：

```c++
#include <stdio.h>

int main(){
	int n,i,j;
	char st[10],s[10];
	while(scanf("%d",&n)!=EOF){
		getchar();
		gets(st);
		for(i=1;i<2*n-1;i++){
			gets(s);
			j=0;
			while(s[j]){
				st[j]^=s[j];
				j++;
			}
		}
		printf("%sn",st);
	}
	return 0;
}
```

唉，惭愧，自己知道的太少了。

Update:

[这里](http://watashi.ws/blog/1622/zojmonthly1011/)看后，更加吐血，居然输入也有哈，scanf也不用就读整形，嫌32位运算慢，用long long 64位来异或……囧，我太菜了。

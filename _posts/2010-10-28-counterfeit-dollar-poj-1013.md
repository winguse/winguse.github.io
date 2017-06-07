---
layout: post
title: "Counterfeit Dollar"
date: 2010-10-28 14:27:59 +0000
---

今天被一道简单题目折腾了，题目大意是，11个硬币，有一个假的，唯一的区别就是重量不一样，现在有一个天平，称三次，告诉你天平的三种状态，并保证三次能够称出结果。挺恶心的是，好多好需要细心的地方。

主要思路：平衡时，天平上的就是针对。不平是，不是天平上的就是真的，对应重的那一边可能出现假币的话就是偏重的，反之亦然，然后，如果可能重又可能轻，那么就只真的。

另外，这题目本身是[poj的1013](http://poj.org/problem?id=1013)，可是，今天poj貌似出问题了，所有程序都CE了，所以，我[这里](http://coj.uci.cu/OnlineJudge/problem.xhtml?problem_id=1125)交题的。

```c++
#include <stdio.h>

int main(){
	int st[15],n,i,j;//st -1初始，0真，1轻，2重
	char s1[15],s2[15],s3[15],ex[15];
	scanf("%d",&n);
	while(n--){
		for(i=0;i<15;i++)st[i]=-1;
		for(i=0;i<3;i++){
			scanf("%s%s%s",s1,s2,s3);
			for(j=0;j<15;j++)ex[j]=0;
			if(s3[0]=='e'){
				for(j=0;s1[j];j++){
					st[s1[j]-'A']=0;
				}
				for(j=0;s2[j];j++){
					st[s2[j]-'A']=0;
				}
			}else if(s3[0]=='u'){
				for(j=0;s1[j];j++){
					if(st[s1[j]-'A']==1)
						st[s1[j]-'A']=0;
					else if(st[s1[j]-'A']!=0)
						st[s1[j]-'A']=2;
					ex[s1[j]-'A']=1;
				}
				for(j=0;s2[j];j++){
					if(st[s2[j]-'A']==2)
						st[s2[j]-'A']=0;
					else if(st[s2[j]-'A']!=0)
						st[s2[j]-'A']=1;
					ex[s2[j]-'A']=1;
				}
				for(j=0;j<15;j++){
					if(!ex[j])st[j]=0;
				}
			}else{
				for(j=0;s1[j];j++){
					if(st[s1[j]-'A']==2)
						st[s1[j]-'A']=0;
					else if(st[s1[j]-'A']!=0)
						st[s1[j]-'A']=1;
					ex[s1[j]-'A']=1;
				}
				for(j=0;s2[j];j++){
					if(st[s2[j]-'A']==1)
						st[s2[j]-'A']=0;
					else if(st[s2[j]-'A']!=0)
						st[s2[j]-'A']=2;
					ex[s2[j]-'A']=2;
				}
				for(j=0;j<15;j++){
					if(!ex[j])st[j]=0;
				}
			}
		}
		for(i=0;i<15;i++){
			if(st[i]>0){
				printf("%c is the counterfeit coin and it is %s. n",'A'+i,st[i]==1?"light":"heavy");
				break;
			}
		}
	}
	return 0;
}
```

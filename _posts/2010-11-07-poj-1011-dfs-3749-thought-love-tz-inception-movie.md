---
layout: post
title: "POJ 1011"
date: 2010-11-07 15:54:18 +0000
---

这两天没怎么做题，重新研究了一下一道深搜题，那个是当初讲剪枝的时候的例题，也就是[POJ1011](http://poj.org/problem?id=1011)。

题目大意：

> 一组等长的木棒，将它们随机地裁断，使得每一节木棍的长度都不超过50个长度单位。然后又想把这些木棍恢复到为裁截前的状态，但忘记了初始时有多少木棒以及木棒的初始长度。求原始木棒的可能最小长度。

```c++
#include <stdio.h>
#include <stdlib.h>

	int n,sum,stick[66];
	bool stick_used[66],lsti;

int cmp(const void *a,const void *b){
	return *(int*)b-*(int*)a;
}

bool dfs(	int left,/*所有剩下的长度*/
			int lookingfor,/*当前要找到一小段长度*/
			int perlenth/*每段长度*/){
	printf("%d %d %d n",left,lookingfor,perlenth);getchar();
	if(left==0)return true;
	if(lookingfor==0){
		lsti=0;
		return dfs(left,perlenth,perlenth);
	}
	int i;
	for(i=lsti;i<n;i++){
		if(!stick_used[i]&&stick[i]<=lookingfor){
			stick_used[i]=true;
			lsti=i;
			printf("i=%dn",i);
			if(dfs(left-stick[i],lookingfor-stick[i],perlenth)){
			//	printf("use->%dn",stick[i]);
				return true;
			}
			stick_used[i]=false;
			if(lookingfor==perlenth
			/*如果找的是一根木棒的第一个部分，没找到，就没必要往下找了，
			因为，以后还是会用到这个没找到组合的这个木棒的*/
			||lookingfor==stick[i]
			/*同样的，要找到长度就是这根木棒，发现后面的都配不上了
			，这个长度肯定要有的，所以往下找也没用了*/)return false;
		}
	}
	return false;
}

int main(){
	int i;
	while(scanf("%d",&n),n!=0){
		for(i=sum=0;i<n;i++){
			scanf("%d",&stick[i]);
			sum+=stick[i];
			stick_used[i]=false;
		}
		qsort(stick,n,sizeof(int),cmp);
		for(i=0;i<n;i++)printf("%d ",stick[i]);
		printf("sum:%dn",sum);
		for(i=stick[0];i<=sum;i++){
			if(sum%i==0){
				lsti=0;
//				printf("n%dn",i);
//				getchar();
				if(dfs(sum,i,i)){
					printf("%dn",i);
					break;
				}
			}
		}
	}
	return 0;
}
```

代码注释，已经说明了具体的思想了，我也不想赘述。

另外，还有一道水题，实在水得没意思那种，[POJ3749](http://poj.org/problem?id=3749)：

```c++
#include <stdio.h>

int main(){
	char c,code[]="VWXYZABCDEFGHIJKLMNOPQRSTU";
	while(1){
		if(getchar()=='E')break;
		while((c=getchar())!='n');
		while((c=getchar())!=EOF){
			if(c>='A'&&c<='Z')
				putchar(code[c-'A']);
			else
				putchar(c);
			if(c=='n')break;
		}
		if(c==EOF)break;
		while(getchar()!='n');
	}
	return 0;
}
```

<!--

前天周五，家族（解释一下：我们7个人）聚餐，我请客吃火锅，很温馨，打从心底暖暖的。他们灌我酒，虽然，没把我灌醉，但也一肚子水。饭后一起去了后街买水果，买零食，然后会学校，兔子她可能因为有些酒，饭后就困了，但后来回到寝室，上网貌似就很精神……晚上11点半就睡觉了。晚上我睡觉的时候，我搭的一个twitter同步到新浪微博和人人网的php程序出问题了，开始一整夜同步n多重复的内容……由于以前twitter没有熟人，也没有同步过，所以宣泄了好多隐晦tweet。刚刚开始的时候，估计她还没睡。而且，人人网里面好友那么多，及时那时已经11点多了，但是还是不断刷别人的屏，而且是那些内容，哎哎，反正，糗大了……第二天起来，新浪还好，人人直接停用我的帐号了。

昨天是周六，下午兔子练毛笔字，没去参加红烛的那个培训会。忆琳也没意思去，我硬是把她拉去出席了，毕竟要接替我的工作了，至少，出席一下是必要的，这个人，心情也不好吧。后来，忆琳溜去吃饭了，我不到半个小时后，我也走了，跟忆琳说了一下红烛接下来的事情。晚上吃饭，李明给我发短信说，加我亲情号了，嘿嘿，没事，正好找她吃饭去，所以，碰巧遇上兔子了，她练毛笔字回来，没门进。连续4天一起吃晚饭了，估计是前无古人，后无来者的一次了。吃完，她们去贴海报，兔子似乎要避开我，我主动没去，去剪了剪头发，剪完，还是去找她们了。但找到了，也没跟上去。回来的时候，遇到了曼丽，虽然大我6个月，而且还是学姐，我从来没这么看待过她，她也知道我为自己的情感的事情，很郁闷，心情很低，不过，呵呵，谢谢她关心咯，我自己也没办法，我只是喜欢她，希望她好，她不喜欢我，那个不可强求。

昨晚看了《[盗梦空间](http://www.mtime.com/movie/99547/)》，一部相当喜欢的，相当有体会的电影。感觉，那种从筑梦到用潜意识一起做梦的东西，好好玩，好神奇，也很佩服编剧的奇思妙想，那种虚拟与现实，那种揭发人最最内心的感觉，真好。喜欢，里面的那个女主人公（筑梦师）Ariadne，她好聪明，好体贴人。同时，很佩服里面那种心灵上的智慧，对于逻辑、空间之类的，实在太科幻和好玩了。看完以后，有过这么一段话：

> 如果她给我一分钟，我要用n重穿越，把这一分钟扩展到一辈子，可惜啊，对于她，我借不来这样的一分钟，借来了又如何？我能够实现穿越么？实现了穿越，又怎么样呢？还不只是，虚幻……在剩下的两年里面，希望，我能够尽可能多的在她身边吧，喜欢她，希望她好好的。

今天天气还是很阴暗，早上跑去一食堂（希望，看见她）吃早餐，吃完了，然后又到三楼去自习，做cet4的试题，可惜啊，心里面总是静不下来，没什么效率，正答率勉强60%……反正，这样下去cet4准有问题。而且，第一篇阅读是关于心理的，联想起前一晚的电影，自己心里面的那些事情，压根就停不住。后来，于芬发短信，通知交学生证订票的事情，这个学期，又已经把回家的事情提上日程了，唉，时间，多快，又半个学期了，和她在一起的时间，还有多少呢？本来不想去的，想想，还是去吧，于是跑会了寝室，大不了，订到机票，就退掉火车票吧。

中午给她打了个电话，跟她说帮她补vb，做那个实验课的事情，晚上5点也再打了一次电话，她声音很好听，但是不太乐意，也就算了。不过，她拒绝还是挺有她的方式的。以后，还是打电话给她好了，反正，短信、QQ之类的，她给我的反馈那几个字，我还可能想很多负面的东西，再说，听听她声音也很好啊～

谢谢你读完我的这篇东西。

-->

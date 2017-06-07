---
layout: post
title: "过去的两天"
date: 2010-12-04 14:14:21 +0000
---

我在三个小时前（18点）恢复网络，自我断网结束，比计划早了两个小时，因为我们几个ACM讨论需要。

今晚讨论的是带权的二分匹配问题，证明没看懂，只是会用了，模板就这个而已：

```c++
const int maxn=20,INF=2147483647;
int w[maxn][maxn];
int lx[maxn]={0},ly[maxn]={0}; //顶标
int linky[maxn];
int visx[maxn],visy[maxn];
int lack;
bool find(int x){
	visx[x]=true;
	for(int y=0;y<maxn; y++){
		if(visy[y])continue;
		int t=lx[x]+ly[y]-w[x][y];
		if(t==0){
			visy[y]=true;
			if(linky[y]==-1||find(linky[y])){
				linky[y]=x;
				return true;
			}
		}
		else if(lack>t)lack=t;
	}
	return false;
}
void KM(){
	memset(linky,-1,sizeof(linky));
	for(int i=0;i<maxn; i++)
		for(int j=0;j<maxn; j++)
			if(w[i][j]>lx[i])
				lx[i]=w[i][j]; //初始化顶标
	for(int x=0;x<maxn; x++){
		for(;;){
			memset(visx,0,sizeof(visx));
			memset(visy,0,sizeof(visy));
			lack=INF;
			if(find(x))break;
			for(int i=0;i<maxn; i++){
				if(visx[i])lx[i]-=lack;
				if(visy[i])ly[i]+=lack;
			}
		}
	}
}
```

修改一下，变成了poj 2195，就是最大匹配变成最小匹配，如下：

```c++
#include <stdio.h>
#include <string.h>

int House[105][2],Hc,Man[105][2],Mc;
const int maxn=200,INF=2147483647;
int w[maxn][maxn];
int lx[maxn]={0},ly[maxn]={0}; //顶标
int linky[maxn];
int visx[maxn],visy[maxn];
int lack;
bool find(int x){
	visx[x]=true;
	for(int y=0;y<Mc; y++){
		if(visy[y])continue;
		int t=w[x][y]-lx[x]-ly[y];
		if(t==0){
			visy[y]=true;
			if(linky[y]==-1||find(linky[y])){
				linky[y]=x;
				return true;
			}
		}
		else if(lack>t)lack=t;
	}
	return false;
}
void KM(){
	memset(linky,-1,sizeof(linky));
	for(int i=0;i<Mc; i++){
		ly[i]=0;
		lx[i]=INF;
		for(int j=0;j<Mc; j++)
			if(w[i][j]<lx[i])
				lx[i]=w[i][j]; //初始化顶标
	}
	for(int x=0;x<Mc; x++){
		for(;;){
			memset(visx,0,sizeof(visx));
			memset(visy,0,sizeof(visy));
			lack=INF;
			if(find(x))break;
			for(int i=0;i<Mc; i++){
				if(visx[i])lx[i]+=lack;
				if(visy[i])ly[i]-=lack;
			//	printf("%d %d %dn",lx[i],ly[i],lack);
			}
		}
	}
}

int abs(int x){
	if(x<0)return -x;
	return x;
}

int main(){
	int i,j,n,m,ans;
	char tmp;
	while(scanf("%d%d",&n,&m),n+m!=0){
		getchar();
		Hc=Mc=0;
		for(i=0;i<n;i++){
			for(j=0;j<m;j++){
				tmp=getchar();
				if(tmp=='H'){
					House[Hc][0]=i;
					House[Hc][1]=j;
					Hc++;
				}else if(tmp=='m'){
					Man[Mc][0]=i;
					Man[Mc][1]=j;
					Mc++;
				}
			}
			getchar();
		}
		for(i=0;i<Hc;i++){
			for(j=0;j<Mc;j++){
				w[j][i]=abs(House[i][0]-Man[j][0])+abs(House[i][1]-Man[j][1]);
			}
		}
		KM();
		ans=0;
		for(i=0;i<Mc;i++){
			ans+=lx[i];
			ans+=ly[i];
		}
		printf("%dn",ans);
	}
	return 0;
}
```

<!--

前天晚上英语小组做题之后，和明一起吃东西，嘴里吃的是混沌，心里想的却不是在吃什么。我想，喜欢她，但我太烦她了。或许我真应该离开一下我的手机了，断开我的网络。所以，没什么多想到，把手机交给明，会到寝室后笔记本锁起来，用强的电脑把过去的日程全部写完，其实是些日记，就开始断开我的网络生活。

重新翻几本陈年的闲书，无意地翻，但一点读不进去，还想着那些事情，跟秦写了纸条，计划了周日下午的事情，跟她，VB以及ASP网页小组她落下的。答应了，我也没想什么，继续看了些看不进去的书，于是，早早地就睡觉了。

第二天早上，睡到8点多，起来，想起前一天晚上的事，怎么那么轻松的就答应了，思量着不太对劲，问秦。他支支吾吾的答了些，我当然不信，求他给我看聊天记录，不许。我纠结没床上睡觉，后来叫他给我详细说说，但是他没能圆谎，我听出漏洞了，不过我也不想看了，跟他说一个星期后给我看，他现在说给我看了，但是我没看，他给我发了离线消息。

英语课老师没来，说病了。离去，去图书馆下面，买了毛笔之类的东西，回来写一下。有5、6年没写说毛笔字了，加上心里面杂质那么多，写得真的喂狗都不吃。中午扫雪。然后数电课。洗澡。打羽毛球，和秦、谢、殷，谢好拖拉，等了半天，所以一开始秦和殷打，我就在窗玻璃上没的水汽上写字，Being with you makes me so happy.，但是你不高兴呢……回到寝室，继续写毛笔字。看闲书，还是早早地就睡觉了。

今天早上起来，懒床到8点，早餐，然后出去逛，在仁德转了一圈，没啥好玩的，回来，遇到张、丁、李要到外面去买衣服，我也随着去了。到了重庆路，转了几家后，我就没兴趣了，自己溜了。一个人走，印象中附近有个沃尔玛，于是去了，走了一圈，果然没了一百多块钱，买了件外套。想去本部看看，没有手机，估计失误，走了5个站才到，在北苑餐厅吃了，伙食啊，跟净月一个样，差。到静湖看看，发现全冻上了，走了一圈，还有人扫开雪，做了个溜冰的道。走了一圈，回净月。然后睡觉。醒来，毛笔字，折腾一会儿（准备了一个酸奶，一张道歉纸条{道歉，以及如果有下次让她收}，准备明给我手机时，转交给她的），去学院ACM。

提前上网了，QQ登录，收了不少消息，不愿意回的，扫一眼就关掉了。秦给我发的，我看了两次。之后，就几乎没有一点心情看算法了。我心都碎了，“两天呼吸时间”，看到这几个字，我心里面都不知道要说什么。反正，刚刚开始那一个小时，什么都没看进去。看进去后，就没心情想证明是怎样了，直接看代码，敲了一下，调了很久很久，才过了。

回来路上，又开始想这个问题，手机不想要回来了。唉，我这个坏蛋，这个可悲的人，不值得可怜。

感冒还没好。

-->

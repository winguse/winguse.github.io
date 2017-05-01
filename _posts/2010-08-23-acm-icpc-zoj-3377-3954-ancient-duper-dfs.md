---
layout: post
title:  "ZOJ Problem Set – 3377 Ancient Duper"
date:   2010-08-23 13:17:00 +0800
tags: [ACM]
---

博客第一弹了，呼呼，好的开头哈~本来不知道写些什么的，但是想想昨天有一次在浙大OJ上见证千人大战的盛况，我这只笨拙的菜鸟也做了两个水题，其中，也就是这篇文章的主角这道题目，我在五点半（比赛五点过了）才调好，因为一个小细节没把握好，导致WA，仔细调试得到的AC代码，对深搜收获更多了一些，还是挺好的。

## 题目大意：

出题的大牛明显是个漫画狂，全部东方特色的题目，这里我简化转译一下题意吧。

A、B两人下棋，A要一定赢，如果刚刚开始使得A一定能赢的，A先下，否则，B先下。下棋规则：x代码空白，e代表棋子；一个棋能够下，当且仅当与之毗邻（上、下、左、右）存在棋子，该棋子跳过同一个方向上的棋子，到达一块空地，所有他跳过的棋子被取走，例如：

```
xeex
xxex
xexx
xxxx
```

这张棋盘中，只有红色的e能够走，可以走到其中两个绿色的x的任意一个里面，并且跨过的e全部取走。当没有任何可以走的棋子时，表示输了。

## 思路：

题目很慷慨，8秒时间，我本来不想做的，但看到这个数值，以及最大数据量5×5，就开始动手了，想不到的是，我深搜没学好，对于这个题目，过早的认为找到中间答案就是最终答案，状态还原懒了，导致Wrong Answer。

开始就没有任何优化地些，不加任何剪枝，个人习惯，先写好再说，但后来也证明，这样就够了，830ms过了8秒题，偷笑ing。

首先是状态转移方程：

> 当前状态能赢 = 当前状态无论走哪一步，导致下一状态无论走哪一步都不能赢

反之亦然：

> 当前状态不能赢 = 当前状态无论走哪一步，导致下一状态无论走哪一步都能赢

似乎有点拗口，但对于这个游戏，只有这样才有解，这个是游戏的公平性问题，我不会证明，忽略之……

能走的步数，也就是转移的状态数，就是所有能走的棋（遍历所有的e，看能不能走）乘以每个e能走的方向（四个，上下左右）。

我用一个布尔函数，AlwaysWin()，表示这种状态能不能赢，能返回true，否则false。

由上面的逻辑可知，返回true当且仅当下一次调用AlwaysWin()返回false时，否则，这次返回false；递归最底层，就是无法走的情况，自然无法调用下一次，返回自然是false。

## 教训：

这个题目，最大的教训就是状态还原上面的。本来，我以为，当函数能够返回true时，就是函数可以结束的时候，也就是说，函数可以全部回调时，也就是可以完全不还原状态，得到结果的时候。

以前的题目，确实可以这样，但是，这次返回true，未必就是得到结果的时候。

比如深度为二调用深度为三时，得到一个false返回，这时，按上面的逻辑，深度为二本身可以返回true了，并不需要再实行深度二的其他操作了。如果不还原调用三前的状态：深度一调用深度二得到的是一个ture返回，也就是说，深度一还不知道他要返回什么值（对于深度一：我刚刚这样走[去调用深度二]，深度二会总是赢，我肯定输啦，但我可能还能走其他步数呢，说不定我还能赢呢……），他却还要继续算下去，偏生深度二完事了，懒得还原，他自个调用深度二前的状态也没了，想算对都难啦……

上面如果看不懂，将我代码注释的部分去掉，自己跟一下应该就没问题了。

代码如下：

```c

/*
状态还原的地方错了，导致WA
http://acm.zju.edu.cn/onlinejudge/showProblem.do?problemId=3954
*/
#include <stdio.h>
char map[10][10];
int r,c;
int xx;
/*
void p(){
	int i;
	printf("n");
	for(i=0;i<r;i++)
		printf("%sn",map[i]);
	printf("n");
	getchar();
}
*/

bool AlwaysWin(int d){
//	if(xx>50000){
//		printf("----------n");
//		return false;
//	}
	bool tmp;
//	printf("---------------ndeepth=%dn",d);
//	p();
	int i,j,k,t;
	for(i=0;i<r;i++){
		for(j=0;j<c;j++){
			if(map[i][j]=='e'){
				if(i>1&&map[i-1][j]=='e'){
					for(t=i;t>=0&&map[t][j]=='e';t--);
					if(t>=0&&map[t][j]=='x'){
				//		printf("deapth=%d c1 %d->%d j=%dn",d,t+1,i,j);
						map[t][j]='e';
						for(k=t+1;k<=i;k++)map[k][j]='x';
						tmp=AlwaysWin(d+1);
						for(k=t+1;k<=i;k++)map[k][j]='e';
						map[t][j]='x';
						if(!tmp)return true;
				//		printf("deapth=%d c1 %d->%d j=%dn",d,t+1,i,j);
					}
				}
				if(i<r-1&&map[i+1][j]=='e'){
					for(t=i;t<r&&map[t][j]=='e';t++);
					if(t<r&&map[t][j]=='x'){
				//		printf("deapth=%d c2 %d->%d j=%dn",d,i,t-1,j);
				//		p();
						map[t][j]='e';
						for(k=t-1;k>=i;k--)map[k][j]='x';
				//		p();
						tmp=AlwaysWin(d+1);
						for(k=t-1;k>=i;k--)map[k][j]='e';
						map[t][j]='x';
						if(!tmp)return true;
					}
				}

				if(j>1&&map[i][j-1]=='e'){
					for(t=j;t>=0&&map[i][t]=='e';t--);
					if(t>=0&&map[i][t]=='x'){
					//	printf("deapth=%d r1 %d->%d i=%dn",d,t+1,j,i);
					//	p();
						map[i][t]='e';
						for(k=t+1;k<=j;k++)map[i][k]='x';
					//	p();
						tmp=AlwaysWin(d+1);
						for(k=t+1;k<=j;k++)map[i][k]='e';
						map[i][t]='x';
						if(!tmp)return true;
					}
				}
				if(j<c-1&&map[i][j+1]=='e'){
					for(t=j;t<c&&map[i][t]=='e';t++);
					if(t<c&&map[i][t]=='x'){
				//		p();
				//		printf("deapth=%d r2 %d->%d,i=%dn",d,j,t-1,i);
						map[i][t]='e';
						for(k=t-1;k>=j;k--)map[i][k]='x';
				//		p();
						tmp=AlwaysWin(d+1);
						for(k=t-1;k>=j;k--)map[i][k]='e';
						map[i][t]='x';
						if(!tmp)return true;
					}
				}
			}
		}
	}
//	printf("deepth=%d ended.n",d);
	return false;
}

int main(){
	int i;
	while(scanf("%d%d",&r,&c)!=EOF){
//		xx=0;
		for(i=0;i<r;i++){
			scanf("%s",map[i]);
		}
		if(AlwaysWin(0)){
			printf("Tewi firstn");
		}else{
			printf("Reisen firstn");
		}
	}
	return 0;
}
```

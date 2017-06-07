---
layout: post
title: "成都赛区-Error Curves"
date: 2010-11-13 06:55:05 +0000
---

今天ACM早上开了一个总结会，总结和计划了之后的事情。

就我自己而言，我也的确是一个很随心的人，所以，ACM我就是一致懒人，无事才刷一下题。09对比08，我们差太多了，呃，我也应该好好努力的，只是，心里面，太多疙瘩，太多别的事情<!--，她。。-->。

下午，也就是到现在，在ZOJ上面做一些题目，一个多月安排了今天去参加ZOJ月赛的，去的时候，发现是明天，今天改成了成都赛区的题目，水了一题Binary Number，然后做了一题Error Curves。后面那题算是学到点东西了，这里总结以下：

突函数最大值集合也是凸函数，所以，可以用二分查找找到最小值，不过这里需要变化一下，变成三分查找，原因是中间小，两边大。

```c++
//凸函数性质，二分查找的变形
#include <stdio.h>
#define MAXN 10005
int n;
double A[MAXN],B[MAXN],C[MAXN];

inline double max(double a,double b){
	if(a<b)return b;
	return a;
}

int main(){
	int t,i,j;
	double l,r,ml,mr,yl,yr;
	scanf("%d",&t);
	while(t--){
		scanf("%d",&n);
		for(i=0;i<n;i++){
			scanf("%lf%lf%lf",&A[i],&B[i],&C[i]);
		}
		l=0.0;
		r=1000.0;
		while(r-l>1e-10){//精度-8WA,16TLE,10刚刚好
			ml=(r-l)/3.0+l;
			mr=2.0*(r-l)/3.0+l;
			yl=yr=-1e100;
			for(i=0;i<n;i++){
				yl=max(yl,(A[i]*ml+B[i])*ml+C[i]);
				yr=max(yr,(A[i]*mr+B[i])*mr+C[i]);
			}
			if(yl<yr){
				r=mr;
			}else{
				l=ml;
			}
		}
		printf("%.4lfn",yl);
	}
	return 0;
}
```

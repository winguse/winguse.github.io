---
layout: post
title: "最大流，还有我的生活"
date: 2010-12-13 08:21:44 +0000
---

最大流是上周我ACM的重点，看了很久，但是心里杂质太多，好费劲才弄明白了，也就做了POJ1273，主要的参考资料，是[这里](http://www.cppblog.com/Icyflame/archive/2009/06/23/88364.html)，非常感谢！

```c++
#include <stdio.h>
#include <string.h>
#include <queue>
#define INF 99999999
#define M 205
using namespace std;

int ans;
int n,m,c[M][M],f[M][M],cf[M][M],path[M],cc[M];
queue<int> que;

int min(int a,int b){
	if(a<b)return a;
	return b;
}

bool FindPath(){
	while(!que.empty())que.pop();
	int i,lst;
	bool fg=false;
	memset(path,-1,sizeof(path));
	que.push(1);
	cc[1]=INF;
	path[1]=-2;
	while(!que.empty()){
		lst=que.front();
		que.pop();
		if(lst==m){fg=true;break;}
		for(i=1;i<=m;i++){
			if(path[i]==-1&&cf[lst][i]){
				que.push(i);
		//		printf("push %dn",i);getchar();
				path[i]=lst;
				cc[i]=min(cc[lst],cf[lst][i]);
			}
		}
	}
	if(fg){
		i=m;
		while(i!=-2){
		//	f[path[i]][i]+=cc[m];
		//	f[i][path[i]]=-f[path[i]][i];
		//	cf[path[i]][i]=c[path[i]][i]-f[path[i]][i];
		//	cf[i][path[i]]=c[i][path[i]]-f[i][path[i]];
			cf[path[i]][i]-=cc[m];
			cf[i][path[i]]+=cc[m];
			i=path[i];
		}
		ans+=cc[m];
		return true;
	}else{
		return false;
	}
}

int main(){
	int i,a,b,c_;
	while(scanf("%d%d",&n,&m)!=EOF){
		memset(c,0,sizeof(c));
		memset(cf,0,sizeof(cf));
		memset(f,0,sizeof(f));
		for(i=0;i<n;i++){
			scanf("%d%d%d",&a,&b,&c_);
			c[a][b]+=c_;
			cf[a][b]=c[a][b];
		}
		ans=0;
		while(FindPath());
		//	printf("--n")
	//	for(i=1;i<=m;i++)
	//		ans+=f[1][i];
		printf("%dn",ans);
	}
	return 0;
}

```
<!--

我又把她惹上了。怎么说呢，其实，我也太缠她了，一切都是我自己的错，唉，我会努力改的，希望，能够得到她的认可吧，做她的好朋友。

-->

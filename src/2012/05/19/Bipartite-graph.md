---
title: "二分图专题"
date: 2012-05-19 08:08:17 +0000
---

本来这个学期要好好切几个专题的题目的，可是各种杂事，都没做这个东西，真心无奈（参与组织校赛、邀请赛，丹麦项目、科研立项等等杂七杂八的事），以及真心地懒（这个就没理由了）。这周省赛了，这几天，好好看看前段时间做的题目，恢复性训练，以及总结。

## 基本概念

### 二分图

顶点可以分成两个不相交的集使得在同一个集内的顶点不相邻（没有共同边）的图。

### 最大匹配

这个没啥说的，就是两个集合中的元素两两配对，使配对的数量最多。

### 独立集

从所有点中，选出一些点，这些点两两之间都没有边相连。

### 最大独立集

所有独立集中，元素最多的那个。（不一定唯一）

### 最小点覆盖

选出一些点，使到所有的边至少都有一个端点在这个点集里面。

### 最少边覆盖

用最少边，使所有顶点都在选中的这些边上至少出现一次。

### 最少路径覆盖\*

用最少的连通路径，走完所有的顶点。在一个 DAG（有向无环图）中，建立一个与之对应的二分图：将原来的顶点拆成两个集合：v1,v2..vn 和 u1,u2..un。若原图中 i 和 j 是有边的，则在二分图中连上 vi->ui。对于此二分图，求最大匹配，n 减去则得到最小路径覆盖。（如果将这个 i、j 关系映射会原图，你会发现，就是让你在原图中找出最多匹配的 i、j 集合脸上边，而连边的限制恰恰是，i、j 只能唯一相连，而没多连这样的关系，构成的子路径就会减少。初始的时候，最少的路径数是点数 n，而没连一次，就少走一个路径，于是……）

### 补图

原来的图中，有边的变没边，没边的边有边。

### 最大团

集合中的某个子集，这个子集内部所有的顶点都互相相连，在所有这种集合中，顶点数最大的那个。

## 一些公式

最大匹配数=最小点覆盖

最少路径覆盖\*=最少边覆盖=最大独立集=点数-最大匹配数

最大团=补图的最大独立集

## POJ 3041 Asteroids

题意就是，用最小的 行扫描线和列扫描线，覆盖所有的点。建图的思想是，把行号和列好做二分图的两个顶点及，如果该行该列有一个点要消除的话，脸上一条边，问题就变成了，选择其中一些行和列，使其数量最少，同时能够把所有的点覆盖了，也就是最小覆盖问题。

```c++
#include <cstdio>
#include <cstring>
const int MAXN=1000;
int uN,vN;
bool g[MAXN][MAXN];
int xM[MAXN],yM[MAXN];
bool chk[MAXN];
bool SearchPath(int u){
  int v;
  for(v=0;v<vN;v++){
    if(g[u][v]&&!chk[v]){
      chk[v]=true;
      if(yM[v]==-1||SearchPath(yM[v])){
        yM[v]=u;
        xM[u]=v;
        return true;
      }
    }
  }
  return false;
}

int MaxMatch(){
  int u,ret=0;
  memset(yM,-1,sizeof(yM));
  memset(xM,-1,sizeof(xM));
  for(u=0;u<uN;u++){
    if(xM[u]==-1){
      memset(chk,0,sizeof(chk));
      if(SearchPath(u))
        ret++;
    }
  }
  return ret;
}

int main(){
  int n,k,i,j,r,c;
  while(~scanf("%d%d",&n,&k)){
    uN=n;
    vN=n;
    memset(g,0,sizeof(g));
    for(i=0;i<k;i++){
      scanf("%d%d",&r,&c);
      g[r-1][c-1]=true;
    }
    printf("%dn",MaxMatch());
  }
  return 0;
}
```

## POJ 3020 Antenna Placement

给定一些点，用最少 2×1 或者 1×2 的圈将它们完全圈住。建图的思想是，顶点分两种，坐标加起来是奇数的和偶数的，对于相邻的顶点，连上一条边。处理的时候，为了性能起见，对所有的有用顶点重新编号，我存在了 imap 里面，然后再根据是否相邻，连边。最后求解的问题是，最小边覆盖。

```c++
/*
用最少的边覆盖所有的点，就是最大边权覆盖
点是×，边是相邻的×之间，×按照国际象棋编号
*/

#include <cstdio>
#include <cstring>

const int MAXN=205;
int uN,vN;
bool g[MAXN][MAXN];
int xM[MAXN],yM[MAXN];
bool chk[MAXN];
bool SearchPath(int u){
  int v;
  for(v=0;v<vN;v++){
    if(g[u][v]&&!chk[v]){
      chk[v]=true;
      if(yM[v]==-1||SearchPath(yM[v])){
        yM[v]=u;
        xM[u]=v;
        return true;
      }
    }
  }
  return false;
}

int MaxMatch(){
  int u,ret=0;
  memset(yM,-1,sizeof(yM));
  memset(xM,-1,sizeof(xM));
  for(u=0;u<uN;u++){
    if(xM[u]==-1){
      memset(chk,0,sizeof(chk));
      if(SearchPath(u))
        ret++;
    }
  }
  return ret;
}

int main(){
  char map[50][50];
  int imap[50][50];
  int test,i,j,k,w,h,x,y,u,v,d[]={1,0,-1,0,0,1,0,-1};
  scanf("%d",&test);
  while(test--){
    scanf("%d%d",&h,&w);
    memset(map,'o',sizeof(map));
    memset(g,0,sizeof(g));
    for(i=1;i<=h;i++){
      scanf("%s",&map[i][1]);
    }
    for(uN=vN=0,i=1;i<=h;i++){
      for(j=1;j<=w;j++){
        if(map[i][j]=='*'){
          if((i+j)&1){
            imap[i][j]=uN++;
    //        printf("%4d",imap[i][j]);
          }else{
            imap[i][j]=vN++;
    //        printf("%4d",-imap[i][j]);
          }
        }else{
    //      printf("%4c",' ',map[i][j]);
        }
      }
    //  puts("");
    }
    for(i=1;i<=h;i++){
      for(j=1;j<=w;j++){
        if(map[i][j]=='*'){
          u=imap[i][j];
          for(k=0;k<4;k++){
            x=i+d[k<<1];
            y=j+d[k<<1|1];
            v=imap[x][y];
            if(map[x][y]=='*'){
              if((i+j)&1)
                g[u][v]=true;
              else
                g[v][u]=true;
            }
          }
        }
      }
    }
    printf("%dn",uN+vN-MaxMatch());
/*    printf("nn");
//    for(i=0;i<uN;i++){
//      if(yM[xM[i]]==i)
//        printf("%d > %dn",i,-xM[i]);
//    }
    printf("nn");*/
  }
  return 0;
}
```

## POJ 2692 Kindergarten

男孩女孩内部都互相认识，一些男孩和女孩认识。然后，问题是，要在这些男女孩中找出最多的人数出来，使他们之间都认识。建图的方法是：对于男孩和女孩，认识的相连。然后，把这个二分图，求其补图，对这个补图求最大独立集。补图的最大独立集，也就是原图中的最大团。

```c++
/*
补图的最大独立集，逆向思维
*/

#include <cstdio>
#include <cstring>

const int MAXN=205;
int uN,vN;
bool g[MAXN][MAXN];
int xM[MAXN],yM[MAXN];
bool chk[MAXN];
bool SearchPath(int u){
  int v;
  for(v=0;v<vN;v++){
    if(g[u][v]&&!chk[v]){
      chk[v]=true;
      if(yM[v]==-1||SearchPath(yM[v])){
        yM[v]=u;
        xM[u]=v;
        return true;
      }
    }
  }
  return false;
}

int MaxMatch(){
  int u,ret=0;
  memset(yM,-1,sizeof(yM));
  memset(xM,-1,sizeof(xM));
  for(u=0;u<uN;u++){
    if(xM[u]==-1){
      memset(chk,0,sizeof(chk));
      if(SearchPath(u))
        ret++;
    }
  }
  return ret;
}

int main(){
  int test=0,M,u,v,i;
  while(true){
    scanf("%d%d%d",&uN,&vN,&M);
    if(uN+vN+M==0)break;
    memset(g,-1,sizeof(g));
    for(i=0;i<M;i++){
      scanf("%d%d",&u,&v);
      g[u-1][v-1]=false;
    }
    printf("Case %d: %dn",++test,uN+vN-MaxMatch());
  }
  return 0;
}
```

## POJ 1548 Robots

收垃圾问题，用最少的路径数目覆盖所有的垃圾。如果垃圾 i 能够走到垃圾 j，则连上一天边。

```c++
/*
最小路径覆盖=点数-匹配数
对于所有能够从一个垃圾i走到垃圾j的点，连一个边。
*/

#include <cstdio>
#include <cstring>

const int MAXN=25*25;
int uN,vN;
bool g[MAXN][MAXN];
int xM[MAXN],yM[MAXN];
bool chk[MAXN];
bool SearchPath(int u){
  int v;
  for(v=0;v<vN;v++){
    if(g[u][v]&&!chk[v]){
      chk[v]=true;
      if(yM[v]==-1||SearchPath(yM[v])){
        yM[v]=u;
        xM[u]=v;
        return true;
      }
    }
  }
  return false;
}

int MaxMatch(){
  int u,ret=0;
  memset(yM,-1,sizeof(yM));
  memset(xM,-1,sizeof(xM));
  for(u=0;u<uN;u++){
    if(xM[u]==-1){
      memset(chk,0,sizeof(chk));
      if(SearchPath(u))
        ret++;
    }
  }
  return ret;
}

struct P{
  int x,y;
  int init(){
    scanf("%d%d",&x,&y);
    if(x==-1&&y==-1)
      return -1;
    if(x==0&&y==0)
      return 0;
    return 1;
  };
};

bool operator < (const P &a,const P &b){
  return a.x<=b.x&&a.y<=b.y;
}

P p[MAXN];

int main(){
  int N,i,j;
  while(true){
    if(p[0].init()==-1)break;
    for(i=1;p[i].init()!=0;i++);
    vN=uN=N=i;
    memset(g,0,sizeof(g));
    for(i=0;i<N;i++){
      for(j=0;j<N;j++){
        if(i!=j&&p[i]<p[j]){
          g[i][j]=true;
        }
      }
    }
    printf("%dn",N-MaxMatch());
  }
  return 0;
}
```

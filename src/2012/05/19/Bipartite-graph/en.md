---
title: "Bipartite Graph Topic"
date: 2012-05-19 08:08:17 +0000
---

Originally I meant to seriously work through several problem topics this semester, but because of all kinds of miscellaneous matters I didn't get this done at all. I was really helpless (organizing the school contest and invitational, the Denmark project, research projects, and all sorts of odds and ends), and also honestly just lazy (there is no excuse for that). The provincial contest is this week, so in the next few days I want to review the problems I solved some time ago, do some recovery training, and summarize things.

## Basic concepts

### Bipartite graph

A graph whose vertices can be divided into two disjoint sets such that vertices within the same set are not adjacent (there is no edge between them).

### Maximum matching

There is not much to say about this: pair up elements from the two sets one to one so that the number of pairs is as large as possible.

### Independent set

Choose some vertices from all vertices such that no two of them are connected by an edge.

### Maximum independent set

Among all independent sets, the one with the most vertices. (Not necessarily unique.)

### Minimum vertex cover

Choose some vertices so that every edge has at least one endpoint in this set.

### Minimum edge cover

Use as few edges as possible so that every vertex appears in at least one of the chosen edges.

### Minimum path cover\*

Use as few connected paths as possible to visit all vertices. In a DAG (directed acyclic graph), construct the corresponding bipartite graph by splitting the original vertices into two sets: `v1,v2..vn` and `u1,u2..un`. If there is an edge from `i` to `j` in the original graph, then add `vi->ui` in the bipartite graph. For this bipartite graph, compute the maximum matching; `n` minus that gives the minimum path cover. (If you map this `i`,`j` relationship back to the original graph, you will find that it means choosing as many matching `i`,`j` pairs as possible and connecting them with edges. The restriction is exactly that `i` and `j` can only be connected uniquely, not multiply, so the resulting subpaths are reduced. Initially the minimum number of paths is the number of vertices `n`, and each time you connect once, one path is reduced, so...)

### Complement graph

In the original graph, edges become non-edges, and non-edges become edges.

### Maximum clique

A subset of vertices in which every pair of vertices is connected, and among all such subsets, the one with the largest number of vertices.

## Some formulas

Maximum matching = minimum vertex cover

Minimum path cover\* = minimum edge cover = maximum independent set = number of vertices - maximum matching

Maximum clique = maximum independent set of the complement graph

## POJ 3041 Asteroids

The idea of the problem is to use the minimum number of row scan lines and column scan lines to cover all points. The graph construction idea is to treat row numbers and column numbers as the two vertex sets of a bipartite graph. If there is a point at that row and column that needs to be eliminated, add an edge. Then the problem becomes selecting some rows and columns, with the minimum total number, so that all points can be covered—namely the minimum vertex cover problem.

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

Given some points, use the minimum number of `2×1` or `1×2` tiles to cover them completely. The graph construction idea is that vertices are split into two kinds according to whether the sum of their coordinates is odd or even, and adjacent vertices are connected by an edge. For efficiency, all useful vertices are renumbered and stored in `imap`, then edges are added according to adjacency. The problem to solve in the end is the minimum edge cover.

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

Among the boys, everyone knows each other; among the girls, everyone also knows each other; and some boys know some girls. The problem is to choose the largest possible number of children such that every pair among them knows each other. The graph construction method is: connect a boy and a girl if they know each other. Then take the complement of this bipartite graph, and find the maximum independent set on that complement. The maximum independent set of the complement graph is exactly the maximum clique of the original graph.

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

This is a trash-collecting problem: use the minimum number of paths to cover all pieces of garbage. If garbage `i` can reach garbage `j`, then add an edge.

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
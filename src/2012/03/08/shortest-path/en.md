---
title: "Shortest Path Topic"
date: 2012-03-08 15:13:42 +0000
---

## Dijkstra

### Original algorithm

1. Divide the entire set of vertices into two sets: one set whose shortest paths have been finalized, and one set whose shortest paths have not.
2. Each step performs a relaxation.
3. Add the vertex currently closest to the source into the finalized set.
4. Use the newly added vertex to maintain the shortest distances of the vertices not yet added.
5. Continue until the target vertex is added.

Consider its similarity to Prim's minimum spanning tree algorithm.

Complexity: `O(V^2)`. It cannot handle graphs with negative edge weights.

### Optimization

For sparse graphs, the `V^2` complexity is too high.

We can consider using a heap to optimize the selection of the nearest vertex.

A common implementation uses a priority queue.

The complexity is approximately `O(E*logE)`.

These extreme problems are uncommon; you can refer to Jilin University's template:

```c++
#define typec int // type of cost
const typec inf = 0x3f3f3f3f; // max of cost
typec cost[E], dist[V];
int e, pnt[E], nxt[E], head[V], prev[V], vis[V];
struct qnode {
  int v;typec c;
  qnode(int vv = 0, typec cc = 0) :
      v(vv), c(cc) {
  }
  bool operator <(const qnode& r) const {
    return c > r.c;
  }
};
void dijkstra(int n, const int src) {
  qnode mv;
  int i, j, k, pre;
  priority_queue<qnode> que;
  vis[src] = 1;
  dist[src] = 0;
  que.push(qnode(src, 0));
  for (pre = src, i = 1; i < n; i++) {
    for (j = head[pre]; j != -1; j = nxt[j]) {
      k = pnt[j];
      if (vis[k] == 0 && dist[pre] + cost[j] < dist[k]) {
        dist[k] = dist[pre] + cost[j];
        que.push(qnode(pnt[j], dist[k]));
        prev[k] = pre;
      }
    }
    while (!que.empty() && vis[que.top().v] == 1)
      que.pop();
    if (que.empty())
      break;
    mv = que.top();
    que.pop();
    vis[pre = mv.v] = 1;
  }
}
inline void addedge(int u, int v, typec c) {
  pnt[e] = v;
  cost[e] = c;
  nxt[e] = head[u];
  head[u] = e++;
}
void init(int nv, int ne) {
  int i, u, v;
  typec c;
  e = 0;
  memset(head, -1, sizeof(head));
  memset(vis, 0, sizeof(vis));
  memset(prev, -1, sizeof(prev));
  for (i = 0; i < nv; i++)
    dist[i] = inf;
  for (i = 0; i < ne; ++i) {
    scanf("%d%d%d", &u, &v, &c); // %d: type of cost
    addedge(u, v, c); // vertex: 0 ~ n-1, directed edge
  }
}
```
## Floyd

A triple nested `for` loop over vertices, enumerating every possible relaxation.

The relaxation is: for an intermediate vertex `k`, try replacing the distance `i->j` with `i->k->j`.

Be careful not to reverse the order. The intermediate vertex loop must be the outermost one.

Complexity: `O(V^3)`. This algorithm has many variant applications—for example, finding, among all paths between two points, the one whose longest edge is as short as possible. The key is understanding the relaxation step.

## SPFA

1. Push the source vertex into the queue.
2. Loop while the queue is not empty:
3. Take a vertex out of the queue.
4. For each adjacent vertex of that vertex, if going through the popped vertex gives a shorter distance,
5. update the shortest distance.
6. If that vertex is not already in the queue, push it in.
7. End.

SPFA is one implementation of Bellman-Ford. In practice people usually use SPFA rather than Bellman-Ford directly. Its complexity is `O(kE)`. Except for a few worst cases, it is a very good algorithm.

```c++
typedef struct{
  int from,to,dis;
}E;
int N,M,X;
vector< vector<E> > map,map2;//map2 is the reverse of map
queue<int> que;
vector<bool> inQue;
vector<int> dis,dis2;//dis2 records the shortest path in the reversed graph
/*X is the source vertex*/
map.clear();
while(!que.empty())que.pop();
inQue.clear();
dis.clear();
map.resize(N+1);
inQue.resize(N+1,false);
dis.resize(N+1,INF);
map2.resize(N+1);//initialize map2
for(i=0;i<M;i++){
  scanf("%d%d%d",&e.from,&e.to,&e.dis);
  map[e.from].push_back(e);
}
que.push(X);
inQue[X]=true;
dis[X]=0;
while(!que.empty()){
  w=que.front();
  que.pop();
  inQue[w]=false;
  for(i=0;i<map[w].size();i++){
    if(dis[map[w][i].to]>dis[w]+map[w][i].dis){
      dis[map[w][i].to]=dis[w]+map[w][i].dis;
      if(!inQue[map[w][i].to]){
        que.push(map[w][i].to);
        inQue[map[w][i].to]=true;
      }
    }
  }
}
```
## Detecting negative cycles

1. In SPFA, a vertex is pushed into the queue `V` times repeatedly. (That is, relaxed more than `V` times.)
2. In Floyd, you find `f[i][i] < 0`. \*

## Problems

### POJ 1860 Currency Exchange

Given exchange rates, determine whether there exists a scheme to make money for free. With a small modification, shortest path becomes longest path; then just check whether the algorithm finds a positive cycle.

```c++
#include <cstdio>
#include <vector>
#include <queue>
using namespace std;

struct E{
  int from,to;
  double r,c;
  E(int _from,int _to,double _r,double _c){
    from=_from;
    to=_to;
    r=_r;
    c=_c;
  };
};

int n,m,s;
double v;
vector< vector<E> > map;
queue<int> que;
vector<bool> inQue;
vector<double> dis;
vector<int> rank;

int main(){
  int i,a,b;
  double r_ab,c_ab,r_ba,c_ba;
  bool fg;
  while(~scanf("%d%d%d%lf",&n,&m,&s,&v)){
    fg=false;
    map.clear();
    dis.clear();
    inQue.clear();
    rank.clear();
    while(!que.empty())que.pop();
    map.resize(n+1);
    dis.resize(n+1,0);
    inQue.resize(n+1,false);
    rank.resize(n+1,0);
    for(i=0;i<m;i++){
      scanf("%d%d%lf%lf%lf%lf",&a,&b,&r_ab,&c_ab,&r_ba,&c_ba);
      map[a].push_back(E(a,b,r_ab,c_ab));
      map[b].push_back(E(b,a,r_ba,c_ba));
    }
    que.push(s);
    inQue[s]=true;
    dis[s]=v;
    rank[s]=1;
    while(!que.empty()){
      a=que.front();
      que.pop();
      inQue[a]=false;
      for(i=0;i<map[a].size();i++){
        if(dis[map[a][i].to]<(dis[a]-map[a][i].c)*map[a][i].r){
        //  printf("%d -> %dn",a,map[a][i].to);
          dis[map[a][i].to]=(dis[a]-map[a][i].c)*map[a][i].r;
          if(!inQue[map[a][i].to]){
            rank[map[a][i].to]++;
            if(rank[map[a][i].to]>=n){
              fg=true;
              break;
            }
            que.push(map[a][i].to);
            inQue[map[a][i].to]=true;
          }
        }
      }
      if(fg){
        break;
      }
    }
    if(fg){
      puts("YES");
    }else{
      puts("NO");
    }
  }
  return 0;
}
```
### POJ 3259 Wormholes

For Wormholes, you just directly detect a negative cycle... blatantly so.

```c++
#include <cstdio>
#include <vector>
#include <queue>
using namespace std;

struct E{
  int from,to,d;
  E(int _from,int _to,int _d){
    from=_from;
    to=_to;
    d=_d;
  };
};

int n,m,s;
vector< vector<E> > map;
queue<int> que;
vector<bool> inQue;
vector<int> dis;
vector<int> rank;

int main(){
  int f,n,m,w;
  int i,j,s,e,t;
  bool fg;
  scanf("%d",&f);
  while(f--){
    scanf("%d%d%d",&n,&m,&w);
    fg=false;
    map.clear();
    dis.clear();
    inQue.clear();
    rank.clear();
    while(!que.empty())que.pop();
    map.resize(n+1);
    dis.resize(n+1,99999999);
    inQue.resize(n+1,false);
    rank.resize(n+1,0);
    for(i=0;i<m;i++){
      scanf("%d%d%d",&s,&e,&t);
      map[s].push_back(E(s,e,t));
      map[e].push_back(E(e,s,t));
    }
    for(i=0;i<w;i++){
      scanf("%d%d%d",&s,&e,&t);
      map[s].push_back(E(s,e,-t));
    }
    que.push(1);
    inQue[1]=true;
    dis[1]=0;
    rank[1]=1;
    while(!que.empty()){
      s=que.front();
      que.pop();
      inQue[s]=false;
      for(i=0;i<map[s].size();i++){
        if(dis[map[s][i].to]>dis[s]+map[s][i].d){
        //  printf("%d -> %dn",a,map[a][i].to);
          dis[map[s][i].to]=dis[s]+map[s][i].d;
          if(!inQue[map[s][i].to]){
            rank[map[s][i].to]++;
            if(rank[map[s][i].to]>=n){//if a vertex is enqueued >= n times, a negative cycle exists.
              fg=true;
              break;
            }
            que.push(map[s][i].to);
            inQue[map[s][i].to]=true;
          }
        }
      }
      if(fg){
        break;
      }
    }
    if(fg){
      puts("YES");
    }else{
      puts("NO");
    }
  }
  return 0;
}
```
### POJ 1062 Expensive Dowry

This is essentially a shortest path problem, but with some twists. It has a restriction: nodes have level differences, and under a particular path some nodes are unreachable.

To solve this, you can enumerate the level difference.

For example, if the chief is `x` and the limit is `n`, then enumerate:

x-n~x
x-n+1~x+1

```c++
#include <cstdio>
#include <vector>
#include <queue>
using namespace std;

struct E{
  int to,d;
  E(int _to,int _d){
    to=_to;
    d=_d;
  };
};

int n,m;
vector< vector <E> > map;
queue<int> que;
vector<bool> inQue;
vector<int> dis;
vector<int> lv;

int abs(int x){
  return x>0?x:-x;
}

int main(){
  int i,j,p,l,x,t,v;
  int ans;
  while(~scanf("%d%d",&m,&n)){
    map.clear();
    while(!que.empty())que.pop();
    lv.clear();
    map.resize(n+1);
    lv.resize(n+1);
    for(i=0;i<n;i++){
      scanf("%d%d%d",&p,&l,&x);
      lv[i+1]=l;
      map[i+1].push_back(E(0,p));
      for(j=0;j<x;j++){
        scanf("%d%d",&t,&v);
        map[i+1].push_back(E(t,v));
      }
    }
    lv[0]=lv[1];
    ans=99999999;
    for(j=0;j<=m;j++){
      inQue.clear();
      inQue.resize(n+1,false);
      inQue[1]=true;
      dis.clear();
      dis.resize(n+1,99999999);
      dis[1]=0;
      que.push(1);
      while(!que.empty()){
        x=que.front();
        que.pop();
        inQue[x]=false;
        for(i=0;i<map[x].size();i++){
          if(lv[map[x][i].to]>lv[1]+j)continue;
          if(lv[map[x][i].to]<lv[1]+j-m)continue;
          if(dis[map[x][i].to]>dis[x]+map[x][i].d){
            dis[map[x][i].to]=dis[x]+map[x][i].d;
            if(!inQue[map[x][i].to]){
              inQue[map[x][i].to]=true;
              que.push(map[x][i].to);
            }
          }
        }
      }
    //  printf("%d ~ %d %dn",lv[1]+j-m,lv[1]+j,dis[0]);
      if(ans>dis[0])ans=dis[0];
    }
    printf("%dn",ans);
  }
  return 0;
}
```
### POJ 2253 Frogger

You can solve it with Floyd, but change the transition a bit:

f(i,j)=min( f(i,j), max(f(i,k),f(k,j)) )
Explanation:

If you need to go through a third transfer point, then the minimum possible maximum jump is the larger edge on that transfer path; otherwise you cannot make the jump.

If jumping directly is shorter than going through an intermediate point, then why take the detour? That would not be the minimum possible maximum jump.

```c++
#include <cstdio>
#include <cmath>
#include <cstring>
#define N 205
const double esp=1e-5;
double d[N][N];
int x[N],y[N],n;

double min(double x,double y){
  return x<y?x:y;
}

double max(double x,double y){
  return x>y?x:y;
}

int main(){
  int i,j,k,t,cs=1;
  while(scanf("%d",&n),n){
    for(i=0;i<n;i++){
      d[i][i]=0;
      scanf("%d%d",&x[i],&y[i]);
      for(j=0;j<i;j++){
        d[i][j]=d[j][i]=sqrt(
          (x[i]-x[j])*(x[i]-x[j])
        +  (y[i]-y[j])*(y[i]-y[j])
        );
      }
    }
    for(k=0;k<n;k++){
      for(i=0;i<n;i++){
        if(i==k)continue;
        for(j=0;j<n;j++){
          if(i==j||k==j)continue;
          d[i][j]=
          min(
            d[i][j],
            max(
              d[i][k],
              d[k][j]
            )
          );
        }
      }
    }
    printf("Scenario #%dnFrog Distance = %.3fnn",cs++,d[1][0]);
  }
}
```
Please think about it: do you really have to use shortest path? Of course not. A binary search enumeration is actually a bit more efficient:

```c++
#include <cstdio>
#include <cmath>
#include <cstring>
#include <queue>
using namespace std;
#define N 205
const double esp=1e-5;
double d[N][N];
int x[N],y[N],n;
bool s[N];
queue<int> que;

int main(){
  int i,j,t,cs=1;
  double l,r,m;
  while(scanf("%d",&n),n){
    for(i=0;i<n;i++){
      d[i][i]=0;
      scanf("%d%d",&x[i],&y[i]);
      for(j=0;j<i;j++){
        d[i][j]=d[j][i]=sqrt(
          (x[i]-x[j])*(x[i]-x[j])
        +  (y[i]-y[j])*(y[i]-y[j])
        );
      }
    }
    l=0;
    r=d[0][1];
    while(r-l>esp){
      m=(r+l)/2;
      memset(s,0,sizeof(bool)*(n+1));
      s[0]=true;
      while(!que.empty())que.pop();
      que.push(0);
      while(!que.empty()){
        t=que.front();
        que.pop();
        for(i=0;i<n;i++){
          if(s[i])continue;
          if(d[t][i]>m)continue;
          s[i]=true;
          if(i==1)break;
          que.push(i);
        }
        if(s[1])break;
      }
      if(s[1]){
        r=m;
      }else{
        l=m;
      }
    }
    printf("Scenario #%dnFrog Distance = %.3fnn",cs++,m);
  }
}
```
### POJ 1125 Stockbroker Grapevine

For the stockbroker problem, find one person as the source such that, starting from that person, the farthest reachable person has the minimum distance among all choices.

After Floyd, just examine the matrix to find that person. `O(V^3+V^2)`.

```c++
#include <cstdio>
#include <cstring>
#define N 105

int d[N][N],n;

int main(){
  int i,j,k,t;
  int inf,ans,ans_i,tmp;
  while(scanf("%d",&n),n){
    memset(d,63,sizeof(d));
    inf=d[0][0];
    for(i=0;i<n;i++){
      scanf("%d",&j);
      while(j--){
        scanf("%d%d",&k,&t);
        d[i][k-1]=t;
      }
    }
    for(k=0;k<n;k++){
      for(i=0;i<n;i++){
        if(i==k)continue;
        for(j=0;j<n;j++){
          if(i==j)continue;
          if(j==k)continue;
          if(d[i][j]>d[i][k]+d[k][j])
            d[i][j]=d[i][k]+d[k][j];
        }
      }
    }
    ans=inf;
    for(i=0;i<n;i++){
      tmp=-1;
      for(j=0;j<n;j++){
        if(i==j)continue;
        if(d[i][j]==inf){
          tmp=-1;
          break;
        }
        if(d[i][j]>tmp)
          tmp=d[i][j];
      }
      if(tmp!=-1){
        if(ans>tmp){
          ans=tmp;
          ans_i=i+1;
        }
      }
    }
    if(ans==inf){
      printf("disjointn");
    }else{
      printf("%d %dn",ans_i,ans);
    }
  }
  return 0;
}
```
### POJ 2240 Arbitrage

Use Floyd, then check whether the distance from a node to itself is greater than 1.

Note: in this case, do not skip the cases where `i`, `j`, and `k` are equal!

```c++
#include <cstdio>
#include <cstring>
#include <string>
#include <map>
using namespace std;

int n;
double t[40][40];
map<string,int> v;

int main(){
  int i,j,k,m;
  bool fg;
  char a[60],b[60],money[60];
  double p;
  int cs=1;
  while(scanf("%d",&n),n){
    fg=false;
    v.clear();
    for(i=0;i<n;i++){
      scanf("%s",money);
      v[money]=i;
    }
    memset(t,0,sizeof(t));
    for(i=0;i<n;i++)
      t[i][i]=1;
    scanf("%d",&m);
    while(m--){
      scanf("%s%lf%s",a,&p,b);
      t[v[a]][v[b]]=p;
    }
    for(k=0;k<n;k++){
      for(i=0;i<n;i++){
        for(j=0;j<n;j++){
          if(t[i][j]<t[i][k]*t[k][j]){
            t[i][j]=t[i][k]*t[k][j];
          }
        }
      }
    }
    for(i=0;i<n;i++){
      if(t[i][i]>1){
        fg=true;
        break;
      }
    }
    if(fg){
      printf("Case %d: Yesn",cs++);
    }else{
      printf("Case %d: Non",cs++);
    }
  }
  return 0;
}
```
That concludes this easy-problem report.

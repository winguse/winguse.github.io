---
title: "Translated English Version"
date: 2012-05-19 08:08:17 +0000
---

translated text，translated text，translated text，translated text（translated text、translated text，translated text、translated text），translated text（translated text）。translated text，translated text，translated text，translated text，translated text。

## translated text

### translated text

translated text（translated text）translated text。

### translated text

translated text，translated text，translated text。

### translated text

translated text，translated text，translated text。

### translated text

translated text，translated text。（translated text）

### translated text

translated text，translated text。

### translated text

translated text，translated text。

### translated text\*

translated text，translated text。translated text DAG（translated text）translated text，translated text：translated text：v1,v2..vn translated text u1,u2..un。translated text i translated text j translated text，translated text vi->ui。translated text，translated text，n translated text。（translated text i、j translated text，translated text，translated text i、j translated text，translated text，i、j translated text，translated text，translated text。translated text，translated text n，translated text，translated text，translated text……）

### translated text

translated text，translated text，translated text。

### translated text

translated text，translated text，translated text，translated text。

## translated text

translated text=translated text

translated text\*=translated text=translated text=translated text-translated text

translated text=translated text

## POJ 3041 Asteroids

translated text，translated text translated text，translated text。translated text，translated text，translated text，translated text，translated text，translated text，translated text，translated text，translated text。

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

translated text，translated text 2×1 translated text 1×2 translated text。translated text，translated text，translated text，translated text，translated text。translated text，translated text，translated text，translated text imap translated text，translated text，translated text。translated text，translated text。

```c++
/*
translated text，translated text
translated text×，translated text×translated text，×translated text
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

translated text，translated text。translated text，translated text，translated text，translated text。translated text：translated text，translated text。translated text，translated text，translated text，translated text。translated text，translated text。

```c++
/*
translated text，translated text
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

translated text，translated text。translated text i translated text j，translated text。

```c++
/*
translated text=translated text-translated text
translated textitranslated textjtranslated text，translated text。
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

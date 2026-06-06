---
title: "Maximum Bipartite Matching Template"
date: 2010-12-01 14:30:33 +0000
---

Tonight a few of us studied this problem.
This is a maximum bipartite matching template, and also a template for minimum path cover. It corresponds to POJ1422, a straightforward one.

```c++
#include <stdio.h>

/*

Maximum bipartite matching template

Minimum path cover template (minimum path count = number of vertices - maximum bipartite matching)
*/

#include <string.h>// required for memset
#define Na 125// size of set A
#define Nb 125// size of set B

bool a2b[Na][Nb]/*relation matrix*/,visited[Nb];/*whether visited in one DFS*/
int link[Nb]/*matched predecessor in set B, points to A*/,A,B/*current sizes of sets A and B*/;

bool find(int x){//search function
  int i;
  for(i=1;i<=B;i++){
    if(!visited[i]&&a2b[x][i]){
      visited[i]=true;
      if(link[i]==-1||find(link[i])){
        link[i]=x;
        return true;
      }
    }
  }
  return false;
}

int main(){
  int itr,i,a,b,ans,cs;
  scanf("%d",&cs);
  while(cs--){
    scanf("%d%d",&A,&itr);
    B=A;//current capacity
    memset(a2b,0,sizeof(a2b));//initialize relations
    memset(link,-1,sizeof(link));//initialize B matching predecessor
    ans=0;//matching count
    for(i=0;i<itr;i++){
      scanf("%d%d",&a,&b);
      a2b[a][b]=true;//build relation
    }
    for(i=1;i<=A;i++){
      memset(visited,0,sizeof(visited));//initialize for each match attempt
      if(find(i))ans++;//count
    }
    printf("%dn",A-ans);//minimum path cover
  }
  return 0;
}
```

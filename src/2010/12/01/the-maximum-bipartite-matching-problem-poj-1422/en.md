---
title: "Maximum Bipartite Matching Template"
date: 2010-12-01 14:30:33 +0000
---

Tonight a few of us studied this problem.
This is a maximum bipartite matching template, and also a minimum path cover template. It corresponds to POJ1422, an easy one.

```c++
#include <stdio.h>

/*

Bipartite graph maximum matching template

Minimum path cover template (minimum paths = number of vertices - maximum bipartite matching count)
*/

#include <string.h>//memset required
#define Na 125//size of set A
#define Nb 125//size of set B

bool a2b[Na][Nb]/*adjacency matrix*/,visited[Nb];/*whether a node has been visited in the current search*/
int link[Nb]/*predecessor of set B pointing to A*/,A,B/*current sizes of sets A and B*/;

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
    B=A;//current processing capacity
    memset(a2b,0,sizeof(a2b));//initialize adjacency matrix
    memset(link,-1,sizeof(link));//initialize predecessors for B
    ans=0;//bipartite matching count
    for(i=0;i<itr;i++){
      scanf("%d%d",&a,&b);
      a2b[a][b]=true;//establish relationship
    }
    for(i=1;i<=A;i++){
      memset(visited,0,sizeof(visited));//initialize before each matching
      if(find(i))ans++;//count
    }
    printf("%dn",A-ans);//minimum path cover
  }
  return 0;
}
```

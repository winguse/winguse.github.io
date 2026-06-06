---
title: "Maximum Bipartite Matching Template"
date: 2010-12-01 14:30:33 +0000
---

Tonight a few of us studied this problem.
This is a maximum bipartite matching template, and also a minimum path cover template. It corresponds to POJ1422, an easy one.

```c++
#include <stdio.h>

/*

二分图最大匹配模板

最小覆盖路径模板 (最小路径=点数-最大二分匹配数)
*/

#include <string.h>//memset需要
#define Na 125//集合A数量
#define Nb 125//集合B数量

bool a2b[Na][Nb]/*关系矩阵*/,visited[Nb];/*单次查找是否已经查过*/
int link[Nb]/*集合B连接的前驱，指向A*/,A,B/*当前处理的A，B集合大小*/;

bool find(int x){//查找函数
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
    B=A;//当前处理容量
    memset(a2b,0,sizeof(a2b));//初始化关系
    memset(link,-1,sizeof(link));//初始化B前驱连接
    ans=0;//二分匹配数量
    for(i=0;i<itr;i++){
      scanf("%d%d",&a,&b);
      a2b[a][b]=true;//关系建立
    }
    for(i=1;i<=A;i++){
      memset(visited,0,sizeof(visited));//每次匹配初始化
      if(find(i))ans++;//记数
    }
    printf("%dn",A-ans);//最小覆盖路径
  }
  return 0;
}
```

---
layout: post
title: "POJ水题集合"
date: 2010-11-06 02:22:15 +0000
---

最近，恢复一下acm的状态，开始做一点点题，但是，都是水题，所以不再做一个发一个了，直接做了一些之后，再发，省得真的洪水泛滥。不过，还是要努力学点东西的，水题没啥用处：

1250 Tanning Salon，模拟题，本来还想用栈的，但是，很明显，发现完全用不上。

```c++
#include <stdio.h>
#include <stack>
using namespace std;

int main(){
	int n,i,in,cr;
	char s[100];
	int c[256];
	stack<char> st;
	while(scanf("%d",&n),n!=0){
		scanf("%s",s);
		for(i='A';i<='Z';i++)c[i]=0;
		cr=in=0;
		for(i=0;s[i];i++){
			if(c[s[i]]){
				if(c[s[i]]==1)
					in--;
				c[s[i]]=0;
			}else{
				if(in<n){
					c[s[i]]=1;
					in++;
				}else{
					c[s[i]]=2;
					cr++;
				}
			}
		}
		if(cr==0){
			printf("All customers tanned successfully.n");
		}else{
			printf("%d customer(s) walked away.n",cr);
		}
	}
	return 0;
}
```

1017 Packets 有点经典的数学贪心问题：

```c++
#include <stdio.h>
//数学贪心分析
// 先放好6,5,4,3，然后放二，可以放在4，3的空位，最后1
int main(){
	int pg[7],sum,i,lf1,lf2;
	int u[4]={0,5,3,1};
	while(true){
		sum=0;
		for(i=1;i<=6;i++){
			scanf("%d",&pg[i]);
			sum+=pg[i];
		}
		if(sum==0)break;
		sum=pg[6]+pg[5]+pg[4]+(pg[3]+3)/4;
		lf2=pg[4]*5+u[pg[3]%4];
		if(lf2<pg[2]){
			sum+=(pg[2]-lf2+8)/9;
		}
		lf1=sum*36-pg[6]*36-pg[5]*25-pg[4]*16-pg[3]*9-pg[2]*4;
		if(pg[1]>lf1)
			sum+=(pg[1]-lf1+35)/36;
		printf("%dn",sum);
	}
	return 0;
}
```

1247 Magnificent Meatballs 简单到极点的模拟，可惜啊，掉进水坑里面了。

```c++
#include <stdio.h>
int main(){
	int sum,i,n,x[35],t;
	while(scanf("%d",&n),n!=0){
		for(i=sum=0;i<n;i++){
			scanf("%d",&x[i]);
			sum+=x[i];
		}
		for(i=t=0;i<n;i++){
			t+=x[i];
			if(t*2==sum){
				///水题啊，激动啊，掉进水坑里面了
				printf("Sam stops at position %d and Ella stops at position %d.n",i+1,i+2);
				break;
			}else if(t*2>sum){
				printf("No equal partitioning.n");
				break;
			}
		}
	}
	return 0;
}
```

1258 Agri-Net  最小生成树问题，之间Prime，但是很不幸啊，第一次第二次都没看好输入方式，TLE。

```c++
#include <stdio.h>
#define MAX 99999999
int main(){
	int map[105][105],n,i,j,ds[105],added,min,mini,sum;
	while(scanf("%d",&n)!=EOF){/*我正奇怪，怎么我Prime都会写错呢，原来输入结束写成了，n!=0，和题目的不一样了，所以TLE*/
		for(i=0;i<n;i++){
			for(j=0;j<n;j++)
				scanf("%d",&map[i][j]);
			ds[i]=MAX;
		}
		added=sum=mini=min=ds[0]=0;
		while(true){
			sum+=min;
			added++;
			ds[mini]=-1;
			for(i=0;i<n;i++){
				if(mini!=i&&map[mini][i]<ds[i])
					ds[i]=map[mini][i];
			}
			min=MAX;
			for(i=0;i<n;i++){
				if(ds[i]<min&&ds[i]!=-1){
					min=ds[i];
					mini=i;
				}
			}
			if(min==MAX)break;
		}
		printf("%dn",sum);
	}
	return 0;
}
```

3096 Surprising Strings 字符串格式比较

```c++
#include <stdio.h>
#include <string.h>
int main(){
	bool ex[30][30];
	int d,i,j,l;
	char s[100];
	while(scanf("%s",s),s[0]!='*'){
		l=strlen(s);
		for(d=0;d<=l-2;d++){
			memset(ex,0,sizeof(ex));
			for(i=0;i+d+1<l;i++){
				if(ex[s[i]-'A'][s[i+d+1]-'A']){
					printf("%s is NOT surprising.n",s);
					goto END;
				}
				ex[s[i]-'A'][s[i+d+1]-'A']=true;
			}
		}
		printf("%s is surprising.n",s);
		END:;
	}
	return 0;
}
```

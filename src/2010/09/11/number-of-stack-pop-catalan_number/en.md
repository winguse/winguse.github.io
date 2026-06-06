---
title: "Stack Pop Count Problem (Catalan Numbers)"
date: 2010-09-11 04:28:12 +0000
---

In *Data Structures* there is a problem asking: for 4 train cars entering and leaving a siding, how many possible output orders are there? When I first saw it I didn't want to do it at all—if I had had a computer nearby, a depth-first search would have solved it. Unfortunately I didn't, so I spent quite a while working it out carefully before finally getting the answer: 14.

Today, before the Harbin online contest, I was bored and decided to look into it again. I spent half an hour writing this DFS:

```c++
#include <stdio.h>
#include <stack>
#define N 25
using namespace std;

int res[N],pos,cnt,MaxN;
stack<int> st;

void test(int x){
  int i;
  if(pos==MaxN){//已经全部出去了，打印结果
    cnt++;
    printf("%5d:",cnt);
    for(i=0;i<pos-1;i++)
      printf("%3d",res[i]);
    printf("%3dn",res[i]);
    return;
  }
  //对于每一个新元素入栈，我们决策一下它前面的元素什么时候出栈
  if(!st.empty()){
    //一个个测试，当前栈顶的出去了
    res[pos++]=st.top();
    st.pop();
    //下一次递归再同样决策
    test(x);
    //递归返回了，把出去的拉回来
    st.push(res[--pos]);
  }
  if(x>MaxN)return;//大于MaxN的不考虑了
  //当前要决策的元素，可以加到栈里面了
  st.push(x);
  //决策下一个元素
  test(x+1);
  //状态还原，刚刚放进去的出来，好返回上一个数字继续找
  st.pop();
}

int main(){
  while(scanf("%d",&MaxN)!=EOF){
    if(MaxN<=N){
      pos=0;
      cnt=0;
      test(1);
    }else{
      printf("Max Input = %dn",N);
    }
  }
  return 0;
}
```

As the textbook problem requires, when MaxN=4 the result is:

```
4
1:  1  2  3  4
2:  1  2  4  3
3:  1  3  2  4
4:  1  3  4  2
5:  1  4  3  2
6:  2  1  3  4
7:  2  1  4  3
8:  2  3  1  4
9:  2  3  4  1
10:  2  4  3  1
11:  3  2  1  4
12:  3  2  4  1
13:  3  4  2  1
14:  4  3  2  1
```

After printing a few more results, I found that the number of pop sequences grows explosively. I wrote the recurrence on scratch paper. I discussed it by considering 1 as the starting element, then 2 as the starting element, then 3, and so on. They were respectively: f(n-1), f(n-1), f(n-2)+c(1,n-3)... Anyway, it was so complicated that I didn't want to sort it out. So I [Googled the first 7 output terms “1 2 5 14 42 132 429”](https://encrypted.google.com/search?hl=zh-CN&q=1+2+5+14+42+132+429), and discovered that this sequence is called the Catalan numbers. It seems to have quite a lot of applications. On [Wikipedia](http://zh.wikipedia.org/zh-cn/%E5%8D%A1%E7%89%B9%E5%85%B0%E6%95%B0), I saw this general formula:

![](/images/2010-09-11-d118d8cea7b639dfd5244fcba65910cf.png)

At first glance I was a bit dumbfounded. Uh... I admit I wouldn't have been able to derive it myself~ Sigh, my math really wasn't good enough~

Quoting [Wikipedia](http://zh.wikipedia.org/zh-cn/%E5%8D%A1%E7%89%B9%E5%85%B0%E6%95%B0):

> The first few terms are ([sequence A000108](http://oeis.org/A000108) in [OEIS](http://zh.wikipedia.org/zh-cn/%E6%95%B4%E6%95%B8%E6%95%B8%E5%88%97%E7%B7%9A%E4%B8%8A%E5%A4%A7%E5%85%A8)):
> 1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, 16796, 58786, 208012, 742900, 2674440, 9694845, 35357670, 129644790, 477638700, 1767263190, 6564120420, 24466267020, 91482563640, 343059613650, 1289904147324, 4861946401452, ...

Wow, the numbers get huge~

---
title: "Stack Pop Sequence Count (Catalan Numbers)"
date: 2010-09-11 04:28:12 +0000
---

There is a problem in *Data Structures*: for 4 train cars entering and leaving a siding, how many output orders are possible? I did not want to solve it by hand at first—if I had a computer nearby, a DFS would do it quickly. Unfortunately I did not, so I worked it out carefully and finally got 14.

Before today's Harbin online contest, I had some spare time and wrote this DFS in about half an hour:

```c++
#include <stdio.h>
#include <stack>
#define N 25
using namespace std;

int res[N],pos,cnt,MaxN;
stack<int> st;

void test(int x){
  int i;
  if(pos==MaxN){//all cars have been popped, print one result
    cnt++;
    printf("%5d:",cnt);
    for(i=0;i<pos-1;i++)
      printf("%3d",res[i]);
    printf("%3dn",res[i]);
    return;
  }
  //for each newly pushed element, decide when previous elements should pop
  if(!st.empty()){
    //try popping the current top
    res[pos++]=st.top();
    st.pop();
    //make the same decision recursively
    test(x);
    //restore state after recursion
    st.push(res[--pos]);
  }
  if(x>MaxN)return;//ignore values larger than MaxN
  //push current element to be decided
  st.push(x);
  //decide for next element
  test(x+1);
  //restore state for backtracking
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

As required by the textbook problem, the output for `MaxN=4` is:

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

After printing more results, I noticed the number of pop sequences grows explosively. I sketched a recurrence on paper by splitting into cases where 1 starts first, 2 starts first, 3 starts first, and so on, giving terms like `f(n-1)`, `f(n-1)`, `f(n-2)+c(1,n-3)`... very messy, and I did not want to fully organize it. So I [Googled the first 7 terms: "1 2 5 14 42 132 429"](https://encrypted.google.com/search?hl=zh-CN&q=1+2+5+14+42+132+429), and found this sequence is the Catalan numbers, which have many applications. On [Wikipedia](http://zh.wikipedia.org/zh-cn/%E5%8D%A1%E7%89%B9%E5%85%B0%E6%95%B0), I found the closed form:

![](/images/2010-09-11-d118d8cea7b639dfd5244fcba65910cf.png)

I was a bit stunned by it. I admit I probably could not derive it myself—my math foundation is not great.

Quoted from [Wikipedia](http://zh.wikipedia.org/zh-cn/%E5%8D%A1%E7%89%B9%E5%85%B0%E6%95%B0):

> The first few terms are (sequence [A000108](http://oeis.org/A000108) in [OEIS](http://zh.wikipedia.org/zh-cn/%E6%95%B4%E6%95%B8%E6%95%B8%E5%88%97%E7%B7%9A%E4%B8%8A%E5%A4%A7%E5%85%A8)):
> 1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, 16796, 58786, 208012, 742900, 2674440, 9694845, 35357670, 129644790, 477638700, 1767263190, 6564120420, 24466267020, 91482563640, 343059613650, 1289904147324, 4861946401452, ...

Wow, the numbers get huge.

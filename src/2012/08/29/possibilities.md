---
title: "从一个不平均概率分布获得一个平均的概率分布"
date: 2012-08-29 01:41:58 +0000
---

昨天百度二面有个题目是这样的，设一个随机函数 p()返回 0 的概率是 t，返回 1 的概率是 1-t，问如何重新封装这个函数，得到一个新函数，使均匀输出 0 和 1。

当时不及细想，脑子里面就蹦出个做两次 p()然后抑或一下，是不是就好了呢，说了出来，然后立刻被我自己找到反例了。

然后想到的办法是，做两次 p()，如果两次相同，则继续做两次，否则把第一次的结果返回。说了出来，显然这个是一个正确的方法，面试官也认可了，不过我也跟他说，这个是不考虑效率的办法，然后他问我，期望要做多少次才能返回……囧爆了，列了个多项式出来了，求了一会，告诉他，这个不好算诶……然后他也放弃问这个问题了。

刚刚躺在床上，灵机一动，让我想到一个更优美的办法。定义一个变量，这个变量每次调换都 0、1 调换。然后当这个变量是 1 的时候，原样返回 p()，否则返回!p()。这样子就每次调用一次即可了：

```c++
#include <cstdio>
#include <ctime>
#include <cstdlib>
 
bool p(){
    return rand()%3==0;
}
 
bool f(){
//  return p()==p()?false:true;///Wrong Answer
//  while(true){///Right, but slow
//      bool a=p();
//      bool b=p();
//      if(a==b)continue;
//      return a;
//  }
    static bool x=false;
    x=!x;
    return x?p():!p();///Right, and fast
}
 
int main(){
    srand(time(NULL));
    int p1=0,f1=0;
    for(int i=0;i<1000;i++){
        if(p()){
            p1++;
            putchar('1');
        }else{
            putchar('0');
        }
    }
    puts("");
    for(int i=0;i<1000;i++){
        if(f()){
            f1++;
            putchar('1');
        }else{
            putchar('0');
        }
    }
    puts("");
    printf("%d %d\n",p1,f1);
    return 0;
}
```

上面是实验代码。实际上，这个新加入的变量，相当于我自己的随机数表，所以就调整成平均的了。

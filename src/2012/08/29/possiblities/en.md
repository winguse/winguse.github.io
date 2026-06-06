---
title: "Getting a Uniform Distribution from a Biased One"
date: 2012-08-29 01:41:58 +0000
---

Yesterday, in my second-round interview at Baidu, I got this question: suppose a random function `p()` returns `0` with probability `t` and `1` with probability `1-t`. How can we wrap this function to build a new one that outputs `0` and `1` uniformly?

I answered too quickly at first. I thought, "Call `p()` twice and XOR the results; maybe that's enough?" I said it out loud, and immediately found a counterexample myself.

Then I came up with another method: call `p()` twice; if the two results are the same, repeat; otherwise return the first result. This is clearly correct, and the interviewer agreed. But I also said it ignores efficiency. He then asked for the expected number of calls before returning... awkward. I wrote a polynomial, tried to solve it for a while, then said it was not easy to compute, and he moved on.

Just now, lying in bed, I suddenly thought of a cleaner approach. Define a variable that flips between `0` and `1` each time. When it is `1`, return `p()` directly; otherwise return `!p()`. This way, you only call `p()` once per output:

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

The code above is an experimental demo. In practice, this added variable acts like my own balancing random table, so the output becomes even.

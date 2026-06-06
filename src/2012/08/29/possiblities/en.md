---
title: "Obtaining a Uniform Probability Distribution from a Non-uniform Probability Distribution"
date: 2012-08-29 01:41:58 +0000
---

Yesterday, in Baidu's second interview, there was a question like this: suppose a random function `p()` returns 0 with probability `t` and 1 with probability `1-t`. How can we wrap this function to get a new one that outputs 0 and 1 uniformly?

At the time I didn't think deeply enough. The first idea that popped into my head was to call `p()` twice and XOR the results—wouldn't that work? I said it out loud, and then immediately found a counterexample myself.

Then I thought of another method: call `p()` twice. If the two results are the same, keep calling it twice again; otherwise return the first result. I said that out loud, and obviously it is correct, and the interviewer agreed. But I also told him this method ignores efficiency. Then he asked me: what is the expected number of calls before it returns...? I was totally stumped. I wrote out a polynomial, worked on it for a while, and finally told him, "This is hard to calculate..." Then he gave up on that question too.

Just now, lying in bed, I suddenly had a flash of inspiration and came up with a more elegant method. Define a variable that flips between 0 and 1 every time. When this variable is 1, return `p()` directly; otherwise return `!p()`. This way, only one call is needed each time:

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
The code above is experimental code. In fact, this newly introduced variable is equivalent to my own random-number table, so the distribution gets adjusted to a uniform one.

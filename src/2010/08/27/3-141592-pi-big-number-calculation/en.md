---
title: "A Small Program for Calculating Pi_Arbitrary-Precision Algorithm Practice"
date: 2010-08-27 14:41:45 +0000
---

1. Formula used:

> `PI=2+1/3*(2+2/5*(2+3/7*(2+…(2+k/(k+1)*2)))….)))`

Simplified into an iterative form:

- Initial value: PI=2
- Iterative loop:

  - PI=PI*i/(2*i+1)+2
  - Here, `i` is the iteration variable, going from a very large number down to 1. As long as this number is large enough,
  - the precision of PI will be higher.

  The formula came from the internet, but the original URL has been lost. Sorry about that.

2. To ensure efficiency, the arbitrary-precision arithmetic uses base 10000.

3. Because of the limitations of this arbitrary-precision problem, it cannot multiply/divide by a relatively large number (the multiplication result cannot exceed 31 bits, and the divisor in division cannot exceed 31 bits; multiplication is relatively easier to handle, while division is more troublesome), so it cannot compute PI to infinitely many digits.

4. Discussion of the processing limits of this program

Maximum number of iterations: 107382;  
Highest precision: the 32327th digit after the decimal point;  
The details are as follows:

```
…861893818959054203… (PI的值)
…       |              (竖线标记了小数点后第32327位)
…861893815             (运算结果)
```

Actually, this program is already rather inefficient. Even if the implementation limit were not reached, continuing to calculate would not be very meaningful.
So I did not further modify the arbitrary-precision algorithm here. If you want much greater precision, it's better to switch to a different algorithm for PI.

5. The number of iterations is roughly 3.4 times the number of digits of precision required.

6. Detail: performing multiplication first and then division causes severe precision loss (no matter how many iterations are used,
   there are only a little over 750 digits of precision). I suspect this is related to remainder handling, but I did not investigate the details deeply. So in the revised version,
   division is done first, and multiplication afterward.

7. The precision of this program was verified by comparing it with SuperPI's results.

```c++
#include <stdio.h>
#define T 330/*迭代次数，最大：107382*/
#define N 25
/*数组保存小数部分的长度，精度的四分之一，最大：32327/4=8081.75，也就是8082*/
/*试验表明，迭代330次算的PI小数点后的100位已经是精确的了*/

int main(){
  int PI[N+1]={0},i,j,k,t;
  PI[0]=2;/*初始化*/
  for(i=T;i;i--){
  /* PI/(2*i+1) */
    t=0;/*除法了，这里保存余数，初始当然是0*/
    k=2*i+1;/*要除以的数，见PI的公式*/
    for(j=0;j<=N;j++){
      PI[j]+=t*10000;/*被除数是上一位的余数乘以进制再加上这一位上的数*/
      t=PI[j]%k;/*保存这次运算的余数，供下次使用*/
      PI[j]/=k;/*这次运算的结果*/
    }

  /* PI*i */
    t=0;/*保存乘法进位，初始当然是0*/
    for(j=N;j>=0;j--){
      t+=PI[j]*i;/*上次的进位加上这次乘得的结果就是这次的值*/
      //if(t<0){printf("Overflown"); return 0;}/*运算超过精度限制了*/
      PI[j]=t%10000;/*本位只保存余数*/
      t/=10000;/*这里就是保存进位*/
    }
    //if(t)printf("Unexpected!n");
    /*如果成立了，也就是整数部分的结果大于10000了，明显是错误的。*/

  /* PI+2 */
    PI[0]+=2;
    /*加上2，由于整数2小数点后面是零，所以小数点后面的不参与运算了（不是废话么？）。*/
    //printf("%d %d.",i,PI[0]);int ii;
    //for(ii=1;ii<=N;ii++)printf("%.4d",PI[ii]);
    //printf("n");getchar(); /*一次次观察结果*/
  }
  printf("%d.n",PI[0]);/*第一位为整数部分*/
  for(i=1;i<=N;i++){
    printf("%.4d",PI[i]);/*%.4d输出结果占四位，而且，数值小要补零*/
    if(i%5==0)printf("n");/* 4*5=20 每20位输出作一行 */
  }
  printf("n");
  //getchar();
  return 0;
}
```

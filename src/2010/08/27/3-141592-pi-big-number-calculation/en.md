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
…861893818959054203… (the value of PI)
…       |              (vertical line marks the 32327th decimal digit)
…861893815             (computed result)
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
#define T 330/*number of iterations, max: 107382*/
#define N 25
/*length of the array for storing the decimal part, one quarter of the precision, max: 32327/4=8081.75, i.e. 8082*/
/*experiments show that 330 iterations produce accurate results to 100 decimal places*/

int main(){
  int PI[N+1]={0},i,j,k,t;
  PI[0]=2;/*initialization*/
  for(i=T;i;i--){
  /* PI/(2*i+1) */
    t=0;/*performing division; save the remainder here, initially 0*/
    k=2*i+1;/*the divisor, see the PI formula*/
    for(j=0;j<=N;j++){
      PI[j]+=t*10000;/*the dividend is the remainder from the previous digit multiplied by the base, plus the current digit*/
      t=PI[j]%k;/*save the remainder of this operation for next use*/
      PI[j]/=k;/*result of this operation*/
    }

  /* PI*i */
    t=0;/*save multiplication carry, initially 0*/
    for(j=N;j>=0;j--){
      t+=PI[j]*i;/*add the carry from last time to the product of this multiplication*/
      //if(t<0){printf("Overflown"); return 0;}/*computation exceeded precision limit*/
      PI[j]=t%10000;/*only save the remainder for this digit*/
      t/=10000;/*this saves the carry*/
    }
    //if(t)printf("Unexpected!n");
    /*if this holds, the integer part exceeds 10000, which is clearly an error.*/

  /* PI+2 */
    PI[0]+=2;
    /*add 2; since the decimal part of integer 2 is zero, the decimal digits are not involved (obviously).*/
    //printf("%d %d.",i,PI[0]);int ii;
    //for(ii=1;ii<=N;ii++)printf("%.4d",PI[ii]);
    //printf("n");getchar(); /*observe results step by step*/
  }
  printf("%d.n",PI[0]);/*first element is the integer part*/
  for(i=1;i<=N;i++){
    printf("%.4d",PI[i]);/*%.4d formats output as 4 digits, padding with zeros for small values*/
    if(i%5==0)printf("n");/* 4*5=20, output 20 digits per line */
  }
  printf("n");
  //getchar();
  return 0;
}
```

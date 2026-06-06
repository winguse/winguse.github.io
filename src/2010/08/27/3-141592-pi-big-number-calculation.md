---
title: "计算圆周率的小程序_高精度算法练习"
date: 2010-08-27 14:41:45 +0000
---

1. 使用的公式：

> `PI=2+1/3*(2+2/5*(2+3/7*(2+…(2+k/(k+1)*2)))….)))`

化简为迭代情况：

- 初始时：PI=2
- 循环迭代：

  - PI=PI*i/(2*i+1)+2
  - 其中 i 位迭代变量，从一个很大的数到 1，只要这个数足够大，
  - 那么 PI 的精度就越高。

  公式来源于互联网，原始网址已经丢失，对此感到抱歉。

2. 为了保证效率，高精度运算采用 10000 进制运算。

3. 由于此高精度问题，不能乘以/除以一个比较大的数（乘法的结果不能大于 31bit，除法的除数不能大于 31bit，乘法相对容易解决，除法就比较麻烦），所以不能计算无限位的 PI。

4. 关于本程序处理极限的讨论

迭代极限次数：107382；
最高精度：小数点后第 32327 位；
具体情况如下：

```
…861893818959054203… (the value of PI)
…       |              (vertical line marks the 32327th decimal digit)
…861893815             (computed result)
```

其实，这个程序的效率比较低了，即使没有处理极限，算下去也没有什么意义
所以这里不进行高精度算法修改了，要算更大精度的，最好去换 PI 的算法了。

5. 迭代次数大概是要求精度位数的 3.4 倍。

6. 细节：运算先做乘法，在做除法会造成精度严重损失（不论迭代多少次，
   都只有 750 多位精度），猜想是余数处理问题，具体细节未深究，所以修改后的，
   就先做除法，在做乘法。

7. 确定本程序精度参考了 SuperPI 的运算结果。

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

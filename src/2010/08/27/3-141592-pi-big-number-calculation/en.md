---
title: "Translated English Version"
date: 2010-08-27 14:41:45 +0000
---

1. translated text：

> `PI=2+1/3*(2+2/5*(2+3/7*(2+…(2+k/(k+1)*2)))….)))`

translated text：

- translated text：PI=2
- translated text：

  - PI=PI*i/(2*i+1)+2
  - translated text i translated text，translated text 1，translated text，
  - translated text PI translated text。

  translated text，translated text，translated text。

2. translated text，translated text 10000 translated text。

3. translated text，translated text/translated text（translated text 31bit，translated text 31bit，translated text，translated text），translated text PI。

4. translated text

translated text：107382；
translated text：translated text 32327 translated text；
translated text：

```
…861893818959054203… (PItranslated text)
…       |              (translated text32327translated text)
…861893815             (translated text)
```

translated text，translated text，translated text，translated text
translated text，translated text，translated text PI translated text。

5. translated text 3.4 translated text。

6. translated text：translated text，translated text（translated text，
   translated text 750 translated text），translated text，translated text，translated text，
   translated text，translated text。

7. translated text SuperPI translated text。

```c++
#include <stdio.h>
#define T 330/*translated text，translated text：107382*/
#define N 25
/*translated text，translated text，translated text：32327/4=8081.75，translated text8082*/
/*translated text，translated text330translated textPItranslated text100translated text*/

int main(){
  int PI[N+1]={0},i,j,k,t;
  PI[0]=2;/*translated text*/
  for(i=T;i;i--){
  /* PI/(2*i+1) */
    t=0;/*translated text，translated text，translated text0*/
    k=2*i+1;/*translated text，translated textPItranslated text*/
    for(j=0;j<=N;j++){
      PI[j]+=t*10000;/*translated text*/
      t=PI[j]%k;/*translated text，translated text*/
      PI[j]/=k;/*translated text*/
    }

  /* PI*i */
    t=0;/*translated text，translated text0*/
    for(j=N;j>=0;j--){
      t+=PI[j]*i;/*translated text*/
      //if(t<0){printf("Overflown"); return 0;}/*translated text*/
      PI[j]=t%10000;/*translated text*/
      t/=10000;/*translated text*/
    }
    //if(t)printf("Unexpected!n");
    /*translated text，translated text10000translated text，translated text。*/

  /* PI+2 */
    PI[0]+=2;
    /*translated text2，translated text2translated text，translated text（translated text？）。*/
    //printf("%d %d.",i,PI[0]);int ii;
    //for(ii=1;ii<=N;ii++)printf("%.4d",PI[ii]);
    //printf("n");getchar(); /*translated text*/
  }
  printf("%d.n",PI[0]);/*translated text*/
  for(i=1;i<=N;i++){
    printf("%.4d",PI[i]);/*%.4dtranslated text，translated text，translated text*/
    if(i%5==0)printf("n");/* 4*5=20 translated text20translated text */
  }
  printf("n");
  //getchar();
  return 0;
}
```

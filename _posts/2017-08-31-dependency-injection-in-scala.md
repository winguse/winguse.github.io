---
layout: post
title: "Scala 的反射依赖注入"
date: 2017-08-31 15:31:00 +0800
---

反射依赖注入（DI, Dependency Injection）或者也叫控制反转（IoC, Inverse of Control），是种高级程序设计的刚需吧。简单地说，它可以让实现一个功能逻辑的模块的时候，让你不用过分执着于这个模块的依赖从哪里来，以及他的生命周期。也算是掩盖复杂和形成部件之间的松散耦合。

反射依赖注入，我最早接触的是 [Spring](https://projects.spring.io/spring-framework/) ，那还是 `SSH`（`Spring`, `Structs`, `Hibernate`） 框架大行其道的时候。在微软工作的时候，组里的项目也曾用过 [Spring .NET](http://springframework.net)。

使用 `Spring` 这样的框架，工作流基本都是定义类型，然后配置各个类型的生命周期，以及配置注入到哪里。早期的配置方法通常是用 `xml` 的方式，后来 `Java` 出现了注解（annotation）的语法以后，`Spring` 也增加了对应的支持。那时候，基本就分成两派：

- 一派坚持使用 `xml` ，主要持的观点是，这样可以很方便一行不代码不改地改变运行时，这可是配置的一个 Key Feature 啊；用注解还要编译一次，多麻烦。
- 另外一派则认为，使用注解的方式配置，可以让编译器帮忙检查一些类型的问题，更加安全；用 `xml` 一个 typo 就被恶心了。

正所谓，软件工程里面没有银弹，所以，选什么还是见仁见智的。不过坦白说，上述这两种方式，总是逃不掉在运行时动态地管理容器里面的各个配置好的实例。所以，总有这样的事情会恶心人：

- 即使使用注解的方式配置，仍然有些问题，你不跑起来，你都不知道那里出问题了。
- 毕竟使用了大量反射，多少有点性能顾虑（虽然并不多）。
- 学习成本真的很高——配置复杂，而最明显的，而且其实很多工程师并不知道 `DI` 为何物（微软的那个项目里面，这个项目转到我们组的时候，我最惊讶的是，其他同事对这个概念一无所知）。

曾经，我也考虑过这些反射依赖注入的问题有没有更好的解决方案，实际上，如果从一个高一点抽象的角度思考，所有的配置，都是工程师设计和编写代码的时候预期中的，他们不会因为某一次运行而有不一样——换句话说，实际上，运行前他们都已经命中注定要那么去工作的——那么，为什么不把这些东西全部弄到编译时处理呢？

想归想，不过我倒没想清楚具体编译器要怎么处理这些问题。最近在学习和使用 `Scala`，[马老师](https://github.com/assiotis)提示过我使用 `Cake Pattern` 去解决一部分依赖的问题，我草草看了一眼相关的文章，觉得这个模式还是很有局限性的，并没在意。当我写着写着代码，想去用 `DI` 的时候，翻了一下各种框架，发现还是上面说的那种德行，最后还是放弃了使用框架，自己建了个工厂模式，解决了一部分问题。

因为，我第一次看到 `Scala` 里面的 `Cake Pattern` 的时候，我觉得，它有这些问题没有得到很好的解决：

- 嵌套式组合的时候：`A` 有一个成员是 `B` 的实例，`B` 的一个成员是 `C` 的实例，而你想注入的是 `C` 的成员。
- 一下子没看到对于每次都新建一个实例的注入应该是怎样的姿势。

当然，上面这些，都只是证明了我自己图样图森破，知道前几天 [Daniel](https://github.com/danielyli) 帮我做 CR 的时候，推荐我看[这个文章](http://jonasboner.com/real-world-scala-dependency-injection-di/)，我内心是震撼的，竟然有 `trait ***Component` 这样的操作！

那篇文章还讨论了点其他的，在说 `Scala` 里面的 `Cake Pattern` 也并没有明显地点出多层嵌套下面的实现方式，这里我想贴一个代码。

这里，我描述了一个建筑（Building）里面包含两个办公室（Office）：工程师的办公室（Engineer Office）和销售的办公室（Sale Office）；这两个办公室共享一个打印机（Printer）；最开始建设各个办公室的时候，我们并不关心这个打印机具体是那种打印机，或许是佳能（Cannon）还是说惠普（HP）。代码如下：

```scala
trait Printer {
  def print(something: String): Unit
}

class CannonPrinter extends Printer {
  def print(something: String): Unit = {
    println(s"print $something")
  }
}

trait NeedPrinter {
  def printer: Printer
}

trait SaleOfficeComponent {
  this: NeedPrinter =>

  class SaleOffice {
    def printSaleReport: Unit = {
      printer.print("sale report")
    }
  }
}

trait EngineerOfficeComponent {
  this: NeedPrinter =>

  class EngineerOffice {
    def printDesignDocument: Unit = {
      printer.print("design document")
    }
  }
}

trait BuildingComponent {
  this: SaleOfficeComponent with EngineerOfficeComponent =>

  class Building {
    val saleOffice = new SaleOffice
    val engineerOffice = new EngineerOffice

    def doBuiness: Unit = {
      saleOffice.printSaleReport
      engineerOffice.printDesignDocument
    }
  }
}

trait BuildingTrait extends BuildingComponent with SaleOfficeComponent with EngineerOfficeComponent with NeedPrinter

object BeijingBuilding extends BuildingTrait {

  val printerInstance = new CannonPrinter

  override def printer: Printer = {
    printerInstance
  }

  val buiding = new Building
  buiding.doBuiness
}
```

看上面的，最主要的技巧是，将所有原来的类型定义，都放到了一个个 `trait ***Compnent` 里面，然后这些 `Component` 就完成了一次次 `Cake Pettern` 的延迟依赖——只有你最后实例化的时候，你才需要关心那些还没定义好的实现。

注意，其实，包括类型，都被放到了 `Cake` 里面。如果换一种方式理解，实际上，这个相当于把各个类都封装在一个注入容器；在最后一步，实际上可以理解为，把原来所有割裂的 `Component` 都拼在一起，然后统一地配置缺失的那些没定义的类型——也就是原来使用类似 `Spring` 这样的注入框架的配置部分。

神奇的地方其实在于，你可以一直欠着具体实例的实现写代码，最后 `Cake Pettern` 一次性将所有空间联通，合并成一个类。外围的 `Component` 有点像是 `namespace` 的意味。

最后我做了一个 `BuildingTrait` 的东西，拼接了所有的依赖。实际上，这个也是最难看的地方了，毕竟如果你的程序很大，这个 `with` 就可能很恐怖。不过试想，这个你用注入框架，也是一样的道理，容器里面要管理的内容越多，配置越复杂。而现在带来了一个好处，如果你想拎出一个类做测试，编译器就会告诉你，你是不是漏了某一个依赖没拎出来，以及哪个实例没配置好。

关于实例的生命周期管理，这里我用的是 `def printer: Printer` ，实际上，如果是单例（Singleton），你是可以写成 `val printer: Printer` 的。不过这里，我这么写，只是想表示清楚，在最后的 `object BeijingBuilding` ，你可以很容易地实现了各种生命周期的管理，无论是积极单例（Eager Singleton），懒惰单例（Lazy Singleton）还是每次都新生成新的实例。嗯，当然也包括各种复杂的构造函数了——要知道，用 `Spring` 这种框架，如果构造函数包含参数，那简直是灾难啊。

嗯，先这样，我也还学习中。

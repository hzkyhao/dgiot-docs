---
layout: post
title: "LISP的七个原子操作"
description: ""
category: SICP
tags: [sicp, lisp]
---
看SICP时总是记不住这些，干脆写在这做个参考，主要是从[Lisp之根源](http://daiyuwen.freeshell.org/gb/rol/roots_of_lisp.html)抄的。

我们将 定义七个原始(从公理的意义上说)操作符: quote,atom,eq,car,cdr,cons,和 cond.
(quote x) 返回x.为了可读性我们把(quote x)简记 为'x.
```scheme
> (quote a)
a
> 'a
a
> (quote (a b c))
(a b c)
```
(atom x)返回原子t如果x的值是一个原子或是空表,否则返回(). 在Lisp中我们 按惯例用原子t表示真, 而用空表表示假.
```scheme	
> (atom 'a)
t
> (atom '(a b c))
()
> (atom '())
t
```
既然有了一个自变量需要求值的操作符, 我们可以看一下quote的作用. 通过引 用(quote)一个表,我们避免它被求值. 一个未被引用的表作为自变量传给象 atom这样的操作符将被视为代码:
```scheme
> (atom (atom 'a))
t
```
反之一个被引用的表仅被视为表, 在此例中就是有两个元素的表:
```scheme
> (atom '(atom 'a))
()
```
这与我们在英语中使用引号的方式一致. Cambridge(剑桥)是一个位于麻萨诸塞 州有90000人口的城镇. 而``Cambridge''是一个由9个字母组成的单词.
引用看上去可能有点奇怪因为极少有其它语言有类似的概念. 它和Lisp最与众 不同的特征紧密联系:代码和数据由相同的数据结构构成, 而我们用quote操作符 来区分它们.
(eq x y)返回t如果x和y的值是同一个原子或都是空表, 否则返回().
```scheme
> (eq 'a 'a)
t
> (eq 'a 'b)
()
> (eq '() '())
t
```
(car x)期望x的值是一个表并且返回x的第一个元素.
表示‘Contents of Address part of Register’ (寄存器的地址部分的内容)
名字car和cdr来自Lisp最初在IBM 704机器上的实现。在这种机器有一种取址模式，使人可以访问一个存储地址中的“地址（address）”部分和“减量（decrement）”部分。
```scheme
> (car '(a b c))
a
```
(cdr x)期望x的值是一个表并且返回x的第一个元素之后的所有元素.
读作'could-er',表示'Contents of Decrement part of Register' (寄存器的减量部分的内容) > (cdr '(a b c))
(b c)
(cons x y)期望y的值是一个表并且返回一个新表,它的第一个元素是x的值, 后 面跟着y的值的各个元素.
表示“构造（construct）”。
```scheme
> (cons 'a '(b c))
(a b c)
> (cons 'a (cons 'b (cons 'c '())))
(a b c)
> (car (cons 'a '(b c)))
a
> (cdr (cons 'a '(b c)))
(b c)
```
(cond (p1...e1) ...(pn...en)) 的求值规则如下. p表达式依次求值直到有一个 返回t. 如果能找到这样的p表达式,相应的e表达式的值作为整个cond表达式的 返回值.
```scheme
> (cond ((eq 'a 'b) 'first)
((atom 'a) 'second))
second
```
当表达式以七个原始操作符中的atom,eq,car,cdr,cons开头时,它的自变量总是要求值的.我们称这样 的操作符为函数. 另外两个操作符quote和cond开头的表达式以不同的方式求值. 当 quote表达式求值时, 它的自变量不被求值,而是作为整个表达式的值返回. 在 一个正确的cond表达式中, 只有L形路径上的子表达式会被求值.

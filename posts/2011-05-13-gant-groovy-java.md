---
layout: post
title: "使用gant混合编译groovy和java"
description: ""
category: JAVA
tags: [gant, groovy, java]
---
gant运行依赖groovy、ant，需要设置GANT_HOME、ANT_HOME、JAVA_HOME和GROOVY_HOME环境变量。但在groovy1.8中已经包含了ant对应的jar包，经测试不再需要ant（ANT_HOME环境还是需要设置的，gant的脚本会检查这个变量）。
然后我们配置build.gant脚本执行编译指令。
首先定义groovyc任务：
```groovy
ant.taskdef (  name : 'groovyc' , classname : 'org.codehaus.groovy.ant.Groovyc' )
```
定义lib文件：
```groovy
def lib =path { fileset(dir:"$app/lib") {
        include(name : "*.jar")
    }  
}
```
定义groovyc任务并使用javac内嵌属性
```groovy
groovyc (srcDir:srcDir,destDir:buildDir,classpath:lib) { 
    javac ( debug : 'on',nowarn:'on' ,target:1.6,source:1.6 ,deprecation:'on' )  {
        compilerarg(value:'-Xlint:unchecked')   //附加的编译参数
    }
}
```
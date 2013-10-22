[kino.base](#) - javascript base tools 
==================================================
How to use
--------------------------------------
use on a webpage
```html
	<script type="text/javascript" src="kino.base.js"></script>
```
create a namespace
```js
	kino.namespace("myspace.hello.world");
```

create object's property
```js
	var obj = {myProp: "propval"};
    kino.createProp(obj, "newProp.subProp", "hello world");
```

extend from Class
```js
	var MyClass = function () {
        this.name = 'Tom';
    };
    MyClass.prototype.hello = function () {
        return "hello " + this.name;
    }

    var obj = {name: 'James'};

    kino.extend(obj, MyClass);

    obj.hello(); //"hello James"
```

extend from obj
```js
    var obj = {};
    var extendObj = {
        text: 'hello'
    };

    kino.extend(obj, extendObj);

    obj.text //'hello'
```

 use observer model to trigger event
```js
    var obj = {};
    kino.extend(obj, kino.Events);

    obj.on("test", function (obj) {
        //obj.name  "kino"
    });
    
    obj.on("test.a", function (obj) {
        //obj.name  "kino"
    });

    obj.trigger("test", { name: "kino" });
    
    obj.off("test.a");
```




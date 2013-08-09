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

    obj.on("test", function (event, obj) {
        //obj.name  "kino"
    });

    obj.trigger("test", { name: "kino" });
```

use module after define it
```js
    kino.module("MyModule", function (expects) {
        expects.sayHello = function (name) { return "hello " + name;};
    });

    kino.use(["MyModule"], function (myModule) {
        //myModule.sayHello("kino") "hello kino"
    });
```

module can dependency on other module
```js
    kino.module("MyWord", function (exports) {
        exports.str = "hello";
    });

    kino.module("MyModule", ["MyWord"], function (myword, expects) {
        expects.sayHello = function (name) { return myword.str +" " + name; };
    });

    kino.use(["MyModule"], function (myModule) {
        //myModule.sayHello("kino") "hello kino"
    });
```

can define a module by json object
```js
    kino.module("model", {
        str: 'hello'
    });

    kino.use(["model"], function (model) {
        //model.str  'hello'
    });
```

use export to inject
```js
    kino.module("IService", {
        asynGetFlightData: function (callback) {
        }
    });

    kino.module("FlightController", ["IService"], function (IService, exports) {
        kino.extend(exports, kino.Events);

        exports.dosomething = function () {
            IService.asynGetFlightData(function (result) {
                exports.trigger("flightDataLoaded", [result]);
            });
        }
    });

    kino.export("IService", {
        asynGetFlightData: function (callback) {
            callback([{ id: '123' }, { id: '234' }]);
        }
    });

    kino.use(["FlightController"], function (controller) {
        controller.on("flightDataLoaded", function (e, result) {
            //result[0].id  '123'
            //result[1].id  '234'
        });
        controller.dosomething();
    });
```



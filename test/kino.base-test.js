/// <reference path="../lib/kino.base.js" />
/// <reference path="qunit/qunit.js" />

module("namespace");

test("can create a namespace", function () {

    kino.namespace("myspace");

    notEqual(myspace, undefined);

    kino.namespace("myspace.hello");

    notEqual(myspace.hello, undefined);

    kino.namespace("myspace.hello.world");

    notEqual(myspace.hello.world, undefined);
});

test("if the namespace is exist, kino.namespace should not replace it", function () {

    kino.namespace("myspace");

    myspace.name = "my name";

    kino.namespace("myspace");

    equal(myspace.name, "my name");

});

module("property");

test("can create object's property", function () {
    var obj = {myProp: "propval"};
    kino.createProp(obj, "newProp.subProp", "hello world");
    equal(obj.newProp.subProp, "hello world");
});

module("extend");

test("can extend from Class", function () {
    var MyClass = function () {
        this.name = 'Tom';
    };
    MyClass.prototype.hello = function () {
        return "hello " + this.name;
    }

    var obj = {name: 'James'};

    kino.extend(obj, MyClass);

    equal(obj.hello(), "hello James");
});

test("can extend from obj", function () {
    var obj = {};
    var extendObj = {
        text: 'hello'
    };

    kino.extend(obj, extendObj);

    equal(obj.text, 'hello');
});

module("observer");

test("can use observer model to trigger event", function () {
    expect(2);

    var obj = {};

    kino.extend(obj, kino.Events);

    obj.on("alert", function () {
        ok(true);
    });

    obj.on("alert", function () {
        ok(true);
    });

    obj.trigger("alert");

});

test("can pass data to event handler", function () {
    expect(3);

    var obj = {};
    kino.extend(obj, kino.Events);

    obj.on("test", function (event, a, b) {
        equal(a, "hello");
        equal(b, "world");
    });

    obj.on("other", function (event, obj) {
        equal(obj.name, "kino");
    });

    obj.trigger("test", ["hello", "world"]);
    obj.trigger("other", { name: "kino" });

});

module("module and use");

test("can use module after define it", function () {
    expect(1);

    kino.module("MyModule", function (expects) {
        expects.sayHello = function (name) { return "hello " + name;};
    });

    kino.use(["MyModule"], function (myModule) {
        equal(myModule.sayHello("kino"), "hello kino");
    });
});

test("module can dependency on other module", function () {
    kino.module("MyWord", function (exports) {
        exports.str = "hello";
    });

    kino.module("MyModule", ["MyWord"], function (myword, expects) {
        expects.sayHello = function (name) { return myword.str +" " + name; };
    });

    kino.use(["MyModule"], function (myModule) {
        equal(myModule.sayHello("kino"), "hello kino");
    });

});

test("can define a module by json object", function () {
    kino.module("model", {
        str: 'hello'
    });

    kino.use(["model"], function (model) {
        equal(model.str, 'hello');
    });

});

test("can use export to inject", function () {
    expect(2);

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
            equal(result[0].id, '123');
            equal(result[1].id, '234');
        });
        controller.dosomething();
    });

});

test("export method should only influence the module that has dependency the export module", function () {
    expect(3);

    kino.module("IService", {
        myAPI: function () {
        }
    });

    kino.module("ModuleA", function () {
        ok(true);
    });

    kino.module("ModuleB", ["IService"], function () {
        ok(true);
    });

    kino.export("IService", {
        myAPI: function () {
            return "hello my api";
        }
    });

    kino.use(["ModuleA", "ModuleB"], function (a, b) {
    });

});



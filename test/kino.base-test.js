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

    obj.on("test", function (a, b) {
        equal(a, "hello");
        equal(b, "world");
    });

    obj.on("other", function (obj) {
        equal(obj.name, "kino");
    });

    obj.trigger("test", ["hello", "world"]);
    obj.trigger("other", { name: "kino" });

});

test("use event namespace", function () {
    expect(3);

    var obj = {};
    kino.extend(obj, kino.Events);

    obj.on("test.a", function (msg) {
        equal(msg, "hello")
    });

    obj.on("test.b", function (msg) {
        equal(msg, "hello");
    });

    obj.trigger("test", "hello");

    obj.trigger("test.b", "hello");
});

test("can remove all event", function () {
    expect(0);

    var obj = {};
    kino.extend(obj, kino.Events);

    obj.on("test1", function (msg) {
        equal(msg, "hello")
    });

    obj.on("test2", function (msg) {
        equal(msg, "hello");
    });

    obj.off();

    obj.trigger("test1");
    obj.trigger("test2");

});

test("can remove specify event", function () {
    expect(1);

    var obj = {};
    kino.extend(obj, kino.Events);

    obj.on("test1", function () {
        ok(false);
    });

    obj.on("test2", function () {
        ok(true);
    });

    obj.off("test1");

    obj.trigger("test1");
    obj.trigger("test2");
});

test("can remove specify event with event namespace", function () {
    expect(1);

    var obj = {};
    kino.extend(obj, kino.Events);

    obj.on("test.a", function () {
        ok(false);
    });

    obj.on("test.b", function () {
        ok(true);
    });

    obj.off("test.a");

    obj.trigger("test.a");
    obj.trigger("test.b");
});
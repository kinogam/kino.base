﻿/// <reference path="../lib/jquery.js" />
/// <reference path="qunit/qunit.js" />
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


//test("collection should listen add event", function () {
//    expect(1);
    
//    var collection = new kino.Collection();

//    collection.on("add", function (model) {
//        equal(collection.length, 1);
//    });

//    collection.add({name: 'James'});    

//});

//test("collection should listen remove event", function () {
//    expect(1);
    
//    var collection = new kino.Collection();
//    collection.add({ text: 'hello' });
//    collection.add({ text: 'world' });
//    collection.add({ text: '!' });

//    collection.on("remove", function (model) {
//        equal(collection.length, 2);
//    });

//    collection.add({name: 'James'});    

//});
﻿(function namespaceInit(window) {
    'use strict';
    var namespace = function (namespaceString) {
        ///<summary>
        /// 设置命名空间
        ///</summary>
        ///<param name="namespaceString" type="String">
        /// 命名空间字符串，如: n1.n2.n3
        ///</param>
        var sp = namespaceString.split('.');
        var node = window;
        for (var i = 0, len = sp.length; i < sp.length; i++) {
            var spName = sp[i];
            if (typeof node[spName] === 'undefined') {
                node[spName] = {};
            }
            node = node[spName];
        }
    };
    namespace("kino");
    kino.namespace = namespace;
})(window);

(function extendInit() {
    'use strict';
    kino.extend = function (obj, extendObj) {
        ///<summary>
        /// 扩展对象
        ///</summary>
        ///<param name="obj" type="Object">
        ///</param>
        ///<param name="Class" type="Object">
        ///</param>
        var props;
        if (typeof extendObj === 'function') {
            props = extendObj.prototype;
        }
        else {
            props = extendObj;
        }
        for (var prop in props) {
            if (typeof obj[prop] === 'undefined') {
                obj[prop] = props[prop];
            }
        }
    };

})();

(function eventsInit() {
    'use strict';
    var Events = function () {
    };
    Events.prototype = {
        on: function (eventName, callback) {
            this._events || (this._events = {});
            var eventList = this._events[eventName];
            eventList || (eventList = this._events[eventName] = []);
            eventList.push(callback);
        },
        //off: function () {

        //},
        trigger: function (eventName) {
            if (typeof this._events === 'undefined' || typeof this._events[eventName] === 'undefined') {
                return;
            }

            var eventList = this._events[eventName];

            for (var i = 0; i < eventList.length; i++) {
                eventList[i]();
            }
        }
    };
    kino.Events = Events;
})();

//(function collectionInit() {
//    'use strict';
//    kino.Collection = function () {
//        var _collection = massage();
//        kino.extend(_collection, kino.Events);
//        kino.extend(_collection, collectionExtend);
//        return _collection;
//    };

//    var collectionExtend = {
//        add: function (model) {
//            this.push(model);
//            this.trigger("add", model);
//        },
//        remove: function (model) {
//            var removeList = [];
//            for (var i = 0; i < this.length; i) {
//                var item = this[i];
//                var isMatch = false;

//                for (var prop in model) {
//                    if (item[prop] != model[prop]) {                        
//                        break;
//                        // removeList[removeList.length] = i;
//                    }
//                }
//            }
            
//        }
//    };

//})();
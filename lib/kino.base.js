(function namespaceInit(window) {
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
        for (var i = 0, len = sp.length; i < len; i++) {
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

(function createPropInit() {
    'use strict';

    kino.createProp = function (obj, propStr, propVal) {
        ///<summary>
        ///建立对象属性
        ///</summary>
        ///<param name="obj" type="Object">
        ///需要增加属性的对象
        ///</param>
        ///<param name="propStr" type="String">
        ///属性链字符串
        ///</param>
        ///<param name="propVal" type="*">
        ///属性值
        ///</param>

        var sp = propStr.split('.');
        var node = obj;
        for (var i = 0, len = sp.length; i < len; i++) {
            var spName = sp[i];
            if (typeof node[spName] === 'undefined') {
                node[spName] = {};
            }

            if (i === len - 1) {
                node[spName] = propVal;
            }
            else {
                node = node[spName];
            }
        }
    };

})();

(function extendInit() {
    'use strict';
    kino.extend = function (obj, extendObj) {
        ///<summary>
        /// 扩展对象
        ///</summary>
        ///<param name="obj" type="Object">
        ///被扩展的对象
        ///</param>
        ///<param name="extendObj" type="Object">
        ///扩展的对象
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
        trigger: function (eventName, data) {
            ///<summary>
            ///触发对象事件
            ///</summary>
            ///<param name="eventName" type="String">
            ///触发的事件名
            ///</param>
            ///<param name="data" type="Array" optional="true">
            ///传递过去的数据
            ///</param>

            if (typeof this._events === 'undefined' || typeof this._events[eventName] === 'undefined') {
                return;
            }

            var eventObj = {};//未实现
            var params = [eventObj];
            params = params.concat(data);

            var eventList = this._events[eventName];

            for (var i = 0; i < eventList.length; i++) {
                eventList[i].apply(null, params);
            }
        }
    };
    kino.Events = Events;
})();

if (typeof define === 'function' && define.amd) {
    define(function () {
        return kino;
    });
}
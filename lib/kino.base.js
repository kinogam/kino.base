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
        on: function (eventStr, callback) {
            ///<summary>
            ///监听事件
            ///</summary>
            ///<param name="eventStr" type="String">
            ///事件字符串，可包含命名空间
            ///</param>
            ///<param name="callback" type="Function">
            ///回调函数
            ///</param>

            this._events || (this._events = {});

            var eventObj = getEventObj(eventStr);

            var eventList = this._events[eventObj.eventName];
            eventList || (eventList = this._events[eventObj.eventName] = []);
            eventList.push({ ns: eventObj.namespace, fn: callback });
        },
        off: function (eventStr) {
            ///<summary>
            ///移除对象事件监听
            ///</summary>
            ///<param name="eventStr" type="String">
            ///事件名
            ///</param>

            if (typeof eventStr === 'undefined') {
                this._events = {};
            }
            else {
                var eventObj = getEventObj(eventStr);

                if (eventObj.namespace === '') {
                    delete this._events[eventObj.eventName];
                }
                else {
                    var eventList = this._events[eventObj.eventName];
                    var tempEventList = [];
                    for (var i = 0, len = eventList.length; i < len; i++) {
                        if (eventObj.namespace != eventList[i].ns) {
                            tempEventList.push(eventList[i]);
                        }
                    }

                    //如果监听事件列表为空，则整块事件移除
                    if (tempEventList.length === 0) {
                        delete this._events[eventObj.eventName];
                    }
                    else {
                        this._events[eventObj.eventName] = tempEventList;
                    }
                }
            }
        },
        trigger: function (eventStr, data) {
            ///<summary>
            ///触发对象事件
            ///</summary>
            ///<param name="eventName" type="String">
            ///触发的事件名
            ///</param>
            ///<param name="data" type="Array" optional="true">
            ///传递过去的数据
            ///</param>

            var eventObj = getEventObj(eventStr);

            if (typeof this._events === 'undefined' || typeof this._events[eventObj.eventName] === 'undefined') {
                return;
            }
            
            var eventList = this._events[eventObj.eventName];

            var fn = Object.prototype.toString.call(data) === '[object Array]' ? fnApply : fnCall;

            for (var i = 0; i < eventList.length; i++) {
                if (eventObj.namespace === '' || eventObj.namespace === eventList[i].ns) {
                    fn(eventList[i].fn, data);
                }
            }
        }
    };

    function fnApply(method, paramArray) {
        method.apply(null, paramArray);
    }

    function fnCall(method, paramObj) {
        method.call(null, paramObj);
    }

    function getEventObj(eventStr){
        var sp = eventStr.split('.'),
                eventName = sp[0],
                namespace = '';

        if (sp.length > 1) {
            sp.shift();
            namespace = sp.join('.');
        }
        return {eventName: eventName, namespace: namespace};
    }

    kino.Events = Events;
})();

if (typeof define === 'function' && define.amd) {
    define(function () {
        return kino;
    });
}
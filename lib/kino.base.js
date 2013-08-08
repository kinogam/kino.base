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


(function moduleInit() {
    var moduleHash = {};

    var module = function (moduleName, dependencyList, defineObj) {
        ///<summary>
        ///模块定义
        ///</summary>
        ///<param name="moduleName" type="String">
        ///模块名
        ///</param>
        ///<param name="dependencyList" optional="true" type="Array">
        ///依赖列表
        ///</param>
        ///<param name="defineObj" type="Function|Object">
        ///模块实现
        ///</param>

        var _moduleName, _dependencyList, _defineObj;

        _moduleName = arguments[0];

        if (arguments.length == 2) {
            _defineObj = arguments[1];
        }
        else if (arguments.length == 3) {
            _dependencyList = arguments[1];
            _defineObj = arguments[2];
        }

        var exports = {};

        if (typeof _dependencyList !== 'undefined') {
            
            var moduleList = [];
            for (var i = 0, len = _dependencyList.length; i < len; i++) {
                moduleList[moduleList.length] = moduleHash[_dependencyList[i]].exports;
            }
            moduleList[moduleList.length] = exports;

            _defineObj.apply(null, moduleList);
        }
        else if (typeof _defineObj === 'function') {
            _defineObj(exports);
        }
        else {
            exports = _defineObj;
        }
        moduleHash[moduleName] = { exports: exports, dependencyList: _dependencyList, defineObj: _defineObj };
    };
   
    var use = function (moduleList, useFn) {
        ///<summary>
        ///模块引用
        ///</summary>
        ///<param name="moduleList" type="Array">
        ///模块列表
        ///</param>
        ///<param name="useFn" type="Function">
        ///应用函数
        ///</param>

        var paramList = [];
        for (var i = 0, len = moduleList.length; i < len; i++) {
            paramList[paramList.length] = moduleHash[moduleList[i]].exports;
        }
        useFn.apply(null, paramList);
    };

    var _export = function (exportName, defineObj) {
        ///<summary>
        ///模块输出替换
        ///</summary>
        ///<param name="exportName" type="String">
        ///输出到指定的模块名
        ///</param>
        ///<param name="defineObj" type="Function|Object">
        ///输出实现
        ///</param>
        
        module(exportName, defineObj);

        for (var moduleName in moduleHash) {
            var item = moduleHash[moduleName];

            if (typeof item.dependencyList === 'undefined') {
                continue;
            }

            for (var i = 0, len = item.dependencyList.length; i < len; i++) {
                var dpName = item.dependencyList[i];
                //重新设置指定的模块的exports
                if (dpName === exportName) {
                    module(moduleName, item.dependencyList, item.defineObj);
                    break;
                }                
            }
        }

    };

    kino.module = module;

    kino.use = use;

    kino.export = _export;

})();
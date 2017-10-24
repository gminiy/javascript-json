"use strict";
var rl = require('./rl.js');
var polyfill = require('./polyfill.js');
var json_parse = require('./json_parse.js');
var messages = {
    err: function () {
        console.log("지원하지 않는 형식을 포함하고 있습니다.");
    }
}

var type = {
    "문자열": 0,
    "숫자": 0,
    "부울": 0,
    "객체": 0,
    "배열": 0
};

function printResult(type, parentType) {
    var total = Object.values(type).reduce(function (pre, cur) {
        return pre + cur;
    });
    var results = "총 " + total + "개의 " + parentType + " 데이터 중에 ";

    Object.keys(type).filter(function (key) {
        return type[key] !== 0
    }).map(function (key) {
        results += key + " " + type[key] + "개 ";
    });

    results += "포함되어 있습니다.";

    console.log(results);
}

function checkType(element) {
    if (typeof (element) === "boolean")
        type.부울++;
    else if (Number.isInteger(element))
        type.숫자++;
    else if (element.toString() === "[object Object]")
        type.객체++;
    else if (Array.isArray(element))
        type.배열++;
    else
        type.문자열++;
}

function arrayParse(array) {
    array.forEach(function (element) {
        checkType(element);
    });
    printResult(type, "배열");
}

function objectParse(object) {
    Object.values(object).forEach(function (element) {
        checkType(element);
    });
    printResult(type, "객체");
}

function jsonParse(json) {
    try {
        var parsedJSON = JSON.parse(json);
        parsedJSON.toString() === "[object Object]" ? objectParse(parsedJSON) : arrayParse(parsedJSON);

        function replacer(key, value) {
            if (typeof value === "string") {
                return undefined;
            }
            return value;
        }

        console.log(JSON.stringify(parsedJSON, replacer, 4));
    } catch (err) {
        messages.err();
    }
}
rl.question('분석할 JSON 데이터를 입력하세요.\n', (answer) => {

    jsonParse(answer);

    rl.close();
});
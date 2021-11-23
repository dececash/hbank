"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _i18nextBrowserLanguagedetector = _interopRequireDefault(require("i18next-browser-languagedetector"));

var _i18next = _interopRequireDefault(require("i18next"));

var _en_US = _interopRequireDefault(require("./locales/en_US.json"));

var _zh_CN = _interopRequireDefault(require("./locales/zh_CN.json"));

var _ko_KR = _interopRequireDefault(require("./locales/ko_KR.json"));

var _reactI18next = require("react-i18next");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var lang = localStorage.getItem("language");

if (!lang) {
  lang = 'zh_CN';
  localStorage.setItem("language", 'zh_CN');
}

_i18next["default"].use(_i18nextBrowserLanguagedetector["default"]).use(_reactI18next.initReactI18next).init({
  resources: {
    en_US: {
      translation: _en_US["default"]
    },
    zh_CN: {
      translation: _zh_CN["default"]
    },
    ko_KR: {
      translation: _ko_KR["default"]
    }
  },
  fallbackLng: lang,
  debug: false,
  interpolation: {
    escapeValue: false
  }
});

var _default = _i18next["default"];
exports["default"] = _default;
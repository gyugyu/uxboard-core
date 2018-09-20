"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Card_1 = __importDefault(require("@material-ui/core/Card"));
var Grid_1 = __importDefault(require("@material-ui/core/Grid"));
var lightGreen_1 = __importDefault(require("@material-ui/core/colors/lightGreen"));
var withStyles_1 = __importDefault(require("@material-ui/core/styles/withStyles"));
var classnames_1 = __importDefault(require("classnames"));
var React = __importStar(require("react"));
var EditableLabel_1 = __importDefault(require("./EditableLabel"));
var style = function (_theme) { return ({
    card: {
        backgroundColor: lightGreen_1.default.A100
    }
}); };
var Dimension = /** @class */ (function (_super) {
    __extends(Dimension, _super);
    function Dimension(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            name: '',
        };
        _this.handleLeaveEditMode = function (name) {
            _this.dbRef.update({ name: name });
            _this.setState({ name: name });
        };
        var id = props.id, dbRef = props.dbRef;
        _this.dbRef = dbRef.child(id);
        return _this;
    }
    Dimension.prototype.componentWillMount = function () {
        var _this = this;
        this.dbRef.on('value', function (snapshot) {
            if (snapshot != null) {
                var dimension = snapshot.val();
                if (dimension != null) {
                    _this.setState(__assign({}, dimension));
                }
            }
        });
    };
    Dimension.prototype.render = function () {
        var _a = this.props, classes = _a.classes, definedClasses = _a.definedClasses;
        var name = this.state.name;
        return (React.createElement(Grid_1.default, { item: true },
            React.createElement(Card_1.default, { className: classnames_1.default(definedClasses.card, classes.card) },
                React.createElement(EditableLabel_1.default, { definedClasses: definedClasses, initialValue: name, onLeaveEditMode: this.handleLeaveEditMode }))));
    };
    return Dimension;
}(React.Component));
exports.default = withStyles_1.default(style)(Dimension);

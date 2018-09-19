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
var CardContent_1 = __importDefault(require("@material-ui/core/CardContent"));
var TextField_1 = __importDefault(require("@material-ui/core/TextField"));
var Typography_1 = __importDefault(require("@material-ui/core/Typography"));
var React = __importStar(require("react"));
var EditableLabel = /** @class */ (function (_super) {
    __extends(EditableLabel, _super);
    function EditableLabel(props) {
        var _this = _super.call(this, props) || this;
        _this.handleDoubleClick = function () { return _this.setState({ isEditing: true }); };
        _this.handleKeyUp = function (evt) {
            var onLeaveEditMode = _this.props.onLeaveEditMode;
            var value = _this.state.value;
            if (evt.keyCode === 13 && evt.shiftKey && value !== '') {
                _this.setState({ isEditing: false });
                onLeaveEditMode(value);
            }
        };
        _this.setStateFromProps(props);
        return _this;
    }
    EditableLabel.prototype.componentWillReceiveProps = function (newProps) {
        this.setStateFromProps(newProps);
    };
    EditableLabel.prototype.setStateFromProps = function (props) {
        var initialValue = props.initialValue;
        this.state = {
            isEditing: initialValue === '',
            value: initialValue
        };
    };
    EditableLabel.prototype.render = function () {
        var _this = this;
        var classes = this.props.classes;
        var _a = this.state, isEditing = _a.isEditing, value = _a.value;
        return (React.createElement(CardContent_1.default, { className: classes.card3 }, isEditing ? (React.createElement(TextField_1.default, { value: value, onKeyUp: this.handleKeyUp, onChange: function (evt) { return _this.setState({ value: evt.target.value }); } })) : (React.createElement(Typography_1.default, { variant: 'title', onDoubleClick: this.handleDoubleClick }, value))));
    };
    return EditableLabel;
}(React.Component));
exports.default = EditableLabel;

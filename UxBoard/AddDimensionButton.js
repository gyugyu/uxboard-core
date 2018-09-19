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
var Button_1 = __importDefault(require("@material-ui/core/Button"));
var withStyles_1 = __importDefault(require("@material-ui/core/styles/withStyles"));
var Add_1 = __importDefault(require("@material-ui/icons/Add"));
var React = __importStar(require("react"));
var withFirebase_1 = __importDefault(require("../firebase/withFirebase"));
var styles = function (theme) { return ({
    fab: {
        right: 0,
        bottom: 0,
        margin: theme.spacing.unit * 2,
        position: 'fixed'
    }
}); };
var AddDimensionButton = /** @class */ (function (_super) {
    __extends(AddDimensionButton, _super);
    function AddDimensionButton(props) {
        var _this = _super.call(this, props) || this;
        var databasePrefix = props.databasePrefix, firebase = props.firebase;
        _this.dbRef = firebase.database().ref(databasePrefix + "/dimensions");
        return _this;
    }
    AddDimensionButton.prototype.render = function () {
        var _this = this;
        var classes = this.props.classes;
        return (React.createElement(Button_1.default, { variant: 'fab', color: 'primary', className: classes.fab, onClick: function () { return _this.dbRef.push({ name: '' }); } },
            React.createElement(Add_1.default, null)));
    };
    return AddDimensionButton;
}(React.Component));
exports.default = withFirebase_1.default(withStyles_1.default(styles)(AddDimensionButton));

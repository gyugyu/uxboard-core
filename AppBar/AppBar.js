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
var AppBar_1 = __importDefault(require("@material-ui/core/AppBar"));
var Button_1 = __importDefault(require("@material-ui/core/Button"));
var withStyles_1 = __importDefault(require("@material-ui/core/styles/withStyles"));
var Toolbar_1 = __importDefault(require("@material-ui/core/Toolbar"));
var Typography_1 = __importDefault(require("@material-ui/core/Typography"));
var React = __importStar(require("react"));
var withFirebase_1 = __importDefault(require("../firebase/withFirebase"));
var styles = function (theme) { return ({
    root: {
        flexGrow: 1,
        marginBottom: theme.spacing.unit * 2
    },
    grow: {
        flexGrow: 1
    }
}); };
var AppBar = /** @class */ (function (_super) {
    __extends(AppBar, _super);
    function AppBar(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isLoggedIn: false
        };
        _this.handleLoginClick = function () {
            _this.auth.signInWithRedirect(_this.props.authProvider);
        };
        _this.auth = props.firebase.auth();
        return _this;
    }
    AppBar.prototype.componentDidMount = function () {
        var _this = this;
        this.auth.onAuthStateChanged(function (user) {
            _this.setState({ isLoggedIn: user != null });
        });
    };
    AppBar.prototype.render = function () {
        var _this = this;
        var classes = this.props.classes;
        var isLoggedIn = this.state.isLoggedIn;
        return (React.createElement("div", { className: classes.root },
            React.createElement(AppBar_1.default, { position: "static" },
                React.createElement(Toolbar_1.default, null,
                    React.createElement(Typography_1.default, { variant: "title", color: "inherit", className: classes.grow }, "UX Board"),
                    isLoggedIn ? (React.createElement(Button_1.default, { color: "inherit", onClick: function () { return _this.auth.signOut(); } }, "Logout")) : (React.createElement(Button_1.default, { color: "inherit", onClick: this.handleLoginClick }, "Login"))))));
    };
    return AppBar;
}(React.Component));
exports.default = withFirebase_1.default(withStyles_1.default(styles)(AppBar));

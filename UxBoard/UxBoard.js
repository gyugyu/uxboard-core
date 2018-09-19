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
var Card_1 = __importDefault(require("@material-ui/core/Card"));
var CardContent_1 = __importDefault(require("@material-ui/core/CardContent"));
var Grid_1 = __importDefault(require("@material-ui/core/Grid"));
var withStyles_1 = __importDefault(require("@material-ui/core/styles/withStyles"));
var Typography_1 = __importDefault(require("@material-ui/core/Typography"));
var React = __importStar(require("react"));
var withFirebase_1 = __importDefault(require("../firebase/withFirebase"));
var AddDimensionButton_1 = __importDefault(require("./AddDimensionButton"));
var DimensionArea_1 = __importDefault(require("./DimensionArea"));
var styles = {
    board: {
        overflowX: 'scroll',
    },
    card: {
        alignItems: 'center',
        display: 'flex',
        width: 300,
        height: 200,
        justifyContent: 'center'
    },
    card2: {
        width: 300,
        height: 200,
    },
    card3: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center'
    },
    container: {
        flexWrap: 'nowrap'
    },
    noShadow: {
        boxShadow: 'none'
    },
    root: {
        flexGrow: 1,
        width: '120%'
    }
};
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            indices: [],
        };
        var databasePrefix = props.databasePrefix, firebase = props.firebase;
        _this.dbRef = firebase.database().ref(databasePrefix + "/indices");
        return _this;
    }
    App.prototype.componentWillMount = function () {
        var _this = this;
        this.dbRef.on('value', function (snapshot) {
            if (snapshot != null) {
                var indices = snapshot.val();
                _this.setState({ indices: indices });
            }
        });
    };
    App.prototype.render = function () {
        var classes = this.props.classes;
        var indices = this.state.indices;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: classes.board },
                React.createElement(Grid_1.default, { container: true, className: classes.root + " " + classes.container, spacing: 16 },
                    React.createElement(Grid_1.default, { item: true },
                        React.createElement(Grid_1.default, { container: true, direction: 'column', spacing: 16 }, indices.map(function (index) { return (React.createElement(Grid_1.default, { key: index.name, item: true },
                            React.createElement(Card_1.default, { className: classes.card + " " + classes.noShadow },
                                React.createElement(CardContent_1.default, null,
                                    React.createElement(Typography_1.default, { variant: 'title', component: 'p' }, index.name))))); }))),
                    React.createElement(DimensionArea_1.default, { classes: classes, indices: indices }))),
            React.createElement(AddDimensionButton_1.default, null)));
    };
    return App;
}(React.Component));
exports.default = withFirebase_1.default(withStyles_1.default(styles)(App));

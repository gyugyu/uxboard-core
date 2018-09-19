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
var Grid_1 = __importDefault(require("@material-ui/core/Grid"));
var React = __importStar(require("react"));
var withFirebase_1 = __importDefault(require("../firebase/withFirebase"));
var Dimension_1 = __importDefault(require("./Dimension"));
var DimensionTasks_1 = __importDefault(require("./DimensionTasks"));
var DimensionArea = /** @class */ (function (_super) {
    __extends(DimensionArea, _super);
    function DimensionArea(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            dimensions: {}
        };
        var databasePrefix = props.databasePrefix, firebase = props.firebase;
        _this.dbRef = firebase.database().ref(databasePrefix + "/dimensions");
        return _this;
    }
    DimensionArea.prototype.componentWillMount = function () {
        var _this = this;
        this.dbRef.on('value', function (snapshot) {
            if (snapshot != null) {
                var dimensions = snapshot.val();
                _this.setState({ dimensions: dimensions });
            }
        });
    };
    DimensionArea.prototype.render = function () {
        var _this = this;
        var _a = this.props, classes = _a.classes, indices = _a.indices;
        var dimensions = this.state.dimensions;
        return (React.createElement(Grid_1.default, { item: true },
            React.createElement(Grid_1.default, { container: true, direction: 'column', spacing: 16 },
                React.createElement(Grid_1.default, { item: true },
                    React.createElement(Grid_1.default, { className: classes.container, container: true, spacing: 16 }, Object.keys(dimensions).map(function (key) {
                        return (React.createElement(DimensionTasks_1.default, { classes: classes, dimension: dimensions[key], id: key, indices: indices, key: key }));
                    }))),
                React.createElement(Grid_1.default, { item: true },
                    React.createElement(Grid_1.default, { className: classes.container, container: true, spacing: 16 }, Object.keys(dimensions).map(function (key) { return (React.createElement(Dimension_1.default, { classes: classes, key: key, id: key, dbRef: _this.dbRef })); }))))));
    };
    return DimensionArea;
}(React.Component));
exports.default = withFirebase_1.default(DimensionArea);

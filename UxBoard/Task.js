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
var CardActions_1 = __importDefault(require("@material-ui/core/CardActions"));
var orange_1 = __importDefault(require("@material-ui/core/colors/orange"));
var pink_1 = __importDefault(require("@material-ui/core/colors/pink"));
var yellow_1 = __importDefault(require("@material-ui/core/colors/yellow"));
var Grid_1 = __importDefault(require("@material-ui/core/Grid"));
var IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
var Menu_1 = __importDefault(require("@material-ui/core/Menu"));
var MenuItem_1 = __importDefault(require("@material-ui/core/MenuItem"));
var MoreVert_1 = __importDefault(require("@material-ui/icons/MoreVert"));
var React = __importStar(require("react"));
var withFirebase_1 = __importDefault(require("../firebase/withFirebase"));
var interfaces_1 = require("./interfaces");
var EditableLabel_1 = __importDefault(require("./EditableLabel"));
var style = {
    yet: {
        backgroundColor: yellow_1.default.A100
    },
    doing: {
        backgroundColor: orange_1.default.A100
    },
    done: {
        backgroundColor: pink_1.default.A100
    }
};
var Task = /** @class */ (function (_super) {
    __extends(Task, _super);
    function Task() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            anchorEl: null,
            title: '',
            open: false,
            status: interfaces_1.TaskStatus.Yet
        };
        _this.handleLeaveEditMode = function (title) {
            var _a;
            var _b = _this.props, databasePrefix = _b.databasePrefix, dimensionId = _b.dimensionId, firebase = _b.firebase, indexId = _b.indexId;
            var db = firebase.database();
            if (_this.taskRef == null) {
                _this.taskRef = db.ref(databasePrefix + "/tasks").push();
                var newTaskId = _this.taskRef.key;
                var updates = (_a = {},
                    _a[databasePrefix + "/indices/" + indexId + "/tasks/" + newTaskId] = true,
                    _a[databasePrefix + "/dimensions/" + dimensionId + "/tasks/" + newTaskId] = true,
                    _a[databasePrefix + "/tasks/" + newTaskId] = {
                        title: title,
                        status: interfaces_1.TaskStatus.Yet
                    },
                    _a);
                db.ref().update(updates);
            }
            else {
                _this.taskRef.update({ title: title });
            }
            _this.setState({ title: title });
        };
        _this.createHandleClickMenuItem = function (status) { return function () {
            if (_this.taskRef != null) {
                _this.taskRef.update({ status: status });
            }
            _this.setState({ open: false, status: status });
        }; };
        return _this;
    }
    Task.prototype.setTaskRef = function () {
        var _this = this;
        var _a = this.props, databasePrefix = _a.databasePrefix, firebase = _a.firebase, id = _a.id;
        if (id != null && this.taskRef == null) {
            this.taskRef = firebase.database().ref(databasePrefix + "/tasks").child(id);
            this.taskRef.on('value', function (snapshot) {
                if (snapshot != null) {
                    var task = snapshot.val();
                    if (task != null) {
                        _this.setState(__assign({}, task));
                    }
                }
            });
        }
    };
    Task.prototype.componentWillMount = function () {
        this.setTaskRef();
    };
    Task.prototype.componentWillReceiveProps = function () {
        this.setTaskRef();
    };
    Task.prototype.render = function () {
        var _this = this;
        var classes = this.props.classes;
        var _a = this.state, anchorEl = _a.anchorEl, title = _a.title, status = _a.status, open = _a.open;
        var cardStyle;
        if (status === interfaces_1.TaskStatus.Doing) {
            cardStyle = style.doing;
        }
        else if (status === interfaces_1.TaskStatus.Done) {
            cardStyle = style.done;
        }
        else {
            cardStyle = style.yet;
        }
        return (React.createElement(Grid_1.default, { item: true },
            React.createElement(Card_1.default, { style: cardStyle, className: classes.card2 },
                React.createElement(EditableLabel_1.default, { classes: classes, initialValue: title, onLeaveEditMode: this.handleLeaveEditMode }),
                React.createElement(CardActions_1.default, null, this.taskRef && (React.createElement("div", null,
                    React.createElement(IconButton_1.default, { onClick: function (evt) { return _this.setState({ anchorEl: evt.currentTarget, open: true }); } },
                        React.createElement(MoreVert_1.default, null)),
                    React.createElement(Menu_1.default, { anchorEl: anchorEl, onClose: function () { return _this.setState({ anchorEl: null, open: false }); }, open: open },
                        status !== interfaces_1.TaskStatus.Yet && (React.createElement(MenuItem_1.default, { onClick: this.createHandleClickMenuItem(interfaces_1.TaskStatus.Yet) }, "Mark as yet")),
                        status !== interfaces_1.TaskStatus.Doing && (React.createElement(MenuItem_1.default, { onClick: this.createHandleClickMenuItem(interfaces_1.TaskStatus.Doing) }, "Mark as doing")),
                        status !== interfaces_1.TaskStatus.Done && (React.createElement(MenuItem_1.default, { onClick: this.createHandleClickMenuItem(interfaces_1.TaskStatus.Done) }, "Mark as done")))))))));
    };
    return Task;
}(React.Component));
exports.default = withFirebase_1.default(Task);

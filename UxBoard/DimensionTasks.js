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
var Task_1 = __importDefault(require("./Task"));
var DimensionTasks = /** @class */ (function (_super) {
    __extends(DimensionTasks, _super);
    function DimensionTasks() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DimensionTasks.prototype.render = function () {
        var _a = this.props, definedClasses = _a.definedClasses, dimension = _a.dimension, indices = _a.indices, id = _a.id;
        var tasks = dimension.tasks || {};
        var taskIds = Object.keys(tasks).filter(function (k) { return tasks[k]; });
        return (React.createElement(Grid_1.default, { item: true, xs: true },
            React.createElement(Grid_1.default, { container: true, direction: 'column', spacing: 16 }, indices.map(function (index, i) {
                var taskId;
                var iTasks = index.tasks;
                if (iTasks != null) {
                    taskId = taskIds.find(function (id) { return iTasks[id]; });
                }
                return (React.createElement(Task_1.default, { definedClasses: definedClasses, dimensionId: id, key: index.name, id: taskId, indexId: "" + i }));
            }))));
    };
    return DimensionTasks;
}(React.Component));
exports.default = DimensionTasks;

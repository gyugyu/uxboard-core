import * as React from 'react';
import { IDimension, IIndex } from './interfaces';
interface Props {
    definedClasses: Record<string, string>;
    dimension: IDimension;
    id: string;
    indices: IIndex[];
}
export default class DimensionTasks extends React.Component<Props> {
    render(): JSX.Element;
}
export {};

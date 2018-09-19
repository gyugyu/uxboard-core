import * as firebase from 'firebase';
import * as React from 'react';
import { IDimension } from './interfaces';
interface Props {
    classes: Record<string, string>;
    id: string;
    dbRef: firebase.database.Reference;
}
interface State extends IDimension {
}
export default class Dimension extends React.Component<Props, State> {
    private dbRef;
    state: {
        name: string;
    };
    constructor(props: Props);
    componentWillMount(): void;
    private handleLeaveEditMode;
    render(): JSX.Element;
}
export {};

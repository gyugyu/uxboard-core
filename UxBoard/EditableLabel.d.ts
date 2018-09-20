import * as React from 'react';
interface Props {
    definedClasses: Record<string, string>;
    initialValue: string;
    onLeaveEditMode: (value: string) => void;
}
interface State {
    isEditing: boolean;
    value: string;
}
export default class EditableLabel extends React.Component<Props, State> {
    constructor(props: Props);
    componentWillReceiveProps(newProps: Props): void;
    private setStateFromProps;
    private handleDoubleClick;
    private handleKeyUp;
    render(): JSX.Element;
}
export {};

import * as firebase from 'firebase';
import * as React from 'react';
interface Props {
    classes: Record<'card', string>;
    definedClasses: Record<string, string>;
    id: string;
    dbRef: firebase.database.Reference;
}
declare const _default: React.ComponentType<Pick<Props, "id" | "definedClasses" | "dbRef"> & import("@material-ui/core/styles/withStyles").StyledComponentProps<"card">>;
export default _default;

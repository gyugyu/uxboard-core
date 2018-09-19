import * as firebase from 'firebase';
import * as React from 'react';
export interface ContextOption {
    authProvider: firebase.auth.AuthProvider;
    databasePrefix: string;
    firebase: typeof firebase;
}
declare const _default: React.Context<ContextOption>;
export default _default;

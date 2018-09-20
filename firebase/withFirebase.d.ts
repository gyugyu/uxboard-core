import * as React from 'react';
import { ContextOption } from './FirebaseContext';
export default function withFirebase<T>(Component: React.ComponentType<T & ContextOption>): React.ComponentType<T>;

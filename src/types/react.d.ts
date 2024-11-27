import 'react';
import React from "react";

declare module 'react' {
    export type FC<P = {}> = React.FunctionComponent<P>;
}
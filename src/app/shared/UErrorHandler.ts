import { ErrorHandler, NgModule, Component, Input, trigger, state, style, transition, animate } from '@angular/core';

export class UErrorHandler implements ErrorHandler
{
    constructor(/*rethrowError?: boolean*/)
    {
        
    }
    call(error, stackTrace = null, reason = null)
    {
        console.log("UErrorHandler ERR: -------------------------"+error);
        console.log(error);
        if(stackTrace)console.log(stackTrace);
        if(reason)console.log(reason);
        console.log("UErrorHandler ERR: ------------------------- END");
    }
    handleError(error: any): void
    {
        this.call(error);
    }
} 

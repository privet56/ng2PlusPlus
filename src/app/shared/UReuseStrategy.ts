import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, Routes, Router, RouterModule, NavigationExtras, PreloadAllModules, RouterOutlet, RouteReuseStrategy } from '@angular/router';

export class UReuseStrategy implements RouteReuseStrategy
{
    handlers: {[key: string]: DetachedRouteHandle} = {};

    shouldDetach(route: ActivatedRouteSnapshot): boolean
    {
        return true;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void
    {
        this.handlers[route.routeConfig.path] = handle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean
    {
        return !!route.routeConfig && !!this.handlers[route.routeConfig.path];
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle
    {
        if (!route.routeConfig) return null;
        return this.handlers[route.routeConfig.path];
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean
    {
        return future.routeConfig === curr.routeConfig;
    }
}

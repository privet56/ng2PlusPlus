import { NgModule } from '@angular/core';
import { Routes, Router, RouterModule, NavigationExtras, PreloadAllModules, RouterOutlet, RouteReuseStrategy } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { AddnewcollaborationComponent } from './addnewcollaboration/addnewcollaboration.component';
import { AdminComponent } from './admin/admin.component';
import { InfoComponent } from './info/info.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { UReuseStrategy } from './shared/UReuseStrategy';
//import { PersistentRouterOutlet } from './shared/PersistentRouterOutlet';

//Attention: order is important because of routeFromIndex(...) 
const routes: Routes = [
    {
			path:'home',
			component: HomeComponent,
      data: { preload: true }
		},
    {
			path:'search',
			component: SearchComponent,
      data: { preload: true }
		},
    {
			path:'addnewcollaboration',
			component: AddnewcollaborationComponent,
      data: { preload: true }
      //canActivate: [AuthGuard]
		},    
    {
			path:'admin',
			component: AdminComponent,
      data: { preload: true }
      //canActivate: [AuthGuard]
		},
    {
			path:'info',
			component: InfoComponent,
      data: { preload: true }
		},
    {
			path:'**',              //notfound
			redirectTo: '/home',
		},
    {
			path:'',
			redirectTo: '/home',
      pathMatch: 'full'
		}

];

//TODO: AsyncRoute needed?
//TODO: use routerCanReuse
//TODO: lazy loading of routes: eg. https://blog.nrwl.io/enable-lazy-loading-in-angular-2-apps-8298916056#.en3hpeq4k


@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
//  {provide: RouterOutlet, useClass: PersistentRouterOutlet },
     {provide: RouteReuseStrategy, useClass: UReuseStrategy }
  ]
})
export class UnicoRoutingModule
{
  constructor()
  {

  }

  public getActiveRouteIndex(router : Router) : number
  {
    for(let i:number=1;i<routes.length;i++)
    {
        if(router.isActive(routes[i].path, true))
        {
          return i;
        }
    }
    return 0; //default
  }  

  public routeFromIndex(i : number, router : Router) : void
  {
    /* Set our navigation extras object that passes on our global query params and fragment
    let navigationExtras: NavigationExtras = {
        preserveQueryParams: true
      , preserveFragment: true
      , fragment: 'anchor'  // Navigate to /bla#anchor
    };*/
    let s : string = '/' + routes[i].path;
    router.navigate([s]/*, navigationExtras*/);
  }
}

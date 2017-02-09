# ng2PlusPlus

This project was generated with [angular-cli](https://github.com/angular/angular-cli)

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.
full command:
	ng build --prod --target=production --environment=prod
Do you wanna generate output file names without hashes?
	-> remove '[*hash]' in %devenv%\unico\node_modules\angular-cli\models\webpack-build-production.js

## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). 
Before running the tests make sure you are serving the app via `ng serve`.

## FORCED upgrade (ATTENTION: no backward-compatibility):
	$ npm install -g npm-check-updates		//only ONCE
	0 MAKE BACKUP 							//and remove node_modules
	$ ncu.cmd --upgradeAll					//possibly you need to paste the absolute path
	$ npm install							//'ng serve' & VSCode should NOT run
	$ npm outdated							//check if succeeded

## styling:
1) edit styles.css with the hints on http://www.primefaces.org/primeng/#/theming
	or
2)  use the themeroller:
	2.1) create a style on https://jqueryui.com/themeroller/
	2.2) copy jquery-ui.min.css + jquery-ui.theme.min.css + /images/
			into /css/
	2.3) insert into angular-cli.json directly above 'styles.css':  
        "css/jquery-ui.css",
        "css/jquery-ui.theme.css",
		... and the css will be minimized & packed with webpack -> cool! 

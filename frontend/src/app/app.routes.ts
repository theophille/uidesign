import { Routes } from '@angular/router';
import { DesignSpaceComponent } from './workspace/design-space/design-space.component';
import { AnimateComponent } from './workspace/animate/animate.component';
import { PrototypeComponent } from './workspace/prototype/prototype.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'workspace/design', pathMatch: 'full' },
	{ path: 'workspace/design', component: DesignSpaceComponent },
	{ path: 'workspace/animate', component: AnimateComponent },
	{ path: 'workspace/prototype', component: PrototypeComponent }
];

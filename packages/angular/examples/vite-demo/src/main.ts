import { bootstrapApplication } from '@angular/platform-browser'
import { provideRouter } from '@angular/router'
import { importProvidersFrom } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app/app.component'
import { routes } from './app/app.routes'

import './styles/global.scss'

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule, FormsModule),
  ],
}).catch(err => console.error(err))


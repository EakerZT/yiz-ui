import type {App, Component, DefineComponent} from 'vue'

import * as components from './components'

export * from './components'

const install = (app: App): void => {
    for (let key of Object.keys(components)) {
        app.component(
            'Y' + key, components[key] as Component<any> | DefineComponent<any>
        )
    }
}

export default {install}
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Provider} from "react-redux";
import store from "./common/store.ts";
import {StrictMode} from "react";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </StrictMode>,
)

// createRoot(document.getElementById('root')!).render(
//     <Provider store={store}>
//         <App/>
//     </Provider>,
// )

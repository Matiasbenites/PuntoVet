import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppRouter } from './router'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { AppTheme } from './layout/AppTheme'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppTheme>
      <Provider store={store}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </Provider>
    </AppTheme>
  </React.StrictMode>,
)

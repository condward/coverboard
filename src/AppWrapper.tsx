import { FC } from 'react';
import { Provider } from 'jotai';

import App from 'App';
import { ReactQueryProvider } from 'providers/ReactQueryProvider';
import { store } from 'store';
import { MuiThemeProvider } from 'providers/ThemeProvider';

export const AppWrapper: FC = () => {
  return (
    <Provider store={store}>
      <MuiThemeProvider>
        <ReactQueryProvider>
          <App />
        </ReactQueryProvider>
      </MuiThemeProvider>
    </Provider>
  );
};

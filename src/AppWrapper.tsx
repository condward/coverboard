import { FC } from 'react';
import { Provider } from 'jotai';

import App from 'App';
import { store } from 'store';
import { MuiThemeProvider, SizesProvider, ReactQueryProvider } from 'providers';

export const AppWrapper: FC = () => {
  return (
    <Provider store={store}>
      <SizesProvider>
        <MuiThemeProvider>
          <ReactQueryProvider>
            <App />
          </ReactQueryProvider>
        </MuiThemeProvider>
      </SizesProvider>
    </Provider>
  );
};

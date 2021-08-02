import React, { Suspense } from 'react';
import './App.css';
import { StoreProvider } from './Store';
import Main from './Main';
import { CircularProgress } from '@material-ui/core';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

export default function App() {
  return (
    <div>
      <Suspense fallback={<CircularProgress />}>
        <StoreProvider>
          <I18nextProvider i18n={i18n}>
            <Main />
          </I18nextProvider>
        </StoreProvider>
      </Suspense>
    </div>
  );
}

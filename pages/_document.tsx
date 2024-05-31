import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head />
        <body id='wrapper'>
          <Main />
          <NextScript />
          <div id='loading' />
          <div id='notifications' />
          <div id='shoppingCard' />
          {/* <div id='sideDrawer' /> */}
        </body>
      </Html>
    );
  }
}

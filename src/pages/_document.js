import { Html, Head, Main, NextScript } from 'next/document'
import { Spinner } from "react-bootstrap";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <div className="loader" id="loader" style={{display: 'none'}}>
          <Spinner animation="border" size="2xl" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

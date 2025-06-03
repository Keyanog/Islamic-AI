import { Global, css } from '@emotion/react'
import IslamicAI from './components/IslamicAI'

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@400;500;600&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    background: #343541;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #ECECF1;
    line-height: 1.5;
  }

  .arabic-text {
    font-family: 'Amiri', 'Traditional Arabic', serif;
    direction: rtl;
    line-height: 1.8;
  }
`

function App() {
  return (
    <>
      <Global styles={globalStyles} />
      <IslamicAI />
    </>
  )
}

export default App

import { createRoot } from 'react-dom/client'
import Chat from './Chat'
import '../styles/tokens.generated.css'
import '../styles/global.css'

createRoot(document.getElementById('root')!).render(<Chat />)

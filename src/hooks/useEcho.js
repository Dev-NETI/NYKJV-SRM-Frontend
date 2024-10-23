import { useEffect, useState } from 'react' 
import Echo from 'laravel-echo'

import Pusher from 'pusher-js' 

const useEcho = () => {
    const [echoInstance, setEchoInstance] = useState(null);

    useEffect(() => { 
        const echo = new Echo({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
           
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
            wsPort: process.env.NEXT_PUBLIC_REVERB_PORT,
            wssPort: process.env.NEXT_PUBLIC_REVERB_PORT,
            forceTLS:
                (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
            Pusher: Pusher
        })
        setEchoInstance(echo)
    }, [])

    return echoInstance
}

export default useEcho
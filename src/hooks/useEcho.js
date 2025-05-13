import { useEffect, useState } from "react";
import Echo from "laravel-echo";

import Pusher from "pusher-js";
import axios from "@/lib/axios";

const useEcho = () => {
  const [echoInstance, setEchoInstance] = useState(null);

  useEffect(() => {
    const echo = new Echo({
      broadcaster: "pusher",
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      namespace: "App.Events",
      encrypted: true,
      forceTLS: true, // (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',

      // wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
      // wsPort: process.env.NEXT_PUBLIC_REVERB_PORT,
      // wssPort: process.env.NEXT_PUBLIC_REVERB_PORT,
      // enabledTransports: ['ws', 'wss'],

      Pusher: Pusher,
      authorizer: (channel, options) => {
        return {
          authorize: (socketId, callback) => {
            axios
              .post("/api/broadcasting/auth", {
                socket_id: socketId,
                channel_name: channel.name,
              })
              .then((response) => {
                callback(false, response.data);
              })
              .catch((error) => {
                callback(true, error);
              });
          },
        };
      },
    });
    setEchoInstance(echo);
  }, []);

  return echoInstance;
};

export default useEcho;

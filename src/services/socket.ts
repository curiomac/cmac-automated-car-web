type SocketCallback = (status: boolean) => void

export function createSocketService() {
  let socket: WebSocket | null = null
  let callbacks: SocketCallback[] = []

  const connect = (url: string) => {
    socket = new WebSocket(url)

    socket.onopen = () => {
      console.log('WebSocket connected')
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'lightStatus') {
        callbacks.forEach(cb => cb(data.status))
      }
    }

    socket.onclose = () => {
      console.log('WebSocket disconnected')
      setTimeout(() => connect(url), 3000)
    }
  }

  const subscribe = (callback: SocketCallback) => {
    callbacks.push(callback)
    return () => {
      callbacks = callbacks.filter(cb => cb !== callback)
    }
  }

  const sendLightStatus = (status: boolean) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'setLightStatus',
        status,
      }))
    }
  }

  return {
    connect,
    subscribe,
    sendLightStatus,
  }
}

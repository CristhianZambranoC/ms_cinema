import socketio

sio = socketio.Client()


@sio.event
def connect():
    print('Conectado al servidor')
    sio.emit('message', {'from': 'python-client', 'text': 'hola desde cliente'})


@sio.event
def disconnect():
    print('Desconectado del servidor')


@sio.on('new_notification')
def on_new_notification(data):
    print('Notificación recibida:', data)


sio.connect('http://localhost:3000', transports=['websocket'])
sio.wait()

import React, { Component } from "react";
import socketIOClient from "socket.io-client";
class App extends Component {
    constructor() {
        super();
        this.state = {
            response: false,
            endpoint: "http://127.0.0.1:4001"
        };
    }
    componentDidMount() {
        let self = this;

        const { endpoint } = self.state;
        const socket = socketIOClient(endpoint);
        socket.on("FromAPI", function (data) {
            console.log(data);
            self.setState({ response: data.response })
        });
    }
    render() {
        const { response } = this.state;
        return (
            <div style={{ textAlign: "center" }}>
        {response
            ? <p>
        The temperature in Florence is: {response} °F
        </p>
        : <p>Loading...</p>}
        </div>
        );
    }
}
export default App;
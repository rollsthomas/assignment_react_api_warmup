import React, { Component } from "react";
// Optionally add a reusable Jumbotron element
import JumbotronFluid from "./elements/JumbotronFluid";
import serialize from "form-serialize";
import UserList from "./UserList";
import UserForm from "./UserForm";

class App extends Component {
  constructor() {
    super();
    // Set isFetching to false.
    this.state = {
      users: [],
      isFetching: false,
      error: null
    };
  }

  componentDidMount() {
    // Before performing the fetch, set isFetching to true
    this.setState({ isFetching: true });

    // Add a delay to the URL and reset isFetching upon
    // completion of the request.
    fetch("https://reqres.in/api/users?delay=1")
      .then(response => response.json())
      .then(json => {
        this.setState({
          users: json.data,
          isFetching: false
        });
      });
  }
  addNewUser = e => {
    e.preventDefault();
    const form = e.target;
    const body = serialize(form, { hash: true });
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options = {
      headers,
      method: "POST",
      body: JSON.stringify(body)
    };
    this.setState({ isFetching: true });

    fetch("https://reqres.in/api/users", options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`${response.status}, ${response.statusText}`);
        }
        return response.json();
      })
      .then(json => {
        this.setState(
          {
            isFetching: false,
            users: [...this.state.users, json]
          },
          () => form.reset()
        );
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    const { users, isFetching, error } = this.state;
    return (
      <div className="App">
        <JumbotronFluid
          heading="User CRUD"
          lead="Using an API for User CRUD operations"
        />
        <UserList users={users} isFetching={isFetching} />
        <UserForm onSubmit={this.addNewUser} error={error} />
      </div>
    );
  }
}

export default App;

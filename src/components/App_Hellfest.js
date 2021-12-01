// import React from "react";
// import CreateLink from "./Link/CreateLink";
// import {
//   BrowserRouter,
//   Switch,
//   Route,
//   Router,
//   Redirect,
// } from "react-router-dom";
// import Login from "./../Login";
// import ForgotPassword from "./Link/ForgotPassword";
// import SearchLinks from "./Link/SearchLinks";
// import LinkList from "./Link/LinkList";
// import LinkDetail from "./Link/LinkDetail";
// import Header from "./Header";

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="app-container">
//         <Header />
//         <div className="route-container">
//           <Switch>
//             <Route path="/" exact render={() => <Redirect to="/new/1" />} />
//             <Route path="/create" component={CreateLink} />
//             <Route path="/login" component={Login} />
//             <Route path="/forgot" component={ForgotPassword} />
//             <Route path="/search" component={SearchLinks} />
//             <Route path="/top" component={LinkList} />
//             <Route path="/new/:page" component={LinkList} />
//             <Route path="/link/:linkId" component={LinkDetail} />
//           </Switch>
//         </div>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;
import React, { Component } from "react";

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: "",
      data2: "",
      url: "",
    };
  }

  urlify(text) {
    const urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(urlRegex, (url) => {
      return `<a href="${url}>${url}</a>`;
    });
  }

  async componentWillMount() {
    await fetch(
      "https://www.ticketswap.com/event/foo-fighters-festival-de-nimes/category-1-tickets/e76f72bd-760a-4231-841c-e6a07a9d7d65/1602080"
    )
      // .then((response) => response.json())
      .then((response) => {
        // now fetch the text
        fetch(response.url)
          .then((response2) => response2.text())
          .then((response2) => this.urlify(response2))
          .then((response2) => {
            this.setState({
              data: response2,
            });
            const url = this.extractUrl(this.state.data);
            console.log(url[0]);
            // Find sencond link with the button
            const urlSmaller = this.extractUrl2(url[0]);
            this.setState({ url: urlSmaller[1] });
            ///////////////////////////////////////
            // START Second link //
            fetch(this.state.url)
              // .then((response) => response.json())
              .then((response) => {
                // now fetch the text
                fetch(response.url)
                  .then((response2) => response2.text())
                  .then((response2) => this.urlify(response2))
                  .then((response2) => {
                    this.setState({
                      data2: response2,
                    });
                    console.log(this.state.data2);
                  });
              });
          });
      });

    // const cur = this.searchLinkify(htmlBody);
    // console.log(cur);
  }

  extractUrl = (text) => {
    // var part = text.substring(
    //   text.lastIndexOf("Available</h3>") + 1,
    //   text.lastIndexOf("</li>")
    // );
    // var subStr = text.match("Available</h3>(.*)</a>");
    var result = text.match("Available</h3>(.*)Sold</h3>");
    return result;
  };
  // Find sencond link with the button
  extractUrl2 = (text) => {
    // var part = text.substring(
    //   text.lastIndexOf("Available</h3>") + 1,
    //   text.lastIndexOf("</li>")
    // );
    // var subStr = text.match("Available</h3>(.*)</a>");
    var result = text.match('a href="<a href="(.*)>https');
    return result;
  };

  render() {
    // if (this.state.data !== "") {
    //   console.log(this.extractUrl(this.state.data));
    // }

    return (
      <div>
        <p>URL: {this.state.url} </p>
        <br />
        <p> {this.state.data2} </p>
      </div>
    );
  }
}
export default App;

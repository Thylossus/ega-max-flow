require('../scss/index.scss');

var React = require('react');
var App = require('grommet/components/App');
var Header = require('grommet/components/Header');
var Title = require('grommet/components/Title');

var Main = React.createClass({
  render: function() {
    return (
      <App centered={false}>
        <Header direction="row" justify="between" large={true} pad={{horizontal: 'medium'}}>
          <Title>
            <h1>
              Efficient Graph Algorithms - Max-Flow Problem
            </h1>
          </Title>
        </Header>
      </App>
    );
  }
});

var element = document.getElementById('content');
React.render(React.createElement(Main), element);

document.body.classList.remove('loading');

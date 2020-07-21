import React from 'react';

const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
};

export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});

class ViolationsWithContext extends React.Component {
  constructor(props) {
    super(props);

    this.toggleTheme = () => {
      this.setState(state => ({
        theme: state.theme === themes.dark ? themes.light : themes.dark,
      }));
    };

    this.state = {
      theme: themes.light,
      // eslint-disable-next-line react/no-unused-state
      toggleTheme: this.toggleTheme,
    };
  }

  render() {
    const { children } = this.props;
    return <ThemeContext.Provider value={this.state}>{children}</ThemeContext.Provider>;
  }
}

export default ViolationsWithContext;

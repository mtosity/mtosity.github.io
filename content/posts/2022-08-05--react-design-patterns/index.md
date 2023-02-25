---
template: post
title: React Design Patterns
slug: "/posts/react-design-patterns"
draft: false
date: 2022-05-08T20:48:23.046Z
description: React design patterns
socialImage: "./media/react-design-patterns/banner.jpg"
category: ReactJS
tags:
  - ReactJS
---

> I removed all fancy words and just focus on the idea so its not gonna be so "professional"~

# The list

- Presentational and Container Component Pattern

- Provider Pattern

- Compound Components Pattern

- The higher-order component pattern

# Presentational and Container Component Pattern

## Presentational component

Well,... only display the UI, but also have **its own state**

```jsx
const ItemsList = (props) => {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <a href={item.url}>{item.name}</a>
        </li>
      ))}
    </ul>
  );
};
```

```jsx
class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }
  render() {
    return (
      <input
        value={this.state.value}
        onChange={(event) => this.setState({ value: event.target.value })}
      />
    );
  }
}
```

In the example above, we’ve created a Presentational class component, TextInput, responsible for managing **its state**.

## Container component

Control how things work together, contain lifecycle methods and Presentational components. It is also where data fetching happens.

```jsx
class TvShowsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shows: [],
      loading: false,
      error: "",
    };
  }
  componentDidMount() {
    this.setState({ loading: true, error: "" });
    fetch("https://api.tvmaze.com/schedule/web?date=2020-05-29")
      .then((res) => res.json())
      .then((data) => this.setState({ loading: false, shows: data }))
      .catch((error) =>
        this.setState({ loading: false, error: error.message || error }),
      );
  }
  render() {
    const { loading, error, shows } = this.state;
    return (
      <div>
        <h1> Tv Shows </h1>
        {loading && <p>Loading...</p>}
        {!loading && shows && <ItemsList items={shows} />}
        {!loading && error && <p>{error}</p>}
      </div>
    );
  }
}
```

> Do note that Dan also mentions that he’s no longer promoting this pattern as he’s changed his view on the matter since he originally coined it. However, you might find it useful for your particular use case which is why I thought it relevant to be mentioned on this list.

# Provider Pattern

Prop drilling is bad, better do Context Provider/Store or Redux

Context remind:

```jsx
import { createContext } from "react";
const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
});
export default ThemeContext;
```

```jsx
import React, { useState, useMemo } from "react";
import Header from "./Header";
import Main from "./Main";
import ThemeContext from "./context";
import "./styles.css";
export default function App() {
  const [theme, setTheme] = useState("");
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return (
    <ThemeContext.Provider value={value}>
      <div className="container">
        <Header />
        <Main />
      </div>
    </ThemeContext.Provider>
  );
}
```

```jsx
import { useContext } from "react";
import ThemeContext from "./context";
const Header = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("");
      return;
    }
    setTheme("dark");
    return;
  };
  return (
    <header className={theme === "dark" && "dark"}>
      <h1> Tv Shows </h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
};
export default Header;

import { useContext } from "react";
import ThemeContext from "./context";
const Main = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <main className={theme === "dark" && "dark"}>
      <h2>
        {" "}
        {theme === "dark" ? "Dark theme enabled" : "Light theme enabled"}
      </h2>
    </main>
  );
};
export default Main;
```

> While Context makes it easier to pass data among components, it is advised to use this approach sparingly because it makes component reuse difficult

# Compound Components Pattern

Peer to peer components, must have all components to work, ex: Menu + Menu.Item

Code:

Menu:

```jsx
import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
} from "react";
import "./styles.css";
const MenuContext = createContext();
const Menu = ({ children, defaultSelected }) => {
  const [selectedItem, setSelectedItem] = useState(defaultSelected);
  const toggleSelectedItem = useCallback(
    (item) => {
      if (item !== selectedItem) {
        setSelectedItem(item);
        return;
      }
      selectedItem("");
    },
    [selectedItem, setSelectedItem],
  );
  const value = useMemo(
    () => ({
      toggleSelectedItem,
      selectedItem,
    }),
    [toggleSelectedItem, selectedItem],
  );
  return (
    <MenuContext.Provider value={value}>
      <menu className="menu">{children}</menu>
    </MenuContext.Provider>
  );
};
```

```jsx
const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error(
      "Menu item component cannot be used outside the Menu component.",
    );
  }
  return context;
};

const MenuItem = ({ value, children }) => {
  const { toggleSelectedItem, selectedItem } = useMenuContext();
  return (
    <button
      onClick={() => toggleSelectedItem(value)}
      id={`${value}-menu-item`}
      className={`menu__item ${selectedItem === value && "active"}`}
    >
      {children}
    </button>
  );
};
```

```jsx
export default function App() {
  return (
    <Menu defaultSelected="My account">
      <MenuItem value="Profile">Profile</MenuItem>
      <MenuItem value="My account">My account</MenuItem>
      <MenuItem value="Logout">Logout</MenuItem>
    </Menu>
  );
}
```

# The higher-order component pattern

Use when want to sharing of component logic across our application. Examples of these features are authorization, logging, and data retrieval.

HOCs are not part of the core React API, but they arise from the compositional nature of React functional components, which are JavaScript functions.

Code:

```jsx
import React, { Component } from "react";

const higherOrderComponent = (DecoratedComponent) => {
  class HOC extends Component {
    render() {
      return <DecoratedComponent />;
    }
  }
  return HOC;
};
```

# Credits

https://blog.openreplay.com/3-react-component-design-patterns-you-should-know-about
https://blog.logrocket.com/react-component-design-patterns-2022/

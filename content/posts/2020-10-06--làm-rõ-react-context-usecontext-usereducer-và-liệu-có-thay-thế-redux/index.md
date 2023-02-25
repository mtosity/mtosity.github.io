---
template: post
title: Cách dùng React Context, useReducer và liệu chúng có thay thế Redux?
slug: "/posts/cach-dung-react-context-class-va-usecontext-usereducer-va-lieu-co-thay-the-redux"
draft: false
date: 2020-10-06T02:44:42.839Z
description: Giới thiệu React Context, useContext, useReducer. Tất nhiên là sẽ
  chưa thể redux được, vì sao?
socialImage: "./media/reactvsredux.jpg"
category: ReactJS
tags:
  - ReactJS
---

# React Context

Khi bạn là component ông tổ muốn truyền props cho cháu chít nhưng không muốn truyền props kiểu khoan lỗ tới lõi trái đất thì sử dụng **React Context**.

Context cũ chả ai dùng, ngay cả chính chủ cũng bảo chỉ là bản thử nhiệm. Nhưng khi được làm lại ở bản `16.4.0` thì nó ngon như ny vậy. Nó khớp với [flux architecture](https://facebook.github.io/flux/docs/in-depth-overview/#:~:text=Flux%20is%20the%20application%20architecture,a%20lot%20of%20new%20code.) hơn.

#### Khi nào sử dụng React Context?

Dùng để share "global" data, ví dụ như authenticated user, theme, language,... Những data này đơn giản không phức tạp và ít khi được thay đổi.

#### Dùng React Context trong class component (Provider/Customer)

```javascript
import React, { useState, useEffect } from "react";
const ThemeContext = React.createContext("light");

class App extends React.Component {
  state = {
    theme: "dark",
  };

  render() {
    return (
      <ThemeContext.Provider value={this.state.theme}>
        <button
          onClick={() =>
            this.setState({
              theme: this.state.theme === "dark" ? "light" : "dark",
            })
          }
        >
          Change Theme
        </button>
        <Content />
      </ThemeContext.Provider>
    );
  }
}

class Content extends React.Component {
  // Assign a contextType to read the current theme context.
  // React will find the closest theme Provider above and use its value.
  // In this example, the current theme is "dark".
  static contextType = ThemeContext;

  render() {
    return (
      <div>
        {Object.keys(this.context).length !== 0
          ? this.context
          : "dont have context, this.context = {}"}
      </div>
    );
  }
}

export default App;
```

`React.createContext(initValue)` để tạo một context truyền vào giá trị ban đầu, context nó chỉ là một _object_ gồm có `Context.Provider` và `Context.Consumer`.

`Context.Provider` y như cái tên, như tk cha "cung cấp" cho những đứa con. Truyền vào props là **value** là giá trị state hay data muốn truyền xuống, nên nhớ là **value** và **initValue** type phải như nhau

Có nhiều cách để truy cập vào data `context`, khai báo `static contextType = ThemeContext;` như trên là cách 1, khi đó truy cập bằng cách gọi `this.context` (hãy xoá hay comment dòng đó thử, `Object.keys(this.context).length === 0` để xem có phải object rỗng hay không {}). `context` nó lấy là của component **provider** gần nhất.

```javascript
class Content extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {(theme) => <h1>{theme}</h1>}
      </ThemeContext.Consumer>
    );
  }
}
```

Cách 2 là dùng `Context.Consumer`, yuh, nó là tk con muốn dùng những thứ cha nó "cung cấp". Syntax như trên.

Cách 3 là sử dụng `useContext` nếu sử dụng _function component_. Cách sử dụng bên dưới

#### Dùng React Context trong function component (useContext)

```javascript
import React, { useState, useContext } from "react";
const ThemeContext = React.createContext("light");

const App = () => {
  const [theme, setTheme] = useState("dark");

  console.log(ThemeContext);

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        Change Theme
      </button>
      <Content />
    </ThemeContext.Provider>
  );
};

const Content = () => {
  const theme = useContext(ThemeContext);
  return <h1>{theme}</h1>;
};

export default App;
```

Chả có gì đặc biệc cả, `useContext` trả về _value_ của _context_ đó. Syntax như trên.

# useReducer

> Chỉ là `useState` theo kiểu redux

```javascript
const initialState = maxtrix;

function reducer(state, action) {
  switch (action.type) {
    case 'up':
      return moveUp(matrix);
    case 'down':
      ...
    default:
      return state;
  }
}

function GameApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    //render matrix
    state.map...
  );
}

```

Vì sao sinh ra cái này? Để xử lý với những **state** phức tạp. Ví dụ ta đang làm con game _2048_, **state** đang là ma trận của game và ta đang làm đi các hướng, thay vì `setState` với một đống logic, thì ta `dispatch` một **action** có **type** là một trong ["up", "down", "left", "right"] thì nó sẽ dễ đọc hơn nhiều.

`const [state, dispatch] = useReducer(reducer, initialArg, init);`

Còn `init` là cái huần gì? Ta có truyền vào một hàm để [lazy initialization](https://reactjs.org/docs/hooks-reference.html#lazy-initialization).

```javascript
const PhotoPane = (props) => {
    const initialPixelData = loadPhoto(props.photoID);
    const [pixelData, dispatch] = useReducer(reducerFunc, initialPixelData);
    ...
}
```

Ví dụ bạn có một app chỉnh ảnh 16K, thì mỗi khi bạn chỉnh hình đó thì component bị render, khi đó `loadPhoto` bị gọi miết. Nên giải pháp là đưa hàm loadPhoto ra khỏi component và truyền hàm `init` vào.

```javascript
const PhotoPane = (props) => {
    const init = (photoID) => loadPhoto(photoID);
    const [pixelData, dispatch] = useReducer(reducerFunc, props.photoID, init);
    ...
}
```

Hàm `init` sẽ chỉ gọi một khi `useReducer` được gọi lần đầu. Sử dụng `useEffect` cũng được nhưng _lazy initialization_ vẫn là giải pháp chính gốc

# React Context + useReducer = Redux?

Well cũng đúng nếu bạn chỉ dùng để tạo "global" state

```javascript
import React, { useReducer, useContext } from "react";
const ThemeContext = React.createContext("light");

const themeReducer = (state, action) => {
  switch (action.type) {
    case "toggle":
      return state === "dark" ? "light" : "dark";
    default:
      return state;
  }
};

const App = () => {
  const [theme, dispatch] = useReducer(themeReducer, "dark");

  console.log(ThemeContext);

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => dispatch({ type: "toggle" })}>Change Theme</button>
      <Content />
    </ThemeContext.Provider>
  );
};

const Content = () => {
  const theme = useContext(ThemeContext);
  return <h1>{theme}</h1>;
};

export default App;
```

Giống redux 96.69%

# Tương lai Redux có bị thay thế?

Méo vì react context + useContext + useReducer (2020) chỉ dùng để tạo **global state**, **Redux** làm được nhiều hơn thế.

**Redux** cung cấp **Redux DevTools**, khả năng theo dõi **state** update, **middleware** để thêm logic cho những app có **centralised data**, tức call API rùi lưu tất trong **Redux** stores. Rùi cả **redux-thunk** và **redux-saga** khi gọi API trong **Action creators**. Còn có **redux-persist** dùng để lưu data trong **localStorage** tự động load lên save lại khi refresh.

Nói chung Redux >>> Context, nhưng khi chỉ cần "global" state thì dùng **context** là được rồi :D

Bài [stackoverflow](https://stackoverflow.com/questions/49568073/react-context-vs-react-redux-when-should-i-use-each-one) chi tiết về vấn đề này.

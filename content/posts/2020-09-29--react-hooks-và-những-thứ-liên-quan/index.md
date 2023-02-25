---
template: post
title: React Hooks p1 (state, effect) và những thứ liên quan
slug: "/posts/react-hooks-va-nhung-thu-lien-quan-p1"
draft: false
date: 2020-09-29T10:06:58.788Z
description: Ngôn ngữ phèn viết cho React Hooks useState, useEffect và những thứ liên quan
socialImage: "./media/react-hook.png"
category: ReactJS
tags:
  - ReactJS
---

Steal mostly from [react docs](https://reactjs.org/docs)

# Table of contents

[Hooks](#hooks)

[useState](#usestate)

[Effect Hooks](#effect-hooks)

[Ví dụ về custom hooks](#ví-dụ-về-custom-hooks)

# Hooks

> Hooks chỉ sử dụng trong function component
>
> Hooks chỉ là những function sinh ra để giúp **hook** vào những state hay lifecycle từ function component

# useState

`const [state, setState] = useState(initialValue);`

Chắc ai cũng biết `useState` rồi nhỉ, khai báo như trên rùi dùng state và setState như ở class thui ~ ~

Nhưng sao nó làm được hay nhỉ? Cũng đơn giản thôi, đây là cách tạo ra sơ khai `useState`:

```javascript
function useState(initialValue) {
  var _val = initialValue; // _val is a local variable created by useState
  function state() {
    // state is an inner function, a closure
    return _val; // state() uses _val, declared by parent funciton
  }
  function setState(newVal) {
    // same
    _val = newVal; // setting _val without exposing _val
  }
  return [state, setState]; // exposing functions for external use
}
var [foo, setFoo] = useState(0); // using array destructuring
console.log(foo()); // logs 0 - the initialValue we gave
setFoo(1); // sets _val inside useState's scope
console.log(foo()); // logs 1 - new initialValue, despite exact same call
```

Một ví dụ về `useState`: click và đếm

```javascript
import React, { useState } from "react";

function Example() {
  // Declare a new state variable, which we'll call **count**
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

Và tất nhiên có thể có nhiều state, `state`, `setState` và giá trị đầu có thể thay đổi tên tuỳ ý

```javascript
function ExampleWithManyStates() {
  // Declare multiple state variables!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState("banana");
  const [todos, setTodos] = useState([{ text: "Learn Hooks" }]);
  // ...
}
```

# Effect Hooks

`useEffect` là hàm để chạy những **side effects** trong function components

`useEffect` được add vào để có thể thay thế được `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` trong React class

```javascript
useEffect(
  () => {
    // hàm **effect** của mình
    // thay thế componentDidUpdate, componentDidMount
    return {
      // hàm **clean up** của mình
      // thay thế componentWillUnmount
    };
  },
  [
    //params thứ 2 của useEffect
    // các biến **watching** của mình
    // chỉ chạy nếu biến thay đổi
  ],
);
```

Ok giải thích! Nếu không có biến **watching** nào thì cái hàm **effect** chạy khi nguyên component được update, tức lúc **did mount** và **did update**.

VD:

- Nếu là class:

```javascript
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }
  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

- Nếu là function sử dụng hooks:

```javascript
import React, { useState, useEffect } from "react";

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

Param thứ 2 của `useEffect` là các biến mình muốn **watching**, tức hàm **effect** chỉ chạy khi các biến này thay đổi, tức là **did mount** và **did biến đó update**

```javascript
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
```

**Clean up** function không phải chạy sau khi hàm **effect** chạy hay lúc component **will unmount**, như thế sai và không đủ. Mà là nó chạy trước khi hàm **effect** chạy để **clean up** cho những lần chạy **effect** mới (trừ lần chạy effect đầu) và lúc component **will unmount**

Nếu params 2 là empty array [] thì tức hàm **effect** sẽ chỉ chạy lúc **did mount**. **did biến đó update** nhưng có biến éo nào đâu :v. Và vì **effect** chỉ chạy lúc **did mount** tức nó chỉ chạy một lần từ lúc mount đến unmount nên hàm **clean up** chỉ chạy lúc component **will unmount**

Nếu params có biến [a, b] thì tức hàm **effect** sẽ chạy lúc **did mount** và **did a, b update**, và hàm **clean up** chạy trước mỗi lần hàm **effect** chạy để _clean_ cho _effect_ :v và lúc component **will unmount**

Đọc từ từ rồi ngẫm mấy cái console.log của ví dụ này sẽ hiểu :D

```javascript
import React, { useState, useEffect } from "react";

function Fa() {
  useEffect(() => {
    console.log("fa effect run");
    return () => {
      console.log("fa clean up run");
    };
  }, []);
  return <div>fa</div>;
}

function App() {
  const [count, setCount] = useState(0);
  const [a, setA] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
    console.log("app effect run");
    return () => {
      console.log("app clean up run");
    };
  }, [count, a]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      {count % 2 === 1 && <Fa />}
    </div>
  );
}

export default App;
```

# Ví dụ về custom hooks:

Hook dấu tích màu xanh lá hiện thị bạn bè đang online hay offine trong một chat app:

- Phần custom hooks:

```javascript
import { useState, useEffect } from "react";

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

Hook này trả về isOnline là trạng thái online của một người bạn có id là frinedID, lúc đầu nó sẽ là null. Sau đó chạy hàm **effect**, mình lắng nghe ChatAPI phía bên server, mỗi lần status thay đổi sẽ chạy hàm `handleStatusChange` set lại cái state `isOnline`.

Nên nhớ biến `isOnline` được return là một **state** nên nó có thể thay đổi nhé :D

- Sử dụng custom hooks

```javascript
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? "green" : "black" }}>{props.friend.name}</li>
  );
}
```

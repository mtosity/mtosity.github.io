---
template: post
title: React Lifecycle Methods và những thứ liên quan
slug: "/posts/react-lifecycle-methods"
draft: false
date: 2020-09-23T17:25:55.270Z
description: Max gắn gọn React Lifecycle và những thứ liên quan
socialImage: "./media/react-lifecycle.png"
category: ReactJS
tags:
  - ReactJS
---

# Content table: Lifecycle có 3 giai đoạn chính

![scroll](/media/react-lifecycle.png)

## \- Mounting

Giai đoạn từ lúc component được tạo ra đến khi đẩy vào DOM

- [constructor(props)](#constructorprops)
- [static getDerivedStateFromProps(props, state)](#static-getderivedstatefrompropsprops-state)
- [render()](#render)
- [componentDidMount()](#componentdidmount)

## \- Updating

Một update khi state hay props thay đổi -> re-render

- [static getDerivedStateFromProps(props, state)](#static-getderivedstatefrompropsprops-state)
- [shouldComponentUpdate(nextProps, nextState)](<#shouldComponentUpdate(nextProps-nextState)>)
- [render()](#render)
- [getSnapshotBeforeUpdate(prevProps, prevState)](##getsnapshotbeforeupdateprevprops-prevstate)
- [componentDidUpdate(prevProps, prevState, snapshot)](##componentdidupdateprevprops-prevstate-snapshot)

## \- Unmounting

Giai đoạn xoá component khỏi DOM

- [componentWillUnmount()](#componentwillunmount)

## Support content:

[componentDidCatch(error, info) và ErrorBoundary](#componentdidcatcherror-info-và-errorboundary)

[Hiểu hơn về setState](#hiểu-hơn-về-setstate)

[Các cách compare Object trong JS](#các-cách-compare-object-trong-js)

# constructor(props)

_Nếu không init state hoặc bind methods thì không cần constructor_

Gọi `super(props)` thì mới xài được `this` trong hàm `constructor()`

```javascript
// Error
class MyComponent extends React.Component {
  constructor() {
    console.log(this); // Reference Error
  }

  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

// Good
class MyComponent extends React.Component {
  constructor() {
    super();
    console.log(this); // this logged to console
  }

  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
```

Lý do:

Muốn sử dụng những tinh tuý của react thông qua `this` như `this.props` hay `this.state` trong `MyComponent constructor()` thì `React.Component constructor()` phải được chạy trước và hàm `super()` thực hiện điều đó. `super()` trong JS dùng để gọi `constructor()` của class cha và `MyComponent extends React.Component`.

Truyền props vào `super()` -> `super(props)` thì ở `React.Component constructor()` sẽ gán `props` đó vào `this`, sau đó có thể truy cập `this.props` ở phía dưới.

Vậy tại sao không có `MyComponent constructor()` vẫn xài được `this` như `this.props` hay `this.state`? Do ngoài `MyComponent constructor()` ra thì tất cả các hàm còn lại trong `class MyComponent` đều chạy sau `React.Component constructor()`

```javascript
class MyComponent extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
```

# static getDerivedStateFromProps(props, state)

Well... Docs nói không nên dùng do sẽ làm code rậm rịt và khó hiểu. [You Probably Don't Need Derived State](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

`getDerivedStateFromProps` được dùng khi muốn update state khi props thay đổi, giống `UNSAFE_componentWillReceiveProps(nextProps)`, khác ở chỗ vì `getDerivedStateFromProps` là `static` nên nó không truy cập được `this` của component.

Trong hàm là `props` mới truyền vào và `state` hiện tại, khi return thì return `state` mới, `state` có giá trị thì component sẽ re-render, return `null` sẽ không re-render

```javascript
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail,
    prevPropsUserID: this.props.userID,
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.userID !== state.prevPropsUserID) {
      return {
        prevPropsUserID: props.userID,
        email: props.defaultEmail,
      };
    }
    return null;
  }

  // ...
}
```

# render()

Là render đó, return trong các dạng jsx, array, fragments, portals, string, number, bolleans or null

Note: `render` sẽ không được gọi nếu `shouldComponentUpdate` return `false`

# componentDidMount()

Chạy ngau sau khi component được mounted, được dùng để fetch dữ liệu remote.

Nên có state ban đầu ở hàm `constructor` (dữ liệu ban đầu để show ví dụ như "", 0, loading = true, \[], {},...) để cho component có thứ để render lần đầu rùi ở `componentDidMount` sẽ fetch dữ liệu hay cập nhật dữ liệu rồi `setState` để render thêm một lần nữa.

Vì nếu fetch dữ liệu trước rùi setState, ví dụ ở hàm lifecycle `UNSAFE_componentWillMount` thì người dùng sẽ cảm thấy website chậm vì fetch data sẽ mất thời gian và trong lúc đó người dùng chả có gì để thấy và tương tác cả

```javascript
componentDidMount() {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
```

# shouldComponentUpdate(nextProps, nextState)

Như cái tên, `return true` nếu muốn component update, `return false` nếu không, default tất nhiên là `true`

Theo docs, chỉ nên dùng `shouldComponentUpdate` để _tối ưu hiệu suất_ hơn là dựa vào nó để _ngăn re-render_

Vì react chỉ so sánh state và props theo kiểu [Referential](#các-cách-compare-object-trong-js) để quyết định có re-render hay không nên cả khi `this.setState({a: this.state.a})` thì nó vẫn re-render

Cho nên muốn ngăn re-render thì có thể xài `shouldComponentUpdate` để tự viết [Manual comparation](#các-cách-compare-object-trong-js) nhưng tốt hơn thì dùng [React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent), PureComponent sử dụng [Shallow equality](#các-cách-compare-object-trong-js) để so sánh state và props.

```javascript
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      d: 0,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.d === this.state.d) {
      return false;
    }
    return true;
  }

  componentDidUpdate() {
    console.log("did");
  }

  render() {
    return (
      <div>
        <h1>{this.state.d}</h1>
        <button onClick={() => this.setState({ d: this.state.d + 1 })}>
          button
        </button>
      </div>
    );
  }
}
```

Nếu bỏ `shouldComponentUpdate` thì mỗi lần nhấn nút thì sẽ thấy log 'did' ra màn hình tức là bị re-render kể cả khi `setState` giá trị cũ

# getSnapshotBeforeUpdate(prevProps, prevState)

Thằng này chạy trước khi update, trước `render` nên sẽ thích hợp nếu muốn lưu lại snapshot trước khi bị data mới đè lên khi `render`.

Return snapshot sẽ đưa snapshot đến `componentDidUpdate`

Một ví dụ giữ vị trí scoll khi push data mới vào màn hình

```javascript
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return <div ref={this.listRef}>{/* ...contents... */}</div>;
  }
}
```

[Element.scrollTop](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop), [Element.scrollHeight](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight)

![scroll](/media/z0dvm.png)

# componentDidUpdate(prevProps, prevState, snapshot)

Được gọi sau khi `render`, một nơi để thực hiện những request sau khi UI được render, ví dụ như auto save, update state nếu có props mới,... Nhưng nhớ đặt `setState` trong một điều kiện nào đó, nếu không thì sẽ bị infinite loop

```javascript
componentDidUpdate(prevProps, prevState, snapshot) {
  // Typical usage (don't forget to compare props):
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

Nếu có `getSnapshotBeforeUpdate` thì sẽ có `snapshot` truyền vào, không thì `snapshot` sẽ là `undefined`

Note: `componentDidUpdate` sẽ không được gọi nếu `shouldComponentUpdate` return `false`

# componentWillUnmount()

Được chạy trước khi component unmount

Nên thực hiện những clean up trong hàm này, ví dụ như huỷ request, noti, unsubscribe...

Đừng `setState` trong đây vì component sẽ éo bao giờ re-render nữa

# componentDidCatch(error, info) và ErrorBoundary

error: Là Error thrown ra đó :v

info: Object gồm [componentStack](https://reactjs.org/docs/error-boundaries.html#component-stack-traces) chứa thông tin component error những component liên quan

Ví dụ một ErrorBoundary component

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

# Hiểu hơn về setState

Gán thẳng `this.state = {...}` chỉ khi ở hàm `constructor` vì gán thẳng thì **react** sẽ không **re-render**, chỉ có `setState` mới trigger **re-render**

`setState` là một hàm bất đồng bộ (asynchronous)

```javascript
// assuming this.state = { value: 0 }
this.setState({
  value: 1,
});
console.log(this.state.value); // 0
```

```javascript
// assuming this.state = { value: 0 };
// this.state.value = 0
this.setState({ value: this.state.value + 1 });
// this.state.value = 0
this.setState({ value: this.state.value + 1 });
// this.state.value = 0
this.setState({ value: this.state.value + 1 });

// after all setState, this.state.value = 1
```

Nó như `this.setState({ value: 0 + 1 })` 3 lần

Vì `setState` là bất đồng bộ nên sau `setState` thì `this.state.value` chưa được update liền nên vẫn sẽ là giá trị cũ (là 0)

Nhưng nó có callback ở params sau

```javascript
// assuming this.state = { value: 0 }
this.setState(
  {value: 1},
  () => console.log(this.state.value); // 1
);
```

Param đầu của `setState` cũng có thể là một function, `(state) => ({...})`, ở đây `state` mà nó lấy là lúc chạy hàm đó nên `state` đó đã được update.

```javascript
// assuming this.state = { value: 0 };
// this.state = { value: 0 };
this.setState((state) => ({ value: state.value + 1 })); // state.value = 0
// this.state = { value: 0 };
this.setState((state) => ({ value: state.value + 1 })); // state.value = 1
// this.state = { value: 0 };
this.setState((state) => ({ value: state.value + 1 })); // state.value = 2
// this.state = { value: 0 };

// after all setState, this.state.value = 3
```

# Các cách compare Object trong JS

- Referential equality

Chỉ so sánh ref của object, không quan tâm những thứ bên trong

```javascript
const hero1 = {
  name: "Batman",
};
const hero2 = {
  name: "Batman",
};

hero1 === hero1; // => true
hero1 === hero2; // => false

hero1 == hero1; // => true
hero1 == hero2; // => false

Object.is(hero1, hero1); // => true
Object.is(hero1, hero2); // => false
```

- Manual comparison

Tự tạo hàm so sánh

```javascript
function isHeroEqual(object1, object2) {
  return object1.name === object2.name;
}

const hero1 = {
  name: "Batman",
};
const hero2 = {
  name: "Batman",
};
const hero3 = {
  name: "Joker",
};

isHeroEqual(hero1, hero2); // => true
isHeroEqual(hero1, hero3); // => false
```

- Shallow equality

So sánh giá trị bên trong, chỉ so 1 level, nếu bên trong lại là object thì so theo cách _Referential equality_

```javascript
function shallowEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}
```

- Deep equality

Y như shallow equality, chỉ nếu gặp object thì thay vì so theo _Referential equality_ thì tiếp tục xem giá trị bên trong và so theo `shallow equality`

```javascript
function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

function isObject(object) {
  return object != null && typeof object === "object";
}
```

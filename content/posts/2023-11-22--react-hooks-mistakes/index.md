---
template: post
title: React hooks common mistakes
slug: "/posts/react-hooks-common-mistakes"
draft: false
date: 2023-11-22T20:48:23.046Z
description: Mistakes that developers usually make when using React hooks
socialImage: "./media/react-hook.jpg"
category: ReactJS
tags:
  - ReactJS
---

# React hooks common mistakes

You can find the source code of the examples [here](https://github.com/mtosity/react-mistake), and youtube video [here](https://www.youtube.com/playlist?list=PLyeHllfmLOZzs8xP9FbYx6R199rhGSOAy).

## #1: setState the same array / object references

```tsx
import { useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState(["Bread"]);

  return (
    <>
      <div>
        <p>{items.join(", ")}</p>
        <button
          onClick={() => {
            items.push("Egg");
            console.log(items);
            setItems(items); // This will not work, because React will not detect the change,
            // since the array is the same reference, even though the content is different
          }}
        >
          Add Egg
        </button>
      </div>
    </>
  );
}

export default App;
```

Using `setItems(sameItemsWithoutCopy)` will not work, because React will not detect the change, since the array is the same reference, even though the content is different.

To fix this, we need to create a new array with the new content, and then use `setItems(newArray)`.

```tsx
import { useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState(["Bread"]);

  return (
    <>
      <div>
        <p>{items.join(", ")}</p>
        <button
          onClick={() => {
            setItems([...items, "Egg"]); // This will work, because we are creating a new array with the same content
          }}
        >
          Add Egg
        </button>
      </div>
    </>
  );
}
```

## #2: using useEffect just to tracking unnecessary props/states changes

```tsx
import React, { useEffect, useState } from "react";

const UserAgeCalculator = ({ userInfo }) => {
  const [userAge, setUserAge] = useState(0);

  useEffect(() => {
    // Track changes in 'userInfo' prop and calculate user age
    const age = calculateAge(userInfo.birthdate);
    setUserAge(age);
  }, [userInfo]);

  return (
    <div>
      <h2>User Information</h2>
      <p>Name: {userInfo.name}</p>
      <p>Email: {userInfo.email}</p>
      <p>Age: {userAge}</p>
    </div>
  );
};
```

In this case, we are using `useEffect` just to track changes in `userInfo` prop, and then calculate the user age. This is not necessary, because we can calculate the user age directly in the component, without using `useEffect`.

```tsx
import React, { useState } from "react";

const UserAgeCalculator = ({ userInfo }) => {
  const userAge = calculateAge(userInfo.birthdate);

  return (
    <div>
      <h2>User Information</h2>
      <p>Name: {userInfo.name}</p>
      <p>Email: {userInfo.email}</p>
      <p>Age: {userAge}</p>
    </div>
  );
};
```

## #3: Not use the clean up the function inside the useEffect when necessary

```tsx
export const Example3 = () => {
  const [data, setData] = React.useState<string>("");
  const [selectValue, setSelectValue] = React.useState<string>("volvo");

  useEffect(() => {
    heavyNetworkMock.getSomethingHeavy(selectValue).then((data: string) => {
      setData(data);
    });
  }, [selectValue]);

  return (
    <div>
      <select
        name="cars"
        id="cars"
        onChange={(e) => {
          setSelectValue(e.target.value);
        }}
      >
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
      </select>

      <div>{data}</div>
    </div>
  );
};
```

In this case, we are fetching some heavy data from the network, and we are using `useEffect` to do that. But, if the user changes the select value before the data is fetched, we will have a problem, because the data will be fetched for the previous select value, and not for the current one.

To fix this, we need to use the clean up function inside the `useEffect`, to cancel the ongoing heavy data fetch.

```tsx
export const Example3 = () => {
  const [data, setData] = React.useState<string>("");
  const [selectValue, setSelectValue] = React.useState<string>("volvo");

  useEffect(() => {
    heavyNetworkMock.getSomethingHeavy(selectValue).then((data: string) => {
      setData(data);
    });

    // Include cleanup function to cancel ongoing heavy data fetch
    return () => {
      heavyNetworkMock.cancelHeavy();
    };
  }, [selectValue]);

  return (
    <div>
      <select
        name="cars"
        id="cars"
        onChange={(e) => {
          setSelectValue(e.target.value);
        }}
      >
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
      </select>

      <div>{data}</div>
    </div>
  );
};
```

## #4: use too much useStates for a form

```tsx
export const Example4 = () => {
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [selectValue, setSelectValue] = React.useState<string>("volvo");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ name, email, selectValue });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div>
        <input
          id="email"
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div>
        <select
          name="cars"
          onChange={(e) => {
            setSelectValue(e.target.value);
          }}
        >
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
```

In this case, we are using `useState` for each form field. This is not necessary, one way is to use just one `useState` for the entire form, use the useReducer hook, or use the useRef hook for getting the form values.

```tsx
export const Example4 = () => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(formRef.current ?? undefined);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div>
        <input id="name" type="text" name="name" placeholder="Name" />
      </div>
      <div>
        <input id="email" type="text" name="email" placeholder="Email" />
      </div>
      <div>
        <select name="cars">
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
```

For complex forms, you can use libraries like [Formik](https://formik.org/) or [React Hook Form](https://react-hook-form.com/).

## #5: not use the useLayoutEffect for handling initial layout shifting

```tsx
export const Example5 = () => {
  const [marginTop, setMarginTop] = useState(0);

  useEffect(() => {
    setMarginTop(100);

    return () => {
      setMarginTop(0);
    };
  }, []);

  // This artificially slows down rendering
  const now = performance.now();
  while (performance.now() - now < 100) {
    // Do nothing for a bit...
  }

  return (
    <div
      style={{
        marginTop,
        backgroundColor: "red",
      }}
    >
      Example
    </div>
  );
};
```

In this case, we are using `useEffect` to set the `marginTop` to `100` when the component is mounted. But, because `useEffect` is executed after the component is rendered, we will have a layout shift, because the `marginTop` will be `0` when the component is rendered, and then `100` after the `useEffect` is executed.

To fix this, we need to use `useLayoutEffect`, because it is executed before the component is rendered.

```tsx
export const Example5 = () => {
  const [marginTop, setMarginTop] = useState(0);

  useLayoutEffect(() => {
    setMarginTop(100);

    return () => {
      setMarginTop(0);
    };
  }, []);

  // This artificially slows down rendering
  const now = performance.now();
  while (performance.now() - now < 100) {
    // Do nothing for a bit...
  }

  return (
    <div
      style={{
        marginTop,
        backgroundColor: "red",
      }}
    >
      Example
    </div>
  );
};
```

## #6: not removing unnecessary useEffect function dependencies

```tsx
function ChatRoom() {
  const [message, setMessage] = useState("");

  const createRoom = useCallback(() => {
    // 🚩 This function is created from scratch on every re-render
    const roomId = Math.random();
    return {
      serverUrl: "url",
      roomId: roomId,
      message: "Welcome to the chat room " + roomId + "!",
    };
  }, []);

  useEffect(() => {
    const room = createRoom(); // It's used inside the Effect
    setMessage(room.message);
  }, [createRoom]); // 🚩 As a result, these dependencies are always different on a re-render

  return <div>{message}</div>;
}
```

In this case, we are using `useEffect` to create a room, and then set the message. But, because we are using `createRoom` as a dependency, the `createRoom` function will be created from scratch on every re-render, and then the `useEffect` will be executed, even though the `createRoom` function is the same.

To fix this, we need to remove the `createRoom` function from the `useEffect` dependencies.

```tsx
function ChatRoom() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const createRoom = () => {
      // 🚩 This function is created from scratch on every re-render
      const roomId = Math.random();
      return {
        serverUrl: "url",
        roomId: roomId,
        message: "Welcome to the chat room " + roomId + "!",
      };
    };

    const room = createRoom(); // It's used inside the Effect
    setMessage(room.message);
  }, []); // 🚩 As a result, these dependencies are always different on a re-render

  return <div>{message}</div>;
}
```

Or use the useCallback hook to memoize the `createRoom` function.

```tsx
function ChatRoom() {
  const [message, setMessage] = useState("");

  const createRoom = useCallback(() => {
    // 🚩 This function is created from scratch on every re-render
    const roomId = Math.random();
    return {
      serverUrl: "url",
      roomId: roomId,
      message: "Welcome to the chat room " + roomId + "!",
    };
  }, []);

  useEffect(() => {
    const room = createRoom(); // It's used inside the Effect
    setMessage(room.message);
  }, [createRoom]); // 🚩 As a result, these dependencies are always different on a re-render

  return <div>{message}</div>;
}
```

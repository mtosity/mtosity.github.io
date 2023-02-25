---
template: post
title: Đi sâu vào những cách quản lý state trong React (Redux vs. Context vs. State)
slug: "/posts/di-sau-vao-nhung-cach-quan-ly-state-trong-react"
draft: true
date: 2020-10-02T12:31:52.324Z
description: >
  An in-depth look at state management in React. Translated from Denny Scott
  Medium articles
category: ReactJS
tags:
  - ReactJS
---

> Original post from [Denny Scott / Redux vs. Context vs. State](https://medium.com/better-programming/redux-vs-context-vs-state-4202be6d3e54)

Khoảng những năm gần đây, bức tranh của việc quản lý state trong React thay đổi không ngừng

Sự làm lại của **context** làm cảm thấy dễ và hợp lý khi sử dụng. Với sự xuất hiện của **React Hooks**, có vẻ như _functional states_ và **useReducer** có vẻ như đã thay thế **Redux**. Nhưng không để bị bỏ lại, **React-Redux** tham gia vào hội _Hooks hype train_ và giới thiệu các mới để thực hiện _states collection_ và _dispatching_. Nhưng những thứ này liệu còn cần thiết?

Bất chấp việc cộng đồng đang "cách ly" _Reudx_, hoặc nói chung là những thư viện quản lý **state**, nhưng đáp án không đơn giản như thế. Chúng ta cần biết được những _architecture_ có thể có trong app, sau đó tìm hiểu xem những _tools_ nào có thể hỗ trợ hay làm trật đường ray khi sử dụng :D.

Trước khi đi tiếp hãy xem lại những câu hỏi đơn giản để có thể quyết định đúng đắn:

- Cớ những _state management philosophies_ nào? (lý thuyết và những ý tưởng để hiểu về việc quản lý state)
- Những phong cách quản lý **state** nào được đề cập?
- Sự khác nhau về nền tảng trong các chức năng? Mọi người hay nói cái này sẽ thay thế cái kia. Nhưng có có thể thực sự đúng khi ta nhìn _behind the scenes_?
- Những _tools_ này dùng để làm gì? Nhưng không thể tránh khỏi câu trả lời là "tuỳ". Nhưng hãy thử đưa ra những ví dụ sắt đáng để chọn thằng này so với thằng kia.

Trả lời những câu hỏi này sẽ giúp bạn có được nền vững chắc để đi tiếp. Như mọi người thường nói:

> a bad workman always blames his tools

OK, let's go

# State Management Philosophies

Để nói về những thứ trend hôm nay, trước tiên chúng ta hãy đi theo dòng thời gian của **React state management**

T sẽ bắt đầu từ **Flux architecture**. Đối với đa số, thì **Flux architecture** là điểm then chốt để chuyển sang những _framework_ khác.

T nhớ ngày đầu bắt đầu đi làm _front end_ được giao cho một project mới. Viết được vài tháng sử dụng **Angular 1** thì thấy [video đầu tiên về flux](https://facebook.github.io/flux/docs/in-depth-overview), tuần đó T viết lại project sang **React**. Thời đó chả ai care về _jsx_, nhưng nhìn thấy _flow_ của _flux_, mọi thứ trở nên rõ ràng.

Không lâu sau đó, xuất hiện **Redux**, T cũng theo Redux lun. Có rất nhiều cách để sử dụng **Redux** - không có rõ một _pattern_ hợp lý. Nhưng dưới là một số cách mà đa số mọi người sử dụng.

# The Store-Owns-All Era

(store chứa tất cả)

**Redux** cho người sử dụng một **store** trung tâm để lưu tất cả các state, chỉ có thể truy cập bằng kiến trúc **flux**. Yuh, nó lưu tất cả. Những năm đầu tiên nó ra đời, lưu tất cả các _state_ trong **store** có vẻ là điều bình thường, bất kể nó là _state_ gì.

Để phù hợp với kiểu quản lý **state** này thì những app đều được xây dựng dựa trên ý tưởng _dumb components_ và _smart components/containers_. _Dumb components_ không có **state** gì cả chỉ dùng để hiển thị view, sẽ có nhiều như vậy và _containers_ sẽ là nơi để lấy data.

Không lâu thì **stores** thành một mớ data hỗn lộn không thể nào theo dõi và phải hiểu sâu _codebase_ để có thể hiểu được tất cả những huần hòe gì chứa trong **stores**. Và cái này nữa, khái niệm _dumb/smart components_ có lẽ đã bị lạm dụng - rất nhiều _codebase_ chỉ có 1 container, và phải truyền props như "khoan lỗ xuống lõi trái đất".

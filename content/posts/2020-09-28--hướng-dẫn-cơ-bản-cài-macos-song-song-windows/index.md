---
template: post
title: "Hướng dẫn CƠ BẢN cài macOS song song windows "
slug: "/posts/huong-dan-co-ban-cai-macos-song-song-windows"
draft: false
date: 2020-09-28T12:05:38.432Z
description: Hướng dẫn CƠ BẢN cài macOS song song windows, plz chỉ cơ bản
socialImage: "./media/screen-shot-2020-09-28-at-23.51.18.png"
category: Computer
tags:
  - Computer
  - Hackintosh
---

# Table of content

[Note](#note)

[Tìm xem có EFI sẵn cho máy không](#tìm-xem-có-efi-sẵn-cho-máy-mình-không)

[Tạo phân vùng để cài](#tạo-phân-vùng-để-cài)

[Tạo USB boot](#tạo-usb-boot)

[Chỉnh BIOS](#chỉnh-bios)

[Cài đặt](#cài-đặt)

[Sau cài đặt](#sau-cài-đặt)

# Note

> **Alert**: Bạn nên đã có kinh nghiệm cài win / linux (như cách tạo phân vùng, cách vào bios, boot manager) và debug :v để tiếp tục. Cách này chỉ dành cho máy đã có người build sẵn EFI (là thư mục / phân vùng boot macos có chứa driver và patch) và từ đó fix từ từ cho hoàn chỉnh. Tự build EFI cũng được nhưng phải thuộc dạng supper man... Nếu muốn làm supper man thì [OpenCore Offical Guide](https://dortania.github.io/OpenCore-Install-Guide/prerequisites.html) hoặc [ThinkView OpenCore Guide](https://www.youtube.com/watch?v=-sPxVz9DkzY&t=405s) là sự khởi đầu
>
> **Lưu ý**: PHẢI có một phân vùng dành riêng để cài macos, trên windows dùng Disk Management để shink và tạo vùng mới, không được đụng gì tới phân vùng windows hay dữ liệu. Tốt nhất cứ backup dữ liệu trước nhé!
>
> **Lưu ý 2:** Nên có bàn phím + chuột trong lúc cài (vì có thể không nhận của laptop lúc boot vào usb)
>
> **Lưu ý 3**: Các máy laptop thường là Wifi Intel, muốn cài có combo driver [itlwm](https://github.com/OpenIntelWireless/itlwm) + [heliport](https://github.com/OpenIntelWireless/HeliPort) nhưng đang trong beta, thường support nhiều cho card wifi broadcom nên chuẩn bị tinh thần wifi có thể không chạy. Trừ khi bạn cài thành công itlwm hay mua card wifi broadcom. _Mình thì mua luôn một card wifi 300k trên shoppe_, nhớ nhờ tư vấn nhé. Ethernet thì mostly work.
>
> Có một số dịch vụ cài đặt macos ở hcm nhưng mình chưa test nhá, nổi tiếng thì có [VNO](https://vnohackintosh.com/).
>
> Group [facebook](https://www.facebook.com/groups/vnohackintosh) để hỏi, cũng khá active. Xem trước một số bài viết + video rồi hãy bắt tay vào làm, một số link
>
> <https://hackintosh.vn/hackintosh-guide>
>
> <https://vnohackintosh.com/blog/>
>
> <https://www.youtube.com/watch?v=4NvLLaQiDOo>
>
> <https://www.youtube.com/watch?v=Mx151kKaJt0>
>
> Luôn tra google, xem nhiều nguồn, chỉ xem bài mình như là một nguồn thông tin và tất nhiên, do it with your own risk

# Tìm xem có EFI sẵn cho máy mình không

Lên github và gõ dòng máy + các từ khoá:

- `EFI`
- Phiên bản macos (`sierra`, `high sierra`, `mojave`, `catalina`)
- `hackintosh` (cách gọi macos cho máy không phải của apple)
- [Clover](https://hackintosh.gitbook.io/-r-hackintosh-vanilla-desktop-guide/clover-setup) / [OpenCore](https://dortania.github.io/OpenCore-Install-Guide/prerequisites.html) (2 phiên bản boot của hackintosh)

Nhớ để ý xem last commit là khi nào (dưới 1 năm cũng tốt r), phiên bản macos nào (nên sierra trở lên), đúng dòng cpu của máy hay không

Note nhiều nhiều EFI vào vì chưa chắc một cái sẽ work liền vì còn nhiều yếu tố làm khác mẫu máy như cấu hình năm sản xuất, nước nhập khuẩu, ở dưới là một repo mình chọn

![](/media/screen-shot-2020-09-28-at-22.25.37.png)

Nếu không tìm được EFI nào thì... gg, chịu! Hoặc lên trên làm supper man tự tạo EFI cho mình...

# Tạo phân vùng để cài

Sử dụng Disk Management của windows 10 để tạo, [hướng dẫn](https://www.easeus.com/partition-master/partition-windows-10-free.html). Cơ bản shrink một phân vùng nào đó rồi tạo phân vùng mới.

# Tạo USB boot

Vào [olarila images](https://www.olarila.com/topic/6278-new-vanilla-olarila-images/) tải đúng phiên bản macos phù hợp với EFI đã chọn bên trên. Những images này đều rất clean trong giới hackintosh :v

Fix lỗi [Sorry, you can't view or download this file at this time](https://www.games4theworld.club/t33497-how-to-bypass-googledrive-s-too-many-users-have-viewed-or-downloaded-this-file-recently-updated-on-05-04-2020) của google drive để tải

Xong tải [etcher](https://www.balena.io/etcher/) để tạo usb boot

# Chỉnh BIOS

Vào BIOS chỉnh một số thứ trong hướng dẫn [này](https://vnohackintosh.com/blog/2019/04/21/setup-bios-cho-hackintosh/), những tinh chỉnh này không ảnh hưởng đến windows

# Cài đặt

Restart và vào boot manager chọn boot vào usb đã tạo, khi vào sẽ giống như vầy hoặc na ná

![](/media/screen-shot-2020-09-28-at-22.25.05.png)

Nếu cài trên laptop thì vào răng cưa setting -> config và chọn config2 (config cho laptop)

Xong chọn Boot macOS Install from install macOS catalina / mojave..., sau boot vào installer thì nó hiện lên mac Utilities như vầy:

![](/media/screen-shot-2020-09-28-at-22.33.15.png)

Sau đó làm theo video [này](https://www.youtube.com/watch?v=Mx151kKaJt0), bắt đầu ở phút 19:00 đến 28:40 trừ cái bước copy EFI ra. Nếu không nhận phím laptop thì cắm bàn phím rời vào

Tóm tắt các bước:

- Earse cái PHÂN VÙNG RỖNG đã chuẩn bị sang format của macos như video

![](/media/screen-shot-2020-09-29-at-10.37.32.png)

- Chọn Install macos (fix date như video nếu bị lỗi), chọn phân vùng cài đặt và cài thui :D

![](/media/screen-shot-2020-09-29-at-10.38.36.png)

- Reboot lại vào usb, chọn ổ mới vừa cài và chờ đợi cài part 2

![](/media/screen-shot-2020-09-29-at-10.39.07.png)

- Điền info như video next next tới khi vào được mac :D

![](/media/screen-shot-2020-09-29-at-10.39.39.png)

- Hiện đã vào được mac, nhưng hiện đang sử dụng USB như mồi boot, để vào được macOS để không cần USB vẫn vào được thì copy folder EFI: ở bước này lấy những folder EFI đã sưu tầm được ở bước 1 (trong video là EFI của usb) cóp vào EFI của ổ cứng

![](/media/screen-shot-2020-09-29-at-10.40.19.png)

- Shutdown, bỏ usb ra, boot lại mà vẫn vào được Mac là thành công. Nếu không boot vào được thì lấy usb làm mồi boot vào lại mac, copy folder EFI khác, debug google trên mạng, blaba,...

# Sau cài đặt

Kiểm tra xem chạy OK hay không (bàn phím, touchpad, usb,...) và nếu muốn fix gì thì... tra google sửa mà thôi :>, nhất là phần wifi, đa phần phải thay bằng card broadcom tương ứng hoặc tìm hiểu cài [itlwm](https://github.com/OpenIntelWireless/itlwm) + [heliport](https://github.com/OpenIntelWireless/HeliPort).

Tới đây là tuỳ máy, tuỳ độ hên lấy được EFI ngon hay không hay trình google và debug đủ để fix được lỗi hay không :D, không thì vào các group facebook, forum để hỏi và tra.

Một chút động lực (Thinkpad T480):

![](/media/screen-shot-2020-09-28-at-23.51.18.png)

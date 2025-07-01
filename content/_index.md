---
# 将主页标题留空以使用网站标题
title: ""
date: 2022-10-24
type: landing

design:
  # 默认章节间距
  spacing: "6rem"

sections:
  - block: resume-biography-3
    content:
      # 选择要显示的用户资料（`content/authors/`内的文件夹名称）
      username: admin
      text: ""
      # Show a call-to-action button under your biography? (optional)
      # button:
      #   text: Download CV
      #   url: uploads/resume.pdf
    design:
      css_class: light
      background:
        color: light
        # image:
        #   # 将您的图片背景添加到 `assets/media/` 目录下。
        #   filename: stacked-peaks.svg
        #   filters:
        #     brightness: 1.0
        #   size: cover
        #   position: center
        #   parallax: false
  - block: collection
    content:
      title: Recent Publications
      text: ""
      filters:
        folders:
          - publications
        exclude_featured: false
    design:
      view: citation
---

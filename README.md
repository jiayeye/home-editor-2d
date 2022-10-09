# home-editor-2d
户型编辑框架，使用pixi渲染，带有undo、redo功能

使用方法：

1.npm install  注意package.json内依赖库版本要锁定当前，否则build报错

2.npm run build 生成dist文件

3.npm run gulp 生成index.html依赖的home-editor-2d.js文件，注意node需要低版本比如11.15.0，否则报错

4.python -m http.server 9000
